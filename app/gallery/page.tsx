import type { Metadata } from "next";
import { CtaBand } from "@/components/CtaBand";
import { GalleryClient } from "@/components/GalleryClient";
import { PageHero } from "@/components/PageHero";
import { getGalleryCategories, getGalleryImages } from "@/lib/data";
import { PAGE_IMAGES } from "@/lib/media";
import { BUSINESS } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Gallery",
  description:
    "Project gallery of shower doors, windows, doors, mirrors, and commercial glass by Express Glass.",
};

export default async function GalleryPage() {
  const [categories, images] = await Promise.all([
    getGalleryCategories(),
    getGalleryImages(),
  ]);
  const imgs = PAGE_IMAGES.gallery;

  return (
    <main>
      <PageHero
        image={imgs.hero}
        imageAlt="Express Glass project gallery"
        eyebrow="Portfolio"
        title="Project Gallery"
        subtitle="Residential and commercial glass projects — filter by category and open images for a closer look. Showcase photos illustrate the work we do; project-specific photos appear as they are published from the admin gallery."
        ctas={[
          { href: "/contact", label: "Request Estimate" },
          { href: "/services", label: "View Services", variant: "secondary" },
        ]}
      />

      <section className="section-pad">
        <div className="container-eg">
          <GalleryClient categories={categories} images={images} />
        </div>
      </section>

      <CtaBand
        title="Like what you see?"
        subtitle="Tell us about your opening and we’ll prepare a free estimate."
        phone={BUSINESS.primaryPhone}
        image={imgs.hero}
      />
    </main>
  );
}
