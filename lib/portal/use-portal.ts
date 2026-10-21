"use client";

import { useSyncExternalStore } from "react";
import type { PortalData, PortalState } from "@/types/portal";
import { portalStore } from "@/lib/portal/store";

/**
 * Current portal state, or null until the browser copy has loaded (and during
 * server rendering), so callers can show a real loading state.
 */
export function usePortalState(): PortalState | null {
  return useSyncExternalStore(
    portalStore.subscribe,
    portalStore.getSnapshot,
    portalStore.getServerSnapshot,
  );
}

/** Resident data, or null while loading or signed out. */
export function usePortalData(): PortalData | null {
  const state = usePortalState();
  return state && state.signedIn ? state.data : null;
}
