"use client";

export class AdminApiError extends Error {
  status: number;
  details?: unknown;

  constructor(message: string, status: number, details?: unknown) {
    super(message);
    this.name = "AdminApiError";
    this.status = status;
    this.details = details;
  }
}

export async function adminFetch<T>(
  url: string,
  init?: RequestInit,
): Promise<T> {
  const headers = new Headers(init?.headers);
  if (init?.body && !(init.body instanceof FormData) && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  const res = await fetch(url, {
    ...init,
    headers,
    credentials: "same-origin",
  });

  let payload: unknown = null;
  const text = await res.text();
  if (text) {
    try {
      payload = JSON.parse(text) as unknown;
    } catch {
      payload = { error: text };
    }
  }

  if (!res.ok) {
    const record =
      payload && typeof payload === "object"
        ? (payload as { error?: string; details?: unknown })
        : null;
    throw new AdminApiError(
      record?.error || `Request failed (${res.status})`,
      res.status,
      record?.details,
    );
  }

  return payload as T;
}

export function idOf(doc: { _id?: string | { toString(): string } } | null | undefined): string {
  if (!doc?._id) return "";
  return typeof doc._id === "string" ? doc._id : String(doc._id);
}

export function formatDate(value: string | Date | undefined | null): string {
  if (!value) return "—";
  const d = typeof value === "string" ? new Date(value) : value;
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleString();
}
