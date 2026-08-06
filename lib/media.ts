import type { ServiceSlug } from "@/lib/constants";
import { SERVICE_SLUGS } from "@/lib/constants";

/** Local service card / hero images placed in public/images/services (and related). */
export const LOCAL_SERVICE_IMAGES: Record<ServiceSlug, string> = {
  "custom-shower-doors": "/images/services/Custom-Shower-Doors.png",
  "tub-enclosures": "/images/services/Tub-Enclosures.png",
  "shower-door-repair": "/images/services/Shower-Door-Repair-and-Hardware-Replacement.png",
  "window-glass-replacement": "/images/services/Window-Glass-Replacement.png",
  "door-glass-replacement": "/images/Glass-patio-doors.png",
  "mirror-glass-replacement": "/images/services/Mirror-Glass-Replacement.png",
  "residential-glass-installation": "/images/services/Custom-Shower-Doors.png",
  // Small 1st-floor shop fronts only — no skyscraper / large-crew commercial installs
  "commercial-glass-installation":
    "https://images.unsplash.com/photo-1564419965579-5da68ffdf3af?auto=format&fit=crop&w=1600&q=80",
  "vinyl-windows": "/images/services/Vinyl-Window-Installation-and-Replacement.png",
  "glass-patio-doors": "/images/Glass-patio-doors.png",
  "storefront-glass-doors":
    "https://images.unsplash.com/photo-1576354998198-99dc1d2c3d36?auto=format&fit=crop&w=1600&q=80",
  "custom-glass-design": "/images/Custom-shower-doors-enclosures.png",
};

/** Curated Unsplash URLs — w=1600&q=80 for production heroes and galleries. */
function u(photoId: string, opts?: { w?: number; q?: number }) {
  const w = opts?.w ?? 1600;
  const q = opts?.q ?? 80;
  return `https://images.unsplash.com/${photoId}?auto=format&fit=crop&w=${w}&q=${q}`;
}

export const MEDIA = {
  heroes: {
    bathroomShower: u("photo-1552321554-5fefe8c9ef14"),
    residentialWindows: u("photo-1493809842364-78817add7ffb"),
    commercialStorefront: u("photo-1441986300917-64674bd600d8"),
  },
  shower: {
    frameless: u("photo-1620626011761-996317b8d101"),
    sliding: u("photo-1600566752355-35792bedcfea"),
    tub: u("photo-1584622650111-993a426fbf0a"),
    hardware: u("photo-1618221195710-dd6b41faaea6"),
    luxuryBath: u("photo-1600566753190-17f0baa2a6c3"),
  },
  windows: {
    replacement: u("photo-1513694203232-719a280e022f"),
    vinyl: u("photo-1564013799919-ab600027ffc6"),
    brightRoom: u("photo-1505693416388-ac5ce068fe85"),
    exterior: u("photo-1600585154340-be6161a56a0c"),
  },
  doors: {
    patio: u("photo-1600607687939-ce8a6c25118c"),
    entryGlass: u("photo-1600585154526-990dced4db0d"),
    slidingGlass: u("photo-1604014237800-1c9102c219da"),
  },
  mirrors: {
    vanity: u("photo-1556912173-46c336c7fd55"),
    bathroom: u("photo-1631889993959-41b4e9c6e3c5"),
    modern: u("photo-1600210492486-724fe5c67fb0"),
  },
  residential: {
    install: u("photo-1600585152220-90363fe7e115"),
    homeExterior: u("photo-1600596542815-ffad4c1539a9"),
    livingLight: u("photo-1600210492493-0946911123ea"),
  },
  commercial: {
    // 1st-floor shop fronts / small business glass — not towers or high-rise glazing
    storefront: u("photo-1564419965579-5da68ffdf3af"),
    officeGlass: u("photo-1576354998198-99dc1d2c3d36"),
    retail: u("photo-1441986300917-64674bd600d8"),
  },
  work: {
    measure: u("photo-1503387762-592deb58ef4e"),
    technician: "/images/services/Custom-Shower-Doors.png",
    tools: u("photo-1504307651254-35680f356dfd"),
    consult: u("photo-1560518883-ce09059eeffa"),
  },
  beforeAfter: {
    showerBefore: "/images/before-shower.jpg",
    showerAfter: "/images/after-shower.jpg",
    windowBefore: u("photo-1513694203232-719a280e022f"),
    windowAfter: u("photo-1493809842364-78817add7ffb"),
  },
} as const;

export type ServiceImageSet = {
  hero: string;
  overview: string;
  detail: string;
  process: string;
  completed: string;
  gallery: [string, string, string, string, string];
};

