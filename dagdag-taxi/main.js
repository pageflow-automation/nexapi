/* DagDag Taxi — interactions. No dependencies. */

// ---- Business details: change these in one place ----
const CONFIG = {
  phoneDisplay: "06 00 00 00 00",   // TODO: echt nummer
  phoneE164: "+31600000000",         // TODO: echt nummer, zelfde als hierboven
  whatsapp: "31600000000",           // TODO: WhatsApp-nummer zonder + of spaties
};

// Destination board. Keep names ≤ 12 characters so rows fit on phones.
const ROUTES = [
  ["STATION",      "0:05"],
  ["UTRECHT CS",   "0:25"],
  ["NIEUWEGEIN",   "0:20"],
  ["TIEL",         "0:20"],
  ["DEN BOSCH",    "0:35"],
  ["SCHIPHOL",     "0:50"],
  ["EINDHOVEN AP", "0:55"],
  ["ROTTERDAM AP", "0:55"],
];

const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const $ = (s, root = document) => root.querySelector(s);
const $$ = (s, root = document) => [...root.querySelectorAll(s)];

// ---- Contact details ----
$$("[data-phone-link]").forEach(a => (a.href = `tel:${CONFIG.phoneE164}`));
$$("[data-phone-text]").forEach(el => (el.textContent = CONFIG.phoneDisplay));
$$("[data-wa-link]").forEach(a => (a.href = `https://wa.me/${CONFIG.whatsapp}`));
$$("[data-year]").forEach(el => (el.textContent = new Date().getFullYear()));

// ---- Logo wave ----
function wave(logo) {
  if (reduceMotion || !logo) return;
  logo.classList.remove("is-waving");
  void logo.offsetWidth; // restart the animation
  logo.classList.add("is-waving");
}
const navLogo = $(".nav [data-logo]");
$(".nav__logo").addEventListener("mouseenter", () => wave(navLogo));
$(".nav__logo").addEventListener("focus", () => wave(navLogo));

// ---- Page load ----
requestAnimationFrame(() => {
  document.documentElement.classList.add("is-loaded");
  setTimeout(() => wave(navLogo), 900);
});

// ---- Nav background once scrolled ----
const nav = $("[data-nav]");
const onScrollNav = () => nav.classList.toggle("is-scrolled", window.scrollY > 24);
onScrollNav();
window.addEventListener("scroll", onScrollNav, { passive: true });

// ---- Live Culemborg clock ----
const clockEl = $("[data-clock]");
const clockText = $("[data-clock-text]");
const fmt = new Intl.DateTimeFormat("nl-NL", {
  hour: "2-digit", minute: "2-digit", hour12: false, timeZone: "Europe/Amsterdam",
});
function tick() {
  const [h, m] = fmt.format(new Date()).split(":");
  clockEl.innerHTML = `${h}<span class="colon">:</span>${m}`;
  const hour = Number(h);
  clockText.textContent =
    hour < 6 ? "in Culemborg. Wij zijn wakker." :
    hour < 12 ? "in Culemborg. Goedemorgen." :
    hour < 18 ? "in Culemborg. We rijden." :
    "in Culemborg. Ook nu rijden we.";
}
tick();
setInterval(tick, 15000);

// ---- Scroll reveals (staggered per group) ----
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((e) => {
    if (!e.isIntersecting) return;
    e.target.classList.add("is-in");
    revealObserver.unobserve(e.target);
  });
}, { rootMargin: "0px 0px -10% 0px", threshold: 0.1 });

$$(".reveal, .reveal-img").forEach((el) => {
  const siblings = [...el.parentElement.children].filter(c => c.classList.contains("reveal"));
  const i = siblings.indexOf(el);
  if (i > 0) el.style.setProperty("--d", `${Math.min(i, 6) * 0.08}s`);
  revealObserver.observe(el);
});

// ---- Split-flap departure board ----
const board = $("[data-board]");
const CHARS = " ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789:";
const NAME_LEN = Math.max(...ROUTES.map(r => r[0].length));

