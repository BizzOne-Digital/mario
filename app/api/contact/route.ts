import { connectDb } from "@/lib/db";
import { ensureBusinessEmailSettings } from "@/lib/data";
import {
  getClientIp,
  jsonError,
  jsonOk,
  parseJsonBody,
} from "@/lib/api";
import {
  contactSubmissionErrorMessage,
  getLeadRecipient,
  notifyContactInquiry,
  sendContactConfirmationEmail,
  tryContactEmailFallback,
  type ContactInquiryFields,
} from "@/lib/lead-notifications";
import { rateLimit } from "@/lib/rate-limit";
import { sanitizePlainText } from "@/lib/sanitize";
import { contactSchema } from "@/lib/validations";
import { Inquiry } from "@/models";

function toInquiryFields(fields: {
  fullName: string;
  email: string;
  phone: string;
  service: string;
  propertyType: string;
  location: string;
  preferredMethod: string;
  preferredDate?: string;
  message: string;
}): ContactInquiryFields {
  return {
    fullName: sanitizePlainText(fields.fullName),
    email: fields.email.toLowerCase(),
    phone: sanitizePlainText(fields.phone),
    service: sanitizePlainText(fields.service),
    propertyType: sanitizePlainText(fields.propertyType),
    location: sanitizePlainText(fields.location),
    preferredMethod: sanitizePlainText(fields.preferredMethod),
    preferredDate: sanitizePlainText(fields.preferredDate || ""),
    message: sanitizePlainText(fields.message),
  };
}

export async function POST(request: Request) {
  const limited = rateLimit(`contact:${getClientIp(request)}`, 5, 60_000);
  if (!limited.allowed) {
    return jsonError("Too many requests. Please try again shortly.", 429);
  }

  const parsed = await parseJsonBody(request, contactSchema);
  if ("response" in parsed) return parsed.response;

  const { website, ...rawFields } = parsed.data;
  if (website && website.trim().length > 0) {
    return jsonOk({ ok: true });
  }

  const fields = toInquiryFields(rawFields);

  try {
    await connectDb();
    await ensureBusinessEmailSettings();

    const inquiry = await Inquiry.create({
      ...fields,
      status: "new",
    });

    const recipient = getLeadRecipient();

    if (recipient) {
      const emailed = await notifyContactInquiry(fields, recipient);
      if (!emailed) {
        console.error(
          "[contact] Inquiry saved but email notification failed.",
          JSON.stringify({ inquiryId: String(inquiry._id), recipient }),
        );
      }
    }

    const confirmed = await sendContactConfirmationEmail(fields);
    if (!confirmed) {
      console.error(
        "[contact] Inquiry saved but confirmation email failed.",
        JSON.stringify({ inquiryId: String(inquiry._id), email: fields.email }),
      );
    }

    return jsonOk({ ok: true, id: String(inquiry._id) }, 201);
  } catch (error) {
    console.error("[contact] submission failed:", error);

    const emailed = await tryContactEmailFallback(fields);
    if (emailed) {
      await sendContactConfirmationEmail(fields);
      return jsonOk({ ok: true, deliveredBy: "email" }, 201);
    }

    return jsonError(contactSubmissionErrorMessage(error), 500);
  }
}
