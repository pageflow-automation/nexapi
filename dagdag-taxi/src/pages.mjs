import { SITE, DEST, TOWNS, VILLAGES, HOME_FAQ } from "./data.mjs";
import { esc, tel, wa, icon, waIcon, logo, mark, ctas, board, destRows, faq, minutes, km, HOME, serviceLd, crumbsLd, faqLd } from "./lib.mjs";
import { heroHome, heroSub, ticker, services, story, mapSection, steps, saveNumber, ctaBand, prose, nearby, tag } from "./layout.mjs";

const PHONE = SITE.phoneDisplay;
const townRow = (t, from = HOME) => ({ name: `Taxi ${t.name}`, short: t.name.toUpperCase().replace("WIJK BIJ DUURSTEDE", "WIJK B DUURST"), min: minutes(from, t), href: `/${t.slug}` });
const DEST_LINK = { SCHIPHOL: "/taxi-schiphol", "EINDHOVEN AP": "/luchthavenvervoer", "ROTTERDAM AP": "/luchthavenvervoer", "ZH TIEL": "/taxi-ziekenhuis", ANTONIUS: "/taxi-ziekenhuis", "UMC UTRECHT": "/taxi-ziekenhuis" };
const GENERIC_FAQ = [HOME_FAQ[0], HOME_FAQ[1], HOME_FAQ[3]];

function boardSection({ title, lede, rows, from, id = "board-h" }) {
  return `<section class="departures" aria-labelledby="${id}">
  <div class="wrap departures-inner">
    <div class="sec-head sec-head-dark">
      ${tag("Vertrekbord")}
      <h2 class="h2" id="${id}">${esc(title)}</h2>
      ${lede ? `<p class="lede">${lede}</p>` : ""}
    </div>
    ${board(rows, { from })}
  </div>
</section>`;
}

// ---------------- Home ----------------
function home() {
  const rows = [
    { ...DEST["station-culemborg"], min: minutes(HOME, DEST["station-culemborg"]) },
    townRow(TOWNS.find((t) => t.name === "Geldermalsen")),
    townRow(TOWNS.find((t) => t.name === "Tiel")),
    { ...DEST["antonius"], min: minutes(HOME, DEST["antonius"]), href: "/taxi-ziekenhuis" },
    { ...DEST["utrecht-cs"], min: minutes(HOME, DEST["utrecht-cs"]), href: "/werkgebied" },
    { ...DEST["schiphol"], min: minutes(HOME, DEST["schiphol"]), href: "/taxi-schiphol" },
    { ...DEST["eindhoven-ap"], min: minutes(HOME, DEST["eindhoven-ap"]), href: "/luchthavenvervoer" },
  ];
  return {
    path: "/", og: "home",
    title: `Taxi Culemborg – DagDag Taxi | Dag & nacht | ${PHONE}`,
    description: `Taxi nodig in Culemborg? DagDag Taxi rijdt dag en nacht naar station, ziekenhuis, Schiphol en de hele regio. Bel of app ${PHONE}.`,
    bodyClass: "is-home",
    ld: [faqLd(HOME_FAQ), serviceLd({ name: "Taxi Culemborg", area: ["Culemborg", ...TOWNS.map((t) => t.name)], path: "/", description: "Taxiritten in Culemborg en omgeving, dag en nacht." })],
    body: [
      heroHome(),
      ticker(),
      services(),
      prose(`<div class="prose-cols">
  <h2 class="h2">De taxi van Culemborg.</h2>
  <div>
    <p>DagDag Taxi is een taxibedrijf uit Culemborg. We rijden door de hele stad: van de binnenstad en de Binnenpoort tot Lanxmeer, Terweijde en Parijsch, en van het station tot het bedrijventerrein. Een korte rit naar huis met de boodschappen is net zo welkom als een lange rit naar Schiphol.</p>
    <p>Onze naam zegt het al. <strong>Dag</strong>, als je instapt. <strong>Dag</strong>, als je er bent. En dag en nacht bereikbaar op één nummer: <a href="${tel}">${PHONE}</a>.</p>
  </div>
</div>`, "prose-intro"),
      boardSection({ title: "Hoe lang ben je onderweg?", lede: "Vanaf Culemborg, zonder file. Tik op een bestemming voor meer informatie.", rows, from: "Culemborg" }),
      story(),
      mapSection(),
      steps(),
      saveNumber(),
      faq(HOME_FAQ),
      ctaBand(),
    ].join("\n"),
  };
}

