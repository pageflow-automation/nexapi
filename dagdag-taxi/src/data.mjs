// All business facts and page content live here. Change once, rebuild, done.

export const SITE = {
  name: "DagDag Taxi",
  // Canonical base URL. SITE_URL (env) overrides it, e.g. for a staging copy.
  url: (process.env.SITE_URL || "https://dagdagtaxi.nl").replace(/\/$/, ""),
  phoneDisplay: "06 28 69 55 50",
  phoneE164: "+31628695550",
  whatsapp: "31628695550",
  city: "Culemborg",
  region: "Gelderland",
  regionCode: "NL-GE",
  country: "NL",
  geo: { lat: 51.9553, lng: 5.2276 },
  // Shown in copy and structured data. Keep in sync with the "Dag & nacht" promise.
  hours: "Dag en nacht bereikbaar, 7 dagen per week",
  // Dutch law requires the KvK number on a business website. Fill it in and it appears in the footer.
  kvk: "",
  waDefault: "Hallo DagDag Taxi, ik wil graag een taxi.\n\nOphalen: \nNaar: \nWanneer: ",
};

// Places we drive to often. Coordinates are used for the map and travel-time estimates.
export const DEST = {
  "station-culemborg": { name: "Station Culemborg", short: "STATION", lat: 51.9545, lng: 5.2310 },
  "utrecht-cs": { name: "Utrecht Centraal", short: "UTRECHT CS", lat: 52.0894, lng: 5.1100 },
  "umc": { name: "UMC Utrecht", short: "UMC UTRECHT", lat: 52.0870, lng: 5.1790 },
  "antonius": { name: "St. Antonius Ziekenhuis, Nieuwegein", short: "ANTONIUS", lat: 52.0367, lng: 5.0945 },
  "rivierenland": { name: "Ziekenhuis Rivierenland, Tiel", short: "ZH TIEL", lat: 51.8915, lng: 5.4097 },
  "den-bosch": { name: "'s-Hertogenbosch", short: "DEN BOSCH", lat: 51.6906, lng: 5.2934 },
  "schiphol": { name: "Schiphol", short: "SCHIPHOL", lat: 52.3105, lng: 4.7683 },
  "eindhoven-ap": { name: "Eindhoven Airport", short: "EINDHOVEN AP", lat: 51.4500, lng: 5.3745 },
  "rotterdam-ap": { name: "Rotterdam The Hague Airport", short: "ROTTERDAM AP", lat: 51.9569, lng: 4.4372 },
};

