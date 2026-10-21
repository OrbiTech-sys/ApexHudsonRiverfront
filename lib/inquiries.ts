import type { TourInquiry } from "@/types/property";
import type { SavedTourRequest } from "@/types/portal";
import { tourRequestActions } from "@/lib/demo/tour-requests";

export interface InquiryResult {
  ok: true;
  /** Always false in this proof of concept: nothing reaches the leasing team. */
  delivered: false;
  mode: "demo";
  /** The copy saved in this browser, with its reference number. */
  saved: SavedTourRequest;
}

/**
 * Service boundary for tour requests.
 *
 * There is no backend in this proof of concept, so the request is saved to
 * this browser only (see `lib/demo/tour-requests.ts`) so the flow works end
 * to end. To go live, replace the body with a Server Action, route handler or
 * CRM / property-management integration that delivers the request to the
 * leasing team and returns `delivered: true`.
 */
export async function submitTourInquiry(
  inquiry: TourInquiry,
): Promise<InquiryResult> {
  const saved = tourRequestActions.add(inquiry);
  return { ok: true, delivered: false, mode: "demo", saved };
}
