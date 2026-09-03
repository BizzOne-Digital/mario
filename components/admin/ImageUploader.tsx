"use client";

import { useRef, useState } from "react";
import { ImagePlus, Loader2, Trash2 } from "lucide-react";
import { adminFetch, AdminApiError } from "@/lib/admin-client";
import { useToast } from "@/components/admin/Toast";

interface UploadResponse {
  asset?: {
    url?: string;
    webpUrl?: string;
    alt?: string;
  };
  url?: string;
}

export function ImageUploader({
  value,
  alt = "",
  folder = "general",
  label = "Image",
  onChange,
  onAltChange,
}: {
  value: string;
  alt?: string;
  folder?: string;
  label?: string;
  onChange: (url: string) => void;
  onAltChange?: (alt: string) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const toast = useToast();
  const [uploading, setUploading] = useState(false);

  async function handleFile(file: File | undefined) {
    if (!file) return;
    setUploading(true);
    try {
      const form = new FormData();
      form.append("file", file);
      form.append("folder", folder);
      form.append("alt", alt);
      const data = await adminFetch<UploadResponse>("/api/upload", {
        method: "POST",
        body: form,
      });
      const url = data.asset?.url || data.asset?.webpUrl || data.url || "";
      if (!url) throw new Error("Upload succeeded but no URL returned");
      onChange(url);
      if (onAltChange && data.asset?.alt) onAltChange(data.asset.alt);
      toast.success("Image uploaded");
    } catch (err) {
      const message =
        err instanceof AdminApiError || err instanceof Error
          ? err.message
          : "Upload failed";
      toast.error(message);
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between gap-2">
        <label className="text-sm font-medium text-slate-200">{label}</label>
        {value ? (
          <button
            type="button"
            onClick={() => onChange("")}
            className="inline-flex items-center gap-1 text-xs text-rose-300 hover:text-rose-200"
          >
            <Trash2 className="h-3.5 w-3.5" />
            Remove
          </button>
        ) : null}
      </div>

      <div className="overflow-hidden rounded-xl border border-dashed border-slate-700 bg-slate-950/50">
        {value ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={value} alt={alt || label} className="max-h-48 w-full object-contain bg-slate-900" />
        ) : (
          <div className="flex h-36 flex-col items-center justify-center gap-2 text-slate-500">
            <ImagePlus className="h-8 w-8" />
            <span className="text-xs">No image</span>
          </div>
        )}
      </div>

      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          disabled={uploading}
          onClick={() => inputRef.current?.click()}
          className="inline-flex items-center gap-2 rounded-lg border border-slate-600 bg-slate-800 px-3 py-2 text-sm text-slate-100 hover:bg-slate-700 disabled:opacity-50"
        >
          {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <ImagePlus className="h-4 w-4" />}
          {value ? "Replace" : "Upload"}
        </button>
        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/gif"
          className="hidden"
          onChange={(e) => void handleFile(e.target.files?.[0])}
        />
      </div>

      {onAltChange ? (
        <label className="block text-sm text-slate-300">
          Alt text
          <input
            value={alt}
            onChange={(e) => onAltChange(e.target.value)}
            className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-slate-100 outline-none focus:border-cyan-500"
            placeholder="Describe the image"
          />
        </label>
      ) : null}
    </div>
  );
}
