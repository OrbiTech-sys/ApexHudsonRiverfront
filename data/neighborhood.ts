import type { NeighborhoodContent } from "@/types/property";
import { image } from "@/data/images";

/**
 * Location content. Everything here is a general fact about Yonkers or the
 * Metro-North Hudson Line. Walking times, drive times, distances and commute
 * durations are intentionally omitted: none has been verified for this
 * address. Add them only with a source.
 */
export const neighborhood: NeighborhoodContent = {
  headline: "A Hudson River address in downtown Yonkers",
  intro:
    "Yonkers sits on the east bank of the Hudson River in Westchester County, just north of New York City. Apex Hudson Riverfront is at 20 Water Grant Street, in downtown Yonkers.",
  waterfront: {
    title: "The Yonkers waterfront",
    body: "The Hudson River defines the setting: open water, wide skies and a public waterfront to explore. Views vary by residence, so ask which homes have river views when you tour.",
    image: image("waterfrontPier", 1800),
  },
  manhattan: {
    title: "Manhattan, by rail",
    body: "Metro-North's Hudson Line connects Yonkers with Grand Central Terminal in Manhattan, so the city is a train ride away. Check the MTA schedule for current service and fares.",
    image: image("manhattanAerial", 1800),
  },
  transit: [
    {
      id: "transit-metro-north",
      title: "Metro-North Hudson Line",
      description:
        "Yonkers station is on the Hudson Line, with service to Grand Central Terminal in Manhattan and to stations up the Hudson Valley.",
      href: "https://www.mta.info/agency/metro-north-railroad",
      status: "verified",
      source: "MTA Metro-North Railroad",
    },
    {
      id: "transit-bee-line",
      title: "Bee-Line Bus",
      description:
        "Westchester County's Bee-Line bus system serves Yonkers and connects to neighboring communities.",
      status: "verified",
      source: "Westchester County Bee-Line Bus System",
    },
  ],
  places: [
    {
      id: "place-hudson-river-museum",
      title: "Hudson River Museum",
      description:
        "Westchester's largest museum, with American art, science exhibits and a planetarium, at 511 Warburton Avenue.",
      kind: "attraction",
      href: "https://www.hrm.org",
      status: "verified",
      source: "Hudson River Museum",
    },
    {
      id: "place-philipse-manor",
      title: "Philipse Manor Hall State Historic Site",
      description:
        "A historic manor house in downtown Yonkers near the train station, telling the story of the Philipse lands.",
      kind: "attraction",
      status: "verified",
      source: "Visit Westchester",
    },
    {
      id: "place-riverwalk",
      title: "Hudson River boardwalk and waterfront",
      description:
        "A walkable stretch of the Yonkers waterfront with river views and public art along the shore.",
      kind: "attraction",
      status: "verified",
      source: "Visit Westchester",
    },
    {
      id: "place-dining",
      title: "Dining and everyday errands",
      description:
        "Downtown Yonkers and the waterfront have restaurants, cafés and shops. Your leasing team can share current favorites.",
      kind: "dining",
      status: "pending-confirmation",
      source: "General description; leasing team to supply named recommendations",
    },
  ],
  notes: [
    "Distances and travel times are omitted until they can be verified for 20 Water Grant Street.",
    "Rail schedules and fares change. Confirm current service with the MTA before planning a commute.",
  ],
};
