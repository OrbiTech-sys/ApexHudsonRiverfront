import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { ApartmentCard } from "@/components/apartments/apartment-card";
import { AvailabilityBadge } from "@/components/apartments/availability-badge";
import { FloorPlanSketch } from "@/components/apartments/floor-plan-sketch";
import { Gallery } from "@/components/apartments/gallery";
import { RentLabel } from "@/components/apartments/rent-label";
import { TourRequestForm } from "@/components/forms/tour-request-form";
import { DemoNotice } from "@/components/shared/demo-notice";
import { Button } from "@/components/ui/button";
import {
  formatBathrooms,
  formatBedrooms,
  formatNumber,
} from "@/lib/format";
import { pageMetadata } from "@/lib/seo";
import {
  getApartmentBySlug,
  listApartmentSlugs,
  listRelatedApartments,
} from "@/lib/repository/apartments";

export async function generateStaticParams() {
  const slugs = await listApartmentSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/apartments/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const plan = await getApartmentBySlug(slug);

  if (!plan) {
    return { title: "Apartment not found" };
  }

  return pageMetadata({
    title: `${plan.name}: ${formatBedrooms(plan.bedrooms)}, ${formatBathrooms(plan.bathrooms)} in Yonkers, NY`,
    description: `${plan.name} at Apex Hudson Riverfront: ${formatBedrooms(plan.bedrooms).toLowerCase()}, ${formatBathrooms(plan.bathrooms).toLowerCase()}, about ${formatNumber(plan.squareFeet)} square feet (demo floor plan data). Request a tour.`,
    path: `/apartments/${plan.slug}`,
  });
}

function Spec({ label, value }: { label: string; value: string }) {
  return (
    <div className="px-4 py-4 first:pl-0 last:pr-0">
      <dt className="label-caps text-[0.6875rem] text-ink-3">{label}</dt>
      <dd className="mt-1.5 font-display text-2xl leading-tight text-ink">
        {value}
      </dd>
    </div>
  );
}

export default async function ApartmentDetailPage({
  params,
}: PageProps<"/apartments/[slug]">) {
  const { slug } = await params;
  const plan = await getApartmentBySlug(slug);

  if (!plan) {
    notFound();
  }

  const related = await listRelatedApartments(plan, 3);

  return (
    <>
      <section className="pt-[calc(var(--header-h)+1.5rem)] pb-14 lg:pb-20">
        <div className="container-page">
          <Link
            href="/apartments"
            className="inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-ink-2 hover:text-river-deep"
          >
            <ArrowLeft className="size-4" aria-hidden="true" />
            Back to Apartments
          </Link>

          <div className="mt-4 grid gap-10 lg:grid-cols-12 lg:gap-14">
            <div className="min-w-0 lg:col-span-7">
              <Gallery images={plan.gallery} planName={plan.name} />
            </div>

            <div className="lg:col-span-5">
              <div className="lg:sticky lg:top-[calc(var(--header-h)+1.5rem)]">
                <AvailabilityBadge availability={plan.availability} />
                <h1 className="display-md mt-4 text-ink">{plan.name}</h1>
                <p className="mt-3 leading-relaxed text-ink-3">{plan.summary}</p>

                <dl className="mt-7 grid grid-cols-3 divide-x divide-line border-y border-line">
                  <Spec
                    label="Beds"
                    value={plan.bedrooms === 0 ? "Studio" : String(plan.bedrooms)}
                  />
                  <Spec label="Baths" value={String(plan.bathrooms)} />
                  <Spec label="Sq ft" value={formatNumber(plan.squareFeet)} />
                </dl>

                <RentLabel plan={plan} size="lg" className="mt-7" />

                <DemoNotice className="mt-5">
                  Pricing and availability shown are illustrative demo values
                  and do not reflect real-time inventory. Confirm current
                  details with the leasing team.
                </DemoNotice>

                <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                  <Button asChild size="lg">
                    <a href="#tour">Schedule a Tour</a>
                  </Button>
                  <Button asChild size="lg" variant="outline">
                    <Link href="/contact">Contact Leasing</Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section
        aria-labelledby="plan-details-title"
        className="section-y border-y border-line bg-paper-2"
      >
        <div className="container-page grid gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-6">
            <h2 id="plan-details-title" className="display-md text-ink">
              Floor plan
            </h2>
            <div className="mt-6">
              <FloorPlanSketch
                bedroomType={plan.bedroomType}
                planName={plan.name}
              />
            </div>
          </div>

          <div className="lg:col-span-5 lg:col-start-8">
            <h2 className="display-md text-ink">In-unit features</h2>
            {plan.features.items.length > 0 ? (
              <>
                <ul className="mt-6 divide-y divide-line border-y border-line">
                  {plan.features.items.map((item) => (
                    <li key={item} className="py-3 text-ink-2">
                      {item}
                    </li>
                  ))}
                </ul>
                {!plan.features.verified ? (
                  <DemoNotice className="mt-5">{plan.features.note}</DemoNotice>
                ) : null}
              </>
            ) : (
              <p className="mt-6 leading-relaxed text-ink-3">
                {plan.features.note ??
                  "In-unit features are confirmed by the leasing team."}{" "}
                No feature list is published here until it has been verified.
              </p>
            )}
          </div>
        </div>
      </section>

      <section id="tour" aria-labelledby="tour-title" className="section-y">
        <div className="container-page grid gap-10 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-4">
            <h2 id="tour-title" className="display-md text-ink">
              Tour {plan.name}
            </h2>
            <p className="mt-4 leading-relaxed text-ink-3">
              Tell us when you would like to visit and which layouts interest
              you. This is a demonstration form, so nothing is sent to the
              leasing team.
            </p>
          </div>
          <div className="lg:col-span-7 lg:col-start-6">
            <TourRequestForm
              defaultApartmentType={plan.bedroomType}
              planName={plan.name}
            />
          </div>
        </div>
      </section>

      {related.length > 0 ? (
        <section
          aria-labelledby="related-title"
          className="section-y border-t border-line bg-paper-2"
        >
          <div className="container-page">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <h2 id="related-title" className="display-md text-ink">
                Related floor plans
              </h2>
              <Button asChild variant="outline" className="self-start">
                <Link href="/apartments">
                  <ArrowLeft aria-hidden="true" />
                  Back to Apartments
                </Link>
              </Button>
            </div>
            <ul className="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {related.map((item) => (
                <li key={item.id}>
                  <ApartmentCard plan={item} />
                </li>
              ))}
            </ul>
          </div>
        </section>
      ) : null}
    </>
  );
}
