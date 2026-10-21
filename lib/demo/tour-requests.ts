import type { TourInquiry } from "@/types/property";
import type { SavedTourRequest, TourRequestsState } from "@/types/portal";
import {
  createLocalStore,
  makeId,
  makeReference,
} from "@/lib/demo/local-store";

function isTourRequestsState(value: unknown): value is TourRequestsState {
  if (typeof value !== "object" || value === null) return false;
  const state = value as Partial<TourRequestsState>;
  return state.version === 1 && Array.isArray(state.requests);
}

export const tourRequestsStore = createLocalStore<TourRequestsState>({
  key: "apex-demo-tour-requests-v1",
  seed: () => ({ version: 1, requests: [] }),
  isValid: isTourRequestsState,
});

/** Tour requests saved in this browser only. Never delivered anywhere. */
export const tourRequestActions = {
  add(inquiry: TourInquiry): SavedTourRequest {
    const saved: SavedTourRequest = {
      id: makeId("tour"),
      reference: makeReference("TOUR"),
      createdAt: new Date().toISOString(),
      inquiry,
    };
    tourRequestsStore.update((state) => ({
      ...state,
      requests: [saved, ...state.requests],
    }));
    return saved;
  },

  remove(id: string) {
    tourRequestsStore.update((state) => ({
      ...state,
      requests: state.requests.filter((request) => request.id !== id),
    }));
  },

  clear() {
    tourRequestsStore.clear();
  },
};
