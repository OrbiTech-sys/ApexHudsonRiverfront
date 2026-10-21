"use client";

import { CalendarPlus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { bedroomTypeLabels } from "@/lib/format";
import { downloadTextFile } from "@/lib/demo/download";
import { buildTourIcs } from "@/lib/demo/ics";
import { tourRequestActions } from "@/lib/demo/tour-requests";
import { useTourRequests } from "@/lib/demo/use-tour-requests";
import { formatIsoDate, formatTimestamp } from "@/lib/portal/dates";

/** Demo requests saved in this browser. Renders nothing when there are none. */
export function TourRequestsList() {
  const state = useTourRequests();
  if (!state || state.requests.length === 0) return null;

  return (
    <section
      aria-labelledby="saved-tours-title"
      className="mt-14 border-t border-line pt-10"
    >
      <h3 id="saved-tours-title" className="font-display text-3xl text-ink">
        Your saved demo requests
      </h3>
      <p className="mt-2 max-w-xl text-sm leading-relaxed text-ink-3">
        Saved in this browser only. In this demo the leasing team does not
        receive them.
      </p>

      <ul className="mt-6 divide-y divide-line border-y border-line">
        {state.requests.map((request) => {
          const { inquiry } = request;
          const typeLabel =
            inquiry.apartmentType === "no-preference"
              ? "No type preference"
              : bedroomTypeLabels[inquiry.apartmentType];
          const calendar = buildTourIcs(request);

          return (
            <li
              key={request.id}
              className="flex flex-wrap items-center justify-between gap-x-6 gap-y-3 py-5"
            >
              <div className="min-w-0">
                <p className="font-medium text-ink">
                  {request.reference} &middot; {typeLabel}
                </p>
                <p className="mt-0.5 text-sm text-ink-3">
                  {inquiry.preferredDate
                    ? `Preferred ${formatIsoDate(inquiry.preferredDate)}${inquiry.preferredTime ? `, ${inquiry.preferredTime}` : ""}`
                    : "No date chosen"}{" "}
                  &middot; saved {formatTimestamp(request.createdAt)}
                </p>
              </div>
              <div className="flex gap-2">
                {calendar ? (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => downloadTextFile(calendar, "text/calendar")}
                  >
                    <CalendarPlus aria-hidden="true" />
                    Calendar
                    <span className="sr-only"> file for {request.reference}</span>
                  </Button>
                ) : null}
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => tourRequestActions.remove(request.id)}
                >
                  <Trash2 aria-hidden="true" />
                  Remove
                  <span className="sr-only"> {request.reference}</span>
                </Button>
              </div>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
