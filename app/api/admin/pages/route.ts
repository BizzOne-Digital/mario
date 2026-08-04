import { connectDb } from "@/lib/db";
import { jsonOk, requireAdminSession } from "@/lib/api";
import { Page } from "@/models";

export async function GET() {
  const auth = await requireAdminSession();
  if ("response" in auth) return auth.response;

  await connectDb();
  const pages = await Page.find().sort({ slug: 1 }).lean();
  return jsonOk({ pages });
}
