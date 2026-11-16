import { useState } from "react";
import {
  ASSET_IMAGES,
  CATS,
  fmtRange,
  fmtShort,
  price,
  seatsLeft,
  type AppState,
  type Bi,
  type CatId,
  type Lang,
  type Trip,
} from "./data";
import { S } from "./i18n";
import { isAdmin, setAdmin } from "./store";

const PASSPHRASE = "trio2026";

type Props = {
  lang: Lang;
  state: AppState;
  setState: React.Dispatch<React.SetStateAction<AppState>>;
};

const blankTrip = (): Trip => ({
  id: `t-${Date.now().toString(36)}`,
  cat: "advent",
  title: { cs: "Nový zájezd", en: "New trip" },
  date: "2027-01-01",
  price: 500,
  image: "assets/10244l.jpg",
  summary: { cs: "", en: "" },
  body: [],
  includes: [{ cs: "Doprava", en: "Transport" }],
  excludes: [],
  departures: [
    {
      place: { cs: "Moravské Budějovice, náměstí Míru", en: "Moravské Budějovice, náměstí Míru" },
      time: "10:00",
    },
  ],
  seats: 49,
  soldOut: false,
  published: true,
  taken: [],
  priceNote: { cs: "", en: "" },
  returnNote: { cs: "", en: "" },
  dateEnd: undefined,
});

