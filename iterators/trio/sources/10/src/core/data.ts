export type Locale = "cs" | "en";
export type Bi = { cs: string; en: string };
export type CategoryId = "advent" | "stage" | "greece" | "spa";

export type Departure = {
  place: Bi;
  time: string;
};

export type Trip = {
  id: string;
  category: CategoryId;
  date: string;
  endDate?: string;
  dateLabel: Bi;
  price: number;
  priceNote?: Bi;
  image: string;
  title: Bi;
  tagline: Bi;
  description: Bi;
  includes: Bi[];
  excludes: Bi[];
  departures: Departure[];
  returnNote?: Bi;
  seatCount: number;
  soldOut: boolean;
  published: boolean;
  operator?: Bi;
  custom?: boolean;
};

export const CATEGORIES: { id: CategoryId; name: Bi; short: Bi }[] = [
  { id: "advent", name: { cs: "Adventní zájezdy", en: "Advent trips" }, short: { cs: "Advent", en: "Advent" } },
  {
    id: "stage",
    name: { cs: "Muzikály, koncerty, divadla", en: "Musicals, concerts, theatre" },
    short: { cs: "Muzikály", en: "Stage" },
  },
  { id: "greece", name: { cs: "Pobytový Řecko 2027", en: "Greece package stays 2027" }, short: { cs: "Řecko", en: "Greece" } },
  { id: "spa", name: { cs: "Termální lázně", en: "Thermal spas" }, short: { cs: "Lázně", en: "Spa" } },
];

export const AGENCY = {
  name: "CA TRIO",
  legal: { cs: "CA TRIO, cestovní agentura", en: "CA TRIO, travel agency" },
  owner: "Ludmila Přikrylová",
  address: "Šafaříkova 1304, 676 02 Moravské Budějovice",
  ico: "12152854",
  phone: "+420 737 102 348",
  phoneHref: "+420737102348",
  email: "info@ca-trio.cz",
  facebook: "https://www.facebook.com/TRIOcestovniagentura",
  hours: { cs: "Úterý a čtvrtek, 10:00 až 16:30", en: "Tuesday and Thursday, 10:00 to 16:30" },
  vouchers: "PLUXEE, EDENRED, BENEFITY",
  insurance: { cs: "AXA, 35 Kč na osobu a den, sjednání v kanceláři", en: "AXA, 35 CZK per person per day, arranged at the office" },
  register: {
    cs: "Podnikatel je evidován v Živnostenském rejstříku vedeném Městským úřadem v Moravských Budějovicích.",
    en: "Registered in the trade register kept by the Municipal Authority in Moravské Budějovice.",
  },
};

const P = (cs: string, en: string): Bi => ({ cs, en });

const dep = (place: string, time: string): Departure => ({
  place: P(place, place),
  time,
});

const TREBIC = P("Třebíč, Úřad práce", "Třebíč, Labour Office");
const JAROMERICE = P("Jaroměřice nad Rokytnou, zámek", "Jaroměřice nad Rokytnou, chateau");
const MB = P("Moravské Budějovice, náměstí Míru", "Moravské Budějovice, Míru Square");
const ZNOJMO = P("Znojmo, čerpací stanice Shell", "Znojmo, Shell petrol station");
const JIHLAVA = P("Jihlava, Billa", "Jihlava, Billa");

const pt = (place: Bi, time: string): Departure => ({ place, time });

