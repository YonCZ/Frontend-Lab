import { useEffect, useState } from "react";
import type { Locale } from "./data";

export type Route = {
  lang: Locale;
  page: string;
  id?: string;
};

export function parseHash(hash: string): Route {
  const clean = hash.replace(/^#\/?/, "");
  const parts = clean.split("/").filter(Boolean);
  const lang: Locale = parts[0] === "en" ? "en" : "cs";
  const rest = parts[0] === "en" || parts[0] === "cs" ? parts.slice(1) : parts;
  return { lang, page: rest[0] || "home", id: rest[1] };
}

export function toHash(lang: Locale, page: string, id?: string) {
  return `#/${lang}/${page}${id ? `/${id}` : ""}`;
}

export function go(lang: Locale, page: string, id?: string) {
  if (typeof window !== "undefined") {
    window.location.hash = toHash(lang, page, id);
  }
}

export function useRoute(): Route {
  const [route, setRoute] = useState<Route>(() =>
    typeof window === "undefined" ? { lang: "cs", page: "home" } : parseHash(window.location.hash)
  );

  useEffect(() => {
    const onHash = () => {
      setRoute(parseHash(window.location.hash));
      window.scrollTo({ top: 0, behavior: "auto" });
    };
    window.addEventListener("hashchange", onHash);
    if (!window.location.hash) window.location.replace(toHash("cs", "home"));
    return () => window.removeEventListener("hashchange", onHash);
  }, []);

  return route;
}
