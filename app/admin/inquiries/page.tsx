"use client";

import { useEffect, useState } from "react";
import { AdminPage } from "@/components/admin/AdminPage";
import { DataTable } from "@/components/admin/DataTable";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { adminFetch, formatDate, idOf } from "@/lib/admin-client";
import type { InquiryDoc, InquiryStatus } from "@/lib/types";

interface Payload {
  inquiries?: InquiryDoc[];
}

const STATUSES: Array<"all" | InquiryStatus> = [
  "all",
  "new",
  "contacted",
  "scheduled",
  "closed",
  "spam",
];

export default function AdminInquiriesPage() {
  const [rows, setRows] = useState<InquiryDoc[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [status, setStatus] = useState<"all" | InquiryStatus>("all");
  const [selected, setSelected] = useState<InquiryDoc | null>(null);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      setLoading(true);
      setError("");
      try {
        const qs = status === "all" ? "" : `?status=${status}`;
        const data = await adminFetch<Payload>(`/api/admin/inquiries${qs}`);
        if (!cancelled) setRows(data.inquiries ?? []);
      } catch (err) {
        if (!cancelled) setError(err instanceof Error ? err.message : "Failed to load");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    void load();
    return () => {
      cancelled = true;
    };
  }, [status]);

  return (
    <AdminPage title="Inquiries">
      <div className="flex flex-wrap gap-2">
        {STATUSES.map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => setStatus(s)}
            className={`rounded-lg px-3 py-1.5 text-sm capitalize ${
              status === s
                ? "bg-cyan-500/15 text-cyan-200"
                : "border border-slate-700 text-slate-300 hover:bg-slate-900"
            }`}
          >
            {s}
          </button>
        ))}
      </div>

      {error ? (
        <div className="rounded-lg border border-rose-500/40 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">
          {error}
        </div>
      ) : null}

      <DataTable
        loading={loading}
        rows={rows}
        rowKey={(row) => idOf(row)}
        empty="No inquiries found."
        columns={[
          {
            key: "name",
            header: "Contact",
            render: (row) => (
              <div>
                <p className="font-medium text-slate-100">{row.fullName}</p>
                <p className="text-xs text-slate-400">
                  {row.email} · {row.phone}
                </p>
              </div>
            ),
          },
          {
            key: "service",
            header: "Service",
            render: (row) => (
              <span className="text-slate-300">
                {row.service}
                <span className="block text-xs text-slate-500">{row.location}</span>
              </span>
            ),
          },
          {
            key: "status",
            header: "Status",
            render: (row) => <StatusBadge status={row.status} />,
          },
          {
            key: "date",
            header: "Received",
            render: (row) => (
              <span className="text-slate-400">{formatDate(row.createdAt)}</span>
            ),
          },
          {
            key: "actions",
            header: "",
            className: "text-right",
            render: (row) => (
              <button
                type="button"
                onClick={() => setSelected(row)}
                className="text-sm text-cyan-300 hover:text-cyan-200"
              >
                View
              </button>
            ),
          },
        ]}
      />

      {selected ? (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <button
            type="button"
            className="absolute inset-0 bg-black/60"
            aria-label="Close"
            onClick={() => setSelected(null)}
          />
          <div className="relative max-h-[85vh] w-full max-w-lg overflow-y-auto rounded-xl border border-slate-700 bg-slate-900 p-5 shadow-2xl">
            <h3 className="text-lg font-semibold text-slate-50">{selected.fullName}</h3>
            <p className="mt-1 text-sm text-slate-400">
              {selected.email} · {selected.phone}
            </p>
            <dl className="mt-4 space-y-2 text-sm">
              <div>
                <dt className="text-slate-500">Service</dt>
                <dd>{selected.service}</dd>
              </div>
              <div>
                <dt className="text-slate-500">Property</dt>
                <dd>
                  {selected.propertyType} · {selected.location}
                </dd>
              </div>
              <div>
                <dt className="text-slate-500">Preferred</dt>
                <dd>
                  {selected.preferredMethod}
                  {selected.preferredDate ? ` · ${selected.preferredDate}` : ""}
                </dd>
              </div>
              <div>
                <dt className="text-slate-500">Message</dt>
                <dd className="whitespace-pre-wrap text-slate-200">{selected.message}</dd>
              </div>
            </dl>
            <button
              type="button"
              onClick={() => setSelected(null)}
              className="mt-5 rounded-lg border border-slate-600 px-4 py-2 text-sm"
            >
              Close
            </button>
          </div>
        </div>
      ) : null}
    </AdminPage>
  );
}
