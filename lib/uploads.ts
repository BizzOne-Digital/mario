import { createHash, randomBytes } from "crypto";
import { promises as fs } from "fs";
import path from "path";
import sharp from "sharp";
import type { UploadResult } from "@/lib/types";

const ALLOWED_MIMES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
]);

const MIME_TO_EXT: Record<string, string> = {
  "image/jpeg": ".jpg",
  "image/png": ".png",
  "image/webp": ".webp",
  "image/gif": ".gif",
};

const BLOCKED_EXTENSIONS = new Set([
  ".exe",
  ".bat",
  ".cmd",
  ".com",
  ".msi",
  ".scr",
  ".js",
  ".mjs",
  ".cjs",
  ".ts",
  ".tsx",
  ".jsx",
  ".php",
  ".py",
  ".sh",
  ".ps1",
  ".vbs",
  ".jar",
  ".dll",
  ".html",
  ".htm",
  ".svg",
]);

const MAX_DIMENSION = 2000;

export interface StorageAdapter {
  save(buffer: Buffer, folder: string, filename: string): Promise<string>;
  delete(relativeUrl: string): Promise<void>;
  exists(relativeUrl: string): Promise<boolean>;
}

function getUploadsRoot(): string {
  const configured = process.env.UPLOADS_DIRECTORY || "public/uploads";
  if (path.isAbsolute(configured)) {
    return configured;
  }
  return path.join(/* turbopackIgnore: true */ process.cwd(), configured);
}

function getMaxUploadBytes(): number {
  const mb = Number(process.env.MAX_UPLOAD_SIZE_MB || "10");
  const safeMb = Number.isFinite(mb) && mb > 0 ? mb : 10;
  return safeMb * 1024 * 1024;
}

function sanitizeFolder(folder: string): string {
  const cleaned = folder
    .replace(/\\/g, "/")
    .split("/")
    .filter((segment) => segment && segment !== "." && segment !== "..")
    .join("/");
  if (!cleaned || cleaned.includes("\0")) {
    throw new Error("Invalid upload folder.");
  }
  return cleaned;
}

function createSafeFilename(originalName: string, mime: string): string {
  const ext = MIME_TO_EXT[mime];
  if (!ext) {
    throw new Error("Unsupported file type.");
  }

  const base = path
    .basename(originalName)
    .replace(/\.[^.]+$/, "")
    .toLowerCase()
    .replace(/[^a-z0-9-_]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 40);

  const hash = createHash("sha256")
    .update(randomBytes(16))
    .digest("hex")
    .slice(0, 12);

  return `${base || "image"}-${hash}${ext}`;
}

function assertSafeRelativePath(relativeUrl: string, root: string): string {
  const normalized = relativeUrl.replace(/^\/+/, "").replace(/\\/g, "/");
  if (
    normalized.includes("..") ||
    normalized.includes("\0") ||
    path.isAbsolute(normalized)
  ) {
    throw new Error("Invalid file path.");
  }

  const absolute = path.resolve(process.cwd(), "public", normalized);
  const publicRoot = path.resolve(process.cwd(), "public");
  if (!absolute.startsWith(publicRoot + path.sep) && absolute !== publicRoot) {
    throw new Error("Path traversal detected.");
  }

  const uploadsRoot = root;
  if (!absolute.startsWith(uploadsRoot + path.sep) && absolute !== uploadsRoot) {
    // Allow delete/exists only under uploads root
    if (!absolute.startsWith(uploadsRoot)) {
      throw new Error("File is outside uploads directory.");
    }
  }

  return absolute;
}

export class LocalFilesystemAdapter implements StorageAdapter {
  private readonly root: string;

  constructor(root = getUploadsRoot()) {
    this.root = root;
  }

  async save(buffer: Buffer, folder: string, filename: string): Promise<string> {
    const safeFolder = sanitizeFolder(folder);
    const dir = path.join(this.root, safeFolder);
    await fs.mkdir(dir, { recursive: true });

    const safeName = path.basename(filename);
    if (safeName !== filename || safeName.includes("..")) {
      throw new Error("Invalid filename.");
    }

    const ext = path.extname(safeName).toLowerCase();
    if (BLOCKED_EXTENSIONS.has(ext)) {
      throw new Error("Executable or disallowed file type.");
    }

    const absolute = path.join(dir, safeName);
    if (!absolute.startsWith(dir + path.sep)) {
      throw new Error("Path traversal detected.");
    }

    await fs.writeFile(absolute, buffer);

    const relativeFromPublic = path
      .relative(path.join(process.cwd(), "public"), absolute)
      .split(path.sep)
      .join("/");

    return `/${relativeFromPublic}`;
  }

  async delete(relativeUrl: string): Promise<void> {
    const absolute = assertSafeRelativePath(relativeUrl, this.root);
    try {
      await fs.unlink(absolute);
    } catch (error) {
      const err = error as NodeJS.ErrnoException;
      if (err.code !== "ENOENT") {
        throw error;
      }
    }
  }

  async exists(relativeUrl: string): Promise<boolean> {
    const absolute = assertSafeRelativePath(relativeUrl, this.root);
    try {
      await fs.access(absolute);
      return true;
    } catch {
      return false;
    }
  }
}

let defaultAdapter: StorageAdapter | null = null;

export function getStorageAdapter(): StorageAdapter {
  if (!defaultAdapter) {
    defaultAdapter = new LocalFilesystemAdapter();
  }
  return defaultAdapter;
}

export function setStorageAdapter(adapter: StorageAdapter): void {
  defaultAdapter = adapter;
}

export async function processAndSaveUpload(
  file: {
    buffer: Buffer;
    mimetype: string;
    originalname: string;
    size?: number;
  },
  folder: string,
  adapter: StorageAdapter = getStorageAdapter(),
): Promise<UploadResult> {
  const mime = file.mimetype.toLowerCase();
  if (!ALLOWED_MIMES.has(mime)) {
    throw new Error("Only JPEG, PNG, WebP, and GIF images are allowed.");
  }

  const size = file.size ?? file.buffer.length;
  if (size > getMaxUploadBytes()) {
    throw new Error(`File exceeds max upload size of ${process.env.MAX_UPLOAD_SIZE_MB || "10"}MB.`);
  }

  const originalExt = path.extname(file.originalname).toLowerCase();
  if (BLOCKED_EXTENSIONS.has(originalExt)) {
    throw new Error("Executable or disallowed file type.");
  }

  const filename = createSafeFilename(file.originalname, mime);
  const safeFolder = sanitizeFolder(folder);

  let pipeline = sharp(file.buffer, { animated: mime === "image/gif" }).rotate();
  const metadata = await pipeline.metadata();

  const width = metadata.width ?? 0;
  const height = metadata.height ?? 0;
  if (width > MAX_DIMENSION || height > MAX_DIMENSION) {
    pipeline = pipeline.resize({
      width: MAX_DIMENSION,
      height: MAX_DIMENSION,
      fit: "inside",
      withoutEnlargement: true,
    });
  }

  const resizedBuffer = await pipeline.toBuffer();
  const resizedMeta = await sharp(resizedBuffer).metadata();

  const url = await adapter.save(resizedBuffer, safeFolder, filename);

  const webpName = filename.replace(/\.[^.]+$/, ".webp");
  const webpBuffer = await sharp(resizedBuffer).webp({ quality: 82 }).toBuffer();
  const webpUrl = await adapter.save(webpBuffer, safeFolder, webpName);

  return {
    url,
    webpUrl,
    width: resizedMeta.width ?? width,
    height: resizedMeta.height ?? height,
    size: resizedBuffer.length,
    mime,
    filename,
  };
}
