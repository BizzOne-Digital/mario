import nodemailer from "nodemailer";
import type SMTPTransport from "nodemailer/lib/smtp-transport";
import { BUSINESS } from "@/lib/constants";

export interface SendEmailOptions {
  to: string | string[];
  subject: string;
  text?: string;
  html?: string;
  replyTo?: string;
  from?: string;
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
        to: options.to,
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
