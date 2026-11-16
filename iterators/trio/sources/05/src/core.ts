import { useCallback, useEffect, useState } from "react";
import type { Lang, L, Trip } from "./data";
import { trips as seedTrips } from "./data";

export const t = (v: L | undefined, lang: Lang) => (v ? v[lang] : "");

const ui: Record<string, L> = {
  "nav.trips": { cs: "Zájezdy", en: "Trips" },
  "nav.contact": { cs: "Kontakt", en: "Contact" },
  "nav.admin": { cs: "Administrace", en: "Admin" },
  "nav.home": { cs: "Domů", en: "Home" },
  "common.all": { cs: "Všechny zájezdy", en: "All trips" },
  "common.detail": { cs: "Detail zájezdu", en: "Trip detail" },
  "common.book": { cs: "Rezervovat místo", en: "Book a seat" },
  "common.bookShort": { cs: "Rezervovat", en: "Book" },
  "common.soldout": { cs: "Vyprodáno", en: "Sold out" },
  "common.available": { cs: "Volná místa", en: "Seats available" },
  "common.seatsLeft": { cs: "míst volných", en: "seats left" },
  "common.seats": { cs: "míst", en: "seats" },
  "common.back": { cs: "Zpět", en: "Back" },
  "common.backTrips": { cs: "Zpět na zájezdy", en: "Back to trips" },
  "common.date": { cs: "Termín", en: "Date" },
  "common.duration": { cs: "Délka", en: "Duration" },
  "common.departure": { cs: "Nástupní místo", en: "Departure point" },
  "common.departures": { cs: "Nástupní místa", en: "Departure points" },
  "common.price": { cs: "Cena", en: "Price" },
  "common.category": { cs: "Kategorie", en: "Category" },
  "common.included": { cs: "V ceně", en: "Price includes" },
  "common.excluded": { cs: "Není v ceně", en: "Price excludes" },
  "common.program": { cs: "Program", en: "Programme" },
  "common.what": { cs: "Co se děje", en: "What happens" },
  "common.notes": { cs: "Dobré vědět", en: "Good to know" },
  "common.perPerson": { cs: "za osobu", en: "per person" },
  "common.from": { cs: "od", en: "from" },
  "common.notFound": { cs: "Tento zájezd není v nabídce.", en: "This trip is not on offer." },
  "common.notFoundLead": { cs: "Možná byl stažen nebo je odkaz starý. Prohlédněte si aktuální nabídku.", en: "It may have been unpublished or the link is old. Have a look at the current offer." },
  "common.published": { cs: "Zveřejněno", en: "Published" },
  "common.unpublished": { cs: "Skryté", en: "Unpublished" },
  "common.loading": { cs: "Načítám", en: "Loading" },

  "home.eyebrow": { cs: "Cestovní agentura, Moravské Budějovice", en: "Travel agency, Moravské Budějovice" },
  "home.next": { cs: "Nejbližší odjezdy", en: "Next departures" },
  "home.nextLead": { cs: "Čtyři termíny, které se blíží. Místa se rezervují na stránce zájezdu.", en: "Four dates coming up. Seats are booked on the trip page." },
  "home.categories": { cs: "Co vozíme", en: "What we run" },
  "home.categoriesLead": { cs: "Čtyři vlastní kategorie a partnerské kanceláře pro delší pobyty.", en: "Four own categories, plus partner agencies for longer stays." },
  "home.greece": { cs: "Řecko 2027", en: "Greece 2027" },
  "home.practical": { cs: "Než vyrazíte", en: "Before you go" },
  "home.hours": { cs: "Otevírací doba", en: "Office hours" },
  "home.hoursValue": { cs: "Úterý a čtvrtek, 10:00 až 16:30", en: "Tuesday and Thursday, 10:00 to 16:30" },
  "home.vouchers": { cs: "Přijímáme poukázky", en: "We accept vouchers" },
  "home.insurance": { cs: "Cestovní pojištění", en: "Travel insurance" },
  "home.insuranceValue": { cs: "AXA, 35 Kč na osobu a den. Sjednáme v kanceláři.", en: "AXA, 35 CZK per person per day. Arranged at the office." },
  "home.partners": { cs: "Smluvní kanceláře", en: "Partner agencies" },
  "home.partnersLead": { cs: "Delší pobyty prodáváme prostřednictvím patnácti smluvních kanceláří.", en: "Longer stays are sold through fifteen partner agencies." },
  "home.contactCta": { cs: "Napište nám", en: "Write to us" },
  "foot.claim": { cs: "Advent, muzikály, lázně a Řecko. Cestovní agentura z Moravských Budějovic.", en: "Advent, musicals, spas and Greece. A travel agency from Moravské Budějovice." },
  "home.about": { cs: "Deset zájezdů, jedna kancelář na náměstí", en: "Ten trips, one office on the square" },
  "home.aboutText": {
    cs: "CA TRIO je cestovní agentura Ludmily Přikrylové v Moravských Budějovicích. Vozíme adventní výlety, muzikály a divadla, termální lázně a jeden pobyt v Řecku. Odjíždíme z náměstí Míru a zpátky se vracíme večer.",
    en: "CA TRIO is Ludmila Přikrylová's travel agency in Moravské Budějovice. We run Advent trips, musicals and theatre, thermal spas and one stay in Greece. We leave from náměstí Míru and come back in the evening.",
  },

  "trips.title": { cs: "Zájezdy", en: "Trips" },
  "trips.lead": { cs: "Deset zájezdů na sezónu 2026/27. Filtrujte podle kategorie, měsíce, dostupnosti a ceny.", en: "Ten trips for the 2026/27 season. Filter by category, month, availability and price." },
  "filter.category": { cs: "Kategorie", en: "Category" },
  "filter.month": { cs: "Měsíc", en: "Month" },
  "filter.availability": { cs: "Dostupnost", en: "Availability" },
  "filter.price": { cs: "Maximální cena", en: "Maximum price" },
  "filter.all": { cs: "Vše", en: "All" },
  "filter.any": { cs: "Kdykoli", en: "Any month" },
  "filter.available": { cs: "S volnými místy", en: "With seats" },
  "filter.soldout": { cs: "Jen vyprodané", en: "Sold out only" },
  "filter.reset": { cs: "Zrušit filtry", en: "Clear filters" },
  "filter.count": { cs: "zájezdů", en: "trips" },
  "filter.empty": { cs: "Tomuto výběru neodpovídá žádný zájezd.", en: "No trip matches this selection." },
  "filter.emptyLead": { cs: "Zkuste jiný měsíc nebo zrušte cenový limit.", en: "Try another month or raise the price limit." },
  "filter.priceTo": { cs: "do", en: "up to" },

  "detail.seats": { cs: "Místa v autobuse", en: "Seats on the coach" },
  "detail.seatsLead": { cs: "2+2 sedadla, ulička uprostřed a pětimístná zadní lavice.", en: "2+2 seating, an aisle down the middle and a five-seat back row." },
  "detail.choose": { cs: "Vybrat místo", en: "Choose a seat" },
  "detail.depart": { cs: "Odjezd", en: "Departs" },
  "detail.return": { cs: "Návrat", en: "Returns" },
  "detail.soldoutLead": { cs: "Tento termín je vyprodaný. Zavolejte nám a zapíšeme vás na náhradní místa.", en: "This date is sold out. Call us and we will put you on the waiting list." },
  "detail.unpublishedLead": { cs: "Zájezd momentálně není v nabídce. Podívejte se na ostatní termíny.", en: "This trip is not on offer right now. Have a look at the other dates." },
  "detail.bookLead": { cs: "Vyberte nástupní místo a sedadlo. Cena je za osobu a sedadlo.", en: "Choose a departure point and a seat. The price is per person and seat." },
  "detail.pickup": { cs: "Odkud pojedete", en: "Where you board" },

  "book.title": { cs: "Rezervace", en: "Booking" },
  "book.step1": { cs: "Nástupní místo", en: "Departure point" },
  "book.step2": { cs: "Místa v autobuse", en: "Seats" },
  "book.step3": { cs: "Údaje cestujících", en: "Passenger details" },
  "book.step1Lead": { cs: "Vyberte, odkud pojedete. Čas je uvedený u každého místa.", en: "Choose where you board. Each point shows its time." },
  "book.step2Lead": { cs: "Klikněte na volné sedadlo. Vybraná místa se odečtou z ceny.", en: "Click a free seat. Each selected seat is added to the price." },
  "book.step3Lead": { cs: "Potřebujeme jméno, kontakt a jména všech cestujících.", en: "We need a name, contact details and the names of everyone travelling." },
  "book.legendFree": { cs: "Volné", en: "Free" },
  "book.legendTaken": { cs: "Obsazené", en: "Taken" },
  "book.legendSelected": { cs: "Vaše", en: "Yours" },
  "book.legendClosed": { cs: "Mimo provoz", en: "Not in use" },
  "book.driver": { cs: "Řidič", en: "Driver" },
  "book.rear": { cs: "Zadní lavice", en: "Back row" },
  "book.summary": { cs: "Souhrn", en: "Summary" },
  "book.total": { cs: "Celkem", en: "Total" },
  "book.seatsChosen": { cs: "Vybraná místa", en: "Selected seats" },
  "book.none": { cs: "Zatím žádné", en: "None yet" },
  "book.continue": { cs: "Pokračovat na údaje", en: "Continue to details" },
  "book.submit": { cs: "Odeslat rezervaci", en: "Send booking" },
  "book.name": { cs: "Jméno a příjmení", en: "Full name" },
  "book.email": { cs: "E-mail", en: "Email" },
  "book.phone": { cs: "Telefon", en: "Phone" },
  "book.note": { cs: "Poznámka", en: "Note" },
  "book.noteHint": { cs: "Pojištění, jména spolucestujících, cokoli dalšího.", en: "Insurance, fellow travellers, anything else." },
  "book.optional": { cs: "nepovinné", en: "optional" },
  "book.passengers": { cs: "Jména cestujících", en: "Passenger names" },
  "book.passenger": { cs: "Cestující", en: "Passenger" },
  "book.pickSeats": { cs: "Nejprve označte místa v kroku 2. Podle nich se doplní pole pro jména.", en: "Pick your seats in step 2 first. The name fields follow the seats." },
  "book.seat": { cs: "sedadlo", en: "seat" },
  "book.confirmTitle": { cs: "Rezervace odeslána", en: "Booking sent" },
  "book.confirmLead": { cs: "Ozveme se do dvou pracovních dnů s pokyny k platbě. Místa držíme do té doby.", en: "We will reply within two working days with payment instructions. The seats are held until then." },
  "book.ref": { cs: "Číslo rezervace", en: "Booking reference" },
  "book.another": { cs: "Prohlédnout další zájezdy", en: "Browse more trips" },
  "book.summaryTrip": { cs: "Zájezd", en: "Trip" },
  "book.errSeats": { cs: "Vyberte alespoň jedno místo.", en: "Choose at least one seat." },
  "book.errDeparture": { cs: "Vyberte nástupní místo.", en: "Choose a departure point." },
  "book.errName": { cs: "Doplňte jméno a příjmení.", en: "Add your full name." },
  "book.errEmail": { cs: "Zadejte platný e-mail.", en: "Enter a valid email address." },
  "book.errPhone": { cs: "Zadejte telefon, alespoň 6 číslic.", en: "Enter a phone number, at least 6 digits." },
  "book.errPassenger": { cs: "Doplňte jméno cestujícího.", en: "Add the passenger's name." },

  "contact.title": { cs: "Kontakt a podmínky", en: "Contact and terms" },
  "contact.lead": { cs: "Kancelář najdete na Šafaříkově ulici v Moravských Budějovicích. Otevřeno je v úterý a ve čtvrtek.", en: "The office is on Šafaříkova street in Moravské Budějovice. Open on Tuesdays and Thursdays." },
  "contact.office": { cs: "Kancelář", en: "Office" },
  "contact.owner": { cs: "Majitelka", en: "Owner" },
  "contact.ico": { cs: "IČ", en: "Company ID" },
  "contact.phone": { cs: "Telefon", en: "Phone" },
  "contact.email": { cs: "E-mail", en: "Email" },
  "contact.facebook": { cs: "Facebook", en: "Facebook" },
  "contact.hours": { cs: "Otevírací doba", en: "Office hours" },
  "contact.vouchers": { cs: "Poukázky", en: "Vouchers" },
  "contact.insurance": { cs: "Pojištění", en: "Insurance" },
  "contact.insuranceText": { cs: "Cestovní pojištění AXA sjednáme v kanceláři za 35 Kč na osobu a den.", en: "We arrange AXA travel insurance at the office for 35 CZK per person per day." },
  "contact.terms": { cs: "Storno podmínky", en: "Cancellation terms" },
  "contact.termsLead": { cs: "Zrušíte-li objednané služby, zaplatíte storno poplatek z ceny objednaných služeb.", en: "If you cancel the ordered services, you pay a cancellation fee on the price of those services." },
  "contact.pct": { cs: "z ceny", en: "of the price" },
  "contact.partners": { cs: "Smluvní cestovní kanceláře", en: "Partner travel agencies" },
  "contact.partnersLead": { cs: "Pobyty u nás prodáváme i prostřednictvím těchto kanceláří. Informace dostanete v CA TRIO.", en: "We also sell stays through these agencies. Ask at CA TRIO for details." },
  "contact.how": { cs: "Jak rezervace funguje", en: "How booking works" },
  "contact.how1": { cs: "Vyberte zájezd a nástupní místo.", en: "Choose a trip and a departure point." },
  "contact.how2": { cs: "Označte volná sedadla v autobuse.", en: "Pick free seats on the coach." },
  "contact.how3": { cs: "Odešlete údaje, ozveme se s platbou.", en: "Send your details, we reply with payment." },
  "contact.legal": { cs: "Podnikatel je evidován v Živnostenském rejstříku vedeném Městským úřadem v Moravských Budějovicích.", en: "Registered in the trade register kept by the Municipal Authority in Moravské Budějovice." },

  "admin.title": { cs: "Administrace", en: "Admin" },
  "admin.gate": { cs: "Vstup do administrace", en: "Admin sign in" },
  "admin.gateLead": { cs: "Zadejte heslo kanceláře. Sekce není součástí veřejného webu.", en: "Enter the office passphrase. This section is not part of the public site." },
  "admin.pass": { cs: "Heslo", en: "Passphrase" },
  "admin.enter": { cs: "Vstoupit", en: "Sign in" },
  "admin.wrong": { cs: "Nesprávné heslo. Zkuste to znovu.", en: "Wrong passphrase. Try again." },
  "admin.hint": { cs: "Demo heslo: trio2026", en: "Demo passphrase: trio2026" },
  "admin.logout": { cs: "Odhlásit", en: "Sign out" },
  "admin.trips": { cs: "Zájezdy", en: "Trips" },
  "admin.new": { cs: "Nový zájezd", en: "New trip" },
  "admin.bookings": { cs: "Rezervace", en: "Bookings" },
  "admin.noBookings": { cs: "Zatím žádné rezervace.", en: "No bookings yet." },
  "admin.soldout": { cs: "Vyprodáno", en: "Sold out" },
  "admin.soldoutOn": { cs: "Označit vyprodáno", en: "Mark sold out" },
  "admin.soldoutOff": { cs: "Zrušit vyprodáno", en: "Remove sold out" },
  "admin.publish": { cs: "Zveřejnit", en: "Publish" },
  "admin.unpublish": { cs: "Skrýt", en: "Unpublish" },
  "admin.edit": { cs: "Upravit", en: "Edit" },
  "admin.save": { cs: "Uložit zájezd", en: "Save trip" },
  "admin.cancel": { cs: "Zrušit", en: "Cancel" },
  "admin.reset": { cs: "Obnovit výchozí data", en: "Reset demo data" },
  "admin.resetAsk": { cs: "Opravdu obnovit výchozí zájezdy a smazat rezervace?", en: "Reset the trips to the original data and delete all bookings?" },
  "admin.statsTrips": { cs: "Zájezdy", en: "Trips" },
  "admin.statsBookings": { cs: "Rezervace", en: "Bookings" },
  "admin.statsSeats": { cs: "Obsazená místa", en: "Seats booked" },
  "admin.statsValue": { cs: "Hodnota rezervací", en: "Booking value" },
  "admin.editTitle": { cs: "Úprava zájezdu", en: "Edit trip" },
  "admin.newTitle": { cs: "Nový zájezd", en: "New trip" },
  "admin.tripInfo": { cs: "Základní údaje", en: "Trip details" },
  "admin.content": { cs: "Texty", en: "Copy" },
  "admin.lists": { cs: "Co je v ceně", en: "Inclusions" },
  "admin.departures": { cs: "Nástupní místa", en: "Departure points" },
  "admin.media": { cs: "Obrázek", en: "Image" },
  "admin.fTitleCs": { cs: "Název česky", en: "Title in Czech" },
  "admin.fTitleEn": { cs: "Název anglicky", en: "Title in English" },
  "admin.fTagCs": { cs: "Podtitul česky", en: "Tagline in Czech" },
  "admin.fTagEn": { cs: "Podtitul anglicky", en: "Tagline in English" },
  "admin.fCat": { cs: "Kategorie", en: "Category" },
  "admin.fDate": { cs: "Datum odjezdu", en: "Departure date" },
  "admin.fEnd": { cs: "Datum návratu", en: "Return date" },
  "admin.fPrice": { cs: "Cena v Kč", en: "Price in CZK" },
  "admin.fPriceNoteCs": { cs: "Poznámka k ceně česky", en: "Price note in Czech" },
  "admin.fPriceNoteEn": { cs: "Poznámka k ceně anglicky", en: "Price note in English" },
  "admin.fSeats": { cs: "Počet míst v autobuse", en: "Seats on the coach" },
  "admin.fSeatsHint": { cs: "20 až 53. Místa nad limit se zobrazí jako mimo provoz.", en: "20 to 53. Seats above the limit show as not in use." },
  "admin.fLeadCs": { cs: "Popis česky", en: "Description in Czech" },
  "admin.fLeadEn": { cs: "Popis anglicky", en: "Description in English" },
  "admin.fAboutCs": { cs: "Delší text česky", en: "Longer text in Czech" },
  "admin.fAboutEn": { cs: "Delší text anglicky", en: "Longer text in English" },
  "admin.fProgramCs": { cs: "Program, česky | anglicky, jeden bod na řádek", en: "Programme, Czech | English, one item per line" },
  "admin.fIncludes": { cs: "V ceně, česky | anglicky, jeden bod na řádek", en: "Included, Czech | English, one item per line" },
  "admin.fExcludes": { cs: "Není v ceně, česky | anglicky, jeden bod na řádek", en: "Excluded, Czech | English, one item per line" },
  "admin.fDepPlaceCs": { cs: "Místo česky", en: "Place in Czech" },
  "admin.fDepPlaceEn": { cs: "Místo anglicky", en: "Place in English" },
  "admin.fDepTime": { cs: "Čas", en: "Time" },
  "admin.addDep": { cs: "Přidat místo", en: "Add point" },
  "admin.removeDep": { cs: "Odebrat", en: "Remove" },
  "admin.fPublished": { cs: "Zveřejněný", en: "Published" },
  "admin.fSoldout": { cs: "Vyprodaný", en: "Sold out" },
  "admin.seatsBooked": { cs: "Obsazená místa", en: "Seats booked" },
  "admin.value": { cs: "Hodnota", en: "Value" },
  "admin.noTrips": { cs: "Žádné zájezdy.", en: "No trips." },
  "admin.created": { cs: "Zájezd uložen.", en: "Trip saved." },
  "admin.mockNote": { cs: "Rezervace se v tomto prototypu ukládají do prohlížeče. Tlačítko níže je smaže.", en: "In this prototype, bookings are stored in the browser. The button below deletes them." },
};

