# Apex Hudson Riverfront: website redesign concept

A frontend proof of concept for a premium apartment-leasing site for **Apex Hudson Riverfront**, 20 Water Grant Street, Yonkers, NY 10701. It demonstrates apartment discovery, floor-plan detail and tour requests. It is a redesign concept: the property already has a website, and nothing here claims otherwise.

Built with Next.js 16 (App Router, Cache Components), TypeScript, Tailwind CSS v4, shadcn/ui (Radix), Lucide, React Hook Form and Zod.

## Run it

```bash
npm install
npm run dev        # http://localhost:3000
```

```bash
npm run lint       # ESLint
npx tsc --noEmit   # type-check
npm run build      # production build
npm run start      # serve the production build
```

Optional environment variables (see [Before production](#before-production)):

| Variable | Purpose |
| --- | --- |
| `NEXT_PUBLIC_SITE_URL` | Production origin, e.g. `https://example.com`. Enables canonical URLs, `metadataBase` and the sitemap. |
| `NEXT_PUBLIC_ALLOW_INDEXING` | Set to `true` to allow search indexing. Off by default so the concept never competes with the existing site. |

## Pages

| Route | Notes |
| --- | --- |
| `/` | Hero, Find Your Place, featured floor plans, waterfront lifestyle, amenities, neighborhood, tour CTA |
| `/apartments` | Filter (bedrooms, bathrooms, rent, size, availability), sort, result count, empty state. Filters live in the URL, e.g. `/apartments?type=studio` |
| `/apartments/[slug]` | Gallery, specs, availability disclaimer, floor-plan placeholder, tour form, related plans |
| `/amenities`, `/neighborhood` | Grouped, editable content |
| `/contact` | Leasing details and the tour request form (`#tour`) |
| `/privacy`, `/accessibility` | Clearly marked placeholders |

Unknown plan slugs return a real HTTP 404 (see `proxy.ts`).

## Architecture

```
app/                 Routes, metadata, robots, sitemap
components/
  layout/ home/ apartments/ amenities/ forms/ shared/   Feature components
  ui/                shadcn/ui primitives (restyled)
data/                Mock content only: apartments, amenities, neighborhood, site, images
lib/
  repository/        Data-access boundary (async functions over the mock data)
  apartment-filters.ts  Pure filter / sort / URL-serialization logic
  validation.ts      Zod schema + small RHF resolver
  inquiries.ts       Tour-request service boundary (demo only)
types/property.ts    Domain types (floor plan, amenity, inquiry, contact, ...)
proxy.ts             Returns 404 for unknown floor-plan slugs
```

**UI code reads content only through `lib/repository/*`**, never from `data/`. Every function there is async and returns plain objects, so a future Drizzle implementation can replace the mock arrays without touching components. Types in `types/property.ts` are shaped like database rows (icons are referenced by name, images by URL).

Design tokens (colors, type scale, radius) live in `app/globals.css`. Fonts are Cormorant Garamond (display) and Hanken Grotesk (body), loaded with `next/font`.

## Content status

Nothing in the data is presented as confirmed unless it is. Each record carries a `status` (`verified`, `pending-confirmation` or `illustrative`) and, where relevant, a `source`.

| Content | Status |
| --- | --- |
| Address, property name | Provided in the brief |
| Phone `(914) 600-1060` and email | From a City of Yonkers Affordable Housing Ordinance listing. **Confirm it is the general leasing contact.** |
| Amenities | Compiled from public rental listings. **Client to confirm each one.** |
| Floor plans, sizes, rents, availability | **Illustrative demo data.** Not real inventory. Labelled "Demo" in the UI |
| In-unit features | Intentionally empty until verified |
| Transit and local places | General, sourced facts. Distances and commute times are deliberately omitted |
| Photography | **Stock images (Unsplash License)** that do not depict the property. Registry in `data/images.ts` |
| Resident Portal | `residentPortalUrl` is `null`. The UI shows a disabled, labelled placeholder |

## Before production

1. **Photography:** replace the stock images in `data/images.ts` with authorized Apex photography and set `isPlaceholder: false`. Remove the `images.unsplash.com` entry from `next.config.ts`.
2. **Real inventory:** swap `lib/repository/apartments.ts` for the property-management system or a database (Drizzle is planned). Remove the "Demo" labels and notices once data is real. Drop `proxy.ts`'s in-memory lookup for an indexed query or cached slug list.
3. **Tour requests:** `lib/inquiries.ts` validates and discards. Implement delivery (Server Action or route handler plus CRM or email) and update the success copy, which currently states that nothing was sent. Add a privacy notice and spam protection.
4. **Confirm facts:** leasing phone and email, every amenity, and any plan names, sizes and rents. Supply named dining recommendations if wanted.
5. **Resident Portal:** set `residentPortalUrl` in `data/site.ts` to the real URL.
6. **Legal pages:** replace the `/privacy` and `/accessibility` placeholders with approved content, and run a formal accessibility audit.
7. **Domain and SEO:** set `NEXT_PUBLIC_SITE_URL`, then `NEXT_PUBLIC_ALLOW_INDEXING=true` only when this should replace or sit alongside the existing site. Replace the Open Graph image with a branded one. Add structured data only for verified facts.
8. **Logo:** the wordmark and `app/icon.svg` are typographic stand-ins for official brand assets.
9. **Copyright year** is a constant in `data/site.ts` (the clock cannot be read during render with Cache Components).

## Not included (by design)

No database or ORM, authentication, resident dashboard, rent payments, maintenance requests, email delivery, admin area, tenant screening or real-time inventory sync.
