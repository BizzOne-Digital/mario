import type { Metadata } from "next";
import { Fraunces, Outfit } from "next/font/google";
import "./globals.css";
import { SiteChrome } from "@/components/SiteChrome";
import { BUSINESS } from "@/lib/constants";
import { getSettings } from "@/lib/data";
import { JsonLdScript, localBusinessJsonLd } from "@/lib/json-ld";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  display: "swap",
});

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  display: "swap",
});

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSettings();
  return {
    title: {
      default: settings.defaultSeo?.title || "Express Glass | Riverside, CA",
      template: `%s | ${settings.businessName || BUSINESS.name}`,
    },
    description:
      settings.defaultSeo?.description ||
      "A trusted glass company in Riverside, CA for residential and commercial glass services.",
    metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"),
    openGraph: {
      title: settings.defaultSeo?.title || "Express Glass",
      description: settings.defaultSeo?.description || "",
      images: settings.defaultSeo?.ogImage ? [settings.defaultSeo.ogImage] : undefined,
    },
    icons: {
      icon: [{ url: "/favicon.svg", type: "image/svg+xml" }],
    },
  };
}

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const settings = await getSettings();

  return (
    <html lang="en" className={`${outfit.variable} ${fraunces.variable} h-full max-w-full overflow-x-clip antialiased`}>
      <body className="flex min-h-full w-full max-w-full flex-col overflow-x-clip font-sans text-frost">
        <JsonLdScript data={localBusinessJsonLd(settings)} />
        <SiteChrome
          email={settings.email || BUSINESS.email}
          introEnabled={settings.introEnabled !== false}
          primaryPhone={settings.primaryPhone || BUSINESS.primaryPhone}
          logoSrc={settings.logoDark || settings.logo || "/logos/express-glass-logo-dark.svg"}
          businessName={settings.businessName || BUSINESS.name}
          secondaryPhone={settings.secondaryPhone || BUSINESS.secondaryPhone}
          faxPhone={settings.faxPhone || BUSINESS.faxPhone}
          address={settings.address || BUSINESS.address}
          licenseNumber={settings.licenseNumber || BUSINESS.licenseNumber}
          footerDescription={settings.footerDescription || ""}
        >
          {children}
        </SiteChrome>
      </body>
    </html>
  );
}
