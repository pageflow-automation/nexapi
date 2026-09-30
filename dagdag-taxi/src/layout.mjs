import { SITE, TOWNS, SERVICES, DAY, VILLAGES } from "./data.mjs";
import { esc, abs, tel, wa, icon, waIcon, logo, mark, ctas, businessLd, radiusMap } from "./lib.mjs";

export const NAV = [
  ["/", "Home"],
  ["/werkgebied", "Werkgebied"],
  ["/luchthavenvervoer", "Luchthavens"],
  ["/taxi-ziekenhuis", "Ziekenhuis"],
  ["/contact", "Contact"],
];

export function page({ path, title, description, h1Id = "top", body, ld = [], noindex = false, og = "home", bodyClass = "", assets }) {
  const graph = { "@context": "https://schema.org", "@graph": [
    { "@type": "WebSite", "@id": `${SITE.url}/#website`, url: `${SITE.url}/`, name: SITE.name, inLanguage: "nl-NL", publisher: { "@id": `${SITE.url}/#business` } },
    businessLd(),
    { "@type": "WebPage", "@id": `${abs(path)}#webpage`, url: abs(path), name: title, description, inLanguage: "nl-NL", isPartOf: { "@id": `${SITE.url}/#website` }, about: { "@id": `${SITE.url}/#business` }, primaryImageOfPage: `${SITE.url}/og/${og}.png` },
    ...ld,
  ] };
  return `<!doctype html>
<html lang="nl">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>${esc(title)}</title>
<meta name="description" content="${esc(description)}">
${noindex ? '<meta name="robots" content="noindex, follow">' : '<meta name="robots" content="index, follow, max-image-preview:large">'}
<link rel="canonical" href="${abs(path)}">
<meta name="theme-color" content="#141414">
<meta name="format-detection" content="telephone=no">
<meta name="geo.region" content="${SITE.regionCode}">
<meta name="geo.placename" content="${SITE.city}">
<meta name="geo.position" content="${SITE.geo.lat};${SITE.geo.lng}">
<meta name="ICBM" content="${SITE.geo.lat}, ${SITE.geo.lng}">
<meta property="og:type" content="website">
<meta property="og:locale" content="nl_NL">
<meta property="og:site_name" content="${SITE.name}">
<meta property="og:title" content="${esc(title)}">
<meta property="og:description" content="${esc(description)}">
<meta property="og:url" content="${abs(path)}">
<meta property="og:image" content="${SITE.url}/og/${og}.png">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:image:alt" content="${esc(title)}">
<meta name="twitter:card" content="summary_large_image">
<link rel="icon" href="/favicon.ico" sizes="48x48">
<link rel="icon" href="/favicon.svg" type="image/svg+xml">
<link rel="apple-touch-icon" href="/apple-touch-icon.png">
<link rel="manifest" href="/site.webmanifest">
<link rel="preload" href="/fonts/archivo.woff2" as="font" type="font/woff2" crossorigin>
<link rel="preload" href="/fonts/archivo-italic.woff2" as="font" type="font/woff2" crossorigin>
<link rel="preload" href="/img/brand.svg" as="image" type="image/svg+xml">
<script>document.documentElement.classList.add("js")</script>
<style>${assets.cssInline}</style>
<script type="application/ld+json">${JSON.stringify(graph)}</script>
</head>
<body class="${bodyClass}">
<a class="skip" href="#main">Naar de inhoud</a>
${header(path)}
<main id="main">
${body}
</main>
${footer()}
${callBar()}
<script src="${assets.js}" defer></script>
</body>
</html>
`;
}

function header(path) {
  return `<header class="hdr" data-hdr>
  <a class="hdr-logo" href="/" aria-label="DagDag Taxi, naar de homepage">${logo({ label: "DagDag Taxi" })}</a>
  <nav class="hdr-nav" id="menu" aria-label="Hoofdmenu">
    <ul>${NAV.map(([href, label]) => `<li><a href="${href}"${href === path ? ' aria-current="page"' : ""}>${label}</a></li>`).join("")}</ul>
    <div class="hdr-nav-cta">${ctas({ size: "ctas-stack" })}</div>
  </nav>
  <a class="hdr-call" href="${tel}" data-track="call">${icon("phone")}<span class="hdr-call-num">${SITE.phoneDisplay}</span><span class="hdr-call-short">Bel</span></a>
  <button class="hdr-menu" type="button" aria-expanded="false" aria-controls="menu" data-menu>${icon("menu", "i i-open")}${icon("close", "i i-close")}<span>Menu</span></button>
</header>`;
}