export function i18n(lang: Lang): (key: string) => string {
  return (key: string) => ui[key]?.[lang] ?? key;
}

export const tripCount = (n: number, lang: Lang) =>
  lang === "en" ? `${n} ${n === 1 ? "trip" : "trips"}` : `${n} ${n === 1 ? "zájezd" : n >= 2 && n <= 4 ? "zájezdy" : "zájezdů"}`;

export const money = (n: number, lang: Lang) =>
  lang === "cs" ? `${new Intl.NumberFormat("cs-CZ").format(n)} Kč` : `CZK ${new Intl.NumberFormat("en-GB").format(n)}`;

export const dateFmt = (iso: string, lang: Lang) =>
  new Intl.DateTimeFormat(lang === "cs" ? "cs-CZ" : "en-GB", { day: "numeric", month: "long", year: "numeric" }).format(new Date(iso + "T12:00:00"));

export const shortDate = (iso: string, lang: Lang) =>
  new Intl.DateTimeFormat(lang === "cs" ? "cs-CZ" : "en-GB", { day: "numeric", month: "short" }).format(new Date(iso + "T12:00:00"));

export const monthLabel = (key: string, lang: Lang) => {
  const [y, m] = key.split("-").map(Number);
  return new Intl.DateTimeFormat(lang === "cs" ? "cs-CZ" : "en-GB", { month: "long", year: "numeric" }).format(new Date(y, m - 1, 1));
};

