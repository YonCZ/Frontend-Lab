/* Content for CA Trio. Facts come from content/cs.md and content/en.md. */

export type Lang = "cs" | "en";
export type Bi = { cs: string; en: string };
export type CatId = "advent" | "divadlo" | "recko" | "lazne";

export type Departure = { place: Bi; time: string };

export type Trip = {
  id: string;
  cat: CatId;
  title: Bi;
  date: string;
  dateEnd?: string;
  price: number;
  priceNote?: Bi;
  image: string;
  summary: Bi;
  body: Bi[];
  includes: Bi[];
  excludes: Bi[];
  departures: Departure[];
  returnNote?: Bi;
  seats: number;
  soldOut: boolean;
  published: boolean;
  taken: string[];
};

export type Booking = {
  ref: string;
  tripId: string;
  tripTitle: Bi;
  departure: string;
  seats: string[];
  name: string;
  email: string;
  phone: string;
  people: string[];
  note: string;
  total: number;
  created: string;
};

export type AppState = { trips: Trip[]; bookings: Booking[] };

export const CATS: { id: CatId; name: Bi; blurb: Bi; colour: string }[] = [
  {
    id: "advent",
    name: { cs: "Adventní zájezdy", en: "Advent trips" },
    blurb: {
      cs: "Vídeň, Bratislava, Kittenberg a Veselý Kopec. Prosinec 2026.",
      en: "Vienna, Bratislava, Kittenberg and Veselý Kopec. December 2026.",
    },
    colour: "var(--coral)",
  },
  {
    id: "divadlo",
    name: { cs: "Muzikály, koncerty, divadla", en: "Musicals, concerts, theatre" },
    blurb: {
      cs: "Praha a velké scény, od února do května 2027.",
      en: "Prague stages, February to May 2027.",
    },
    colour: "var(--cobalt)",
  },
  {
    id: "recko",
    name: { cs: "Pobytový Řecko 2027", en: "Greece package stays 2027" },
    blurb: {
      cs: "Kamena Vourla, 26. 8. až 2. 9. 2027. Sedm nocí u moře.",
      en: "Kamena Vourla, 26 August to 2 September 2027. Seven nights by the sea.",
    },
    colour: "var(--green)",
  },
  {
    id: "lazne",
    name: { cs: "Termální lázně", en: "Thermal spas" },
    blurb: {
      cs: "Bük a Sárvár, jeden den a devět hodin v bazénech.",
      en: "Bük and Sárvár, one day and nine hours in the pools.",
    },
    colour: "var(--mustard)",
  },
];

export const AGENCIES: { name: string; where: Bi }[] = [
  {
    name: "EXIM + Fischer",
    where: {
      cs: "Letecké pobyty v Egyptě, Tunisku, Turecku, Bulharsku, Řecku, Španělsku, na Kypru a exotika.",
      en: "Air stays in Egypt, Tunisia, Turkey, Bulgaria, Greece, Spain, Cyprus and long-haul destinations.",
    },
  },
  {
    name: "ATIS",
    where: {
      cs: "Pobyty v Česku a na Slovensku, lázně, hory, chaty, chalupy, tábory pro děti, zimní pobyty.",
      en: "Stays in Czechia and Slovakia, including spas, mountains, cottages, farmhouses and children's camps, plus winter stays.",
    },
  },
  {
    name: "AUTOTURIST",
    where: {
      cs: "Pobyty v Česku, na Slovensku, v Itálii, Rakousku, Maďarsku, Španělsku, Francii, Slovinsku a Řecku, tranzitní ubytování, zimní pobyty.",
      en: "Stays in Czechia, Slovakia, Italy, Austria, Hungary, Spain, France, Slovenia and Greece, transit accommodation, winter stays.",
    },
  },
  {
    name: "BONTON",
    where: {
      cs: "Pobyty v Řecku, Chorvatsku, Bulharsku, Itálii, Španělsku a Maďarsku, poznávací zájezdy do celého světa.",
      en: "Stays in Greece, Croatia, Bulgaria, Italy, Spain and Hungary, plus guided tours worldwide.",
    },
  },
  {
    name: "AZZURRO",
    where: { cs: "Pobyty v Itálii a na italských ostrovech.", en: "Stays in Italy and the Italian islands." },
  },
  {
    name: "LUDOR",
    where: {
      cs: "Itálie, celé pobřeží včetně ostrovů, Čechy, Morava, Slovensko.",
      en: "Italy and its full coastline including the islands, Bohemia, Moravia and Slovakia.",
    },
  },
  {
    name: "KOMPASTOUR",
    where: { cs: "Pobyty v Itálii, Caorle.", en: "Stays in Italy, Caorle." },
  },
  {
    name: "SIAM",
    where: { cs: "Pobyty a poznávací zájezdy, exotika.", en: "Stays and guided tours, long-haul." },
  },
  {
    name: "ESO",
    where: {
      cs: "Exotika, cesty za poznáním, Karibik, Indický oceán, Thajsko, Vietnam, Kambodža.",
      en: "Long-haul discovery trips to the Caribbean, Indian Ocean, Thailand, Vietnam and Cambodia.",
    },
  },
  {
    name: "REDOK",
    where: {
      cs: "Pobyty v Itálii, Chorvatsku, Egyptě, Karibiku, Libyi a Maroku, poznávací zájezdy po Evropě, cykloturistika.",
      en: "Stays in Italy, Croatia, Egypt, the Caribbean, Libya and Morocco, guided tours across Europe, cycling holidays.",
    },
  },
  {
    name: "TRAVEL 2002",
    where: {
      cs: "Pobyty ve Španělsku, na řeckých ostrovech, v Bulharsku, Turecku a Chorvatsku.",
      en: "Stays in Spain, the Greek islands, Bulgaria, Turkey and Croatia.",
    },
  },
  { name: "HUNGARIA", where: { cs: "Pobyty v Maďarsku.", en: "Stays in Hungary." } },
  { name: "KRASIM", where: { cs: "Pobyty v Bulharsku.", en: "Stays in Bulgaria." } },
  {
    name: "ČEDOK",
    where: {
      cs: "Letecké pobytové zájezdy v Bulharsku, Černé Hoře, Chorvatsku, Itálii, na Kypru, Madeiře, Maltě, v Maroku, Řecku, Španělsku, Tunisku a Turecku, poznávací zájezdy po Evropě, Egyptě, Blízkém východě, Latinské Americe a Asii, zimní pobyty.",
      en: "Air package stays in Bulgaria, Montenegro, Croatia, Italy, Cyprus, Madeira, Malta, Morocco, Greece, Spain, Tunisia and Turkey, plus guided tours of Europe, Egypt, the Near East, Latin America and Asia, and winter stays.",
    },
  },
  {
    name: "ALEXANDRIA",
    where: {
      cs: "Bulharsko, Řecko, Tunisko, Itálie, Chorvatsko, Španělsko, Kypr, exotika. Informace v CA Trio.",
      en: "Bulgaria, Greece, Tunisia, Italy, Croatia, Spain, Cyprus and long-haul. Details at CA Trio.",
    },
  },
];

