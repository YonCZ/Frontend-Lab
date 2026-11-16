export type Lang = "cs" | "en";
export type L = { cs: string; en: string };
export type Cat = "advent" | "show" | "greece" | "spa";

export type Departure = { id: string; place: L; time: string };

export type Trip = {
  id: string;
  cat: Cat;
  date: string;
  endDate?: string;
  price: number;
  priceNote?: L;
  img: string;
  seats: number;
  soldOut: boolean;
  published: boolean;
  title: L;
  tagline: L;
  place: L;
  lead: L;
  about: L;
  program: L[];
  includes: L[];
  excludes: L[];
  departures: Departure[];
  duration: L;
  note?: L;
};

const p = {
  mb: { cs: "Moravské Budějovice, nám. Míru", en: "Moravské Budějovice, náměstí Míru" },
  trebic: { cs: "Třebíč, Úřad práce", en: "Třebíč, Labour Office" },
  jaromerice: { cs: "Jaroměřice nad Rokytnou, zámek", en: "Jaroměřice nad Rokytnou, chateau" },
  znojmo: { cs: "Znojmo, čerpací stanice Shell", en: "Znojmo, Shell petrol station" },
  jihlava: { cs: "Jihlava, Billa", en: "Jihlava, Billa" },
};

const dep = (key: keyof typeof p, time: string): Departure => ({
  id: `${key}-${time.replace(":", "")}`,
  place: p[key],
  time,
});

export const categories: { id: Cat; title: L; blurb: L; img: string }[] = [
  {
    id: "advent",
    title: { cs: "Adventní zájezdy", en: "Advent trips" },
    blurb: {
      cs: "Vídeň, Bratislava, Kittenberg a Veselý Kopec. Čtyři jednodenní cesty za světly a trhy.",
      en: "Vienna, Bratislava, Kittenberg and Veselý Kopec. Four day trips into lights and markets.",
    },
    img: "assets/10244l.jpg",
  },
  {
    id: "show",
    title: { cs: "Muzikály, koncerty, divadla", en: "Musicals, concerts, theatre" },
    blurb: {
      cs: "Muzikál na ledě, Zagorové písničky a pohádka na prknech. Autobusem za muzikálem.",
      en: "A musical on ice, Zagorová's songs and a fairy tale on stage. By coach to the musical.",
    },
    img: "assets/10321l.jpg",
  },
  {
    id: "greece",
    title: { cs: "Pobytové Řecko 2027", en: "Greece package stays 2027" },
    blurb: {
      cs: "Kamena Vourla, hotel SISSY***, polopenze a moře. Osm dní s odletem z Brna.",
      en: "Kamena Vourla, Hotel SISSY***, half board and the sea. Eight days, flying from Brno.",
    },
    img: "assets/10292l.jpg",
  },
  {
    id: "spa",
    title: { cs: "Termální lázně", en: "Thermal spas" },
    blurb: {
      cs: "Bük a Sárvár. Celý den ve vodě 33 až 36 stupňů, zpátky večer.",
      en: "Bük and Sárvár. A full day in water at 33 to 36 degrees, home in the evening.",
    },
    img: "assets/10307l.jpg",
  },
];

export const agency = {
  name: "CA TRIO",
  owner: "Ludmila Přikrylová",
  street: "Šafaříkova 1304",
  city: "676 02 Moravské Budějovice",
  ico: "12152854",
  phone: "+420 737 102 348",
  email: "info@ca-trio.cz",
  facebook: "https://www.facebook.com/TRIOcestovniagentura",
  bank: "PLUXEE, EDENRED, BENEFITY",
  register: {
    cs: "Podnikatel je evidován v Živnostenském rejstříku vedeném Městským úřadem v Moravských Budějovicích.",
    en: "Registered in the trade register kept by the Municipal Authority in Moravské Budějovice.",
  },
};

