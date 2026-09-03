import { connectDb } from "@/lib/db";
import {
  jsonOk,
  parseJsonBody,
  requireAdminSession,
} from "@/lib/api";
import { revalidateTestimonials } from "@/lib/revalidate";
import { sanitizePlainText } from "@/lib/sanitize";
import { testimonialSchema } from "@/lib/validations";
import { Testimonial } from "@/models";

export async function GET() {
  const auth = await requireAdminSession();
  if ("response" in auth) return auth.response;

  await connectDb();
  const testimonials = await Testimonial.find()
    .sort({ displayOrder: 1, createdAt: -1 })
    .lean();
  return jsonOk({ testimonials });
}

export async function POST(request: Request) {
  const auth = await requireAdminSession();
  if ("response" in auth) return auth.response;

  const parsed = await parseJsonBody(request, testimonialSchema);
  if ("response" in parsed) return parsed.response;

  await connectDb();
  const testimonial = await Testimonial.create({
    ...parsed.data,
    customerName: sanitizePlainText(parsed.data.customerName),
    reviewText: sanitizePlainText(parsed.data.reviewText),
    service: sanitizePlainText(parsed.data.service),
    location: sanitizePlainText(parsed.data.location),
  });

  revalidateTestimonials();
  return jsonOk({ testimonial }, 201);
}
