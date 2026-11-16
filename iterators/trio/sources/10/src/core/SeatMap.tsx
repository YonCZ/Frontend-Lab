import type { Locale } from "./data";
import { seatLayout } from "./seats";

type Props = {
  total: number;
  taken: Set<number>;
  selected: number[];
  onToggle: (seat: number) => void;
  lang: Locale;
  disabled?: boolean;
};

export default function SeatMap({ total, taken, selected, onToggle, lang, disabled }: Props) {
  const { rows, back } = seatLayout(total);
  const label = (seat: number) => {
    const state = taken.has(seat)
      ? lang === "cs"
        ? "obsazené"
        : "taken"
      : selected.includes(seat)
        ? lang === "cs"
          ? "vaše volba"
          : "your pick"
        : lang === "cs"
          ? "volné"
          : "free";
    return lang === "cs" ? `Sedadlo ${seat}, ${state}` : `Seat ${seat}, ${state}`;
  };

  const seatButton = (seat: number | undefined, key: string) => {
    if (!seat) return <span className="seat-gap" key={key} />;
    const isTaken = taken.has(seat);
    const isSelected = selected.includes(seat);
    return (
      <button
        key={key}
        type="button"
        className={`seat${isTaken ? " is-taken" : ""}${isSelected ? " is-selected" : ""}`}
        onClick={() => !isTaken && !disabled && onToggle(seat)}
        disabled={isTaken || disabled}
        aria-pressed={isSelected}
        aria-label={label(seat)}
      >
        {seat}
      </button>
    );
  };

  return (
    <div className="seatmap">
      <div className="bus">
        <div className="bus-nose" aria-hidden="true">
          <span className="bus-wheel" />
          <span className="bus-door" />
        </div>
        <div className="bus-grid">
          {rows.map((row, index) => (
            <div className="bus-row" key={`row-${index}`}>
              {seatButton(row[0], `r${index}-0`)}
              {seatButton(row[1], `r${index}-1`)}
              <span className="bus-aisle" aria-hidden="true" />
              {seatButton(row[2], `r${index}-2`)}
              {seatButton(row[3], `r${index}-3`)}
            </div>
          ))}
          <div className="bus-back">
            {back.map((seat) => seatButton(seat, `b-${seat}`))}
          </div>
        </div>
        <div className="bus-tail" aria-hidden="true" />
      </div>
      <div className="seat-legend">
        <span>
          <i className="chip chip-free" /> {lang === "cs" ? "Volné" : "Free"}
        </span>
        <span>
          <i className="chip chip-taken" /> {lang === "cs" ? "Obsazené" : "Taken"}
        </span>
        <span>
          <i className="chip chip-picked" /> {lang === "cs" ? "Vaše volba" : "Your pick"}
        </span>
      </div>
    </div>
  );
}
