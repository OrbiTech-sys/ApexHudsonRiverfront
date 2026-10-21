"use client";

import { useId } from "react";
import { Button } from "@/components/ui/button";
import {
  NativeSelect,
  NativeSelectOption,
} from "@/components/ui/native-select";
import {
  availabilityFilterOptions,
  bedroomFilterOptions,
  rentSteps,
  sqftSteps,
  type ApartmentFilters,
  type AvailabilityFilter,
  type BedroomFilter,
} from "@/lib/apartment-filters";
import { formatNumber, formatRent } from "@/lib/format";
import { cn } from "@/lib/utils";

interface FilterPanelProps {
  filters: ApartmentFilters;
  bathroomOptions: number[];
  activeCount: number;
  onChange: (patch: Partial<ApartmentFilters>) => void;
  onClear: () => void;
}

interface SegmentedControlProps {
  legend: string;
  value: string;
  options: { value: string; label: string }[];
  onChange: (value: string) => void;
}

function SegmentedControl({
  legend,
  value,
  options,
  onChange,
}: SegmentedControlProps) {
  return (
    <fieldset className="min-w-0">
      <legend className="label-caps mb-3 text-ink-3">{legend}</legend>
      <div className="grid grid-flow-col auto-cols-fr border border-line-strong bg-paper">
        {options.map((option) => {
          const selected = option.value === value;
          return (
            <button
              key={option.value}
              type="button"
              aria-pressed={selected}
              onClick={() => onChange(option.value)}
              className={cn(
                "min-h-11 border-r border-line-strong px-2 text-sm font-medium transition-colors last:border-r-0 focus-visible:z-10",
                selected
                  ? "bg-ink text-paper"
                  : "text-ink-2 hover:bg-river-soft",
              )}
            >
              {option.label}
            </button>
          );
        })}
      </div>
    </fieldset>
  );
}

function RangeRow({
  legend,
  idPrefix,
  min,
  max,
  steps,
  format,
  onMin,
  onMax,
}: {
  legend: string;
  idPrefix: string;
  min: number | null;
  max: number | null;
  steps: readonly number[];
  format: (value: number) => string;
  onMin: (value: number | null) => void;
  onMax: (value: number | null) => void;
}) {
  const toValue = (raw: string) => (raw === "" ? null : Number(raw));

  return (
    <fieldset className="min-w-0">
      <legend className="label-caps mb-3 text-ink-3">{legend}</legend>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label htmlFor={`${idPrefix}-min`} className="mb-1.5 block text-sm text-ink-3">
            Minimum
          </label>
          <NativeSelect
            id={`${idPrefix}-min`}
            value={min ?? ""}
            onChange={(event) => onMin(toValue(event.target.value))}
          >
            <NativeSelectOption value="">No min</NativeSelectOption>
            {steps.map((step) => (
              <NativeSelectOption
                key={step}
                value={step}
                disabled={max !== null && step > max}
              >
                {format(step)}
              </NativeSelectOption>
            ))}
          </NativeSelect>
        </div>
        <div>
          <label htmlFor={`${idPrefix}-max`} className="mb-1.5 block text-sm text-ink-3">
            Maximum
          </label>
          <NativeSelect
            id={`${idPrefix}-max`}
            value={max ?? ""}
            onChange={(event) => onMax(toValue(event.target.value))}
          >
            <NativeSelectOption value="">No max</NativeSelectOption>
            {steps.map((step) => (
              <NativeSelectOption
                key={step}
                value={step}
                disabled={min !== null && step < min}
              >
                {format(step)}
              </NativeSelectOption>
            ))}
          </NativeSelect>
        </div>
      </div>
    </fieldset>
  );
}

export function FilterPanel({
  filters,
  bathroomOptions,
  activeCount,
  onChange,
  onClear,
}: FilterPanelProps) {
  const uid = useId();

  return (
    <div className="space-y-8" role="group" aria-label="Apartment filters">
      <SegmentedControl
        legend="Bedrooms"
        value={filters.bedrooms}
        options={bedroomFilterOptions}
        onChange={(value) => onChange({ bedrooms: value as BedroomFilter })}
      />

      {bathroomOptions.length > 1 ? (
        <SegmentedControl
          legend="Bathrooms"
          value={filters.bathrooms === null ? "any" : String(filters.bathrooms)}
          options={[
            { value: "any", label: "Any" },
            ...bathroomOptions.map((count) => ({
              value: String(count),
              label: String(count),
            })),
          ]}
          onChange={(value) =>
            onChange({ bathrooms: value === "any" ? null : Number(value) })
          }
        />
      ) : null}

      <RangeRow
        legend="Monthly rent"
        idPrefix={`${uid}-rent`}
        min={filters.minRent}
        max={filters.maxRent}
        steps={rentSteps}
        format={formatRent}
        onMin={(minRent) => onChange({ minRent })}
        onMax={(maxRent) => onChange({ maxRent })}
      />

      <RangeRow
        legend="Square feet"
        idPrefix={`${uid}-sqft`}
        min={filters.minSqft}
        max={filters.maxSqft}
        steps={sqftSteps}
        format={formatNumber}
        onMin={(minSqft) => onChange({ minSqft })}
        onMax={(maxSqft) => onChange({ maxSqft })}
      />

      <div>
        <label
          htmlFor={`${uid}-availability`}
          className="label-caps mb-3 block text-ink-3"
        >
          Availability
        </label>
        <NativeSelect
          id={`${uid}-availability`}
          value={filters.availability}
          onChange={(event) =>
            onChange({ availability: event.target.value as AvailabilityFilter })
          }
        >
          {availabilityFilterOptions.map((option) => (
            <NativeSelectOption key={option.value} value={option.value}>
              {option.label}
            </NativeSelectOption>
          ))}
        </NativeSelect>
      </div>

      <Button
        type="button"
        variant="outline"
        className="w-full"
        onClick={onClear}
        disabled={activeCount === 0}
      >
        Clear all filters
      </Button>
    </div>
  );
}
