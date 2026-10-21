import Link from "next/link";
import { PageIntro } from "@/components/layout/page-intro";
import { ClearDemoData } from "@/components/shared/clear-demo-data";
import { DemoNotice } from "@/components/shared/demo-notice";
import { site } from "@/data/site";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Privacy",
  description:
    "How the Apex Hudson Riverfront website concept handles information: what the demo saves in your browser and what it does not collect.",
  path: "/privacy",
});

const sections = [
  {
    title: "What this website collects",
    body: [
      "This is a demonstration. It has no server-side database and does not send what you type to the property or to any third party.",
      "If you use the tour request form, the request is validated in your browser and saved in your browser's local storage under a reference number. It is not delivered to the leasing team.",
      "If you use the demo Resident Portal, the sample resident, payments, maintenance requests and preferences you create are also saved in your browser's local storage. No real accounts, card numbers or bank details are collected.",
    ],
  },
  {
    title: "Cookies and local storage",
    body: [
      "The site does not set advertising or analytics cookies. It uses your browser's local storage for the demo features above, and only to make them work between visits.",
    ],
  },
  {
    title: "Other services",
    body: [
      "Photography is served from Unsplash, so your browser may request image files from that service. Links to Google Maps, the MTA and other sites open those sites, which have their own privacy practices.",
    ],
  },
  {
    title: "Your choices",
    body: [
      "You can remove everything this demo has saved in your browser at any time with the button below. Clearing your browser's site data has the same effect.",
    ],
  },
];

export default function PrivacyPage() {
  return (
    <>
      <PageIntro
        title="Privacy."
        description="What this demonstration does, and does not do, with your information."
      />
      <section className="section-y">
        <div className="container-page max-w-3xl space-y-10 leading-relaxed text-ink-2">
          <DemoNotice>
            This is sample text written for a demonstration, not legal advice.
            Replace it with Apex Hudson Riverfront&rsquo;s approved privacy
            policy before launch.
          </DemoNotice>

          {sections.map((section, index) => (
            <section key={section.title} aria-labelledby={`privacy-section-${index}`}>
              <h2
                id={`privacy-section-${index}`}
                className="font-display text-3xl text-ink"
              >
                {section.title}
              </h2>
              <div className="mt-3 space-y-4">
                {section.body.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>
            </section>
          ))}

          <ClearDemoData />

          <p>
            Questions?{" "}
            <Link
              href="/contact"
              className="font-semibold text-river-deep underline underline-offset-4"
            >
              Contact the leasing team
            </Link>
            {site.contact.email ? (
              <>
                {" "}
                or write to{" "}
                <a
                  href={`mailto:${site.contact.email}`}
                  className="font-semibold text-river-deep underline underline-offset-4 [overflow-wrap:anywhere]"
                >
                  {site.contact.email}
                </a>
              </>
            ) : null}
            .
          </p>
        </div>
      </section>
    </>
  );
}