function callBar() {
  return `<div class="callbar" data-callbar>
  <a class="callbar-btn callbar-call" href="${tel}" data-track="call">${icon("phone")}<span>Bellen</span></a>
  <a class="callbar-btn callbar-wa" href="${esc(wa())}" target="_blank" rel="noopener" data-track="whatsapp">${waIcon("i i-wa")}<span>WhatsApp</span></a>
</div>`;
}

function footer() {
  return `<footer class="ftr" data-ftr>
  <div class="ftr-logo wrap">${logo({ cls: "logo-light", label: "DagDag Taxi" })}<p class="ftr-bye" aria-hidden="true">Dag dag!</p></div>
  <div class="ftr-cols wrap">
    <div>
      <p class="label">Bellen of appen</p>
      <p><a class="ftr-big" href="${tel}">${SITE.phoneDisplay}</a></p>
      <p><a href="${esc(wa())}" target="_blank" rel="noopener">WhatsApp ons</a></p>
      <p class="ftr-muted">${SITE.hours}</p>
      <p><a class="ftr-review" href="/review" target="_blank" rel="noopener">★ Laat een review achter</a></p>
    </div>
    <div>
      <p class="label">Ritten</p>
      <ul>
        <li><a href="/luchthavenvervoer">Luchthavenvervoer</a></li>
        <li><a href="/taxi-schiphol">Taxi naar Schiphol</a></li>
        <li><a href="/taxi-ziekenhuis">Taxi naar het ziekenhuis</a></li>
        <li><a href="/zakelijk-vervoer">Zakelijk vervoer</a></li>
        <li><a href="/contact">Contact &amp; nummer opslaan</a></li>
      </ul>
    </div>
    <div>
      <p class="label">Werkgebied</p>
      <ul class="ftr-towns">
        <li><a href="/">Taxi Culemborg</a></li>
${TOWNS.filter((t) => !t.village).map((t) => `        <li><a href="/${t.slug}">Taxi ${esc(t.name)}</a></li>`).join("\n")}
      </ul>
    </div>
  </div>
  <p class="ftr-small wrap">© <span data-year>${new Date().getFullYear()}</span> ${SITE.name} · Culemborg${SITE.kvk ? ` · KvK ${SITE.kvk}` : ""} · <a href="/werkgebied">Alle plaatsen</a></p>
</footer>`;
}

// ---------- Sections ----------

export function tag(text, cls = "") {
  return `<span class="tag ${cls}">${esc(text)}</span>`;
}

export function heroHome() {
  return `<section class="hero wrap" id="top">
  <div class="hero-text">
    <h1 class="hero-title">
      ${tag("Taxi Culemborg", "hero-tag")}
      <span class="hero-line"><span>Dag</span></span>
      <span class="hero-line hero-line-2"><span><span class="amp">&amp;</span> <em>nacht.</em></span></span>
    </h1>
    <p class="lede hero-lede reveal">Eén telefoontje en we komen eraan. Naar het station, het ziekenhuis, Schiphol of gewoon naar huis. Vanuit Culemborg, overal naartoe. Ook naar het buitenland.</p>
    <div class="reveal">${ctas({ size: "ctas-lg" })}</div>
    <ul class="ticks reveal">
      <li>${icon("check")}Bellen of WhatsApp</li>
      <li>${icon("check")}Ook vooruit reserveren</li>
      <li>${icon("check")}Heel NL &amp; buitenland</li>
    </ul>
  </div>
  <div class="hero-art" aria-hidden="true">
    <div class="sun" data-sun>
      <svg class="sun-svg" viewBox="0 0 400 400">
        <circle class="sun-disc" cx="200" cy="200" r="190"/>
        <svg x="104" y="104" width="192" height="192" viewBox="957 7 365 365" class="sun-mark" data-logo>
          <use class="logo-arc logo-arc-out" href="/img/brand.svg#p-arc-out"/>
          <use class="logo-arc logo-arc-in" href="/img/brand.svg#p-arc-in"/>
          <use class="logo-hand" href="/img/brand.svg#p-hand"/>
        </svg>
      </svg>
    </div>
    <p class="clock"><span class="clock-time" data-clock>--:--</span><span data-clock-text>in Culemborg. We rijden.</span></p>
  </div>
</section>`;
}