export const monthsOf = (list: Trip[]) => {
  const set = new Set(list.map((x) => x.date.slice(0, 7)));
  return [...set].sort();
};

export type Booking = {
  ref: string;
  tripId: string;
  departureId: string;
  seats: number[];
  name: string;
  email: string;
  phone: string;
  note: string;
  passengers: string[];
  total: number;
  createdAt: string;
};

const NS = "catrio.2";
const TRIPS_KEY = `${NS}.trips.v1`;
const BOOK_KEY = `${NS}.bookings.v1`;
const LANG_KEY = `${NS}.lang.v1`;
export const ADMIN_KEY = `${NS}.admin`;

export function loadLang(): Lang {
  try {
    const v = localStorage.getItem(LANG_KEY);
    if (v === "cs" || v === "en") return v;
  } catch {}
  return "cs";
}

export function saveLang(lang: Lang) {
  try { localStorage.setItem(LANG_KEY, lang); } catch {}
}

export function loadTrips(): Trip[] {
  try {
    const raw = localStorage.getItem(TRIPS_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length) return parsed as Trip[];
    }
  } catch {}
  return seedTrips;
}

export function saveTrips(list: Trip[]) {
  try { localStorage.setItem(TRIPS_KEY, JSON.stringify(list)); } catch {}
}