export const trips: Trip[] = [
  {
    id: "vanocni-viden",
    cat: "advent",
    date: "2026-12-19",
    price: 585,
    img: "assets/10244l.jpg",
    seats: 53,
    soldOut: false,
    published: true,
    title: { cs: "Vánoční Vídeň", en: "Christmas Vienna" },
    tagline: { cs: "Jednodenní zájezd za adventní atmosférou", en: "A day trip into Advent Vienna" },
    place: { cs: "Vídeň, Rakousko", en: "Vienna, Austria" },
    duration: { cs: "1 den", en: "1 day" },
    lead: {
      cs: "Schönbrunn, osvětlené centrum a největší trh před radnicí. Odjezd z Vídně ve 20:00.",
      en: "Schönbrunn, the illuminated centre and the largest market in front of the City Hall. Return from Vienna at 20:00.",
    },
    about: {
      cs: "Tradiční zájezd za vánoční atmosférou Vídně. Nejdříve navštívíme exteriér zámku Schönbrunn, který dýchá adventní atmosférou s nevšedním vánočním trhem, poté odjedeme do centra. Pěší procházka vede vánočně osvětleným centrem kolem Hofburgu, Michalského náměstí a dómu Sv. Štěpána. Zbývá čas na galerie, muzea, nákupy a adventní trhy.",
      en: "A traditional trip for Vienna's Christmas atmosphere. The day starts at the exterior of Schönbrunn Palace with its Christmas market, then moves to the centre. A walking route covers the illuminated centre, the Hofburg, Michaelerplatz and St Stephen's Cathedral, with time left for galleries, museums, shopping and the Advent markets.",
    },
    program: [
      { cs: "Exteriér zámku Schönbrunn a jeho vánoční trh.", en: "The exterior of Schönbrunn Palace and its Christmas market." },
      { cs: "Pěší procházka osvětleným centrem: Hofburg, Michalské náměstí, dóm Sv. Štěpána.", en: "A walk through the illuminated centre: the Hofburg, Michaelerplatz, St Stephen's Cathedral." },
      { cs: "Čas na galerie, muzea, nákupy a adventní trhy.", en: "Time for galleries, museums, shopping and the Advent markets." },
      { cs: "Největší trh před vídeňskou radnicí, horký punč a porcelánový hrníček na památku.", en: "The largest market in front of the Vienna City Hall, hot punch and a porcelain cup to keep." },
      { cs: "Ochutnejte pravý vídeňský preclík nebo Sacher dort.", en: "Try a real Viennese pretzel or a Sacher torte." },
      { cs: "Večerní vánoční koncert v budově radnice.", en: "An evening Christmas concert in the City Hall." },
      { cs: "Doporučujeme teplé oblečení a obuv.", en: "Warm clothing and shoes recommended." },
    ],
    includes: [
      { cs: "Doprava", en: "Transport" },
      { cs: "Průvodce", en: "Guide" },
    ],
    excludes: [{ cs: "Cestovní pojištění, možno sjednat v CA TRIO", en: "Travel insurance, available at CA Trio" }],
    departures: [dep("trebic", "9:30"), dep("jaromerice", "9:50"), dep("mb", "10:00"), dep("znojmo", "10:30")],
    note: { cs: "Odjezd z Vídně ve 20:00.", en: "Return from Vienna at 20:00." },
  },
  {
    id: "advent-kittenberg",
    cat: "advent",
    date: "2026-11-28",
    price: 560,
    img: "assets/10294l.jpg",
    seats: 45,
    soldOut: false,
    published: true,
    title: { cs: "Advent v Kittenberských zahradách", en: "Advent in the Kittenberg Gardens" },
    tagline: { cs: "Podvečer v zahradách se 400 000 světly", en: "An evening among 400,000 lights" },
    place: { cs: "Kittenberské zahrady", en: "Kittenberg Gardens" },
    duration: { cs: "1 den", en: "1 day" },
    lead: {
      cs: "Zahrady nasvícené 400 000 světly, světelná show, betlém s ručně vyrobenými figurkami a obří plovoucí adventní věnec.",
      en: "Gardens lit by 400,000 lights, a light show, a nativity scene with handmade figures and a giant floating Advent wreath.",
    },
    about: {
      cs: "Odjezd v brzkých odpoledních hodinách. Jako kdybyste vstoupili rovnou do pohádky, takový zažijete podvečer v kouzelném prostředí Kittenberských zahrad. Budete obdivovat různá zákoutí s vánoční výzdobou, sochami, loučemi, ohněm a dekoracemi, doplněná světelnou show a vánočními koncerty.",
      en: "An early afternoon departure and an evening in the Kittenberg Gardens. The route passes corners decorated for Christmas with statues, torches and open fire, with a light show and Christmas concerts.",
    },
    program: [
      { cs: "Odjezd v brzkých odpoledních hodinách.", en: "An early afternoon departure." },
      { cs: "Zahrady nasvícené 400 000 světly, světelná show a vánoční koncerty.", en: "Gardens lit by 400,000 lights, with a light show and Christmas concerts." },
      { cs: "Betlém s ručně vyrobenými figurkami, obří plovoucí adventní věnec, barevné vodorysky.", en: "A nativity scene with handmade figures, a giant floating Advent wreath and coloured water features." },
      { cs: "Punč, svařené víno a občerstvení pro zahřátí.", en: "Punch, mulled wine and food to warm up." },
      { cs: "Prodejna vánočních dekorací.", en: "A shop with Christmas decorations." },
      { cs: "Návrat ve večerních hodinách.", en: "Return in the evening." },
    ],
    includes: [
      { cs: "Doprava", en: "Transport" },
      { cs: "Průvodce", en: "Guide" },
    ],
    excludes: [
      { cs: "Vstupné 11 € dospělí, 6 € děti", en: "Entrance, 11 EUR adult and 6 EUR child" },
      { cs: "Cestovní pojištění, možno sjednat v CA TRIO", en: "Travel insurance, available at CA Trio" },
    ],
    departures: [dep("trebic", "11:30"), dep("jaromerice", "11:50"), dep("mb", "12:00"), dep("znojmo", "12:30")],
    note: { cs: "Doporučujeme teplé oblečení a obuv.", en: "Warm clothing and shoes recommended." },
  },
  {
    id: "vesely-kopec",
    cat: "advent",
    date: "2026-12-05",
    price: 780,
    priceNote: { cs: "760 Kč senioři, 710 Kč děti", en: "760 CZK seniors, 710 CZK children" },
    img: "assets/10303l.jpg",
    seats: 39,
    soldOut: false,
    published: true,
    title: { cs: "Vánoce na Veselém Kopci a osvětlený dům v Chotovicích", en: "Christmas at Veselý Kopec and the illuminated house in Chotovice" },
    tagline: { cs: "Skanzen, koledy a dům z Guinessovy knihy rekordů", en: "Open-air museum, carols and a record-holding house" },
    place: { cs: "Veselý Kopec, Chotovice", en: "Veselý Kopec, Chotovice" },
    duration: { cs: "1 den", en: "1 day" },
    lead: {
      cs: "Jak advent prožívali naši předci, lidové koledy a večer dům v Chotovicích, který se zapsal do Guinessovy knihy rekordů.",
      en: "How earlier generations spent Advent, folk carols and, in the evening, a house in Chotovice that entered the Guinness Book of Records.",
    },
    about: {
      cs: "Oblíbený program Vánoce na Veselém Kopci je místem, kde se dozvíme, jak naši předci prožívali adventní období. Vše doplňují lidové koledy, předvádění výroby vánočních předmětů a možnost nákupu dárků. K večeru se pojedeme podívat do Chotovic, kde světýlka zdobí celý dům i zahradu s altánem.",
      en: "The much-loved Christmas at Veselý Kopec programme shows how earlier generations spent Advent, with folk carols, demonstrations of making Christmas objects and a chance to buy gifts. In the evening the group visits a house in Chotovice where lights cover the whole building and the garden with its gazebo.",
    },
    program: [
      { cs: "Odjezd v dopoledních hodinách.", en: "A morning departure." },
      { cs: "Vánoce na Veselém Kopci: jak advent prožívali naši předci.", en: "Christmas at Veselý Kopec: how earlier generations spent Advent." },
      { cs: "Lidové koledy a ukázky výroby vánočních předmětů.", en: "Folk carols and demonstrations of making Christmas objects." },
      { cs: "Možnost nákupu dárků.", en: "A chance to buy gifts." },
      { cs: "Večer osvětlený dům a zahrada v Chotovicích, zapsané do Guinessovy knihy rekordů.", en: "In the evening, the illuminated house and garden in Chotovice, in the Guinness Book of Records." },
      { cs: "Doprovod českých koled.", en: "Accompanied by Czech carols." },
    ],
    includes: [
      { cs: "Doprava", en: "Transport" },
      { cs: "Průvodce", en: "Guide" },
      { cs: "Vstup do skanzenu", en: "Entry to the open-air museum" },
    ],
    excludes: [],
    departures: [dep("mb", "9:00"), dep("jaromerice", "9:10"), dep("trebic", "9:30")],
  },
  {
    id: "vanocni-bratislava",
    cat: "advent",
    date: "2026-12-12",
    price: 695,
    img: "assets/8087l.jpg",
    seats: 53,
    soldOut: true,
    published: true,
    title: { cs: "Vánoční Bratislava, čokoládovna Hauswirth", en: "Christmas Bratislava and the Hauswirth chocolate factory" },
    tagline: { cs: "Adventní trhy a čokoládovna v Rakousku", en: "Advent markets and a chocolate factory in Austria" },
    place: { cs: "Bratislava, Slovensko", en: "Bratislava, Slovakia" },
    duration: { cs: "1 den", en: "1 day" },
    lead: {
      cs: "Čokoládovna Hauswirth, procházka vyzdobenou Bratislavou a volno na trzích. Platba v čokoládovně pouze v hotovosti.",
      en: "The Hauswirth chocolate factory, a walk through decorated Bratislava and free time at the markets. Cash only at the chocolate factory.",
    },
    about: {
      cs: "Nejdříve v Rakousku navštívíme čokoládovnu Hauswirth. Po seznámení s výrobou a nákupu v podnikové prodejně odjedeme do Bratislavy. Projdeme se kouzelně vánočně vyzdobeným městem kolem Katedrály sv. Martina, Michalské brány a Grasalkovičova paláce. Společná prohlídka končí u Slovenského národního divadla, poté je volno na adventní trhy.",
      en: "The day begins in Austria at the Hauswirth chocolate factory, with a look at how the chocolates are made and time in the factory shop, then continues to Bratislava. A guided walk covers the decorated old town, and the afternoon is free for the Advent markets.",
    },
    program: [
      { cs: "Čokoládovna Hauswirth v Rakousku: výroba a podniková prodejna.", en: "The Hauswirth chocolate factory in Austria: how the chocolates are made and the factory shop." },
      { cs: "Procházka vyzdobenou Bratislavou: Katedrála sv. Martina, Michalská brána, Grasalkovičův palác.", en: "A walk through decorated Bratislava: St Martin's Cathedral, Michael's Gate, the Grassalkovich Palace." },
      { cs: "Stará radnice, socha Čumila, Slovenské národní divadlo.", en: "The Old Town Hall, the Čumil statue, the Slovak National Theatre." },
      { cs: "Volno na adventních trzích s občerstvením a dárky.", en: "Free time at the Advent markets for food and gifts." },
      { cs: "Kulturní program trhů.", en: "The market's cultural programme." },
      { cs: "Platba v čokoládovně pouze v hotovosti. Návrat večer.", en: "Cash only at the chocolate factory. Return in the evening." },
    ],
    includes: [
      { cs: "Doprava", en: "Transport" },
      { cs: "Průvodce", en: "Guide" },
    ],
    excludes: [{ cs: "Cestovní pojištění, možno sjednat v CA TRIO", en: "Travel insurance, available at CA Trio" }],
    departures: [dep("trebic", "8:00"), dep("jaromerice", "8:20"), dep("mb", "8:30"), dep("znojmo", "9:00")],
  },
  {
    id: "snehova-kralovna",
    cat: "show",
    date: "2027-02-20",
    price: 290,
    priceNote: { cs: "Vstupenky dle výběru v CA již od 840 Kč", en: "Tickets from 840 CZK when bought at CA Trio" },
    img: "assets/10321l.jpg",
    seats: 49,
    soldOut: false,
    published: true,
    title: { cs: "Sněhová královna, muzikál na ledě", en: "The Snow Queen, a musical on ice" },
    tagline: { cs: "Muzikál na ledě", en: "A musical on ice" },
    place: { cs: "Muzikál na ledě", en: "Musical on ice" },
    duration: { cs: "1 den", en: "1 day" },
    lead: {
      cs: "Pohádka o síle přátelství, lásky a odvahy v provedení na ledě, se scénou, světelnou show a filmovými projekcemi.",
      en: "A tale of friendship, love and courage staged on ice, with a stage set, light show and film projections.",
    },
    about: {
      cs: "Jeden z nejkrásnějších pohádkových příběhů o síle přátelství, lásky a odvahy ožije v jedinečném provedení poprvé na ledě. Muzikál Sněhová královna je inspirovaný pohádkou Hanse Christiana Andersena. Diváci se mohou těšit na podívanou, která propojí svět hudby, tance a krasobruslení.",
      en: "The Hans Christian Andersen fairy tale about friendship, love and courage, staged on ice. The show combines music, dance and figure skating with a stage set, light show and film projections.",
    },
    program: [
      { cs: "Pohádka Hanse Christiana Andersena o přátelství, lásce a odvaze.", en: "Hans Christian Andersen's tale of friendship, love and courage." },
      { cs: "Muzikálové provedení na ledě: hudba, tanec a krasobruslení.", en: "A musical staging on ice: music, dance and figure skating." },
      { cs: "Unikátní scéna, světelná show a filmové projekce.", en: "A stage set, light show and film projections." },
      { cs: "Scénář Jan a Alena Pixovi, texty Kristýna Pixová a Ondřej Suchý, hudba Zdeněk Barták, kostýmy Roman Šolc.", en: "Script by Jan and Alena Pix, lyrics by Kristýna Pixová and Ondřej Suchý, music by Zdeněk Barták, costumes by Roman Šolc." },
      { cs: "Vstupenky dle výběru v CA již od 840 Kč.", en: "Tickets from 840 CZK when bought at CA Trio." },
    ],
    includes: [{ cs: "Doprava", en: "Transport" }],
    excludes: [{ cs: "Vstupenka, dle výběru v CA již od 840 Kč", en: "Ticket, from 840 CZK when bought at CA Trio" }],
    departures: [dep("mb", "12:00"), dep("jaromerice", "12:10"), dep("trebic", "12:30")],
  },
  {
    id: "biograf-laska",
    cat: "show",
    date: "2027-05-02",
    price: 620,
    img: "assets/10322l.jpg",
    seats: 53,
    soldOut: false,
    published: true,
    title: { cs: "Biograf láska II, Nový příběh", en: "Biograf láska II: A New Story" },
    tagline: { cs: "Muzikál s písněmi Hany Zagorové", en: "A musical of Hana Zagorová songs" },
    place: { cs: "Divadlo Kalich, Praha", en: "Divadlo Kalich, Prague" },
    duration: { cs: "1 den", en: "1 day" },
    lead: {
      cs: "Pokračování muzikálu s písničkami Hany Zagorové. Nový příběh, noví hrdinové a odkazy na první díl.",
      en: "A sequel to the musical built on Hana Zagorová's songs. A new story, new characters and references to the first show.",
    },
    about: {
      cs: "První muzikál s písničkami Hany Zagorové Biograf láska se setkal s nadšenými ohlasy. Stejní tvůrci připravili Biograf láska 2: Nový příběh. Autorka scénáře Uljana Donátová napsala zcela nový příběh, nezávislý na předchozím titulu.",
      en: "The first musical built on Hana Zagorová's songs met with an enthusiastic response. The same authors prepared Biograf láska 2: A New Story, written by Uljana Donátová as a story independent of the first show.",
    },
    program: [
      { cs: "Pokračování muzikálu s písněmi Hany Zagorové.", en: "A sequel to the musical built on Hana Zagorová's songs." },
      { cs: "Nový příběh, noví hrdinové a nové zápletky.", en: "A new story, new characters and new turns." },
      { cs: "Odkazy na první díl pro ty, kdo ho viděli.", en: "References to the first show for those who saw it." },
      { cs: "Divadlo Kalich, Praha. Scénář Uljana Donátová.", en: "Divadlo Kalich, Prague. Screenplay by Uljana Donátová." },
      { cs: "Vstupenky dle výběru v CA již od 849 Kč.", en: "Tickets from 849 CZK when bought at CA Trio." },
    ],
    includes: [
      { cs: "Doprava", en: "Transport" },
      { cs: "Průvodce", en: "Guide" },
    ],
    excludes: [{ cs: "Vstupenka, dle výběru v CA již od 849 Kč", en: "Ticket, from 849 CZK when bought at CA Trio" }],
    departures: [dep("mb", "10:00"), dep("jaromerice", "10:10"), dep("trebic", "10:30"), dep("jihlava", "11:00")],
  },
  {
    id: "lotrando",
    cat: "show",
    date: "2027-05-02",
    price: 620,
    img: "assets/10323l.jpg",
    seats: 41,
    soldOut: false,
    published: true,
    title: { cs: "Lotrando a Zubejda", en: "Lotrando and Zubejda" },
    tagline: { cs: "Divadlo Broadway, Praha", en: "Divadlo Broadway, Prague" },
    place: { cs: "Divadlo Broadway, Praha", en: "Divadlo Broadway, Prague" },
    duration: { cs: "1 den", en: "1 day" },
    lead: {
      cs: "Divadelní adaptace pohádky plná humoru, kouzel a písniček, které rozveselí malé i velké diváky.",
      en: "A stage adaptation of the fairy tale, full of humour, magic and songs for young and older audiences.",
    },
    about: {
      cs: "Divadelní adaptace pohádky Lotrando a Zubejda přináší na prkna příběh plný humoru, kouzel a nezapomenutelných písniček. Oblíbenou filmovou pohádku natočil v roce 1996 Karel Smyczek. Hraje Divadlo Broadway.",
      en: "A stage adaptation of the fairy tale filmed by Karel Smyczek in 1996, with its songs and humour. Performed at Divadlo Broadway in Prague.",
    },
    program: [
      { cs: "Divadelní adaptace pohádky z roku 1996.", en: "A stage adaptation of the 1996 fairy tale film." },
      { cs: "Humor, kouzla a písničky: Pod dubem, za dubem, Řízni, řízni, řízni.", en: "Humour, magic and songs." },
      { cs: "Pro malé i velké diváky.", en: "For young and older audiences." },
      { cs: "Divadlo Broadway, Praha.", en: "Divadlo Broadway, Prague." },
      { cs: "Vstupenky dle výběru v CA již od 599 Kč.", en: "Tickets from 599 CZK when bought at CA Trio." },
    ],
    includes: [
      { cs: "Doprava", en: "Transport" },
      { cs: "Průvodce", en: "Guide" },
    ],
    excludes: [{ cs: "Vstupenka, dle výběru v CA již od 599 Kč", en: "Ticket, from 599 CZK when bought at CA Trio" }],
    departures: [dep("mb", "10:00"), dep("jaromerice", "10:10"), dep("trebic", "10:30"), dep("jihlava", "11:00")],
  },
  {
    id: "recko-kamena-vourla",
    cat: "greece",
    date: "2027-08-26",
    endDate: "2027-09-02",
    price: 17490,
    priceNote: { cs: "10 990 Kč třetí osoba v pokoji do 12 let", en: "10,990 CZK for a third person in the room up to 12 years" },
    img: "assets/10292l.jpg",
    seats: 45,
    soldOut: false,
    published: true,
    title: { cs: "Řecko, Kamena Vourla", en: "Greece: Kamena Vourla" },
    tagline: { cs: "Osm dní u moře s polopenzí", en: "Eight days by the sea with half board" },
    place: { cs: "Kamena Vourla, Řecko", en: "Kamena Vourla, Greece" },
    duration: { cs: "8 dní, 7 nocí", en: "8 days, 7 nights" },
    lead: {
      cs: "Hotel SISSY*** u oblázkové pláže, polopenze, bazén a termální prameny. Odlet z Brna do Volosu.",
      en: "Hotel SISSY*** by a pebble beach, half board, a pool and thermal springs. Flights from Brno to Volos.",
    },
    about: {
      cs: "Kamena Vourla je řecké přímořské letovisko na východním pobřeží středního Řecka, nedaleko zálivu Maliakos. Město je známé plážemi, léčivými termálními prameny a klidným tempem. Bydlí se v plážovém hotelu SISSY*** s prostornou subtropickou zahradou, restaurací s venkovní terasou, barem, beach barem a animačním programem s českým animátorem. Pobyt se pořádá s CK Apollon.",
      en: "Kamena Vourla is a seaside resort on the eastern coast of central Greece, near the Maliakos Gulf, known for its beaches, thermal springs and quiet pace. The group stays at Hotel SISSY***, a beach hotel with a large subtropical garden, restaurant terrace, bar, beach bar and an animation programme with a Czech animator. Operated with CK Apollon.",
    },
    program: [
      { cs: "Letecky Brno, Volos a zpět, včetně poplatků, transfery z letiště a na letiště.", en: "Flights Brno to Volos and back, all fees included, transfers from the airport and back." },
      { cs: "Ubytování v hotelu SISSY*** u pláže, 2 až 3 lůžkové pokoje nebo rodinné premium.", en: "Hotel SISSY*** by the beach, 2 to 3 bed rooms or premium family rooms." },
      { cs: "Polopenze formou bufetu, řecká i mezinárodní kuchyně, vegetariánské možnosti.", en: "Buffet half board with Greek and international dishes, vegetarian options." },
      { cs: "Pláž s lehátky zdarma, venkovní bazén a sluneční terasa s výhledem na moře.", en: "Beach with free sunbeds, outdoor pool and a sea-view sun terrace." },
      { cs: "Český animátor, animační programy, řecké večery, bar a beach bar.", en: "Czech animator, animation programme, Greek evenings, bar and beach bar." },
      { cs: "Termální jezírka na okraji města zdarma, místní trhy.", en: "Free thermal ponds at the edge of town, local markets." },
      { cs: "Pobytová taxa 5 € na den a pokoj, platba na místě.", en: "Stay tax 5 EUR per day per room, paid locally." },
    ],
    includes: [
      { cs: "Leteckou dopravu Brno, Volos, Brno včetně poplatků", en: "Return flights Brno to Volos, all fees included" },
      { cs: "Transfer busem z letiště do hotelu a zpět", en: "Bus transfer from the airport to the hotel and back" },
      { cs: "Ubytování", en: "Accommodation" },
      { cs: "Polopenzi", en: "Half board" },
      { cs: "Služby stálého delegáta", en: "Resident delegate" },
    ],
    excludes: [
      { cs: "Pokoj premium 2 000 Kč na osobu a pobyt, třetí osoba do 12 let 1 000 Kč za pobyt", en: "Premium room, 2,000 CZK per person per stay; third person up to 12 years, 1,000 CZK per stay" },
      { cs: "Komplexní cestovní pojištění UNIQA včetně storna, 464 Kč na osobu a pobyt", en: "UNIQA comprehensive travel insurance including cancellation, 464 CZK per person per stay" },
      { cs: "Pobytovou taxu 5 € na den a pokoj, platba na místě", en: "Stay tax, 5 EUR per day per room, paid locally" },
      { cs: "Dopravu na letiště do Brna a zpět, 500 Kč na osobu", en: "Transport to Brno airport and back, 500 CZK per person" },
    ],
    departures: [dep("mb", "2:00"), dep("jaromerice", "2:10"), dep("trebic", "2:30")],
    note: { cs: "Doporučujeme rezervovat včas, pobyt bývá rychle vyprodán.", en: "Book early, the stay sells out quickly." },
  },
  {
    id: "lazne-buk",
    cat: "spa",
    date: "2026-11-29",
    price: 1170,
    priceNote: { cs: "1 070 Kč děti, do 3 let 595 Kč", en: "1,070 CZK children, 595 CZK under 3 years" },
    img: "assets/10307l.jpg",
    seats: 51,
    soldOut: false,
    published: true,
    title: { cs: "Termální lázně Bük", en: "Bük thermal spa" },
    tagline: { cs: "Celodenní relaxace v termálních bazénech", en: "A full day in thermal pools" },
    place: { cs: "Bük, Maďarsko", en: "Bük, Hungary" },
    duration: { cs: "1 den, cca 9 h v lázních", en: "1 day, about 9 hours at the spa" },
    lead: {
      cs: "Lázně 240 km daleko, voda 33 až 36 stupňů, wellness s vířivkami a divokou řekou. Další termín 29. 12. 2026.",
      en: "A spa 240 km away, water at 33 to 36 degrees, wellness with whirlpools and a wild river. Another date on 29 December 2026.",
    },
    about: {
      cs: "Jednodenní zájezd do termálních lázní v Büku. Bük je vzdálen pouhých 240 km a je známý termálními lázněmi, které mají blahodárný vliv na pohybové ústrojí a žaludeční choroby. Prostory byly v roce 2003 rozšířeny o další relaxační bazény kryté i polokryté. Relaxace v lázních trvá přibližně 9 hodin.",
      en: "A day trip to the thermal spa in Bük, 240 km away, known for baths that help with musculoskeletal and gastric complaints. More relaxation pools, indoor and semi-covered, were added in 2003. About nine hours at the spa.",
    },
    program: [
      { cs: "Odjezd časně ráno, cca 9 hodin v lázních.", en: "An early departure, about 9 hours at the spa." },
      { cs: "Bazény kryté i polokryté s vodou 33 až 36 °C.", en: "Indoor and semi-covered pools at 33 to 36 °C." },
      { cs: "Wellness: vířivky, divoká řeka, bazén pro děti, lehátka.", en: "Wellness: whirlpools, a wild river, a children's pool and sunbeds." },
      { cs: "Možnost dokoupení procedur: masáže, sauna, pedikúra.", en: "Treatments for an extra fee: massage, sauna, pedicure." },
      { cs: "Platba v eurech, forintech i kartou.", en: "Payment in euros, forints and by card." },
      { cs: "Další termín 29. 12. 2026.", en: "Another date on 29 December 2026." },
    ],
    includes: [
      { cs: "Doprava", en: "Transport" },
      { cs: "Průvodce", en: "Guide" },
      { cs: "Vstupné", en: "Entrance" },
      { cs: "Sprchy, toalety, vysoušeče vlasů, lehátka", en: "Showers, toilets, hair dryers and sunbeds" },
      { cs: "Šatny, skříňka za příplatek 40 Kč", en: "Changing rooms, lockers 40 CZK surcharge" },
    ],
    excludes: [{ cs: "Cestovní pojištění, možno sjednat v CA TRIO", en: "Travel insurance, available at CA Trio" }],
    departures: [dep("trebic", "5:00"), dep("jaromerice", "5:20"), dep("mb", "5:30"), dep("znojmo", "6:00")],
    note: { cs: "Doporučujeme koupací plášť a pantofle.", en: "A bathrobe and slippers are recommended." },
  },
  {
    id: "lazne-sarvar",
    cat: "spa",
    date: "2026-11-29",
    price: 1270,
    priceNote: { cs: "1 100 Kč děti, do 3 let 595 Kč", en: "1,100 CZK children, 595 CZK under 3 years" },
    img: "assets/10313l.jpg",
    seats: 47,
    soldOut: false,
    published: true,
    title: { cs: "Termální lázně Sárvár", en: "Sárvár thermal spa" },
    tagline: { cs: "3 600 m² bazénů v Maďarsku", en: "3,600 m² of pools in Hungary" },
    place: { cs: "Sárvár, Maďarsko", en: "Sárvár, Hungary" },
    duration: { cs: "1 den, cca 9 h v lázních", en: "1 day, about 9 hours at the spa" },
    lead: {
      cs: "Nejmodernější bazény v Maďarsku, 3 600 m² vody 30 až 36 stupňů, tobogány a skluzavky pro děti.",
      en: "Hungary's most modern pools, 3,600 m² of water at 30 to 36 degrees, slides and chutes for children.",
    },
    about: {
      cs: "Jednodenní zájezd do termálních lázní v Sárváru. Bazény patří k nejmodernějším v Maďarsku, vodní plocha má 3 600 m² a teplotu 30 až 36 °C. Voda se používá při léčbě osteoporózy, revmatismu a pohybového ústrojí. V areálu je občerstvení, šatny, odpočinkové místnosti a baby místnost.",
      en: "A day trip to the spa in Sárvár, whose pools are among the most modern in Hungary. The water area covers 3,600 square metres at 30 to 36 degrees Celsius and is used for osteoporosis, rheumatism and musculoskeletal treatment. The site has refreshments, changing rooms, rest rooms and a baby room.",
    },
    program: [
      { cs: "Odjezd časně ráno, cca 9 hodin v lázních.", en: "An early departure, about 9 hours at the spa." },
      { cs: "3 600 m² vodní plochy, voda 30 až 36 °C, kryté i polokryté bazény.", en: "3,600 m² of water at 30 to 36 °C, indoor and semi-covered pools." },
      { cs: "Velký dětský areál s tobogány a skluzavkami.", en: "A large children's area with slides and chutes." },
      { cs: "Voda pro léčbu osteoporózy, revmatismu a pohybového ústrojí.", en: "Water for osteoporosis, rheumatism and musculoskeletal treatment." },
      { cs: "Občerstvení, šatny, odpočívárny, baby místnost.", en: "Refreshments, changing rooms, rest rooms and a baby room." },
      { cs: "Platba v eurech, forintech i kartou.", en: "Payment in euros, forints and by card." },
    ],
    includes: [
      { cs: "Doprava", en: "Transport" },
      { cs: "Průvodce", en: "Guide" },
      { cs: "Vstupné", en: "Entrance" },
      { cs: "Šatny, sprchy, toalety, vysoušeče vlasů, lehátka", en: "Changing rooms, showers, toilets, hair dryers and sunbeds" },
    ],
    excludes: [{ cs: "Cestovní pojištění, možno sjednat v CA TRIO", en: "Travel insurance, available at CA Trio" }],
    departures: [dep("trebic", "5:00"), dep("jaromerice", "5:20"), dep("mb", "5:30"), dep("znojmo", "6:00")],
    note: { cs: "Doporučujeme koupací plášť a pantofle.", en: "A bathrobe and slippers are recommended." },
  },
];

