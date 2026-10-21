import type { SiteConfig } from "@/types/property";

const address = {
  street: "20 Water Grant Street",
  city: "Yonkers",
  region: "NY",
  postalCode: "10701",
  country: "US",
} as const;

const mapsQuery = `${address.street}, ${address.city}, ${address.region} ${address.postalCode}`;

export const site: SiteConfig = {
  name: "Apex Hudson Riverfront",
  shortName: "Apex",
  tagline: "Waterfront apartment living in Yonkers, New York",
  description:
    "Studio, one-bedroom and two-bedroom apartment homes on the Hudson River at 20 Water Grant Street in Yonkers, New York. Explore floor plans and request a tour.",
  address,
  contact: {
    // Listed for this property in the City of Yonkers Affordable Housing
    // Ordinance unit directory. Confirm that it is the general leasing line
    // before launch; replace both values if the leasing office uses others.
    phone: "(914) 600-1060",
    phoneHref: "tel:+19146001060",
    email: "apexhudsonmgr@twocoastliving.com",
    status: "pending-confirmation",
    source:
      "City of Yonkers Affordable Housing Ordinance unit list (public document)",
  },
  // No verified resident portal URL has been provided. Never invent one.
  // Set this to the real address (https://...) and the header, footer and
  // mobile menu will switch from the disabled placeholder to a live link.
  residentPortalUrl: null,
  managedBy: "Two Coast Living",
  googleMapsUrl: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(mapsQuery)}`,
};

export const formattedAddress = `${address.street}, ${address.city}, ${address.region} ${address.postalCode}`;

export const primaryNav = [
  { label: "Apartments", href: "/apartments" },
  { label: "Amenities", href: "/amenities" },
  { label: "Neighborhood", href: "/neighborhood" },
  { label: "Contact", href: "/contact" },
] as const;

export const tourHref = "/contact#tour";

/** Static year: reading the clock during render is not allowed with Cache Components. */
export const copyrightYear = 2026;

export const demoDisclaimer =
  "This site is a redesign concept. Floor plans, rents and availability shown are illustrative demo data and do not represent current inventory.";
