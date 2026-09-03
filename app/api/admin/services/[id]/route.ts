import slugify from "slugify";
import { Types } from "mongoose";
import { connectDb } from "@/lib/db";
import {
  jsonError,
  jsonOk,
  parseJsonBody,
  requireAdminSession,
  toObjectId,
  uniqueSlug,
} from "@/lib/api";
import { revalidateService, revalidateServices } from "@/lib/revalidate";
import { serviceUpdateSchema } from "@/lib/validations";
import { Service } from "@/models";

type RouteContext = { params: Promise<{ id: string }> };

export async function GET(_request: Request, context: RouteContext) {
  const auth = await requireAdminSession();
  if ("response" in auth) return auth.response;

  const { id } = await context.params;
  if (!Types.ObjectId.isValid(id)) {
    return jsonError("Invalid service id", 400);
  }

  await connectDb();
  const service = await Service.findById(id).lean();
  if (!service) return jsonError("Service not found", 404);
  return jsonOk({ service });
}

export async function PUT(request: Request, context: RouteContext) {
  const auth = await requireAdminSession();
  if ("response" in auth) return auth.response;

  const { id } = await context.params;
  if (!Types.ObjectId.isValid(id)) {
    return jsonError("Invalid service id", 400);
  }

  const parsed = await parseJsonBody(request, serviceUpdateSchema);
  if ("response" in parsed) return parsed.response;

  await connectDb();

  if (parsed.data.slug) {
    const conflict = await Service.exists({
      slug: parsed.data.slug,
      _id: { $ne: toObjectId(id) },
    });
    if (conflict) {
      return jsonError("Slug already in use", 409);
    }
  }

  const service = await Service.findByIdAndUpdate(
    id,
    { $set: parsed.data },
    { new: true },
  ).lean();

  if (!service) return jsonError("Service not found", 404);

  revalidateService(service.slug);
  return jsonOk({ service });
}

export async function DELETE(_request: Request, context: RouteContext) {
  const auth = await requireAdminSession();
  if ("response" in auth) return auth.response;

  const { id } = await context.params;
  if (!Types.ObjectId.isValid(id)) {
    return jsonError("Invalid service id", 400);
  }

  await connectDb();
  const service = await Service.findByIdAndDelete(id).lean();
  if (!service) return jsonError("Service not found", 404);

  revalidateService(service.slug);
  return jsonOk({ ok: true });
}

export async function POST(request: Request, context: RouteContext) {
  const auth = await requireAdminSession();
  if ("response" in auth) return auth.response;

  const { id } = await context.params;
  const url = new URL(request.url);
  const action = url.searchParams.get("action");

  if (action !== "duplicate") {
    return jsonError("Unsupported action", 400);
  }

  if (!Types.ObjectId.isValid(id)) {
    return jsonError("Invalid service id", 400);
  }

  await connectDb();
  const source = await Service.findById(id).lean();
  if (!source) return jsonError("Service not found", 404);

  const { _id: _ignored, createdAt: _c, updatedAt: _u, ...rest } = source;
  void _ignored;
  void _c;
  void _u;

  let bodyName: string | undefined;
  try {
    const body = (await request.json()) as { name?: string; slug?: string };
    bodyName = body.name;
  } catch {
    bodyName = undefined;
  }

  const name = bodyName?.trim() || `${source.name} (Copy)`;
  const baseSlug = slugify(name, { lower: true, strict: true });
  let slug = uniqueSlug(baseSlug);
  let attempt = 0;
  while (await Service.exists({ slug })) {
    attempt += 1;
    slug = uniqueSlug(baseSlug, String(attempt));
  }

  const duplicate = await Service.create({
    ...rest,
    name,
    slug,
    published: false,
    featured: false,
  });

  revalidateServices();
  return jsonOk({ service: duplicate }, 201);
}
