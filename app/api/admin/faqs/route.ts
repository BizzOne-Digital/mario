import { connectDb } from "@/lib/db";
import {
  jsonOk,
  parseJsonBody,
  requireAdminSession,
} from "@/lib/api";
import { revalidateFaq } from "@/lib/revalidate";
import { sanitizePlainText, sanitizeRichText } from "@/lib/sanitize";
import { faqSchema } from "@/lib/validations";
import { FAQ } from "@/models";

export async function GET() {
  const auth = await requireAdminSession();
  if ("response" in auth) return auth.response;

  await connectDb();
  const faqs = await FAQ.find().sort({ order: 1, createdAt: -1 }).lean();
  return jsonOk({ faqs });
}

export async function POST(request: Request) {
  const auth = await requireAdminSession();
  if ("response" in auth) return auth.response;

  const parsed = await parseJsonBody(request, faqSchema);
  if ("response" in parsed) return parsed.response;

  await connectDb();
  const faq = await FAQ.create({
    ...parsed.data,
    question: sanitizePlainText(parsed.data.question),
    answer: sanitizeRichText(parsed.data.answer),
  });

  revalidateFaq();
  return jsonOk({ faq }, 201);
}