export function loadBookings(): Booking[] {
  try {
    const raw = localStorage.getItem(BOOK_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) return parsed as Booking[];
    }
  } catch {}
  return [];
}

export function saveBookings(list: Booking[]) {
  try { localStorage.setItem(BOOK_KEY, JSON.stringify(list)); } catch {}
}

export function resetDemo() {
  try {
    localStorage.removeItem(TRIPS_KEY);
    localStorage.removeItem(BOOK_KEY);
  } catch {}
}

export function usePersistence() {
  const [lang, setLang] = useState<Lang>(() => loadLang());
  const [tripList, setTripList] = useState<Trip[]>(() => loadTrips());
  const [bookingList, setBookingList] = useState<Booking[]>(() => loadBookings());

  useEffect(() => {
    document.documentElement.lang = lang;
    saveLang(lang);
  }, [lang]);

  const updateTrips = useCallback((next: Trip[]) => {
    setTripList(next);
    saveTrips(next);
  }, []);

  const addBooking = useCallback((b: Booking) => {
    setBookingList((prev) => {
      const next = [...prev, b];
      saveBookings(next);
      return next;
    });
  }, []);

  const clearAll = useCallback(() => {
    resetDemo();
    setTripList(seedTrips.map((x) => ({ ...x })));
    setBookingList([]);
  }, []);

  return { lang, setLang, tripList, updateTrips, bookingList, addBooking, clearAll };
}

