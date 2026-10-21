import type { Amenity, AmenityGroup } from "@/types/property";
import { image } from "@/data/images";

/**
 * Amenities compiled from public rental listings for the property. They are
 * consistent across sources but NOT yet confirmed by the client, so each entry
 * is `pending-confirmation`. Do not add an amenity without a source.
 */
const listingSource =
  "Public rental listings (Zumper, ForRent, ApartmentSearch); client to confirm";

export const amenityGroups: AmenityGroup[] = [
  {
    category: "fitness-wellness",
    title: "Fitness and wellness",
    description: "Space to keep a routine close to home.",
  },
  {
    category: "outdoor",
    title: "Outdoor spaces",
    description: "Places to gather, grill and unwind outside.",
  },
  {
    category: "social",
    title: "Resident social spaces",
    description: "Shared rooms for neighbors to meet, relax and work.",
  },
  {
    category: "services",
    title: "Building services",
    description: "Everyday conveniences that simplify the routine.",
  },
  {
    category: "interiors",
    title: "Apartment interiors",
    description: "What you will see inside each home.",
  },
];

export const amenities: Amenity[] = [
  {
    id: "amenity-fitness",
    slug: "fitness-center",
    title: "Fitness center",
    category: "fitness-wellness",
    description:
      "A resident fitness center for everyday training, without the commute to a gym.",
    details: [],
    icon: "dumbbell",
    image: image("fitness", 1600),
    featuredOnHome: true,
    status: "pending-confirmation",
    source: listingSource,
  },
  {
    id: "amenity-pool",
    slug: "pool",
    title: "Resident pool",
    category: "outdoor",
    description:
      "A pool for residents, one of the community's signature amenities and a place to slow down.",
    details: [],
    icon: "waves",
    image: image("pool", 1600),
    featuredOnHome: true,
    status: "pending-confirmation",
    source: listingSource,
  },
  {
    id: "amenity-roof-terrace",
    slug: "roof-terrace",
    title: "Roof terrace",
    category: "outdoor",
    description:
      "A rooftop terrace with sundeck seating and outdoor grills for warm evenings.",
    details: ["Sundeck seating", "Outdoor grills"],
    icon: "sun",
    image: image("terrace", 1600),
    featuredOnHome: true,
    status: "pending-confirmation",
    source: listingSource,
  },
  {
    id: "amenity-courtyards",
    slug: "courtyards-and-fire-pits",
    title: "Courtyards and fire pits",
    category: "outdoor",
    description:
      "Interior courtyards with fire pits that extend the community outdoors.",
    details: [],
    icon: "flame",
    image: null,
    featuredOnHome: false,
    status: "pending-confirmation",
    source: listingSource,
  },
  {
    id: "amenity-lounge",
    slug: "clubhouse-and-lounge",
    title: "Clubhouse and resident lounge",
    category: "social",
    description:
      "A clubhouse and resident lounge for catching up with neighbors or settling in with a book.",
    details: [],
    icon: "sofa",
    image: image("lounge", 1600),
    featuredOnHome: true,
    status: "pending-confirmation",
    source: listingSource,
  },
  {
    id: "amenity-business",
    slug: "business-center",
    title: "Business center and conference room",
    category: "social",
    description:
      "A business center and conference room for work that needs more than a kitchen table.",
    details: [],
    icon: "briefcase",
    image: image("business", 1600),
    featuredOnHome: false,
    status: "pending-confirmation",
    source: listingSource,
  },
  {
    id: "amenity-services",
    slug: "parking-and-convenience",
    title: "Parking and convenience",
    category: "services",
    description:
      "Building services that take care of the daily details so the routine stays simple.",
    details: ["Parking garage", "Valet trash"],
    icon: "car",
    image: image("exteriorModern", 1600),
    featuredOnHome: true,
    status: "pending-confirmation",
    source: listingSource,
  },
];

/** Interiors copy. No in-unit feature list is published until it is verified. */
export const interiorsNote =
  "Finishes, appliances and layouts vary by residence. Your leasing team confirms the details for each home during a tour.";
