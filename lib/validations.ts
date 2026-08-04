import { z } from "zod";

const publishStatus = z.enum(["draft", "published"]);
const inquiryStatus = z.enum([
  "new",
  "contacted",
  "scheduled",
  "closed",
  "spam",
]);
const estimateStatus = z.enum([
  "new",
  "reviewing",
  "quoted",
  "scheduled",
  "completed",
  "cancelled",
]);

export const contactSchema = z.object({
  fullName: z.string().trim().min(1).max(120),
  email: z.string().trim().email().max(200),
  phone: z.string().trim().min(7).max(40),
  service: z.string().trim().min(1).max(120),
  propertyType: z.string().trim().min(1).max(80),
  location: z.string().trim().min(1).max(160),
  preferredMethod: z.string().trim().min(1).max(40),
  preferredDate: z.string().trim().max(40).optional().default(""),
  message: z.string().trim().min(1).max(5000),
  website: z.string().optional().default(""),
});

export const estimateSchema = z.object({
  service: z.string().trim().min(1).max(120),
  propertyType: z.string().trim().min(1).max(80),
  location: z.string().trim().min(1).max(160),
  address: z.string().trim().max(200).optional().default(""),
  city: z.string().trim().max(100).optional().default(""),
  requestType: z.string().trim().min(1).max(80),
  projectDescription: z.string().trim().max(5000).optional().default(""),
  details: z.string().trim().max(5000).optional().default(""),
  preferredDate: z.string().trim().max(40).optional().default(""),
  preferredTime: z.string().trim().max(40).optional().default(""),
  urgency: z.string().trim().max(40).optional().default("standard"),
  name: z.string().trim().min(1).max(120),
  phone: z.string().trim().min(7).max(40),
  email: z.string().trim().email().max(200),
  howHeard: z.string().trim().max(120).optional().default(""),
  photos: z.array(z.string()).optional().default([]),
  website: z.string().optional().default(""),
});

export const siteSettingsUpdateSchema = z
  .object({
    businessName: z.string().trim().max(120).optional(),
    logo: z.string().trim().max(500).optional(),
    logoDark: z.string().trim().max(500).optional(),
    favicon: z.string().trim().max(500).optional(),
    primaryPhone: z.string().trim().max(40).optional(),
    secondaryPhone: z.string().trim().max(40).optional(),
    email: z.string().trim().max(200).optional(),
    address: z.string().trim().max(300).optional(),
    hours: z.string().trim().max(200).optional(),
    saturdayHours: z.string().trim().max(200).optional(),
    mobileServiceNotice: z.string().trim().max(500).optional(),
    licenseNumber: z.string().trim().max(80).optional(),
    licensedBondedInsured: z.boolean().optional(),
    yearsExperienceText: z.string().trim().max(200).optional(),
    ownerName: z.string().trim().max(120).optional(),
    companyHistory: z.string().trim().max(5000).optional(),
    christianOwnedVisible: z.boolean().optional(),
    christianOwnedText: z.string().trim().max(500).optional(),
    specialOfferText: z.string().trim().max(300).optional(),
    specialOfferEnabled: z.boolean().optional(),
    serviceAreas: z.array(z.string()).optional(),
    socialLinks: z
      .array(
        z.object({
          platform: z.string(),
          url: z.string(),
          label: z.string(),
        }),
      )
      .optional(),
    facebookUrl: z.string().trim().max(500).optional(),
    mapEmbed: z.string().trim().max(2000).optional(),
    footerDescription: z.string().trim().max(1000).optional(),
    footerLinks: z
      .array(z.object({ label: z.string(), href: z.string() }))
      .optional(),
    contactRecipient: z.string().trim().max(200).optional(),
    defaultSeo: z
      .object({
        title: z.string(),
        description: z.string(),
        ogImage: z.string(),
      })
      .optional(),
    analyticsIds: z
      .object({
        googleAnalyticsId: z.string(),
        googleTagManagerId: z.string(),
        facebookPixelId: z.string(),
      })
      .optional(),
    introEnabled: z.boolean().optional(),
    manufacturersPartners: z
      .object({
        text: z.string(),
        authorizedInstallerConfirmed: z.boolean(),
      })
      .optional(),
  })
  .strict();

const processStepSchema = z.object({
  title: z.string(),
  description: z.string(),
});

const beforeAfterSchema = z.object({
  before: z.string(),
  after: z.string(),
  caption: z.string(),
});

const serviceFaqSchema = z.object({
  question: z.string(),
  answer: z.string(),
});

const detailSectionSchema = z.object({
  key: z.string(),
  eyebrow: z.string(),
  heading: z.string(),
  body: z.string(),
  image: z.string(),
  imageAlt: z.string(),
  visible: z.boolean(),
  order: z.number(),
});

