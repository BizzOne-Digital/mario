import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";

type Cta = {
  href: string;
  label: string;
  variant?: "primary" | "secondary";
  external?: boolean;
};

type Props = {
  image: string;
  imageAlt: string;
  eyebrow?: string;
  title: string;
  subtitle?: string;
  ctas?: Cta[];
  minHeightClass?: string;
  children?: ReactNode;
  priority?: boolean;
};

export function PageHero({
  image,
  imageAlt,
  eyebrow,
  title,
  subtitle,
  ctas,
  minHeightClass = "min-h-[52vh]",
  children,
  priority = true,
}: Props) {
  return (
    <section className={`relative overflow-hidden ${minHeightClass}`}>
      <Image
        src={image}
        alt={imageAlt}
        fill
        priority={priority}
        className="object-cover"
        sizes="100vw"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-navy via-navy/80 to-navy/40" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_40%,rgba(127,215,234,0.16),transparent_45%)]" />
      <div
        className={`container-eg relative z-10 flex ${minHeightClass} w-full min-w-0 flex-col justify-end px-4 pb-12 pt-28 sm:pb-14 sm:pt-32 md:px-6`}
      >
        {eyebrow ? (
          <p className="text-xs tracking-[0.2em] text-glass uppercase sm:text-sm">{eyebrow}</p>
        ) : null}
        <h1 className="mt-2 max-w-3xl font-display text-[2rem] leading-tight text-frost sm:text-4xl md:text-5xl lg:text-6xl">
          {title}
        </h1>
        {subtitle ? (
          <p className="mt-4 max-w-2xl text-base text-frost/85 sm:text-lg md:text-xl">{subtitle}</p>
        ) : null}
        {ctas?.length ? (
          <div className="mt-8 flex w-full max-w-lg flex-col gap-3 sm:max-w-none sm:flex-row sm:flex-wrap">
            {ctas.map((cta) => {
              const className =
                cta.variant === "secondary" ? "btn-secondary w-full sm:w-auto" : "btn-primary w-full sm:w-auto";
              if (cta.external || cta.href.startsWith("tel:")) {
                return (
                  <a key={cta.href + cta.label} href={cta.href} className={className}>
                    {cta.label}
                  </a>
                );
              }
              return (
                <Link key={cta.href + cta.label} href={cta.href} className={className}>
                  {cta.label}
                </Link>
              );
            })}
          </div>
        ) : null}
        {children}
      </div>
    </section>
  );
}
