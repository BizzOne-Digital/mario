import { Types } from "mongoose";
import { connectDb } from "@/lib/db";
import {
  jsonError,
  jsonOk,
  parseJsonBody,
  requireAdminSession,
  toObjectId,
} from "@/lib/api";
import { revalidateGallery } from "@/lib/revalidate";
import { galleryCategoryUpdateSchema } from "@/lib/validations";
import { GalleryCategory, GalleryImage } from "@/models";

type RouteContext = { params: Promise<{ id: string }> };

export async function PUT(request: Request, context: RouteContext) {
  const auth = await requireAdminSession();
  if ("response" in auth) return auth.response;

  const { id } = await context.params;
  if (!Types.ObjectId.isValid(id)) {
    return jsonError("Invalid category id", 400);
  }

  const parsed = await parseJsonBody(request, galleryCategoryUpdateSchema);
  if ("response" in parsed) return parsed.response;

  await connectDb();

  if (parsed.data.slug) {
    const conflict = await GalleryCategory.exists({
      slug: parsed.data.slug,
      _id: { $ne: toObjectId(id) },
    });
    if (conflict) return jsonError("Slug already in use", 409);
  }

  const category = await GalleryCategory.findByIdAndUpdate(
    id,
    { $set: parsed.data },
    { new: true },
  ).lean();

  if (!category) return jsonError("Category not found", 404);
  revalidateGallery();
  return jsonOk({ category });
}

export async function DELETE(_request: Request, context: RouteContext) {
  const auth = await requireAdminSession();
  if ("response" in auth) return auth.response;

  const { id } = await context.params;
  if (!Types.ObjectId.isValid(id)) {
    return jsonError("Invalid category id", 400);
  }

  await connectDb();
  const inUse = await GalleryImage.exists({ categoryId: id });
  if (inUse) {
    return jsonError("Category has images; move or delete them first", 409);
  }

  const category = await GalleryCategory.findByIdAndDelete(id).lean();
  if (!category) return jsonError("Category not found", 404);

  revalidateGallery();
  return jsonOk({ ok: true });
}