export default function Admin({ lang, state, setState }: Props) {
  const [authed, setAuthed] = useState(isAdmin);
  const [pass, setPass] = useState("");
  const [err, setErr] = useState("");
  const [tab, setTab] = useState<"trips" | "bookings">("trips");
  const [selected, setSelected] = useState<string | null>(state.trips[0]?.id ?? null);
  const [draft, setDraft] = useState<Trip | null>(state.trips[0] ?? null);
  const [saved, setSaved] = useState(false);
  const [formErr, setFormErr] = useState("");

  if (!authed) {
    return (
      <div className="wrap page admin-gate-wrap">
        <form
          className="admin-gate card"
          onSubmit={(e) => {
            e.preventDefault();
            if (pass.trim() === PASSPHRASE) {
              setAdmin(true);
              setAuthed(true);
              setErr("");
            } else {
              setErr(S.adminWrong[lang]);
            }
          }}
        >
          <img className="gate-logo" src="assets/logo.png" alt="CA Trio" />
          <h1 className="display d3">{S.adminTitle[lang]}</h1>
          <p>{S.adminGate[lang]}</p>
          <label className="field">
            <span>{S.adminPass[lang]}</span>
            <input
              type="password"
              value={pass}
              onChange={(e) => setPass(e.target.value)}
              autoComplete="current-password"
            />
          </label>
          {err && (
            <p className="field-error" role="alert">
              {err}
            </p>
          )}
          <button type="submit" className="btn">
            {S.adminEnter[lang]}
          </button>
          <p className="gate-hint">{S.adminHint[lang]}</p>
        </form>
      </div>
    );
  }

  const pick = (trip: Trip) => {
    setSelected(trip.id);
    setDraft(JSON.parse(JSON.stringify(trip)) as Trip);
    setSaved(false);
    setFormErr("");
  };

  const update = (patch: Partial<Trip>) => {
    setDraft((d) => (d ? { ...d, ...patch } : d));
    setSaved(false);
  };

  const save = () => {
    if (!draft) return;
    if (!draft.title.cs.trim() || !draft.title.en.trim()) {
      setFormErr(lang === "cs" ? "Název nesmí být prázdný." : "The name cannot be empty.");
      return;
    }
    if (draft.seats < 5 || draft.seats > 80) {
      setFormErr(lang === "cs" ? "Počet míst musí být 5 až 80." : "Seat count must be between 5 and 80.");
      return;
    }
    if (!draft.date) {
      setFormErr(lang === "cs" ? "Doplňte datum." : "Add a date.");
      return;
    }
    setFormErr("");
    setState((s) => {
      const exists = s.trips.some((t) => t.id === draft.id);
      return {
        ...s,
        trips: exists ? s.trips.map((t) => (t.id === draft.id ? draft : t)) : [...s.trips, draft],
      };
    });
    setSelected(draft.id);
    setSaved(true);
  };

  const setLines = (field: "body" | "includes" | "excludes", which: Lang, text: string) => {
    if (!draft) return;
    const lines = text.split("\n").filter((line) => line.trim().length > 0);
    const prev = draft[field];
    const next: Bi[] = lines.map((line, i) => ({
      cs: which === "cs" ? line : (prev[i]?.cs ?? ""),
      en: which === "en" ? line : (prev[i]?.en ?? ""),
    }));
    update({ [field]: next } as Partial<Trip>);
  };

  const bookingsFor = (tripId: string) => state.bookings.filter((b) => b.tripId === tripId);
  const tripBookings = draft ? bookingsFor(draft.id) : [];

  return (
    <div className="wrap page admin">
      <div className="admin-bar">
        <div>
          <h1 className="display d3">{S.adminTitle[lang]}</h1>
          <p className="admin-sub">{S.adminSavedHint[lang]}</p>
        </div>
        <div className="admin-bar-actions">
          <div className="tabs">
            <button type="button" className={`tab${tab === "trips" ? " is-on" : ""}`} onClick={() => setTab("trips")}>
              {S.adminTrips[lang]}
            </button>
            <button type="button" className={`tab${tab === "bookings" ? " is-on" : ""}`} onClick={() => setTab("bookings")}>
              {S.adminBookings[lang]} ({state.bookings.length})
            </button>
          </div>
          <button
            type="button"
            className="text-link"
            onClick={() => {
              setAdmin(false);
              setAuthed(false);
            }}
          >
            {S.adminLogout[lang]}
          </button>
        </div>
      </div>

      {tab === "trips" ? (
        <div className="admin-grid">
          <aside className="admin-list">
            <button
              type="button"
              className="btn btn-sm admin-new"
              onClick={() => {
                const t = blankTrip();
                setDraft(t);
                setSelected(t.id);
                setSaved(false);
              }}
            >
              + {S.adminNew[lang]}
            </button>
            <ul>
              {state.trips.map((t) => {
                const count = bookingsFor(t.id).length;
                return (
                  <li key={t.id}>
                    <button
                      type="button"
                      className={`admin-item${selected === t.id ? " is-on" : ""}`}
                      onClick={() => pick(t)}
                    >
                      <span className="admin-item-title">{t.title[lang]}</span>
                      <span className="admin-item-meta">
                        {fmtShort(t.date, lang)} · {price(t.price, lang)}
                      </span>
                      <span className="admin-item-flags">
                        <i className="tag-dot" style={{ background: CATS.find((c) => c.id === t.cat)?.colour }} />
                        {t.published ? S.adminPublished[lang] : S.adminHidden[lang]}
                        {t.soldOut ? ` · ${S.soldOut[lang]}` : ""}
                        {count > 0 ? ` · ${count} ${lang === "cs" ? "rez." : "book."}` : ""}
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </aside>

          <div className="admin-main">
            {!draft ? (
              <p className="admin-empty">{S.adminSelectTrip[lang]}</p>
            ) : (
              <>
                <div className="admin-editor-head">
                  <div>
                    <h2>{draft.title[lang]}</h2>
                    <p className="admin-sub">
                      {fmtRange(draft, lang)} · {price(draft.price, lang)} · {seatsLeft(draft)} / {draft.seats}
                    </p>
                  </div>
                  <div className="admin-status-actions">
                    <button
                      type="button"
                      className={`btn btn-sm${draft.soldOut ? " btn-ink" : ""}`}
                      onClick={() => update({ soldOut: !draft.soldOut })}
                    >
                      {draft.soldOut ? S.adminMarkAvailable[lang] : S.adminMarkSoldOut[lang]}
                    </button>
                    <button
                      type="button"
                      className={`btn btn-sm${draft.published ? "" : " btn-ink"}`}
                      onClick={() => update({ published: !draft.published })}
                    >
                      {draft.published ? S.adminUnpublish[lang] : S.adminPublish[lang]}
                    </button>
                  </div>
                </div>

                <div className="admin-form">
                  <fieldset>
                    <legend>{S.adminBasics[lang]}</legend>
                    <div className="form-grid">
                      <label className="field">
                        <span>{S.adminNameCs[lang]}</span>
                        <input value={draft.title.cs} onChange={(e) => update({ title: { ...draft.title, cs: e.target.value } })} />
                      </label>
                      <label className="field">
                        <span>{S.adminNameEn[lang]}</span>
                        <input value={draft.title.en} onChange={(e) => update({ title: { ...draft.title, en: e.target.value } })} />
                      </label>
                      <label className="field">
                        <span>{S.adminCategory[lang]}</span>
                        <select value={draft.cat} onChange={(e) => update({ cat: e.target.value as CatId })}>
                          {CATS.map((c) => (
                            <option key={c.id} value={c.id}>
                              {c.name[lang]}
                            </option>
                          ))}
                        </select>
                      </label>
                      <label className="field">
                        <span>{S.adminPrice[lang]}</span>
                        <input
                          type="number"
                          min={0}
                          value={draft.price}
                          onChange={(e) => update({ price: Number(e.target.value) })}
                        />
                      </label>
                      <label className="field">
                        <span>{S.adminDate[lang]}</span>
                        <input type="date" value={draft.date} onChange={(e) => update({ date: e.target.value })} />
                      </label>
                      <label className="field">
                        <span>{S.adminDateEnd[lang]}</span>
                        <input
                          type="date"
                          value={draft.dateEnd ?? ""}
                          onChange={(e) => update({ dateEnd: e.target.value || undefined })}
                        />
                      </label>
                      <label className="field">
                        <span>{S.adminSeatCount[lang]}</span>
                        <input
                          type="number"
                          min={5}
                          max={80}
                          value={draft.seats}
                          onChange={(e) => update({ seats: Number(e.target.value) })}
                        />
                        <em className="field-hint">
                          {lang === "cs" ? "2 + 2 se uličkou, vzadu 5" : "2 + 2 with an aisle, 5 at the back"}
                        </em>
                      </label>
                      <label className="field">
                        <span>{S.adminImage[lang]}</span>
                        <select value={draft.image.replace("assets/", "")} onChange={(e) => update({ image: `assets/${e.target.value}` })}>
                          {ASSET_IMAGES.map((img) => (
                            <option key={img} value={img}>
                              {img}
                            </option>
                          ))}
                        </select>
                      </label>
                      <label className="field">
                        <span>{S.adminPriceNoteCs[lang]}</span>
                        <input
                          value={draft.priceNote?.cs ?? ""}
                          onChange={(e) => update({ priceNote: { ...(draft.priceNote ?? { cs: "", en: "" }), cs: e.target.value } })}
                        />
                      </label>
                      <label className="field">
                        <span>{S.adminPriceNoteEn[lang]}</span>
                        <input
                          value={draft.priceNote?.en ?? ""}
                          onChange={(e) => update({ priceNote: { ...(draft.priceNote ?? { cs: "", en: "" }), en: e.target.value } })}
                        />
                      </label>
                    </div>
                    <div className="admin-image-row">
                      <img src={draft.image} alt="" />
                      <span>{draft.image}</span>
                    </div>
                  </fieldset>

                  <fieldset>
                    <legend>{S.program[lang]}</legend>
                    <div className="form-grid two">
                      <label className="field">
                        <span>{S.adminSummaryCs[lang]}</span>
                        <textarea value={draft.summary.cs} onChange={(e) => update({ summary: { ...draft.summary, cs: e.target.value } })} />
                      </label>
                      <label className="field">
                        <span>{S.adminSummaryEn[lang]}</span>
                        <textarea value={draft.summary.en} onChange={(e) => update({ summary: { ...draft.summary, en: e.target.value } })} />
                      </label>
                      <label className="field">
                        <span>{S.adminBodyCs[lang]}</span>
                        <textarea
                          rows={6}
                          value={draft.body.map((p) => p.cs).join("\n")}
                          onChange={(e) => setLines("body", "cs", e.target.value)}
                        />
                        <em className="field-hint">{S.adminBodyHint[lang]}</em>
                      </label>
                      <label className="field">
                        <span>{S.adminBodyEn[lang]}</span>
                        <textarea
                          rows={6}
                          value={draft.body.map((p) => p.en).join("\n")}
                          onChange={(e) => setLines("body", "en", e.target.value)}
                        />
                        <em className="field-hint">{S.adminBodyHint[lang]}</em>
                      </label>
                    </div>
                  </fieldset>

                  <fieldset>
                    <legend>
                      {S.included[lang]} / {S.excluded[lang]}
                    </legend>
                    <div className="form-grid two">
                      <label className="field">
                        <span>{S.adminIncludesCs[lang]}</span>
                        <textarea
                          rows={5}
                          value={draft.includes.map((p) => p.cs).join("\n")}
                          onChange={(e) => setLines("includes", "cs", e.target.value)}
                        />
                        <em className="field-hint">{S.adminLinesHint[lang]}</em>
                      </label>
                      <label className="field">
                        <span>{S.adminIncludesEn[lang]}</span>
                        <textarea
                          rows={5}
                          value={draft.includes.map((p) => p.en).join("\n")}
                          onChange={(e) => setLines("includes", "en", e.target.value)}
                        />
                        <em className="field-hint">{S.adminLinesHint[lang]}</em>
                      </label>
                      <label className="field">
                        <span>{S.adminExcludesCs[lang]}</span>
                        <textarea
                          rows={5}
                          value={draft.excludes.map((p) => p.cs).join("\n")}
                          onChange={(e) => setLines("excludes", "cs", e.target.value)}
                        />
                        <em className="field-hint">{S.adminLinesHint[lang]}</em>
                      </label>
                      <label className="field">
                        <span>{S.adminExcludesEn[lang]}</span>
                        <textarea
                          rows={5}
                          value={draft.excludes.map((p) => p.en).join("\n")}
                          onChange={(e) => setLines("excludes", "en", e.target.value)}
                        />
                        <em className="field-hint">{S.adminLinesHint[lang]}</em>
                      </label>
                    </div>
                  </fieldset>

                  <fieldset>
                    <legend>{S.adminDepartures[lang]}</legend>
                    <div className="dep-editor">
                      {draft.departures.map((d, i) => (
                        <div className="dep-editor-row" key={i}>
                          <label className="field">
                            <span>{S.adminPlaceCs[lang]}</span>
                            <input
                              value={d.place.cs}
                              onChange={(e) => {
                                const next = draft.departures.map((row, idx) =>
                                  idx === i ? { ...row, place: { ...row.place, cs: e.target.value } } : row,
                                );
                                update({ departures: next });
                              }}
                            />
                          </label>
                          <label className="field">
                            <span>{S.adminPlaceEn[lang]}</span>
                            <input
                              value={d.place.en}
                              onChange={(e) => {
                                const next = draft.departures.map((row, idx) =>
                                  idx === i ? { ...row, place: { ...row.place, en: e.target.value } } : row,
                                );
                                update({ departures: next });
                              }}
                            />
                          </label>
                          <label className="field field-time">
                            <span>{S.adminTime[lang]}</span>
                            <input
                              value={d.time}
                              onChange={(e) => {
                                const next = draft.departures.map((row, idx) => (idx === i ? { ...row, time: e.target.value } : row));
                                update({ departures: next });
                              }}
                            />
                          </label>
                          <button
                            type="button"
                            className="link-danger"
                            onClick={() => update({ departures: draft.departures.filter((_, idx) => idx !== i) })}
                          >
                            {S.adminRemove[lang]}
                          </button>
                        </div>
                      ))}
                    </div>
                    <button
                      type="button"
                      className="btn btn-sm"
                      onClick={() =>
                        update({
                          departures: [...draft.departures, { place: { cs: "", en: "" }, time: "10:00" }],
                        })
                      }
                    >
                      + {S.adminAddDeparture[lang]}
                    </button>
                    <div className="form-grid two admin-return">
                      <label className="field">
                        <span>{S.adminReturnCs[lang]}</span>
                        <input
                          value={draft.returnNote?.cs ?? ""}
                          onChange={(e) => update({ returnNote: { ...(draft.returnNote ?? { cs: "", en: "" }), cs: e.target.value } })}
                        />
                      </label>
                      <label className="field">
                        <span>{S.adminReturnEn[lang]}</span>
                        <input
                          value={draft.returnNote?.en ?? ""}
                          onChange={(e) => update({ returnNote: { ...(draft.returnNote ?? { cs: "", en: "" }), en: e.target.value } })}
                        />
                      </label>
                    </div>
                  </fieldset>

                  <div className="admin-save">
                    <button type="button" className="btn" onClick={save}>
                      {S.adminSave[lang]}
                    </button>
                    {formErr && <p className="field-error">{formErr}</p>}
                    {saved && <p className="save-ok">{S.adminSaved[lang]}</p>}
                  </div>
                </div>

                <section className="admin-bookings">
                  <h2>{S.adminBookingsFor[lang]}</h2>
                  <p className="admin-sub">
                    {S.adminTaken[lang]}: {draft.taken.length ? [...draft.taken].sort((a, b) => Number(a) - Number(b)).join(", ") : "–"}
                  </p>
                  {tripBookings.length === 0 ? (
                    <p className="admin-empty">{S.adminNoBookings[lang]}</p>
                  ) : (
                    <BookingsTable bookings={tripBookings} lang={lang} />
                  )}
                </section>
              </>
            )}
          </div>
        </div>
      ) : (
        <div className="admin-all-bookings">
          <h2>{S.adminAllBookings[lang]}</h2>
          {state.bookings.length === 0 ? (
            <p className="admin-empty">{S.adminNoBookings[lang]}</p>
          ) : (
            <BookingsTable bookings={state.bookings} lang={lang} />
          )}
        </div>
      )}
    </div>
  );
}

function BookingsTable({
  bookings,
  lang,
}: {
  bookings: AppState["bookings"];
  lang: Lang;
}) {
  return (
    <div className="table-scroll">
      <table className="bookings-table">
        <thead>
          <tr>
            <th>{S.bookingRef[lang]}</th>
            <th>{S.fullName[lang]}</th>
            <th>{S.tripLabel[lang]}</th>
            <th>{S.seatsLabel[lang]}</th>
            <th>{S.boardingAt[lang]}</th>
            <th>{S.total[lang]}</th>
            <th>{S.adminCreated[lang]}</th>
          </tr>
        </thead>
        <tbody>
          {bookings.map((b) => (
            <tr key={b.ref}>
              <td className="mono">{b.ref}</td>
              <td>
                {b.name}
                <span className="cell-sub">
                  {b.email} · {b.phone}
                </span>
              </td>
              <td>{b.tripTitle[lang]}</td>
              <td>{b.seats.join(", ")}</td>
              <td>{b.departure}</td>
              <td className="mono">{price(b.total, lang)}</td>
              <td className="mono">
                {new Date(b.created).toLocaleDateString(lang === "cs" ? "cs-CZ" : "en-GB")}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
