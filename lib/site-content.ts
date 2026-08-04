import {
  BUSINESS,
  PROCESS_STEPS,
  SERVICE_AREAS,
  SERVICE_SLUGS,
  type ServiceSlug,
} from "@/lib/constants";
import { MEDIA, SERVICE_IMAGES, SHOWCASE_GALLERY } from "@/lib/media";
import type { SiteSettingsDoc } from "@/lib/types";

export type ServiceSeed = {
  name: string;
  slug: ServiceSlug;
  summary: string;
  intro: string;
  bullets: string[];
  applications: string[];
  materials: string[];
  processSteps: Array<{ title: string; description: string }>;
  benefits: string[];
  repairVsReplace: string;
  faqs: Array<{ question: string; answer: string }>;
  relatedServiceSlugs: ServiceSlug[];
  category: "shower" | "windows" | "doors" | "mirrors" | "residential" | "commercial" | "custom";
  images: {
    hero: string;
    overview: string;
    detail: string;
    process: string;
    completed: string;
  };
};

function imgs(slug: ServiceSlug) {
  const set = SERVICE_IMAGES[slug];
  return {
    hero: set.hero,
    overview: set.overview,
    detail: set.detail,
    process: set.process,
    completed: set.completed,
  };
}

const sharedProcess = [
  {
    title: "Consult & estimate",
    description: "Share goals, photos if available, and location so we can prepare a clear estimate.",
  },
  {
    title: "Measure on site",
    description: "Precise measurement and configuration planning for a proper fit.",
  },
  {
    title: "Select glass & hardware",
    description: "Review glass type, finishes, and system details before fabrication or ordering.",
  },
  {
    title: "Install or repair",
    description: "Professional installation or targeted repair with clean, careful workmanship.",
  },
  {
    title: "Final walk-through",
    description: "Confirm alignment, operation, and finish quality before we wrap up.",
  },
];

