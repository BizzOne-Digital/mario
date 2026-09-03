"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Loader2 } from "lucide-react";
import { AdminPage } from "@/components/admin/AdminPage";
import { SectionEditor, type EditableSection } from "@/components/admin/SectionEditor";
import { useToast } from "@/components/admin/Toast";
import { adminFetch, AdminApiError } from "@/lib/admin-client";
import type { PageDoc, PageSectionDoc, PublishStatus } from "@/lib/types";

interface PagePayload {
  page?: PageDoc & { sections?: PageSectionDoc[] };
}

function normalizeSections(page: PageDoc): EditableSection[] {
  const raw = page.sections;
  if (!Array.isArray(raw) || raw.length === 0) return [];
  if (typeof raw[0] === "string") return [];
  return (raw as PageSectionDoc[])
    .slice()
    .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
    .map((s) => ({
      _id: String(s._id),
      key: s.key,
      eyebrow: s.eyebrow ?? "",
      heading: s.heading ?? "",
      subheading: s.subheading ?? "",
      paragraphs: s.paragraphs ?? [],
      bullets: s.bullets ?? [],
      ctaText: s.ctaText ?? "",
      ctaUrl: s.ctaUrl ?? "",
      image: s.image ?? "",
      backgroundImage: s.backgroundImage ?? "",
      imageAlt: s.imageAlt ?? "",
      layout: s.layout ?? "default",
      visible: s.visible ?? true,
      order: s.order ?? 0,
    }));
}

export default function AdminPageEditorPage() {
  const params = useParams<{ slug: string }>();
  const slug = params.slug;
  const toast = useToast();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [title, setTitle] = useState("");
  const [status, setStatus] = useState<PublishStatus>("draft");
  const [seoTitle, setSeoTitle] = useState("");
  const [seoDescription, setSeoDescription] = useState("");
  const [ogImage, setOgImage] = useState("");
  const [sections, setSections] = useState<EditableSection[]>([]);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      setLoading(true);
      try {
        const data = await adminFetch<PagePayload>(`/api/admin/pages/${slug}`);
        if (cancelled || !data.page) return;
        setTitle(data.page.title);
        setStatus(data.page.status);
        setSeoTitle(data.page.seoTitle ?? "");
        setSeoDescription(data.page.seoDescription ?? "");
        setOgImage(data.page.ogImage ?? "");
        setSections(normalizeSections(data.page));
      } catch (err) {
        if (!cancelled) {
          toast.error(err instanceof Error ? err.message : "Failed to load page");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    if (slug) void load();
    return () => {
      cancelled = true;
    };
  }, [slug, toast]);

  async function save(nextStatus?: PublishStatus) {
    setSaving(true);
    try {
      const payload = {
        title,
        status: nextStatus ?? status,
        seoTitle,
        seoDescription,
        ogImage,
        sections: sections.map((s, i) => ({
          key: s.key,
          eyebrow: s.eyebrow,
          heading: s.heading,
          subheading: s.subheading,
          paragraphs: s.paragraphs,
          bullets: s.bullets,
          ctaText: s.ctaText,
          ctaUrl: s.ctaUrl,
          image: s.image,
          backgroundImage: s.backgroundImage,
          imageAlt: s.imageAlt,
          layout: s.layout,
          visible: s.visible,
          order: i,
        })),
      };
      const data = await adminFetch<PagePayload>(`/api/admin/pages/${slug}`, {
        method: "PUT",
        body: JSON.stringify(payload),
      });
      if (data.page) {
        setStatus(data.page.status);
        setSections(normalizeSections(data.page));
      }
      toast.success(nextStatus === "published" ? "Page published" : "Draft saved");
    } catch (err) {
      toast.error(
        err instanceof AdminApiError || err instanceof Error
          ? err.message
          : "Save failed",
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <AdminPage
      title={loading ? "Edit page" : `Edit: ${title || slug}`}
      actions={
        <div className="flex items-center gap-2">
          <Link href="/admin/pages" className="text-sm text-slate-400 hover:text-slate-200">
            Back
          </Link>
          <button
            type="button"
            disabled={saving || loading}
            onClick={() => void save("draft")}
            className="rounded-lg border border-slate-600 px-3 py-1.5 text-sm text-slate-200 hover:bg-slate-800 disabled:opacity-50"
          >
            Save draft
          </button>
          <button
            type="button"
            disabled={saving || loading}
            onClick={() => void save("published")}
            className="inline-flex items-center gap-2 rounded-lg bg-cyan-400 px-3 py-1.5 text-sm font-semibold text-slate-950 hover:bg-cyan-300 disabled:opacity-50"
          >
            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
            Publish
          </button>
        </div>
      }
    >
      {loading ? (
        <p className="text-sm text-slate-400">Loading page…</p>
      ) : (
        <div className="space-y-6">
          <div className="grid gap-4 rounded-xl border border-slate-800 bg-slate-900/60 p-4 md:grid-cols-2">
            <label className="block text-sm text-slate-300">
              Title
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-slate-100 outline-none focus:border-cyan-500"
              />
            </label>
            <label className="block text-sm text-slate-300">
              Status
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as PublishStatus)}
                className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-slate-100 outline-none focus:border-cyan-500"
              >
                <option value="draft">Draft</option>
                <option value="published">Published</option>
              </select>
            </label>
            <label className="block text-sm text-slate-300">
              SEO title
              <input
                value={seoTitle}
                onChange={(e) => setSeoTitle(e.target.value)}
                className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-slate-100 outline-none focus:border-cyan-500"
              />
            </label>
            <label className="block text-sm text-slate-300">
              OG image URL
              <input
                value={ogImage}
                onChange={(e) => setOgImage(e.target.value)}
                className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-slate-100 outline-none focus:border-cyan-500"
              />
            </label>
            <label className="block text-sm text-slate-300 md:col-span-2">
              SEO description
              <textarea
                value={seoDescription}
                onChange={(e) => setSeoDescription(e.target.value)}
                rows={3}
                className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-slate-100 outline-none focus:border-cyan-500"
              />
            </label>
          </div>

          <div>
            <h2 className="mb-3 text-sm font-semibold text-slate-200">Sections</h2>
            <SectionEditor sections={sections} onChange={setSections} />
          </div>
        </div>
      )}
    </AdminPage>
  );
}
