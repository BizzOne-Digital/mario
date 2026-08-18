import { Schema, model, models } from "mongoose";

const ProcessStepSchema = new Schema(
  {
    title: { type: String, default: "" },
    description: { type: String, default: "" },
  },
  { _id: false },
);

const BeforeAfterSchema = new Schema(
  {
    before: { type: String, default: "" },
    after: { type: String, default: "" },
    caption: { type: String, default: "" },
  },
  { _id: false },
);

const ServiceFaqSchema = new Schema(
  {
    question: { type: String, default: "" },
    answer: { type: String, default: "" },
  },
  { _id: false },
);

const DetailSectionSchema = new Schema(
  {
    key: { type: String, default: "" },
    eyebrow: { type: String, default: "" },
    heading: { type: String, default: "" },
    body: { type: String, default: "" },
    image: { type: String, default: "" },
    imageAlt: { type: String, default: "" },
    visible: { type: Boolean, default: true },
    order: { type: Number, default: 0 },
  },
  { _id: false },
);

const SocialLinkSchema = new Schema(
  {
    platform: { type: String, default: "" },
    url: { type: String, default: "" },
    label: { type: String, default: "" },
  },
  { _id: false },
);

const FooterLinkSchema = new Schema(
  {
    label: { type: String, default: "" },
    href: { type: String, default: "" },
  },
  { _id: false },
);

const DefaultSeoSchema = new Schema(
  {
    title: { type: String, default: "" },
    description: { type: String, default: "" },
    ogImage: { type: String, default: "" },
  },
  { _id: false },
);

const AnalyticsIdsSchema = new Schema(
  {
    googleAnalyticsId: { type: String, default: "" },
    googleTagManagerId: { type: String, default: "" },
    facebookPixelId: { type: String, default: "" },
  },
  { _id: false },
);

const ManufacturersPartnersSchema = new Schema(
  {
    text: { type: String, default: "" },
    authorizedInstallerConfirmed: { type: Boolean, default: false },
  },
  { _id: false },
);

const BlogSeoSchema = new Schema(
  {
    title: { type: String, default: "" },
    description: { type: String, default: "" },
    ogImage: { type: String, default: "" },
  },
  { _id: false },
);

const AdminUserSchema = new Schema(
  {
    email: { type: String, required: true, unique: true, index: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true },
    name: { type: String, required: true, trim: true },
    role: { type: String, enum: ["admin", "editor"], default: "admin" },
  },
  { timestamps: true },
);

const PageSectionSchema = new Schema(
  {
    pageSlug: { type: String, required: true, index: true },
    key: { type: String, required: true },
    eyebrow: { type: String, default: "" },
    heading: { type: String, default: "" },
    subheading: { type: String, default: "" },
    paragraphs: [{ type: String }],
    bullets: [{ type: String }],
    ctaText: { type: String, default: "" },
    ctaUrl: { type: String, default: "" },
    image: { type: String, default: "" },
    backgroundImage: { type: String, default: "" },
    imageAlt: { type: String, default: "" },
    layout: { type: String, default: "default" },
    visible: { type: Boolean, default: true },
    order: { type: Number, default: 0, index: true },
  },
  { timestamps: true },
);
PageSectionSchema.index({ pageSlug: 1, key: 1 }, { unique: true });

const PageSchema = new Schema(
  {
    slug: { type: String, required: true, unique: true, index: true },
    title: { type: String, required: true },
    status: { type: String, enum: ["draft", "published"], default: "draft", index: true },
    seoTitle: { type: String, default: "" },
    seoDescription: { type: String, default: "" },
    ogImage: { type: String, default: "" },
    sections: [{ type: Schema.Types.ObjectId, ref: "PageSection" }],
  },
  { timestamps: true },
);

const ServiceSchema = new Schema(
  {
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true, index: true },
    shortDescription: { type: String, required: true },
    mainImage: { type: String, default: "" },
    imageAlt: { type: String, default: "" },
    icon: { type: String, default: "" },
    category: { type: String, default: "general", index: true },
    displayOrder: { type: Number, default: 0, index: true },
    active: { type: Boolean, default: true, index: true },
    featured: { type: Boolean, default: false, index: true },
    published: { type: Boolean, default: false, index: true },
    ctaLabel: { type: String, default: "Request Free Estimate" },
    heroEyebrow: { type: String, default: "" },
    heroHeading: { type: String, default: "" },
    heroDescription: { type: String, default: "" },
    heroBackground: { type: String, default: "" },
    overview: { type: String, default: "" },
    features: [{ type: String }],
    applications: [{ type: String }],
    materials: [{ type: String }],
    processSteps: [ProcessStepSchema],
    benefits: [{ type: String }],
    repairVsReplace: { type: String, default: "" },
    beforeAfter: [BeforeAfterSchema],
    galleryImages: [{ type: String }],
    relatedServiceSlugs: [{ type: String }],
    faqs: [ServiceFaqSchema],
    finalCta: { type: String, default: "" },
    seoTitle: { type: String, default: "" },
    seoDescription: { type: String, default: "" },
    ogImage: { type: String, default: "" },
    detailSections: [DetailSectionSchema],
  },
  { timestamps: true },
);

