import { ArrowUpRight, Mail, MapPin, Phone } from "lucide-react";
import { TourRequestForm } from "@/components/forms/tour-request-form";
import { TourRequestsList } from "@/components/forms/tour-requests-list";
import { PageIntro } from "@/components/layout/page-intro";
import { ResidentPortalLink } from "@/components/layout/resident-portal-link";
import { DemoNotice } from "@/components/shared/demo-notice";
import { site } from "@/data/site";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Contact Leasing and Schedule a Tour",
  description:
    "Contact the Apex Hudson Riverfront leasing team in Yonkers, NY, or use the tour request form to share your preferred apartment type, date and time.",
  path: "/contact",
});

export default function ContactPage() {
  const { contact } = site;

  return (
    <>
      <PageIntro
        title="Contact leasing."
        description="Ask a question, or tell us when you would like to see the community."
      />

      <section id="tour" aria-labelledby="tour-title" className="section-y">
        <div className="container-page grid gap-14 lg:grid-cols-12 lg:gap-16">
          <div className="order-2 lg:order-1 lg:col-span-6">
            <h2 id="tour-title" className="display-md text-ink">
              Request a tour
            </h2>
            <p className="mt-4 max-w-xl leading-relaxed text-ink-3">
              Share a few details and your preferred timing. Optional fields can
              be left blank.
            </p>
            <TourRequestForm className="mt-8" />
            <TourRequestsList />
          </div>

          <aside
            aria-label="Leasing office"
            className="order-1 lg:order-2 lg:col-span-5 lg:col-start-8"
          >
            <div className="border border-line bg-paper-2 p-6 sm:p-8 lg:sticky lg:top-[calc(var(--header-h)+1.5rem)]">
              <h2 className="font-display text-3xl text-ink">Leasing office</h2>

              <address className="mt-6 space-y-5 text-ink-2 not-italic">
                <div className="flex gap-3">
                  <MapPin
                    className="mt-1 size-5 shrink-0 text-river-deep"
                    aria-hidden="true"
                  />
                  <div>
                    <p>{site.address.street}</p>
                    <p>
                      {site.address.city}, {site.address.region}{" "}
                      {site.address.postalCode}
                    </p>
                    <a
                      href={site.googleMapsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-1 inline-flex min-h-11 items-center gap-1.5 text-sm font-semibold text-river-deep underline underline-offset-4"
                    >
                      View on Google Maps
                      <ArrowUpRight className="size-3.5" aria-hidden="true" />
                      <span className="sr-only"> (opens in a new tab)</span>
                    </a>
                  </div>
                </div>

                {contact.phone && contact.phoneHref ? (
                  <div className="flex gap-3">
                    <Phone
                      className="mt-1 size-5 shrink-0 text-river-deep"
                      aria-hidden="true"
                    />
                    <a
                      href={contact.phoneHref}
                      className="inline-flex min-h-11 items-center font-medium text-ink hover:text-river-deep"
                    >
                      {contact.phone}
                    </a>
                  </div>
                ) : null}

                {contact.email ? (
                  <div className="flex gap-3">
                    <Mail
                      className="mt-1 size-5 shrink-0 text-river-deep"
                      aria-hidden="true"
                    />
                    <a
                      href={`mailto:${contact.email}`}
                      className="inline-flex min-h-11 items-center font-medium text-ink [overflow-wrap:anywhere] hover:text-river-deep"
                    >
                      {contact.email}
                    </a>
                  </div>
                ) : null}
              </address>

              <DemoNotice className="mt-6">
                Contact details come from a public City of Yonkers listing and
                will be confirmed with property management before launch.
              </DemoNotice>

              <div className="mt-6 border-t border-line pt-6">
                <h3 className="label-caps font-sans text-ink-3">
                  Current residents
                </h3>
                <ResidentPortalLink className="mt-2 min-h-11 text-base font-medium text-ink" />
              </div>
            </div>
          </aside>
        </div>
      </section>
    </>
  );
}
