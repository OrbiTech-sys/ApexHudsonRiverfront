import type { Metadata } from "next";
import { AmenitiesPreview } from "@/components/home/amenities-preview";
import { FeaturedPlans } from "@/components/home/featured-plans";
import { FindYourPlace } from "@/components/home/find-your-place";
import { Hero } from "@/components/home/hero";
import { Lifestyle } from "@/components/home/lifestyle";
import { NeighborhoodPreview } from "@/components/home/neighborhood-preview";
import { TourCta } from "@/components/home/tour-cta";
import { siteUrl } from "@/lib/seo";

export const metadata: Metadata = {
  alternates: siteUrl ? { canonical: "/" } : undefined,
};

export default function HomePage() {
  return (
    <>
      <Hero />
      <FindYourPlace />
      <FeaturedPlans />
      <Lifestyle />
      <AmenitiesPreview />
      <NeighborhoodPreview />
      <TourCta />
    </>
  );
}
