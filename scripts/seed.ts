import { readFileSync, existsSync } from "fs";
import path from "path";
import bcrypt from "bcryptjs";
import mongoose from "mongoose";
import { SERVICE_AREAS } from "../lib/constants";
import { SAMPLE_TESTIMONIALS } from "../lib/site-content";
import {
  AdminUser,
  BlogCategory,
  BlogPost,
  FAQ,
  FAQCategory,
  GalleryCategory,
  Page,
  PageSection,
  Service,
  SiteSettings,
  Testimonial,
} from "../models";

function loadEnvFile(filePath: string): void {
  if (!existsSync(filePath)) return;
  const content = readFileSync(filePath, "utf8");
  for (const line of content.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eq = trimmed.indexOf("=");
    if (eq === -1) continue;
    const key = trimmed.slice(0, eq).trim();
    let value = trimmed.slice(eq + 1).trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    if (!(key in process.env)) {
      process.env[key] = value;
    }
  }
}

loadEnvFile(path.join(process.cwd(), ".env.local"));
loadEnvFile(path.join(process.cwd(), ".env"));

type ServiceSeed = {
  name: string;
  slug: string;
  shortDescription: string;
  category: string;
  displayOrder: number;
  featured: boolean;
  heroEyebrow: string;
  heroHeading: string;
  heroDescription: string;
  overview: string;
  features: string[];
  applications: string[];
  materials: string[];
  processSteps: { title: string; description: string }[];
  benefits: string[];
  repairVsReplace: string;
  relatedServiceSlugs: string[];
  faqs: { question: string; answer: string }[];
  finalCta: string;
  seoTitle: string;
  seoDescription: string;
  detailSections: {
    key: string;
    eyebrow: string;
    heading: string;
    body: string;
    image: string;
    imageAlt: string;
    visible: boolean;
    order: number;
  }[];
};

