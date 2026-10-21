import Link from "next/link";
import { MapPin, Phone, Mail } from "lucide-react";
import { ResidentPortalLink } from "@/components/layout/resident-portal-link";
import { Wordmark } from "@/components/layout/wordmark";
import {
  copyrightYear,
  demoDisclaimer,
  formattedAddress,
  primaryNav,
  site,
  tourHref,
} from "@/data/site";

const linkClass =
  "inline-flex min-h-11 items-center text-sm text-ink-2 transition-colors hover:text-river-deep";

export function SiteFooter() {
  const { contact } = site;

  return (
    <footer className="border-t border-line bg-paper-2 text-ink">
      <div className="container-page grid gap-12 py-14 lg:grid-cols-12 lg:py-16">
        <div className="lg:col-span-5">
          <Wordmark />
          <address className="mt-7 space-y-1 text-sm leading-relaxed text-ink-2 not-italic">
            <p>{site.address.street}</p>
            <p>
              {site.address.city}, {site.address.region} {site.address.postalCode}
            </p>
          </address>
          <ul className="mt-4 space-y-1">
            {contact.phone && contact.phoneHref ? (
              <li>
                <a href={contact.phoneHref} className={linkClass}>
                  <Phone className="mr-2.5 size-4 text-river-deep" aria-hidden="true" />
                  {contact.phone}
                </a>
              </li>
            ) : null}
            {contact.email ? (
              <li>
                <a href={`mailto:${contact.email}`} className={`${linkClass} [overflow-wrap:anywhere]`}>
                  <Mail className="mr-2.5 size-4 shrink-0 text-river-deep" aria-hidden="true" />
                  {contact.email}
                </a>
              </li>
            ) : null}
            <li>
              <a
                href={site.googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={linkClass}
              >
                <MapPin className="mr-2.5 size-4 text-river-deep" aria-hidden="true" />
                View on Google Maps
                <span className="sr-only"> (opens in a new tab)</span>
              </a>
            </li>
          </ul>
        </div>

        <nav aria-label="Footer" className="lg:col-span-3">
          <h2 className="label-caps font-sans text-ink-3">Explore</h2>
          <ul className="mt-3">
            {primaryNav.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className={linkClass}>
                  {item.label}
                </Link>
              </li>
            ))}
            <li>
              <Link href={tourHref} className={linkClass}>
                Schedule a Tour
              </Link>
            </li>
          </ul>
        </nav>

        <div className="lg:col-span-4">
          <h2 className="label-caps font-sans text-ink-3">Residents and legal</h2>
          <ul className="mt-3">
            <li>
              <ResidentPortalLink showStatus className={`${linkClass} gap-2`} />
            </li>
            <li>
              <Link href="/privacy" className={linkClass}>
                Privacy
              </Link>
            </li>
            <li>
              <Link href="/accessibility" className={linkClass}>
                Accessibility
              </Link>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-line">
        <div className="container-page flex flex-col gap-3 py-6 text-xs leading-relaxed text-ink-3 lg:flex-row lg:items-start lg:justify-between">
          <p>
            &copy; {copyrightYear} {site.name}. {formattedAddress}.
          </p>
          <p className="max-w-2xl lg:text-right">{demoDisclaimer}</p>
        </div>
      </div>
    </footer>
  );
}