export const serviceCreateSchema = z.object({
  name: z.string().trim().min(1).max(200),
  slug: z.string().trim().min(1).max(200).optional(),
  shortDescription: z.string().trim().min(1).max(500),
  mainImage: z.string().optional().default(""),
  imageAlt: z.string().optional().default(""),
  icon: z.string().optional().default(""),
  category: z.string().optional().default("general"),
  displayOrder: z.number().int().optional().default(0),
  active: z.boolean().optional().default(true),
  featured: z.boolean().optional().default(false),
  published: z.boolean().optional().default(false),
  ctaLabel: z.string().optional().default("Request Free Estimate"),
  heroEyebrow: z.string().optional().default(""),
  heroHeading: z.string().optional().default(""),
  heroDescription: z.string().optional().default(""),
  heroBackground: z.string().optional().default(""),
  overview: z.string().optional().default(""),
  features: z.array(z.string()).optional().default([]),
  applications: z.array(z.string()).optional().default([]),
  materials: z.array(z.string()).optional().default([]),
  processSteps: z.array(processStepSchema).optional().default([]),
  benefits: z.array(z.string()).optional().default([]),
  repairVsReplace: z.string().optional().default(""),
  beforeAfter: z.array(beforeAfterSchema).optional().default([]),
  galleryImages: z.array(z.string()).optional().default([]),
  relatedServiceSlugs: z.array(z.string()).optional().default([]),
  faqs: z.array(serviceFaqSchema).optional().default([]),
  finalCta: z.string().optional().default(""),
  seoTitle: z.string().optional().default(""),
  seoDescription: z.string().optional().default(""),
  ogImage: z.string().optional().default(""),
  detailSections: z.array(detailSectionSchema).optional().default([]),
});

export const serviceUpdateSchema = serviceCreateSchema.partial();

export const pageUpdateSchema = z.object({
  title: z.string().trim().min(1).max(200).optional(),
  status: publishStatus.optional(),
  seoTitle: z.string().optional(),
  seoDescription: z.string().optional(),
  ogImage: z.string().optional(),
  sections: z
    .array(
      z.object({
        key: z.string(),
        eyebrow: z.string().optional(),
        heading: z.string().optional(),
        subheading: z.string().optional(),
        paragraphs: z.array(z.string()).optional(),
        bullets: z.array(z.string()).optional(),
        ctaText: z.string().optional(),
        ctaUrl: z.string().optional(),
        image: z.string().optional(),
        backgroundImage: z.string().optional(),
        imageAlt: z.string().optional(),
        layout: z.string().optional(),
        visible: z.boolean().optional(),
        order: z.number().optional(),
      }),
    )
    .optional(),
});

export const galleryCategorySchema = z.object({
  name: z.string().trim().min(1).max(120),
  slug: z.string().trim().min(1).max(120).optional(),
  order: z.number().int().optional().default(0),
  active: z.boolean().optional().default(true),
});

export const galleryCategoryUpdateSchema = galleryCategorySchema.partial();

export const galleryImageSchema = z.object({
  categoryId: z.string().min(1),
  url: z.string().min(1),
  webpUrl: z.string().optional().default(""),
  alt: z.string().optional().default(""),
  caption: z.string().optional().default(""),
  serviceSlug: z.string().optional().default(""),
  isBeforeAfter: z.boolean().optional().default(false),
  beforeUrl: z.string().optional().default(""),
  afterUrl: z.string().optional().default(""),
  featured: z.boolean().optional().default(false),
  published: z.boolean().optional().default(false),
  order: z.number().int().optional().default(0),
});

export const galleryImageUpdateSchema = galleryImageSchema.partial();

export const testimonialSchema = z.object({
  customerName: z.string().trim().min(1).max(120),
  reviewText: z.string().trim().min(1).max(5000),
  service: z.string().optional().default(""),
  location: z.string().optional().default(""),
  image: z.string().optional().default(""),
  rating: z.number().int().min(1).max(5).optional().default(5),
  featured: z.boolean().optional().default(false),
  approved: z.boolean().optional().default(false),
  published: z.boolean().optional().default(false),
  displayOrder: z.number().int().optional().default(0),
  date: z.coerce.date().optional(),
});

export const testimonialUpdateSchema = testimonialSchema.partial();

export const faqSchema = z.object({
  question: z.string().trim().min(1).max(500),
  answer: z.string().trim().min(1).max(10000),
  category: z.string().trim().min(1).max(120),
  serviceSlug: z.string().optional().default(""),
  showOnFaqPage: z.boolean().optional().default(true),
  showOnServicePage: z.boolean().optional().default(false),
  published: z.boolean().optional().default(true),
  order: z.number().int().optional().default(0),
});

export const faqUpdateSchema = faqSchema.partial();

export const blogCreateSchema = z.object({
  title: z.string().trim().min(1).max(200),
  slug: z.string().trim().min(1).max(200).optional(),
  content: z.string().min(1),
  excerpt: z.string().optional().default(""),
  featuredImage: z.string().optional().default(""),
  categories: z.array(z.string()).optional().default([]),
  tags: z.array(z.string()).optional().default([]),
  relatedServices: z.array(z.string()).optional().default([]),
  status: publishStatus.optional().default("draft"),
  seo: z
    .object({
      title: z.string().optional().default(""),
      description: z.string().optional().default(""),
      ogImage: z.string().optional().default(""),
    })
    .optional()
    .default({ title: "", description: "", ogImage: "" }),
});

export const blogUpdateSchema = blogCreateSchema.partial();

export const revalidateSchema = z.object({
  path: z.string().trim().min(1).max(500).optional(),
  paths: z.array(z.string().trim().min(1).max(500)).optional(),
  type: z.enum(["path", "all", "settings"]).optional().default("path"),
});

export const inquiryStatusSchema = z.object({
  status: inquiryStatus,
});

export const estimateStatusSchema = z.object({
  status: estimateStatus,
});
