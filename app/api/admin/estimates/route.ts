import { connectDb } from "@/lib/db";
import { jsonOk, requireAdminSession } from "@/lib/api";
import type { EstimateStatus } from "@/lib/types";
import { EstimateRequest } from "@/models";

const ESTIMATE_STATUSES: readonly EstimateStatus[] = [
  "new",
  "reviewing",
  "quoted",
  "scheduled",
  "completed",
  "cancelled",
];

function isEstimateStatus(value: string): value is EstimateStatus {
  return (ESTIMATE_STATUSES as readonly string[]).includes(value);
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
    statusParam && statusParam !== "all" && isEstimateStatus(statusParam)
      ? { status: statusParam }
      : {};

  const estimates = await EstimateRequest.find(filter)
    .sort({ createdAt: -1 })
    .limit(limit)
    .lean();

  return jsonOk({ estimates });
}