const contentMap: Record<ServiceSlug, ServiceSeed> = {
  "custom-shower-doors": {
    name: "Custom Shower Doors",
    slug: "custom-shower-doors",
    summary: "Custom shower doors, enclosures, installation, and repair.",
    intro:
      "Express Glass designs and installs custom shower doors and enclosures that fit your bathroom layout—not a one-size stock unit. Whether you are remodeling a primary bath or refreshing a guest suite, we measure the opening, discuss frameless and sliding options, and help you select hardware finishes that stand up to daily use. From walk-in glass to bypass configurations, our mobile residential service brings clear craftsmanship to Riverside, Corona, and surrounding communities.",
    bullets: [
      "Walk-in shower enclosures",
      "Sliding glass doors",
      "Hardware selection",
      "Professional installation",
      "Repair and replacement support",
    ],
    applications: [
      "Primary and guest bathroom remodels",
      "New construction shower openings",
      "Replacing dated framed enclosures",
      "Walk-in and neo-angle layouts",
    ],
    materials: [
      "Clear and low-iron glass options where available",
      "Tempered safety glass as required",
      "Chrome, brushed nickel, matte black, and similar hardware finishes",
      "Frameless, semi-frameless, and sliding systems",
    ],
    processSteps: sharedProcess,
    benefits: [
      "Measured for your opening for smoother operation",
      "Hardware chosen for durability and style",
      "Cleaner lines than many stock kit enclosures",
      "Local mobile installation and follow-up support",
    ],
    repairVsReplace:
      "Worn rollers, loose handles, or minor misalignment can often be repaired. Cracked glass, severely out-of-square openings after a remodel, or an outdated configuration you no longer want may call for a full custom replacement. We evaluate condition and goals so you can choose the path that makes sense.",
    faqs: [
      {
        question: "Do you install frameless shower doors?",
        answer:
          "Yes. We measure and install frameless and sliding shower door configurations suited to your opening and use.",
      },
      {
        question: "Can you match hardware finishes?",
        answer:
          "We help you select finishes that coordinate with fixtures already in the bathroom whenever possible.",
      },
    ],
    relatedServiceSlugs: ["tub-enclosures", "shower-door-repair", "mirror-glass-replacement"],
    category: "shower",
    images: imgs("custom-shower-doors"),
  },
  "tub-enclosures": {
    name: "Tub Enclosures",
    slug: "tub-enclosures",
    summary: "Custom tub enclosures with sliding configurations and hardware options.",
    intro:
      "Built-to-fit tub enclosure solutions keep water where it belongs while opening the room visually. Express Glass configures sliding and custom tub glass around your existing tub deck, coordinating glass and hardware with the rest of the bath. Ideal for remodel and replacement projects where a stock kit will not fit cleanly.",
    bullets: [
      "Custom tub enclosures",
      "Sliding enclosure options",
      "Glass and hardware selection",
      "Installation, repair, and replacement",
      "Design coordination",
    ],
    applications: [
      "Alcove tub replacements",
      "Bath remodel enclosure upgrades",
      "Damaged enclosure glass replacement",
      "Hardware and track refreshes",
    ],
    materials: [
      "Tempered enclosure glass",
      "Sliding track and roller systems",
      "Coordinated hardware finishes",
      "Clear and patterned glass options where available",
    ],
    processSteps: sharedProcess,
    benefits: [
      "Fit to your tub and walls",
      "Smoother sliding when rollers and tracks are properly set",
      "Updated appearance without a full bathroom gut",
      "Repair pathways when full replacement is not needed",
    ],
    repairVsReplace:
      "If glass is intact and the track or rollers are the issue, targeted repair may restore smooth travel. Fogged, cracked, or poorly fitting panels usually warrant enclosure replacement. We will walk through both options after looking at the opening.",
    faqs: [
      {
        question: "Can you work with an existing tub?",
        answer:
          "Yes. Most projects start with measuring your existing tub deck and surrounding walls for a custom-fit enclosure.",
      },
    ],
    relatedServiceSlugs: ["custom-shower-doors", "shower-door-repair"],
    category: "shower",
    images: imgs("tub-enclosures"),
  },
  "shower-door-repair": {
    name: "Shower Door Repair and Hardware Replacement",
    slug: "shower-door-repair",
    summary: "Repair misaligned doors and replace rollers, rails, and handles.",
    intro:
      "A sticky door, noisy roller, or loose handle does not always mean a full enclosure replacement. Express Glass evaluates rollers, rails, handles, alignment, and glass condition so you can restore safe, smooth operation when repair is the smarter path—or plan a clean replacement when it is not.",
    bullets: [
      "Rollers, rails, and handles",
      "Door alignment adjustments",
      "Damaged glass replacement",
      "Existing enclosure repairs",
      "Configuration updates",
    ],
    applications: [
      "Sliding doors that stick or jump the track",
      "Worn rollers and guides",
      "Loose or broken handles and knobs",
      "Minor alignment after settling or remodel work",
    ],
    materials: [
      "Replacement rollers and track components",
      "Handles and towel bars",
      "Seals and sweeps where applicable",
      "Glass panels when damage requires replacement",
    ],
    processSteps: sharedProcess,
    benefits: [
      "Often faster and more affordable than full replacement",
      "Restores smooth daily operation",
      "Honest assessment when replacement is safer",
      "Mobile service to your home",
    ],
    repairVsReplace:
      "Repair makes sense when glass is sound and hardware or alignment is the failure point. Replacement is wiser when glass is damaged, the system is obsolete, or you want a different configuration. We explain the trade-offs clearly before work begins.",
    faqs: [
      {
        question: "Can you repair an existing shower door?",
        answer:
          "Often yes. We evaluate rollers, rails, handles, alignment, and glass condition to recommend repair or replacement.",
      },
    ],
    relatedServiceSlugs: ["custom-shower-doors", "tub-enclosures"],
    category: "shower",
    images: imgs("shower-door-repair"),
  },
  "window-glass-replacement": {
    name: "Window Glass Replacement",
    slug: "window-glass-replacement",
    summary: "Replacement for cracked, fogged, failed-seal, and aging window glass.",
    intro:
      "Cracked panes, fog between insulated units, and failed seals reduce clarity and comfort. Express Glass provides residential and commercial window glass replacement—measuring carefully, matching tempered requirements where needed, and installing units that restore a clean view. When a full vinyl window upgrade is the better path, we can discuss that option as well.",
    bullets: [
      "Cracked and broken glass",
      "Hazy and failed-seal insulated units",
      "Low-E options where appropriate",
      "Tempered options where required",
      "Weather and energy-conscious solutions",
    ],
    applications: [
      "Fogged dual-pane residential windows",
      "Broken or cracked single and insulated panes",
      "Commercial office and facility glazing",
      "Failed-seal insulated glass units",
    ],
    materials: [
      "Insulated glass units (IGUs)",
      "Tempered glass where code or use requires it",
      "Low-E coatings when appropriate for the opening",
      "Clear and specialty glazing options by project",
    ],
    processSteps: sharedProcess,
    benefits: [
      "Restores clear views and curb appeal",
      "Addresses fogging from failed seals",
      "Can improve comfort when paired with the right glass package",
      "Local measurement and installation",
    ],
    repairVsReplace:
      "Isolated glass failure in an otherwise sound sash often calls for glass-only replacement. Rotting frames, failing hardware, or whole-house performance goals may point to vinyl window installation instead. We help you compare both paths.",
    faqs: [
      {
        question: "Do you replace fogged or failed-seal window glass?",
        answer:
          "Yes. We replace cracked, broken, hazy, and failed-seal insulated glass units for residential and commercial properties.",
      },
    ],
    relatedServiceSlugs: ["vinyl-windows", "door-glass-replacement"],
    category: "windows",
    images: imgs("window-glass-replacement"),
  },
  "door-glass-replacement": {
    name: "Door Glass Replacement",
    slug: "door-glass-replacement",
    summary: "Entry, patio, and commercial door glass panel replacement.",
    intro:
      "Damaged or fogged door glass affects security, light, and first impressions. Express Glass replaces entry, patio, and commercial door glass panels with careful measurement and clean installation—so doors operate properly and look finished again.",
    bullets: [
      "Entry-door glass",
      "Patio-door glass",
      "Commercial-door glass",
      "Broken panel replacement",
      "Failed insulated glass replacement",
    ],
    applications: [
      "Front entry sidelights and door inserts",
      "Sliding and French patio door panels",
      "Commercial entrance doors",
      "Fogged insulated door glass",
    ],
    materials: [
      "Tempered door glass as required",
      "Insulated panels for exterior doors",
      "Clear and decorative options by opening",
      "Hardware coordination when panels are reset",
    ],
    processSteps: sharedProcess,
    benefits: [
      "Restores light and a finished look",
      "Addresses safety concerns from broken panels",
      "Works for residential and commercial doors",
      "Mobile service scheduling",
    ],
    repairVsReplace:
      "Glass-only replacement works when the door slab or frame is sound. Warped frames, failing rollers on patio systems, or full door upgrades may call for broader patio door or storefront work. We assess before recommending scope.",
    faqs: [
      {
        question: "Can you replace only the glass in a patio door?",
        answer:
          "In many cases yes, when the frame and operating hardware are still serviceable. We confirm after reviewing the door on site.",
      },
    ],
    relatedServiceSlugs: ["glass-patio-doors", "window-glass-replacement", "storefront-glass-doors"],
    category: "doors",
    images: imgs("door-glass-replacement"),
  },
  "mirror-glass-replacement": {
    name: "Mirror Glass Replacement",
    slug: "mirror-glass-replacement",
    summary: "Residential and bathroom mirror replacement and custom mirror projects.",
    intro:
      "Precision-measured mirror glass keeps bathrooms and dressing areas looking sharp. Express Glass replaces damaged vanity mirrors and installs custom mirror applications for homes and businesses—with careful handling, clean edges, and secure mounting.",
    bullets: [
      "Bathroom and vanity mirrors",
      "Damaged mirror replacement",
      "Custom mirror applications",
      "Professional measurement",
      "Expert installation",
    ],
    applications: [
      "Vanity wall mirrors",
      "Broken or desilvered mirror replacement",
      "Gym, salon, and commercial dressing areas",
      "Custom cut-to-size residential mirrors",
    ],
    materials: [
      "Quality mirror glass cut to size",
      "Polished edges where specified",
      "Secure mounting systems suited to the wall type",
      "Safety considerations for large panels",
    ],
    processSteps: sharedProcess,
    benefits: [
      "Exact sizing for a clean fit",
      "Safer handling of large panels",
      "Updated look without a full remodel",
      "Residential and light commercial capability",
    ],
    repairVsReplace:
      "Desilvering, cracks, or chips generally require full mirror replacement rather than surface repair. We measure the opening and discuss edge finishes before fabrication.",
    faqs: [
      {
        question: "Do you install bathroom mirrors?",
        answer:
          "Yes. We measure and install bathroom, vanity, and custom mirror glass for homes and businesses.",
      },
    ],
    relatedServiceSlugs: ["custom-shower-doors", "residential-glass-installation"],
    category: "mirrors",
    images: imgs("mirror-glass-replacement"),
  },
  "residential-glass-installation": {
    name: "Residential Glass Installation",
    slug: "residential-glass-installation",
    summary: "Full residential installation across windows, doors, mirrors, and shower systems.",
    intro:
      "Express Glass is a mobile residential glass partner for homeowners across Riverside, Corona, and nearby communities. From shower enclosures and mirrors to windows, patio doors, and custom glass projects, we bring measurement, clear estimates, and careful installation to your home—backed by licensed, bonded, and insured service.",
    bullets: [
      "Windows and doors",
      "Mirrors",
      "Shower and tub enclosures",
      "Patio doors",
      "Custom glass projects",
    ],
    applications: [
      "Whole-home glass refresh projects",
      "Single-room bathroom glass upgrades",
      "Replacement of failed residential glazing",
      "New construction finish glass",
    ],
    materials: [
      "Shower and tub enclosure systems",
      "Window and patio door glass",
      "Mirror glass",
      "Hardware and mounting systems matched to each application",
    ],
    processSteps: sharedProcess,
    benefits: [
      "One team for multiple residential glass needs",
      "Mobile service to your address",
      "Licensed California craftsmanship",
      "Straightforward communication from estimate to install",
    ],
    repairVsReplace:
      "Residential projects often mix repair and replacement—repairing a shower roller while replacing a fogged window, for example. We scope each opening on its own merits.",
    faqs: [
      {
        question: "Do you come to my home?",
        answer:
          "Yes. Express Glass provides mobile residential glass service across our listed service areas.",
      },
    ],
    relatedServiceSlugs: [
      "custom-shower-doors",
      "window-glass-replacement",
      "vinyl-windows",
      "glass-patio-doors",
    ],
    category: "residential",
    images: imgs("residential-glass-installation"),
  },
  "commercial-glass-installation": {
    name: "Commercial Glass Installation",
    slug: "commercial-glass-installation",
    summary: "Commercial windows, doors, storefronts, mirrors, and office glass installation.",
    intro:
      "Offices, retail spaces, and facilities need glass that looks professional and performs under daily use. Express Glass installs and replaces commercial windows, doors, storefront systems, mirrors, and interior glazing with scheduling that respects your business hours whenever possible.",
    bullets: [
      "Business windows and office glass",
      "Commercial doors",
      "Storefront glass and doors",
      "Mirrors and interior glazing",
      "Commercial replacement service",
    ],
    applications: [
      "Office partitions and interior glass",
      "Retail and professional suite glazing",
      "Facility window and door glass",
      "Commercial mirror and vanity glass",
    ],
    materials: [
      "Commercial glazing systems suited to the opening",
      "Tempered and safety glass as required",
      "Storefront and entrance door glass",
      "Hardware coordinated with existing storefronts where applicable",
    ],
    processSteps: sharedProcess,
    benefits: [
      "Professional appearance for customer-facing spaces",
      "Replacement service when panels fail",
      "Mobile commercial response across our service area",
      "Licensed, bonded, and insured work",
    ],
    repairVsReplace:
      "Isolated broken panels can often be replaced without a full storefront rebuild. Systematic frame failure or major remodel goals may call for broader storefront work. We assess impact on operations before scheduling.",
    faqs: [
      {
        question: "Do you work after hours for businesses?",
        answer:
          "When project needs and scheduling allow, we discuss timing that reduces disruption to your customers and staff.",
      },
    ],
    relatedServiceSlugs: ["storefront-glass-doors", "door-glass-replacement", "window-glass-replacement"],
    category: "commercial",
    images: imgs("commercial-glass-installation"),
  },
  "vinyl-windows": {
    name: "Vinyl Window Installation and Replacement",
    slug: "vinyl-windows",
    summary: "New and replacement vinyl windows with failed-seal and glass service.",
    intro:
      "Aging wood or aluminum windows and chronically fogged units often call for a modern vinyl window solution. Express Glass helps homeowners and property managers evaluate vinyl window installation and replacement—pairing the right glass package with professional measurement so openings look sharp and operate cleanly.",
    bullets: [
      "New vinyl windows",
      "Replacement vinyl windows",
      "Glass replacement",
      "Failed-seal service",
      "Residential and commercial applications",
    ],
    applications: [
      "Whole-house vinyl window upgrades",
      "Selective room-by-room replacement",
      "Rental and light commercial properties",
      "Pairing glass service with frame upgrades",
    ],
    materials: [
      "Vinyl window systems sized to the opening",
      "Insulated glass packages",
      "Low-E options where appropriate",
      "Hardware and screens as specified for the unit",
    ],
    processSteps: sharedProcess,
    benefits: [
      "Updated curb appeal",
      "Addresses failed seals and drafty aged units",
      "Clearer views with new glass packages",
      "Professional install focused on fit and finish",
    ],
    repairVsReplace:
      "Glass-only replacement can solve fogging when frames are sound. Soft frames, failed hardware, or energy and appearance goals across many openings often favor vinyl window replacement. We help you prioritize rooms and budget.",
    faqs: [
      {
        question: "Can you replace just a few windows?",
        answer:
          "Yes. Many projects start with the worst openings and expand as budget allows.",
      },
    ],
    relatedServiceSlugs: ["window-glass-replacement", "residential-glass-installation"],
    category: "windows",
    images: imgs("vinyl-windows"),
  },
  "glass-patio-doors": {
    name: "Glass Patio Doors",
    slug: "glass-patio-doors",
    summary: "Patio-door installation, replacement, and glass panel service.",
    intro:
      "Patio doors shape how light and outdoor access meet your living space. Express Glass installs and replaces glass patio doors and services damaged or fogged panels—improving operation, appearance, and the connection between indoors and out.",
    bullets: [
      "Patio-door installation",
      "Replacement and upgrades",
      "Glass-panel service",
      "Improved natural light",
      "Residential applications",
    ],
    applications: [
      "Sliding patio door replacement",
      "Fogged or broken patio door glass",
      "Upgrade from aged aluminum systems",
      "New openings during remodel",
    ],
    materials: [
      "Patio door systems suited to the rough opening",
      "Insulated tempered glass panels",
      "Track and roller components",
      "Screen and hardware options by system",
    ],
    processSteps: sharedProcess,
    benefits: [
      "Smoother sliding and sealing when systems are set correctly",
      "Brighter living areas",
      "Glass-only service when frames remain sound",
      "Local residential installation",
    ],
    repairVsReplace:
      "Panel glass can often be replaced alone. Bent frames, failed rollers, and chronically leaking systems usually call for full patio door replacement. We inspect operation and frame condition first.",
    faqs: [
      {
        question: "Do you service existing patio doors?",
        answer:
          "Yes. We evaluate whether glass panel service or full door replacement is the better path for your opening.",
      },
    ],
    relatedServiceSlugs: ["door-glass-replacement", "vinyl-windows", "residential-glass-installation"],
    category: "doors",
    images: imgs("glass-patio-doors"),
  },
  "storefront-glass-doors": {
    name: "Commercial Storefront Glass and Doors",
    slug: "storefront-glass-doors",
    summary: "Storefront glass, doors, and commercial replacement/repair.",
    intro:
      "Your storefront is the face of your business. Express Glass provides professional storefront glass and door installation, replacement, and repair—helping retail, offices, and facilities present a polished, secure entrance.",
    bullets: [
      "Storefront glass",
      "Storefront doors",
      "Commercial window replacement",
      "Door installation",
      "Glass repair",
    ],
    applications: [
      "Retail storefront systems",
      "Professional suite entrances",
      "Broken commercial door glass",
      "Storefront panel replacement after damage",
    ],
    materials: [
      "Storefront glazing and door glass",
      "Tempered and safety glass as required",
      "Entrance door hardware coordination",
      "Systems matched to existing framing when replacing panels",
    ],
    processSteps: sharedProcess,
    benefits: [
      "Restores a professional street presence",
      "Addresses broken or unsafe panels promptly",
      "Commercial scheduling awareness",
      "Licensed installation and replacement",
    ],
    repairVsReplace:
      "Single broken lites can often be replaced quickly. Frame damage, major remodel, or outdated systems may require broader storefront work. We scope around your operating hours whenever possible.",
    faqs: [
      {
        question: "Do you handle commercial storefront glass?",
        answer:
          "Yes. We provide commercial storefront glass and door installation, replacement, and repair for offices, retail, and facilities.",
      },
    ],
    relatedServiceSlugs: ["commercial-glass-installation", "door-glass-replacement"],
    category: "commercial",
    images: imgs("storefront-glass-doors"),
  },
  "custom-glass-design": {
    name: "Custom Glass Design and Installation",
    slug: "custom-glass-design",
    summary: "Consultation, measurement, selection, installation, and long-term planning.",
    intro:
      "Some projects do not fit a catalog SKU. Express Glass offers custom glass design consultation—helping residential and commercial clients plan measurements, glass selection, hardware, and installation sequencing so unique openings get a thoughtful, lasting result.",
    bullets: [
      "Design consultation",
      "Measurement",
      "Glass and hardware selection",
      "Residential and commercial planning",
      "Installation and replacement planning",
    ],
    applications: [
      "Unique shower or partition layouts",
      "Multi-opening residential glass plans",
      "Commercial interior glass concepts",
      "Phased remodel glass schedules",
    ],
    materials: [
      "Glass types selected for use and code",
      "Hardware finishes and systems",
      "Mounting and framing approaches suited to the structure",
      "Coordination with other trades when needed",
    ],
    processSteps: sharedProcess,
    benefits: [
      "Clear planning before fabrication",
      "Fewer surprises at install",
      "Options explained without pressure",
      "One mobile partner from consult to completion",
    ],
    repairVsReplace:
      "Custom design often starts when repair will not solve layout or style goals. We still evaluate whether existing openings can be reused or adapted before recommending full custom work.",
    faqs: [
      {
        question: "How does a custom glass consult work?",
        answer:
          "We discuss your goals, review the space (on site when scheduled), measure as needed, and outline glass and hardware options with a clear estimate path.",
      },
    ],
    relatedServiceSlugs: [
      "custom-shower-doors",
      "residential-glass-installation",
      "commercial-glass-installation",
    ],
    category: "custom",
    images: imgs("custom-glass-design"),
  },
};