const GalleryCategorySchema = new Schema(
  {
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true, index: true },
    order: { type: Number, default: 0, index: true },
    active: { type: Boolean, default: true },
  },
  { timestamps: true },
);

const GalleryImageSchema = new Schema(
  {
    categoryId: { type: Schema.Types.ObjectId, ref: "GalleryCategory", required: true, index: true },
    url: { type: String, required: true },
    webpUrl: { type: String, default: "" },
    alt: { type: String, default: "" },
    caption: { type: String, default: "" },
    serviceSlug: { type: String, default: "", index: true },
    isBeforeAfter: { type: Boolean, default: false },
    beforeUrl: { type: String, default: "" },
    afterUrl: { type: String, default: "" },
    featured: { type: Boolean, default: false },
    published: { type: Boolean, default: false, index: true },
    order: { type: Number, default: 0, index: true },
  },
  { timestamps: true },
);

const TestimonialSchema = new Schema(
  {
    customerName: { type: String, required: true },
    reviewText: { type: String, required: true },
    service: { type: String, default: "" },
    location: { type: String, default: "" },
    image: { type: String, default: "" },
    rating: { type: Number, min: 1, max: 5, default: 5 },
    featured: { type: Boolean, default: false },
    approved: { type: Boolean, default: false, index: true },
    published: { type: Boolean, default: false, index: true },
    displayOrder: { type: Number, default: 0, index: true },
    date: { type: Date, default: Date.now },
  },
  { timestamps: true },
);

const FAQCategorySchema = new Schema(
  {
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true, index: true },
    order: { type: Number, default: 0, index: true },
  },
  { timestamps: true },
);

const FAQSchema = new Schema(
  {
    question: { type: String, required: true },
    answer: { type: String, required: true },
    category: { type: String, required: true, index: true },
    serviceSlug: { type: String, default: "", index: true },
    showOnFaqPage: { type: Boolean, default: true },
    showOnServicePage: { type: Boolean, default: false },
    published: { type: Boolean, default: true, index: true },
    order: { type: Number, default: 0, index: true },
  },
  { timestamps: true },
);

const InquirySchema = new Schema(
  {
    fullName: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, lowercase: true },
    phone: { type: String, required: true, trim: true },
    service: { type: String, required: true },
    propertyType: { type: String, required: true },
    location: { type: String, required: true },
    preferredMethod: { type: String, required: true },
    preferredDate: { type: String, default: "" },
    message: { type: String, required: true },
    status: {
      type: String,
      enum: ["new", "contacted", "scheduled", "closed", "spam"],
      default: "new",
      index: true,
    },
  },
  { timestamps: true },
);

const EstimateRequestSchema = new Schema(
  {
    reference: { type: String, required: true, unique: true, index: true },
    service: { type: String, required: true },
    propertyType: { type: String, required: true },
    location: { type: String, required: true },
    address: { type: String, default: "" },
    city: { type: String, default: "" },
    requestType: { type: String, required: true },
    projectDescription: { type: String, default: "" },
    details: { type: String, default: "" },
    preferredDate: { type: String, default: "" },
    preferredTime: { type: String, default: "" },
    urgency: { type: String, default: "standard" },
    name: { type: String, required: true },
    phone: { type: String, required: true },
    email: { type: String, required: true },
    howHeard: { type: String, default: "" },
    photos: [{ type: String }],
    status: {
      type: String,
      enum: ["new", "reviewing", "quoted", "scheduled", "completed", "cancelled"],
      default: "new",
      index: true,
    },
  },
  { timestamps: true },
);

const BlogPostSchema = new Schema(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true, index: true },
    content: { type: String, required: true },
    excerpt: { type: String, default: "" },
    featuredImage: { type: String, default: "" },
    categories: [{ type: String }],
    tags: [{ type: String }],
    relatedServices: [{ type: String }],
    status: { type: String, enum: ["draft", "published"], default: "draft", index: true },
    seo: { type: BlogSeoSchema, default: () => ({}) },
  },
  { timestamps: true },
);

const BlogCategorySchema = new Schema(
  {
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true, index: true },
  },
  { timestamps: true },
);

