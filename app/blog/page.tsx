import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { CtaBand } from "@/components/CtaBand";
import { PageHero } from "@/components/PageHero";
import { BUSINESS } from "@/lib/constants";
import { getPublishedBlogPosts } from "@/lib/data";
import { PAGE_IMAGES } from "@/lib/media";

export const metadata: Metadata = {
  title: "Blog",
  description: "Glass care, replacement, and design tips from Express Glass in Riverside, CA.",
};

export default async function BlogPage() {
  const posts = (await getPublishedBlogPosts()).slice(0, 4);
  const imgs = PAGE_IMAGES.blog;

  return (
    <main>
      <PageHero
        image={imgs.hero}
        imageAlt="Express Glass blog"
        eyebrow="Insights"
        title="Blog"
        subtitle="Practical guidance on shower doors, windows, and glass care for Riverside-area homes and businesses."
        ctas={[
          { href: "/contact", label: "Request Estimate" },
          { href: "/services", label: "Browse Services", variant: "secondary" },
        ]}
      />

      <section className="section-pad">
        <div className="container-eg">
          <div className="grid gap-6 md:grid-cols-2">
            {posts.map((post) => (
              <article
                key={post._id || post.slug}
                className="glass-panel flex h-full flex-col overflow-hidden rounded-2xl"
              >
                <div className="relative aspect-[16/10] shrink-0">
                  <Image
                    src={post.featuredImage || imgs.hero}
                    alt={post.title}
                    fill
                    className="object-cover"
                    sizes="(max-width:768px) 100vw, 50vw"
                  />
                </div>
                <div className="flex flex-1 flex-col p-5">
                  {post.categories?.[0] ? (
                    <p className="text-xs tracking-widest text-glass uppercase">
                      {post.categories[0]}
                    </p>
                  ) : null}
                  <h2 className="mt-2 font-display text-xl text-frost">
                    <Link href={`/blog/${post.slug}`} className="hover:text-glass">
                      {post.title}
                    </Link>
                  </h2>
                  <p className="mt-2 flex-1 text-sm leading-relaxed text-steel">{post.excerpt}</p>
                  <Link href={`/blog/${post.slug}`} className="mt-4 inline-block text-sm text-glass">
                    Read more →
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <CtaBand
        title="Need help now?"
        subtitle="Skip the wait—request an estimate or call Express Glass."
        phone={BUSINESS.primaryPhone}
        image={imgs.hero}
      />
    </main>
  );
}
