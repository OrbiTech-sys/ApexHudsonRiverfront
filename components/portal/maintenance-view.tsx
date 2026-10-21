"use client";

import { useId, useState } from "react";
import { FlaskConical } from "lucide-react";
import type { MaintenanceRequest } from "@/types/portal";
import { MaintenanceForm } from "@/components/portal/maintenance-form";
import { PriorityBadge, StatusBadge } from "@/components/portal/status-badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  maintenanceCategoryLabels,
  maintenanceFlow,
  maintenanceLocationLabels,
} from "@/data/portal";
import { formatTimestamp } from "@/lib/portal/dates";
import { isOpen, sortRequests } from "@/lib/portal/selectors";
import { portalActions } from "@/lib/portal/store";
import { usePortalData } from "@/lib/portal/use-portal";
import { cn } from "@/lib/utils";

type Filter = "open" | "closed";

function RequestCard({ request }: { request: MaintenanceRequest }) {
  const uid = useId();
  const [note, setNote] = useState("");
  const [confirmCancel, setConfirmCancel] = useState(false);
  const open = isOpen(request);
  const stage = maintenanceFlow.indexOf(request.status);
  const canAdvance = stage >= 0 && stage < maintenanceFlow.length - 1;

  return (
    <article
      aria-labelledby={`${uid}-title`}
      className="border border-line bg-paper p-5 sm:p-6"
    >
      <div className="flex flex-wrap items-start justify-between gap-x-4 gap-y-2">
        <div>
          <h3 id={`${uid}-title`} className="font-display text-2xl leading-tight text-ink">
            {maintenanceCategoryLabels[request.category]},{" "}
            {maintenanceLocationLabels[request.location].toLowerCase()}
          </h3>
          <p className="mt-1 text-sm text-ink-3">
            {request.number} &middot; Submitted {formatTimestamp(request.createdAt)}
          </p>
        </div>
        <div className="flex gap-2">
          <PriorityBadge priority={request.priority} />
          <StatusBadge status={request.status} />
        </div>
      </div>

      <p className="mt-4 leading-relaxed text-ink-2">{request.description}</p>

      <ol className="mt-5 space-y-3 border-l border-line-strong pl-5">
        {request.updates.map((update) => (
          <li key={update.id} className="relative text-sm">
            <span
              aria-hidden="true"
              className={cn(
                "absolute top-1.5 -left-[1.5rem] size-2 rounded-full",
                update.by === "property" ? "bg-river" : "bg-ink-3",
              )}
            />
            <p className="text-ink">{update.message}</p>
            <p className="mt-0.5 text-ink-3">
              {update.by === "property" ? "Property team" : "You"} &middot;{" "}
              {formatTimestamp(update.at)}
            </p>
          </li>
        ))}
      </ol>

      {open ? (
        <div className="mt-6 space-y-4 border-t border-line pt-5">
          <form
            className="flex flex-col gap-3 sm:flex-row"
            onSubmit={(event) => {
              event.preventDefault();
              portalActions.addRequestNote(request.id, note);
              setNote("");
            }}
          >
            <label htmlFor={`${uid}-note`} className="sr-only">
              Add a note to request {request.number}
            </label>
            <Input
              id={`${uid}-note`}
              value={note}
              onChange={(event) => setNote(event.target.value)}
              placeholder="Add a note for the property team"
              maxLength={300}
            />
            <Button type="submit" variant="outline" disabled={!note.trim()}>
              Add note
            </Button>
          </form>

          <div className="flex flex-wrap items-center gap-3">
            {confirmCancel ? (
              <>
                <span className="text-sm font-medium text-ink">
                  Cancel this request?
                </span>
                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  onClick={() => portalActions.cancelRequest(request.id)}
                >
                  Yes, cancel it
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setConfirmCancel(false)}
                >
                  Keep it
                </Button>
              </>
            ) : (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setConfirmCancel(true)}
              >
                Cancel request
              </Button>
            )}
            {canAdvance ? (
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="sm:ml-auto"
                onClick={() => portalActions.advanceRequest(request.id)}
              >
                <FlaskConical aria-hidden="true" />
                Demo: advance status
              </Button>
            ) : null}
          </div>
        </div>
      ) : null}
    </article>
  );
}

export function MaintenanceView() {
  const data = usePortalData();
  const [filter, setFilter] = useState<Filter>("open");
  if (!data) return null;

  const all = sortRequests(data.requests);
  const shown = all.filter((request) =>
    filter === "open" ? isOpen(request) : !isOpen(request),
  );
  const counts = {
    open: all.filter(isOpen).length,
    closed: all.filter((request) => !isOpen(request)).length,
  };

  return (
    <div className="grid gap-10 lg:grid-cols-12 lg:gap-12">
      <section aria-labelledby="requests-title" className="lg:col-span-7">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <h2 id="requests-title" className="font-display text-3xl text-ink">
            Your requests
          </h2>
          <div role="group" aria-label="Filter requests" className="flex border border-line-strong bg-paper">
            {(["open", "closed"] as const).map((value) => (
              <button
                key={value}
                type="button"
                aria-pressed={filter === value}
                onClick={() => setFilter(value)}
                className={cn(
                  "min-h-11 border-r border-line-strong px-4 text-sm font-medium capitalize transition-colors last:border-r-0",
                  filter === value ? "bg-ink text-paper" : "text-ink-2 hover:bg-river-soft",
                )}
              >
                {value} ({counts[value]})
              </button>
            ))}
          </div>
        </div>

        {shown.length === 0 ? (
          <p className="mt-6 border border-dashed border-line-strong bg-paper-2 px-6 py-10 text-center text-ink-3">
            {filter === "open"
              ? "No open requests. Use the form to submit one."
              : "No completed or cancelled requests yet."}
          </p>
        ) : (
          <ul className="mt-6 space-y-5">
            {shown.map((request) => (
              <li key={request.id}>
                <RequestCard request={request} />
              </li>
            ))}
          </ul>
        )}
      </section>

      <div className="lg:col-span-5">
        <div className="lg:sticky lg:top-[calc(var(--header-h)+1.5rem)]">
          <MaintenanceForm />
        </div>
      </div>
    </div>
  );
}
