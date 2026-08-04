"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ImagePlus, Loader2, Trash2 } from "lucide-react";
import { AdminPage } from "@/components/admin/AdminPage";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";
import { useToast } from "@/components/admin/Toast";
import { adminFetch, formatDate, idOf } from "@/lib/admin-client";
import type { MediaAssetDoc } from "@/lib/types";

interface Payload {
  media?: MediaAssetDoc[];
}

interface UploadResponse {
  asset?: MediaAssetDoc;
}

export default function AdminMediaPage() {
  const toast = useToast();
  const inputRef = useRef<HTMLInputElement>(null);
  const [rows, setRows] = useState<MediaAssetDoc[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [alt, setAlt] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = await adminFetch<Payload>("/api/admin/media");
      setRows(data.media ?? []);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to load media");
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    void load();
  }, [load]);

  async function handleUpload(file: File | undefined) {
    if (!file) return;
    setUploading(true);
    try {
      const form = new FormData();
      form.append("file", file);
      form.append("folder", "media");
      form.append("alt", alt);
      await adminFetch<UploadResponse>("/api/upload", {
        method: "POST",
        body: form,
      });
      toast.success("Uploaded");
      setAlt("");
      await load();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  async function confirmDelete() {
    if (!deleteId) return;
    setBusy(true);
    try {
      await adminFetch(`/api/admin/media?id=${encodeURIComponent(deleteId)}`, {
        method: "DELETE",
      });
      toast.success("Deleted");
      setDeleteId(null);
      await load();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Delete failed");
    } finally {
      setBusy(false);
    }
  }

  return (
    <AdminPage title="Media">
      <div className="flex flex-wrap items-end gap-3 rounded-xl border border-slate-800 bg-slate-900/60 p-4">
        <label className="block min-w-[200px] flex-1 text-sm text-slate-300">
          Alt text for next upload
          <input
            value={alt}
            onChange={(e) => setAlt(e.target.value)}
            className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-slate-100 outline-none focus:border-cyan-500"
          />
        </label>
        <button
          type="button"
          disabled={uploading}
          onClick={() => inputRef.current?.click()}
          className="inline-flex items-center gap-2 rounded-lg bg-cyan-400 px-4 py-2 text-sm font-semibold text-slate-950 disabled:opacity-50"
        >
          {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <ImagePlus className="h-4 w-4" />}
          Upload
        </button>
        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/gif"
          className="hidden"
          onChange={(e) => void handleUpload(e.target.files?.[0])}
        />
      </div>

      {loading ? (
        <p className="text-sm text-slate-400">Loading…</p>
      ) : rows.length === 0 ? (
        <p className="text-sm text-slate-500">No media assets yet.</p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {rows.map((asset) => (
            <article
              key={idOf(asset)}
              className="overflow-hidden rounded-xl border border-slate-800 bg-slate-900/60"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={asset.webpUrl || asset.url}
                alt={asset.alt || asset.filename}
                className="h-36 w-full object-cover bg-slate-950"
              />
              <div className="space-y-2 p-3 text-sm">
                <p className="truncate font-medium text-slate-100">{asset.filename}</p>
                <p className="text-xs text-slate-500">
                  {asset.folder} · {Math.round((asset.size || 0) / 1024)} KB ·{" "}
                  {formatDate(asset.createdAt)}
                </p>
                <p className="truncate text-xs text-slate-400">{asset.alt || "No alt text"}</p>
                <div className="flex items-center justify-between gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      void navigator.clipboard.writeText(asset.url);
                      toast.success("URL copied");
                    }}
                    className="text-xs text-cyan-300"
                  >
                    Copy URL
                  </button>
                  <button
                    type="button"
                    onClick={() => setDeleteId(idOf(asset))}
                    className="inline-flex items-center gap-1 text-xs text-rose-300"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                    Delete
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}

      <ConfirmDialog
        open={Boolean(deleteId)}
        title="Delete media asset?"
        message="The file will be removed from storage and the media library."
        loading={busy}
        onCancel={() => setDeleteId(null)}
        onConfirm={() => void confirmDelete()}
      />
    </AdminPage>
  );
}
