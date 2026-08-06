import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { CtaBand } from "@/components/CtaBand";
import { ImageMosaic } from "@/components/ImageMosaic";
import { PageHero } from "@/components/PageHero";
import { SectionReveal } from "@/components/SectionReveal";
import { BUSINESS } from "@/lib/constants";
import { getSettings } from "@/lib/data";
import { PAGE_IMAGES } from "@/lib/media";
import { AREAS } from "@/lib/site-content";

export const metadata: Metadata = {
  title: "About",
  description:
    "Express Glass began in New York in 1980. Mario has served Southern California since 2003 with mobile residential and commercial glass service.",
};

export default async function AboutPage() {
  const settings = await getSettings();
  const history =
    settings.companyHistory ||
    "Express Glass started in New York in 1980. Mario has served Southern California since 2003 with mobile residential and commercial glass service.";
  const imgs = PAGE_IMAGES.about;
  const areas = settings.serviceAreas?.length ? settings.serviceAreas : AREAS;

  return (
    <main>
      <PageHero
        image={imgs.hero}
        imageAlt="Express Glass residential installation"
        eyebrow="About"
        title="About Express Glass"
        subtitle={settings.yearsExperienceText || BUSINESS.sinceText}
        ctas={[
          { href: "/contact", label: "Request Free Estimate" },
          { href: "/contact", label: "Contact", variant: "secondary" },
        ]}
      />

      <section className="section-pad">
        <div className="container-eg grid gap-10 lg:grid-cols-2 lg:items-center">
          <SectionReveal>
            <h2 className="font-display text-3xl text-frost">Company story</h2>
            <p className="mt-4 leading-relaxed text-steel">{history}</p>
            <p className="mt-4 leading-relaxed text-steel">
              With more than 50 years of industry experience behind the Express Glass name, we focus on customer
              service, careful measurement, and lasting workmanship for residential and commercial projects across
              Riverside, Corona, and surrounding Southern California communities.
            </p>
          </SectionReveal>
          <SectionReveal delay={0.1}>
            <div className="relative aspect-[4/3] overflow-hidden rounded-2xl">
              <Image
                src={imgs.story}
                alt="Precision glass measurement"
                fill
                className="object-cover"
                sizes="50vw"
              />
            </div>
          </SectionReveal>
        </div>
      </section>

      <section className="section-pad bg-charcoal/30">
        <div className="container-eg grid gap-10 lg:grid-cols-2 lg:items-center">
          <SectionReveal className="relative aspect-[4/3] overflow-hidden rounded-2xl">
            <Image
              src={imgs.mario}
              alt={`${settings.ownerName || "Mario"} of Express Glass`}
              fill
              className="object-cover object-top"
              sizes="50vw"
            />
          </SectionReveal>
          <SectionReveal>
            <h2 className="font-display text-3xl text-frost">
              Message from {settings.ownerName || "Mario"}
            </h2>
            <p className="mt-4 leading-relaxed text-steel">
              Every project starts with listening—understanding how you use the space, what failed, and what “done
              right” looks like for you. Whether it’s a shower enclosure, a fogged window, or a storefront panel, we
              bring mobile service and clear communication to Riverside, Corona, and surrounding communities.
            </p>
            {settings.christianOwnedVisible && settings.christianOwnedText ? (
              <p className="mt-4 text-sm text-frost/80">{settings.christianOwnedText}</p>
            ) : null}
          </SectionReveal>
        </div>
      </section>

      <section className="section-pad">
        <div className="container-eg grid gap-6 md:grid-cols-3">
          {[
            {
              title: "Experience",
              body: "Decades of glass industry heritage with Southern California service since 2003.",
              img: imgs.experience,
            },
            {
              title: "Craftsmanship",
              body: "Precise measurement, careful installation, and attention to seals, alignment, and finish.",
              img: imgs.craft,
            },
            {
              title: "Mobile service",
              body: "We come to your home or business across our regional service area.",
              img: imgs.mobile,
            },
          ].map((item) => (
            <SectionReveal key={item.title} className="glass-panel overflow-hidden rounded-2xl">
              <div className="relative aspect-[16/10]">
                <Image src={item.img} alt={item.title} fill className="object-cover" sizes="33vw" />
              </div>
              <div className="p-5">
                <h3 className="font-display text-xl text-frost">{item.title}</h3>
                <p className="mt-2 text-sm text-steel">{item.body}</p>
              </div>
            </SectionReveal>
          ))}
        </div>
      </section>

      <section className="section-pad bg-charcoal/30">
        <div className="container-eg grid gap-8 lg:grid-cols-2">
          <SectionReveal>
            <h2 className="font-display text-3xl text-frost">Residential & light commercial</h2>
            <p className="mt-4 text-steel">
              From custom shower doors and window glass to door lites and small 1st-floor storefronts, Express Glass
              supports home and small-business projects with licensed, bonded, and insured service — we do not take on
              high-rise or large commercial building glazing.
            </p>
            <p className="mt-3 text-sm text-frost/80">
              CA License #{settings.licenseNumber || BUSINESS.licenseNumber}
            </p>
            <div className="mt-6 space-y-3 text-sm text-steel">
              <p>
                <strong className="text-frost">Mobile service model:</strong> appointment-based visits to your
                property—no need to haul broken glass across town.
              </p>
              <p>
                <strong className="text-frost">Values:</strong> clear estimates, honest repair-vs-replace advice, and
                workmanship you can inspect at final walk-through.
              </p>
            </div>
          </SectionReveal>
          <SectionReveal>
            <ImageMosaic
              images={[
                { src: imgs.residential, alt: "Residential shower glass" },
                { src: imgs.commercial, alt: "Small 1st-floor storefront glass" },
                { src: imgs.values, alt: "Bright residential interior" },
                { src: imgs.craft, alt: "Glass hardware detail" },
                { src: imgs.story, alt: "On-site measurement" },
              ]}
            />
          </SectionReveal>
        </div>
      </section>

      <section className="section-pad">
        <div className="container-eg">
          <SectionReveal>
            <h2 className="font-display text-3xl text-frost">Where we serve</h2>
            <p className="mt-3 max-w-2xl text-steel">
              Mobile coverage across Riverside County, parts of Orange County, and nearby Southern California
              communities.
            </p>
          </SectionReveal>
          <ul className="mt-8 flex flex-wrap gap-2">
            {areas.slice(0, 12).map((area) => (
              <li
                key={area}
                className="rounded-full border border-glass/20 bg-navy/40 px-3 py-1.5 text-sm text-frost/85"
              >
                {area}
              </li>
            ))}
          </ul>
          <Link href="/service-areas" className="mt-6 inline-block text-glass">
            Full service areas →
          </Link>
        </div>
      </section>

      <CtaBand
        title="Plan your next glass project"
        subtitle="Request a free estimate or call Express Glass to discuss your opening."
        phone={settings.primaryPhone || BUSINESS.primaryPhone}
        image={imgs.hero}
      />
    </main>
  );
}
