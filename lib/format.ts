import type {
  ApartmentFloorPlan,
  Availability,
  BedroomType,
} from "@/types/property";

const currency = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

const integer = new Intl.NumberFormat("en-US");

export function formatRent(amount: number): string {
  return currency.format(amount);
}

const currencyCents = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

/** Money with cents, for ledgers and receipts. */
export function formatMoney(amount: number): string {
  return currencyCents.format(amount);
}

export function formatNumber(value: number): string {
  return integer.format(value);
}

export function formatSquareFeet(value: number): string {
  return `${integer.format(value)} sq ft`;
}

export function formatBedrooms(bedrooms: number): string {
  if (bedrooms === 0) return "Studio";
  return bedrooms === 1 ? "1 Bed" : `${bedrooms} Beds`;
}

export function formatBathrooms(bathrooms: number): string {
  return bathrooms === 1 ? "1 Bath" : `${bathrooms} Baths`;
}

export function describePlan(plan: ApartmentFloorPlan): string {
  return `${formatBedrooms(plan.bedrooms)} · ${formatBathrooms(plan.bathrooms)} · ${formatSquareFeet(plan.squareFeet)}`;
}

export const bedroomTypeLabels: Record<BedroomType, string> = {
  studio: "Studio",
  "one-bed": "One Bedroom",
  "two-bed": "Two Bedrooms",
};

export const availabilityLabels: Record<Availability, string> = {
  available: "Available",
  "coming-soon": "Coming Soon",
  "contact-leasing": "Contact Leasing",
};

/** Local calendar date as YYYY-MM-DD, for comparing against <input type="date">. */
export function todayIso(): string {
  const now = new Date();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${now.getFullYear()}-${month}-${day}`;
}
