import { Types } from "mongoose";
import { connectDb } from "@/lib/db";
import {
  jsonError,
  jsonOk,
  requireAdminSession,
} from "@/lib/api";
import { getStorageAdapter } from "@/lib/uploads";
import { MediaAsset } from "@/models";

export async function GET(request: Request) {
  const auth = await requireAdminSession();
  if ("response" in auth) return auth.response;

  const url = new URL(request.url);
  const folder = url.searchParams.get("folder");
  const limit = Math.min(
    Number(url.searchParams.get("limit") || "200") || 200,
    500,
  );

  await connectDb();
  const filter = folder ? { folder } : {};
  const media = await MediaAsset.find(filter)
    .sort({ createdAt: -1 })
    .limit(limit)
    .lean();

  return jsonOk({ media });
}

export async function DELETE(request: Request) {
  const auth = await requireAdminSession();
  if ("response" in auth) return auth.response;

  const url = new URL(request.url);
  const id = url.searchParams.get("id");
  if (!id || !Types.ObjectId.isValid(id)) {
    return jsonError("Valid id query parameter is required", 400);
  }

  await connectDb();
  const asset = await MediaAsset.findByIdAndDelete(id).lean();
  if (!asset) return jsonError("Media asset not found", 404);

  const adapter = getStorageAdapter();
  try {
    await adapter.delete(asset.url);
    if (asset.webpUrl) {
      await adapter.delete(asset.webpUrl);
    }
  } catch (error) {
    console.warn("[media] file delete warning", error);
  }

  return jsonOk({ ok: true });
}