export const terms = [
  { days: { cs: "dříve než 30 dnů před termínem", en: "more than 30 days before departure" }, pct: 15 },
  { days: { cs: "dříve než 14 dnů před termínem", en: "more than 14 days before departure" }, pct: 30 },
  { days: { cs: "dříve než 3 dny před termínem", en: "more than 3 days before departure" }, pct: 60 },
  { days: { cs: "později než 3 dny před termínem", en: "later than 3 days before departure" }, pct: 100 },
];

export const termsException: L = {
  cs: "Storno poplatek se neplatí při úmrtí v rodině, vážném onemocnění, pobytu v nemocnici, živelné katastrofě, havárii a další nepředvídaně závažné okolnosti.",
  en: "No fee applies for a death in the family, serious illness, hospital stay, natural disaster, accident or another unforeseeably serious reason.",
};

export const partners: { name: string; places: L }[] = [
  { name: "EXIM + Fischer", places: { cs: "Egypt, Tunisko, Turecko, Bulharsko, Řecko, Španělsko, Kypr, exotika", en: "Egypt, Tunisia, Turkey, Bulgaria, Greece, Spain, Cyprus and long-haul" } },
  { name: "ATIS", places: { cs: "Česko a Slovensko, lázně, hory, chaty, tábory, zimní pobyty", en: "Czechia and Slovakia, spas, mountains, cottages, camps, winter stays" } },
  { name: "AUTOTURIST", places: { cs: "Česko, Slovensko, Itálie, Rakousko, Maďarsko, Španělsko, Francie, Slovinsko, Řecko", en: "Czechia, Slovakia, Italy, Austria, Hungary, Spain, France, Slovenia, Greece" } },
  { name: "BONTON", places: { cs: "Řecko, Chorvatsko, Bulharsko, Itálie, Španělsko, Maďarsko, poznávací zájezdy", en: "Greece, Croatia, Bulgaria, Italy, Spain, Hungary and guided tours worldwide" } },
  { name: "AZZURRO", places: { cs: "Itálie a italské ostrovy", en: "Italy and the Italian islands" } },
  { name: "LUDOR", places: { cs: "Itálie a celé pobřeží, Čechy, Morava, Slovensko", en: "Italy and its coastline, Bohemia, Moravia, Slovakia" } },
  { name: "KOMPASTOUR", places: { cs: "Itálie, Caorle", en: "Italy, Caorle" } },
  { name: "SIAM", places: { cs: "Pobyty a poznávací zájezdy, exotika", en: "Stays and guided tours, long-haul" } },
  { name: "ESO", places: { cs: "Karibik, Indický oceán, Thajsko, Vietnam, Kambodža", en: "The Caribbean, Indian Ocean, Thailand, Vietnam, Cambodia" } },
  { name: "REDOK", places: { cs: "Itálie, Chorvatsko, Egypt, Karibik, Libye, Maroko, cykloturistika", en: "Italy, Croatia, Egypt, the Caribbean, Libya, Morocco, cycling holidays" } },
  { name: "TRAVEL 2002", places: { cs: "Španělsko, řecké ostrovy, Bulharsko, Turecko, Chorvatsko", en: "Spain, the Greek islands, Bulgaria, Turkey, Croatia" } },
  { name: "HUNGARIA", places: { cs: "Maďarsko", en: "Hungary" } },
  { name: "KRASIM", places: { cs: "Bulharsko", en: "Bulgaria" } },
  { name: "ČEDOK", places: { cs: "Bulharsko, Černá Hora, Chorvatsko, Itálie, Kypr, Malta, Řecko, Španělsko, Tunisko, Turecko a další", en: "Bulgaria, Montenegro, Croatia, Italy, Cyprus, Malta, Greece, Spain, Tunisia, Turkey and more" } },
  { name: "ALEXANDRIA", places: { cs: "Bulharsko, Řecko, Tunisko, Itálie, Chorvatsko, Španělsko, Kypr", en: "Bulgaria, Greece, Tunisia, Italy, Croatia, Spain, Cyprus" } },
];

export const hero = {
  img: "assets/hotel-sissy.jpg",
  alt: { cs: "Zahradní cesta k pláži v hotelu SISSY v Kamena Vourla", en: "Garden path to the beach at Hotel SISSY in Kamena Vourla" },
  lines: { cs: ["Osm dní", "u moře."], en: ["Eight days", "by the sea."] },
  lead: {
    cs: "Řecko 2027 v hotelu SISSY***, polopenze a odlet z Brna. K tomu adventní zájezdy, muzikály a termální lázně z Moravských Budějovic.",
    en: "Greece 2027 at Hotel SISSY***, half board and flights from Brno. Plus Advent trips, musicals and thermal spas from Moravské Budějovice.",
  },
  tripId: "recko-kamena-vourla",
};

export const tripImages = [
  "assets/10244l.jpg", "assets/10292l.jpg", "assets/10294l.jpg", "assets/10303l.jpg",
  "assets/10307l.jpg", "assets/10313l.jpg", "assets/10321l.jpg", "assets/10322l.jpg",
  "assets/10323l.jpg", "assets/8087l.jpg",
];
