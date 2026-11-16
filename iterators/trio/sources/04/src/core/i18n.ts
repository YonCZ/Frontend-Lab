import type { Locale } from "./data";

type Dict = {
  navHome: string;
  navTrips: string;
  navContact: string;
  navTerms: string;
  navAdmin: string;
  book: string;
  bookNow: string;
  from: string;
  perPerson: string;
  allTrips: string;
  explore: string;
  viewTrip: string;
  soldOut: string;
  lastSeats: string;
  available: string;
  ourOffer: string;
  heroKicker: string;
  heroTitleA: string;
  heroTitleB: string;
  heroLead: string;
  scroll: string;
  featured: string;
  featuredLead: string;
  categories: string;
  categoriesShort: string;
  categoriesLead: string;
  whyUs: string;
  whyUsLead: string;
  why1Title: string;
  why1Body: string;
  why2Title: string;
  why2Body: string;
  why3Title: string;
  why3Body: string;
  partners: string;
  partnersLead: string;
  tripsTitle: string;
  tripsLead: string;
  filterCategory: string;
  filterMonth: string;
  filterAvailability: string;
  filterPrice: string;
  filterAll: string;
  anyMonth: string;
  anyPrice: string;
  anyAvailability: string;
  onlyAvailable: string;
  onlySoldOut: string;
  reset: string;
  results: string;
  noResults: string;
  noResultsBody: string;
  clearFilters: string;
  sortDate: string;
  sortPrice: string;
  sortLabel: string;
  monthNames: string[];
  detailWhat: string;
  detailIncluded: string;
  detailExcluded: string;
  detailDeparture: string;
  detailReturn: string;
  detailPrice: string;
  detailPractical: string;
  detailSeats: string;
  detailSeatsLeft: string;
  detailSoldOutBody: string;
  detailReserve: string;
  detailBookLead: string;
  detailOperator: string;
  detailBack: string;
  bookingTitle: string;
  bookingLead: string;
  step: string;
  stepDeparture: string;
  stepSeats: string;
  stepDetails: string;
  chooseDeparture: string;
  chooseDepartureLead: string;
  seatMap: string;
  seatMapLead: string;
  legendFree: string;
  legendTaken: string;
  legendSelected: string;
  seatsSelected: string;
  noSeats: string;
  continue: string;
  back: string;
  yourDetails: string;
  yourDetailsLead: string;
  name: string;
  email: string;
  phone: string;
  participants: string;
  participantNames: string;
  note: string;
  noteHint: string;
  insurance: string;
  insuranceHint: string;
  summary: string;
  seats: string;
  departure: string;
  total: string;
  submit: string;
  submitting: string;
  required: string;
  invalidEmail: string;
  invalidPhone: string;
  pickSeatFirst: string;
  pickDepartureFirst: string;
  confirmTitle: string;
  confirmBody: string;
  bookingRef: string;
  confirmedEmail: string;
  newBooking: string;
  contactTitle: string;
  contactLead: string;
  office: string;
  officeHours: string;
  callUs: string;
  writeUs: string;
  vouchers: string;
  insuranceLabel: string;
  findUs: string;
  contactFormTitle: string;
  message: string;
  send: string;
  sent: string;
  sentBody: string;
  termsTitle: string;
  termsLead: string;
  termsIntro: string;
  termsWhen: string;
  termsFee: string;
  termsNoFee: string;
  termsNoFeeBody: string;
  termsNote: string;
  footerAbout: string;
  footerExplore: string;
  footerContact: string;
  footerLegal: string;
  rights: string;
  langSwitch: string;
  adminTitle: string;
  adminLead: string;
  passphrase: string;
  enter: string;
  wrongPass: string;
  passHint: string;
  logout: string;
  adminTrips: string;
  adminNew: string;
  adminBookings: string;
  adminCreate: string;
  adminEdit: string;
  adminSave: string;
  adminSaved: string;
  adminDelete: string;
  adminSeatCount: string;
  adminSoldOut: string;
  adminPublished: string;
  adminPrice: string;
  adminDate: string;
  adminEndDate: string;
  adminTitleCs: string;
  adminTitleEn: string;
  adminDescCs: string;
  adminDescEn: string;
  adminTagCs: string;
  adminTagEn: string;
  adminImage: string;
  adminImageUrl: string;
  adminCategory: string;
  adminDep: string;
  adminAddDep: string;
  adminRemove: string;
  adminIncludes: string;
  adminExcludes: string;
  adminOnePerLine: string;
  adminSeats: string;
  adminNoBookings: string;
  adminPassengers: string;
  adminCreated: string;
  adminCancel: string;
  adminDanger: string;
  freeSeats: string;
  tripSingular: string;
  tripPlural: string;
  person: string;
  persons: string;
  and: string;
  seat: string;
  seatsWord: string;
  dayTrip: string;
  packageStay: string;
  backToTrips: string;
  priceFrom: string;
  priceNote: string;
  includesShort: string;
  duration: string;
  oneDay: string;
  sevenDays: string;
  chooseLanguage: string;
  close: string;
  menu: string;
};

