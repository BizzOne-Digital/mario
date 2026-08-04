"use client";

import { FormEvent, useCallback, useEffect, useState } from "react";
import { Plus } from "lucide-react";
import { AdminPage } from "@/components/admin/AdminPage";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";
import { ImageUploader } from "@/components/admin/ImageUploader";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { useToast } from "@/components/admin/Toast";
import { adminFetch, idOf } from "@/lib/admin-client";
import type { GalleryCategoryDoc, GalleryImageDoc } from "@/lib/types";

interface CategoriesPayload {
  categories?: GalleryCategoryDoc[];
}
interface ImagesPayload {
  images?: GalleryImageDoc[];
}

export default function AdminGalleryPage() {
  const toast = useToast();
  const [categories, setCategories] = useState<GalleryCategoryDoc[]>([]);
  const [images, setImages] = useState<GalleryImageDoc[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [deleteTarget, setDeleteTarget] = useState<
    { type: "category" | "image"; id: string } | null
  >(null);
  const [busy, setBusy] = useState(false);
  const [imageUrl, setImageUrl] = useState("");
  const [imageAlt, setImageAlt] = useState("");
  const [imageCaption, setImageCaption] = useState("");

  const loadCategories = useCallback(async () => {
    const data = await adminFetch<CategoriesPayload>("/api/admin/gallery/categories");
    const list = data.categories ?? [];
    setCategories(list);
    setSelectedCategory((prev) => prev || (list[0] ? idOf(list[0]) : ""));
  }, []);

  const loadImages = useCallback(async (categoryId: string) => {
    if (!categoryId) {
      setImages([]);
      return;
    }
    const data = await adminFetch<ImagesPayload>(
      `/api/admin/gallery/images?categoryId=${encodeURIComponent(categoryId)}`,
    );
    setImages(data.images ?? []);
  }, []);

  useEffect(() => {
    let cancelled = false;
    async function boot() {
      setLoading(true);
      try {
        await loadCategories();
      } catch (err) {
        if (!cancelled) toast.error(err instanceof Error ? err.message : "Failed to load gallery");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    void boot();
    return () => {
      cancelled = true;
    };
  }, [loadCategories, toast]);

  useEffect(() => {
    if (!selectedCategory) return;
    void loadImages(selectedCategory).catch((err: unknown) => {
      toast.error(err instanceof Error ? err.message : "Failed to load images");
    });
  }, [selectedCategory, loadImages, toast]);

  async function addCategory(e: FormEvent) {
    e.preventDefault();
    if (!newCategoryName.trim()) return;
    try {
      await adminFetch("/api/admin/gallery/categories", {
        method: "POST",
        body: JSON.stringify({ name: newCategoryName.trim() }),
      });
      setNewCategoryName("");
      toast.success("Category created");
      await loadCategories();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not create category");
    }
  }

  async function addImage(e: FormEvent) {
    e.preventDefault();
    if (!selectedCategory || !imageUrl) {
      toast.error("Select a category and upload an image first");
      return;
    }
    try {
      await adminFetch("/api/admin/gallery/images", {
        method: "POST",
        body: JSON.stringify({
          categoryId: selectedCategory,
          url: imageUrl,
          alt: imageAlt,
          caption: imageCaption,
          published: true,
        }),
      });
      setImageUrl("");
      setImageAlt("");
      setImageCaption("");
      toast.success("Image added");
      await loadImages(selectedCategory);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not add image");
    }
  }

  async function toggleImage(image: GalleryImageDoc, patch: Partial<GalleryImageDoc>) {
    try {
      await adminFetch(`/api/admin/gallery/images/${idOf(image)}`, {
        method: "PUT",
        body: JSON.stringify(patch),
      });
      await loadImages(selectedCategory);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Update failed");
    }
  }

  async function confirmDelete() {
    if (!deleteTarget) return;
    setBusy(true);
    try {
      if (deleteTarget.type === "category") {
        await adminFetch(`/api/admin/gallery/categories/${deleteTarget.id}`, {
          method: "DELETE",
        });
        toast.success("Category deleted");
        setSelectedCategory("");
        await loadCategories();
      } else {
        await adminFetch(`/api/admin/gallery/images/${deleteTarget.id}`, {
          method: "DELETE",
        });
        toast.success("Image deleted");
        await loadImages(selectedCategory);
      }
      setDeleteTarget(null);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Delete failed");
    } finally {
      setBusy(false);
    }
  }

  return (
    <AdminPage title="Gallery">
      {loading ? (
        <p className="text-sm text-slate-400">Loading…</p>
      ) : (
        <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
          <aside className="space-y-4">
            <form onSubmit={(e) => void addCategory(e)} className="space-y-2 rounded-xl border border-slate-800 bg-slate-900/60 p-3">
              <p className="text-sm font-medium text-slate-200">Categories</p>
              <input
                value={newCategoryName}
                onChange={(e) => setNewCategoryName(e.target.value)}
                placeholder="New category name"
                className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100 outline-none focus:border-cyan-500"
              />
              <button
                type="submit"
                className="inline-flex w-full items-center justify-center gap-1 rounded-lg bg-cyan-400 px-3 py-2 text-sm font-semibold text-slate-950"
              >
                <Plus className="h-4 w-4" /> Add category
              </button>
            </form>
            <ul className="space-y-1">
              {categories.map((cat) => {
                const cid = idOf(cat);
                return (
                  <li key={cid}>
                    <button
                      type="button"
                      onClick={() => setSelectedCategory(cid)}
                      className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-sm ${
                        selectedCategory === cid
                          ? "bg-cyan-500/15 text-cyan-200"
                          : "text-slate-300 hover:bg-slate-900"
                      }`}
                    >
                      <span>{cat.name}</span>
                      <StatusBadge status={cat.active ? "active" : "inactive"} />
                    </button>
                    <button
                      type="button"
                      onClick={() => setDeleteTarget({ type: "category", id: cid })}
                      className="px-3 pb-2 text-xs text-rose-300"
                    >
                      Delete category
                    </button>
                  </li>
                );
              })}
            </ul>
          </aside>

          <div className="space-y-4">
            <form
              onSubmit={(e) => void addImage(e)}
              className="grid gap-4 rounded-xl border border-slate-800 bg-slate-900/60 p-4 md:grid-cols-2"
            >
              <ImageUploader
                label="New gallery image"
                value={imageUrl}
                alt={imageAlt}
                folder="gallery"
                onChange={setImageUrl}
                onAltChange={setImageAlt}
              />
              <div className="space-y-3">
                <label className="block text-sm text-slate-300">
                  Caption
                  <input
                    value={imageCaption}
                    onChange={(e) => setImageCaption(e.target.value)}
                    className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-slate-100 outline-none focus:border-cyan-500"
                  />
                </label>
                <button
                  type="submit"
                  className="rounded-lg bg-cyan-400 px-4 py-2 text-sm font-semibold text-slate-950"
                >
                  Add to category
                </button>
              </div>
            </form>

            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {images.length === 0 ? (
                <p className="text-sm text-slate-500 sm:col-span-2">No images in this category.</p>
              ) : (
                images.map((image) => (
                  <article
                    key={idOf(image)}
                    className="overflow-hidden rounded-xl border border-slate-800 bg-slate-900/60"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={image.webpUrl || image.url} alt={image.alt || ""} className="h-40 w-full object-cover" />
                    <div className="space-y-2 p-3 text-sm">
                      <p className="truncate text-slate-200">{image.caption || image.alt || "Untitled"}</p>
                      <div className="flex flex-wrap gap-2">
                        <button
                          type="button"
                          onClick={() =>
                            void toggleImage(image, { published: !image.published })
                          }
                          className="text-xs text-cyan-300"
                        >
                          {image.published ? "Unpublish" : "Publish"}
                        </button>
                        <button
                          type="button"
                          onClick={() =>
                            void toggleImage(image, { featured: !image.featured })
                          }
                          className="text-xs text-amber-300"
                        >
                          {image.featured ? "Unfeature" : "Feature"}
                        </button>
                        <button
                          type="button"
                          onClick={() => setDeleteTarget({ type: "image", id: idOf(image) })}
                          className="text-xs text-rose-300"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </article>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      <ConfirmDialog
        open={Boolean(deleteTarget)}
        title={deleteTarget?.type === "category" ? "Delete category?" : "Delete image?"}
        message="This action cannot be undone."
        loading={busy}
        onCancel={() => setDeleteTarget(null)}
        onConfirm={() => void confirmDelete()}
      />
    </AdminPage>
  );
}
