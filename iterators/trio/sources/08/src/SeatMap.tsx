import { busLayout, type Lang, type Trip } from "./data";
import { S } from "./i18n";

type Props = {
  trip: Trip;
  selected: string[];
  onToggle: (seat: string) => void;
  lang: Lang;
  disabled?: boolean;
};

export default function SeatMap({ trip, selected, onToggle, lang, disabled }: Props) {
  const rows = busLayout(trip.seats);
  const taken = new Set(trip.taken);

  return (
    <div className="seatmap" data-testid="seatmap">
      <div className="seatmap-head">
        <span className="seatmap-front">{lang === "cs" ? "Předek autobusu" : "Front of the bus"}</span>
        <span className="seatmap-wheel" aria-hidden="true">
          <span className="wheel-ring" />
          <span className="wheel-stem" />
          <span className="seatmap-driver">{S.driver[lang]}</span>
        </span>
      </div>

      <div className="bus">
        {rows.map((row, ri) => {
          if (row.back) {
            return (
              <div className="bus-row bus-row-back" key={`back-${ri}`}>
                {row.seats.map((seat) => (
                  <SeatButton
                    key={seat}
                    seat={seat}
                    isTaken={taken.has(String(seat))}
                    isSelected={selected.includes(String(seat))}
                    onToggle={onToggle}
                    lang={lang}
                    disabled={disabled}
                  />
                ))}
              </div>
            );
          }
          const [a, b, c, d] = row.seats;
          return (
            <div className="bus-row" key={`row-${ri}`}>
              {a ? (
                <SeatButton seat={a} isTaken={taken.has(String(a))} isSelected={selected.includes(String(a))} onToggle={onToggle} lang={lang} disabled={disabled} />
              ) : (
                <span />
              )}
              {b ? (
                <SeatButton seat={b} isTaken={taken.has(String(b))} isSelected={selected.includes(String(b))} onToggle={onToggle} lang={lang} disabled={disabled} />
              ) : (
                <span />
              )}
              <span className="aisle" aria-hidden="true">
                {ri + 1}
              </span>
              {c ? (
                <SeatButton seat={c} isTaken={taken.has(String(c))} isSelected={selected.includes(String(c))} onToggle={onToggle} lang={lang} disabled={disabled} />
              ) : (
                <span />
              )}
              {d ? (
                <SeatButton seat={d} isTaken={taken.has(String(d))} isSelected={selected.includes(String(d))} onToggle={onToggle} lang={lang} disabled={disabled} />
              ) : (
                <span />
              )}
            </div>
          );
        })}
      </div>

      <div className="seat-legend">
        <span>
          <i className="swatch swatch-free" /> {S.legendFree[lang]}
        </span>
        <span>
          <i className="swatch swatch-picked" /> {S.legendPicked[lang]}
        </span>
        <span>
          <i className="swatch swatch-taken" /> {S.legendTaken[lang]}
        </span>
      </div>
    </div>
  );
}

function SeatButton({
  seat,
  isTaken,
  isSelected,
  onToggle,
  lang,
  disabled,
}: {
  seat: number;
  isTaken: boolean;
  isSelected: boolean;
  onToggle: (seat: string) => void;
  lang: Lang;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      className={`seat${isSelected ? " is-selected" : ""}${isTaken ? " is-taken" : ""}`}
      aria-pressed={isSelected}
      aria-label={`${S.seatLabel[lang]} ${seat}`}
      title={isTaken ? S.seatTakenTitle[lang] : `${S.seatLabel[lang]} ${seat}`}
      disabled={isTaken || disabled}
      onClick={() => onToggle(String(seat))}
    >
      {seat}
    </button>
  );
}