const SERVICES: ServiceSeed[] = [
  {
    name: "Custom Shower Doors",
    slug: "custom-shower-doors",
    shortDescription:
      "Custom shower doors and enclosures designed, measured, and installed for remodeling and new construction.",
    category: "shower",
    displayOrder: 1,
    featured: true,
    heroEyebrow: "Shower Glass",
    heroHeading: "Custom Shower Doors Built Around Your Space",
    heroDescription:
      "From walk-in enclosures to sliding glass doors, Express Glass helps you select hardware, glass, and configurations that fit your bathroom and lifestyle.",
    overview:
      "Express Glass designs and installs custom shower doors and enclosures for homes across Riverside, Corona, and surrounding Southern California communities. Every project starts with careful measurement and a clear conversation about how you use the space—so the finished enclosure looks polished and operates smoothly for years.",
    features: [
      "Walk-in shower enclosures",
      "Sliding and pivot door configurations",
      "Hardware finish selection",
      "Professional measurement and installation",
      "Repair and replacement support for existing systems",
    ],
    applications: [
      "Bathroom remodels",
      "New residential construction",
      "Enclosure upgrades",
      "Hardware refresh projects",
    ],
    materials: [
      "Tempered safety glass",
      "Framed and semi-frameless options",
      "Frameless glass systems",
      "Coordinated hinges, rollers, and handles",
    ],
    processSteps: [
      {
        title: "Consult and measure",
        description:
          "We review your layout, discuss styles and hardware, and take precise measurements on site.",
      },
      {
        title: "Select glass and hardware",
        description:
          "Choose the door style, glass treatment, and finishes that match your bathroom design.",
      },
      {
        title: "Fabricate and install",
        description:
          "Your enclosure is prepared to fit and installed with attention to alignment, seals, and clean operation.",
      },
    ],
    benefits: [
      "A cleaner, more open bathroom look",
      "Configurations matched to your tub or shower footprint",
      "Hardware options for everyday durability",
      "Local mobile service for residential projects",
    ],
    repairVsReplace:
      "If rollers, seals, or handles are worn but the glass is sound, targeted repair can restore smooth operation. When glass is damaged, out of square, or your layout has changed, a custom replacement enclosure is often the better long-term solution. We help you compare both paths based on condition and goals—not a one-size-fits-all recommendation.",
    relatedServiceSlugs: ["tub-enclosures", "shower-door-repair", "custom-glass-design"],
    faqs: [
      {
        question: "Do you build shower doors to custom sizes?",
        answer:
          "Yes. We measure on site and fabricate shower doors and enclosures to fit your opening and preferred configuration.",
      },
      {
        question: "Can you help choose hardware finishes?",
        answer:
          "Absolutely. We walk through practical options for hinges, rollers, handles, and finishes so the enclosure matches your bathroom design.",
      },
    ],
    finalCta:
      "Ready for a custom shower door estimate? Call Express Glass or request a free estimate online.",
    seoTitle: "Custom Shower Doors | Express Glass Riverside CA",
    seoDescription:
      "Custom shower doors and enclosures measured and installed by Express Glass in Riverside, Corona, and surrounding Southern California communities.",
    detailSections: [
      {
        key: "styles",
        eyebrow: "Options",
        heading: "Styles that fit real bathrooms",
        body: "Whether you need a sliding door for a tighter footprint or a walk-in enclosure for a remodeled spa-style bath, we help you choose a configuration that balances looks, access, and maintenance.",
        image: "",
        imageAlt: "",
        visible: true,
        order: 1,
      },
    ],
  },
  {
    name: "Tub Enclosures",
    slug: "tub-enclosures",
    shortDescription:
      "Custom tub enclosures with sliding configurations and coordinated glass and hardware options.",
    category: "shower",
    displayOrder: 2,
    featured: true,
    heroEyebrow: "Bath Glass",
    heroHeading: "Custom Tub Enclosures That Fit",
    heroDescription:
      "Built-to-fit tub enclosure solutions coordinated with your space, glass preferences, and hardware style.",
    overview:
      "A well-fitted tub enclosure keeps water where it belongs and completes the look of your bathroom. Express Glass provides custom tub enclosure fabrication and installation, including sliding configurations and hardware selection for residential projects throughout our service area.",
    features: [
      "Custom tub enclosures",
      "Sliding enclosure options",
      "Glass and hardware selection",
      "Installation, repair, and replacement",
      "Design coordination with existing finishes",
    ],
    applications: [
      "Standard and alcove tubs",
      "Bathroom updates",
      "Enclosure replacements",
      "Hardware upgrades",
    ],
    materials: [
      "Tempered glass panels",
      "Sliding track systems",
      "Framed and semi-frameless designs",
      "Matching towels bars and handles where applicable",
    ],
    processSteps: [
      {
        title: "On-site assessment",
        description:
          "We evaluate the tub surround, opening, and how the enclosure should operate day to day.",
      },
      {
        title: "Configuration planning",
        description:
          "Sliding layouts, glass choices, and hardware are selected to fit your tub and style goals.",
      },
      {
        title: "Professional install",
        description:
          "Panels and tracks are installed for a clean fit and reliable everyday use.",
      },
    ],
    benefits: [
      "Better water control around the tub",
      "A finished look that matches your bathroom",
      "Options for repair or full replacement",
      "Local craftsmanship and mobile service",
    ],
    repairVsReplace:
      "Track wear, roller issues, or seal problems can often be addressed without replacing the full enclosure. Cracked glass, chronically leaking systems, or outdated layouts usually call for a custom replacement. We inspect the existing enclosure and explain practical next steps.",
    relatedServiceSlugs: ["custom-shower-doors", "shower-door-repair"],
    faqs: [
      {
        question: "Can you replace just part of a tub enclosure?",
        answer:
          "In many cases yes—depending on glass condition, track condition, and available matching parts. We assess what can be repaired versus what should be replaced.",
      },
    ],
    finalCta: "Request a free tub enclosure estimate from Express Glass today.",
    seoTitle: "Tub Enclosures | Express Glass Riverside CA",
    seoDescription:
      "Custom tub enclosures with sliding options, professional installation, and repair support from Express Glass.",
    detailSections: [
      {
        key: "fit",
        eyebrow: "Precision",
        heading: "Measured for your tub opening",
        body: "Off-the-shelf kits rarely fit as cleanly as a measured enclosure. We build around your tub surround so doors slide correctly and seals sit properly.",
        image: "",
        imageAlt: "",
        visible: true,
        order: 1,
      },
    ],
  },
  {
    name: "Shower Door Repair and Hardware Replacement",
    slug: "shower-door-repair",
    shortDescription:
      "Repair misaligned doors and replace rollers, rails, handles, and damaged shower glass.",
    category: "shower",
    displayOrder: 3,
    featured: false,
    heroEyebrow: "Repair Service",
    heroHeading: "Shower Door Repair & Hardware Replacement",
    heroDescription:
      "Restore smooth operation and safer use with targeted repairs for rollers, rails, handles, alignment, and glass.",
    overview:
      "A sticking door, loose handle, or worn roller can make a shower enclosure frustrating—and sometimes unsafe. Express Glass provides shower door repair and hardware replacement for residential enclosures, helping you restore reliable function without unnecessary full replacements when repair is the smarter path.",
    features: [
      "Rollers, rails, and handles",
      "Door alignment adjustments",
      "Damaged glass replacement",
      "Existing enclosure repairs",
      "Configuration updates where practical",
    ],
    applications: [
      "Sliding shower doors",
      "Pivot and hinged enclosures",
      "Aging track systems",
      "Hardware refresh projects",
    ],
    materials: [
      "Replacement rollers and guides",
      "Rails and seals",
      "Handles and knobs",
      "Tempered replacement glass panels when needed",
    ],
    processSteps: [
      {
        title: "Diagnose the issue",
        description:
          "We identify whether the problem is hardware wear, alignment, seals, or glass damage.",
      },
      {
        title: "Repair or replace parts",
        description:
          "Worn components are replaced and doors are realigned for smoother, safer operation.",
      },
      {
        title: "Test and finish",
        description:
          "We verify open/close action, clearance, and sealing before the job is complete.",
      },
    ],
    benefits: [
      "Often more affordable than full replacement",
      "Restores everyday usability",
      "Addresses safety concerns from poor alignment",
      "Honest guidance when replacement is the better option",
    ],
    repairVsReplace:
      "Repair is ideal when structure and glass are still sound. If panels are cracked, the frame is failing, or you want a new layout, replacement may serve you better. We explain both options clearly after inspection.",
    relatedServiceSlugs: ["custom-shower-doors", "tub-enclosures"],
    faqs: [
      {
        question: "My shower door jumps the track. Can that be fixed?",
        answer:
          "Often yes. Worn rollers, dirty tracks, or alignment issues are common causes. We inspect the system and recommend repair or replacement based on what we find.",
      },
    ],
    finalCta: "Need shower door repair? Contact Express Glass for an estimate.",
    seoTitle: "Shower Door Repair | Express Glass Riverside CA",
    seoDescription:
      "Shower door repair and hardware replacement including rollers, rails, handles, alignment, and glass service.",
    detailSections: [],
  },
  {
    name: "Window Glass Replacement",
    slug: "window-glass-replacement",
    shortDescription:
      "Replacement for cracked, fogged, failed-seal, and aging window glass in homes and businesses.",
    category: "windows",
    displayOrder: 4,
    featured: true,
    heroEyebrow: "Windows",
    heroHeading: "Window Glass Replacement Done Right",
    heroDescription:
      "Clear up cracked, fogged, or failed-seal window glass with professional residential and commercial replacement service.",
    overview:
      "When window glass cracks, clouds over, or loses its sealed-unit performance, Express Glass provides window glass replacement for residential and commercial properties. We focus on proper fit, appropriate glass types for the application, and clean installation that restores clarity and weather resistance.",
    features: [
      "Cracked and broken glass replacement",
      "Hazy and failed-seal insulated units",
      "Low-E options where appropriate",
      "Tempered options where required",
      "Weather-conscious solutions",
    ],
    applications: [
      "Single- and multi-pane windows",
      "Residential living spaces",
      "Office and commercial windows",
      "Aging insulated glass units",
    ],
    materials: [
      "Insulated glass units",
      "Tempered safety glass where required",
      "Low-E glass options where appropriate",
      "Matching spacer and seal assemblies for IGU work",
    ],
    processSteps: [
      {
        title: "Inspect the unit",
        description:
          "We assess damage, fogging, seal failure, and whether glass-only or broader window service is needed.",
      },
      {
        title: "Match the glass",
        description:
          "Replacement glass is specified for size, type, and performance needs of the opening.",
      },
      {
        title: "Replace and seal",
        description:
          "The new glass is installed with care for fit, sealing, and a clean finished appearance.",
      },
    ],
    benefits: [
      "Restored visibility and curb appeal",
      "Improved comfort when failed seals are addressed",
      "Options suited to residential and commercial openings",
      "Local mobile service across our service area",
    ],
    repairVsReplace:
      "Isolated glass damage or a failed insulated unit can often be corrected with glass replacement. If frames are deteriorated, sashes are failing, or you want an efficiency upgrade, vinyl window replacement may be a better conversation—see our vinyl windows service.",
    relatedServiceSlugs: ["vinyl-windows", "door-glass-replacement", "residential-glass-installation"],
    faqs: [
      {
        question: "My windows look foggy between the panes. Can you help?",
        answer:
          "Fog between panes usually indicates a failed insulated glass seal. In many cases the insulated unit can be replaced to restore clarity.",
      },
    ],
    finalCta: "Call Express Glass for window glass replacement service.",
    seoTitle: "Window Glass Replacement | Express Glass Riverside CA",
    seoDescription:
      "Residential and commercial window glass replacement for cracked, fogged, and failed-seal units.",
    detailSections: [],
  },
  {
    name: "Door Glass Replacement",
    slug: "door-glass-replacement",
    shortDescription:
      "Entry, patio, and commercial door glass panel replacement for damaged or fogged units.",
    category: "doors",
    displayOrder: 5,
    featured: false,
    heroEyebrow: "Door Glass",
    heroHeading: "Door Glass Panel Replacement",
    heroDescription:
      "Fast, clean replacement of damaged or fogged glass panels in entry, patio, and commercial doors.",
    overview:
      "Broken or fogged door glass affects security, appearance, and comfort. Express Glass replaces door glass panels for residential entry doors, patio doors, and commercial doors, matching the opening and glass type needed for safe, durable service.",
    features: [
      "Entry-door glass",
      "Patio-door glass",
      "Commercial-door glass",
      "Broken panel replacement",
      "Failed insulated glass replacement",
    ],
    applications: [
      "Front and side entry doors",
      "Sliding and French patio doors",
      "Office and storefront door lites",
      "Damaged decorative or clear panels",
    ],
    materials: [
      "Tempered door glass where required",
      "Insulated glass panels",
      "Clear and specialty glass options as specified",
    ],
    processSteps: [
      {
        title: "Evaluate the door",
        description:
          "We confirm panel size, glass type requirements, and frame condition.",
      },
      {
        title: "Source replacement glass",
        description:
          "Panels are prepared to fit the door lite opening correctly.",
      },
      {
        title: "Install and secure",
        description:
          "Glass is set, sealed, and finished for a secure, clean result.",
      },
    ],
    benefits: [
      "Restores security and weather resistance",
      "Improves appearance of entry and patio doors",
      "Supports both home and business openings",
    ],
    repairVsReplace:
      "If only the glass is compromised and the door slab or frame is sound, panel replacement is typically the efficient fix. Severely damaged doors or full patio-door upgrades may call for broader replacement—ask us during the estimate.",
    relatedServiceSlugs: ["glass-patio-doors", "window-glass-replacement", "storefront-glass-doors"],
    faqs: [],
    finalCta: "Request a door glass replacement estimate from Express Glass.",
    seoTitle: "Door Glass Replacement | Express Glass Riverside CA",
    seoDescription:
      "Entry, patio, and commercial door glass panel replacement by Express Glass.",
    detailSections: [],
  },
  {
    name: "Mirror Glass Replacement",
    slug: "mirror-glass-replacement",
    shortDescription:
      "Residential and bathroom mirror replacement plus custom mirror projects with precise measurement.",
    category: "mirrors",
    displayOrder: 6,
    featured: false,
    heroEyebrow: "Mirrors",
    heroHeading: "Mirror Glass Replacement & Custom Mirrors",
    heroDescription:
      "Precision-measured mirror replacement and installation for bathrooms, living spaces, and commercial interiors.",
    overview:
      "Whether you need a bathroom vanity mirror replaced or a custom mirror installed, Express Glass provides careful measurement and professional installation. We help residential and commercial clients restore clarity and finish spaces with cleanly fitted mirror glass.",
    features: [
      "Bathroom and vanity mirrors",
      "Damaged mirror replacement",
      "Custom mirror applications",
      "Professional measurement",
      "Expert installation",
    ],
    applications: [
      "Bathrooms and powder rooms",
      "Dressing areas",
      "Gym and studio walls",
      "Office and retail interiors",
    ],
    materials: [
      "Quality mirror glass",
      "Polished edge options where applicable",
      "Appropriate mounting hardware for the application",
    ],
    processSteps: [
      {
        title: "Measure the opening",
        description:
          "Accurate sizing is critical for a clean, professional mirror fit.",
      },
      {
        title: "Prepare the surface",
        description:
          "We confirm mounting conditions and remove damaged mirror glass safely when replacing.",
      },
      {
        title: "Install the mirror",
        description:
          "The new mirror is set securely and finished for a level, polished appearance.",
      },
    ],
    benefits: [
      "Sharper reflection and refreshed interiors",
      "Custom sizing for unique openings",
      "Residential and commercial capability",
    ],
    repairVsReplace:
      "Damaged, desilvered, or outdated mirrors are generally replaced rather than repaired. We help you size and specify a clean replacement for the space.",
    relatedServiceSlugs: ["residential-glass-installation", "custom-glass-design"],
    faqs: [],
    finalCta: "Contact Express Glass for mirror measurement and installation.",
    seoTitle: "Mirror Replacement | Express Glass Riverside CA",
    seoDescription:
      "Bathroom and custom mirror glass replacement with professional measurement and installation.",
    detailSections: [],
  },
  {
    name: "Residential Glass Installation",
    slug: "residential-glass-installation",
    shortDescription:
      "Full residential glass installation across windows, doors, mirrors, shower systems, and patio doors.",
    category: "residential",
    displayOrder: 7,
    featured: true,
    heroEyebrow: "Residential",
    heroHeading: "Residential Glass Installation",
    heroDescription:
      "Complete in-home glass installation and replacement for windows, doors, mirrors, showers, and more.",
    overview:
      "Express Glass serves homeowners with mobile residential glass installation and replacement. From shower enclosures to window glass, mirrors, and patio doors, we bring practical craftsmanship to projects across Riverside, Corona, and nearby Southern California communities.",
    features: [
      "Windows and doors",
      "Mirrors",
      "Shower and tub enclosures",
      "Patio doors",
      "Custom glass projects",
    ],
    applications: [
      "Home remodels",
      "Damage replacement",
      "Bathroom upgrades",
      "Energy and clarity improvements",
    ],
    materials: [
      "Tempered and insulated glass as required",
      "Shower and tub enclosure systems",
      "Mirror glass",
      "Patio and door glass assemblies",
    ],
    processSteps: [
      {
        title: "Discuss the project",
        description:
          "Tell us what you need—repair, replacement, or a new installation—and where the work is located.",
      },
      {
        title: "On-site measure and plan",
        description:
          "We confirm dimensions, materials, and scheduling for a clean installation.",
      },
      {
        title: "Install with care",
        description:
          "Work is completed with attention to fit, finish, and how you use the space.",
      },
    ],
    benefits: [
      "One local team for multiple residential glass needs",
      "Mobile service convenience",
      "Licensed, bonded, and insured workmanship",
    ],
    repairVsReplace:
      "We evaluate condition and goals for each opening. Minor hardware or glass issues may be repairable; outdated systems or major damage often warrant replacement.",
    relatedServiceSlugs: [
      "custom-shower-doors",
      "window-glass-replacement",
      "glass-patio-doors",
      "vinyl-windows",
    ],
    faqs: [],
    finalCta: "Schedule your residential glass estimate with Express Glass.",
    seoTitle: "Residential Glass Installation | Express Glass",
    seoDescription:
      "Residential glass installation and replacement for windows, doors, mirrors, showers, and patio doors.",
    detailSections: [],
  },
  {
    name: "Commercial Glass Installation",
    slug: "commercial-glass-installation",
    shortDescription:
      "Small commercial window glass, door lites, and 1st-floor storefront panels — not high-rise work.",
    category: "commercial",
    displayOrder: 8,
    featured: true,
    heroEyebrow: "Light Commercial",
    heroHeading: "Commercial Glass Installation",
    heroDescription:
      "Right-sized glass service for shops and suites: window glass, door lites, and ground-floor storefront panels.",
    overview:
      "Express Glass handles light commercial glass for small businesses — window glass, door lites, and 1st-floor storefront panels. We are not a high-rise or large-building glazing contractor. Our focus is practical, local work scheduled with your business hours in mind when possible.",
    features: [
      "Small-business window glass",
      "Door lites and entry door glass",
      "1st-floor storefront panels",
      "Mirror and interior glass for small spaces",
      "Replacement of damaged commercial lites",
    ],
    applications: [
      "Shop and suite window glass",
      "Storefront door lites",
      "Ground-floor professional offices",
      "Broken or fogged commercial panels",
    ],
    materials: [
      "Door lite and entrance door glass",
      "Tempered glass where required",
      "Insulated units for exterior openings",
      "Panels matched to existing framing",
    ],
    processSteps: [
      {
        title: "Scope the openings",
        description:
          "We review the openings, access, and priorities for your small commercial space.",
      },
      {
        title: "Specify glass and schedule",
        description:
          "Materials and timing are planned around your business operations where possible.",
      },
      {
        title: "Install and clean up",
        description:
          "Glass is installed carefully with a focus on function and a clean finished look.",
      },
    ],
    benefits: [
      "Right-sized for small commercial openings",
      "Clear scope — no high-rise or tower work",
      "Replacement when individual panels fail",
    ],
    repairVsReplace:
      "Damaged door lites or window panels can often be replaced without rebuilding an entire storefront. We do not bid large high-rise or multi-story curtain-wall projects.",
    relatedServiceSlugs: ["storefront-glass-doors", "door-glass-replacement", "window-glass-replacement"],
    faqs: [],
    finalCta: "Contact Express Glass for small commercial glass service.",
    seoTitle: "Commercial Glass Installation | Express Glass",
    seoDescription:
      "Light commercial glass for 1st-floor storefronts, door lites, and business window glass in Riverside, CA.",
    detailSections: [],
  },
  {
    name: "Vinyl Window Installation and Replacement",
    slug: "vinyl-windows",
    shortDescription:
      "New and replacement vinyl windows with glass replacement and failed-seal service.",
    category: "windows",
    displayOrder: 9,
    featured: true,
    heroEyebrow: "Vinyl Windows",
    heroHeading: "Vinyl Window Installation & Replacement",
    heroDescription:
      "Energy-conscious vinyl window solutions for residential and commercial properties, plus glass and failed-seal service.",
    overview:
      "Vinyl windows are a popular path to refreshed exteriors and improved comfort. Express Glass provides vinyl window installation and replacement, along with glass replacement and failed-seal service for existing units—helping property owners choose the right level of work for each opening.",
    features: [
      "New vinyl windows",
      "Replacement vinyl windows",
      "Glass replacement",
      "Failed-seal service",
      "Residential and commercial applications",
    ],
    applications: [
      "Whole-home window updates",
      "Single-opening replacements",
      "Fogged insulated units",
      "Commercial vinyl window projects",
    ],
    materials: [
      "Vinyl window frames and sashes",
      "Insulated glass units",
      "Low-E options where appropriate",
    ],
    processSteps: [
      {
        title: "Evaluate openings",
        description:
          "We review frame condition, glass performance, and whether full vinyl replacement or glass-only service fits best.",
      },
      {
        title: "Select products",
        description:
          "Window styles and glass options are matched to your property and priorities.",
      },
      {
        title: "Install or replace glass",
        description:
          "Work is completed for a weather-tight, clean result.",
      },
    ],
    benefits: [
      "Modern appearance and easier maintenance",
      "Options from glass-only to full window replacement",
      "Residential and commercial capability",
    ],
    repairVsReplace:
      "Failed seals or broken glass may only need insulated unit replacement. Rotting or failing frames, or a desire for a full upgrade, point toward vinyl window replacement. We help you decide opening by opening.",
    relatedServiceSlugs: ["window-glass-replacement", "residential-glass-installation"],
    faqs: [
      {
        question: "Do I always need full window replacement if glass is fogged?",
        answer:
          "Not always. If the frame is in good condition, replacing the insulated glass unit can restore clarity. We inspect and recommend the most practical option.",
      },
    ],
    finalCta: "Ask Express Glass about vinyl windows or glass-only service.",
    seoTitle: "Vinyl Windows | Express Glass Riverside CA",
    seoDescription:
      "Vinyl window installation and replacement plus failed-seal and glass replacement service.",
    detailSections: [],
  },
  {
    name: "Glass Patio Doors",
    slug: "glass-patio-doors",
    shortDescription:
      "Patio-door installation, replacement, and glass panel service for brighter, more usable openings.",
    category: "doors",
    displayOrder: 10,
    featured: false,
    heroEyebrow: "Patio Doors",
    heroHeading: "Glass Patio Door Installation & Service",
    heroDescription:
      "Upgrade natural light and outdoor access with patio door installation, replacement, and glass panel service.",
    overview:
      "Patio doors connect indoor living to outdoor spaces—and when glass fails or an aging door becomes hard to use, Express Glass provides installation, replacement, and glass panel service for residential patio openings.",
    features: [
      "Patio-door installation",
      "Replacement and upgrades",
      "Glass-panel service",
      "Improved natural light",
      "Residential applications",
    ],
    applications: [
      "Sliding patio doors",
      "Glass panel replacements",
      "Aging door upgrades",
      "Remodel projects",
    ],
    materials: [
      "Tempered patio door glass",
      "Insulated glass panels",
      "Door systems suited to the opening",
    ],
    processSteps: [
      {
        title: "Assess the opening",
        description:
          "We check the existing door, track or frame condition, and glass needs.",
      },
      {
        title: "Recommend the right scope",
        description:
          "Glass-only service or full door replacement is recommended based on condition and goals.",
      },
      {
        title: "Install and adjust",
        description:
          "Doors and panels are installed for smooth operation and a clean finish.",
      },
    ],
    benefits: [
      "Better light and outdoor connection",
      "Options for repair-minded glass service or full replacement",
      "Residential focus with professional fit and finish",
    ],
    repairVsReplace:
      "Fogged or broken panels can sometimes be replaced without a full door swap. Chronic operation problems, damaged frames, or a style upgrade usually mean full patio door replacement.",
    relatedServiceSlugs: ["door-glass-replacement", "residential-glass-installation"],
    faqs: [],
    finalCta: "Request a patio door estimate from Express Glass.",
    seoTitle: "Glass Patio Doors | Express Glass Riverside CA",
    seoDescription:
      "Glass patio door installation, replacement, and panel service for residential properties.",
    detailSections: [],
  },
  {
    name: "Commercial Storefront Glass and Doors",
    slug: "storefront-glass-doors",
    shortDescription:
      "1st-floor storefront glass, door lites, and small commercial repair — not high-rise buildings.",
    category: "commercial",
    displayOrder: 11,
    featured: false,
    heroEyebrow: "Storefronts",
    heroHeading: "Commercial Storefront Glass & Doors",
    heroDescription:
      "Ground-floor shop fronts and door lites for local businesses — clear, practical glass service.",
    overview:
      "Express Glass replaces and repairs glass for small 1st-floor storefronts and business door lites. We do not install or service high-rise curtain walls or large multi-story commercial towers.",
    features: [
      "1st-floor storefront glass panels",
      "Business door glass and door lites",
      "Window glass for small commercial openings",
      "Damaged panel replacement",
      "Glass repair for ground-floor shops",
    ],
    applications: [
      "Neighborhood retail and shop fronts",
      "Professional suite entrances (ground floor)",
      "Broken commercial door glass / door lites",
      "Single-panel storefront replacement",
    ],
    materials: [
      "Tempered glass where required",
      "Door lite and entrance door glass",
      "Panels matched to existing framing",
    ],
    processSteps: [
      {
        title: "Inspect the opening",
        description:
          "We evaluate glass, door lites, and related hardware needs for the ground-floor opening.",
      },
      {
        title: "Plan service around operations",
        description:
          "Replacement is coordinated with practical access for your business when possible.",
      },
      {
        title: "Complete the install",
        description:
          "Glass is installed for security, function, and a finished look.",
      },
    ],
    benefits: [
      "Strong first impression for small businesses",
      "Repair and replacement for individual lites",
      "Clear focus — not high-rise commercial glazing",
    ],
    repairVsReplace:
      "Single damaged lites or door glass can often be replaced quickly. Large high-rise storefront systems are outside our focus.",
    relatedServiceSlugs: ["commercial-glass-installation", "door-glass-replacement"],
    faqs: [],
    finalCta: "Call Express Glass for small storefront and door lite service.",
    seoTitle: "Storefront Glass & Doors | Express Glass",
    seoDescription:
      "1st-floor storefront glass and door lite replacement and repair in Riverside, CA.",
    detailSections: [],
  },
  {
    name: "Custom Glass Design and Installation",
    slug: "custom-glass-design",
    shortDescription:
      "Consultation, measurement, selection, installation, and planning for custom residential and commercial glass.",
    category: "custom",
    displayOrder: 12,
    featured: false,
    heroEyebrow: "Custom Projects",
    heroHeading: "Custom Glass Design & Installation",
    heroDescription:
      "From first consultation through measurement, selection, and installation—custom glass planned for how you use the space.",
    overview:
      "Not every project fits a catalog product. Express Glass provides custom glass design support for residential and commercial spaces, including consultation, measurement, material selection, and installation planning so the finished work matches your goals.",
    features: [
      "Design consultation",
      "Measurement",
      "Glass and hardware selection",
      "Residential and commercial planning",
      "Installation and replacement planning",
    ],
    applications: [
      "Unique shower and enclosure layouts",
      "Custom mirrors",
      "Specialty interior glass",
      "Mixed residential/commercial scopes",
    ],
    materials: [
      "Specified tempered and specialty glass",
      "Hardware coordinated to the design",
      "Materials selected per project requirements",
    ],
    processSteps: [
      {
        title: "Consultation",
        description:
          "We discuss the space, function, style preferences, and constraints.",
      },
      {
        title: "Measure and specify",
        description:
          "Accurate dimensions and material selections form the project plan.",
      },
      {
        title: "Install",
        description:
          "Custom glass is installed with attention to fit, safety requirements, and finish.",
      },
    ],
    benefits: [
      "Solutions tailored to non-standard openings",
      "Clear planning before fabrication",
      "One team from consult through install",
    ],
    repairVsReplace:
      "Custom projects are typically new installations or planned replacements. If you have an existing custom system needing service, we can also advise on repair feasibility.",
    relatedServiceSlugs: ["custom-shower-doors", "mirror-glass-replacement", "residential-glass-installation"],
    faqs: [],
    finalCta: "Start your custom glass project with an Express Glass consultation.",
    seoTitle: "Custom Glass Design | Express Glass Riverside CA",
    seoDescription:
      "Custom glass design consultation, measurement, selection, and installation for homes and businesses.",
    detailSections: [],
  },
];