// ---------------- Town pages ----------------
function town(t) {
  const min = minutes(HOME, t);
  const rows = [
    { name: "Culemborg", short: "CULEMBORG", min, href: "/" },
    ...destRows(t, t.dests).map((d) => ({ ...d, href: DEST_LINK[d.short] })),
  ];
  const waText = `Hallo DagDag Taxi, ik wil graag een taxi.\n\nOphalen in ${t.name}: \nNaar: \nWanneer: `;
  const destNames = t.dests.slice(0, 2).map((id) => DEST[id].name.split(",")[0]);
  const faqs = [...t.faq, ...GENERIC_FAQ];
  return {
    path: `/${t.slug}`, og: t.slug,
    title: `Taxi ${t.name} – DagDag Taxi | Bel ${PHONE}`,
    description: `Taxi ${t.name} nodig? DagDag Taxi haalt je op in ${t.name} en brengt je naar ${destNames[0]} of Schiphol. Dag en nacht: ${PHONE}.`,
    ld: [
      serviceLd({ name: `Taxi ${t.name}`, area: t.name, path: `/${t.slug}`, description: t.lede }),
      crumbsLd([["Home", "/"], ["Werkgebied", "/werkgebied"], [`Taxi ${t.name}`, `/${t.slug}`]]),
      faqLd(faqs),
    ],
    body: [
      heroSub({
        tagText: `${min} min vanaf Culemborg`,
        title: `Taxi <em>${esc(t.name)}</em>`,
        lede: esc(t.lede),
        waText,
        aside: board(rows, { from: t.name }),
      }),
      prose(`<div class="prose-cols">
  <h2 class="h2">Een taxi in ${esc(t.name)}, zo geregeld.</h2>
  <div>
${t.body.map((p) => `    <p>${esc(p)}</p>`).join("\n")}
    <h3>Zo bestel je</h3>
    <ol class="howto">
      <li>Bel <a href="${tel}">${PHONE}</a> of stuur een <a href="${esc(wa(waText))}" target="_blank" rel="noopener">WhatsApp</a>.</li>
      <li>Zeg waar we je ophalen in ${esc(t.name)}, waar je heen wilt en hoe laat.</li>
      <li>Je hoort meteen hoe laat we er zijn.</li>
    </ol>
  </div>
</div>`),
      services({ title: `Vanuit ${t.name} naar…` }),
      mapSection({ title: `${t.name} ligt ${min <= 15 ? "om de hoek" : "vlakbij"}.`, highlight: t.slug, intro: `${esc(t.name)} (gemeente ${esc(t.gemeente)}) ligt ongeveer ${Math.round(km(HOME, t))} kilometer van Culemborg, zo’n ${min} minuten rijden. We halen je op aan huis, bij het station of waar je maar bent.` }),
      faq(faqs, { title: `Vragen over een taxi in ${t.name}` }),
      nearby(t.near),
      saveNumber(),
      ctaBand({ title: `Taxi nodig in ${t.name}?`, waText }),
    ].join("\n"),
  };
}

// ---------------- Werkgebied ----------------
function werkgebied() {
  const rows = [...TOWNS].sort((a, b) => minutes(HOME, a) - minutes(HOME, b)).map((t) => townRow(t));
  return {
    path: "/werkgebied", og: "werkgebied",
    title: "Werkgebied – taxi in Culemborg en omgeving | DagDag Taxi",
    description: `DagDag Taxi rijdt in Culemborg, Geldermalsen, Houten, Vianen, Tiel, Buren, Leerdam, Zaltbommel en meer. Bekijk alle plaatsen. Bel ${PHONE}.`,
    ld: [crumbsLd([["Home", "/"], ["Werkgebied", "/werkgebied"]])],
    body: [
      heroSub({ tagText: "Werkgebied", title: "Waar we <em>rijden.</em>", lede: "Vanuit Culemborg rijden we de hele regio door: Betuwe, Vijfheerenlanden en het zuiden van Utrecht. Naar de luchthavens rijden we door het hele land." }),
      mapSection({ title: "Alle plaatsen op een rij." }),
      boardSection({ title: "Van Culemborg naar…", lede: "Ongeveer zo lang ben je onderweg, zonder file.", rows, from: "Culemborg" }),
      prose(`<div class="prose-cols">
  <h2 class="h2">En de dorpen ertussen.</h2>
  <div>
    <p>Woon je in een dorp dat hier niet staat? Grote kans dat we er gewoon komen. We rijden onder meer in ${VILLAGES.map(esc).join(", ")}.</p>
    <p>Twijfel je? Bel <a href="${tel}">${PHONE}</a> of stuur een WhatsApp, dan hoor je het meteen.</p>
  </div>
</div>`),
      ctaBand(),
    ].join("\n"),
  };
}

