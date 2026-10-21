import type {
  MaintenanceCategory,
  MaintenanceLocation,
  MaintenancePriority,
  MaintenanceStatus,
  MaintenanceWindow,
  PortalDocument,
} from "@/types/portal";

/**
 * Static config and labels for the DEMO Resident Portal. The resident, lease,
 * ledger and requests are sample data; see `lib/portal/seed.ts`.
 */

/** Shown on the sign-in page. Sample values only, for a demo account. */
export const demoCredentials = {
  email: "jordan.ellis@example.com",
  password: "demo-resident",
} as const;

export const demoPortalHref = "/portal";

export const demoPaymentMethods = [
  { id: "bank", label: "Demo checking account ending 0000" },
  { id: "card", label: "Demo card ending 0000" },
] as const;

export const maintenanceCategoryLabels: Record<MaintenanceCategory, string> = {
  plumbing: "Plumbing",
  electrical: "Electrical",
  "heating-cooling": "Heating and cooling",
  appliances: "Appliances",
  "doors-locks": "Doors, windows and locks",
  pests: "Pest control",
  other: "Something else",
};

export const maintenanceLocationLabels: Record<MaintenanceLocation, string> = {
  kitchen: "Kitchen",
  bathroom: "Bathroom",
  bedroom: "Bedroom",
  "living-area": "Living area",
  "entry-other": "Entry or other",
};

export const maintenancePriorityLabels: Record<MaintenancePriority, string> = {
  routine: "Routine",
  urgent: "Urgent",
};

export const maintenanceWindowLabels: Record<MaintenanceWindow, string> = {
  any: "Any time",
  morning: "Morning",
  afternoon: "Afternoon",
};

export const maintenanceStatusLabels: Record<MaintenanceStatus, string> = {
  submitted: "Submitted",
  scheduled: "Scheduled",
  "in-progress": "In progress",
  completed: "Completed",
  cancelled: "Cancelled",
};

/** Order a request moves through, used by the demo "advance status" tool. */
export const maintenanceFlow: MaintenanceStatus[] = [
  "submitted",
  "scheduled",
  "in-progress",
  "completed",
];

export const maintenanceFlowMessages: Record<MaintenanceStatus, string> = {
  submitted: "Request received by the property team (demo).",
  scheduled: "A technician has been scheduled (demo).",
  "in-progress": "Work is in progress (demo).",
  completed: "Work completed. Thanks for your patience (demo).",
  cancelled: "Request cancelled.",
};

export const portalDocumentTemplates: Omit<PortalDocument, "updated">[] = [
  {
    id: "doc-lease",
    title: "Lease agreement (sample)",
    description: "A sample lease summary for the demo resident.",
  },
  {
    id: "doc-move-in",
    title: "Move-in condition checklist (sample)",
    description: "A sample checklist for recording the condition of a home.",
  },
  {
    id: "doc-guidelines",
    title: "Community guidelines (sample)",
    description: "Sample house rules and good-neighbor reminders.",
  },
  {
    id: "doc-insurance",
    title: "Renters insurance information (sample)",
    description: "Sample guidance on renters insurance requirements.",
  },
];

export const renewalTermOptions = [12, 18, 24] as const;
