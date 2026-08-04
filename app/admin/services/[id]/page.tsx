"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Loader2, Plus, Trash2 } from "lucide-react";
import { AdminPage } from "@/components/admin/AdminPage";
import { ImageUploader } from "@/components/admin/ImageUploader";
import { useToast } from "@/components/admin/Toast";
import { adminFetch } from "@/lib/admin-client";
import type {
  BeforeAfterPair,
  ProcessStep,
  ServiceDetailSection,
  ServiceDoc,
  ServiceFaq,
} from "@/lib/types";

interface ServicePayload {
  service?: ServiceDoc;
}

type Tab = "card" | "detail";

function StringListField({
  label,
  values,
  onChange,
}: {
  label: string;
  values: string[];
  onChange: (next: string[]) => void;
}) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-slate-200">{label}</span>
        <button
          type="button"
          onClick={() => onChange([...values, ""])}
          className="inline-flex items-center gap-1 text-xs text-cyan-300"
        >
          <Plus className="h-3.5 w-3.5" /> Add
        </button>
      </div>
      {values.map((v, i) => (
        <div key={`${label}-${i}`} className="flex gap-2">
          <input
            value={v}
            onChange={(e) => {
              const next = [...values];
              next[i] = e.target.value;
              onChange(next);
            }}
            className="flex-1 rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100 outline-none focus:border-cyan-500"
          />
          <button
            type="button"
            onClick={() => onChange(values.filter((_, idx) => idx !== i))}
            className="rounded-lg border border-slate-700 p-2 text-rose-300"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      ))}
    </div>
  );
}

function fieldClass() {
  return "mt-1 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-slate-100 outline-none focus:border-cyan-500";
}

