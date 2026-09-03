import { Types } from "mongoose";
import { connectDb } from "@/lib/db";
import {
  jsonError,
  jsonOk,
  parseJsonBody,
  requireAdminSession,
} from "@/lib/api";
import { revalidateFaq } from "@/lib/revalidate";
import { sanitizePlainText, sanitizeRichText } from "@/lib/sanitize";
import { faqUpdateSchema } from "@/lib/validations";
import { FAQ } from "@/models";

type RouteContext = { params: Promise<{ id: string }> };

export async function PUT(request: Request, context: RouteContext) {
  const auth = await requireAdminSession();
  if ("response" in auth) return auth.response;

  const { id } = await context.params;
  if (!Types.ObjectId.isValid(id)) {
    return jsonError("Invalid FAQ id", 400);
  }

  const parsed = await parseJsonBody(request, faqUpdateSchema);
  if ("response" in parsed) return parsed.response;

  const updates = { ...parsed.data };
  if (updates.question) {
    updates.question = sanitizePlainText(updates.question);
  }
  if (updates.answer) {
    updates.answer = sanitizeRichText(updates.answer);
  }

  await connectDb();
  const faq = await FAQ.findByIdAndUpdate(
    id,
    { $set: updates },
    { new: true },
  ).lean();

  if (!faq) return jsonError("FAQ not found", 404);
  revalidateFaq();
  return jsonOk({ faq });
}

export async function DELETE(_request: Request, context: RouteContext) {
  const auth = await requireAdminSession();
  if ("response" in auth) return auth.response;

  const { id } = await context.params;
  if (!Types.ObjectId.isValid(id)) {
    return jsonError("Invalid FAQ id", 400);
  }

  await connectDb();
  const faq = await FAQ.findByIdAndDelete(id).lean();
  if (!faq) return jsonError("FAQ not found", 404);

  revalidateFaq();
  return jsonOk({ ok: true });
}
