import { Types } from "mongoose";
import { connectDb } from "@/lib/db";
import {
  jsonError,
  jsonOk,
  parseJsonBody,
  requireAdminSession,
} from "@/lib/api";
import { revalidateTestimonials } from "@/lib/revalidate";
import { sanitizePlainText } from "@/lib/sanitize";
import { testimonialUpdateSchema } from "@/lib/validations";
import { Testimonial } from "@/models";

type RouteContext = { params: Promise<{ id: string }> };

export async function PUT(request: Request, context: RouteContext) {
  const auth = await requireAdminSession();
  if ("response" in auth) return auth.response;

  const { id } = await context.params;
  if (!Types.ObjectId.isValid(id)) {
    return jsonError("Invalid testimonial id", 400);
  }

  const parsed = await parseJsonBody(request, testimonialUpdateSchema);
  if ("response" in parsed) return parsed.response;

  const updates = { ...parsed.data };
  if (updates.customerName) {
    updates.customerName = sanitizePlainText(updates.customerName);
  }
  if (updates.reviewText) {
    updates.reviewText = sanitizePlainText(updates.reviewText);
  }
  if (updates.service) {
    updates.service = sanitizePlainText(updates.service);
  }
  if (updates.location) {
    updates.location = sanitizePlainText(updates.location);
  }

  await connectDb();
  const testimonial = await Testimonial.findByIdAndUpdate(
    id,
    { $set: updates },
    { new: true },
  ).lean();

  if (!testimonial) return jsonError("Testimonial not found", 404);
  revalidateTestimonials();
  return jsonOk({ testimonial });
}

export async function DELETE(_request: Request, context: RouteContext) {
  const auth = await requireAdminSession();
  if ("response" in auth) return auth.response;

  const { id } = await context.params;
  if (!Types.ObjectId.isValid(id)) {
    return jsonError("Invalid testimonial id", 400);
  }

  await connectDb();
  const testimonial = await Testimonial.findByIdAndDelete(id).lean();
  if (!testimonial) return jsonError("Testimonial not found", 404);

  revalidateTestimonials();
  return jsonOk({ ok: true });
}
