"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState, type ReactNode } from "react";
import { IntroSequence } from "@/components/IntroSequence";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { SmoothScroll } from "@/components/SmoothScroll";
import { BUSINESS } from "@/lib/constants";

const INTRO_KEY = "eg-intro-seen";

type Props = {
  children: ReactNode;
  email: string;
  introEnabled: boolean;
  primaryPhone: string;
  logoSrc: string;
  businessName: string;
  secondaryPhone: string;
  faxPhone: string;
  address: string;
  licenseNumber: string;
  footerDescription: string;
};

function shouldShowChromeImmediately(introEnabled: boolean, pathname: string) {
  if (!introEnabled || pathname !== "/") return true;
  if (typeof window === "undefined") return false;
  try {
    return sessionStorage.getItem(INTRO_KEY) === "1";
  } catch {
    return true;
  }
}

export function SiteChrome({
  children,
  email,
  introEnabled,
  primaryPhone,
  businessName,
  secondaryPhone,
  faxPhone,
  address,
  licenseNumber,
  footerDescription,
}: Props) {
  const pathname = usePathname();
  const isAdmin = pathname.startsWith("/admin");
  const isHome = pathname === "/";
  const shouldPlayIntro = introEnabled && isHome;

  const [chromeReady, setChromeReady] = useState(() =>
    shouldShowChromeImmediately(introEnabled, pathname),
  );

  useEffect(() => {
    if (!shouldPlayIntro) {
      setChromeReady(true);
    }
  }, [shouldPlayIntro]);

  if (isAdmin) {
    return <>{children}</>;
  }

  return (
    <SmoothScroll>
      {shouldPlayIntro && !chromeReady ? (
        <IntroSequence
          enabled={introEnabled}
          active={isHome}
          onFinished={() => setChromeReady(true)}
        />
      ) : null}

      {chromeReady ? (
        <>
          <SiteHeader
            primaryPhone={primaryPhone}
            primaryPhoneTel={BUSINESS.primaryPhoneTel}
          />
          <div className="flex-1 min-w-0 overflow-x-clip">{children}</div>
          <SiteFooter
            businessName={businessName}
            primaryPhone={primaryPhone}
            secondaryPhone={secondaryPhone}
            faxPhone={faxPhone}
            email={email}
            address={address}
            licenseNumber={licenseNumber}
            footerDescription={footerDescription}
          />
        </>
      ) : (
        <div className="min-h-screen bg-navy" aria-hidden />
      )}
    </SmoothScroll>
  );
}
