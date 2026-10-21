import type { Availability } from "@/types/property";
import { availabilityLabels } from "@/lib/format";
import { cn } from "@/lib/utils";

const styles: Record<Availability, string> = {
  available: "bg-river-soft text-river-deep",
  "coming-soon": "bg-paper-3 text-ink-2",
  "contact-leasing": "border border-line-strong bg-transparent text-ink-2",
};

export function AvailabilityBadge({
  availability,
  className,
}: {
  availability: Availability;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex h-6 items-center gap-1.5 rounded-sm px-2.5 text-xs font-semibold tracking-wide whitespace-nowrap",
        styles[availability],
        className,
      )}
    >
      <span
        aria-hidden="true"
        className={cn(
          "size-1.5 rounded-full",
          availability === "available" ? "bg-river" : "bg-ink-3",
        )}
      />
      {availabilityLabels[availability]}
    </span>
  );
}