export const SERVICES = SERVICE_SLUGS.map((slug) => contentMap[slug]);
export const AREAS = [...SERVICE_AREAS];
export { PROCESS_STEPS };

export const DEFAULT_SETTINGS: Omit<SiteSettingsDoc, "_id" | "createdAt" | "updatedAt"> = {
  businessName: BUSINESS.name,
  logo: "/logos/express-glass-logo-horizontal.svg",
  logoDark: "/logos/express-glass-logo-dark.svg",
  favicon: "/favicon.svg",
  primaryPhone: BUSINESS.primaryPhone,
  secondaryPhone: BUSINESS.secondaryPhone,
  email: "",
  address: BUSINESS.address,
  hours: "Monday–Friday by appointment",
  saturdayHours: "Saturday appointments available upon request",
  mobileServiceNotice:
    "Mobile residential and commercial glass service available across our service area.",
  licenseNumber: BUSINESS.licenseNumber,
  licensedBondedInsured: true,
  yearsExperienceText: BUSINESS.sinceText,
  ownerName: BUSINESS.ownerName,
  companyHistory:
    "Express Glass started in New York in 1980. Mario has served Southern California since 2003 with mobile residential and commercial glass service.",
  christianOwnedVisible: true,
  christianOwnedText: "Christian-owned and operated.",
  specialOfferText: "10% Off for Senior Citizens and Military Personnel",
  specialOfferEnabled: true,
  serviceAreas: [...SERVICE_AREAS],
  socialLinks: [],
  facebookUrl: "",
  mapEmbed: "",
  footerDescription:
    "Express Glass provides residential and commercial glass services across Riverside, Corona, and surrounding Southern California communities.",
  footerLinks: [
    { label: "Privacy Policy", href: "/privacy-policy" },
    { label: "Terms & Conditions", href: "/terms-and-conditions" },
    { label: "Accessibility", href: "/accessibility" },
  ],
  contactRecipient: "",
  defaultSeo: {
    title: "Express Glass | Riverside, CA",
    description:
      "A trusted glass company in Riverside, CA for residential and commercial glass services. Licensed CA #898000.",
    ogImage: MEDIA.heroes.residentialWindows,
  },
  analyticsIds: {
    googleAnalyticsId: "",
    googleTagManagerId: "",
    facebookPixelId: "",
  },
  introEnabled: true,
  manufacturersPartners: {
    text: "",
    authorizedInstallerConfirmed: false,
  },
};

