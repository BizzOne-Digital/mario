import { connectDb } from "@/lib/db";
import {
  DEFAULT_SETTINGS,
  DEFAULT_FAQS,
  GALLERY_CATEGORIES_STATIC,
  GALLERY_IMAGES_STATIC,
  SAMPLE_TESTIMONIALS,
  SERVICES,
  STATIC_BLOG_POSTS,
  getServiceSeed,
  serviceToCard,
} from "@/lib/site-content";
import { SERVICE_IMAGES, LOCAL_SERVICE_IMAGES } from "@/lib/media";
import type {
  BlogPostDoc,
  FAQDoc,
  GalleryCategoryDoc,
  GalleryImageDoc,
  PageDoc,
  ServiceDoc,
  SiteSettingsDoc,
  TestimonialDoc,
} from "@/lib/types";
import {
  BlogPost,
  FAQ,
  GalleryCategory,
  GalleryImage,
  Page,
  Service,
  SiteSettings,
  Testimonial,
} from "@/models";
import { BUSINESS, type ServiceSlug } from "@/lib/constants";

function leanDoc<T>(doc: unknown): T {
  return JSON.parse(JSON.stringify(doc)) as T;
}

async function withDbFallback<T>(fn: () => Promise<T>, fallback: T): Promise<T> {
  try {
    await connectDb();
    return await fn();
  } catch {
    return fallback;
  }
}

export async function getSettings(): Promise<
  Omit<SiteSettingsDoc, "_id" | "createdAt" | "updatedAt"> & { _id?: string }
> {
  return withDbFallback(async () => {
    const settings = await SiteSettings.findOne().lean();
    if (!settings) return { ...DEFAULT_SETTINGS };
    return normalizePublicSettings(leanDoc(settings));
  }, { ...DEFAULT_SETTINGS });
}

/** Strip retired numbers / offers so production DB cannot resurrect them. */
function normalizePublicSettings(
  settings: Omit<SiteSettingsDoc, "_id" | "createdAt" | "updatedAt"> & { _id?: string },
) {
  const retired = "4070868";
  const clean = (value?: string) => {
    const v = (value || "").trim();
    if (!v) return "";
    if (v.replace(/\D/g, "").includes(retired)) return "";
    return v;
  };

  let primaryPhone = clean(settings.primaryPhone) || BUSINESS.primaryPhone;
  if (primaryPhone.replace(/\D/g, "").includes(retired)) {
    primaryPhone = BUSINESS.primaryPhone;
  }

  return {
    ...DEFAULT_SETTINGS,
    ...settings,
    primaryPhone,
    // Single public number only — never resurface a retired secondary line.
    secondaryPhone: "",
    faxPhone: clean(settings.faxPhone) || BUSINESS.faxPhone,
    address: "",
    specialOfferEnabled: false,
    specialOfferText: "",
  };
}

function staticServicesAsDocs(): ServiceDoc[] {
  return SERVICES.map((s, index) => {
    const gallery = SERVICE_IMAGES[s.slug as ServiceSlug]?.gallery ?? [
      s.images.hero,
      s.images.overview,
      s.images.detail,
      s.images.process,
      s.images.completed,
    ];
    return {
      _id: `static-${s.slug}`,
      name: s.name,
      slug: s.slug,
      shortDescription: s.summary,
      mainImage: s.images.hero,
      imageAlt: `${s.name} — Express Glass`,
      icon: "",
      category: s.category,
      displayOrder: index + 1,
      active: true,
      featured: index < 6,
      published: true,
      ctaLabel: "Request Free Estimate",
      heroEyebrow: "Express Glass Service",
      heroHeading: s.name,
      heroDescription: s.summary,
      heroBackground: s.images.hero,
      overview: s.intro,
      features: s.bullets,
      applications: s.applications,
      materials: s.materials,
      processSteps: s.processSteps,
      benefits: s.benefits,
      repairVsReplace: s.repairVsReplace,
      beforeAfter: [
        {
          before: s.images.detail,
          after: s.images.completed,
          caption: `${s.name} project example`,
        },
      ],
      galleryImages: [...gallery],
      relatedServiceSlugs: s.relatedServiceSlugs,
      faqs: s.faqs,
      finalCta: `Ready for a ${s.name.toLowerCase()} estimate? Call Express Glass or request a free estimate online.`,
      seoTitle: `${s.name} | Express Glass Riverside CA`,
      seoDescription: s.summary,
      ogImage: s.images.hero,
      detailSections: [],
      createdAt: new Date(0),
      updatedAt: new Date(0),
    };
  });
}

