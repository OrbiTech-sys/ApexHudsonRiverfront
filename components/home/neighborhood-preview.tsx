import Link from "next/link";
import { ArrowRight, ArrowUpRight, Bus, TrainFront } from "lucide-react";
import { SafeImage } from "@/components/shared/safe-image";
import { Button } from "@/components/ui/button";
import { formattedAddress, site } from "@/data/site";
import { getNeighborhood } from "@/lib/repository/neighborhood";

const transitIcons = {
  "transit-metro-north": TrainFront,
  "transit-bee-line": Bus,
} as const;

export async function NeighborhoodPreview() {
  const content = await getNeighborhood();

  return (
    <section
      aria-labelledby="neighborhood-title"
      className="section-y border-y border-line bg-paper-2"
    >
      <div className="container-page grid items-center gap-12 lg:grid-cols-12 lg:gap-16">
        <div className="lg:col-span-6 lg:order-2">
          <h2 id="neighborhood-title" className="display-lg text-ink">
            Yonkers, on the Hudson.
          </h2>
          <p className="mt-5 max-w-xl text-lg leading-relaxed text-ink-3">
            {content.intro}
          </p>

          <ul className="mt-9 divide-y divide-line border-y border-line">
            {content.transit.map((option) => {
              const Icon =
                transitIcons[option.id as keyof typeof transitIcons] ?? TrainFront;
              return (
                <li key={option.id} className="flex gap-4 py-5">
                  <Icon
                    className="mt-1 size-6 shrink-0 text-river-deep"
                    strokeWidth={1.5}
                    aria-hidden="true"
                  />
                  <div>
                    <h3 className="font-display text-2xl text-ink">{option.title}</h3>
                    <p className="mt-1 leading-relaxed text-ink-3">
                      {option.description}
                    </p>
                  </div>
                </li>
              );
            })}
          </ul>

          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <Button asChild>
              <Link href="/neighborhood">
                Explore the Neighborhood
                <ArrowRight aria-hidden="true" />
              </Link>
            </Button>
            <Button asChild variant="outline">
              <a
                href={site.googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                Open in Google Maps
                <ArrowUpRight aria-hidden="true" />
                <span className="sr-only">
                  {" "}
                  for {formattedAddress} (opens in a new tab)
                </span>
              </a>
            </Button>
          </div>
        </div>

        <figure className="lg:col-span-6 lg:order-1">
          <div className="relative aspect-[4/5] overflow-hidden bg-paper-3 sm:aspect-[16/11] lg:aspect-[4/5]">
            <SafeImage
              src={content.manhattan.image.src}
              alt={content.manhattan.image.alt}
              fill
              sizes="(min-width: 1024px) 46vw, 100vw"
              className="object-cover"
            />
          </div>
          <figcaption className="mt-4 max-w-md text-sm leading-relaxed text-ink-3">
            <span className="font-semibold text-ink">
              {content.manhattan.title}.
            </span>{" "}
            {content.manhattan.body}
          </figcaption>
        </figure>
      </div>
    </section>
  );
}
