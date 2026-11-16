import { AppState, SEED_BOOKINGS, SEED_TRIPS } from "./data";

const STATE_KEY = "ca-trio-9-state-v1";
const LANG_KEY = "ca-trio-9-lang";
const ADMIN_KEY = "ca-trio-9-admin";

export function loadState(): AppState {
  try {
    const raw = localStorage.getItem(STATE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as AppState;
      if (parsed && Array.isArray(parsed.trips) && Array.isArray(parsed.bookings)) return parsed;
    }
  } catch {
    /* ignore corrupt storage */
  }
  return { trips: SEED_TRIPS, bookings: SEED_BOOKINGS };
}

export function saveState(state: AppState) {
  try {
    localStorage.setItem(STATE_KEY, JSON.stringify(state));
  } catch {
    /* storage may be full or blocked */
  }
}

export function loadLang(): "cs" | "en" {
  try {
    return localStorage.getItem(LANG_KEY) === "en" ? "en" : "cs";
  } catch {
    return "cs";
  }
}

export function saveLang(lang: "cs" | "en") {
  try {
    localStorage.setItem(LANG_KEY, lang);
  } catch {
    /* ignore */
  }
}

export function isAdmin(): boolean {
  try {
    return sessionStorage.getItem(ADMIN_KEY) === "yes";
  } catch {
    return false;
  }
}

export function setAdmin(value: boolean) {
  try {
    if (value) sessionStorage.setItem(ADMIN_KEY, "yes");
    else sessionStorage.removeItem(ADMIN_KEY);
  } catch {
    /* ignore */
  }
}

export function makeRef(): string {
  const year = new Date().getFullYear().toString().slice(2);
  const n = Math.floor(1000 + Math.random() * 9000);
  return `CT-${year}-${n}`;
}
