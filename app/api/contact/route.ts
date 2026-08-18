import { connectDb } from "@/lib/db";
import {
  getClientIp,
  jsonError,
  jsonOk,
  parseJsonBody,
} from "@/lib/api";
import { BUSINESS } from "@/lib/constants";
import { sendEmail } from "@/lib/email";
import { rateLimit } from "@/lib/rate-limit";
import { sanitizePlainText } from "@/lib/sanitize";
import { contactSchema } from "@/lib/validations";
import { Inquiry, SiteSettings } from "@/models";

export async function POST(request: Request) {
  const limited = rateLimit(`contact:${getClientIp(request)}`, 5, 60_000);
  if (!limited.allowed) {
    return jsonError("Too many requests. Please try again shortly.", 429);
  }

  const parsed = await parseJsonBody(request, contactSchema);
  if ("response" in parsed) return parsed.response;

  const { website, ...fields } = parsed.data;
  if (website && website.trim().length > 0) {
    return jsonOk({ ok: true });
  }

  await connectDb();

  const inquiry = await Inquiry.create({
    fullName: sanitizePlainText(fields.fullName),
    email: fields.email.toLowerCase(),
    phone: sanitizePlainText(fields.phone),
    service: sanitizePlainText(fields.service),
    propertyType: sanitizePlainText(fields.propertyType),
    location: sanitizePlainText(fields.location),
    preferredMethod: sanitizePlainText(fields.preferredMethod),
    preferredDate: sanitizePlainText(fields.preferredDate),
    message: sanitizePlainText(fields.message),
    status: "new",
  });

  const settings = await SiteSettings.findOne().lean();
  const recipient =
    settings?.contactRecipient ||
    process.env.CONTACT_RECIPIENT_EMAIL ||
    BUSINESS.email;

  if (recipient) {
    await sendEmail({
      to: recipient,
      subject: `New contact inquiry from ${inquiry.fullName}`,
      replyTo: inquiry.email,
      text: [
        `Name: ${inquiry.fullName}`,
        `Email: ${inquiry.email}`,
        `Phone: ${inquiry.phone}`,
        `Service: ${inquiry.service}`,
        `Property: ${inquiry.propertyType}`,
        `Location: ${inquiry.location}`,
        `Preferred method: ${inquiry.preferredMethod}`,
        `Preferred date: ${inquiry.preferredDate || "n/a"}`,
        "",
        inquiry.message,
      ].join("\n"),
    });
  }

  return jsonOk({ ok: true, id: String(inquiry._id) }, 201);
}
