import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { BeforeAfterSlider } from "@/components/BeforeAfterSlider";
import { CtaBand } from "@/components/CtaBand";
import { FaqAccordion } from "@/components/FaqAccordion";
import { PageHero } from "@/components/PageHero";
import { SectionReveal } from "@/components/SectionReveal";
import { BUSINESS, SERVICE_SLUGS } from "@/lib/constants";
import { getServiceBySlug, getPublishedServices, getPublishedFaqs } from "@/lib/data";
import { PAGE_IMAGES, SERVICE_IMAGES } from "@/lib/media";
import { getServiceSeed } from "@/lib/site-content";
import type { ServiceSlug } from "@/lib/constants";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return SERVICE_SLUGS.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const service = await getServiceBySlug(slug);
  if (!service) return { title: "Service" };
  return {
    title: service.seoTitle || service.name,
    description: service.seoDescription || service.shortDescription,
    openGraph: {
      images: service.ogImage || service.mainImage ? [service.ogImage || service.mainImage] : undefined,
    },
  };
}

export default async function ServiceDetailPage({ params }: Props) {
  const { slug } = await params;
  const service = await getServiceBySlug(slug);
  if (!service) notFound();

  const seed = getServiceSeed(slug);
  const media = SERVICE_IMAGES[slug as ServiceSlug];
  const images = {
    hero: service.mainImage || service.heroBackground || media?.hero || PAGE_IMAGES.home.residential,
    overview: media?.overview || seed?.images.overview || PAGE_IMAGES.home.residential,
    detail: media?.detail || seed?.images.detail || PAGE_IMAGES.home.showerFeature,
    process: media?.process || seed?.images.process || PAGE_IMAGES.home.cta,
    completed: media?.completed || seed?.images.completed || PAGE_IMAGES.home.residential,
  };

  const galleryStrip =
    service.galleryImages?.length && service.galleryImages.length >= 5
      ? service.galleryImages.slice(0, 5)
      : media?.gallery
        ? [...media.gallery]
        : [images.hero, images.overview, images.detail, images.process, images.completed];

  const features = service.features?.length ? service.features : seed?.bullets ?? [];
  const applications = service.applications?.length ? service.applications : seed?.applications ?? [];
  const materials = service.materials?.length ? service.materials : seed?.materials ?? [];
  const processSteps = service.processSteps?.length
    ? service.processSteps
    : seed?.processSteps ?? [];
  const benefits = service.benefits?.length ? service.benefits : seed?.benefits ?? [];
  const repairVsReplace = service.repairVsReplace || seed?.repairVsReplace || "";

  const related = await getPublishedServices();
  const relatedCards = related
    .filter(
      (s) =>
        service.relatedServiceSlugs?.includes(s.slug) ||
        (s.slug !== slug && s.category === service.category),
    )
    .slice(0, 3);

  const siteFaqs = await getPublishedFaqs();
  const serviceFaqs = service.faqs?.length
    ? service.faqs
    : seed?.faqs ?? [];
  const faqs =
    serviceFaqs.length > 0
      ? serviceFaqs.map((f, i) => ({
          _id: `svc-faq-${i}`,
          question: f.question,
          answer: f.answer,
          category: "Service",
        }))
      : siteFaqs.slice(0, 4);

  const beforeAfter = service.beforeAfter?.[0];

  return (
    <main>
      <PageHero
        image={images.hero}
        imageAlt={service.imageAlt || service.name}
        eyebrow={service.heroEyebrow || "Express Glass Service"}
        title={service.heroHeading || service.name}
        subtitle={service.heroDescription || service.shortDescription}
        ctas={[
          { href: "/contact", label: service.ctaLabel || "Request Free Estimate" },
          { href: "/contact", label: "Contact", variant: "secondary" },
        ]}
      />

      <section className="section-pad">
        <div className="container-eg grid gap-10 lg:grid-cols-2 lg:items-center">
          <SectionReveal>
            <h2 className="font-display text-3xl text-frost">Overview</h2>
            <p className="mt-4 leading-relaxed text-steel">
              {service.overview || seed?.intro || service.shortDescription}
            </p>
            {features.length ? (
              <ul className="mt-6 space-y-2 text-sm text-frost/85">
                {features.map((f) => (
                  <li key={f} className="flex gap-2">
                    <span className="text-glass">•</span>
                    {f}
                  </li>
                ))}
              </ul>
            ) : null}
          </SectionReveal>
          <SectionReveal className="relative aspect-[4/3] overflow-hidden rounded-2xl">
            <Image
              src={images.overview}
              alt={`${service.name} overview`}
              fill
              className="object-cover"
              sizes="50vw"
            />
          </SectionReveal>
        </div>
      </section>

      {(applications.length || materials.length) ? (
        <section className="section-pad bg-charcoal/30">
          <div className="container-eg grid gap-8 md:grid-cols-2">
            {applications.length ? (
              <div className="glass-panel rounded-2xl p-6">
                <h2 className="font-display text-2xl text-frost">Applications</h2>
                <ul className="mt-4 space-y-2 text-sm text-steel">
                  {applications.map((a) => (
                    <li key={a}>{a}</li>
                  ))}
                </ul>
              </div>
            ) : null}
            {materials.length ? (
              <div className="glass-panel rounded-2xl p-6">
                <h2 className="font-display text-2xl text-frost">Materials & options</h2>
                <ul className="mt-4 space-y-2 text-sm text-steel">
                  {materials.map((m) => (
                    <li key={m}>{m}</li>
                  ))}
                </ul>
              </div>
            ) : null}
          </div>
        </section>
      ) : null}

      {processSteps.length ? (
        <section className="section-pad">
          <div className="container-eg">
            <div className="grid gap-8 lg:grid-cols-2 lg:items-center">
              <SectionReveal className="relative aspect-[4/3] overflow-hidden rounded-2xl">
                <Image
                  src={images.process}
                  alt={`${service.name} process`}
                  fill
                  className="object-cover"
                  sizes="50vw"
                />
              </SectionReveal>
              <SectionReveal>
                <h2 className="font-display text-3xl text-frost">Process</h2>
                <div className="mt-6 space-y-4">
                  {processSteps.map((step, i) => (
                    <div key={step.title} className="glass-panel rounded-xl p-4">
                      <p className="text-xs tracking-widest text-glass uppercase">Step {i + 1}</p>
                      <h3 className="mt-1 font-display text-lg text-frost">{step.title}</h3>
                      <p className="mt-1 text-sm text-steel">{step.description}</p>
                    </div>
                  ))}
                </div>
              </SectionReveal>
            </div>
          </div>
        </section>
      ) : null}

      {benefits.length ? (
        <section className="section-pad bg-charcoal/30">
          <div className="container-eg">
            <h2 className="font-display text-3xl text-frost">Benefits</h2>
            <ul className="mt-6 grid gap-3 md:grid-cols-2">
              {benefits.map((b) => (
                <li key={b} className="glass-panel rounded-xl px-4 py-3 text-sm text-frost/85">
                  {b}
                </li>
              ))}
            </ul>
            <div className="relative mt-10 aspect-[21/9] overflow-hidden rounded-2xl">
              <Image
                src={images.detail}
                alt={`${service.name} detail`}
                fill
                className="object-cover"
                sizes="100vw"
              />
            </div>
          </div>
        </section>
      ) : null}

      {repairVsReplace ? (
        <section className="section-pad">
          <div className="container-eg max-w-3xl">
            <h2 className="font-display text-3xl text-frost">Repair vs replacement</h2>
            <p className="mt-4 leading-relaxed text-steel">{repairVsReplace}</p>
          </div>
        </section>
      ) : null}

      <section className="section-pad bg-charcoal/30">
        <div className="container-eg">
          <h2 className="font-display text-3xl text-frost">Project gallery</h2>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {galleryStrip.map((src, i) => (
              <div key={`${src}-${i}`} className="relative aspect-[4/3] overflow-hidden rounded-2xl">
                <Image
                  src={src}
                  alt={`${service.name} gallery ${i + 1}`}
                  fill
                  className="object-cover"
                  sizes="20vw"
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-pad">
        <div className="container-eg grid gap-8 lg:grid-cols-2">
          <div>
            <h2 className="font-display text-3xl text-frost">Completed look</h2>
            <div className="relative mt-6 aspect-[4/3] overflow-hidden rounded-2xl">
              <Image
                src={images.completed}
                alt={`${service.name} completed project`}
                fill
                className="object-cover"
                sizes="50vw"
              />
            </div>
          </div>
          <div>
            <h2 className="font-display text-3xl text-frost">Before & after</h2>
            <div className="mt-6">
              <BeforeAfterSlider
                beforeSrc={beforeAfter?.before || images.detail}
                afterSrc={beforeAfter?.after || images.completed}
                caption={beforeAfter?.caption || `${service.name} example`}
              />
            </div>
          </div>
        </div>
      </section>

      {faqs.length ? (
        <section className="section-pad bg-charcoal/30">
          <div className="container-eg">
            <h2 className="mb-8 font-display text-3xl text-frost">FAQs</h2>
            <FaqAccordion items={faqs} showSearch={false} />
          </div>
        </section>
      ) : null}

      {relatedCards.length ? (
        <section className="section-pad">
          <div className="container-eg">
            <h2 className="font-display text-3xl text-frost">Related services</h2>
            <div className="mt-8 grid gap-6 md:grid-cols-3">
              {relatedCards.map((s) => (
                <Link
                  key={s.slug}
                  href={`/services/${s.slug}`}
                  className="glass-panel overflow-hidden rounded-2xl hover:border-glass/40"
                >
                  <div className="relative aspect-[16/10]">
                    <Image
                      src={s.mainImage || images.hero}
                      alt={s.name}
                      fill
                      className="object-cover"
                      sizes="33vw"
                    />
                  </div>
                  <div className="p-5">
                    <h3 className="font-display text-lg text-frost">{s.name}</h3>
                    <p className="mt-2 text-sm text-steel">{s.shortDescription}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      <CtaBand
        title={service.finalCta || `Ready for a ${service.name.toLowerCase()} estimate?`}
        subtitle="Call Express Glass or request a free estimate online."
        phone={BUSINESS.primaryPhone}
        image={images.hero}
      />
    </main>
  );
}
