import { useEffect, useMemo, useState } from "react";
import { motion } from "motion/react";
import type { Cat, Lang, L, Trip } from "./data";
import { agency, categories, hero, partners, terms, termsException, tripImages } from "./data";
import type { Booking } from "./core";
import {
  BACK_ROW, baseTaken, dateFmt, freeSeats, i18n, makeRef, money, monthLabel, monthsOf,
  seatRows, seatState, shortDate, t, tripCount, validEmail, validPhone, ADMIN_KEY,
} from "./core";

export type Props = {
  lang: Lang;
  setLang: (l: Lang) => void;
  trips: Trip[];
  bookings: Booking[];
  addBooking: (b: Booking) => void;
  updateTrips: (t: Trip[]) => void;
  clearAll: () => void;
  go: (p: string) => void;
  path: { name: string; id?: string };
};

const catTitle = (cat: Cat, lang: Lang) => t(categories.find((c) => c.id === cat)!.title, lang);

function Badge({ trip, lang }: { trip: Trip; lang: Lang }) {
  const tr = i18n(lang);
  if (trip.soldOut) return <span className="badge badge-out">{tr("common.soldout")}</span>;
  return <span className="badge badge-free">{tr("common.available")}</span>;
}

function Price({ trip, lang }: { trip: Trip; lang: Lang }) {
  return (
    <span className="price">
      <b>{money(trip.price, lang)}</b>
      <small>{i18n(lang)("common.perPerson")}</small>
    </span>
  );
}

function TripRow({ trip, lang, bookings }: { trip: Trip; lang: Lang; bookings: Booking[] }) {
  const tr = i18n(lang);
  return (
    <a className={"row" + (trip.soldOut ? " is-out" : "")} href={`#/trip/${trip.id}`}>
      <div className="row-date">
        <b>{new Date(trip.date + "T12:00:00").getDate()}</b>
        <span>{new Intl.DateTimeFormat(lang === "cs" ? "cs-CZ" : "en-GB", { month: "short" }).format(new Date(trip.date + "T12:00:00")).replace(".", "")}</span>
      </div>
      <img className="row-img" src={trip.img} alt="" />
      <div className="row-main">
        <h3>{t(trip.title, lang)}</h3>
        <p>{t(trip.tagline, lang)}</p>
      </div>
      <div className="row-meta">
        <span>{catTitle(trip.cat, lang)}</span>
        <span>{t(trip.place, lang)}</span>
      </div>
      <div className="row-price">{money(trip.price, lang)}</div>
      <div className="row-end">
        {trip.soldOut ? <Badge trip={trip} lang={lang} /> : (
          <span className="row-free">{freeSeats(trip, bookings)} {tr("common.seats")}</span>
        )}
        <span className="row-arrow" aria-hidden="true">→</span>
      </div>
    </a>
  );
}

/* ---------------------------------- landing --------------------------------- */

export function Landing(p: Props) {
  const { lang, trips, go } = p;
  const tr = i18n(lang);
  const live = trips.filter((x) => x.published);
  const next = [...live].filter((x) => x.date >= "2026-11-15").sort((a, b) => a.date.localeCompare(b.date)).slice(0, 4);
  const vienna = live.find((x) => x.id === hero.tripId) ?? live[0];
  const heroLines = hero.lines[lang];
  const greece = live.find((x) => x.cat === "greece");

  return (
    <>
      <section className="hero">
        <div className="hero-copy">
          <p className="eyebrow">{tr("home.eyebrow")}</p>
          <h1>{heroLines.map((line, i) => <span className="line" key={line}><i style={{ animationDelay: `${120 + i * 90}ms` }}>{line}</i></span>)}</h1>
          <p className="hero-lead">{t(hero.lead, lang)}</p>
          {vienna && (
            <div className="hero-trip">
              <div>
                <span className="hero-trip-date">{dateFmt(vienna.date, lang)}</span>
                <span className="hero-trip-name">{t(vienna.title, lang)}</span>
              </div>
              <div className="hero-trip-price">{money(vienna.price, lang)}</div>
            </div>
          )}
          <div className="hero-actions">
            <a className="btn" href={vienna ? `#/booking/${vienna.id}` : "#/trips"}>{tr("common.book")}</a>
            <a className="link-arrow" href="#/trips">{tr("common.all")} <span aria-hidden="true">→</span></a>
          </div>
          <ul className="hero-dates">
            {next.slice(1, 4).map((x) => (
              <li key={x.id}>
                <a href={`#/trip/${x.id}`}>
                  <time>{shortDate(x.date, lang)}</time>
                  <span>{t(x.title, lang)}</span>
                </a>
              </li>
            ))}
          </ul>
        </div>
        <figure className="hero-media">
          <img src={hero.img} alt={t(hero.alt, lang)} />
        </figure>
      </section>

      <section className="wrap statement">
        <h2 className="statement-title">{tr("home.about")}</h2>
        <div className="statement-body">
          <p>{tr("home.aboutText")}</p>
          <a className="link-arrow" href="#/contact">{tr("home.contactCta")} <span aria-hidden="true">→</span></a>
        </div>
      </section>

      <section className="wrap next">
        <div className="sec-head">
          <h2>{tr("home.next")}</h2>
          <a className="link-arrow" href="#/trips">{tr("common.all")} <span aria-hidden="true">→</span></a>
        </div>
        <p className="sec-lead">{tr("home.nextLead")}</p>
        <div className="rows">
          {next.map((trip) => <TripRow key={trip.id} trip={trip} lang={lang} bookings={p.bookings} />)}
        </div>
      </section>

      <section className="wrap cats">
        <div className="sec-head">
          <h2>{tr("home.categories")}</h2>
          <p className="sec-lead inline">{tr("home.categoriesLead")}</p>
        </div>
        <div className="cat-grid">
          {categories.map((c) => {
            const count = live.filter((x) => x.cat === c.id).length;
            return (
              <a className="cat" key={c.id} href="#/trips" onClick={() => {}}>
                <div className="cat-img"><img src={c.img} alt="" loading="lazy" /></div>
                <div className="cat-body">
                  <h3>{t(c.title, lang)}</h3>
                  <p>{t(c.blurb, lang)}</p>
                  <span className="cat-count">{tripCount(count, lang)}</span>
                </div>
              </a>
            );
          })}
        </div>
      </section>

      {greece && (
        <section className="greece">
          <div className="wrap greece-grid">
            <img src="assets/10292l.jpg" alt={lang === "cs" ? "Hotel SISSY a pláž v Kamena Vourla" : "Hotel SISSY and the beach at Kamena Vourla"} />
            <div>
              <p className="eyebrow light">{tr("home.greece")}</p>
              <h2>{t(greece.title, lang)}</h2>
              <p>{t(greece.lead, lang)}</p>
              <dl className="greece-facts">
                <div><dt>{tr("common.date")}</dt><dd>{dateFmt(greece.date, lang)}</dd></div>
                <div><dt>{tr("common.duration")}</dt><dd>{t(greece.duration, lang)}</dd></div>
                <div><dt>{tr("common.price")}</dt><dd>{money(greece.price, lang)}</dd></div>
              </dl>
              <a className="btn btn-amber" href={`#/trip/${greece.id}`}>{tr("common.detail")}</a>
            </div>
          </div>
        </section>
      )}

      <section className="wrap practical">
        <h2>{tr("home.practical")}</h2>
        <div className="prac-grid">
          <div>
            <h3>{tr("home.hours")}</h3>
            <p>{tr("home.hoursValue")}</p>
            <p className="muted">{agency.street}, {agency.city}</p>
          </div>
          <div>
            <h3>{tr("home.vouchers")}</h3>
            <p>{agency.bank}</p>
            <p className="muted">{lang === "cs" ? "Poukázky přijímáme v kanceláři." : "Vouchers accepted at the office."}</p>
          </div>
          <div>
            <h3>{tr("home.insurance")}</h3>
            <p>{tr("home.insuranceValue")}</p>
            <p className="muted">+420 737 102 348</p>
          </div>
        </div>
      </section>

      <section className="wrap partners">
        <div className="sec-head">
          <h2>{tr("home.partners")}</h2>
          <a className="link-arrow" href="#/contact">{tr("nav.contact")} <span aria-hidden="true">→</span></a>
        </div>
        <p className="sec-lead">{tr("home.partnersLead")}</p>
        <ul className="partner-list">
          {partners.map((x) => <li key={x.name}>{x.name}</li>)}
        </ul>
      </section>
    </>
  );
}

