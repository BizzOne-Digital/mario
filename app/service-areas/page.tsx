import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { CtaBand } from "@/components/CtaBand";
import { ImageMosaic } from "@/components/ImageMosaic";
import { PageHero } from "@/components/PageHero";
import { SectionReveal } from "@/components/SectionReveal";
import { BUSINESS } from "@/lib/constants";
import { getPublishedServices, getSettings } from "@/lib/data";
import { PAGE_IMAGES } from "@/lib/media";
import { AREA_BLURBS, AREAS } from "@/lib/site-content";

export const metadata: Metadata = {
  title: "Service Areas",
  description:
    "Express Glass serves Riverside, Corona, and surrounding Southern California communities with mobile residential and commercial glass service.",
};

export default async function ServiceAreasPage() {
  const [settings, services] = await Promise.all([getSettings(), getPublishedServices()]);
  const areas = settings.serviceAreas?.length ? settings.serviceAreas : AREAS;
  const imgs = PAGE_IMAGES.serviceAreas;
  const featuredAreas = areas.filter((a) => AREA_BLURBS[a]);
  const otherAreas = areas.filter((a) => !AREA_BLURBS[a]);

  return (
    <main>
      <PageHero
        image={imgs.hero}
        imageAlt="Southern California glass service area"
        eyebrow="Coverage"
        title="Service Areas"
        subtitle={
          settings.mobileServiceNotice ||
          "Mobile residential and commercial glass service available across our service area."
        }
        ctas={[
          { href: "/contact", label: "Request Estimate" },
          { href: "/contact", label: "Contact", variant: "secondary" },
        ]}
      />

      <section className="section-pad">
        <div className="container-eg grid gap-10 lg:grid-cols-2 lg:items-center">
          <SectionReveal>
            <h2 className="font-display text-3xl text-frost">Mobile glass service near you</h2>
            <p className="mt-4 leading-relaxed text-steel">
              Express Glass is based in Riverside and travels to homes and businesses throughout Riverside County,
              select Orange County communities, and surrounding Southern California areas. Instead of thin
              city-by-city duplicate pages, this is one clear coverage overview—so you can confirm we serve your
              community and request an estimate for shower doors, windows, doors, mirrors, or commercial glass.
            </p>
            <p className="mt-4 text-sm text-frost/80">
              Shop / office: {settings.address || BUSINESS.address}
            </p>
          </SectionReveal>
          <SectionReveal>
            <ImageMosaic
              images={imgs.strip.slice(0, 5).map((src, i) => ({
                src,
                alt: `Express Glass field service ${i + 1}`,
              }))}
            />
          </SectionReveal>
        </div>
      </section>

      <section className="section-pad bg-charcoal/30">
        <div className="container-eg">
          <SectionReveal>
            <h2 className="font-display text-3xl text-frost">Major communities</h2>
            <p className="mt-3 max-w-2xl text-steel">
              Short notes for primary cities we serve regularly—same licensed team, same craftsmanship standards.
            </p>
          </SectionReveal>
          <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {featuredAreas.map((area) => (
              <article key={area} className="glass-panel rounded-2xl p-5">
                <h3 className="font-display text-xl text-frost">{area}</h3>
                <p className="mt-2 text-sm leading-relaxed text-steel">{AREA_BLURBS[area]}</p>
              </article>
            ))}
          </div>
          {otherAreas.length ? (
            <ul className="mt-8 flex flex-wrap gap-2">
              {otherAreas.map((area) => (
                <li
                  key={area}
                  className="rounded-full border border-glass/20 bg-navy/40 px-3 py-1.5 text-sm text-frost/85"
                >
                  {area}
                </li>
              ))}
            </ul>
          ) : null}
        </div>
      </section>

      <section className="section-pad">
        <div className="container-eg grid gap-8 lg:grid-cols-2 lg:items-center">
          <SectionReveal>
            <h2 className="font-display text-3xl text-frost">Map & directions</h2>
            <p className="mt-4 text-steel">
              Find us at {BUSINESS.addressLine1}, {BUSINESS.city}, {BUSINESS.state} {BUSINESS.zip}. Most work is
              performed on site at your property—call to confirm travel to your city.
            </p>
            <p className="mt-3 text-sm text-steel">
              CA License #{settings.licenseNumber || BUSINESS.licenseNumber} · Licensed, bonded & insured
            </p>
          </SectionReveal>
          <div className="overflow-hidden rounded-2xl border border-glass/20">
            <iframe
              title="Express Glass location map"
              src={`https://www.google.com/maps?q=${encodeURIComponent(BUSINESS.address)}&output=embed`}
              className="h-72 w-full max-w-full"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>
      </section>

      <section className="section-pad bg-charcoal/30">
        <div className="container-eg">
          <h2 className="font-display text-3xl text-frost">Services offered in our area</h2>
          <p className="mt-3 max-w-2xl text-steel">
            The same core menu is available across our coverage—subject to scheduling and opening type.
          </p>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {services.slice(0, 6).map((s) => (
              <Link
                key={s.slug}
                href={`/services/${s.slug}`}
                className="glass-panel overflow-hidden rounded-2xl hover:border-glass/40"
              >
                <div className="relative aspect-[16/10]">
                  <Image
                    src={s.mainImage || imgs.hero}
                    alt={s.name}
                    fill
                    className="object-cover"
                    sizes="33vw"
                  />
                </div>
                <div className="p-4">
                  <h3 className="font-display text-lg text-frost">{s.name}</h3>
                  <p className="mt-1 text-sm text-steel">{s.shortDescription}</p>
                </div>
              </Link>
            ))}
          </div>
          <Link href="/services" className="mt-6 inline-block text-glass">
            All services →
          </Link>
        </div>
      </section>

      <CtaBand
        title="Need service near you?"
        subtitle="Request an estimate and include your city—we’ll confirm coverage and next steps."
        phone={settings.primaryPhone || BUSINESS.primaryPhone}
        image={imgs.hero}
      />
    </main>
  );
}