function flapsFor(text, len, extraClass = "") {
  const wrap = document.createElement("span");
  wrap.className = `flaps ${extraClass}`;
  wrap.setAttribute("aria-hidden", "true");
  text.padEnd(len, " ").split("").forEach((ch) => {
    const f = document.createElement("span");
    f.className = "flap";
    f.dataset.target = ch;
    f.textContent = reduceMotion ? ch : " ";
    wrap.appendChild(f);
  });
  return wrap;
}

ROUTES.forEach(([name, time]) => {
  const row = document.createElement("div");
  row.className = "board__row";
  row.setAttribute("role", "row");
  const cellName = document.createElement("span");
  cellName.setAttribute("role", "cell");
  cellName.setAttribute("aria-label", name);
  cellName.appendChild(flapsFor(name, NAME_LEN));
  const cellTime = document.createElement("span");
  cellTime.setAttribute("role", "cell");
  cellTime.setAttribute("aria-label", `${time.replace("0:", "")} minuten`);
  cellTime.appendChild(flapsFor(time, 4, "flaps--time"));
  row.append(cellName, cellTime);
  board.appendChild(row);
});

function flipTo(flap, delay) {
  const target = flap.dataset.target;
  const start = CHARS.indexOf(flap.textContent);
  const end = CHARS.indexOf(target);
  // Always travel forward through the drum, like a real Solari board
  let steps = (end - start + CHARS.length) % CHARS.length;
  if (steps === 0) steps = CHARS.length;
  steps = Math.min(steps, 10 + Math.floor(Math.random() * 8));
  let i = 0;
  setTimeout(function step() {
    i++;
    const idx = i >= steps ? end : (CHARS.indexOf(flap.textContent) + 1) % CHARS.length;
    flap.textContent = CHARS[idx];
    flap.classList.remove("is-flipping");
    void flap.offsetWidth;
    flap.classList.add("is-flipping");
    if (i < steps) setTimeout(step, 55);
  }, delay);
}

function runRow(row, rowIndex) {
  $$(".flap", row).forEach((f, i) => flipTo(f, rowIndex * 120 + i * 35));
}

if (!reduceMotion) {
  const boardObserver = new IntersectionObserver(([e]) => {
    if (!e.isIntersecting) return;
    $$(".board__row:not(.board__row--head)", board).forEach(runRow);
    boardObserver.disconnect();
  }, { threshold: 0.3 });
  boardObserver.observe(board);

  // Hover a row to spin it again
  $$(".board__row:not(.board__row--head)", board).forEach((row) => {
    let busy = false;
    row.addEventListener("mouseenter", () => {
      if (busy) return;
      busy = true;
      $$(".flap", row).forEach(f => (f.textContent = CHARS[(CHARS.indexOf(f.dataset.target) + 20) % CHARS.length]));
      runRow(row, 0);
      setTimeout(() => (busy = false), 1400);
    });
  });
}

// ---- Scroll-linked: photo parallax + route drawing ----
const band = $("[data-parallax]");
const route = $("[data-route]");
const routeLine = route && $(".route__line", route);
const routeCar = route && $(".route__car", route);
const steps = $$(".step");
// The SVG is stretched (preserveAspectRatio="none") and the stroke doesn't scale,
// so dashes are measured in screen pixels. Sample the path once per resize to map
// "fraction of on-screen length" back to a point on the path.
let routeSamples = [];
function measureRoute() {
  if (!routeLine) return;
  const svg = routeLine.ownerSVGElement;
  const sx = svg.clientWidth / 1000;
  const sy = svg.clientHeight / 120;
  const total = routeLine.getTotalLength();
  const svgBox = svg.getBoundingClientRect();
  const routeBox = route.getBoundingClientRect();
  const offX = svgBox.left - routeBox.left;
  const offY = svgBox.top - routeBox.top;
  routeSamples = [];
  let acc = 0, prev = null;
  for (let i = 0; i <= 200; i++) {
    const pt = routeLine.getPointAtLength((total * i) / 200);
    const x = offX + pt.x * sx, y = offY + pt.y * sy;
    if (prev) acc += Math.hypot(x - prev.x, y - prev.y);
    routeSamples.push({ x, y, d: acc });
    prev = { x, y };
  }
  routeLine.style.strokeDasharray = acc;
}
function routePointAt(p) {
  const total = routeSamples[routeSamples.length - 1].d;
  const target = total * p;
  let i = routeSamples.findIndex(s => s.d >= target);
  if (i <= 0) return routeSamples[0];
  const a = routeSamples[i - 1], b = routeSamples[i];
  const t = (target - a.d) / (b.d - a.d || 1);
  return { x: a.x + (b.x - a.x) * t, y: a.y + (b.y - a.y) * t, d: target };
}
measureRoute();

