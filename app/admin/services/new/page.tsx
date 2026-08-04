"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Loader2 } from "lucide-react";
import { AdminPage } from "@/components/admin/AdminPage";
import { ImageUploader } from "@/components/admin/ImageUploader";
import { useToast } from "@/components/admin/Toast";
import { adminFetch, idOf } from "@/lib/admin-client";
import type { ServiceDoc } from "@/lib/types";

interface ServicePayload {
  service?: ServiceDoc;
}

export default function AdminNewServicePage() {
  const router = useRouter();
  const toast = useToast();
  const [saving, setSaving] = useState(false);
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [shortDescription, setShortDescription] = useState("");
  const [category, setCategory] = useState("general");
  const [mainImage, setMainImage] = useState("");
  const [imageAlt, setImageAlt] = useState("");

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      const data = await adminFetch<ServicePayload>("/api/admin/services", {
        method: "POST",
        body: JSON.stringify({
          name,
          slug: slug || undefined,
          shortDescription,
          category,
          mainImage,
          imageAlt,
          active: true,
          published: false,
        }),
      });
      toast.success("Service created");
      const id = data.service ? idOf(data.service) : "";
      router.push(id ? `/admin/services/${id}` : "/admin/services");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not create service");
    } finally {
      setSaving(false);
    }
  }

  return (
    <AdminPage
      title="New service"
      actions={
        <Link href="/admin/services" className="text-sm text-slate-400 hover:text-slate-200">
          Back
        </Link>
      }
    >
      <form
        onSubmit={(e) => void onSubmit(e)}
        className="max-w-2xl space-y-4 rounded-xl border border-slate-800 bg-slate-900/60 p-4"
      >
        <label className="block text-sm text-slate-300">
          Name
          <input
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-slate-100 outline-none focus:border-cyan-500"
          />
        </label>
        <label className="block text-sm text-slate-300">
          Slug (optional)
          <input
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-slate-100 outline-none focus:border-cyan-500"
            placeholder="auto-generated from name"
          />
        </label>
        <label className="block text-sm text-slate-300">
          Short description
          <textarea
            required
            rows={3}
            value={shortDescription}
            onChange={(e) => setShortDescription(e.target.value)}
            className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-slate-100 outline-none focus:border-cyan-500"
          />
        </label>
        <label className="block text-sm text-slate-300">
          Category
          <input
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-slate-100 outline-none focus:border-cyan-500"
          />
        </label>
        <ImageUploader
          label="Main image"
          value={mainImage}
          alt={imageAlt}
          folder="services"
          onChange={setMainImage}
          onAltChange={setImageAlt}
        />
        <button
          type="submit"
          disabled={saving}
          className="inline-flex items-center gap-2 rounded-lg bg-cyan-400 px-4 py-2 text-sm font-semibold text-slate-950 hover:bg-cyan-300 disabled:opacity-50"
        >
          {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
          Create service
        </button>
      </form>
    </AdminPage>
  );
}
