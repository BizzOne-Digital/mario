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
import { galleryImageUpdateSchema } from "@/lib/validations";
import { GalleryCategory, GalleryImage } from "@/models";

type RouteContext = { params: Promise<{ id: string }> };

export async function PUT(request: Request, context: RouteContext) {
  const auth = await requireAdminSession();
  if ("response" in auth) return auth.response;

  const { id } = await context.params;
  if (!Types.ObjectId.isValid(id)) {
    return jsonError("Invalid image id", 400);
  }

  const parsed = await parseJsonBody(request, galleryImageUpdateSchema);
  if ("response" in parsed) return parsed.response;

  if (parsed.data.categoryId && !Types.ObjectId.isValid(parsed.data.categoryId)) {
    return jsonError("Invalid categoryId", 400);
  }

  await connectDb();

  const updates: Record<string, unknown> = { ...parsed.data };
  if (parsed.data.categoryId) {
    const categoryObjectId = toObjectId(parsed.data.categoryId);
    const category = await GalleryCategory.exists({
      _id: categoryObjectId,
    });
    if (!category) return jsonError("Category not found", 404);
    updates.categoryId = categoryObjectId;
  }

  const image = await GalleryImage.findByIdAndUpdate(
    id,
    { $set: updates },
    { new: true },
  ).lean();

  if (!image) return jsonError("Image not found", 404);
  revalidateGallery();
  return jsonOk({ image });
}

export async function DELETE(_request: Request, context: RouteContext) {
  const auth = await requireAdminSession();
  if ("response" in auth) return auth.response;

  const { id } = await context.params;
  if (!Types.ObjectId.isValid(id)) {
    return jsonError("Invalid image id", 400);
  }

  await connectDb();
  const image = await GalleryImage.findByIdAndDelete(id).lean();
  if (!image) return jsonError("Image not found", 404);

  revalidateGallery();
  return jsonOk({ ok: true });
}