function progressThrough(el, startFrac = 1, endFrac = 0) {
  // 0 when el's top hits startFrac of viewport, 1 when it hits endFrac
  const r = el.getBoundingClientRect();
  const vh = window.innerHeight;
  const p = (vh * startFrac - r.top) / (vh * (startFrac - endFrac));
  return Math.max(0, Math.min(1, p));
}

let ticking = false;
function onScroll() {
  if (ticking) return;
  ticking = true;
  requestAnimationFrame(() => {
    ticking = false;

    if (band) {
      const r = band.parentElement.getBoundingClientRect();
      const vh = window.innerHeight;
      if (r.bottom > 0 && r.top < vh) {
        const p = (r.top + r.height / 2 - vh / 2) / vh; // -1..1 around centre
        band.style.transform = `translate3d(0, ${p * -9}%, 0)`;
      }
    }

    if (route && route.offsetParent !== null && routeSamples.length) {
      const p = progressThrough(route, 0.85, 0.35);
      const total = routeSamples[routeSamples.length - 1].d;
      const pt = routePointAt(p);
      routeLine.style.strokeDashoffset = total * (1 - p);
      routeCar.style.transform = `translate(${pt.x}px, ${pt.y}px)`;
      steps.forEach((s, i) => s.classList.toggle("is-reached", p >= [0.02, 0.5, 0.97][i]));
    }
  });
}

if (!reduceMotion) {
  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", () => { measureRoute(); onScroll(); });
  onScroll();
} else if (routeLine) {
  routeLine.style.strokeDasharray = "none";
  routeCar.style.display = "none";
  steps.forEach(s => s.classList.add("is-reached"));
}

// ---- Footer: the logo waves goodbye every time you arrive ----
const bigLogo = $("[data-logo-big]");
new IntersectionObserver(([e]) => {
  if (e.isIntersecting) setTimeout(() => wave(bigLogo), 250);
}, { threshold: 0.6 }).observe(bigLogo);
bigLogo.addEventListener("mouseenter", () => wave(bigLogo));

// ---- Booking form → WhatsApp ----
const form = $("[data-form]");
const formError = $("[data-form-error]");
const dateInput = $("#f-date");
dateInput.min = new Date().toISOString().slice(0, 10);

form.addEventListener("submit", (ev) => {
  ev.preventDefault();
  const data = new FormData(form);
  const missing = [];
  ["from", "to", "date", "time"].forEach((name) => {
    const field = form.elements[name].closest(".field");
    const empty = !String(data.get(name) || "").trim();
    field.classList.toggle("is-invalid", empty);
    if (empty) missing.push(field.querySelector("label").textContent.trim().toLowerCase());
  });
  if (missing.length) {
    formError.textContent = `Vul nog in: ${missing.join(", ")}.`;
    form.querySelector(".is-invalid input").focus();
    return;
  }
  formError.textContent = "";

  const date = new Date(`${data.get("date")}T00:00`).toLocaleDateString("nl-NL", {
    weekday: "long", day: "numeric", month: "long",
  });
  const lines = [
    "Hoi DagDag, ik wil graag een rit boeken.",
    "",
    `Ophalen: ${data.get("from").trim()}`,
    `Naar: ${data.get("to").trim()}`,
    `Wanneer: ${date}, ${data.get("time")}`,
    `Personen: ${data.get("pax")}`,
  ];
  const note = String(data.get("note") || "").trim();
  if (note) lines.push(`Opmerking: ${note}`);

  window.open(`https://wa.me/${CONFIG.whatsapp}?text=${encodeURIComponent(lines.join("\n"))}`, "_blank", "noopener");
});

form.addEventListener("input", (e) => {
  const field = e.target.closest(".field");
  if (field && e.target.value.trim()) field.classList.remove("is-invalid");
});
