import type { ApartmentFloorPlan } from "@/types/property";
import { formatRent } from "@/lib/format";
import { cn } from "@/lib/utils";

/**
 * Starting rent, with an explicit marker when the figure is illustrative
 * demo data. Never shows a number that has no status.
 */
export function RentLabel({
  plan,
  size = "md",
  className,
}: {
  plan: Pick<ApartmentFloorPlan, "startingRent" | "rentStatus">;
  size?: "md" | "lg";
  className?: string;
}) {
  if (plan.startingRent === null) {
    return (
      <p className={cn("text-sm font-medium text-ink-2", className)}>
        Contact leasing for pricing
      </p>
    );
  }

  return (
    <p className={cn("flex flex-wrap items-baseline gap-x-2 gap-y-1", className)}>
      <span className="text-xs font-semibold tracking-[0.12em] text-ink-3 uppercase">
        From
      </span>
      <span
        className={cn(
          "font-display leading-none font-medium text-ink",
          size === "lg" ? "text-5xl" : "text-3xl",
        )}
      >
        {formatRent(plan.startingRent)}
      </span>
      <span className="text-sm text-ink-3">/ month</span>
      {plan.rentStatus === "illustrative" ? (
        <span
          title="Illustrative demo figure, not a real price"
          className="rounded-sm bg-paper-3 px-1.5 py-0.5 text-[0.6875rem] font-semibold tracking-wide text-ink-2 uppercase"
        >
          Demo
        </span>
      ) : null}
    </p>
  );
}
