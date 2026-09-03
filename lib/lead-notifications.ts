import { BUSINESS } from "@/lib/constants";
import { emailConfigured, sendEmail } from "@/lib/email";

export function getLeadRecipient(): string {
  return BUSINESS.email;
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

export async function sendContactConfirmationEmail(
  fields: ContactInquiryFields,
): Promise<boolean> {
  if (!fields.email.trim()) return false;

  const firstName = fields.fullName.trim().split(/\s+/)[0] || fields.fullName;

  return sendEmail({
    to: fields.email,
    subject: `We received your message — ${BUSINESS.name}`,
    replyTo: BUSINESS.email,
    text: [
      `Hi ${firstName},`,
      "",
      `Thank you for contacting ${BUSINESS.name}. We received your message and will get back to you soon.`,
      "",
      "Here is a copy of what you sent:",
      "",
      formatContactInquiryEmail(fields),
      "",
      `If your project is urgent, please call us at ${BUSINESS.primaryPhone}.`,
      "",
      `— ${BUSINESS.name}`,
      BUSINESS.email,
    ].join("\n"),
  });
}

export type EstimateConfirmationFields = {
  reference: string;
  name: string;
  email: string;
  phone: string;
  service: string;
  propertyType: string;
  location: string;
  requestType: string;
  urgency: string;
  preferredDate: string;
  preferredTime: string;
  projectDescription: string;
};

export async function sendEstimateConfirmationEmail(
  fields: EstimateConfirmationFields,
): Promise<boolean> {
  if (!fields.email.trim()) return false;

  const firstName = fields.name.trim().split(/\s+/)[0] || fields.name;

  return sendEmail({
    to: fields.email,
    subject: `Estimate request received — ${fields.reference}`,
    replyTo: BUSINESS.email,
    text: [
      `Hi ${firstName},`,
      "",
      `Thank you for your estimate request with ${BUSINESS.name}. We received your details and will follow up soon.`,
      "",
      `Reference: ${fields.reference}`,
      `Service: ${fields.service}`,
      `Property: ${fields.propertyType}`,
      `Location: ${fields.location}`,
      `Request type: ${fields.requestType}`,
      `Urgency: ${fields.urgency || "standard"}`,
      `Preferred date: ${fields.preferredDate || "n/a"}`,
      `Preferred time: ${fields.preferredTime || "n/a"}`,
      "",
      fields.projectDescription || "",
      "",
      `Questions? Call ${BUSINESS.primaryPhone} or reply to this email.`,
      "",
      `— ${BUSINESS.name}`,
      BUSINESS.email,
    ]
      .filter((line, index, lines) => !(line === "" && lines[index - 1] === ""))
      .join("\n"),
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
