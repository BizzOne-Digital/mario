"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import { BeforeAfterSlider } from "@/components/BeforeAfterSlider";
import type { GalleryImageView } from "@/lib/data";

type Category = { _id: string; name: string; slug: string };

export function GalleryClient({
  categories,
  images,
}: {
  categories: Category[];
  images: GalleryImageView[];
}) {
  const [filter, setFilter] = useState("all");
  const [lightbox, setLightbox] = useState<GalleryImageView | null>(null);

  const filtered = useMemo(() => {
    if (filter === "all") return images;
    return images.filter(
      (img) => img.categorySlug === filter || img.categoryId === filter,
    );
  }, [images, filter]);

  return (
    <>
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => setFilter("all")}
          className={`rounded-full px-3 py-1.5 text-xs ${filter === "all" ? "bg-glass text-navy" : "border border-glass/25 text-frost/80"}`}
        >
          All
        </button>
        {categories.map((cat) => (
          <button
            key={cat._id}
            type="button"
            onClick={() => setFilter(cat.slug)}
            className={`rounded-full px-3 py-1.5 text-xs ${filter === cat.slug ? "bg-glass text-navy" : "border border-glass/25 text-frost/80"}`}
          >
            {cat.name}
          </button>
        ))}
      </div>

      <div className="mt-8 columns-1 gap-4 sm:columns-2 lg:columns-3">
        {filtered.map((img) => (
          <button
            key={img._id}
            type="button"
            className="mb-4 block w-full break-inside-avoid overflow-hidden rounded-2xl border border-glass/15 text-left"
            onClick={() => setLightbox(img)}
          >
            <div className="relative aspect-[4/3]">
              <Image src={img.webpUrl || img.url} alt={img.alt} fill className="object-cover" sizes="33vw" />
            </div>
          </button>
        ))}
      </div>

      {lightbox ? (
        <div
          className="fixed inset-0 z-[80] flex items-center justify-center bg-navy/90 p-4"
          role="dialog"
          aria-modal
          aria-label={lightbox.alt}
          onClick={() => setLightbox(null)}
        >
          <div className="max-h-[90vh] w-full max-w-4xl" onClick={(e) => e.stopPropagation()}>
            {lightbox.isBeforeAfter && lightbox.beforeUrl && lightbox.afterUrl ? (
              <BeforeAfterSlider
                beforeSrc={lightbox.beforeUrl}
                afterSrc={lightbox.afterUrl}
                caption={lightbox.caption}
              />
            ) : (
              <div className="relative aspect-[16/10] overflow-hidden rounded-2xl">
                <Image src={lightbox.webpUrl || lightbox.url} alt={lightbox.alt} fill className="object-contain" sizes="90vw" />
              </div>
            )}
            <button type="button" className="btn-secondary mt-4" onClick={() => setLightbox(null)}>
              Close
            </button>
          </div>
        </div>
      ) : null}
    </>
  );
}
