import type {
  ApartmentFeatures,
  ApartmentFloorPlan,
  BedroomType,
} from "@/types/property";
import { image } from "@/data/images";

/**
 * ILLUSTRATIVE DEMO DATA.
 *
 * None of the plans below describe real inventory at Apex Hudson Riverfront.
 * Names, sizes, rents and availability are placeholders that exist so the
 * discovery, filtering and detail flows can be demonstrated. Replace this file
 * (or the repository that reads it) with data from the property's system of
 * record before launch.
 */

const unconfirmedFeatures: ApartmentFeatures = {
  verified: false,
  items: [],
  note: "In-unit features vary by residence. Your leasing team confirms the details for each home during a tour.",
};

interface PlanSeed {
  slug: string;
  name: string;
  bedroomType: BedroomType;
  bedrooms: number;
  bathrooms: number;
  squareFeet: number;
  startingRent: number;
  availability: ApartmentFloorPlan["availability"];
  summary: string;
  featured: boolean;
  gallery: Parameters<typeof image>[0][];
}

const seeds: PlanSeed[] = [
  {
    slug: "studio-s1",
    name: "Studio S1",
    bedroomType: "studio",
    bedrooms: 0,
    bathrooms: 1,
    squareFeet: 505,
    startingRent: 2150,
    availability: "available",
    summary:
      "An efficient studio that keeps living, sleeping and cooking in one calm, open room.",
    featured: true,
    gallery: ["studioInterior", "kitchenMarble", "bedroomCalm"],
  },
  {
    slug: "studio-s2",
    name: "Studio S2",
    bedroomType: "studio",
    bedrooms: 0,
    bathrooms: 1,
    squareFeet: 548,
    startingRent: 2290,
    availability: "coming-soon",
    summary:
      "A slightly larger studio with room to separate a work corner from the sleeping area.",
    featured: false,
    gallery: ["studioLoft", "kitchenBar", "bedroomCalm"],
  },
  {
    slug: "one-bedroom-a1",
    name: "One Bedroom A1",
    bedroomType: "one-bed",
    bedrooms: 1,
    bathrooms: 1,
    squareFeet: 640,
    startingRent: 2540,
    availability: "available",
    summary:
      "A one-bedroom with a defined bedroom and an open living and dining space.",
    featured: true,
    gallery: ["livingPlants", "kitchenBar", "bedroomBright"],
  },
  {
    slug: "one-bedroom-a2",
    name: "One Bedroom A2",
    bedroomType: "one-bed",
    bedrooms: 1,
    bathrooms: 1,
    squareFeet: 705,
    startingRent: 2690,
    availability: "contact-leasing",
    summary:
      "A larger one-bedroom with generous living space and a separate sleeping room.",
    featured: true,
    gallery: ["livingBlue", "kitchenMarble", "bedroomWarm"],
  },
  {
    slug: "one-bedroom-a3",
    name: "One Bedroom A3",
    bedroomType: "one-bed",
    bedrooms: 1,
    bathrooms: 1,
    squareFeet: 760,
    startingRent: 2830,
    availability: "available",
    summary:
      "A spacious one-bedroom suited to hosting, working from home or both.",
    featured: false,
    gallery: ["livingYellow", "kitchenBar", "bedroomCalm"],
  },
  {
    slug: "one-bedroom-a4",
    name: "One Bedroom A4",
    bedroomType: "one-bed",
    bedrooms: 1,
    bathrooms: 1.5,
    squareFeet: 810,
    startingRent: 2960,
    availability: "coming-soon",
    summary:
      "A one-bedroom with an added half bath, convenient for guests.",
    featured: false,
    gallery: ["livingView", "kitchenMarble", "bedroomBright"],
  },
  {
    slug: "two-bedroom-b1",
    name: "Two Bedroom B1",
    bedroomType: "two-bed",
    bedrooms: 2,
    bathrooms: 1,
    squareFeet: 890,
    startingRent: 3280,
    availability: "available",
    summary:
      "A two-bedroom with a shared bath, good for roommates, a home office or a growing household.",
    featured: true,
    gallery: ["livingOpen", "kitchenBar", "bedroomWarm"],
  },
  {
    slug: "two-bedroom-b2",
    name: "Two Bedroom B2",
    bedroomType: "two-bed",
    bedrooms: 2,
    bathrooms: 2,
    squareFeet: 960,
    startingRent: 3520,
    availability: "coming-soon",
    summary:
      "A two-bedroom, two-bath layout with space for both privacy and gathering.",
    featured: true,
    gallery: ["livingGray", "kitchenMarble", "bedroomCalm"],
  },
  {
    slug: "two-bedroom-b3",
    name: "Two Bedroom B3",
    bedroomType: "two-bed",
    bedrooms: 2,
    bathrooms: 2,
    squareFeet: 1060,
    startingRent: 3860,
    availability: "contact-leasing",
    summary:
      "The most generous demo layout, with two full baths and an expansive living area.",
    featured: false,
    gallery: ["livingAiry", "kitchenBar", "bedroomBright"],
  },
];

export const apartments: ApartmentFloorPlan[] = seeds.map((seed, index) => {
  const [primary, ...rest] = seed.gallery.map((key) => image(key, 1800));
  return {
    id: `plan-${seed.slug}`,
    slug: seed.slug,
    name: seed.name,
    bedroomType: seed.bedroomType,
    bedrooms: seed.bedrooms,
    bathrooms: seed.bathrooms,
    squareFeet: seed.squareFeet,
    startingRent: seed.startingRent,
    rentStatus: "illustrative",
    availability: seed.availability,
    availabilityStatus: "illustrative",
    summary: seed.summary,
    features: unconfirmedFeatures,
    image: primary,
    gallery: [primary, ...rest],
    featured: seed.featured,
    sortOrder: index,
  };
});

export const bedroomTypeBlurbs: Record<
  BedroomType,
  { description: string; image: ReturnType<typeof image> }
> = {
  studio: {
    description:
      "Open, efficient living for one, designed around a single flexible room.",
    image: image("studioInterior", 1400),
  },
  "one-bed": {
    description:
      "A separate bedroom and more room to live, host and work from home.",
    image: image("bedroomBright", 1400),
  },
  "two-bed": {
    description:
      "Space for roommates, a home office or a household that needs a little more.",
    image: image("livingOpen", 1400),
  },
};