// Towns with their own landing page. Copy is written per town; no templated filler.
export const TOWNS = [
  {
    slug: "taxi-beusichem", name: "Beusichem", gemeente: "Buren", lat: 51.9497, lng: 5.2931,
    lede: "Beusichem ligt op een steenworp van Culemborg, aan de Lekdijk. Voor ons is dat om de hoek.",
    body: [
      "Bel of app, en we staan zo bij je voor de deur. Veel ritten vanuit Beusichem gaan naar station Culemborg of Geldermalsen, naar het ziekenhuis in Tiel, of juist verder weg naar Schiphol.",
      "Ook voor de terugweg van een verjaardag, een etentje of de sportclub kun je DagDag bellen. Hoe laat het ook is.",
    ],
    dests: ["station-culemborg", "rivierenland", "utrecht-cs", "schiphol"],
    faq: [["Halen jullie ook op in het buitengebied van Beusichem?", "Ja. Geef het adres door, of beschrijf waar je staat. Aan de dijk, in het dorp of op een boerderij verderop: we vinden je."]],
    near: ["taxi-buren", "taxi-wijk-bij-duurstede", "taxi-geldermalsen"],
  },
  {
    slug: "taxi-buren", name: "Buren", gemeente: "Buren", lat: 51.9107, lng: 5.3340,
    lede: "Het vestingstadje Buren is klein, maar de wegen eromheen zijn lang. Zeker zonder eigen auto.",
    body: [
      "DagDag Taxi rijdt vanuit Culemborg naar Buren en de dorpen van de gemeente: Asch, Erichem, Zoelen, Maurik, Lienden en de rest. Bel of app, en we spreken een tijd af.",
      "Handig als je naar station Tiel of Geldermalsen moet, of naar Ziekenhuis Rivierenland. Of juist de andere kant op: naar Utrecht of Schiphol.",
    ],
    dests: ["rivierenland", "station-culemborg", "utrecht-cs", "schiphol"],
    faq: [["Rijden jullie ook naar de kleinere dorpen rond Buren?", "Ja. Asch, Erichem, Zoelen, Maurik, Lienden, Ingen, Kerk-Avezaath: noem je adres en we komen."]],
    near: ["taxi-beusichem", "taxi-tiel", "taxi-geldermalsen"],
  },
  {
    slug: "taxi-geldermalsen", name: "Geldermalsen", gemeente: "West Betuwe", lat: 51.8815, lng: 5.2885,
    lede: "Geldermalsen is een treinknooppunt. En dus ook de plek waar je net die laatste aansluiting mist.",
    body: [
      "Van station Geldermalsen naar huis in Meteren, Tricht of Buurmalsen? Of andersom, op tijd naar de trein? Bel of app DagDag, dan halen we je op.",
      "We rijden vanuit Geldermalsen ook naar de luchthavens, en naar de ziekenhuizen in Tiel, Nieuwegein en Utrecht.",
    ],
    dests: ["rivierenland", "den-bosch", "utrecht-cs", "schiphol"],
    faq: [["Kunnen jullie me ophalen bij station Geldermalsen?", "Ja. App of bel even met je aankomsttijd, dan staan we bij het station klaar."]],
    near: ["taxi-buren", "taxi-zaltbommel", "taxi-leerdam"],
  },
  {
    slug: "taxi-houten", name: "Houten", gemeente: "Houten", lat: 52.0283, lng: 5.1683,
    lede: "In Houten gaat de fiets voor en rijdt de auto via de rondweg. Wij weten hoe we bij je voordeur komen.",
    body: [
      "Vanuit Houten gaan veel ritten naar Utrecht, naar het St. Antonius in Nieuwegein en naar Schiphol. En natuurlijk naar Culemborg, over de Lek.",
      "Laat je ophalen thuis, bij station Houten of Houten Castellum, of waar je maar bent. Bel of app, en we spreken een tijd af.",
    ],
    dests: ["utrecht-cs", "umc", "antonius", "schiphol"],
    faq: [["Kan ik vanuit Houten een taxi naar Schiphol boeken?", "Ja. Bel of app het liefst een dag van tevoren met je vertrektijd, dan plannen we de ophaaltijd met ruimte voor file."]],
    near: ["taxi-nieuwegein", "taxi-wijk-bij-duurstede", "taxi-vianen"],
  },
  {
    slug: "taxi-vianen", name: "Vianen", gemeente: "Vijfheerenlanden", lat: 51.9920, lng: 5.0920,
    lede: "Vianen ligt aan de Lek, tegenover Nieuwegein, met de A2 en de A27 om de hoek.",
    body: [
      "Vanuit de oude binnenstad rond de Voorstraat of vanuit een van de nieuwere wijken: we halen je op waar je bent. Naar Utrecht, naar het ziekenhuis in Nieuwegein, of naar Schiphol.",
      "Moet je naar Culemborg, Leerdam of een van de dorpen in de Vijfheerenlanden? Ook dat is een korte rit voor ons.",
    ],
    dests: ["antonius", "utrecht-cs", "umc", "schiphol"],
    faq: [["Rijden jullie ook in de rest van de Vijfheerenlanden?", "Ja. Leerdam, Everdingen, Hagestein, Zijderveld, Lexmond: bel of app met je adres."]],
    near: ["taxi-nieuwegein", "taxi-leerdam", "taxi-houten"],
  },
  {
    slug: "taxi-leerdam", name: "Leerdam", gemeente: "Vijfheerenlanden", lat: 51.8930, lng: 5.0920,
    lede: "Leerdam, de glasstad aan de Linge. Een eind van de snelweg, maar niet van ons.",
    body: [
      "Vanuit Leerdam rijden we naar station Geldermalsen of Culemborg, naar de ziekenhuizen in Nieuwegein, Utrecht en Tiel, en naar de luchthavens.",
      "Bezoek je het glasmuseum of een familielid in Leerdam en wil je terug naar huis? Bel of app, dan halen we je op.",
    ],
    dests: ["antonius", "utrecht-cs", "rivierenland", "schiphol"],
    faq: [["Hoe bestel ik vanuit Leerdam een taxi?", "Bel 06 28 69 55 50, of stuur een WhatsApp met waar je bent, waar je heen wilt en hoe laat."]],
    near: ["taxi-vianen", "taxi-geldermalsen", "taxi-zaltbommel"],
  },
  {
    slug: "taxi-nieuwegein", name: "Nieuwegein", gemeente: "Nieuwegein", lat: 52.0290, lng: 5.0810,
    lede: "Moet je naar het St. Antonius Ziekenhuis in Nieuwegein? Wij brengen je tot aan de ingang.",
    body: [
      "En als je klaar bent, halen we je weer op. Spreek vooraf een tijd af, of bel of app als je naar buiten loopt.",
      "Ook voor ritten vanuit Nieuwegein naar Culemborg, Utrecht of Schiphol kun je DagDag bellen. Dag en nacht.",
    ],
    dests: ["antonius", "utrecht-cs", "umc", "schiphol"],
    faq: [["Wachten jullie bij het ziekenhuis?", "Dat spreken we samen af. We kunnen wachten, of je weer ophalen zodra je klaar bent: bel of app dan even."]],
    near: ["taxi-houten", "taxi-vianen"],
  },
  {
    slug: "taxi-tiel", name: "Tiel", gemeente: "Tiel", lat: 51.8860, lng: 5.4290,
    lede: "In Tiel staat Ziekenhuis Rivierenland, voor veel mensen in de Betuwe het dichtstbijzijnde ziekenhuis.",
    body: [
      "We brengen je erheen en halen je weer op. Vanuit Culemborg, Buren, Beusichem of Tiel zelf.",
      "Ook voor station Tiel, een avond uit aan de Waal, of een rit vanuit Tiel naar Schiphol of Eindhoven Airport kun je DagDag bellen.",
    ],
    dests: ["rivierenland", "den-bosch", "eindhoven-ap", "schiphol"],
    faq: [["Brengen jullie mensen naar Ziekenhuis Rivierenland?", "Ja, vanuit Tiel en de hele omgeving. Geef je afspraaktijd door, dan rekenen we terug wanneer we je ophalen."]],
    near: ["taxi-buren", "taxi-geldermalsen", "taxi-zaltbommel"],
  },
  {
    slug: "taxi-zaltbommel", name: "Zaltbommel", gemeente: "Zaltbommel", lat: 51.8100, lng: 5.2490,
    lede: "Zaltbommel ligt net over de Waal, aan de A2. Richting Den Bosch én richting Utrecht.",
    body: [
      "Vanuit Zaltbommel rijden we naar Den Bosch, Utrecht, Culemborg en de luchthavens. Van huis, vanaf het station of vanuit de binnenstad.",
      "Bel of app met je adres en tijd. Weet je het nog niet precies? Bel dan gewoon, dan denken we mee.",
    ],
    dests: ["den-bosch", "utrecht-cs", "eindhoven-ap", "schiphol"],
    faq: [["Rijden jullie vanuit Zaltbommel naar Eindhoven Airport?", "Ja. Bel of app met je vluchttijd, dan spreken we een ophaaltijd af met genoeg marge."]],
    near: ["taxi-geldermalsen", "taxi-tiel", "taxi-leerdam"],
  },
  {
    slug: "taxi-wijk-bij-duurstede", name: "Wijk bij Duurstede", gemeente: "Wijk bij Duurstede", lat: 51.9745, lng: 5.3430,
    lede: "Wijk bij Duurstede heeft geen treinstation. Een taxi is dan vaak de makkelijkste weg naar de trein, de stad of het vliegveld.",
    body: [
      "We rijden vanuit Wijk bij Duurstede naar station Houten of Utrecht, naar de ziekenhuizen in Utrecht en Nieuwegein, en naar Schiphol.",
      "En terug natuurlijk. Laat je ophalen op het station en rij in één keer door naar huis.",
    ],
    dests: ["utrecht-cs", "umc", "antonius", "schiphol"],
    faq: [["Kan ik vanaf station Utrecht Centraal naar Wijk bij Duurstede?", "Ja. Bel of app met je aankomsttijd, dan spreken we af waar we je oppikken."]],
    near: ["taxi-houten", "taxi-beusichem"],
  },
];