function mergeServiceWithSeed(doc: ServiceDoc, slug: string): ServiceDoc {
  const seed = getServiceSeed(slug);
  if (!seed) return doc;

  const gallerySet = SERVICE_IMAGES[slug as ServiceSlug];
  const localHero = LOCAL_SERVICE_IMAGES[slug as ServiceSlug];

  // Prefer local uploaded service photos for cards and heroes
  if (localHero) {
    doc.mainImage = localHero;
    if (!doc.heroBackground || doc.heroBackground.includes("unsplash.com")) {
      doc.heroBackground = localHero;
    }
  } else {
    if (!doc.mainImage) doc.mainImage = seed.images.hero;
    if (!doc.heroBackground) doc.heroBackground = seed.images.hero;
  }
  if (!doc.overview) doc.overview = seed.intro;
  if (!doc.features?.length) doc.features = seed.bullets;
  if (!doc.applications?.length) doc.applications = seed.applications;
  if (!doc.materials?.length) doc.materials = seed.materials;
  if (!doc.processSteps?.length) doc.processSteps = seed.processSteps;
  if (!doc.benefits?.length) doc.benefits = seed.benefits;
  if (!doc.repairVsReplace) doc.repairVsReplace = seed.repairVsReplace;
  if (!doc.faqs?.length) doc.faqs = seed.faqs;
  if (!doc.relatedServiceSlugs?.length) doc.relatedServiceSlugs = seed.relatedServiceSlugs;
  if (!doc.galleryImages?.length) {
    doc.galleryImages = gallerySet
      ? [...gallerySet.gallery]
      : [
          seed.images.hero,
          seed.images.overview,
          seed.images.detail,
          seed.images.process,
          seed.images.completed,
        ];
  }
  if (!doc.beforeAfter?.length && gallerySet) {
    doc.beforeAfter = [
      {
        before: seed.images.detail,
        after: seed.images.completed,
        caption: `${seed.name} project example`,
      },
    ];
  }
  return doc;
}

export async function getPublishedServices(): Promise<ServiceDoc[]> {
  return withDbFallback(async () => {
    const services = await Service.find({ published: true, active: true })
      .sort({ displayOrder: 1, name: 1 })
      .lean();
    if (!services.length) return staticServicesAsDocs();
    return leanDoc<ServiceDoc[]>(services).map((doc) => mergeServiceWithSeed(doc, doc.slug));
  }, staticServicesAsDocs());
}

export async function getServiceBySlug(slug: string): Promise<ServiceDoc | null> {
  const staticMatch = staticServicesAsDocs().find((s) => s.slug === slug) ?? null;

  return withDbFallback(async () => {
    const service = await Service.findOne({
      slug,
      published: true,
      active: true,
    }).lean();
    if (!service) {
      const seed = getServiceSeed(slug);
      if (!seed) return null;
      return staticMatch;
    }
    return mergeServiceWithSeed(leanDoc<ServiceDoc>(service), slug);
  }, staticMatch);
}

export async function getPageBySlug(slug: string): Promise<PageDoc | null> {
  return withDbFallback(async () => {
    const page = await Page.findOne({ slug, status: "published" })
      .populate("sections")
      .lean();
    if (!page) return null;
    return leanDoc(page);
  }, null);
}

export async function getPublishedFaqs(): Promise<
  Array<Pick<FAQDoc, "question" | "answer" | "category" | "order"> & { _id: string }>
> {
  const fallback = DEFAULT_FAQS.map((faq, index) => ({
    _id: `static-faq-${index}`,
    question: faq.question,
    answer: faq.answer,
    category: faq.category,
    order: index,
  }));

  return withDbFallback(async () => {
    const faqs = await FAQ.find({ published: true, showOnFaqPage: true })
      .sort({ order: 1, question: 1 })
      .lean();
    if (!faqs.length) return fallback;
    return leanDoc(faqs);
  }, fallback);
}

function sampleTestimonialsAsDocs(): TestimonialDoc[] {
  const now = new Date();
  return SAMPLE_TESTIMONIALS.map((t, index) => ({
    _id: `sample-testimonial-${index + 1}`,
    customerName: t.customerName,
    reviewText: t.reviewText,
    service: t.service,
    location: t.location,
    image: "",
    rating: t.rating,
    featured: t.featured,
    approved: true,
    published: true,
    displayOrder: t.displayOrder,
    date: now,
    createdAt: now,
    updatedAt: now,
  }));
}