export const DEFAULT_FAQS = [
  {
    question: "How do I request a free estimate?",
    answer:
      "Call (951) 407-0868 or (951) 371-2601, or use the contact form online. Share your service type, property location, and project details so we can schedule a review.",
    category: "Estimates",
  },
  {
    question: "Is there a senior or military discount?",
    answer:
      "When the current special offer is enabled, Express Glass offers 10% off for senior citizens and military personnel. Ask when you request your estimate.",
    category: "Estimates",
  },
  {
    question: "What information helps you prepare an accurate estimate?",
    answer:
      "Photos of the opening, approximate sizes if known, whether the issue is repair or replacement, and your city or ZIP help us prepare a clearer estimate before or during an on-site visit.",
    category: "Estimates",
  },
  {
    question: "Do you install frameless and sliding shower doors?",
    answer:
      "Yes. We measure and install custom shower doors and enclosures, including frameless and sliding configurations suited to your bathroom layout.",
    category: "Shower Doors",
  },
  {
    question: "Can you repair an existing shower door?",
    answer:
      "Often yes. We can evaluate rollers, rails, handles, alignment, and glass condition to determine whether repair or replacement is the better path.",
    category: "Shower Doors",
  },
  {
    question: "Do you replace fogged or failed-seal window glass?",
    answer:
      "Yes. We replace cracked, broken, hazy, and failed-seal insulated glass units for residential and commercial properties.",
    category: "Windows and Doors",
  },
  {
    question: "Do you install vinyl windows and patio doors?",
    answer:
      "Yes. Express Glass provides vinyl window installation and replacement as well as glass patio door installation, replacement, and glass panel service.",
    category: "Windows and Doors",
  },
  {
    question: "Do you install mirrors?",
    answer:
      "Yes. We measure and install bathroom, vanity, and custom mirror glass for homes and businesses.",
    category: "Mirrors",
  },
  {
    question: "Are you licensed?",
    answer:
      "Express Glass is licensed, bonded, and insured. California License #898000.",
    category: "Installation",
  },
  {
    question: "How does installation typically work?",
    answer:
      "After estimate and measurement, we coordinate glass and hardware selection, schedule installation, complete the work carefully, and review operation and finish with you before wrapping up.",
    category: "Installation",
  },
  {
    question: "When should I repair versus replace glass?",
    answer:
      "Hardware wear and minor misalignment can often be repaired. Cracked glass, failed seals, obsolete systems, or openings that no longer fit your layout usually call for replacement. We explain options after evaluating the opening.",
    category: "Repairs",
  },
  {
    question: "Do you handle commercial storefront glass?",
    answer:
      "Yes. We provide commercial storefront glass and door installation, replacement, and repair for offices, retail, and facilities.",
    category: "Commercial",
  },
  {
    question: "Can commercial work be scheduled around business hours?",
    answer:
      "When project needs and scheduling allow, we discuss timing that reduces disruption to customers and staff.",
    category: "Commercial",
  },
  {
    question: "Do you offer mobile service?",
    answer:
      "Yes. Express Glass provides mobile residential and commercial glass service across Riverside, Corona, and surrounding Southern California communities.",
    category: "Service Areas",
  },
  {
    question: "What areas do you serve?",
    answer:
      "We serve Riverside, Corona, Eastvale, Moreno Valley, Perris, Pomona, Norco, Chino, Rialto, Redlands, Sun City, Temecula, Ontario, Murrieta, Riverside County, Orange County, and nearby communities.",
    category: "Service Areas",
  },
  {
    question: "Can I schedule a Saturday appointment?",
    answer:
      "Saturday appointments may be available upon request. Call to confirm availability for your project.",
    category: "Appointments",
  },
  {
    question: "What are your regular hours?",
    answer:
      "We schedule Monday–Friday by appointment. Saturday appointments may be available upon request. Calling is often the fastest way to confirm timing.",
    category: "Appointments",
  },
] as const;

