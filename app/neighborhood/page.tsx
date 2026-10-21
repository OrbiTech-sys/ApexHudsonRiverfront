import Link from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
  Bus,
  Landmark,
  MapPin,
  TrainFront,
  Utensils,
} from "lucide-react";
import { TourCta } from "@/components/home/tour-cta";
import { PageIntro } from "@/components/layout/page-intro";
import { DemoNotice } from "@/components/shared/demo-notice";
import { SafeImage } from "@/components/shared/safe-image";
import { Button } from "@/components/ui/button";
import { formattedAddress, site } from "@/data/site";
import { getNeighborhood } from "@/lib/repository/neighborhood";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Neighborhood: Yonkers on the Hudson",
  description:
    "Explore the Yonkers waterfront, Metro-North Hudson Line service to Grand Central Terminal, and nearby attractions around Apex Hudson Riverfront at 20 Water Grant Street.",
  path: "/neighborhood",
});

const transitIcons = {
  "transit-metro-north": TrainFront,
  "transit-bee-line": Bus,
} as const;

const placeIcons = {
  attraction: Landmark,
  dining: Utensils,
  everyday: MapPin,
} as const;

export default async function NeighborhoodPage() {
  const content = await getNeighborhood();

  return (
    <>
      <PageIntro title={content.headline} description={content.intro} />

      <section
        aria-labelledby="waterfront-title"
        className="section-y"
      >
        <div className="container-page grid items-center gap-10 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-7">
            <div className="relative aspect-[3/2] overflow-hidden bg-paper-3">
              <SafeImage
                src={content.waterfront.image.src}
                alt={content.waterfront.image.alt}
                fill
                sizes="(min-width: 1024px) 58vw, 100vw"
                className="object-cover"
              />
            </div>
          </div>
          <div className="lg:col-span-5">
            <h2 id="waterfront-title" className="display-md text-ink">
              {content.waterfront.title}
            </h2>
            <p className="mt-5 leading-relaxed text-ink-3">
              {content.waterfront.body}
            </p>
            <Button asChild variant="outline" className="mt-7">
              <a
                href={site.googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                View on Google Maps
                <ArrowUpRight aria-hidden="true" />
                <span className="sr-only">
                  {" "}
                  for {formattedAddress} (opens in a new tab)
                </span>
              </a>
            </Button>
          </div>
        </div>
      </section>

      <section
        aria-labelledby="transit-title"
        className="section-y border-y border-line bg-paper-2"
      >
        <div className="container-page grid gap-10 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-4">
            <h2 id="transit-title" className="display-md text-ink">
              Getting around
            </h2>
            <p className="mt-4 leading-relaxed text-ink-3">
              Public transportation connections serving Yonkers. Confirm
              current schedules and fares with the operators.
            </p>
          </div>
          <ul className="grid gap-px border border-line bg-line sm:grid-cols-2 lg:col-span-8">
            {content.transit.map((option) => {
              const Icon =
                transitIcons[option.id as keyof typeof transitIcons] ?? TrainFront;
              return (
                <li key={option.id} className="bg-paper p-6 sm:p-8">
                  <Icon
                    className="size-7 text-river-deep"
                    strokeWidth={1.5}
                    aria-hidden="true"
                  />
                  <h3 className="mt-5 font-display text-2xl text-ink">
                    {option.title}
                  </h3>
                  <p className="mt-2 leading-relaxed text-ink-3">
                    {option.description}
                  </p>
                  {option.href ? (
                    <a
                      href={option.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-4 inline-flex min-h-11 items-center gap-1.5 text-sm font-semibold text-river-deep underline underline-offset-4"
                    >
                      {option.source}
                      <ArrowUpRight className="size-3.5" aria-hidden="true" />
                      <span className="sr-only"> (opens in a new tab)</span>
                    </a>
                  ) : null}
                </li>
              );
            })}
          </ul>
        </div>
      </section>

      <section aria-labelledby="manhattan-title" className="section-y">
        <div className="container-page grid items-center gap-10 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-5">
            <h2 id="manhattan-title" className="display-md text-ink">
              {content.manhattan.title}
            </h2>
            <p className="mt-5 leading-relaxed text-ink-3">
              {content.manhattan.body}
            </p>
          </div>
          <div className="lg:col-span-7">
            <div className="relative aspect-[3/2] overflow-hidden bg-paper-3">
              <SafeImage
                src={content.manhattan.image.src}
                alt={content.manhattan.image.alt}
                fill
                sizes="(min-width: 1024px) 58vw, 100vw"
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      <section
        aria-labelledby="places-title"
        className="section-y border-t border-line bg-paper-2"
      >
        <div className="container-page grid gap-10 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-4">
            <h2 id="places-title" className="display-md text-ink">
              Around downtown Yonkers
            </h2>
            <p className="mt-4 leading-relaxed text-ink-3">
              Local attractions and everyday places. Distances and walking times
              are intentionally left out until they are verified.
            </p>
          </div>
          <ul className="divide-y divide-line border-y border-line lg:col-span-8">
            {content.places.map((place) => {
              const Icon = placeIcons[place.kind];
              return (
                <li key={place.id} className="flex gap-5 py-6">
                  <Icon
                    className="mt-1 size-6 shrink-0 text-river-deep"
                    strokeWidth={1.5}
                    aria-hidden="true"
                  />
                  <div className="min-w-0">
                    <h3 className="font-display text-2xl text-ink">
                      {place.title}
                    </h3>
                    <p className="mt-1.5 max-w-prose leading-relaxed text-ink-3">
                      {place.description}
                    </p>
                    {place.href ? (
                      <a
                        href={place.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-2 inline-flex min-h-11 items-center gap-1.5 text-sm font-semibold text-river-deep underline underline-offset-4"
                      >
                        Visit website
                        <ArrowUpRight className="size-3.5" aria-hidden="true" />
                        <span className="sr-only">
                          {" "}
                          for {place.title} (opens in a new tab)
                        </span>
                      </a>
                    ) : null}
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      </section>

      <section aria-labelledby="map-title" className="section-y">
        <div className="container-page grid gap-10 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-6">
            <h2 id="map-title" className="display-md text-ink">
              Find us
            </h2>
            <address className="mt-5 space-y-1 text-lg text-ink-2 not-italic">
              <p>{site.address.street}</p>
              <p>
                {site.address.city}, {site.address.region}{" "}
                {site.address.postalCode}
              </p>
            </address>
            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <Button asChild>
                <a
                  href={site.googleMapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Open in Google Maps
                  <ArrowUpRight aria-hidden="true" />
                  <span className="sr-only"> (opens in a new tab)</span>
                </a>
              </Button>
              <Button asChild variant="outline">
                <Link href="/apartments">
                  Browse Apartments
                  <ArrowRight aria-hidden="true" />
                </Link>
              </Button>
            </div>
          </div>
          <div className="lg:col-span-6">
            <DemoNotice>
              {content.notes.join(" ")}
            </DemoNotice>
          </div>
        </div>
      </section>

      <TourCta />
    </>
  );
}
