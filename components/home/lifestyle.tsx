import Link from "next/link";
import { ArrowRight, MapPin, Sun, Waves } from "lucide-react";
import { SafeImage } from "@/components/shared/safe-image";
import { Button } from "@/components/ui/button";
import { image } from "@/data/images";

const waterfront = image("waterfrontPier", 2200);
const interior = image("livingView", 1400);

const moments = [
  {
    icon: Waves,
    title: "On the Hudson",
    body: "The river is the setting. Views are unit-specific, so ask which residences have river views when you tour.",
  },
  {
    icon: Sun,
    title: "Interiors made for daily life",
    body: "Layouts and windows vary by home. See how natural light falls in the residence you prefer.",
  },
  {
    icon: MapPin,
    title: "Yonkers, New York",
    body: "A downtown waterfront address in Westchester County, on Metro-North's Hudson Line to Grand Central Terminal.",
  },
];

export function Lifestyle() {
  return (
    <section
      aria-labelledby="lifestyle-title"
      className="on-dark overflow-hidden bg-ink"
    >
      <div className="grid lg:grid-cols-12">
        <div className="relative min-h-[22rem] lg:col-span-7 lg:min-h-[44rem]">
          <SafeImage
            src={waterfront.src}
            alt={waterfront.alt}
            fill
            sizes="(min-width: 1024px) 58vw, 100vw"
            className="object-cover"
          />
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-gradient-to-t from-ink/55 via-transparent to-transparent"
          />
          <figure className="absolute right-0 bottom-0 hidden w-[44%] max-w-sm border-t-8 border-l-8 border-ink lg:block">
            <div className="relative aspect-[4/3]">
              <SafeImage
                src={interior.src}
                alt={interior.alt}
                fill
                sizes="25vw"
                className="object-cover"
              />
            </div>
          </figure>
        </div>

        <div className="section-y flex items-center px-5 sm:px-8 lg:col-span-5 lg:px-14 xl:px-20">
          <div className="max-w-lg">
            <h2 id="lifestyle-title" className="display-lg text-on-ink">
              Waterfront living, shaped by the river.
            </h2>
            <p className="mt-5 text-lg leading-relaxed text-on-ink-muted">
              Open water, wide skies and a home designed for everyday living,
              in a Hudson River city served by Metro-North rail to Manhattan.
            </p>

            <ul className="mt-10 space-y-7 border-t border-paper/20 pt-8">
              {moments.map(({ icon: Icon, title, body }) => (
                <li key={title} className="flex gap-4">
                  <Icon
                    className="mt-1 size-6 shrink-0 text-river-light"
                    strokeWidth={1.5}
                    aria-hidden="true"
                  />
                  <div>
                    <h3 className="font-display text-2xl text-on-ink">{title}</h3>
                    <p className="mt-1.5 leading-relaxed text-on-ink-muted">
                      {body}
                    </p>
                  </div>
                </li>
              ))}
            </ul>

            <Button asChild variant="outline-inverse" className="mt-10">
              <Link href="/neighborhood">
                Explore the neighborhood
                <ArrowRight aria-hidden="true" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
