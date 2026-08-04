import Image from "next/image";
import Link from "next/link";
import { MapPin, Phone } from "lucide-react";
import { BUSINESS, FOOTER_LINKS, NAV_LINKS } from "@/lib/constants";

type Props = {
  businessName?: string;
  primaryPhone?: string;
  secondaryPhone?: string;
  email?: string;
  address?: string;
  licenseNumber?: string;
  footerDescription?: string;
};

export function SiteFooter({
  businessName = BUSINESS.name,
  primaryPhone = BUSINESS.primaryPhone,
  secondaryPhone = BUSINESS.secondaryPhone,
  email = "",
  address = BUSINESS.address,
  licenseNumber = BUSINESS.licenseNumber,
  footerDescription = "Express Glass provides residential and commercial glass services across Riverside, Corona, and surrounding Southern California communities.",
}: Props) {
  const emailDisplay = email.trim();

  return (
    <footer className="mt-auto border-t border-glass/15 bg-charcoal/80">
      <div className="container-eg grid gap-10 px-4 py-14 md:grid-cols-2 md:px-6 lg:grid-cols-4">
        <div className="min-w-0 space-y-4">
          <div className="relative h-12 w-full max-w-[12rem] sm:h-14 sm:w-48">
            <Image
              src="/logos/express-glass-logo-dark.svg"
              alt={businessName}
              fill
              className="object-contain object-left"
            />
          </div>
          <p className="text-sm leading-relaxed break-words text-steel">{footerDescription}</p>
          <p className="text-xs text-steel">Licensed, bonded & insured · CA #{licenseNumber}</p>
        </div>

        <div>
          <h2 className="font-display text-lg text-frost">Explore</h2>
          <ul className="mt-4 space-y-2 text-sm text-steel">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="hover:text-glass">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h2 className="font-display text-lg text-frost">Resources</h2>
          <ul className="mt-4 space-y-2 text-sm text-steel">
            {FOOTER_LINKS.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="hover:text-glass">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="space-y-3 text-sm text-steel">
          <h2 className="font-display text-lg text-frost">Contact</h2>
          <p className="flex items-start gap-2">
            <Phone className="mt-0.5 h-4 w-4 text-glass" />
            <span>
              <a href={`tel:${BUSINESS.primaryPhoneTel}`} className="text-frost hover:text-glass">
                {primaryPhone}
              </a>
              <br />
              <a href={`tel:${BUSINESS.secondaryPhoneTel}`} className="hover:text-glass">
                {secondaryPhone}
              </a>
            </span>
          </p>
          {emailDisplay ? (
            <p>
              <a href={`mailto:${emailDisplay}`} className="hover:text-glass">
                {emailDisplay}
              </a>
            </p>
          ) : null}
          <p className="flex items-start gap-2">
            <MapPin className="mt-0.5 h-4 w-4 text-glass" />
            <span>{address}</span>
          </p>
        </div>
      </div>
      <div className="border-t border-glass/10 px-4 py-4 text-center text-xs text-steel">
        © {new Date().getFullYear()} {businessName}. All rights reserved.
      </div>
    </footer>
  );
}
