import Link from "next/link";
import { PageIntro } from "@/components/layout/page-intro";
import { DemoNotice } from "@/components/shared/demo-notice";
import { site } from "@/data/site";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Accessibility",
  description:
    "The accessibility features of the Apex Hudson Riverfront website concept, known limitations and how to ask for help.",
  path: "/accessibility",
});

const features = [
  "Every page has one main heading, landmarks and a skip link to the main content.",
  "All navigation, filters, forms and the resident portal work with a keyboard, and focus is always visible.",
  "Form fields have visible labels, required fields are marked, and errors are described next to the field.",
  "Text and controls meet WCAG AA contrast, and touch targets are at least 44 pixels tall.",
  "Photographs have text descriptions. Decorative images are hidden from assistive technology.",
  "Motion is minimal and is reduced further when your device asks for reduced motion.",
  "Pages reflow from phone to wide desktop without horizontal scrolling.",
];

const limitations = [
  "This concept has not been through a formal accessibility audit.",
  "Floor-plan drawings are schematic placeholders, not scaled plans.",
  "Photographs are stock images, so their descriptions are general rather than specific to a home.",
];

export default function AccessibilityPage() {
  return (
    <>
      <PageIntro
        title="Accessibility."
        description="What this site does to be usable by everyone, and where it falls short."
      />
      <section className="section-y">
        <div className="container-page max-w-3xl space-y-10 leading-relaxed text-ink-2">
          <DemoNotice>
            This is a draft statement for a demonstration. Before launch, the
            property should confirm its conformance target (for example WCAG
            2.2 AA), complete an audit and publish an approved statement.
          </DemoNotice>

          <section aria-labelledby="a11y-features">
            <h2 id="a11y-features" className="font-display text-3xl text-ink">
              What we built in
            </h2>
            <ul className="mt-4 list-disc space-y-2 pl-5 marker:text-river">
              {features.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </section>

          <section aria-labelledby="a11y-limits">
            <h2 id="a11y-limits" className="font-display text-3xl text-ink">
              Known limitations
            </h2>
            <ul className="mt-4 list-disc space-y-2 pl-5 marker:text-river">
              {limitations.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </section>

          <section aria-labelledby="a11y-help">
            <h2 id="a11y-help" className="font-display text-3xl text-ink">
              Ask for help or report a problem
            </h2>
            <p className="mt-3">
              If something is hard to use, or you need information in another
              format,{" "}
              <Link
                href="/contact"
                className="font-semibold text-river-deep underline underline-offset-4"
              >
                contact the leasing team
              </Link>
              {site.contact.phone && site.contact.phoneHref ? (
                <>
                  {" "}
                  or call{" "}
                  <a
                    href={site.contact.phoneHref}
                    className="font-semibold text-river-deep underline underline-offset-4"
                  >
                    {site.contact.phone}
                  </a>
                </>
              ) : null}
              .
            </p>
          </section>
        </div>
      </section>
    </>
  );
}
