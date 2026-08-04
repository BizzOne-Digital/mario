import { BUSINESS } from "@/lib/constants";
import type { SiteSettingsDoc } from "@/lib/types";

type SettingsLike = Pick<
  SiteSettingsDoc,
  | "businessName"
  | "primaryPhone"
  | "secondaryPhone"
  | "email"
  | "address"
  | "licenseNumber"
  | "defaultSeo"
  | "serviceAreas"
>;

export function localBusinessJsonLd(settings: SettingsLike) {
  const phone = settings.primaryPhone || BUSINESS.primaryPhone;
  const address = settings.address || BUSINESS.address;

  return {
    "@context": "https://schema.org",
    "@type": "HomeAndConstructionBusiness",
    name: settings.businessName || BUSINESS.name,
    description:
      settings.defaultSeo?.description ||
      "Residential and commercial glass services in Riverside, CA.",
    telephone: phone,
    url: process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
    address: {
      "@type": "PostalAddress",
      streetAddress: "1440 3rd Street #21",
      addressLocality: "Riverside",
      addressRegion: "CA",
      postalCode: "92507",
      addressCountry: "US",
    },
    areaServed: (settings.serviceAreas?.length
      ? settings.serviceAreas
      : ["Riverside", "Corona", "Southern California"]
    ).map((name) => ({ "@type": "Place", name })),
    ...(settings.email ? { email: settings.email } : {}),
    ...(settings.secondaryPhone
      ? { contactPoint: [{ "@type": "ContactPoint", telephone: settings.secondaryPhone, contactType: "customer service" }] }
      : {}),
    identifier: `CA License #${settings.licenseNumber || BUSINESS.licenseNumber}`,
    image: "/logos/express-glass-logo-horizontal.svg",
    priceRange: "$$",
    addressDisplay: address,
  };
}

export function JsonLdScript({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
