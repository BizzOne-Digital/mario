import { Types } from "mongoose";
import { connectDb } from "@/lib/db";
import {
  jsonError,
  jsonOk,
  parseJsonBody,
  requireAdminSession,
  toObjectId,
} from "@/lib/api";
import { revalidateBlog, revalidateBlogPost } from "@/lib/revalidate";
import { sanitizeRichText } from "@/lib/sanitize";
import { blogUpdateSchema } from "@/lib/validations";
import { BlogPost } from "@/models";

type RouteContext = { params: Promise<{ id: string }> };

export async function PUT(request: Request, context: RouteContext) {
  const auth = await requireAdminSession();
  if ("response" in auth) return auth.response;

  const { id } = await context.params;
  if (!Types.ObjectId.isValid(id)) {
    return jsonError("Invalid blog id", 400);
  }

  const parsed = await parseJsonBody(request, blogUpdateSchema);
  if ("response" in parsed) return parsed.response;

  await connectDb();

  if (parsed.data.slug) {
    const conflict = await BlogPost.exists({
      slug: parsed.data.slug,
      _id: { $ne: toObjectId(id) },
    });
    if (conflict) return jsonError("Slug already in use", 409);
  }

  const updates = { ...parsed.data };
  if (updates.content) {
    updates.content = sanitizeRichText(updates.content);
  }

  const blog = await BlogPost.findByIdAndUpdate(
    id,
    { $set: updates },
    { new: true },
  ).lean();

  if (!blog) return jsonError("Blog post not found", 404);

  revalidateBlogPost(blog.slug);
  return jsonOk({ blog });
}

export async function DELETE(_request: Request, context: RouteContext) {
  const auth = await requireAdminSession();
  if ("response" in auth) return auth.response;

  const { id } = await context.params;
  if (!Types.ObjectId.isValid(id)) {
    return jsonError("Invalid blog id", 400);
  }

  await connectDb();
  const blog = await BlogPost.findByIdAndDelete(id).lean();
  if (!blog) return jsonError("Blog post not found", 404);

  revalidateBlogPost(blog.slug);
  revalidateBlog();
  return jsonOk({ ok: true });
}
