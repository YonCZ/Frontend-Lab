import { useState } from "react";
import { AGENCY } from "../core/data";
import { toHash } from "../core/router";
import { useSite } from "../site";
import { Reveal } from "../components";

export default function Contact() {
  const { lang, t } = useSite();
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  return (
    <main className="page">
      <header className="page-head">
        <div>
          <p className="eyebrow">{t("contactTitle")}</p>
          <h1>{t("contactTitle")}</h1>
          <p className="page-lead">{t("contactLead")}</p>
        </div>
        <div className="page-head-mark" aria-hidden="true">
          CA
        </div>
      </header>

      <div className="contact-grid">
        <Reveal className="contact-card is-large">
          <span className="contact-num">01</span>
          <h2>{t("office")}</h2>
          <p className="contact-big">{AGENCY.address}</p>
          <p>{AGENCY.legal[lang]}</p>
          <p>IČ: {AGENCY.ico}</p>
          <p className="contact-small">{AGENCY.register[lang]}</p>
        </Reveal>

        <Reveal className="contact-card">
          <span className="contact-num">02</span>
          <h2>{t("officeHours")}</h2>
          <p className="contact-big">{AGENCY.hours[lang]}</p>
          <p>{lang === "cs" ? "Mimo otevírací dobu volejte nebo pište, ozveme se." : "Outside office hours, call or write and we will get back to you."}</p>
        </Reveal>

        <Reveal className="contact-card">
          <span className="contact-num">03</span>
          <h2>{t("callUs")} / {t("writeUs")}</h2>
          <a className="contact-big" href={`tel:${AGENCY.phoneHref}`}>
            {AGENCY.phone}
          </a>
          <a className="contact-big" href={`mailto:${AGENCY.email}`}>
            {AGENCY.email}
          </a>
          <a className="text-link" href={AGENCY.facebook} target="_blank" rel="noreferrer">
            Facebook →
          </a>
        </Reveal>

        <Reveal className="contact-card">
          <span className="contact-num">04</span>
          <h2>{t("vouchers")}</h2>
          <p className="contact-big">{AGENCY.vouchers}</p>
          <h3 className="contact-sub">{t("insuranceLabel")}</h3>
          <p>{AGENCY.insurance[lang]}</p>
        </Reveal>

        <Reveal className="contact-card">
          <span className="contact-num">05</span>
          <h2>Facebook</h2>
          <p className="contact-big">@TRIOcestovniagentura</p>
          <p>{lang === "cs" ? "Aktuality, fotky ze zájezdů a volná místa." : "News, trip photos and last-minute seats."}</p>
          <a className="text-link" href={AGENCY.facebook} target="_blank" rel="noreferrer">
            Facebook →
          </a>
        </Reveal>
        <Reveal className="contact-card">
          <span className="contact-num">06</span>
          <h2>{t("navTerms")}</h2>
          <p>{lang === "cs" ? "Zrušení zájezdu má jasná pravidla a žádná překvapení." : "Cancelling a trip has clear rules and no surprises."}</p>
          <a className="text-link" href={toHash(lang, "terms")}>
            {t("navTerms")} →
          </a>
        </Reveal>

        <Reveal className="map-card">
          <div className="map-lines" aria-hidden="true">
            <span className="map-road is-a" />
            <span className="map-road is-b" />
            <span className="map-road is-c" />
            <span className="map-marker">
              <i />
              CA TRIO
            </span>
          </div>
          <div className="map-caption">
            <p className="eyebrow">{t("findUs")}</p>
            <p>{AGENCY.address}</p>
            <p className="contact-small">
              {lang === "cs" ? "Parkování přímo u náměstí Míru." : "Parking right by Míru Square."}
            </p>
          </div>
        </Reveal>
      </div>

      <section className="contact-form-wrap">
        <div className="contact-form-copy">
          <p className="eyebrow">{t("contactFormTitle")}</p>
          <h2>{lang === "cs" ? "Napište nám" : "Write to us"}</h2>
          <p>
            {lang === "cs"
              ? "Na dotazy odpovídáme obvykle do jednoho pracovního dne."
              : "We usually answer within one working day."}
          </p>
        </div>
        {sent ? (
          <div className="contact-sent">
            <span className="confirm-mark">✓</span>
            <h3>{t("sent")}</h3>
            <p>{t("sentBody")}</p>
          </div>
        ) : (
          <form
            className="form-grid contact-form"
            onSubmit={(event) => {
              event.preventDefault();
              if (!form.name.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(form.email) || !form.message.trim()) {
                setError(t("required"));
                return;
              }
              setError("");
              setSent(true);
            }}
          >
            <label className="field">
              <span>{t("name")} *</span>
              <input value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} />
            </label>
            <label className="field">
              <span>{t("email")} *</span>
              <input type="email" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} />
            </label>
            <label className="field is-wide">
              <span>{t("message")} *</span>
              <textarea rows={5} value={form.message} onChange={(event) => setForm({ ...form, message: event.target.value })} />
            </label>
            {error && <p className="form-error is-wide">{error}</p>}
            <div className="is-wide">
              <button className="btn btn-solid" type="submit">
                {t("send")}
              </button>
            </div>
          </form>
        )}
      </section>
    </main>
  );
}
