// Static site build: node build.mjs [--serve]
import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import http from "node:http";
import { SITE } from "./src/data.mjs";
import { PAGES } from "./src/pages.mjs";
import { page } from "./src/layout.mjs";

const ROOT = path.dirname(new URL(import.meta.url).pathname);
const OUT = path.join(ROOT, "dist");

fs.rmSync(OUT, { recursive: true, force: true });
fs.cpSync(path.join(ROOT, "public"), OUT, { recursive: true });

// Fingerprinted CSS/JS so they can be cached forever.
function fingerprint(src, dir, ext) {
  const code = fs.readFileSync(path.join(ROOT, src), "utf8");
  const hash = crypto.createHash("sha1").update(code).digest("hex").slice(0, 10);
  fs.mkdirSync(path.join(OUT, dir), { recursive: true });
  const file = `/${dir}/site.${hash}.${ext}`;
  fs.writeFileSync(path.join(OUT, file), code);
  return file;
}
// CSS is small once minified, so it is inlined: no render-blocking request.
const minCss = (css) => css.replace(/\/\*[\s\S]*?\*\//g, "").replace(/\s+/g, " ").replace(/\s*([{};,>])\s*/g, "$1").replace(/;}/g, "}").trim();
const assets = { cssInline: minCss(fs.readFileSync(path.join(ROOT, "src/site.css"), "utf8")), js: fingerprint("src/site.js", "js", "js") };

const today = new Date().toISOString().slice(0, 10);
const indexable = [];
for (const p of PAGES) {
  const html = page({ ...p, assets });
  const file = p.path === "/" ? "index.html" : `${p.path.slice(1)}.html`;
  fs.writeFileSync(path.join(OUT, file), html);
  if (!p.noindex) indexable.push(p);
}

// sitemap.xml
fs.writeFileSync(path.join(OUT, "sitemap.xml"), `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${indexable.map((p) => `  <url><loc>${SITE.url}${p.path === "/" ? "/" : p.path}</loc><lastmod>${today}</lastmod><priority>${p.path === "/" ? "1.0" : p.path.startsWith("/taxi-") ? "0.8" : "0.6"}</priority></url>`).join("\n")}
</urlset>
`);

// robots.txt
fs.writeFileSync(path.join(OUT, "robots.txt"), `User-agent: *
Allow: /
Disallow: /merk

Sitemap: ${SITE.url}/sitemap.xml
`);

// llms.txt: plain summary for AI search assistants
fs.writeFileSync(path.join(OUT, "llms.txt"), `# ${SITE.name}

> Taxibedrijf in Culemborg (Gelderland). Dag en nacht bereikbaar op ${SITE.phoneDisplay} (bellen of WhatsApp).

- Werkgebied: Culemborg en omgeving: ${indexable.filter((p) => p.path.startsWith("/taxi-") && !["/taxi-schiphol", "/taxi-ziekenhuis"].includes(p.path)).map((p) => p.path.replace("/taxi-", "").replace(/-/g, " ")).join(", ")}.
- Ritten: stations, ziekenhuizen (Tiel, Nieuwegein, Utrecht), luchthavens (Schiphol, Eindhoven, Rotterdam), zakelijk vervoer, nachtritten.
- Telefoon: ${SITE.phoneE164}
- WhatsApp: https://wa.me/${SITE.whatsapp}

## Pagina's
${indexable.map((p) => `- [${p.title}](${SITE.url}${p.path === "/" ? "/" : p.path})`).join("\n")}
`);

// Web app manifest
fs.writeFileSync(path.join(OUT, "site.webmanifest"), JSON.stringify({
  name: "DagDag Taxi Culemborg",
  short_name: "DagDag Taxi",
  description: "Taxi in Culemborg en omgeving. Dag en nacht.",
  start_url: "/",
  display: "standalone",
  background_color: "#F3EFE6",
  theme_color: "#141414",
  lang: "nl",
  icons: [
    { src: "/icon-192.png", sizes: "192x192", type: "image/png" },
    { src: "/icon-512.png", sizes: "512x512", type: "image/png" },
    { src: "/icon-maskable-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
  ],
}, null, 2));

// vCard download (same contact as the QR code)
fs.writeFileSync(path.join(OUT, "dagdag-taxi.vcf"), [
  "BEGIN:VCARD", "VERSION:3.0",
  "N:;DagDag Taxi;;;", "FN:DagDag Taxi", "ORG:DagDag Taxi",
  `TEL;TYPE=CELL,VOICE:${SITE.phoneE164}`,
  `URL:${SITE.url}/`,
  "ADR;TYPE=WORK:;;;Culemborg;Gelderland;;Nederland",
  "NOTE:Taxi in Culemborg en omgeving. Bellen of WhatsApp\\, dag en nacht.",
  "END:VCARD", "",
].join("\r\n"));

console.log(`Built ${PAGES.length} pages → dist/ (${indexable.length} in sitemap) · base ${SITE.url}`);

// Local preview with Vercel-style clean URLs
if (process.argv.includes("--serve")) {
  const port = Number(process.env.PORT || 8765);
  const types = { ".html": "text/html; charset=utf-8", ".css": "text/css", ".js": "text/javascript", ".svg": "image/svg+xml", ".png": "image/png", ".ico": "image/x-icon", ".woff2": "font/woff2", ".xml": "application/xml", ".txt": "text/plain; charset=utf-8", ".webmanifest": "application/manifest+json", ".vcf": "text/vcard", ".pdf": "application/pdf" };
  http.createServer((req, res) => {
    let p = decodeURIComponent(new URL(req.url, "http://x").pathname);
    let f = path.join(OUT, p);
    if (p === "/") f = path.join(OUT, "index.html");
    else if (!path.extname(p)) f += ".html";
    if (!fs.existsSync(f)) { res.writeHead(404, { "content-type": types[".html"] }); return res.end(fs.readFileSync(path.join(OUT, "404.html"))); }
    res.writeHead(200, { "content-type": types[path.extname(f)] || "application/octet-stream" });
    fs.createReadStream(f).pipe(res);
  }).listen(port, () => console.log(`Preview on http://localhost:${port}`));
}