type PageSeed = {
  slug: string;
  title: string;
  seoTitle: string;
  seoDescription: string;
  sections: {
    key: string;
    eyebrow: string;
    heading: string;
    subheading: string;
    paragraphs: string[];
    bullets: string[];
    ctaText: string;
    ctaUrl: string;
    layout: string;
    order: number;
  }[];
};

const PAGES: PageSeed[] = [
  {
    slug: "home",
    title: "Home",
    seoTitle: "Express Glass | Riverside, CA",
    seoDescription:
      "A trusted glass company in Riverside, CA for residential and commercial glass services.",
    sections: [
      {
        key: "hero",
        eyebrow: "Riverside & Surrounding Communities",
        heading: "Express Glass",
        subheading:
          "Residential and commercial glass services across Riverside, Corona, and Southern California communities.",
        paragraphs: [
          "Custom shower doors, window and door glass replacement, mirrors, vinyl windows, patio doors, and commercial storefront work—delivered with mobile service and careful craftsmanship.",
        ],
        bullets: [],
        ctaText: "Request Free Estimate",
        ctaUrl: "/contact",
        layout: "hero",
        order: 1,
      },
      {
        key: "services-preview",
        eyebrow: "What We Do",
        heading: "Glass services for homes and businesses",
        subheading: "From shower enclosures to storefronts.",
        paragraphs: [],
        bullets: [
          "Custom shower doors and tub enclosures",
          "Window and door glass replacement",
          "Vinyl windows and patio doors",
          "Commercial and storefront glass",
        ],
        ctaText: "View Services",
        ctaUrl: "/services",
        layout: "features",
        order: 2,
      },
      {
        key: "offer",
        eyebrow: "Special Offer",
        heading: "10% Off for Senior Citizens and Military Personnel",
        subheading: "",
        paragraphs: [
          "Ask about our senior and military discount when you request your estimate.",
        ],
        bullets: [],
        ctaText: "Contact Us",
        ctaUrl: "/contact",
        layout: "banner",
        order: 3,
      },
    ],
  },
  {
    slug: "about",
    title: "About Express Glass",
    seoTitle: "About Express Glass | Riverside CA",
    seoDescription:
      "Learn about Express Glass—roots in New York since 1980, serving Southern California since 2003.",
    sections: [
      {
        key: "intro",
        eyebrow: "Our Story",
        heading: "About Express Glass",
        subheading: "Serving Southern California since 2003",
        paragraphs: [
          "Express Glass started in New York in 1980. Mario has served Southern California since 2003 with mobile residential and commercial glass service.",
          "We are licensed, bonded, and insured (CA License #898000) and serve Riverside, Corona, and surrounding communities with practical, carefully installed glass work.",
        ],
        bullets: [],
        ctaText: "Request Free Estimate",
        ctaUrl: "/contact",
        layout: "content",
        order: 1,
      },
    ],
  },
  {
    slug: "services",
    title: "Services",
    seoTitle: "Glass Services | Express Glass",
    seoDescription:
      "Browse residential and commercial glass services from Express Glass in Riverside, CA.",
    sections: [
      {
        key: "intro",
        eyebrow: "Services",
        heading: "Residential & commercial glass services",
        subheading: "Explore our full list of glass installation and replacement offerings.",
        paragraphs: [
          "Select a service to learn more, or contact us for a free estimate tailored to your project.",
        ],
        bullets: [],
        ctaText: "Request Estimate",
        ctaUrl: "/contact",
        layout: "content",
        order: 1,
      },
    ],
  },
  {
    slug: "gallery",
    title: "Project Gallery",
    seoTitle: "Gallery | Express Glass",
    seoDescription: "Project gallery and before/after previews from Express Glass.",
    sections: [
      {
        key: "intro",
        eyebrow: "Gallery",
        heading: "Project Gallery",
        subheading: "Filterable gallery and before/after project previews.",
        paragraphs: [
          "Browse project categories as images are added through the admin portal.",
        ],
        bullets: [],
        ctaText: "",
        ctaUrl: "",
        layout: "content",
        order: 1,
      },
    ],
  },
  {
    slug: "testimonials",
    title: "Testimonials",
    seoTitle: "Testimonials | Express Glass",
    seoDescription: "Customer testimonials for Express Glass.",
    sections: [
      {
        key: "intro",
        eyebrow: "Reviews",
        heading: "Testimonials",
        subheading: "Approved customer testimonials are managed through the admin portal.",
        paragraphs: [
          "Published reviews appear here after approval. We do not display unverified testimonials.",
        ],
        bullets: [],
        ctaText: "Contact Us",
        ctaUrl: "/contact",
        layout: "content",
        order: 1,
      },
    ],
  },
  {
    slug: "faq",
    title: "Frequently Asked Questions",
    seoTitle: "FAQ | Express Glass",
    seoDescription:
      "Answers about estimates, appointments, installation, and repairs from Express Glass.",
    sections: [
      {
        key: "intro",
        eyebrow: "Help",
        heading: "Frequently Asked Questions",
        subheading: "Find answers about estimates, appointments, installation, and repairs.",
        paragraphs: [],
        bullets: [],
        ctaText: "Still have questions? Contact us",
        ctaUrl: "/contact",
        layout: "content",
        order: 1,
      },
    ],
  },
  {
    slug: "contact",
    title: "Contact Express Glass",
    seoTitle: "Contact | Express Glass Riverside CA",
    seoDescription:
      "Contact Express Glass in Riverside, CA. Call (951) 407-0868 or (951) 371-2601.",
    sections: [
      {
        key: "intro",
        eyebrow: "Get in Touch",
        heading: "Contact Express Glass",
        subheading: "Call us or send a message to start your project.",
        paragraphs: [
          "Primary: (951) 407-0868",
          "Secondary: (951) 371-2601",
          "Address: 1440 3rd Street #21, Riverside, CA 92507",
        ],
        bullets: [],
        ctaText: "Request Free Estimate",
        ctaUrl: "/contact",
        layout: "content",
        order: 1,
      },
    ],
  },
  {
    slug: "service-areas",
    title: "Service Areas",
    seoTitle: "Service Areas | Express Glass",
    seoDescription:
      "Express Glass serves Riverside, Corona, Eastvale, and surrounding Southern California communities.",
    sections: [
      {
        key: "intro",
        eyebrow: "Where We Work",
        heading: "Service Areas",
        subheading: "Mobile glass service across Riverside County, Orange County, and nearby communities.",
        paragraphs: [
          "We serve Riverside, Corona, Eastvale, Moreno Valley, Perris, Pomona, Norco, Chino, Rialto, Redlands, Sun City, Temecula, Ontario, Murrieta, Riverside County, Orange County, and surrounding Southern California communities.",
        ],
        bullets: [...SERVICE_AREAS],
        ctaText: "Request Estimate",
        ctaUrl: "/contact",
        layout: "content",
        order: 1,
      },
    ],
  },
  {
    slug: "blog",
    title: "Blog",
    seoTitle: "Blog | Express Glass",
    seoDescription: "Glass-care and replacement educational resources from Express Glass.",
    sections: [
      {
        key: "intro",
        eyebrow: "Resources",
        heading: "Blog",
        subheading: "Glass-care and replacement educational resources.",
        paragraphs: [
          "Articles publish here when ready. Draft educational posts are managed in the admin portal.",
        ],
        bullets: [],
        ctaText: "",
        ctaUrl: "",
        layout: "content",
        order: 1,
      },
    ],
  },
];

