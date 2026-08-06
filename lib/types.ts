export type PublishStatus = "draft" | "published";
export type InquiryStatus =
  | "new"
  | "contacted"
  | "scheduled"
  | "closed"
  | "spam";
export type EstimateStatus =
  | "new"
  | "reviewing"
  | "quoted"
  | "scheduled"
  | "completed"
  | "cancelled";
export type AdminRole = "admin" | "editor";

export interface Timestamps {
  createdAt: Date;
  updatedAt: Date;
}

export interface AdminUserDoc extends Timestamps {
  _id: string;
  email: string;
  passwordHash: string;
  name: string;
  role: AdminRole;
}

export interface PageSectionDoc extends Timestamps {
  _id: string;
  pageSlug: string;
  key: string;
  eyebrow: string;
  heading: string;
  subheading: string;
  paragraphs: string[];
  bullets: string[];
  ctaText: string;
  ctaUrl: string;
  image: string;
  backgroundImage: string;
  imageAlt: string;
  layout: string;
  visible: boolean;
  order: number;
}

export interface PageDoc extends Timestamps {
  _id: string;
  slug: string;
  title: string;
  status: PublishStatus;
  seoTitle: string;
  seoDescription: string;
  ogImage: string;
  sections: string[] | PageSectionDoc[];
}

export interface ProcessStep {
  title: string;
  description: string;
}

export interface BeforeAfterPair {
  before: string;
  after: string;
  caption: string;
}

export interface ServiceFaq {
  question: string;
  answer: string;
}

export interface ServiceDetailSection {
  key: string;
  eyebrow: string;
  heading: string;
  body: string;
  image: string;
  imageAlt: string;
  visible: boolean;
  order: number;
}

export interface ServiceDoc extends Timestamps {
  _id: string;
  name: string;
  slug: string;
  shortDescription: string;
  mainImage: string;
  imageAlt: string;
  icon: string;
  category: string;
  displayOrder: number;
  active: boolean;
  featured: boolean;
  published: boolean;
  ctaLabel: string;
  heroEyebrow: string;
  heroHeading: string;
  heroDescription: string;
  heroBackground: string;
  overview: string;
  features: string[];
  applications: string[];
  materials: string[];
  processSteps: ProcessStep[];
  benefits: string[];
  repairVsReplace: string;
  beforeAfter: BeforeAfterPair[];
  galleryImages: string[];
  relatedServiceSlugs: string[];
  faqs: ServiceFaq[];
  finalCta: string;
  seoTitle: string;
  seoDescription: string;
  ogImage: string;
  detailSections: ServiceDetailSection[];
}

export interface GalleryCategoryDoc extends Timestamps {
  _id: string;
  name: string;
  slug: string;
  order: number;
  active: boolean;
}

export interface GalleryImageDoc extends Timestamps {
  _id: string;
  categoryId: string;
  url: string;
  webpUrl: string;
  alt: string;
  caption: string;
  serviceSlug: string;
  isBeforeAfter: boolean;
  beforeUrl: string;
  afterUrl: string;
  featured: boolean;
  published: boolean;
  order: number;
}

export interface TestimonialDoc extends Timestamps {
  _id: string;
  customerName: string;
  reviewText: string;
  service: string;
  location: string;
  image: string;
  rating: number;
  featured: boolean;
  approved: boolean;
  published: boolean;
  displayOrder: number;
  date: Date;
}

export interface FAQCategoryDoc extends Timestamps {
  _id: string;
  name: string;
  slug: string;
  order: number;
}

export interface FAQDoc extends Timestamps {
  _id: string;
  question: string;
  answer: string;
  category: string;
  serviceSlug: string;
  showOnFaqPage: boolean;
  showOnServicePage: boolean;
  published: boolean;
  order: number;
}

export interface InquiryDoc extends Timestamps {
  _id: string;
  fullName: string;
  email: string;
  phone: string;
  service: string;
  propertyType: string;
  location: string;
  preferredMethod: string;
  preferredDate: string;
  message: string;
  status: InquiryStatus;
}

export interface EstimateRequestDoc extends Timestamps {
  _id: string;
  reference: string;
  service: string;
  propertyType: string;
  location: string;
  address: string;
  city: string;
  requestType: string;
  projectDescription: string;
  details: string;
  preferredDate: string;
  preferredTime: string;
  urgency: string;
  name: string;
  phone: string;
  email: string;
  howHeard: string;
  photos: string[];
  status: EstimateStatus;
}

export interface BlogSeo {
  title: string;
  description: string;
  ogImage: string;
}

export interface BlogPostDoc extends Timestamps {
  _id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  featuredImage: string;
  categories: string[];
  tags: string[];
  relatedServices: string[];
  status: PublishStatus;
  seo: BlogSeo;
}

export interface BlogCategoryDoc extends Timestamps {
  _id: string;
  name: string;
  slug: string;
}

export interface MediaAssetDoc extends Timestamps {
  _id: string;
  url: string;
  webpUrl: string;
  filename: string;
  mime: string;
  size: number;
  width: number;
  height: number;
  alt: string;
  folder: string;
  usedBy: string[];
}

export interface SocialLink {
  platform: string;
  url: string;
  label: string;
}

export interface FooterLink {
  label: string;
  href: string;
}

export interface DefaultSeo {
  title: string;
  description: string;
  ogImage: string;
}

export interface AnalyticsIds {
  googleAnalyticsId: string;
  googleTagManagerId: string;
  facebookPixelId: string;
}

export interface ManufacturersPartners {
  text: string;
  authorizedInstallerConfirmed: boolean;
}

export interface SiteSettingsDoc extends Timestamps {
  _id: string;
  businessName: string;
  logo: string;
  logoDark: string;
  favicon: string;
  primaryPhone: string;
  secondaryPhone: string;
  faxPhone: string;
  email: string;
  address: string;
  hours: string;
  saturdayHours: string;
  mobileServiceNotice: string;
  licenseNumber: string;
  licensedBondedInsured: boolean;
  yearsExperienceText: string;
  ownerName: string;
  companyHistory: string;
  christianOwnedVisible: boolean;
  christianOwnedText: string;
  specialOfferText: string;
  specialOfferEnabled: boolean;
  serviceAreas: string[];
  socialLinks: SocialLink[];
  facebookUrl: string;
  mapEmbed: string;
  footerDescription: string;
  footerLinks: FooterLink[];
  contactRecipient: string;
  defaultSeo: DefaultSeo;
  analyticsIds: AnalyticsIds;
  introEnabled: boolean;
  manufacturersPartners: ManufacturersPartners;
}

export interface ActivityLogDoc {
  _id: string;
  actor: string;
  action: string;
  entity: string;
  entityId: string;
  meta: Record<string, unknown>;
  createdAt: Date;
}

export interface UploadResult {
  url: string;
  webpUrl: string;
  width: number;
  height: number;
  size: number;
  mime: string;
  filename: string;
}
