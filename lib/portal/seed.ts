import type {
  Announcement,
  LedgerEntry,
  MaintenanceRequest,
  PortalState,
} from "@/types/portal";
import { demoCredentials, portalDocumentTemplates } from "@/data/portal";
import { addDays, addMonths, formatMonth, toIso } from "@/lib/portal/dates";

const MONTHLY_RENT = 2690;

/**
 * Builds the demo resident's starting data relative to `now`, so due dates
 * and history always look current. Every value is sample data: the resident,
 * unit, rent, ledger, requests and announcements are not real.
 */
export function createPortalSeed(now: Date): PortalState {
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);

  // Three paid months of history plus the upcoming rent charge.
  const ledger: LedgerEntry[] = [];
  for (let back = 2; back >= 0; back -= 1) {
    const due = addMonths(monthStart, -back, 1);
    ledger.push({
      id: `seed_charge_${back}`,
      date: toIso(due),
      type: "charge",
      description: `Rent for ${formatMonth(due)}`,
      amount: MONTHLY_RENT,
    });
    ledger.push({
      id: `seed_payment_${back}`,
      date: toIso(addDays(due, -2)),
      type: "payment",
      description: "Payment received",
      amount: MONTHLY_RENT,
      reference: `DEMO-${String(7000 + back * 13)}`,
      method: "Demo checking account ending 0000",
    });
  }
  const nextDue = addMonths(monthStart, 1, 1);
  ledger.push({
    id: "seed_charge_next",
    date: toIso(nextDue),
    type: "charge",
    description: `Rent for ${formatMonth(nextDue)}`,
    amount: MONTHLY_RENT,
  });

  const leaseStart = addMonths(monthStart, -8, 1);
  const leaseEnd = addDays(addMonths(leaseStart, 12, 1), -1);

  const stamp = (date: Date, hour: number) =>
    new Date(date.getFullYear(), date.getMonth(), date.getDate(), hour, 0).toISOString();

  const completedOn = addDays(today, -30);
  const scheduledOn = addDays(today, -3);
  const visitDay = addDays(today, 2);

  const requests: MaintenanceRequest[] = [
    {
      id: "seed_req_2",
      number: "M-1042",
      category: "electrical",
      priority: "routine",
      location: "bedroom",
      description: "The outlet by the bed has stopped working.",
      permissionToEnter: true,
      preferredWindow: "any",
      status: "scheduled",
      createdAt: stamp(scheduledOn, 9),
      updates: [
        {
          id: "seed_upd_2a",
          at: stamp(scheduledOn, 9),
          message: "Request submitted.",
          by: "resident",
        },
        {
          id: "seed_upd_2b",
          at: stamp(addDays(scheduledOn, 1), 11),
          message: `A technician is scheduled to visit on ${visitDay.toLocaleDateString("en-US", { month: "short", day: "numeric" })} (demo).`,
          by: "property",
        },
      ],
    },
    {
      id: "seed_req_1",
      number: "M-1017",
      category: "plumbing",
      priority: "routine",
      location: "kitchen",
      description: "The kitchen faucet drips when it is turned off.",
      permissionToEnter: true,
      preferredWindow: "morning",
      status: "completed",
      createdAt: stamp(addDays(completedOn, -4), 10),
      updates: [
        {
          id: "seed_upd_1a",
          at: stamp(addDays(completedOn, -4), 10),
          message: "Request submitted.",
          by: "resident",
        },
        {
          id: "seed_upd_1b",
          at: stamp(addDays(completedOn, -2), 9),
          message: "Technician scheduled (demo).",
          by: "property",
        },
        {
          id: "seed_upd_1c",
          at: stamp(completedOn, 14),
          message: "Faucet cartridge replaced. Work completed (demo).",
          by: "property",
        },
      ],
    },
  ];

  const announcements: Announcement[] = [
    {
      id: "seed_ann_1",
      title: "Sample notice: water shut-off",
      body: "A short water shut-off is scheduled for building maintenance. This is a sample announcement for the demo portal.",
      date: toIso(addDays(today, -2)),
    },
    {
      id: "seed_ann_2",
      title: "Sample reminder: package room",
      body: "Please collect packages promptly so everyone has room. Sample text for the demo portal.",
      date: toIso(addDays(today, -9)),
    },
    {
      id: "seed_ann_3",
      title: "Sample event: neighbors' evening",
      body: "An invitation to meet neighbors in the resident lounge. Sample text; no event is actually scheduled.",
      date: toIso(addDays(today, -16)),
    },
  ];

  return {
    version: 1,
    signedIn: false,
    data: {
      profile: {
        firstName: "Jordan",
        lastName: "Ellis",
        email: demoCredentials.email,
        phone: "(555) 010-0142",
        notifyEmail: true,
        notifySms: false,
        autopay: false,
      },
      lease: {
        unitLabel: "Residence 5C",
        planName: "One Bedroom A2",
        planSlug: "one-bedroom-a2",
        startDate: toIso(leaseStart),
        endDate: toIso(leaseEnd),
        monthlyRent: MONTHLY_RENT,
        securityDeposit: MONTHLY_RENT,
        rentDueDay: 1,
      },
      ledger,
      requests,
      announcements,
      documents: portalDocumentTemplates.map((doc, index) => ({
        ...doc,
        updated: toIso(addDays(leaseStart, index * 3)),
      })),
      renewal: { status: "none" },
    },
  };
}
