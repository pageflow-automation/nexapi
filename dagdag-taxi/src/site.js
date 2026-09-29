/* DagDag Taxi — interactions. No dependencies. Everything degrades to a readable static page. */
(() => {
  const doc = document.documentElement;
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
  const lerp = (a, b, t) => a + (b - a) * t;
  const vh = () => window.innerHeight;

  // ---------- Wave ----------
  function wave(el) {
    if (reduce || !el) return;
    el.classList.remove("is-waving");
    requestAnimationFrame(() => requestAnimationFrame(() => el.classList.add("is-waving")));
  }

  // ---------- Load ----------
  requestAnimationFrame(() => {
    doc.classList.add("is-ready");
    setTimeout(() => wave($(".hdr [data-logo]")), 900);
    setTimeout(() => wave($(".sun [data-logo]")), 1300);
  });
  const hdrLogo = $(".hdr-logo");
  hdrLogo && hdrLogo.addEventListener("pointerenter", () => wave($("[data-logo]", hdrLogo)));
  const sun = $("[data-sun]");
  sun && sun.addEventListener("pointerenter", () => wave($("[data-logo]", sun)));

  // ---------- Header ----------
  const hdr = $("[data-hdr]");
  const onHdr = () => hdr.classList.toggle("is-scrolled", scrollY > 8);
  onHdr();
  addEventListener("scroll", onHdr, { passive: true });

  const menuBtn = $("[data-menu]");
  const menu = $("#menu");
  function setMenu(open) {
    menuBtn.setAttribute("aria-expanded", String(open));
    menu.classList.toggle("is-open", open);
    document.body.classList.toggle("menu-open", open);
    $("span", menuBtn).textContent = open ? "Sluiten" : "Menu";
  }
  menuBtn && menuBtn.addEventListener("click", () => setMenu(menuBtn.getAttribute("aria-expanded") !== "true"));
  addEventListener("keydown", (e) => { if (e.key === "Escape" && menu.classList.contains("is-open")) { setMenu(false); menuBtn.focus(); } });
  $$("a", menu).forEach((a) => a.addEventListener("click", () => setMenu(false)));

  // ---------- Live clock (Culemborg time) ----------
  const clock = $("[data-clock]");
  if (clock) {
    const text = $("[data-clock-text]");
    const fmt = new Intl.DateTimeFormat("nl-NL", { hour: "2-digit", minute: "2-digit", hour12: false, timeZone: "Europe/Amsterdam" });
    const tick = () => {
      const [h, m] = fmt.format(new Date()).split(":");
      clock.innerHTML = `${h}<span class="colon">:</span>${m}`;
      const n = +h;
      text.textContent = n < 6 ? "in Culemborg. Wij zijn wakker." : n < 12 ? "in Culemborg. Goedemorgen." : n < 18 ? "in Culemborg. We rijden." : "in Culemborg. Ook nu rijden we.";
    };
    tick();
    setInterval(tick, 15000);
  }

  // ---------- Reveal on scroll ----------
  const io = new IntersectionObserver((entries) => entries.forEach((e) => {
    if (!e.isIntersecting) return;
    e.target.classList.add("is-in");
    io.unobserve(e.target);
  }), { rootMargin: "0px 0px -8% 0px", threshold: 0.12 });
  $$(".reveal, [data-map]").forEach((el) => io.observe(el));

  // ---------- Map ↔ town links ----------
  $$("[data-town-link]").forEach((link) => {
    const dot = $(`[data-town="${link.dataset.townLink}"]`);
    if (!dot) return;
    const on = (v) => { dot.classList.toggle("is-hot", v); link.classList.toggle("is-hot", v); };
    [[link, dot], [dot, link]].forEach(([a]) => {
      a.addEventListener("pointerenter", () => on(true));
      a.addEventListener("pointerleave", () => on(false));
      a.addEventListener("focus", () => on(true));
      a.addEventListener("blur", () => on(false));
    });
  });

  // ---------- Split-flap boards ----------
  const CHARS = " ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789:";
  const FLIP = [{ transform: "scaleY(1)" }, { transform: "scaleY(.15)", filter: "brightness(.6)" }, { transform: "scaleY(1)" }];
  const norm = (c) => (c === " " ? " " : c);
  function spin(flap, delay) {
    const target = norm(flap.dataset.t);
    const end = CHARS.indexOf(target);
    if (end < 0) { flap.textContent = flap.dataset.t; return; }
    let cur = Math.floor(Math.random() * CHARS.length);
    let steps = 6 + Math.floor(Math.random() * 10);
    flap.textContent = " ";
    setTimeout(function step() {
      steps--;
      cur = steps <= 0 ? end : (cur + 1) % CHARS.length;
      flap.textContent = CHARS[cur] === " " ? " " : CHARS[cur];
      flap.animate(FLIP, 75);
      if (steps > 0) setTimeout(step, 60);
    }, delay);
  }
  function runBoard(board) {
    $$(".board-row", board).forEach((row, r) => $$(".flap", row).forEach((f, i) => spin(f, r * 110 + i * 30)));
  }
  $$("[data-board]").forEach((board) => {
    $$(".flap", board).forEach((f) => (f.dataset.t = f.textContent));
    if (reduce) return;
    const bio = new IntersectionObserver(([e]) => { if (e.isIntersecting) { runBoard(board); bio.disconnect(); } }, { threshold: 0.35 });
    bio.observe(board);
  });

  // ---------- Footer: wave goodbye ----------
  const ftrLogo = $(".ftr-logo");
  if (ftrLogo) {
    new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return;
      ftrLogo.classList.add("is-bye");
      setTimeout(() => wave($("[data-logo]", ftrLogo)), 200);
    }, { threshold: 0.6 }).observe(ftrLogo);
    ftrLogo.addEventListener("pointerenter", () => wave($("[data-logo]", ftrLogo)));
  }

  if (reduce) return; // Everything below is scroll-driven motion.

  // ---------- Story: from day to night ----------
  const story = $("[data-story]");
  let storyTick = null;
  if (story) {
    story.classList.add("is-live");
    const items = $$("[data-story-item]", story);
    const clockEl = $("[data-story-clock]", story);
    const body = $("[data-story-body]", story);
    const toMin = (t) => { const [h, m] = t.split(":").map(Number); return h * 60 + m; };
    let times = items.map((li) => toMin($(".story-time", li).textContent));
    for (let i = 1; i < times.length; i++) while (times[i] < times[i - 1]) times[i] += 1440;
    const SKY = [ // [hour, r, g, b]: long nights, quick dawn and dusk so the sky never sits in a muddy middle
      [0, 17, 17, 16], [5.7, 22, 22, 28], [6.35, 244, 221, 176], [7.2, 243, 239, 230], [17.2, 243, 239, 230],
      [19.1, 245, 206, 128], [19.8, 58, 44, 52], [20.5, 17, 17, 16], [24, 17, 17, 16], [30, 17, 17, 16],
    ];
    const skyAt = (h) => {
      let i = 0; while (i < SKY.length - 2 && SKY[i + 1][0] < h) i++;
      const [h0, ...a] = SKY[i], [h1, ...b] = SKY[i + 1];
      const t = clamp((h - h0) / (h1 - h0));
      return a.map((v, k) => Math.round(lerp(v, b[k], t)));
    };
    let last = -1;
    storyTick = () => {
      const r = story.getBoundingClientRect();
      if (r.bottom < 0 || r.top > vh()) return;
      const p = clamp(-r.top / (r.height - vh()));
      const seg = p * items.length;
      const i = Math.min(items.length - 1, Math.floor(seg));
      const f = seg - i;
      const next = times[Math.min(i + 1, times.length - 1)];
      const minute = i === items.length - 1 ? times[i] : lerp(times[i], next, clamp((f - 0.55) / 0.45));
      const shown = f < 0.55 || i === items.length - 1 ? times[i] : Math.round(minute / 5) * 5;
      const hh = String(Math.floor(shown / 60) % 24).padStart(2, "0"), mm = String(Math.round(shown % 60)).padStart(2, "0");
      clockEl.textContent = `${hh}:${mm}`;
      if (i !== last) { items.forEach((li, k) => li.classList.toggle("is-on", k === i)); last = i; }

      const hour = minute / 60;
      const [cr, cg, cb] = skyAt(hour);
      const lum = (0.299 * cr + 0.587 * cg + 0.114 * cb) / 255;
      story.style.setProperty("--sky", `rgb(${cr} ${cg} ${cb})`);
      const night = lum < 0.5;
      story.style.setProperty("--s-ink", night ? "#f3efe6" : "#141414");
      story.style.setProperty("--s-muted", night ? "#b9b1a2" : "#675f52");
      story.style.setProperty("--stars", String(clamp((0.45 - lum) * 3)));

      // Sun by day (6–20h), moon by night (20–30h); both ride an arc over the horizon.
      const isDay = hour >= 6 && hour < 20;
      const a = isDay ? (hour - 6) / 14 : ((hour < 6 ? hour + 24 : hour) - 20) / 10;
      const w = story.clientWidth, H = vh(), size = body.offsetWidth;
      const x = lerp(-0.05, 0.95, a) * w - size / 2 + w * 0.05;
      const y = H * 0.74 - Math.sin(Math.PI * clamp(a)) * H * 0.34 - size / 2;
      body.style.transform = `translate3d(${x}px, ${y}px, 0)`;
      body.style.setProperty("--phase", isDay ? "120%" : "38%");
    };
  }

  // ---------- Ticker with scroll velocity ----------
  const track = $("[data-ticker]");
  let tx = 0, vel = 0, dir = -1, lastY = scrollY, tickerOn = false;
  if (track) new IntersectionObserver(([e]) => (tickerOn = e.isIntersecting)).observe(track);

  // ---------- Hero sun parallax ----------
  const sunEl = $("[data-sun]");

  // ---------- Route through the steps ----------
  const route = $("[data-route]");
  const routeLine = route && $(".route-line", route);
  const routeCar = route && $(".route-car", route);
  const steps = $$(".step");
  let samples = [];
  function measureRoute() {
    if (!route || !route.offsetParent) return;
    const svg = routeLine.ownerSVGElement, sx = svg.clientWidth / 1000, sy = svg.clientHeight / 120, total = routeLine.getTotalLength();
    samples = []; let acc = 0, prev;
    for (let i = 0; i <= 160; i++) {
      const pt = routeLine.getPointAtLength((total * i) / 160), x = pt.x * sx, y = pt.y * sy;
      if (prev) acc += Math.hypot(x - prev.x, y - prev.y);
      samples.push({ x, y, d: acc }); prev = { x, y };
    }
    routeLine.style.strokeDasharray = acc;
  }
  function routeAt(p) {
    const T = samples[samples.length - 1].d * p;
    const i = Math.max(1, samples.findIndex((s) => s.d >= T));
    const a = samples[i - 1], b = samples[i] || a, t = (T - a.d) / (b.d - a.d || 1);
    return { x: lerp(a.x, b.x, t), y: lerp(a.y, b.y, t) };
  }
  measureRoute();
  addEventListener("resize", measureRoute);

  // ---------- One rAF loop for all scroll-linked motion (sleeps when idle) ----------
  let prevT = performance.now(), lastScroll = 0, running = false;
  const kick = () => { lastScroll = performance.now(); if (!running) { running = true; prevT = performance.now(); requestAnimationFrame(frame); } };
  addEventListener("scroll", kick, { passive: true });
  addEventListener("resize", kick);
  if (track) new IntersectionObserver(([e]) => { if (e.isIntersecting) kick(); }).observe(track);
  function frame(now) {
    const dt = Math.min(64, now - prevT); prevT = now;
    const y = scrollY, dy = y - lastY; lastY = y;
    if (dy) dir = dy > 0 ? -1 : 1;

    if (track && tickerOn) {
      vel = lerp(vel, Math.abs(dy) * 0.6, 0.12);
      tx += dir * (0.045 * dt + vel);
      const half = track.scrollWidth / 2;
      if (tx <= -half) tx += half; if (tx > 0) tx -= half;
      track.style.transform = `translate3d(${tx}px,0,0)`;
    }
    if (sunEl && y < vh() * 1.2) {
      sunEl.style.transform = `translate3d(0, ${y * 0.22}px, 0) rotate(${y * 0.02}deg)`;
    }
    if (storyTick) storyTick();
    if (samples.length) {
      const r = route.getBoundingClientRect();
      if (r.bottom > 0 && r.top < vh()) {
        const p = clamp((vh() * 0.85 - r.top) / (vh() * 0.5));
        const total = samples[samples.length - 1].d, pt = routeAt(p);
        routeLine.style.strokeDashoffset = total * (1 - p);
        routeCar.style.transform = `translate(${pt.x}px, ${pt.y}px)`;
        steps.forEach((s, k) => s.classList.toggle("is-reached", p >= [0.02, 0.5, 0.97][k]));
      }
    }
    if (tickerOn || now - lastScroll < 400) requestAnimationFrame(frame);
    else running = false;
  }
  kick();
})();
