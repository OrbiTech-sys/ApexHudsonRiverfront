import { apartments, bedroomTypeBlurbs } from "@/data/apartments";
import { bedroomTypeLabels } from "@/lib/format";
import type { ApartmentFloorPlan, BedroomType } from "@/types/property";

/**
 * Data-access boundary for apartments.
 *
 * Every function is async and returns plain objects, so a future
 * implementation can swap the mock arrays for Drizzle queries without
 * touching any component. UI code must import from here, never from `data/`.
 */

export async function listApartments(): Promise<ApartmentFloorPlan[]> {
  return apartments;
}

export async function listApartmentSlugs(): Promise<string[]> {
  return apartments.map((plan) => plan.slug);
}

export async function getApartmentBySlug(
  slug: string,
): Promise<ApartmentFloorPlan | null> {
  return apartments.find((plan) => plan.slug === slug) ?? null;
}

export async function listFeaturedApartments(
  limit = 6,
): Promise<ApartmentFloorPlan[]> {
  return apartments.filter((plan) => plan.featured).slice(0, limit);
}

/** Same bedroom count first, then the rest, never including the plan itself. */
export async function listRelatedApartments(
  plan: ApartmentFloorPlan,
  limit = 3,
): Promise<ApartmentFloorPlan[]> {
  const others = apartments.filter((candidate) => candidate.id !== plan.id);
  const sameType = others.filter(
    (candidate) => candidate.bedroomType === plan.bedroomType,
  );
  const rest = others.filter(
    (candidate) => candidate.bedroomType !== plan.bedroomType,
  );
  return [...sameType, ...rest].slice(0, limit);
}

export async function listBathroomOptions(): Promise<number[]> {
  return [...new Set(apartments.map((plan) => plan.bathrooms))].sort(
    (a, b) => a - b,
  );
}

export async function listBedroomTypes() {
  return (Object.keys(bedroomTypeLabels) as BedroomType[]).map((type) => ({
    type,
    label: bedroomTypeLabels[type],
    ...bedroomTypeBlurbs[type],
  }));
}
