import type { MetadataRoute } from "next";
import { listApartmentSlugs } from "@/lib/repository/apartments";
import { siteUrl } from "@/lib/seo";

const staticPaths = [
  "/",
  "/apartments",
  "/amenities",
  "/neighborhood",
  "/contact",
  "/privacy",
  "/accessibility",
];

/** Sitemap URLs must be absolute, so it stays empty until a domain is set. */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  if (!siteUrl) return [];

  const slugs = await listApartmentSlugs();
  return [
    ...staticPaths,
    ...slugs.map((slug) => `/apartments/${slug}`),
  ].map((path) => ({ url: `${siteUrl}${path}` }));
}
