import { Types } from "mongoose";
import { connectDb } from "@/lib/db";
import {
  jsonError,
  jsonOk,
  parseJsonBody,
  requireAdminSession,
} from "@/lib/api";
import { revalidatePage } from "@/lib/revalidate";
import { pageUpdateSchema } from "@/lib/validations";
import { Page, PageSection } from "@/models";

type RouteContext = { params: Promise<{ slug: string }> };

export async function GET(_request: Request, context: RouteContext) {
  const auth = await requireAdminSession();
  if ("response" in auth) return auth.response;

  const { slug } = await context.params;
  await connectDb();

  const page = await Page.findOne({ slug }).populate("sections").lean();
  if (!page) return jsonError("Page not found", 404);

  return jsonOk({ page });
}

export async function PUT(request: Request, context: RouteContext) {
  const auth = await requireAdminSession();
  if ("response" in auth) return auth.response;

  const { slug } = await context.params;
  const parsed = await parseJsonBody(request, pageUpdateSchema);
  if ("response" in parsed) return parsed.response;

  await connectDb();

  const existing = await Page.findOne({ slug });
  if (!existing) return jsonError("Page not found", 404);

  const { sections, ...pageFields } = parsed.data;

  if (Object.keys(pageFields).length > 0) {
    Object.assign(existing, pageFields);
    await existing.save();
  }

  if (sections) {
    const sectionIds: Types.ObjectId[] = [];
    for (const section of sections) {
      const updated = await PageSection.findOneAndUpdate(
        { pageSlug: slug, key: section.key },
        {
          $set: {
            pageSlug: slug,
            key: section.key,
            eyebrow: section.eyebrow ?? "",
            heading: section.heading ?? "",
            subheading: section.subheading ?? "",
            paragraphs: section.paragraphs ?? [],
            bullets: section.bullets ?? [],
            ctaText: section.ctaText ?? "",
            ctaUrl: section.ctaUrl ?? "",
            image: section.image ?? "",
            backgroundImage: section.backgroundImage ?? "",
            imageAlt: section.imageAlt ?? "",
            layout: section.layout ?? "default",
            visible: section.visible ?? true,
            order: section.order ?? 0,
          },
        },
        { new: true, upsert: true, setDefaultsOnInsert: true },
      );
      sectionIds.push(updated._id as Types.ObjectId);
    }
    existing.sections = sectionIds;
    await existing.save();
  }

  const page = await Page.findOne({ slug }).populate("sections").lean();
  revalidatePage(slug);
  return jsonOk({ page });
}