/* ----------------------------------- trips ---------------------------------- */

export function TripsPage(p: Props) {
  const { lang, trips } = p;
  const tr = i18n(lang);
  const live = trips.filter((x) => x.published);
  const [cat, setCat] = useState<Cat | "all">("all");
  const [month, setMonth] = useState<string>("all");
  const [avail, setAvail] = useState<"all" | "free" | "soldout">("all");
  const [maxPrice, setMaxPrice] = useState(17490);

  const months = monthsOf(live);
  const priceMax = 17490;

  const result = useMemo(() => live.filter((x) => {
    if (cat !== "all" && x.cat !== cat) return false;
    if (month !== "all" && x.date.slice(0, 7) !== month) return false;
    if (avail === "free" && x.soldOut) return false;
    if (avail === "soldout" && !x.soldOut) return false;
    if (maxPrice < priceMax && x.price > maxPrice) return false;
    return true;
  }).sort((a, b) => a.date.localeCompare(b.date)), [live, cat, month, avail, maxPrice]);

  const reset = () => { setCat("all"); setMonth("all"); setAvail("all"); setMaxPrice(priceMax); };

  return (
    <div className="wrap page">
      <header className="page-head">
        <h1>{tr("trips.title")}</h1>
        <p className="page-lead">{tr("trips.lead")}</p>
      </header>

      <div className="listing">
        <aside className="filters" aria-label={lang === "cs" ? "Filtry" : "Filters"}>
          <div className="filter">
            <h3>{tr("filter.category")}</h3>
            <button className={"f-opt" + (cat === "all" ? " on" : "")} onClick={() => setCat("all")}>
              <span>{tr("filter.all")}</span><em>{live.length}</em>
            </button>
            {categories.map((c) => (
              <button key={c.id} className={"f-opt" + (cat === c.id ? " on" : "")} onClick={() => setCat(c.id)}>
                <span>{t(c.title, lang)}</span><em>{live.filter((x) => x.cat === c.id).length}</em>
              </button>
            ))}
          </div>

          <div className="filter">
            <h3>{tr("filter.month")}</h3>
            <button className={"f-opt" + (month === "all" ? " on" : "")} onClick={() => setMonth("all")}><span>{tr("filter.any")}</span></button>
            {months.map((m) => (
              <button key={m} className={"f-opt" + (month === m ? " on" : "")} onClick={() => setMonth(m)}>
                <span>{monthLabel(m, lang)}</span><em>{live.filter((x) => x.date.slice(0, 7) === m).length}</em>
              </button>
            ))}
          </div>

          <div className="filter">
            <h3>{tr("filter.availability")}</h3>
            {([
              ["all", tr("filter.all")],
              ["free", tr("filter.available")],
              ["soldout", tr("filter.soldout")],
            ] as const).map(([v, label]) => (
              <button key={v} className={"f-opt" + (avail === v ? " on" : "")} onClick={() => setAvail(v)}><span>{label}</span></button>
            ))}
          </div>

          <div className="filter">
            <h3>{tr("filter.price")}</h3>
            <input
              className="range" type="range" min={290} max={priceMax} step={100} value={maxPrice}
              onChange={(e) => setMaxPrice(Number(e.target.value))}
              aria-label={tr("filter.price")}
            />
            <p className="range-val">
              {maxPrice >= priceMax ? tr("filter.all") : <>{tr("filter.priceTo")} {money(maxPrice, lang)}</>}
            </p>
          </div>

          <button className="f-reset" onClick={reset}>{tr("filter.reset")}</button>
        </aside>

        <section className="results" aria-live="polite">
          <div className="results-head">
            <h2>{result.length} {tr("filter.count")}</h2>
            <span className="muted">{lang === "cs" ? "Sezóna 2026/27" : "Season 2026/27"}</span>
          </div>
          {result.length === 0 ? (
            <div className="empty">
              <h3>{tr("filter.empty")}</h3>
              <p>{tr("filter.emptyLead")}</p>
              <button className="btn" onClick={reset}>{tr("filter.reset")}</button>
            </div>
          ) : (
            <div className="rows">
              {result.map((trip) => <TripRow key={trip.id} trip={trip} lang={lang} bookings={p.bookings} />)}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

/* ----------------------------------- detail --------------------------------- */

export function TripPage(p: Props) {
  const { lang, trips, id, bookings } = p;
  const tr = i18n(lang);
  const trip = trips.find((x) => x.id === id);
  if (!trip || !trip.published) {
    return (
      <div className="wrap page narrow">
        <div className="empty">
          <h1>{tr("common.notFound")}</h1>
          <p>{tr("common.notFoundLead")}</p>
          <a className="btn" href="#/trips">{tr("common.backTrips")}</a>
        </div>
      </div>
    );
  }
  const free = freeSeats(trip, bookings);

  return (
    <article className="detail">
      <div className="detail-hero">
        <img src={trip.img} alt={t(trip.title, lang)} />
        <div className="detail-hero-in">
          <a className="crumb" href="#/trips">← {tr("trips.title")}</a>
          <p className="eyebrow light">{catTitle(trip.cat, lang)}</p>
          <h1>{t(trip.title, lang)}</h1>
          <p className="detail-tag">{t(trip.tagline, lang)}</p>
          <div className="detail-meta">
            <span>{dateFmt(trip.date, lang)}{trip.endDate ? ` – ${dateFmt(trip.endDate, lang)}` : ""}</span>
            <span>{t(trip.duration, lang)}</span>
            <span>{t(trip.place, lang)}</span>
            <span className={trip.soldOut ? "out" : "ok"}>{trip.soldOut ? tr("common.soldout") : `${free} ${tr("common.seatsLeft")}`}</span>
          </div>
        </div>
      </div>

      <div className="wrap detail-grid">
        <div className="detail-main">
          <section className="block">
            <h2>{tr("common.what")}</h2>
            <p className="lead-p">{t(trip.about, lang)}</p>
          </section>

          <section className="block">
            <h2>{tr("common.program")}</h2>
            <ol className="program">
              {trip.program.map((item, i) => (
                <li key={i}><span className="program-dot" aria-hidden="true" />{t(item, lang)}</li>
              ))}
            </ol>
          </section>

          <section className="block two">
            <div>
              <h2>{tr("common.included")}</h2>
              <ul className="ticks">
                {trip.includes.map((x, i) => <li key={i}>{t(x, lang)}</li>)}
              </ul>
            </div>
            <div>
              <h2>{tr("common.excluded")}</h2>
              {trip.excludes.length ? (
                <ul className="crosses">
                  {trip.excludes.map((x, i) => <li key={i}>{t(x, lang)}</li>)}
                </ul>
              ) : <p className="muted">{lang === "cs" ? "Vše podstatné je v ceně." : "Everything essential is included."}</p>}
            </div>
          </section>

          <section className="block">
            <h2>{tr("common.departures")}</h2>
            <ul className="deps">
              {trip.departures.map((d) => (
                <li key={d.id}>
                  <time>{d.time}</time>
                  <span>{t(d.place, lang)}</span>
                </li>
              ))}
            </ul>
            {trip.note && <p className="note">{t(trip.note, lang)}</p>}
          </section>
        </div>

        <aside className="book-card">
          <div className="book-card-top">
            <Price trip={trip} lang={lang} />
            {trip.priceNote && <p className="price-note">{t(trip.priceNote, lang)}</p>}
          </div>
          <dl className="book-facts">
            <div><dt>{tr("common.date")}</dt><dd>{dateFmt(trip.date, lang)}</dd></div>
            <div><dt>{tr("common.departure")}</dt><dd>{trip.departures[0] ? `${trip.departures[0].time}, ${t(trip.departures[0].place, lang)}` : "–"}</dd></div>
            <div><dt>{tr("detail.seats")}</dt><dd>{trip.soldOut ? tr("common.soldout") : `${free} / ${trip.seats}`}</dd></div>
          </dl>
          {trip.soldOut ? (
            <>
              <button className="btn btn-block" disabled>{tr("common.soldout")}</button>
              <p className="book-foot">{tr("detail.soldoutLead")}</p>
            </>
          ) : (
            <>
              <a className="btn btn-block" href={`#/booking/${trip.id}`}>{tr("detail.choose")}</a>
              <p className="book-foot">{tr("detail.bookLead")}</p>
            </>
          )}
          <p className="book-ins">
            {lang === "cs" ? "Pojištění AXA 35 Kč na osobu a den sjednáme v kanceláři." : "AXA insurance, 35 CZK per person per day, arranged at the office."}
          </p>
        </aside>
      </div>
    </article>
  );
}

/* ---------------------------------- booking --------------------------------- */

export function BookingPage(p: Props) {
  const { lang, trips, id, bookings, addBooking } = p;
  const tr = i18n(lang);
  const trip = trips.find((x) => x.id === id);

  const [departure, setDeparture] = useState<string>("");
  const [seats, setSeats] = useState<number[]>([]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [note, setNote] = useState("");
  const [passengers, setPassengers] = useState<string[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [done, setDone] = useState<Booking | null>(null);

  useEffect(() => {
    setPassengers((prev) => Array.from({ length: seats.length }, (_, i) => prev[i] ?? ""));
  }, [seats.length]);

  if (!trip || !trip.published) {
    return (
      <div className="wrap page narrow">
        <div className="empty">
          <h1>{tr("common.notFound")}</h1>
          <a className="btn" href="#/trips">{tr("common.backTrips")}</a>
        </div>
      </div>
    );
  }

  const taken = baseTaken(trip, bookings);
  const total = trip.price * seats.length;
  const departureObj = trip.departures.find((d) => d.id === departure);

  const toggleSeat = (n: number) => {
    if (n > trip.seats || taken.has(n)) return;
    setSeats((prev) => prev.includes(n) ? prev.filter((x) => x !== n) : prev.length >= 10 ? prev : [...prev, n].sort((a, b) => a - b));
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const next: Record<string, string> = {};
    if (!departure) next.departure = tr("book.errDeparture");
    if (!seats.length) next.seats = tr("book.errSeats");
    if (name.trim().length < 3) next.name = tr("book.errName");
    if (!validEmail(email)) next.email = tr("book.errEmail");
    if (!validPhone(phone)) next.phone = tr("book.errPhone");
    passengers.forEach((v, i) => { if (v.trim().length < 3) next[`p${i}`] = tr("book.errPassenger"); });
    setErrors(next);
    if (Object.keys(next).length) {
      const first = document.querySelector<HTMLElement>(".err");
      first?.scrollIntoView({ block: "center", behavior: "smooth" });
      return;
    }
    const booking: Booking = {
      ref: makeRef(), tripId: trip.id, departureId: departure, seats: [...seats],
      name: name.trim(), email: email.trim(), phone: phone.trim(), note: note.trim(),
      passengers: passengers.map((x) => x.trim()), total, createdAt: new Date().toISOString(),
    };
    addBooking(booking);
    setDone(booking);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (done) {
    const dep = trip.departures.find((d) => d.id === done.departureId);
    return (
      <div className="wrap page narrow">
        <motion.div className="confirm" initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ type: "spring", bounce: 0, duration: 0.5 }}>
          <p className="eyebrow">{tr("book.confirmTitle")}</p>
          <h1>{done.ref}</h1>
          <p className="confirm-lead">{tr("book.confirmLead")}</p>
          <dl className="confirm-facts">
            <div><dt>{tr("book.summaryTrip")}</dt><dd>{t(trip.title, lang)}</dd></div>
            <div><dt>{tr("common.date")}</dt><dd>{dateFmt(trip.date, lang)}</dd></div>
            <div><dt>{tr("common.departure")}</dt><dd>{dep ? `${dep.time}, ${t(dep.place, lang)}` : ""}</dd></div>
            <div><dt>{tr("book.seatsChosen")}</dt><dd>{done.seats.join(", ")}</dd></div>
            <div><dt>{tr("book.total")}</dt><dd>{money(done.total, lang)}</dd></div>
            <div><dt>{tr("book.email")}</dt><dd>{done.email}</dd></div>
          </dl>
          <div className="confirm-actions">
            <a className="btn" href="#/trips">{tr("book.another")}</a>
            <a className="link-arrow" href={`#/trip/${trip.id}`}>{tr("common.detail")} <span aria-hidden="true">→</span></a>
          </div>
        </motion.div>
      </div>
    );
  }

  if (trip.soldOut) {
    return (
      <div className="wrap page narrow">
        <div className="empty">
          <h1>{tr("common.soldout")}</h1>
          <p>{tr("detail.soldoutLead")}</p>
          <a className="btn" href={`#/trip/${trip.id}`}>{tr("common.back")}</a>
        </div>
      </div>
    );
  }

  return (
    <div className="wrap page">
      <header className="page-head book-head">
        <a className="crumb dark" href={`#/trip/${trip.id}`}>← {tr("common.back")}</a>
        <h1>{tr("book.title")}: {t(trip.title, lang)}</h1>
        <p className="page-lead">{dateFmt(trip.date, lang)} · {t(trip.duration, lang)} · {trip.departures.length} {lang === "cs" ? "nástupní místa" : "departure points"}</p>
      </header>

      <form className="book-grid" onSubmit={submit} noValidate>
        <div className="book-main">
          <section className="step">
            <div className="step-head"><span className="step-n">1</span><h2>{tr("book.step1")}</h2></div>
            <p className="step-lead">{tr("book.step1Lead")}</p>
            <div className="dep-list">
              {trip.departures.map((d) => (
                <label key={d.id} className={"dep" + (departure === d.id ? " on" : "")}>
                  <input type="radio" name="departure" value={d.id} checked={departure === d.id} onChange={() => setDeparture(d.id)} />
                  <span className="dep-time">{d.time}</span>
                  <span className="dep-place">{t(d.place, lang)}</span>
                  <span className="dep-mark" aria-hidden="true" />
                </label>
              ))}
            </div>
            {errors.departure && <p className="err">{errors.departure}</p>}
          </section>

          <section className="step">
            <div className="step-head"><span className="step-n">2</span><h2>{tr("book.step2")}</h2></div>
            <p className="step-lead">{tr("book.step2Lead")}</p>
            <BusMap trip={trip} taken={taken} selected={seats} onToggle={toggleSeat} lang={lang} />
            {errors.seats && <p className="err">{errors.seats}</p>}
          </section>

          <section className="step">
            <div className="step-head"><span className="step-n">3</span><h2>{tr("book.step3")}</h2></div>
            <p className="step-lead">{tr("book.step3Lead")}</p>
            <div className="form-grid">
              <label className="field">
                <span>{tr("book.name")}</span>
                <input value={name} onChange={(e) => setName(e.target.value)} autoComplete="name" aria-invalid={!!errors.name} />
                {errors.name && <em className="err">{errors.name}</em>}
              </label>
              <label className="field">
                <span>{tr("book.email")}</span>
                <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" autoComplete="email" aria-invalid={!!errors.email} />
                {errors.email && <em className="err">{errors.email}</em>}
              </label>
              <label className="field">
                <span>{tr("book.phone")}</span>
                <input value={phone} onChange={(e) => setPhone(e.target.value)} type="tel" autoComplete="tel" aria-invalid={!!errors.phone} />
                {errors.phone && <em className="err">{errors.phone}</em>}
              </label>
              <label className="field">
                <span>{tr("book.note")} <small>({tr("book.optional")})</small></span>
                <input value={note} onChange={(e) => setNote(e.target.value)} />
              </label>
            </div>
            <p className="hint">{tr("book.noteHint")}</p>
            <h3 className="pass-title">{tr("book.passengers")}</h3>
            {seats.length === 0 && <p className="hint">{tr("book.pickSeats")}</p>}
            <div className="form-grid">
              {seats.map((s, i) => (
                <label className="field" key={s}>
                  <span>{tr("book.passenger")} {i + 1} <small>{tr("book.seat")} {s}</small></span>
                  <input value={passengers[i] ?? ""} onChange={(e) => setPassengers((prev) => prev.map((v, j) => j === i ? e.target.value : v))} aria-invalid={!!errors[`p${i}`]} />
                  {errors[`p${i}`] && <em className="err">{errors[`p${i}`]}</em>}
                </label>
              ))}
            </div>
          </section>
        </div>

        <aside className="summary">
          <h2>{tr("book.summary")}</h2>
          <p className="sum-trip">{t(trip.title, lang)}</p>
          <p className="sum-date">{dateFmt(trip.date, lang)}</p>
          <dl className="sum-facts">
            <div><dt>{tr("common.departure")}</dt><dd>{departureObj ? `${departureObj.time}, ${t(departureObj.place, lang)}` : tr("book.none")}</dd></div>
            <div><dt>{tr("book.seatsChosen")}</dt><dd>{seats.length ? seats.join(", ") : tr("book.none")}</dd></div>
          </dl>
          <div className="sum-total">
            <span>{tr("book.total")}</span>
            <b>{money(total, lang)}</b>
          </div>
          <button className="btn btn-block" type="submit">{tr("book.submit")}</button>
          <p className="sum-foot">
            {lang === "cs" ? "Rezervace není platba. Pokyny k platbě pošleme e-mailem." : "A booking is not a payment. We email payment instructions."}
          </p>
        </aside>
      </form>
    </div>
  );
}

export function BusMap({ trip, taken, selected, onToggle, lang }: {
  trip: Trip; taken: Set<number>; selected: number[]; onToggle: (n: number) => void; lang: Lang;
}) {
  const tr = i18n(lang);
  const rows = seatRows();
  const seatBtn = (n: number) => {
    const st = seatState(n, trip, taken, selected);
    return (
      <motion.button
        type="button" key={n}
        className={"seat " + st}
        onClick={() => onToggle(n)}
        disabled={st === "taken" || st === "closed"}
        aria-label={`${lang === "cs" ? "Sedadlo" : "Seat"} ${n}`}
        aria-pressed={st === "selected"}
        animate={{ scale: st === "selected" ? 1.04 : 1 }}
        transition={{ type: "spring", bounce: 0.35, duration: 0.35 }}
      >
        {n}
      </motion.button>
    );
  };

  return (
    <div className="bus-wrap">
      <div className="bus">
        <div className="bus-front">
          <span className="wheel" aria-hidden="true" />
          <span className="bus-label">{tr("book.driver")}</span>
        </div>
        <div className="bus-body">
          {rows.filter((r) => r.kind === "row").map((r) => (
            r.kind === "row" && (
              <div className="bus-row" key={r.index}>
                <div className="bus-side">{r.left.map(seatBtn)}</div>
                <div className="bus-aisle" aria-hidden="true" />
                <div className="bus-side">{r.right.map(seatBtn)}</div>
              </div>
            )
          ))}
          <div className="bus-back">
            <span className="back-label">{tr("book.rear")}</span>
            <div className="back-seats">{BACK_ROW.map(seatBtn)}</div>
          </div>
        </div>
      </div>
      <ul className="legend">
        <li><i className="lg free" />{tr("book.legendFree")}</li>
        <li><i className="lg taken" />{tr("book.legendTaken")}</li>
        <li><i className="lg selected" />{tr("book.legendSelected")}</li>
        <li><i className="lg closed" />{tr("book.legendClosed")}</li>
      </ul>
    </div>
  );
}

/* ---------------------------------- contact --------------------------------- */

export function ContactPage(p: Props) {
  const { lang } = p;
  const tr = i18n(lang);
  return (
    <div className="wrap page">
      <header className="page-head">
        <h1>{tr("contact.title")}</h1>
        <p className="page-lead">{tr("contact.lead")}</p>
      </header>

      <div className="contact-grid">
        <div className="contact-card">
          <h2>{tr("contact.office")}</h2>
          <address>
            CA TRIO<br />{agency.street}<br />{agency.city}
          </address>
          <dl>
            <div><dt>{tr("contact.phone")}</dt><dd><a href="tel:+420737102348">{agency.phone}</a></dd></div>
            <div><dt>{tr("contact.email")}</dt><dd><a href="mailto:info@ca-trio.cz">{agency.email}</a></dd></div>
            <div><dt>{tr("contact.hours")}</dt><dd>{tr("home.hoursValue")}</dd></div>
            <div><dt>{tr("contact.owner")}</dt><dd>{agency.owner}</dd></div>
            <div><dt>{tr("contact.ico")}</dt><dd>{agency.ico}</dd></div>
            <div><dt>{tr("contact.facebook")}</dt><dd><a href={agency.facebook} target="_blank" rel="noreferrer">TRIOcestovniagentura</a></dd></div>
          </dl>
        </div>

        <div className="contact-side">
          <div className="info">
            <h3>{tr("contact.vouchers")}</h3>
            <p>{agency.bank}</p>
          </div>
          <div className="info">
            <h3>{tr("contact.insurance")}</h3>
            <p>{tr("contact.insuranceText")}</p>
          </div>
          <div className="info">
            <h3>{tr("contact.how")}</h3>
            <ol className="how">
              <li><span>1</span>{tr("contact.how1")}</li>
              <li><span>2</span>{tr("contact.how2")}</li>
              <li><span>3</span>{tr("contact.how3")}</li>
            </ol>
          </div>
        </div>
      </div>

      <section className="terms">
        <div className="sec-head"><h2>{tr("contact.terms")}</h2></div>
        <p className="sec-lead">{tr("contact.termsLead")}</p>
        <table className="terms-table">
          <tbody>
            {terms.map((r) => (
              <tr key={r.pct}>
                <td>{t(r.days, lang)}</td>
                <td><b>{r.pct} %</b> <span className="muted">{tr("contact.pct")}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
        <p className="terms-note">{t(termsException, lang)}</p>
      </section>

      <section className="partners-block">
        <div className="sec-head"><h2>{tr("contact.partners")}</h2></div>
        <p className="sec-lead">{tr("contact.partnersLead")}</p>
        <ul className="partner-grid">
          {partners.map((x) => (
            <li key={x.name}><b>{x.name}</b><span>{t(x.places, lang)}</span></li>
          ))}
        </ul>
        <p className="legal">{tr("contact.legal")}</p>
      </section>
    </div>
  );
}

/* ----------------------------------- admin ---------------------------------- */

const emptyTrip = (): Trip => ({
  id: "", cat: "advent", date: "2027-01-15", price: 500, img: "assets/10244l.jpg", seats: 53,
  soldOut: false, published: true,
  title: { cs: "Nový zájezd", en: "New trip" }, tagline: { cs: "", en: "" }, place: { cs: "", en: "" },
  lead: { cs: "", en: "" }, about: { cs: "", en: "" },
  program: [], includes: [], excludes: [], departures: [],
  duration: { cs: "1 den", en: "1 day" },
});

const lines = (v: L[]) => v.map((x) => x.cs + "|" + x.en).join("\n");
const parseLines = (v: string): L[] => v.split("\n").map((x) => x.trim()).filter(Boolean).map((line) => {
  const [cs, ...rest] = line.split("|");
  return { cs: (cs ?? "").trim(), en: rest.join("|").trim() || (cs ?? "").trim() };
});

export function AdminPage(p: Props) {
  const { lang, trips, bookings, updateTrips, clearAll } = p;
  const tr = i18n(lang);
  const [authed, setAuthed] = useState(() => sessionStorage.getItem(ADMIN_KEY) === "1");
  const [pass, setPass] = useState("");
  const [gateErr, setGateErr] = useState(false);
  const [editing, setEditing] = useState<Trip | null>(null);
  const [draft, setDraft] = useState<Trip | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [openBookings, setOpenBookings] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (!editing) return;
    setDraft(JSON.parse(JSON.stringify(editing)) as Trip);
  }, [editing]);

  const signIn = (e: React.FormEvent) => {
    e.preventDefault();
    if (pass === "trio2026") {
      sessionStorage.setItem(ADMIN_KEY, "1");
      setAuthed(true); setGateErr(false);
    } else setGateErr(true);
  };

  if (!authed) {
    return (
      <div className="admin-gate">
        <form onSubmit={signIn}>
          <p className="eyebrow">CA TRIO</p>
          <h1>{tr("admin.gate")}</h1>
          <p>{tr("admin.gateLead")}</p>
          <label className="field">
            <span>{tr("admin.pass")}</span>
            <input type="password" value={pass} onChange={(e) => setPass(e.target.value)} aria-invalid={gateErr} autoFocus />
            {gateErr && <em className="err">{tr("admin.wrong")}</em>}
          </label>
          <button className="btn btn-block" type="submit">{tr("admin.enter")}</button>
          <p className="admin-hint">{tr("admin.hint")}</p>
        </form>
      </div>
    );
  }

  const set = <K extends keyof Trip>(key: K, value: Trip[K]) =>
    setDraft((d) => d ? { ...d, [key]: value } : d);

  const setL = (key: "title" | "tagline" | "place" | "lead" | "about" | "duration" | "priceNote", langKey: Lang, value: string) =>
    setDraft((d) => {
      if (!d) return d;
      const current = (d[key] as L | undefined) ?? { cs: "", en: "" };
      return { ...d, [key]: { ...current, [langKey]: value } };
    });

  const saveDraft = () => {
    if (!draft) return;
    const clean: Trip = {
      ...draft,
      id: draft.id || `trip-${Date.now().toString(36)}`,
      title: { cs: draft.title.cs || draft.title.en, en: draft.title.en || draft.title.cs },
      departures: draft.departures.map((d, i) => ({ ...d, id: d.id || `d-${Date.now()}-${i}` })),
    };
    const exists = trips.some((x) => x.id === clean.id);
    updateTrips(exists ? trips.map((x) => x.id === clean.id ? clean : x) : [...trips, clean]);
    setEditing(null); setDraft(null); setIsNew(false); setSaved(true);
    window.setTimeout(() => setSaved(false), 2400);
  };

  const statBookings = bookings.length;
  const statSeats = bookings.reduce((n, b) => n + b.seats.length, 0);
  const statValue = bookings.reduce((n, b) => n + b.total, 0);

  return (
    <div className="wrap page admin">
      <header className="page-head admin-head">
        <div>
          <p className="eyebrow">CA TRIO</p>
          <h1>{tr("admin.title")}</h1>
        </div>
        <div className="admin-tools">
          <button className="btn btn-sm" onClick={() => { const n = emptyTrip(); setIsNew(true); setEditing(n); }}>{tr("admin.new")}</button>
          <button className="link-btn" onClick={() => { sessionStorage.removeItem(ADMIN_KEY); setAuthed(false); }}>{tr("admin.logout")}</button>
        </div>
      </header>

      {saved && <p className="admin-saved" role="status">{tr("admin.created")}</p>}

      <div className="admin-stats">
        <div><span>{tr("admin.statsTrips")}</span><b>{trips.length}</b></div>
        <div><span>{tr("admin.statsBookings")}</span><b>{statBookings}</b></div>
        <div><span>{tr("admin.statsSeats")}</span><b>{statSeats}</b></div>
        <div><span>{tr("admin.statsValue")}</span><b>{money(statValue, lang)}</b></div>
      </div>

      <section className="admin-list">
        <h2>{tr("admin.trips")}</h2>
        <table className="admin-table">
          <thead>
            <tr>
              <th>{tr("admin.tripInfo")}</th><th>{tr("common.date")}</th><th>{tr("common.price")}</th>
              <th>{tr("admin.fSeats")}</th><th>{tr("admin.bookings")}</th><th>{tr("common.published")}</th><th />
            </tr>
          </thead>
          <tbody>
            {trips.map((x) => {
              const bs = bookings.filter((b) => b.tripId === x.id);
              return (
                <tr key={x.id} className={!x.published ? "unpub" : ""}>
                  <td>
                    <b>{t(x.title, lang)}</b>
                    <span className="admin-cat">{catTitle(x.cat, lang)} · {x.id}</span>
                  </td>
                  <td>{shortDate(x.date, lang)}</td>
                  <td>{money(x.price, lang)}</td>
                  <td>{x.seats}</td>
                  <td>
                    <button className="link-btn" onClick={() => setOpenBookings(openBookings === x.id ? null : x.id)}>
                      {bs.length} {tr("admin.bookings").toLowerCase()}
                    </button>
                  </td>
                  <td>
                    <span className={"pill " + (x.published ? "on" : "off")}>{x.published ? tr("common.published") : tr("common.unpublished")}</span>
                    {x.soldOut && <span className="pill out">{tr("admin.soldout")}</span>}
                  </td>
                  <td className="admin-actions">
                    <button className="link-btn" onClick={() => { setIsNew(false); setEditing(x); }}>{tr("admin.edit")}</button>
                    <button className="link-btn" onClick={() => updateTrips(trips.map((y) => y.id === x.id ? { ...y, soldOut: !y.soldOut } : y))}>
                      {x.soldOut ? tr("admin.soldoutOff") : tr("admin.soldoutOn")}
                    </button>
                    <button className="link-btn" onClick={() => updateTrips(trips.map((y) => y.id === x.id ? { ...y, published: !y.published } : y))}>
                      {x.published ? tr("admin.unpublish") : tr("admin.publish")}
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {openBookings && (
          <div className="admin-bookings">
            <h3>{tr("admin.bookings")}: {t(trips.find((x) => x.id === openBookings)?.title, lang)}</h3>
            {bookings.filter((b) => b.tripId === openBookings).length === 0 ? <p>{tr("admin.noBookings")}</p> : (
              <table className="admin-table small">
                <thead><tr><th>{tr("book.ref")}</th><th>{tr("book.name")}</th><th>{tr("book.seatsChosen")}</th><th>{tr("common.departure")}</th><th>{tr("book.total")}</th></tr></thead>
                <tbody>
                  {bookings.filter((b) => b.tripId === openBookings).map((b) => {
                    const trp = trips.find((x) => x.id === b.tripId);
                    const dep = trp?.departures.find((d) => d.id === b.departureId);
                    return (
                      <tr key={b.ref}>
                        <td>{b.ref}</td><td>{b.name}<span className="admin-cat">{b.email}</span></td>
                        <td>{b.seats.join(", ")}</td><td>{dep ? dep.time : ""}</td><td>{money(b.total, lang)}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>
        )}

        <div className="admin-reset">
          <p className="admin-note">{tr("admin.mockNote")}</p>
          <button className="link-btn danger" onClick={() => { if (confirm(tr("admin.resetAsk"))) { clearAll(); } }}>{tr("admin.reset")}</button>
        </div>
      </section>

      {editing && draft && (
        <div className="sheet-scrim" onClick={() => { setEditing(null); setDraft(null); }}>
          <div className="sheet" role="dialog" aria-modal="true" aria-label={isNew ? tr("admin.newTitle") : tr("admin.editTitle")} onClick={(e) => e.stopPropagation()}>
            <header className="sheet-head">
              <h2>{isNew ? tr("admin.newTitle") : tr("admin.editTitle")}</h2>
              <button className="sheet-close" onClick={() => { setEditing(null); setDraft(null); }} aria-label={tr("admin.cancel")}>×</button>
            </header>
            <div className="sheet-body">
              <h3>{tr("admin.tripInfo")}</h3>
              <div className="form-grid">
                <label className="field"><span>{tr("admin.fTitleCs")}</span>
                  <input value={draft.title.cs} onChange={(e) => setL("title", "cs", e.target.value)} /></label>
                <label className="field"><span>{tr("admin.fTitleEn")}</span>
                  <input value={draft.title.en} onChange={(e) => setL("title", "en", e.target.value)} /></label>
                <label className="field"><span>{tr("admin.fTagCs")}</span>
                  <input value={draft.tagline.cs} onChange={(e) => setL("tagline", "cs", e.target.value)} /></label>
                <label className="field"><span>{tr("admin.fTagEn")}</span>
                  <input value={draft.tagline.en} onChange={(e) => setL("tagline", "en", e.target.value)} /></label>
                <label className="field"><span>{tr("admin.fCat")}</span>
                  <select value={draft.cat} onChange={(e) => set("cat", e.target.value as Cat)}>
                    {categories.map((c) => <option key={c.id} value={c.id}>{t(c.title, lang)}</option>)}
                  </select>
                </label>
                <label className="field"><span>{tr("admin.fSeats")}</span>
                  <input type="number" min={20} max={53} value={draft.seats} onChange={(e) => set("seats", Math.max(20, Math.min(53, Number(e.target.value))))} />
                  <small>{tr("admin.fSeatsHint")}</small>
                </label>
                <label className="field"><span>{tr("admin.fDate")}</span>
                  <input type="date" value={draft.date} onChange={(e) => set("date", e.target.value)} /></label>
                <label className="field"><span>{tr("admin.fEnd")}</span>
                  <input type="date" value={draft.endDate ?? ""} onChange={(e) => set("endDate", e.target.value || undefined)} /></label>
                <label className="field"><span>{tr("admin.fPrice")}</span>
                  <input type="number" min={0} step={10} value={draft.price} onChange={(e) => set("price", Number(e.target.value))} /></label>
                <label className="field"><span>{tr("admin.fPriceNoteCs")}</span>
                  <input value={draft.priceNote?.cs ?? ""} onChange={(e) => setL("priceNote", "cs", e.target.value)} /></label>
                <label className="field"><span>{tr("admin.fPriceNoteEn")}</span>
                  <input value={draft.priceNote?.en ?? ""} onChange={(e) => setL("priceNote", "en", e.target.value)} /></label>
                <div className="field"><span>{tr("admin.fPublished")} / {tr("admin.fSoldout")}</span>
                  <div className="switch-row">
                    <label className="switch"><input type="checkbox" checked={draft.published} onChange={(e) => set("published", e.target.checked)} /><span />{tr("common.published")}</label>
                    <label className="switch"><input type="checkbox" checked={draft.soldOut} onChange={(e) => set("soldOut", e.target.checked)} /><span />{tr("admin.soldout")}</label>
                  </div>
                </div>
              </div>

              <h3>{tr("admin.content")}</h3>
              <div className="form-grid">
                <label className="field"><span>{tr("admin.fLeadCs")}</span>
                  <textarea rows={3} value={draft.lead.cs} onChange={(e) => setL("lead", "cs", e.target.value)} /></label>
                <label className="field"><span>{tr("admin.fLeadEn")}</span>
                  <textarea rows={3} value={draft.lead.en} onChange={(e) => setL("lead", "en", e.target.value)} /></label>
                <label className="field"><span>{tr("admin.fAboutCs")}</span>
                  <textarea rows={4} value={draft.about.cs} onChange={(e) => setL("about", "cs", e.target.value)} /></label>
                <label className="field"><span>{tr("admin.fAboutEn")}</span>
                  <textarea rows={4} value={draft.about.en} onChange={(e) => setL("about", "en", e.target.value)} /></label>
                <label className="field wide"><span>{tr("admin.fProgramCs")}</span>
                  <textarea rows={6} value={lines(draft.program)} onChange={(e) => set("program", parseLines(e.target.value))} /></label>
              </div>

              <h3>{tr("admin.lists")}</h3>
              <div className="form-grid">
                <label className="field"><span>{tr("admin.fIncludes")}</span>
                  <textarea rows={4} value={lines(draft.includes)} onChange={(e) => set("includes", parseLines(e.target.value))} /></label>
                <label className="field"><span>{tr("admin.fExcludes")}</span>
                  <textarea rows={4} value={lines(draft.excludes)} onChange={(e) => set("excludes", parseLines(e.target.value))} /></label>
              </div>

              <h3>{tr("admin.departures")}</h3>
              <div className="dep-edit">
                {draft.departures.map((d, i) => (
                  <div className="dep-edit-row" key={d.id || i}>
                    <input aria-label={tr("admin.fDepPlaceCs")} value={d.place.cs} placeholder={tr("admin.fDepPlaceCs")}
                      onChange={(e) => set("departures", draft.departures.map((x, j) => j === i ? { ...x, place: { ...x.place, cs: e.target.value } } : x))} />
                    <input aria-label={tr("admin.fDepPlaceEn")} value={d.place.en} placeholder={tr("admin.fDepPlaceEn")}
                      onChange={(e) => set("departures", draft.departures.map((x, j) => j === i ? { ...x, place: { ...x.place, en: e.target.value } } : x))} />
                    <input aria-label={tr("admin.fDepTime")} value={d.time} placeholder="10:00"
                      onChange={(e) => set("departures", draft.departures.map((x, j) => j === i ? { ...x, time: e.target.value } : x))} />
                    <button type="button" className="link-btn danger" onClick={() => set("departures", draft.departures.filter((_, j) => j !== i))}>{tr("admin.removeDep")}</button>
                  </div>
                ))}
                <button type="button" className="link-btn" onClick={() => set("departures", [...draft.departures, { id: `d-${Date.now()}`, place: { cs: "", en: "" }, time: "10:00" }])}>{tr("admin.addDep")}</button>
              </div>

              <h3>{tr("admin.media")}</h3>
              <label className="field">
                <span>{tr("admin.media")}</span>
                <select value={draft.img} onChange={(e) => set("img", e.target.value)}>
                  {tripImages.map((img) => <option key={img} value={img}>{img.replace("assets/", "")}</option>)}
                </select>
              </label>
              <img className="admin-thumb" src={draft.img} alt="" />
            </div>
            <footer className="sheet-foot">
              <button className="btn" onClick={saveDraft}>{tr("admin.save")}</button>
              <button className="link-btn" onClick={() => { setEditing(null); setDraft(null); }}>{tr("admin.cancel")}</button>
            </footer>
          </div>
        </div>
      )}
    </div>
  );
}
