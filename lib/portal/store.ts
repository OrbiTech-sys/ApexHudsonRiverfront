import type {
  LedgerEntry,
  MaintenanceCategory,
  MaintenanceLocation,
  MaintenancePriority,
  MaintenanceRequest,
  MaintenanceWindow,
  PortalState,
  ResidentProfile,
} from "@/types/portal";
import {
  maintenanceFlow,
  maintenanceFlowMessages,
} from "@/data/portal";
import {
  createLocalStore,
  makeId,
  makeReference,
} from "@/lib/demo/local-store";
import { addMonths, formatMonth, fromIso, toIso } from "@/lib/portal/dates";
import { createPortalSeed } from "@/lib/portal/seed";
import { ledgerBalance } from "@/lib/portal/selectors";

function isPortalState(value: unknown): value is PortalState {
  if (typeof value !== "object" || value === null) return false;
  const state = value as Partial<PortalState>;
  return (
    state.version === 1 &&
    typeof state.signedIn === "boolean" &&
    typeof state.data === "object" &&
    state.data !== null
  );
}

export const portalStore = createLocalStore<PortalState>({
  key: "apex-demo-portal-v1",
  seed: () => createPortalSeed(new Date()),
  isValid: isPortalState,
});

const update = portalStore.update;

export interface PaymentInput {
  amount: number;
  methodLabel: string;
}

export interface MaintenanceInput {
  category: MaintenanceCategory;
  priority: MaintenancePriority;
  location: MaintenanceLocation;
  description: string;
  permissionToEnter: boolean;
  preferredWindow: MaintenanceWindow;
}

/**
 * Every mutation the demo portal supports. Components call these instead of
 * touching storage, so each one maps cleanly onto a future API endpoint.
 */
export const portalActions = {
  signIn() {
    update((state) => ({ ...state, signedIn: true }));
  },

  signOut() {
    update((state) => ({ ...state, signedIn: false }));
  },

  /** Records a demo payment. Returns null if the amount is not payable. */
  makePayment({ amount, methodLabel }: PaymentInput): LedgerEntry | null {
    let created: LedgerEntry | null = null;
    update((state) => {
      const balance = ledgerBalance(state.data.ledger);
      if (!(amount > 0) || amount > balance) return state;
      created = {
        id: makeId("pay"),
        date: toIso(new Date()),
        type: "payment",
        description: "Payment received",
        amount,
        reference: makeReference(),
        method: methodLabel,
      };
      return {
        ...state,
        data: { ...state.data, ledger: [...state.data.ledger, created] },
      };
    });
    return created;
  },

  /** Demo tool: post the next month's rent charge so payment can be tried again. */
  postNextCharge() {
    update((state) => {
      const { ledger, lease } = state.data;
      const lastCharge = ledger
        .filter((entry) => entry.type === "charge")
        .map((entry) => entry.date)
        .sort()
        .pop();
      const base = lastCharge ? fromIso(lastCharge) : new Date();
      const due = addMonths(base, 1, lease.rentDueDay);
      const charge: LedgerEntry = {
        id: makeId("chg"),
        date: toIso(due),
        type: "charge",
        description: `Rent for ${formatMonth(due)}`,
        amount: lease.monthlyRent,
      };
      return {
        ...state,
        data: { ...state.data, ledger: [...ledger, charge] },
      };
    });
  },

  submitRequest(input: MaintenanceInput): MaintenanceRequest {
    const now = new Date().toISOString();
    let created!: MaintenanceRequest;
    update((state) => {
      const highest = state.data.requests.reduce(
        (max, request) => Math.max(max, Number(request.number.replace(/\D/g, ""))),
        1042,
      );
      created = {
        id: makeId("req"),
        number: `M-${highest + 1}`,
        ...input,
        description: input.description.trim(),
        status: "submitted",
        createdAt: now,
        updates: [
          { id: makeId("upd"), at: now, message: "Request submitted.", by: "resident" },
        ],
      };
      return {
        ...state,
        data: { ...state.data, requests: [created, ...state.data.requests] },
      };
    });
    return created;
  },

  addRequestNote(requestId: string, message: string) {
    const text = message.trim();
    if (!text) return;
    const at = new Date().toISOString();
    update((state) => ({
      ...state,
      data: {
        ...state.data,
        requests: state.data.requests.map((request) =>
          request.id === requestId
            ? {
                ...request,
                updates: [
                  ...request.updates,
                  { id: makeId("upd"), at, message: text, by: "resident" },
                ],
              }
            : request,
        ),
      },
    }));
  },

  cancelRequest(requestId: string) {
    const at = new Date().toISOString();
    update((state) => ({
      ...state,
      data: {
        ...state.data,
        requests: state.data.requests.map((request) =>
          request.id === requestId &&
          request.status !== "completed" &&
          request.status !== "cancelled"
            ? {
                ...request,
                status: "cancelled",
                updates: [
                  ...request.updates,
                  {
                    id: makeId("upd"),
                    at,
                    message: maintenanceFlowMessages.cancelled,
                    by: "resident",
                  },
                ],
              }
            : request,
        ),
      },
    }));
  },

  /** Demo tool: plays the part of the property team moving a request along. */
  advanceRequest(requestId: string) {
    const at = new Date().toISOString();
    update((state) => ({
      ...state,
      data: {
        ...state.data,
        requests: state.data.requests.map((request) => {
          if (request.id !== requestId) return request;
          const index = maintenanceFlow.indexOf(request.status);
          const next = maintenanceFlow[index + 1];
          if (index === -1 || !next) return request;
          return {
            ...request,
            status: next,
            updates: [
              ...request.updates,
              {
                id: makeId("upd"),
                at,
                message: maintenanceFlowMessages[next],
                by: "property",
              },
            ],
          };
        }),
      },
    }));
  },

  updateProfile(patch: Partial<ResidentProfile>) {
    update((state) => ({
      ...state,
      data: { ...state.data, profile: { ...state.data.profile, ...patch } },
    }));
  },

  requestRenewal(termMonths: number) {
    update((state) => ({
      ...state,
      data: {
        ...state.data,
        renewal: {
          status: "requested",
          termMonths,
          requestedAt: new Date().toISOString(),
          reference: makeReference("RENEW"),
        },
      },
    }));
  },

  withdrawRenewal() {
    update((state) => ({
      ...state,
      data: { ...state.data, renewal: { status: "none" } },
    }));
  },

  /** Restores the original sample data and keeps the session signed in. */
  resetData() {
    update((state) => ({
      ...createPortalSeed(new Date()),
      signedIn: state.signedIn,
    }));
  },
};