// ---------------- Luchthavens ----------------
function airports() {
  const rows = destRows(HOME, ["schiphol", "eindhoven-ap", "rotterdam-ap"]).map((d) => ({ ...d, href: d.short === "SCHIPHOL" ? "/taxi-schiphol" : undefined }));
  const waText = "Hallo DagDag Taxi, ik wil graag een taxi naar het vliegveld.\n\nOphalen: \nLuchthaven: \nDatum en vertrektijd vlucht: \nPersonen en koffers: ";
  const faqs = [
    ["Hoe ver van tevoren moet ik een luchthavenrit boeken?", "Het liefst een paar dagen van tevoren, zeker voor een vroege vlucht. Maar bel ook gerust als het morgen al is: vaak kan het nog."],
    ["Halen jullie me ook op na mijn vakantie?", "Ja. Geef je vluchtnummer door, dan stemmen we het ophalen af op je landing."],
    ["Rijden jullie ook naar Düsseldorf of Brussel?", "Vraag het ons. Bel of app met je bestemming en tijd, dan hoor je of het past."],
  ];
  return {
    path: "/luchthavenvervoer", og: "luchthavenvervoer",
    title: "Luchthavenvervoer vanuit Culemborg | DagDag Taxi",
    description: `Taxi van Culemborg naar Schiphol, Eindhoven Airport of Rotterdam The Hague Airport. Op tijd, zonder parkeergedoe. Bel of app ${PHONE}.`,
    ld: [serviceLd({ name: "Luchthavenvervoer vanuit Culemborg", area: ["Culemborg", ...TOWNS.map((t) => t.name)], path: "/luchthavenvervoer", description: "Taxi naar Schiphol, Eindhoven Airport en Rotterdam The Hague Airport." }), crumbsLd([["Home", "/"], ["Luchthavenvervoer", "/luchthavenvervoer"]]), faqLd(faqs)],
    body: [
      heroSub({ tagText: "Schiphol · Eindhoven · Rotterdam", title: "Naar het <em>vliegveld.</em>", lede: "Zonder parkeergedoe, zonder sjouwen op het station. We halen je thuis op en zetten je af bij de vertrekhal.", waText, aside: board(rows, { from: "Culemborg" }) }),
      prose(`<div class="prose-cols">
  <h2 class="h2">Zo plannen we je rit.</h2>
  <div>
    <ol class="howto">
      <li><strong>Geef je vlucht door.</strong> Vertrektijd, luchthaven en met hoeveel personen en koffers je reist.</li>
      <li><strong>We rekenen terug.</strong> We spreken een ophaaltijd af met ruimte voor file en inchecken.</li>
      <li><strong>Terug van vakantie?</strong> Geef je vluchtnummer door, dan stemmen we het ophalen af op je landing.</li>
    </ol>
    <h3>Schiphol</h3>
    <p>Van Culemborg naar Schiphol ben je zonder file ongeveer ${minutes(HOME, DEST.schiphol)} minuten onderweg. <a href="/taxi-schiphol">Meer over een taxi naar Schiphol</a>.</p>
    <h3>Eindhoven Airport</h3>
    <p>Via de A2 ben je in ongeveer ${minutes(HOME, DEST["eindhoven-ap"])} minuten bij Eindhoven Airport. Handig voor vakantievluchten naar het zuiden.</p>
    <h3>Rotterdam The Hague Airport</h3>
    <p>Klein en overzichtelijk. Ongeveer ${minutes(HOME, DEST["rotterdam-ap"])} minuten rijden vanaf Culemborg.</p>
  </div>
</div>`),
      faq(faqs, { title: "Vragen over luchthaven\u00advervoer" }), // soft hyphen: breaks as luchthaven-vervoer on phones
      ctaBand({ title: "Vlucht geboekt? Taxi ook.", waText }),
    ].join("\n"),
  };
}

