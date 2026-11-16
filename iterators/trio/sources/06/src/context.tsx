import { createContext, useContext } from 'react';
import content from './content.json';
export const VARIANT: number = 6;
export const STORE = `trio-v${VARIANT}`;
export type Language = 'cs' | 'en';
export type Trip = typeof content.trips[number] & { images?: string[] };
export type BookingRecord = { id: string; tripId: string; name: string; email: string; phone: string; departure: string; departureIndex: number; seats: number[]; participants: string[]; note: string; total: number; created: string };
export type AppContext = { lang: Language; t: (cs: string, en: string) => string; trips: Trip[]; bookings: BookingRecord[]; saveTrips: (trips: Trip[]) => void; saveBooking: (booking: BookingRecord) => void; money: (amount: number) => string; date: (value: string) => string };
export const Context = createContext<AppContext>(null!);
export const useApp = () => useContext(Context);
export const categories = [
  { id: 'advent', cs: 'Adventní zájezdy', en: 'Advent trips', icon: 'spark' },
  { id: 'culture', cs: 'Muzikály a divadla', en: 'Musicals & theatre', icon: 'ticket' },
  { id: 'spa', cs: 'Termální lázně', en: 'Thermal spas', icon: 'water' },
  { id: 'greece', cs: 'Řecko 2027', en: 'Greece 2027', icon: 'sun' },
];
export const imageNames = ['10244l.jpg','10292l.jpg','10294l.jpg','10303l.jpg','10307l.jpg','10313l.jpg','10321l.jpg','10322l.jpg','10323l.jpg','8087l.jpg','hero.jpg','hero-2.jpg','hero-3.jpg','hero-4.jpg','hotel-sissy.jpg','vienna-christmas-market.jpg','vienna-christmas-market-portrait.jpg'];
export function readStore<T,>(key: string, fallback: T): T { try { return JSON.parse(localStorage.getItem(`${STORE}-${key}`) || 'null') ?? fallback; } catch { return fallback; } }
export function writeStore(key: string, value: unknown) { localStorage.setItem(`${STORE}-${key}`, JSON.stringify(value)); }
export function go(path: string) { window.location.hash = path; }
