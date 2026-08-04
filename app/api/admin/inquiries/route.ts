import { connectDb } from "@/lib/db";
import { jsonOk, requireAdminSession } from "@/lib/api";
import type { InquiryStatus } from "@/lib/types";
import { Inquiry } from "@/models";

const INQUIRY_STATUSES: readonly InquiryStatus[] = [
  "new",
  "contacted",
  "scheduled",
  "closed",
  "spam",
];

function isInquiryStatus(value: string): value is InquiryStatus {
  return (INQUIRY_STATUSES as readonly string[]).includes(value);
}

export async function GET(request: Request) {
  const auth = await requireAdminSession();
  if ("response" in auth) return auth.response;

  const url = new URL(request.url);
  const statusParam = url.searchParams.get("status");
  const limit = Math.min(
    Number(url.searchParams.get("limit") || "100") || 100,
    500,
  );

  await connectDb();
  const filter =
    statusParam && statusParam !== "all" && isInquiryStatus(statusParam)
      ? { status: statusParam }
      : {};

  const inquiries = await Inquiry.find(filter)
    .sort({ createdAt: -1 })
    .limit(limit)
    .lean();

  return jsonOk({ inquiries });
}