// Villages mentioned in the service area (no own page).
export const VILLAGES = [
  "Asch", "Beesd", "Buurmalsen", "Erichem", "Everdingen", "Hagestein", "Ingen", "Kerk-Avezaath",
  "Lexmond", "Lienden", "Maurik", "Meteren", "Ravenswaaij", "Rijswijk (Gld)", "Schalkwijk",
  "Tricht", "Zijderveld", "Zoelen",
];

// "Een dag met DagDag" scroll story. Illustrative, not real bookings.
export const DAY = [
  { t: "05:40", title: "Vroege vlucht", text: "Van Terweijde naar Schiphol, ruim op tijd voor de vlucht van kwart over acht." },
  { t: "08:50", title: "Naar het ziekenhuis", text: "Van de binnenstad naar Ziekenhuis Rivierenland. Om elf uur halen we je weer op." },
  { t: "13:20", title: "Boodschappen", text: "Van de supermarkt naar huis in Lanxmeer. De tassen dragen we tot aan de deur." },
  { t: "17:45", title: "Zakelijk", text: "Twee gasten van station Culemborg naar een afspraak op het bedrijventerrein." },
  { t: "23:55", title: "Na het feest", text: "Van Utrecht terug naar Culemborg. De laatste trein was al weg." },
  { t: "03:10", title: "Na de nachtdienst", text: "Van het St. Antonius in Nieuwegein naar huis in Beusichem." },
];

