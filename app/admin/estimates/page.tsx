"use client";

import { useEffect, useState } from "react";
import { AdminPage } from "@/components/admin/AdminPage";
import { DataTable } from "@/components/admin/DataTable";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { adminFetch, formatDate, idOf } from "@/lib/admin-client";
import type { EstimateRequestDoc, EstimateStatus } from "@/lib/types";

interface Payload {
  estimates?: EstimateRequestDoc[];
}

const STATUSES: Array<"all" | EstimateStatus> = [
  "all",
  "new",
  "reviewing",
  "quoted",
  "scheduled",
  "completed",
  "cancelled",
];

export default function AdminEstimatesPage() {
  const [rows, setRows] = useState<EstimateRequestDoc[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [status, setStatus] = useState<"all" | EstimateStatus>("all");
  const [selected, setSelected] = useState<EstimateRequestDoc | null>(null);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      setLoading(true);
      setError("");
      try {
        const qs = status === "all" ? "" : `?status=${status}`;
        const data = await adminFetch<Payload>(`/api/admin/estimates${qs}`);
        if (!cancelled) setRows(data.estimates ?? []);
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
    <AdminPage title="Estimate Requests">
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
        empty="No estimate requests found."
        columns={[
          {
            key: "ref",
            header: "Request",
            render: (row) => (
              <div>
                <p className="font-mono text-xs text-cyan-300">{row.reference}</p>
                <p className="font-medium text-slate-100">{row.name}</p>
                <p className="text-xs text-slate-400">
                  {row.email} · {row.phone}
                </p>
              </div>
            ),
          },
          {
            key: "job",
            header: "Job",
            render: (row) => (
              <span className="text-slate-300">
                {row.service}
                <span className="block text-xs text-slate-500">
                  {row.requestType} · {row.location}
                </span>
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
            <h3 className="font-mono text-sm text-cyan-300">{selected.reference}</h3>
            <p className="mt-1 text-lg font-semibold text-slate-50">{selected.name}</p>
            <dl className="mt-4 space-y-2 text-sm">
              <div>
                <dt className="text-slate-500">Contact</dt>
                <dd>
                  {selected.email} · {selected.phone}
                </dd>
              </div>
              <div>
                <dt className="text-slate-500">Service</dt>
                <dd>
                  {selected.service} · {selected.requestType} · {selected.urgency}
                </dd>
              </div>
              <div>
                <dt className="text-slate-500">Location</dt>
                <dd>
                  {selected.address || selected.location}
                  {selected.city ? `, ${selected.city}` : ""}
                </dd>
              </div>
              <div>
                <dt className="text-slate-500">Details</dt>
                <dd className="whitespace-pre-wrap text-slate-200">
                  {selected.projectDescription || selected.details || "—"}
                </dd>
              </div>
              {selected.photos?.length ? (
                <div>
                  <dt className="text-slate-500">Photos</dt>
                  <dd className="mt-1 flex flex-wrap gap-2">
                    {selected.photos.map((url) => (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img key={url} src={url} alt="" className="h-16 w-16 rounded object-cover" />
                    ))}
                  </dd>
                </div>
              ) : null}
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