export const T: Record<Locale, Dict> = {
  cs: {
    navHome: "Domů",
    navTrips: "Zájezdy",
    navContact: "Kontakt",
    navTerms: "Storno podmínky",
    navAdmin: "Administrace",
    book: "Objednat",
    bookNow: "Rezervovat místo",
    from: "od",
    perPerson: "za osobu",
    allTrips: "Všechny zájezdy",
    explore: "Prohlédnout zájezdy",
    viewTrip: "Detail zájezdu",
    soldOut: "Vyprodáno",
    lastSeats: "Poslední místa",
    available: "Volná místa",
    ourOffer: "Naše nabídka",
    heroKicker: "Cestovní agentura Moravské Budějovice",
    heroTitleA: "Světlo adventu,",
    heroTitleB: "zvuk divadla, teplo pramenů.",
    heroLead: "Den, který si zapamatujete. Odjíždíme z Moravských Budějovic, Třebíče, Jaroměřic a Znojma.",
    scroll: "Procházet",
    featured: "Nejbližší odjezdy",
    featuredLead: "Advent začíná za pár dní. Vyberte si termín a rezervujte místo v autobuse.",
    categories: "Čtyři způsoby, jak vypadnout",
    categoriesShort: "Kategorie",
    categoriesLead: "Adventní trhy, muzikály a divadla, termální lázně a jeden pobyt u řeckého moře.",
    whyUs: "Proč CA TRIO",
    whyUsLead: "Malá agentura, přímý kontakt a průvodce, který jede s vámi.",
    why1Title: "Osobně, ne z call centra",
    why1Body: "Ludmila Přikrylová a její tým znají každý zájezd. Zavolejte, stavte se v kanceláři, nebo napište.",
    why2Title: "Vše na jednom místě",
    why2Body: "Doprava, vstupenky, pojištění i pobytové taxy. Řekneme vám předem, co je v ceně a co se platí na místě.",
    why3Title: "Odjezd blízko domova",
    why3Body: "Nástupní místa v Moravských Budějovicích, Jaroměřicích, Třebíči, Znojmě a Jihlavě.",
    partners: "Smluvní cestovní kanceláře",
    partnersLead: "Delší pobyty prodáváme prostřednictvím prověřených kanceláří. Zeptejte se na konkrétní termín.",
    tripsTitle: "Zájezdy",
    tripsLead: "Filtrujte podle kategorie, měsíce, dostupnosti a ceny. Všechny ceny jsou za osobu.",
    filterCategory: "Kategorie",
    filterMonth: "Měsíc",
    filterAvailability: "Dostupnost",
    filterPrice: "Cena",
    filterAll: "Vše",
    anyMonth: "Libovolný měsíc",
    anyPrice: "Libovolná cena",
    anyAvailability: "Všechny termíny",
    onlyAvailable: "Jen volná místa",
    onlySoldOut: "Jen vyprodané",
    reset: "Zrušit filtry",
    results: "zájezdů",
    noResults: "Nic jsme nenašli",
    noResultsBody: "Zkuste jiný měsíc nebo širší cenové rozpětí.",
    clearFilters: "Zrušit filtry",
    sortDate: "Podle data",
    sortPrice: "Podle ceny",
    sortLabel: "Řadit",
    monthNames: ["Leden", "Únor", "Březen", "Duben", "Květen", "Červen", "Červenec", "Srpen", "Září", "Říjen", "Listopad", "Prosinec"],
    detailWhat: "Co vás čeká",
    detailIncluded: "V ceně",
    detailExcluded: "Není v ceně",
    detailDeparture: "Nástupní místa",
    detailReturn: "Návrat",
    detailPrice: "Cena",
    detailPractical: "Praktické informace",
    detailSeats: "Míst v autobuse",
    detailSeatsLeft: "volných míst",
    detailSoldOutBody: "Tento termín je vyprodaný. Napište nám a dáme vám vědět, když se místo uvolní.",
    detailReserve: "Rezervovat",
    detailBookLead: "Vyberte nástupní místo a sedadlo v autobuse. Platba probíhá v kanceláři nebo na faktuře.",
    detailOperator: "Provozovatel",
    detailBack: "Zpět na zájezdy",
    bookingTitle: "Rezervace",
    bookingLead: "Tři kroky a místo je vaše.",
    step: "Krok",
    stepDeparture: "Nástupní místo",
    stepSeats: "Sedadla",
    stepDetails: "Údaje",
    chooseDeparture: "Odkud pojedete?",
    chooseDepartureLead: "Vyberte místo, kde nastoupíte. Čas je orientační, přesný čas potvrdíme před odjezdem.",
    seatMap: "Vyberte sedadla",
    seatMapLead: "Klikněte na volné sedadlo. Vybraná místa se odečtou z kapacity.",
    legendFree: "Volné",
    legendTaken: "Obsazené",
    legendSelected: "Vaše volba",
    seatsSelected: "vybraná místa",
    noSeats: "Zatím nemáte vybrané sedadlo.",
    continue: "Pokračovat",
    back: "Zpět",
    yourDetails: "Vaše údaje",
    yourDetailsLead: "Potřebujeme jen to, co nám řeknete vy. Pole s hvězdičkou jsou povinná.",
    name: "Jméno a příjmení",
    email: "E-mail",
    phone: "Telefon",
    participants: "Jména účastníků",
    participantNames: "Jména dalších cestujících",
    note: "Poznámka",
    noteHint: "Sem napište jména účastníků, požadavek na cestovní pojištění nebo cokoli dalšího.",
    insurance: "Chci cestovní pojištění AXA (35 Kč na osobu a den)",
    insuranceHint: "Sjednáme ho v kanceláři před odjezdem.",
    summary: "Souhrn",
    seats: "Sedadla",
    departure: "Nástup",
    total: "Celkem",
    submit: "Odeslat rezervaci",
    submitting: "Odesíláme…",
    required: "Toto pole je povinné.",
    invalidEmail: "Zadejte platný e-mail.",
    invalidPhone: "Zadejte platné telefonní číslo.",
    pickSeatFirst: "Vyberte alespoň jedno sedadlo.",
    pickDepartureFirst: "Vyberte nástupní místo.",
    confirmTitle: "Rezervace přijata",
    confirmBody: "Děkujeme. Ozveme se do dvou pracovních dnů s potvrzením a platebními údaji.",
    bookingRef: "Číslo rezervace",
    confirmedEmail: "Potvrzení posíláme na",
    newBooking: "Další rezervace",
    contactTitle: "Kontakt",
    contactLead: "Jsme malá kancelář na náměstí. Zavolejte, napište nebo se stavte.",
    office: "Kancelář",
    officeHours: "Otevírací doba",
    callUs: "Telefon",
    writeUs: "E-mail",
    vouchers: "Přijímáme poukázky",
    insuranceLabel: "Cestovní pojištění",
    findUs: "Kde nás najdete",
    contactFormTitle: "Napište nám",
    message: "Zpráva",
    send: "Odeslat zprávu",
    sent: "Zpráva odeslána",
    sentBody: "Děkujeme, ozveme se co nejdřív.",
    termsTitle: "Storno podmínky",
    termsLead: "Zrušení zájezdu má jasná pravidla. Nic neskrýváme.",
    termsIntro: "Zruší-li zákazník objednané služby, zaplatí CA TRIO storno poplatek z ceny objednaných služeb:",
    termsWhen: "Kdy zrušíte",
    termsFee: "Storno poplatek",
    termsNoFee: "Kdy se storno neplatí",
    termsNoFeeBody: "Při úmrtí v rodině, vážném onemocnění, pobytu v nemocnici, živelné katastrofě, havárii a další nepředvídaně závažné okolnosti.",
    termsNote: "Storno poplatek se počítá z ceny objednaných služeb. V případě pochybností nám zavolejte dřív, než se rozhodnete.",
    footerAbout: "Cestovní agentura v Moravských Budějovicích. Adventní zájezdy, muzikály, termální lázně a pobyty.",
    footerExplore: "Objevujte",
    footerContact: "Kontakt",
    footerLegal: "Údaje",
    rights: "Všechna práva vyhrazena.",
    langSwitch: "Jazyk",
    adminTitle: "Administrace",
    adminLead: "Správa zájezdů a rezervací. Tato část není součástí veřejného webu.",
    passphrase: "Přístupová fráze",
    enter: "Vstoupit",
    wrongPass: "Nesprávná fráze. Zkuste to znovu.",
    passHint: "Demo fráze: trio2027",
    logout: "Odhlásit",
    adminTrips: "Zájezdy",
    adminNew: "Nový zájezd",
    adminBookings: "Rezervace",
    adminCreate: "Vytvořit zájezd",
    adminEdit: "Upravit",
    adminSave: "Uložit změny",
    adminSaved: "Uloženo",
    adminDelete: "Smazat",
    adminSeatCount: "Počet míst v autobuse",
    adminSoldOut: "Vyprodáno",
    adminPublished: "Zveřejněno",
    adminPrice: "Cena (Kč)",
    adminDate: "Datum odjezdu",
    adminEndDate: "Datum návratu",
    adminTitleCs: "Název česky",
    adminTitleEn: "Název anglicky",
    adminDescCs: "Popis česky",
    adminDescEn: "Popis anglicky",
    adminTagCs: "Podtitul česky",
    adminTagEn: "Podtitul anglicky",
    adminImage: "Obrázek",
    adminImageUrl: "Vlastní cesta k obrázku",
    adminCategory: "Kategorie",
    adminDep: "Nástupní místa",
    adminAddDep: "Přidat místo",
    adminRemove: "Odebrat",
    adminIncludes: "V ceně (jedna položka na řádek)",
    adminExcludes: "Není v ceně (jedna položka na řádek)",
    adminOnePerLine: "Jedna položka na řádek",
    adminSeats: "Obsazená sedadla",
    adminNoBookings: "Zatím žádné rezervace.",
    adminPassengers: "cestujících",
    adminCreated: "Zájezd vytvořen",
    adminCancel: "Zrušit",
    adminDanger: "Tento zájezd zmizí z nabídky i z rezervací.",
    freeSeats: "volných",
    tripSingular: "zájezd",
    tripPlural: "zájezdů",
    person: "osoba",
    persons: "osoby",
    and: "a",
    seat: "místo",
    seatsWord: "míst",
    dayTrip: "Jednodenní zájezd",
    packageStay: "Pobytový zájezd",
    backToTrips: "Zpět na zájezdy",
    priceFrom: "od",
    priceNote: "Poznámka k ceně",
    includesShort: "V ceně",
    duration: "Délka",
    oneDay: "1 den",
    sevenDays: "7 nocí",
    chooseLanguage: "Jazyk",
    close: "Zavřít",
    menu: "Menu",
  },
  en: {
    navHome: "Home",
    navTrips: "Trips",
    navContact: "Contact",
    navTerms: "Cancellation terms",
    navAdmin: "Admin",
    book: "Book",
    bookNow: "Reserve a seat",
    from: "from",
    perPerson: "per person",
    allTrips: "All trips",
    explore: "Browse trips",
    viewTrip: "Trip details",
    soldOut: "Sold out",
    lastSeats: "Last seats",
    available: "Seats free",
    ourOffer: "What we offer",
    heroKicker: "Travel agency in Moravské Budějovice",
    heroTitleA: "Advent light,",
    heroTitleB: "theatre sound, thermal warmth.",
    heroLead: "A day you will remember. We leave from Moravské Budějovice, Třebíč, Jaroměřice and Znojmo.",
    scroll: "Scroll",
    featured: "Next departures",
    featuredLead: "Advent starts in days. Pick a date and reserve your seat on the bus.",
    categories: "Four ways to get away",
    categoriesShort: "Categories",
    categoriesLead: "Advent markets, musicals and theatre, thermal spas, and one stay by the Greek sea.",
    whyUs: "Why CA Trio",
    whyUsLead: "A small agency, a direct line, and a guide who travels with you.",
    why1Title: "A person, not a call centre",
    why1Body: "Ludmila Přikrylová and her team know every trip. Call, drop by the office, or write.",
    why2Title: "Everything in one place",
    why2Body: "Transport, tickets, insurance and local taxes. We tell you up front what is included and what you pay on site.",
    why3Title: "Departure close to home",
    why3Body: "Pick-up points in Moravské Budějovice, Jaroměřice, Třebíč, Znojmo and Jihlava.",
    partners: "Partner agencies",
    partnersLead: "We sell longer stays through trusted agencies. Ask us about a specific date.",
    tripsTitle: "Trips",
    tripsLead: "Filter by category, month, availability and price. All prices are per person.",
    filterCategory: "Category",
    filterMonth: "Month",
    filterAvailability: "Availability",
    filterPrice: "Price",
    filterAll: "All",
    anyMonth: "Any month",
    anyPrice: "Any price",
    anyAvailability: "All dates",
    onlyAvailable: "Available only",
    onlySoldOut: "Sold out only",
    reset: "Clear filters",
    results: "trips",
    noResults: "Nothing here",
    noResultsBody: "Try another month or a wider price range.",
    clearFilters: "Clear filters",
    sortDate: "By date",
    sortPrice: "By price",
    sortLabel: "Sort",
    monthNames: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
    detailWhat: "What happens",
    detailIncluded: "Included",
    detailExcluded: "Not included",
    detailDeparture: "Departure points",
    detailReturn: "Return",
    detailPrice: "Price",
    detailPractical: "Practical details",
    detailSeats: "Seats on the bus",
    detailSeatsLeft: "seats free",
    detailSoldOutBody: "This date is sold out. Write to us and we will let you know if a seat opens up.",
    detailReserve: "Reserve",
    detailBookLead: "Choose a departure point and a seat on the bus. Payment is at the office or by invoice.",
    detailOperator: "Operator",
    detailBack: "Back to trips",
    bookingTitle: "Booking",
    bookingLead: "Three steps and the seat is yours.",
    step: "Step",
    stepDeparture: "Departure",
    stepSeats: "Seats",
    stepDetails: "Details",
    chooseDeparture: "Where do you board?",
    chooseDepartureLead: "Pick your boarding point. Times are approximate; we confirm the exact time before departure.",
    seatMap: "Choose your seats",
    seatMapLead: "Tap a free seat. Selected seats are removed from the capacity.",
    legendFree: "Free",
    legendTaken: "Taken",
    legendSelected: "Your pick",
    seatsSelected: "seats selected",
    noSeats: "No seat selected yet.",
    continue: "Continue",
    back: "Back",
    yourDetails: "Your details",
    yourDetailsLead: "We only ask for what you tell us. Fields marked with a star are required.",
    name: "Full name",
    email: "Email",
    phone: "Phone",
    participants: "Participant names",
    participantNames: "Names of other travellers",
    note: "Note",
    noteHint: "Add participant names, a travel insurance request, or anything else.",
    insurance: "Add AXA travel insurance (35 CZK per person per day)",
    insuranceHint: "We arrange it at the office before departure.",
    summary: "Summary",
    seats: "Seats",
    departure: "Boarding",
    total: "Total",
    submit: "Send booking",
    submitting: "Sending…",
    required: "This field is required.",
    invalidEmail: "Enter a valid email.",
    invalidPhone: "Enter a valid phone number.",
    pickSeatFirst: "Choose at least one seat.",
    pickDepartureFirst: "Choose a departure point.",
    confirmTitle: "Booking received",
    confirmBody: "Thank you. We will be in touch within two working days with confirmation and payment details.",
    bookingRef: "Booking reference",
    confirmedEmail: "We send confirmation to",
    newBooking: "Book another trip",
    contactTitle: "Contact",
    contactLead: "We are a small office on the square. Call, write, or drop in.",
    office: "Office",
    officeHours: "Office hours",
    callUs: "Phone",
    writeUs: "Email",
    vouchers: "Vouchers accepted",
    insuranceLabel: "Travel insurance",
    findUs: "Find us",
    contactFormTitle: "Write to us",
    message: "Message",
    send: "Send message",
    sent: "Message sent",
    sentBody: "Thank you, we will get back to you soon.",
    termsTitle: "Cancellation terms",
    termsLead: "Cancelling a trip has clear rules. Nothing hidden.",
    termsIntro: "If a customer cancels ordered services, CA Trio charges a cancellation fee on the price of those services:",
    termsWhen: "When you cancel",
    termsFee: "Cancellation fee",
    termsNoFee: "When there is no fee",
    termsNoFeeBody: "On a death in the family, serious illness, hospital stay, natural disaster, accident or another unforeseeably serious reason.",
    termsNote: "The fee is calculated from the price of the ordered services. If in doubt, call us before you decide.",
    footerAbout: "A travel agency in Moravské Budějovice. Advent trips, musicals, thermal spas and package stays.",
    footerExplore: "Explore",
    footerContact: "Contact",
    footerLegal: "Details",
    rights: "All rights reserved.",
    langSwitch: "Language",
    adminTitle: "Admin",
    adminLead: "Trip and booking management. This area is not part of the public site.",
    passphrase: "Passphrase",
    enter: "Enter",
    wrongPass: "Wrong passphrase. Try again.",
    passHint: "Demo passphrase: trio2027",
    logout: "Sign out",
    adminTrips: "Trips",
    adminNew: "New trip",
    adminBookings: "Bookings",
    adminCreate: "Create trip",
    adminEdit: "Edit",
    adminSave: "Save changes",
    adminSaved: "Saved",
    adminDelete: "Delete",
    adminSeatCount: "Seats on the bus",
    adminSoldOut: "Sold out",
    adminPublished: "Published",
    adminPrice: "Price (CZK)",
    adminDate: "Departure date",
    adminEndDate: "Return date",
    adminTitleCs: "Title in Czech",
    adminTitleEn: "Title in English",
    adminDescCs: "Description in Czech",
    adminDescEn: "Description in English",
    adminTagCs: "Tagline in Czech",
    adminTagEn: "Tagline in English",
    adminImage: "Image",
    adminImageUrl: "Custom image path",
    adminCategory: "Category",
    adminDep: "Departure points",
    adminAddDep: "Add point",
    adminRemove: "Remove",
    adminIncludes: "Included (one item per line)",
    adminExcludes: "Not included (one item per line)",
    adminOnePerLine: "One item per line",
    adminSeats: "Booked seats",
    adminNoBookings: "No bookings yet.",
    adminPassengers: "travellers",
    adminCreated: "Trip created",
    adminCancel: "Cancel",
    adminDanger: "This trip disappears from the offer and its bookings.",
    freeSeats: "free",
    tripSingular: "trip",
    tripPlural: "trips",
    person: "person",
    persons: "people",
    and: "and",
    seat: "seat",
    seatsWord: "seats",
    dayTrip: "Day trip",
    packageStay: "Package stay",
    backToTrips: "Back to trips",
    priceFrom: "from",
    priceNote: "Price note",
    includesShort: "Included",
    duration: "Duration",
    oneDay: "1 day",
    sevenDays: "7 nights",
    chooseLanguage: "Language",
    close: "Close",
    menu: "Menu",
  },
};