export function heroSub({ tagText, title, lede, waText, aside = "" }) {
  const longest = Math.max(...title.replace(/<[^>]+>/g, "").split(/\s+/).map((w) => w.length));
  return `<section class="hero hero-sub wrap${aside ? "" : " hero-sub-solo"}" id="top">
  <h1 class="hero-title hero-title-sub" style="--len:${Math.max(6, longest)}">
    ${tag(tagText, "hero-tag")}
    <span class="hero-line"><span>${title}</span></span>
  </h1>
  <div class="hero-text">
    <p class="lede hero-lede reveal">${lede}</p>
    <div class="reveal">${ctas({ size: "ctas-lg", waText })}</div>
  </div>
  ${aside ? `<div class="hero-aside reveal">${aside}</div>` : ""}
</section>`;
}

export function ticker() {
  const names = ["Culemborg", ...TOWNS.filter((t) => !t.village).map((t) => t.name), "Utrecht", "Schiphol"];
  const run = names.map((n) => `<span>${esc(n)}</span>${mark("tick-mark")}`).join("");
  return `<div class="ticker" aria-hidden="true"><div class="ticker-track" data-ticker>${run}${run}</div></div>`;
}

export function services({ title = "Waar mogen we je heen brengen?", intro = "" } = {}) {
  return `<section class="svc wrap" aria-labelledby="svc-h">
  <div class="sec-head">
    ${tag("Ritten")}
    <h2 class="h2" id="svc-h">${esc(title)}</h2>
    ${intro ? `<p class="lede">${intro}</p>` : ""}
  </div>
  <ul class="svc-list">
${SERVICES.map((s, i) => `    <li class="reveal" style="--d:${i * 0.06}s"><a class="svc-item" href="${s.href}">
      <span class="svc-icon">${icon(s.icon)}</span>
      <span class="svc-body"><span class="svc-title">${esc(s.title)}</span><span class="svc-text">${esc(s.text)}</span></span>
      <span class="svc-arrow">${icon("arrow")}</span>
    </a></li>`).join("\n")}
  </ul>
</section>`;
}

// "Een dag met DagDag": six example rides from dawn to deep night, as one day-to-night strip.
// Normal page flow (no pinned scrolling), so it reads like any other section on a phone.
const SKY = {
  "05": { bg: "#262431", dark: true, glow: true }, "08": { bg: "#f6e1b8" }, "13": { bg: "#fbf3dc" },
  "17": { bg: "#f4c261" }, "23": { bg: "#1d1c23", dark: true }, "03": { bg: "#111110", dark: true },
};
export function story() {
  const slots = DAY.map((d) => {
    const [h, m] = d.t.split(":").map(Number);
    const hour = h + m / 60;
    const isSun = hour >= 5.5 && hour < 20;
    // height of sun/moon above the horizon: 0 at rise/set, 1 at the top of its arc
    const arc = isSun ? Math.sin(Math.PI * Math.min(1, Math.max(0, (hour - 5.6) / 14.2))) : Math.sin(Math.PI * Math.min(1, Math.max(0, ((hour < 12 ? hour + 24 : hour) - 20) / 10)));
    return { ...d, isSun, arc: Math.max(0.04, arc), sky: SKY[d.t.slice(0, 2)] };
  });
  return `<section class="day wrap" aria-labelledby="day-h">
  <div class="sec-head">
    ${tag("Een dag met DagDag")}
    <h2 class="h2" id="day-h">Om vijf uur ’s ochtends. Of om drie uur ’s nachts.</h2>
    <p class="lede">Zo kan een dag eruitzien. Jouw rit past er ook tussen.</p>
  </div>
  <ol class="day-strip" data-day>
${slots.map((d, i) => `    <li class="day-slot${d.sky.dark ? " is-dark" : ""}${d.sky.glow ? " is-dawn" : ""}" style="--bg:${d.sky.bg};--prev:${(slots[i - 1] || d).sky.bg};--next:${(slots[i + 1] || d).sky.bg};--arc:${d.arc.toFixed(2)};--i:${i}">
      <div class="day-sky" aria-hidden="true"><span class="day-body ${d.isSun ? "is-sun" : "is-moon"}"></span></div>
      <p class="day-time">${d.t}</p>
      <h3>${esc(d.title)}</h3>
      <p class="day-text">${esc(d.text)}</p>
    </li>`).join("\n")}
  </ol>
</section>
`;
}