function schiphol() {
  const m = minutes(HOME, DEST.schiphol);
  const waText = "Hallo DagDag Taxi, ik wil graag een taxi naar Schiphol.\n\nOphalen: \nDatum: \nVertrektijd vlucht: \nPersonen en koffers: ";
  const faqs = [
    ["Hoe lang is de rit van Culemborg naar Schiphol?", `Zonder file ongeveer ${m} minuten. In de ochtendspits kan het langer duren; daar houden we rekening mee bij de ophaaltijd.`],
    ["Hoe laat halen jullie me op?", "Dat rekenen we samen terug vanaf je vertrektijd, met ruimte voor file, inchecken en de beveiliging. Check ook altijd het advies van je luchtvaartmaatschappij."],
    ["Kunnen jullie me ophalen op Schiphol?", "Ja. Geef je vluchtnummer door, dan stemmen we het ophalen af op je landing. We spreken samen af waar we je treffen."],
  ];
  return {
    path: "/taxi-schiphol", og: "taxi-schiphol",
    title: `Taxi Culemborg Schiphol – DagDag Taxi | ${PHONE}`,
    description: `Taxi van Culemborg naar Schiphol (en terug). Ongeveer ${m} minuten, thuis opgehaald, afgezet bij de vertrekhal. Dag en nacht. Bel of app ${PHONE}.`,
    ld: [serviceLd({ name: "Taxi Culemborg – Schiphol", area: ["Culemborg", ...TOWNS.map((t) => t.name)], path: "/taxi-schiphol", description: "Taxirit van Culemborg en omgeving naar Schiphol en terug." }), crumbsLd([["Home", "/"], ["Luchthavenvervoer", "/luchthavenvervoer"], ["Taxi naar Schiphol", "/taxi-schiphol"]]), faqLd(faqs)],
    body: [
      heroSub({ tagText: `Culemborg → Schiphol · ±${m} min`, title: "Taxi naar <em>Schiphol.</em>", lede: "Voor de vroege vlucht, de zakenreis of de vakantie met het hele gezin. We halen je thuis op en zetten je af bij de vertrekhal.", waText,
        aside: board([{ name: "Schiphol", short: "SCHIPHOL", min: m }, ...TOWNS.filter((t) => ["taxi-geldermalsen", "taxi-houten", "taxi-tiel"].includes(t.slug)).map((t) => ({ name: `${t.name} naar Schiphol`, short: t.name.toUpperCase(), min: minutes(t, DEST.schiphol) }))], { from: "Culemborg e.o.", caption: "Naar Schiphol" }) }),
      prose(`<div class="prose-cols">
  <h2 class="h2">Op tijd bij de vertrekhal.</h2>
  <div>
    <p>Een vroege vlucht begint met een vroege wekker. Dan wil je niet ook nog een parkeerplek zoeken of met koffers de trein in. Wij staan op de afgesproken tijd voor de deur, laden de koffers in en rijden je naar Schiphol.</p>
    <p>We rekenen de ophaaltijd samen terug vanaf je vertrektijd, met ruimte voor file en inchecken. Voor vluchten in de vroege ochtend rijden we ook ’s nachts.</p>
    <h3>En weer naar huis</h3>
    <p>Na de landing wil je vooral naar huis. Geef je vluchtnummer door, dan stemmen we het ophalen af op je landing.</p>
    <p>Ook vanuit <a href="/taxi-geldermalsen">Geldermalsen</a>, <a href="/taxi-houten">Houten</a>, <a href="/taxi-tiel">Tiel</a> en de rest van de regio. Liever naar een ander vliegveld? Kijk bij <a href="/luchthavenvervoer">luchthavenvervoer</a>.</p>
  </div>
</div>`),
      faq(faqs, { title: "Vragen over een taxi naar Schiphol" }),
      ctaBand({ title: "Vlucht geboekt? Taxi ook.", waText }),
    ].join("\n"),
  };
}

