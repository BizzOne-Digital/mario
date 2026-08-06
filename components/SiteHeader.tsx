"use client";

import Image from "next/image";
import Link from "next/link";
import { ChevronDown, Menu, Phone, X } from "lucide-react";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { BUSINESS, NAV_LINKS } from "@/lib/constants";
import { SERVICES } from "@/lib/site-content";

type Props = {
  primaryPhone?: string;
  primaryPhoneTel?: string;
};

export function SiteHeader({
  primaryPhone = BUSINESS.primaryPhone,
  primaryPhoneTel = BUSINESS.primaryPhoneTel,
}: Props) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const [mobileServicesOpen, setMobileServicesOpen] = useState(false);
  const servicesRef = useRef<HTMLDivElement>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    setOpen(false);
    setServicesOpen(false);
    setMobileServicesOpen(false);
  }, [pathname]);

  useEffect(() => {
    function onDocClick(e: MouseEvent) {
      if (!servicesRef.current?.contains(e.target as Node)) {
        setServicesOpen(false);
      }
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setServicesOpen(false);
    }
    document.addEventListener("click", onDocClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("click", onDocClick);
      document.removeEventListener("keydown", onKey);
    };
  }, []);

  function openServices() {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setServicesOpen(true);
  }

  function scheduleCloseServices() {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    closeTimer.current = setTimeout(() => setServicesOpen(false), 160);
  }

  const servicesActive = pathname === "/services" || pathname.startsWith("/services/");

  return (
    <header className="pointer-events-none fixed inset-x-0 top-0 z-[100] px-3 pt-3 md:px-5 md:pt-4">
      <div className="pointer-events-auto mx-auto w-full max-w-7xl">
        <div className="relative flex min-w-0 items-center justify-between gap-2 rounded-2xl border border-white/50 bg-white/90 px-2.5 py-2 shadow-[0_12px_40px_rgba(7,26,43,0.18)] backdrop-blur-xl sm:gap-3 sm:px-3 sm:py-2.5 md:px-5 md:py-3">
          <Link href="/" className="flex min-w-0 shrink items-center gap-2 sm:gap-2.5" onClick={() => setOpen(false)}>
            <span className="relative flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-navy sm:h-10 sm:w-10 md:h-11 md:w-11">
              <Image
                src="/logos/express-glass-icon.svg"
                alt=""
                width={44}
                height={44}
                className="h-full w-full object-cover"
                priority
              />
            </span>
            <span className="min-w-0 leading-tight">
              <span className="block truncate text-[12px] font-bold tracking-[0.08em] text-navy uppercase sm:text-[13px] md:text-sm">
                Express Glass
              </span>
              <span className="block text-[9px] tracking-[0.18em] text-steel uppercase sm:text-[10px]">
                Riverside, CA
              </span>
            </span>
          </Link>

          <nav className="hidden items-center gap-0.5 lg:flex" aria-label="Primary">
            {NAV_LINKS.map((link) => {
              const active =
                pathname === link.href || (link.href !== "/" && pathname.startsWith(link.href));

              if (link.href === "/services") {
                return (
                  <div
                    key={link.href}
                    className="relative"
                    ref={servicesRef}
                    onMouseEnter={openServices}
                    onMouseLeave={scheduleCloseServices}
                  >
                    <button
                      type="button"
                      className={`inline-flex items-center gap-1 rounded-lg px-3 py-2 text-sm font-medium transition ${
                        servicesActive ? "text-[#1a6f9a]" : "text-navy/75 hover:text-navy"
                      }`}
                      aria-expanded={servicesOpen}
                      aria-haspopup="menu"
                      onClick={() => setServicesOpen((v) => !v)}
                    >
                      Services
                      <ChevronDown
                        className={`h-3.5 w-3.5 transition ${servicesOpen ? "rotate-180" : ""}`}
                      />
                    </button>
                    {servicesActive ? (
                      <span className="absolute inset-x-3 -bottom-0.5 h-0.5 rounded-full bg-[#3BA4D6]" />
                    ) : null}

                    {servicesOpen ? (
                      <div
                        role="menu"
                        className="absolute top-full left-1/2 z-[110] mt-3 w-[min(36rem,calc(100vw-2rem))] -translate-x-1/2 rounded-2xl border border-navy/10 bg-white p-3 shadow-[0_20px_50px_rgba(7,26,43,0.2)]"
                        onMouseEnter={openServices}
                        onMouseLeave={scheduleCloseServices}
                      >
                        <Link
                          href="/services"
                          role="menuitem"
                          className="mb-2 block rounded-xl bg-cyan-light/35 px-3 py-2.5 text-sm font-semibold text-navy hover:bg-cyan-light/55"
                          onClick={() => setServicesOpen(false)}
                        >
                          All services →
                        </Link>
                        <div className="grid grid-cols-1 gap-0.5 sm:grid-cols-2">
                          {SERVICES.map((service) => (
                            <Link
                              key={service.slug}
                              href={`/services/${service.slug}`}
                              role="menuitem"
                              className="block rounded-lg px-3 py-2.5 text-sm leading-snug text-navy/80 hover:bg-cyan-light/40 hover:text-navy"
                              onClick={() => setServicesOpen(false)}
                            >
                              {service.name}
                            </Link>
                          ))}
                        </div>
                      </div>
                    ) : null}
                  </div>
                );
              }

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`relative rounded-lg px-3 py-2 text-sm font-medium transition ${
                    active ? "text-[#1a6f9a]" : "text-navy/75 hover:text-navy"
                  }`}
                >
                  {link.label}
                  {active ? (
                    <span className="absolute inset-x-3 -bottom-0.5 h-0.5 rounded-full bg-[#3BA4D6]" />
                  ) : null}
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-2">
            <a
              href={`tel:${primaryPhoneTel}`}
              className="hidden h-10 w-10 items-center justify-center rounded-full border border-navy/15 bg-white text-navy shadow-sm transition hover:border-[#3BA4D6]/40 hover:text-[#1a6f9a] sm:inline-flex"
              aria-label={`Call ${primaryPhone}`}
            >
              <Phone className="h-4 w-4" />
            </a>
            <Link
              href="/contact"
              className="hidden items-center gap-1.5 rounded-full bg-gradient-to-r from-[#3BA4D6] to-[#5EC8E8] px-3.5 py-2 text-sm font-semibold text-white shadow-[0_8px_24px_rgba(59,164,214,0.35)] transition hover:brightness-105 md:inline-flex md:px-4 md:py-2.5"
            >
              Free Estimate
              <span aria-hidden>›</span>
            </Link>
            <button
              type="button"
              className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-navy/15 bg-white text-navy lg:hidden"
              aria-expanded={open}
              aria-label={open ? "Close menu" : "Open menu"}
              onClick={() => setOpen((v) => !v)}
            >
              {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {open ? (
          <div className="mt-2 max-h-[80vh] overflow-y-auto rounded-2xl border border-white/50 bg-white/95 p-4 shadow-xl backdrop-blur-xl lg:hidden">
            <nav className="flex flex-col gap-1" aria-label="Mobile">
              {NAV_LINKS.map((link) => {
                if (link.href === "/services") {
                  return (
                    <div key={link.href}>
                      <button
                        type="button"
                        className="flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-sm font-medium text-navy hover:bg-cyan-light/40"
                        aria-expanded={mobileServicesOpen}
                        onClick={() => setMobileServicesOpen((v) => !v)}
                      >
                        Services
                        <ChevronDown
                          className={`h-4 w-4 transition ${mobileServicesOpen ? "rotate-180" : ""}`}
                        />
                      </button>
                      {mobileServicesOpen ? (
                        <div className="mb-2 ml-2 space-y-1 border-l border-navy/10 pl-3">
                          <Link
                            href="/services"
                            className="block rounded-lg px-2 py-2 text-sm font-semibold text-navy hover:bg-cyan-light/40"
                            onClick={() => setOpen(false)}
                          >
                            All services
                          </Link>
                          {SERVICES.map((service) => (
                            <Link
                              key={service.slug}
                              href={`/services/${service.slug}`}
                              className="block rounded-lg px-2 py-2 text-sm text-navy/80 hover:bg-cyan-light/40"
                              onClick={() => setOpen(false)}
                            >
                              {service.name}
                            </Link>
                          ))}
                        </div>
                      ) : null}
                    </div>
                  );
                }

                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="rounded-lg px-3 py-2.5 text-sm font-medium text-navy hover:bg-cyan-light/40"
                    onClick={() => setOpen(false)}
                  >
                    {link.label}
                  </Link>
                );
              })}
              <a
                href={`tel:${primaryPhoneTel}`}
                className="mt-2 rounded-full border border-navy/15 px-4 py-2.5 text-center text-sm font-semibold text-navy"
              >
                Call {primaryPhone}
              </a>
              <Link
                href="/contact"
                className="rounded-full bg-gradient-to-r from-[#3BA4D6] to-[#5EC8E8] px-4 py-2.5 text-center text-sm font-semibold text-white"
                onClick={() => setOpen(false)}
              >
                Free Estimate ›
              </Link>
            </nav>
          </div>
        ) : null}
      </div>
    </header>
  );
}
