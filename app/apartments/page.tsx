import { Suspense } from "react";
import { ApartmentExplorer } from "@/components/apartments/apartment-explorer";
import { ExplorerFallback } from "@/components/apartments/explorer-fallback";
import { PageIntro } from "@/components/layout/page-intro";
import { DemoNotice } from "@/components/shared/demo-notice";
import { pageMetadata } from "@/lib/seo";
import {
  listApartments,
  listBathroomOptions,
} from "@/lib/repository/apartments";

export const metadata = pageMetadata({
  title: "Apartments for Rent in Yonkers, NY",
  description:
    "Browse studio, one-bedroom and two-bedroom floor plans at Apex Hudson Riverfront in Yonkers, New York. Filter by size, rent and availability, then request a tour.",
  path: "/apartments",
});

export default async function ApartmentsPage() {
  const [plans, bathroomOptions] = await Promise.all([
    listApartments(),
    listBathroomOptions(),
  ]);

  return (
    <>
      <PageIntro
        title="Find the floor plan that fits."
        description="Compare studio, one-bedroom and two-bedroom layouts. Filter by size, rent and availability, then request a tour of the ones you like."
      >
        <DemoNotice className="mt-8 max-w-3xl">
          Floor plans, rents and availability on this page are illustrative demo
          data. They do not represent real-time inventory. Contact the leasing
          team for current details.
        </DemoNotice>
      </PageIntro>

      <Suspense fallback={<ExplorerFallback plans={plans} />}>
        <ApartmentExplorer plans={plans} bathroomOptions={bathroomOptions} />
      </Suspense>
    </>
  );
}