function hospital() {
  const rows = destRows(HOME, ["rivierenland", "antonius", "umc"]);
  const waText = "Hallo DagDag Taxi, ik wil graag een taxi naar het ziekenhuis.\n\nOphalen: \nZiekenhuis: \nDatum en tijd afspraak: \nTerugrit nodig: ja/nee";
  const faqs = [
    ["Wachten jullie tijdens mijn afspraak?", "Dat spreken we samen af. We kunnen wachten, of je weer ophalen zodra je klaar bent. Bel of app dan even."],
    ["Kan ik hulp krijgen bij het in- en uitstappen?", "Ja. Zeg het als je belt, dan nemen we er de tijd voor."],
    ["Wordt mijn rit vergoed door de zorgverzekeraar?", "Dat verschilt per verzekering en situatie. Voor vergoed ziekenvervoer werken verzekeraars vaak met vaste vervoerders. Vraag het na bij je zorgverzekeraar voordat je boekt."],
  ];
  return {
    path: "/taxi-ziekenhuis", og: "taxi-ziekenhuis",
    title: "Taxi naar het ziekenhuis vanuit Culemborg | DagDag Taxi",
    description: `Taxi vanuit Culemborg naar Ziekenhuis Rivierenland, St. Antonius of UMC Utrecht. Rustig instappen, op tijd voor je afspraak. Bel ${PHONE}.`,
    ld: [serviceLd({ name: "Taxi naar het ziekenhuis", area: ["Culemborg", ...TOWNS.map((t) => t.name)], path: "/taxi-ziekenhuis", description: "Taxiritten naar ziekenhuizen in Tiel, Nieuwegein en Utrecht." }), crumbsLd([["Home", "/"], ["Taxi naar het ziekenhuis", "/taxi-ziekenhuis"]]), faqLd(faqs)],
    body: [
      heroSub({ tagText: "Afspraken & ziekenhuis", title: "Naar het <em>ziekenhuis.</em>", lede: "Op tijd voor je afspraak, zonder te zoeken naar een parkeerplek. Rustig instappen, en als je wilt halen we je ook weer op.", waText, aside: board(rows, { from: "Culemborg" }) }),
      prose(`<div class="prose-cols">
  <h2 class="h2">Rustig heen, rustig terug.</h2>
  <div>
    <p>Een ziekenhuisbezoek is vaak al spannend genoeg. Wij zorgen dat de reis geen extra zorg is. Geef je afspraaktijd door, dan rekenen we terug wanneer we je ophalen.</p>
    <h3>De ziekenhuizen in de regio</h3>
    <ul class="plain">
      <li><strong>Ziekenhuis Rivierenland, Tiel.</strong> Ongeveer ${minutes(HOME, DEST.rivierenland)} minuten vanaf Culemborg.</li>
      <li><strong>St. Antonius Ziekenhuis, Nieuwegein.</strong> Ongeveer ${minutes(HOME, DEST.antonius)} minuten.</li>
      <li><strong>UMC Utrecht.</strong> Ongeveer ${minutes(HOME, DEST.umc)} minuten.</li>
    </ul>
    <p>Moet je naar een ander ziekenhuis of een kliniek? Bel of app, dan rijden we je erheen.</p>
    <h3>Over vergoeding</h3>
    <p>Heb je misschien recht op vergoeding van je vervoer? Vraag het na bij je zorgverzekeraar voordat je boekt. Zij werken vaak met vaste vervoerders.</p>
  </div>
</div>`),
      faq(faqs, { title: "Vragen over een rit naar het ziekenhuis" }),
      ctaBand({ title: "Afspraak gepland? Bel of app.", waText }),
    ].join("\n"),
  };
}

function business() {
  const waText = "Hallo DagDag Taxi, ik wil graag zakelijk vervoer bespreken.\n\nBedrijf: \nWat voor ritten: \nContactpersoon: ";
  const faqs = [
    ["Kunnen we vaste ritten afspreken?", "Ja. Bijvoorbeeld een vaste ophaaltijd bij het station voor gasten, of wekelijkse ritten voor medewerkers. Bel ons om het door te spreken."],
    ["Kunnen jullie gasten ophalen bij het station of op Schiphol?", "Ja. Geef de naam en aankomsttijd door, dan halen we je gast op en brengen hem of haar naar je bedrijf."],
  ];
  return {
    path: "/zakelijk-vervoer", og: "zakelijk-vervoer",
    title: "Zakelijk taxivervoer in Culemborg e.o. | DagDag Taxi",
    description: `Zakelijke taxi in Culemborg en omgeving: gasten van het station, medewerkers naar Schiphol, vaste ritten. Eén aanspreekpunt. Bel ${PHONE}.`,
    ld: [serviceLd({ name: "Zakelijk taxivervoer", area: ["Culemborg", ...TOWNS.map((t) => t.name)], path: "/zakelijk-vervoer", description: "Zakelijk vervoer voor bedrijven in Culemborg en omgeving." }), crumbsLd([["Home", "/"], ["Zakelijk vervoer", "/zakelijk-vervoer"]]), faqLd(faqs)],
    body: [
      heroSub({ tagText: "Voor bedrijven", title: "Zakelijk <em>vervoer.</em>", lede: "Gasten van het station, een klant naar Schiphol, medewerkers na een late dienst naar huis. Eén nummer, en wij regelen de rit.", waText }),
      prose(`<div class="prose-cols">
  <h2 class="h2">Eén nummer voor al je ritten.</h2>
  <div>
    <p>Voor bedrijven in Culemborg en omgeving is DagDag een vaste taxi om op terug te vallen. Voor een losse rit, of met vaste afspraken.</p>
    <ul class="plain">
      <li><strong>Gasten ophalen.</strong> Van station Culemborg, Utrecht Centraal of Schiphol naar jullie bedrijf.</li>
      <li><strong>Medewerkers.</strong> Na een late dienst naar huis, of vroeg naar het vliegveld voor een zakenreis.</li>
      <li><strong>Vaste ritten.</strong> Een vaste tijd, een vaste route, één aanspreekpunt.</li>
    </ul>
    <p>Bel <a href="${tel}">${PHONE}</a> om de mogelijkheden te bespreken.</p>
  </div>
</div>`),
      faq(faqs, { title: "Vragen over zakelijk vervoer" }),
      ctaBand({ title: "Samen afspraken maken?", waText }),
    ].join("\n"),
  };
}