export function mapSection({ title = "Culemborg en alles eromheen.", highlight, intro } = {}) {
  return `<section class="area wrap" aria-labelledby="area-h">
  <div class="area-text">
    ${tag("Werkgebied")}
    <h2 class="h2" id="area-h">${esc(title)}</h2>
    <p class="lede">${intro || "We rijden overal heen, in heel Nederland en daarbuiten. Onze thuisbasis is Culemborg, dus in Culemborg en de steden en dorpen eromheen zijn we er het snelst."}</p>
    <ul class="town-links">
      <li><a href="/">Culemborg</a></li>
${TOWNS.filter((t) => !t.village).map((t) => `      <li><a href="/${t.slug}" data-town-link="${t.slug}"${highlight === t.slug ? ' aria-current="page"' : ""}>${esc(t.name)}</a></li>`).join("\n")}
    </ul>
    <p class="area-villages">Ook in ${TOWNS.filter((t) => t.village).map((t) => `<a href="/${t.slug}">${esc(t.name)}</a>`).join(", ")}, ${VILLAGES.slice(0, -1).map(esc).join(", ")} en ${esc(VILLAGES[VILLAGES.length - 1])}.</p>
  </div>
  ${radiusMap({ highlight })}
</section>`;
}

export function steps() {
  return `<section class="how wrap" aria-labelledby="how-h">
  <div class="sec-head">
    ${tag("Zo werkt het")}
    <h2 class="h2" id="how-h">Drie stappen. De laatste is zwaaien.</h2>
  </div>
  <div class="route" data-route aria-hidden="true">
    <svg class="route-svg" viewBox="0 0 1000 120" preserveAspectRatio="none"><path class="route-base" d="M20 60 C 180 10, 320 110, 500 60 S 820 10, 980 60"/><path class="route-line" d="M20 60 C 180 10, 320 110, 500 60 S 820 10, 980 60"/></svg>
    <span class="route-car"></span>
  </div>
  <ol class="steps">
    <li class="step reveal"><span class="step-no">1</span><h3>Bel of app</h3><p>Zeg waar je bent, waar je heen wilt en hoe laat. Nu meteen of voor later.</p></li>
    <li class="step reveal" style="--d:.08s"><span class="step-no">2</span><h3>We spreken het af</h3><p>Je hoort hoe laat we er zijn. Vraag gerust wat de rit kost, dan weet je het vooraf.</p></li>
    <li class="step reveal" style="--d:.16s"><span class="step-no">3</span><h3>Dag dag!</h3><p>We rijden voor, jij stapt in. Bij aankomst zwaaien we je gedag.</p></li>
  </ol>
</section>`;
}

export function saveNumber() {
  return `<section class="save wrap" aria-labelledby="save-h">
  <div class="save-card">
    <div class="save-text">
      ${tag("Handig")}
      <h2 class="h2" id="save-h">Zet DagDag in je telefoon.</h2>
      <p class="lede">Dan heb je ons nummer altijd bij de hand. Scan de code met de camera van je telefoon, of tik op de knop.</p>
      <div class="ctas">
        <a class="btn btn-dark" href="/dagdag-taxi.vcf" download>${icon("save")}<span>Nummer opslaan</span></a>
        <a class="btn btn-ghost" href="${esc(wa())}" target="_blank" rel="noopener" data-track="whatsapp">${waIcon("i i-wa")}<span>WhatsApp</span></a>
      </div>
      <p class="save-safe">${icon("check")}<span>Deze QR-code bevat alleen ons telefoonnummer, geen link. Je telefoon laat <strong>DagDag Taxi · ${SITE.phoneDisplay}</strong> zien.</span></p>
    </div>
    <figure class="save-qr">
      <img src="/img/qr-contact.svg" width="260" height="260" alt="QR-code om het nummer van DagDag Taxi, ${SITE.phoneDisplay}, op te slaan als contact" loading="lazy">
      <figcaption>${SITE.phoneDisplay}</figcaption>
    </figure>
  </div>
</section>`;
}

export function ctaBand({ title = "Bel of app. Dag en nacht.", waText } = {}) {
  return `<section class="band" aria-labelledby="band-h">
  <div class="wrap band-inner">
    <h2 class="band-title" id="band-h">${esc(title)}</h2>
    <a class="band-num" href="${tel}" data-track="call">${SITE.phoneDisplay}</a>
    ${ctas({ size: "ctas-lg", waText })}
  </div>
</section>`;
}

export function prose(html, cls = "") {
  return `<section class="prose wrap ${cls}">${html}</section>`;
}

export function nearby(slugs, title = "Ook in de buurt") {
  const list = slugs.map((s) => TOWNS.find((t) => t.slug === s)).filter(Boolean);
  return `<nav class="near wrap" aria-label="${esc(title)}">
  <p class="label">${esc(title)}</p>
  <ul>${list.map((t) => `<li><a href="/${t.slug}">Taxi ${esc(t.name)} ${icon("arrow")}</a></li>`).join("")}<li><a href="/">Taxi Culemborg ${icon("arrow")}</a></li></ul>
</nav>`;
}
