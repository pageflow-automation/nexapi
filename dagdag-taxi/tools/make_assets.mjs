// Renders favicons, share (OG) images and print PDFs from the brand vectors.
// Run from tools/: npm run assets   (writes into ../public)
import fs from "node:fs";
import path from "node:path";
import { chromium } from "playwright";
import { execFileSync } from "node:child_process";

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), "..");
const PUB = path.join(ROOT, "public");
const D = JSON.parse(fs.readFileSync(path.join(ROOT, "tools/logo-paths.json"), "utf8"));
const { TOWNS, SITE } = await import(path.join(ROOT, "src/data.mjs"));
const { minutes, HOME } = await import(path.join(ROOT, "src/lib.mjs"));

const INK = "#141414", YEL = "#FDBC18", PAPER = "#F3EFE6";
const LOGO_VB = "6 7 1179 421", MARK_VB = "922 6 264 328";
const markPaths = (fill) => `<path fill="${fill}" d="${D["arc-out"]}"/><path fill="${fill}" d="${D["arc-in"]}"/><path fill="${fill}" d="${D.hand}"/>`;
let maskId = 0; // hand sits behind the "g", cut by a mask so the gap is transparent
const logoSvg = (word = INK, accent = YEL, cls = "") => { const id = `cut${++maskId}`; return `<svg class="${cls}" viewBox="${LOGO_VB}" xmlns="http://www.w3.org/2000/svg"><defs><mask id="${id}" maskUnits="userSpaceOnUse" x="0" y="0" width="1200" height="440"><rect width="1200" height="440" fill="#fff"/><path d="${D.word}" fill="#000" stroke="#000" stroke-width="11" stroke-linejoin="round"/></mask></defs><path fill="${accent}" d="${D["arc-out"]}"/><path fill="${accent}" d="${D["arc-in"]}"/><path fill="${accent}" d="${D.hand}" mask="url(#${id})"/><path fill="${word}" d="${D.word}"/><path fill="${word}" d="${D.taxi}"/></svg>`; };
const markSvg = (fill = YEL, attrs = "") => `<svg ${attrs} viewBox="${MARK_VB}" xmlns="http://www.w3.org/2000/svg">${markPaths(fill)}</svg>`;
const qrSvg = fs.readFileSync(path.join(PUB, "img/qr-contact.svg"), "utf8").replace(/<\?xml[^>]*>/, "");

const b64 = (f) => `data:font/woff2;base64,${fs.readFileSync(path.join(PUB, "fonts", f)).toString("base64")}`;
const fonts = `
@font-face { font-family: Archivo; src: url(${b64("archivo.woff2")}); font-weight: 100 900; font-stretch: 62% 125%; }
@font-face { font-family: Archivo; src: url(${b64("archivo-italic.woff2")}); font-weight: 100 900; font-stretch: 62% 125%; font-style: italic; }
@font-face { font-family: Mono; src: url(${b64("jbmono-700.woff2")}); font-weight: 700; }
* { box-sizing: border-box; margin: 0; padding: 0; }
body { font-family: Archivo; -webkit-font-smoothing: antialiased; }
.tag { display: inline-block; background: ${YEL}; color: ${INK}; font: 700 22px/1 Mono; letter-spacing: .12em; text-transform: uppercase; padding: 12px 26px 11px; clip-path: polygon(12px 0, calc(100% - 12px) 0, 100% 100%, 0 100%); }
`;

