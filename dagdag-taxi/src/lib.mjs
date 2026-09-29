import { SITE, DEST, TOWNS } from "./data.mjs";

export const esc = (s) => String(s)
  .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

export const abs = (path) => SITE.url + (path === "/" ? "/" : path);
export const tel = `tel:${SITE.phoneE164}`;
export const wa = (text = SITE.waDefault) => `https://wa.me/${SITE.whatsapp}?text=${encodeURIComponent(text)}`;

// ---------- Geography ----------
const KM_LAT = 111.2;
const KM_LNG = 111.2 * Math.cos((SITE.geo.lat * Math.PI) / 180); // ≈ 68.6 at Culemborg
export function km(a, b) {
  const dx = (b.lng - a.lng) * KM_LNG, dy = (b.lat - a.lat) * KM_LAT;
  return Math.hypot(dx, dy);
}
// Conservative door-to-door estimate without traffic. Rounded to 5 minutes.
export function minutes(a, b) {
  const road = km(a, b) * 1.3;
  const speed = road < 12 ? 38 : road < 35 ? 55 : 80;
  const m = (road / speed) * 60 + 3;
  return Math.max(5, Math.round(m / 5) * 5);
}
export const fmtMin = (m) => `${Math.floor(m / 60)}:${String(m % 60).padStart(2, "0")}`;
export const HOME = { lat: SITE.geo.lat, lng: SITE.geo.lng, name: "Culemborg" };

// ---------- Icons (24px grid, 2px stroke) ----------
const I = {
  phone: '<path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2"/>',
  train: '<rect x="5" y="3" width="14" height="13" rx="3"/><path d="M5 10h14M9 20l-2 2M15 20l2 2M8 16l-1 4h10l-1-4"/><circle cx="9" cy="13" r=".6" fill="currentColor"/><circle cx="15" cy="13" r=".6" fill="currentColor"/>',
  plane: '<path d="M16 10h4a2 2 0 0 1 0 4h-4l-4 7H9l2-7H7l-2 2H2l2-4-2-4h3l2 2h4L9 3h3z"/>',
  cross: '<path d="M9 3h6v6h6v6h-6v6H9v-6H3V9h6z"/>',
  case: '<rect x="3" y="7" width="18" height="13" rx="2"/><path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M3 13h18"/>',
  moon: '<path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9"/>',
  arrow: '<path d="M5 12h14M13 6l6 6-6 6"/>',
  check: '<path d="M5 12l5 5L20 7"/>',
  save: '<circle cx="9" cy="8" r="4"/><path d="M3 21v-1a6 6 0 0 1 12 0v1M19 8v6M16 11h6"/>',
  pin: '<path d="M12 21s-7-6.2-7-11a7 7 0 0 1 14 0c0 4.8-7 11-7 11z"/><circle cx="12" cy="10" r="2.5"/>',
  clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
  menu: '<path d="M4 7h16M4 12h16M4 17h16"/>',
  close: '<path d="M6 6l12 12M18 6L6 18"/>',
  download: '<path d="M12 4v11M7 10l5 5 5-5M5 20h14"/>',
};
export const icon = (name, cls = "i") =>
  `<svg class="${cls}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${I[name]}</svg>`;
export const waIcon = (cls = "i") =>
  `<svg class="${cls}" viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/></svg>`;

// ---------- Logo (layered, so the hand can wave) ----------
const SPRITE = "/img/brand.svg";
export const LOGO_VB = "6 7 1316 421";
export const MARK_VB = "957 7 365 365"; // hand icon: Material Symbols "waving_hand" (Apache 2.0)
export function logo({ cls = "", label = "DagDag Taxi" } = {}) {
  return `<svg class="logo ${cls}" viewBox="${LOGO_VB}" role="img" aria-label="${esc(label)}" data-logo>
<use class="logo-arc logo-arc-out" href="${SPRITE}#p-arc-out"/><use class="logo-arc logo-arc-in" href="${SPRITE}#p-arc-in"/>
<use class="logo-hand" href="${SPRITE}#p-hand"/>
<use class="logo-word" href="${SPRITE}#p-word"/><use class="logo-taxi" href="${SPRITE}#p-taxi"/></svg>`;
}
export function mark(cls = "") {
  return `<svg class="mark ${cls}" viewBox="${MARK_VB}" aria-hidden="true" data-logo>
<use class="logo-arc logo-arc-out" href="${SPRITE}#p-arc-out"/><use class="logo-arc logo-arc-in" href="${SPRITE}#p-arc-in"/>
<use class="logo-hand" href="${SPRITE}#p-hand"/></svg>`;
}

// ---------- CTA buttons ----------
export function ctas({ size = "", waText, light = false } = {}) {
  return `<div class="ctas ${size}">
  <a class="btn btn-call" href="${tel}" data-track="call">${icon("phone")}<span>Bel <strong>${SITE.phoneDisplay}</strong></span></a>
  <a class="btn ${light ? "btn-wa-light" : "btn-wa"}" href="${esc(wa(waText))}" target="_blank" rel="noopener" data-track="whatsapp">${waIcon("i i-wa")}<span>WhatsApp</span></a>
</div>`;
}

