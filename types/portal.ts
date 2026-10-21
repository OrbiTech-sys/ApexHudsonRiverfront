/**
 * Types for the DEMO Resident Portal. Everything here is sample data held in
 * the browser; none of it is a real resident, lease or payment. Shapes mirror
 * what a real property-management API or database would return.
 */

export interface ResidentProfile {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  notifyEmail: boolean;
  notifySms: boolean;
  autopay: boolean;
}

export interface LeaseSummary {
  unitLabel: string;
  planName: string;
  planSlug: string;
  /** ISO dates, YYYY-MM-DD. */
  startDate: string;
  endDate: string;
  monthlyRent: number;
  securityDeposit: number;
  rentDueDay: number;
}

export type LedgerEntryType = "charge" | "payment";

export interface LedgerEntry {
  id: string;
  /** ISO date, YYYY-MM-DD. For charges this is the due date. */
  date: string;
  type: LedgerEntryType;
  description: string;
  /** Always positive; `type` decides the direction. */
  amount: number;
  reference?: string;
  method?: string;
}

export type MaintenanceCategory =
  | "plumbing"
  | "electrical"
  | "heating-cooling"
  | "appliances"
  | "doors-locks"
  | "pests"
  | "other";

export type MaintenancePriority = "routine" | "urgent";

export type MaintenanceStatus =
  | "submitted"
  | "scheduled"
  | "in-progress"
  | "completed"
  | "cancelled";

export type MaintenanceLocation =
  | "kitchen"
  | "bathroom"
  | "bedroom"
  | "living-area"
  | "entry-other";

export type MaintenanceWindow = "any" | "morning" | "afternoon";

export interface MaintenanceUpdate {
  id: string;
  /** ISO timestamp. */
  at: string;
  message: string;
  by: "resident" | "property";
}

export interface MaintenanceRequest {
  id: string;
  number: string;
  category: MaintenanceCategory;
  priority: MaintenancePriority;
  location: MaintenanceLocation;
  description: string;
  permissionToEnter: boolean;
  preferredWindow: MaintenanceWindow;
  status: MaintenanceStatus;
  createdAt: string;
  updates: MaintenanceUpdate[];
}

export interface Announcement {
  id: string;
  title: string;
  body: string;
  date: string;
}

export interface PortalDocument {
  id: string;
  title: string;
  description: string;
  updated: string;
}

export interface RenewalRequest {
  status: "none" | "requested";
  termMonths?: number;
  requestedAt?: string;
  reference?: string;
}

export interface PortalData {
  profile: ResidentProfile;
  lease: LeaseSummary;
  ledger: LedgerEntry[];
  requests: MaintenanceRequest[];
  announcements: Announcement[];
  documents: PortalDocument[];
  renewal: RenewalRequest;
}

export interface PortalState {
  version: 1;
  signedIn: boolean;
  data: PortalData;
}

export interface SavedTourRequest {
  id: string;
  reference: string;
  createdAt: string;
  inquiry: import("@/types/property").TourInquiry;
}

export interface TourRequestsState {
  version: 1;
  requests: SavedTourRequest[];
}
