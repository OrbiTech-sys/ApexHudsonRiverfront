"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { SlidersHorizontal } from "lucide-react";
import type { ApartmentFloorPlan } from "@/types/property";
import { ApartmentCard } from "@/components/apartments/apartment-card";
import { FilterPanel } from "@/components/apartments/filter-panel";
import { Button } from "@/components/ui/button";
import {
  NativeSelect,
  NativeSelectOption,
} from "@/components/ui/native-select";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  activeFilterCount,
  applyFilters,
  defaultFilters,
  parseFilters,
  sortOptions,
  toSearchString,
  type ApartmentFilters,
  type SortKey,
} from "@/lib/apartment-filters";

interface ApartmentExplorerProps {
  plans: ApartmentFloorPlan[];
  bathroomOptions: number[];
}

/**
 * Filters live in the URL (shareable, back-button friendly) but are applied
 * entirely in the browser against the plans passed in. Updates use the native
 * History API, which Next.js syncs into `useSearchParams` without a network
 * request.
 */
export function ApartmentExplorer({
  plans,
  bathroomOptions,
}: ApartmentExplorerProps) {
  const searchParams = useSearchParams();
  const [filtersOpen, setFiltersOpen] = useState(false);

  const filters = useMemo(
    () => parseFilters(searchParams, bathroomOptions),
    [searchParams, bathroomOptions],
  );
  const results = useMemo(() => applyFilters(plans, filters), [plans, filters]);
  const activeCount = activeFilterCount(filters);

  const commit = (next: ApartmentFilters) => {
    const query = toSearchString(next);
    window.history.replaceState(
      null,
      "",
      query ? `?${query}` : window.location.pathname,
    );
  };

  const handleChange = (patch: Partial<ApartmentFilters>) =>
    commit({ ...filters, ...patch });

  const handleClear = () => commit({ ...defaultFilters, sort: filters.sort });

  const panel = (
    <FilterPanel
      filters={filters}
      bathroomOptions={bathroomOptions}
      activeCount={activeCount}
      onChange={handleChange}
      onClear={handleClear}
    />
  );

  return (
    <div className="container-page grid gap-10 py-10 lg:grid-cols-[17rem_minmax(0,1fr)] lg:gap-12 lg:py-14 xl:grid-cols-[19rem_minmax(0,1fr)]">
      <aside aria-label="Filters" className="hidden lg:block">
        <div className="sticky top-[calc(var(--header-h)+1.5rem)] border border-line bg-paper-2 p-6">
          <h2 className="mb-6 font-display text-2xl text-ink">Refine</h2>
          {panel}
        </div>
      </aside>

      <div className="min-w-0">
        <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-3 border-b border-line pb-4">
          <div className="flex items-center gap-4">
            <Sheet open={filtersOpen} onOpenChange={setFiltersOpen}>
              <SheetTrigger asChild>
                <Button variant="outline" size="sm" className="lg:hidden">
                  <SlidersHorizontal aria-hidden="true" />
                  Filters
                  {activeCount > 0 ? (
                    <span className="ml-1 inline-flex size-5 items-center justify-center rounded-full bg-ink text-xs text-paper">
                      {activeCount}
                      <span className="sr-only"> active</span>
                    </span>
                  ) : null}
                </Button>
              </SheetTrigger>
              <SheetContent
                side="left"
                className="w-full gap-0 bg-paper p-0 sm:max-w-md"
              >
                <SheetHeader className="border-b border-line p-6">
                  <SheetTitle className="font-display text-2xl text-ink">
                    Filters
                  </SheetTitle>
                  <SheetDescription>
                    Results update as you change a filter.
                  </SheetDescription>
                </SheetHeader>
                <div className="flex-1 overflow-y-auto p-6">{panel}</div>
                <SheetFooter className="border-t border-line bg-paper-2 p-6">
                  <Button
                    type="button"
                    size="lg"
                    onClick={() => setFiltersOpen(false)}
                  >
                    Show {results.length}{" "}
                    {results.length === 1 ? "floor plan" : "floor plans"}
                  </Button>
                </SheetFooter>
              </SheetContent>
            </Sheet>

            <p role="status" aria-live="polite" className="text-sm text-ink-2">
              <span className="font-semibold text-ink">{results.length}</span>{" "}
              {results.length === 1 ? "floor plan" : "floor plans"}
              {results.length !== plans.length ? ` of ${plans.length}` : ""}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <label htmlFor="apartment-sort" className="text-sm text-ink-3">
              Sort by
            </label>
            <NativeSelect
              id="apartment-sort"
              size="sm"
              className="w-52"
              value={filters.sort}
              onChange={(event) =>
                handleChange({ sort: event.target.value as SortKey })
              }
            >
              {sortOptions.map((option) => (
                <NativeSelectOption key={option.value} value={option.value}>
                  {option.label}
                </NativeSelectOption>
              ))}
            </NativeSelect>
          </div>
        </div>

        {results.length > 0 ? (
          <ul className="mt-8 grid gap-6 sm:grid-cols-2 2xl:grid-cols-3">
            {results.map((plan) => (
              <li key={plan.id}>
                <ApartmentCard plan={plan} />
              </li>
            ))}
          </ul>
        ) : (
          <div className="mt-8 border border-dashed border-line-strong bg-paper-2 px-6 py-14 text-center sm:px-10">
            <h2 className="font-display text-3xl text-ink">
              No floor plans match these filters.
            </h2>
            <p className="mx-auto mt-3 max-w-md leading-relaxed text-ink-3">
              Try widening the rent or size range, or clear your filters to see
              every floor plan. You can also ask the leasing team what may be
              coming up.
            </p>
            <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
              <Button type="button" onClick={handleClear}>
                Clear all filters
              </Button>
              <Button asChild variant="outline">
                <Link href="/contact">Contact Leasing</Link>
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
