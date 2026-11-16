import { useSyncExternalStore } from "react";
import { TRIPS, type Trip } from "./data";

export type Booking = {
  id: string;
  ref: string;
  tripId: string;
  tripTitle: string;
  date: string;
  departureIndex: number;
  departureLabel: string;
  seats: number[];
  name: string;
  email: string;
  phone: string;
  participantNames: string;
  note: string;
  insurance: boolean;
  total: number;
  createdAt: string;
};

export type State = {
  overrides: Record<string, Partial<Trip>>;
  custom: Trip[];
  bookings: Booking[];
};

const KEY = "catrio.p2.v1";
const empty: State = { overrides: {}, custom: [], bookings: [] };

function load(): State {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return empty;
    const parsed = JSON.parse(raw) as State;
    return {
      overrides: parsed.overrides ?? {},
      custom: parsed.custom ?? [],
      bookings: parsed.bookings ?? [],
    };
  } catch {
    return empty;
  }
}

let state: State = load();
const listeners = new Set<() => void>();

function emit() {
  listeners.forEach((fn) => fn());
}

function save() {
  try {
    localStorage.setItem(KEY, JSON.stringify(state));
  } catch {
    /* storage may be unavailable */
  }
  emit();
}

export function getState() {
  return state;
}

export function subscribe(fn: () => void) {
  listeners.add(fn);
  return () => listeners.delete(fn);
}

export function useStore() {
  return useSyncExternalStore(subscribe, getState, getState);
}

export function allTrips(s: State = state): Trip[] {
  const base = TRIPS.map((trip) => ({ ...trip, ...(s.overrides[trip.id] ?? {}) }));
  return [...base, ...s.custom];
}

export function publishedTrips(s: State = state): Trip[] {
  return allTrips(s).filter((trip) => trip.published);
}

export function findTrip(id: string, s: State = state): Trip | undefined {
  return allTrips(s).find((trip) => trip.id === id);
}

export function saveTrip(trip: Trip) {
  const base = TRIPS.some((item) => item.id === trip.id);
  if (base) {
    state = { ...state, overrides: { ...state.overrides, [trip.id]: trip } };
  } else {
    state = { ...state, custom: state.custom.map((item) => (item.id === trip.id ? trip : item)) };
  }
  save();
}

export function createTrip(trip: Trip) {
  state = { ...state, custom: [...state.custom, trip] };
  save();
}

export function deleteTrip(id: string) {
  const base = TRIPS.some((item) => item.id === id);
  if (base) {
    state = {
      ...state,
      overrides: { ...state.overrides, [id]: { published: false } },
    };
  } else {
    state = {
      ...state,
      custom: state.custom.filter((item) => item.id !== id),
      bookings: state.bookings.filter((booking) => booking.tripId !== id),
    };
  }
  save();
}

export function addBooking(booking: Booking) {
  state = { ...state, bookings: [...state.bookings, booking] };
  save();
}

const ADMIN_KEY = "catrio.p2.admin.v1";

export function isAdmin() {
  try {
    return sessionStorage.getItem(ADMIN_KEY) === "open";
  } catch {
    return false;
  }
}

export function setAdmin(open: boolean) {
  try {
    if (open) sessionStorage.setItem(ADMIN_KEY, "open");
    else sessionStorage.removeItem(ADMIN_KEY);
  } catch {
    /* ignore */
  }
  emit();
}

export function useAdmin() {
  return useSyncExternalStore(subscribe, isAdmin, isAdmin);
}

export const PASSPHRASE = "trio2027";

export function seatCountFor(trip: Trip) {
  return Math.max(5, Math.min(61, Math.round(trip.seatCount || 49)));
}
