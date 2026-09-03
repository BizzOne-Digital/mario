import Image from "next/image";
import Link from "next/link";
import { BUSINESS } from "@/lib/constants";

type Props = {
  licenseNumber?: string;
};

export function HomeHero({ licenseNumber = BUSINESS.licenseNumber }: Props) {
  return (
    <section className="relative min-h-[100svh] overflow-hidden">
      <Image
        src="/images/hero-background.png"
        alt="Express Glass residential and small commercial glass craftsmanship"
        fill
        priority
        className="object-cover object-center"
        sizes="100vw"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-[#071A2B]/92 via-[#071A2B]/55 to-transparent md:via-[#071A2B]/35 md:to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-t from-[#071A2B]/70 via-transparent to-[#071A2B]/25" />

      <div className="relative z-10 mx-auto flex min-h-[100svh] w-full max-w-7xl flex-col justify-end px-4 pb-10 pt-28 md:justify-center md:px-8 md:pb-16 md:pt-32 lg:px-10">
        <div className="max-w-xl min-w-0 lg:max-w-2xl">
          <div className="mb-4 flex min-w-0 items-center gap-3">
            <span className="h-0.5 w-8 shrink-0 rounded-full bg-[#E4A85D]" aria-hidden />
            <p className="text-[10px] font-semibold tracking-[0.18em] text-[#7FD7EA] uppercase sm:text-[11px] md:text-xs">
              Riverside&apos;s Trusted Glass Specialists
            </p>
          </div>

          <h1 className="font-display text-[2rem] leading-[1.08] text-white sm:text-4xl md:text-5xl lg:text-6xl xl:text-[4rem]">
            Clear Craftsmanship.
            <br />
            Lasting Results.
          </h1>

          <p className="mt-5 max-w-lg text-[0.95rem] leading-relaxed text-white/85 sm:text-base md:text-lg">
            Custom shower enclosures, window and door glass replacement, mirrors, patio doors, and
            small 1st-floor storefront glass — licensed mobile glass work across Riverside, Corona, and
            surrounding Southern California communities.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <Link
              href="/contact"
              className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#3BA4D6] to-[#5EC8E8] px-5 py-3.5 text-sm font-semibold text-white shadow-[0_12px_32px_rgba(59,164,214,0.4)] transition hover:brightness-105 sm:w-auto sm:px-6"
            >
              Request a Free Estimate
              <span aria-hidden>›</span>
            </Link>
            <Link
              href="/services"
              className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-white/55 bg-white/5 px-5 py-3.5 text-sm font-semibold text-white backdrop-blur-sm transition hover:bg-white/12 sm:w-auto sm:px-6"
            >
              Explore Our Services
              <span aria-hidden>›</span>
            </Link>
          </div>

          <p className="mt-5 text-xs text-white/55">
            Licensed, bonded &amp; insured · CA Contractor&apos;s License #{licenseNumber}
          </p>
        </div>
      </div>
    </section>
  );
}