const FAQ_CATEGORIES = [
  { name: "Estimates & Scheduling", slug: "estimates-scheduling", order: 1 },
  { name: "Installation & Repairs", slug: "installation-repairs", order: 2 },
  { name: "Service Areas & General", slug: "service-areas-general", order: 3 },
];

const FAQS = [
  {
    question: "How do I request an estimate?",
    answer:
      "You can call (951) 407-0868 or (951) 371-2601, or use the contact form with your project details.",
    category: "estimates-scheduling",
    order: 1,
  },
  {
    question: "Do you offer free estimates?",
    answer:
      "Yes. Contact Express Glass to request a free estimate for your residential or commercial glass project.",
    category: "estimates-scheduling",
    order: 2,
  },
  {
    question: "Is there a senior or military discount?",
    answer:
      "Yes. Express Glass offers 10% off for senior citizens and military personnel. Mention the offer when you request your estimate.",
    category: "estimates-scheduling",
    order: 3,
  },
  {
    question: "Do you provide mobile service?",
    answer:
      "Yes. Express Glass provides mobile residential and commercial glass service across our service area.",
    category: "service-areas-general",
    order: 1,
  },
  {
    question: "Where are you located?",
    answer:
      "Express Glass is at 1440 3rd Street #21, Riverside, CA 92507. We also travel to customers throughout Riverside, Corona, and surrounding Southern California communities.",
    category: "service-areas-general",
    order: 2,
  },
  {
    question: "Are you licensed and insured?",
    answer:
      "Yes. Express Glass is licensed, bonded, and insured. CA License #898000.",
    category: "service-areas-general",
    order: 3,
  },
  {
    question: "Can you repair a shower door instead of replacing it?",
    answer:
      "Often yes. Worn rollers, rails, handles, and alignment issues can frequently be repaired. If glass is damaged or the enclosure is beyond practical repair, we will explain replacement options after inspection.",
    category: "installation-repairs",
    order: 1,
    serviceSlug: "shower-door-repair",
    showOnServicePage: true,
  },
  {
    question: "What kinds of window glass problems do you handle?",
    answer:
      "We replace cracked and broken glass and address hazy or failed-seal insulated units for residential and commercial windows. We can also discuss vinyl window replacement when a full window upgrade is a better fit.",
    category: "installation-repairs",
    order: 2,
    serviceSlug: "window-glass-replacement",
    showOnServicePage: true,
  },
  {
    question: "Do you work on commercial storefronts?",
    answer:
      "Yes — for small 1st-floor storefronts, door lites, and business window or door glass. We do not work on high-rises or large commercial building glazing.",
    category: "installation-repairs",
    order: 3,
    serviceSlug: "storefront-glass-doors",
    showOnServicePage: true,
  },
];

