"use client";

import Link from "next/link";
import { ArrowRight, Wrench } from "lucide-react";
import { PayButton } from "@/components/portal/pay-button";
import { StatusBadge } from "@/components/portal/status-badge";
import { Button } from "@/components/ui/button";
import {
  maintenanceCategoryLabels,
  maintenanceLocationLabels,
} from "@/data/portal";
import { formatMoney } from "@/lib/format";
import { daysBetween, formatIsoDate, fromIso } from "@/lib/portal/dates";
import {
  isOpen,
  ledgerBalance,
  outstandingCharges,
  sortLedger,
  sortRequests,
} from "@/lib/portal/selectors";
import { usePortalData } from "@/lib/portal/use-portal";

function Panel({
  title,
  action,
  children,
  className,
}: {
  title: string;
  action?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section className={`border border-line bg-paper p-6 sm:p-8 ${className ?? ""}`}>
      <div className="flex items-baseline justify-between gap-4">
        <h2 className="font-display text-2xl text-ink">{title}</h2>
        {action}
      </div>
      <div className="mt-5">{children}</div>
    </section>
  );
}

export function Dashboard() {
  const data = usePortalData();
  if (!data) return null;

  const { profile, lease, ledger, requests, announcements } = data;
  const balance = ledgerBalance(ledger);
  const nextOwed = outstandingCharges(ledger)[0];
  const openRequests = sortRequests(requests).filter(isOpen);
  const recent = sortLedger(ledger).slice(0, 4);

  const dueDate = nextOwed ? fromIso(nextOwed.entry.date) : null;
  const daysUntil = dueDate ? daysBetween(new Date(), dueDate) : 0;
  const dueNote = !dueDate
    ? "You are all paid up."
    : daysUntil < 0
      ? `Overdue since ${formatIsoDate(nextOwed!.entry.date)}.`
      : daysUntil === 0
        ? "Due today."
        : `Due ${formatIsoDate(nextOwed!.entry.date)}, in ${daysUntil} ${daysUntil === 1 ? "day" : "days"}.`;

  return (
    <div className="grid gap-6 lg:grid-cols-12">
      <section
        aria-labelledby="balance-title"
        className="border border-ink bg-ink p-6 text-on-ink sm:p-8 lg:col-span-8"
      >
        <h2 id="balance-title" className="label-caps font-sans text-on-ink-muted">
          Current balance
        </h2>
        <p className="mt-3 font-display text-6xl leading-none sm:text-7xl">
          {formatMoney(balance)}
        </p>
        <p className="mt-4 text-on-ink-muted">{dueNote}</p>
        {profile.autopay ? (
          <p className="mt-1 text-sm text-on-ink-muted">
            Autopay is on (demo only; nothing is actually scheduled).
          </p>
        ) : null}
        <div className="on-dark mt-8 flex flex-col gap-3 sm:flex-row">
          <PayButton variant="inverse" />
          <Button asChild size="lg" variant="outline-inverse">
            <Link href="/portal/payments">View statement</Link>
          </Button>
        </div>
      </section>

      <Panel title="Your home" className="lg:col-span-4">
        <dl className="space-y-3 text-sm">
          <div className="flex justify-between gap-4">
            <dt className="text-ink-3">Home</dt>
            <dd className="text-right font-medium text-ink">{lease.unitLabel}</dd>
          </div>
          <div className="flex justify-between gap-4">
            <dt className="text-ink-3">Floor plan</dt>
            <dd className="text-right font-medium text-ink">
              <Link
                href={`/apartments/${lease.planSlug}`}
                className="underline decoration-river/40 underline-offset-4 hover:decoration-river-deep"
              >
                {lease.planName}
              </Link>
            </dd>
          </div>
          <div className="flex justify-between gap-4">
            <dt className="text-ink-3">Lease ends</dt>
            <dd className="text-right font-medium text-ink">
              {formatIsoDate(lease.endDate)}
            </dd>
          </div>
          <div className="flex justify-between gap-4">
            <dt className="text-ink-3">Monthly rent</dt>
            <dd className="text-right font-medium text-ink">
              {formatMoney(lease.monthlyRent)}
            </dd>
          </div>
        </dl>
        <Button asChild variant="link" className="mt-5">
          <Link href="/portal/lease">
            Lease and documents
            <ArrowRight aria-hidden="true" />
          </Link>
        </Button>
      </Panel>

      <Panel
        title="Maintenance"
        className="lg:col-span-7"
        action={
          <Button asChild variant="link">
            <Link href="/portal/maintenance#new-request">New request</Link>
          </Button>
        }
      >
        {openRequests.length === 0 ? (
          <p className="text-ink-3">
            You have no open requests. Need something fixed? Submit a request
            and follow its progress here.
          </p>
        ) : (
          <ul className="divide-y divide-line border-y border-line">
            {openRequests.slice(0, 3).map((request) => (
              <li key={request.id} className="flex items-start gap-4 py-4">
                <Wrench
                  className="mt-1 size-5 shrink-0 text-river-deep"
                  strokeWidth={1.5}
                  aria-hidden="true"
                />
                <div className="min-w-0 flex-1">
                  <p className="font-medium text-ink">
                    {maintenanceCategoryLabels[request.category]},{" "}
                    {maintenanceLocationLabels[request.location].toLowerCase()}
                  </p>
                  <p className="mt-0.5 text-sm text-ink-3">
                    {request.number} &middot; {request.description}
                  </p>
                </div>
                <StatusBadge status={request.status} />
              </li>
            ))}
          </ul>
        )}
        <Button asChild variant="link" className="mt-4">
          <Link href="/portal/maintenance">
            All requests
            <ArrowRight aria-hidden="true" />
          </Link>
        </Button>
      </Panel>

      <Panel title="Recent activity" className="lg:col-span-5">
        <ul className="divide-y divide-line border-y border-line">
          {recent.map((entry) => (
            <li key={entry.id} className="flex items-baseline justify-between gap-4 py-3 text-sm">
              <div className="min-w-0">
                <p className="font-medium text-ink">{entry.description}</p>
                <p className="text-ink-3">{formatIsoDate(entry.date)}</p>
              </div>
              <p
                className={
                  entry.type === "payment"
                    ? "font-medium text-river-deep"
                    : "font-medium text-ink"
                }
              >
                {entry.type === "payment" ? "−" : ""}
                {formatMoney(entry.amount)}
              </p>
            </li>
          ))}
        </ul>
      </Panel>

      <Panel title="Community announcements" className="lg:col-span-12">
        <ul className="grid gap-6 md:grid-cols-3">
          {announcements.map((item) => (
            <li key={item.id} className="border-t-2 border-river pt-4">
              <p className="text-xs font-semibold tracking-wide text-ink-3 uppercase">
                {formatIsoDate(item.date)}
              </p>
              <h3 className="mt-2 font-display text-xl text-ink">{item.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-ink-3">{item.body}</p>
            </li>
          ))}
        </ul>
      </Panel>
    </div>
  );
}