/** @deprecated Use DEFAULT_FAQS */
export const STATIC_FAQS = DEFAULT_FAQS;

export const UPCOMING_BLOG_TOPICS = [
  {
    title: "Signs Your Window Glass Needs Replacement",
    summary: "Fogging, cracks, drafts, and failed seals — when to call for glass service.",
  },
  {
    title: "Choosing a Custom Shower Door",
    summary: "Frameless, sliding, and hardware choices that fit your bathroom.",
  },
  {
    title: "Repair or Replace a Shower Enclosure",
    summary: "How to decide between hardware repair and a full enclosure replacement.",
  },
  {
    title: "Benefits of Modern Vinyl Windows",
    summary: "Why homeowners choose vinyl window installation and replacement.",
  },
  {
    title: "Maintaining Glass Patio Doors",
    summary: "Simple care tips and when to call for glass panel service.",
  },
] as const;

export const STATIC_BLOG_POSTS = [
  {
    title: "Signs Your Window Glass Needs Replacement",
    slug: "signs-your-window-glass-needs-replacement",
    excerpt:
      "Fogging, cracks, drafts, and failed seals are common signals it is time to replace window glass.",
    content:
      "<p>Window glass that is cracked, fogged between panes, or no longer sealing properly can affect comfort, clarity, and appearance. Express Glass helps homeowners and businesses evaluate whether glass replacement or a broader window upgrade is the right next step.</p><p>Look for condensation between panes, visible cracks, rattling units, or drafts around the sash. A professional assessment clarifies options before small issues become larger problems—without promising specific energy-savings percentages.</p><p>If your frames are still solid, glass-only replacement may restore the opening. When frames are failing, vinyl window installation and replacement can be part of the conversation. Call Express Glass for a free estimate in Riverside, Corona, and nearby communities.</p>",
    featuredImage: "/images/services/Window-Glass-Replacement.png",
    categories: ["Windows"],
    tags: ["replacement", "maintenance"],
    relatedServices: ["window-glass-replacement", "vinyl-windows"],
  },
  {
    title: "Choosing a Custom Shower Door",
    slug: "choosing-a-custom-shower-door",
    excerpt:
      "Style, hardware, and configuration choices that help a custom shower door fit your bathroom.",
    content:
      "<p>Custom shower doors should balance appearance, access, cleaning, and the footprint of your opening. Frameless, semi-frameless, and sliding configurations each solve different layout challenges.</p><p>Hardware finish, glass type, and door swing or slide direction all matter for daily use. Professional measurement keeps the finished enclosure aligned and smooth to operate.</p><p>Express Glass designs and installs custom shower doors and tub enclosures for Riverside-area homes—so the glass fits your remodel, not a one-size stock unit.</p>",
    featuredImage: "/images/services/Custom-Shower-Doors.png",
    categories: ["Shower Doors"],
    tags: ["design", "bathroom"],
    relatedServices: ["custom-shower-doors", "tub-enclosures"],
  },
  {
    title: "Repair or Replace a Shower Enclosure",
    slug: "repair-or-replace-a-shower-enclosure",
    excerpt:
      "How to decide between hardware repair and a full enclosure replacement.",
    content:
      "<p>Worn rollers, loose handles, or minor misalignment can often be repaired. Damaged glass, chronic leaks, or outdated layouts after a remodel may call for replacement.</p><p>Express Glass reviews condition and goals so you can choose the path that makes sense—not a one-size recommendation. Targeted hardware service restores smooth operation when the glass and structure are still sound.</p><p>When replacement is the better choice, we help plan a custom shower door that fits the opening and how you use the bathroom every day.</p>",
    featuredImage: "/images/services/Shower-Door-Repair-and-Hardware-Replacement.png",
    categories: ["Repairs"],
    tags: ["shower", "hardware"],
    relatedServices: ["shower-door-repair", "custom-shower-doors"],
  },
  {
    title: "Benefits of Modern Vinyl Windows",
    slug: "benefits-of-modern-vinyl-windows",
    excerpt:
      "Why homeowners choose vinyl window installation and replacement for comfort and clarity.",
    content:
      "<p>Modern vinyl windows are a practical option when aging units are fogged, drafty, or difficult to maintain. Pairing the right glass package with professional installation supports long-term clarity and comfort.</p><p>Not every fogged window requires a full frame replacement. If the existing frame is in good condition, insulated glass replacement may be enough. Express Glass helps you compare glass-only service with vinyl window replacement based on each opening.</p><p>Serving Riverside, Corona, and surrounding Southern California communities with free estimates and mobile service.</p>",
    featuredImage: "/images/services/Vinyl-Window-Installation-and-Replacement.png",
    categories: ["Windows"],
    tags: ["vinyl", "replacement"],
    relatedServices: ["vinyl-windows", "window-glass-replacement"],
  },
] as const;

