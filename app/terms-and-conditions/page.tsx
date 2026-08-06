import type { Metadata } from "next";
import Link from "next/link";
import { LegalLayout } from "@/components/LegalLayout";
import { BUSINESS } from "@/lib/constants";
import { getPageBySlug } from "@/lib/data";
import { PAGE_IMAGES } from "@/lib/media";

export const metadata: Metadata = {
  title: "Terms and Conditions",
  description: "Terms and conditions for using the Express Glass website and requesting services.",
};

export default async function TermsPage() {
  const page = await getPageBySlug("terms-and-conditions");

  return (
    <LegalLayout
      title={page?.title || "Terms and Conditions"}
      image={PAGE_IMAGES.legal.terms}
    >
      <p className="text-sm text-frost/70">Last updated: August 2026</p>

      <h2 className="!mt-8 font-display text-2xl text-frost">Agreement to terms</h2>
      <p>
        By accessing the {BUSINESS.name} website, you agree to these Terms and Conditions. If you do not agree, please
        do not use the site. These terms govern website use and online estimate or contact requests; they do not replace
        a written work agreement for a specific project when one is issued.
      </p>

      <h2 className="!mt-8 font-display text-2xl text-frost">Services and estimates</h2>
      <p>
        Submitting a form or requesting an estimate does not create a binding contract for glass work until scope,
        pricing, materials, and scheduling are confirmed with our team. Estimates are based on the information you
        provide and may be refined after on-site measurement. Service availability varies by location and schedule.
      </p>

      <h2 className="!mt-8 font-display text-2xl text-frost">Licensing</h2>
      <p>
        Licensed work is performed under California License #{BUSINESS.licenseNumber}. {BUSINESS.name} is licensed,
        bonded, and insured for the glass services we perform.
      </p>

      <h2 className="!mt-8 font-display text-2xl text-frost">Website content</h2>
      <p>
        Website content—including service descriptions, photography, and educational articles—is for general
        information and may be updated without notice. Showcase or stock photography may illustrate typical glass work
        and is not a guarantee of a specific finished project. Do not rely on website text for engineering, code, or
        warranty advice beyond what is confirmed for your job.
      </p>

      <h2 className="!mt-8 font-display text-2xl text-frost">Acceptable use</h2>
      <p>
        You agree to provide accurate information when submitting requests and not to misuse the site (including
        attempting to disrupt security, scrape content in bulk without permission, or submit spam).
      </p>

      <h2 className="!mt-8 font-display text-2xl text-frost">Limitation of liability</h2>
      <p>
        To the fullest extent permitted by law, {BUSINESS.name} is not liable for indirect or consequential damages
        arising from website use. Project-related responsibilities are governed by the specific agreement and applicable
        law for the work performed.
      </p>

      <h2 className="!mt-8 font-display text-2xl text-frost">Contact</h2>
      <p>
        For current project questions,{" "}
        <Link href="/contact" className="text-glass">
          contact Express Glass
        </Link>{" "}
        or call {BUSINESS.primaryPhone}.
      </p>
    </LegalLayout>
  );
}
