/**
 * {name} — TypeScript Utility Library
 */

/** Debounce a function */
export function debounce<T extends (...args: unknown[]) => unknown>(
  fn: T,
  ms = 300,
): (...args: Parameters<T>) => void {
  let timer: ReturnType<typeof setTimeout>;
  return (...args: Parameters<T>) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), ms);
  };
}

/** Throttle a function */
export function throttle<T extends (...args: unknown[]) => unknown>(
  fn: T,
  ms = 300,
): (...args: Parameters<T>) => void {
  let last = 0;
  return (...args: Parameters<T>) => {
    const now = Date.now();
    if (now - last >= ms) {
      last = now;
      fn(...args);
    }
  };
}

/** Deep clone a JSON-safe value */
export function deepClone<T>(value: T): T {
  return JSON.parse(JSON.stringify(value));
}

/** Format a Date to YYYY-MM-DD HH:mm:ss */
export function formatDate(date: Date | string | number = new Date()): string {
  const d = date instanceof Date ? date : new Date(date);
  if (isNaN(d.getTime())) throw new TypeError("Invalid date value");
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
}

/** Safely read and parse a JSON file */
export function readJSON<T = unknown>(path: string, fallback: T | null = null): T | null {
  try {
    const fs = require("fs");
    const data = fs.readFileSync(path, "utf-8");
    return JSON.parse(data) as T;
  } catch {
    return fallback;
  }
}

/** Retry an async function on failure */
export async function retry<T>(
  fn: () => Promise<T>,
  { tries = 3, delay = 1000 }: { tries?: number; delay?: number } = {},
): Promise<T> {
  for (let attempt = 1; attempt <= tries; attempt++) {
    try {
      return await fn();
    } catch (err) {
      if (attempt === tries) throw err;
      await new Promise((r) => setTimeout(r, delay));
    }
  }
  throw new Error("Unreachable");
}

/** Group an array by a key function */
export function groupBy<T, K extends string | number | symbol>(
  arr: T[],
  keyFn: (item: T) => K,
): Record<K, T[]> {
  return arr.reduce(
    (acc, item) => {
      const key = keyFn(item);
      (acc[key] ??= []).push(item);
      return acc;
    },
    {} as Record<K, T[]>,
  );
}