export const SERVICE_IMAGES: Record<ServiceSlug, ServiceImageSet> = {
  "custom-shower-doors": {
    hero: LOCAL_SERVICE_IMAGES["custom-shower-doors"],
    overview: MEDIA.shower.luxuryBath,
    detail: MEDIA.shower.hardware,
    process: MEDIA.work.measure,
    completed: MEDIA.shower.sliding,
    gallery: [
      LOCAL_SERVICE_IMAGES["custom-shower-doors"],
      MEDIA.shower.sliding,
      MEDIA.shower.hardware,
      MEDIA.shower.luxuryBath,
      MEDIA.heroes.bathroomShower,
    ],
  },
  "tub-enclosures": {
    hero: LOCAL_SERVICE_IMAGES["tub-enclosures"],
    overview: MEDIA.shower.sliding,
    detail: MEDIA.shower.hardware,
    process: MEDIA.work.technician,
    completed: MEDIA.residential.install,
    gallery: [
      LOCAL_SERVICE_IMAGES["tub-enclosures"],
      MEDIA.shower.sliding,
      MEDIA.shower.hardware,
      MEDIA.heroes.bathroomShower,
      MEDIA.residential.install,
    ],
  },
  "shower-door-repair": {
    hero: LOCAL_SERVICE_IMAGES["shower-door-repair"],
    overview: MEDIA.shower.sliding,
    detail: MEDIA.shower.frameless,
    process: MEDIA.work.measure,
    completed: MEDIA.work.technician,
    gallery: [
      LOCAL_SERVICE_IMAGES["shower-door-repair"],
      MEDIA.shower.sliding,
      MEDIA.shower.frameless,
      MEDIA.shower.hardware,
      "/images/services/Custom-Shower-Doors.png",
    ],
  },
  "window-glass-replacement": {
    hero: LOCAL_SERVICE_IMAGES["window-glass-replacement"],
    overview: MEDIA.windows.brightRoom,
    detail: MEDIA.work.measure,
    process: MEDIA.work.technician,
    completed: MEDIA.heroes.residentialWindows,
    gallery: [
      LOCAL_SERVICE_IMAGES["window-glass-replacement"],
      MEDIA.windows.brightRoom,
      MEDIA.windows.exterior,
      MEDIA.heroes.residentialWindows,
      MEDIA.work.measure,
    ],
  },
  "door-glass-replacement": {
    hero: LOCAL_SERVICE_IMAGES["door-glass-replacement"],
    overview: MEDIA.doors.entryGlass,
    detail: MEDIA.windows.replacement,
    process: MEDIA.work.measure,
    completed: MEDIA.doors.slidingGlass,
    gallery: [
      LOCAL_SERVICE_IMAGES["door-glass-replacement"],
      MEDIA.doors.entryGlass,
      MEDIA.doors.slidingGlass,
      MEDIA.doors.patio,
      MEDIA.windows.exterior,
    ],
  },
  "mirror-glass-replacement": {
    hero: LOCAL_SERVICE_IMAGES["mirror-glass-replacement"],
    overview: MEDIA.mirrors.bathroom,
    detail: MEDIA.work.measure,
    process: MEDIA.work.technician,
    completed: MEDIA.mirrors.modern,
    gallery: [
      LOCAL_SERVICE_IMAGES["mirror-glass-replacement"],
      MEDIA.mirrors.bathroom,
      MEDIA.mirrors.modern,
      MEDIA.shower.luxuryBath,
      MEDIA.residential.livingLight,
    ],
  },
  "residential-glass-installation": {
    hero: LOCAL_SERVICE_IMAGES["residential-glass-installation"],
    overview: MEDIA.residential.install,
    detail: MEDIA.shower.frameless,
    process: MEDIA.work.measure,
    completed: MEDIA.doors.patio,
    gallery: [
      LOCAL_SERVICE_IMAGES["residential-glass-installation"],
      MEDIA.residential.install,
      MEDIA.shower.frameless,
      MEDIA.windows.vinyl,
      MEDIA.doors.patio,
    ],
  },
  "commercial-glass-installation": {
    hero: LOCAL_SERVICE_IMAGES["commercial-glass-installation"],
    overview: MEDIA.commercial.retail,
    detail: MEDIA.doors.entryGlass,
    process: MEDIA.work.measure,
    completed: MEDIA.commercial.storefront,
    gallery: [
      LOCAL_SERVICE_IMAGES["commercial-glass-installation"],
      MEDIA.commercial.retail,
      MEDIA.doors.entryGlass,
      MEDIA.windows.exterior,
      MEDIA.commercial.officeGlass,
    ],
  },
  "vinyl-windows": {
    hero: LOCAL_SERVICE_IMAGES["vinyl-windows"],
    overview: MEDIA.windows.replacement,
    detail: MEDIA.work.measure,
    process: MEDIA.work.technician,
    completed: MEDIA.heroes.residentialWindows,
    gallery: [
      LOCAL_SERVICE_IMAGES["vinyl-windows"],
      MEDIA.windows.replacement,
      MEDIA.windows.exterior,
      MEDIA.residential.homeExterior,
      MEDIA.windows.brightRoom,
    ],
  },
  "glass-patio-doors": {
    hero: LOCAL_SERVICE_IMAGES["glass-patio-doors"],
    overview: MEDIA.doors.slidingGlass,
    detail: MEDIA.shower.hardware,
    process: MEDIA.work.technician,
    completed: MEDIA.residential.install,
    gallery: [
      LOCAL_SERVICE_IMAGES["glass-patio-doors"],
      MEDIA.doors.slidingGlass,
      MEDIA.doors.entryGlass,
      MEDIA.residential.livingLight,
      MEDIA.windows.exterior,
    ],
  },
  "storefront-glass-doors": {
    hero: LOCAL_SERVICE_IMAGES["storefront-glass-doors"],
    overview: MEDIA.commercial.storefront,
    detail: MEDIA.doors.entryGlass,
    process: MEDIA.work.measure,
    completed: MEDIA.commercial.retail,
    gallery: [
      LOCAL_SERVICE_IMAGES["storefront-glass-doors"],
      MEDIA.commercial.retail,
      MEDIA.doors.entryGlass,
      MEDIA.commercial.storefront,
      MEDIA.windows.exterior,
    ],
  },
  "custom-glass-design": {
    hero: LOCAL_SERVICE_IMAGES["custom-glass-design"],
    overview: MEDIA.shower.frameless,
    detail: MEDIA.mirrors.modern,
    process: MEDIA.work.measure,
    completed: MEDIA.shower.luxuryBath,
    gallery: [
      LOCAL_SERVICE_IMAGES["custom-glass-design"],
      MEDIA.work.measure,
      MEDIA.shower.frameless,
      MEDIA.mirrors.modern,
      "/images/services/Custom-Shower-Doors.png",
    ],
  },
};

