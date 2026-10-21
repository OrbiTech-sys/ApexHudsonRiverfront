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
| `/contact` | Leasing details and the tour request form (`#tour`). Requests are saved in the browser with a reference number and an Add to calendar (.ics) file |
| `/portal` | **Demo Resident Portal** (see below): overview, payments, maintenance, lease and documents, profile |
| `/privacy`, `/accessibility` | Sample statements, clearly marked as drafts for legal review |

Unknown plan slugs return a real HTTP 404 (see `proxy.ts`).

## Demo Resident Portal

`/portal` is a fully working demonstration with **sample data**. It is linked from the header, footer and mobile menu with a "Demo" tag, and every portal page carries a demo banner.

Sign in with the sample account shown on `/portal/login` (or use "Continue as demo resident"). Then you can:

- see a balance and statement, and make a **demo payment** (partial or full; no card or bank details are collected and no money moves), with a downloadable receipt;
- submit, follow, annotate and cancel **maintenance requests**, and use "Demo: advance status" to play the property team;
- view the lease summary, download sample documents, and request or withdraw a renewal;
- edit contact details, notification preferences and autopay (a flag only; nothing is ever scheduled), and reset all demo data.

All of it is saved in the browser's `localStorage` (keys `apex-demo-portal-v1` and `apex-demo-tour-requests-v1`). There is no server, no real authentication and no security: the sample password is printed on the sign-in page. `/privacy` has a button that clears everything. Portal pages are `noindex` and disallowed in `robots.txt`.

To replace the demo with a real system, keep the components and swap the layer under them: `lib/portal/store.ts` (actions), `lib/portal/seed.ts` (data) and `lib/demo/*` (storage). Add real authentication before exposing any resident data.

## Architecture

```
app/                 Routes, metadata, robots, sitemap
components/
  layout/ home/ apartments/ amenities/ forms/ portal/ shared/   Feature components
  ui/                shadcn/ui primitives (restyled)
data/                Mock content only: apartments, amenities, neighborhood, site, images
lib/
  repository/        Data-access boundary (async functions over the mock data)
  apartment-filters.ts  Pure filter / sort / URL-serialization logic
  validation.ts      Zod schema + small RHF resolver
  inquiries.ts       Tour-request service boundary (saved locally in the demo)
  portal/            Demo portal: store actions, selectors, seed data, sample documents, validation
  demo/              localStorage-backed store, saved tour requests, calendar (.ics) and download helpers
types/property.ts    Domain types (floor plan, amenity, inquiry, contact, ...)
types/portal.ts      Demo portal types (resident, lease, ledger, maintenance, ...)
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
| Resident Portal | **Demo only.** Sample resident, ledger, requests and documents in browser storage. No real portal URL exists, so `residentPortalUrl` is `null` |
| Tour requests | Saved in the visitor's browser only; **never delivered** to the leasing team |
| Amenities | Compiled from public rental listings. **Client to confirm each one.** |
| Floor plans, sizes, rents, availability | **Illustrative demo data.** Not real inventory. Labelled "Demo" in the UI |
| In-unit features | **Illustrative** demo lists, flagged as unconfirmed on each plan page |
| Privacy and accessibility pages | Sample drafts for legal review |
| Transit and local places | General, sourced facts. Distances and commute times are deliberately omitted |
| Photography | **Stock images (Unsplash License)** that do not depict the property. Registry in `data/images.ts` |

## Before production

1. **Photography:** replace the stock images in `data/images.ts` with authorized Apex photography and set `isPlaceholder: false`. Remove the `images.unsplash.com` entry from `next.config.ts`.
2. **Real inventory:** swap `lib/repository/apartments.ts` for the property-management system or a database (Drizzle is planned). Remove the "Demo" labels and notices once data is real. Drop `proxy.ts`'s in-memory lookup for an indexed query or cached slug list.
3. **Tour requests:** `lib/inquiries.ts` validates and saves to the visitor's browser. Implement delivery (Server Action or route handler plus CRM or email), update the success copy (which currently states that nothing was sent), and add spam protection.
4. **Confirm facts:** leasing phone and email, every amenity, and any plan names, sizes and rents. Supply named dining recommendations if wanted.
5. **Resident Portal:** either set `residentPortalUrl` in `data/site.ts` to the property's real portal (the header, footer and menu switch to it automatically) or build a real one: authentication, a payments provider, a maintenance backend and a document store behind `lib/portal/*`. Remove the demo banner, sample credentials and "Demo" tags when real.
6. **Legal pages:** replace the sample `/privacy` and `/accessibility` text with approved content, and run a formal accessibility audit.
7. **Domain and SEO:** set `NEXT_PUBLIC_SITE_URL`, then `NEXT_PUBLIC_ALLOW_INDEXING=true` only when this should replace or sit alongside the existing site. Replace the Open Graph image with a branded one. Add structured data only for verified facts.
8. **Logo:** the wordmark and `app/icon.svg` are typographic stand-ins for official brand assets.
9. **Copyright year** is a constant in `data/site.ts` (the clock cannot be read during render with Cache Components).

## Not included (by design)

No database or ORM, real authentication, real payments, email delivery, admin area, tenant screening or real-time inventory sync. The demo portal imitates a resident dashboard, rent payment and maintenance requests with browser-stored sample data only.
