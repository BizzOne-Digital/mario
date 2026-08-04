"use client";

import { FormEvent, useCallback, useEffect, useState } from "react";
import { AdminPage } from "@/components/admin/AdminPage";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";
import { DataTable } from "@/components/admin/DataTable";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { useToast } from "@/components/admin/Toast";
import { adminFetch, idOf } from "@/lib/admin-client";
import type { FAQDoc } from "@/lib/types";

interface Payload {
  faqs?: FAQDoc[];
}

const emptyForm = {
  question: "",
  answer: "",
  category: "general",
  serviceSlug: "",
  showOnFaqPage: true,
  showOnServicePage: false,
  published: true,
  order: 0,
};

export default function AdminFaqsPage() {
  const toast = useToast();
  const [rows, setRows] = useState<FAQDoc[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = await adminFetch<Payload>("/api/admin/faqs");
      setRows(data.faqs ?? []);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to load FAQs");
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
        await adminFetch(`/api/admin/faqs/${editingId}`, {
          method: "PUT",
          body: JSON.stringify(form),
        });
        toast.success("FAQ updated");
      } else {
        await adminFetch("/api/admin/faqs", {
          method: "POST",
          body: JSON.stringify(form),
        });
        toast.success("FAQ created");
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

  async function confirmDelete() {
    if (!deleteId) return;
    setBusy(true);
    try {
      await adminFetch(`/api/admin/faqs/${deleteId}`, { method: "DELETE" });
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
    <AdminPage title="FAQs">
      <form
        onSubmit={(e) => void onSubmit(e)}
        className="grid gap-3 rounded-xl border border-slate-800 bg-slate-900/60 p-4 md:grid-cols-2"
      >
        <h2 className="text-sm font-semibold text-slate-200 md:col-span-2">
          {editingId ? "Edit FAQ" : "Add FAQ"}
        </h2>
        <label className="block text-sm text-slate-300 md:col-span-2">
          Question
          <input
            required
            value={form.question}
            onChange={(e) => setForm((f) => ({ ...f, question: e.target.value }))}
            className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-slate-100 outline-none focus:border-cyan-500"
          />
        </label>
        <label className="block text-sm text-slate-300 md:col-span-2">
          Answer
          <textarea
            required
            rows={4}
            value={form.answer}
            onChange={(e) => setForm((f) => ({ ...f, answer: e.target.value }))}
            className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-slate-100 outline-none focus:border-cyan-500"
          />
        </label>
        <label className="block text-sm text-slate-300">
          Category
          <input
            required
            value={form.category}
            onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
            className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-slate-100 outline-none focus:border-cyan-500"
          />
        </label>
        <label className="block text-sm text-slate-300">
          Service slug
          <input
            value={form.serviceSlug}
            onChange={(e) => setForm((f) => ({ ...f, serviceSlug: e.target.value }))}
            className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-slate-100 outline-none focus:border-cyan-500"
          />
        </label>
        <label className="block text-sm text-slate-300">
          Order
          <input
            type="number"
            value={form.order}
            onChange={(e) => setForm((f) => ({ ...f, order: Number(e.target.value) || 0 }))}
            className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-slate-100 outline-none focus:border-cyan-500"
          />
        </label>
        <div className="flex flex-wrap gap-4 text-sm text-slate-300">
          <label className="inline-flex items-center gap-2">
            <input
              type="checkbox"
              checked={form.showOnFaqPage}
              onChange={(e) => setForm((f) => ({ ...f, showOnFaqPage: e.target.checked }))}
            />
            FAQ page
          </label>
          <label className="inline-flex items-center gap-2">
            <input
              type="checkbox"
              checked={form.showOnServicePage}
              onChange={(e) => setForm((f) => ({ ...f, showOnServicePage: e.target.checked }))}
            />
            Service page
          </label>
          <label className="inline-flex items-center gap-2">
            <input
              type="checkbox"
              checked={form.published}
              onChange={(e) => setForm((f) => ({ ...f, published: e.target.checked }))}
            />
            Published
          </label>
        </div>
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
              className="rounded-lg border border-slate-600 px-4 py-2 text-sm"
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
        empty="No FAQs yet."
        columns={[
          {
            key: "q",
            header: "Question",
            render: (row) => (
              <div>
                <p className="font-medium text-slate-100">{row.question}</p>
                <p className="line-clamp-2 text-xs text-slate-400">{row.answer}</p>
              </div>
            ),
          },
          {
            key: "cat",
            header: "Category",
            render: (row) => <span className="text-slate-400">{row.category}</span>,
          },
          {
            key: "status",
            header: "Status",
            render: (row) => (
              <StatusBadge status={row.published ? "published" : "draft"} />
            ),
          },
          {
            key: "actions",
            header: "",
            className: "text-right",
            render: (row) => (
              <div className="flex justify-end gap-3 text-sm">
                <button
                  type="button"
                  onClick={() => {
                    setEditingId(idOf(row));
                    setForm({
                      question: row.question,
                      answer: row.answer,
                      category: row.category,
                      serviceSlug: row.serviceSlug,
                      showOnFaqPage: row.showOnFaqPage,
                      showOnServicePage: row.showOnServicePage,
                      published: row.published,
                      order: row.order,
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
        title="Delete FAQ?"
        message="This cannot be undone."
        loading={busy}
        onCancel={() => setDeleteId(null)}
        onConfirm={() => void confirmDelete()}
      />
    </AdminPage>
  );
}
