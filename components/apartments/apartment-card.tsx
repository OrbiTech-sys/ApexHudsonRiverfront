import Link from "next/link";
import type { ApartmentFloorPlan } from "@/types/property";
import { AvailabilityBadge } from "@/components/apartments/availability-badge";
import { RentLabel } from "@/components/apartments/rent-label";
import { SafeImage } from "@/components/shared/safe-image";
import { Button } from "@/components/ui/button";
import { tourHref } from "@/data/site";
import { formatNumber } from "@/lib/format";

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="px-3 py-3 first:pl-0 last:pr-0">
      <dt className="text-[0.6875rem] font-semibold tracking-[0.12em] text-ink-3 uppercase">
        {label}
      </dt>
      <dd className="mt-1 font-display text-xl leading-tight text-ink">{value}</dd>
    </div>
  );
}

export function ApartmentCard({
  plan,
  priority = false,
}: {
  plan: ApartmentFloorPlan;
  priority?: boolean;
}) {
  const detailHref = `/apartments/${plan.slug}`;
  const titleId = `plan-${plan.slug}-title`;

  return (
    <article
      aria-labelledby={titleId}
      className="group flex h-full flex-col border border-line bg-paper transition-shadow duration-300 hover:shadow-lift"
    >
      <div className="relative">
        <Link
          href={detailHref}
          tabIndex={-1}
          aria-hidden="true"
          className="relative block aspect-[4/3] overflow-hidden bg-paper-3"
        >
          <SafeImage
            src={plan.image.src}
            alt=""
            fill
            sizes="(min-width: 1280px) 28vw, (min-width: 768px) 45vw, 100vw"
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
            loading={priority ? "eager" : "lazy"}
          />
        </Link>
        <AvailabilityBadge
          availability={plan.availability}
          className="absolute top-4 left-4 border border-line bg-paper shadow-sm"
        />
      </div>

      <div className="flex flex-1 flex-col p-5 sm:p-6">
        <h3 id={titleId} className="font-display text-[1.75rem] leading-tight text-ink">
          <Link href={detailHref} className="hover:text-river-deep">
            {plan.name}
          </Link>
        </h3>

        <dl className="mt-5 grid grid-cols-3 divide-x divide-line border-y border-line">
          <Stat label="Beds" value={plan.bedrooms === 0 ? "Studio" : String(plan.bedrooms)} />
          <Stat label="Baths" value={String(plan.bathrooms)} />
          <Stat label="Sq ft" value={formatNumber(plan.squareFeet)} />
        </dl>

        <RentLabel plan={plan} className="mt-5" />

        <div className="mt-6 flex flex-1 flex-col justify-end gap-1">
          <Button asChild size="sm" className="w-full">
            <Link href={detailHref}>
              View Details
              <span className="sr-only"> for {plan.name}</span>
            </Link>
          </Button>
          <Button asChild variant="link" size="sm" className="mt-1 self-center">
            <Link href={tourHref}>
              Schedule a Tour
              <span className="sr-only"> for {plan.name}</span>
            </Link>
          </Button>
        </div>
      </div>
    </article>
  );
}
