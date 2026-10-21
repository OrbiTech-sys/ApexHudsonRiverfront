import type { ImageAsset } from "@/types/property";

/**
 * Central image registry.
 *
 * All photography here is DEMO imagery from Unsplash (Unsplash License: free
 * for commercial use, no attribution required). None of it depicts Apex
 * Hudson Riverfront. Replace each entry with authorized property photography
 * (set `isPlaceholder: false`) before launch. Every other module refers to
 * images through `image("key")`, so swapping a file here updates the site.
 */

type Entry = { id: string; alt: string };

const catalog = {
  // Exteriors
  heroExterior: {
    id: "photo-1545324418-cc1a3fa10c00",
    alt: "Contemporary apartment building with a deep blue facade and balconies against a clear sky",
  },
  exteriorBalconies: {
    id: "photo-1460317442991-0ec209397118",
    alt: "Residential building with rows of balconies and a warm accent facade",
  },
  exteriorModern: {
    id: "photo-1515263487990-61b07816b324",
    alt: "Modern residential building with large windows against a blue sky",
  },

  // Interiors
  studioInterior: {
    id: "photo-1493809842364-78817add7ffb",
    alt: "Bright studio apartment with herringbone wood floors, a blue sofa and large windows",
  },
  studioLoft: {
    id: "photo-1522708323590-d24dbb6b0267",
    alt: "Light-filled open living space with a red accent chair and tall windows",
  },
  livingMinimal: {
    id: "photo-1513694203232-719a280e022f",
    alt: "Minimal living space with a dark sofa, a dresser and a floor plant",
  },
  bedroomBright: {
    id: "photo-1571508601891-ca5e7a713859",
    alt: "Bright bedroom with striped bedding, framed prints and houseplants",
  },
  bedroomCalm: {
    id: "photo-1522771739844-6a9f6d5f14af",
    alt: "Calm bedroom with soft linens and a bedside lamp",
  },
  bedroomWarm: {
    id: "photo-1540518614846-7eded433c457",
    alt: "Bedroom with white linens, an orange bench and warm artwork",
  },
  livingPlants: {
    id: "photo-1502672260266-1c1ef2d93688",
    alt: "Sunlit living room with plants, a sofa and a wooden chair",
  },
  livingBlue: {
    id: "photo-1505691938895-1758d7feb511",
    alt: "Living room with a white sofa, patterned cushions and tall windows",
  },
  livingYellow: {
    id: "photo-1586023492125-27b2c045efd7",
    alt: "Minimal living room with a yellow armchair and framed art",
  },
  livingView: {
    id: "photo-1564078516393-cf04bd966897",
    alt: "Double-height living room with evening light through tall windows",
  },
  livingOpen: {
    id: "photo-1600607687939-ce8a6c25118c",
    alt: "Open-plan living area with a light sofa and a wood feature wall",
  },
  livingGray: {
    id: "photo-1600121848594-d8644e57abab",
    alt: "Living room with a gray sectional sofa and large windows",
  },
  livingAiry: {
    id: "photo-1600210492486-724fe5c67fb0",
    alt: "Airy living room with tall windows, plants and a tan leather chair",
  },
  kitchenBar: {
    id: "photo-1484154218962-a197022b5858",
    alt: "White kitchen with stainless appliances, pendant lights and bar stools",
  },
  kitchenMarble: {
    id: "photo-1556911220-bff31c812dba",
    alt: "Bright white kitchen with a marble counter and fresh lemons",
  },

  // Amenities (illustrative of the amenity type, not of Apex's spaces)
  fitness: {
    id: "photo-1558611848-73f7eb4001a1",
    alt: "Fitness room with free weights and a large window",
  },
  pool: {
    id: "photo-1571896349842-33c89424de2d",
    alt: "Illuminated pool at dusk beside a modern building",
  },
  terrace: {
    id: "photo-1559339352-11d035aa65de",
    alt: "Waterside terrace with turquoise chairs beneath an awning",
  },
  lounge: {
    id: "photo-1536376072261-38c75010e6c9",
    alt: "Shared lounge with a green sofa, bookshelves and a dining table",
  },
  business: {
    id: "photo-1431540015161-0bf868a2d407",
    alt: "Conference room with a long table and floor-to-ceiling windows",
  },

  // Location
  waterfrontPier: {
    id: "photo-1439066615861-d1af74d74000",
    alt: "Wooden pier extending over calm water toward a tree-lined shore",
  },
  manhattanAerial: {
    id: "photo-1499092346589-b9b6be3e94b2",
    alt: "Aerial view of the Manhattan skyline beside a river and bridge",
  },
  manhattanSunset: {
    id: "photo-1555109307-f7d9da25c244",
    alt: "The Manhattan skyline at sunset with a tall landmark tower",
  },
} satisfies Record<string, Entry>;

export type ImageKey = keyof typeof catalog;

export function unsplashUrl(id: string, width = 2000): string {
  return `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${width}&q=75`;
}

/** 1200x630 crop for Open Graph and Twitter cards. */
export function ogImage(key: ImageKey = "heroExterior") {
  const entry: Entry = catalog[key];
  return {
    url: `https://images.unsplash.com/${entry.id}?auto=format&fit=crop&w=1200&h=630&q=75`,
    width: 1200,
    height: 630,
    alt: entry.alt,
  };
}

/** Resolve a registry key to a typed image asset. */
export function image(key: ImageKey, width = 2000): ImageAsset {
  const entry: Entry = catalog[key];
  return {
    src: unsplashUrl(entry.id, width),
    alt: entry.alt,
    width,
    height: Math.round(width * 0.667),
    isPlaceholder: true,
  };
}
