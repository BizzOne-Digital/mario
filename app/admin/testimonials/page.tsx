"use client";

import { FormEvent, useCallback, useEffect, useState } from "react";
import { AdminPage } from "@/components/admin/AdminPage";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";
import { DataTable } from "@/components/admin/DataTable";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { useToast } from "@/components/admin/Toast";
import { adminFetch, formatDate, idOf } from "@/lib/admin-client";
import type { TestimonialDoc } from "@/lib/types";

interface Payload {
  testimonials?: TestimonialDoc[];
}

const emptyForm = {
  customerName: "",
  reviewText: "",
  service: "",
  location: "",
  rating: 5,
};

export default function AdminTestimonialsPage() {
  const toast = useToast();
  const [rows, setRows] = useState<TestimonialDoc[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = await adminFetch<Payload>("/api/admin/testimonials");
      setRows(data.testimonials ?? []);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to load testimonials");
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    void load();
  }, [load]);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setBusy(true);
    try {
      if (editingId) {
        await adminFetch(`/api/admin/testimonials/${editingId}`, {
          method: "PUT",
          body: JSON.stringify(form),
        });
        toast.success("Testimonial updated");
      } else {
        await adminFetch("/api/admin/testimonials", {
          method: "POST",
          body: JSON.stringify({ ...form, approved: true, published: true }),
        });
        toast.success("Testimonial created");
      }
      setForm(emptyForm);
      setEditingId(null);
      await load();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Save failed");
    } finally {
      setBusy(false);
    }
  }

  async function patch(id: string, body: Partial<TestimonialDoc>) {
    try {
      await adminFetch(`/api/admin/testimonials/${id}`, {
        method: "PUT",
        body: JSON.stringify(body),
      });
      await load();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Update failed");
    }
  }

  async function confirmDelete() {
    if (!deleteId) return;
    setBusy(true);
    try {
      await adminFetch(`/api/admin/testimonials/${deleteId}`, { method: "DELETE" });
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
    <AdminPage title="Testimonials">
      <form
        onSubmit={(e) => void onSubmit(e)}
        className="grid gap-3 rounded-xl border border-slate-800 bg-slate-900/60 p-4 md:grid-cols-2"
      >
        <h2 className="text-sm font-semibold text-slate-200 md:col-span-2">
          {editingId ? "Edit testimonial" : "Add testimonial"}
        </h2>
        <label className="block text-sm text-slate-300">
          Customer name
          <input
            required
            value={form.customerName}
            onChange={(e) => setForm((f) => ({ ...f, customerName: e.target.value }))}
            className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-slate-100 outline-none focus:border-cyan-500"
          />
        </label>
        <label className="block text-sm text-slate-300">
          Rating
          <input
            type="number"
            min={1}
            max={5}
            value={form.rating}
            onChange={(e) => setForm((f) => ({ ...f, rating: Number(e.target.value) || 5 }))}
            className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-slate-100 outline-none focus:border-cyan-500"
          />
        </label>
        <label className="block text-sm text-slate-300">
          Service
          <input
            value={form.service}
            onChange={(e) => setForm((f) => ({ ...f, service: e.target.value }))}
            className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-slate-100 outline-none focus:border-cyan-500"
          />
        </label>
        <label className="block text-sm text-slate-300">
          Location
          <input
            value={form.location}
            onChange={(e) => setForm((f) => ({ ...f, location: e.target.value }))}
            className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-slate-100 outline-none focus:border-cyan-500"
          />
        </label>
        <label className="block text-sm text-slate-300 md:col-span-2">
          Review
          <textarea
            required
            rows={3}
            value={form.reviewText}
            onChange={(e) => setForm((f) => ({ ...f, reviewText: e.target.value }))}
            className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-slate-100 outline-none focus:border-cyan-500"
          />
        </label>
        <div className="flex gap-2 md:col-span-2">
          <button
            type="submit"
            disabled={busy}
            className="rounded-lg bg-cyan-400 px-4 py-2 text-sm font-semibold text-slate-950 disabled:opacity-50"
          >
            {editingId ? "Update" : "Create"}
          </button>
          {editingId ? (
            <button
              type="button"
              onClick={() => {
                setEditingId(null);
                setForm(emptyForm);
              }}
              className="rounded-lg border border-slate-600 px-4 py-2 text-sm text-slate-200"
            >
              Cancel
            </button>
          ) : null}
        </div>
      </form>

      <DataTable
        loading={loading}
        rows={rows}
        rowKey={(row) => idOf(row)}
        empty="No testimonials yet."
        columns={[
          {
            key: "customer",
            header: "Customer",
            render: (row) => (
              <div>
                <p className="font-medium text-slate-100">{row.customerName}</p>
                <p className="line-clamp-2 text-xs text-slate-400">{row.reviewText}</p>
              </div>
            ),
          },
          {
            key: "meta",
            header: "Meta",
            render: (row) => (
              <span className="text-slate-400">
                {row.rating}/5 · {row.service || "—"} · {formatDate(row.createdAt)}
              </span>
            ),
          },
          {
            key: "flags",
            header: "Status",
            render: (row) => (
              <div className="flex flex-wrap gap-1">
                <StatusBadge status={row.approved ? "approved" : "pending"} />
                {row.featured ? <StatusBadge status="featured" /> : null}
                <StatusBadge status={row.published ? "published" : "draft"} />
              </div>
            ),
          },
          {
            key: "actions",
            header: "",
            className: "text-right",
            render: (row) => (
              <div className="flex flex-wrap justify-end gap-2 text-sm">
                <button
                  type="button"
                  onClick={() =>
                    void patch(idOf(row), { approved: !row.approved })
                  }
                  className="text-slate-300 hover:text-slate-100"
                >
                  {row.approved ? "Unapprove" : "Approve"}
                </button>
                <button
                  type="button"
                  onClick={() =>
                    void patch(idOf(row), { featured: !row.featured })
                  }
                  className="text-amber-300"
                >
                  {row.featured ? "Unfeature" : "Feature"}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setEditingId(idOf(row));
                    setForm({
                      customerName: row.customerName,
                      reviewText: row.reviewText,
                      service: row.service,
                      location: row.location,
                      rating: row.rating,
                    });
                  }}
                  className="text-cyan-300"
                >
                  Edit
                </button>
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
        title="Delete testimonial?"
        message="This cannot be undone."
        loading={busy}
        onCancel={() => setDeleteId(null)}
        onConfirm={() => void confirmDelete()}
      />
    </AdminPage>
  );
}
