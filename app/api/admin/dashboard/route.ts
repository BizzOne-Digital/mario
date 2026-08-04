import { connectDb } from "@/lib/db";
import { jsonOk, requireAdminSession } from "@/lib/api";
import {
  BlogPost,
  EstimateRequest,
  FAQ,
  GalleryImage,
  Inquiry,
  MediaAsset,
  Service,
  Testimonial,
} from "@/models";

export async function GET() {
  const auth = await requireAdminSession();
  if ("response" in auth) return auth.response;

  await connectDb();

  const [
    services,
    publishedServices,
    inquiries,
    newInquiries,
    estimates,
    newEstimates,
    testimonials,
    pendingTestimonials,
    faqs,
    galleryImages,
    blogs,
    publishedBlogs,
    media,
  ] = await Promise.all([
    Service.countDocuments(),
    Service.countDocuments({ published: true, active: true }),
    Inquiry.countDocuments(),
    Inquiry.countDocuments({ status: "new" }),
    EstimateRequest.countDocuments(),
    EstimateRequest.countDocuments({ status: "new" }),
    Testimonial.countDocuments(),
    Testimonial.countDocuments({ approved: false }),
    FAQ.countDocuments(),
    GalleryImage.countDocuments(),
    BlogPost.countDocuments(),
    BlogPost.countDocuments({ status: "published" }),
    MediaAsset.countDocuments(),
  ]);

  const recentInquiries = await Inquiry.find()
    .sort({ createdAt: -1 })
    .limit(5)
    .lean();
  const recentEstimates = await EstimateRequest.find()
    .sort({ createdAt: -1 })
    .limit(5)
    .lean();

  return jsonOk({
    counts: {
      services,
      publishedServices,
      inquiries,
      newInquiries,
      estimates,
      newEstimates,
      testimonials,
      pendingTestimonials,
      faqs,
      galleryImages,
      blogs,
      publishedBlogs,
      media,
    },
    recentInquiries,
    recentEstimates,
  });
}
