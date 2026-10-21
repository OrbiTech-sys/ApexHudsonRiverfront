import Link from "next/link";
import { PageIntro } from "@/components/layout/page-intro";
import { DemoNotice } from "@/components/shared/demo-notice";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Accessibility",
  description:
    "Accessibility information placeholder for the Apex Hudson Riverfront website concept.",
  path: "/accessibility",
});

export default function AccessibilityPage() {
  return (
    <>
      <PageIntro
        title="Accessibility."
        description="A placeholder for the property's accessibility statement."
      />
      <section className="section-y">
        <div className="container-page max-w-3xl space-y-6 leading-relaxed text-ink-2">
          <DemoNotice>
            This is a proof of concept. A formal accessibility statement, the
            conformance target and a contact process must be supplied by
            Apex Hudson Riverfront before launch.
          </DemoNotice>
          <p>
            This design was built with accessibility in mind: semantic
            landmarks, keyboard-operable navigation and filters, visible focus
            indicators, labelled form fields with inline error messages, text
            alternatives for images, and support for reduced-motion
            preferences. It has not been through a formal audit.
          </p>
          <p>
            If something on this site is hard to use,{" "}
            <Link
              href="/contact"
              className="font-semibold text-river-deep underline underline-offset-4"
            >
              contact the leasing team
            </Link>
            .
          </p>
        </div>
      </section>
    </>
  );
}
