import { useEffect, useState } from "react";
import { i18n, t, usePersistence } from "./core";
import { categories } from "./data";
import { Landing, TripsPage, TripPage, BookingPage, ContactPage, AdminPage } from "./pages";

type Route = { name: "home" | "trips" | "trip" | "booking" | "contact" | "admin"; id?: string };

function parseHash(): Route {
  const raw = window.location.hash.replace(/^#/, "");
  const parts = raw.split("/").filter(Boolean);
  if (parts[0] === "trips") return { name: "trips" };
  if (parts[0] === "trip" && parts[1]) return { name: "trip", id: decodeURIComponent(parts[1]) };
  if (parts[0] === "booking" && parts[1]) return { name: "booking", id: decodeURIComponent(parts[1]) };
  if (parts[0] === "contact") return { name: "contact" };
  if (parts[0] === "admin") return { name: "admin" };
  return { name: "home" };
}

export default function App() {
  const { lang, setLang, tripList, updateTrips, bookingList, addBooking, clearAll } = usePersistence();
  const [route, setRoute] = useState<Route>(() => parseHash());
  const tr = i18n(lang);

  useEffect(() => {
    const onHash = () => {
      setRoute(parseHash());
      window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
    };
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, []);

  const go = (path: string) => {
    window.location.hash = "#" + path;
    window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
  };

  useEffect(() => {
    const base = "CA TRIO";
    const names: Record<string, string> = {
      home: lang === "cs" ? "zájezdy z Moravských Budějovic" : "trips from Moravské Budějovice",
      trips: tr("trips.title"), contact: tr("contact.title"), admin: tr("admin.title"),
      trip: tr("common.detail"), booking: tr("book.title"),
    };
    const current = route.name === "trip" || route.name === "booking" ? tripList.find((x) => x.id === route.id) : null;
    const pageName = current ? t(current.title, lang) : names[route.name];
    document.title = route.name === "home" ? `${base}, ${names.home}` : `${pageName} | ${base}`;
  }, [route, lang, tripList]);

  const props = {
    lang, setLang, trips: tripList, bookings: bookingList,
    addBooking, updateTrips, clearAll, go, path: route,
  };

  return (
    <div className="shell">
      <a className="skip" href="#main" onClick={(e) => { e.preventDefault(); const el = document.getElementById("main"); el?.focus(); el?.scrollIntoView(); }}>{lang === "cs" ? "Přeskočit na obsah" : "Skip to content"}</a>
      <header className="hdr">
        <a className="brand" href="#/" aria-label="CA TRIO">
          <img src="assets/logo.png" alt="CA TRIO, cestovní agentura" />
        </a>
        <nav className="nav" aria-label={lang === "cs" ? "Hlavní navigace" : "Main navigation"}>
          <a href="#/trips" className={route.name === "trips" || route.name === "trip" || route.name === "booking" ? "on" : ""}>
            {tr("nav.trips")}
          </a>
          <a href="#/contact" className={route.name === "contact" ? "on" : ""}>{tr("nav.contact")}</a>
        </nav>
        <div className="hdr-tools">
          <div className="lang" role="group" aria-label="Jazyk / Language">
            <button className={lang === "cs" ? "on" : ""} onClick={() => setLang("cs")} aria-pressed={lang === "cs"}>CS</button>
            <span aria-hidden="true">/</span>
            <button className={lang === "en" ? "on" : ""} onClick={() => setLang("en")} aria-pressed={lang === "en"}>EN</button>
          </div>
          <a className="btn btn-sm" href="#/trips">{tr("common.bookShort")}</a>
        </div>
      </header>

      <main id="main" tabIndex={-1}>
        {route.name === "home" && <Landing {...props} />}
        {route.name === "trips" && <TripsPage {...props} />}
        {route.name === "trip" && <TripPage {...props} id={route.id!} />}
        {route.name === "booking" && <BookingPage {...props} id={route.id!} />}
        {route.name === "contact" && <ContactPage {...props} />}
        {route.name === "admin" && <AdminPage {...props} />}
      </main>

      <footer className="foot">
        <div className="wrap foot-grid">
          <div>
            <img className="foot-logo" src="assets/logo.png" alt="CA TRIO" />
            <p className="foot-claim">{tr("foot.claim")}</p>
          </div>
          <div>
            <h4>{tr("contact.office")}</h4>
            <p>Šafaříkova 1304<br />676 02 Moravské Budějovice</p>
            <p><a href="tel:+420737102348">+420 737 102 348</a><br /><a href="mailto:info@ca-trio.cz">info@ca-trio.cz</a></p>
          </div>
          <div>
            <h4>{tr("contact.hours")}</h4>
            <p>{tr("home.hoursValue")}</p>
            <p>{tr("contact.ico")}: 12152854</p>
            <p><a href="https://www.facebook.com/TRIOcestovniagentura" target="_blank" rel="noreferrer">Facebook</a></p>
          </div>
          <div>
            <h4>{tr("nav.trips")}</h4>
            <p className="foot-links">{categories.map((c) => <a key={c.id} href="#/trips">{t(c.title, lang)}</a>)}</p>
            <p className="foot-admin"><a href="#/admin">{tr("nav.admin")}</a></p>
          </div>
        </div>
        <div className="wrap foot-base">
          <span>© 2026 CA TRIO, Ludmila Přikrylová</span>
          <span>{tr("contact.legal")}</span>
        </div>
      </footer>
    </div>
  );
}