// ---------- Favicons ----------
const favSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><rect width="64" height="64" rx="14" fill="${INK}"/>${markSvg(YEL, 'x="12.5" y="8" width="39" height="48"')}</svg>`;
fs.writeFileSync(path.join(PUB, "favicon.svg"), favSvg);

const browser = await chromium.launch({ executablePath: fs.existsSync("/opt/pw-browsers/chromium") ? "/opt/pw-browsers/chromium" : undefined });
const ctx = await browser.newContext({ deviceScaleFactor: 1 });

async function shot(html, w, h, out) {
  const p = await ctx.newPage();
  await p.setViewportSize({ width: w, height: h });
  await p.setContent(`<!doctype html><html><head><style>${fonts} html,body{width:${w}px;height:${h}px;overflow:hidden}</style></head><body>${html}</body></html>`, { waitUntil: "load" });
  await p.evaluate(() => document.fonts.ready);
  await p.evaluate(() => window.fit && window.fit());
  await p.screenshot({ path: out, omitBackground: false });
  await p.close();
}
const square = (s, bg, markH, radius = 0) => `<div style="width:${s}px;height:${s}px;background:${bg};border-radius:${radius}px;display:grid;place-items:center">${markSvg(YEL, `style="height:${markH}px;width:auto"`)}</div>`;

const tmp = path.join(ROOT, "tools/out");
fs.mkdirSync(tmp, { recursive: true });
// Chromium won't render tiny viewports, so draw once at 256 px and downscale.
await shot(`<div style="width:256px;height:256px;background:${INK};border-radius:56px;display:grid;place-items:center">${markSvg(YEL, 'style="height:196px;width:auto"')}</div>`, 256, 256, `${tmp}/fav-256.png`);
execFileSync("python3", ["-c", `
from PIL import Image
im=Image.open('${tmp}/fav-256.png').convert('RGBA')
im.save('${PUB}/favicon.ico', sizes=[(16,16),(32,32),(48,48)])
`]);
await shot(square(180, INK, 118), 180, 180, `${PUB}/apple-touch-icon.png`);
await shot(square(192, INK, 128), 192, 192, `${PUB}/icon-192.png`);
await shot(square(512, INK, 340), 512, 512, `${PUB}/icon-512.png`);
await shot(square(512, INK, 250), 512, 512, `${PUB}/icon-maskable-512.png`);
await shot(`<div style="width:512px;height:512px;background:${PAPER};display:grid;place-items:center">${logoSvg(INK, YEL).replace("<svg ", '<svg style="width:440px" ')}</div>`, 512, 512, `${PUB}/img/logo-512.png`);

// ---------- Share images (1200×630) ----------
const OG = {
  home: ["Culemborg & omgeving", "Taxi Culemborg.", "Dag &amp; <em>nacht.</em>"],
  werkgebied: ["Werkgebied", "Culemborg en", "alles <em>eromheen.</em>"],
  luchthavenvervoer: ["Schiphol · Eindhoven · Rotterdam", "Naar het", "<em>vliegveld.</em>"],
  "taxi-schiphol": [`Culemborg → Schiphol · ±${minutes(HOME, { lat: 52.3105, lng: 4.7683 })} min`, "Taxi naar", "<em>Schiphol.</em>"],
  "taxi-ziekenhuis": ["Tiel · Nieuwegein · Utrecht", "Naar het", "<em>ziekenhuis.</em>"],
  "zakelijk-vervoer": ["Voor bedrijven", "Zakelijk", "<em>vervoer.</em>"],
  contact: ["Contact", "Bel of", "<em>app.</em>"],
  ...Object.fromEntries(TOWNS.map((t) => [t.slug, [`${minutes(HOME, t)} min vanaf Culemborg`, "Taxi", `<em>${t.name}.</em>`]])),
};
fs.mkdirSync(path.join(PUB, "og"), { recursive: true });
for (const [key, [kicker, l1, l2]] of Object.entries(OG)) {
  const html = `