export const PAGE_IMAGES = {
  home: {
    hero: MEDIA.heroes.bathroomShower,
    showerFeature: "/images/Custom-shower-doors-enclosures.png",
    window: "/images/Window-glass-replacement.png",
    patio: "/images/Glass-patio-doors.png",
    mirror: "/images/Mirror-glass-replacement.png",
    residential: "/images/services/Custom-Shower-Doors.png",
    commercial: MEDIA.commercial.retail,
    cta: MEDIA.shower.frameless,
    process: [
      MEDIA.work.consult,
      MEDIA.work.measure,
      MEDIA.shower.hardware,
      MEDIA.windows.brightRoom,
      "/images/services/Custom-Shower-Doors.png",
      MEDIA.residential.install,
    ] as const,
    beforeAfter: {
      before: MEDIA.beforeAfter.showerBefore,
      after: MEDIA.beforeAfter.showerAfter,
    },
  },
  about: {
    hero: MEDIA.residential.install,
    story: MEDIA.work.measure,
    mario: "/images/about-mario.jpg",
    experience: MEDIA.heroes.residentialWindows,
    craft: MEDIA.shower.hardware,
    mobile: "/images/services/Custom-Shower-Doors.png",
    residential: MEDIA.shower.frameless,
    commercial: MEDIA.commercial.retail,
    values: MEDIA.residential.livingLight,
  },
  services: {
    hero: MEDIA.shower.frameless,
    residential: MEDIA.heroes.residentialWindows,
    commercial: MEDIA.commercial.retail,
    repair: MEDIA.shower.hardware,
    process: MEDIA.work.measure,
  },
  serviceAreas: {
    hero: MEDIA.residential.homeExterior,
    strip: [
      MEDIA.work.measure,
      "/images/services/Custom-Shower-Doors.png",
      MEDIA.shower.frameless,
      MEDIA.residential.install,
      MEDIA.commercial.retail,
      MEDIA.windows.vinyl,
    ] as const,
  },
  gallery: {
    hero: MEDIA.shower.frameless,
    intro: [
      MEDIA.shower.frameless,
      MEDIA.windows.replacement,
      MEDIA.doors.patio,
      MEDIA.commercial.retail,
      MEDIA.mirrors.vanity,
    ] as const,
  },
  testimonials: {
    hero: MEDIA.residential.install,
    strip: [
      MEDIA.shower.frameless,
      MEDIA.windows.vinyl,
      MEDIA.commercial.retail,
      MEDIA.mirrors.vanity,
      MEDIA.doors.patio,
    ] as const,
  },
  faq: {
    hero: MEDIA.work.consult,
    strip: [
      MEDIA.work.measure,
      MEDIA.shower.sliding,
      MEDIA.windows.replacement,
      "/images/services/Custom-Shower-Doors.png",
      MEDIA.commercial.retail,
    ] as const,
  },
  contact: {
    hero: MEDIA.work.consult,
    strip: [
      MEDIA.work.measure,
      "/images/services/Custom-Shower-Doors.png",
      MEDIA.residential.install,
      MEDIA.commercial.retail,
      MEDIA.doors.entryGlass,
    ] as const,
  },
  blog: {
    hero: MEDIA.windows.replacement,
    strip: [
      MEDIA.shower.frameless,
      MEDIA.shower.hardware,
      MEDIA.windows.vinyl,
      MEDIA.doors.patio,
      MEDIA.mirrors.vanity,
    ] as const,
  },
  legal: {
    privacy: MEDIA.heroes.residentialWindows,
    terms: MEDIA.commercial.retail,
    accessibility: MEDIA.work.measure,
    strip: [
      MEDIA.work.measure,
      "/images/services/Custom-Shower-Doors.png",
      MEDIA.windows.replacement,
      MEDIA.shower.frameless,
      MEDIA.commercial.retail,
    ] as const,
  },
} as const;

