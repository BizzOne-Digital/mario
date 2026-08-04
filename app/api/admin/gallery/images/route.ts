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
import { galleryImageSchema } from "@/lib/validations";
import { GalleryCategory, GalleryImage } from "@/models";

export async function GET(request: Request) {
  const auth = await requireAdminSession();
  if ("response" in auth) return auth.response;

  const url = new URL(request.url);
  const categoryId = url.searchParams.get("categoryId");

  await connectDb();
  const filter =
    categoryId && Types.ObjectId.isValid(categoryId)
      ? { categoryId: toObjectId(categoryId) }
      : {};

  const images = await GalleryImage.find(filter)
    .sort({ order: 1, createdAt: -1 })
    .lean();
  return jsonOk({ images });
}

export async function POST(request: Request) {
  const auth = await requireAdminSession();
  if ("response" in auth) return auth.response;

  const parsed = await parseJsonBody(request, galleryImageSchema);
  if ("response" in parsed) return parsed.response;

  if (!Types.ObjectId.isValid(parsed.data.categoryId)) {
    return jsonError("Invalid categoryId", 400);
  }

  await connectDb();
  const categoryObjectId = toObjectId(parsed.data.categoryId);
  const category = await GalleryCategory.exists({
    _id: categoryObjectId,
  });
  if (!category) return jsonError("Category not found", 404);

  const image = await GalleryImage.create({
    ...parsed.data,
    categoryId: categoryObjectId,
  });
  revalidateGallery();
  return jsonOk({ image }, 201);
}
