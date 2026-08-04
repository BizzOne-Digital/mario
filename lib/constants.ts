export const SERVICE_SLUGS = [
  "custom-shower-doors",
  "tub-enclosures",
  "shower-door-repair",
  "window-glass-replacement",
  "door-glass-replacement",
  "mirror-glass-replacement",
  "residential-glass-installation",
  "commercial-glass-installation",
  "vinyl-windows",
  "glass-patio-doors",
  "storefront-glass-doors",
  "custom-glass-design",
] as const;

export type ServiceSlug = (typeof SERVICE_SLUGS)[number];

export const SERVICE_AREAS = [
  "Riverside",
  "Corona",
  "Eastvale",
  "Moreno Valley",
  "Perris",
  "Pomona",
  "Norco",
  "Chino",
  "Rialto",
  "Redlands",
  "Sun City",
  "Temecula",
  "Ontario",
  "Murrieta",
  "Riverside County",
  "Orange County",
  "Surrounding Southern California communities",
] as const;

export const BUSINESS = {
  name: "Express Glass",
  primaryPhone: "(951) 407-0868",
  primaryPhoneTel: "+19514070868",
  secondaryPhone: "(951) 371-2601",
  secondaryPhoneTel: "+19513712601",
  address: "1440 3rd Street #21, Riverside, CA 92507",
  addressLine1: "1440 3rd Street #21",
  city: "Riverside",
  state: "CA",
  zip: "92507",
  licenseNumber: "898000",
  tagline: "Clear Craftsmanship. Lasting Results.",
  yearsExperience: "50+ Years of Experience",
  sinceText: "Serving Southern California since 2003",
  ownerName: "Mario",
} as const;

export const PROCESS_STEPS = [
  {
    title: "Contact",
    description: "Call or submit a request so we understand your project goals.",
    image: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=1600&q=80",
  },
  {
    title: "Free Estimate",
    description: "We review scope, options, and timing with a clear estimate.",
    image: "https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=1600&q=80",
  },
  {
    title: "Measurement & Design",
    description: "On-site measurement and configuration planning for a precise fit.",
    image: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=1600&q=80",
  },
  {
    title: "Product Selection",
    description: "Choose glass, hardware finishes, and system details together.",
    image: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1600&q=80",
  },
  {
    title: "Installation or Repair",
    description: "Professional installation or targeted repair with clean workmanship.",
    image: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=1600&q=80",
  },
  {
    title: "Final Review",
    description: "Walk-through to confirm alignment, operation, and finish quality.",
    image: "https://images.unsplash.com/photo-1600585152220-90363fe7e115?auto=format&fit=crop&w=1600&q=80",
  },
] as const;

export const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/services", label: "Services" },
  { href: "/gallery", label: "Gallery" },
  { href: "/testimonials", label: "Testimonials" },
  { href: "/faq", label: "FAQ" },
  { href: "/contact", label: "Contact" },
] as const;

export const FOOTER_LINKS = [
  { href: "/privacy-policy", label: "Privacy Policy" },
  { href: "/terms-and-conditions", label: "Terms & Conditions" },
  { href: "/accessibility", label: "Accessibility" },
  { href: "/service-areas", label: "Service Areas" },
  { href: "/blog", label: "Blog" },
] as const;
