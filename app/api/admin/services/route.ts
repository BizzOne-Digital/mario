import slugify from "slugify";
import { connectDb } from "@/lib/db";
import {
  jsonError,
  jsonOk,
  parseJsonBody,
  requireAdminSession,
  uniqueSlug,
} from "@/lib/api";
import { revalidateServices } from "@/lib/revalidate";
import { serviceCreateSchema } from "@/lib/validations";
import { Service } from "@/models";

export async function GET() {
  const auth = await requireAdminSession();
  if ("response" in auth) return auth.response;

  await connectDb();
  const services = await Service.find().sort({ displayOrder: 1, name: 1 }).lean();
  return jsonOk({ services });
}

export async function POST(request: Request) {
  const auth = await requireAdminSession();
  if ("response" in auth) return auth.response;

  const parsed = await parseJsonBody(request, serviceCreateSchema);
  if ("response" in parsed) return parsed.response;

  await connectDb();

  const baseSlug =
    parsed.data.slug?.trim() ||
    slugify(parsed.data.name, { lower: true, strict: true });
  let slug = uniqueSlug(baseSlug);
  let attempt = 0;
  while (await Service.exists({ slug })) {
    attempt += 1;
    slug = uniqueSlug(baseSlug, String(attempt));
  }

  try {
    const service = await Service.create({ ...parsed.data, slug });
    revalidateServices();
    return jsonOk({ service }, 201);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Could not create service";
    return jsonError(message, 400);
  }
}
