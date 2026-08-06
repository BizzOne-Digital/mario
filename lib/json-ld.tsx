import { BUSINESS } from "@/lib/constants";
import type { SiteSettingsDoc } from "@/lib/types";

type SettingsLike = Pick<
  SiteSettingsDoc,
  | "businessName"
  | "primaryPhone"
  | "secondaryPhone"
  | "faxPhone"
  | "email"
  | "address"
  | "licenseNumber"
  | "defaultSeo"
  | "serviceAreas"
>;

export function localBusinessJsonLd(settings: SettingsLike) {
  const phone = settings.primaryPhone || BUSINESS.primaryPhone;
  const street = (settings.address || BUSINESS.address || "").trim();

  return {
    "@context": "https://schema.org",
    "@type": "HomeAndConstructionBusiness",
    name: settings.businessName || BUSINESS.name,
    description:
      settings.defaultSeo?.description ||
      "Fully mobile residential and light commercial glass services in Riverside, CA and surrounding communities.",
    telephone: phone,
    ...(settings.faxPhone?.trim() || BUSINESS.faxPhone
      ? { faxNumber: settings.faxPhone?.trim() || BUSINESS.faxPhone }
      : {}),
    url: process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
    ...(street
      ? {
          address: {
            "@type": "PostalAddress",
            streetAddress: street,
            addressLocality: BUSINESS.city,
            addressRegion: BUSINESS.state,
            addressCountry: "US",
          },
        }
      : {
          address: {
            "@type": "PostalAddress",
            addressLocality: BUSINESS.city,
            addressRegion: BUSINESS.state,
            addressCountry: "US",
          },
        }),
    areaServed: (settings.serviceAreas?.length
      ? settings.serviceAreas
      : ["Riverside", "Corona", "Southern California"]
    ).map((name) => ({ "@type": "Place", name })),
    ...(settings.email ? { email: settings.email } : {}),
    ...(settings.secondaryPhone?.trim()
      ? { contactPoint: [{ "@type": "ContactPoint", telephone: settings.secondaryPhone, contactType: "customer service" }] }
      : {}),
    identifier: `CA License #${settings.licenseNumber || BUSINESS.licenseNumber}`,
    image: "/logos/express-glass-logo-horizontal.svg",
    priceRange: "$$",
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
