import { BUSINESS } from "@/lib/constants";
import { emailConfigured, sendEmail } from "@/lib/email";

export function getLeadRecipient(fallbackFromDb?: string | null): string {
  return (
    fallbackFromDb?.trim() ||
    process.env.CONTACT_RECIPIENT_EMAIL?.trim() ||
    BUSINESS.email
  );
}

export type ContactInquiryFields = {
  fullName: string;
  email: string;
  phone: string;
  service: string;
  propertyType: string;
  location: string;
  preferredMethod: string;
  preferredDate: string;
  message: string;
};

export function formatContactInquiryEmail(fields: ContactInquiryFields): string {
  return [
    `Name: ${fields.fullName}`,
    `Email: ${fields.email}`,
    `Phone: ${fields.phone}`,
    `Service: ${fields.service}`,
    `Property: ${fields.propertyType}`,
    `Location: ${fields.location}`,
    `Preferred method: ${fields.preferredMethod}`,
    `Preferred date: ${fields.preferredDate || "n/a"}`,
    "",
    fields.message,
  ].join("\n");
}

export async function notifyContactInquiry(
  fields: ContactInquiryFields,
  recipient: string,
  subjectPrefix = "New contact inquiry from",
): Promise<boolean> {
  if (!recipient.trim()) return false;

  return sendEmail({
    to: recipient,
    subject: `${subjectPrefix} ${fields.fullName}`,
    replyTo: fields.email,
    text: formatContactInquiryEmail(fields),
  });
}

export function contactSubmissionErrorMessage(error: unknown): string {
  const detail = error instanceof Error ? error.message : String(error);

  if (detail.includes("MONGODB_URI")) {
    return "The site database is not configured. Please call (951) 371-2601.";
  }

  if (/connect|ECONNREFUSED|Server selection|timed out|ENOTFOUND|ETIMEDOUT/i.test(detail)) {
    return "We could not reach our database. Please call (951) 371-2601.";
  }

  if (/authentication failed|bad auth|invalid credentials|auth fail/i.test(detail)) {
    return "The site database is misconfigured. Please call (951) 371-2601.";
  }

  return "We could not save your message right now. Please call (951) 371-2601.";
}

export async function tryContactEmailFallback(
  fields: ContactInquiryFields,
): Promise<boolean> {
  if (!emailConfigured()) return false;
  const recipient = getLeadRecipient();
  return notifyContactInquiry(
    fields,
    recipient,
    "Contact inquiry (database unavailable) from",
  );
}
