import type { MetadataRoute } from "next";
import { SERVICE_SLUGS } from "@/lib/constants";
import { getPublishedBlogPosts, getPublishedServices } from "@/lib/data";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

  const staticRoutes = [
    "",
    "/about",
    "/services",
    "/service-areas",
    "/gallery",
    "/testimonials",
    "/faq",
    "/contact",
    "/blog",
    "/privacy-policy",
    "/terms-and-conditions",
    "/accessibility",
  ].map((path) => ({
    url: `${base}${path}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: path === "" ? 1 : 0.7,
  }));

  let serviceSlugs: string[] = [...SERVICE_SLUGS];
  let blogSlugs: string[] = [];

  try {
    const [services, posts] = await Promise.all([
      getPublishedServices(),
      getPublishedBlogPosts(),
    ]);
    if (services.length) serviceSlugs = services.map((s) => s.slug);
    blogSlugs = posts.map((p) => p.slug);
  } catch {
    /* use static service slugs; blogs only when published */
  }

  return [
    ...staticRoutes,
    ...serviceSlugs.map((slug) => ({
      url: `${base}/services/${slug}`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
    ...blogSlugs.map((slug) => ({
      url: `${base}/blog/${slug}`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.5,
    })),
  ];
}
