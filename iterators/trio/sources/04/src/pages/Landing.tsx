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
  const reduce = useReducedMotion();
  const trips = useMemo(() => publishedTrips(store).sort((a, b) => a.date.localeCompare(b.date)), [store]);

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
        <div className="hero-copy">
          <motion.p
            className="kicker"
            initial={reduce ? undefined : { opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15, duration: 0.5 }}
          >
            <span className="kicker-dot" /> {t("heroKicker")}
          </motion.p>
          <h1>
            <motion.span
              initial={reduce ? undefined : { opacity: 0, y: 26 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.22, type: "spring", stiffness: 90, damping: 20 }}
            >
              {t("heroTitleA")}
            </motion.span>
            <motion.em
              initial={reduce ? undefined : { opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.34, type: "spring", stiffness: 90, damping: 20 }}
            >
              {t("heroTitleB")}
            </motion.em>
          </h1>
          <p className="hero-lead">{t("heroLead")}</p>
          <div className="hero-actions">
            <a className="btn btn-solid" href={toHash(lang, "trips")}>
              {t("explore")}
            </a>
            <a className="btn btn-ghost" href={`tel:+420737102348`}>
              +420 737 102 348
            </a>
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
              <span>{t("perPerson")}</span>
            </div>
          </div>
        </div>

        <motion.figure
          className="hero-figure"
          initial={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.985 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={reduce ? { duration: 0.3 } : { type: "spring", stiffness: 70, damping: 22, delay: 0.1 }}
        >
          <img src="assets/hotel-sissy.jpg" alt="" />
          <figcaption>
            <span className="fig-num">01</span>
            <div>
              <strong>Hotel SISSY***</strong>
              <span>{lang === "cs" ? "Kamena Vourla, Řecko" : "Kamena Vourla, Greece"}</span>
            </div>
            <span className="fig-temp">29 °C</span>
          </figcaption>
          <span className="hero-stamp" aria-hidden="true">
            <span>2027</span>
            <small>{lang === "cs" ? "ŘECKO" : "GREECE"}</small>
          </span>
        </motion.figure>
      </section>

      <div className="hero-ticker" aria-hidden="true">
        {CATEGORIES.map((category) => (
          <span key={category.id}>{category.name[lang]}</span>
        ))}
        <span>{lang === "cs" ? "Odjezd z Moravských Budějovic" : "Departures from Moravské Budějovice"}</span>
      </div>

      <section className="section featured">
        <SectionHead
          kicker={lang === "cs" ? "Výběr na tento měsíc" : "Picked for this month"}
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
            <Reveal key={trip.id} delay={index * 0.05}>
              <TripCard trip={trip} />
            </Reveal>
          ))}
        </div>
      </section>

      <section className="section categories">
        <SectionHead kicker={t("ourOffer")} title={t("categories")} lead={t("categoriesLead")} />
        <div className="cat-list">
          {CATEGORIES.map((category, index) => {
            const count = trips.filter((trip) => trip.category === category.id).length;
            return (
              <Reveal key={category.id} delay={index * 0.04}>
                <a className="cat-row" href={toHash(lang, "trips", category.id)}>
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

      <section className="section statement">
        <Reveal className="statement-inner">
          <p className="eyebrow">{t("whyUs")}</p>
          <h2>
            {lang === "cs"
              ? "Známe každé místo, kam vás vezeme. A každého, kdo s námi pojede."
              : "We know every place we take you. And everyone who travels with us."}
          </h2>
          <div className="statement-meta">
            <span>{lang === "cs" ? "Ludmila Přikrylová" : "Ludmila Přikrylová"}</span>
            <span>{lang === "cs" ? "majitelka CA TRIO" : "owner, CA Trio"}</span>
          </div>
        </Reveal>
      </section>

      <section className="section why">
        <div className="why-cards">
          {[
            { title: t("why1Title"), body: t("why1Body") },
            { title: t("why2Title"), body: t("why2Body") },
            { title: t("why3Title"), body: t("why3Body") },
          ].map((item, index) => (
            <Reveal key={item.title} delay={index * 0.06}>
              <div className="why-card">
                <span className="why-num">0{index + 1}</span>
                <h3>{item.title}</h3>
                <p>{item.body}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="section partners">
        <SectionHead kicker={t("partners")} title={t("partners")} lead={t("partnersLead")} />
        <div className="partner-grid">
          {PARTNERS.map((partner) => (
            <div className="partner" key={partner.name}>
              <strong>{partner.name}</strong>
              <p>{partner.offer[lang]}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="cta-wrap">
        <Reveal className="cta">
          <div className="cta-copy">
            <p className="eyebrow">{t("heroKicker")}</p>
            <h2>{lang === "cs" ? "Naplánujte si den, na který se budete těšit." : "Plan the day you will look forward to."}</h2>
            <div className="cta-actions">
              <a className="btn btn-light" href={toHash(lang, "trips")}>
                {t("explore")}
              </a>
              <a className="btn btn-outline-light" href={toHash(lang, "contact")}>
                {t("navContact")}
              </a>
            </div>
          </div>
          <div className="cta-facts">
            <div>
              <span>{t("officeHours")}</span>
              <strong>{lang === "cs" ? "Út · Čt 10:00–16:30" : "Tue · Thu 10:00–16:30"}</strong>
            </div>
            <div>
              <span>{t("callUs")}</span>
              <strong>+420 737 102 348</strong>
            </div>
            <div>
              <span>{t("vouchers")}</span>
              <strong>PLUXEE · EDENRED · BENEFITY</strong>
            </div>
          </div>
        </Reveal>
      </section>
    </>
  );
}
