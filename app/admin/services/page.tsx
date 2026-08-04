"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { ArrowDown, ArrowUp, Plus } from "lucide-react";
import { AdminPage } from "@/components/admin/AdminPage";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";
import { DataTable } from "@/components/admin/DataTable";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { useToast } from "@/components/admin/Toast";
import { adminFetch, idOf } from "@/lib/admin-client";
import type { ServiceDoc } from "@/lib/types";

interface ServicesPayload {
  services?: ServiceDoc[];
}

export default function AdminServicesPage() {
  const toast = useToast();
  const [services, setServices] = useState<ServiceDoc[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = await adminFetch<ServicesPayload>("/api/admin/services");
      setServices(data.services ?? []);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to load services");
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    void load();
  }, [load]);

  async function toggleActive(service: ServiceDoc) {
    try {
      await adminFetch(`/api/admin/services/${idOf(service)}`, {
        method: "PUT",
        body: JSON.stringify({ active: !service.active }),
      });
      toast.success(service.active ? "Service deactivated" : "Service activated");
      await load();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Update failed");
    }
  }

  async function move(index: number, dir: -1 | 1) {
    const target = index + dir;
    if (target < 0 || target >= services.length) return;
    const a = services[index];
    const b = services[target];
    const orderA = a.displayOrder;
    const orderB = b.displayOrder;
    setBusy(true);
    try {
      await Promise.all([
        adminFetch(`/api/admin/services/${idOf(a)}`, {
          method: "PUT",
          body: JSON.stringify({ displayOrder: orderB }),
        }),
        adminFetch(`/api/admin/services/${idOf(b)}`, {
          method: "PUT",
          body: JSON.stringify({ displayOrder: orderA }),
        }),
      ]);
      await load();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Reorder failed");
    } finally {
      setBusy(false);
    }
  }

  async function confirmDelete() {
    if (!deleteId) return;
    setBusy(true);
    try {
      await adminFetch(`/api/admin/services/${deleteId}`, { method: "DELETE" });
      toast.success("Service deleted");
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
      title="Services"
      actions={
        <Link
          href="/admin/services/new"
          className="inline-flex items-center gap-2 rounded-lg bg-cyan-400 px-3 py-1.5 text-sm font-semibold text-slate-950 hover:bg-cyan-300"
        >
          <Plus className="h-4 w-4" />
          New service
        </Link>
      }
    >
      <DataTable
        loading={loading}
        rows={services}
        rowKey={(row) => idOf(row)}
        empty="No services yet."
        columns={[
          {
            key: "name",
            header: "Service",
            render: (row) => (
              <div>
                <p className="font-medium text-slate-100">{row.name}</p>
                <p className="font-mono text-xs text-slate-500">/{row.slug}</p>
              </div>
            ),
          },
          {
            key: "order",
            header: "Order",
            render: (row) => {
              const index = services.findIndex((s) => idOf(s) === idOf(row));
              return (
                <div className="flex items-center gap-1">
                  <span className="mr-2 text-slate-400">{row.displayOrder}</span>
                  <button
                    type="button"
                    disabled={busy || index <= 0}
                    onClick={() => void move(index, -1)}
                    className="rounded border border-slate-700 p-1 text-slate-300 disabled:opacity-30"
                    aria-label="Move up"
                  >
                    <ArrowUp className="h-3.5 w-3.5" />
                  </button>
                  <button
                    type="button"
                    disabled={busy || index >= services.length - 1}
                    onClick={() => void move(index, 1)}
                    className="rounded border border-slate-700 p-1 text-slate-300 disabled:opacity-30"
                    aria-label="Move down"
                  >
                    <ArrowDown className="h-3.5 w-3.5" />
                  </button>
                </div>
              );
            },
          },
          {
            key: "flags",
            header: "Status",
            render: (row) => (
              <div className="flex flex-wrap gap-1">
                <StatusBadge status={row.active ? "active" : "inactive"} />
                {row.published ? <StatusBadge status="published" /> : <StatusBadge status="draft" />}
                {row.featured ? <StatusBadge status="featured" /> : null}
              </div>
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
                  onClick={() => void toggleActive(row)}
                  className="text-slate-300 hover:text-slate-100"
                >
                  {row.active ? "Deactivate" : "Activate"}
                </button>
                <Link
                  href={`/admin/services/${idOf(row)}`}
                  className="font-medium text-cyan-300 hover:text-cyan-200"
                >
                  Edit
                </Link>
                <button
                  type="button"
                  onClick={() => setDeleteId(idOf(row))}
                  className="text-rose-300 hover:text-rose-200"
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
        title="Delete service?"
        message="This permanently removes the service and cannot be undone."
        loading={busy}
        onCancel={() => setDeleteId(null)}
        onConfirm={() => void confirmDelete()}
      />
    </AdminPage>
  );
}
