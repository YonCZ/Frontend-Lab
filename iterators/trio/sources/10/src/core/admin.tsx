import { useMemo, useState } from "react";
import { ASSET_OPTIONS, CATEGORIES, type Bi, type Trip } from "./data";
import { go } from "./router";
import {
  PASSPHRASE,
  allTrips,
  createTrip,
  deleteTrip,
  findTrip,
  saveTrip,
  setAdmin,
  useAdmin,
  useStore,
} from "./store";

type Props = {
  lang: "cs" | "en";
  t: (key: string) => any;
};

const emptyTrip = (): Trip => ({
  id: `trip-${Date.now().toString(36)}`,
  category: "advent",
  date: new Date().toISOString().slice(0, 10),
  dateLabel: { cs: "", en: "" },
  price: 590,
  image: "assets/10244l.jpg",
  title: { cs: "", en: "" },
  tagline: { cs: "", en: "" },
  description: { cs: "", en: "" },
  includes: [],
  excludes: [],
  departures: [{ place: { cs: "", en: "" }, time: "9:00" }],
  seatCount: 49,
  soldOut: false,
  published: true,
});

function dateLabel(date: string, endDate: string | undefined, lang: "cs" | "en") {
  if (!date) return "";
  const d = new Date(`${date}T00:00:00`);
  if (Number.isNaN(d.getTime())) return "";
  if (endDate) {
    const e = new Date(`${endDate}T00:00:00`);
    return lang === "cs"
      ? `${d.getDate()}. ${d.getMonth() + 1}. – ${e.getDate()}. ${e.getMonth() + 1}. ${e.getFullYear()}`
      : `${d.getDate()} ${d.toLocaleString("en-GB", { month: "long" })} – ${e.getDate()} ${e.toLocaleString("en-GB", { month: "long" })} ${e.getFullYear()}`;
  }
  return lang === "cs"
    ? `${d.getDate()}. ${d.toLocaleString("cs-CZ", { month: "long" })} ${d.getFullYear()}`
    : `${d.getDate()} ${d.toLocaleString("en-GB", { month: "long" })} ${d.getFullYear()}`;
}

function linesToBi(text: string): Bi[] {
  return text
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const [cs, en] = line.split("|").map((part) => part.trim());
      return { cs: cs || en || "", en: en || cs || "" };
    });
}

function biToLines(items: Bi[]) {
  return items.map((item) => `${item.cs} | ${item.en}`).join("\n");
}

function Field({ label, children, wide }: { label: string; children: React.ReactNode; wide?: boolean }) {
  return (
    <label className={`adm-field${wide ? " is-wide" : ""}`}>
      <span>{label}</span>
      {children}
    </label>
  );
}

