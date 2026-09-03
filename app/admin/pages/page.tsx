"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AdminPage } from "@/components/admin/AdminPage";
import { DataTable } from "@/components/admin/DataTable";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { adminFetch, formatDate, idOf } from "@/lib/admin-client";
import type { PageDoc } from "@/lib/types";

interface PagesPayload {
  pages?: PageDoc[];
}

export default function AdminPagesListPage() {
  const [pages, setPages] = useState<PageDoc[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const data = await adminFetch<PagesPayload>("/api/admin/pages");
        if (!cancelled) setPages(data.pages ?? []);
      } catch (err) {
        if (!cancelled) setError(err instanceof Error ? err.message : "Failed to load pages");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    void load();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <AdminPage title="Pages">
      {error ? (
        <div className="rounded-lg border border-rose-500/40 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">
          {error}
        </div>
      ) : null}
      <DataTable
        loading={loading}
        rows={pages}
        rowKey={(row) => idOf(row) || row.slug}
        empty="No CMS pages found. Seed the database to create default pages."
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
              <Link
                href={`/admin/pages/${row.slug}`}
                className="text-sm font-medium text-cyan-300 hover:text-cyan-200"
              >
                Edit
              </Link>
            ),
          },
        ]}
      />
    </AdminPage>
  );
}
