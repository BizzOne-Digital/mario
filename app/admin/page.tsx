"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  AlertTriangle,
  ClipboardList,
  HardDrive,
  Inbox,
  Newspaper,
  Wrench,
} from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { AdminPage } from "@/components/admin/AdminPage";
import { MissingEmailBanner } from "@/components/admin/MissingEmailBanner";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { adminFetch, formatDate, idOf } from "@/lib/admin-client";
import type {
  EstimateRequestDoc,
  InquiryDoc,
  SiteSettingsDoc,
} from "@/lib/types";

interface DashboardCounts {
  services?: number;
  publishedServices?: number;
  inquiries?: number;
  newInquiries?: number;
  estimates?: number;
  newEstimates?: number;
  testimonials?: number;
  pendingTestimonials?: number;
  faqs?: number;
  galleryImages?: number;
  blogs?: number;
  publishedBlogs?: number;
  media?: number;
}

interface DashboardPayload {
  counts?: DashboardCounts;
  recentInquiries?: InquiryDoc[];
  recentEstimates?: EstimateRequestDoc[];
}

interface SettingsPayload {
  settings?: SiteSettingsDoc;
}

function StatCard({
  label,
  value,
  hint,
  href,
  icon: Icon,
}: {
  label: string;
  value: number | string;
  hint?: string;
  href?: string;
  icon: typeof Wrench;
}) {
  const body = (
    <div className="rounded-xl border border-slate-800 bg-slate-900/70 p-4 transition hover:border-slate-700">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-wide text-slate-400">{label}</p>
          <p className="mt-2 text-2xl font-semibold text-slate-50">{value}</p>
          {hint ? <p className="mt-1 text-xs text-slate-500">{hint}</p> : null}
        </div>
        <div className="rounded-lg bg-cyan-500/10 p-2 text-cyan-300">
          <Icon className="h-5 w-5" />
        </div>
      </div>
    </div>
  );
  return href ? <Link href={href}>{body}</Link> : body;
}

