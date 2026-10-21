import Link from "next/link";
import { SafeImage } from "@/components/shared/safe-image";
import { Button } from "@/components/ui/button";
import { image } from "@/data/images";
import { formattedAddress, site, tourHref } from "@/data/site";

const hero = image("heroExterior", 2400);

export function Hero() {
  return (
    <section
      aria-labelledby="hero-title"
      className="on-dark relative isolate flex min-h-svh items-end overflow-hidden bg-ink"
    >
      <SafeImage
        src={hero.src}
        alt={hero.alt}
        fill
        preload
        sizes="100vw"
        className="object-cover object-[35%_center] sm:object-center"
      />
      {/* Legibility overlay: darker at the base where the copy sits. */}
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-gradient-to-t from-ink/90 via-ink/45 to-ink/30"
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 hidden bg-gradient-to-r from-ink/55 via-transparent to-transparent md:block"
      />

      <div className="container-page relative pt-40 pb-12 lg:pb-16">
        <h1
          id="hero-title"
          className="display-xl max-w-4xl text-on-ink"
        >
          Your Next Chapter, By the River.
        </h1>
        <p className="mt-6 max-w-xl text-lg leading-relaxed text-on-ink sm:text-xl">
          Discover contemporary apartment living on the Hudson River in
          Yonkers, with thoughtfully designed spaces and convenient access to
          the city.
        </p>
        <div className="mt-9 flex flex-col gap-3 sm:flex-row">
          <Button asChild size="lg" variant="inverse">
            <Link href="/apartments">Explore Apartments</Link>
          </Button>
          <Button asChild size="lg" variant="outline-inverse">
            <Link href={tourHref}>Schedule a Tour</Link>
          </Button>
        </div>

        <dl className="mt-14 grid gap-5 border-t border-paper/30 pt-6 text-sm sm:grid-cols-3 sm:gap-8">
          <div>
            <dt className="label-caps text-on-ink-muted">Address</dt>
            <dd className="mt-1.5 text-on-ink">{formattedAddress}</dd>
          </div>
          <div>
            <dt className="label-caps text-on-ink-muted">Residences</dt>
            <dd className="mt-1.5 text-on-ink">
              Studio, one-bedroom and two-bedroom homes
            </dd>
          </div>
          <div>
            <dt className="label-caps text-on-ink-muted">Leasing</dt>
            <dd className="mt-1.5 text-on-ink">
              {site.contact.phone && site.contact.phoneHref ? (
                <a
                  href={site.contact.phoneHref}
                  className="-my-3 inline-flex min-h-11 items-center underline decoration-paper/40 underline-offset-4 hover:decoration-paper"
                >
                  {site.contact.phone}
                </a>
              ) : (
                <Link href="/contact" className="underline underline-offset-4">
                  Contact the leasing team
                </Link>
              )}
            </dd>
          </div>
        </dl>
      </div>
    </section>
  );
}
