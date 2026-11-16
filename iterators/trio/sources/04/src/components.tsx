import { motion, useReducedMotion } from "motion/react";
import type { ReactNode } from "react";
import { CATEGORIES, type Trip } from "./core/data";
import { toHash } from "./core/router";
import { money, useSite } from "./site";

export function categoryName(trip: Trip, lang: "cs" | "en") {
  return CATEGORIES.find((category) => category.id === trip.category)?.short[lang] ?? "";
}

export function Reveal({ children, delay = 0, className = "" }: { children: ReactNode; delay?: number; className?: string }) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      className={className}
      initial={reduce ? { opacity: 0 } : { opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={reduce ? { duration: 0.25 } : { type: "spring", stiffness: 160, damping: 26, delay: Math.min(delay, 0.2) }}
    >
      {children}
    </motion.div>
  );
}

export function SectionHead({
  kicker,
  title,
  lead,
  action,
}: {
  kicker?: string;
  title: string;
  lead?: string;
  action?: ReactNode;
}) {
  return (
    <Reveal className="section-head">
      <div>
        {kicker && <p className="eyebrow">{kicker}</p>}
        <h2>{title}</h2>
      </div>
      <div className="section-head-side">
        {lead && <p>{lead}</p>}
        {action}
      </div>
    </Reveal>
  );
}

export function TripCard({ trip, compact = false }: { trip: Trip; compact?: boolean }) {
  const { lang, t } = useSite();
  const reduce = useReducedMotion();
  const href = toHash(lang, "trip", trip.id);
  return (
    <motion.article
      className={`trip-card${compact ? " is-compact" : ""}`}
      whileHover={reduce ? undefined : { y: -5 }}
      transition={{ type: "spring", stiffness: 240, damping: 24 }}
    >
      <a className="trip-media" href={href} aria-label={trip.title[lang]}>
        <img src={trip.image} alt={trip.title[lang]} loading="lazy" />
        <span className="trip-date-chip">{trip.dateLabel[lang]}</span>
        {trip.soldOut && <span className="trip-flag">{t("soldOut")}</span>}
      </a>
      <div className="trip-body">
        <div className="trip-cat-line">
          <span>{categoryName(trip, lang)}</span>
          <i />
        </div>
        <h3>
          <a href={href}>{trip.title[lang]}</a>
        </h3>
        <p>{trip.tagline[lang]}</p>
        <div className="trip-foot">
          <span className="price">
            <small>{t("from")}</small>
            <strong>{money(trip.price, lang)}</strong>
          </span>
          <span className="trip-link">
            {t("viewTrip")} <i>→</i>
          </span>
        </div>
      </div>
    </motion.article>
  );
}
