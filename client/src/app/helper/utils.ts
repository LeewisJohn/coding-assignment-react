import { THEME_KEY, ThemeMode } from '../constants';

export type Theme = { mode: ThemeMode };

export const getTheme = (): Theme => {
  const localTheme = localStorage.getItem(THEME_KEY);
  return localTheme ? JSON.parse(localTheme) : { mode: ThemeMode.LIGHT };
};

export const setTheme = (mode: ThemeMode): void => {
  localStorage.setItem(
    THEME_KEY,
    JSON.stringify({
      mode: mode === ThemeMode.LIGHT ? ThemeMode.DARK : ThemeMode.LIGHT,
    })
  );
};

// Simple debounce function
export function debounce<T extends (...args: any[]) => void>(func: T, delay: number): (...args: Parameters<T>) => void {
  let timeoutId: ReturnType<typeof setTimeout>;

  return function (...args: Parameters<T>) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      func(...args);
    }, delay);
  };
}

export function areArraysEqual<T>(arr1: T[], arr2: T[]): boolean {
  if (arr1.length !== arr2.length) return false;

  // Function to create a unique string representation of each object (for deep comparison)
  const getKey = (obj: T): string => JSON.stringify(obj);

  // Step 1: Create a `Map` with objects from `arr1`
  const map = new Map<string, number>();
  for (const obj of arr1) {
    const key = getKey(obj);
    map.set(key, (map.get(key) || 0) + 1);
  }

  // Step 2: Check each object in `arr2`
  for (const obj of arr2) {
    const key = getKey(obj);
    if (!map.has(key) || map.get(key) === 0) return false; // Not found or count exhausted
    map.set(key, map.get(key)! - 1);
  }

  // Step 3: Check if `Map` has any non-zero values remaining
  return Array.from(map.values()).every(count => count === 0);
}