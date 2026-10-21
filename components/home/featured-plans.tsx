import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { ApartmentCard } from "@/components/apartments/apartment-card";
import { DemoNotice } from "@/components/shared/demo-notice";
import { SectionHeading } from "@/components/shared/section-heading";
import { Button } from "@/components/ui/button";
import { listFeaturedApartments } from "@/lib/repository/apartments";

export async function FeaturedPlans() {
  const plans = await listFeaturedApartments(6);

  return (
    <section
      aria-labelledby="featured-title"
      className="section-y border-y border-line bg-paper-2"
    >
      <div className="container-page">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <SectionHeading
            id="featured-title"
            title="Featured floor plans"
            description="A selection of layouts to compare. Open any plan for details, or request a tour to see the residences in person."
          />
          <Button asChild variant="outline" className="self-start lg:self-auto">
            <Link href="/apartments">
              View all apartments
              <ArrowRight aria-hidden="true" />
            </Link>
          </Button>
        </div>

        <DemoNotice className="mt-8 max-w-3xl">
          Floor plans, rents and availability shown here are illustrative demo
          data, not current inventory. Confirm details with the leasing team.
        </DemoNotice>

        <ul className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {plans.map((plan) => (
            <li key={plan.id}>
              <ApartmentCard plan={plan} />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
