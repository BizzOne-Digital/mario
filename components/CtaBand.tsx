import Image from "next/image";
import Link from "next/link";
import { Phone } from "lucide-react";
import { BUSINESS } from "@/lib/constants";
import { PAGE_IMAGES } from "@/lib/media";

type Props = {
  title?: string;
  subtitle?: string;
  image?: string;
  primaryHref?: string;
  primaryLabel?: string;
  phone?: string;
  phoneTel?: string;
};

export function CtaBand({
  title = "Ready for clearer results?",
  subtitle = "Request a free estimate or call Express Glass today.",
  image = PAGE_IMAGES.home.cta,
  primaryHref = "/contact",
  primaryLabel = "Request Free Estimate",
  phone = BUSINESS.primaryPhone,
  phoneTel = BUSINESS.primaryPhoneTel,
}: Props) {
  return (
    <section className="section-pad !pt-0 !pb-20">
      <div className="container-eg">
        <div className="relative overflow-hidden rounded-3xl border border-glass/25">
          <Image
            src={image}
            alt=""
            fill
            className="object-cover opacity-35"
            sizes="100vw"
            aria-hidden
          />
          <div className="absolute inset-0 bg-gradient-to-t from-navy via-navy/70 to-navy/50" />
          <div className="relative z-10 px-4 py-12 text-center sm:px-6 sm:py-16 md:px-12">
            <h2 className="font-display text-2xl text-frost sm:text-3xl md:text-4xl">{title}</h2>
            <p className="mx-auto mt-3 max-w-xl text-sm text-steel sm:text-base">{subtitle}</p>
            <div className="mt-8 flex flex-col items-stretch justify-center gap-3 sm:flex-row sm:flex-wrap sm:items-center">
              <Link href={primaryHref} className="btn-primary w-full sm:w-auto">
                {primaryLabel}
              </Link>
              <a href={`tel:${phoneTel}`} className="btn-secondary w-full sm:w-auto">
                <Phone className="h-4 w-4" />
                {phone}
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
