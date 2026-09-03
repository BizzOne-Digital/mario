import nodemailer from "nodemailer";
import type SMTPTransport from "nodemailer/lib/smtp-transport";
import { BUSINESS, resolveBusinessEmail } from "@/lib/constants";

export interface SendEmailOptions {
  to: string | string[];
  subject: string;
  text?: string;
  html?: string;
  replyTo?: string;
  from?: string;
}

/**
 * Yahoo (and some other providers) reject SMTP delivery to the same mailbox
 * used for authentication ("550 Mailbox unavailable"). Customer confirmations
 * work because they go to external addresses; owner notifications fail when
 * the lead inbox matches SMTP_USER. A plus-tag alias still delivers to the
 * same inbox but is accepted by Yahoo SMTP.
 */
function avoidSmtpSelfDelivery(address: string): string {
  const smtpUser = process.env.SMTP_USER?.trim();
  if (!smtpUser) return address;

  const normalized = address.trim();
  if (normalized.toLowerCase() !== smtpUser.toLowerCase()) return normalized;

  const alternate =
    process.env.LEAD_NOTIFICATION_EMAIL?.trim() ||
    process.env.CONTACT_RECIPIENT_EMAIL?.trim();
  if (alternate && alternate.toLowerCase() !== smtpUser.toLowerCase()) {
    return resolveBusinessEmail(alternate);
  }

  const at = normalized.lastIndexOf("@");
  if (at === -1) return normalized;

  const local = normalized.slice(0, at);
  const domain = normalized.slice(at + 1);
  if (local.includes("+")) return normalized;

  const tag = process.env.SMTP_SELF_DELIVERY_TAG?.trim() || "leads";
  const aliased = `${local}+${tag}@${domain}`;
  console.info(
    `[email] Routing owner notification via plus-alias (${normalized} → ${aliased})`,
  );
  return aliased;
}

function normalizeRecipients(to: string | string[]): string | string[] {
  const list = Array.isArray(to) ? to : [to];
  const expanded = list.flatMap((entry) =>
    entry
      .split(/[,;]/)
      .map((part) => part.trim())
      .filter(Boolean),
  );
  const resolved = expanded.map((address) =>
    avoidSmtpSelfDelivery(resolveBusinessEmail(address)),
  );
  const unique = [...new Set(resolved.map((address) => address.toLowerCase()))];
  if (unique.length === 0) return avoidSmtpSelfDelivery(BUSINESS.email);
  if (unique.length === 1) return resolved.find((a) => a.toLowerCase() === unique[0]!) ?? unique[0]!;
  return resolved.filter(
    (address, index) =>
      resolved.findIndex((entry) => entry.toLowerCase() === address.toLowerCase()) === index,
  );
}

function smtpPort(): number {
  return Number(process.env.SMTP_PORT || "465");
}

function isEmailConfigured(): boolean {
  return Boolean(process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS);
}

async function sendWithFallback(options: SendEmailOptions, from: string): Promise<boolean> {
  const primaryPort = smtpPort();
  const attempts: SMTPTransport.Options[] = [
    {
      host: process.env.SMTP_HOST,
      port: primaryPort,
      secure: process.env.SMTP_SECURE === "true" || primaryPort === 465,
      requireTLS: primaryPort === 587,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    },
  ];

  // Yahoo often accepts 587 when 465 is blocked.
  if (process.env.SMTP_HOST?.includes("yahoo.com") && primaryPort === 465) {
    attempts.push({
      host: process.env.SMTP_HOST,
      port: 587,
      secure: false,
      requireTLS: true,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
  }

  let lastError: unknown;
  for (const config of attempts) {
    try {
      const transport = nodemailer.createTransport(config);
      await transport.sendMail({
        from,
        to: normalizeRecipients(options.to),
        subject: options.subject,
        text: options.text,
        html: options.html,
        replyTo: options.replyTo,
      });
      return true;
    } catch (error) {
      lastError = error;
      console.error(
        `[email] Send failed on port ${config.port}:`,
        error instanceof Error ? error.message : error,
      );
    }
  }

  console.error("[email] All SMTP attempts failed.", lastError);
  return false;
}

/**
 * Sends email when SMTP is configured; otherwise logs and no-ops.
 */
export async function sendEmail(options: SendEmailOptions): Promise<boolean> {
  if (!isEmailConfigured()) {
    console.info(
      "[email] SMTP not configured — skipping send.",
      JSON.stringify({
        to: options.to,
        subject: options.subject,
      }),
    );
    return false;
  }

  const from =
    options.from ||
    process.env.SMTP_FROM ||
    `Express Glass <${process.env.SMTP_USER || BUSINESS.email}>`;

  try {
    return await sendWithFallback(options, from);
  } catch (error) {
    console.error("[email] Send failed:", error);
    return false;
  }
}

export function emailConfigured(): boolean {
  return isEmailConfigured();
}