const GALLERY_CATEGORIES = [
  { name: "Shower Doors", slug: "shower-doors", order: 1 },
  { name: "Tub Enclosures", slug: "tub-enclosures", order: 2 },
  { name: "Windows", slug: "windows", order: 3 },
  { name: "Doors & Patio", slug: "doors-patio", order: 4 },
  { name: "Mirrors", slug: "mirrors", order: 5 },
  { name: "Commercial & Storefront", slug: "commercial-storefront", order: 6 },
  { name: "Before & After", slug: "before-after", order: 7 },
];

const BLOG_POSTS = [
  {
    title: "Signs Your Window Glass Needs Replacement",
    slug: "signs-your-window-glass-needs-replacement",
    excerpt:
      "Cracks, fogging between panes, and drafts around glass are common clues it may be time to replace window glass.",
    categories: ["windows"],
    tags: ["window glass", "replacement", "maintenance"],
    relatedServices: ["window-glass-replacement", "vinyl-windows"],
    content: `<p>Window glass does not last forever. Visible cracks, chips that grow, or fogging between insulated panes are clear signals to schedule an inspection. Failed seals can leave moisture trapped between panes, reducing clarity and comfort.</p>
<p>If frames are still sound, glass-only replacement may restore performance. When frames are failing or you want a broader upgrade, vinyl window replacement can be the better conversation. Express Glass can evaluate openings and recommend a practical path for your home or business.</p>`,
  },
  {
    title: "Choosing a Custom Shower Door",
    slug: "choosing-a-custom-shower-door",
    excerpt:
      "How to think about layouts, hardware, and glass when planning a custom shower door.",
    categories: ["shower"],
    tags: ["shower doors", "bathroom", "custom glass"],
    relatedServices: ["custom-shower-doors", "tub-enclosures"],
    content: `<p>A custom shower door should fit your opening and how you use the bathroom every day. Sliding doors can work well in tighter spaces, while pivot or walk-in designs may suit larger remodeled showers.</p>
<p>Hardware finish, glass type, and enclosure style all affect the final look and maintenance. Professional measurement is essential—small sizing errors show up quickly in alignment and sealing. Express Glass helps homeowners compare options and install enclosures built for the space.</p>`,
  },
  {
    title: "Repair or Replace a Shower Enclosure?",
    slug: "repair-or-replace-a-shower-enclosure",
    excerpt:
      "A practical look at when shower door repair makes sense versus planning a full enclosure replacement.",
    categories: ["shower"],
    tags: ["repair", "shower enclosure", "hardware"],
    relatedServices: ["shower-door-repair", "custom-shower-doors"],
    content: `<p>Not every sticky or leaking shower door needs a full replacement. Worn rollers, loose handles, and minor alignment issues are often repairable. Targeted hardware service can restore smooth, safer operation when the glass and structure are still sound.</p>
<p>Replacement becomes more practical when glass is cracked, the system is chronically leaking, or your remodel changes the layout. An on-site inspection helps separate quick fixes from projects that deserve a new custom enclosure.</p>`,
  },
  {
    title: "Benefits of Modern Vinyl Windows",
    slug: "benefits-of-modern-vinyl-windows",
    excerpt:
      "Why homeowners and property managers consider vinyl window installation and replacement.",
    categories: ["windows"],
    tags: ["vinyl windows", "replacement", "energy"],
    relatedServices: ["vinyl-windows", "window-glass-replacement"],
    content: `<p>Modern vinyl windows are popular for their low maintenance and refreshed exterior appearance. For many properties, replacement windows also open the door to improved insulated glass options compared with aging single-pane or failed units.</p>
<p>That said, not every fogged window requires a full frame replacement. If the vinyl or existing frame is in good condition, insulated glass replacement may be enough. Express Glass helps you compare glass-only service with full vinyl window replacement based on each opening.</p>`,
  },
  {
    title: "Maintaining Glass Patio Doors",
    slug: "maintaining-glass-patio-doors",
    excerpt:
      "Simple habits and service cues that keep patio door glass and operation in better shape.",
    categories: ["doors"],
    tags: ["patio doors", "maintenance", "glass"],
    relatedServices: ["glass-patio-doors", "door-glass-replacement"],
    content: `<p>Patio doors take daily use and weather exposure. Keeping tracks clean, watching for rough operation, and addressing fogged or damaged panels early can prevent larger headaches.</p>
<p>When glass is compromised but the door system is otherwise solid, panel replacement may restore clarity and weather resistance. If the door is hard to operate or the frame is failing, full patio door replacement may be the better long-term choice. Express Glass can inspect and advise on the right scope.</p>`,
  },
];

