/**
 * SMTP connectivity test — run: npx tsx scripts/test-smtp.ts
 * Loads .env.local then .env (same order as Next.js).
 */
import fs from "node:fs";
import path from "node:path";
import type SMTPTransport from "nodemailer/lib/smtp-transport";
import nodemailer from "nodemailer";

function loadEnvFile(filename: string) {
  const filePath = path.join(process.cwd(), filename);
  if (!fs.existsSync(filePath)) return;
  for (const line of fs.readFileSync(filePath, "utf8").split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eq = trimmed.indexOf("=");
    if (eq === -1) continue;
    const key = trimmed.slice(0, eq).trim();
    let value = trimmed.slice(eq + 1).trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    if (process.env[key] === undefined) {
      process.env[key] = value;
    }
  }
}

loadEnvFile(".env.local");
loadEnvFile(".env");

const host = process.env.SMTP_HOST;
const port = Number(process.env.SMTP_PORT || "465");
const user = process.env.SMTP_USER;
const pass = process.env.SMTP_PASS;
const to = process.env.CONTACT_RECIPIENT_EMAIL || user;
const from =
  process.env.SMTP_FROM || `Express Glass <${user}>`;

if (!host || !user || !pass) {
  console.error("Missing SMTP_HOST, SMTP_USER, or SMTP_PASS in .env.local");
  process.exit(1);
}

async function tryVerify(
  label: string,
  config: SMTPTransport.Options,
): Promise<nodemailer.Transporter | null> {
  const transport = nodemailer.createTransport(config);
  try {
    await transport.verify();
    console.log(`✓ ${label} — connection verified`);
    return transport;
  } catch (error) {
    console.error(
      `✗ ${label} —`,
      error instanceof Error ? error.message : error,
    );
    return null;
  }
}

async function main() {
  console.log("SMTP test for Express Glass");
  console.log(`  Host: ${host}`);
  console.log(`  User: ${user}`);
  console.log(`  To:   ${to}`);
  console.log("");

  let transport =
    (await tryVerify("Port 465 (SSL)", {
      host,
      port: 465,
      secure: true,
      auth: { user, pass },
    })) ||
    (await tryVerify("Port 587 (STARTTLS)", {
      host,
      port: 587,
      secure: false,
      requireTLS: true,
      auth: { user, pass },
    })) ||
    (await tryVerify("Yahoo service preset", {
      service: "yahoo",
      auth: { user, pass },
    }));

  if (!transport) {
    console.error("\nAll SMTP connection attempts failed.");
    process.exit(1);
  }

  const subject = `Express Glass SMTP test — ${new Date().toISOString()}`;
  const text =
    "This is a test email from the Express Glass site SMTP setup.\n\nIf you received this, Yahoo SMTP is working correctly.";

  try {
    const info = await transport.sendMail({ from, to, subject, text });
    console.log("\n✓ Test email sent successfully");
    console.log(`  Message ID: ${info.messageId}`);
    console.log(`  Recipient:  ${to}`);
    process.exit(0);
  } catch (error) {
    console.error(
      "\n✗ Send failed:",
      error instanceof Error ? error.message : error,
    );
    process.exit(1);
  }
}

main();
