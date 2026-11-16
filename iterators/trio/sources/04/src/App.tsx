import { motion, useReducedMotion } from "motion/react";
import { useEffect, useMemo } from "react";
import AdminPage from "./core/admin";
import { AGENCY } from "./core/data";
import { T } from "./core/i18n";
import { toHash, useRoute } from "./core/router";
import { SiteContext, useSite } from "./site";
import Landing from "./pages/Landing";
import Trips from "./pages/Trips";
import TripDetail from "./pages/TripDetail";
import Booking from "./pages/Booking";
import Contact from "./pages/Contact";
import Terms from "./pages/Terms";

export default function App() {
  const route = useRoute();
  const reduce = useReducedMotion();
  const lang = route.lang;
  const t = (key: string) => T[lang][key as keyof (typeof T)["cs"]] as string;
  const site = useMemo(() => ({ lang, t, route }), [lang, route]);

  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  const page = (() => {
    switch (route.page) {
      case "trips":
        return <Trips preset={route.id} />;
      case "trip":
        return <TripDetail id={route.id ?? ""} />;
      case "book":
        return <Booking id={route.id ?? ""} />;
      case "contact":
        return <Contact />;
      case "terms":
        return <Terms />;
      case "admin":
        return <AdminPage lang={lang} t={t} />;
      default:
        return <Landing />;
    }
  })();

  if (route.page === "admin") {
    return (
      <SiteContext.Provider value={site}>
        <div className="shell is-admin">{page}</div>
      </SiteContext.Provider>
    );
  }

  return (
    <SiteContext.Provider value={site}>
      <div className="shell">
        <Topbar />
        <motion.div
          key={`${route.lang}/${route.page}/${route.id ?? ""}`}
          initial={reduce ? { opacity: 0 } : { opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={reduce ? { duration: 0.2 } : { type: "spring", stiffness: 210, damping: 28, mass: 0.9 }}
        >
          {page}
        </motion.div>
        <Footer />
      </div>
    </SiteContext.Provider>
  );
}

function Topbar() {
  const { lang, t, route } = useSite();
  const next = lang === "cs" ? "en" : "cs";
  const links = [
    { page: "trips", label: t("navTrips") },
    { page: "contact", label: t("navContact") },
    { page: "terms", label: t("navTerms") },
  ];
  return (
    <header className="topbar">
      <a className="brand" href={toHash(lang, "home")} aria-label="CA TRIO">
        <img src="assets/logo.png" alt="" />
        <span>CA TRIO</span>
      </a>
      <nav className="topnav" aria-label={t("menu")}>
        <a className={route.page === "home" ? "is-active" : ""} href={toHash(lang, "home")}>
          {t("navHome")}
        </a>
        {links.map((link) => (
          <a
            key={link.page}
            className={route.page === link.page || (link.page === "trips" && route.page === "trip") ? "is-active" : ""}
            href={toHash(lang, link.page)}
          >
            {link.label}
          </a>
        ))}
      </nav>
      <div className="topbar-end">
        <a className="lang" href={toHash(next, route.page, route.id)} aria-label={`${t("langSwitch")}: ${next.toUpperCase()}`}>
          <span className={lang === "cs" ? "is-on" : ""}>CS</span>
          <span className={lang === "en" ? "is-on" : ""}>EN</span>
        </a>
        <a className="btn btn-small btn-solid" href={toHash(lang, "trips")}>
          {t("book")}
        </a>
      </div>
    </header>
  );
}

function Footer() {
  const { lang, t } = useSite();
  return (
    <footer className="footer">
      <div className="footer-grid">
        <div className="footer-brand">
          <img src="assets/logo.png" alt="CA TRIO" />
          <p>{t("footerAbout")}</p>
          <div className="footer-social">
            <a href={AGENCY.facebook} target="_blank" rel="noreferrer">
              Facebook
            </a>
            <a href={`mailto:${AGENCY.email}`}>{AGENCY.email}</a>
          </div>
        </div>
        <div>
          <h4>{t("footerExplore")}</h4>
          <a href={toHash(lang, "trips")}>{t("navTrips")}</a>
          <a href={toHash(lang, "trips", "advent")}>{t("navTrips")} · Advent</a>
          <a href={toHash(lang, "terms")}>{t("navTerms")}</a>
        </div>
        <div>
          <h4>{t("footerContact")}</h4>
          <p>{AGENCY.address}</p>
          <a href={`tel:${AGENCY.phoneHref}`}>{AGENCY.phone}</a>
          <a href={`mailto:${AGENCY.email}`}>{AGENCY.email}</a>
          <p>{AGENCY.hours[lang]}</p>
        </div>
        <div>
          <h4>{t("footerLegal")}</h4>
          <p>{AGENCY.legal[lang]}</p>
          <p>IČ: {AGENCY.ico}</p>
          <p>
            {t("vouchers")}: {AGENCY.vouchers}
          </p>
        </div>
      </div>
      <div className="footer-bottom">
        <span>© 2026 CA TRIO</span>
        <span>{t("rights")}</span>
        <button type="button" className="footer-top" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>
          ↑
        </button>
      </div>
    </footer>
  );
}