async function seedAdmin(): Promise<void> {
  const email = process.env.ADMIN_EMAIL?.trim().toLowerCase();
  const password = process.env.ADMIN_PASSWORD;
  if (!email || !password) {
    throw new Error("ADMIN_EMAIL and ADMIN_PASSWORD are required to seed.");
  }

  const passwordHash = await bcrypt.hash(password, 12);
  await AdminUser.findOneAndUpdate(
    { email },
    {
      email,
      passwordHash,
      name: "Site Admin",
      role: "admin",
    },
    { upsert: true, returnDocument: 'after', setDefaultsOnInsert: true },
  );
  console.log(`Admin upserted: ${email}`);
}

async function seedSettings(): Promise<void> {
  const existing = await SiteSettings.findOne().lean();
  const payload = {
    businessName: "Express Glass",
    logo: "",
    logoDark: "",
    favicon: "",
    primaryPhone: "(951) 407-0868",
    secondaryPhone: "(951) 371-2601",
    email: "",
    address: "1440 3rd Street #21, Riverside, CA 92507",
    hours: "",
    saturdayHours: "",
    mobileServiceNotice:
      "Mobile residential and light commercial glass service available across our service area.",
    licenseNumber: "898000",
    licensedBondedInsured: true,
    yearsExperienceText: "Serving Southern California since 2003",
    ownerName: "Mario",
    companyHistory:
      "Express Glass started in New York in 1980. Mario has served Southern California since 2003 with mobile residential and light commercial glass service.",
    christianOwnedVisible: false,
    christianOwnedText: "",
    specialOfferText: "10% Off for Senior Citizens and Military Personnel",
    specialOfferEnabled: true,
    serviceAreas: [...SERVICE_AREAS],
    socialLinks: [],
    facebookUrl: "",
    mapEmbed: "",
    footerDescription:
      "Express Glass provides residential and light commercial glass services — showers, window and door glass, and small 1st-floor storefronts — across Riverside, Corona, and surrounding Southern California communities.",
    footerLinks: [
      { label: "Services", href: "/services" },
      { label: "About", href: "/about" },
      { label: "Gallery", href: "/gallery" },
      { label: "FAQ", href: "/faq" },
      { label: "Contact", href: "/contact" },
    ],
    contactRecipient: "",
    defaultSeo: {
      title: "Express Glass | Riverside, CA",
      description:
        "A trusted glass company in Riverside, CA for residential and commercial glass services.",
      ogImage: "",
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

  if (existing) {
    await SiteSettings.updateOne({ _id: existing._id }, { $set: payload });
  } else {
    await SiteSettings.create(payload);
  }
  console.log("SiteSettings upserted (business email left empty).");
}

async function seedServices(): Promise<void> {
  for (const service of SERVICES) {
    await Service.findOneAndUpdate(
      { slug: service.slug },
      {
        $set: {
          name: service.name,
          slug: service.slug,
          shortDescription: service.shortDescription,
          mainImage: "",
          imageAlt: service.name,
          icon: "",
          category: service.category,
          displayOrder: service.displayOrder,
          active: true,
          featured: service.featured,
          published: true,
          ctaLabel: "Request Free Estimate",
          heroEyebrow: service.heroEyebrow,
          heroHeading: service.heroHeading,
          heroDescription: service.heroDescription,
          heroBackground: "",
          overview: service.overview,
          features: service.features,
          applications: service.applications,
          materials: service.materials,
          processSteps: service.processSteps,
          benefits: service.benefits,
          repairVsReplace: service.repairVsReplace,
          beforeAfter: [],
          galleryImages: [],
          relatedServiceSlugs: service.relatedServiceSlugs,
          faqs: service.faqs,
          finalCta: service.finalCta,
          seoTitle: service.seoTitle,
          seoDescription: service.seoDescription,
          ogImage: "",
          detailSections: service.detailSections,
        },
      },
      { upsert: true, returnDocument: 'after', setDefaultsOnInsert: true },
    );
  }
  console.log(`Services upserted: ${SERVICES.length}`);
}

async function seedPages(): Promise<void> {
  for (const page of PAGES) {
    const sectionIds: string[] = [];

    for (const section of page.sections) {
      const doc = await PageSection.findOneAndUpdate(
        { pageSlug: page.slug, key: section.key },
        {
          $set: {
            pageSlug: page.slug,
            key: section.key,
            eyebrow: section.eyebrow,
            heading: section.heading,
            subheading: section.subheading,
            paragraphs: section.paragraphs,
            bullets: section.bullets,
            ctaText: section.ctaText,
            ctaUrl: section.ctaUrl,
            image: "",
            backgroundImage: "",
            imageAlt: "",
            layout: section.layout,
            visible: true,
            order: section.order,
          },
        },
        { upsert: true, returnDocument: 'after', setDefaultsOnInsert: true },
      );
      sectionIds.push(String(doc._id));
    }

    await Page.findOneAndUpdate(
      { slug: page.slug },
      {
        $set: {
          slug: page.slug,
          title: page.title,
          status: "published",
          seoTitle: page.seoTitle,
          seoDescription: page.seoDescription,
          ogImage: "",
          sections: sectionIds,
        },
      },
      { upsert: true, returnDocument: 'after', setDefaultsOnInsert: true },
    );
  }
  console.log(`Pages upserted: ${PAGES.length}`);
}

async function seedFaqs(): Promise<void> {
  for (const cat of FAQ_CATEGORIES) {
    await FAQCategory.findOneAndUpdate(
      { slug: cat.slug },
      { $set: cat },
      { upsert: true, returnDocument: 'after', setDefaultsOnInsert: true },
    );
  }

  for (const faq of FAQS) {
    await FAQ.findOneAndUpdate(
      { question: faq.question },
      {
        $set: {
          question: faq.question,
          answer: faq.answer,
          category: faq.category,
          serviceSlug: "serviceSlug" in faq ? (faq.serviceSlug as string) : "",
          showOnFaqPage: true,
          showOnServicePage:
            "showOnServicePage" in faq ? Boolean(faq.showOnServicePage) : false,
          published: true,
          order: faq.order,
        },
      },
      { upsert: true, returnDocument: 'after', setDefaultsOnInsert: true },
    );
  }
  console.log(`FAQ categories: ${FAQ_CATEGORIES.length}, FAQs: ${FAQS.length}`);
}

async function seedGalleryCategories(): Promise<void> {
  for (const cat of GALLERY_CATEGORIES) {
    await GalleryCategory.findOneAndUpdate(
      { slug: cat.slug },
      { $set: { ...cat, active: true } },
      { upsert: true, returnDocument: 'after', setDefaultsOnInsert: true },
    );
  }
  console.log(`Gallery categories upserted: ${GALLERY_CATEGORIES.length}`);
}

async function seedBlog(): Promise<void> {
  const categories = [
    { name: "Windows", slug: "windows" },
    { name: "Shower", slug: "shower" },
    { name: "Doors", slug: "doors" },
  ];

  for (const cat of categories) {
    await BlogCategory.findOneAndUpdate(
      { slug: cat.slug },
      { $set: cat },
      { upsert: true, returnDocument: 'after', setDefaultsOnInsert: true },
    );
  }

  for (const post of BLOG_POSTS.slice(0, 4)) {
    const featured =
      post.slug === "signs-your-window-glass-needs-replacement"
        ? "/images/services/Window-Glass-Replacement.png"
        : post.slug === "choosing-a-custom-shower-door"
          ? "/images/services/Custom-Shower-Doors.png"
          : post.slug === "repair-or-replace-a-shower-enclosure"
            ? "/images/services/Shower-Door-Repair-and-Hardware-Replacement.png"
            : "/images/services/Vinyl-Window-Installation-and-Replacement.png";

    await BlogPost.findOneAndUpdate(
      { slug: post.slug },
      {
        $set: {
          title: post.title,
          slug: post.slug,
          content: post.content,
          excerpt: post.excerpt,
          featuredImage: featured,
          categories: post.categories,
          tags: post.tags,
          relatedServices: post.relatedServices,
          status: "published",
          seo: {
            title: post.title,
            description: post.excerpt,
            ogImage: featured,
          },
        },
      },
      { upsert: true, returnDocument: "after", setDefaultsOnInsert: true },
    );
  }
  // Keep 5th topic as draft only if present
  if (BLOG_POSTS[4]) {
    await BlogPost.findOneAndUpdate(
      { slug: BLOG_POSTS[4].slug },
      {
        $set: {
          title: BLOG_POSTS[4].title,
          slug: BLOG_POSTS[4].slug,
          content: BLOG_POSTS[4].content,
          excerpt: BLOG_POSTS[4].excerpt,
          featuredImage: "",
          categories: BLOG_POSTS[4].categories,
          tags: BLOG_POSTS[4].tags,
          relatedServices: BLOG_POSTS[4].relatedServices,
          status: "draft",
          seo: {
            title: BLOG_POSTS[4].title,
            description: BLOG_POSTS[4].excerpt,
            ogImage: "",
          },
        },
      },
      { upsert: true, returnDocument: "after", setDefaultsOnInsert: true },
    );
  }
  console.log("Blog posts upserted: 4 published, remaining drafts");
}

async function seedTestimonials(): Promise<void> {
  for (const item of SAMPLE_TESTIMONIALS) {
    await Testimonial.findOneAndUpdate(
      { customerName: item.customerName, service: item.service },
      {
        $set: {
          customerName: item.customerName,
          reviewText: item.reviewText,
          service: item.service,
          location: item.location,
          image: "",
          rating: item.rating,
          featured: item.featured,
          approved: true,
          published: true,
          displayOrder: item.displayOrder,
          date: new Date(),
        },
      },
      { upsert: true, returnDocument: "after", setDefaultsOnInsert: true },
    );
  }
  console.log(`Testimonials upserted: ${SAMPLE_TESTIMONIALS.length} (approved & published)`);
}

async function main(): Promise<void> {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    throw new Error("MONGODB_URI is required.");
  }

  console.log("Connecting to MongoDB...");
  await mongoose.connect(uri);
  console.log("Connected.");

  await seedAdmin();
  await seedSettings();
  await seedServices();
  await seedPages();
  await seedFaqs();
  await seedGalleryCategories();
  await seedBlog();
  await seedTestimonials();
  console.log("Seed complete.");
}

main()
  .catch((error: unknown) => {
    console.error("Seed failed:", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await mongoose.disconnect();
  });
