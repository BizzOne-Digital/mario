import Image from "next/image";
import Link from "next/link";
import { BeforeAfterSlider } from "@/components/BeforeAfterSlider";
import { CtaBand } from "@/components/CtaBand";
import { FaqAccordion } from "@/components/FaqAccordion";
import { HomeHero } from "@/components/HomeHero";
import { SectionReveal } from "@/components/SectionReveal";
import { ServiceCard } from "@/components/ServiceCard";
import { TestimonialSlider } from "@/components/TestimonialSlider";
import { BUSINESS, PROCESS_STEPS } from "@/lib/constants";
import {
  getApprovedTestimonials,
  getGalleryImages,
  getPublishedFaqs,
  getPublishedServices,
  getSettings,
} from "@/lib/data";
import { PAGE_IMAGES } from "@/lib/media";
import { WHY_CHOOSE } from "@/lib/site-content";

export default async function HomePage() {
  const [settings, services, faqs, testimonials, gallery] = await Promise.all([
    getSettings(),
    getPublishedServices(),
    getPublishedFaqs(),
    getApprovedTestimonials(),
    getGalleryImages(),
  ]);

  const featured = services.filter((s) => s.featured).slice(0, 6);
  const cards = (featured.length ? featured : services).slice(0, 6);
  const previewFaqs = faqs.slice(0, 5);
  const previewGallery = gallery.slice(0, 6);
  const areas = settings.serviceAreas?.length ? settings.serviceAreas : [];
  const imgs = PAGE_IMAGES.home;

  return (
    <main>
      <HomeHero licenseNumber={settings.licenseNumber || BUSINESS.licenseNumber} />

      <section className="section-pad">
        <div className="container-eg">
          <SectionReveal>
            <p className="text-sm tracking-widest text-glass uppercase">Services</p>
            <h2 className="mt-2 font-display text-3xl text-frost md:text-4xl">Glass solutions that fit</h2>
            <p className="mt-3 max-w-2xl text-steel">
              Residential and light commercial glass — showers, windows, doors, and small storefront work across Southern California.
            </p>
          </SectionReveal>
          <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {cards.map((service, i) => (
              <SectionReveal key={service._id || service.slug} delay={i * 0.05} className="h-full">
                <ServiceCard
                  name={service.name}
                  slug={service.slug}
                  shortDescription={service.shortDescription}
                  mainImage={service.mainImage || imgs.residential}
                  imageAlt={service.imageAlt}
                />
              </SectionReveal>
            ))}
          </div>
          <div className="mt-8 text-center">
            <Link href="/services" className="text-glass hover:text-cyan-light">
              View all services →
            </Link>
          </div>
        </div>
      </section>

      <section className="section-pad bg-charcoal/30">
        <div className="container-eg grid items-center gap-10 lg:grid-cols-2">
          <SectionReveal direction="left">
            <div className="relative aspect-[4/3] overflow-hidden rounded-2xl">
              <Image
                src={imgs.showerFeature}
                alt="Frameless shower door"
                fill
                className="object-cover"
                sizes="(max-width:1024px) 100vw, 50vw"
              />
            </div>
          </SectionReveal>
          <SectionReveal direction="right">
            <p className="text-sm tracking-widest text-glass uppercase">Shower Glass</p>
            <h2 className="mt-2 font-display text-3xl text-frost md:text-4xl">
              Custom shower doors & enclosures
            </h2>
            <p className="mt-4 text-steel">
              Frameless and sliding configurations measured for your opening, with hardware finishes chosen for
              daily durability and a finished look.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link href="/services/custom-shower-doors" className="btn-primary">
                Shower Doors
              </Link>
              <Link href="/services/tub-enclosures" className="btn-secondary">
                Tub Enclosures
              </Link>
            </div>
          </SectionReveal>
        </div>
      </section>

      <section className="section-pad">
        <div className="container-eg grid items-center gap-10 lg:grid-cols-2">
          <SectionReveal direction="left" className="order-2 lg:order-1">
            <p className="text-sm tracking-widest text-glass uppercase">Windows · Doors · Mirrors</p>
            <h2 className="mt-2 font-display text-3xl text-frost md:text-4xl">Clarity where it matters</h2>
            <p className="mt-4 text-steel">
              From fogged window units to patio door panels and custom mirrors, Express Glass restores light and
              finish with professional measurement and installation.
            </p>
            <ul className="mt-6 space-y-2 text-sm text-frost/85">
              <li>
                <Link href="/services/window-glass-replacement" className="hover:text-glass">
                  Window glass replacement
                </Link>
              </li>
              <li>
                <Link href="/services/glass-patio-doors" className="hover:text-glass">
                  Glass patio doors
                </Link>
              </li>
              <li>
                <Link href="/services/mirror-glass-replacement" className="hover:text-glass">
                  Mirror glass replacement
                </Link>
              </li>
            </ul>
          </SectionReveal>
          <SectionReveal direction="right" className="order-1 grid grid-cols-2 gap-4 lg:order-2">
            <div className="relative aspect-square overflow-hidden rounded-2xl">
              <Image src={imgs.window} alt="Window replacement" fill className="object-cover" sizes="25vw" />
            </div>
            <div className="relative aspect-square overflow-hidden rounded-2xl">
              <Image src={imgs.patio} alt="Patio doors" fill className="object-cover" sizes="25vw" />
            </div>
            <div className="relative col-span-2 aspect-[21/9] overflow-hidden rounded-2xl">
              <Image src={imgs.mirror} alt="Custom mirror" fill className="object-cover" sizes="50vw" />
            </div>
          </SectionReveal>
        </div>
      </section>

      <section className="section-pad bg-charcoal/30">
        <div className="container-eg">
          <SectionReveal className="text-center">
            <h2 className="font-display text-3xl text-frost md:text-4xl">Residential & light commercial</h2>
            <p className="mx-auto mt-3 max-w-2xl text-steel">
              Mobile service for homes and small businesses — showers, window and door glass, and 1st-floor
              storefront door lites across Riverside, Corona, and nearby communities.
            </p>
          </SectionReveal>
          <div className="mt-10 grid gap-6 md:grid-cols-2">
            <SectionReveal>
              <div className="glass-panel overflow-hidden rounded-2xl">
                <div className="relative aspect-[16/10]">
                  <Image src={imgs.residential} alt="Residential glass" fill className="object-cover" sizes="50vw" />
                </div>
                <div className="p-6">
                  <h3 className="font-display text-2xl text-frost">Residential</h3>
                  <p className="mt-2 text-sm text-steel">
                    Showers, windows, doors, mirrors, and custom in-home glass projects.
                  </p>
                  <Link href="/services/residential-glass-installation" className="mt-4 inline-block text-glass">
                    Residential services →
                  </Link>
                </div>
              </div>
            </SectionReveal>
            <SectionReveal delay={0.1}>
              <div className="glass-panel overflow-hidden rounded-2xl">
                <div className="relative aspect-[16/10]">
                  <Image src={imgs.commercial} alt="Commercial glass" fill className="object-cover" sizes="50vw" />
                </div>
                <div className="p-6">
                  <h3 className="font-display text-2xl text-frost">Commercial</h3>
                  <p className="mt-2 text-sm text-steel">
                    Small 1st-floor storefronts, door lites, and business window or door glass — not high-rise or
                    large building glazing.
                  </p>
                  <Link href="/services/commercial-glass-installation" className="mt-4 inline-block text-glass">
                    Commercial services →
                  </Link>
                </div>
              </div>
            </SectionReveal>
          </div>
        </div>
      </section>

      <section className="section-pad">
        <div className="container-eg">
          <SectionReveal>
            <h2 className="font-display text-3xl text-frost md:text-4xl">Why choose Express Glass</h2>
          </SectionReveal>
          <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
            {WHY_CHOOSE.map((item, i) => (
              <SectionReveal key={item.title} delay={i * 0.05} className="glass-panel flex h-full flex-col rounded-2xl p-5">
                <h3 className="font-display text-xl text-frost">{item.title}</h3>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-steel">{item.description}</p>
              </SectionReveal>
            ))}
          </div>
        </div>
      </section>

      <section className="section-pad bg-charcoal/30">
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

      <section className="section-pad">
        <div className="container-eg grid gap-8 lg:grid-cols-2 lg:items-center">
          <SectionReveal>
            <h2 className="font-display text-3xl text-frost md:text-4xl">Before & after</h2>
            <p className="mt-3 text-steel">
              See how precise measurement and installation transform everyday glass openings.
            </p>
          </SectionReveal>
          <SectionReveal delay={0.1}>
            <BeforeAfterSlider
              beforeSrc={imgs.beforeAfter.before}
              afterSrc={imgs.beforeAfter.after}
            />
          </SectionReveal>
        </div>
      </section>

      <section className="section-pad bg-charcoal/30">
        <div className="container-eg text-center">
          <SectionReveal>
            <h2 className="font-display text-3xl text-frost md:text-4xl">Service areas</h2>
            <p className="mx-auto mt-3 max-w-2xl text-steel">
              Mobile residential and commercial glass service across Riverside County, Orange County, and nearby
              communities.
            </p>
          </SectionReveal>
          <ul className="mt-8 flex flex-wrap justify-center gap-2">
            {areas.map((area) => (
              <li
                key={area}
                className="rounded-full border border-glass/20 bg-navy/40 px-3 py-1.5 text-sm text-frost/85"
              >
                {area}
              </li>
            ))}
          </ul>
          <Link href="/service-areas" className="mt-6 inline-block text-glass">
            Full service area list →
          </Link>
        </div>
      </section>

      {settings.specialOfferEnabled ? (
        <section className="section-pad !pt-0">
          <div className="container-eg">
            <div className="glass-panel-strong rounded-2xl border-accent/30 px-6 py-8 text-center md:px-10">
              <p className="text-sm tracking-widest text-accent uppercase">Special offer</p>
              <h2 className="mt-2 font-display text-2xl text-frost md:text-3xl">
                {settings.specialOfferText || "10% Off for Senior Citizens and Military Personnel"}
              </h2>
              <Link href="/contact" className="btn-primary mt-6 inline-flex">
                Claim with your estimate
              </Link>
            </div>
          </div>
        </section>
      ) : null}

      <section className="section-pad !pt-0">
        <div className="container-eg">
          <div className="flex items-end justify-between gap-4">
            <SectionReveal>
              <h2 className="font-display text-3xl text-frost">Gallery preview</h2>
            </SectionReveal>
            <Link href="/gallery" className="text-sm text-glass">
              View gallery →
            </Link>
          </div>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {previewGallery.map((img) => (
              <div
                key={img._id}
                className="relative aspect-[4/3] overflow-hidden rounded-2xl border border-glass/15"
              >
                <Image src={img.url} alt={img.alt} fill className="object-cover" sizes="33vw" />
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-pad bg-charcoal/30">
        <div className="container-eg">
          <SectionReveal className="mb-8 text-center">
            <h2 className="font-display text-3xl text-frost">What customers say</h2>
          </SectionReveal>
          <TestimonialSlider
            items={testimonials.map((t) => ({
              _id: t._id,
              customerName: t.customerName,
              reviewText: t.reviewText,
              service: t.service,
              location: t.location,
              rating: t.rating,
            }))}
          />
          <div className="mt-6 text-center">
            <Link href="/testimonials" className="text-glass">
              All testimonials →
            </Link>
          </div>
        </div>
      </section>

      <section className="section-pad">
        <div className="container-eg grid gap-10 lg:grid-cols-2">
          <SectionReveal>
            <h2 className="font-display text-3xl text-frost">FAQ</h2>
            <p className="mt-3 text-steel">Quick answers about estimates, appointments, and service.</p>
            <Link href="/faq" className="mt-4 inline-block text-glass">
              Browse all FAQs →
            </Link>
          </SectionReveal>
          <SectionReveal delay={0.08}>
            <FaqAccordion items={previewFaqs} showSearch={false} />
          </SectionReveal>
        </div>
      </section>

      <CtaBand
        phone={settings.primaryPhone || BUSINESS.primaryPhone}
        image={imgs.cta}
      />
    </main>
  );
}
