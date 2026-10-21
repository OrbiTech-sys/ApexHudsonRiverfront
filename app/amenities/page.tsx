import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { AmenityCard } from "@/components/amenities/amenity-card";
import { TourCta } from "@/components/home/tour-cta";
import { PageIntro } from "@/components/layout/page-intro";
import { DemoNotice } from "@/components/shared/demo-notice";
import { SafeImage } from "@/components/shared/safe-image";
import { Button } from "@/components/ui/button";
import { image } from "@/data/images";
import { pageMetadata } from "@/lib/seo";
import {
  getInteriorsNote,
  listAmenities,
  listAmenityGroups,
} from "@/lib/repository/amenities";
import { cn } from "@/lib/utils";

export const metadata = pageMetadata({
  title: "Amenities",
  description:
    "Explore community amenities at Apex Hudson Riverfront in Yonkers, including a fitness center, pool, roof terrace, clubhouse and resident lounge, and everyday building services.",
  path: "/amenities",
});

const interiors = image("livingView", 1800);

export default async function AmenitiesPage() {
  const [groups, amenities, interiorsNote] = await Promise.all([
    listAmenityGroups(),
    listAmenities(),
    getInteriorsNote(),
  ]);

  return (
    <>
      <PageIntro
        title="Amenities for everyday life."
        description="Spaces to train, gather and unwind, with services that keep the daily details simple."
      >
        <DemoNotice className="mt-8 max-w-3xl">
          Amenities are compiled from public rental listings and will be
          confirmed with property management before launch. Photography is
          stock imagery for illustration and does not show Apex Hudson
          Riverfront.
        </DemoNotice>
      </PageIntro>

      {groups.map((group, index) => {
        const alt = index % 2 === 1;
        const sectionClass = cn(
          "section-y",
          alt && "border-y border-line bg-paper-2",
        );

        if (group.category === "interiors") {
          return (
            <section
              key={group.category}
              aria-labelledby={`${group.category}-title`}
              className={sectionClass}
            >
              <div className="container-page grid items-center gap-10 lg:grid-cols-12 lg:gap-14">
                <div className="lg:col-span-4">
                  <h2 id={`${group.category}-title`} className="display-md text-ink">
                    {group.title}
                  </h2>
                  <p className="mt-4 leading-relaxed text-ink-3">
                    {group.description}
                  </p>
                  <p className="mt-4 leading-relaxed text-ink-3">{interiorsNote}</p>
                  <Button asChild className="mt-7">
                    <Link href="/apartments">
                      Browse Apartments
                      <ArrowRight aria-hidden="true" />
                    </Link>
                  </Button>
                </div>
                <div className="lg:col-span-8">
                  <div className="relative aspect-[16/10] overflow-hidden bg-paper-3">
                    <SafeImage
                      src={interiors.src}
                      alt={interiors.alt}
                      fill
                      sizes="(min-width: 1024px) 60vw, 100vw"
                      className="object-cover"
                    />
                  </div>
                </div>
              </div>
            </section>
          );
        }

        const items = amenities.filter(
          (amenity) => amenity.category === group.category,
        );
        if (items.length === 0) return null;

        return (
          <section
            key={group.category}
            aria-labelledby={`${group.category}-title`}
            className={sectionClass}
          >
            <div className="container-page grid gap-10 lg:grid-cols-12 lg:gap-14">
              <div className="lg:col-span-4">
                <div className="lg:sticky lg:top-[calc(var(--header-h)+2rem)]">
                  <h2 id={`${group.category}-title`} className="display-md text-ink">
                    {group.title}
                  </h2>
                  <p className="mt-4 leading-relaxed text-ink-3">
                    {group.description}
                  </p>
                </div>
              </div>

              <ul
                className={cn(
                  "grid gap-x-8 gap-y-12 lg:col-span-8",
                  items.length > 1 && "sm:grid-cols-2",
                )}
              >
                {items.map((amenity) => (
                  <li
                    key={amenity.id}
                    className={cn(
                      !amenity.image &&
                        "border-t border-line-strong pt-8 sm:col-span-2",
                    )}
                  >
                    <AmenityCard
                      amenity={amenity}
                      aspect={items.length === 1 ? "aspect-[16/10]" : "aspect-[4/3]"}
                      sizes={
                        items.length === 1
                          ? "(min-width: 1024px) 60vw, 100vw"
                          : "(min-width: 1024px) 30vw, (min-width: 640px) 45vw, 100vw"
                      }
                    />
                  </li>
                ))}
              </ul>
            </div>
          </section>
        );
      })}

      <TourCta />
    </>
  );
}
