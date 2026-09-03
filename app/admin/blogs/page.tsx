"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Plus } from "lucide-react";
import { AdminPage } from "@/components/admin/AdminPage";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";
import { DataTable } from "@/components/admin/DataTable";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { useToast } from "@/components/admin/Toast";
import { adminFetch, formatDate, idOf } from "@/lib/admin-client";
import type { BlogPostDoc } from "@/lib/types";

interface Payload {
  blogs?: BlogPostDoc[];
}

export default function AdminBlogsPage() {
  const toast = useToast();
  const router = useRouter();
  const [rows, setRows] = useState<BlogPostDoc[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [creating, setCreating] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = await adminFetch<Payload>("/api/admin/blogs");
      setRows(data.blogs ?? []);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to load blogs");
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    void load();
  }, [load]);

  async function createDraft() {
    setCreating(true);
    try {
      const data = await adminFetch<{ blog?: BlogPostDoc }>("/api/admin/blogs", {
        method: "POST",
        body: JSON.stringify({
          title: "Untitled post",
          content: "<p>Start writing…</p>",
          status: "draft",
        }),
      });
      const id = data.blog ? idOf(data.blog) : "";
      toast.success("Draft created");
      if (id) router.push(`/admin/blogs/${id}`);
      else await load();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not create post");
    } finally {
      setCreating(false);
    }
  }

  async function confirmDelete() {
    if (!deleteId) return;
    setBusy(true);
    try {
      await adminFetch(`/api/admin/blogs/${deleteId}`, { method: "DELETE" });
      toast.success("Post deleted");
      setDeleteId(null);
      await load();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Delete failed");
    } finally {
      setBusy(false);
    }
  }

  return (
    <AdminPage
      title="Blogs"
      actions={
        <button
          type="button"
          disabled={creating}
          onClick={() => void createDraft()}
          className="inline-flex items-center gap-2 rounded-lg bg-cyan-400 px-3 py-1.5 text-sm font-semibold text-slate-950 disabled:opacity-50"
        >
          <Plus className="h-4 w-4" />
          New post
        </button>
      }
    >
      <DataTable
        loading={loading}
        rows={rows}
        rowKey={(row) => idOf(row)}
        empty="No blog posts yet."
        columns={[
          {
            key: "title",
            header: "Title",
            render: (row) => (
              <div>
                <p className="font-medium text-slate-100">{row.title}</p>
                <p className="font-mono text-xs text-slate-500">/{row.slug}</p>
              </div>
            ),
          },
          {
            key: "status",
            header: "Status",
            render: (row) => <StatusBadge status={row.status} />,
          },
          {
            key: "updated",
            header: "Updated",
            render: (row) => (
              <span className="text-slate-400">{formatDate(row.updatedAt)}</span>
            ),
          },
          {
            key: "actions",
            header: "",
            className: "text-right",
            render: (row) => (
              <div className="flex justify-end gap-3 text-sm">
                <Link
                  href={`/admin/blogs/${idOf(row)}`}
                  className="font-medium text-cyan-300 hover:text-cyan-200"
                >
                  Edit
                </Link>
                <button
                  type="button"
                  onClick={() => setDeleteId(idOf(row))}
                  className="text-rose-300"
                >
                  Delete
                </button>
              </div>
            ),
          },
        ]}
      />

      <ConfirmDialog
        open={Boolean(deleteId)}
        title="Delete blog post?"
        message="This permanently removes the post."
        loading={busy}
        onCancel={() => setDeleteId(null)}
        onConfirm={() => void confirmDelete()}
      />
    </AdminPage>
  );
}