// ---------- Departure board ----------
export function board(rows, { caption = "Indicatieve reistijden", from = "Culemborg" } = {}) {
  const nameLen = Math.max(...rows.map((r) => r.short.length));
  const flaps = (s, len) => s.padEnd(len, " ").split("").map((c) => `<span class="flap">${c === " " ? "&nbsp;" : esc(c)}</span>`).join("");
  return `<div class="board" data-board style="--cols:${nameLen + 5}">
  <p class="board-cap"><span>Vanaf ${esc(from)}</span><span>${esc(caption)}</span></p>
  <ul class="board-rows">
${rows.map((r) => `    <li class="board-row">${r.href ? `<a href="${r.href}" class="board-link">` : ""}<span class="sr">${esc(r.name)}: ongeveer ${r.min} minuten</span><span class="flaps" aria-hidden="true">${flaps(r.short, nameLen)}</span><span class="flaps flaps-time" aria-hidden="true">${flaps(fmtMin(r.min), 4)}</span>${r.href ? "</a>" : ""}</li>`).join("\n")}
  </ul>
  <p class="board-note">Reistijden zonder file, ter indicatie.</p>
</div>`;
}
export const destRows = (from, ids) => ids.map((id) => ({ ...DEST[id], min: minutes(from, DEST[id]) }));

// ---------- FAQ ----------
export function faq(items, { title = "Vaak gevraagd" } = {}) {
  return `<section class="faq wrap" aria-labelledby="faq-h">
  <h2 class="h2" id="faq-h">${esc(title)}</h2>
  <div class="faq-list">
${items.map(([q, a]) => `    <details class="faq-item"><summary><span>${esc(q)}</span><span class="faq-plus" aria-hidden="true"></span></summary><p>${esc(a)}</p></details>`).join("\n")}
  </div>
</section>`;
}

// ---------- Radius map ----------
const MAP = { size: 680, r: 300, pxPerKm: 13.4 };
const project = (p) => {
  const c = MAP.size / 2;
  return [c + (p.lng - SITE.geo.lng) * KM_LNG * MAP.pxPerKm, c - (p.lat - SITE.geo.lat) * KM_LAT * MAP.pxPerKm];
};
const LABEL_LEFT = new Set(["Nieuwegein", "Vianen", "Leerdam"]);
const RIVERS = {
  Lek: [[51.998, 5.04], [51.99, 5.10], [51.975, 5.14], [51.966, 5.19], [51.962, 5.23], [51.957, 5.28], [51.967, 5.335], [51.962, 5.40], [51.955, 5.46]],
  Waal: [[51.80, 5.12], [51.81, 5.24], [51.83, 5.30], [51.86, 5.37], [51.878, 5.43], [51.882, 5.50]],
};
const smooth = (pts) => {
  const p = pts.map(([lat, lng]) => project({ lat, lng }));
  let d = `M${p[0][0].toFixed(1)} ${p[0][1].toFixed(1)}`;
  for (let i = 1; i < p.length - 1; i++) {
    const mx = (p[i][0] + p[i + 1][0]) / 2, my = (p[i][1] + p[i + 1][1]) / 2;
    d += ` Q${p[i][0].toFixed(1)} ${p[i][1].toFixed(1)} ${mx.toFixed(1)} ${my.toFixed(1)}`;
  }
  const l = p[p.length - 1];
  return d + ` L${l[0].toFixed(1)} ${l[1].toFixed(1)}`;
};
export function radiusMap({ highlight } = {}) {
  const c = MAP.size / 2;
  const rings = [5, 10, 15, 20];
  const towns = TOWNS.filter((t) => !t.village).sort((a, b) => km(HOME, a) - km(HOME, b));
  const utrecht = { name: "Utrecht", lat: 52.0907, lng: 5.1214, slug: null };
  const airports = ["schiphol", "rotterdam-ap", "eindhoven-ap"].map((id) => {
    const d = DEST[id];
    const [x, y] = project(d);
    const ang = Math.atan2(y - c, x - c);
    return { ...d, ang, min: minutes(HOME, d), label: d.name.split(" ")[0] };
  });
  const pt = (t, i) => {
    const [x, y] = project(t);
    const left = LABEL_LEFT.has(t.name);
    const on = highlight === t.slug;
    const inner = `<circle class="map-dot" cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${on ? 9 : 6}"/>
<text class="map-label" x="${(x + (left ? -14 : 14)).toFixed(1)}" y="${(y + 6).toFixed(1)}" text-anchor="${left ? "end" : "start"}">${esc(t.name)}</text>`;
    return t.slug
      ? `<a class="map-town${on ? " is-on" : ""}" href="/${t.slug}" data-town="${t.slug}" style="--i:${i}">${inner}</a>`
      : `<g class="map-town map-town-plain" style="--i:${i}">${inner}</g>`;
  };
  return `<figure class="map" data-map>
<svg viewBox="-96 -44 ${MAP.size + 192} ${MAP.size + 100}" role="img" aria-labelledby="map-t">
<title id="map-t">Kaart van het werkgebied rond Culemborg met afstanden van 5 tot 20 kilometer</title>
<defs><clipPath id="map-clip"><circle cx="${c}" cy="${c}" r="${MAP.r}"/></clipPath></defs>
<circle class="map-bg" cx="${c}" cy="${c}" r="${MAP.r}"/>
<g clip-path="url(#map-clip)">
${Object.entries(RIVERS).map(([n, pts]) => `<path class="map-river" d="${smooth(pts)}"/>`).join("\n")}
</g>
<text class="map-river-label" x="${project({ lat: 51.9745, lng: 5.155 })[0].toFixed(0)}" y="${project({ lat: 51.9745, lng: 5.155 })[1].toFixed(0)}">Lek</text>
<text class="map-river-label" x="${project({ lat: 51.838, lng: 5.318 })[0].toFixed(0)}" y="${project({ lat: 51.838, lng: 5.318 })[1].toFixed(0)}">Waal</text>
${rings.map((k, i) => `<g class="map-ring" style="--i:${i}"><circle cx="${c}" cy="${c}" r="${k * MAP.pxPerKm}"/><text x="${c + 6}" y="${(c - k * MAP.pxPerKm - 6).toFixed(0)}">${k} km</text></g>`).join("\n")}
<circle class="map-pulse" cx="${c}" cy="${c}" r="40"/><circle class="map-pulse map-pulse-2" cx="${c}" cy="${c}" r="40"/>
${airports.map((a) => {
    const x = c + Math.cos(a.ang) * (MAP.r + 4), y = c + Math.sin(a.ang) * (MAP.r + 4);
    const deg = (a.ang * 180) / Math.PI;
    const lx = c + Math.cos(a.ang) * (MAP.r + 26), ly = c + Math.sin(a.ang) * (MAP.r + 26);
    const anchor = Math.cos(a.ang) < -0.3 ? "end" : Math.cos(a.ang) > 0.3 ? "start" : "middle";
    const dy = Math.sin(a.ang) > 0.5 ? 14 : Math.sin(a.ang) < -0.5 ? -18 : -4;
    return `<g class="map-air"><path d="M-10 -8 L2 0 L-10 8" transform="translate(${x.toFixed(1)} ${y.toFixed(1)}) rotate(${deg.toFixed(1)})"/><text x="${lx.toFixed(1)}" y="${(ly + dy).toFixed(1)}" text-anchor="${anchor}">${esc(a.label)}<tspan class="map-air-min" x="${lx.toFixed(1)}" dy="18">${a.min} min</tspan></text></g>`;
  }).join("\n")}
${[utrecht, ...towns].map(pt).join("\n")}
<g class="map-home"><circle cx="${c}" cy="${c}" r="26"/><svg x="${c - 17}" y="${c - 17}" width="34" height="34" viewBox="${MARK_VB}" data-logo><use class="logo-hand" href="${SPRITE}#p-hand"/></svg>
<text x="${c}" y="${c + 50}" text-anchor="middle">Culemborg</text></g>
</svg>
</figure>`;
}

