import { Types } from "mongoose";
import { NextResponse } from "next/server";
import { ZodError, type ZodType } from "zod";
import { requireAdmin } from "@/lib/auth";
import type { Session } from "next-auth";

export function toObjectId(id: string): Types.ObjectId {
  return new Types.ObjectId(id);
}

export function jsonOk<T>(data: T, status = 200): NextResponse {
  return NextResponse.json(data, { status });
}

export function jsonError(
  message: string,
  status = 400,
  details?: unknown,
): NextResponse {
  return NextResponse.json(
    details === undefined ? { error: message } : { error: message, details },
    { status },
  );
}

export function zodErrorResponse(error: ZodError): NextResponse {
  return jsonError("Validation failed", 400, error.issues);
}

export async function parseJsonBody<T>(
  request: Request,
  schema: ZodType<T>,
): Promise<{ data: T } | { response: NextResponse }> {
  let raw: unknown;
  try {
    raw = await request.json();
  } catch {
    return { response: jsonError("Invalid JSON body", 400) };
  }

  const parsed = schema.safeParse(raw);
  if (!parsed.success) {
    return { response: zodErrorResponse(parsed.error) };
  }
  return { data: parsed.data };
}

export async function requireAdminSession(): Promise<
  { session: Session } | { response: NextResponse }
> {
  try {
    const session = await requireAdmin();
    return { session };
  } catch {
    return { response: jsonError("Unauthorized", 401) };
  }
}

export function getClientIp(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) {
    const first = forwarded.split(",")[0]?.trim();
    if (first) return first;
  }
  const realIp = request.headers.get("x-real-ip");
  if (realIp) return realIp;
  return "unknown";
}

export function uniqueSlug(base: string, suffix?: string): string {
  const cleaned = base
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
  if (suffix) {
    return `${cleaned || "item"}-${suffix}`;
  }
  return cleaned || "item";
}

export function generateEstimateReference(date = new Date()): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  const rand = Math.floor(Math.random() * 36 ** 4)
    .toString(36)
    .toUpperCase()
    .padStart(4, "0");
  return `EG-${y}${m}${d}-${rand}`;
}
