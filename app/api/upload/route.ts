import { connectDb } from "@/lib/db";
import {
  getClientIp,
  jsonError,
  jsonOk,
  requireAdminSession,
} from "@/lib/api";
import { processAndSaveUpload } from "@/lib/uploads";
import { rateLimit } from "@/lib/rate-limit";
import { MediaAsset } from "@/models";

export async function POST(request: Request) {
  const auth = await requireAdminSession();
  if ("response" in auth) return auth.response;

  const limited = rateLimit(`upload:${getClientIp(request)}`, 30, 60_000);
  if (!limited.allowed) {
    return jsonError("Too many upload requests", 429);
  }

  let formData: FormData;
  try {
    formData = await request.formData();
  } catch {
    return jsonError("Expected multipart form data", 400);
  }

  const fileEntry = formData.get("file");
  const folderRaw = formData.get("folder");
  const altRaw = formData.get("alt");

  if (!(fileEntry instanceof File)) {
    return jsonError("file is required", 400);
  }

  const folder =
    typeof folderRaw === "string" && folderRaw.trim()
      ? folderRaw.trim()
      : "general";
  const alt = typeof altRaw === "string" ? altRaw.trim() : "";

  const buffer = Buffer.from(await fileEntry.arrayBuffer());

  try {
    await connectDb();
    const uploaded = await processAndSaveUpload(
      {
        buffer,
        mimetype: fileEntry.type || "application/octet-stream",
        originalname: fileEntry.name || "upload.jpg",
        size: fileEntry.size,
      },
      folder,
    );

    const asset = await MediaAsset.create({
      url: uploaded.url,
      webpUrl: uploaded.webpUrl,
      filename: uploaded.filename,
      mime: uploaded.mime,
      size: uploaded.size,
      width: uploaded.width,
      height: uploaded.height,
      alt,
      folder,
      usedBy: [],
    });

    return jsonOk({ asset }, 201);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Upload failed";
    return jsonError(message, 400);
  }
}
