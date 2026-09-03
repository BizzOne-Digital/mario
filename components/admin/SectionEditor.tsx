"use client";

import { ChevronDown, ChevronUp, Eye, EyeOff, Plus, Trash2 } from "lucide-react";
import { ImageUploader } from "@/components/admin/ImageUploader";
import type { PageSectionDoc } from "@/lib/types";

export type EditableSection = Omit<
  PageSectionDoc,
  "_id" | "createdAt" | "updatedAt" | "pageSlug"
> & {
  _id?: string;
  pageSlug?: string;
};

function emptySection(order: number): EditableSection {
  return {
    key: `section-${Date.now()}`,
    eyebrow: "",
    heading: "",
    subheading: "",
    paragraphs: [""],
    bullets: [],
    ctaText: "",
    ctaUrl: "",
    image: "",
    backgroundImage: "",
    imageAlt: "",
    layout: "default",
    visible: true,
    order,
  };
}

function StringListEditor({
  label,
  values,
  onChange,
  placeholder,
}: {
  label: string;
  values: string[];
  onChange: (next: string[]) => void;
  placeholder?: string;
}) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-slate-200">{label}</span>
        <button
          type="button"
          onClick={() => onChange([...values, ""])}
          className="inline-flex items-center gap-1 text-xs text-cyan-300 hover:text-cyan-200"
        >
          <Plus className="h-3.5 w-3.5" />
          Add
        </button>
      </div>
      {values.length === 0 ? (
        <p className="text-xs text-slate-500">None yet</p>
      ) : (
        <div className="space-y-2">
          {values.map((value, index) => (
            <div key={`${label}-${index}`} className="flex gap-2">
              <input
                value={value}
                onChange={(e) => {
                  const next = [...values];
                  next[index] = e.target.value;
                  onChange(next);
                }}
                placeholder={placeholder}
                className="flex-1 rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100 outline-none focus:border-cyan-500"
              />
              <button
                type="button"
                onClick={() => onChange(values.filter((_, i) => i !== index))}
                className="rounded-lg border border-slate-700 p-2 text-slate-400 hover:text-rose-300"
                aria-label={`Remove ${label} item`}
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export function SectionEditor({
  sections,
  onChange,
  allowAdd = true,
}: {
  sections: EditableSection[];
  onChange: (sections: EditableSection[]) => void;
  allowAdd?: boolean;
}) {
  function updateAt(index: number, patch: Partial<EditableSection>) {
    onChange(sections.map((s, i) => (i === index ? { ...s, ...patch } : s)));
  }

  function move(index: number, dir: -1 | 1) {
    const target = index + dir;
    if (target < 0 || target >= sections.length) return;
    const next = [...sections];
    const tmp = next[index];
    next[index] = next[target];
    next[target] = tmp;
    onChange(next.map((s, i) => ({ ...s, order: i })));
  }

  function remove(index: number) {
    onChange(sections.filter((_, i) => i !== index).map((s, i) => ({ ...s, order: i })));
  }

  return (
    <div className="space-y-4">
      {sections.map((section, index) => (
        <article
          key={section._id || section.key || index}
          className="rounded-xl border border-slate-800 bg-slate-950/50 p-4"
        >
          <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <span className="rounded bg-slate-800 px-2 py-1 font-mono text-xs text-slate-300">
                {section.key || `section-${index + 1}`}
              </span>
              <button
                type="button"
                onClick={() => updateAt(index, { visible: !section.visible })}
                className="inline-flex items-center gap-1 rounded-lg border border-slate-700 px-2 py-1 text-xs text-slate-300 hover:bg-slate-800"
              >
                {section.visible ? <Eye className="h-3.5 w-3.5" /> : <EyeOff className="h-3.5 w-3.5" />}
                {section.visible ? "Visible" : "Hidden"}
              </button>
            </div>
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => move(index, -1)}
                disabled={index === 0}
                className="rounded-lg border border-slate-700 p-1.5 text-slate-300 hover:bg-slate-800 disabled:opacity-30"
                aria-label="Move up"
              >
                <ChevronUp className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={() => move(index, 1)}
                disabled={index === sections.length - 1}
                className="rounded-lg border border-slate-700 p-1.5 text-slate-300 hover:bg-slate-800 disabled:opacity-30"
                aria-label="Move down"
              >
                <ChevronDown className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={() => remove(index)}
                className="rounded-lg border border-slate-700 p-1.5 text-rose-300 hover:bg-slate-800"
                aria-label="Remove section"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>

          <div className="grid gap-3 md:grid-cols-2">
            <label className="block text-sm text-slate-300">
              Key
              <input
                value={section.key}
                onChange={(e) => updateAt(index, { key: e.target.value })}
                className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-slate-100 outline-none focus:border-cyan-500"
              />
            </label>
            <label className="block text-sm text-slate-300">
              Layout
              <input
                value={section.layout}
                onChange={(e) => updateAt(index, { layout: e.target.value })}
                className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-slate-100 outline-none focus:border-cyan-500"
              />
            </label>
            <label className="block text-sm text-slate-300">
              Eyebrow
              <input
                value={section.eyebrow}
                onChange={(e) => updateAt(index, { eyebrow: e.target.value })}
                className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-slate-100 outline-none focus:border-cyan-500"
              />
            </label>
            <label className="block text-sm text-slate-300">
              Heading
              <input
                value={section.heading}
                onChange={(e) => updateAt(index, { heading: e.target.value })}
                className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-slate-100 outline-none focus:border-cyan-500"
              />
            </label>
            <label className="block text-sm text-slate-300 md:col-span-2">
              Subheading
              <input
                value={section.subheading}
                onChange={(e) => updateAt(index, { subheading: e.target.value })}
                className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-slate-100 outline-none focus:border-cyan-500"
              />
            </label>
            <label className="block text-sm text-slate-300">
              CTA text
              <input
                value={section.ctaText}
                onChange={(e) => updateAt(index, { ctaText: e.target.value })}
                className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-slate-100 outline-none focus:border-cyan-500"
              />
            </label>
            <label className="block text-sm text-slate-300">
              CTA URL
              <input
                value={section.ctaUrl}
                onChange={(e) => updateAt(index, { ctaUrl: e.target.value })}
                className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-slate-100 outline-none focus:border-cyan-500"
              />
            </label>
          </div>

          <div className="mt-4 grid gap-4 md:grid-cols-2">
            <StringListEditor
              label="Paragraphs"
              values={section.paragraphs}
              onChange={(paragraphs) => updateAt(index, { paragraphs })}
              placeholder="Paragraph text"
            />
            <StringListEditor
              label="Bullets"
              values={section.bullets}
              onChange={(bullets) => updateAt(index, { bullets })}
              placeholder="Bullet point"
            />
          </div>

          <div className="mt-4 grid gap-4 md:grid-cols-2">
            <ImageUploader
              label="Image"
              value={section.image}
              alt={section.imageAlt}
              folder="pages"
              onChange={(image) => updateAt(index, { image })}
              onAltChange={(imageAlt) => updateAt(index, { imageAlt })}
            />
            <ImageUploader
              label="Background image"
              value={section.backgroundImage}
              folder="pages"
              onChange={(backgroundImage) => updateAt(index, { backgroundImage })}
            />
          </div>
        </article>
      ))}

      {allowAdd ? (
        <button
          type="button"
          onClick={() => onChange([...sections, emptySection(sections.length)])}
          className="inline-flex items-center gap-2 rounded-lg border border-dashed border-slate-600 px-4 py-3 text-sm text-slate-300 hover:border-cyan-500 hover:text-cyan-200"
        >
          <Plus className="h-4 w-4" />
          Add section
        </button>
      ) : null}
    </div>
  );
}
