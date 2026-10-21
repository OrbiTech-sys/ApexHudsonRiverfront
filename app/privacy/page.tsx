import Link from "next/link";
import { PageIntro } from "@/components/layout/page-intro";
import { DemoNotice } from "@/components/shared/demo-notice";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Privacy",
  description:
    "Privacy information placeholder for the Apex Hudson Riverfront website concept.",
  path: "/privacy",
});

export default function PrivacyPage() {
  return (
    <>
      <PageIntro
        title="Privacy."
        description="A placeholder for the property's privacy policy."
      />
      <section className="section-y">
        <div className="container-page max-w-3xl space-y-6 leading-relaxed text-ink-2">
          <DemoNotice>
            No privacy policy has been supplied for this proof of concept.
            Before launch, replace this page with Apex Hudson Riverfront&rsquo;s
            approved policy.
          </DemoNotice>
          <p>
            What this demonstration does with your information: the tour request
            form validates what you type in your browser and shows a demo
            confirmation. It does not send, store or share your entries, and the
            site does not set up accounts or take payments.
          </p>
          <p>
            A production site that delivers inquiries to the leasing team will
            need a policy that explains what is collected, why, who receives it
            and how long it is kept.
          </p>
          <p>
            <Link
              href="/contact"
              className="font-semibold text-river-deep underline underline-offset-4"
            >
              Contact the leasing team
            </Link>{" "}
            with any questions.
          </p>
        </div>
      </section>
    </>
  );
}
