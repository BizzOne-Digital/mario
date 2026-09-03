import { connectDb } from "@/lib/db";
import {
  jsonOk,
  parseJsonBody,
  requireAdminSession,
} from "@/lib/api";
import { resolveBusinessEmail } from "@/lib/constants";
import { revalidateSettingsAffected } from "@/lib/revalidate";
import { siteSettingsUpdateSchema } from "@/lib/validations";
import { SiteSettings } from "@/models";

function normalizeSettingsEmails<T extends { email?: string; contactRecipient?: string }>(
  data: T,
): T {
  const email = resolveBusinessEmail(data.email);
  return {
    ...data,
    email,
    contactRecipient: email,
  };
}

export async function GET() {
  const auth = await requireAdminSession();
  if ("response" in auth) return auth.response;

  await connectDb();
  let settings = await SiteSettings.findOne().lean();
  if (!settings) {
    const created = await SiteSettings.create({});
    settings = created.toObject();
  }

  return jsonOk({ settings: normalizeSettingsEmails(settings) });
}

export async function PUT(request: Request) {
  const auth = await requireAdminSession();
  if ("response" in auth) return auth.response;

  const parsed = await parseJsonBody(request, siteSettingsUpdateSchema);
  if ("response" in parsed) return parsed.response;

  await connectDb();
  const payload = normalizeSettingsEmails(parsed.data);
  const settings = await SiteSettings.findOneAndUpdate(
    {},
    { $set: payload },
    { new: true, upsert: true, setDefaultsOnInsert: true },
  ).lean();

  revalidateSettingsAffected();

  return jsonOk({ settings });
}
