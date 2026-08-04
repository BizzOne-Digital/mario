import type { Metadata } from "next";
import Link from "next/link";
import { Clock, MapPin, Phone, Truck } from "lucide-react";
import { ContactForm } from "@/components/ContactForm";
import { CtaBand } from "@/components/CtaBand";
import { BUSINESS } from "@/lib/constants";
import { getSettings } from "@/lib/data";
import { PAGE_IMAGES } from "@/lib/media";
import { AREAS } from "@/lib/site-content";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Contact Express Glass in Riverside, CA. Call (951) 407-0868 for residential and commercial glass service.",
};

export default async function ContactPage() {
  const settings = await getSettings();
  const emailDisplay = settings.email?.trim() || "";
  const areas = settings.serviceAreas?.length ? settings.serviceAreas : AREAS;
  const imgs = PAGE_IMAGES.contact;
  const mapSrc = settings.mapEmbed
    ? null
    : `https://www.google.com/maps?q=${encodeURIComponent(settings.address || BUSINESS.address)}&output=embed`;

  return (
    <main>
      <section className="relative overflow-hidden bg-navy pt-32 pb-16 md:pb-20">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(127,215,234,0.14),transparent_50%)]" />
        <div className="container-eg relative z-10 px-4 text-center md:px-6">
          <p className="text-xs tracking-[0.2em] text-glass uppercase sm:text-sm">Get in touch</p>
          <h1 className="mx-auto mt-2 max-w-3xl font-display text-[2rem] leading-tight text-frost sm:text-4xl md:text-5xl lg:text-6xl">
            Contact Express Glass
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-base text-frost/85 sm:text-lg md:text-xl">
            Call for the fastest response, or send a message with your project details.
          </p>
          <div className="mt-8 flex flex-col items-stretch justify-center gap-3 sm:flex-row sm:flex-wrap">
            <a
              href={`tel:${BUSINESS.primaryPhoneTel}`}
              className="btn-primary w-full sm:w-auto"
            >
              Call {settings.primaryPhone || BUSINESS.primaryPhone}
            </a>
          </div>
        </div>
      </section>

      <section className="section-pad">
        <div className="container-eg grid gap-10 lg:grid-cols-2">
          <div className="space-y-6">
            <div className="glass-panel space-y-4 rounded-2xl p-4 sm:p-6">
              <h2 className="font-display text-2xl text-frost">Contact details</h2>
              <p className="flex min-w-0 items-center gap-3 text-frost">
                <Phone className="h-5 w-5 shrink-0 text-glass" />
                <a href={`tel:${BUSINESS.primaryPhoneTel}`} className="break-all hover:text-glass">
                  {settings.primaryPhone || BUSINESS.primaryPhone}
                </a>
              </p>
              <p className="flex min-w-0 items-center gap-3 text-steel">
                <Phone className="h-5 w-5 shrink-0 text-glass" />
                <a href={`tel:${BUSINESS.secondaryPhoneTel}`} className="break-all hover:text-glass">
                  {settings.secondaryPhone || BUSINESS.secondaryPhone}
                </a>
              </p>
              {emailDisplay ? (
                <p className="text-sm text-steel">
                  <a href={`mailto:${emailDisplay}`} className="hover:text-glass">
                    {emailDisplay}
                  </a>
                </p>
              ) : null}
              <p className="flex items-start gap-3 text-sm text-steel">
                <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-glass" />
                {settings.address || BUSINESS.address}
              </p>
              <p className="flex items-start gap-3 text-sm text-steel">
                <Clock className="mt-0.5 h-5 w-5 shrink-0 text-glass" />
                <span>
                  {settings.hours || "Monday–Friday by appointment"}
                  <br />
                  {settings.saturdayHours || "Saturday appointments available upon request"}
                </span>
              </p>
              <p className="flex items-start gap-3 text-sm text-frost/80">
                <Truck className="mt-0.5 h-5 w-5 shrink-0 text-glass" />
                {settings.mobileServiceNotice ||
                  "Mobile residential and commercial glass service available across our service area."}
              </p>
              <p className="text-xs text-steel">
                CA License #{settings.licenseNumber || BUSINESS.licenseNumber}
              </p>
            </div>

            <div>
              <h3 className="font-display text-xl text-frost">Service areas</h3>
              <p className="mt-2 text-sm text-steel">{areas.slice(0, 8).join(", ")}…</p>
              <Link href="/service-areas" className="mt-2 inline-block text-sm text-glass">
                Full list →
              </Link>
            </div>

            {settings.mapEmbed ? (
              <div
                className="overflow-hidden rounded-2xl border border-glass/20 [&_iframe]:h-72 [&_iframe]:w-full"
                dangerouslySetInnerHTML={{ __html: settings.mapEmbed }}
              />
            ) : mapSrc ? (
              <div className="overflow-hidden rounded-2xl border border-glass/20">
                <iframe
                  title="Express Glass on Google Maps"
                  src={mapSrc}
                  className="h-72 w-full max-w-full"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
            ) : null}
          </div>

          <div>
            <h2 className="mb-4 font-display text-2xl text-frost">Send a message</h2>
            <ContactForm />
          </div>
        </div>
      </section>

      <CtaBand
        title="Ready for a free estimate?"
        subtitle="Send a message or call us with your project details."
        phone={settings.primaryPhone || BUSINESS.primaryPhone}
        image={imgs.hero}
      />
    </main>
  );
}
