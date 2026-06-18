/**
 * {name} — Utility Library
 */

/** Debounce a function — delays invocation until after `ms` idle */
export function debounce(fn, ms = 300) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), ms);
  };
}

/** Throttle a function — ensures at most one call per `ms` interval */
export function throttle(fn, ms = 300) {
  let last = 0;
  return (...args) => {
    const now = Date.now();
    if (now - last >= ms) {
      last = now;
      fn(...args);
    }
  };
}

/** Deep clone a value (JSON-safe) */
export function deepClone(value) {
  return JSON.parse(JSON.stringify(value));
}

/** Format a date to ISO-like string: YYYY-MM-DD HH:mm:ss */
export function formatDate(date = new Date()) {
  const pad = (n) => String(n).padStart(2, "0");
  const d = date instanceof Date ? date : new Date(date);
  if (isNaN(d)) throw new TypeError("Invalid date value");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
}

/** Read a JSON file, returning a fallback on error */
export function readJSON(path, fallback = null) {
  try {
    const fs = require("fs");
    const data = fs.readFileSync(path, "utf-8");
    return JSON.parse(data);
  } catch {
    return fallback;
  }
}

/** Simple retry wrapper for async functions */
export async function retry(fn, { tries = 3, delay = 1000 } = {}) {
  for (let attempt = 1; attempt <= tries; attempt++) {
    try {
      return await fn();
    } catch (err) {
      if (attempt === tries) throw err;
      await new Promise((r) => setTimeout(r, delay));
    }
  }
}

/** Group an array by a key function */
export function groupBy(arr, keyFn) {
  return arr.reduce((acc, item) => {
    const key = keyFn(item);
    (acc[key] ??= []).push(item);
    return acc;
  }, {});
}

export default { debounce, throttle, deepClone, formatDate, readJSON, retry, groupBy };
