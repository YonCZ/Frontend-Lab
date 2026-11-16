import { AGENCY, CANCELLATION } from "../core/data";
import { toHash } from "../core/router";
import { useSite } from "../site";
import { Reveal } from "../components";

export default function Terms() {
  const { lang, t } = useSite();
  return (
    <main className="page terms">
      <header className="page-head">
        <div>
          <p className="eyebrow">{t("navTerms")}</p>
          <h1>{t("termsTitle")}</h1>
          <p className="page-lead">{t("termsLead")}</p>
        </div>
        <div className="page-head-mark" aria-hidden="true">
          %
        </div>
      </header>

      <Reveal>
        <p className="terms-intro">{t("termsIntro")}</p>
      </Reveal>

      <div className="terms-table">
        <div className="terms-row is-head">
          <span>{t("termsWhen")}</span>
          <span>{t("termsFee")}</span>
        </div>
        {CANCELLATION.map((tier, index) => (
          <Reveal key={tier.pct} delay={index * 0.05}>
            <div className="terms-row">
              <span>{tier.days[lang]}</span>
              <strong>{tier.pct} %</strong>
            </div>
          </Reveal>
        ))}
      </div>

      <div className="terms-bottom">
        <Reveal className="terms-card">
          <h2>{t("termsNoFee")}</h2>
          <p>{t("termsNoFeeBody")}</p>
        </Reveal>
        <Reveal className="terms-card is-note">
          <h2>{t("termsNote")}</h2>
          <p>
            {t("callUs")}: <a href={`tel:${AGENCY.phoneHref}`}>{AGENCY.phone}</a>
            <br />
            {t("writeUs")}: <a href={`mailto:${AGENCY.email}`}>{AGENCY.email}</a>
          </p>
          <a className="btn btn-solid" href={toHash(lang, "contact")}>
            {t("navContact")}
          </a>
        </Reveal>
      </div>

      <p className="terms-legal">{AGENCY.register[lang]}</p>
    </main>
  );
}
