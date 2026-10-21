import { neighborhood } from "@/data/neighborhood";
import type { NeighborhoodContent } from "@/types/property";

/** Data-access boundary for location content. See `lib/repository/apartments.ts`. */

export async function getNeighborhood(): Promise<NeighborhoodContent> {
  return neighborhood;
}
