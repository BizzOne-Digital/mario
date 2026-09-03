import slugify from "slugify";
import { connectDb } from "@/lib/db";
import {
  jsonError,
  jsonOk,
  parseJsonBody,
  requireAdminSession,
  uniqueSlug,
} from "@/lib/api";
import { revalidateGallery } from "@/lib/revalidate";
import { galleryCategorySchema } from "@/lib/validations";
import { GalleryCategory } from "@/models";

export async function GET() {
  const auth = await requireAdminSession();
  if ("response" in auth) return auth.response;

  await connectDb();
  const categories = await GalleryCategory.find()
    .sort({ order: 1, name: 1 })
    .lean();
  return jsonOk({ categories });
}

export async function POST(request: Request) {
  const auth = await requireAdminSession();
  if ("response" in auth) return auth.response;

  const parsed = await parseJsonBody(request, galleryCategorySchema);
  if ("response" in parsed) return parsed.response;

  await connectDb();

  const baseSlug =
    parsed.data.slug?.trim() ||
    slugify(parsed.data.name, { lower: true, strict: true });
  let slug = uniqueSlug(baseSlug);
  let attempt = 0;
  while (await GalleryCategory.exists({ slug })) {
    attempt += 1;
    slug = uniqueSlug(baseSlug, String(attempt));
  }

  try {
    const category = await GalleryCategory.create({
      ...parsed.data,
      slug,
    });
    revalidateGallery();
    return jsonOk({ category }, 201);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Could not create category";
    return jsonError(message, 400);
  }
}
