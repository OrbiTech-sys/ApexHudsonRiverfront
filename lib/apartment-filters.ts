import type {
  ApartmentFloorPlan,
  Availability,
  BedroomType,
} from "@/types/property";

/**
 * Pure filtering, sorting and URL (de)serialization for the apartments page.
 * Everything here works on plain data so it can later run against database
 * results or be mirrored in a query without changing the UI.
 */

export type BedroomFilter = "all" | BedroomType;
export type AvailabilityFilter = "all" | Availability;
export type SortKey =
  | "featured"
  | "rent-asc"
  | "rent-desc"
  | "size-asc"
  | "size-desc";

export interface ApartmentFilters {
  bedrooms: BedroomFilter;
  bathrooms: number | null;
  availability: AvailabilityFilter;
  minRent: number | null;
  maxRent: number | null;
  minSqft: number | null;
  maxSqft: number | null;
  sort: SortKey;
}

export const defaultFilters: ApartmentFilters = {
  bedrooms: "all",
  bathrooms: null,
  availability: "all",
  minRent: null,
  maxRent: null,
  minSqft: null,
  maxSqft: null,
  sort: "featured",
};

export const bedroomFilterOptions: { value: BedroomFilter; label: string }[] = [
  { value: "all", label: "All" },
  { value: "studio", label: "Studio" },
  { value: "one-bed", label: "1 Bed" },
  { value: "two-bed", label: "2 Beds" },
];

export const availabilityFilterOptions: {
  value: AvailabilityFilter;
  label: string;
}[] = [
  { value: "all", label: "Any availability" },
  { value: "available", label: "Available" },
  { value: "coming-soon", label: "Coming Soon" },
  { value: "contact-leasing", label: "Contact Leasing" },
];

export const sortOptions: { value: SortKey; label: string }[] = [
  { value: "featured", label: "Featured" },
  { value: "rent-asc", label: "Rent: low to high" },
  { value: "rent-desc", label: "Rent: high to low" },
  { value: "size-asc", label: "Size: small to large" },
  { value: "size-desc", label: "Size: large to small" },
];

export const rentSteps = [
  2000, 2250, 2500, 2750, 3000, 3250, 3500, 3750, 4000,
] as const;
export const sqftSteps = [450, 550, 650, 750, 850, 950, 1050] as const;

const bedroomValues = new Set<string>(["studio", "one-bed", "two-bed"]);
const availabilityValues = new Set<string>([
  "available",
  "coming-soon",
  "contact-leasing",
]);
const sortValues = new Set<string>(sortOptions.map((option) => option.value));

type ParamReader = { get(name: string): string | null };

function readNumber(
  params: ParamReader,
  name: string,
  allowed?: readonly number[],
): number | null {
  const raw = params.get(name);
  if (raw === null || raw === "") return null;
  const value = Number(raw);
  if (!Number.isFinite(value) || value < 0) return null;
  if (allowed && !allowed.includes(value)) return null;
  return value;
}

/** Read filters from a query string, ignoring anything invalid. */
export function parseFilters(
  params: ParamReader,
  bathroomValues: readonly number[],
): ApartmentFilters {
  const type = params.get("type");
  const availability = params.get("availability");
  const sort = params.get("sort");

  return {
    bedrooms: type && bedroomValues.has(type) ? (type as BedroomType) : "all",
    bathrooms: readNumber(params, "baths", bathroomValues),
    availability:
      availability && availabilityValues.has(availability)
        ? (availability as Availability)
        : "all",
    minRent: readNumber(params, "minRent", rentSteps),
    maxRent: readNumber(params, "maxRent", rentSteps),
    minSqft: readNumber(params, "minSqft", sqftSteps),
    maxSqft: readNumber(params, "maxSqft", sqftSteps),
    sort: sort && sortValues.has(sort) ? (sort as SortKey) : "featured",
  };
}

/** Serialize only non-default filters, so clean URLs stay clean. */
export function toSearchString(filters: ApartmentFilters): string {
  const params = new URLSearchParams();
  if (filters.bedrooms !== "all") params.set("type", filters.bedrooms);
  if (filters.bathrooms !== null) params.set("baths", String(filters.bathrooms));
  if (filters.availability !== "all")
    params.set("availability", filters.availability);
  if (filters.minRent !== null) params.set("minRent", String(filters.minRent));
  if (filters.maxRent !== null) params.set("maxRent", String(filters.maxRent));
  if (filters.minSqft !== null) params.set("minSqft", String(filters.minSqft));
  if (filters.maxSqft !== null) params.set("maxSqft", String(filters.maxSqft));
  if (filters.sort !== "featured") params.set("sort", filters.sort);
  return params.toString();
}

export function activeFilterCount(filters: ApartmentFilters): number {
  let count = 0;
  if (filters.bedrooms !== "all") count += 1;
  if (filters.bathrooms !== null) count += 1;
  if (filters.availability !== "all") count += 1;
  if (filters.minRent !== null || filters.maxRent !== null) count += 1;
  if (filters.minSqft !== null || filters.maxSqft !== null) count += 1;
  return count;
}

function matches(plan: ApartmentFloorPlan, filters: ApartmentFilters): boolean {
  if (filters.bedrooms !== "all" && plan.bedroomType !== filters.bedrooms)
    return false;
  if (filters.bathrooms !== null && plan.bathrooms !== filters.bathrooms)
    return false;
  if (
    filters.availability !== "all" &&
    plan.availability !== filters.availability
  )
    return false;

  const rentFiltered = filters.minRent !== null || filters.maxRent !== null;
  if (rentFiltered) {
    if (plan.startingRent === null) return false;
    if (filters.minRent !== null && plan.startingRent < filters.minRent)
      return false;
    if (filters.maxRent !== null && plan.startingRent > filters.maxRent)
      return false;
  }

  if (filters.minSqft !== null && plan.squareFeet < filters.minSqft)
    return false;
  if (filters.maxSqft !== null && plan.squareFeet > filters.maxSqft)
    return false;

  return true;
}

function compare(
  a: ApartmentFloorPlan,
  b: ApartmentFloorPlan,
  sort: SortKey,
): number {
  switch (sort) {
    case "rent-asc":
      return (a.startingRent ?? Infinity) - (b.startingRent ?? Infinity);
    case "rent-desc":
      return (b.startingRent ?? -Infinity) - (a.startingRent ?? -Infinity);
    case "size-asc":
      return a.squareFeet - b.squareFeet;
    case "size-desc":
      return b.squareFeet - a.squareFeet;
    default:
      return a.sortOrder - b.sortOrder;
  }
}

export function applyFilters(
  plans: ApartmentFloorPlan[],
  filters: ApartmentFilters,
): ApartmentFloorPlan[] {
  return plans
    .filter((plan) => matches(plan, filters))
    .sort((a, b) => compare(a, b, filters.sort));
}
