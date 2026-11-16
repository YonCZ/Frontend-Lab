import { useEffect, useMemo, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { CATEGORIES } from "../core/data";
import { toHash } from "../core/router";
import { findTrip, publishedTrips, useStore } from "../core/store";
import { availability } from "../core/seats";
import { money, useSite } from "../site";
import { Reveal, TripCard } from "../components";

const PRICE_BANDS = [
  { id: "all", label: { cs: "Libovolná cena", en: "Any price" } },
  { id: "low", label: { cs: "do 600 Kč", en: "under 600 CZK" } },
  { id: "mid", label: { cs: "600 – 1 000 Kč", en: "600 – 1,000 CZK" } },
  { id: "high", label: { cs: "nad 1 000 Kč", en: "over 1,000 CZK" } },
];

export default function Trips({ preset }: { preset?: string }) {
  const { lang, t } = useSite();
  const store = useStore();
  const reduce = useReducedMotion();
  const [category, setCategory] = useState(preset && CATEGORIES.some((item) => item.id === preset) ? preset : "all");
  const [month, setMonth] = useState("");
  const [state, setState] = useState("all");
  const [price, setPrice] = useState("all");
  const [sort, setSort] = useState("date");

  const trips = useMemo(() => publishedTrips(store), [store]);

  useEffect(() => {
    if (preset) setCategory(CATEGORIES.some((item) => item.id === preset) ? preset : "all");
  }, [preset]);

  const months = useMemo(() => {
    const set = new Set(trips.map((trip) => trip.date.slice(0, 7)));
    return [...set].sort().map((value) => {
      const date = new Date(`${value}-01T00:00:00`);
      return {
        value,
        label: `${t("monthNames")[date.getMonth()]} ${date.getFullYear()}`,
      };
    });
  }, [trips, t]);

  const filtered = useMemo(() => {
    const list = trips.filter((trip) => {
      if (category !== "all" && trip.category !== category) return false;
      if (month && !trip.date.startsWith(month)) return false;
      if (state === "available" && trip.soldOut) return false;
      if (state === "soldout" && !trip.soldOut) return false;
      if (price === "low" && trip.price >= 600) return false;
      if (price === "mid" && (trip.price < 600 || trip.price > 1000)) return false;
      if (price === "high" && trip.price <= 1000) return false;
      return true;
    });
    return list.sort((a, b) => (sort === "price" ? a.price - b.price : a.date.localeCompare(b.date)));
  }, [trips, category, month, state, price, sort]);

  const reset = () => {
    setCategory("all");
    setMonth("");
    setState("all");
    setPrice("all");
    setSort("date");
  };

  const active = category !== "all" || month || state !== "all" || price !== "all";

  return (
    <main className="page">
      <header className="page-head">
        <div>
          <p className="eyebrow">{t("ourOffer")}</p>
          <h1>{t("tripsTitle")}</h1>
          <p className="page-lead">{t("tripsLead")}</p>
        </div>
        <div className="page-head-mark" aria-hidden="true">
          {String(filtered.length).padStart(2, "0")}
        </div>
      </header>

      <div className="trips-layout">
        <aside className="filter-bar">
          <div className="filter-top">
            <span className="filter-title">{t("filterCategory")}</span>
            {active && (
              <button type="button" className="filter-clear" onClick={reset}>
                {t("reset")} ×
              </button>
            )}
          </div>
          <div className="filter-group">
            <div className="chips">
              <button type="button" className={category === "all" ? "is-on" : ""} onClick={() => setCategory("all")}>
                {t("filterAll")}
              </button>
              {CATEGORIES.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  className={category === item.id ? "is-on" : ""}
                  onClick={() => setCategory(item.id)}
                >
                  {item.short[lang]}
                </button>
              ))}
            </div>
          </div>

          <div className="filter-group">
            <span className="filter-label">{t("filterMonth")}</span>
            <select value={month} onChange={(event) => setMonth(event.target.value)} aria-label={t("filterMonth")}>
              <option value="">{t("anyMonth")}</option>
              {months.map((item) => (
                <option key={item.value} value={item.value}>
                  {item.label}
                </option>
              ))}
            </select>
          </div>

          <div className="filter-group">
            <span className="filter-label">{t("filterAvailability")}</span>
            <select value={state} onChange={(event) => setState(event.target.value)} aria-label={t("filterAvailability")}>
              <option value="all">{t("anyAvailability")}</option>
              <option value="available">{t("onlyAvailable")}</option>
              <option value="soldout">{t("onlySoldOut")}</option>
            </select>
          </div>

          <div className="filter-group">
            <span className="filter-label">{t("filterPrice")}</span>
            <select value={price} onChange={(event) => setPrice(event.target.value)} aria-label={t("filterPrice")}>
              {PRICE_BANDS.map((band) => (
                <option key={band.id} value={band.id}>
                  {band.label[lang]}
                </option>
              ))}
            </select>
          </div>

          <div className="filter-group">
            <span className="filter-label">{t("sortLabel")}</span>
            <select value={sort} onChange={(event) => setSort(event.target.value)} aria-label={t("sortLabel")}>
              <option value="date">{t("sortDate")}</option>
              <option value="price">{t("sortPrice")}</option>
            </select>
          </div>
        </aside>

        <div className="trips-results">
          <div className="result-row">
            <p>
              <strong>{filtered.length}</strong> {t("results")}
            </p>
            <span className="result-note">{lang === "cs" ? "Ceny za osobu" : "Prices per person"}</span>
          </div>

      {filtered.length === 0 ? (
        <Reveal className="empty">
          <h2>{t("noResults")}</h2>
          <p>{t("noResultsBody")}</p>
          <button type="button" className="btn btn-solid" onClick={reset}>
            {t("clearFilters")}
          </button>
        </Reveal>
      ) : (
        <motion.div layout className="trip-grid">
          {filtered.map((trip, index) => {
            const tripSeats = store.bookings
              .filter((booking) => booking.tripId === trip.id)
              .flatMap((booking) => booking.seats);
            const free = availability(trip.id, trip.seatCount, tripSeats).free;
            return (
              <Reveal key={trip.id} delay={reduce ? 0 : Math.min(index * 0.04, 0.24)}>
                <div className="card-wrap">
                  <TripCard trip={trip} />
                  {!trip.soldOut && (
                    <span className="free-note">
                      {free} {t("freeSeats")}
                    </span>
                  )}
                </div>
              </Reveal>
            );
          })}
        </motion.div>
      )}
        </div>
      </div>
    </main>
  );
}
