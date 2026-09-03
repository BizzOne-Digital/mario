import type { Metadata } from "next";
import { CtaBand } from "@/components/CtaBand";
import { FaqAccordion } from "@/components/FaqAccordion";
import { PageHero } from "@/components/PageHero";
import { BUSINESS } from "@/lib/constants";
import { getPublishedFaqs, getSettings } from "@/lib/data";
import { PAGE_IMAGES } from "@/lib/media";

export const metadata: Metadata = {
  title: "FAQ",
  description:
    "Frequently asked questions about Express Glass estimates, appointments, installation, and repairs.",
};

export default async function FaqPage() {
  const [faqs, settings] = await Promise.all([getPublishedFaqs(), getSettings()]);
  const imgs = PAGE_IMAGES.faq;

  return (
    <main>
      <PageHero
        image={imgs.hero}
        imageAlt="Express Glass FAQ"
        eyebrow="Help"
        title="Frequently Asked Questions"
        subtitle="Browse by category or search by keyword. Need something specific? Call or use the contact form."
        ctas={[
          { href: "/contact", label: "Contact Us" },
          { href: "/contact", label: "Request Estimate", variant: "secondary" },
        ]}
      />

      <section className="section-pad">
        <div className="container-eg">
          <p className="mx-auto mb-10 max-w-2xl text-center text-steel">
            Answers cover estimates, shower doors, windows and doors, mirrors, installation, repairs, commercial
            work, service areas, and appointments. Content reflects how Express Glass actually works—no invented
            warranty claims.
          </p>
          <FaqAccordion items={faqs} />
        </div>
      </section>

      <CtaBand
        title="Still have questions?"
        subtitle={`Call ${settings.primaryPhone || BUSINESS.primaryPhone} or send a message—we’re happy to help.`}
        phone={settings.primaryPhone || BUSINESS.primaryPhone}
        primaryHref="/contact"
        primaryLabel="Contact Us"
        image={imgs.hero}
      />
    </main>
  );
}
