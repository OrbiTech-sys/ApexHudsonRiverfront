"use client";

import { useSyncExternalStore } from "react";
import type { TourRequestsState } from "@/types/portal";
import { tourRequestsStore } from "@/lib/demo/tour-requests";

/** Saved demo tour requests, or null until the browser copy has loaded. */
export function useTourRequests(): TourRequestsState | null {
  return useSyncExternalStore(
    tourRequestsStore.subscribe,
    tourRequestsStore.getSnapshot,
    tourRequestsStore.getServerSnapshot,
  );
}
