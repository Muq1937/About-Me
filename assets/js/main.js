/* =====================================================================
   supanut.status: rendering, live checks and animation.
   Everything renders from window.SITE (assets/js/content.js).
   No dependencies and no build step.
   ===================================================================== */
(() => {
  'use strict';

  const S = window.SITE;
  const root = document.documentElement;
  if (!S) { console.error('[portfolio] content.js did not load'); root.classList.add('is-ready'); return; }

  /* ---------- helpers ---------- */
  const $ = (sel, el = document) => el.querySelector(sel);
  const $$ = (sel, el = document) => Array.from(el.querySelectorAll(sel));
  const mqReduce = matchMedia('(prefers-reduced-motion: reduce)');
  const reduced = () => mqReduce.matches;
  const finePointer = matchMedia('(hover: hover) and (pointer: fine)').matches;
  const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, v));
  const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const nf = new Intl.NumberFormat('en-US');
  const num = (n) => nf.format(Math.round(n));
  const P = S.profile || {};
  const L = P.links || {};
  const C = S.checks || {};
  const FB = S.fallback || {};
  const TZ = P.timezone || 'Asia/Bangkok';
  const CITY = TZ.split('/').pop().replace(/_/g, ' ');
  const svcById = (id) => S.services.find((s) => s.id === id);
  const pipeById = (id) => S.pipelines.find((p) => p.id === id);
  const todoTag = (note = '') => `<span class="todo"${note ? ` title="${esc(note)}"` : ''}>todo</span>`;
  const ext = 'target="_blank" rel="noopener"';

  const fmtTime = new Intl.DateTimeFormat('en-GB', { timeZone: TZ, hour: '2-digit', minute: '2-digit', hourCycle: 'h23' });
  const fmtTimeSec = new Intl.DateTimeFormat('en-GB', { timeZone: TZ, hour: '2-digit', minute: '2-digit', second: '2-digit', hourCycle: 'h23' });
  const fmtDate = new Intl.DateTimeFormat('en-GB', { timeZone: TZ, day: 'numeric', month: 'short', year: 'numeric' });
  const fmtDayMonth = new Intl.DateTimeFormat('en-GB', { timeZone: TZ, day: 'numeric', month: 'short' });
  const fmtMonthYear = new Intl.DateTimeFormat('en-GB', { timeZone: 'UTC', month: 'short', year: 'numeric' });
  const fmtMonth = new Intl.DateTimeFormat('en-GB', { timeZone: 'UTC', month: 'short' });

  function tzOffset(date = new Date()) {
    const p = {};
    new Intl.DateTimeFormat('en-US', { timeZone: TZ, hourCycle: 'h23', year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit' })
      .formatToParts(date).forEach((x) => { p[x.type] = x.value; });
    return Date.UTC(+p.year, +p.month - 1, +p.day, +p.hour, +p.minute, +p.second) - Math.floor(date.getTime() / 1000) * 1000;
  }
  const OFFSET = tzOffset();
  const localMidnight = (t = Date.now()) => Math.floor((t + OFFSET) / 864e5) * 864e5 - OFFSET;
  function until(ms, compact = false) {
    const m = Math.max(0, Math.round(ms / 60000));
    if (m < 1) return compact ? 'now' : 'under a minute';
    if (m < 60) return compact ? `${m}m` : `${m} min`;
    const h = Math.floor(m / 60), r = m % 60;
    if (compact) return r ? `${h}h ${r}m` : `${h}h`;
    return r ? `${h} h ${r} min` : `${h} h`;
  }
  function ago(t) {
    const s = Math.max(0, Math.round((Date.now() - t) / 1000));
    if (s < 60) return `${s} s ago`;
    const m = Math.round(s / 60);
    if (m < 60) return `${m} min ago`;
    const h = Math.round(m / 60);
    if (h < 36) return `${h} h ago`;
    return `${Math.round(h / 24)} days ago`;
  }
  function span(ms) {
    const months = Math.max(0, Math.floor(ms / (30.44 * 864e5)));
    const y = Math.floor(months / 12), m = months % 12;
    return [y && `${y} yr`, m && `${m} mo`].filter(Boolean).join(' ') || 'under a month';
  }
  function partsDate(s) { // '2026-11-03' | '2026-10' | '2026' | ''
    const [y, m, d] = String(s || '').split('-').map(Number);
    return { y, m, d };
  }

  /* One rAF-throttled scroll/resize loop shared by every effect */
  const scrollFns = [];
  const onScroll = (fn) => scrollFns.push(fn);
  let ticking = false;
  const runScroll = () => { ticking = false; scrollFns.forEach((f) => f()); };
  const requestTick = () => { if (!ticking) { ticking = true; requestAnimationFrame(runScroll); } };
  addEventListener('scroll', requestTick, { passive: true });
  addEventListener('resize', requestTick);

  /* One 1-second ticker for clocks and countdowns */
  const tickFns = [];
  const onTick = (fn) => tickFns.push(fn);
  setInterval(() => { if (!document.hidden) tickFns.forEach((f) => f(Date.now())); }, 1000);

  /* ---------- icons ---------- */
  const ICONS = {
    search: '<circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/>',
    sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2.5v2M12 19.5v2M4.6 4.6 6 6M18 18l1.4 1.4M2.5 12h2M19.5 12h2M4.6 19.4 6 18M18 6l1.4-1.4"/>',
    moon: '<path d="M20 14.6A8 8 0 0 1 9.4 4a8 8 0 1 0 10.6 10.6z"/>',
    menu: '<path d="M4 7h16M4 12h16M4 17h16"/>',
    x: '<path d="M6 6l12 12M18 6 6 18"/>',
    'arrow-down': '<path d="M12 5v14M6 13l6 6 6-6"/>',
    'arrow-right': '<path d="M5 12h14M13 6l6 6-6 6"/>',
    'arrow-left': '<path d="M19 12H5M11 6l-6 6 6 6"/>',
    'arrow-up-right': '<path d="M7 17 17 7M8 7h9v9"/>',
    copy: '<rect x="9" y="9" width="11" height="11" rx="2.5"/><path d="M15 9V6.5A2.5 2.5 0 0 0 12.5 4h-6A2.5 2.5 0 0 0 4 6.5v6A2.5 2.5 0 0 0 6.5 15H9"/>',
    check: '<path d="m5 12.5 4.5 4.5L19 7.5"/>',
    mail: '<rect x="3" y="5" width="18" height="14" rx="2.5"/><path d="m4 7.5 8 5.5 8-5.5"/>',
    linkedin: '<rect x="3" y="3" width="18" height="18" rx="3.5"/><path d="M8 10.5V17M8 7.2v.1M12 17v-6.5M12 13.5a2.8 2.8 0 0 1 5 0V17"/>',
    file: '<path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z"/><path d="M14 3v5h5M9 13h6M9 17h4"/>',
    clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
    rss: '<path d="M5 11a8 8 0 0 1 8 8M5 5a14 14 0 0 1 14 14"/><circle cx="6" cy="18" r="1.3"/>',
    filter: '<path d="M4 5h16l-6.2 7.6V19l-3.6-1.8v-4.6z"/>',
    gauge: '<path d="M4.6 17a8.5 8.5 0 1 1 14.8 0"/><path d="m12 13.5 3.5-4.5"/><circle cx="12" cy="13.5" r="1.4"/>',
    pen: '<path d="M4 20l1.2-4.4L16.4 4.4a2 2 0 0 1 2.8 0l.4.4a2 2 0 0 1 0 2.8L8.4 18.8z"/><path d="m14.5 6.5 3 3"/>',
    shield: '<path d="M12 3l7.5 3v5.5c0 4.4-3.1 8-7.5 9.5-4.4-1.5-7.5-5.1-7.5-9.5V6z"/><path d="m9 12 2.2 2.2L15.5 10"/>',
    git: '<circle cx="6" cy="6" r="2.4"/><circle cx="6" cy="18" r="2.4"/><circle cx="18" cy="18" r="2.4"/><path d="M6 8.4v7.2M18 15.6V9.5A3.5 3.5 0 0 0 14.5 6H11M13.5 3.5 11 6l2.5 2.5"/>',
    globe: '<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c2.4 2.6 3.7 5.6 3.7 9s-1.3 6.4-3.7 9c-2.4-2.6-3.7-5.6-3.7-9S9.6 5.6 12 3z"/>',
    sheet: '<rect x="4" y="3" width="16" height="18" rx="2"/><path d="M4 9h16M4 15h16M10 3v18"/>',
    code: '<path d="m8 8-4 4 4 4M16 8l4 4-4 4M13.5 5l-3 14"/>',
    server: '<rect x="3.5" y="4" width="17" height="7" rx="2"/><rect x="3.5" y="13" width="17" height="7" rx="2"/><path d="M7.5 7.5h.01M7.5 16.5h.01"/>',
    database: '<ellipse cx="12" cy="5.5" rx="7.5" ry="2.8"/><path d="M4.5 5.5v13c0 1.5 3.4 2.8 7.5 2.8s7.5-1.3 7.5-2.8v-13M4.5 12c0 1.5 3.4 2.8 7.5 2.8s7.5-1.3 7.5-2.8"/>',
    layers: '<path d="m12 3 9 5-9 5-9-5z"/><path d="m3 13 9 5 9-5"/>',
    window: '<rect x="3" y="4" width="18" height="16" rx="2.5"/><path d="M3 9h18M6.5 6.5h.01M9.5 6.5h.01"/>',
    download: '<path d="M12 4v11M7 10l5 5 5-5M5 20h14"/>',
    upload: '<path d="M12 20V9M7 14l5-5 5 5M5 4h14"/>',
    graph: '<circle cx="6" cy="7" r="2.3"/><circle cx="18" cy="6" r="2.3"/><circle cx="12" cy="18" r="2.3"/><path d="M8.3 6.8 15.7 6.2M7.1 9.1l3.8 6.8M17 8.1l-3.9 7.8"/>',
    cpu: '<rect x="6" y="6" width="12" height="12" rx="2"/><path d="M9.5 9.5h5v5h-5zM9 2.5V6M15 2.5V6M9 18v3.5M15 18v3.5M2.5 9H6M2.5 15H6M18 9h3.5M18 15h3.5"/>',
    chart: '<path d="M4 4v16h16"/><path d="m7.5 15 3.5-4.5 3 3L19 7"/>',
    alert: '<path d="M12 3.5 21.5 20h-19z"/><path d="M12 10v4.5M12 17.4v.1"/>',
    replay: '<path d="M4.5 12a7.5 7.5 0 1 0 2.2-5.3"/><path d="M4 4.5v4.2h4.2"/>',
    lock: '<rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/>',
    info: '<circle cx="12" cy="12" r="9"/><path d="M12 11v5M12 7.9v.1"/>',
    award: '<circle cx="12" cy="9" r="6"/><path d="m8.6 13.9-1.6 7.1 5-2.8 5 2.8-1.6-7.1"/>',
    'map-pin': '<path d="M12 21s-7-6.1-7-11.5a7 7 0 0 1 14 0C19 14.9 12 21 12 21z"/><circle cx="12" cy="9.5" r="2.5"/>',
    activity: '<path d="M3 12h4l3-7 4 14 3-7h4"/>',
    rocket: '<path d="M5 15c-1.4 1.4-2 5-2 5s3.6-.6 5-2M9 15l-3-3c1.4-4.4 5.2-8.3 13-9-.7 7.8-4.6 11.6-9 13z"/><circle cx="15" cy="9" r="1.6"/>',
    cap: '<path d="m2.5 9 9.5-4.5L21.5 9 12 13.5z"/><path d="M6.5 11v4.6c3.2 2.5 7.8 2.5 11 0V11M21.5 9v5.5"/>',
    briefcase: '<rect x="3" y="7" width="18" height="13" rx="2.2"/><path d="M9 7V5.5A1.5 1.5 0 0 1 10.5 4h3A1.5 1.5 0 0 1 15 5.5V7M3 12.5h18"/>',
    terminal: '<rect x="3" y="4" width="18" height="16" rx="2.5"/><path d="m7 9 3 3-3 3M12.5 15H17"/>',
  };
  const FILLED = {
    github: '<path d="M12 .8a11.2 11.2 0 0 0-3.54 21.83c.56.1.77-.24.77-.54v-1.9c-3.12.68-3.78-1.5-3.78-1.5-.51-1.3-1.25-1.64-1.25-1.64-1.02-.7.08-.68.08-.68 1.13.08 1.72 1.16 1.72 1.16 1 1.72 2.63 1.22 3.27.94.1-.73.39-1.22.71-1.5-2.49-.29-5.11-1.25-5.11-5.55 0-1.22.44-2.23 1.16-3.02-.12-.28-.5-1.42.11-2.97 0 0 .94-.3 3.09 1.15a10.7 10.7 0 0 1 5.62 0c2.14-1.45 3.08-1.15 3.08-1.15.62 1.55.23 2.69.11 2.97.72.79 1.16 1.8 1.16 3.02 0 4.31-2.63 5.26-5.13 5.54.4.35.76 1.03.76 2.08v3.08c0 .3.2.65.78.54A11.2 11.2 0 0 0 12 .8z"/>',
  };
  function icon(name, cls = '') {
    if (FILLED[name]) return `<svg class="i i--fill${cls ? ' ' + cls : ''}" viewBox="0 0 24 24" aria-hidden="true" focusable="false">${FILLED[name]}</svg>`;
    return `<svg class="i${cls ? ' ' + cls : ''}" viewBox="0 0 24 24" aria-hidden="true" focusable="false">${ICONS[name] || ICONS.info}</svg>`;
  }
  const hydrateIcons = (scope = document) => $$('i[data-icon]', scope).forEach((el) => { el.outerHTML = icon(el.dataset.icon, el.className); });

  /* ---------- toast ---------- */
  let toastTimer = 0;
  function toast(html) {
    const t = $('#toast');
    t.innerHTML = html;
    t.classList.add('is-show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => t.classList.remove('is-show'), 2600);
  }
  async function copyText(text) {
    try {
      await navigator.clipboard.writeText(text);
      toast(`${icon('check')} Copied ${esc(text)}`);
    } catch (e) {
      toast(`${icon('info')} Couldn’t copy. Select it instead.`);
    }
  }
  async function copyEmail() {
    if (!P.email) { toast(`${icon('info')} Email not added yet`); return; }
    try {
      await navigator.clipboard.writeText(P.email);
      toast(`${icon('check')} Copied ${esc(P.email)}`);
    } catch (e) {
      location.href = `mailto:${P.email}`;
    }
  }

  /* ---------- theme ---------- */
  const themeBtn = $('#themeBtn');
  const metaTheme = $('meta[name="theme-color"]');
  const themeFns = [];
  function applyTheme(t, save = true) {
    root.dataset.theme = t;
    if (save) { try { localStorage.setItem('su-theme', t); } catch (e) { /* storage blocked */ } }
    if (metaTheme) metaTheme.content = t === 'dark' ? '#0E1013' : '#F6F3EE';
    themeBtn.setAttribute('aria-label', t === 'dark' ? 'Switch to light mode' : 'Switch to dark mode');
    themeFns.forEach((f) => f(t));
  }
  function toggleTheme(e) {
    const next = root.dataset.theme === 'dark' ? 'light' : 'dark';
    if (!document.startViewTransition || reduced()) { applyTheme(next); return; }
    const b = themeBtn.getBoundingClientRect();
    const fromPointer = e && e.detail > 0 && e.clientX;
    const x = fromPointer ? e.clientX : b.left + b.width / 2;
    const y = fromPointer ? e.clientY : b.top + b.height / 2;
    const r = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y));
    const vt = document.startViewTransition(() => applyTheme(next));
    vt.ready.then(() => root.animate(
      { clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${r}px at ${x}px ${y}px)`] },
      { duration: 700, easing: 'cubic-bezier(.22,1,.36,1)', pseudoElement: '::view-transition-new(root)' },
    )).catch(() => {});
  }
  matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
    let saved = null;
    try { saved = localStorage.getItem('su-theme'); } catch (_) { /* ignore */ }
    if (!saved) applyTheme(e.matches ? 'dark' : 'light', false);
  });

  /* ---------- count-up ---------- */
  function renderCount(el, v) {
    el.textContent = `${el.dataset.prefix || ''}${num(v)}${el.dataset.suffix || ''}`;
  }
  function countUp(el, to = Number(el.dataset.count), from = 0, dur = 1400) {
    if (!Number.isFinite(to)) return;
    el.dataset.counted = '1';
    if (reduced() || from === to) { renderCount(el, to); return; }
    const t0 = performance.now();
    const tick = (t) => {
      const k = clamp((t - t0) / dur, 0, 1);
      renderCount(el, from + (to - from) * (1 - Math.pow(1 - k, 3)));
      if (k < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }
  const countIO = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (!e.isIntersecting) return;
      countUp(e.target);
      countIO.unobserve(e.target);
    });
  }, { threshold: 0.6 });
  const observeCounts = (scope = document) => $$('[data-count]', scope).forEach((el) => { if (el.dataset.counted !== '1') countIO.observe(el); });

  /* ---------- live values (refreshed by the checks) ---------- */
  const liveVals = {};
  function setLive(key, val) {
    if (!Number.isFinite(val)) return;
    liveVals[key] = val;
    $$(`[data-live="${key}"]`).forEach((el) => {
      const was = Number(el.dataset.count);
      el.dataset.count = val;
      if (el.dataset.counted === '1' && was !== val) {
        countUp(el, val, was, 900);
        el.classList.remove('flash'); void el.offsetWidth; el.classList.add('flash');
      }
      const tile = el.closest('.tile');
      if (tile) tile.classList.add('is-live');
    });
  }

  /* =====================================================================
     PROFILE + HEADLINE
     ===================================================================== */
  function bindProfile() {
    const host = P.host || 'supanut.status';
    const map = {
      first: host.split('.')[0], host, name: P.name, initials: P.initials, lead: P.lead,
      status: P.status, city: CITY, where: [P.location, P.tzLabel].filter(Boolean).join(' · '),
    };
    $$('[data-bind]').forEach((el) => { const v = map[el.dataset.bind]; if (v) el.textContent = v; });
    $('#year').textContent = new Date().getFullYear();
    const dep = new Date(document.lastModified);
    if (!Number.isNaN(dep.getTime())) { $('#deployed').textContent = fmtDate.format(dep); $('#deployed').dateTime = dep.toISOString(); }
    $$('[data-enter]').forEach((el) => el.style.setProperty('--d', el.dataset.enter));
  }

  function renderHeadline() {
    const h = $('#heroTitle');
    const src = P.headline || h.textContent;
    const plain = src.replace(/\{([^|}]+)\|[^}]+\}/g, '$1');
    let i = 0, k = 0, html = '';
    src.replace(/\{([^|}]+)\|([^}]+)\}|([^{]+)/g, (m, word, area, text) => {
      if (word) {
        html += `<span class="w" style="--i:${i++}"><span class="kw a-${esc(area)}" data-area="${esc(area)}" style="--kd:${k++}">${esc(word)}</span></span>`;
      } else {
        text.split(/(\s+)/).forEach((t) => {
          if (!t) return;
          if (/^\s+$/.test(t)) html += ' ';
          else html += `<span class="w" style="--i:${i++}">${esc(t)}</span>`;
        });
      }
      return m;
    });
    h.innerHTML = html;
    h.setAttribute('aria-label', plain);
    document.title = `${P.name} · ${P.role || 'Developer'}`;
  }

  /* =====================================================================
     OVERVIEW CONSOLE: real checks from the visitor's browser
     ===================================================================== */
  const live = { mt: null, mtOk: null, mtMs: [], tc: null, tcOk: null, tcMs: 0, tcBytes: 0, lastCheck: 0 };
  const cert = (S.certifications || [])[0];
  const certUntil = cert ? new Date(`${cert.validUntil}T23:59:59+07:00`) : null;
  const certIssued = cert && cert.issued ? new Date(`${cert.issued}T00:00:00+07:00`) : null;

  function nextRun(now = Date.now()) {
    const { minute = 17, everyHours = 2 } = (C.changelog && C.changelog.cron) || {};
    const d = new Date(now);
    let t = Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate(), 0, minute);
    while (t <= now) t += everyHours * 3600e3;
    return t;
  }
  function runsToday(now = Date.now()) {
    const { minute = 17, everyHours = 2 } = (C.changelog && C.changelog.cron) || {};
    const start = localMidnight(now), end = start + 864e5;
    const d = new Date(start - 864e5);
    let t = Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate(), 0, minute);
    const out = [];
    for (; t < end; t += everyHours * 3600e3) if (t >= start) out.push(t);
    return out;
  }

  const CHECKS = [
    { id: 'mt', service: 'maklomthai', name: (C.maklomthai || {}).label || 'MaklomThai API', sub: (C.maklomthai || {}).path || '' },
    { id: 'tc', service: 'thai-changelog', name: (C.changelog || {}).label || 'Thailand Changelog', sub: (C.changelog || {}).path || '' },
    { id: 'ui', service: 'urban-issues' },
    { id: 'cert', service: 'hccda' },
  ];
  function checkAreas(c) {
    if (c.service === 'hccda') return ['cloud'];
    const s = svcById(c.service);
    return s ? s.areas : [];
  }

  function sparkSVG(vals) {
    const W = 96, H = 28;
    if (!vals.length) return `<svg viewBox="0 0 ${W} ${H}"><line class="spark__base" x1="0" y1="${H - 4}" x2="${W}" y2="${H - 4}"/></svg>`;
    const max = Math.max(250, ...vals) * 1.15;
    const pts = vals.map((v, i) => [vals.length === 1 ? W : (i / (vals.length - 1)) * W, H - 3 - (v / max) * (H - 6)]);
    if (pts.length === 1) pts.unshift([0, pts[0][1]]);
    const line = pts.map((p, i) => `${i ? 'L' : 'M'}${p[0].toFixed(1)} ${p[1].toFixed(1)}`).join(' ');
    const last = pts[pts.length - 1];
    return `<svg viewBox="0 0 ${W} ${H}"><path class="spark__area" d="${line} L${W} ${H} L0 ${H} Z"/><path class="spark__line" d="${line}"/><circle class="spark__dot" cx="${last[0].toFixed(1)}" cy="${last[1].toFixed(1)}" r="2.4"/></svg>`;
  }
  function slotsSVG(now = Date.now()) {
    const runs = runsToday(now);
    const next = runs.find((t) => t > now);
    const w = 5.6, gap = 2.6;
    return `<svg viewBox="0 0 96 28"><title>Today’s ${runs.length} scheduled runs (${esc(CITY)} time)</title>${runs.map((t, i) => {
      const cls = t <= now ? 'is-done' : t === next ? 'is-next' : '';
      return `<rect class="slot ${cls}" x="${(i * (w + gap)).toFixed(1)}" y="5" width="${w}" height="18" rx="1.6"><title>${fmtTime.format(t)}</title></rect>`;
    }).join('')}</svg>`;
  }
  function validitySVG() {
    if (!certUntil) return '';
    const start = certIssued ? certIssued.getTime() : certUntil.getTime() - 3 * 365.25 * 864e5;
    const left = clamp((certUntil - Date.now()) / (certUntil - start), 0, 1);
    return `<svg viewBox="0 0 96 28"><rect x="0" y="11" width="96" height="6" rx="3" fill="var(--sunk)"/><rect x="${(96 * (1 - left)).toFixed(1)}" y="11" width="${(96 * left).toFixed(1)}" height="6" rx="3" fill="var(--ok)"/></svg>`;
  }

  function renderChecks() {
    const ui = svcById('urban-issues');
    $('#checks').innerHTML = CHECKS.map((c) => {
      let name = c.name, sub = c.sub;
      if (c.id === 'ui' && ui) { name = ui.name; sub = `course project · ${ui.since}`; }
      if (c.id === 'cert' && cert) { name = `${cert.issuer} HCCDA`; sub = 'certificate'; }
      return `<li class="check" data-check="${c.id}" data-areas="${checkAreas(c).join(' ')}">
        <span class="dot dot--pending"></span>
        <span class="check__main"><span class="check__name">${esc(name)}</span><span class="check__sub mono">${esc(sub)}</span></span>
        <span class="check__viz" aria-hidden="true"></span>
        <span class="check__val mono">…</span>
      </li>`;
    }).join('');
    updateRows();
  }
  function setRow(id, state, val, viz) {
    const row = $(`.check[data-check="${id}"]`);
    if (!row) return;
    row.querySelector('.dot').className = `dot dot--${state}`;
    if (val !== undefined) row.querySelector('.check__val').textContent = val;
    if (viz !== undefined) row.querySelector('.check__viz').innerHTML = viz;
  }
  function updateRows(now = Date.now()) {
    // MaklomThai API
    if (live.mtOk === null) setRow('mt', 'pending', '…', sparkSVG([]));
    else if (live.mtOk) setRow('mt', 'ok', `${Math.round(live.mtMs[live.mtMs.length - 1])} ms`, sparkSVG(live.mtMs));
    else setRow('mt', 'warn', 'no reply', sparkSVG(live.mtMs));
    // Thailand Changelog
    const nr = nextRun(now);
    setRow('tc', live.tcOk === null ? 'pending' : live.tcOk ? 'ok' : 'warn', `in ${until(nr - now, true)}`, slotsSVG(now));
    // archived project and certificate
    setRow('ui', 'off', 'Archived', '<svg viewBox="0 0 96 28"><line class="spark__base" x1="0" y1="14" x2="96" y2="14"/></svg>');
    if (certUntil) setRow('cert', certUntil > now ? 'ok' : 'warn', certUntil > now ? 'Valid' : 'Expired', validitySVG());
  }

  function log(type, html, cls = '') {
    const ol = $('#log');
    const li = document.createElement('li');
    li.innerHTML = `<time>${fmtTimeSec.format(new Date())}</time><b class="${cls}">${esc(type)}</b><span>${html}</span>`;
    ol.appendChild(li);
    while (ol.children.length > 7) ol.firstElementChild.remove();
  }

  async function timed(url, timeout = 9000) {
    const ctl = new AbortController();
    const timer = setTimeout(() => ctl.abort(), timeout);
    const t0 = performance.now();
    try {
      const res = await fetch(url, { signal: ctl.signal, cache: 'no-store', credentials: 'omit' });
      const text = await res.text();
      const ms = performance.now() - t0;
      let data = null;
      try { data = JSON.parse(text); } catch (e) { /* not JSON */ }
      return { ok: res.ok, status: res.status, ms, data, bytes: new Blob([text]).size };
    } catch (e) {
      return { ok: false, status: 0, ms: performance.now() - t0, data: null, error: e };
    } finally {
      clearTimeout(timer);
    }
  }

  function mtData() { return live.mt || FB.maklomthai || {}; }
  function tcData() { return live.tc || FB.changelog || { entries: [] }; }

  async function checkMT(verbose) {
    if (!C.maklomthai) return;
    const r = await timed(C.maklomthai.url);
    const ok = r.ok && r.data && typeof r.data.totalMatches === 'number';
    live.mtOk = ok;
    live.lastCheck = Date.now();
    if (ok) {
      live.mt = r.data;
      live.mtMs.push(r.ms);
      if (live.mtMs.length > 18) live.mtMs.shift();
      setLive('mt.totalMatches', r.data.totalMatches);
      setLive('mt.totalPlayers', r.data.totalPlayers);
      log('GET', `/api/meta → ${r.status} · ${Math.round(r.ms)} ms${verbose && r.ms > 500 ? ' (cold start)' : ''}`, 'l-ok');
      if (verbose && r.ms > 500) {
        const w = await timed(C.maklomthai.url);
        if (w.ok) { live.mtMs.push(w.ms); log('GET', `/api/meta → ${w.status} · ${Math.round(w.ms)} ms (warm)`, 'l-ok'); }
      }
      if (verbose) {
        const lm = r.data.latestMatchDate ? ` · last match ${fmtDayMonth.format(new Date(`${r.data.latestMatchDate}T12:00:00Z`))}` : '';
        log('data', `${num(r.data.totalMatches)} matches · ${num(r.data.totalPlayers)} players${lm}`, 'l-data');
      }
    } else {
      log('GET', `/api/meta → ${r.status || 'no reply'} · showing saved numbers`, 'l-warn');
    }
    updateRows();
    updateSummary();
    refreshInspectorLive();
  }

  async function checkTC() {
    if (!C.changelog) return;
    const r = await timed(C.changelog.url, 12000);
    const ok = r.ok && r.data && Array.isArray(r.data.entries);
    live.tcOk = ok;
    live.lastCheck = Date.now();
    if (ok) {
      live.tc = r.data;
      live.tcMs = r.ms;
      live.tcBytes = r.bytes;
      setLive('tc.count', r.data.entries.length);
      log('GET', `/entries.json → ${r.status} · ${Math.round(r.bytes / 1024)} KB · ${Math.round(r.ms)} ms`, 'l-ok');
      const e = r.data.entries[0];
      if (e) log('feed', `${r.data.entries.length} notes · newest [${esc((e.tag || '').toUpperCase())}] ${esc((e.title && e.title.en) || e.title)}`, 'l-data');
    } else {
      log('GET', `/entries.json → ${r.status || 'no reply'} · showing saved notes`, 'l-warn');
    }
    renderPatches();
    updateRows();
    updateSummary();
    refreshInspectorLive();
  }

  function updateSummary() {
    const sum = $('#sum');
    const done = live.mtOk !== null && live.tcOk !== null;
    const failed = [live.mtOk === false && 'MaklomThai', live.tcOk === false && 'Thailand Changelog'].filter(Boolean);
    let state = 'pending', title = 'Checking services…', sub = 'asking from your browser';
    if (done && !failed.length) {
      state = 'ok';
      title = 'All systems normal';
      sub = `2 live checks passed · API ${Math.round(live.mtMs[live.mtMs.length - 1])} ms`;
    } else if (done) {
      state = 'warn';
      title = navigator.onLine === false ? 'You’re offline' : 'Partly unreachable';
      sub = `couldn’t reach ${failed.join(' and ')} from here`;
    }
    sum.dataset.state = state;
    $('#sumTitle').textContent = title;
    $('#sumSub').textContent = sub;
    if (state !== 'pending') {
      $('#heroStatus').textContent = state === 'ok' ? 'All systems normal' : 'Some checks failed';
      $('#heroDot').className = `dot dot--${state}`;
      $('#brandDot').classList.toggle('is-warn', state === 'warn');
    }
  }

  function initConsole() {
    renderChecks();
    let started = false, visible = false, pings = 0, lastDue = 0;
    const every = Math.max(10, (C.maklomthai && C.maklomthai.every) || 30) * 1000;
    let lastPing = 0;
    async function boot() {
      started = true;
      lastPing = Date.now();
      log('boot', `checking 2 services from your browser`, 'l-fs');
      await checkMT(true);
      await checkTC();
      const nr = nextRun();
      log('cron', `news-check next at ${fmtTime.format(nr)} (in ${until(nr - Date.now())})`, 'l-cloud');
      if (certUntil) log('cert', `HCCDA valid for ${num((certUntil - Date.now()) / 864e5)} more days`, 'l-ok');
      lastPing = Date.now();
    }
    new IntersectionObserver(([e]) => {
      visible = e.isIntersecting;
      if (visible && !started) boot();
    }, { threshold: 0.2 }).observe($('#console'));
    // run the first checks even if the visitor lands further down the page
    setTimeout(() => { if (!started) boot(); }, 1200);
    // the hero clock + countdowns + periodic ping
    const clock = $('#heroClock');
    onTick((now) => {
      clock.textContent = fmtTime.format(now);
      clock.dateTime = new Date(now).toISOString();
      if (live.lastCheck) $('#sumAgo').textContent = `checked ${ago(live.lastCheck)}`;
      if (new Date(now).getSeconds() === 0 || !updateRows.once) { updateRows(now); updateRows.once = true; }
      const due = nextRun(now - 60e3);
      if (started && due <= now && due !== lastDue && now - due < 60e3) {
        lastDue = due;
        log('cron', 'news-check is due now (GitHub often starts it a few minutes late)', 'l-cloud');
      }
      if (started && visible && pings < 40 && now - lastPing >= every) {
        lastPing = now;
        pings++;
        checkMT(false);
      }
    });
    clock.textContent = fmtTime.format(new Date());
  }

  /* hover a headline keyword to light up matching rows */
  function initKeywords() {
    const rows = () => $$('.check');
    $$('.kw').forEach((kw) => {
      const area = kw.dataset.area;
      const on = () => {
        kw.classList.add('is-hot');
        rows().forEach((r) => { const hit = r.dataset.areas.split(' ').includes(area); r.classList.toggle('is-hl', hit); r.classList.toggle('is-dim', !hit); });
      };
      const off = () => { kw.classList.remove('is-hot'); rows().forEach((r) => r.classList.remove('is-hl', 'is-dim')); };
      kw.addEventListener('pointerenter', on);
      kw.addEventListener('pointerleave', off);
    });
  }

  /* =====================================================================
     TELEMETRY TILES
     ===================================================================== */
  function ringSVG(frac) {
    const r = 24, c = 2 * Math.PI * r;
    return `<svg viewBox="0 0 60 60"><circle class="ring__track" cx="30" cy="30" r="${r}" stroke-width="6"/><circle class="ring__fill" cx="30" cy="30" r="${r}" stroke-width="6" stroke-dasharray="${c.toFixed(2)}" stroke-dashoffset="${c.toFixed(2)}" data-off="${(c * (1 - frac)).toFixed(2)}" transform="rotate(-90 30 30)"/></svg>`;
  }
  function clockSVG(now = Date.now()) {
    const start = localMidnight(now);
    const runs = runsToday(now);
    const next = runs.find((t) => t > now);
    const ang = (t) => ((t - start) / 864e5) * 360 - 90;
    const ticks = runs.map((t) => {
      const a = (ang(t) * Math.PI) / 180;
      const cls = t <= now ? 'is-done' : t === next ? 'is-next' : '';
      return `<line class="clk__tick ${cls}" x1="${(30 + Math.cos(a) * 19).toFixed(1)}" y1="${(30 + Math.sin(a) * 19).toFixed(1)}" x2="${(30 + Math.cos(a) * 25).toFixed(1)}" y2="${(30 + Math.sin(a) * 25).toFixed(1)}"/>`;
    }).join('');
    return `<svg viewBox="0 0 60 60"><title>Today’s runs on a 24-hour dial</title><circle class="clk__face" cx="30" cy="30" r="28"/>${ticks}<line class="clk__hand" x1="30" y1="30" x2="30" y2="15" style="transform: rotate(${(ang(now) + 90).toFixed(1)}deg)"/><circle cx="30" cy="30" r="2.6" fill="var(--ink)"/></svg>`;
  }
  function renderTelemetry() {
    const ul = $('#telemetry');
    ul.innerHTML = (S.telemetry || []).map((t, i) => {
      let viz = '';
      if (t.id === 'loop') viz = ringSVG(t.of ? t.value / t.of : 1);
      else if (t.id === 'runs') viz = clockSVG();
      else if (t.id === 'matches') viz = `<span class="tile__ico a-data">${icon('activity')}</span>`;
      else if (t.id === 'players') viz = `<span class="tile__ico a-fs">${icon('graph')}</span>`;
      return `<li class="tile" data-reveal style="--rd:${i * 80}ms" data-tile="${esc(t.id)}">
        <span class="tile__num" data-count="${t.value}"${t.live ? ` data-live="${esc(t.live)}"` : ''}>${num(t.value)}</span>
        <span class="tile__label">${esc(t.label)}</span>
        <span class="tile__src mono"><span class="dot dot--ok"></span>${esc(t.source)}${t.live ? '<span class="tile__live"> · live</span>' : ''}${t.of ? ` · of ${num(t.of)}` : ''}</span>
        <span class="tile__viz" aria-hidden="true">${viz}</span>
      </li>`;
    }).join('');
    onTick((now) => { if (new Date(now).getSeconds() === 0) { const v = $('[data-tile="runs"] .tile__viz', ul); if (v) v.innerHTML = clockSVG(now); } });
  }

  /* =====================================================================
     SERVICES
     ===================================================================== */
  function statusBadge(s) {
    return s.status === 'operational'
      ? '<span class="badge badge--ok"><span class="dot"></span>Operational</span>'
      : '<span class="badge badge--off"><span class="dot"></span>Archived</span>';
  }
  const areaChips = (s) => `<ul class="areas">${s.areas.map((a) => `<li class="area a-${a}">${esc((S.areas.find((x) => x.id === a) || {}).label || a)}</li>`).join('')}</ul>`;
  function metricsHTML(s) {
    return (s.metrics || []).map((m) => {
      const v = m.live && liveVals[m.live] !== undefined ? liveVals[m.live] : m.value;
      return `<div><dt>${esc(m.label)}</dt><dd data-count="${v}"${m.live ? ` data-live="${esc(m.live)}"` : ''}${m.prefix ? ` data-prefix="${esc(m.prefix)}"` : ''}${m.suffix ? ` data-suffix="${esc(m.suffix)}"` : ''}>${esc(m.prefix || '')}${num(v)}${esc(m.suffix || '')}</dd></div>`;
    }).join('');
  }
  const shot = (src, theme) => src.replace('{theme}', theme);
  function shotImgs(sh, eager = false, sizes = '') {
    const attrs = `alt="${esc(sh.alt)}" width="1200" height="750" decoding="async"${eager ? '' : ' loading="lazy"'}${sizes ? ` sizes="${sizes}"` : ''}`;
    return `<img class="shot--light" src="${esc(shot(sh.src, 'light'))}" ${attrs}><img class="shot--dark" src="${esc(shot(sh.src, 'dark'))}" ${attrs}>`;
  }
  function rng(seed) {
    let s = seed >>> 0;
    return () => {
      s = (s + 0x6D2B79F5) >>> 0;
      let t = s;
      t = Math.imul(t ^ (t >>> 15), t | 1);
      t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }
  function coverForecast() {
    const R = rng(1500);
    const x0 = 86, x1 = 386, xNow = 304, base = 120;
    const n = 34, spikes = [8, 19, 28];
    const pts = [];
    for (let i = 0; i < n; i++) {
      const x = x0 + ((xNow - x0) * i) / (n - 1);
      let y = base - Math.sin(i / 4.6) * 16 - Math.sin(i / 1.9) * 5 - (R() - 0.5) * 16;
      if (spikes.includes(i)) y -= 30;
      pts.push([x, y]);
    }
    const up = [], dn = [], fc = [pts[n - 1]];
    for (let j = 1; j <= 10; j++) {
      const x = xNow + ((x1 - xNow) * j) / 10;
      const y = base - Math.sin((n - 1 + j) / 4.6) * 16;
      fc.push([x, y]);
      up.push([x, y - 5 - j * 2.2]);
      dn.push([x, y + 5 + j * 2.2]);
    }
    const d = (a) => a.map((p, i) => `${i ? 'L' : 'M'}${p[0].toFixed(1)} ${p[1].toFixed(1)}`).join(' ');
    const len = (a) => a.reduce((s, p, i) => (i ? s + Math.hypot(p[0] - a[i - 1][0], p[1] - a[i - 1][1]) : 0), 0);
    const band = `M${xNow} ${pts[n - 1][1].toFixed(1)} ${up.map((p) => `L${p[0].toFixed(1)} ${p[1].toFixed(1)}`).join(' ')} ${dn.reverse().map((p) => `L${p[0].toFixed(1)} ${p[1].toFixed(1)}`).join(' ')} Z`;
    let heat = '';
    for (let r = 0; r < 3; r++) {
      for (let c = 0; c < 24; c++) {
        const near = spikes.some((s) => Math.abs(c - s * 0.7) < 1.5);
        heat += `<rect class="cv-heat" x="${(86 + c * 12.5).toFixed(1)}" y="${200 + r * 13}" width="10.5" height="10.5" rx="2" fill-opacity="${(near ? 0.75 : 0.1 + R() * 0.45).toFixed(2)}"/>`;
      }
    }
    const tabs = [['Map', 86, 40], ['Districts', 132, 62], ['Forecast', 200, 62, 1], ['Anomalies', 268, 70]];
    return `<svg class="cover" viewBox="0 0 400 250" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      <rect class="cv-bg" width="400" height="250"/>
      <rect class="cv-side" x="-1" y="-1" width="66" height="252"/>
      ${[40, 58, 76, 94, 112].map((y, i) => `<rect class="cv-tab${i === 2 ? ' is-on' : ''}" x="12" y="${y}" width="${i === 2 ? 42 : 34 - i * 2}" height="8" rx="4"/>`).join('')}
      <circle cx="22" cy="20" r="7" class="cv-tab is-on"/>
      ${tabs.map(([t, x, w, on]) => `<rect class="cv-tab${on ? ' is-on' : ''}" x="${x}" y="12" width="${w}" height="20" rx="10"/><text class="cv-txt${on ? ' is-on' : ''}" x="${x + w / 2}" y="25" text-anchor="middle">${t}</text>`).join('')}
      ${[60, 92, 124, 156].map((y) => `<line class="cv-grid" x1="86" y1="${y}" x2="386" y2="${y}"/>`).join('')}
      <path class="cv-band" d="${band}"/>
      <line class="cv-now" x1="${xNow}" y1="48" x2="${xNow}" y2="184"/>
      <text class="cv-txt" x="${xNow + 5}" y="56">forecast</text>
      <path class="cv-actual cv-draw" style="--len:${len(pts).toFixed(0)}" d="${d(pts)}"/>
      <path class="cv-fc cv-draw" style="--len:${len(fc).toFixed(0)}" d="${d(fc)}"/>
      ${spikes.map((i) => `<circle class="cv-anom" cx="${pts[i][0].toFixed(1)}" cy="${pts[i][1].toFixed(1)}" r="5.5"/>`).join('')}
      ${heat}
    </svg>`;
  }

  function serviceMedia(s, feature) {
    const host = s.host || '';
    const view = s.shots && s.shots.length
      ? shotImgs(s.shots[0], false, feature ? '(min-width: 900px) 640px, 100vw' : '(min-width: 900px) 560px, 100vw')
      : coverForecast();
    return `<div class="svc__media"><div class="frame">
      <div class="frame__bar"><i></i><i></i><i></i><span class="frame__url mono">${icon(s.links && s.links.live ? 'lock' : 'terminal')}${esc(host)}</span></div>
      <div class="frame__view">${view}</div>
    </div></div>`;
  }
  function serviceLinks(s, big = false) {
    const out = [];
    if (s.links.live) out.push(`<a class="btn btn--ghost${big ? '' : ' btn--sm'}" href="${esc(s.links.live)}" ${ext}>Live site ${icon('arrow-up-right')}</a>`);
    if (s.links.repo) out.push(`<a class="btn btn--ghost${big ? '' : ' btn--sm'}" href="${esc(s.links.repo)}" ${ext}>${icon('github')}${esc(s.links.repoLabel || 'Code')}</a>`);
    return out.join('');
  }

  function renderServices() {
    const grid = $('#svcGrid');
    grid.innerHTML = S.services.map((s, i) => {
      const feature = i === 0;
      const patch = s.id === 'thai-changelog' ? '<a class="patch" id="tcPatch" href="' + esc(s.links.live) + '" ' + ext + '></a>' : '';
      return `<article class="svc${feature ? ' svc--feature' : ''}" id="svc-${esc(s.id)}" data-areas="${s.areas.join(' ')}" data-reveal style="--rd:${feature ? 0 : (i - 1) * 90}ms">
        <span class="svc__glow" aria-hidden="true"></span>
        ${serviceMedia(s, feature)}
        <div class="svc__body">
          <div class="svc__top">${statusBadge(s)}<span class="svc__host mono">${esc(s.platform)} · since ${esc(s.since)}</span></div>
          <div>
            <span class="svc__kicker">${esc(s.kicker)}</span>
            <h3 class="svc__title">${esc(s.name)}${s.native ? `<span class="th">${esc(s.native)}</span>` : ''}</h3>
          </div>
          <p class="svc__tagline">${esc(s.tagline)}</p>
          ${areaChips(s)}
          ${patch}
          <dl class="metrics">${metricsHTML(s)}</dl>
          <div class="svc__actions">
            <button class="btn btn--ink btn--sm" type="button" data-open="${esc(s.id)}">Service details ${icon('arrow-right')}</button>
            ${serviceLinks(s)}
          </div>
        </div>
      </article>`;
    }).join('');
    renderPatches();
    if (finePointer) {
      $$('.svc', grid).forEach((card) => card.addEventListener('pointermove', (e) => {
        const r = card.getBoundingClientRect();
        card.style.setProperty('--mx', `${e.clientX - r.left}px`);
        card.style.setProperty('--my', `${e.clientY - r.top}px`);
      }));
    }
    $$('.svc__media', grid).forEach((m) => {
      m.style.cursor = 'zoom-in';
      m.addEventListener('click', () => openService(m.closest('.svc').id.replace(/^svc-/, '')));
    });
  }
  function renderPatches() {
    const el = $('#tcPatch');
    if (!el) return;
    const data = tcData();
    const e = (data.entries || [])[0];
    if (!e) { el.hidden = true; return; }
    const title = (e.title && e.title.en) || e.title;
    const src = (e.source && e.source.name && e.source.name.en) || e.source || '';
    const when = e.date ? `${fmtDayMonth.format(new Date(`${e.date}T12:00:00Z`))} · ${e.time || ''}` : '';
    el.hidden = false;
    el.className = `patch t-${esc(e.tag)}`;
    el.innerHTML = `<span class="patch__label"><span class="dot dot--${live.tcOk ? 'ok' : 'off'}"></span>${live.tcOk ? 'Latest patch note, live' : 'Latest patch note'}</span>
      <span class="patch__tag">[${esc(String(e.tag || '').toUpperCase())}]</span><span class="patch__title">${esc(title)}</span>
      <span class="patch__meta">${esc(when)}${src ? ` · ${esc(src)}` : ''}</span>`;
  }

  function initFocus() {
    const seg = $('#focusSeg');
    const ind = $('.seg__ind', seg);
    const opts = [{ id: 'all', label: 'All', n: S.services.length }].concat(S.areas.map((a) => ({ ...a, n: S.services.filter((s) => s.areas.includes(a.id)).length })));
    seg.insertAdjacentHTML('beforeend', opts.map((o, i) => `<button type="button" data-focus="${o.id}" aria-pressed="${i === 0}" class="${o.id === 'all' ? '' : 'a-' + o.id}">${o.id === 'all' ? '' : '<span class="sw"></span>'}${esc(o.label)}<span class="n">${o.n}</span></button>`).join(''));
    const btns = $$('button', seg);
    const moveInd = () => {
      const b = btns.find((x) => x.getAttribute('aria-pressed') === 'true');
      if (!b) return;
      ind.style.width = `${b.offsetWidth}px`;
      ind.style.transform = `translate(${b.offsetLeft}px, ${b.offsetTop - 4}px)`;
    };
    function apply(id) {
      btns.forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.focus === id)));
      $$('.svc').forEach((card) => {
        const hit = id === 'all' || card.dataset.areas.split(' ').includes(id);
        card.classList.toggle('is-dim', !hit);
        card.classList.toggle('is-focus', id !== 'all' && hit);
        card.style.setProperty('--kc', id === 'all' ? '' : `var(--a-${id})`);
      });
      moveInd();
    }
    seg.addEventListener('click', (e) => { const b = e.target.closest('button[data-focus]'); if (b) apply(b.dataset.focus); });
    addEventListener('resize', moveInd);
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(moveInd);
    requestAnimationFrame(moveInd);
  }

  /* =====================================================================
     PIPELINES: linear flows with animated "packets"
     ===================================================================== */
  const KIND_LABEL = { trigger: 'trigger', source: 'source', filter: 'filter', model: 'model', check: 'check', git: 'git', deploy: 'deploy', api: 'API', store: 'storage', job: 'job', app: 'app', human: 'people', transform: 'transform' };
  let refreshInspectorLive = () => {};
  let showPipe = () => {};

  function initPipelines() {
    const NS = 'http://www.w3.org/2000/svg';
    const tabs = $('#pipeTabs'), nodesEl = $('#flowNodes'), svg = $('#flowSvg'), flow = $('#flow'), insp = $('#inspector'), tallyEl = $('#flowTally');
    let tally = { in: 0, out: 0, drop: {} };
    let pipe = null, sel = 0, segs = [], packets = [], layer = null, raf = 0, lastT = 0, spawnIn = 0, visible = false, seen = false, sig = '';

    tabs.innerHTML = S.pipelines.map((p, i) => `<button class="ptab a-${esc(p.area || 'fs')}" type="button" role="tab" id="ptab-${esc(p.id)}" data-pipe="${esc(p.id)}" aria-selected="${i === 0}" aria-controls="pipePanel" tabindex="${i === 0 ? 0 : -1}"><span class="sw"></span>${esc(p.title)}<span class="ptab__s">${esc(p.schedule)}</span></button>`).join('');

    function liveHTML(kind) {
      const now = Date.now();
      if (kind === 'nextRun') {
        const nr = nextRun(now);
        return `<span class="dot dot--ok"></span><span>Next scheduled run at <b>${fmtTime.format(nr)}</b> ${esc(CITY)} time, in ${until(nr - now)}. GitHub can start scheduled runs a few minutes late.</span>`;
      }
      if (kind === 'feed') {
        const d = tcData();
        const e = (d.entries || [])[0];
        const t = e ? esc((e.title && e.title.en) || e.title) : '';
        const head = live.tcOk ? `Live: entries.json was generated ${ago(new Date(d.generated).getTime())} and holds ${d.entries.length} patch notes.` : `Saved copy: ${d.count || (d.entries || []).length} patch notes.`;
        return `<span class="dot dot--${live.tcOk ? 'ok' : 'off'}"></span><span>${head}${t ? ` Newest: <a href="${esc((S.services.find((s) => s.id === 'thai-changelog') || {}).links.live)}" ${ext}>${t}</a>` : ''}</span>`;
      }
      if (kind === 'mtPing') {
        if (live.mtOk) return `<span class="dot dot--ok"></span><span>Your browser reached it in <b>${Math.round(live.mtMs[live.mtMs.length - 1])} ms</b>, ${ago(live.lastCheck)}.</span>`;
        return `<span class="dot dot--${live.mtOk === false ? 'warn' : 'pending'}"></span><span>${live.mtOk === false ? 'Couldn’t reach it from your browser just now.' : 'Waiting for the first check…'}</span>`;
      }
      if (kind === 'mtBuilt') {
        const m = mtData();
        const when = m.builtAt ? ago(new Date(m.builtAt).getTime()) : 'recently';
        return `<span class="dot dot--${live.mtOk ? 'ok' : 'off'}"></span><span>${live.mtOk ? 'Live from /api/meta' : 'Saved copy'}: the last rebuild was ${when}, covering ${num(m.totalMatches)} matches and ${num(m.totalPlayers)} players.</span>`;
      }
      return '';
    }
    refreshInspectorLive = () => { $$('[data-insp-live]', insp).forEach((el) => { el.innerHTML = liveHTML(el.dataset.inspLive); }); };
    onTick((now) => { if (new Date(now).getSeconds() % 15 === 0) refreshInspectorLive(); });

    function select(i) {
      sel = clamp(i, 0, pipe.nodes.length - 1);
      $$('.node', nodesEl).forEach((b, k) => b.setAttribute('aria-pressed', String(k === sel)));
      const n = pipe.nodes[sel];
      insp.className = `inspector k-${esc(n.kind)}`;
      insp.innerHTML = `<div class="insp-in">
          <span class="insp__kind"><span class="dot"></span>step ${sel + 1} of ${pipe.nodes.length} · ${esc(KIND_LABEL[n.kind] || n.kind)}</span>
          <h3 class="insp__title">${esc(n.label)}${n.mine ? ' <span class="todo" style="border-color:var(--a-data);color:var(--a-data);border-style:solid">my part</span>' : ''}</h3>
          <p class="insp__text">${esc(n.text)}</p>
          ${n.code ? `<pre class="insp__code">${esc(n.code)}</pre>` : ''}
          ${n.live ? `<div class="insp__live" data-insp-live="${esc(n.live)}">${liveHTML(n.live)}</div>` : ''}
        </div>
        <div class="insp__nav"><button type="button" data-step="-1"${sel === 0 ? ' disabled' : ''}>${icon('arrow-left')}Previous</button><button type="button" data-step="1"${sel === pipe.nodes.length - 1 ? ' disabled' : ''}>Next${icon('arrow-right')}</button></div>`;
    }

    function pathBetween(a, b) {
      const sameRow = Math.abs(a.y - b.y) < a.h / 2;
      if (sameRow) {
        const y = a.y + a.h / 2;
        return `M${(a.x + a.w + 3).toFixed(1)} ${y.toFixed(1)} L${(b.x - 7).toFixed(1)} ${(b.y + b.h / 2).toFixed(1)}`;
      }
      const x1 = a.x + a.w / 2, y1 = a.y + a.h + 3, x2 = b.x + b.w / 2, y2 = b.y - 7;
      if (Math.abs(x1 - x2) < 2) return `M${x1.toFixed(1)} ${y1.toFixed(1)} L${x2.toFixed(1)} ${y2.toFixed(1)}`;
      const ym = (a.y + a.h + b.y) / 2;
      const r = Math.min(14, (y2 - y1) / 2, Math.abs(x1 - x2) / 2);
      const s = x2 < x1 ? -1 : 1;
      return `M${x1.toFixed(1)} ${y1.toFixed(1)} L${x1.toFixed(1)} ${(ym - r).toFixed(1)} Q${x1.toFixed(1)} ${ym.toFixed(1)} ${(x1 + s * r).toFixed(1)} ${ym.toFixed(1)} L${(x2 - s * r).toFixed(1)} ${ym.toFixed(1)} Q${x2.toFixed(1)} ${ym.toFixed(1)} ${x2.toFixed(1)} ${(ym + r).toFixed(1)} L${x2.toFixed(1)} ${y2.toFixed(1)}`;
    }

    function layout(force = false) {
      if (!flow.clientWidth) return;
      // Measure layout boxes (offsets), not on-screen rects, so the nodes' entrance transform
      // can't skew the paths. The SVG has no viewBox: its units are CSS pixels from the flow's
      // top-left corner, so nothing rescales when the inspector makes the panel taller.
      const ox = nodesEl.offsetLeft, oy = nodesEl.offsetTop;
      const rects = $$('.node', nodesEl).map((el) => ({ x: ox + el.offsetLeft, y: oy + el.offsetTop, w: el.offsetWidth, h: el.offsetHeight }));
      const s = `${flow.clientWidth}|${rects.map((r) => `${r.x},${r.y},${r.w},${r.h}`).join(';')}`;
      if (!force && s === sig) return;
      sig = s;
      svg.removeAttribute('viewBox');
      let html = '<defs><marker id="flowArrow" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path class="flow__arrow" d="M1 1.5 8 5 1 8.5z"/></marker></defs>';
      segs = [];
      for (let i = 0; i < rects.length - 1; i++) {
        html += `<path class="flow__base" d="${pathBetween(rects[i], rects[i + 1])}" marker-end="url(#flowArrow)" style="--i:${i}"/>`;
      }
      html += '<g class="flow__pk"></g>';
      svg.innerHTML = html;
      layer = $('.flow__pk', svg);
      $$('.flow__base', svg).forEach((p) => {
        const len = p.getTotalLength();
        p.style.setProperty('--len', len.toFixed(1));
        segs.push({ el: p, len });
      });
      packets = [];
    }

    function renderTally() {
      if (reduced()) { tallyEl.hidden = true; return; }
      tallyEl.hidden = false;
      const last = pipe.nodes[pipe.nodes.length - 1];
      const drops = pipe.nodes.map((n, i) => (n.drop ? `<span class="is-drop"><b>${num(tally.drop[i] || 0)}</b>stopped at ${esc(n.label)}</span>` : '')).join('');
      tallyEl.innerHTML = `<span><b>${num(tally.in)}</b>dots in</span>${drops}<span class="is-out"><b>${num(tally.out)}</b>reached ${esc(last.label)}</span><span class="flow__note">counts for this animation, not live data</span>`;
    }
    function hit(i) {
      const icon = $$('.node__icon', nodesEl)[i];
      if (icon && icon.animate) icon.animate([{ transform: 'scale(1)' }, { transform: 'scale(1.22)' }, { transform: 'scale(1)' }], { duration: 420, easing: 'cubic-bezier(.22,1,.36,1)' });
    }
    function pop(p, pt, done) {
      p.dead = true;
      p.el.setAttribute('cx', pt.x.toFixed(1));
      p.el.setAttribute('cy', pt.y.toFixed(1));
      p.el.style.opacity = '';
      if (done) p.el.classList.add('c-ok');
      const a = p.el.animate([{ transform: 'scale(1)', opacity: 1 }, { transform: `scale(${done ? 2.8 : 2.2})`, opacity: 0 }], { duration: done ? 650 : 420, easing: 'ease-out' });
      a.onfinish = () => p.el.remove();
    }
    function spawn() {
      if (!segs.length || !layer) return;
      const el = document.createElementNS(NS, 'circle');
      el.setAttribute('r', '4.5');
      el.setAttribute('class', 'pk');
      el.style.transformBox = 'fill-box';
      el.style.transformOrigin = 'center';
      layer.appendChild(el);
      const p0 = segs[0].el.getPointAtLength(0);
      el.setAttribute('cx', p0.x.toFixed(1));
      el.setAttribute('cy', p0.y.toFixed(1));
      packets.push({ el, seg: 0, d: 0, wait: 0, speed: 92 + Math.random() * 40, dead: false });
      hit(0);
      tally.in++;
      renderTally();
    }
    const running = () => visible && !document.hidden && !reduced();
    function frame(t) {
      raf = 0;
      if (!running()) return;
      const dt = Math.min(0.05, (t - (lastT || t)) / 1000);
      lastT = t;
      spawnIn -= dt;
      if (spawnIn <= 0 && packets.length < 18) { spawn(); spawnIn = 0.5 + Math.random() * 0.5; }
      for (const p of packets) {
        if (p.dead) continue;
        if (p.wait > 0) { p.wait -= dt; if (p.wait > 0) continue; p.el.style.opacity = ''; }
        const sg = segs[p.seg];
        if (!sg) { p.dead = true; p.el.remove(); continue; }
        p.d += p.speed * dt;
        if (p.d >= sg.len) {
          const idx = p.seg + 1;
          const node = pipe.nodes[idx];
          const end = sg.el.getPointAtLength(sg.len);
          hit(idx);
          if (idx >= pipe.nodes.length - 1) { pop(p, end, true); tally.out++; renderTally(); continue; }
          if (node.drop && Math.random() < node.drop) { pop(p, end, false); tally.drop[idx] = (tally.drop[idx] || 0) + 1; renderTally(); continue; }
          if (node.paint) { p.el.classList.remove('c-ok', 'c-data', 'c-fs', 'c-cloud'); p.el.classList.add(`c-${node.paint}`); }
          p.seg = idx;
          p.d = 0;
          p.wait = 0.18;
          p.el.style.opacity = '0';
          continue;
        }
        const pt = sg.el.getPointAtLength(p.d);
        p.el.setAttribute('cx', pt.x.toFixed(1));
        p.el.setAttribute('cy', pt.y.toFixed(1));
      }
      packets = packets.filter((p) => !p.dead);
      raf = requestAnimationFrame(frame);
    }
    const start = () => { if (!raf && running()) { lastT = 0; raf = requestAnimationFrame(frame); } };

    function show(id, nodeIndex = 0) {
      pipe = pipeById(id) || S.pipelines[0];
      $$('.ptab', tabs).forEach((b) => {
        const on = b.dataset.pipe === pipe.id;
        b.setAttribute('aria-selected', String(on));
        b.tabIndex = on ? 0 : -1;
      });
      $('#pipePanel').setAttribute('aria-labelledby', `ptab-${pipe.id}`);
      $('#pipeFile').innerHTML = `${icon('file')}${esc(pipe.file)}`;
      $('#pipeSched').innerHTML = `${icon('clock')}${esc(pipe.schedule)}`;
      $('#pipeSummary').textContent = pipe.summary;
      nodesEl.innerHTML = pipe.nodes.map((n, i) => `<li><button class="node k-${esc(n.kind)}" type="button" data-i="${i}" aria-pressed="false" style="--i:${i}">${n.mine ? '<span class="node__mine">my part</span>' : ''}<span class="node__icon">${icon(n.icon)}</span><span class="node__n">${String(i + 1).padStart(2, '0')}</span><span class="node__label">${esc(n.label)}</span><span class="node__sub">${esc(n.sub)}</span></button></li>`).join('');
      select(nodeIndex);
      tally = { in: 0, out: 0, drop: {} };
      renderTally();
      flow.classList.remove('is-in');
      layout(true);
      if (seen) requestAnimationFrame(() => requestAnimationFrame(() => flow.classList.add('is-in')));
      start();
    }
    showPipe = show;

    tabs.addEventListener('click', (e) => { const b = e.target.closest('.ptab'); if (b) show(b.dataset.pipe); });
    tabs.addEventListener('keydown', (e) => {
      if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(e.key)) return;
      e.preventDefault();
      const list = $$('.ptab', tabs);
      const cur = list.findIndex((b) => b.getAttribute('aria-selected') === 'true');
      let n = e.key === 'Home' ? 0 : e.key === 'End' ? list.length - 1 : cur + (e.key === 'ArrowRight' ? 1 : -1);
      n = (n + list.length) % list.length;
      show(list[n].dataset.pipe);
      list[n].focus();
    });
    nodesEl.addEventListener('click', (e) => { const b = e.target.closest('.node'); if (b) select(+b.dataset.i); });
    insp.addEventListener('click', (e) => {
      const b = e.target.closest('[data-step]');
      if (!b) return;
      const dir = b.dataset.step;
      select(sel + Number(dir));
      // the inspector re-renders, so put focus back on the same control (or the step itself)
      const again = $(`[data-step="${dir}"]`, insp);
      if (again && !again.disabled) again.focus();
      else { const nb = $$('.node', nodesEl)[sel]; if (nb) nb.focus(); }
    });

    new IntersectionObserver(([e]) => {
      visible = e.isIntersecting;
      if (visible && !seen) {
        seen = true;
        layout(true);
        requestAnimationFrame(() => flow.classList.add('is-in'));
      }
      start();
    }, { threshold: 0.25 }).observe(flow);
    document.addEventListener('visibilitychange', start);
    let roPending = false;
    new ResizeObserver(() => {
      if (roPending) return;
      roPending = true;
      requestAnimationFrame(() => { roPending = false; layout(); });
    }).observe(flow);
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(() => layout(true));

    show(S.pipelines[0].id);
  }

  /* =====================================================================
     ANALYSIS: the loop of wins as a dial (canvas)
     ===================================================================== */
  const dial = { replay: () => {} };
  function initAnalysis() {
    const A = S.analysis;
    if (!A || !A.loop) return;
    $('#analysisTitle').textContent = A.title;
    $('#analysisLead').textContent = A.lead;
    $('#analysisNote').textContent = A.note;
    $('#analysisSteps').innerHTML = A.steps.map((s, i) => `<li class="step" data-reveal style="--rd:${i * 80}ms"><span class="step__n">${String(i + 1).padStart(2, '0')}</span><div><strong class="step__k">${esc(s.k)}</strong><p class="step__t">${esc(s.t)}</p></div></li>`).join('');

    const LP = A.loop;
    const N = LP.length;
    const dans = [...LP.dans].map(Number);
    const wins = [...LP.wins].map((c) => parseInt(c, 36));
    const losses = [...LP.losses].map((c) => parseInt(c, 36));
    const years = [...LP.years].map((c) => 2020 + Number(c));
    const wrap = $('#dialWrap'), cv = $('#dial'), ctx = cv.getContext('2d');
    const numEl = $('#dialNum'), kick = $('#dialKicker'), lab = $('#dialLabel'), sub = $('#dialSub'), liveEl = $('#dialLive');
    const solved = LP.solvedAt ? fmtDate.format(new Date(`${LP.solvedAt}T12:00:00Z`)) : '';
    const PAL = {
      light: { lo: [212, 200, 246], hi: [72, 34, 172], comet: '#138A52', glow: 'rgba(31,164,99,.28)', dim: 'rgba(27,25,21,.09)', ring: 'rgba(27,25,21,.12)' },
      dark: { lo: [70, 58, 120], hi: [214, 200, 255], comet: '#3DD68C', glow: 'rgba(61,214,140,.35)', dim: 'rgba(238,235,229,.08)', ring: 'rgba(238,235,229,.12)' },
    };
    let size = 0, dpr = 1, prog = reduced() ? 1 : 0, cursor = -1, shimmer = 0, raf = 0, visible = false, played = false, animT0 = 0, idleTimer = 0, col;
    function setColors() {
      const pal = PAL[root.dataset.theme === 'dark' ? 'dark' : 'light'];
      col = { ...pal, dan: [1, 1, 2, 3, 4, 5, 6].map((d) => { const t = (d - 1) / 5; return `rgb(${pal.lo.map((v, k) => Math.round(v + (pal.hi[k] - v) * t)).join(',')})`; }) };
    }
    setColors();
    const angle = (i) => -Math.PI / 2 + ((i + 0.5) / N) * Math.PI * 2;
    function draw() {
      if (!size) return;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, size, size);
      const c = size / 2, r0 = size * 0.315, unit = size * 0.019;
      const lit = prog * N;
      ctx.lineCap = 'round';
      ctx.lineWidth = Math.max(1, ((2 * Math.PI * r0) / N) * 0.6);
      for (let i = 0; i < N; i++) {
        const a = angle(i), cos = Math.cos(a), sin = Math.sin(a);
        const on = i < lit;
        let extra = 0;
        if (on && prog < 1) { const behind = lit - i; if (behind < 26) extra = (1 - behind / 26) * unit * 1.8; }
        if (prog >= 1 && !reduced() && cursor < 0) {
          const dd = (((i - shimmer * N) % N) + N) % N;
          const dist = Math.min(dd, N - dd);
          if (dist < 16) extra = (1 - dist / 16) * unit * 1.3;
        }
        if (i === cursor) extra = unit * 2;
        const len = size * 0.028 + dans[i] * unit + extra;
        ctx.strokeStyle = on ? col.dan[dans[i]] : col.dim;
        ctx.globalAlpha = cursor >= 0 && i !== cursor && i !== (cursor + 1) % N ? 0.45 : 1;
        ctx.beginPath();
        ctx.moveTo(c + cos * r0, c + sin * r0);
        ctx.lineTo(c + cos * (r0 + len), c + sin * (r0 + len));
        ctx.stroke();
      }
      ctx.globalAlpha = 1;
      const rIn = r0 - size * 0.03;
      ctx.lineWidth = 1;
      ctx.strokeStyle = col.ring;
      ctx.beginPath();
      ctx.arc(c, c, rIn, 0, Math.PI * 2);
      ctx.stroke();
      if (prog > 0 && prog < 1) {
        const a = -Math.PI / 2 + prog * Math.PI * 2;
        ctx.lineWidth = 2.5;
        ctx.strokeStyle = col.comet;
        ctx.beginPath();
        ctx.arc(c, c, rIn, -Math.PI / 2, a);
        ctx.stroke();
        const x = c + Math.cos(a) * rIn, y = c + Math.sin(a) * rIn;
        const g = ctx.createRadialGradient(x, y, 0, x, y, size * 0.05);
        g.addColorStop(0, col.glow);
        g.addColorStop(1, 'rgba(0,0,0,0)');
        ctx.fillStyle = g;
        ctx.beginPath(); ctx.arc(x, y, size * 0.05, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = col.comet;
        ctx.beginPath(); ctx.arc(x, y, Math.max(2.5, size * 0.008), 0, Math.PI * 2); ctx.fill();
      }
      if (cursor >= 0) {
        // the two players in this step, drawn on top in the accent colour
        ctx.lineWidth = Math.max(3, ((2 * Math.PI * r0) / N) * 2.2);
        ctx.strokeStyle = col.comet;
        [cursor, (cursor + 1) % N].forEach((i) => {
          const a = angle(i), len = size * 0.028 + dans[i] * unit + unit * 2;
          ctx.beginPath();
          ctx.moveTo(c + Math.cos(a) * r0, c + Math.sin(a) * r0);
          ctx.lineTo(c + Math.cos(a) * (r0 + len), c + Math.sin(a) * (r0 + len));
          ctx.stroke();
        });
        const a1 = angle(cursor), a2 = angle((cursor + 1) % N);
        ctx.lineWidth = 3;
        ctx.strokeStyle = col.comet;
        ctx.beginPath();
        ctx.arc(c, c, rIn, a1, a2 < a1 ? a2 + Math.PI * 2 : a2);
        ctx.stroke();
        [a1, a2].forEach((a) => { ctx.fillStyle = col.comet; ctx.beginPath(); ctx.arc(c + Math.cos(a) * rIn, c + Math.sin(a) * rIn, 3.5, 0, Math.PI * 2); ctx.fill(); });
      }
    }
    function resize() {
      const w = wrap.getBoundingClientRect().width;
      if (!w) return;
      size = w;
      dpr = Math.min(2, devicePixelRatio || 1);
      cv.width = Math.round(size * dpr);
      cv.height = Math.round(size * dpr);
      draw();
    }
    function setCenter() {
      if (cursor < 0) {
        wrap.classList.remove('is-step');
        kick.textContent = 'longest loop';
        numEl.textContent = num(prog >= 1 ? N : Math.round(prog * N));
        lab.textContent = 'players, each beat the next';
        sub.textContent = LP.proven ? `proven longest${solved ? ` · ${solved}` : ''}` : 'longest found';
        return;
      }
      const i = cursor, j = (cursor + 1) % N;
      wrap.classList.add('is-step');
      kick.textContent = `step ${num(i + 1)} of ${num(N)}`;
      numEl.textContent = `${dans[i]}→${dans[j]}`;
      lab.textContent = `a ${dans[i]}-dan beat a ${dans[j]}-dan`;
      sub.textContent = `head-to-head ${wins[i]}–${losses[i]} · last win ${years[i]}`;
    }
    function setCursor(i, announce = false) {
      cursor = i;
      if (i >= 0 && prog < 1) prog = 1;
      setCenter();
      draw();
      if (announce && i >= 0) liveEl.textContent = `Step ${i + 1} of ${N}: a ${dans[i]}-dan player beat a ${dans[(i + 1) % N]}-dan player. Head-to-head ${wins[i]} to ${losses[i]}, last win in ${years[i]}.`;
    }
    const ease = (k) => (k < 0.5 ? 4 * k * k * k : 1 - Math.pow(-2 * k + 2, 3) / 2);
    function loop(t) {
      raf = 0;
      if (!visible || document.hidden) return;
      if (prog < 1) {
        const k = clamp((t - animT0) / 3600, 0, 1);
        prog = ease(k);
        setCenter();
        if (k >= 1) { prog = 1; setCenter(); }
      } else if (!reduced()) {
        shimmer = (shimmer + 1 / 60 / 7) % 1;
      }
      draw();
      if (prog < 1 || !reduced()) raf = requestAnimationFrame(loop);
    }
    const kick0 = () => { if (!raf && visible) raf = requestAnimationFrame(loop); };
    function play() {
      if (reduced()) { prog = 1; setCenter(); draw(); return; }
      cursor = -1;
      prog = 0;
      animT0 = performance.now();
      played = true;
      kick0();
    }
    dial.replay = play;

    new IntersectionObserver(([e]) => {
      visible = e.isIntersecting;
      if (visible && !played) {
        if (reduced()) { played = true; prog = 1; setCenter(); draw(); } else play();
      }
      kick0();
    }, { threshold: 0.35 }).observe(wrap);
    document.addEventListener('visibilitychange', kick0);
    new ResizeObserver(resize).observe(wrap);
    themeFns.push(() => { setColors(); draw(); });

    function indexAt(e) {
      const r = cv.getBoundingClientRect();
      const x = e.clientX - r.left - r.width / 2, y = e.clientY - r.top - r.height / 2;
      const d = Math.hypot(x, y) / r.width;
      if (d < 0.24 || d > 0.5) return -1;
      let a = Math.atan2(y, x) + Math.PI / 2;
      if (a < 0) a += Math.PI * 2;
      return Math.floor((a / (Math.PI * 2)) * N) % N;
    }
    cv.addEventListener('pointermove', (e) => {
      if (e.pointerType === 'touch') return;
      clearTimeout(idleTimer);
      const i = indexAt(e);
      if (i !== cursor) setCursor(i);
    });
    cv.addEventListener('pointerdown', (e) => setCursor(indexAt(e), true));
    cv.addEventListener('pointerleave', () => { clearTimeout(idleTimer); idleTimer = setTimeout(() => setCursor(-1), 900); });
    cv.addEventListener('keydown', (e) => {
      const keys = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 };
      if (keys[e.key] !== undefined) { e.preventDefault(); setCursor(((cursor < 0 ? (keys[e.key] > 0 ? -1 : 0) : cursor) + keys[e.key] + N) % N, true); }
      else if (e.key === 'Home') { e.preventDefault(); setCursor(0, true); }
      else if (e.key === 'End') { e.preventDefault(); setCursor(N - 1, true); }
      else if (e.key === 'Escape') setCursor(-1);
    });
    cv.addEventListener('blur', () => setCursor(-1));
    cv.setAttribute('aria-label', `A dial of ${N} ticks, one for each player in the longest loop of wins. Use the arrow keys to walk the loop.`);
    $('#dialReplay').addEventListener('click', play);
    setCenter();
    if (reduced()) $('#dialReplay').hidden = true;
  }

  /* =====================================================================
     STACK, CERTIFICATE, CHANGELOG, CONTACT
     ===================================================================== */
  function usedBy(ids) {
    return ids.map((id) => (id === 'site' ? 'this site' : id === 'hccda' ? 'certificate' : (svcById(id) || {}).name || id)).join(' · ');
  }
  function renderStack() {
    $('#stackGrid').innerHTML = S.stack.map((g, gi) => `<section class="deps a-${esc(g.area)}" data-reveal style="--rd:${gi * 90}ms" aria-label="${esc(g.title)}">
        <div class="deps__head"><span class="deps__dot"></span><h3 class="deps__title">${esc(g.title)}</h3><span class="deps__file">${g.items.length} deps</span></div>
        <ul>${g.items.map((d, i) => `<li class="dep" style="--i:${i}"><span class="dep__name">${esc(d.name)}</span>${d.v ? `<span class="dep__v">v${esc(d.v)}</span>` : ''}<span class="dep__used">${d.note ? `${esc(d.note)} · ` : ''}${esc(usedBy(d.used || []))}</span></li>`).join('')}</ul>
      </section>`).join('');
  }

  function sealSVG() {
    return `<svg viewBox="0 0 200 200" aria-hidden="true">
      <defs>
        <path id="sealArc" d="M100 100m-80 0a80 80 0 1 1 160 0a80 80 0 1 1-160 0"/>
        <linearGradient id="sealInk" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#2C2822"/><stop offset="1" stop-color="#141210"/></linearGradient>
        <linearGradient id="sealShineG" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#fff" stop-opacity="0"/><stop offset=".5" stop-color="#fff" stop-opacity=".5"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></linearGradient>
        <clipPath id="sealClip"><circle cx="100" cy="100" r="64"/></clipPath>
      </defs>
      <circle cx="100" cy="100" r="97" fill="#F7F3EC" stroke="#1B1915" stroke-width="2"/>
      <circle cx="100" cy="100" r="90" fill="none" stroke="#1B1915" stroke-opacity=".28" stroke-dasharray="1.5 4"/>
      <g class="seal__ring"><text font-family="Geist Mono, ui-monospace, monospace" font-size="11" font-weight="600" fill="#1B1915"><textPath href="#sealArc" textLength="494" lengthAdjust="spacing">HUAWEI CLOUD · DEVELOPER CERTIFICATION · HCCDA ·</textPath></text></g>
      <circle cx="100" cy="100" r="64" fill="url(#sealInk)"/>
      <g clip-path="url(#sealClip)"><rect class="seal__shine" x="70" y="20" width="34" height="160" fill="url(#sealShineG)"/></g>
      <text x="100" y="99" text-anchor="middle" font-family="Bricolage Grotesque, sans-serif" font-weight="800" font-size="31" letter-spacing="-1" fill="#F7F3EC">HCCDA</text>
      <text x="100" y="117" text-anchor="middle" font-family="Geist Mono, ui-monospace, monospace" font-size="8.6" font-weight="600" letter-spacing="1.6" fill="#F7F3EC" fill-opacity=".78">TECH ESSENTIALS</text>
      <circle cx="100" cy="141" r="10" fill="#1FA463"/><path d="m95.2 141 3.2 3.2 6.4-6.4" fill="none" stroke="#fff" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>`;
  }
  function renderCerts() {
    const box = $('#certs');
    if (!cert) { box.hidden = true; return; }
    const now = Date.now();
    const left = certUntil - now;
    box.innerHTML = `<article class="cert" data-reveal>
      <div class="seal">${sealSVG()}</div>
      <div class="cert__body">
        <span class="cert__issuer">${esc(cert.issuer)} · ${esc(cert.program)}</span>
        <h3 class="cert__name">${esc(cert.name)}</h3>
        <span class="cert__level">${esc(cert.level)}</span>
        <div class="cert__row">
          <span class="badge badge--${left > 0 ? 'ok' : 'warn'}"><span class="dot"></span>${left > 0 ? 'Valid' : 'Expired'}</span>
          <span class="cert__left">until ${fmtDate.format(certUntil)}${left > 0 ? ` · ${span(left)} left` : ''}</span>
        </div>
        <div class="validity" aria-hidden="true">${monthBars()}</div>
        <div class="cert__actions">
          <button class="btn btn--ink btn--sm" type="button" data-cert="${esc(cert.id)}">${icon('award')}View certificate</button>
        </div>
        <p class="cert__note">${cert.number ? `<span class="cert__id">Credential ID <code>${esc(cert.number)}</code><button class="copy-btn" type="button" data-copy="${esc(cert.number)}" aria-label="Copy the credential ID">${icon('copy')}Copy</button></span>` : 'The certificate number is hidden here. Ask me for it to verify with Huawei.'}</p>
      </div>
      <button class="cert__thumb" type="button" data-cert="${esc(cert.id)}" aria-label="View the certificate image">
        <img src="${esc(cert.thumb)}" alt="" width="720" height="508" loading="lazy" decoding="async">
        <span>${icon('search')}View</span>
      </button>
    </article>`;
  }
  function monthBars() {
    const end = certUntil.getTime();
    const start = certIssued ? certIssued.getTime() : end - 3 * 365.25 * 864e5;
    const months = Math.max(1, Math.round((end - start) / (30.44 * 864e5)));
    const now = Date.now();
    const cur = Math.floor(((now - start) / (end - start)) * months);
    const bars = Array.from({ length: months }, (_, i) => {
      const t = new Date(start + (i + 0.5) * ((end - start) / months));
      const cls = i < cur ? 'is-past' : i === cur ? 'is-now' : '';
      return `<i class="mb ${cls}" style="--i:${i}" title="${fmtMonthYear.format(t)}"></i>`;
    }).join('');
    const todo = certIssued && cert.issued ? '' : '';
    return `<div class="mbars">${bars}</div>
      <div class="validity__labels"><span>Issued ${fmtMonthYear.format(new Date(start))}${todo}</span><span>${num(Math.max(0, months - cur - 1))} of ${months} months left</span><span>Expires ${fmtMonthYear.format(certUntil)}</span></div>`;
  }

  const TAG = {
    shipped: { label: 'Shipped', icon: 'rocket' },
    data: { label: 'Data', icon: 'graph' },
    research: { label: 'Research', icon: 'file' },
    cert: { label: 'Certified', icon: 'award' },
    course: { label: 'Course', icon: 'cap' },
    edu: { label: 'Education', icon: 'cap' },
    work: { label: 'Experience', icon: 'briefcase' },
  };
  function versionOf(date) {
    const { y, m, d } = partsDate(date);
    if (!y) return 'v?';
    return `v${String(y).slice(2)}${m ? `.${String(m).padStart(2, '0')}` : ''}${d ? `.${String(d).padStart(2, '0')}` : ''}`;
  }
  function dateLabel(date) {
    const { y, m, d } = partsDate(date);
    if (!y) return '';
    if (d) return `${d} ${fmtMonth.format(new Date(Date.UTC(y, m - 1, 1)))} ${y}`;
    if (m) return fmtMonthYear.format(new Date(Date.UTC(y, m - 1, 1)));
    return String(y);
  }
  function renderChangelog() {
    const ol = $('#releases');
    ol.innerHTML = S.changelog.map((r, i) => {
      const t = TAG[r.tag] || TAG.shipped;
      const s = r.service ? svcById(r.service) : null;
      return `<li class="rel g-${esc(r.tag)}${r.todo && !r.date ? ' is-todo' : ''}" data-reveal style="--rd:${(i % 3) * 70}ms">
        <span class="rel__date">${esc(dateLabel(r.date) || 'to add')}</span>
        <span class="rel__node">${icon(t.icon)}</span>
        <div class="rel__card">
          <div class="rel__meta"><span class="rel__ver">${versionOf(r.date)}</span><span class="rel__tag">${esc(t.label)}</span>${r.todo ? todoTag(r.todo) : ''}${s ? `<a class="rel__svc" href="#svc-${esc(s.id)}" data-open="${esc(s.id)}">${esc(s.name)}</a>` : ''}</div>
          <h3 class="rel__title">${esc(r.title)}</h3>
          <p class="rel__text">${esc(r.text)}${r.todo ? ` <span class="rel__todo">(${esc(r.todo)})</span>` : ''}</p>
        </div>
      </li>`;
    }).join('');
  }

  function renderContact() {
    const mail = P.email ? `mailto:${P.email}?subject=${encodeURIComponent('Opportunity: internship, co-op or part-time')}` : '';
    const rows = [
      { label: 'Email', icon: 'mail', value: P.email, href: mail, todo: 'Add your email to content.js', act: P.email ? `<button class="channel__act" type="button" data-copy-email>${icon('copy')}Copy</button>` : '' },
      { label: 'LinkedIn', icon: 'linkedin', value: L.linkedin && L.linkedin.replace(/^https?:\/\/(www\.)?/, '').replace(/\/$/, ''), href: L.linkedin, todo: 'Add your LinkedIn URL', act: L.linkedin ? `<a class="channel__act" href="${esc(L.linkedin)}" ${ext}>Open${icon('arrow-up-right')}</a>` : '' },
      { label: 'GitHub', icon: 'github', value: L.github && L.github.replace(/^https?:\/\//, ''), href: L.github, todo: 'Add your GitHub URL', act: L.github ? `<a class="channel__act" href="${esc(L.github)}" ${ext}>Open${icon('arrow-up-right')}</a>` : '' },
    ];
    const valueHTML = (r) => {
      if (!r.value) return `Not added yet ${todoTag(r.todo)}`;
      if (!r.href) return esc(r.value);
      return `<a href="${esc(r.href)}"${/^https?:/.test(r.href) ? ` ${ext}` : ''}>${esc(r.value)}</a>`;
    };
    $('#channels').innerHTML = rows.map((r) => `<li class="channel${r.value ? '' : ' is-todo'}">
      <span class="channel__icon">${icon(r.icon)}</span>
      <span class="channel__text"><span class="channel__label">${esc(r.label)}</span><span class="channel__value">${valueHTML(r)}</span></span>
      ${r.act}
    </li>`).join('');
    const cta = $('#ticketCta');
    if (cta) cta.innerHTML = P.email ? `<a class="btn btn--light" href="${esc(mail)}">${icon('mail')}Email me</a><button class="btn btn--line" type="button" data-copy-email>${icon('copy')}Copy address</button>` : '';
  }

  /* =====================================================================
     DIALOGS: service sheet, certificate, palette
     ===================================================================== */
  let lastFocus = null;
  function openDialog(dlg) {
    if (dlg.open) return;
    lastFocus = document.activeElement;
    $$('dialog[open]').forEach((d) => d.close());
    dlg.classList.remove('is-closing');
    dlg.showModal();
    root.classList.add('has-modal');
    const sc = $('.sheet__in', dlg);
    if (sc) sc.scrollTop = 0;
    const close = $('[data-close]', dlg);
    if (close) close.focus();
  }
  function closeDialog(dlg) {
    if (!dlg.open || dlg.classList.contains('is-closing')) return;
    if (reduced()) { dlg.close(); return; }
    dlg.classList.add('is-closing');
    let done = false;
    const finish = () => { if (done) return; done = true; dlg.classList.remove('is-closing'); dlg.close(); };
    dlg.addEventListener('animationend', function onEnd(e) { if (e.target === dlg) { dlg.removeEventListener('animationend', onEnd); finish(); } });
    setTimeout(finish, 320);
  }
  function wireDialog(dlg) {
    dlg.addEventListener('cancel', (e) => { e.preventDefault(); closeDialog(dlg); });
    dlg.addEventListener('click', (e) => { if (e.target === dlg || e.target.closest('[data-close]')) closeDialog(dlg); });
    dlg.addEventListener('close', () => {
      if (!$('dialog[open]')) root.classList.remove('has-modal');
      if (lastFocus && document.contains(lastFocus)) lastFocus.focus({ preventScroll: true });
    });
  }

  function openService(id) {
    const s = svcById(id);
    if (!s) return;
    const conf = s.confirm || [];
    const spec = [
      ['Role', esc(s.role) + (conf.includes('role') ? todoTag('Confirm your role') : '')],
      ['Status', s.status === 'operational' ? 'Operational, live' : 'Archived'],
      ['Runs on', esc(s.platform)],
      ['Since', esc(s.since) + (conf.includes('since') ? todoTag('Confirm the date') : '')],
      s.course && ['Course', esc(s.course)],
      s.links.live && ['Address', `<a href="${esc(s.links.live)}" ${ext} class="mono" style="text-decoration:underline;text-underline-offset:2px">${esc(s.host)}</a>`],
    ].filter(Boolean);
    const shots = s.shots || [];
    const gallery = shots.length
      ? `<div class="sh__gallery${shots.length === 1 ? ' sh__gallery--one' : ''}">${shots.map((sh) => `<figure><div class="frame"><div class="frame__bar"><i></i><i></i><i></i><span class="frame__url mono">${icon('lock')}${esc(s.host)}</span></div><div class="frame__view">${shotImgs(sh, false, '(min-width: 900px) 480px, 100vw')}</div></div><figcaption>${esc(sh.caption || '')}</figcaption></figure>`).join('')}</div>`
      : `<div class="sh__gallery sh__gallery--one"><figure><div class="frame"><div class="frame__bar"><i></i><i></i><i></i><span class="frame__url mono">${icon('terminal')}${esc(s.host)}</span></div><div class="frame__view" style="aspect-ratio:16/7">${coverForecast()}</div></div><figcaption>Illustration. The dashboard ran locally in Streamlit, so there’s no live site to show.</figcaption></figure></div>`;
    const links = [serviceLinks(s, true)];
    if (s.links.feeds) links.push(...s.links.feeds.map((f) => `<a class="btn btn--ghost" href="${esc(f.url)}" ${ext}>${icon('rss')}${esc(f.label)}</a>`));
    if (!s.links.repo && s.links.repoNote) links.push(`<span class="sh__private">${icon('lock')}${esc(s.links.repoNote)}${conf.includes('repo') ? todoTag('Link the code?') : ''}</span>`);
    $('#sheetBody').innerHTML = `
      <div class="sh__bar"><span class="dot dot--${s.status === 'operational' ? 'ok' : 'off'}"></span><span class="sh__path mono">${esc(P.host)}/services/${esc(s.id)}</span><button class="icon-btn" type="button" data-close aria-label="Close">${icon('x')}</button></div>
      <div class="sh__hero">
        <div class="svc__top">${statusBadge(s)}<span class="svc__host mono">${esc(s.kicker)}</span></div>
        <h2 class="sh__title" id="sheetTitle">${esc(s.name)}${s.native ? `<span class="th">${esc(s.native)}</span>` : ''}</h2>
        <p class="sh__tagline">${esc(s.tagline)}</p>
        ${areaChips(s)}
        <div class="sh__links">${links.join('')}</div>
      </div>
      ${gallery}
      <div class="sh__grid">
        <div class="sh__main">
          <h3 class="sh__h">Overview</h3>
          ${s.summary.map((p) => `<p>${esc(p)}</p>`).join('')}
          <h3 class="sh__h">What I built${conf.includes('built') ? todoTag('Check this list') : ''}</h3>
          <ul class="built">${s.built.map((b) => `<li>${icon('check')}<span>${esc(b)}</span></li>`).join('')}</ul>
        </div>
        <aside>
          <h3 class="sh__h">Spec</h3>
          <dl class="spec">${spec.map(([k, v]) => `<dt>${k}</dt><dd>${v}</dd>`).join('')}</dl>
          <dl class="metrics sh__metrics">${metricsHTML(s)}</dl>
          <h3 class="sh__h">Stack</h3>
          <ul class="chips">${s.stack.map((t) => `<li class="chip">${esc(t)}</li>`).join('')}</ul>
          <h3 class="sh__h">Pipelines</h3>
          <div class="sh__pipes">${(s.pipelines || []).map((pid) => { const p = pipeById(pid); return p ? `<button type="button" data-goto-pipe="${esc(pid)}">${icon('activity')}${esc(p.title)}${icon('arrow-right')}</button>` : ''; }).join('')}</div>
        </aside>
      </div>`;
    $$('#sheetBody [data-count]').forEach((el) => { el.dataset.counted = '1'; renderCount(el, Number(el.dataset.count)); });
    openDialog($('#sheet'));
  }

  function openCert(id) {
    const c = (S.certifications || []).find((x) => x.id === id) || cert;
    if (!c) return;
    $('#certDlgBody').innerHTML = `
      <div class="sh__bar"><span class="dot dot--ok"></span><span class="sh__path mono" id="certDlgTitle">${esc(c.issuer)} · ${esc(c.name)}</span><button class="icon-btn" type="button" data-close aria-label="Close">${icon('x')}</button></div>
      <div class="cert-view">
        <img src="${esc(c.image)}" width="1600" height="1129" alt="${esc(`${c.issuer} ${c.program}: ${P.name}, ${c.name}, ${c.level}. Valid until ${fmtDate.format(certUntil)}.`)}">
        <p>${c.number ? `Credential ID ${esc(c.number)} · issued ${certIssued ? fmtMonthYear.format(certIssued) : '—'} · valid until ${fmtDate.format(certUntil)}` : 'The certificate number is blurred on purpose. Ask me for it if you’d like to verify it with Huawei.'}</p>
      </div>`;
    openDialog($('#certDlg'));
  }

  function initPalette() {
    const dlg = $('#palette'), input = $('#paletteInput'), list = $('#paletteList');
    const go = (sel) => () => { const el = $(sel); if (el) el.scrollIntoView({ behavior: reduced() ? 'auto' : 'smooth', block: 'start' }); };
    const openUrl = (u) => () => window.open(u, '_blank', 'noopener');
    const sections = [['Overview', '#top', 'activity'], ['Services', '#services', 'window'], ['Pipelines', '#pipelines', 'layers'], ['Analysis', '#analysis', 'graph'], ['Stack', '#stack', 'code'], ['Certificate', '#compliance', 'award'], ['Changelog', '#changelog', 'git'], ['Contact', '#contact', 'mail']];
    const cmds = [
      ...sections.map(([label, href, ic]) => ({ group: 'Go to', label, hint: href, icon: ic, run: go(href) })),
      ...S.services.map((s) => ({ group: 'Services', label: s.name, hint: s.kicker, icon: 'window', run: () => openService(s.id) })),
      ...S.pipelines.map((p) => ({ group: 'Pipelines', label: p.title, hint: p.schedule, icon: 'layers', run: () => { showPipe(p.id); go('#pipelines')(); } })),
      { group: 'Do', label: 'Toggle dark mode', hint: 'theme', icon: 'moon', run: () => toggleTheme() },
      { group: 'Do', label: 'Replay the loop of wins', hint: 'analysis', icon: 'replay', run: () => { go('#analysis')(); setTimeout(dial.replay, 500); } },
      cert && { group: 'Do', label: 'View the certificate', hint: cert.name, icon: 'award', run: () => openCert(cert.id) },
      P.email && { group: 'Do', label: 'Copy my email address', hint: P.email, icon: 'copy', run: copyEmail },
      ...S.services.filter((s) => s.links.live).map((s) => ({ group: 'Open', label: s.name, hint: s.host, icon: 'arrow-up-right', run: openUrl(s.links.live) })),
      L.github && { group: 'Open', label: 'GitHub', hint: L.github.replace(/^https?:\/\//, ''), icon: 'github', run: openUrl(L.github) },
      L.linkedin && { group: 'Open', label: 'LinkedIn', hint: 'profile', icon: 'linkedin', run: openUrl(L.linkedin) },
    ].filter(Boolean);
    let shown = [], sel = 0;
    function mark() {
      $$('li[data-i]', list).forEach((li) => { const on = +li.dataset.i === sel; li.classList.toggle('is-sel', on); li.setAttribute('aria-selected', String(on)); });
      input.setAttribute('aria-activedescendant', shown.length ? `pc-${sel}` : '');
      const cur = $('.is-sel', list);
      if (cur) cur.scrollIntoView({ block: 'nearest' });
    }
    function render() {
      const q = input.value.trim().toLowerCase();
      shown = cmds.filter((c) => !q || `${c.group} ${c.label} ${c.hint}`.toLowerCase().includes(q));
      sel = clamp(sel, 0, Math.max(0, shown.length - 1));
      let html = '', group = '';
      shown.forEach((c, i) => {
        if (c.group !== group) { group = c.group; html += `<li class="pc-group" role="presentation">${esc(group)}</li>`; }
        html += `<li role="option" id="pc-${i}" data-i="${i}" aria-selected="false">${icon(c.icon)}<span>${esc(c.label)}</span><small>${esc(c.hint || '')}</small></li>`;
      });
      list.innerHTML = html || `<li class="pc-empty">Nothing matches “${esc(input.value)}”.</li>`;
      mark();
    }
    function runCmd(c) { if (!c) return; dlg.close(); setTimeout(() => c.run(), 60); }
    function open() {
      if (dlg.open) return;
      $$('dialog[open]').forEach((d) => d.close());
      input.value = '';
      sel = 0;
      render();
      dlg.showModal();
      root.classList.add('has-modal');
      input.focus();
    }
    input.addEventListener('input', () => { sel = 0; render(); });
    input.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
        e.preventDefault();
        if (!shown.length) return;
        sel = (sel + (e.key === 'ArrowDown' ? 1 : -1) + shown.length) % shown.length;
        mark();
      } else if (e.key === 'Enter') { e.preventDefault(); runCmd(shown[sel]); }
    });
    list.addEventListener('click', (e) => { const li = e.target.closest('li[data-i]'); if (li) runCmd(shown[+li.dataset.i]); });
    list.addEventListener('mousemove', (e) => { const li = e.target.closest('li[data-i]'); if (li && +li.dataset.i !== sel) { sel = +li.dataset.i; mark(); } });
    dlg.addEventListener('click', (e) => { if (e.target === dlg) dlg.close(); });
    dlg.addEventListener('close', () => { if (!$('dialog[open]')) root.classList.remove('has-modal'); });
    document.addEventListener('keydown', (e) => {
      const t = e.target;
      const typing = t instanceof HTMLElement && (t.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName));
      const slash = e.key === '/' && !typing && !e.ctrlKey && !e.metaKey && !e.altKey;
      const ctrlK = (e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k';
      if (slash || ctrlK) { e.preventDefault(); open(); }
    });
    return { open };
  }

  /* =====================================================================
     HEADER, MENU, REVEAL
     ===================================================================== */
  function initHeader() {
    const hdr = $('#hdr');
    const bar = $('.hdr__progress span');
    const links = $$('.nav a');
    const targets = links.map((a) => $(a.getAttribute('href')));
    onScroll(() => {
      hdr.classList.toggle('is-scrolled', scrollY > 8);
      const mid = innerHeight * 0.4;
      let cur = -1;
      targets.forEach((t, i) => { if (!t) return; const r = t.getBoundingClientRect(); if (r.top <= mid && r.bottom > mid) cur = i; });
      links.forEach((a, i) => a.classList.toggle('is-active', i === cur));
      const max = root.scrollHeight - innerHeight;
      bar.style.transform = `scaleX(${max > 0 ? clamp(scrollY / max, 0, 1) : 0})`;
    });
    const btn = $('#menuBtn'), menu = $('#menu');
    const setMenu = (open) => {
      menu.hidden = !open;
      btn.setAttribute('aria-expanded', String(open));
      btn.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
      btn.innerHTML = icon(open ? 'x' : 'menu');
    };
    btn.addEventListener('click', () => setMenu(menu.hidden));
    menu.addEventListener('click', (e) => { if (e.target.closest('a')) setMenu(false); });
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && !menu.hidden) { setMenu(false); btn.focus(); } });
    addEventListener('resize', () => { if (innerWidth > 1100 && !menu.hidden) setMenu(false); });
    themeBtn.addEventListener('click', toggleTheme);
    applyTheme(root.dataset.theme === 'dark' ? 'dark' : 'light', false);
  }

  function initReveal() {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (!e.isIntersecting) return;
        const el = e.target;
        el.classList.add('is-in');
        if (el.classList.contains('tile')) {
          const ring = $('.ring__fill', el);
          if (ring) ring.style.strokeDashoffset = ring.dataset.off;
        }
        io.unobserve(el);
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });
    $$('[data-reveal], .releases').forEach((el) => io.observe(el));
  }

  /* =====================================================================
     BOOT
     ===================================================================== */
  bindProfile();
  renderHeadline();
  hydrateIcons();
  renderTelemetry();
  initConsole();
  renderServices();
  initFocus();
  initPipelines();
  initAnalysis();
  renderStack();
  renderCerts();
  renderChangelog();
  renderContact();
  initKeywords();
  const palette = initPalette();
  wireDialog($('#sheet'));
  wireDialog($('#certDlg'));
  initHeader();
  initReveal();
  observeCounts();

  document.addEventListener('click', (e) => {
    const t = e.target.closest('[data-open], [data-cert], [data-copy-email], [data-copy], [data-palette], [data-goto-pipe]');
    if (!t) return;
    if (t.hasAttribute('data-open')) { e.preventDefault(); openService(t.dataset.open); }
    else if (t.hasAttribute('data-cert')) { e.preventDefault(); openCert(t.dataset.cert); }
    else if (t.hasAttribute('data-copy-email')) { e.preventDefault(); copyEmail(); }
    else if (t.hasAttribute('data-copy')) { e.preventDefault(); copyText(t.dataset.copy); }
    else if (t.hasAttribute('data-palette')) { e.preventDefault(); palette.open(); }
    else if (t.hasAttribute('data-goto-pipe')) {
      e.preventDefault();
      const sheet = $('#sheet');
      if (sheet.open) sheet.close();
      showPipe(t.dataset.gotoPipe);
      setTimeout(() => $('#pipelines').scrollIntoView({ behavior: reduced() ? 'auto' : 'smooth', block: 'start' }), 60);
    }
  });

  runScroll();
  requestAnimationFrame(() => requestAnimationFrame(() => root.classList.add('is-ready')));
})();
