import type { MaintenancePriority, MaintenanceStatus } from "@/types/portal";
import {
  maintenancePriorityLabels,
  maintenanceStatusLabels,
} from "@/data/portal";
import { cn } from "@/lib/utils";

const statusStyles: Record<MaintenanceStatus, string> = {
  submitted: "bg-paper-3 text-ink-2",
  scheduled: "bg-river-soft text-river-deep",
  "in-progress": "bg-river text-white",
  completed: "bg-ink text-paper",
  cancelled: "border border-line-strong text-ink-3",
};

const base =
  "inline-flex h-6 items-center rounded-sm px-2.5 text-xs font-semibold tracking-wide whitespace-nowrap";

export function StatusBadge({
  status,
  className,
}: {
  status: MaintenanceStatus;
  className?: string;
}) {
  return (
    <span className={cn(base, statusStyles[status], className)}>
      {maintenanceStatusLabels[status]}
    </span>
  );
}

export function PriorityBadge({
  priority,
  className,
}: {
  priority: MaintenancePriority;
  className?: string;
}) {
  if (priority === "routine") return null;
  return (
    <span className={cn(base, "bg-danger-soft text-danger", className)}>
      {maintenancePriorityLabels[priority]}
    </span>
  );
}
