/* =====================================================================
   Portfolio interactions.
   Renders everything from window.SITE (assets/js/content.js) and wires
   up the animations. No dependencies, no build step.
   ===================================================================== */
(() => {
  'use strict';

  const S = window.SITE;
  if (!S) { console.error('[portfolio] content.js did not load'); return; }

  /* ---------- helpers ---------- */
  const $ = (sel, el = document) => el.querySelector(sel);
  const $$ = (sel, el = document) => Array.from(el.querySelectorAll(sel));
  const root = document.documentElement;
  const mqReduce = matchMedia('(prefers-reduced-motion: reduce)');
  const reduced = () => mqReduce.matches;
  const finePointer = matchMedia('(hover: hover) and (pointer: fine)').matches;
  const sleep = (ms) => new Promise((r) => setTimeout(r, reduced() ? 0 : ms));
  const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, v));
  const pad = (n) => String(n).padStart(2, '0');
  const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const fmt = (s) => esc(s).replace(/`([^`]+)`/g, '<code>$1</code>');
  const isExternal = (href) => /^https?:/i.test(href || '');
  const extAttrs = (href) => (isExternal(href) ? ' target="_blank" rel="noopener"' : '');
  const P = S.profile || {};
  const L = P.links || {};
  const catById = (id) => S.categories.find((c) => c.id === id);
  const projectById = (id) => S.projects.find((p) => p.id === id);

  /* One rAF-throttled scroll/resize loop shared by every effect */
  const scrollFns = [];
  const onScroll = (fn) => scrollFns.push(fn);
  let ticking = false;
  const runScroll = () => { ticking = false; scrollFns.forEach((f) => f()); };
  const requestTick = () => { if (!ticking) { ticking = true; requestAnimationFrame(runScroll); } };
  addEventListener('scroll', requestTick, { passive: true });
  addEventListener('resize', requestTick);

  /* ---------- icons (stroke icons on a 24px grid) ---------- */
  const ICONS = {
    'arrow-right': '<path d="M5 12h14M13 6l6 6-6 6"/>',
    'arrow-up-right': '<path d="M7 17 17 7M8 7h9v9"/>',
    'arrow-down': '<path d="M12 5v14M6 13l6 6 6-6"/>',
    'arrow-up': '<path d="M12 19V5M6 11l6-6 6 6"/>',
    'chevrons-down': '<path d="m7 6 5 5 5-5M7 13l5 5 5-5"/>',
    play: '<path d="M7 4.8v14.4a1 1 0 0 0 1.5.86l11.9-7.2a1 1 0 0 0 0-1.72L8.5 3.94A1 1 0 0 0 7 4.8z" fill="currentColor" stroke="none"/>',
    github: '<path transform="scale(1.5)" fill="currentColor" stroke="none" d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0 0 16 8c0-4.42-3.58-8-8-8z"/>',
    linkedin: '<rect x="3" y="3" width="18" height="18" rx="4"/><path d="M8 10.5V16M8 7.6v.01M12 16v-3.2a2.2 2.2 0 0 1 4.4 0V16M12 10.5V16"/>',
    mail: '<rect x="3" y="5" width="18" height="14" rx="3"/><path d="m4 7 8 6 8-6"/>',
    file: '<path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z"/><path d="M14 3v5h5M9 13h6M9 17h4"/>',
    sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>',
    moon: '<path d="M20.5 14.2A8.5 8.5 0 0 1 9.8 3.5a8.5 8.5 0 1 0 10.7 10.7z"/>',
    x: '<path d="M18 6 6 18M6 6l12 12"/>',
    menu: '<path d="M4 7h16M4 12h16M4 17h10"/>',
    globe: '<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18"/>',
    check: '<path d="m5 12.5 4.5 4.5L19 7.5"/>',
    'check-circle': '<circle cx="12" cy="12" r="9"/><path d="m8 12.5 2.8 2.8L16.5 9.5"/>',
    copy: '<rect x="9" y="9" width="12" height="12" rx="2.5"/><path d="M5 15V5.5A2.5 2.5 0 0 1 7.5 3H15"/>',
    sparkles: '<path d="M12 3.5 13.9 8.1 18.5 10 13.9 11.9 12 16.5 10.1 11.9 5.5 10 10.1 8.1z"/><path d="M18.5 15.5l.8 1.9 1.9.8-1.9.8-.8 1.9-.8-1.9-1.9-.8 1.9-.8z"/>',
    terminal: '<rect x="3" y="4" width="18" height="16" rx="3"/><path d="m7 9 3 3-3 3M13 15h4"/>',
    plug: '<path d="M9 3v5M15 3v5M6.5 8h11v3.5a5.5 5.5 0 0 1-11 0zM12 17v4"/>',
    code: '<path d="m8 7-5 5 5 5M16 7l5 5-5 5M13.5 4l-3 16"/>',
    chart: '<path d="M4 20V11M10 20V5M16 20v-6M21 20H3"/>',
    layers: '<path d="m12 3 9 5-9 5-9-5z"/><path d="m3 13 9 5 9-5"/>',
    cpu: '<rect x="6" y="6" width="12" height="12" rx="2.5"/><path d="M9.5 2.5v3.5M14.5 2.5v3.5M9.5 18v3.5M14.5 18v3.5M2.5 9.5H6M2.5 14.5H6M18 9.5h3.5M18 14.5h3.5"/>',
    replay: '<path d="M3.5 12a8.5 8.5 0 1 0 2.6-6.1L3.5 8.5"/><path d="M3.5 3.5v5h5"/>',
    video: '<rect x="2.5" y="6" width="13.5" height="12" rx="2.5"/><path d="m16 10.5 5.5-3v9l-5.5-3"/>',
    book: '<path d="M3 5.5h6a3 3 0 0 1 3 3v11a2.5 2.5 0 0 0-2.5-2.5H3zM21 5.5h-6a3 3 0 0 0-3 3v11a2.5 2.5 0 0 1 2.5-2.5H21z"/>',
    rocket: '<path d="M5 15c-1.5 1.3-2 4-2 6 2 0 4.7-.5 6-2M9 13.5 6.5 11c1-3 3.8-7.6 11-8.5-.9 7.2-5.5 10-8.5 11z"/><circle cx="14.5" cy="9.5" r="1.6"/>',
    user: '<circle cx="12" cy="8" r="4"/><path d="M4.5 21a7.5 7.5 0 0 1 15 0"/>',
    briefcase: '<rect x="3" y="7" width="18" height="13" rx="2.5"/><path d="M8.5 7V5.5a2 2 0 0 1 2-2h3a2 2 0 0 1 2 2V7M3 12.5h18"/>',
    graduation: '<path d="m2 9 10-5 10 5-10 5z"/><path d="M6 11.2V16c0 1.4 2.7 3 6 3s6-1.6 6-3v-4.8M22 9v5.5"/>',
    trophy: '<path d="M8 21h8M12 17v4M7 4h10v5a5 5 0 0 1-10 0zM7 6H4.5a2.5 2.5 0 0 0 2.6 3.6M17 6h2.5a2.5 2.5 0 0 1-2.6 3.6"/>',
    external: '<path d="M14 4h6v6M20 4l-9 9M18 14v4.5a1.5 1.5 0 0 1-1.5 1.5h-11A1.5 1.5 0 0 1 4 18.5v-11A1.5 1.5 0 0 1 5.5 6H10"/>',
  };
  const icon = (name, cls = '') => `<svg class="i${cls ? ' ' + cls : ''}" viewBox="0 0 24 24" aria-hidden="true" focusable="false">${ICONS[name] || ICONS.sparkles}</svg>`;
  const hydrateIcons = (scope = document) => $$('i[data-icon]', scope).forEach((el) => { el.outerHTML = icon(el.dataset.icon, el.className); });

  const CAT_ICONS = { skills: 'sparkles', plugins: 'plug', apps: 'layers', ml: 'chart' };
  const catIcon = (c) => (c && (c.icon || CAT_ICONS[c.id])) || 'sparkles';
  const KIND_ICONS = { skill: 'sparkles', plugin: 'plug', 'mcp server': 'cpu' };
  const KIND_CLASS = { skill: 'skill', plugin: 'plugin', 'mcp server': 'mcp' };
  const TYPE_ICONS = { video: 'play', article: 'book', repo: 'code', report: 'chart', live: 'external' };

  /* ---------- generated cover art ---------- */
  const PALETTES = {
    violet: ['#EEEAFF', '#D3C9FF', '#A996FF', '#F7DDFF', '#6D4AFF'],
    blue: ['#E8EFFF', '#C3D3FF', '#8EABFF', '#D2EEFF', '#3B6BFF'],
    peach: ['#FFEFE8', '#FFD0BF', '#FFA48F', '#FFE6C7', '#F2603D'],
    pink: ['#FFEBF3', '#FFC9DE', '#FF95BD', '#FFE3EE', '#E63E80'],
    mint: ['#E6F8EF', '#BDEDD5', '#83DDB6', '#DDF6FF', '#0FA968'],
    teal: ['#E3F6F5', '#B1E8E3', '#69D2C8', '#D9EEFF', '#0B9C93'],
    amber: ['#FFF4E0', '#FFE0A6', '#FFBE5C', '#FFEBD0', '#E58A00'],
    lemon: ['#FFFADF', '#FFEE9A', '#FFDC5C', '#ECF8CF', '#C99A00'],
  };
  const ART = {
    terminal: () => '<span class="cv-win cv-win--dark"><span class="cv-bar"><i></i><i></i><i></i></span><span class="cv-code"><b style="--w:54%"></b><b class="a" style="--w:34%;--x:9%"></b><b style="--w:70%;--x:9%"></b><b class="g" style="--w:42%;--x:9%"></b><b style="--w:60%"></b><b class="p" style="--w:26%;--x:9%"></b><b style="--w:48%;--x:9%"></b><b class="y" style="--w:30%"></b></span></span>',
    browser: () => '<span class="cv-win"><span class="cv-bar cv-bar--light"><i></i><i></i><i></i><span class="cv-url"></span></span><span class="cv-page"><span class="cv-hero"></span><span class="cv-row"><i></i><i></i><i></i></span><span class="cv-lines"><b style="--w:82%"></b><b style="--w:64%"></b><b style="--w:74%"></b></span></span></span>',
    chat: () => '<span class="cv-chat"><span class="l" style="--w:64%"></span><span class="r" style="--w:46%"></span><span class="l" style="--w:72%"></span><span class="r typing"><i></i><i></i><i></i></span></span>',
    chart: () => '<span class="cv-card"><span class="cv-card__h"><b></b><i></i></span><span class="cv-bars"><i style="--h:38%"></i><i style="--h:62%"></i><i style="--h:48%"></i><i style="--h:80%"></i><i style="--h:66%"></i><i style="--h:94%"></i></span></span>',
    doc: () => '<span class="cv-doc"><b class="t"></b><b style="--w:92%"></b><b style="--w:84%"></b><b class="m" style="--w:70%"></b><b style="--w:88%"></b><b style="--w:62%"></b><b style="--w:78%"></b><span class="cv-doc__tag"></span></span>',
    nodes: () => '<svg class="cv-nodes" viewBox="0 0 200 200" aria-hidden="true"><path class="ln-flow" d="M100 100 46 52M100 100l58-50M100 100 40 150M100 100l62 48M100 100V24"/><circle cx="100" cy="100" r="25" fill="#15181E"/><path d="M100 88l3.5 8.5 8.5 3.5-8.5 3.5-3.5 8.5-3.5-8.5-8.5-3.5 8.5-3.5z" fill="#fff"/><g fill="#fff" stroke="currentColor" stroke-width="3"><circle cx="46" cy="52" r="13"/><circle cx="158" cy="50" r="13"/><circle cx="40" cy="150" r="13"/><circle cx="162" cy="148" r="13"/><circle cx="100" cy="24" r="10"/></g></svg>',
    poster: (c, label) => { const t = esc(c.text || label); return `<span class="cv-poster"><span>${t}</span><span class="o">${t}</span><span>${t}</span></span>`; },
  };
  function cover(c = {}, label = '') {
    const p = Array.isArray(c.palette) ? c.palette : PALETTES[c.palette] || PALETTES.violet;
    const kind = ART[c.kind] ? c.kind : 'browser';
    return `<span class="cover cover--${kind}" style="--c0:${p[0]};--c1:${p[1]};--c2:${p[2]};--c3:${p[3]};--ca:${p[4]}">${ART[kind](c, label)}</span>`;
  }
  const media = (p) => (p.image ? `<img src="${esc(p.image)}" alt="${esc(p.title)}" loading="lazy">` : cover(p.cover, p.title));
  function videoEmbed(src, title = '') {
    const yt = String(src).match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|shorts\/))([\w-]{11})/);
    if (yt) return `<iframe src="https://www.youtube-nocookie.com/embed/${yt[1]}?rel=0" title="${esc(title)}" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen loading="lazy"></iframe>`;
    return `<video src="${esc(src)}" controls playsinline preload="metadata"></video>`;
  }

  /* ---------- avatar ---------- */
  const initials = (n) => String(n || '?').trim().split(/\s+/).map((w) => w[0]).join('').slice(0, 2).toUpperCase();
  function avatar(size = 'md', online = false) {
    const inner = P.avatar ? `<img src="${esc(P.avatar)}" alt="${esc(P.name)}">` : `<span>${esc(initials(P.name))}</span>`;
    return `<span class="avatar avatar--${size}">${inner}${online ? '<span class="online" aria-hidden="true"></span>' : ''}</span>`;
  }

  /* ---------- toast + email ---------- */
  let toastTimer = 0;
  function toast(html) {
    const t = $('#toast');
    t.innerHTML = html;
    t.classList.add('is-show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => t.classList.remove('is-show'), 2600);
  }
  async function copyEmail() {
    const email = P.email || '';
    try {
      await navigator.clipboard.writeText(email);
      toast(`${icon('check')} Copied ${esc(email)}`);
    } catch (e) {
      location.href = `mailto:${email}`;
    }
  }

  /* ---------- theme ---------- */
  const metaTheme = $('meta[name="theme-color"]');
  function applyTheme(t) {
    root.dataset.theme = t;
    try { localStorage.setItem('theme', t); } catch (e) { /* storage blocked */ }
    if (metaTheme) metaTheme.content = t === 'dark' ? '#0C0F15' : '#FBFBFA';
  }
  function toggleTheme(e) {
    const next = root.dataset.theme === 'dark' ? 'light' : 'dark';
    if (!document.startViewTransition || reduced()) { applyTheme(next); return; }
    const b = $('#themeToggle').getBoundingClientRect();
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

  /* ---------- count-up ---------- */
  function countUp(el, dur = 1400) {
    const raw = String(el.dataset.count ?? el.dataset.countTo ?? '');
    const target = parseFloat(raw);
    if (!Number.isFinite(target)) return;
    const suffix = el.dataset.suffix || '';
    const dec = (raw.split('.')[1] || '').length;
    if (reduced()) { el.textContent = target.toFixed(dec) + suffix; return; }
    const t0 = performance.now();
    const tick = (t) => {
      const k = clamp((t - t0) / dur, 0, 1);
      el.textContent = (target * (1 - Math.pow(1 - k, 3))).toFixed(dec) + suffix;
      if (k < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }

  /* =====================================================================
     PROFILE BINDINGS
     ===================================================================== */
  function bindProfile() {
    $$('[data-bind]').forEach((el) => { const v = P[el.dataset.bind]; if (v) el.textContent = v; });
    $$('[data-avatar]').forEach((el) => { el.outerHTML = avatar(el.dataset.avatar, el.hasAttribute('data-online')); });
    const y = $('#year');
    if (y) y.textContent = new Date().getFullYear();
    if (P.name) document.title = `${P.name} · ${P.role || 'Portfolio'} · Agent Skills & Plugins`;
  }

  /* =====================================================================
     HERO
     ===================================================================== */
  const HERO_SLOTS = [
    { type: 'project', side: 'left', x: '3.5%', y: '14%', r: -7, d: 0.9, w: 214 },
    { type: 'term', side: 'left', x: '8%', y: '52%', r: 4, d: 0.45, w: 276 },
    { type: 'project', side: 'left', x: '2%', y: '75%', r: -4, d: 0.7, w: 198 },
    { type: 'project', side: 'right', x: '4%', y: '11%', r: 6, d: 0.85, w: 220 },
    { type: 'toast', side: 'right', x: '9.5%', y: '47%', r: -5, d: 0.4, w: 244 },
    { type: 'project', side: 'right', x: '2.5%', y: '69%', r: 4, d: 0.7, w: 206 },
  ];

  // Featured projects first, then round-robin across categories for variety.
  function heroProjects(n) {
    const order = S.projects.filter((p) => p.featured);
    const lists = S.categories.map((c) => S.projects.filter((p) => p.category === c.id));
    for (let i = 0; i < S.projects.length; i++) {
      lists.forEach((list) => { if (list[i] && !order.includes(list[i])) order.push(list[i]); });
    }
    S.projects.forEach((p) => { if (!order.includes(p)) order.push(p); });
    return order.slice(0, n);
  }

  function projectCard(p, style = '') {
    const c = catById(p.category) || {};
    const col = c.colors || {};
    return `<button class="fcard" type="button" tabindex="-1" data-project="${esc(p.id)}" style="${style}">
      <span class="fcard__media">${media(p)}</span>
      <span class="fcard__meta"><span class="fcard__icon" style="--a:${col.from || '#4A6CFF'};--b:${col.to || '#8B5CF6'}">${icon(catIcon(c))}</span><strong>${esc(p.title)}</strong><small>${esc(c.label || '')} · ${esc(p.year || '')}</small></span>
    </button>`;
  }

  function renderHero() {
    $('#heroStats').innerHTML = (S.heroStats || []).map((s) =>
      `<li class="stat"><span class="stat__num" data-count="${esc(s.value)}" data-suffix="${esc(s.suffix || '')}">${esc(s.value)}${esc(s.suffix || '')}</span><span class="stat__label">${esc(s.label)}</span></li>`).join('');

    const picks = heroProjects(4);
    let pi = 0;
    $('#heroCards').innerHTML = HERO_SLOTS.map((s, k) => {
      const pos = `${s.side}:${s.x};top:${s.y};--r:${s.r}deg;--depth:${s.d};--w:${s.w}px;--k:${k};--bob:${6 + (k % 3) * 1.4}s`;
      if (s.type === 'term') {
        return `<div class="fcard fcard--term" style="${pos}"><div class="mt__bar"><i></i><i></i><i></i><span>agent</span></div><div class="mt__body"><div class="mt__line"><span class="mt__ps">›</span> <span class="mt__typed"></span><span class="caret"></span></div><div class="mt__out"></div></div></div>`;
      }
      if (s.type === 'toast') {
        return `<div class="fcard fcard--toast" style="${pos}"><span class="ft__ic">${icon('check')}</span><span><strong>PR #128 approved</strong><small>24 tests passed · 0 failing</small></span></div>`;
      }
      const p = picks[pi++];
      return p ? projectCard(p, pos) : '';
    }).join('');

    const strip = S.projects.slice(0, 8).map((p, k) => projectCard(p, `--r:${[-3, 2, -2, 3][k % 4]}deg`)).join('');
    $('#heroStrip').innerHTML = strip + strip;
  }

  function initHeroMotion() {
    const hero = $('.hero');
    if (finePointer && !reduced()) {
      hero.addEventListener('pointermove', (e) => {
        hero.style.setProperty('--mx', ((e.clientX / innerWidth) - 0.5) * 2);
        hero.style.setProperty('--my', ((e.clientY / innerHeight) - 0.5) * 2);
      });
      hero.addEventListener('pointerleave', () => { hero.style.setProperty('--mx', 0); hero.style.setProperty('--my', 0); });
      onScroll(() => { if (scrollY < innerHeight * 1.4) hero.style.setProperty('--sy', Math.round(scrollY)); });
    }
    setTimeout(() => $$('.stat__num').forEach((el) => countUp(el)), 850);
    heroTerminalLoop();
  }

  async function heroTerminalLoop() {
    const typed = $('.mt__typed');
    const out = $('.mt__out');
    if (!typed) return;
    const items = (S.skills || []).map((s) => ({
      cmd: ((s.demo || []).find((d) => d.t === 'prompt') || {}).text || s.command,
      done: (((s.demo || []).find((d) => d.t === 'done') || {}).text || 'done').split(' · ')[0],
    }));
    if (!items.length) return;
    if (reduced()) { typed.textContent = items[0].cmd; out.textContent = `✓ ${items[0].done}`; out.classList.add('show'); return; }
    let visible = false;
    new IntersectionObserver(([e]) => { visible = e.isIntersecting; }).observe(typed.closest('.fcard'));
    const idle = () => new Promise((r) => setTimeout(r, 400));
    for (let i = 0; ; i = (i + 1) % items.length) {
      while (!visible || document.hidden) await idle();
      const { cmd, done } = items[i];
      out.classList.remove('show');
      for (let k = 1; k <= cmd.length; k++) { typed.textContent = cmd.slice(0, k); await sleep(50 + Math.random() * 45); }
      await sleep(420);
      out.textContent = `✓ ${done}`;
      out.classList.add('show');
      await sleep(2600);
      for (let k = cmd.length; k >= 0; k--) { typed.textContent = cmd.slice(0, k); await sleep(16); }
      await sleep(320);
    }
  }

  /* =====================================================================
     MARQUEE
     ===================================================================== */
  function renderMarquee() {
    const dots = ['#4A6CFF', '#8B5CF6', '#EC4899', '#F97316', '#10B981', '#06B6D4', '#EAB308'];
    const stack = S.stack || [];
    const half = Math.ceil(stack.length / 2);
    const row = (items, off) => items.map((t, i) => `<span class="tech"><i style="--c:${dots[(i + off) % dots.length]}"></i>${esc(t)}</span>`).join('').repeat(4);
    $('#marquee1').innerHTML = row(stack.slice(0, half), 0);
    $('#marquee2').innerHTML = row(stack.slice(half), 3);
  }

  /* =====================================================================
     SHOWCASE (sticky, scroll-driven profile frame)
     ===================================================================== */
  const SHAPES = { tall: [3, 4], square: [1, 1], wide: [4, 3] };

  function tileHTML(p, k, ratio) {
    return `<button class="tile" type="button" data-project="${esc(p.id)}" style="--i:${k}" aria-label="Open ${esc(p.title)}"><span class="tile__media" style="aspect-ratio:${ratio}">${media(p)}</span><span class="tile__cap"><span>${esc(p.title)}</span>${icon('arrow-up-right')}</span></button>`;
  }

  // Shortest-column-first masonry, plus a "more" tile in the gap that's left.
  function masonryHTML(c) {
    const items = S.projects.filter((p) => p.category === c.id);
    const cols = [[], [], []];
    const h = [0, 0, 0];
    items.forEach((p, k) => {
      const [w, hh] = SHAPES[p.shape] || SHAPES.square;
      const col = h.indexOf(Math.min(...h));
      cols[col].push(tileHTML(p, k, `${w} / ${hh}`));
      h[col] += hh / w;
    });
    const href = c.viewAll || L.github || '#';
    const col = h.indexOf(Math.min(...h));
    cols[col].push(`<a class="tile tile--more" href="${esc(href)}"${extAttrs(href)} style="--i:${items.length}">${icon('arrow-up-right')}<b>More ${esc(c.label)}</b><span>${isExternal(href) ? 'On GitHub' : 'See them run'}</span></a>`);
    return `<div class="masonry">${cols.map((x) => `<div class="masonry__col">${x.join('')}</div>`).join('')}</div>`;
  }

  function posterHTML(c) {
    const run = `<span>${esc(c.poster || c.label)}</span>`.repeat(4);
    const row = (outline) => `<span class="poster__row${outline ? ' poster__row--o' : ''}">${run}${run}</span>`;
    const col = c.colors || {};
    return `<div class="poster" style="--pf:${col.from};--pt:${col.to};--pc:${col.ink}" aria-hidden="true"><div class="poster__rows">${row(1)}${row(0)}${row(1)}${row(0)}</div><span class="poster__badge">${icon(catIcon(c))}${esc(c.label)}</span></div>`;
  }

  function hlHTML(h, c, k) {
    const p = h.project && projectById(h.project);
    const kind = { video: 'poster', article: 'doc', repo: 'terminal', report: 'chart', live: 'browser' }[h.type] || 'doc';
    const thumb = p ? media(p) : cover({ kind, palette: c.palette, text: c.poster || c.label }, c.label);
    const attr = h.url ? `data-href="${esc(h.url)}"` : p ? `data-project="${esc(p.id)}"` : 'data-soon';
    return `<button class="hl-item spot" type="button" ${attr} style="--i:${k + 3}"><span class="hl-item__thumb">${thumb}<span class="hl-item__type">${icon(TYPE_ICONS[h.type] || 'file')}</span></span><span class="hl-item__body"><strong>${esc(h.title)}</strong><span class="hl-item__meta">${esc(h.meta || '')}</span></span></button>`;
  }

  function profileHTML(c, i) {
    const href = c.viewAll || L.github || '#';
    const count = S.projects.filter((p) => p.category === c.id).length;
    const handle = L.github ? `<a href="${esc(L.github)}" target="_blank" rel="noopener">@${esc(P.handle)}</a>` : `<span>@${esc(P.handle)}</span>`;
    return `<article class="profile" id="sc-panel-${esc(c.id)}" role="tabpanel" aria-labelledby="sc-tab-${esc(c.id)}" data-i="${i}">
      <p class="profile__eyebrow">${esc(P.name)}'s profile · <b>${esc(c.label)}</b></p>
      <header class="profile__head">
        <div class="profile__id">
          ${avatar('lg', true)}
          <div>
            <h3 class="profile__name">${esc(P.name)}</h3>
            <p class="profile__meta">${handle}<span class="sep">·</span><span class="profile__badge"><span class="dot"></span>${esc(P.status)}</span><span class="sep">·</span><span>${esc(P.role)}</span></p>
            <p class="profile__bio">${esc(c.bio)}</p>
            <dl class="statbox">${(c.stats || []).map(([v, l]) => `<div><dt>${esc(v)}</dt><dd>${esc(l)}</dd></div>`).join('')}</dl>
          </div>
        </div>
        <div class="profile__side">
          ${posterHTML(c)}
          <div class="profile__tags">${(c.tags || []).map((t) => `<span class="chip">${esc(t)}</span>`).join('')}<span class="profile__loc">${icon('globe')}${esc(P.location)}</span></div>
        </div>
      </header>
      <div class="ptabs" role="tablist" aria-label="${esc(c.label)} details">
        ${['Projects', 'Stack', 'About'].map((t, k) => `<button class="ptab${k ? '' : ' is-active'}" type="button" role="tab" aria-selected="${k === 0}">${t}</button>`).join('')}
        <span class="ptabs__ink" aria-hidden="true"></span>
      </div>
      <div class="ppanels">
        <div class="ppanel is-active" role="tabpanel">
          <div class="pgrid">
            ${masonryHTML(c)}
            <aside class="hl">
              <div class="hl__head"><h4>Demos &amp; write-ups</h4><a href="${esc(href)}"${extAttrs(href)}>View all</a></div>
              <div class="hl-list">${(c.highlights || []).map((h, k) => hlHTML(h, c, k)).join('')}</div>
            </aside>
          </div>
        </div>
        <div class="ppanel" role="tabpanel">
          <div class="stackgrid">${(c.stack || []).map(([n, note], k) => `<div class="stackitem" style="--i:${k}"><span class="stackitem__ic" style="--a:${c.colors.from};--b:${c.colors.to}">${esc(n.charAt(0))}</span><span><strong>${esc(n)}</strong><small>${esc(note)}</small></span></div>`).join('')}</div>
        </div>
        <div class="ppanel" role="tabpanel">
          <div class="pabout"><p>${esc(c.about)}</p><ul class="pabout__facts"><li><span>Focus</span><b>${esc(c.label)}</b></li><li><span>Projects here</span><b>${count}</b></li><li><span>Go-to tools</span><b>${esc((c.tags || []).slice(0, 2).join(', '))}</b></li></ul></div>
        </div>
      </div>
    </article>`;
  }

  function renderShowcase() {
    const cats = S.categories;
    $('#scTrack').style.setProperty('--n', cats.length);
    $('#scTotal').textContent = pad(cats.length);
    $('#scList').innerHTML = cats.map((c, i) => `<button class="sc-item" type="button" role="tab" id="sc-tab-${esc(c.id)}" aria-controls="sc-panel-${esc(c.id)}" aria-selected="false" data-i="${i}">${esc(c.label)}</button>`).join('');
    $('#scScreen').innerHTML = cats.map(profileHTML).join('');
  }

  function moveInk(profile) {
    const t = $('.ptab.is-active', profile);
    const ink = $('.ptabs__ink', profile);
    if (!t || !ink) return;
    ink.style.width = `${t.offsetWidth}px`;
    ink.style.transform = `translateX(${t.offsetLeft}px)`;
  }

  function initShowcase() {
    const track = $('#scTrack');
    const list = $('#scList');
    const items = $$('.sc-item');
    const profiles = $$('.profile');
    const bar = $('.sc-bar span');
    const desktop = matchMedia('(min-width: 1200px)'); // matches the CSS breakpoint for the sticky layout
    let active = -1;

    function setActive(i) {
      if (i === active) return;
      active = i;
      items.forEach((el, k) => { el.classList.toggle('is-active', k === i); el.setAttribute('aria-selected', String(k === i)); el.tabIndex = k === i ? 0 : -1; });
      profiles.forEach((el, k) => { el.classList.toggle('is-active', k === i); el.inert = k !== i; });
      $('#scIndex').textContent = pad(i + 1);
      if (!desktop.matches && list.scrollWidth > list.clientWidth) {
        const it = items[i];
        list.scrollTo({ left: it.offsetLeft - (list.clientWidth - it.offsetWidth) / 2, behavior: reduced() ? 'auto' : 'smooth' });
      }
      requestAnimationFrame(() => moveInk(profiles[i]));
    }

    onScroll(() => {
      if (!desktop.matches) return;
      const r = track.getBoundingClientRect();
      const total = r.height - innerHeight;
      if (total <= 0) return;
      const p = clamp(-r.top / total, 0, 1);
      bar.style.setProperty('--p', p.toFixed(3));
      setActive(Math.min(items.length - 1, Math.floor(p * items.length)));
    });

    items.forEach((el, i) => el.addEventListener('click', () => {
      if (!desktop.matches) { setActive(i); return; }
      const r = track.getBoundingClientRect();
      const total = r.height - innerHeight;
      window.scrollTo({ top: scrollY + r.top + total * ((i + 0.5) / items.length), behavior: reduced() ? 'auto' : 'smooth' });
    }));
    list.addEventListener('keydown', (e) => {
      const d = { ArrowDown: 1, ArrowRight: 1, ArrowUp: -1, ArrowLeft: -1 }[e.key];
      if (!d) return;
      e.preventDefault();
      const n = (active + d + items.length) % items.length;
      items[n].focus();
      items[n].click();
    });

    profiles.forEach((pr) => {
      const tabs = $$('.ptab', pr);
      const panels = $$('.ppanel', pr);
      tabs.forEach((t, k) => t.addEventListener('click', () => {
        tabs.forEach((x, j) => { x.classList.toggle('is-active', j === k); x.setAttribute('aria-selected', String(j === k)); });
        panels.forEach((x, j) => x.classList.toggle('is-active', j === k));
        moveInk(pr);
      }));
    });

    setActive(0);
    const reink = () => profiles.forEach(moveInk);
    addEventListener('resize', reink);
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(reink);
  }

  /* =====================================================================
     STICKY NOTES (drop in, draggable with a mouse)
     ===================================================================== */
  const NOTE_COLORS = { mint: '#B5F0C9', lavender: '#D9CBFF', peach: '#FFC2B0', butter: '#FFE59E', aqua: '#B5F1EC', pink: '#FFC9E3' };
  const NOTE_POS = [
    { x: '0%', y: '6%', r: -4 }, { x: '31%', y: '13%', r: 3 }, { x: '62%', y: '0%', r: -2 },
    { x: '14%', y: '51%', r: 2.5 }, { x: '46%', y: '47%', r: -3.5 }, { x: '70%', y: '52%', r: 4 },
  ];
  let noteZ = 10;

  function renderNotes() {
    const wrap = $('#notes');
    wrap.innerHTML = (S.notes || []).slice(0, NOTE_POS.length).map((n, i) => {
      const p = NOTE_POS[i];
      return `<div class="note" style="--x:${p.x};--y:${p.y};--r:${p.r}deg;--i:${i};--nc:${NOTE_COLORS[n.color] || n.color || NOTE_COLORS.butter}">${esc(n.text)}</div>`;
    }).join('');
    new IntersectionObserver(([e], obs) => {
      if (e.isIntersecting) { wrap.classList.add('is-in'); obs.disconnect(); }
    }, { threshold: 0.25 }).observe(wrap);
    if (finePointer) $$('.note', wrap).forEach(makeDraggable);
  }

  function makeDraggable(el) {
    let sx = 0; let sy = 0; let dx = 0; let dy = 0;
    el.addEventListener('pointerdown', (e) => {
      el.setPointerCapture(e.pointerId);
      el.classList.add('is-drag');
      el.style.zIndex = ++noteZ;
      sx = e.clientX - dx; sy = e.clientY - dy;
    });
    el.addEventListener('pointermove', (e) => {
      if (!el.hasPointerCapture(e.pointerId)) return;
      dx = e.clientX - sx; dy = e.clientY - sy;
      el.style.translate = `${dx}px ${dy}px`;
    });
    const end = () => el.classList.remove('is-drag');
    el.addEventListener('pointerup', end);
    el.addEventListener('pointercancel', end);
  }

  /* =====================================================================
     SKILLS & PLUGINS LAB (terminal demo player)
     ===================================================================== */
  const MARKS = { warn: '▲', info: '•', ok: '✓', feat: '+', fix: '~', break: '!' };

  function hlMarkdown(src) {
    let fence = 0;
    return src.split('\n').map((raw) => {
      const l = esc(raw);
      if (raw.trim() === '---') { fence++; return `<span class="t-punc">${l}</span>`; }
      if (fence === 1) {
        const m = l.match(/^([\w-]+)(:)(.*)$/);
        return m ? `<span class="t-key">${m[1]}</span><span class="t-punc">${m[2]}</span><span class="t-str">${m[3]}</span>` : l;
      }
      if (/^#{1,6}\s/.test(raw)) return `<span class="t-h">${l}</span>`;
      return l.replace(/^(\s*)(\d+\.|[-*])(\s)/, '$1<span class="t-bullet">$2</span>$3').replace(/`([^`]+)`/g, '<span class="t-code">`$1`</span>');
    }).join('\n');
  }
  function hlJSON(src) {
    return src.replace(/("(?:[^"\\]|\\.)*")(\s*:)?|\b(true|false|null)\b|(-?\d+(?:\.\d+)?)|([{}[\],])/g, (m, str, colon, kw, num, punc) => {
      if (str) return colon ? `<span class="t-key">${esc(str)}</span><span class="t-punc">${colon}</span>` : `<span class="t-str">${esc(str)}</span>`;
      if (kw) return `<span class="t-kw">${kw}</span>`;
      if (num) return `<span class="t-num">${num}</span>`;
      return `<span class="t-punc">${punc}</span>`;
    });
  }
  function hlPython(src) {
    const re = /("""[\s\S]*?"""|"(?:[^"\\\n]|\\.)*"|'(?:[^'\\\n]|\\.)*')|(#[^\n]*)|(@[\w.]+)|\b(from|import|def|return|if|not|raise|class|as|with|for|in|and|or|is|None|True|False|async|await|lambda|yield|try|except|else|elif)\b|\b(\d+(?:\.\d+)?)\b|\b([A-Za-z_]\w*)(?=\()/g;
    let out = '';
    let last = 0;
    let m;
    while ((m = re.exec(src))) {
      const [tok, str, com, dec, kw, num] = m;
      const cls = str ? 't-str' : com ? 't-com' : dec ? 't-dec' : kw ? 't-kw' : num ? 't-num' : 't-fn';
      out += esc(src.slice(last, m.index)) + `<span class="${cls}">${esc(tok)}</span>`;
      last = m.index + tok.length;
    }
    return out + esc(src.slice(last));
  }
  const highlight = (src, lang) => (lang === 'json' ? hlJSON(src) : lang === 'py' ? hlPython(src) : hlMarkdown(src));

  function initLab() {
    const list = $('#skillList');
    const screen = $('#termScreen');
    const progress = $('#termProgress');
    const replay = $('#termReplay');
    const title = $('#termTitle');
    const tabs = $$('.term__tab');
    const panels = $$('.term__panel');
    const skills = S.skills || [];
    if (!skills.length) return { select() {} };

    let current = 0; let run = 0; let timer = 0;
    let touched = false; let inView = false; let started = false; let finished = false;

    list.innerHTML = skills.map((s, i) => {
      const k = String(s.kind || 'Skill').toLowerCase();
      return `<button class="skill spot" type="button" role="tab" aria-selected="false" data-i="${i}">
        <span class="skill__ic">${icon(KIND_ICONS[k] || 'sparkles')}</span>
        <span class="skill__body"><span class="skill__top"><span class="skill__cmd">${esc(s.command)}</span><span class="kind kind--${KIND_CLASS[k] || 'skill'}">${esc(s.kind)}</span></span><span class="skill__sum">${esc(s.summary)}</span></span>
        <span class="skill__bar" aria-hidden="true"><i></i></span>
      </button>`;
    }).join('');
    const btns = $$('.skill', list);

    function setTab(name) {
      tabs.forEach((t) => { const on = t.dataset.tab === name; t.classList.toggle('is-active', on); t.setAttribute('aria-selected', String(on)); });
      panels.forEach((p) => p.classList.toggle('is-active', p.dataset.panel === name));
    }

    function renderSource(s) {
      const mainFile = /SKILL\.md|plugin\.json|server\.py/;
      const tree = (s.files || []).map((f, k) => `<span class="${k && mainFile.test(f) ? 'is-main' : ''}">${esc(f)}</span>`).join('\n');
      const name = s.sourceName || { md: 'SKILL.md', json: '.claude-plugin/plugin.json', py: 'server.py' }[s.lang] || 'source';
      $('#termSource').innerHTML = `<div class="src-tree"><span class="src-tree__label">Files</span>${tree}</div><div class="src-code"><span class="src-code__label">${esc(name)}</span><pre><code>${highlight(s.source || '', s.lang)}</code></pre></div>`;
    }

    function renderVideo(s) {
      $('#termVideo').innerHTML = s.video
        ? videoEmbed(s.video, s.command)
        : `<div class="vid-empty"><span class="vid-empty__play">${icon('play')}</span><strong>Video walkthrough coming soon</strong><p>Meanwhile, the live demo shows exactly what <code>${esc(s.command)}</code> does.</p><button class="btn btn--glass btn--sm" type="button" data-goto-demo>${icon('play')}Watch the demo</button></div>`;
    }

    function prepare(i) {
      current = i;
      btns.forEach((b, k) => { b.classList.toggle('is-active', k === i); b.setAttribute('aria-selected', String(k === i)); b.style.setProperty('--p', '0%'); });
      const s = skills[i];
      title.textContent = `agent · ~/acme-app · ${s.command}`;
      renderSource(s);
      renderVideo(s);
    }

    function select(i, byUser) {
      if (byUser) touched = true;
      clearTimeout(timer);
      prepare(i);
      if (byUser && list.scrollWidth > list.clientWidth) {
        list.scrollTo({ left: btns[i].offsetLeft - 4, behavior: reduced() ? 'auto' : 'smooth' });
      }
      play(skills[i]);
    }

    const addLine = (cls, html = '') => {
      const d = document.createElement('div');
      d.className = `ln ${cls}`;
      d.innerHTML = html;
      screen.appendChild(d);
      screen.scrollTop = screen.scrollHeight;
      return d;
    };
    async function typeInto(el, text, id) {
      for (let k = 1; k <= text.length; k++) {
        if (id !== run) return;
        el.textContent = text.slice(0, k);
        await sleep(30 + Math.random() * 34);
      }
    }
    async function step(st, id) {
      switch (st.t) {
        case 'prompt': {
          const d = addLine('ln--prompt', '<span class="ps">›</span> <span class="tx"></span><span class="caret"></span>');
          await sleep(260);
          await typeInto($('.tx', d), st.text, id);
          await sleep(380);
          const c = $('.caret', d);
          if (c) c.remove();
          break;
        }
        case 'skill': {
          const d = addLine('ln--skill', `<span class="st"><span class="spin"></span></span> Loading skill <b>${esc(st.text)}</b>…`);
          await sleep(900);
          d.innerHTML = `<span class="st">◆</span> Skill <b>${esc(st.text)}</b> loaded`;
          break;
        }
        case 'tool': {
          const d = addLine('ln--tool', `<span class="br">⎿</span><span class="tn">${esc(st.name)}</span><span class="ta">${esc(st.arg)}</span><span class="to"><span class="spin"></span></span>`);
          await sleep(st.ms || 760);
          $('.to', d).textContent = st.out;
          break;
        }
        case 'h': addLine('ln--h', fmt(st.text)); await sleep(220); break;
        case 'list': {
          const d = addLine('ln--list');
          for (const raw of st.items || []) {
            if (id !== run) return;
            const cut = raw.indexOf('|');
            const type = cut > -1 ? raw.slice(0, cut) : 'info';
            const text = cut > -1 ? raw.slice(cut + 1) : raw;
            const row = document.createElement('div');
            row.className = `li li--${type}`;
            row.innerHTML = `<span class="lb">${MARKS[type] || '•'}</span>${fmt(text)}`;
            d.appendChild(row);
            screen.scrollTop = screen.scrollHeight;
            await sleep(280);
          }
          break;
        }
        case 'done': addLine('ln--done', `<span class="ok">✓</span> ${fmt(st.text)}`); break;
        default: addLine('', fmt(st.text || ''));
      }
    }

    function scheduleNext() {
      clearTimeout(timer);
      if (touched || !inView || reduced() || skills.length < 2) return;
      timer = setTimeout(() => { if (!touched && inView) select((current + 1) % skills.length); }, 4200);
    }

    async function play(s) {
      const id = ++run;
      finished = false;
      replay.classList.remove('is-ready');
      screen.innerHTML = '';
      const steps = s.demo || [];
      const setP = (k) => {
        const pct = `${steps.length ? (k / steps.length) * 100 : 100}%`;
        progress.style.width = pct;
        btns[current].style.setProperty('--p', pct);
      };
      setP(0);
      for (let k = 0; k < steps.length; k++) {
        await step(steps[k], id);
        if (id !== run) return;
        setP(k + 1);
        await sleep(300);
        if (id !== run) return;
      }
      finished = true;
      replay.classList.add('is-ready');
      scheduleNext();
    }

    list.addEventListener('click', (e) => { const b = e.target.closest('.skill'); if (b) select(+b.dataset.i, true); });
    list.addEventListener('keydown', (e) => {
      const d = { ArrowDown: 1, ArrowRight: 1, ArrowUp: -1, ArrowLeft: -1 }[e.key];
      if (!d) return;
      e.preventDefault();
      const n = (current + d + skills.length) % skills.length;
      btns[n].focus();
      select(n, true);
    });
    tabs.forEach((t) => t.addEventListener('click', () => { touched = true; clearTimeout(timer); setTab(t.dataset.tab); }));
    replay.addEventListener('click', () => { touched = true; setTab('demo'); play(skills[current]); });
    $('#termVideo').addEventListener('click', (e) => {
      if (e.target.closest('[data-goto-demo]')) { touched = true; setTab('demo'); play(skills[current]); }
    });

    prepare(0);
    screen.innerHTML = `<div class="term__idle">${icon('terminal')}<span>Scroll here to start the demo</span></div>`;
    new IntersectionObserver(([e]) => {
      inView = e.isIntersecting;
      if (inView && !started) { started = true; select(0); }
      else if (inView && finished) scheduleNext();
      else if (!inView) clearTimeout(timer);
    }, { threshold: 0.35 }).observe($('#term'));

    return { select: (i) => { setTab('demo'); select(i, true); } };
  }

  /* =====================================================================
     ABOUT + CONTACT
     ===================================================================== */
  function renderAbout() {
    $('#aboutBio').innerHTML = (P.bio || []).map((p) => `<p>${esc(p)}</p>`).join('');
    $('#aboutLinks').innerHTML = [
      L.resume && `<a class="btn btn--primary btn--sm" href="${esc(L.resume)}" target="_blank" rel="noopener">${icon('file')}Résumé</a>`,
      L.github && `<a class="btn btn--soft btn--sm" href="${esc(L.github)}" target="_blank" rel="noopener">${icon('github')}GitHub</a>`,
      L.linkedin && `<a class="btn btn--soft btn--sm" href="${esc(L.linkedin)}" target="_blank" rel="noopener">${icon('linkedin')}LinkedIn</a>`,
      `<button class="btn btn--soft btn--sm" type="button" data-copy-email>${icon('mail')}Email</button>`,
    ].filter(Boolean).join('');
    $('#timeline').innerHTML = (S.timeline || []).map((t) =>
      `<li class="tl-item" data-reveal><span class="tl-item__dot">${icon(t.icon || 'sparkles')}</span><p class="tl-item__when">${esc(t.when)}</p><h3 class="tl-item__title">${esc(t.title)}</h3><p class="tl-item__org">${esc(t.org)}</p>${t.text ? `<p class="tl-item__text">${esc(t.text)}</p>` : ''}</li>`).join('');
    $('#toolbox').innerHTML = (S.toolbox || []).map(([group, items]) =>
      `<div class="tool-group spot" data-reveal><h4>${esc(group)}</h4><ul>${items.map((x) => `<li class="chip">${esc(x)}</li>`).join('')}</ul></div>`).join('');

    const wrap = $('#timelineWrap');
    onScroll(() => {
      const r = wrap.getBoundingClientRect();
      wrap.style.setProperty('--tp', clamp((innerHeight * 0.65 - r.top) / r.height, 0, 1).toFixed(3));
    });
  }

  function renderContact() {
    $('#contactActions').innerHTML = [
      `<button class="btn btn--light btn--lg magnetic" type="button" data-copy-email>${icon('mail')}Copy email</button>`,
      L.github && `<a class="btn btn--glass btn--lg" href="${esc(L.github)}" target="_blank" rel="noopener">${icon('github')}GitHub</a>`,
      L.linkedin && `<a class="btn btn--glass btn--lg" href="${esc(L.linkedin)}" target="_blank" rel="noopener">${icon('linkedin')}LinkedIn</a>`,
      L.resume && `<a class="btn btn--glass btn--lg" href="${esc(L.resume)}" target="_blank" rel="noopener">${icon('file')}Résumé</a>`,
    ].filter(Boolean).join('');
  }

  /* =====================================================================
     PROJECT MODAL
     ===================================================================== */
  const modal = $('#modal');
  const modalBody = $('#modalBody');
  function openProject(id) {
    const p = projectById(id);
    if (!p) return;
    const c = catById(p.category) || {};
    const links = p.links || {};
    const buttons = [
      links.live && `<a class="btn btn--primary" href="${esc(links.live)}" target="_blank" rel="noopener">${icon('external')}Live demo</a>`,
      links.repo && `<a class="btn btn--soft" href="${esc(links.repo)}" target="_blank" rel="noopener">${icon('github')}Source code</a>`,
    ].filter(Boolean).join('');
    modalBody.innerHTML = `<div class="m-media">${links.video ? videoEmbed(links.video, p.title) : media(p)}</div>
      <div class="m-content">
        <p class="m-eyebrow">${esc(c.label || '')}${p.year ? ` · ${esc(p.year)}` : ''}</p>
        <h3 class="m-title" id="modalTitle">${esc(p.title)}</h3>
        <p class="m-lead">${fmt(p.summary)}</p>
        ${(p.details || []).length ? `<ul class="m-list">${p.details.map((d) => `<li>${icon('check-circle')}<span>${fmt(d)}</span></li>`).join('')}</ul>` : ''}
        ${(p.stack || []).length ? `<div class="m-stack">${p.stack.map((s) => `<span class="chip">${esc(s)}</span>`).join('')}</div>` : ''}
        <div class="m-links">${buttons || `<span class="m-soon">Links and a full write-up are coming soon.</span>`}</div>
      </div>`;
    if (!modal.open) modal.showModal();
    modalBody.scrollTop = 0;
  }
  modal.addEventListener('click', (e) => { if (e.target === modal || e.target.closest('[data-close]')) modal.close(); });
  modal.addEventListener('close', () => { modalBody.innerHTML = ''; });

  /* =====================================================================
     COMMAND PALETTE ( / or Ctrl+K )
     ===================================================================== */
  function initPalette(lab) {
    const dlg = $('#palette');
    const input = $('#paletteInput');
    const list = $('#paletteList');
    const go = (sel) => () => { const el = $(sel); if (el) el.scrollIntoView({ behavior: reduced() ? 'auto' : 'smooth', block: 'start' }); };
    const openUrl = (u) => () => window.open(u, '_blank', 'noopener');
    const cmds = [
      { group: 'Navigate', cmd: '/work', label: 'Browse my projects', icon: 'layers', run: go('#work') },
      { group: 'Navigate', cmd: '/skills', label: 'Watch a skill run', icon: 'terminal', run: go('#labDemo') },
      { group: 'Navigate', cmd: '/about', label: 'About me', icon: 'user', run: go('#about') },
      { group: 'Navigate', cmd: '/contact', label: 'Get in touch', icon: 'mail', run: go('#contact') },
      { group: 'Actions', cmd: '/email', label: 'Copy my email address', icon: 'copy', run: copyEmail },
      L.github && { group: 'Actions', cmd: '/github', label: 'Open my GitHub', icon: 'github', run: openUrl(L.github) },
      L.linkedin && { group: 'Actions', cmd: '/linkedin', label: 'Open my LinkedIn', icon: 'linkedin', run: openUrl(L.linkedin) },
      L.resume && { group: 'Actions', cmd: '/resume', label: 'Open my résumé', icon: 'file', run: openUrl(L.resume) },
      { group: 'Actions', cmd: '/theme', label: 'Toggle dark mode', icon: 'moon', run: () => toggleTheme() },
      ...(S.skills || []).map((s, i) => ({ group: 'Demos', cmd: `/demo ${s.id}`, label: `Run the ${s.command} demo`, icon: 'play', run: () => { go('#labDemo')(); lab.select(i); } })),
      ...S.projects.map((p) => ({ group: 'Projects', cmd: `/${p.id}`, label: p.title, icon: catIcon(catById(p.category)), run: () => openProject(p.id) })),
    ].filter(Boolean);

    let shown = [];
    let sel = 0;
    function mark() {
      $$('li[data-i]', list).forEach((li) => {
        const on = +li.dataset.i === sel;
        li.classList.toggle('is-sel', on);
        li.setAttribute('aria-selected', String(on));
      });
      input.setAttribute('aria-activedescendant', shown.length ? `pc-${sel}` : '');
      const cur = $('.is-sel', list);
      if (cur) cur.scrollIntoView({ block: 'nearest' });
    }
    function render() {
      const q = input.value.trim().toLowerCase().replace(/^\//, '');
      shown = cmds.filter((c) => !q || `${c.cmd} ${c.label}`.toLowerCase().includes(q));
      sel = clamp(sel, 0, Math.max(0, shown.length - 1));
      let html = '';
      let group = '';
      shown.forEach((c, i) => {
        if (c.group !== group) { group = c.group; html += `<li class="pc-group" role="presentation">${esc(group)}</li>`; }
        html += `<li role="option" id="pc-${i}" data-i="${i}" aria-selected="false"><span class="pc-ic">${icon(c.icon)}</span><code>${esc(c.cmd)}</code><span class="pc-label">${esc(c.label)}</span><kbd>↵</kbd></li>`;
      });
      list.innerHTML = html || `<li class="pc-empty">No command matches “${esc(input.value)}”.</li>`;
      mark();
    }
    function runCmd(c) {
      if (!c) return;
      dlg.close();
      setTimeout(() => c.run(), 80);
    }
    function open() {
      if (dlg.open) return;
      if (modal.open) modal.close();
      input.value = '';
      sel = 0;
      render();
      dlg.showModal();
      input.focus();
    }

    input.addEventListener('input', () => { sel = 0; render(); });
    input.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
        e.preventDefault();
        if (!shown.length) return;
        sel = (sel + (e.key === 'ArrowDown' ? 1 : -1) + shown.length) % shown.length;
        mark();
      } else if (e.key === 'Enter') {
        e.preventDefault();
        runCmd(shown[sel]);
      }
    });
    list.addEventListener('click', (e) => { const li = e.target.closest('li[data-i]'); if (li) runCmd(shown[+li.dataset.i]); });
    list.addEventListener('mousemove', (e) => { const li = e.target.closest('li[data-i]'); if (li && +li.dataset.i !== sel) { sel = +li.dataset.i; mark(); } });
    dlg.addEventListener('click', (e) => { if (e.target === dlg) dlg.close(); });
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
     NAV, REVEAL, POINTER EFFECTS
     ===================================================================== */
  function initNav() {
    const nav = $('#nav');
    const bar = $('.scroll-progress span');
    const darkZones = $$('[data-nav="dark"]');
    const links = $$('.nav__links a');
    const targets = links.map((a) => $(a.getAttribute('href')));
    onScroll(() => {
      const y = 46;
      nav.classList.toggle('is-dark', darkZones.some((z) => { const r = z.getBoundingClientRect(); return r.top <= y && r.bottom >= y; }));
      nav.classList.toggle('is-scrolled', scrollY > 8);
      const mid = innerHeight * 0.35;
      let cur = -1;
      targets.forEach((t, i) => { if (!t) return; const r = t.getBoundingClientRect(); if (r.top <= mid && r.bottom > mid) cur = i; });
      links.forEach((a, i) => a.classList.toggle('is-active', i === cur));
      const max = root.scrollHeight - innerHeight;
      bar.style.transform = `scaleX(${max > 0 ? clamp(scrollY / max, 0, 1) : 0})`;
    });

    const btn = $('#menuBtn');
    const menu = $('#mobileMenu');
    const setMenu = (open) => {
      menu.hidden = !open;
      btn.setAttribute('aria-expanded', String(open));
      btn.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
      btn.innerHTML = icon(open ? 'x' : 'menu');
    };
    btn.addEventListener('click', () => setMenu(menu.hidden));
    menu.addEventListener('click', (e) => { if (e.target.closest('a, button')) setMenu(false); });
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && !menu.hidden) setMenu(false); });
    $('#themeToggle').addEventListener('click', toggleTheme);
  }

  async function typeOut(el) {
    const text = el.dataset.type || '';
    if (reduced()) { el.textContent = text; el.classList.add('is-done'); return; }
    await sleep(700);
    for (let k = 1; k <= text.length; k++) { el.textContent = text.slice(0, k); await sleep(14 + Math.random() * 22); }
    el.classList.add('is-done');
  }

  function initReveal() {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (!e.isIntersecting) return;
        const el = e.target;
        el.classList.add('is-in');
        $$('[data-type]', el).forEach(typeOut);
        $$('[data-count-to]', el).forEach((n) => setTimeout(() => countUp(n, 1100), reduced() ? 0 : 2000));
        io.unobserve(el);
      });
    }, { threshold: 0.18, rootMargin: '0px 0px -6% 0px' });
    $$('[data-reveal]').forEach((el) => io.observe(el));
  }

  function initPointerFx() {
    if (!finePointer) return;
    document.addEventListener('pointermove', (e) => {
      const el = e.target.closest && e.target.closest('.spot');
      if (!el) return;
      const r = el.getBoundingClientRect();
      el.style.setProperty('--sx', `${e.clientX - r.left}px`);
      el.style.setProperty('--sy', `${e.clientY - r.top}px`);
    }, { passive: true });
    if (reduced()) return;
    let mag = null;
    document.addEventListener('pointermove', (e) => {
      const el = e.target.closest && e.target.closest('.magnetic');
      if (mag && mag !== el) { mag.style.translate = ''; mag = null; }
      if (!el) return;
      mag = el;
      const r = el.getBoundingClientRect();
      el.style.translate = `${(e.clientX - r.left - r.width / 2) * 0.22}px ${(e.clientY - r.top - r.height / 2) * 0.3}px`;
    }, { passive: true });
  }

  /* =====================================================================
     BOOT
     ===================================================================== */
  bindProfile();
  renderHero();
  renderMarquee();
  renderShowcase();
  renderNotes();
  const lab = initLab();
  renderAbout();
  renderContact();
  hydrateIcons();
  const palette = initPalette(lab);
  initNav();
  initShowcase();
  initHeroMotion();
  initReveal();
  initPointerFx();

  document.addEventListener('click', (e) => {
    const t = e.target.closest('[data-project], [data-copy-email], [data-palette], [data-soon], [data-href]');
    if (!t) return;
    if (t.hasAttribute('data-project')) { e.preventDefault(); openProject(t.dataset.project); }
    else if (t.hasAttribute('data-copy-email')) { e.preventDefault(); copyEmail(); }
    else if (t.hasAttribute('data-palette')) { e.preventDefault(); palette.open(); }
    else if (t.hasAttribute('data-soon')) toast(`${icon('sparkles')} Coming soon`);
    else if (t.hasAttribute('data-href')) window.open(t.dataset.href, '_blank', 'noopener');
  });

  runScroll();
})();
