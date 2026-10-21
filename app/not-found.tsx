import Link from "next/link";
import { PageIntro } from "@/components/layout/page-intro";
import { Button } from "@/components/ui/button";

export const metadata = { title: "Page not found" };

export default function NotFound() {
  return (
    <PageIntro
      title="We could not find that page."
      description="The link may be out of date or mistyped. Head back to the homepage or browse available floor plans."
      className="min-h-[60vh]"
    >
      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <Button asChild>
          <Link href="/">Back to Home</Link>
        </Button>
        <Button asChild variant="outline">
          <Link href="/apartments">Browse Apartments</Link>
        </Button>
      </div>
    </PageIntro>
  );
}
