/**
 * Domain types for the Apex Hudson Riverfront site.
 *
 * These mirror the shape a future database (e.g. Drizzle tables) would return.
 * Keep them free of UI concerns: icons are referenced by name, images by path.
 */

/** How well a piece of content has been confirmed. */
export type ContentStatus =
  /** Confirmed by the client or an official property source. */
  | "verified"
  /** Taken from a public listing or record; client sign-off still needed. */
  | "pending-confirmation"
  /** Placeholder / demo data that must not be read as real inventory. */
  | "illustrative";

export type BedroomType = "studio" | "one-bed" | "two-bed";

export type Availability = "available" | "coming-soon" | "contact-leasing";

export interface ImageAsset {
  src: string;
  alt: string;
  width: number;
  height: number;
  /** True while this is stock or demo imagery rather than Apex photography. */
  isPlaceholder: boolean;
}

export interface ApartmentFeatures {
  /** False until the leasing team confirms the in-unit feature list. */
  verified: boolean;
  items: string[];
  note?: string;
}

export interface ApartmentFloorPlan {
  id: string;
  slug: string;
  name: string;
  bedroomType: BedroomType;
  bedrooms: number;
  bathrooms: number;
  squareFeet: number;
  /** Monthly rent in USD, or null when rent is not published. */
  startingRent: number | null;
  rentStatus: ContentStatus;
  availability: Availability;
  availabilityStatus: ContentStatus;
  summary: string;
  features: ApartmentFeatures;
  image: ImageAsset;
  gallery: ImageAsset[];
  featured: boolean;
  /** Default sort position for "Featured" ordering. */
  sortOrder: number;
}

export type AmenityCategory =
  | "fitness-wellness"
  | "outdoor"
  | "social"
  | "services"
  | "interiors";

export type AmenityIconName =
  | "waves"
  | "dumbbell"
  | "sun"
  | "flame"
  | "sofa"
  | "briefcase"
  | "car";

export interface Amenity {
  id: string;
  slug: string;
  title: string;
  category: AmenityCategory;
  description: string;
  /** Optional short bullet list of included features. */
  details: string[];
  icon: AmenityIconName;
  image: ImageAsset | null;
  featuredOnHome: boolean;
  status: ContentStatus;
  /** Where this was sourced, so it can be verified before launch. */
  source: string;
}

export interface AmenityGroup {
  category: AmenityCategory;
  title: string;
  description: string;
}

export type TourApartmentType = "no-preference" | BedroomType;

export type TourTimePreference = "morning" | "afternoon" | "evening";

export interface TourInquiry {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  apartmentType: TourApartmentType;
  preferredDate?: string;
  preferredTime?: TourTimePreference | "";
  message?: string;
  consent: boolean;
}

export interface PropertyAddress {
  street: string;
  city: string;
  region: string;
  postalCode: string;
  country: string;
}

export interface PropertyContact {
  phone: string | null;
  phoneHref: string | null;
  email: string | null;
  status: ContentStatus;
  source: string;
}

export interface SiteConfig {
  name: string;
  shortName: string;
  tagline: string;
  description: string;
  address: PropertyAddress;
  contact: PropertyContact;
  /** Null until a real portal URL is provided. Never invent one. */
  residentPortalUrl: string | null;
  managedBy: string;
  googleMapsUrl: string;
}

export interface TransitOption {
  id: string;
  title: string;
  description: string;
  href?: string;
  status: ContentStatus;
  source: string;
}

export interface LocalPlace {
  id: string;
  title: string;
  description: string;
  kind: "attraction" | "dining" | "everyday";
  href?: string;
  status: ContentStatus;
  source: string;
}

export interface NeighborhoodContent {
  headline: string;
  intro: string;
  waterfront: {
    title: string;
    body: string;
    image: ImageAsset;
  };
  manhattan: {
    title: string;
    body: string;
    image: ImageAsset;
  };
  transit: TransitOption[];
  places: LocalPlace[];
  notes: string[];
}
