import type { Metadata } from "next";
import Link from "next/link";
import { LegalLayout } from "@/components/LegalLayout";
import { BUSINESS } from "@/lib/constants";
import { getPageBySlug } from "@/lib/data";
import { PAGE_IMAGES } from "@/lib/media";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "Privacy policy for Express Glass website visitors and customers.",
};

export default async function PrivacyPolicyPage() {
  const page = await getPageBySlug("privacy-policy");

  return (
    <LegalLayout title={page?.title || "Privacy Policy"} image={PAGE_IMAGES.legal.privacy}>
      <p className="text-sm text-frost/70">Last updated: August 2026</p>
      {page?.seoDescription ? <p>{page.seoDescription}</p> : null}

      <h2 className="!mt-8 font-display text-2xl text-frost">Who we are</h2>
      <p>
        This Privacy Policy describes how {BUSINESS.name} (“we,” “us”) handles information collected through our
        website and related contact or estimate forms. We are a fully mobile local glass company serving residential
        and commercial customers in the {BUSINESS.city}, {BUSINESS.state} area and surrounding communities.
      </p>

      <h2 className="!mt-8 font-display text-2xl text-frost">Information we collect</h2>
      <p>
        When you submit a contact or estimate request, you may provide your name, phone number, email address (if
        entered), property location, project details, and any files or photos you choose to attach. We also receive
        basic technical information that browsers and servers typically collect, such as IP address, browser type, and
        pages visited, when analytics tools are enabled in site settings.
      </p>

      <h2 className="!mt-8 font-display text-2xl text-frost">How we use information</h2>
      <p>
        We use submitted information to respond to your inquiry, prepare estimates, schedule appointments, provide
        glass services, and improve our website experience. Form submissions may be stored in our systems and, when
        outbound email is configured, used to notify our team. We do not sell your personal information.
      </p>

      <h2 className="!mt-8 font-display text-2xl text-frost">Cookies and analytics</h2>
      <p>
        Essential cookies may be required for site functionality (for example, admin authentication). Optional analytics
        or advertising identifiers are used only if enabled in site settings. You can control cookies through your
        browser settings.
      </p>

      <h2 className="!mt-8 font-display text-2xl text-frost">Data retention and security</h2>
      <p>
        We retain inquiry and estimate information as needed to provide service and maintain ordinary business records.
        We use reasonable administrative and technical measures to protect information, but no method of transmission
        over the internet is completely secure.
      </p>

      <h2 className="!mt-8 font-display text-2xl text-frost">Your choices</h2>
      <p>
        You may call us to update contact details associated with an open request or to ask questions about information
        you submitted. For service requests, call {BUSINESS.primaryPhone}, email{" "}
        <a href={`mailto:${BUSINESS.email}`} className="text-glass">
          {BUSINESS.email}
        </a>
        , or use the{" "}
        <Link href="/contact" className="text-glass">
          contact form
        </Link>
        .
      </p>

      <h2 className="!mt-8 font-display text-2xl text-frost">Changes</h2>
      <p>
        We may update this Privacy Policy from time to time. The “last updated” date at the top of this page will
        change when material revisions are posted.
      </p>
    </LegalLayout>
  );
}