function contact() {
  return {
    path: "/contact", og: "contact",
    title: `Contact DagDag Taxi Culemborg – bel of app ${PHONE}`,
    description: `DagDag Taxi bereik je dag en nacht op ${PHONE}, bellen of WhatsApp. Sla ons nummer op met één tik of scan de QR-code.`,
    ld: [crumbsLd([["Home", "/"], ["Contact", "/contact"]])],
    body: [
      heroSub({ tagText: "Contact", title: "Bel of <em>app.</em>", lede: `Eén nummer voor alles: <a class="u" href="${tel}">${PHONE}</a>. Bellen is het snelst. WhatsApp werkt ook, dag en nacht.` }),
      prose(`<div class="contact-grid">
  <div class="contact-card">
    <p class="label">Telefoon</p>
    <a class="contact-big" href="${tel}">${PHONE}</a>
    <p>Bel voor een rit nu, of om vooruit te reserveren.</p>
  </div>
  <div class="contact-card">
    <p class="label">WhatsApp</p>
    <a class="contact-big" href="${esc(wa())}" target="_blank" rel="noopener">${waIcon("i i-wa")} Stuur een bericht</a>
    <p>Zeg waar je bent, waar je heen wilt en hoe laat.</p>
  </div>
  <div class="contact-card">
    <p class="label">Bereikbaar</p>
    <p class="contact-mid">Dag en nacht</p>
    <p>Ook in het weekend en op feestdagen.</p>
  </div>
  <div class="contact-card">
    <p class="label">Werkgebied</p>
    <p class="contact-mid">Culemborg e.o.</p>
    <p><a href="/werkgebied">Bekijk alle plaatsen</a></p>
  </div>
</div>`),
      saveNumber(),
      faq([HOME_FAQ[0], HOME_FAQ[1], HOME_FAQ[4]]),
    ].join("\n"),
  };
}

