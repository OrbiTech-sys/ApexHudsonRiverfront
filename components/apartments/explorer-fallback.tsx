import type { ApartmentFloorPlan } from "@/types/property";
import { ApartmentCard } from "@/components/apartments/apartment-card";

/**
 * Prerendered stand-in for the filterable explorer: every floor plan in the
 * default order. It is real content (good for crawlers and no-JS readers),
 * replaced by the interactive explorer as soon as the URL filters are read.
 */
export function ExplorerFallback({ plans }: { plans: ApartmentFloorPlan[] }) {
  return (
    <div className="container-page py-10 lg:py-14">
      <p className="border-b border-line pb-4 text-sm text-ink-2">
        <span className="font-semibold text-ink">{plans.length}</span> floor
        plans
      </p>
      <ul className="mt-8 grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
        {plans.map((plan) => (
          <li key={plan.id}>
            <ApartmentCard plan={plan} />
          </li>
        ))}
      </ul>
    </div>
  );
}
