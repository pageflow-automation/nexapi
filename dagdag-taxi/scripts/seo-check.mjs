// SEO guard: runs after every build (also on Vercel). Errors fail the deploy; warnings are printed.
import fs from "node:fs";
import path from "node:path";
import { SITE } from "../src/data.mjs";

const DIST = path.resolve(path.dirname(new URL(import.meta.url).pathname), "../dist");
const errors = [], warnings = [];
const err = (f, m) => errors.push(`${f}: ${m}`);
const warn = (f, m) => warnings.push(`${f}: ${m}`);

const pages = fs.readdirSync(DIST).filter((f) => f.endsWith(".html"));
const pathOf = (f) => (f === "index.html" ? "/" : `/${f.replace(/\.html$/, "")}`);
const meta = (html, name) => (html.match(new RegExp(`<meta (?:name|property)="${name}" content="([^"]*)"`)) || [])[1];
const decode = (s) => s.replace(/&amp;/g, "&").replace(/&quot;/g, '"').replace(/&lt;/g, "<").replace(/&gt;/g, ">");
// Paths handled by redirects in vercel.json (e.g. /review → Google review form) count as valid links.
const REDIRECTS = new Set(JSON.parse(fs.readFileSync(path.join(DIST, "../vercel.json"), "utf8")).redirects.filter((r) => !r.has).map((r) => r.source));
const exists = (href) => {
  const p = decodeURIComponent(href.split(/[?#]/)[0]);
  if (REDIRECTS.has(p)) return true;
  if (p === "/") return fs.existsSync(path.join(DIST, "index.html"));
  const f = path.join(DIST, p);
  return fs.existsSync(f) && fs.statSync(f).isFile() || fs.existsSync(f + ".html");
};

const seenTitles = new Map(), seenDescs = new Map(), indexable = [];
for (const f of pages) {
  const html = fs.readFileSync(path.join(DIST, f), "utf8");
  const p = pathOf(f);
  const noindex = /<meta name="robots" content="noindex/.test(html);
  if (!noindex) indexable.push(p);

  if (!/<html lang="nl">/.test(html)) err(f, "missing lang=nl");
  const title = decode((html.match(/<title>([^<]*)<\/title>/) || [])[1] || "");
  if (!title) err(f, "missing <title>");
  else if (title.length > 65) err(f, `title too long (${title.length}): ${title}`);
  else if (!noindex && title.length > 60) warn(f, `title ${title.length} chars, may be truncated`);
  else if (!noindex && title.length < 25) warn(f, `title short (${title.length})`);

  const desc = decode(meta(html, "description") || "");
  if (!desc) err(f, "missing meta description");
  else if (desc.length > 165) err(f, `description too long (${desc.length})`);
  else if (desc.length < 70) warn(f, `description short (${desc.length})`);

  const h1s = html.match(/<h1[\s>]/g) || [];
  if (h1s.length !== 1) err(f, `expected 1 <h1>, found ${h1s.length}`);

  const canon = (html.match(/<link rel="canonical" href="([^"]+)"/) || [])[1];
  const want = `${SITE.url}${p === "/" ? "/" : p}`;
  if (!canon) err(f, "missing canonical");
  else if (f !== "404.html" && canon !== want) err(f, `canonical ${canon} ≠ ${want}`);

  const og = meta(html, "og:image");
  if (!og) err(f, "missing og:image");
  else if (!exists(og.replace(SITE.url, ""))) err(f, `og:image file missing: ${og}`);

  const ld = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)];
  if (!ld.length) err(f, "missing JSON-LD");
  for (const [, json] of ld) {
    try {
      const data = JSON.parse(json);
      const types = (data["@graph"] || [data]).map((n) => n["@type"]);
      if (!types.includes("LocalBusiness")) err(f, "JSON-LD without LocalBusiness");
    } catch (e) { err(f, `JSON-LD does not parse: ${e.message}`); }
  }

  for (const [, href] of html.matchAll(/href="(\/[^"]*)"/g)) {
    if (!exists(href)) err(f, `broken internal link ${href}`);
  }
  for (const [, src] of html.matchAll(/<img [^>]*src="(\/[^"]+)"/g)) if (!exists(src)) err(f, `missing image ${src}`);
  for (const [tag] of html.matchAll(/<img [^>]*>/g)) {
    if (!/ alt="[^"]+"/.test(tag)) err(f, `img without alt: ${tag.slice(0, 80)}`);
    if (!/ width="\d+"/.test(tag) || !/ height="\d+"/.test(tag)) warn(f, `img without width/height (CLS): ${tag.slice(0, 80)}`);
  }
  for (const [, t] of html.matchAll(/href="tel:([^"]+)"/g)) if (t !== SITE.phoneE164) err(f, `tel link ${t} ≠ ${SITE.phoneE164}`);
  for (const [, w] of html.matchAll(/href="https:\/\/wa\.me\/(\d+)/g)) if (w !== SITE.whatsapp) err(f, `WhatsApp link to ${w}`);

  if (!noindex) {
    if (seenTitles.has(title)) err(f, `duplicate title with ${seenTitles.get(title)}`);
    if (seenDescs.has(desc)) err(f, `duplicate description with ${seenDescs.get(desc)}`);
    seenTitles.set(title, f); seenDescs.set(desc, f);
    if (!/Taxi|taxi/.test(title)) warn(f, "title without the word taxi");
  }
}

// sitemap + robots
const sitemap = fs.readFileSync(path.join(DIST, "sitemap.xml"), "utf8");
const locs = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1].replace(SITE.url, "") || "/");
for (const p of indexable) if (!locs.includes(p)) err("sitemap.xml", `missing ${p}`);
for (const p of locs) if (!indexable.includes(p)) err("sitemap.xml", `lists non-indexable ${p}`);
const robots = fs.readFileSync(path.join(DIST, "robots.txt"), "utf8");
if (!robots.includes(`Sitemap: ${SITE.url}/sitemap.xml`)) err("robots.txt", "sitemap line missing");
for (const f of ["favicon.ico", "favicon.svg", "apple-touch-icon.png", "site.webmanifest", "icon-192.png", "icon-512.png", "dagdag-taxi.vcf"]) if (!fs.existsSync(path.join(DIST, f))) err(f, "missing");

for (const w of warnings) console.warn("warn ", w);
for (const e of errors) console.error("ERROR", e);
console.log(`SEO check: ${pages.length} pages, ${indexable.length} indexable, ${errors.length} errors, ${warnings.length} warnings`);
process.exit(errors.length ? 1 : 0);
