import { createContext, useContext } from "react";
import type { Locale, Trip } from "./core/data";
import type { Route } from "./core/router";

export type Site = {
  lang: Locale;
  t: (key: string) => any;
  route: Route;
};

export const SiteContext = createContext<Site>({ lang: "cs", t: () => "", route: { lang: "cs", page: "home" } });

export function useSite() {
  return useContext(SiteContext);
}

export function money(value: number, lang: Locale) {
  return `${new Intl.NumberFormat(lang === "cs" ? "cs-CZ" : "en-GB").format(value)} ${lang === "cs" ? "Kč" : "CZK"}`;
}

export function shortDate(trip: Trip, lang: Locale) {
  const d = new Date(`${trip.date}T00:00:00`);
  return new Intl.DateTimeFormat(lang === "cs" ? "cs-CZ" : "en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(d);
}

export function dayCount(trip: Trip) {
  if (!trip.endDate) return 1;
  const start = new Date(`${trip.date}T00:00:00`).getTime();
  const end = new Date(`${trip.endDate}T00:00:00`).getTime();
  return Math.max(1, Math.round((end - start) / 86400000) + 1);
}

export function insuranceFor(trip: Trip, people: number) {
  return 35 * dayCount(trip) * people;
}

export function lineBreaks(text: string) {
  return text.split("\n\n").filter(Boolean);
}