export const TRIPS: Trip[] = [
  {
    id: "viden",
    category: "advent",
    date: "2026-12-19",
    dateLabel: P("19. prosince 2026", "19 December 2026"),
    price: 585,
    image: "assets/10244l.jpg",
    title: P("Vánoční Vídeň", "Christmas Vienna"),
    tagline: P("Trhy, osvětlené centrum a punč v porcelánovém hrníčku.", "Markets, an illuminated centre, punch in a porcelain cup."),
    description: P(
      "Tradiční zájezd za vánoční atmosférou Vídně. Program začíná u exteriéru zámku Schönbrunn, který dýchá adventní atmosférou s nevšedním vánočním trhem, poté se skupina přesune do centra Vídně.\n\nPěší procházka vánočně osvětleným centrem vede kolem Hofburgu, Michalského náměstí a dómu Sv. Štěpána. Zůstává čas na galerie, muzea, nákupy a adventní trhy. Nejslavnější trhy se tradičně konají na náměstí před vídeňskou radnicí.\n\nOchutnejte horký punč a porcelánový hrníček si ponechte jako vzpomínku. Ze sladkého stánku si vyberte pravý vídeňský preclík z koblihového těsta nebo Sacher dort. Na závěr si poslechněte některý z vánočních koncertů v budově radnice. Doporučujeme teplé oblečení a obuv.",
      "A traditional day trip for Vienna's Christmas atmosphere. The day starts at the exterior of Schönbrunn Palace, alive with its Christmas market, then moves to the city centre.\n\nA walking route covers the illuminated centre, including the Hofburg, Michaelerplatz and St Stephen's Cathedral, with time left for galleries, museums, shopping and the Advent markets. The largest market stands in front of the Vienna City Hall.\n\nTry hot punch and keep the porcelain cup as a keepsake. Pick up a Viennese pretzel or a Sacher torte from a sweet stall, and end the day at one of the Christmas concerts in the City Hall. Warm clothing and shoes are recommended."
    ),
    includes: [P("Doprava", "Transport"), P("Průvodce", "Guide")],
    excludes: [P("Cestovní pojištění, možno sjednat v CA TRIO", "Travel insurance, available at CA Trio")],
    departures: [pt(TREBIC, "9:30"), pt(JAROMERICE, "9:50"), pt(MB, "10:00"), pt(ZNOJMO, "10:30")],
    returnNote: P("Odjezd z Vídně ve 20:00.", "Return from Vienna at 20:00."),
    seatCount: 49,
    soldOut: false,
    published: true,
  },
  {
    id: "kittenberg",
    category: "advent",
    date: "2026-11-28",
    dateLabel: P("28. listopadu 2026", "28 November 2026"),
    price: 560,
    image: "assets/10294l.jpg",
    title: P("Advent v Kittenberských zahradách", "Advent in the Kittenberg Gardens"),
    tagline: P("400 000 světel, betlém a večer jako z pohádky.", "400,000 lights, a nativity scene, and an evening out of a fairy tale."),
    description: P(
      "Odjezd v brzkých odpoledních hodinách. Podvečer v kouzelném prostředí Kittenberských zahrad je jako vstoupit rovnou do pohádky. Procházka vede zákoutími s vánoční výzdobou, sochami, loučemi a ohněm.\n\nZahrady svítí 400 000 světly, doplňuje je světelná show a vánoční koncerty, betlém s ručně vyrobenými figurkami, obří plovoucí adventní věnec a barevné vodorysky. Pro zahřátí je připravený punč, svařené víno nebo další dobroty, v prodejně pak vánoční dekorace.\n\nDoporučujeme teplé oblečení a obuv. Návrat ve večerních hodinách.",
      "An early afternoon departure and an evening in the magical Kittenberg Gardens, like stepping straight into a fairy tale. The route passes corners decorated for Christmas with statues, torches and open fire.\n\nThe gardens carry 400,000 lights, a light show and Christmas concerts, plus a nativity scene with handmade figures, a giant floating Advent wreath and coloured water features. Warm up with punch, mulled wine or another treat, and buy Christmas decorations in the shop.\n\nWarm clothing and shoes are recommended. Return in the evening."
    ),
    includes: [P("Doprava", "Transport"), P("Průvodce", "Guide")],
    excludes: [
      P("Vstupné 11 EUR dospělý, 6 EUR dítě", "Entrance, 11 EUR adult and 6 EUR child"),
      P("Cestovní pojištění, možno sjednat v CA TRIO", "Travel insurance, available at CA Trio"),
    ],
    departures: [pt(TREBIC, "11:30"), pt(JAROMERICE, "11:50"), pt(MB, "12:00"), pt(ZNOJMO, "12:30")],
    returnNote: P("Návrat ve večerních hodinách.", "Return in the evening."),
    seatCount: 45,
    soldOut: false,
    published: true,
  },
  {
    id: "vesely-kopec",
    category: "advent",
    date: "2026-12-05",
    dateLabel: P("5. prosince 2026", "5 December 2026"),
    price: 780,
    priceNote: P("760 Kč senioři, 710 Kč děti", "760 CZK for seniors, 710 CZK for children"),
    image: "assets/10303l.jpg",
    title: P("Vánoce na Veselém Kopci a osvětlený dům v Chotovicích", "Christmas at Veselý Kopec and the illuminated house in Chotovice"),
    tagline: P("Skanzen, lidové koledy a dům z Guinnessovy knihy rekordů.", "An open-air museum, folk carols and a record-breaking house."),
    description: P(
      "Dopolední odjezd do skanzenu na Veselém Kopci, kde program ukazuje, jak naši předci prožívali adventní období. Zazní lidové koledy, uvidíte předvádění výroby vánočních předmětů a budete mít možnost nakoupit dárky.\n\nK večeru se skupina vydá do Chotovic. Vánoční světýlka zdobí celý dům i přilehlou zahradu s altánem, podívanou doprovází české koledy. Výzdoba se zapsala do Guinessovy knihy rekordů.\n\nTu krásu musíte vidět na vlastní oči.",
      "A morning departure to the open-air museum at Veselý Kopec, where the programme shows how earlier generations spent Advent. It includes folk carols, demonstrations of making Christmas objects and a chance to buy gifts.\n\nIn the evening the group visits a house in Chotovice where lights cover the whole building and the garden with its gazebo, accompanied by Czech carols. The decoration earned the house a place in the Guinness Book of Records.\n\nYou have to see it for yourself."
    ),
    includes: [P("Doprava", "Transport"), P("Průvodce", "Guide"), P("Vstup do skanzenu", "Entry to the open-air museum")],
    excludes: [],
    departures: [pt(MB, "9:00"), pt(JAROMERICE, "9:10"), pt(TREBIC, "9:30")],
    seatCount: 41,
    soldOut: false,
    published: true,
  },
  {
    id: "bratislava",
    category: "advent",
    date: "2026-12-12",
    dateLabel: P("12. prosince 2026", "12 December 2026"),
    price: 695,
    image: "assets/8087l.jpg",
    title: P("Vánoční Bratislava, čokoládovna Hauswirth", "Christmas Bratislava and the Hauswirth chocolate factory"),
    tagline: P("Čokoláda v Rakousku, prohlídka Bratislavy a adventní trhy.", "Chocolate in Austria, a Bratislava walk and the Advent markets."),
    description: P(
      "Nejprve v Rakousku navštívíme čokoládovnu Hauswirth. Po seznámení s výrobou a nákupu v podnikové prodejně odjedeme do Bratislavy.\n\nSpolečná prohlídka vede kouzelně vyzdobeným městem: Katedrála sv. Martina, Michalská brána, Grasalkovičův palác, Stará radnice, bronzová socha Čumila a Slovenské národní divadlo. Poté volno na adventní trhy s lahůdkami a dárky, doprovázené kulturním programem.\n\nPlatba v čokoládovně při nákupu pouze v hotovosti. Navečer odjezd domů.",
      "The day begins in Austria at the Hauswirth chocolate factory, with a look at how the chocolates are made and time in the factory shop, then continues to Bratislava.\n\nA guided walk covers the decorated old town: St Martin's Cathedral, Michael's Gate, the Grassalkovich Palace, the Old Town Hall, the Čumil statue and the Slovak National Theatre. The afternoon is free for the Advent markets, their food stalls and gifts, with the accompanying cultural programme.\n\nPayment at the chocolate factory is cash only. Return in the evening."
    ),
    includes: [P("Doprava", "Transport"), P("Průvodce", "Guide")],
    excludes: [P("Cestovní pojištění, možno sjednat v CA TRIO", "Travel insurance, available at CA Trio")],
    departures: [pt(TREBIC, "8:00"), pt(JAROMERICE, "8:20"), pt(MB, "8:30"), pt(ZNOJMO, "9:00")],
    returnNote: P("Navečer odjezd domů.", "Return in the evening."),
    seatCount: 49,
    soldOut: true,
    published: true,
  },
  {
    id: "snehova-kralovna",
    category: "stage",
    date: "2027-02-20",
    dateLabel: P("20. února 2027", "20 February 2027"),
    price: 290,
    priceNote: P("Vstupenky dle výběru v CA již od 840 Kč", "Tickets from 840 CZK when bought at CA Trio"),
    image: "assets/10321l.jpg",
    title: P("SNĚHOVÁ KRÁLOVNA – muzikál na ledě", "The Snow Queen, a musical on ice"),
    tagline: P("Andersenova pohádka v podání mistrů pohybu na ledě.", "Andersen's fairy tale performed by masters on ice."),
    description: P(
      "Jeden z nejkrásnějších pohádkových příběhů o síle přátelství, lásky a odvahy ožije poprvé na ledě. Muzikál Sněhová královna je inspirovaný pohádkou Hanse Christiana Andersena.\n\nDiváci se mohou těšit na spojení hudby, tance a krasobruslení s výkony mistrů pohybu na ledě, unikátní scénou, světelnou show a filmovými projekcemi. Scénář Jan a Alena Pixovi, texty písní Kristýna Pixová a Ondřej Suchý, hudba Zdeněk Barták, kostýmy Roman Šolc.",
      "The Hans Christian Andersen fairy tale about friendship, love and courage, staged on ice. The show combines music, dance and figure skating with a stage set, light show and film projections.\n\nScript by Jan and Alena Pix, lyrics by Kristýna Pixová and Ondřej Suchý, music by Zdeněk Barták, costumes by Roman Šolc."
    ),
    includes: [P("Doprava", "Transport")],
    excludes: [P("Vstupenka dle výběru v CA, od 840 Kč", "Ticket, from 840 CZK when bought at CA Trio")],
    departures: [pt(MB, "12:00"), pt(JAROMERICE, "12:10"), pt(TREBIC, "12:30")],
    seatCount: 45,
    soldOut: false,
    published: true,
  },
  {
    id: "biograf-laska",
    category: "stage",
    date: "2027-05-02",
    dateLabel: P("2. května 2027", "2 May 2027"),
    price: 620,
    priceNote: P("Vstupenka dle výběru v CA již od 849 Kč", "Ticket from 849 CZK when bought at CA Trio"),
    image: "assets/10322l.jpg",
    title: P("Biograf láska II – Nový příběh", "Biograf láska II: A New Story"),
    tagline: P("Nový muzikál s hity Hany Zagorové, Divadlo Kalich.", "A new musical with Hana Zagorová's hits, Divadlo Kalich."),
    description: P(
      "První muzikál s písničkami Hany Zagorové Biograf láska se setkal s nadšenými ohlasy. Stejní tvůrci nyní připravili Biograf láska 2: Nový příběh.\n\nDalší hity devítinásobné Zlaté slavice ožijí v novém příběhu plném emocí, naděje i humoru. Autorka scénáře Uljana Donátová napsala zcela nový, na předchozím titulu nezávislý příběh s novými hrdiny a zápletkami. Kdo viděl první představení, najde odkazy a drobné souvislosti s jedničkou.\n\nDivadlo Kalich Praha.",
      "A sequel to the musical built on Hana Zagorová's songs. The same authors wrote a new story with new characters and new turns, independent of the first show but with references to it for people who saw the original.\n\nScreenplay by Uljana Donátová. Performed at Divadlo Kalich in Prague."
    ),
    includes: [P("Doprava", "Transport"), P("Průvodce", "Guide")],
    excludes: [P("Vstupenka dle výběru v CA, od 849 Kč", "Ticket, from 849 CZK when bought at CA Trio")],
    departures: [pt(MB, "10:00"), pt(JAROMERICE, "10:10"), pt(TREBIC, "10:30"), pt(JIHLAVA, "11:00")],
    seatCount: 49,
    soldOut: false,
    published: true,
  },
  {
    id: "lotrando",
    category: "stage",
    date: "2027-05-02",
    dateLabel: P("2. května 2027", "2 May 2027"),
    price: 620,
    priceNote: P("Vstupenka dle výběru v CA již od 599 Kč", "Ticket from 599 CZK when bought at CA Trio"),
    image: "assets/10323l.jpg",
    title: P("Lotrando a Zubejda", "Lotrando and Zubejda"),
    tagline: P("Filmová pohádka na prknech Divadla Broadway.", "The film fairy tale on the stage of Divadlo Broadway."),
    description: P(
      "Divadelní adaptace pohádky Lotrando a Zubejda přináší na prkna příběh plný humoru, kouzel a nezapomenutelných písniček, které rozveselí malé i velké diváky.\n\nZazní Pod dubem, za dubem, Nám se stalo něco překrásného, Řízni, řízni, řízni a další. Oblíbenou filmovou pohádku natočil v roce 1996 Karel Smyczek, adaptace hraje divadlo Broadway.",
      "A stage adaptation of the fairy tale filmed by Karel Smyczek in 1996, with its songs and humour, performed at Divadlo Broadway in Prague."
    ),
    includes: [P("Doprava", "Transport"), P("Průvodce", "Guide")],
    excludes: [P("Vstupenka dle výběru v CA, od 599 Kč", "Ticket, from 599 CZK when bought at CA Trio")],
    departures: [pt(MB, "10:00"), pt(JAROMERICE, "10:10"), pt(TREBIC, "10:30"), pt(JIHLAVA, "11:00")],
    seatCount: 49,
    soldOut: false,
    published: true,
  },
  {
    id: "recko",
    category: "greece",
    date: "2027-08-26",
    endDate: "2027-09-02",
    dateLabel: P("26. 8. – 2. 9. 2027", "26 August – 2 September 2027"),
    price: 17490,
    priceNote: P("10 990 Kč třetí osoba v pokoji do 12 let", "10,990 CZK for a third person in the room up to 12 years"),
    image: "assets/10292l.jpg",
    title: P("Řecko – Kamena Vourla", "Greece: Kamena Vourla"),
    tagline: P("Týden u moře v hotelu SISSY*** s polopenzí a letem z Brna.", "A week by the sea at Hotel SISSY*** with half board and flights from Brno."),
    description: P(
      "Kamena Vourla je řecké přímořské letovisko na východním pobřeží středního Řecka, nedaleko zálivu Maliakos. Město je známé plážemi, léčivými termálními prameny a klidným tempem.\n\nSkupina bydlí v plážovém hotelu SISSY*** s prostornou subtropickou zahradou, recepcí, výtahem, restaurací s venkovní terasou, barem, beach barem, diskotékou a animačním programem s českým animátorem. K dispozici je billiard, ping pong a půjčovna kol i elektrokol za poplatek. Obchody, restaurace a taverny jsou v docházkové vzdálenosti.\n\nOblázková pláž navazuje přímo na zahradu, lehátka pod stromy jsou zdarma. Venkovní bazén má lehátka zdarma a sluneční terasu s výhledem na moře. Pokoje pro 2–3 osoby, rodiny mohou využít pokoje premium se dvěma ložnicemi pro 3–4 osoby. Všechny pokoje mají koupelnu s WC, vanou nebo sprchou, fén, ručníky, hygienické potřeby, SAT/TV, miniledničku, klimatizaci, trezor zdarma a balkon s výhledem na moře. Wi-Fi je v lobby.\n\nStravování je polopenze formou bufetu, snídaně a večeře, s řeckou i mezinárodní kuchyní a vegetariánskými jídly. Beach bar během dne nabízí občerstvení, nápoje a zmrzlinu. Na okraji města jsou přírodní jezírka s teplými prameny, vstup zdarma, a místní trhy, kde se levně nakupuje. Zájezd je provozován s CK Apollon.",
      "Kamena Vourla is a seaside resort on the eastern coast of central Greece, near the Maliakos Gulf, known for its beaches, thermal springs and quiet pace.\n\nThe group stays at Hotel SISSY***, a beach hotel with a large subtropical garden, lobby and reception, lift, restaurant with an outdoor terrace, bar, beach bar, disco, animation programme with a Czech animator, billiards, table tennis and paid bike and e-bike rental. Shops, restaurants and tavernas sit within walking distance.\n\nThe pebble beach opens straight from the hotel garden, with free sunbeds under trees, and an outdoor pool with free sunbeds and a sea-view sun terrace. Rooms hold 2 to 3 beds, or families can take premium rooms with two bedrooms for 3 to 4 people. All rooms have a bathroom with WC, bath or shower, hair dryer, towels, toiletries, satellite TV, minibar, air conditioning, a free safe and a balcony with sea view. Wi-Fi works in the lobby.\n\nHalf board is buffet breakfast and dinner, with Greek and international dishes and vegetarian options. The beach bar sells snacks, drinks and ice cream during the day. Thermal ponds with warm springs sit at the edge of town and are free, and the local market is cheap. Operated with CK Apollon."
    ),
    includes: [
      P("Letecká doprava Brno–Volos–Brno včetně všech poplatků", "Return flights Brno to Volos, all fees included"),
      P("Busový transfer z letiště do hotelu a zpět", "Bus transfer from the airport to the hotel and back"),
      P("Ubytování", "Accommodation"),
      P("Polopenze", "Half board"),
      P("Služby stálého delegáta", "Resident delegate"),
    ],
    excludes: [
      P("Pokoj premium 2 000 Kč na osobu a pobyt; třetí osoba do 12 let 1 000 Kč za pobyt", "Premium room, 2,000 CZK per person per stay; third person up to 12 years, 1,000 CZK per stay"),
      P("Komplexní cestovní pojištění UNIQA včetně storna, 464 Kč na osobu a pobyt, doporučujeme", "UNIQA comprehensive travel insurance including cancellation, 464 CZK per person per stay, recommended"),
      P("Pobytová taxa 5 EUR na den a pokoj, platba na místě", "Stay tax, 5 EUR per day per room, paid locally"),
      P("Doprava na letiště do Brna a zpět, 500 Kč na osobu", "Transport to Brno airport and back, 500 CZK per person"),
    ],
    departures: [pt(MB, "2:00"), pt(JAROMERICE, "2:10"), pt(TREBIC, "2:30")],
    operator: P("Provozováno s CK Apollon", "Operated with CK Apollon"),
    seatCount: 49,
    soldOut: false,
    published: true,
  },
  {
    id: "buk",
    category: "spa",
    date: "2026-11-29",
    dateLabel: P("29. listopadu 2026", "29 November 2026"),
    price: 1170,
    priceNote: P("1 070 Kč děti, 595 Kč do 3 let", "1,070 CZK for children, 595 CZK under 3 years"),
    image: "assets/10307l.jpg",
    title: P("Termální lázně Bük", "Bük thermal spa"),
    tagline: P("Celý den v termální vodě 33–36 °C, devět hodin relaxace.", "A full day in 33–36 °C thermal water, nine hours of rest."),
    description: P(
      "Jednodenní zájezd do termálních lázní v Büku, 240 km daleko. Lázně jsou známé blahodárným vlivem na pohybové ústrojí a žaludeční choroby.\n\nV roce 2003 přibyly relaxační bazény kryté i polokryté. Voda má 33–36 °C, k dispozici je teplejší bazén vhodný i k plavání a wellness část s vířivkami, divokou řekou, bazénem pro děti a lehátky. V areálu je místnost pro odpočinek, občerstvení a šatny. Lze zakoupit procedury jako masáž, saunu nebo pedikúru.\n\nPobyt vám zpříjemní koupací plášť a pantofle. Platba v celém areálu je možná v eurech, forintech i kartou. Relaxace v lázních cca 9 hodin. Další termín 29. 12.",
      "A day trip to the thermal spa in Bük, 240 km away, known for baths that help with musculoskeletal and gastric complaints.\n\nThe site added more relaxation pools, indoor and semi-covered, in 2003. Water runs at 33 to 36 degrees Celsius, with a warmer pool for swimming and a wellness area with whirlpools, a wild river, a children's pool and sunbeds. There is a rest room, refreshments and changing rooms, and visitors can buy treatments such as massage, sauna and pedicure.\n\nA bathrobe and slippers make the stay more comfortable. The whole area accepts euros, forints and cards. About nine hours at the spa. Another date runs on 29 December."
    ),
    includes: [
      P("Doprava", "Transport"),
      P("Průvodce", "Guide"),
      P("Vstupné", "Entrance"),
      P("Sprchy, toalety, vysoušeče vlasů, lehátka", "Showers, toilets, hair dryers and sunbeds"),
      P("Šatny", "Changing rooms"),
      P("Skříňka za příplatek 40 Kč", "Lockers, 40 CZK surcharge"),
    ],
    excludes: [P("Cestovní pojištění, možno sjednat v CA TRIO", "Travel insurance, available at CA Trio")],
    departures: [pt(TREBIC, "5:00"), pt(JAROMERICE, "5:20"), pt(MB, "5:30"), pt(ZNOJMO, "6:00")],
    returnNote: P("Návrat ve večerních hodinách.", "Return in the evening."),
    seatCount: 45,
    soldOut: false,
    published: true,
  },
  {
    id: "sarvar",
    category: "spa",
    date: "2026-11-29",
    dateLabel: P("29. listopadu 2026", "29 November 2026"),
    price: 1270,
    priceNote: P("1 100 Kč děti, 595 Kč do 3 let", "1,100 CZK for children, 595 CZK under 3 years"),
    image: "assets/10313l.jpg",
    title: P("Termální lázně Sárvár", "Sárvár thermal spa"),
    tagline: P("3 600 m² vody, tobogány a léčivé prameny.", "3,600 m² of water, slides and healing springs."),
    description: P(
      "Jednodenní zájezd do termálních lázní v Sárváru, jejichž bazény patří k nejmodernějším v Maďarsku.\n\nVodní plocha má 3 600 m² a teplotu 30–36 °C, bazény jsou kryté i polokryté s atrakcemi pro dospělé i děti. Rozlehlý dětský areál nabízí kryté bazény, tobogány a skluzavky. Voda se využívá při léčbě osteoporózy, revmatismu a pohybového ústrojí.\n\nV areálu je občerstvení, šatny, odpočinkové místnosti, baby místnost a možnost zakoupení procedur. Doporučujeme koupací plášť a pantofle. Platba je možná v eurech, forintech i kartou. Relaxace v lázních cca 9 hodin.",
      "A day trip to the spa in Sárvár, whose pools are among the most modern in Hungary.\n\nThe water area covers 3,600 square metres at 30 to 36 degrees Celsius, with indoor and semi-covered pools and attractions for adults and children. A large children's area has covered pools, slides and chutes. The water is used for osteoporosis, rheumatism and musculoskeletal treatment.\n\nThe site has refreshments, changing rooms, rest rooms, a baby room and paid treatments. A bathrobe and slippers are recommended. Payment across the area accepts euros, forints and cards. About nine hours at the spa."
    ),
    includes: [
      P("Doprava", "Transport"),
      P("Průvodce", "Guide"),
      P("Vstupné", "Entrance"),
      P("Šatny, sprchy, toalety, vysoušeče vlasů, lehátka", "Changing rooms, showers, toilets, hair dryers and sunbeds"),
    ],
    excludes: [P("Cestovní pojištění, možno sjednat v CA TRIO", "Travel insurance, available at CA Trio")],
    departures: [pt(TREBIC, "5:00"), pt(JAROMERICE, "5:20"), pt(MB, "5:30"), pt(ZNOJMO, "6:00")],
    returnNote: P("Návrat ve večerních hodinách.", "Return in the evening."),
    seatCount: 45,
    soldOut: false,
    published: true,
  },
];

