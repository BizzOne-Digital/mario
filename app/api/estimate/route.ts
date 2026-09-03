import { connectDb } from "@/lib/db";
import {
  generateEstimateReference,
  getClientIp,
  jsonError,
  jsonOk,
  parseJsonBody,
} from "@/lib/api";
import { BUSINESS } from "@/lib/constants";
import { sendEmail } from "@/lib/email";
import { rateLimit } from "@/lib/rate-limit";
import { sanitizePlainText } from "@/lib/sanitize";
import { estimateSchema } from "@/lib/validations";
import { EstimateRequest, SiteSettings } from "@/models";

export async function POST(request: Request) {
  const limited = rateLimit(`estimate:${getClientIp(request)}`, 5, 60_000);
  if (!limited.allowed) {
    return jsonError("Too many requests. Please try again shortly.", 429);
  }

  const parsed = await parseJsonBody(request, estimateSchema);
  if ("response" in parsed) return parsed.response;

  const { website, ...fields } = parsed.data;
  if (website && website.trim().length > 0) {
    return jsonOk({ ok: true, reference: generateEstimateReference() });
  }

  await connectDb();

  let estimate = null;

  for (let attempt = 0; attempt < 5; attempt += 1) {
    const reference = generateEstimateReference();
    try {
      estimate = await EstimateRequest.create({
        reference,
        service: sanitizePlainText(fields.service),
        propertyType: sanitizePlainText(fields.propertyType),
        location: sanitizePlainText(fields.location),
        address: sanitizePlainText(fields.address),
        city: sanitizePlainText(fields.city),
        requestType: sanitizePlainText(fields.requestType),
        projectDescription: sanitizePlainText(fields.projectDescription),
        details: sanitizePlainText(fields.details),
        preferredDate: sanitizePlainText(fields.preferredDate),
        preferredTime: sanitizePlainText(fields.preferredTime),
        urgency: sanitizePlainText(fields.urgency),
        name: sanitizePlainText(fields.name),
        phone: sanitizePlainText(fields.phone),
        email: fields.email.toLowerCase(),
        howHeard: sanitizePlainText(fields.howHeard),
        photos: fields.photos,
        status: "new",
      });
      break;
    } catch (error) {
      const duplicate =
        typeof error === "object" &&
        error !== null &&
        "code" in error &&
        (error as { code?: number }).code === 11000;
      if (!duplicate || attempt === 4) {
        const message =
          error instanceof Error ? error.message : "Could not create estimate";
        return jsonError(message, 500);
      }
    }
  }

  if (!estimate) {
    return jsonError("Could not create estimate request", 500);
  }

  const settings = await SiteSettings.findOne().lean();
  const recipient =
    settings?.contactRecipient ||
    process.env.CONTACT_RECIPIENT_EMAIL ||
    BUSINESS.email;

  if (recipient) {
    await sendEmail({
      to: recipient,
      subject: `Estimate request ${estimate.reference}`,
      replyTo: estimate.email,
      text: [
        `Reference: ${estimate.reference}`,
        `Name: ${estimate.name}`,
        `Email: ${estimate.email}`,
        `Phone: ${estimate.phone}`,
        `Service: ${estimate.service}`,
        `Property: ${estimate.propertyType}`,
        `Location: ${estimate.location}`,
        `Address: ${estimate.address || "n/a"}`,
        `City: ${estimate.city || "n/a"}`,
        `Request type: ${estimate.requestType}`,
        `Urgency: ${estimate.urgency}`,
        `Preferred date: ${estimate.preferredDate || "n/a"}`,
        `Preferred time: ${estimate.preferredTime || "n/a"}`,
        "",
        estimate.projectDescription || estimate.details || "",
      ].join("\n"),
    });
  }

  return jsonOk(
    { ok: true, reference: estimate.reference, id: String(estimate._id) },
    201,
  );
}