export const GALLERY_CATEGORIES_STATIC = [
  { name: "Shower Doors", slug: "shower-doors" },
  { name: "Tub Enclosures", slug: "tub-enclosures" },
  { name: "Windows", slug: "windows" },
  { name: "Doors", slug: "doors" },
  { name: "Mirrors", slug: "mirrors" },
  { name: "Residential Glass", slug: "residential-glass" },
  { name: "Commercial Glass", slug: "commercial-glass" },
  { name: "Storefronts", slug: "storefronts" },
  { name: "Before & After", slug: "before-after" },
] as const;

export const GALLERY_IMAGES_STATIC = SHOWCASE_GALLERY;

export const AREA_BLURBS: Record<string, string> = {
  Riverside:
    "Home base for Express Glass — residential showers, windows, doors, mirrors, and commercial glazing across the city.",
  Corona:
    "Mobile service for Corona homeowners and businesses needing shower glass, window replacement, and storefront work.",
  Eastvale:
    "Custom shower doors, vinyl windows, and patio door glass for Eastvale homes and light commercial spaces.",
  "Moreno Valley":
    "Measurement, installation, and repair for Moreno Valley residential and commercial glass projects.",
  Perris:
    "Mobile glass repair and replacement for Perris properties, from fogged windows to shower enclosures.",
  Pomona:
    "Serving Pomona with residential and commercial glass installation, replacement, and hardware repair.",
  Norco:
    "Local glass service for Norco homes — showers, mirrors, windows, and patio doors.",
  Chino:
    "Chino residential and commercial glass projects with on-site measurement and clear estimates.",
  Rialto:
    "Window glass, shower doors, and commercial panel service for Rialto properties.",
  Redlands:
    "Redlands homeowners and businesses can schedule mobile Express Glass installation and repair.",
  "Sun City":
    "Senior-friendly mobile glass service in Sun City for windows, showers, and door glass.",
  Temecula:
    "Temecula-area residential and commercial glass — showers, vinyl windows, and storefronts.",
  Ontario:
    "Ontario commercial storefront and residential glass replacement with licensed craftsmanship.",
  Murrieta:
    "Murrieta shower glass, patio doors, and window service with appointment-based mobile visits.",
  "Riverside County":
    "Broad Riverside County coverage for homes and businesses needing professional glass work.",
  "Orange County":
    "Select Orange County communities served with the same licensed mobile glass standard.",
  "Surrounding Southern California communities":
    "Ask if your city is nearby — we regularly serve surrounding Southern California communities.",
};