export const ASSET_IMAGES = [
  "10244l.jpg",
  "10292l.jpg",
  "10294l.jpg",
  "10303l.jpg",
  "10307l.jpg",
  "10313l.jpg",
  "10321l.jpg",
  "10322l.jpg",
  "10323l.jpg",
  "8087l.jpg",
  "hero.jpg",
  "hero-2.jpg",
  "hero-3.jpg",
  "hero-4.jpg",
  "hotel-sissy.jpg",
  "vienna-christmas-market.jpg",
  "vienna-christmas-market-portrait.jpg",
];

const dep = (cs: string, en: string, time: string): Departure => ({ place: { cs, en }, time });

const p = (cs: string, en: string): Bi => ({ cs, en });

export const SEED_TRIPS: Trip[] = [
  {
    id: "vanochni-viden",
    cat: "advent",
    title: p("Vánoční Vídeň", "Christmas Vienna"),
    date: "2026-12-19",
    price: 585,
    image: "assets/10244l.jpg",
    summary: p(
      "Trhy před radnicí, osvětlené centrum a punč v porcelánovém hrníčku.",
      "Market stalls outside the City Hall, a lit-up old town and punch in a porcelain cup.",
    ),
    body: [
      p(
        "Nejdřív navštívíme exteriér zámku Schönbrunn, který dýchá adventní atmosférou s nevšedním vánočním trhem. Potom se přesuneme do centra Vídně.",
        "The day starts outside Schönbrunn Palace, which breathes Advent with its own Christmas market. Then we move into the centre of Vienna.",
      ),
      p(
        "Pěší procházka vede vánočně osvětleným centrem: Hofburg, Michalské náměstí, dóm sv. Štěpána. Zbyde čas na galerie, muzea, nákupy i adventní trhy. Nejslavnější z nich stojí na náměstí před vídeňskou radnicí.",
        "A walking route covers the illuminated centre: the Hofburg, Michaelerplatz and St Stephen's Cathedral, with time left for galleries, museums, shopping and the Advent markets. The largest market stands in front of Vienna City Hall.",
      ),
      p(
        "Ochutnejte horký punč a porcelánový hrníček si ponechte na památku. Vyberte si pravý vídeňský preclík z koblihového těsta nebo Sacher dort. Na závěr si poslechněte některý z vánočních koncertů v radnici. Doporučujeme teplé oblečení a obuv.",
        "Try the hot punch and keep the porcelain cup. Pick up a Viennese pretzel made from doughnut dough or a Sacher torte. End the day at one of the Christmas concerts in the City Hall. Warm clothing and shoes recommended.",
      ),
    ],
    includes: [p("Doprava", "Transport"), p("Průvodce", "Guide")],
    excludes: [p("Cestovní pojištění, možno sjednat v CA Trio", "Travel insurance, available at CA Trio")],
    departures: [
      dep("Třebíč, Úřad práce", "Třebíč, Labour Office", "9:30"),
      dep("Jaroměřice nad Rokytnou, zámek", "Jaroměřice nad Rokytnou, chateau", "9:50"),
      dep("Moravské Budějovice, náměstí Míru", "Moravské Budějovice, náměstí Míru", "10:00"),
      dep("Znojmo, čerpací stanice Shell", "Znojmo, Shell petrol station", "10:30"),
    ],
    returnNote: p("Odjezd z Vídně ve 20:00", "Return from Vienna at 20:00"),
    seats: 49,
    soldOut: false,
    published: true,
    taken: ["3", "4", "5", "12", "13", "18", "19", "20", "27", "28", "33", "40", "41", "46", "47"],
  },
  {
    id: "advent-kittenberg",
    cat: "advent",
    title: p("Advent v Kittenberských zahradách", "Advent in the Kittenberg Gardens"),
    date: "2026-11-28",
    price: 560,
    image: "assets/10294l.jpg",
    summary: p(
      "400 000 světel, betlém s ručně vyrobenými figurkami a večer v zahradách.",
      "400,000 lights, a nativity with handmade figures and an evening in the gardens.",
    ),
    body: [
      p(
        "Odjíždíme v brzkých odpoledních hodinách. Podvečer strávíme v Kittenberských zahradách, jako byste vstoupili do pohádky: zákoutí s vánoční výzdobou, sochami, loučemi a ohněm.",
        "An early afternoon departure and an evening in the Kittenberg Gardens. The route passes corners decorated for Christmas, with statues, torches and open fire.",
      ),
      p(
        "Zahrady svítí 400 000 světly, doplňuje je světelná show a vánoční koncerty. K tomu betlém s ručně vyrobenými figurkami, obří plovoucí adventní věnec a barevné vodotrysky.",
        "The gardens carry 400,000 lights, a light show and Christmas concerts, plus a nativity scene with handmade figures, a giant floating Advent wreath and coloured water features.",
      ),
      p(
        "Pro zahřátí si dejte punč nebo svařené víno, v prodejně si kupte vánoční dekorace. Doporučujeme teplé oblečení a obuv. Návrat ve večerních hodinách.",
        "Warm up with punch or mulled wine and buy Christmas decorations in the shop. Warm clothing and shoes recommended. Return in the evening.",
      ),
    ],
    includes: [p("Doprava", "Transport"), p("Průvodce", "Guide")],
    excludes: [
      p("Vstupné 11 EUR dospělí, 6 EUR děti", "Entrance, 11 EUR adult and 6 EUR child"),
      p("Cestovní pojištění, možno sjednat v CA Trio", "Travel insurance, available at CA Trio"),
    ],
    departures: [
      dep("Třebíč, Úřad práce", "Třebíč, Labour Office", "11:30"),
      dep("Jaroměřice nad Rokytnou, zámek", "Jaroměřice nad Rokytnou, chateau", "11:50"),
      dep("Moravské Budějovice, náměstí Míru", "Moravské Budějovice, náměstí Míru", "12:00"),
      dep("Znojmo, čerpací stanice Shell", "Znojmo, Shell petrol station", "12:30"),
    ],
    seats: 49,
    soldOut: false,
    published: true,
    taken: ["1", "2", "8", "9", "14", "15", "21", "29", "30", "36", "37", "38", "44", "45", "48"],
  },
  {
    id: "vanoce-vesely-kopec",
    cat: "advent",
    title: p(
      "Vánoce na Veselém Kopci a osvětlený dům v Chotovicích",
      "Christmas at Veselý Kopec and the illuminated house in Chotovice",
    ),
    date: "2026-12-05",
    price: 780,
    priceNote: p("760 Kč senioři, 710 Kč děti", "760 CZK seniors, 710 CZK children"),
    image: "assets/10303l.jpg",
    summary: p(
      "Skanzen, lidové koledy a večer u domu zapsaného do Guinnessovy knihy rekordů.",
      "An open-air museum, folk carols and an evening at a house in the Guinness Book of Records.",
    ),
    body: [
      p(
        "Dopoledne odjíždíme do skanzenu na Veselém Kopci, kde program ukazuje, jak advent prožívaly dřívější generace. Zazní lidové koledy, uvidíte výrobu vánočních předmětů a můžete koupit dárky.",
        "A morning departure to the open-air museum at Veselý Kopec, where the programme shows how earlier generations spent Advent. It includes folk carols, demonstrations of making Christmas objects and a chance to buy gifts.",
      ),
      p(
        "K večeru se pojedeme podívat do Chotovic. Světýlka pokrývají celý dům i zahradu s altánem, doprovází je české koledy. Výzdoba se zapsala do Guinnessovy knihy rekordů.",
        "In the evening the group visits a house in Chotovice where lights cover the whole building and the garden with its gazebo, accompanied by Czech carols. The decoration earned the house a place in the Guinness Book of Records.",
      ),
    ],
    includes: [
      p("Doprava", "Transport"),
      p("Průvodce", "Guide"),
      p("Vstup do skanzenu", "Entry to the open-air museum"),
    ],
    excludes: [],
    departures: [
      dep("Moravské Budějovice, náměstí Míru", "Moravské Budějovice, náměstí Míru", "9:00"),
      dep("Jaroměřice nad Rokytnou, zámek", "Jaroměřice nad Rokytnou, chateau", "9:10"),
      dep("Třebíč, Úřad práce", "Třebíč, Labour Office", "9:30"),
    ],
    seats: 45,
    soldOut: false,
    published: true,
    taken: ["6", "7", "11", "16", "23", "24", "25", "31", "39", "42", "43"],
  },
  {
    id: "vanochni-bratislava",
    cat: "advent",
    title: p("Vánoční Bratislava, čokoládovna Hauswirth", "Christmas Bratislava and the Hauswirth chocolate factory"),
    date: "2026-12-12",
    price: 695,
    image: "assets/8087l.jpg",
    summary: p(
      "Čokoládovna v Rakousku a adventní trhy v Bratislavě. Platba v čokoládovně jen v hotovosti.",
      "A chocolate factory in Austria and Advent markets in Bratislava. Cash only at the factory.",
    ),
    body: [
      p(
        "Den začíná v Rakousku v čokoládovně Hauswirth, kde uvidíte, jak čokoláda vzniká, a nakoupíte v podnikové prodejně. Platba v čokoládovně je možná jen v hotovosti.",
        "The day begins in Austria at the Hauswirth chocolate factory, with a look at how the chocolates are made and time in the factory shop. Payment at the factory is cash only.",
      ),
      p(
        "Pak pokračujeme do Bratislavy. Společná procházka vede vánočně vyzdobeným starým městem: katedrála sv. Martina, Michalská brána, Grasalkovičův palác, Stará radnice, socha Čumila a Slovenské národní divadlo.",
        "Then on to Bratislava. A guided walk covers the decorated old town: St Martin's Cathedral, Michael's Gate, the Grassalkovich Palace, the Old Town Hall, the Čumil statue and the Slovak National Theatre.",
      ),
      p(
        "Odpoledne je volno na adventní trhy s jídlem, dárky a kulturním programem. Návrat večer.",
        "The afternoon is free for the Advent markets, their food stalls and gifts, with the accompanying cultural programme. Return in the evening.",
      ),
    ],
    includes: [p("Doprava", "Transport"), p("Průvodce", "Guide")],
    excludes: [p("Cestovní pojištění, možno sjednat v CA Trio", "Travel insurance, available at CA Trio")],
    departures: [
      dep("Třebíč, Úřad práce", "Třebíč, Labour Office", "8:00"),
      dep("Jaroměřice nad Rokytnou, zámek", "Jaroměřice nad Rokytnou, chateau", "8:20"),
      dep("Moravské Budějovice, náměstí Míru", "Moravské Budějovice, náměstí Míru", "8:30"),
      dep("Znojmo, čerpací stanice Shell", "Znojmo, Shell petrol station", "9:00"),
    ],
    seats: 49,
    soldOut: true,
    published: true,
    taken: [],
  },
  {
    id: "snehova-kralovna",
    cat: "divadlo",
    title: p("Sněhová královna – muzikál na ledě", "The Snow Queen, a musical on ice"),
    date: "2027-02-20",
    price: 290,
    priceNote: p("Vstupenky dle výběru v CA již od 840 Kč", "Tickets from 840 CZK at CA Trio"),
    image: "assets/10321l.jpg",
    summary: p(
      "Andersenova pohádka na ledě: hudba, tanec a krasobruslení.",
      "Andersen's fairy tale on ice: music, dance and figure skating.",
    ),
    body: [
      p(
        "Pohádka Hanse Christiana Andersena o síle přátelství, lásky a odvahy poprvé na ledě. Představení spojuje hudbu, tanec a krasobruslení s promyšlenou scénou, světelnou show a filmovými projekcemi.",
        "The Hans Christian Andersen fairy tale about friendship, love and courage, staged on ice. The show combines music, dance and figure skating with a stage set, light show and film projections.",
      ),
      p(
        "Scénář Jan a Alena Pixovi, texty písní Kristýna Pixová a Ondřej Suchý, hudba Zdeněk Barták, kostýmy Roman Šolc.",
        "Script by Jan and Alena Pix, lyrics by Kristýna Pixová and Ondřej Suchý, music by Zdeněk Barták, costumes by Roman Šolc.",
      ),
    ],
    includes: [p("Doprava", "Transport")],
    excludes: [p("Vstupenka dle výběru v CA od 840 Kč", "Ticket from 840 CZK at CA Trio")],
    departures: [
      dep("Moravské Budějovice, náměstí Míru", "Moravské Budějovice, náměstí Míru", "12:00"),
      dep("Jaroměřice nad Rokytnou, zámek", "Jaroměřice nad Rokytnou, chateau", "12:10"),
      dep("Třebíč, Úřad práce", "Třebíč, Labour Office", "12:30"),
    ],
    seats: 49,
    soldOut: false,
    published: true,
    taken: ["2", "3", "9", "10", "17", "22", "26", "27", "34", "35", "43", "44"],
  },
  {
    id: "biograf-laska-2",
    cat: "divadlo",
    title: p("Biograf láska II – Nový příběh", "Biograf láska II: A New Story"),
    date: "2027-05-02",
    price: 620,
    priceNote: p("Vstupenka dle výběru v CA již od 849 Kč", "Ticket from 849 CZK at CA Trio"),
    image: "assets/10322l.jpg",
    summary: p(
      "Písničky Hany Zagorové v novém příběhu, Divadlo Kalich Praha.",
      "Hana Zagorová's songs in a new story, Divadlo Kalich Prague.",
    ),
    body: [
      p(
        "První muzikál s písničkami Hany Zagorové Biograf láska se stal divadelní událostí. Stejní tvůrci připravili pokračování: další hity devítinásobné Zlaté slavice v novém příběhu plném emocí, naděje a humoru.",
        "A sequel to the musical built on Hana Zagorová's songs. The same authors wrote a new story with new characters and new turns, full of emotion, hope and humour.",
      ),
      p(
        "Autorka scénáře Uljana Donátová napsala příběh nezávislý na první části, s novými hrdiny a zápletkami. Kdo viděl jedničku, najde odkazy a drobné souvislosti. Hraje Divadlo Kalich Praha.",
        "Screenplay by Uljana Donátová. The story is independent of the first show but keeps references for people who saw the original. Performed at Divadlo Kalich in Prague.",
      ),
    ],
    includes: [p("Doprava", "Transport"), p("Průvodce", "Guide")],
    excludes: [p("Vstupenka dle výběru v CA od 849 Kč", "Ticket from 849 CZK at CA Trio")],
    departures: [
      dep("Moravské Budějovice, náměstí Míru", "Moravské Budějovice, náměstí Míru", "10:00"),
      dep("Jaroměřice nad Rokytnou, zámek", "Jaroměřice nad Rokytnou, chateau", "10:10"),
      dep("Třebíč, Úřad práce", "Třebíč, Labour Office", "10:30"),
      dep("Jihlava, Billa", "Jihlava, Billa", "11:00"),
    ],
    seats: 53,
    soldOut: false,
    published: true,
    taken: ["4", "5", "6", "13", "14", "20", "21", "28", "29", "30", "37", "38", "45", "46", "52"],
  },
  {
    id: "lotrando-a-zubejda",
    cat: "divadlo",
    title: p("Lotrando a Zubejda", "Lotrando and Zubejda"),
    date: "2027-05-02",
    price: 620,
    priceNote: p("Vstupenka dle výběru v CA již od 599 Kč", "Ticket from 599 CZK at CA Trio"),
    image: "assets/10323l.jpg",
    summary: p(
      "Divadelní adaptace pohádky s písničkami, Divadlo Broadway Praha.",
      "A stage adaptation of the fairy tale with its songs, Divadlo Broadway Prague.",
    ),
    body: [
      p(
        "Divadelní adaptace pohádky Lotrando a Zubejda přináší humor, kouzla a písničky, které rozveselí malé i velké diváky. Pod dubem, za dubem, Nám se stalo něco překrásného, Řízni, řízni, řízni a další.",
        "A stage adaptation of the fairy tale filmed by Karel Smyczek in 1996, with its songs and humour. The songs stay with children and adults alike.",
      ),
      p(
        "Filmovou pohádku natočil v roce 1996 Karel Smyczek. Hraje Divadlo Broadway Praha.",
        "The film version was shot in 1996 by Karel Smyczek. Performed at Divadlo Broadway in Prague.",
      ),
    ],
    includes: [p("Doprava", "Transport"), p("Průvodce", "Guide")],
    excludes: [p("Vstupenka dle výběru v CA od 599 Kč", "Ticket from 599 CZK at CA Trio")],
    departures: [
      dep("Moravské Budějovice, náměstí Míru", "Moravské Budějovice, náměstí Míru", "10:00"),
      dep("Jaroměřice nad Rokytnou, zámek", "Jaroměřice nad Rokytnou, chateau", "10:10"),
      dep("Třebíč, Úřad práce", "Třebíč, Labour Office", "10:30"),
      dep("Jihlava, Billa", "Jihlava, Billa", "11:00"),
    ],
    seats: 53,
    soldOut: false,
    published: true,
    taken: ["1", "2", "10", "11", "18", "19", "25", "33", "34", "41", "42", "49", "50"],
  },
  {
    id: "recko-kamena-vourla",
    cat: "recko",
    title: p("Řecko – Kamena Vourla", "Greece: Kamena Vourla"),
    date: "2027-08-26",
    dateEnd: "2027-09-02",
    price: 17490,
    priceNote: p("10 990 Kč třetí osoba v pokoji do 12 let", "10,990 CZK for a third person in the room up to 12 years"),
    image: "assets/10292l.jpg",
    summary: p(
      "Týden u moře v hotelu SISSY***, polopenze a termální prameny na okraji města.",
      "A week by the sea at Hotel SISSY***, half board and thermal springs at the edge of town.",
    ),
    body: [
      p(
        "Kamena Vourla je přímořské letovisko na východním pobřeží středního Řecka u zálivu Maliakos. Město je známé plážemi, termálními prameny a klidným tempem.",
        "Kamena Vourla is a seaside resort on the eastern coast of central Greece, near the Maliakos Gulf, known for its beaches, thermal springs and quiet pace.",
      ),
      p(
        "Bydlí se v plážovém hotelu SISSY*** s velkou subtropickou zahradou. K dispozici je recepce, výtah, restaurace s venkovní terasou, bar, beach bar, disco, animační program s českým animátorem, kulečník, ping pong a placená půjčovna kol a elektrokol. Obchody, restaurace a taverny jsou v pěší vzdálenosti.",
        "The group stays at Hotel SISSY***, a beach hotel with a large subtropical garden, lobby and reception, lift, restaurant with an outdoor terrace, bar, beach bar, disco, animation programme with a Czech animator, billiards, table tennis and paid bike and e-bike rental. Shops, restaurants and tavernas sit within walking distance.",
      ),
      p(
        "Oblázková pláž navazuje přímo na zahradu, lehátka pod stromy jsou zdarma. Venkovní bazén má lehátka a sluneční terasu s výhledem na moře. Pokoje jsou pro 2 až 3 osoby, rodiny mohou vzít premium pokoje se dvěma ložnicemi pro 3 až 4 osoby. Všechny pokoje mají koupelnu s WC, vanu nebo sprchu, fén, ručníky, kosmetiku, satelitní TV, minibar, klimatizaci, trezor zdarma a balkon s výhledem na moře. Wi-Fi je v lobby.",
        "The pebble beach opens straight from the hotel garden, with free sunbeds under trees, and an outdoor pool with free sunbeds and a sea-view sun terrace. Rooms hold 2 to 3 beds, or families can take premium rooms with two bedrooms for 3 to 4 people. All rooms have a bathroom with WC, bath or shower, hair dryer, towels, toiletries, satellite TV, minibar, air conditioning, a free safe and a balcony with sea view. Wi-Fi works in the lobby.",
      ),
      p(
        "Polopenze je formou bufetu, řecká a mezinárodní kuchyně včetně vegetariánských jídel. Beach bar přes den prodává občerstvení, nápoje a zmrzlinu. Na okraji města jsou přírodní jezírka s teplými prameny, vstup zdarma. Pobyt prodáváme ve spolupráci s CK Apollon.",
        "Half board is buffet breakfast and dinner, with Greek and international dishes and vegetarian options. The beach bar sells snacks, drinks and ice cream during the day. Thermal ponds with warm springs sit at the edge of town and are free. Operated with CK Apollon.",
      ),
    ],
    includes: [
      p("Letecká doprava Brno–Volos–Brno včetně poplatků", "Return flights Brno to Volos, all fees included"),
      p("Transfer busem z letiště a zpět", "Bus transfer from the airport to the hotel and back"),
      p("Ubytování", "Accommodation"),
      p("Polopenze", "Half board"),
      p("Služby stálého delegáta", "Resident delegate"),
    ],
    excludes: [
      p(
        "Pokoj premium 2 000 Kč za osobu a pobyt, třetí osoba do 12 let 1 000 Kč za pobyt",
        "Premium room, 2,000 CZK per person per stay; third person up to 12 years, 1,000 CZK per stay",
      ),
      p(
        "Komplexní pojištění UNIQA včetně storna, 464 Kč za osobu a pobyt (doporučujeme)",
        "UNIQA comprehensive travel insurance including cancellation, 464 CZK per person per stay, recommended",
      ),
      p("Pobytová taxa 5 EUR za den a pokoj, platba na místě", "Stay tax, 5 EUR per day per room, paid locally"),
      p("Doprava na letiště v Brně a zpět, 500 Kč za osobu", "Transport to Brno airport and back, 500 CZK per person"),
    ],
    departures: [
      dep("Moravské Budějovice, náměstí Míru", "Moravské Budějovice, náměstí Míru", "2:00"),
      dep("Jaroměřice nad Rokytnou, zámek", "Jaroměřice nad Rokytnou, chateau", "2:10"),
      dep("Třebíč, Úřad práce", "Třebíč, Labour Office", "2:30"),
    ],
    seats: 45,
    soldOut: false,
    published: true,
    taken: ["1", "2", "3", "7", "8", "15", "16", "17", "24", "25", "32", "33", "40", "41"],
  },
  {
    id: "lazne-buk",
    cat: "lazne",
    title: p("Termální lázně Bük", "Bük thermal spa"),
    date: "2026-11-29",
    price: 1170,
    priceNote: p("1 070 Kč děti, 595 Kč do 3 let", "1,070 CZK children, 595 CZK under 3"),
    image: "assets/10307l.jpg",
    summary: p(
      "Den v termálních lázních 240 km odsud, voda 33 až 36 °C.",
      "A day at the thermal spa 240 km away, water at 33 to 36 °C.",
    ),
    body: [
      p(
        "Jednodenní zájezd do termálních lázní v Büku, 240 km daleko. Lázně pomáhají při potížích s pohybovým ústrojím a žaludkem. V roce 2003 přibyly další relaxační bazény, kryté i polokryté.",
        "A day trip to the thermal spa in Bük, 240 km away, known for baths that help with musculoskeletal and gastric complaints. The site added more relaxation pools, indoor and semi-covered, in 2003.",
      ),
      p(
        "Voda má 33 až 36 °C, k tomu bazén s teplejší vodou pro plavání a wellness s vířivkami, divokou řekou, bazénem pro děti a lehátky. V areálu je místnost pro odpočinek, občerstvení a šatny. Koupit si můžete masáž, saunu nebo pedikúru. Koupací plášť a pantofle zpříjemní pobyt. Platba v celém areálu je možná v eurech, forintech i kartou.",
        "Water runs at 33 to 36 degrees Celsius, with a warmer pool for swimming and a wellness area with whirlpools, a wild river, a children's pool and sunbeds. There is a rest room, refreshments and changing rooms, and visitors can buy treatments such as massage, sauna and pedicure. A bathrobe and slippers make the stay more comfortable. The whole area accepts euros, forints and cards.",
      ),
      p(
        "V lázních strávíme přibližně devět hodin. Další termín je 29. 12.",
        "About nine hours at the spa. Another date runs on 29 December.",
      ),
    ],
    includes: [
      p("Doprava", "Transport"),
      p("Průvodce", "Guide"),
      p("Vstupné", "Entrance"),
      p("Sprchy, toalety, fény a lehátka", "Showers, toilets, hair dryers and sunbeds"),
      p("Šatny", "Changing rooms"),
      p("Skříňky za příplatek 40 Kč", "Lockers, 40 CZK surcharge"),
    ],
    excludes: [p("Cestovní pojištění, možno sjednat v CA Trio", "Travel insurance, available at CA Trio")],
    departures: [
      dep("Třebíč, Úřad práce", "Třebíč, Labour Office", "5:00"),
      dep("Jaroměřice nad Rokytnou, zámek", "Jaroměřice nad Rokytnou, chateau", "5:20"),
      dep("Moravské Budějovice, náměstí Míru", "Moravské Budějovice, náměstí Míru", "5:30"),
      dep("Znojmo, čerpací stanice Shell", "Znojmo, Shell petrol station", "6:00"),
    ],
    returnNote: p("Návrat večer", "Return in the evening"),
    seats: 49,
    soldOut: false,
    published: true,
    taken: ["5", "6", "12", "13", "19", "20", "26", "27", "34", "35", "41", "42", "48", "49"],
  },
  {
    id: "lazne-sarvar",
    cat: "lazne",
    title: p("Termální lázně Sárvár", "Sárvár thermal spa"),
    date: "2026-11-29",
    price: 1270,
    priceNote: p("1 100 Kč děti, 595 Kč do 3 let", "1,100 CZK children, 595 CZK under 3"),
    image: "assets/10313l.jpg",
    summary: p(
      "3 600 m² vodní plochy, tobogány pro děti a devět hodin relaxace.",
      "3,600 m² of water, slides for children and nine hours of relaxation.",
    ),
    body: [
      p(
        "Jednodenní zájezd do termálních lázní v Sárváru. Bazény patří k nejmodernějším v Maďarsku: vodní plocha 3 600 m² a teplota vody 30 až 36 °C. Kryté i polokryté bazény mají atrakce pro dospělé i děti.",
        "A day trip to the spa in Sárvár, whose pools are among the most modern in Hungary. The water area covers 3,600 square metres at 30 to 36 degrees Celsius, with indoor and semi-covered pools and attractions for adults and children.",
      ),
      p(
        "Rozlehlý areál pro děti nabízí kryté bazény, tobogány a skluzavky. Voda se využívá při léčbě osteoporózy, revmatizmu a pohybového ústrojí. V areálu je občerstvení, šatny, odpočinkové místnosti, baby místnost a placené procedury. Doporučujeme koupací plášť a pantofle. Platba je možná v eurech, forintech i kartou.",
        "A large children's area has covered pools, slides and chutes. The water is used for osteoporosis, rheumatism and musculoskeletal treatment. The site has refreshments, changing rooms, rest rooms, a baby room and paid treatments. A bathrobe and slippers are recommended. Payment across the area accepts euros, forints and cards.",
      ),
      p(
        "V lázních strávíme přibližně devět hodin. Další termín je 29. 12.",
        "About nine hours at the spa. Another date runs on 29 December.",
      ),
    ],
    includes: [
      p("Doprava", "Transport"),
      p("Průvodce", "Guide"),
      p("Vstupné", "Entrance"),
      p("Šatna, sprchy, toalety, fény a lehátka", "Changing rooms, showers, toilets, hair dryers and sunbeds"),
    ],
    excludes: [p("Cestovní pojištění, možno sjednat v CA Trio", "Travel insurance, available at CA Trio")],
    departures: [
      dep("Třebíč, Úřad práce", "Třebíč, Labour Office", "5:00"),
      dep("Jaroměřice nad Rokytnou, zámek", "Jaroměřice nad Rokytnou, chateau", "5:20"),
      dep("Moravské Budějovice, náměstí Míru", "Moravské Budějovice, náměstí Míru", "5:30"),
      dep("Znojmo, čerpací stanice Shell", "Znojmo, Shell petrol station", "6:00"),
    ],
    returnNote: p("Návrat večer", "Return in the evening"),
    seats: 49,
    soldOut: false,
    published: true,
    taken: ["1", "2", "3", "10", "11", "18", "25", "26", "33", "34", "40", "41", "47", "48"],
  },
];