export const PARTNERS: { name: string; offer: Bi }[] = [
  { name: "EXIM + Fischer", offer: P("Letecké pobyty v Egyptě, Tunisku, Turecku, Bulharsku, Řecku, Španělsku, na Kypru a exotika.", "Air stays in Egypt, Tunisia, Turkey, Bulgaria, Greece, Spain, Cyprus and long-haul destinations.") },
  { name: "ATIS", offer: P("Pobyty v Česku a na Slovensku, lázně, hory, chaty, chalupy, tábory, zimní pobyty.", "Stays in Czechia and Slovakia, including spas, mountains, cottages, farmhouses, children's camps and winter stays.") },
  { name: "AUTOTURIST", offer: P("Česko, Slovensko, Itálie, Rakousko, Maďarsko, Španělsko, Francie, Slovinsko, Řecko, tranzitní ubytování.", "Czechia, Slovakia, Italy, Austria, Hungary, Spain, France, Slovenia and Greece, plus transit accommodation and winter stays.") },
  { name: "BONTON", offer: P("Řecko, Chorvatsko, Bulharsko, Itálie, Španělsko, Maďarsko a poznávací zájezdy do celého světa.", "Greece, Croatia, Bulgaria, Italy, Spain and Hungary, plus guided tours worldwide.") },
  { name: "AZZURRO", offer: P("Pobyty v Itálii a na italských ostrovech.", "Stays in Italy and the Italian islands.") },
  { name: "LUDOR", offer: P("Itálie a celé pobřeží včetně ostrovů, Čechy, Morava, Slovensko.", "Italy and its full coastline including the islands, Bohemia, Moravia and Slovakia.") },
  { name: "KOMPASTOUR", offer: P("Pobyty v Itálii, Caorle.", "Stays in Italy, Caorle.") },
  { name: "SIAM", offer: P("Pobyty a poznávací zájezdy, exotika.", "Stays and guided tours, long-haul.") },
  { name: "ESO", offer: P("Karibik, Indický oceán, Thajsko, Vietnam, Kambodža.", "Long-haul discovery trips to the Caribbean, Indian Ocean, Thailand, Vietnam and Cambodia.") },
  { name: "REDOK", offer: P("Itálie, Chorvatsko, Egypt, Karibik, Libye, Maroko, poznávací zájezdy po Evropě, cykloturistika.", "Italy, Croatia, Egypt, the Caribbean, Libya and Morocco, guided tours across Europe, cycling holidays.") },
  { name: "TRAVEL 2002", offer: P("Španělsko, řecké ostrovy, Bulharsko, Turecko, Chorvatsko.", "Spain, the Greek islands, Bulgaria, Turkey and Croatia.") },
  { name: "HUNGARIA", offer: P("Pobyty v Maďarsku.", "Stays in Hungary.") },
  { name: "KRASIM", offer: P("Pobyty v Bulharsku.", "Stays in Bulgaria.") },
  { name: "ČEDOK", offer: P("Letecké pobyty v Bulharsku, Černé Hoře, Chorvatsku, Itálii, na Kypru, Madeiře, Maltě, v Maroku, Řecku, Španělsku, Tunisku a Turecku, poznávací zájezdy po celém světě.", "Air package stays in Bulgaria, Montenegro, Croatia, Italy, Cyprus, Madeira, Malta, Morocco, Greece, Spain, Tunisia and Turkey, plus guided tours worldwide.") },
  { name: "ALEXANDRIA", offer: P("Bulharsko, Řecko, Tunisko, Itálie, Chorvatsko, Španělsko, Kypr, exotika. Informace v CA TRIO.", "Bulgaria, Greece, Tunisia, Italy, Croatia, Spain, Cyprus and long-haul. Details at CA Trio.") },
];