<style>
.og { position: relative; width: 1200px; height: 630px; background: ${PAPER}; color: ${INK}; overflow: hidden; }
.sun { position: absolute; right: -150px; top: 50%; width: 620px; height: 620px; translate: 0 -50%; border-radius: 50%; background: ${YEL}; display: grid; place-items: center; }
.sun svg { height: 330px; width: auto; translate: -70px -6px; }
.txt { position: absolute; left: 72px; top: 64px; width: 640px; }
h1 { margin-top: 30px; font-weight: 900; font-stretch: 125%; line-height: .92; letter-spacing: -.045em; font-size: 104px; }
h1 em { font-style: italic; }
.foot { position: absolute; left: 72px; bottom: 56px; display: flex; align-items: center; gap: 28px; }
.num { font: 700 44px/1 Mono; letter-spacing: -.02em; background: ${INK}; color: ${YEL}; padding: 14px 22px; border-radius: 14px; }
.logo { width: 230px; }
</style>
<div class="og">
  <div class="sun">${markSvg(INK)}</div>
  <div class="txt"><span class="tag">${kicker}</span><h1 id="t"><span>${l1}</span><br><span>${l2}</span></h1></div>
  <div class="foot"><span class="num">${SITE.phoneDisplay}</span>${logoSvg(INK, YEL, "logo")}</div>
</div>
<script>window.fit = () => { const h = document.getElementById("t"); let s = 104; while ((h.scrollWidth > 630 || h.offsetHeight > 300) && s > 50) { s -= 2; h.style.fontSize = s + "px"; } };</script>`;
  await shot(html, 1200, 630, path.join(PUB, "og", `${key}.png`));
}

// ---------- Print (PDF, 3 mm bleed) ----------
fs.mkdirSync(path.join(PUB, "print"), { recursive: true });
async function pdf(html, wMm, hMm, out) {
  const p = await ctx.newPage();
  await p.setContent(`<!doctype html><html><head><style>${fonts}
