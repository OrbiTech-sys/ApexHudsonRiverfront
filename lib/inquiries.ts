import type { TourInquiry } from "@/types/property";

export interface InquiryResult {
  ok: true;
  /** Always false in this proof of concept: nothing leaves the browser. */
  delivered: false;
  mode: "demo";
}

/**
 * Service boundary for tour requests.
 *
 * There is no backend in this proof of concept, so the inquiry is validated
 * and then discarded. To go live, replace the body with a Server Action,
 * route handler or CRM / property-management integration that actually
 * delivers the request to the leasing team and returns `delivered: true`.
 */
export async function submitTourInquiry(
  inquiry: TourInquiry,
): Promise<InquiryResult> {
  void inquiry;
  return { ok: true, delivered: false, mode: "demo" };
}
