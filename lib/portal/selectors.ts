import type { LedgerEntry, MaintenanceRequest } from "@/types/portal";

const round = (value: number) => Math.round(value * 100) / 100;

export interface OutstandingCharge {
  entry: LedgerEntry;
  remaining: number;
}

/**
 * Applies payments to charges oldest-first and returns what is still owed.
 * Keeps balance logic in one place so a real ledger API can replace it.
 */
export function outstandingCharges(ledger: LedgerEntry[]): OutstandingCharge[] {
  let credit = round(
    ledger
      .filter((entry) => entry.type === "payment")
      .reduce((sum, entry) => sum + entry.amount, 0),
  );

  const charges = ledger
    .filter((entry) => entry.type === "charge")
    .sort((a, b) => a.date.localeCompare(b.date));

  const owed: OutstandingCharge[] = [];
  for (const entry of charges) {
    const covered = Math.min(entry.amount, credit);
    credit = round(credit - covered);
    const remaining = round(entry.amount - covered);
    if (remaining > 0) owed.push({ entry, remaining });
  }
  return owed;
}

export function ledgerBalance(ledger: LedgerEntry[]): number {
  return round(
    outstandingCharges(ledger).reduce((sum, item) => sum + item.remaining, 0),
  );
}

/** Newest first: the order a resident expects to read a statement. */
export function sortLedger(ledger: LedgerEntry[]): LedgerEntry[] {
  return [...ledger].sort(
    (a, b) => b.date.localeCompare(a.date) || b.id.localeCompare(a.id),
  );
}

export function isOpen(request: MaintenanceRequest): boolean {
  return request.status !== "completed" && request.status !== "cancelled";
}

export function sortRequests(requests: MaintenanceRequest[]): MaintenanceRequest[] {
  return [...requests].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}