export const SERVICES = [
  { icon: "train", title: "Station & stad", text: "Van de trein naar je voordeur, van de Markt naar je wijk. Geen rit is te kort.", href: "/werkgebied" },
  { icon: "plane", title: "Luchthavens", text: "Schiphol, Eindhoven, Rotterdam. We plannen de ophaaltijd met ruimte voor file en helpen met de koffers.", href: "/luchthavenvervoer" },
  { icon: "cross", title: "Ziekenhuis & afspraken", text: "Naar Tiel, Nieuwegein of Utrecht. Rustig instappen, en als je wilt halen we je ook weer op.", href: "/taxi-ziekenhuis" },
  { icon: "case", title: "Zakelijk", text: "Voor medewerkers, klanten en gasten. Vaste afspraken, één aanspreekpunt.", href: "/zakelijk-vervoer" },
  { icon: "moon", title: "’s Nachts", text: "Na het feest, na de late dienst, na de laatste trein. Ook dan kun je bellen.", href: "/contact" },
];

export const HOME_FAQ = [
  ["Hoe bestel ik een taxi?", "Bel 06 28 69 55 50 of stuur een WhatsApp naar hetzelfde nummer. Zeg waar je bent, waar je heen wilt en hoe laat. Meer is niet nodig."],
  ["Kan ik ook vooruit reserveren?", "Ja. Voor een vroege vlucht of een vaste afspraak kun je dagen of weken van tevoren een rit vastleggen. Bellen of appen, allebei goed."],
  ["Rijden jullie ook ’s nachts?", "Ja. DagDag rijdt dag en nacht, ook in het weekend. Bel gewoon, hoe laat het ook is."],
  ["Wat kost een rit?", "Dat hangt af van de afstand en het tijdstip. Vraag het gerust als je belt of appt: je hoort vooraf waar je aan toe bent."],
  ["Rijden jullie ook buiten Culemborg?", "Ja. We halen op in Culemborg en de hele omgeving, van Houten tot Tiel en van Vianen tot Zaltbommel. Naar de luchthavens rijden we door het hele land."],
];
