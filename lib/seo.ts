import type { Metadata } from "next";
import { ogImage } from "@/data/images";
import { site } from "@/data/site";

/**
 * Set NEXT_PUBLIC_SITE_URL (for example https://example.com) once the
 * production domain is confirmed. Until then canonical URLs are omitted
 * rather than guessed.
 */
export const siteUrl = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ?? null;

/**
 * This build is a redesign concept for a property that already has a
 * website, so it is kept out of search indexes unless explicitly enabled.
 */
export const allowIndexing = process.env.NEXT_PUBLIC_ALLOW_INDEXING === "true";

interface PageMetadataInput {
  title: string;
  description: string;
  path: string;
}

export function pageMetadata({
  title,
  description,
  path,
}: PageMetadataInput): Metadata {
  const image = ogImage();
  return {
    title,
    description,
    alternates: siteUrl ? { canonical: path } : undefined,
    openGraph: {
      title: `${title} | ${site.name}`,
      description,
      siteName: site.name,
      locale: "en_US",
      type: "website",
      url: siteUrl ? `${siteUrl}${path}` : undefined,
      images: [image],
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} | ${site.name}`,
      description,
      images: [image.url],
    },
  };
}
