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

function createTransport() {
  const port = smtpPort();
  const options: SMTPTransport.Options = {
    host: process.env.SMTP_HOST,
    port,
    secure: process.env.SMTP_SECURE === "true" || port === 465,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  };
  return nodemailer.createTransport(options);
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
    const transport = createTransport();
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
    console.error("[email] Send failed:", error);
    return false;
  }
}

export function emailConfigured(): boolean {
  return isEmailConfigured();
}
