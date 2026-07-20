/**
 * useLocalStorage.ts
 *
 * A generic, type-safe React hook for reading and writing values to localStorage.
 *
 * Why this hook?
 *   The checkout page, my-invites page, and invitation pages all manually
 *   call `localStorage.getItem` / `JSON.parse` / `JSON.stringify` in useEffect.
 *   This hook centralises that pattern, adds SSR safety (window check), and
 *   eliminates try/catch boilerplate at every call site.
 *
 * Usage:
 *   const [slug, setSlug] = useLocalStorage<string>("varnam_active_slug", "");
 *   const [data, setData] = useLocalStorage<InviteData>("varnam_active_custom_data", null);
 *
 * Sprint 3 migration note:
 *   When we move to server-side session storage, callers of this hook will
 *   be the only files that need updating — not every page individually.
 */

"use client";

import { useState, useCallback } from "react";

export function useLocalStorage<T>(
  key: string,
  initialValue: T
): [T, (value: T | ((prev: T) => T)) => void, () => void] {
  // ---------------------------------------------------------------------------
  // State initialiser
  // ---------------------------------------------------------------------------

  const [storedValue, setStoredValue] = useState<T>(() => {
    // Guard against SSR: localStorage is not available on the server.
    if (typeof window === "undefined") {
      return initialValue;
    }

    try {
      const item = window.localStorage.getItem(key);
      return item !== null ? (JSON.parse(item) as T) : initialValue;
    } catch (error) {
      console.warn(`[useLocalStorage] Failed to read key "${key}":`, error);
      return initialValue;
    }
  });

  // ---------------------------------------------------------------------------
  // Setter — mirrors the React setState signature (value or updater function)
  // ---------------------------------------------------------------------------

  const setValue = useCallback(
    (value: T | ((prev: T) => T)) => {
      try {
        const valueToStore =
          value instanceof Function ? value(storedValue) : value;

        setStoredValue(valueToStore);

        if (typeof window !== "undefined") {
          window.localStorage.setItem(key, JSON.stringify(valueToStore));
        }
      } catch (error) {
        console.warn(`[useLocalStorage] Failed to write key "${key}":`, error);
      }
    },
    [key, storedValue]
  );

  // ---------------------------------------------------------------------------
  // Remover — clears the key from storage and resets to initialValue
  // ---------------------------------------------------------------------------

  const removeValue = useCallback(() => {
    try {
      setStoredValue(initialValue);
      if (typeof window !== "undefined") {
        window.localStorage.removeItem(key);
      }
    } catch (error) {
      console.warn(`[useLocalStorage] Failed to remove key "${key}":`, error);
    }
  }, [key, initialValue]);

  return [storedValue, setValue, removeValue];
}
