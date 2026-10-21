import type { MetadataRoute } from "next";
import { allowIndexing, siteUrl } from "@/lib/seo";

/**
 * Crawling stays blocked until NEXT_PUBLIC_ALLOW_INDEXING=true, because this
 * concept site must not compete with the property's existing website.
 */
export default function robots(): MetadataRoute.Robots {
  if (!allowIndexing) {
    return { rules: { userAgent: "*", disallow: "/" } };
  }

  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: siteUrl ? `${siteUrl}/sitemap.xml` : undefined,
  };
}