export const WHY_CHOOSE = [
  {
    title: "Licensed craftsmanship",
    description: `CA License #${BUSINESS.licenseNumber}. Licensed, bonded, and insured for residential and commercial work.`,
  },
  {
    title: "Mobile service",
    description:
      "We come to your home or business across Riverside, Corona, and surrounding communities.",
  },
  {
    title: "Clear communication",
    description:
      "Estimates, measurements, and options explained without pressure—so you can decide with confidence.",
  },
  {
    title: "Decades of experience",
    description:
      "Express Glass roots date to 1980, with Mario serving Southern California since 2003.",
  },
] as const;

export function getServiceSeed(slug: string): ServiceSeed | undefined {
  return SERVICES.find((s) => s.slug === slug);
}

export function serviceToCard(service: ServiceSeed) {
  return {
    name: service.name,
    slug: service.slug,
    shortDescription: service.summary,
    mainImage: service.images.hero,
    imageAlt: `${service.name} — Express Glass`,
    category: service.category,
  };
}

/** Sample approved testimonials for homepage / testimonials page display. */
export const SAMPLE_TESTIMONIALS = [
  {
    customerName: "Jennifer M.",
    reviewText:
      "Mario measured carefully and installed our frameless shower doors perfectly. The bathroom looks brand new, and the crew was courteous from start to finish.",
    service: "Custom Shower Doors",
    location: "Riverside, CA",
    rating: 5,
    featured: true,
    displayOrder: 1,
  },
  {
    customerName: "David R.",
    reviewText:
      "Our patio door glass fogged over after years of heat. Express Glass replaced the panel quickly and explained every step. Highly recommend for Riverside homes.",
    service: "Glass Patio Doors",
    location: "Corona, CA",
    rating: 5,
    featured: true,
    displayOrder: 2,
  },
  {
    customerName: "Sandra K.",
    reviewText:
      "They repaired our shower rollers and rails the same week we called. Smooth operation again—and no pressure to replace the whole enclosure.",
    service: "Shower Door Repair",
    location: "Eastvale, CA",
    rating: 5,
    featured: true,
    displayOrder: 3,
  },
  {
    customerName: "Michael T.",
    reviewText:
      "Professional storefront glass replacement for our small office. Clean work, fair estimate, and they came to us—exactly what we needed.",
    service: "Commercial Storefront Glass",
    location: "Moreno Valley, CA",
    rating: 5,
    featured: false,
    displayOrder: 4,
  },
  {
    customerName: "Lisa P.",
    reviewText:
      "Window glass replacement was done with care. The new insulated units look clear and the house feels more comfortable. Great local service.",
    service: "Window Glass Replacement",
    location: "Norco, CA",
    rating: 5,
    featured: false,
    displayOrder: 5,
  },
  {
    customerName: "Robert H.",
    reviewText:
      "Free estimate over the phone, then Mario came out to measure. Vinyl window work was neat and on schedule. We will call Express Glass again.",
    service: "Vinyl Windows",
    location: "Perris, CA",
    rating: 5,
    featured: false,
    displayOrder: 6,
  },
] as const;
