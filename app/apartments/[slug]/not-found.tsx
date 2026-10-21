import Link from "next/link";
import { PageIntro } from "@/components/layout/page-intro";
import { Button } from "@/components/ui/button";

export const metadata = { title: "Apartment not found" };

export default function ApartmentNotFound() {
  return (
    <PageIntro
      title="We could not find that floor plan."
      description="The link may be out of date, or the floor plan may no longer be listed. Browse every floor plan or contact the leasing team."
      className="min-h-[60vh]"
    >
      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <Button asChild>
          <Link href="/apartments">Back to Apartments</Link>
        </Button>
        <Button asChild variant="outline">
          <Link href="/contact">Contact Leasing</Link>
        </Button>
      </div>
    </PageIntro>
  );
}
