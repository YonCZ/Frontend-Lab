import { useMemo } from "react";
import { motion, useReducedMotion } from "motion/react";
import { CATEGORIES, PARTNERS } from "../core/data";
import { toHash } from "../core/router";
import { publishedTrips, useStore } from "../core/store";
import { money, useSite } from "../site";
import { Reveal, SectionHead, TripCard } from "../components";

export default function Landing() {
  const { lang, t } = useSite();
  const store = useStore();
  const trips = useMemo(() => publishedTrips(store).sort((a, b) => a.date.localeCompare(b.date)), [store]);
  const reduce = useReducedMotion();

  const featured = useMemo(() => {
    return [...trips]
      .filter((trip) => trip.date >= "2026-11-15")
      .sort((a, b) => a.date.localeCompare(b.date))
      .slice(0, 3);
  }, [trips]);

  const from = trips.length ? Math.min(...trips.map((trip) => trip.price)) : 0;

  return (
    <>
      <section className="hero">
        <motion.img
          className="hero-img"
          src="assets/hero-4.jpg"
          alt=""
          initial={reduce ? { opacity: 0 } : { scale: 1.06, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={reduce ? { duration: 0.4 } : { type: "spring", stiffness: 60, damping: 24, mass: 1.4 }}
        />
        <div className="hero-scrim" />
        <div className="hero-content">
          <motion.p
            className="kicker"
            initial={reduce ? undefined : { opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25, duration: 0.6 }}
          >
            <span className="kicker-dot" /> {t("heroKicker")}
          </motion.p>
          <h1>
            <motion.span
              className="line"
              initial={reduce ? undefined : { opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.32, type: "spring", stiffness: 90, damping: 20 }}
            >
              {t("heroTitleA")}
            </motion.span>
            <motion.em
              className="line"
              initial={reduce ? undefined : { opacity: 0, y: 34 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.44, type: "spring", stiffness: 90, damping: 20 }}
            >
              {t("heroTitleB")}
            </motion.em>
          </h1>
          <motion.p
            className="hero-lead"
            initial={reduce ? undefined : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.7 }}
          >
            {t("heroLead")}
          </motion.p>
          <motion.div
            className="hero-actions"
            initial={reduce ? undefined : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.6 }}
          >
            <a className="btn btn-solid" href={toHash(lang, "trips")}>
              {t("explore")}
            </a>
            <a className="btn btn-ghost" href={toHash(lang, "contact")}>
              {t("navContact")}
            </a>
          </motion.div>
        </div>
        <div className="hero-facts">
          <div>
            <strong>{trips.length}</strong>
            <span>{t("tripPlural")}</span>
          </div>
          <div>
            <strong>{CATEGORIES.length}</strong>
            <span>{t("categoriesShort")}</span>
          </div>
          <div>
            <strong>{money(from, lang)}</strong>
            <span>{t("from")}</span>
          </div>
        </div>
        <div className="hero-rail" aria-hidden="true">
          <span>CA TRIO</span>
          <span>MORAVSKÉ BUDĚJOVICE</span>
          <span>2026 / 27</span>
        </div>
        <div className="hero-scroll" aria-hidden="true">
          <span>{t("scroll")}</span>
          <i />
        </div>
      </section>

      <section className="section featured">
        <SectionHead
          kicker={lang === "cs" ? "Výběr z nabídky" : "Selected trips"}
          title={t("featured")}
          lead={t("featuredLead")}
          action={
            <a className="text-link" href={toHash(lang, "trips")}>
              {t("allTrips")} <span>→</span>
            </a>
          }
        />
        <div className="trip-grid">
          {featured.map((trip, index) => (
            <Reveal key={trip.id} delay={index * 0.06}>
              <TripCard trip={trip} />
            </Reveal>
          ))}
        </div>
      </section>

      <section className="section categories">
        <SectionHead kicker={t("ourOffer")} title={t("categories")} lead={t("categoriesLead")} />
        <div className="cat-grid">
          {CATEGORIES.map((category, index) => {
            const count = trips.filter((trip) => trip.category === category.id).length;
            return (
              <Reveal key={category.id} delay={index * 0.05}>
                <a className="cat-card" href={toHash(lang, "trips", category.id)}>
                  <span className="cat-index">0{index + 1}</span>
                  <h3>{category.name[lang]}</h3>
                  <span className="cat-count">
                    {count} {count === 1 ? t("tripSingular") : t("tripPlural")}
                  </span>
                  <span className="cat-arrow">→</span>
                </a>
              </Reveal>
            );
          })}
        </div>
      </section>

      <section className="section why">
        <div className="why-inner">
          <Reveal className="why-lead">
            <p className="eyebrow">{t("whyUs")}</p>
            <h2>{t("whyUsLead")}</h2>
            <a className="text-link" href={toHash(lang, "contact")}>
              {t("navContact")} <span>→</span>
            </a>
          </Reveal>
          <div className="why-list">
            {[
              { title: t("why1Title"), body: t("why1Body") },
              { title: t("why2Title"), body: t("why2Body") },
              { title: t("why3Title"), body: t("why3Body") },
            ].map((item, index) => (
              <Reveal key={item.title} delay={index * 0.07}>
                <div className="why-item">
                  <span className="why-num">0{index + 1}</span>
                  <div>
                    <h3>{item.title}</h3>
                    <p>{item.body}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="section partners">
        <SectionHead kicker={t("partners")} title={t("partners")} lead={t("partnersLead")} />
        <div className="partner-strip">
          {PARTNERS.map((partner) => (
            <div className="partner" key={partner.name}>
              <strong>{partner.name}</strong>
              <p>{partner.offer[lang]}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="cta">
        <Reveal className="cta-inner">
          <p className="eyebrow">{t("heroKicker")}</p>
          <h2>{t("heroLead")}</h2>
          <div className="cta-actions">
            <a className="btn btn-solid" href={toHash(lang, "trips")}>
              {t("explore")}
            </a>
            <a className="btn btn-ghost" href={`tel:${"+420737102348"}`}>
              +420 737 102 348
            </a>
          </div>
        </Reveal>
      </section>
    </>
  );
}
