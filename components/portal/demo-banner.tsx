import { FlaskConical } from "lucide-react";
import { cn } from "@/lib/utils";

/** Persistent reminder that the portal is a demonstration with sample data. */
export function DemoBanner({ className }: { className?: string }) {
  return (
    <p
      role="note"
      className={cn(
        "flex items-start gap-2.5 bg-river-soft px-4 py-3 text-sm leading-relaxed text-ink-2",
        className,
      )}
    >
      <FlaskConical
        className="mt-0.5 size-4 shrink-0 text-river-deep"
        aria-hidden="true"
      />
      <span>
        <strong className="font-semibold text-ink">Demo portal.</strong> A
        sample resident with sample data, saved only in this browser. No real
        accounts, payments or requests are involved.
      </span>
    </p>
  );
}
