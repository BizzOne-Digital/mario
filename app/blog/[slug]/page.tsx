import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CtaBand } from "@/components/CtaBand";
import { PageHero } from "@/components/PageHero";
import { BUSINESS } from "@/lib/constants";
import { getBlogBySlug, getPublishedBlogPosts, getPublishedServices } from "@/lib/data";
import { PAGE_IMAGES } from "@/lib/media";
import { getServiceSeed } from "@/lib/site-content";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  const posts = await getPublishedBlogPosts();
  return posts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = await getBlogBySlug(slug);
  if (!post) return { title: "Blog" };
  return {
    title: post.seo?.title || post.title,
    description: post.seo?.description || post.excerpt,
  };
}

export default async function BlogDetailPage({ params }: Props) {
  const { slug } = await params;
  const post = await getBlogBySlug(slug);
  if (!post) notFound();

  const services = await getPublishedServices();
  const related = (post.relatedServices || [])
    .map((s) => services.find((svc) => svc.slug === s) || getServiceSeed(s))
    .filter(Boolean);
  const imgs = PAGE_IMAGES.blog;

  return (
    <main>
      <article>
        <PageHero
          image={post.featuredImage || imgs.hero}
          imageAlt={post.title}
          eyebrow={(post.categories || []).join(" · ") || "Blog"}
          title={post.title}
          subtitle={post.excerpt}
          minHeightClass="min-h-[48vh]"
        />

        <section className="section-pad">
          <div className="container-eg grid gap-10 lg:grid-cols-[1fr_300px]">
            <div
              className="prose prose-invert max-w-3xl space-y-4 text-steel [&_h2]:font-display [&_h2]:text-frost [&_p]:leading-relaxed"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />
            <aside className="space-y-4">
              <div className="relative aspect-[4/3] overflow-hidden rounded-2xl">
                <Image src={imgs.strip[0]} alt="Glass measurement" fill className="object-cover" sizes="300px" />
              </div>
              <div className="relative aspect-[4/3] overflow-hidden rounded-2xl">
                <Image src={imgs.strip[3]} alt="Glass installation context" fill className="object-cover" sizes="300px" />
              </div>
              {related.length ? (
                <div className="glass-panel rounded-2xl p-4">
                  <h2 className="font-display text-lg text-frost">Related services</h2>
                  <ul className="mt-3 space-y-2 text-sm">
                    {related.map((s) =>
                      s ? (
                        <li key={s.slug}>
                          <Link href={`/services/${s.slug}`} className="text-glass hover:text-cyan-light">
                            {s.name}
                          </Link>
                        </li>
                      ) : null,
                    )}
                  </ul>
                </div>
              ) : null}
              <Link href="/contact" className="btn-primary w-full justify-center">
                Request Estimate
              </Link>
              <Link href="/blog" className="btn-secondary w-full justify-center">
                Back to blog
              </Link>
            </aside>
          </div>
        </section>
      </article>

      <CtaBand
        title="Ready to start your glass project?"
        subtitle="Call Express Glass or request a free estimate."
        phone={BUSINESS.primaryPhone}
        image={post.featuredImage || imgs.hero}
      />
    </main>
  );
}