/* Seat plan: 12 rows of 2+2, aisle, then a back row of 5. */
export type SeatRow = { kind: "row"; index: number; left: number[]; right: number[] } | { kind: "back"; seats: number[] };
export type SeatState = "free" | "taken" | "closed" | "selected";

export const BACK_ROW = [49, 50, 51, 52, 53];

export function seatRows(): SeatRow[] {
  const rows: SeatRow[] = [];
  for (let i = 0; i < 12; i++) {
    const base = i * 4;
    rows.push({ kind: "row", index: i, left: [base + 1, base + 2], right: [base + 3, base + 4] });
  }
  rows.push({ kind: "back", seats: [...BACK_ROW] });
  return rows;
}

function hash(s: string) {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0;
  return h;
}

export function baseTaken(trip: Trip, bookings: Booking[]): Set<number> {
  const taken = new Set<number>();
  if (trip.soldOut) {
    for (let i = 1; i <= 53; i++) taken.add(i);
    return taken;
  }
  const h = hash(trip.id);
  const density = 0.3 + (h % 30) / 100;
  for (let i = 1; i <= 53; i++) {
    const v = ((h ^ (i * 2654435761)) >>> 0) % 1000;
    if (v < density * 1000) taken.add(i);
  }
  bookings
    .filter((b) => b.tripId === trip.id)
    .forEach((b) => b.seats.forEach((s) => taken.add(s)));
  return taken;
}

export function seatState(n: number, trip: Trip, taken: Set<number>, selected: number[]): SeatState {
  if (n > trip.seats) return "closed";
  if (selected.includes(n)) return "selected";
  if (taken.has(n)) return "taken";
  return "free";
}

export const freeSeats = (trip: Trip, bookings: Booking[]) => {
  const taken = baseTaken(trip, bookings);
  let free = 0;
  for (let i = 1; i <= trip.seats; i++) if (!taken.has(i)) free++;
  return free;
};

export function makeRef() {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let s = "";
  for (let i = 0; i < 5; i++) s += chars[Math.floor(Math.random() * chars.length)];
  return `TRIO-${s}`;
}

export const validEmail = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim());
export const validPhone = (v: string) => (v.replace(/\D/g, "").length >= 6);
