import type { Metadata } from "next";
import Link from "next/link";
import { LegalLayout } from "@/components/LegalLayout";
import { BUSINESS } from "@/lib/constants";
import { getPageBySlug } from "@/lib/data";
import { PAGE_IMAGES } from "@/lib/media";

export const metadata: Metadata = {
  title: "Accessibility",
  description: "Accessibility commitment for the Express Glass website.",
};

export default async function AccessibilityPage() {
  const page = await getPageBySlug("accessibility");

  return (
    <LegalLayout title={page?.title || "Accessibility"} image={PAGE_IMAGES.legal.accessibility}>
      <p className="text-sm text-frost/70">Last updated: August 2026</p>

      <h2 className="!mt-8 font-display text-2xl text-frost">Our commitment</h2>
      <p>
        {BUSINESS.name} aims to make this website usable for visitors with diverse abilities. We design pages with
        semantic headings, keyboard-focusable controls, meaningful image alternatives, and respect for
        prefers-reduced-motion where animations are present.
      </p>

      <h2 className="!mt-8 font-display text-2xl text-frost">Ongoing improvements</h2>
      <p>
        Accessibility is an ongoing effort. As we add content and features, we work to maintain readable contrast,
        clear focus states, and understandable form labels. Third-party embeds (such as maps) may have their own
        accessibility characteristics outside our full control.
      </p>

      <h2 className="!mt-8 font-display text-2xl text-frost">Feedback and assistance</h2>
      <p>
        If you encounter a barrier while using the site, need content in an alternate format, or require help requesting
        an estimate, please call {BUSINESS.primaryPhone} or use our{" "}
        <Link href="/contact" className="text-glass">
          contact page
        </Link>
        . We will work with you to provide the information or support you need.
      </p>

      <h2 className="!mt-8 font-display text-2xl text-frost">Business contact</h2>
      <p>
        {BUSINESS.name} · Fully mobile · {BUSINESS.city}, {BUSINESS.state} area · {BUSINESS.primaryPhone}
        {BUSINESS.faxPhone ? ` · Fax ${BUSINESS.faxPhone}` : ""} · CA License #
        {BUSINESS.licenseNumber}
      </p>
    </LegalLayout>
  );
}