export const SEED_BOOKINGS: Booking[] = [
  {
    ref: "CT-26-0412",
    tripId: "vanochni-viden",
    tripTitle: p("Vánoční Vídeň", "Christmas Vienna"),
    departure: "Moravské Budějovice, náměstí Míru",
    seats: ["18", "19"],
    name: "Jana Nováková",
    email: "jana.novakova@email.cz",
    phone: "+420 605 118 442",
    people: ["Jana Nováková", "Petr Novák"],
    note: "Prosíme cestovní pojištění pro oba.",
    total: 1170,
    created: "2026-11-02T09:14:00.000Z",
  },
  {
    ref: "CT-26-0417",
    tripId: "lazne-buk",
    tripTitle: p("Termální lázně Bük", "Bük thermal spa"),
    departure: "Třebíč, Úřad práce",
    seats: ["12", "13", "19"],
    name: "Milan Dvořák",
    email: "m.dvorak@email.cz",
    phone: "+420 731 004 219",
    people: ["Milan Dvořák", "Eva Dvořáková", "Tomáš Dvořák"],
    note: "",
    total: 3510,
    created: "2026-11-05T16:40:00.000Z",
  },
  {
    ref: "CT-26-0421",
    tripId: "snehova-kralovna",
    tripTitle: p("Sněhová královna – muzikál na ledě", "The Snow Queen, a musical on ice"),
    departure: "Moravské Budějovice, náměstí Míru",
    seats: ["26", "27"],
    name: "Lucie Kratochvílová",
    email: "lucie.k@email.cz",
    phone: "+420 777 213 908",
    people: ["Lucie Kratochvílová", "Anna Kratochvílová"],
    note: "Vstupenky chceme kategorie A.",
    total: 580,
    created: "2026-11-09T11:02:00.000Z",
  },
  {
    ref: "CT-26-0426",
    tripId: "recko-kamena-vourla",
    tripTitle: p("Řecko – Kamena Vourla", "Greece: Kamena Vourla"),
    departure: "Moravské Budějovice, náměstí Míru",
    seats: ["7", "8"],
    name: "Alena Šimková",
    email: "alena.simkova@email.cz",
    phone: "+420 606 771 530",
    people: ["Alena Šimková", "Jiří Šimek"],
    note: "Máme zájem o premium pokoj.",
    total: 34980,
    created: "2026-11-11T08:25:00.000Z",
  },
];

