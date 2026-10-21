/**
 * A tiny external store persisted to localStorage, for DEMO data only.
 *
 * It is shaped for `useSyncExternalStore`: `getServerSnapshot` returns null so
 * the server render and the first client render agree, and the real value
 * arrives right after hydration. Replace the callers with API calls when a
 * backend exists; components depend on the hooks, not on localStorage.
 */

interface LocalStoreOptions<T> {
  key: string;
  seed: () => T;
  isValid: (value: unknown) => value is T;
}

export interface LocalStore<T> {
  subscribe: (listener: () => void) => () => void;
  getSnapshot: () => T;
  getServerSnapshot: () => null;
  update: (change: (current: T) => T) => void;
  /** Restores seed data and saves it. */
  reset: () => void;
  /** Removes the stored copy entirely; fresh seed data is used in memory. */
  clear: () => void;
}

export function createLocalStore<T>({
  key,
  seed,
  isValid,
}: LocalStoreOptions<T>): LocalStore<T> {
  let cache: T | null = null;
  const listeners = new Set<() => void>();

  const emit = () => listeners.forEach((listener) => listener());

  const read = (): T => {
    if (cache !== null) return cache;
    try {
      const raw = window.localStorage.getItem(key);
      if (raw) {
        const parsed: unknown = JSON.parse(raw);
        if (isValid(parsed)) {
          cache = parsed;
          return cache;
        }
      }
    } catch {
      // Storage unavailable or corrupt: fall through to fresh seed data.
    }
    cache = seed();
    return cache;
  };

  const write = (next: T) => {
    cache = next;
    try {
      window.localStorage.setItem(key, JSON.stringify(next));
    } catch {
      // Private mode or quota: the in-memory copy still works this session.
    }
    emit();
  };

  // Keep other tabs in sync.
  const onStorage = (event: StorageEvent) => {
    if (event.key === key) {
      cache = null;
      emit();
    }
  };

  return {
    subscribe(listener) {
      listeners.add(listener);
      if (listeners.size === 1) window.addEventListener("storage", onStorage);
      return () => {
        listeners.delete(listener);
        if (listeners.size === 0) {
          window.removeEventListener("storage", onStorage);
        }
      };
    },
    getSnapshot: read,
    getServerSnapshot: () => null,
    update: (change) => write(change(read())),
    reset: () => write(seed()),
    clear: () => {
      try {
        window.localStorage.removeItem(key);
      } catch {
        // Nothing to remove if storage is unavailable.
      }
      cache = null;
      emit();
    },
  };
}

/** Short unique id, with a fallback for non-secure contexts. */
export function makeId(prefix: string): string {
  const random =
    typeof crypto !== "undefined" && "randomUUID" in crypto
      ? crypto.randomUUID().replace(/-/g, "").slice(0, 12)
      : Math.random().toString(36).slice(2, 14);
  return `${prefix}_${random}`;
}

/** Human-friendly demo reference such as DEMO-7K4Q2M. */
export function makeReference(prefix = "DEMO"): string {
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let code = "";
  for (let i = 0; i < 6; i += 1) {
    code += alphabet[Math.floor(Math.random() * alphabet.length)];
  }
  return `${prefix}-${code}`;
}
