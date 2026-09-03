"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Loader2 } from "lucide-react";
import { AdminPage } from "@/components/admin/AdminPage";
import { ImageUploader } from "@/components/admin/ImageUploader";
import { useToast } from "@/components/admin/Toast";
import { adminFetch } from "@/lib/admin-client";
import type { BlogPostDoc, PublishStatus } from "@/lib/types";

interface ListPayload {
  blogs?: BlogPostDoc[];
}

interface BlogPayload {
  blog?: BlogPostDoc;
}

export default function AdminBlogEditorPage() {
  const params = useParams<{ id: string }>();
  const id = params.id;
  const toast = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [post, setPost] = useState<BlogPostDoc | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = await adminFetch<ListPayload>("/api/admin/blogs");
      const found = (data.blogs ?? []).find((b) => String(b._id) === id) ?? null;
      setPost(found);
      if (!found) toast.error("Post not found");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to load post");
    } finally {
      setLoading(false);
    }
  }, [id, toast]);

  useEffect(() => {
    void load();
  }, [load]);

  function patch<K extends keyof BlogPostDoc>(key: K, value: BlogPostDoc[K]) {
    setPost((prev) => (prev ? { ...prev, [key]: value } : prev));
  }

  async function save(status?: PublishStatus) {
    if (!post) return;
    setSaving(true);
    try {
      const body = {
        title: post.title,
        slug: post.slug,
        content: post.content,
        excerpt: post.excerpt,
        featuredImage: post.featuredImage,
        categories: post.categories,
        tags: post.tags,
        relatedServices: post.relatedServices,
        status: status ?? post.status,
        seo: post.seo,
      };
      const data = await adminFetch<BlogPayload>(`/api/admin/blogs/${id}`, {
        method: "PUT",
        body: JSON.stringify(body),
      });
      setPost(data.blog ?? post);
      toast.success(status === "published" ? "Post published" : "Draft saved");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Save failed");
    } finally {
      setSaving(false);
    }
  }

  if (loading || !post) {
    return (
      <AdminPage title="Edit blog">
        <p className="text-sm text-slate-400">{loading ? "Loading…" : "Post not found."}</p>
      </AdminPage>
    );
  }

  return (
    <AdminPage
      title={`Edit: ${post.title}`}
      actions={
        <div className="flex items-center gap-2">
          <Link href="/admin/blogs" className="text-sm text-slate-400 hover:text-slate-200">
            Back
          </Link>
          <button
            type="button"
            disabled={saving}
            onClick={() => void save("draft")}
            className="rounded-lg border border-slate-600 px-3 py-1.5 text-sm text-slate-200 disabled:opacity-50"
          >
            Save draft
          </button>
          <button
            type="button"
            disabled={saving}
            onClick={() => void save("published")}
            className="inline-flex items-center gap-2 rounded-lg bg-cyan-400 px-3 py-1.5 text-sm font-semibold text-slate-950 disabled:opacity-50"
          >
            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
            Publish
          </button>
        </div>
      }
    >
      <div className="grid gap-4 lg:grid-cols-[1fr_320px]">
        <div className="space-y-4 rounded-xl border border-slate-800 bg-slate-900/60 p-4">
          <label className="block text-sm text-slate-300">
            Title
            <input
              value={post.title}
              onChange={(e) => patch("title", e.target.value)}
              className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-slate-100 outline-none focus:border-cyan-500"
            />
          </label>
          <label className="block text-sm text-slate-300">
            Slug
            <input
              value={post.slug}
              onChange={(e) => patch("slug", e.target.value)}
              className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-slate-100 outline-none focus:border-cyan-500"
            />
          </label>
          <label className="block text-sm text-slate-300">
            Excerpt
            <textarea
              rows={2}
              value={post.excerpt}
              onChange={(e) => patch("excerpt", e.target.value)}
              className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-slate-100 outline-none focus:border-cyan-500"
            />
          </label>
          <label className="block text-sm text-slate-300">
            Content (HTML supported)
            <textarea
              rows={18}
              value={post.content}
              onChange={(e) => patch("content", e.target.value)}
              className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 font-mono text-sm text-slate-100 outline-none focus:border-cyan-500"
            />
          </label>
        </div>

        <aside className="space-y-4">
          <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4">
            <label className="block text-sm text-slate-300">
              Status
              <select
                value={post.status}
                onChange={(e) => patch("status", e.target.value as PublishStatus)}
                className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-slate-100 outline-none focus:border-cyan-500"
              >
                <option value="draft">Draft</option>
                <option value="published">Published</option>
              </select>
            </label>
          </div>
          <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4">
            <ImageUploader
              label="Featured image"
              value={post.featuredImage}
              folder="blogs"
              onChange={(url) => patch("featuredImage", url)}
            />
          </div>
          <div className="space-y-3 rounded-xl border border-slate-800 bg-slate-900/60 p-4">
            <label className="block text-sm text-slate-300">
              Categories (comma-separated)
              <input
                value={(post.categories ?? []).join(", ")}
                onChange={(e) =>
                  patch(
                    "categories",
                    e.target.value
                      .split(",")
                      .map((s) => s.trim())
                      .filter(Boolean),
                  )
                }
                className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-slate-100 outline-none focus:border-cyan-500"
              />
            </label>
            <label className="block text-sm text-slate-300">
              Tags (comma-separated)
              <input
                value={(post.tags ?? []).join(", ")}
                onChange={(e) =>
                  patch(
                    "tags",
                    e.target.value
                      .split(",")
                      .map((s) => s.trim())
                      .filter(Boolean),
                  )
                }
                className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-slate-100 outline-none focus:border-cyan-500"
              />
            </label>
            <label className="block text-sm text-slate-300">
              SEO title
              <input
                value={post.seo?.title ?? ""}
                onChange={(e) =>
                  patch("seo", {
                    title: e.target.value,
                    description: post.seo?.description ?? "",
                    ogImage: post.seo?.ogImage ?? "",
                  })
                }
                className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-slate-100 outline-none focus:border-cyan-500"
              />
            </label>
            <label className="block text-sm text-slate-300">
              SEO description
              <textarea
                rows={3}
                value={post.seo?.description ?? ""}
                onChange={(e) =>
                  patch("seo", {
                    title: post.seo?.title ?? "",
                    description: e.target.value,
                    ogImage: post.seo?.ogImage ?? "",
                  })
                }
                className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-slate-100 outline-none focus:border-cyan-500"
              />
            </label>
          </div>
        </aside>
      </div>
    </AdminPage>
  );
}