// ---------- Structured data ----------
export function businessLd() {
  return {
    "@type": "LocalBusiness",
    "@id": `${SITE.url}/#business`,
    name: SITE.name,
    description: "Taxibedrijf in Culemborg. Ritten in Culemborg en omgeving, naar ziekenhuizen, stations en luchthavens. Dag en nacht bereikbaar.",
    url: `${SITE.url}/`,
    telephone: SITE.phoneE164,
    logo: `${SITE.url}/img/logo-512.png`,
    image: `${SITE.url}/og/home.png`,
    address: { "@type": "PostalAddress", addressLocality: SITE.city, addressRegion: SITE.region, addressCountry: SITE.country },
    geo: { "@type": "GeoCoordinates", latitude: SITE.geo.lat, longitude: SITE.geo.lng },
    areaServed: [SITE.city, ...TOWNS.map((t) => t.name)].map((n) => ({ "@type": "City", name: n })),
    openingHoursSpecification: [{
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
      opens: "00:00", closes: "23:59",
    }],
    hasMap: SITE.gbpUrl,
    sameAs: [SITE.gbpUrl],
    contactPoint: [{ "@type": "ContactPoint", telephone: SITE.phoneE164, contactType: "customer service", areaServed: "NL", availableLanguage: ["Dutch"] }],
  };
}
export function serviceLd({ name, area, path, description }) {
  return {
    "@type": "TaxiService",
    name, description,
    url: abs(path),
    provider: { "@id": `${SITE.url}/#business` },
    areaServed: (Array.isArray(area) ? area : [area]).map((n) => ({ "@type": "City", name: n })),
  };
}
export function crumbsLd(items) {
  return {
    "@type": "BreadcrumbList",
    itemListElement: items.map(([name, path], i) => ({ "@type": "ListItem", position: i + 1, name, item: abs(path) })),
  };
}
export function faqLd(items) {
  return {
    "@type": "FAQPage",
    mainEntity: items.map(([q, a]) => ({ "@type": "Question", name: q, acceptedAnswer: { "@type": "Answer", text: a } })),
  };
}
