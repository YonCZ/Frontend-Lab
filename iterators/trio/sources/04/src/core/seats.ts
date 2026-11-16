export type SeatLayout = {
  rows: number[][];
  back: number[];
  total: number;
};

export function seatLayout(count: number): SeatLayout {
  const total = Math.max(5, Math.min(61, count));
  const front = total - 5;
  const rowCount = Math.ceil(front / 4);
  const rows: number[][] = [];
  for (let row = 0; row < rowCount; row += 1) {
    const seats: number[] = [];
    for (let col = 0; col < 4; col += 1) {
      const number = row * 4 + col + 1;
      if (number <= front) seats.push(number);
    }
    rows.push(seats);
  }
  const back: number[] = [];
  for (let number = front + 1; number <= total; number += 1) back.push(number);
  return { rows, back, total };
}

function hash(text: string) {
  let h = 2166136261;
  for (let i = 0; i < text.length; i += 1) {
    h ^= text.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

export function seededTaken(id: string, count: number) {
  const total = Math.max(5, Math.min(61, count));
  const seed = hash(id);
  const ratio = 0.16 + ((seed % 21) / 100);
  const target = Math.max(2, Math.round(total * ratio));
  const taken = new Set<number>();
  let x = seed || 1;
  while (taken.size < target) {
    x = (Math.imul(x, 1664525) + 1013904223) >>> 0;
    taken.add((x % total) + 1);
  }
  return taken;
}

export function availability(tripId: string, count: number, booked: number[]) {
  const taken = seededTaken(tripId, count);
  booked.forEach((seat) => taken.add(seat));
  const total = Math.max(5, Math.min(61, count));
  return {
    taken,
    free: total - [...taken].filter((seat) => seat <= total).length,
  };
}
