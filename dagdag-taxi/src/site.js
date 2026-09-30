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

  // Tap or click any hand (logo, hero, footer, map) and it waves.
  document.addEventListener("pointerdown", (e) => {
    const holder = e.target.closest("[data-logo], .hdr-logo, [data-sun], .ftr-logo, .map-home");
    if (!holder) return;
    wave(holder.matches("[data-logo]") ? holder : $("[data-logo]", holder) || holder);
  });

  // Scrolling makes the header logo wave (at most once every 4 s), and every big hand
  // waves when it scrolls into view.
  let lastScrollWave = -1e9, lastScrollAt = 0, gestureStartY = scrollY;
  addEventListener("scroll", () => {
    const now = performance.now();
    if (now - lastScrollAt > 250) gestureStartY = scrollY; // a new scroll movement starts
    lastScrollAt = now;
    if (Math.abs(scrollY - gestureStartY) > 60 && now - lastScrollWave > 4000) {
      lastScrollWave = now;
      wave($(".hdr [data-logo]"));
    }
  }, { passive: true });
  const waveIO = new IntersectionObserver((entries) => entries.forEach((e) => { if (e.isIntersecting) wave(e.target); }), { threshold: 0.6 });
  $$(".sun [data-logo], .map-home [data-logo], .motif-art [data-logo]").forEach((el) => waveIO.observe(el));

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

  // ---------- Mobile call bar: hide it while the page's own call/WhatsApp buttons are visible ----------
  const bar = $("[data-callbar]");
  if (bar) {
    const shown = new Set();
    const cio = new IntersectionObserver((entries) => {
      entries.forEach((e) => (e.isIntersecting ? shown.add(e.target) : shown.delete(e.target)));
      document.body.classList.toggle("ctas-in-view", shown.size > 0);
    }, { threshold: 0.2 });
    $$("main .ctas").forEach((g) => cio.observe(g));
  }

  // ---------- Back to top ----------
  const totop = $("[data-totop]");
  if (totop) {
    const onTop = () => totop.classList.toggle("is-shown", scrollY > innerHeight * 1.2);
    onTop();
    addEventListener("scroll", onTop, { passive: true });
    totop.addEventListener("click", () => {
      scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" });
      $(".hdr-logo").focus({ preventScroll: true });
    });
  }

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
  $$(".reveal, [data-map], [data-day]").forEach((el) => io.observe(el));

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
    if (sunEl && y < vh() * 1.2 && innerWidth > 900) { // desktop only: on phones the sun sits in the flow and would slide over the ticker
      sunEl.style.transform = `translate3d(0, ${y * 0.22}px, 0) rotate(${y * 0.02}deg)`;
    }
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