@page { size: ${wMm}mm ${hMm}mm; margin: 0; }
html, body { width: ${wMm}mm; }
.pg { position: relative; width: ${wMm}mm; height: ${hMm}mm; overflow: hidden; page-break-after: always; break-after: page; }
.pg:last-child { page-break-after: auto; break-after: auto; }
.safe { position: absolute; inset: 7mm; } /* 3 mm bleed + 4 mm safe margin */
.qr { background: #fff; border-radius: 2.2mm; padding: 1.2mm; }
.qr svg { display: block; width: 100%; height: auto; }
.mono { font-family: Mono; font-weight: 700; }
</style></head><body>${html}</body></html>`, { waitUntil: "load" });
  await p.evaluate(() => document.fonts.ready);
  await p.pdf({ path: out, width: `${wMm}mm`, height: `${hMm}mm`, printBackground: true, preferCSSPageSize: true });
  await p.close();
}

// Business card 85×55 (+3 mm bleed = 91×61)
await pdf(`
<div class="pg" style="background:${INK}">
  <div class="safe" style="display:grid;place-items:center;align-content:center;gap:3mm">
    ${logoSvg(PAPER, YEL).replace("<svg ", '<svg style="width:58mm" ')}
    <p style="color:#b3ab9c;font:700 2.6mm/1 Mono;letter-spacing:.14em;text-transform:uppercase">Taxi Culemborg · dag &amp; nacht</p>
  </div>
</div>
<div class="pg" style="background:${PAPER};color:${INK}">
  <div class="safe" style="display:grid;grid-template-columns:24mm 1fr;gap:4mm;align-items:center">
    <div class="qr" style="border:.35mm solid ${INK}">${qrSvg}</div>
    <div style="display:grid;gap:1.6mm">
      <p style="font:900 4.2mm/1 Archivo;font-stretch:125%;letter-spacing:-.03em">Sla ons op.</p>
      <p class="mono" style="font-size:5.4mm;line-height:1;letter-spacing:-.02em;white-space:nowrap">${SITE.phoneDisplay}</p>
      <p style="font:600 2.5mm/1.3 Archivo">Bellen of WhatsApp.<br>Culemborg en omgeving.</p>
      <p style="font:500 2.1mm/1.35 Archivo;color:#675f52;margin-top:.6mm">Scannen = contact opslaan. Je telefoon toont <b>DagDag Taxi Culemborg</b>. Nooit een link of betaalverzoek.</p>
    </div>
  </div>
  <div style="position:absolute;left:0;right:0;bottom:0;height:5mm;background:${YEL}"></div>
</div>`, 91, 61, path.join(PUB, "print/visitekaartje.pdf"));

// Square sticker 90×90 (+3 mm bleed = 96×96)
await pdf(`
<div class="pg" style="background:${YEL};color:${INK}">
  <div class="safe" style="display:grid;grid-template-rows:auto 1fr auto;gap:3mm">
    <div style="display:flex;justify-content:space-between;align-items:flex-start">
      <p style="font:900 9.5mm/.92 Archivo;font-stretch:125%;letter-spacing:-.04em">Taxi<br><i>nodig?</i></p>
      ${markSvg(INK, 'style="height:17mm;width:auto"')}
    </div>
    <div style="display:grid;grid-template-columns:30mm 1fr;gap:4mm;align-items:end">
      <div class="qr" style="border:.4mm solid ${INK}">${qrSvg}</div>
      <p style="font:600 2.6mm/1.35 Archivo">Scan om ons nummer op te slaan. Geen link, alleen ons contact.</p>
    </div>
    <div style="border-top:.5mm solid ${INK};padding-top:2.5mm;display:flex;justify-content:space-between;align-items:baseline">
      <p class="mono" style="font-size:7.4mm;letter-spacing:-.03em">${SITE.phoneDisplay}</p>
      <p style="font:700 2.4mm Mono;letter-spacing:.1em">DAG &amp; NACHT</p>
    </div>
  </div>
</div>`, 96, 96, path.join(PUB, "print/sticker.pdf"));

// Flyer A6 105×148 (+3 mm bleed = 111×154)
const flyerTowns = ["Culemborg", ...TOWNS.map((t) => t.name)].join(" · ");
await pdf(`
<div class="pg" style="background:${PAPER};color:${INK}">
  <div style="position:absolute;right:-26mm;top:-22mm;width:92mm;height:92mm;border-radius:50%;background:${YEL}"></div>
  ${markSvg(INK, 'style="position:absolute;right:10mm;top:9mm;height:34mm;width:auto"')}
  <div class="safe" style="display:grid;grid-template-rows:auto auto 1fr auto;gap:4mm">
    ${logoSvg(INK, YEL).replace("<svg ", '<svg style="width:36mm" ')}
    <p style="font:900 15mm/.9 Archivo;font-stretch:125%;letter-spacing:-.045em;margin-top:14mm">Dag &amp;<br><i>nacht.</i></p>
    <div style="display:grid;gap:1.6mm;font:600 3.3mm/1.35 Archivo;align-content:start">
      <p>Eén telefoontje en we komen eraan.</p>
      <p style="font-weight:500;color:#34322d">Station · ziekenhuis · Schiphol · zakelijk · ’s nachts</p>
      <p style="font:500 2.5mm/1.4 Archivo;color:#675f52;margin-top:1mm">${flyerTowns}</p>
    </div>
    <div style="display:grid;grid-template-columns:1fr 24mm;gap:4mm;align-items:end;border-top:.6mm solid ${INK};padding-top:3.5mm">
      <div style="display:grid;gap:1.2mm">
        <p style="font:700 2.6mm Mono;letter-spacing:.12em;color:#675f52">BEL OF WHATSAPP</p>
        <p class="mono" style="font-size:8.6mm;letter-spacing:-.04em;line-height:1">${SITE.phoneDisplay}</p>
        <p style="font:500 2.2mm/1.35 Archivo;color:#675f52">QR = ons nummer opslaan. Geen link.</p>
      </div>
      <div class="qr" style="border:.4mm solid ${INK}">${qrSvg}</div>
    </div>
  </div>
</div>`, 111, 154, path.join(PUB, "print/flyer-a6.pdf"));

await browser.close();
console.log("Assets written: favicons, og/*.png, print/*.pdf");