export type ShowcaseGalleryItem = {
  url: string;
  alt: string;
  caption: string;
  categorySlug: string;
  serviceSlug: ServiceSlug;
  isBeforeAfter?: boolean;
  beforeUrl?: string;
  afterUrl?: string;
};

export const SHOWCASE_GALLERY: ShowcaseGalleryItem[] = [
  {
    url: MEDIA.shower.frameless,
    alt: "Frameless shower door installation",
    caption: "Frameless shower enclosure",
    categorySlug: "shower-doors",
    serviceSlug: "custom-shower-doors",
  },
  {
    url: MEDIA.shower.sliding,
    alt: "Sliding shower door",
    caption: "Sliding shower configuration",
    categorySlug: "shower-doors",
    serviceSlug: "custom-shower-doors",
  },
  {
    url: MEDIA.shower.tub,
    alt: "Custom tub enclosure",
    caption: "Tub enclosure glass",
    categorySlug: "tub-enclosures",
    serviceSlug: "tub-enclosures",
  },
  {
    url: MEDIA.windows.replacement,
    alt: "Window glass replacement",
    caption: "Window glass service",
    categorySlug: "windows",
    serviceSlug: "window-glass-replacement",
  },
  {
    url: MEDIA.windows.vinyl,
    alt: "Vinyl window installation",
    caption: "Vinyl window upgrade",
    categorySlug: "windows",
    serviceSlug: "vinyl-windows",
  },
  {
    url: MEDIA.doors.patio,
    alt: "Glass patio doors",
    caption: "Patio door glass",
    categorySlug: "doors",
    serviceSlug: "glass-patio-doors",
  },
  {
    url: MEDIA.mirrors.vanity,
    alt: "Bathroom mirror installation",
    caption: "Custom mirror work",
    categorySlug: "mirrors",
    serviceSlug: "mirror-glass-replacement",
  },
  {
    url: "/images/services/Custom-Shower-Doors.png",
    alt: "Technician installing a frameless shower door",
    caption: "Frameless shower install",
    categorySlug: "shower-doors",
    serviceSlug: "custom-shower-doors",
  },
  {
    url: MEDIA.residential.install,
    alt: "Residential glass installation",
    caption: "Residential project",
    categorySlug: "residential-glass",
    serviceSlug: "residential-glass-installation",
  },
  {
    url: MEDIA.commercial.retail,
    alt: "Small business storefront glass",
    caption: "1st-floor storefront glass",
    categorySlug: "commercial-glass",
    serviceSlug: "commercial-glass-installation",
  },
  {
    url: MEDIA.commercial.storefront,
    alt: "Shop door and window glass",
    caption: "Small commercial door lite",
    categorySlug: "storefronts",
    serviceSlug: "storefront-glass-doors",
  },
  {
    url: MEDIA.shower.frameless,
    alt: "Before and after shower enclosure",
    caption: "Shower refresh",
    categorySlug: "before-after",
    serviceSlug: "custom-shower-doors",
    isBeforeAfter: true,
    beforeUrl: MEDIA.beforeAfter.showerBefore,
    afterUrl: MEDIA.beforeAfter.showerAfter,
  },
  {
    url: MEDIA.shower.hardware,
    alt: "Shower door hardware detail",
    caption: "Hardware detail",
    categorySlug: "shower-doors",
    serviceSlug: "shower-door-repair",
  },
];

/** Ensure every SERVICE_SLUG has an image set (compile-time sanity). */
void SERVICE_SLUGS;