export const CANCELLATION = [
  { days: { cs: "více než 30 dnů před odjezdem", en: "more than 30 days before departure" }, pct: 15 },
  { days: { cs: "více než 14 dnů před odjezdem", en: "more than 14 days before departure" }, pct: 30 },
  { days: { cs: "více než 3 dny před odjezdem", en: "more than 3 days before departure" }, pct: 60 },
  { days: { cs: "později než 3 dny před odjezdem", en: "later than 3 days before departure" }, pct: 100 },
];

export const HERO_OPTIONS = [
  "assets/hero.jpg",
  "assets/hero-2.jpg",
  "assets/hero-3.jpg",
  "assets/hero-4.jpg",
  "assets/hotel-sissy.jpg",
  "assets/vienna-christmas-market.jpg",
  "assets/vienna-christmas-market-portrait.jpg",
];

export const ASSET_OPTIONS = [
  "assets/10244l.jpg",
  "assets/10292l.jpg",
  "assets/10294l.jpg",
  "assets/10303l.jpg",
  "assets/10307l.jpg",
  "assets/10313l.jpg",
  "assets/10321l.jpg",
  "assets/10322l.jpg",
  "assets/10323l.jpg",
  "assets/8087l.jpg",
  "assets/hotel-sissy.jpg",
  "assets/vienna-christmas-market.jpg",
];
