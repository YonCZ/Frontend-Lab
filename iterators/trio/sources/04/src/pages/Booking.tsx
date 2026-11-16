import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { toHash } from "../core/router";
import { addBooking, findTrip, useStore } from "../core/store";
import { availability } from "../core/seats";
import SeatMap from "../core/SeatMap";
import { insuranceFor, money, useSite } from "../site";

type Errors = Record<string, string>;

export default function Booking({ id }: { id: string }) {
  const { lang, t } = useSite();
  const store = useStore();
  const reduce = useReducedMotion();
  const trip = findTrip(id, store);
  const [step, setStep] = useState(1);
  const [departureIndex, setDepartureIndex] = useState(-1);
  const [seats, setSeats] = useState<number[]>([]);
  const [form, setForm] = useState({ name: "", email: "", phone: "", participants: "", note: "", insurance: false, trap: "", robot: false });
  const [errors, setErrors] = useState<Errors>({});
  const [sending, setSending] = useState(false);
  const [confirmation, setConfirmation] = useState<{ ref: string; total: number } | null>(null);

  useEffect(() => {
    setStep(1);
    setDepartureIndex(-1);
    setSeats([]);
    setConfirmation(null);
    setErrors({});
  }, [id]);

  const booked = useMemo(
    () => store.bookings.filter((booking) => booking.tripId === id).flatMap((booking) => booking.seats),
    [store.bookings, id]
  );

  if (!trip || !trip.published) {
    return (
      <main className="page">
        <div className="empty">
          <h1>{t("noResults")}</h1>
          <a className="btn btn-solid" href={toHash(lang, "trips")}>
            {t("backToTrips")}
          </a>
        </div>
      </main>
    );
  }

  if (trip.soldOut) {
    return (
      <main className="page">
        <div className="empty">
          <h1>{t("soldOut")}</h1>
          <p>{t("detailSoldOutBody")}</p>
          <a className="btn btn-solid" href={toHash(lang, "contact")}>
            {t("navContact")}
          </a>
        </div>
      </main>
    );
  }

  const { taken } = availability(trip.id, trip.seatCount, booked);
  const total = trip.price * seats.length + (form.insurance ? insuranceFor(trip, seats.length) : 0);

  const toggleSeat = (seat: number) => {
    setSeats((current) =>
      current.includes(seat) ? current.filter((item) => item !== seat) : current.length >= 8 ? current : [...current, seat].sort((a, b) => a - b)
    );
    setErrors((current) => ({ ...current, seats: "" }));
  };

  const next = () => {
    if (step === 1) {
      if (departureIndex < 0) {
        setErrors({ departure: t("pickDepartureFirst") });
        return;
      }
      setErrors({});
      setStep(2);
      return;
    }
    if (step === 2) {
      if (!seats.length) {
        setErrors({ seats: t("pickSeatFirst") });
        return;
      }
      setErrors({});
      setStep(3);
    }
  };

  const submit = () => {
    const nextErrors: Errors = {};
    if (!form.name.trim()) nextErrors.name = t("required");
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(form.email)) nextErrors.email = t("invalidEmail");
    if (form.phone.replace(/\D/g, "").length < 6) nextErrors.phone = t("invalidPhone");
    if (!form.robot) nextErrors.robot = t("required");
    if (form.trap) nextErrors.name = t("required");
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) return;

    setSending(true);
    const departure = trip.departures[departureIndex];
    const ref = `CAT-${Math.random().toString(36).slice(2, 7).toUpperCase()}`;
    window.setTimeout(() => {
      addBooking({
        id: `${Date.now()}`,
        ref,
        tripId: trip.id,
        tripTitle: trip.title[lang],
        date: trip.dateLabel[lang],
        departureIndex,
        departureLabel: `${departure.place[lang]} · ${departure.time}`,
        seats,
        name: form.name.trim(),
        email: form.email.trim(),
        phone: form.phone.trim(),
        participantNames: form.participants,
        note: form.note,
        insurance: form.insurance,
        total,
        createdAt: new Date().toISOString(),
      });
      setSending(false);
      setConfirmation({ ref, total });
      window.scrollTo({ top: 0, behavior: "smooth" });
    }, 650);
  };

  if (confirmation) {
    return (
      <main className="page confirm-page">
        <motion.div
          className="confirm"
          initial={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.97, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={reduce ? { duration: 0.2 } : { type: "spring", stiffness: 180, damping: 22 }}
        >
          <span className="confirm-mark">✓</span>
          <p className="eyebrow">{t("bookingRef")}</p>
          <h1>{confirmation.ref}</h1>
          <h2>{t("confirmTitle")}</h2>
          <p>{t("confirmBody")}</p>
          <dl className="confirm-list">
            <div>
              <dt>{trip.title[lang]}</dt>
              <dd>{trip.dateLabel[lang]}</dd>
            </div>
            <div>
              <dt>{t("departure")}</dt>
              <dd>
                {trip.departures[departureIndex]?.place[lang]} · {trip.departures[departureIndex]?.time}
              </dd>
            </div>
            <div>
              <dt>{t("seats")}</dt>
              <dd>{seats.map((seat) => `#${seat}`).join(", ")}</dd>
            </div>
            <div>
              <dt>{t("total")}</dt>
              <dd>{money(confirmation.total, lang)}</dd>
            </div>
          </dl>
          <p className="confirm-mail">
            {t("confirmedEmail")} <strong>{form.email}</strong>
          </p>
          <div className="confirm-actions">
            <a className="btn btn-solid" href={toHash(lang, "trips")}>
              {t("newBooking")}
            </a>
            <a className="btn btn-ghost" href={toHash(lang, "home")}>
              {t("navHome")}
            </a>
          </div>
        </motion.div>
      </main>
    );
  }

  const steps = [t("stepDeparture"), t("stepSeats"), t("stepDetails")];

  return (
    <main className="page booking">
      <header className="page-head is-booking">
        <div>
          <a className="detail-back" href={toHash(lang, "trip", trip.id)}>
            ← {trip.title[lang]}
          </a>
          <p className="eyebrow">{t("bookingTitle")}</p>
          <h1>{t("bookingLead")}</h1>
        </div>
        <div className="page-head-mark" aria-hidden="true">
          {String(step).padStart(2, "0")} / 03
        </div>
      </header>

      <div className="stepper">
        {steps.map((label, index) => (
          <button
            key={label}
            type="button"
            className={`step${step === index + 1 ? " is-current" : ""}${step > index + 1 ? " is-done" : ""}`}
            onClick={() => index + 1 < step && setStep(index + 1)}
            disabled={index + 1 >= step}
          >
            <span className="step-num">{step > index + 1 ? "✓" : `0${index + 1}`}</span>
            <span>{label}</span>
          </button>
        ))}
      </div>

      <div className="booking-grid">
        <div className="booking-main">
          <AnimatePresence mode="wait" initial={false}>
            <motion.section
              key={step}
              initial={reduce ? { opacity: 0 } : { opacity: 0, x: 24 }}
              animate={{ opacity: 1, x: 0 }}
              exit={reduce ? { opacity: 0 } : { opacity: 0, x: -18 }}
              transition={reduce ? { duration: 0.15 } : { type: "spring", stiffness: 260, damping: 26 }}
            >
              {step === 1 && (
                <>
                  <h2 className="block-title">{t("chooseDeparture")}</h2>
                  <p className="block-lead">{t("chooseDepartureLead")}</p>
                  <div className="dep-options">
                    {trip.departures.map((departure, index) => (
                      <button
                        key={`${departure.place.cs}-${departure.time}`}
                        type="button"
                        className={`dep-option${departureIndex === index ? " is-on" : ""}`}
                        onClick={() => {
                          setDepartureIndex(index);
                          setErrors({});
                        }}
                        aria-pressed={departureIndex === index}
                      >
                        <span className="dep-option-check" aria-hidden="true" />
                        <span className="dep-option-time">{departure.time}</span>
                        <span className="dep-option-place">{departure.place[lang]}</span>
                      </button>
                    ))}
                  </div>
                  {errors.departure && <p className="form-error">{errors.departure}</p>}
                  <div className="step-actions">
                    <button type="button" className="btn btn-solid" onClick={next}>
                      {t("continue")}
                    </button>
                  </div>
                </>
              )}

              {step === 2 && (
                <>
                  <h2 className="block-title">{t("seatMap")}</h2>
                  <p className="block-lead">{t("seatMapLead")}</p>
                  <SeatMap total={trip.seatCount} taken={taken} selected={seats} onToggle={toggleSeat} lang={lang} />
                  <div className="seat-summary">
                    <span>
                      {t("seats")}: {seats.length}
                      {seats.length > 0 && <strong>{seats.map((seat) => `#${seat}`).join(" ")}</strong>}
                    </span>
                    {!seats.length && <span>{t("noSeats")}</span>}
                  </div>
                  {errors.seats && <p className="form-error">{errors.seats}</p>}
                  <div className="step-actions">
                    <button type="button" className="btn btn-ghost" onClick={() => setStep(1)}>
                      ← {t("back")}
                    </button>
                    <button type="button" className="btn btn-solid" onClick={next}>
                      {t("continue")}
                    </button>
                  </div>
                </>
              )}

              {step === 3 && (
                <>
                  <h2 className="block-title">{t("yourDetails")}</h2>
                  <p className="block-lead">{t("yourDetailsLead")}</p>
                  <div className="form-grid">
                    <label className="field">
                      <span>{t("name")} *</span>
                      <input
                        value={form.name}
                        onChange={(event) => setForm({ ...form, name: event.target.value })}
                        aria-invalid={Boolean(errors.name)}
                      />
                      {errors.name && <em className="form-error">{errors.name}</em>}
                    </label>
                    <label className="field">
                      <span>{t("email")} *</span>
                      <input
                        type="email"
                        value={form.email}
                        onChange={(event) => setForm({ ...form, email: event.target.value })}
                        aria-invalid={Boolean(errors.email)}
                      />
                      {errors.email && <em className="form-error">{errors.email}</em>}
                    </label>
                    <label className="field">
                      <span>{t("phone")} *</span>
                      <input
                        value={form.phone}
                        onChange={(event) => setForm({ ...form, phone: event.target.value })}
                        aria-invalid={Boolean(errors.phone)}
                      />
                      {errors.phone && <em className="form-error">{errors.phone}</em>}
                    </label>
                    <label className="field">
                      <span>{t("participants")}</span>
                      <input
                        value={form.participants}
                        placeholder={t("participantNames")}
                        onChange={(event) => setForm({ ...form, participants: event.target.value })}
                      />
                    </label>
                    <label className="field is-wide">
                      <span>{t("note")}</span>
                      <textarea
                        rows={4}
                        value={form.note}
                        placeholder={t("noteHint")}
                        onChange={(event) => setForm({ ...form, note: event.target.value })}
                      />
                    </label>
                    <label className="check is-wide">
                      <input
                        type="checkbox"
                        checked={form.insurance}
                        onChange={(event) => setForm({ ...form, insurance: event.target.checked })}
                      />
                      <span>
                        <strong>{t("insurance")}</strong>
                        <small>{t("insuranceHint")}</small>
                      </span>
                    </label>
                    <label className="check is-wide">
                      <input
                        type="checkbox"
                        checked={form.robot}
                        onChange={(event) => setForm({ ...form, robot: event.target.checked })}
                      />
                      <span>
                        <strong>{lang === "cs" ? "Nejsem robot" : "I am not a robot"}</strong>
                        <small>{lang === "cs" ? "Ověření proti spamu (ukázka)." : "Spam check (demo)."}</small>
                      </span>
                    </label>
                    {errors.robot && <p className="form-error is-wide">{errors.robot}</p>}
                    <input
                      className="trap"
                      tabIndex={-1}
                      autoComplete="off"
                      aria-hidden="true"
                      value={form.trap}
                      onChange={(event) => setForm({ ...form, trap: event.target.value })}
                    />
                  </div>
                  <p className="demo-note">
                    {lang === "cs"
                      ? "Ukázková rezervace: data se uloží v tomto prohlížeči a objeví se v administraci."
                      : "Demo booking: data is stored in this browser and appears in the admin area."}
                  </p>
                  <div className="step-actions">
                    <button type="button" className="btn btn-ghost" onClick={() => setStep(2)}>
                      ← {t("back")}
                    </button>
                    <button type="button" className="btn btn-solid" onClick={submit} disabled={sending}>
                      {sending ? t("submitting") : t("submit")}
                    </button>
                  </div>
                </>
              )}
            </motion.section>
          </AnimatePresence>
        </div>

        <aside className="booking-summary">
          <div className="summary-card">
            <img src={trip.image} alt="" />
            <div className="summary-body">
              <span className="summary-cat">{trip.dateLabel[lang]}</span>
              <h3>{trip.title[lang]}</h3>
              <dl>
                <div>
                  <dt>{t("seats")}</dt>
                  <dd>{seats.length ? seats.map((seat) => `#${seat}`).join(", ") : "—"}</dd>
                </div>
                <div>
                  <dt>{t("departure")}</dt>
                  <dd>
                    {departureIndex >= 0
                      ? `${trip.departures[departureIndex].place[lang]} · ${trip.departures[departureIndex].time}`
                      : "—"}
                  </dd>
                </div>
                <div>
                  <dt>{t("total")}</dt>
                  <dd className="summary-total">{money(total, lang)}</dd>
                </div>
              </dl>
              <p className="summary-foot">
                {lang === "cs" ? "Platba v kanceláři nebo na faktuře." : "Pay at the office or by invoice."}
              </p>
            </div>
          </div>
        </aside>
      </div>
    </main>
  );
}