// ---------------- Brand guide (not indexed) ----------------
function brand() {
  const sw = (name, hex, use, dark) => `<div class="sw${dark ? " sw-dark" : ""}" style="--c:${hex}"><span class="sw-chip"></span><p><strong>${name}</strong><br><code>${hex}</code><br>${use}</p></div>`;
  return {
    path: "/merk", og: "home", noindex: true,
    title: "Huisstijl – DagDag Taxi",
    description: "Merkidentiteit en ontwerprichtlijnen van DagDag Taxi: logo, kleuren, typografie, beeldelementen, beweging en toon.",
    bodyClass: "is-brand",
    body: `
<section class="hero hero-sub hero-sub-solo wrap" id="top">
  <h1 class="hero-title hero-title-sub" style="--len:6">${tag("Huisstijl · v1", "hero-tag")}<span class="hero-line"><span>De <em>zwaai.</em></span></span></h1>
  <div class="hero-text">
    <p class="lede hero-lede">DagDag is de zwaai die je een taxi geeft, en de zwaai als je bent aangekomen. Hallo en tot ziens. Dag en nacht. Dat idee draagt alles: het logo, de kleuren, de beweging en de woorden.</p>
  </div>
</section>

<section class="bg wrap">
  <h2 class="h2">1. Logo</h2>
  <div class="bg-grid bg-grid-3">
    <div class="bg-tile">${logo()}</div>
    <div class="bg-tile bg-tile-dark">${logo({ cls: "logo-light" })}</div>
    <div class="bg-tile bg-tile-yellow">${logo({ cls: "logo-mono" })}</div>
  </div>
  <div class="bg-rules">
    <p><strong>Vrije ruimte:</strong> minimaal de hoogte van de letters T A X I rondom het logo.</p>
    <p><strong>Minimaal formaat:</strong> 110 px breed op scherm, 30 mm in print. Kleiner? Gebruik alleen de zwaai.</p>
    <p><strong>Niet doen:</strong> uitrekken, andere kleuren, schaduwen, het logo op een foto zonder rustige ondergrond.</p>
  </div>
  <h3>De zwaai (beeldmerk)</h3>
  <div class="bg-grid bg-grid-4">
    <div class="bg-tile">${mark()}</div>
    <div class="bg-tile bg-tile-dark">${mark()}</div>
    <div class="bg-tile bg-tile-yellow">${mark("mark-ink")}</div>
    <div class="bg-tile"><img src="/favicon.svg" width="96" height="96" alt="App-icoon"></div>
  </div>
  <p class="bg-small">De zwaai is het icoon “waving_hand” uit Material Symbols van Google (Apache 2.0-licentie, vrij te gebruiken, ook commercieel).</p>
</section>

<section class="bg wrap">
  <h2 class="h2">2. Kleur</h2>
  <p class="lede">Drie kleuren, in deze verhouding: veel papier, stevig inkt, geel als signaal. Geel is voor de dingen waar je op moet tikken of letten.</p>
  <div class="bg-grid bg-grid-4">
    ${sw("Papier", "#F3EFE6", "± 60% · achtergrond")}
    ${sw("Inkt", "#141414", "± 30% · tekst, vlakken", true)}
    ${sw("Taxigeel", "#FDBC18", "± 10% · knoppen, accenten")}
    ${sw("Nacht", "#111110", "Nachtsecties, footer", true)}
  </div>
  <p class="bg-small">WhatsApp-groen gebruiken we alleen in het WhatsApp-icoon, nooit als merkkleur.</p>
</section>

<section class="bg wrap">
  <h2 class="h2">3. Letters</h2>
  <div class="type-spec">
    <p class="type-display">Dag &amp; <em>nacht.</em></p>
    <p><strong>Archivo Expanded, Black / Black Italic.</strong> Koppen en grote woorden. Breed en schuin, net als het logo.</p>
    <p class="type-text">Eén telefoontje en we komen eraan. Naar het station, het ziekenhuis of gewoon naar huis.</p>
    <p><strong>Archivo, Regular / Semibold.</strong> Lopende tekst. Minimaal 18 px op het web, zodat iedereen het kan lezen.</p>
    <p class="type-mono">05:40 · SCHIPHOL · 0:50</p>
    <p><strong>JetBrains Mono.</strong> Tijden, afstanden en labels. De taal van het vertrekbord.</p>
  </div>
</section>

<section class="bg wrap">
  <h2 class="h2">4. Beeldelementen</h2>
  <div class="bg-grid bg-grid-3 motifs">
    <div class="motif"><div class="motif-art">${mark()}</div><h3>De zwaai</h3><p>Het hart van het merk. Zwaait bij binnenkomst en bij afscheid.</p></div>
    <div class="motif"><div class="motif-art"><svg viewBox="0 0 120 120" class="motif-arcs"><circle cx="30" cy="90" r="22"/><circle cx="30" cy="90" r="46"/><circle cx="30" cy="90" r="70"/></svg></div><h3>Zwaaibogen</h3><p>De bogen uit het logo, uitvergroot tot bereik: hoe ver we rijden.</p></div>
    <div class="motif"><div class="motif-art">${tag("Taxi Culemborg")}</div><h3>Het daklicht</h3><p>Labels hebben de vorm van een taxidaklicht. Altijd kort, altijd in mono.</p></div>
    <div class="motif"><div class="motif-art"><svg viewBox="0 0 200 60" class="motif-route"><path d="M10 40 C 50 5, 90 60, 130 30 S 180 20, 190 30"/><circle cx="130" cy="30" r="7"/></svg></div><h3>De route</h3><p>Een lijn met een gele stip: van jou naar je bestemming.</p></div>
    <div class="motif"><div class="motif-art"><span class="type-mono motif-clock">23:55</span></div><h3>De klok</h3><p>Tijd maakt het concreet. We noemen tijden, geen beloftes.</p></div>
    <div class="motif"><div class="motif-art"><span class="flap">D</span><span class="flap">A</span><span class="flap">G</span></div><h3>Het vertrekbord</h3><p>Reistijden tonen we als een klapbord. Duidelijk en een beetje nostalgisch.</p></div>
  </div>
</section>

<section class="bg wrap">
  <h2 class="h2">5. Beweging</h2>
  <ul class="plain bg-list">
    <li><strong>Beweging heeft een reden.</strong> Zwaaien, aankomen, tijd die verstrijkt. Nooit bewegen om het bewegen.</li>
    <li><strong>Zacht en snel.</strong> Uitloop-curve <code>cubic-bezier(.16,1,.3,1)</code>, 400–1200 ms. Niets stuitert behalve de zwaai.</li>
    <li><strong>Scrollen stuurt het verhaal.</strong> Van dag naar nacht, bogen die uitdijen, een route die zich tekent.</li>
    <li><strong>Iedereen kan meedoen.</strong> Met ‘beweging verminderen’ aan staat alles stil en blijft alles leesbaar.</li>
  </ul>
</section>

<section class="bg wrap">
  <h2 class="h2">6. Beeld</h2>
  <p class="lede">Geen stockfoto’s en geen AI-beelden. Liever grafisch en eerlijk. Als er foto’s komen, dan zijn het echte foto’s:</p>
  <ul class="plain bg-list">
    <li>De echte auto en de echte chauffeur, op echte plekken in Culemborg: de Binnenpoort, het station, de Lekdijk.</li>
    <li>Avondlicht, straatlantaarns, natte klinkers. Documentair, niet geposeerd.</li>
    <li>Rustige achtergrond, veel ruimte voor tekst. Nooit een logo op een drukke foto.</li>
  </ul>
</section>

<section class="bg wrap">
  <h2 class="h2">7. Toon</h2>
  <div class="bg-grid bg-grid-2">
    <div class="tone tone-do"><p class="label">Zo wel</p><p>“Bel of app, en we staan zo voor je deur.”</p><p>“Vraag gerust vooraf wat de rit kost.”</p><p>“Om vijf uur ’s ochtends. Of om drie uur ’s nachts.”</p></div>
    <div class="tone tone-dont"><p class="label">Zo niet</p><p>“Wij bieden hoogwaardige, klantgerichte mobiliteitsoplossingen.”</p><p>“Ervaar de toekomst van vervoer.”</p><p>“Neem vrijblijvend contact met ons op voor meer informatie.”</p></div>
  </div>
  <ul class="plain bg-list">
    <li>We zeggen <strong>je</strong>. Warm en direct, nooit amicaal.</li>
    <li>Korte zinnen. Concrete plekken en tijden. Eén boodschap per zin.</li>
    <li>Het telefoonnummer staat altijd binnen handbereik, voluit geschreven.</li>
  </ul>
</section>

<section class="bg wrap">
  <h2 class="h2">8. Downloads</h2>
  <ul class="dl">
    <li><a href="/img/logo.svg" download>${icon("download")} Logo (SVG, licht)</a></li>
    <li><a href="/img/logo-light.svg" download>${icon("download")} Logo (SVG, donker)</a></li>
    <li><a href="/img/mark.svg" download>${icon("download")} Beeldmerk (SVG)</a></li>
    <li><a href="/img/qr-contact.svg" download>${icon("download")} QR-code contact (SVG)</a></li>
    <li><a href="/print/visitekaartje.pdf" download>${icon("download")} Visitekaartje (PDF, 85×55 mm)</a></li>
    <li><a href="/print/sticker.pdf" download>${icon("download")} Sticker (PDF, 90×90 mm)</a></li>
    <li><a href="/print/flyer-a6.pdf" download>${icon("download")} Flyer (PDF, A6)</a></li>
  </ul>
</section>`,
  };
}

function notFound() {
  return {
    path: "/404", og: "home", noindex: true,
    title: "Pagina niet gevonden – DagDag Taxi",
    description: "Deze pagina bestaat niet (meer). Bel of app DagDag Taxi, of ga terug naar de homepage.",
    body: [
      heroSub({ tagText: "404", title: "Deze rit <em>bestaat niet.</em>", lede: `Deze pagina hebben we niet kunnen vinden. <a class="u" href="/">Terug naar de homepage</a>, of bel ons meteen.` }),
    ].join("\n"),
  };
}

export const PAGES = [home(), ...TOWNS.map(town), werkgebied(), airports(), schiphol(), hospital(), business(), contact(), brand(), notFound()];
