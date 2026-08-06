import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { CtaBand } from "@/components/CtaBand";
import { FaqAccordion } from "@/components/FaqAccordion";
import { PageHero } from "@/components/PageHero";
import { SectionReveal } from "@/components/SectionReveal";
import { ServiceCard } from "@/components/ServiceCard";
import { BUSINESS, PROCESS_STEPS } from "@/lib/constants";
import { getPublishedFaqs, getPublishedServices, getSettings } from "@/lib/data";
import { PAGE_IMAGES } from "@/lib/media";

export const metadata: Metadata = {
  title: "Services",
  description:
    "Residential and light commercial glass — showers, windows, doors, and small storefronts — by Express Glass in Riverside, CA.",
};

export default async function ServicesPage() {
  const [services, faqs, settings] = await Promise.all([
    getPublishedServices(),
    getPublishedFaqs(),
    getSettings(),
  ]);

  const residential = services.filter((s) =>
    ["shower", "windows", "doors", "mirrors", "residential", "custom"].includes(s.category),
  );
  const commercial = services.filter(
    (s) =>
      ["commercial", "windows", "doors"].includes(s.category) ||
      s.slug.includes("commercial") ||
      s.slug.includes("storefront"),
  );
  const repairs = services.filter(
    (s) => s.slug.includes("repair") || s.slug.includes("replacement"),
  );
  const installation = services.filter(
    (s) => s.slug.includes("installation") || s.slug.includes("vinyl") || s.slug.includes("custom"),
  );
  const imgs = PAGE_IMAGES.services;

  return (
    <main>
      <PageHero
        image={imgs.hero}
        imageAlt="Express Glass residential and light commercial services"
        eyebrow="Services"
        title="Glass Services"
        subtitle={`Shower doors, window and door glass, and small 1st-floor storefront work across ${(settings.serviceAreas || []).slice(0, 4).join(", ") || "Southern California"}.`}
        ctas={[
          { href: "/contact", label: "Request Free Estimate" },
          { href: `tel:${BUSINESS.primaryPhoneTel}`, label: "Call Now", variant: "secondary" },
        ]}
      />

      <section className="section-pad">
        <div className="container-eg">
          <SectionReveal>
            <h2 className="font-display text-3xl text-frost">How we help</h2>
            <p className="mt-4 max-w-3xl text-steel">
              Express Glass is a licensed Riverside glass company offering mobile residential and light commercial
              service. We focus on custom shower doors and enclosures, window and door glass, repairs, and small
              ground-floor storefront door lites — not high-rise or large building glazing. Browse every service below,
              or jump to residential, commercial, repair, and installation groupings.
            </p>
          </SectionReveal>
        </div>
      </section>

      <section className="section-pad !pt-0">
        <div className="container-eg">
          <SectionReveal>
            <h2 className="font-display text-3xl text-frost">All services</h2>
          </SectionReveal>
          <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {services.map((service) => (
              <ServiceCard
                key={service._id || service.slug}
                name={service.name}
                slug={service.slug}
                shortDescription={service.shortDescription}
                mainImage={service.mainImage || imgs.residential}
                imageAlt={service.imageAlt}
              />
            ))}
          </div>
        </div>
      </section>

      <section className="section-pad bg-charcoal/30">
        <div className="container-eg grid gap-8 lg:grid-cols-2 xl:grid-cols-4">
          <FeatureColumn title="Residential" items={residential.slice(0, 5)} image={imgs.residential} />
          <FeatureColumn title="Light commercial" items={commercial.slice(0, 5)} image={imgs.commercial} />
          <FeatureColumn title="Repair & replacement" items={repairs.slice(0, 5)} image={imgs.repair} />
          <FeatureColumn title="Installation" items={installation.slice(0, 5)} image={imgs.process} />
        </div>
      </section>

      <section className="section-pad">
        <div className="container-eg">
          <SectionReveal>
            <h2 className="font-display text-3xl text-frost md:text-4xl">Our process</h2>
            <p className="mt-3 max-w-2xl text-steel">
              From first call to final review — clear steps, careful workmanship.
            </p>
          </SectionReveal>
          <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-6">
            {PROCESS_STEPS.map((step, i) => (
              <SectionReveal
                key={step.title}
                delay={i * 0.04}
                className="glass-panel flex h-full flex-col rounded-2xl p-5"
              >
                <p className="text-xs tracking-widest text-glass uppercase">Step {i + 1}</p>
                <h3 className="mt-2 font-display text-lg leading-snug text-frost md:text-xl">
                  {step.title}
                </h3>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-steel">{step.description}</p>
              </SectionReveal>
            ))}
          </div>
        </div>
      </section>

      <section className="section-pad bg-charcoal/30">
        <div className="container-eg text-center">
          <h2 className="font-display text-3xl text-frost md:text-4xl">Service areas</h2>
          <p className="mx-auto mt-3 max-w-2xl text-steel">
            Mobile coverage across Riverside, Corona, Eastvale, Moreno Valley, and surrounding communities.
          </p>
          <ul className="mt-6 flex flex-wrap justify-center gap-2">
            {(settings.serviceAreas || []).slice(0, 10).map((area) => (
              <li
                key={area}
                className="rounded-full border border-glass/20 bg-navy/40 px-3 py-1.5 text-sm text-frost/85"
              >
                {area}
              </li>
            ))}
          </ul>
          <Link href="/service-areas" className="mt-6 inline-block text-glass">
            View all service areas →
          </Link>
        </div>
      </section>

      <section className="section-pad">
        <div className="container-eg">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="font-display text-3xl text-frost md:text-4xl">Service FAQs</h2>
            <p className="mt-3 text-steel">
              Common questions about estimates, repairs, and appointments.
            </p>
          </div>
          <div className="mx-auto mt-10 max-w-3xl">
            <FaqAccordion items={faqs.slice(0, 8)} showSearch={false} />
          </div>
        </div>
      </section>

      <CtaBand
        title="Start with a free estimate"
        subtitle="Tell us about your opening—we’ll follow up with next steps."
        phone={settings.primaryPhone || BUSINESS.primaryPhone}
        image={imgs.hero}
      />
    </main>
  );
}

function FeatureColumn({
  title,
  items,
  image,
}: {
  title: string;
  items: { name: string; slug: string }[];
  image: string;
}) {
  return (
    <div className="glass-panel overflow-hidden rounded-2xl">
      <div className="relative aspect-[16/10]">
        <Image src={image} alt={title} fill className="object-cover" sizes="25vw" />
      </div>
      <div className="p-5">
        <h3 className="font-display text-xl text-frost">{title}</h3>
        <ul className="mt-3 space-y-2 text-sm text-steel">
          {items.map((item) => (
            <li key={item.slug}>
              <Link href={`/services/${item.slug}`} className="hover:text-glass">
                {item.name}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