const MediaAssetSchema = new Schema(
  {
    url: { type: String, required: true },
    webpUrl: { type: String, default: "" },
    filename: { type: String, required: true },
    mime: { type: String, required: true },
    size: { type: Number, required: true },
    width: { type: Number, default: 0 },
    height: { type: Number, default: 0 },
    alt: { type: String, default: "" },
    folder: { type: String, default: "general", index: true },
    usedBy: [{ type: String }],
  },
  { timestamps: true },
);

const SiteSettingsSchema = new Schema(
  {
    businessName: { type: String, default: "Express Glass" },
    logo: { type: String, default: "" },
    logoDark: { type: String, default: "" },
    favicon: { type: String, default: "" },
    primaryPhone: { type: String, default: "(951) 371-2601" },
    secondaryPhone: { type: String, default: "" },
    faxPhone: { type: String, default: "(951) 496-4305" },
    email: { type: String, default: "mariopanzario@yahoo.com" },
    address: { type: String, default: "" },
    hours: { type: String, default: "" },
    saturdayHours: { type: String, default: "" },
    mobileServiceNotice: {
      type: String,
      default: "Mobile residential and commercial glass service available across our service area.",
    },
    licenseNumber: { type: String, default: "898000" },
    licensedBondedInsured: { type: Boolean, default: true },
    yearsExperienceText: {
      type: String,
      default: "Serving Southern California since 2003",
    },
    ownerName: { type: String, default: "Mario" },
    companyHistory: {
      type: String,
      default:
        "Express Glass started in New York in 1980. Mario has served Southern California since 2003 with mobile residential and commercial glass service.",
    },
    christianOwnedVisible: { type: Boolean, default: false },
    christianOwnedText: { type: String, default: "" },
    specialOfferText: {
      type: String,
      default: "",
    },
    specialOfferEnabled: { type: Boolean, default: false },
    serviceAreas: [{ type: String }],
    socialLinks: [SocialLinkSchema],
    facebookUrl: { type: String, default: "" },
    mapEmbed: { type: String, default: "" },
    footerDescription: {
      type: String,
      default:
        "Express Glass provides residential and commercial glass services across Riverside, Corona, and surrounding Southern California communities.",
    },
    footerLinks: [FooterLinkSchema],
    contactRecipient: { type: String, default: "mariopanzario@yahoo.com" },
    defaultSeo: {
      type: DefaultSeoSchema,
      default: () => ({
        title: "Express Glass | Riverside, CA",
        description:
          "A trusted glass company in Riverside, CA for residential and commercial glass services.",
        ogImage: "",
      }),
    },
    analyticsIds: { type: AnalyticsIdsSchema, default: () => ({}) },
    introEnabled: { type: Boolean, default: true },
    manufacturersPartners: {
      type: ManufacturersPartnersSchema,
      default: () => ({ text: "", authorizedInstallerConfirmed: false }),
    },
  },
  { timestamps: true },
);

const ActivityLogSchema = new Schema(
  {
    actor: { type: String, required: true, index: true },
    action: { type: String, required: true, index: true },
    entity: { type: String, required: true, index: true },
    entityId: { type: String, default: "" },
    meta: { type: Schema.Types.Mixed, default: {} },
    createdAt: { type: Date, default: Date.now, index: true },
  },
  { timestamps: false },
);

export const AdminUser = models.AdminUser || model("AdminUser", AdminUserSchema);
export const PageSection = models.PageSection || model("PageSection", PageSectionSchema);
export const Page = models.Page || model("Page", PageSchema);
export const Service = models.Service || model("Service", ServiceSchema);
export const GalleryCategory =
  models.GalleryCategory || model("GalleryCategory", GalleryCategorySchema);
export const GalleryImage = models.GalleryImage || model("GalleryImage", GalleryImageSchema);
export const Testimonial = models.Testimonial || model("Testimonial", TestimonialSchema);
export const FAQCategory = models.FAQCategory || model("FAQCategory", FAQCategorySchema);
export const FAQ = models.FAQ || model("FAQ", FAQSchema);
export const Inquiry = models.Inquiry || model("Inquiry", InquirySchema);
export const EstimateRequest =
  models.EstimateRequest || model("EstimateRequest", EstimateRequestSchema);
export const BlogPost = models.BlogPost || model("BlogPost", BlogPostSchema);
export const BlogCategory = models.BlogCategory || model("BlogCategory", BlogCategorySchema);
export const MediaAsset = models.MediaAsset || model("MediaAsset", MediaAssetSchema);
export const SiteSettings = models.SiteSettings || model("SiteSettings", SiteSettingsSchema);
export const ActivityLog = models.ActivityLog || model("ActivityLog", ActivityLogSchema);
