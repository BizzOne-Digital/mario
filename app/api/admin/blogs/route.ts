import slugify from "slugify";
import { connectDb } from "@/lib/db";
import {
  jsonError,
  jsonOk,
  parseJsonBody,
  requireAdminSession,
  uniqueSlug,
} from "@/lib/api";
import { revalidateBlog } from "@/lib/revalidate";
import { sanitizeRichText } from "@/lib/sanitize";
import { blogCreateSchema } from "@/lib/validations";
import { BlogPost } from "@/models";

export async function GET() {
  const auth = await requireAdminSession();
  if ("response" in auth) return auth.response;

  await connectDb();
  const blogs = await BlogPost.find().sort({ createdAt: -1 }).lean();
  return jsonOk({ blogs });
}

export async function POST(request: Request) {
  const auth = await requireAdminSession();
  if ("response" in auth) return auth.response;

  const parsed = await parseJsonBody(request, blogCreateSchema);
  if ("response" in parsed) return parsed.response;

  await connectDb();

  const baseSlug =
    parsed.data.slug?.trim() ||
    slugify(parsed.data.title, { lower: true, strict: true });
  let slug = uniqueSlug(baseSlug);
  let attempt = 0;
  while (await BlogPost.exists({ slug })) {
    attempt += 1;
    slug = uniqueSlug(baseSlug, String(attempt));
  }

  try {
    const blog = await BlogPost.create({
      ...parsed.data,
      slug,
      content: sanitizeRichText(parsed.data.content),
    });
    revalidateBlog();
    return jsonOk({ blog }, 201);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Could not create blog post";
    return jsonError(message, 400);
  }
}
