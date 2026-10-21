"use client";

import Link from "next/link";
import { Download, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { renewalTermOptions } from "@/data/portal";
import { formatMoney } from "@/lib/format";
import {
  daysBetween,
  formatIsoDate,
  formatTimestamp,
  fromIso,
} from "@/lib/portal/dates";
import { downloadTextFile } from "@/lib/demo/download";
import { buildDocument } from "@/lib/portal/documents";
import { portalActions } from "@/lib/portal/store";
import { usePortalData } from "@/lib/portal/use-portal";

export function LeaseView() {
  const data = usePortalData();
  if (!data) return null;

  const { lease, documents, renewal } = data;
  const daysLeft = daysBetween(new Date(), fromIso(lease.endDate));

  return (
    <div className="grid gap-10 lg:grid-cols-12 lg:gap-12">
      <div className="space-y-8 lg:col-span-5">
        <section aria-labelledby="lease-title" className="border border-line bg-paper p-6 sm:p-8">
          <h2 id="lease-title" className="font-display text-3xl text-ink">
            Lease summary
          </h2>
          <dl className="mt-6 divide-y divide-line border-y border-line text-sm">
            {[
              ["Home", lease.unitLabel],
              ["Floor plan", lease.planName],
              ["Lease start", formatIsoDate(lease.startDate)],
              ["Lease end", formatIsoDate(lease.endDate)],
              ["Monthly rent", formatMoney(lease.monthlyRent)],
              ["Security deposit", formatMoney(lease.securityDeposit)],
              ["Rent due", `Day ${lease.rentDueDay} of each month`],
            ].map(([label, value]) => (
              <div key={label} className="flex justify-between gap-4 py-3">
                <dt className="text-ink-3">{label}</dt>
                <dd className="text-right font-medium text-ink">{value}</dd>
              </div>
            ))}
          </dl>
          <p className="mt-4 text-sm text-ink-3">
            {daysLeft >= 0
              ? `${daysLeft} ${daysLeft === 1 ? "day" : "days"} remaining on this sample lease.`
              : "This sample lease has ended."}{" "}
            <Link
              href={`/apartments/${lease.planSlug}`}
              className="font-semibold text-river-deep underline underline-offset-4"
            >
              View floor plan
            </Link>
          </p>
        </section>

        <section aria-labelledby="renewal-title" className="border border-line bg-paper p-6 sm:p-8">
          <h2 id="renewal-title" className="font-display text-3xl text-ink">
            Renewal
          </h2>
          {renewal.status === "requested" ? (
            <div role="status" className="mt-4 space-y-3">
              <p className="leading-relaxed text-ink-2">
                You asked about {renewal.termMonths === 18 ? "an" : "a"}{" "}
                {renewal.termMonths}-month renewal on{" "}
                {renewal.requestedAt ? formatTimestamp(renewal.requestedAt) : "an earlier date"}.
                Reference <strong className="font-semibold text-ink">{renewal.reference}</strong>.
              </p>
              <p className="text-sm text-ink-3">
                Demo only: no one received this request and no renewal terms
                were generated.
              </p>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => portalActions.withdrawRenewal()}
              >
                Withdraw request
              </Button>
            </div>
          ) : (
            <div className="mt-4">
              <p className="leading-relaxed text-ink-3">
                Thinking about staying? Tell the leasing team which term you
                would like to discuss.
              </p>
              <div className="mt-5 flex flex-wrap gap-3">
                {renewalTermOptions.map((months) => (
                  <Button
                    key={months}
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => portalActions.requestRenewal(months)}
                  >
                    {months} months
                  </Button>
                ))}
              </div>
            </div>
          )}
        </section>
      </div>

      <section aria-labelledby="docs-title" className="lg:col-span-7">
        <h2 id="docs-title" className="font-display text-3xl text-ink">
          Documents
        </h2>
        <ul className="mt-6 divide-y divide-line border-y border-line">
          {documents.map((doc) => (
            <li key={doc.id} className="flex items-center gap-4 py-5">
              <FileText
                className="size-6 shrink-0 text-river-deep"
                strokeWidth={1.5}
                aria-hidden="true"
              />
              <div className="min-w-0 flex-1">
                <p className="font-medium text-ink">{doc.title}</p>
                <p className="mt-0.5 text-sm text-ink-3">
                  {doc.description} Updated {formatIsoDate(doc.updated)}.
                </p>
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => {
                  const file = buildDocument(doc.id, data);
                  if (file) downloadTextFile(file);
                }}
              >
                <Download aria-hidden="true" />
                Download
                <span className="sr-only"> {doc.title}</span>
              </Button>
            </li>
          ))}
        </ul>
        <p className="mt-4 text-sm text-ink-3">
          Documents are generated samples for the demo and are not legal
          documents.
        </p>
      </section>
    </div>
  );
}
