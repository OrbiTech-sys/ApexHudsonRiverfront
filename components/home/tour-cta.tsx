import Link from "next/link";
import { Button } from "@/components/ui/button";
import { tourHref } from "@/data/site";

export function TourCta() {
  return (
    <section
      aria-labelledby="tour-cta-title"
      className="on-dark section-y bg-ink"
    >
      <div className="container-page">
        <div className="max-w-4xl border-l-2 border-river-light pl-6 sm:pl-10">
          <h2 id="tour-cta-title" className="display-lg text-on-ink">
            Come See What Riverfront Living Feels Like.
          </h2>
          <p className="mt-5 max-w-xl text-lg leading-relaxed text-on-ink-muted">
            Walk the community, compare the residences that fit your plans and
            get your questions answered in person.
          </p>
          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <Button asChild size="lg" variant="inverse">
              <Link href={tourHref}>Schedule a Tour</Link>
            </Button>
            <Button asChild size="lg" variant="outline-inverse">
              <Link href="/contact">Contact Leasing</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
