import type { Metadata } from "next";
import Image from "next/image";
import { Shield, Phone, BadgeCheck } from "lucide-react";
import { CtaBand } from "@/components/CtaBand";
import { PageHero } from "@/components/PageHero";
import { TestimonialSlider } from "@/components/TestimonialSlider";
import { BUSINESS } from "@/lib/constants";
import { getApprovedTestimonials, getSettings } from "@/lib/data";
import { PAGE_IMAGES } from "@/lib/media";

export const metadata: Metadata = {
  title: "Testimonials",
  description:
    "Approved customer testimonials for Express Glass residential and commercial glass services.",
};

export default async function TestimonialsPage() {
  const [testimonials, settings] = await Promise.all([
    getApprovedTestimonials(),
    getSettings(),
  ]);
  const imgs = PAGE_IMAGES.testimonials;

  return (
    <main>
      <PageHero
        image={imgs.hero}
        imageAlt="Express Glass customer testimonials"
        eyebrow="Reviews"
        title="Testimonials"
        subtitle="Feedback from approved customers. We do not invent public reviews—approved testimonials appear here after admin review."
        ctas={[
          { href: "/contact", label: "Request Free Estimate" },
          { href: "/contact", label: "Contact", variant: "secondary" },
        ]}
      />

      <section className="section-pad">
        <div className="container-eg">
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
        </div>
      </section>

      <section className="section-pad bg-charcoal/30">
        <div className="container-eg">
          <div className="grid gap-4 md:grid-cols-3">
            {[
              {
                icon: Shield,
                title: "Licensed",
                body: `California License #${settings.licenseNumber || BUSINESS.licenseNumber}. Licensed, bonded & insured.`,
              },
              {
                icon: BadgeCheck,
                title: "Experience",
                body: settings.yearsExperienceText || BUSINESS.sinceText,
              },
              {
                icon: Phone,
                title: "Direct contact",
                body: `Call ${settings.primaryPhone || BUSINESS.primaryPhone} or ${settings.secondaryPhone || BUSINESS.secondaryPhone}.`,
              },
            ].map((item) => (
              <div key={item.title} className="glass-panel rounded-2xl p-5">
                <item.icon className="h-6 w-6 text-glass" />
                <h3 className="mt-3 font-display text-xl text-frost">{item.title}</h3>
                <p className="mt-2 text-sm text-steel">{item.body}</p>
              </div>
            ))}
          </div>

          <div className="mt-10 grid gap-4 sm:grid-cols-3 lg:grid-cols-5">
            {imgs.strip.map((src) => (
              <div key={src} className="relative aspect-[16/10] overflow-hidden rounded-xl">
                <Image src={src} alt="Express Glass project" fill className="object-cover" sizes="20vw" />
              </div>
            ))}
          </div>
        </div>
      </section>

      <CtaBand
        title="Ready for your project?"
        subtitle="Request a free estimate from Express Glass."
        phone={settings.primaryPhone || BUSINESS.primaryPhone}
        image={imgs.hero}
      />
    </main>
  );
}