export async function getApprovedTestimonials(): Promise<TestimonialDoc[]> {
  const fallback = sampleTestimonialsAsDocs();
  return withDbFallback(async () => {
    const testimonials = await Testimonial.find({
      approved: true,
      published: true,
    })
      .sort({ displayOrder: 1, createdAt: -1 })
      .lean();
    if (!testimonials.length) return fallback;
    return leanDoc(testimonials);
  }, fallback);
}

export async function getGalleryCategories(): Promise<
  Array<Pick<GalleryCategoryDoc, "name" | "slug" | "order" | "active"> & { _id: string }>
> {
  const fallback = GALLERY_CATEGORIES_STATIC.map((cat, index) => ({
    _id: `static-cat-${cat.slug}`,
    name: cat.name,
    slug: cat.slug,
    order: index,
    active: true,
  }));

  return withDbFallback(async () => {
    const categories = await GalleryCategory.find({ active: true })
      .sort({ order: 1, name: 1 })
      .lean();
    if (!categories.length) return fallback;
    return leanDoc(categories);
  }, fallback);
}

export type GalleryImageView = {
  _id: string;
  url: string;
  webpUrl: string;
  alt: string;
  caption: string;
  serviceSlug: string;
  isBeforeAfter: boolean;
  beforeUrl: string;
  afterUrl: string;
  featured: boolean;
  categoryId: string;
  categorySlug?: string;
  order: number;
};

export async function getGalleryImages(): Promise<GalleryImageView[]> {
  const categories = await getGalleryCategories();
  const slugToId = new Map(categories.map((c) => [c.slug, c._id]));

  const fallback: GalleryImageView[] = GALLERY_IMAGES_STATIC.map((img, index) => ({
    _id: `static-img-${index}`,
    url: img.url,
    webpUrl: "",
    alt: img.alt,
    caption: img.caption,
    serviceSlug: img.serviceSlug,
    isBeforeAfter: "isBeforeAfter" in img ? Boolean(img.isBeforeAfter) : false,
    beforeUrl: "beforeUrl" in img && img.beforeUrl ? String(img.beforeUrl) : "",
    afterUrl: "afterUrl" in img && img.afterUrl ? String(img.afterUrl) : "",
    featured: index < 6,
    categoryId: slugToId.get(img.categorySlug) ?? img.categorySlug,
    categorySlug: img.categorySlug,
    order: index,
  }));

  return withDbFallback(async () => {
    const images = await GalleryImage.find({ published: true })
      .sort({ order: 1, createdAt: -1 })
      .lean();
    if (!images.length) return fallback;
    const docs = leanDoc<GalleryImageDoc[]>(images);
    const idToSlug = new Map(categories.map((c) => [c._id, c.slug]));
    return docs.map((img) => ({
      _id: img._id,
      url: img.url,
      webpUrl: img.webpUrl,
      alt: img.alt,
      caption: img.caption,
      serviceSlug: img.serviceSlug,
      isBeforeAfter: img.isBeforeAfter,
      beforeUrl: img.beforeUrl,
      afterUrl: img.afterUrl,
      featured: img.featured,
      categoryId: img.categoryId,
      categorySlug: idToSlug.get(img.categoryId),
      order: img.order,
    }));
  }, fallback);
}

function staticPublishedBlogs() {
  return STATIC_BLOG_POSTS.map((post, index) => ({
    _id: `static-blog-${index + 1}`,
    title: post.title,
    slug: post.slug,
    excerpt: post.excerpt,
    content: post.content,
    featuredImage: post.featuredImage,
    categories: [...post.categories],
    tags: [...post.tags],
    relatedServices: [...post.relatedServices],
    seo: {
      title: post.title,
      description: post.excerpt,
      ogImage: post.featuredImage,
    },
    createdAt: new Date(0),
  }));
}

export async function getPublishedBlogPosts(): Promise<
  Array<
    Pick<
      BlogPostDoc,
      | "title"
      | "slug"
      | "excerpt"
      | "featuredImage"
      | "categories"
      | "tags"
      | "relatedServices"
      | "seo"
      | "content"
    > & { _id: string; createdAt?: Date }
  >
> {
  const fallback = staticPublishedBlogs();
  return withDbFallback(async () => {
    const posts = await BlogPost.find({ status: "published" })
      .sort({ createdAt: -1 })
      .lean();
    if (!posts.length) return fallback;
    return leanDoc(posts);
  }, fallback);
}

export async function getBlogBySlug(slug: string) {
  const posts = await getPublishedBlogPosts();
  return posts.find((p) => p.slug === slug) ?? null;
}

export { serviceToCard };