export default function AdminDashboardPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [counts, setCounts] = useState<DashboardCounts>({});
  const [recentInquiries, setRecentInquiries] = useState<InquiryDoc[]>([]);
  const [recentEstimates, setRecentEstimates] = useState<EstimateRequestDoc[]>([]);
  const [settings, setSettings] = useState<SiteSettingsDoc | null>(null);

  const showStorageWarning =
    process.env.NODE_ENV === "production" ||
    Boolean(process.env.NEXT_PUBLIC_VERCEL_ENV);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      setLoading(true);
      setError("");
      try {
        const [dash, settingsRes] = await Promise.all([
          adminFetch<DashboardPayload>("/api/admin/dashboard"),
          adminFetch<SettingsPayload>("/api/admin/settings"),
        ]);
        if (cancelled) return;
        setCounts(dash.counts ?? {});
        setRecentInquiries(dash.recentInquiries ?? []);
        setRecentEstimates(dash.recentEstimates ?? []);
        setSettings(settingsRes.settings ?? null);
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "Failed to load dashboard");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    void load();
    return () => {
      cancelled = true;
    };
  }, []);

  const chartData = useMemo(
    () => [
      { name: "Services", total: counts.services ?? 0, published: counts.publishedServices ?? 0 },
      { name: "Inquiries", total: counts.inquiries ?? 0, published: counts.newInquiries ?? 0 },
      { name: "Estimates", total: counts.estimates ?? 0, published: counts.newEstimates ?? 0 },
      { name: "Blogs", total: counts.blogs ?? 0, published: counts.publishedBlogs ?? 0 },
      {
        name: "Testimonials",
        total: counts.testimonials ?? 0,
        published: counts.pendingTestimonials ?? 0,
      },
    ],
    [counts],
  );

  return (
    <AdminPage title="Dashboard">
      {error ? (
        <div className="rounded-lg border border-rose-500/40 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">
          {error}
        </div>
      ) : null}

      <MissingEmailBanner
        email={settings?.email}
        contactRecipient={settings?.contactRecipient}
      />

      {showStorageWarning ? (
        <div className="flex items-start gap-3 rounded-xl border border-orange-500/40 bg-orange-500/10 px-4 py-3 text-sm text-orange-100">
          <HardDrive className="mt-0.5 h-5 w-5 shrink-0 text-orange-300" />
          <div>
            <p className="font-medium text-orange-50">Upload storage warning</p>
            <p className="mt-1 text-orange-100/90">
              Local filesystem uploads are ephemeral on Vercel/production. Media may disappear after
              redeploys unless you configure durable object storage.
            </p>
          </div>
        </div>
      ) : null}

      {loading ? (
        <p className="text-sm text-slate-400">Loading dashboard…</p>
      ) : (
        <>
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <StatCard
              label="Services"
              value={counts.publishedServices ?? 0}
              hint={`${counts.services ?? 0} total`}
              href="/admin/services"
              icon={Wrench}
            />
            <StatCard
              label="New inquiries"
              value={counts.newInquiries ?? 0}
              hint={`${counts.inquiries ?? 0} total`}
              href="/admin/inquiries"
              icon={Inbox}
            />
            <StatCard
              label="New estimates"
              value={counts.newEstimates ?? 0}
              hint={`${counts.estimates ?? 0} total`}
              href="/admin/estimates"
              icon={ClipboardList}
            />
            <StatCard
              label="Published blogs"
              value={counts.publishedBlogs ?? 0}
              hint={`${counts.blogs ?? 0} total`}
              href="/admin/blogs"
              icon={Newspaper}
            />
          </div>

          {(counts.pendingTestimonials ?? 0) > 0 ? (
            <div className="flex items-center gap-2 rounded-lg border border-amber-500/30 bg-amber-500/10 px-3 py-2 text-sm text-amber-100">
              <AlertTriangle className="h-4 w-4" />
              {counts.pendingTestimonials} testimonials awaiting approval
              <Link href="/admin/testimonials" className="ml-auto underline">
                Review
              </Link>
            </div>
          ) : null}

          <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4">
            <h2 className="mb-4 text-sm font-semibold text-slate-200">Overview</h2>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                  <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} />
                  <YAxis stroke="#94a3b8" fontSize={12} allowDecimals={false} />
                  <Tooltip
                    contentStyle={{
                      background: "#0f172a",
                      border: "1px solid #334155",
                      borderRadius: 8,
                    }}
                  />
                  <Bar dataKey="total" name="Total" fill="#22d3ee" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="published" name="Highlight" fill="#64748b" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="grid gap-4 lg:grid-cols-2">
            <section className="rounded-xl border border-slate-800 bg-slate-900/60 p-4">
              <div className="mb-3 flex items-center justify-between">
                <h2 className="text-sm font-semibold text-slate-200">Recent inquiries</h2>
                <Link href="/admin/inquiries" className="text-xs text-cyan-300 hover:text-cyan-200">
                  View all
                </Link>
              </div>
              <ul className="space-y-3">
                {recentInquiries.length === 0 ? (
                  <li className="text-sm text-slate-500">No inquiries yet.</li>
                ) : (
                  recentInquiries.map((item) => (
                    <li
                      key={idOf(item)}
                      className="flex items-start justify-between gap-3 border-b border-slate-800/80 pb-3 last:border-0 last:pb-0"
                    >
                      <div>
                        <p className="text-sm font-medium text-slate-100">{item.fullName}</p>
                        <p className="text-xs text-slate-400">
                          {item.service} · {formatDate(item.createdAt)}
                        </p>
                      </div>
                      <StatusBadge status={item.status} />
                    </li>
                  ))
                )}
              </ul>
            </section>

            <section className="rounded-xl border border-slate-800 bg-slate-900/60 p-4">
              <div className="mb-3 flex items-center justify-between">
                <h2 className="text-sm font-semibold text-slate-200">Recent estimates</h2>
                <Link href="/admin/estimates" className="text-xs text-cyan-300 hover:text-cyan-200">
                  View all
                </Link>
              </div>
              <ul className="space-y-3">
                {recentEstimates.length === 0 ? (
                  <li className="text-sm text-slate-500">No estimate requests yet.</li>
                ) : (
                  recentEstimates.map((item) => (
                    <li
                      key={idOf(item)}
                      className="flex items-start justify-between gap-3 border-b border-slate-800/80 pb-3 last:border-0 last:pb-0"
                    >
                      <div>
                        <p className="text-sm font-medium text-slate-100">
                          {item.name}{" "}
                          <span className="font-mono text-xs text-slate-500">{item.reference}</span>
                        </p>
                        <p className="text-xs text-slate-400">
                          {item.service} · {formatDate(item.createdAt)}
                        </p>
                      </div>
                      <StatusBadge status={item.status} />
                    </li>
                  ))
                )}
              </ul>
            </section>
          </div>
        </>
      )}
    </AdminPage>
  );
}
