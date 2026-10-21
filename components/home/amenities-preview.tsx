import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { AmenityCard } from "@/components/amenities/amenity-card";
import { DemoNotice } from "@/components/shared/demo-notice";
import { SectionHeading } from "@/components/shared/section-heading";
import { Button } from "@/components/ui/button";
import { listHomeAmenities } from "@/lib/repository/amenities";
import { cn } from "@/lib/utils";

/** Column spans for an asymmetric 12-column rhythm on large screens. */
const layout = [
  { span: "lg:col-span-7", aspect: "aspect-[16/10]" },
  { span: "lg:col-span-5", aspect: "aspect-[4/3] lg:aspect-[5/4]" },
  { span: "lg:col-span-5", aspect: "aspect-[4/3] lg:aspect-[5/4]" },
  { span: "lg:col-span-7", aspect: "aspect-[16/10]" },
  { span: "lg:col-span-12", aspect: "aspect-[16/10] lg:aspect-[21/8]" },
];

export async function AmenitiesPreview() {
  const amenities = await listHomeAmenities();

  return (
    <section aria-labelledby="amenities-title" className="section-y">
      <div className="container-page">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <SectionHeading
            id="amenities-title"
            title="Amenities for the way you live."
            description="Shared spaces for training, gathering and unwinding, with services that keep the details simple."
          />
          <Button asChild className="self-start lg:self-auto">
            <Link href="/amenities">
              Explore Amenities
              <ArrowRight aria-hidden="true" />
            </Link>
          </Button>
        </div>

        <ul className="mt-12 grid gap-x-8 gap-y-12 lg:grid-cols-12 lg:gap-y-14">
          {amenities.map((amenity, index) => {
            const slot = layout[index % layout.length];
            return (
              <li key={amenity.id} className={cn(slot.span)}>
                <AmenityCard
                  amenity={amenity}
                  aspect={slot.aspect}
                  sizes={
                    slot.span === "lg:col-span-12"
                      ? "(min-width: 1024px) 90vw, 100vw"
                      : "(min-width: 1024px) 55vw, 100vw"
                  }
                />
              </li>
            );
          })}
        </ul>

        <DemoNotice className="mt-12 max-w-3xl">
          Amenities are compiled from public listings and will be confirmed
          with property management before launch. Photography is stock imagery.
        </DemoNotice>
      </div>
    </section>
  );
}