export default function AdminPage({ lang, t }: Props) {
  const admin = useAdmin();
  const store = useStore();
  const [pass, setPass] = useState("");
  const [error, setError] = useState("");
  const [tab, setTab] = useState<"trips" | "bookings">("trips");
  const [editing, setEditing] = useState<Trip | null>(null);
  const [creating, setCreating] = useState(false);
  const [saved, setSaved] = useState("");
  const [bookingTrip, setBookingTrip] = useState("");

  const trips = useMemo(() => allTrips(store), [store]);

  if (!admin) {
    return (
      <main className="adm-gate">
        <form
          className="adm-gate-card"
          onSubmit={(event) => {
            event.preventDefault();
            if (pass.trim() === PASSPHRASE) {
              setAdmin(true);
              setError("");
            } else {
              setError(t("wrongPass"));
            }
          }}
        >
          <p className="eyebrow">{t("navAdmin")}</p>
          <h1>{t("adminTitle")}</h1>
          <p className="adm-lead">{t("adminLead")}</p>
          <Field label={t("passphrase")}>
            <input
              type="password"
              value={pass}
              autoFocus
              onChange={(event) => setPass(event.target.value)}
              placeholder="••••••••"
            />
          </Field>
          {error && <p className="adm-error">{error}</p>}
          <button className="btn btn-solid" type="submit">
            {t("enter")}
          </button>
          <p className="adm-hint">{t("passHint")}</p>
          <button type="button" className="adm-back" onClick={() => go(lang, "home")}>
            {t("navHome")}
          </button>
        </form>
      </main>
    );
  }

  const startCreate = () => {
    setEditing(emptyTrip());
    setCreating(true);
    setSaved("");
  };

  const startEdit = (trip: Trip) => {
    setEditing(JSON.parse(JSON.stringify(trip)));
    setCreating(false);
    setSaved("");
  };

  const patch = (values: Partial<Trip>) => setEditing((current) => (current ? { ...current, ...values } : current));

  const persist = () => {
    if (!editing) return;
    const title = editing.title.cs || editing.title.en;
    if (!title.trim()) return;
    const next: Trip = {
      ...editing,
      dateLabel: { cs: dateLabel(editing.date, editing.endDate, "cs"), en: dateLabel(editing.date, editing.endDate, "en") },
      title: { cs: editing.title.cs || editing.title.en, en: editing.title.en || editing.title.cs },
      tagline: { cs: editing.tagline.cs || editing.tagline.en, en: editing.tagline.en || editing.tagline.cs },
      description: { cs: editing.description.cs || editing.description.en, en: editing.description.en || editing.description.cs },
    };
    if (creating) createTrip(next);
    else saveTrip(next);
    setSaved(t("adminSaved"));
    setEditing(next);
    setCreating(false);
    window.setTimeout(() => setSaved(""), 2600);
  };

  const bookings = store.bookings.filter((booking) => !bookingTrip || booking.tripId === bookingTrip);
  const activeBookingTrip = trips.find((trip) => trip.id === bookingTrip);

  return (
    <main className="adm">
      <div className="adm-top">
        <div>
          <p className="eyebrow">{t("navAdmin")}</p>
          <h1>{t("adminTitle")}</h1>
          <p className="adm-lead">{t("adminLead")}</p>
        </div>
        <button
          type="button"
          className="btn btn-ghost"
          onClick={() => {
            setAdmin(false);
            go(lang, "home");
          }}
        >
          {t("logout")}
        </button>
      </div>

      <div className="adm-tabs" role="tablist">
        <button
          type="button"
          role="tab"
          aria-selected={tab === "trips"}
          className={tab === "trips" ? "is-active" : ""}
          onClick={() => setTab("trips")}
        >
          {t("adminTrips")} <span>{trips.length}</span>
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={tab === "bookings"}
          className={tab === "bookings" ? "is-active" : ""}
          onClick={() => setTab("bookings")}
        >
          {t("adminBookings")} <span>{store.bookings.length}</span>
        </button>
      </div>

      {tab === "trips" && (
        <>
          <div className="adm-actions">
            <button type="button" className="btn btn-solid" onClick={startCreate}>
              + {t("adminNew")}
            </button>
            {saved && <span className="adm-saved">{saved}</span>}
          </div>
          <div className="adm-list">
            {trips.map((trip) => (
              <article className="adm-row" key={trip.id}>
                <img src={trip.image} alt="" />
                <div className="adm-row-main">
                  <h3>{trip.title[lang]}</h3>
                  <p>
                    {trip.dateLabel[lang]} · {trip.price.toLocaleString("cs-CZ")} Kč · {trip.seatCount} {t("seat")}
                    {trip.operator ? ` · ${trip.operator[lang]}` : ""}
                  </p>
                  <div className="adm-badges">
                    <span className={`adm-badge${trip.published ? " is-on" : ""}`}>
                      {t("adminPublished")}: {trip.published ? "✓" : "—"}
                    </span>
                    <span className={`adm-badge${trip.soldOut ? " is-off" : ""}`}>
                      {t("adminSoldOut")}: {trip.soldOut ? "✓" : "—"}
                    </span>
                  </div>
                </div>
                <div className="adm-row-tools">
                  <label className="adm-switch">
                    <input
                      type="checkbox"
                      checked={trip.soldOut}
                      onChange={() => saveTrip({ ...trip, soldOut: !trip.soldOut })}
                    />
                    <span>{t("adminSoldOut")}</span>
                  </label>
                  <label className="adm-switch">
                    <input
                      type="checkbox"
                      checked={trip.published}
                      onChange={() => saveTrip({ ...trip, published: !trip.published })}
                    />
                    <span>{t("adminPublished")}</span>
                  </label>
                  <button type="button" className="btn btn-ghost" onClick={() => startEdit(trip)}>
                    {t("adminEdit")}
                  </button>
                  <button
                    type="button"
                    className="adm-delete"
                    onClick={() => {
                      if (window.confirm(t("adminDanger"))) deleteTrip(trip.id);
                    }}
                  >
                    {t("adminDelete")}
                  </button>
                </div>
              </article>
            ))}
          </div>

          {editing && (
            <section className="adm-editor">
              <div className="adm-editor-head">
                <h2>{creating ? t("adminCreate") : `${t("adminEdit")}: ${editing.title[lang] || editing.id}`}</h2>
                <button type="button" className="adm-back" onClick={() => setEditing(null)}>
                  {t("adminCancel")}
                </button>
              </div>

              <div className="adm-form">
                <Field label={t("adminTitleCs")}>
                  <input value={editing.title.cs} onChange={(event) => patch({ title: { ...editing.title, cs: event.target.value } })} />
                </Field>
                <Field label={t("adminTitleEn")}>
                  <input value={editing.title.en} onChange={(event) => patch({ title: { ...editing.title, en: event.target.value } })} />
                </Field>
                <Field label={t("adminTagCs")}>
                  <input value={editing.tagline.cs} onChange={(event) => patch({ tagline: { ...editing.tagline, cs: event.target.value } })} />
                </Field>
                <Field label={t("adminTagEn")}>
                  <input value={editing.tagline.en} onChange={(event) => patch({ tagline: { ...editing.tagline, en: event.target.value } })} />
                </Field>
                <Field label={t("adminPrice")}>
                  <input
                    type="number"
                    min={0}
                    value={editing.price}
                    onChange={(event) => patch({ price: Number(event.target.value) })}
                  />
                </Field>
                <Field label={t("adminSeatCount")}>
                  <input
                    type="number"
                    min={5}
                    max={61}
                    value={editing.seatCount}
                    onChange={(event) => patch({ seatCount: Number(event.target.value) })}
                  />
                </Field>
                <Field label={t("adminDate")}>
                  <input type="date" value={editing.date} onChange={(event) => patch({ date: event.target.value })} />
                </Field>
                <Field label={t("adminEndDate")}>
                  <input type="date" value={editing.endDate ?? ""} onChange={(event) => patch({ endDate: event.target.value || undefined })} />
                </Field>
                <Field label={t("adminCategory")}>
                  <select value={editing.category} onChange={(event) => patch({ category: event.target.value as Trip["category"] })}>
                    {CATEGORIES.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.name[lang]}
                      </option>
                    ))}
                  </select>
                </Field>
                <Field label={t("adminImage")}>
                  <select value={editing.image} onChange={(event) => patch({ image: event.target.value })}>
                    {ASSET_OPTIONS.map((asset) => (
                      <option key={asset} value={asset}>
                        {asset}
                      </option>
                    ))}
                  </select>
                </Field>
                <Field label={t("adminImageUrl")} wide>
                  <input value={editing.image} onChange={(event) => patch({ image: event.target.value })} />
                </Field>
                <Field label={t("adminDescCs")} wide>
                  <textarea rows={5} value={editing.description.cs} onChange={(event) => patch({ description: { ...editing.description, cs: event.target.value } })} />
                </Field>
                <Field label={t("adminDescEn")} wide>
                  <textarea rows={5} value={editing.description.en} onChange={(event) => patch({ description: { ...editing.description, en: event.target.value } })} />
                </Field>
                <Field label={`${t("adminIncludes")} · ${t("adminOnePerLine")}`} wide>
                  <textarea
                    rows={4}
                    value={biToLines(editing.includes)}
                    onChange={(event) => patch({ includes: linesToBi(event.target.value) })}
                  />
                </Field>
                <Field label={`${t("adminExcludes")} · ${t("adminOnePerLine")}`} wide>
                  <textarea
                    rows={4}
                    value={biToLines(editing.excludes)}
                    onChange={(event) => patch({ excludes: linesToBi(event.target.value) })}
                  />
                </Field>
              </div>

              <div className="adm-departures">
                <h3>{t("adminDep")}</h3>
                {editing.departures.map((departure, index) => (
                  <div className="adm-departure" key={`${index}-${departure.time}`}>
                    <input
                      aria-label={`${t("adminDep")} CZ ${index + 1}`}
                      value={departure.place.cs}
                      placeholder="Místo česky"
                      onChange={(event) => {
                        const next = [...editing.departures];
                        next[index] = { ...departure, place: { ...departure.place, cs: event.target.value } };
                        patch({ departures: next });
                      }}
                    />
                    <input
                      aria-label={`${t("adminDep")} EN ${index + 1}`}
                      value={departure.place.en}
                      placeholder="Place in English"
                      onChange={(event) => {
                        const next = [...editing.departures];
                        next[index] = { ...departure, place: { ...departure.place, en: event.target.value } };
                        patch({ departures: next });
                      }}
                    />
                    <input
                      aria-label={`${t("adminDep")} time ${index + 1}`}
                      value={departure.time}
                      className="adm-time"
                      onChange={(event) => {
                        const next = [...editing.departures];
                        next[index] = { ...departure, time: event.target.value };
                        patch({ departures: next });
                      }}
                    />
                    <button
                      type="button"
                      className="adm-delete"
                      onClick={() => patch({ departures: editing.departures.filter((_, position) => position !== index) })}
                    >
                      ×
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  className="adm-add"
                  onClick={() =>
                    patch({ departures: [...editing.departures, { place: { cs: "", en: "" }, time: "9:00" }] })
                  }
                >
                  + {t("adminAddDep")}
                </button>
              </div>

              <div className="adm-footer">
                <button type="button" className="btn btn-solid" onClick={persist}>
                  {t("adminSave")}
                </button>
                <span>{t("adminSeats")}: {store.bookings.filter((booking) => booking.tripId === editing.id).reduce((sum, booking) => sum + booking.seats.length, 0)}</span>
              </div>
            </section>
          )}
        </>
      )}

      {tab === "bookings" && (
        <section className="adm-bookings">
          <div className="adm-actions">
            <select value={bookingTrip} onChange={(event) => setBookingTrip(event.target.value)} aria-label={t("adminTrips")}>
              <option value="">{t("allTrips")}</option>
              {trips.map((trip) => (
                <option key={trip.id} value={trip.id}>
                  {trip.title[lang]}
                </option>
              ))}
            </select>
            {activeBookingTrip && (
              <span className="adm-saved">
                {activeBookingTrip.title[lang]} · {store.bookings.filter((booking) => booking.tripId === activeBookingTrip.id).length}{" "}
                {t("adminBookings").toLowerCase()}
              </span>
            )}
          </div>
          {bookings.length === 0 ? (
            <p className="adm-empty">{t("adminNoBookings")}</p>
          ) : (
            <div className="adm-table-wrap">
              <table className="adm-table">
                <thead>
                  <tr>
                    <th>{t("bookingRef")}</th>
                    <th>{t("name")}</th>
                    <th>{t("seats")}</th>
                    <th>{t("departure")}</th>
                    <th>{t("total")}</th>
                    <th>{t("email")}</th>
                  </tr>
                </thead>
                <tbody>
                  {bookings.map((booking) => (
                    <tr key={booking.id}>
                      <td>
                        <strong>{booking.ref}</strong>
                        <small>{booking.tripTitle}</small>
                      </td>
                      <td>
                        {booking.name}
                        <small>{booking.phone}</small>
                      </td>
                      <td>{booking.seats.map((seat) => `#${seat}`).join(", ")}</td>
                      <td>{booking.departureLabel}</td>
                      <td>{booking.total.toLocaleString("cs-CZ")} Kč</td>
                      <td>{booking.email}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      )}
    </main>
  );
}