export default function AdminServiceEditPage() {
  const params = useParams<{ id: string }>();
  const id = params.id;
  const toast = useToast();
  const [tab, setTab] = useState<Tab>("card");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [service, setService] = useState<ServiceDoc | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = await adminFetch<ServicePayload>(`/api/admin/services/${id}`);
      setService(data.service ?? null);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to load service");
    } finally {
      setLoading(false);
    }
  }, [id, toast]);

  useEffect(() => {
    void load();
  }, [load]);

  function patch<K extends keyof ServiceDoc>(key: K, value: ServiceDoc[K]) {
    setService((prev) => (prev ? { ...prev, [key]: value } : prev));
  }

  async function save() {
    if (!service) return;
    setSaving(true);
    try {
      const {
        _id: _ignored,
        createdAt: _c,
        updatedAt: _u,
        ...body
      } = service;
      void _ignored;
      void _c;
      void _u;
      const data = await adminFetch<ServicePayload>(`/api/admin/services/${id}`, {
        method: "PUT",
        body: JSON.stringify(body),
      });
      setService(data.service ?? service);
      toast.success("Service saved");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Save failed");
    } finally {
      setSaving(false);
    }
  }

  if (loading || !service) {
    return (
      <AdminPage title="Edit service">
        <p className="text-sm text-slate-400">{loading ? "Loading…" : "Service not found."}</p>
      </AdminPage>
    );
  }

  const detailSections = service.detailSections ?? [];

  return (
    <AdminPage
      title={`Edit: ${service.name}`}
      actions={
        <div className="flex items-center gap-2">
          <Link href="/admin/services" className="text-sm text-slate-400 hover:text-slate-200">
            Back
          </Link>
          <button
            type="button"
            disabled={saving}
            onClick={() => void save()}
            className="inline-flex items-center gap-2 rounded-lg bg-cyan-400 px-3 py-1.5 text-sm font-semibold text-slate-950 hover:bg-cyan-300 disabled:opacity-50"
          >
            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
            Save
          </button>
        </div>
      }
    >
      <div className="flex gap-2 border-b border-slate-800 pb-3">
        {(
          [
            ["card", "Card / Description"],
            ["detail", "Detail Page"],
          ] as const
        ).map(([key, label]) => (
          <button
            key={key}
            type="button"
            onClick={() => setTab(key)}
            className={`rounded-lg px-3 py-1.5 text-sm ${
              tab === key
                ? "bg-cyan-500/15 text-cyan-200"
                : "text-slate-400 hover:bg-slate-900 hover:text-slate-200"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {tab === "card" ? (
        <div className="grid gap-4 rounded-xl border border-slate-800 bg-slate-900/60 p-4 md:grid-cols-2">
          <label className="block text-sm text-slate-300">
            Name
            <input value={service.name} onChange={(e) => patch("name", e.target.value)} className={fieldClass()} />
          </label>
          <label className="block text-sm text-slate-300">
            Slug
            <input value={service.slug} onChange={(e) => patch("slug", e.target.value)} className={fieldClass()} />
          </label>
          <label className="block text-sm text-slate-300 md:col-span-2">
            Short description
            <textarea
              rows={3}
              value={service.shortDescription}
              onChange={(e) => patch("shortDescription", e.target.value)}
              className={fieldClass()}
            />
          </label>
          <label className="block text-sm text-slate-300">
            Category
            <input value={service.category} onChange={(e) => patch("category", e.target.value)} className={fieldClass()} />
          </label>
          <label className="block text-sm text-slate-300">
            Icon
            <input value={service.icon} onChange={(e) => patch("icon", e.target.value)} className={fieldClass()} />
          </label>
          <label className="block text-sm text-slate-300">
            CTA label
            <input value={service.ctaLabel} onChange={(e) => patch("ctaLabel", e.target.value)} className={fieldClass()} />
          </label>
          <label className="block text-sm text-slate-300">
            Display order
            <input
              type="number"
              value={service.displayOrder}
              onChange={(e) => patch("displayOrder", Number(e.target.value) || 0)}
              className={fieldClass()}
            />
          </label>
          <div className="flex flex-wrap gap-4 text-sm text-slate-300 md:col-span-2">
            {(
              [
                ["active", "Active"],
                ["featured", "Featured"],
                ["published", "Published"],
              ] as const
            ).map(([key, label]) => (
              <label key={key} className="inline-flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={Boolean(service[key])}
                  onChange={(e) => patch(key, e.target.checked)}
                />
                {label}
              </label>
            ))}
          </div>
          <div className="md:col-span-2">
            <ImageUploader
              label="Main image"
              value={service.mainImage}
              alt={service.imageAlt}
              folder="services"
              onChange={(url) => patch("mainImage", url)}
              onAltChange={(alt) => patch("imageAlt", alt)}
            />
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="grid gap-4 rounded-xl border border-slate-800 bg-slate-900/60 p-4 md:grid-cols-2">
            <label className="block text-sm text-slate-300">
              Hero eyebrow
              <input value={service.heroEyebrow} onChange={(e) => patch("heroEyebrow", e.target.value)} className={fieldClass()} />
            </label>
            <label className="block text-sm text-slate-300">
              Hero heading
              <input value={service.heroHeading} onChange={(e) => patch("heroHeading", e.target.value)} className={fieldClass()} />
            </label>
            <label className="block text-sm text-slate-300 md:col-span-2">
              Hero description
              <textarea rows={3} value={service.heroDescription} onChange={(e) => patch("heroDescription", e.target.value)} className={fieldClass()} />
            </label>
            <div className="md:col-span-2">
              <ImageUploader
                label="Hero background"
                value={service.heroBackground}
                folder="services"
                onChange={(url) => patch("heroBackground", url)}
              />
            </div>
            <label className="block text-sm text-slate-300 md:col-span-2">
              Overview
              <textarea rows={4} value={service.overview} onChange={(e) => patch("overview", e.target.value)} className={fieldClass()} />
            </label>
            <label className="block text-sm text-slate-300 md:col-span-2">
              Repair vs replace
              <textarea rows={3} value={service.repairVsReplace} onChange={(e) => patch("repairVsReplace", e.target.value)} className={fieldClass()} />
            </label>
            <label className="block text-sm text-slate-300 md:col-span-2">
              Final CTA
              <textarea rows={2} value={service.finalCta} onChange={(e) => patch("finalCta", e.target.value)} className={fieldClass()} />
            </label>
            <label className="block text-sm text-slate-300">
              SEO title
              <input value={service.seoTitle} onChange={(e) => patch("seoTitle", e.target.value)} className={fieldClass()} />
            </label>
            <label className="block text-sm text-slate-300">
              OG image
              <input value={service.ogImage} onChange={(e) => patch("ogImage", e.target.value)} className={fieldClass()} />
            </label>
            <label className="block text-sm text-slate-300 md:col-span-2">
              SEO description
              <textarea rows={2} value={service.seoDescription} onChange={(e) => patch("seoDescription", e.target.value)} className={fieldClass()} />
            </label>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <StringListField label="Features" values={service.features ?? []} onChange={(v) => patch("features", v)} />
            <StringListField label="Applications" values={service.applications ?? []} onChange={(v) => patch("applications", v)} />
            <StringListField label="Materials" values={service.materials ?? []} onChange={(v) => patch("materials", v)} />
            <StringListField label="Benefits" values={service.benefits ?? []} onChange={(v) => patch("benefits", v)} />
            <StringListField
              label="Gallery images (URLs)"
              values={service.galleryImages ?? []}
              onChange={(v) => patch("galleryImages", v)}
            />
            <StringListField
              label="Related service slugs"
              values={service.relatedServiceSlugs ?? []}
              onChange={(v) => patch("relatedServiceSlugs", v)}
            />
          </div>

          <section className="rounded-xl border border-slate-800 bg-slate-900/60 p-4">
            <div className="mb-3 flex items-center justify-between">
              <h3 className="text-sm font-semibold text-slate-200">Process steps</h3>
              <button
                type="button"
                className="text-xs text-cyan-300"
                onClick={() =>
                  patch("processSteps", [
                    ...(service.processSteps ?? []),
                    { title: "", description: "" } satisfies ProcessStep,
                  ])
                }
              >
                Add step
              </button>
            </div>
            <div className="space-y-3">
              {(service.processSteps ?? []).map((step, i) => (
                <div key={`step-${i}`} className="grid gap-2 md:grid-cols-[1fr_2fr_auto]">
                  <input
                    placeholder="Title"
                    value={step.title}
                    onChange={(e) => {
                      const next = [...(service.processSteps ?? [])];
                      next[i] = { ...next[i], title: e.target.value };
                      patch("processSteps", next);
                    }}
                    className={fieldClass()}
                  />
                  <input
                    placeholder="Description"
                    value={step.description}
                    onChange={(e) => {
                      const next = [...(service.processSteps ?? [])];
                      next[i] = { ...next[i], description: e.target.value };
                      patch("processSteps", next);
                    }}
                    className={fieldClass()}
                  />
                  <button
                    type="button"
                    onClick={() =>
                      patch(
                        "processSteps",
                        (service.processSteps ?? []).filter((_, idx) => idx !== i),
                      )
                    }
                    className="rounded-lg border border-slate-700 p-2 text-rose-300"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-xl border border-slate-800 bg-slate-900/60 p-4">
            <div className="mb-3 flex items-center justify-between">
              <h3 className="text-sm font-semibold text-slate-200">Before / after</h3>
              <button
                type="button"
                className="text-xs text-cyan-300"
                onClick={() =>
                  patch("beforeAfter", [
                    ...(service.beforeAfter ?? []),
                    { before: "", after: "", caption: "" } satisfies BeforeAfterPair,
                  ])
                }
              >
                Add pair
              </button>
            </div>
            <div className="space-y-3">
              {(service.beforeAfter ?? []).map((pair, i) => (
                <div key={`ba-${i}`} className="grid gap-2 md:grid-cols-3">
                  <input
                    placeholder="Before URL"
                    value={pair.before}
                    onChange={(e) => {
                      const next = [...(service.beforeAfter ?? [])];
                      next[i] = { ...next[i], before: e.target.value };
                      patch("beforeAfter", next);
                    }}
                    className={fieldClass()}
                  />
                  <input
                    placeholder="After URL"
                    value={pair.after}
                    onChange={(e) => {
                      const next = [...(service.beforeAfter ?? [])];
                      next[i] = { ...next[i], after: e.target.value };
                      patch("beforeAfter", next);
                    }}
                    className={fieldClass()}
                  />
                  <div className="flex gap-2">
                    <input
                      placeholder="Caption"
                      value={pair.caption}
                      onChange={(e) => {
                        const next = [...(service.beforeAfter ?? [])];
                        next[i] = { ...next[i], caption: e.target.value };
                        patch("beforeAfter", next);
                      }}
                      className={fieldClass()}
                    />
                    <button
                      type="button"
                      onClick={() =>
                        patch(
                          "beforeAfter",
                          (service.beforeAfter ?? []).filter((_, idx) => idx !== i),
                        )
                      }
                      className="rounded-lg border border-slate-700 p-2 text-rose-300"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-xl border border-slate-800 bg-slate-900/60 p-4">
            <div className="mb-3 flex items-center justify-between">
              <h3 className="text-sm font-semibold text-slate-200">FAQs</h3>
              <button
                type="button"
                className="text-xs text-cyan-300"
                onClick={() =>
                  patch("faqs", [
                    ...(service.faqs ?? []),
                    { question: "", answer: "" } satisfies ServiceFaq,
                  ])
                }
              >
                Add FAQ
              </button>
            </div>
            <div className="space-y-3">
              {(service.faqs ?? []).map((faq, i) => (
                <div key={`faq-${i}`} className="space-y-2 rounded-lg border border-slate-800 p-3">
                  <input
                    placeholder="Question"
                    value={faq.question}
                    onChange={(e) => {
                      const next = [...(service.faqs ?? [])];
                      next[i] = { ...next[i], question: e.target.value };
                      patch("faqs", next);
                    }}
                    className={fieldClass()}
                  />
                  <textarea
                    placeholder="Answer"
                    rows={2}
                    value={faq.answer}
                    onChange={(e) => {
                      const next = [...(service.faqs ?? [])];
                      next[i] = { ...next[i], answer: e.target.value };
                      patch("faqs", next);
                    }}
                    className={fieldClass()}
                  />
                  <button
                    type="button"
                    onClick={() =>
                      patch(
                        "faqs",
                        (service.faqs ?? []).filter((_, idx) => idx !== i),
                      )
                    }
                    className="text-xs text-rose-300"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-xl border border-slate-800 bg-slate-900/60 p-4">
            <div className="mb-3 flex items-center justify-between">
              <h3 className="text-sm font-semibold text-slate-200">Detail sections</h3>
              <button
                type="button"
                className="text-xs text-cyan-300"
                onClick={() =>
                  patch("detailSections", [
                    ...detailSections,
                    {
                      key: `section-${Date.now()}`,
                      eyebrow: "",
                      heading: "",
                      body: "",
                      image: "",
                      imageAlt: "",
                      visible: true,
                      order: detailSections.length,
                    } satisfies ServiceDetailSection,
                  ])
                }
              >
                Add section
              </button>
            </div>
            <div className="space-y-4">
              {detailSections.map((section, i) => (
                <div key={`ds-${i}`} className="space-y-2 rounded-lg border border-slate-800 p-3">
                  <div className="grid gap-2 md:grid-cols-2">
                    <input
                      placeholder="Key"
                      value={section.key}
                      onChange={(e) => {
                        const next = [...detailSections];
                        next[i] = { ...next[i], key: e.target.value };
                        patch("detailSections", next);
                      }}
                      className={fieldClass()}
                    />
                    <label className="inline-flex items-center gap-2 text-sm text-slate-300">
                      <input
                        type="checkbox"
                        checked={section.visible}
                        onChange={(e) => {
                          const next = [...detailSections];
                          next[i] = { ...next[i], visible: e.target.checked };
                          patch("detailSections", next);
                        }}
                      />
                      Visible
                    </label>
                    <input
                      placeholder="Eyebrow"
                      value={section.eyebrow}
                      onChange={(e) => {
                        const next = [...detailSections];
                        next[i] = { ...next[i], eyebrow: e.target.value };
                        patch("detailSections", next);
                      }}
                      className={fieldClass()}
                    />
                    <input
                      placeholder="Heading"
                      value={section.heading}
                      onChange={(e) => {
                        const next = [...detailSections];
                        next[i] = { ...next[i], heading: e.target.value };
                        patch("detailSections", next);
                      }}
                      className={fieldClass()}
                    />
                  </div>
                  <textarea
                    placeholder="Body"
                    rows={3}
                    value={section.body}
                    onChange={(e) => {
                      const next = [...detailSections];
                      next[i] = { ...next[i], body: e.target.value };
                      patch("detailSections", next);
                    }}
                    className={fieldClass()}
                  />
                  <ImageUploader
                    label="Section image"
                    value={section.image}
                    alt={section.imageAlt}
                    folder="services"
                    onChange={(url) => {
                      const next = [...detailSections];
                      next[i] = { ...next[i], image: url };
                      patch("detailSections", next);
                    }}
                    onAltChange={(alt) => {
                      const next = [...detailSections];
                      next[i] = { ...next[i], imageAlt: alt };
                      patch("detailSections", next);
                    }}
                  />
                  <button
                    type="button"
                    onClick={() =>
                      patch(
                        "detailSections",
                        detailSections
                          .filter((_, idx) => idx !== i)
                          .map((s, order) => ({ ...s, order })),
                      )
                    }
                    className="text-xs text-rose-300"
                  >
                    Remove section
                  </button>
                </div>
              ))}
            </div>
          </section>
        </div>
      )}
    </AdminPage>
  );
}