/* ---------- helpers ---------- */

export const PLACES = {
  street: "Šafaříkova 1304, 676 02 Moravské Budějovice",
  phone: "+420 737 102 348",
  phoneHref: "tel:+420737102348",
  email: "info@ca-trio.cz",
  facebook: "https://www.facebook.com/TRIOcestovniagentura",
  owner: "Ludmila Přikrylová",
  ico: "12152854",
};

export const price = (n: number, lang: Lang) =>
  lang === "cs" ? `${n.toLocaleString("cs-CZ")} Kč` : `${n.toLocaleString("en-GB")} CZK`;

const dateFmt = (lang: Lang) =>
  new Intl.DateTimeFormat(lang === "cs" ? "cs-CZ" : "en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

export const fmtDate = (iso: string, lang: Lang) => dateFmt(lang).format(new Date(`${iso}T12:00:00`));

export const fmtShort = (iso: string, lang: Lang) =>
  new Intl.DateTimeFormat(lang === "cs" ? "cs-CZ" : "en-GB", {
    day: "numeric",
    month: "numeric",
    year: "numeric",
  }).format(new Date(`${iso}T12:00:00`));

export const fmtRange = (trip: Trip, lang: Lang) =>
  trip.dateEnd ? `${fmtDate(trip.date, lang)} – ${fmtDate(trip.dateEnd, lang)}` : fmtDate(trip.date, lang);

export const monthKey = (iso: string) => iso.slice(0, 7);

export const monthLabel = (key: string, lang: Lang) =>
  new Intl.DateTimeFormat(lang === "cs" ? "cs-CZ" : "en-GB", { month: "long", year: "numeric" }).format(
    new Date(`${key}-01T12:00:00`),
  );

export const soldOutNow = (trip: Trip) => trip.soldOut;

export const seatsLeft = (trip: Trip) => Math.max(0, trip.seats - trip.taken.filter((s) => Number(s) <= trip.seats).length);

export const catOf = (id: CatId) => CATS.find((c) => c.id === id)!;

export type SeatRow = { seats: number[]; back?: boolean };

export function busLayout(count: number): SeatRow[] {
  const back = Math.min(5, count);
  let n = 1;
  const rows: SeatRow[] = [];
  const remaining = count - back;
  const full = Math.floor(remaining / 4);
  for (let r = 0; r < full; r++) {
    rows.push({ seats: [n, n + 1, n + 2, n + 3] });
    n += 4;
  }
  const rest = remaining - full * 4;
  if (rest > 0) {
    rows.push({ seats: Array.from({ length: rest }, (_, i) => n + i) });
    n += rest;
  }
  if (back > 0) rows.push({ seats: Array.from({ length: back }, (_, i) => n + i), back: true });
  return rows;
}

export const CZ_COUNT = (n: number) => {
  if (n === 1) return "1 zájezd";
  if (n >= 2 && n <= 4) return `${n} zájezdy`;
  return `${n} zájezdů`;
};

export const EN_COUNT = (n: number) => `${n} trip${n === 1 ? "" : "s"}`;
