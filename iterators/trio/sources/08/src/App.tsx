import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, MotionConfig, motion } from "motion/react";
import {
  AGENCIES,
  CATS,
  CZ_COUNT,
  EN_COUNT,
  PLACES,
  catOf,
  fmtDate,
  fmtRange,
  fmtShort,
  monthKey,
  monthLabel,
  price,
  seatsLeft,
  type AppState,
  type Booking,
  type CatId,
  type Lang,
  type Trip,
} from "./data";
import { S } from "./i18n";
import { loadLang, loadState, makeRef, saveLang, saveState } from "./store";
import SeatMap from "./SeatMap";
import Admin from "./Admin";

/* ---------------- routing ---------------- */

type Route =
  | { name: "home" }
  | { name: "listing" }
  | { name: "trip"; slug: string }
  | { name: "booking"; slug: string }
  | { name: "contact" }
  | { name: "admin" }
  | { name: "missing" };

function parseRoute(hash: string): Route {
  const path = hash.replace(/^#\/?/, "").split("?")[0];
  const parts = path.split("/").filter(Boolean);
  if (parts.length === 0) return { name: "home" };
  if (parts[0] === "zajezdy" && parts.length === 1) return { name: "listing" };
  if (parts[0] === "zajezdy" && parts.length === 2) return { name: "trip", slug: parts[1] };
  if (parts[0] === "objednavka" && parts.length === 2) return { name: "booking", slug: parts[1] };
  if (parts[0] === "kontakt") return { name: "contact" };
  if (parts[0] === "admin") return { name: "admin" };
  return { name: "missing" };
}

function queryOf(hash: string): string {
  const i = hash.indexOf("?");
  return i === -1 ? "" : hash.slice(i + 1);
}

function useHash() {
  const [hash, setHash] = useState(() => window.location.hash || "#/");
  useEffect(() => {
    const onChange = () => setHash(window.location.hash || "#/");
    window.addEventListener("hashchange", onChange);
    return () => window.removeEventListener("hashchange", onChange);
  }, []);
  return hash;
}

/* ---------------- bits ---------------- */

function Link({
  to,
  children,
  className,
  ...rest
}: {
  to: string;
  children: React.ReactNode;
  className?: string;
} & Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, "href">) {
  return (
    <a href={`#${to}`} className={className} {...rest}>
      {children}
    </a>
  );
}

function CatLabel({ cat, lang }: { cat: CatId; lang: Lang }) {
  const c = catOf(cat);
  return (
    <span className="cat-label">
      <i style={{ background: c.colour }} aria-hidden="true" />
      {c.name[lang]}
    </span>
  );
}

function SectionHead({
  title,
  lead,
  action,
}: {
  title: string;
  lead?: string;
  action?: { label: string; to: string };
}) {
  return (
    <div className="sec-head">
      <h2 className="display">{title}</h2>
      {lead && <p>{lead}</p>}
      {action && (
        <Link to={action.to} className="link-u sec-link">
          {action.label}
        </Link>
      )}
    </div>
  );
}

function mainDeparture(trip: Trip, lang: Lang) {
  if (trip.departures.length === 0) return "–";
  const main = trip.departures.find((d) => d.place.cs.includes("Budějovice")) ?? trip.departures[0];
  return main.place[lang];
}

/* ---------------- header ---------------- */

function Header({
  lang,
  setLang,
  route,
}: {
  lang: Lang;
  setLang: (l: Lang) => void;
  route: Route;
}) {
  const onTrips = route.name === "listing" || route.name === "trip" || route.name === "booking";
  return (
    <header className="topbar">
      <div className="frame topbar-inner">
        <Link to="/" className="brand">
          <span className="brand-mark" aria-hidden="true" />
          <span className="brand-name">CA TRIO</span>
          <span className="brand-sub">{S.brandTag[lang]}</span>
        </Link>

        <nav className="nav-tabs" aria-label={lang === "cs" ? "Hlavní navigace" : "Main navigation"}>
          <Link to="/zajezdy" className={`tab-link${onTrips ? " is-on" : ""}`}>
            {S.navTrips[lang]}
          </Link>
          <Link to="/kontakt" className={`tab-link${route.name === "contact" ? " is-on" : ""}`}>
            {S.navContact[lang]}
          </Link>
        </nav>

        <div className="topbar-tools">
          <a className="phone" href={PLACES.phoneHref}>
            {PLACES.phone}
          </a>
          <div className="lang" role="group" aria-label="Language">
            <button type="button" className={lang === "cs" ? "is-on" : ""} onClick={() => setLang("cs")} aria-pressed={lang === "cs"}>
              CS
            </button>
            <span aria-hidden="true">/</span>
            <button type="button" className={lang === "en" ? "is-on" : ""} onClick={() => setLang("en")} aria-pressed={lang === "en"}>
              EN
            </button>
          </div>
          <Link to="/zajezdy" className="btn btn-sm">
            {S.navBook[lang]}
          </Link>
        </div>
      </div>
    </header>
  );
}

/* ---------------- footer ---------------- */

function Footer({ lang }: { lang: Lang }) {
  return (
    <footer className="footer">
      <div className="frame">
        <div className="footer-cta">
          <h2 className="display">{S.homeTitle9[lang]}</h2>
          <div className="footer-cta-side">
            <a className="footer-phone" href={PLACES.phoneHref}>
              {PLACES.phone}
            </a>
            <span>{S.hoursValue[lang]}</span>
            <Link to="/zajezdy" className="btn btn-light">
              {S.navBook[lang]}
            </Link>
          </div>
        </div>

        <div className="footer-cols">
          <div className="footer-brandcol">
            <span className="footer-brand">CA TRIO</span>
            <p>
              {PLACES.street}
              <br />
              {S.companyId[lang]} {PLACES.ico}
            </p>
          </div>
          <div>
            <h3>{S.footerTrips[lang]}</h3>
            <Link to="/zajezdy?kategorie=advent">{CATS[0].name[lang]}</Link>
            <Link to="/zajezdy?kategorie=divadlo">{CATS[1].name[lang]}</Link>
            <Link to="/zajezdy?kategorie=recko">{CATS[2].name[lang]}</Link>
            <Link to="/zajezdy?kategorie=lazne">{CATS[3].name[lang]}</Link>
          </div>
          <div>
            <h3>{S.footerContact[lang]}</h3>
            <Link to="/kontakt">{S.navContact[lang]}</Link>
            <a href={`mailto:${PLACES.email}`}>{PLACES.email}</a>
            <a href={PLACES.facebook} target="_blank" rel="noreferrer">
              Facebook
            </a>
          </div>
          <div>
            <h3>{S.office[lang]}</h3>
            <p>{S.hoursValue[lang]}</p>
            <Link to="/admin" className="footer-admin">
              {S.footerAdmin[lang]}
            </Link>
          </div>
        </div>

        <div className="footer-bottom">
          <span>© 2026 CA Trio, {PLACES.owner}</span>
          <span>{S.footerNote[lang]}</span>
        </div>
      </div>
    </footer>
  );
}

/* ---------------- home ---------------- */

function Hero({ lang, trips }: { lang: Lang; trips: Trip[] }) {
  const byCat = (id: CatId) =>
    trips.filter((t) => t.cat === id).sort((a, b) => a.date.localeCompare(b.date))[0];

  return (
    <section className="hero">
      <div className="frame hero-grid">
        <div className="hero-copy">
          <p className="ticket-line">
            <i className="mark mark-coral" aria-hidden="true" />
            {S.homeKicker[lang]}
          </p>
          <h1 className="display poster-title">{S.homeTitle9[lang]}</h1>
          <p className="hero-lead">{S.homeLead9[lang]}</p>
          <p className="hero-note">{S.homeNote9[lang]}</p>
          <div className="hero-cta">
            <Link to="/zajezdy" className="btn btn-ink">
              {S.homeCta[lang]}
            </Link>
            <Link to="/zajezdy?kategorie=advent" className="link-u">
              {S.homeCta2[lang]}
            </Link>
          </div>
        </div>

        <aside className="season">
          <div className="season-head">
            <span>{S.seasonTitle[lang]}</span>
            <span className="season-count">{lang === "cs" ? CZ_COUNT(trips.length) : EN_COUNT(trips.length)}</span>
          </div>
          <ul>
            {CATS.map((cat) => {
              const next = byCat(cat.id);
              return (
                <li key={cat.id}>
                  <Link to={`/zajezdy?kategorie=${cat.id}`} className="season-row">
                    <span className="colour-bar" style={{ background: cat.colour }} />
                    <span className="season-main">
                      <span className="season-cat">{cat.name[lang]}</span>
                      <span className="season-meta">
                        {next
                          ? `${lang === "cs" ? CZ_COUNT(trips.filter((t) => t.cat === cat.id).length) : EN_COUNT(trips.filter((t) => t.cat === cat.id).length)}, ${fmtShort(next.date, lang)}`
                          : ""}
                      </span>
                    </span>
                    <span className="season-price">{next ? price(next.price, lang) : "–"}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
          <Link to="/zajezdy" className="season-foot">
            {S.seasonCta[lang]}
            <span aria-hidden="true">↗</span>
          </Link>
        </aside>
      </div>
    </section>
  );
}

function Band({ lang }: { lang: Lang }) {
  return (
    <section className="band">
      <img
        className="band-img"
        src="assets/hero-4.jpg"
        alt={
          lang === "cs"
            ? "Hlediště a lóže historického divadla během představení"
            : "The auditorium and boxes of a historic theatre during a performance"
        }
      />
      <div className="frame band-inner">
        <div className="band-ticket">
          <span className="band-kicker">
            <CatLabel cat="divadlo" lang={lang} />
          </span>
          <h2 className="display">{S.bandTitle[lang]}</h2>
          <p>{S.bandBody[lang]}</p>
          <Link to="/zajezdy?kategorie=divadlo" className="link-u">
            {S.bandCta[lang]}
          </Link>
        </div>
      </div>
    </section>
  );
}

function Stub({ trip, lang }: { trip: Trip; lang: Lang }) {
  const left = seatsLeft(trip);
  return (
    <Link to={`/zajezdy/${trip.id}`} className={`stub${trip.soldOut ? " is-soldout" : ""}`}>
      <div className="stub-head">
        <CatLabel cat={trip.cat} lang={lang} />
        <span className="stub-price">
          {price(trip.price, lang)}
          <small>{S.pricePerPerson[lang]}</small>
        </span>
      </div>
      <h3 className="stub-title display">{trip.title[lang]}</h3>
      <p className="stub-summary">{trip.summary[lang]}</p>
      <div className="stub-perf">
        <span className="notch notch-l" aria-hidden="true" />
        <span className="notch notch-r" aria-hidden="true" />
      </div>
      <div className="stub-foot">
        <span className="stub-date">{fmtShort(trip.date, lang)}</span>
        <span className="stub-seats">
          {trip.soldOut ? <em className="sold">{S.soldOut[lang]}</em> : `${left} / ${trip.seats}`}
        </span>
        <span className="stub-cta">{S.stubCta[lang]}</span>
      </div>
    </Link>
  );
}

function Home({ lang, state }: { lang: Lang; state: AppState }) {
  const trips = state.trips.filter((t) => t.published);
  const next = [...trips]
    .filter((t) => t.date >= "2026-11-15")
    .sort((a, b) => a.date.localeCompare(b.date))
    .slice(0, 4);
  const advent = trips.find((t) => t.id === "vanochni-viden") ?? trips[0];
  const greece = trips.find((t) => t.cat === "recko");

  return (
    <>
      <Hero lang={lang} trips={trips} />
      <Band lang={lang} />

      <section className="section section-next">
        <div className="frame">
          <SectionHead
            title={S.nextTitle[lang]}
            action={{ label: S.allTrips[lang], to: "/zajezdy" }}
          />
          <div className="stub-grid">
            {next.map((trip) => (
              <Stub trip={trip} lang={lang} key={trip.id} />
            ))}
          </div>
        </div>
      </section>

      {advent && (
        <section className="section">
          <div className="frame">
            <div className="split">
              <div className="split-media">
                <div className="photo">
                  <img
                    src="assets/vienna-christmas-market.jpg"
                    alt={
                      lang === "cs"
                        ? "Vídeňský christkindlmarkt před radnicí"
                        : "Vienna's Christkindlmarkt in front of the City Hall"
                    }
                    loading="lazy"
                  />
                  <span className="photo-strip" />
                </div>
                <p className="photo-caption">
                  {lang === "cs"
                    ? "Vídeň, náměstí před radnicí. 19. 12. 2026."
                    : "Vienna, the square in front of the City Hall. 19 Dec 2026."}
                </p>
              </div>
              <div className="split-copy">
                <span className="overline">{CATS[0].name[lang]}</span>
                <h2 className="display">{S.adventTitle[lang]}</h2>
                <p>{S.adventBody[lang]}</p>
                <div className="price-rule">
                  <span>{S.pricePerPerson[lang]}</span>
                  <strong>{price(advent.price, lang)}</strong>
                  <span>{fmtShort(advent.date, lang)}</span>
                </div>
                <div className="hero-cta">
                  <Link to={`/zajezdy/${advent.id}`} className="btn">
                    {S.adventCta[lang]}
                  </Link>
                  <Link to={`/objednavka/${advent.id}`} className="link-u">
                    {S.chooseSeat[lang]}
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {greece && (
        <section className="section">
          <div className="frame">
            <div className="greece-box">
              <span className="greece-strip" aria-hidden="true" />
              <div className="greece-copy">
                <span className="overline">{CATS[2].name[lang]}</span>
                <h2 className="display">{S.greeceTitle[lang]}</h2>
                <p>{S.greeceBody[lang]}</p>
                <div className="price-rule">
                  <span>{S.pricePerPerson[lang]}</span>
                  <strong>{price(greece.price, lang)}</strong>
                  <span>{fmtRange(greece, lang)}</span>
                </div>
                <Link to={`/zajezdy/${greece.id}`} className="btn">
                  {S.greeceCta[lang]}
                </Link>
              </div>
              <div className="greece-photo">
                <img
                  src="assets/hotel-sissy.jpg"
                  alt={
                    lang === "cs"
                      ? "Zahrada hotelu SISSY s cestou k moři"
                      : "The garden of Hotel SISSY with a path to the sea"
                  }
                  loading="lazy"
                />
              </div>
            </div>
          </div>
        </section>
      )}

      <section className="section section-counter">
        <div className="frame">
          <div className="counter">
            <div className="counter-intro">
              <h2 className="display">{S.counterTitle[lang]}</h2>
              <p>{S.counterLead[lang]}</p>
            </div>
            <div className="counter-cell">
              <span>{S.openingHours[lang]}</span>
              <strong>{S.hoursValue[lang]}</strong>
            </div>
            <div className="counter-cell">
              <span>{S.vouchers[lang]}</span>
              <strong>PLUXEE, EDENRED, BENEFITY</strong>
            </div>
            <div className="counter-cell">
              <span>{S.insurance[lang]}</span>
              <strong>AXA, 35 Kč / {lang === "cs" ? "osobu a den" : "person a day"}</strong>
            </div>
            <div className="counter-cell">
              <span>{S.office[lang]}</span>
              <strong>
                <a href={PLACES.phoneHref}>{PLACES.phone}</a>
              </strong>
            </div>
          </div>
        </div>
      </section>

      <section className="section section-partners">
        <div className="frame partners-row">
          <div>
            <h2 className="display">{S.partnersTitle[lang]}</h2>
            <p>{S.partnersBody[lang]}</p>
          </div>
          <Link to="/kontakt" className="btn">
            {S.partnersCta[lang]}
          </Link>
        </div>
      </section>
    </>
  );
}

/* ---------------- listing ---------------- */

type Filters = {
  cat: CatId | "all";
  month: string;
  availability: "all" | "free" | "out";
  band: "all" | "b1" | "b2" | "b3";
};

function Listing({ lang, state, initialCat }: { lang: Lang; state: AppState; initialCat?: string }) {
  const trips = state.trips.filter((t) => t.published);
  const months = useMemo(() => [...new Set(trips.map((t) => monthKey(t.date)))].sort(), [trips]);
  const [filters, setFilters] = useState<Filters>({
    cat: (CATS.some((c) => c.id === initialCat) ? initialCat : "all") as Filters["cat"],
    month: "all",
    availability: "all",
    band: "all",
  });

  const set = <K extends keyof Filters>(key: K, value: Filters[K]) => setFilters((f) => ({ ...f, [key]: value }));

  const result = trips
    .filter((t) => (filters.cat === "all" ? true : t.cat === filters.cat))
    .filter((t) => (filters.month === "all" ? true : monthKey(t.date) === filters.month))
    .filter((t) => (filters.availability === "all" ? true : filters.availability === "out" ? t.soldOut : !t.soldOut))
    .filter((t) => {
      if (filters.band === "all") return true;
      if (filters.band === "b1") return t.price < 700;
      if (filters.band === "b2") return t.price >= 700 && t.price <= 1500;
      return t.price > 1500;
    })
    .sort((a, b) => a.date.localeCompare(b.date));

  const reset = () => setFilters({ cat: "all", month: "all", availability: "all", band: "all" });

  return (
    <div className="frame page">
      <div className="list-head">
        <div>
          <h1 className="display list-title">{S.listTitle[lang]}</h1>
          <p className="lead">{S.listingLead9[lang]}</p>
        </div>
        <div className="count-stamp">
          <strong>{result.length}</strong>
          <span>{lang === "cs" ? (result.length === 1 ? "zájezd" : result.length < 5 ? "zájezdy" : "zájezdů") : result.length === 1 ? "trip" : "trips"}</span>
        </div>
      </div>

      <div className="filter-card">
        <div className="filter-top">
          <span>{S.filterBar[lang]}</span>
          <button type="button" className="link-u" onClick={reset}>
            {S.filterReset[lang]}
          </button>
        </div>
        <div className="filter-row">
          <div className="filter-group">
            <span className="flabel">{S.filterCategory[lang]}</span>
            <div className="chips">
              <button type="button" className={`chip${filters.cat === "all" ? " is-on" : ""}`} onClick={() => set("cat", "all")}>
                {S.filterAll[lang]}
              </button>
              {CATS.map((c) => (
                <button type="button" key={c.id} className={`chip${filters.cat === c.id ? " is-on" : ""}`} onClick={() => set("cat", c.id)}>
                  <i className="dot" style={{ background: c.colour }} />
                  {c.name[lang]}
                </button>
              ))}
            </div>
          </div>
          <div className="filter-group">
            <span className="flabel">{S.filterMonth[lang]}</span>
            <div className="chips">
              <button type="button" className={`chip${filters.month === "all" ? " is-on" : ""}`} onClick={() => set("month", "all")}>
                {S.filterAll[lang]}
              </button>
              {months.map((m) => (
                <button type="button" key={m} className={`chip${filters.month === m ? " is-on" : ""}`} onClick={() => set("month", m)}>
                  {monthLabel(m, lang)}
                </button>
              ))}
            </div>
          </div>
          <div className="filter-group">
            <span className="flabel">{S.filterAvailability[lang]}</span>
            <div className="chips">
              <button type="button" className={`chip${filters.availability === "all" ? " is-on" : ""}`} onClick={() => set("availability", "all")}>
                {S.filterAll[lang]}
              </button>
              <button type="button" className={`chip${filters.availability === "free" ? " is-on" : ""}`} onClick={() => set("availability", "free")}>
                {S.filterAvailable[lang]}
              </button>
              <button type="button" className={`chip${filters.availability === "out" ? " is-on" : ""}`} onClick={() => set("availability", "out")}>
                {S.filterSoldOut[lang]}
              </button>
            </div>
          </div>
          <div className="filter-group">
            <span className="flabel">{S.filterPrice[lang]}</span>
            <div className="chips">
              <button type="button" className={`chip${filters.band === "all" ? " is-on" : ""}`} onClick={() => set("band", "all")}>
                {S.filterAll[lang]}
              </button>
              <button type="button" className={`chip${filters.band === "b1" ? " is-on" : ""}`} onClick={() => set("band", "b1")}>
                {S.band1[lang]}
              </button>
              <button type="button" className={`chip${filters.band === "b2" ? " is-on" : ""}`} onClick={() => set("band", "b2")}>
                {S.band2[lang]}
              </button>
              <button type="button" className={`chip${filters.band === "b3" ? " is-on" : ""}`} onClick={() => set("band", "b3")}>
                {S.band3[lang]}
              </button>
            </div>
          </div>
        </div>
      </div>

      {result.length === 0 ? (
        <div className="empty">
          <strong className="empty-zero">0</strong>
          <h2 className="display">{S.listEmpty[lang]}</h2>
          <p>{S.listEmptyHint[lang]}</p>
          <button type="button" className="btn" onClick={reset}>
            {S.filterReset[lang]}
          </button>
        </div>
      ) : (
        <div className="stub-grid listing-grid">
          {result.map((trip, i) => (
            <motion.div
              key={trip.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.22, delay: Math.min(i, 6) * 0.03, ease: [0.23, 1, 0.32, 1] }}
            >
              <Stub trip={trip} lang={lang} />
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ---------------- detail ---------------- */

function TripDetail({ lang, trip }: { lang: Lang; trip: Trip }) {
  const left = seatsLeft(trip);
  return (
    <div className="frame page">
      <Link to="/zajezdy" className="back-link">
        ← {S.backToTrips[lang]}
      </Link>

      <header className="poster">
        <div className="poster-eyebrow">
          <CatLabel cat={trip.cat} lang={lang} />
          <span>{fmtRange(trip, lang)}</span>
        </div>
        <h1 className="display poster-h1">{trip.title[lang]}</h1>
        <p className="poster-summary">{trip.summary[lang]}</p>
        <dl className="poster-strip">
          <div>
            <dt>{S.dateLabel[lang]}</dt>
            <dd>{fmtRange(trip, lang)}</dd>
          </div>
          <div>
            <dt>{S.departsFrom[lang]}</dt>
            <dd>{mainDeparture(trip, lang)}</dd>
          </div>
          <div>
            <dt>{S.departuresTitle[lang]}</dt>
            <dd>{trip.departures.length}</dd>
          </div>
          <div>
            <dt>{S.pricePerPerson[lang]}</dt>
            <dd>{price(trip.price, lang)}</dd>
          </div>
        </dl>
      </header>

      <div className="photo photo-wide">
        <img src={trip.image} alt={trip.title[lang]} />
      </div>

      <div className="detail-body">
        <div className="detail-main">
          <section className="detail-section">
            <h2 className="display">{S.program[lang]}</h2>
            <div className="prose">
              {trip.body.map((p, i) => (
                <p key={i}>{p[lang]}</p>
              ))}
            </div>
          </section>

          <div className="inc-grid">
            <section>
              <h2 className="display">{S.included[lang]}</h2>
              <ul className="inc-list yes">
                {trip.includes.map((item, i) => (
                  <li key={i}>{item[lang]}</li>
                ))}
              </ul>
            </section>
            {trip.excludes.length > 0 && (
              <section>
                <h2 className="display">{S.excluded[lang]}</h2>
                <ul className="inc-list no">
                  {trip.excludes.map((item, i) => (
                    <li key={i}>{item[lang]}</li>
                  ))}
                </ul>
              </section>
            )}
          </div>

          <section className="detail-section">
            <h2 className="display">{S.departuresTitle[lang]}</h2>
            <ul className="depart-list">
              {trip.departures.map((d, i) => (
                <li key={i}>
                  <span className="depart-time display">{d.time}</span>
                  <span className="depart-place">{d.place[lang]}</span>
                </li>
              ))}
            </ul>
            {trip.returnNote && (
              <p className="return-note">
                <strong>{S.returnLabel[lang]}:</strong> {trip.returnNote[lang]}
              </p>
            )}
          </section>
        </div>

        <aside className="detail-aside">
          <div className="ticket">
            <div className="ticket-top">
              <span>{S.ticketLabel[lang]}</span>
              <span className="ticket-no">{trip.date.slice(2, 4)}{trip.date.slice(5, 7)}{trip.date.slice(8, 10)}</span>
            </div>
            <div className="ticket-body">
              <span className="ticket-label">{S.pricePerPerson[lang]}</span>
              <strong className="ticket-price">{price(trip.price, lang)}</strong>
              {trip.priceNote && <p className="ticket-note">{trip.priceNote[lang]}</p>}
              <dl className="ticket-facts">
                <div>
                  <dt>{S.dateLabel[lang]}</dt>
                  <dd>{fmtRange(trip, lang)}</dd>
                </div>
                <div>
                  <dt>{S.departsFrom[lang]}</dt>
                  <dd>{mainDeparture(trip, lang)}</dd>
                </div>
                <div>
                  <dt>{S.seatsFree[lang]}</dt>
                  <dd>{trip.soldOut ? S.soldOut[lang] : `${left} / ${trip.seats}`}</dd>
                </div>
              </dl>
              {trip.soldOut ? (
                <>
                  <span className="stamp">{S.soldOut[lang]}</span>
                  <Link to="/kontakt" className="btn btn-ink btn-block">
                    {S.askAnotherDate[lang]}
                  </Link>
                </>
              ) : (
                <Link to={`/objednavka/${trip.id}`} className="btn btn-ink btn-block">
                  {S.chooseSeat[lang]}
                </Link>
              )}
              <a href={PLACES.phoneHref} className="ticket-phone">
                {S.practicalPhone[lang]}
              </a>
            </div>
            <div className="ticket-perf">
              <span className="notch notch-l" aria-hidden="true" />
              <span className="notch notch-r" aria-hidden="true" />
            </div>
            <div className="ticket-foot">
              <p>{S.insuranceLine[lang]}</p>
              <p>{S.vouchersLine[lang]}</p>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}

/* ---------------- booking ---------------- */

function BookingPage({ lang, trip, onCreate }: { lang: Lang; trip: Trip; onCreate: (b: Booking) => void }) {
  const [departure, setDeparture] = useState("");
  const [seats, setSeats] = useState<string[]>([]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [note, setNote] = useState("");
  const [people, setPeople] = useState<string[]>([]);
  const [trap, setTrap] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [done, setDone] = useState<Booking | null>(null);

  const total = trip.price * seats.length;

  const toggleSeat = (seat: string) => {
    const next = seats.includes(seat)
      ? seats.filter((s) => s !== seat)
      : [...seats, seat].sort((a, b) => Number(a) - Number(b));
    setSeats(next);
    setPeople((p) => Array.from({ length: next.length }, (_, i) => p[i] ?? ""));
    setErrors((e) => ({ ...e, seats: "" }));
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (trap) return;
    const next: Record<string, string> = {};
    if (!departure) next.departure = lang === "cs" ? "Vyberte nástupní místo." : "Choose a departure point.";
    if (seats.length === 0) next.seats = S.errSeats[lang];
    if (name.trim().length < 3) next.name = S.errName[lang];
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) next.email = S.errEmail[lang];
    if (phone.replace(/\D/g, "").length < 9) next.phone = S.errPhone[lang];
    if (seats.length > 0 && people.some((p) => p.trim().length < 2)) next.people = S.errPeople[lang];
    setErrors(next);
    if (Object.keys(next).length > 0) {
      document.querySelector(".booking-form")?.scrollIntoView({ behavior: "smooth", block: "start" });
      return;
    }
    const booking: Booking = {
      ref: makeRef(),
      tripId: trip.id,
      tripTitle: trip.title,
      departure,
      seats,
      name: name.trim(),
      email: email.trim(),
      phone: phone.trim(),
      people: people.map((p) => p.trim()),
      note: note.trim(),
      total,
      created: new Date().toISOString(),
    };
    onCreate(booking);
    setDone(booking);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (done) {
    return (
      <div className="frame page">
        <div className="success">
          <div className="success-stamp">{S.successTitle[lang]}</div>
          <h1 className="display success-h1">{trip.title[lang]}</h1>
          <p className="lead">{S.successBody[lang]}</p>
          <dl className="success-grid">
            <div>
              <dt>{S.bookingRef[lang]}</dt>
              <dd className="success-ref">{done.ref}</dd>
            </div>
            <div>
              <dt>{S.boardingAt[lang]}</dt>
              <dd>{done.departure}</dd>
            </div>
            <div>
              <dt>{S.seatsLabel[lang]}</dt>
              <dd>{done.seats.join(", ")}</dd>
            </div>
            <div>
              <dt>{S.total[lang]}</dt>
              <dd>{price(done.total, lang)}</dd>
            </div>
          </dl>
          <div className="hero-cta">
            <Link to={`/zajezdy/${trip.id}`} className="btn">
              {S.backToTrip[lang]}
            </Link>
            <Link to="/zajezdy" className="link-u">
              {S.moreTrips[lang]}
            </Link>
          </div>
          <p className="form-mock">{S.mockNote[lang]}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="frame page">
      <Link to={`/zajezdy/${trip.id}`} className="back-link">
        ← {S.backToTrips[lang]}
      </Link>

      <div className="booking-head">
        <span className="overline">{S.bookTitle[lang]}</span>
        <h1 className="display booking-title">{trip.title[lang]}</h1>
        <div className="booking-strip">
          <span>{fmtRange(trip, lang)}</span>
          <span>{catOf(trip.cat).name[lang]}</span>
          <span>{price(trip.price, lang)} / {S.pricePerPerson[lang].toLowerCase()}</span>
        </div>
      </div>

      <form className="booking-form" onSubmit={submit} noValidate>
        <div className="booking-grid">
          <div className="booking-main">
            <section className="step">
              <div className="step-head">
                <span className="step-num display">1</span>
                <h2 className="display">{S.step1[lang]}</h2>
              </div>
              <p className="step-lead">{S.chooseDep[lang]}</p>
              <div className="dep-list" role="radiogroup" aria-label={S.step1[lang]}>
                {trip.departures.map((d) => {
                  const value = d.place[lang];
                  const on = departure === value;
                  return (
                    <button
                      type="button"
                      key={value}
                      role="radio"
                      aria-checked={on}
                      className={`dep-choice${on ? " is-on" : ""}`}
                      onClick={() => {
                        setDeparture(value);
                        setErrors((e) => ({ ...e, departure: "" }));
                      }}
                    >
                      <span className="pick-box" aria-hidden="true">
                        {on ? <i /> : null}
                      </span>
                      <span className="dep-place">{value}</span>
                      <span className="dep-time display">{d.time}</span>
                    </button>
                  );
                })}
              </div>
              {errors.departure && <p className="field-error">{errors.departure}</p>}
            </section>

            <section className="step">
              <div className="step-head">
                <span className="step-num display">2</span>
                <h2 className="display">{S.step2[lang]}</h2>
              </div>
              <p className="step-lead">{S.seatHint[lang]}</p>
              <div className="seat-card">
                <SeatMap trip={trip} selected={seats} onToggle={toggleSeat} lang={lang} />
              </div>
              {errors.seats && <p className="field-error">{errors.seats}</p>}
            </section>

            <section className="step">
              <div className="step-head">
                <span className="step-num display">3</span>
                <h2 className="display">{S.step3[lang]}</h2>
              </div>
              <div className="form-grid">
                <label className="field">
                  <span>{S.fullName[lang]}</span>
                  <input value={name} onChange={(e) => setName(e.target.value)} autoComplete="name" />
                  {errors.name && <em className="field-error">{errors.name}</em>}
                </label>
                <label className="field">
                  <span>{S.email[lang]}</span>
                  <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" autoComplete="email" />
                  {errors.email && <em className="field-error">{errors.email}</em>}
                </label>
                <label className="field">
                  <span>{S.phone[lang]}</span>
                  <input value={phone} onChange={(e) => setPhone(e.target.value)} autoComplete="tel" />
                  {errors.phone && <em className="field-error">{errors.phone}</em>}
                </label>
                <div className="field field-honeypot" aria-hidden="true">
                  <label>
                    Website
                    <input tabIndex={-1} autoComplete="off" value={trap} onChange={(e) => setTrap(e.target.value)} />
                  </label>
                </div>
              </div>

              {seats.length > 0 && (
                <div className="people">
                  <span className="people-label">{S.participants[lang]}</span>
                  <div className="people-grid">
                    {seats.map((seat, i) => (
                      <label className="field" key={seat}>
                        <span>
                          {S.participant[lang]} {i + 1} · {S.seatLabel[lang]} {seat}
                        </span>
                        <input
                          value={people[i] ?? ""}
                          onChange={(e) => {
                            const value = e.target.value;
                            setPeople((p) => p.map((v, idx) => (idx === i ? value : v)));
                          }}
                        />
                      </label>
                    ))}
                  </div>
                  {errors.people && <p className="field-error">{errors.people}</p>}
                </div>
              )}

              <label className="field">
                <span>{S.noteLabel[lang]}</span>
                <textarea value={note} onChange={(e) => setNote(e.target.value)} placeholder={S.notePlaceholder[lang]} />
              </label>
              <p className="form-mock">{S.mockNote[lang]}</p>
            </section>
          </div>

          <aside className="booking-aside">
            <div className="ticket summary-ticket">
              <div className="ticket-top">
                <span>{S.summary[lang]}</span>
                <span className="ticket-no">{seats.length ? `${seats.length}×` : "–"}</span>
              </div>
              <div className="ticket-body">
                <dl className="summary-list">
                  <div>
                    <dt>{S.tripLabel[lang]}</dt>
                    <dd>{trip.title[lang]}</dd>
                  </div>
                  <div>
                    <dt>{S.dateLabel[lang]}</dt>
                    <dd>{fmtRange(trip, lang)}</dd>
                  </div>
                  <div>
                    <dt>{S.boardingAt[lang]}</dt>
                    <dd>{departure || "–"}</dd>
                  </div>
                  <div>
                    <dt>{S.selectedSeats[lang]}</dt>
                    <dd>{seats.length ? seats.join(", ") : S.noSeats[lang]}</dd>
                  </div>
                </dl>
              </div>
              <div className="ticket-perf">
                <span className="notch notch-l" aria-hidden="true" />
                <span className="notch notch-r" aria-hidden="true" />
              </div>
              <div className="ticket-total">
                <span>{S.total[lang]}</span>
                <strong>{price(total, lang)}</strong>
              </div>
              <button type="submit" className="btn btn-ink btn-block">
                {S.submit[lang]}
              </button>
              <p className="ticket-small">{S.payNote[lang]}</p>
            </div>
          </aside>
        </div>
      </form>
    </div>
  );
}

/* ---------------- contact ---------------- */

function Contact({ lang }: { lang: Lang }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [sent, setSent] = useState(false);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || message.trim().length < 4) {
      setError(S.errFields[lang]);
      return;
    }
    setError("");
    setSent(true);
    setName("");
    setEmail("");
    setMessage("");
  };

  return (
    <div className="frame page">
      <div className="list-head">
        <div>
          <h1 className="display list-title">{S.contactTitle[lang]}</h1>
          <p className="lead">{S.contactLead[lang]}</p>
        </div>
      </div>

      <div className="contact-grid">
        <div className="contact-list">
          <section>
            <h2>{S.office[lang]}</h2>
            <p className="contact-big">CA Trio</p>
            <p>{PLACES.street}</p>
            <p>
              <a href={PLACES.phoneHref}>{PLACES.phone}</a>
              <br />
              <a href={`mailto:${PLACES.email}`}>{PLACES.email}</a>
            </p>
          </section>
          <section>
            <h2>{S.openingHours[lang]}</h2>
            <p>{S.hoursValue[lang]}</p>
            <p className="muted">{S.registry[lang]}</p>
          </section>
          <section>
            <h2>{S.vouchers[lang]}</h2>
            <p>PLUXEE, EDENRED, BENEFITY</p>
          </section>
          <section>
            <h2>{S.insurance[lang]}</h2>
            <p>{S.insuranceValue[lang]}</p>
          </section>
          <section>
            <h2>{S.owner[lang]}</h2>
            <p>{PLACES.owner}</p>
            <p className="muted">
              {S.companyId[lang]} {PLACES.ico}
            </p>
          </section>
        </div>

        <div className="contact-form ticket">
          <div className="ticket-top">
            <span>{S.formTitle[lang]}</span>
            <span className="ticket-no">CA</span>
          </div>
          <div className="ticket-body">
            <p className="form-lead">{S.formLead[lang]}</p>
            {sent ? (
              <p className="form-sent">{S.sent[lang]}</p>
            ) : (
              <form onSubmit={submit} noValidate>
                <label className="field">
                  <span>{S.fullName[lang]}</span>
                  <input value={name} onChange={(e) => setName(e.target.value)} autoComplete="name" />
                </label>
                <label className="field">
                  <span>{S.email[lang]}</span>
                  <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" autoComplete="email" />
                </label>
                <label className="field">
                  <span>{S.message[lang]}</span>
                  <textarea rows={5} value={message} onChange={(e) => setMessage(e.target.value)} />
                </label>
                {error && <p className="field-error">{error}</p>}
                <button type="submit" className="btn btn-ink">
                  {S.send[lang]}
                </button>
              </form>
            )}
          </div>
          <div className="ticket-perf">
            <span className="notch notch-l" aria-hidden="true" />
            <span className="notch notch-r" aria-hidden="true" />
          </div>
          <div className="ticket-foot">
            <p>{S.hoursValue[lang]}</p>
            <p>{PLACES.phone}</p>
          </div>
        </div>
      </div>

      <section className="terms">
        <h2 className="display">{S.termsTitle[lang]}</h2>
        <p className="sec-lead">{S.termsLead[lang]}</p>
        <table className="terms-table">
          <thead>
            <tr>
              <th>{S.termsWhen[lang]}</th>
              <th>{S.termsFee[lang]}</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>{S.termsR1[lang]}</td>
              <td className="display">15 %</td>
            </tr>
            <tr>
              <td>{S.termsR2[lang]}</td>
              <td className="display">30 %</td>
            </tr>
            <tr>
              <td>{S.termsR3[lang]}</td>
              <td className="display">60 %</td>
            </tr>
            <tr>
              <td>{S.termsR4[lang]}</td>
              <td className="display">100 %</td>
            </tr>
          </tbody>
        </table>
        <p className="terms-note">{S.termsNote[lang]}</p>
      </section>

      <section className="agencies">
        <h2 className="display">{S.agenciesTitle[lang]}</h2>
        <p className="sec-lead">{S.agenciesLead[lang]}</p>
        <ul className="agency-cols">
          {AGENCIES.map((a) => (
            <li key={a.name}>
              <span className="agency-name">{a.name}</span>
              <span className="agency-where">{a.where[lang]}</span>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}

/* ---------------- app ---------------- */

export default function App() {
  const hash = useHash();
  const route = useMemo(() => parseRoute(hash), [hash]);
  const [lang, setLangState] = useState<Lang>(loadLang);
  const [state, setState] = useState<AppState>(loadState);

  useEffect(() => saveLang(lang), [lang]);
  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);
  useEffect(() => saveState(state), [state]);
  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, [route.name, "slug" in route ? route.slug : ""]);
  useEffect(() => {
    document.title =
      route.name === "home"
        ? "CA Trio, zájezdy z Moravských Budějovic"
        : route.name === "listing"
          ? "Zájezdy | CA Trio"
          : route.name === "contact"
            ? "Kontakt | CA Trio"
            : route.name === "admin"
              ? "Administrace | CA Trio"
              : "CA Trio";
  }, [route]);

  const setLang = (l: Lang) => setLangState(l);

  const onCreate = (b: Booking) => {
    setState((s) => ({
      bookings: [b, ...s.bookings],
      trips: s.trips.map((t) =>
        t.id === b.tripId ? { ...t, taken: [...t.taken, ...b.seats.filter((x) => !t.taken.includes(x))] } : t,
      ),
    }));
  };

  const published = state.trips.filter((t) => t.published);
  const tripSlug = "slug" in route ? route.slug : "";

  let page: React.ReactNode;
  if (route.name === "home") {
    page = <Home lang={lang} state={state} />;
  } else if (route.name === "listing") {
    page = (
      <Listing lang={lang} state={state} initialCat={new URLSearchParams(queryOf(hash)).get("kategorie") ?? undefined} />
    );
  } else if (route.name === "trip") {
    const trip = published.find((t) => t.id === tripSlug);
    page = trip ? <TripDetail lang={lang} trip={trip} /> : <Missing lang={lang} />;
  } else if (route.name === "booking") {
    const trip = published.find((t) => t.id === tripSlug);
    page = trip ? <BookingPage lang={lang} trip={trip} onCreate={onCreate} /> : <Missing lang={lang} />;
  } else if (route.name === "contact") {
    page = <Contact lang={lang} />;
  } else if (route.name === "admin") {
    page = <Admin lang={lang} state={state} setState={setState} />;
  } else {
    page = <Missing lang={lang} />;
  }

  return (
    <MotionConfig reducedMotion="user">
      <Header lang={lang} setLang={setLang} route={route} />
      <AnimatePresence mode="wait" initial={false}>
        <motion.main
          key={hash}
          id="main"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2, ease: [0.23, 1, 0.32, 1] }}
        >
          {page}
        </motion.main>
      </AnimatePresence>
      <Footer lang={lang} />
    </MotionConfig>
  );
}

function Missing({ lang }: { lang: Lang }) {
  return (
    <div className="frame page">
      <div className="empty">
        <strong className="empty-zero">404</strong>
        <h1 className="display">{S.notFound[lang]}</h1>
        <p>{S.notFoundLead[lang]}</p>
        <Link to="/zajezdy" className="btn">
          {S.allTrips[lang]}
        </Link>
      </div>
    </div>
  );
}
