"use client";

import Link from "next/link";
import { Download, FlaskConical } from "lucide-react";
import { PayButton } from "@/components/portal/pay-button";
import { Button } from "@/components/ui/button";
import { formatMoney } from "@/lib/format";
import { daysBetween, formatIsoDate, fromIso } from "@/lib/portal/dates";
import { downloadTextFile } from "@/lib/demo/download";
import { buildReceipt } from "@/lib/portal/documents";
import {
  ledgerBalance,
  outstandingCharges,
  sortLedger,
} from "@/lib/portal/selectors";
import { portalActions } from "@/lib/portal/store";
import { usePortalData } from "@/lib/portal/use-portal";
import { cn } from "@/lib/utils";

export function PaymentsView() {
  const data = usePortalData();
  if (!data) return null;

  const { ledger, profile } = data;
  const balance = ledgerBalance(ledger);
  const owed = outstandingCharges(ledger);
  const owedById = new Map(owed.map((item) => [item.entry.id, item.remaining]));
  const nextOwed = owed[0];
  const rows = sortLedger(ledger);
  const today = new Date();

  const dueNote = !nextOwed
    ? "You are all paid up."
    : (() => {
        const days = daysBetween(today, fromIso(nextOwed.entry.date));
        if (days < 0) return `Overdue since ${formatIsoDate(nextOwed.entry.date)}.`;
        if (days === 0) return "Due today.";
        return `${nextOwed.entry.description}, due ${formatIsoDate(nextOwed.entry.date)}.`;
      })();

  return (
    <div className="grid gap-8 lg:grid-cols-12 lg:gap-10">
      <aside className="space-y-6 lg:col-span-4">
        <section
          aria-labelledby="pay-balance"
          className="border border-ink bg-ink p-6 text-on-ink sm:p-8"
        >
          <h2 id="pay-balance" className="label-caps font-sans text-on-ink-muted">
            Current balance
          </h2>
          <p className="mt-3 font-display text-6xl leading-none">
            {formatMoney(balance)}
          </p>
          <p className="mt-4 text-on-ink-muted">{dueNote}</p>
          <div className="on-dark mt-7">
            <PayButton variant="inverse" className="w-full" />
          </div>
        </section>

        <section className="border border-line bg-paper p-6">
          <h2 className="font-display text-2xl text-ink">Autopay</h2>
          <p className="mt-3 text-sm leading-relaxed text-ink-3">
            Autopay is {profile.autopay ? "on" : "off"}. You can change it in
            your profile. In this demo, no payment is ever scheduled or taken.
          </p>
          <Button asChild variant="link" className="mt-3">
            <Link href="/portal/profile">Manage autopay</Link>
          </Button>
        </section>

        <section className="border border-dashed border-line-strong bg-paper-2 p-6">
          <p className="flex items-center gap-2 text-sm font-semibold text-ink">
            <FlaskConical className="size-4 text-river-deep" aria-hidden="true" />
            Demo tool
          </p>
          <p className="mt-2 text-sm leading-relaxed text-ink-3">
            Paid up? Post next month&rsquo;s rent charge to try the payment
            flow again.
          </p>
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="mt-4"
            onClick={() => portalActions.postNextCharge()}
          >
            Post next month&rsquo;s rent
          </Button>
        </section>
      </aside>

      <section aria-labelledby="statement-title" className="lg:col-span-8">
        <h2 id="statement-title" className="font-display text-3xl text-ink">
          Statement
        </h2>
        <ul className="mt-5 divide-y divide-line border-y border-line">
          {rows.map((entry) => {
            const isPayment = entry.type === "payment";
            const remaining = owedById.get(entry.id) ?? 0;
            const status = isPayment
              ? "Payment"
              : remaining === 0
                ? "Paid"
                : remaining < entry.amount
                  ? `Partly paid, ${formatMoney(remaining)} due`
                  : fromIso(entry.date) < today
                    ? "Overdue"
                    : "Due";

            return (
              <li
                key={entry.id}
                className="grid grid-cols-[1fr_auto] items-center gap-x-4 gap-y-1 py-4 sm:grid-cols-[6.5rem_1fr_auto_auto]"
              >
                <p className="text-sm text-ink-3">{formatIsoDate(entry.date)}</p>
                <div className="col-span-2 row-start-2 min-w-0 sm:col-span-1 sm:row-start-auto">
                  <p className="font-medium text-ink">{entry.description}</p>
                  <p className="mt-0.5 text-sm text-ink-3">
                    <span
                      className={cn(
                        "mr-2 inline-flex h-5 items-center rounded-sm px-1.5 text-[0.6875rem] font-semibold tracking-wide uppercase",
                        status === "Overdue"
                          ? "bg-danger-soft text-danger"
                          : status === "Paid" || isPayment
                            ? "bg-paper-3 text-ink-2"
                            : "bg-river-soft text-river-deep",
                      )}
                    >
                      {status}
                    </span>
                    {isPayment
                      ? `${entry.reference ?? ""} ${entry.method ? `· ${entry.method}` : ""}`
                      : null}
                  </p>
                </div>
                <p
                  className={cn(
                    "text-right font-medium",
                    isPayment ? "text-river-deep" : "text-ink",
                  )}
                >
                  {isPayment ? "−" : ""}
                  {formatMoney(entry.amount)}
                </p>
                <div className="col-start-2 row-start-1 sm:col-start-auto sm:row-start-auto sm:w-28 sm:text-right">
                  {isPayment ? (
                    <Button
                      type="button"
                      variant="link"
                      size="sm"
                      onClick={() => downloadTextFile(buildReceipt(entry, data))}
                    >
                      <Download className="size-3.5" aria-hidden="true" />
                      Receipt
                      <span className="sr-only"> for {entry.reference}</span>
                    </Button>
                  ) : null}
                </div>
              </li>
            );
          })}
        </ul>
        <p className="mt-4 text-sm text-ink-3">
          Charges are positive; payments are shown with a minus sign. Sample
          data for the demo.
        </p>
      </section>
    </div>
  );
}
