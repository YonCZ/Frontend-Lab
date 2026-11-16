import { createContext, useContext } from 'react';
import type { ReactNode } from 'react';
import { variant } from './variant';

export type Locale = 'cs' | 'en';
export type Copy = { title: string; description: string; note: string; included: string[]; excluded: string[]; departures: string[] };
export type Trip = { id: string; category: string; date: string; endDate: string; price: number; image: string; images: string[]; seatCount: number; soldOut: boolean; published: boolean; cs: Copy; en: Copy };
export type Booking = { id: string; tripId: string; date: string; departure: number; departureLabel?: string; seats: number[]; name: string; email: string; phone: string; passengers: string[]; note: string; total: number; created: string };
export type IconName = 'arrow' | 'arrow-up' | 'pin' | 'calendar' | 'bus' | 'phone' | 'check' | 'sun' | 'spark' | 'music' | 'water' | 'chevron' | 'clock' | 'close' | 'seat' | 'filter';
export const storageKey = `trio-${variant}`;
export const categories = ['advent', 'culture', 'spa', 'greece'];
export type DeparturePoint = { place: string; time: string; minutes: number; index: number; label: string };
export function parseDepartures(departures: string[]): DeparturePoint[] {
  const tokens: Array<{ text: string; source: number }> = [];
  departures.forEach((entry, index) => {
    entry.replace(/hod\.?/gi, ' ').split(',').map(token => token.trim()).filter(Boolean).forEach(text => tokens.push({ text, source: index }));
  });
  const items: DeparturePoint[] = [];
  let parts: string[] = [];
  let source = 0;
  for (const token of tokens) {
    const match = token.text.match(/(\d{1,2})[.:](\d{2})/);
    if (match) {
      const before = token.text.slice(0, match.index).trim();
      if (before) parts.push(before);
      const hours = Number(match[1]);
      const place = parts.join(', ');
      const time = `${String(hours).padStart(2, '0')}:${match[2]}`;
      items.push({ place, time, minutes: hours * 60 + Number(match[2]), index: token.source, label: `${time} ${place}` });
      parts = [];
      source = token.source;
    } else {
      parts.push(token.text);
    }
  }
  if (parts.length) items.push({ place: parts.join(', '), time: '', minutes: 9999, index: source, label: parts.join(', ') });
  return items.filter(item => item.place).sort((first, second) => first.minutes - second.minutes);
}
export const demoSeats = [3, 4, 11, 12, 19, 20, 27, 28];
export function readStore<Value,>(key: string, fallback: Value): Value {
  try { return JSON.parse(localStorage.getItem(`${storageKey}-${key}`) || 'null') ?? fallback; } catch { return fallback; }
}
export type TrioContext = {
  locale: Locale; setLocale: (locale: Locale) => void; route: string;
  trips: Trip[]; bookings: Booking[]; saveTrips: (trips: Trip[]) => void; saveBookings: (bookings: Booking[]) => void;
  text: (cs: string, en: string) => string; categoryName: (category: string) => string; price: (value: number) => string;
  date: (value: string, options?: Intl.DateTimeFormatOptions) => string;
  takenSeats: (trip: Trip, date?: string) => number[]; isSoldOut: (trip: Trip) => boolean;
};
export const Context = createContext<TrioContext>(null!);
export const useTrio = () => useContext(Context);
export const navigate = (path: string) => { window.location.hash = path; };

export function Icon({ name, size = 20 }: { name: IconName; size?: number }) {
  const paths: Record<IconName, ReactNode> = {
    arrow: <path d="M4 12h16M14 6l6 6-6 6" />,
    'arrow-up': <path d="M6 18 18 6M6 6h12v12" />,
    pin: <><path d="M19 10c0 5-7 11-7 11S5 15 5 10a7 7 0 1 1 14 0Z" /><circle cx="12" cy="10" r="2" /></>,
    calendar: <><rect x="4" y="5" width="16" height="16" rx="2" /><path d="M8 3v4m8-4v4M4 10h16m-12 4h3m2 0h3m-8 3h3" /></>,
    bus: <><rect x="4" y="3" width="16" height="16" rx="4" /><path d="M4 11h16M8 3v8m8-8v8M7 19v2m10-2v2M7 15h2m6 0h2" /></>,
    phone: <path d="m5 3 4 1 1 4-2 2c1 3 3 5 6 6l2-2 4 1 1 4c-1 3-6 2-10-1S2 7 5 3Z" />,
    check: <path d="m5 12 4 4L19 6" />,
    sun: <><circle cx="12" cy="12" r="4" /><path d="M12 1v3m0 16v3M1 12h3m16 0h3M4 4l2 2m12 12 2 2M4 20l2-2M18 6l2-2" /></>,
    spark: <path d="m12 2 2.5 7.5L22 12l-7.5 2.5L12 22l-2.5-7.5L2 12l7.5-2.5L12 2Z" />,
    music: <><path d="M9 18V5l11-2v13M9 9l11-2" /><ellipse cx="6" cy="18" rx="3" ry="3" /><ellipse cx="17" cy="16" rx="3" ry="3" /></>,
    water: <path d="M3 15q3-4 6 0t6 0 6 0M3 20q3-4 6 0t6 0 6 0M8 2q-3 3 0 6m8-6q-3 3 0 6" />,
    chevron: <path d="m9 5 7 7-7 7" />,
    clock: <><circle cx="12" cy="12" r="9" /><path d="M12 6v6l4 2" /></>,
    close: <path d="m6 6 12 12M6 18 18 6" />,
    seat: <path d="M7 4h10v11H7zM5 13v6h14v-6M8 19v3m8-3v3" />,
    filter: <><path d="M3 6h18M6 12h12m-9 6h6" /><circle cx="8" cy="6" r="2" fill="currentColor" /><circle cx="16" cy="12" r="2" fill="currentColor" /></>,
  };
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{paths[name]}</svg>;
}

export function Tag({ category, children }: { category: string; children?: ReactNode }) {
  const { categoryName } = useTrio();
  return <span className={`tag tag-${category}`}><span className="category-dot" />{children || categoryName(category)}</span>;
}

export function Breadcrumb({ current }: { current: string }) {
  const { text } = useTrio();
  return <div className="breadcrumb"><a href="#/">trio</a><Icon name="chevron" size={12} /><a href="#/trips">{text('Zájezdy', 'Trips')}</a><Icon name="chevron" size={12} /><span>{current}</span></div>;
}

export function TripCard({ trip }: { trip: Trip }) {
  const { locale, date, price, text, isSoldOut } = useTrio();
  return <a className="trip-card" href={`#/trip/${trip.id}`}><div className="trip-card-image"><img src={`assets/${trip.image}`} alt={trip[locale].title} loading="lazy" /><Tag category={trip.category} />{isSoldOut(trip) && <span className="sold-ribbon">{text('Vyprodáno', 'Sold out')}</span>}</div><div className="trip-card-copy"><span className="trip-date"><Icon name="calendar" size={15} />{date(trip.date)}</span><h3>{trip[locale].title}</h3><p>{trip[locale].description.split('. ')[0]}.</p><div className="trip-card-bottom"><span><strong>{price(trip.price)}</strong><small> / {text('osoba', 'person')}{trip.category === 'culture' ? text(' · doprava', ' · transport') : ''}</small></span><span className="round-arrow"><Icon name="arrow" /></span></div></div></a>;
}
