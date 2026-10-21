import { amenities, amenityGroups, interiorsNote } from "@/data/amenities";
import type { Amenity, AmenityGroup } from "@/types/property";

/** Data-access boundary for amenities. See `lib/repository/apartments.ts`. */

export async function listAmenities(): Promise<Amenity[]> {
  return amenities;
}

export async function listHomeAmenities(): Promise<Amenity[]> {
  return amenities.filter((amenity) => amenity.featuredOnHome);
}

export async function listAmenityGroups(): Promise<AmenityGroup[]> {
  return amenityGroups;
}

export async function getInteriorsNote(): Promise<string> {
  return interiorsNote;
}
