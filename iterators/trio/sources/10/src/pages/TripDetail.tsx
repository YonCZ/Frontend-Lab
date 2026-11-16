import { useMemo } from "react";
import { motion, useReducedMotion } from "motion/react";
import { toHash } from "../core/router";
import { findTrip, publishedTrips, useStore } from "../core/store";
import { availability } from "../core/seats";
import { CATEGORIES } from "../core/data";
import { dayCount, lineBreaks, money, useSite } from "../site";
import { Reveal, TripCard, categoryName } from "../components";

export default function TripDetail({ id }: { id: string }) {
  const { lang, t } = useSite();
  const store = useStore();
  const reduce = useReducedMotion();
  const trip = findTrip(id, store);

  const related = useMemo(
    () =>
      publishedTrips(store)
        .filter((item) => item.id !== id)
        .sort((a, b) => Number(b.category === trip?.category) - Number(a.category === trip?.category) || a.date.localeCompare(b.date))
        .slice(0, 3),
    [store, id, trip?.category]
  );

  if (!trip || !trip.published) {
    return (
      <main className="page">
        <div className="empty">
          <h1>{t("noResults")}</h1>
          <p>{t("noResultsBody")}</p>
          <a className="btn btn-solid" href={toHash(lang, "trips")}>
            {t("backToTrips")}
          </a>
        </div>
      </main>
    );
  }

  const booked = store.bookings.filter((booking) => booking.tripId === trip.id).flatMap((booking) => booking.seats);
  const { free } = availability(trip.id, trip.seatCount, booked);
  const category = CATEGORIES.find((item) => item.id === trip.category);
  const bookHref = toHash(lang, "book", trip.id);

  return (
    <main className="detail">
      <a className="detail-back" href={toHash(lang, "trips")}>
        ← {t("detailBack")}
      </a>

      <section className="detail-hero">
        <motion.img
          src={trip.image}
          alt={trip.title[lang]}
          initial={reduce ? { opacity: 0 } : { opacity: 0, scale: 1.04 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={reduce ? { duration: 0.3 } : { type: "spring", stiffness: 70, damping: 24 }}
        />
        <div className="detail-hero-scrim" />
        <div className="detail-hero-content">
          <span className="pill is-line">{category?.name[lang]}</span>
          <h1>{trip.title[lang]}</h1>
          <p>{trip.tagline[lang]}</p>
          <div className="detail-meta">
            <span>
              <small>{t("detailPrice")}</small>
              <strong>{money(trip.price, lang)}</strong>
            </span>
            <span>
              <small>{t("detailDeparture")}</small>
              <strong>{trip.dateLabel[lang]}</strong>
            </span>
            <span>
              <small>{t("duration")}</small>
              <strong>{dayCount(trip) > 1 ? `${dayCount(trip) - 1} ${t("sevenDays").replace("7 ", "")}` : t("oneDay")}</strong>
            </span>
          </div>
        </div>
      </section>

      <div className="detail-grid">
        <article className="detail-main">
          <Reveal>
            <p className="eyebrow">{t("detailWhat")}</p>
            {lineBreaks(trip.description[lang]).map((paragraph) => (
              <p className="detail-p" key={paragraph.slice(0, 24)}>
                {paragraph}
              </p>
            ))}
            {trip.returnNote && <p className="detail-return">{trip.returnNote[lang]}</p>}
          </Reveal>

          <Reveal>
            <div className="inc-grid">
              <div className="inc-card">
                <h3>
                  <span className="inc-mark">+</span> {t("detailIncluded")}
                </h3>
                <ul>
                  {trip.includes.map((item) => (
                    <li key={item.cs}>{item[lang]}</li>
                  ))}
                </ul>
              </div>
              <div className="inc-card is-exclude">
                <h3>
                  <span className="inc-mark">−</span> {t("detailExcluded")}
                </h3>
                {trip.excludes.length ? (
                  <ul>
                    {trip.excludes.map((item) => (
                      <li key={item.cs}>{item[lang]}</li>
                    ))}
                  </ul>
                ) : (
                  <p className="muted">—</p>
                )}
              </div>
            </div>
          </Reveal>

          <Reveal>
            <div className="dep-block">
              <div className="dep-head">
                <h2>{t("detailDeparture")}</h2>
                <span className="dep-date">{trip.dateLabel[lang]}</span>
              </div>
              <ol className="dep-list">
                {trip.departures.map((departure, index) => (
                  <li key={`${departure.place.cs}-${departure.time}`}>
                    <span className="dep-num">{String(index + 1).padStart(2, "0")}</span>
                    <span className="dep-time">{departure.time}</span>
                    <span className="dep-place">{departure.place[lang]}</span>
                  </li>
                ))}
              </ol>
              {trip.returnNote && <p className="dep-return">{trip.returnNote[lang]}</p>}
            </div>
          </Reveal>

          <Reveal>
            <div className="practical">
              <h2>{t("detailPractical")}</h2>
              <dl>
                <div>
                  <dt>{t("detailSeats")}</dt>
                  <dd>
                    {trip.seatCount} · {free} {t("detailSeatsLeft")}
                  </dd>
                </div>
                <div>
                  <dt>{t("vouchers")}</dt>
                  <dd>PLUXEE, EDENRED, BENEFITY</dd>
                </div>
                <div>
                  <dt>{t("insuranceLabel")}</dt>
                  <dd>{lang === "cs" ? "AXA, 35 Kč na osobu a den, sjednání v CA TRIO" : "AXA, 35 CZK per person per day, arranged at CA Trio"}</dd>
                </div>
                {trip.operator && (
                  <div>
                    <dt>{t("detailOperator")}</dt>
                    <dd>{trip.operator[lang]}</dd>
                  </div>
                )}
              </dl>
            </div>
          </Reveal>
        </article>

        <aside className="booking-rail">
          <div className="rail-card">
            <div className="rail-price">
              <span>{t("detailPrice")}</span>
              <strong>{money(trip.price, lang)}</strong>
              <small>{t("perPerson")}</small>
            </div>
            {trip.priceNote && <p className="rail-note">{trip.priceNote[lang]}</p>}
            <div className="rail-seats">
              {trip.soldOut ? (
                <span className="is-sold">{t("soldOut")}</span>
              ) : (
                <>
                  <span className="seat-dot" />
                  <span>
                    {free} {t("detailSeatsLeft")}
                  </span>
                </>
              )}
            </div>
            {trip.soldOut ? (
              <a className="btn btn-solid is-disabled" href={toHash(lang, "contact")}>
                {t("navContact")}
              </a>
            ) : (
              <a className="btn btn-solid" href={bookHref}>
                {t("detailReserve")}
              </a>
            )}
            <p className="rail-lead">{trip.soldOut ? t("detailSoldOutBody") : t("detailBookLead")}</p>
            <ul className="rail-list">
              {trip.includes.slice(0, 3).map((item) => (
                <li key={item.cs}>{item[lang]}</li>
              ))}
              <li>
                {trip.departures.length} {lang === "cs" ? "nástupních míst" : "departure points"}
              </li>
            </ul>
            <a className="rail-contact" href={toHash(lang, "contact")}>
              {lang === "cs" ? "Máte otázku? Napište nám" : "A question? Write to us"} →
            </a>
          </div>
          <p className="rail-cat">{categoryName(trip, lang)}</p>
        </aside>
      </div>

      <section className="section related">
        <div className="section-head">
          <div>
            <p className="eyebrow">{t("allTrips")}</p>
            <h2>{t("featured")}</h2>
          </div>
          <a className="text-link" href={toHash(lang, "trips")}>
            {t("allTrips")} →
          </a>
        </div>
        <div className="trip-grid">
          {related.map((item, index) => (
            <Reveal key={item.id} delay={index * 0.05}>
              <TripCard trip={item} compact />
            </Reveal>
          ))}
        </div>
      </section>
    </main>
  );
}
