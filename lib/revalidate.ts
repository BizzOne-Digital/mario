import { revalidatePath } from "next/cache";

export function revalidateHome(): void {
  revalidatePath("/");
}

export function revalidateServices(): void {
  revalidatePath("/services");
}

export function revalidateService(slug: string): void {
  revalidatePath(`/services/${slug}`);
  revalidatePath("/services");
}

export function revalidateGallery(): void {
  revalidatePath("/gallery");
}

export function revalidateTestimonials(): void {
  revalidatePath("/testimonials");
}

export function revalidateFaq(): void {
  revalidatePath("/faq");
}

export function revalidateBlog(): void {
  revalidatePath("/blog");
}

export function revalidateBlogPost(slug: string): void {
  revalidatePath(`/blog/${slug}`);
  revalidatePath("/blog");
}

export function revalidatePage(slug: string): void {
  if (slug === "home") {
    revalidateHome();
    return;
  }
  revalidatePath(`/${slug}`);
}

/** Revalidate layouts/pages that depend on SiteSettings (nav, footer, SEO, phones). */
export function revalidateSettingsAffected(): void {
  revalidatePath("/", "layout");
  revalidateHome();
  revalidatePath("/about");
  revalidatePath("/contact");
  revalidatePath("/service-areas");
  revalidateServices();
  revalidateGallery();
  revalidateTestimonials();
  revalidateFaq();
  revalidateBlog();
}

export function revalidateAllContent(): void {
  revalidateSettingsAffected();
}
