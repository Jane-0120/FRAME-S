(() => {
  'use strict';

  const ARTISTS = window.ARTISTS;
  const EX = window.EXHIBITION;
  const N = ARTISTS.length;
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];
  const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
  const lerp = (a, b, t) => a + (b - a) * t;
  const pad = n => String(n).padStart(2, '0');
  const angDiff = (from, to) => ((to - from + 540) % 360) - 180;
  const store = {
    get(k) { try { return localStorage.getItem(k); } catch (e) { return null; } },
    set(k, v) { try { localStorage.setItem(k, v); } catch (e) { /* ignore */ } }
  };
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const finePointer = matchMedia('(pointer: fine)').matches;

  /* ───────── assets ───────── */
  ARTISTS.forEach((a, i) => { a._thumb = a.thumb || Placeholder.cover(i); });
  const catalogCache = {};
  function getCatalog(i) {
    const a = ARTISTS[i];
    if (a.catalog && a.catalog.length) return Promise.resolve(a.catalog);
    return catalogCache[i] || (catalogCache[i] = Placeholder.catalog(i, a));
  }

  /* ───────── theme ───────── */
  const root = document.documentElement;
  function setTheme(t) {
    root.dataset.theme = t;
    $('#themeBtn').setAttribute('aria-pressed', String(t === 'dark'));
    store.set('seven-theme', t);
  }
  setTheme(store.get('seven-theme') || 'dark');
  $('#themeBtn').addEventListener('click', () => setTheme(root.dataset.theme === 'dark' ? 'light' : 'dark'));

  /* ───────── cursor label ───────── */
  const cursor = $('#cursor'), cursorLabel = $('#cursorLabel');
  const cur = { x: -200, y: -200, tx: -200, ty: -200 };
  addEventListener('pointerover', e => {
    const t = e.target.closest('[data-cursor]');
    cursor.classList.toggle('on', !!t);
    if (t) cursorLabel.textContent = t.dataset.cursor;
  });

  /* ───────── HOME: build ───────── */
  const home = $('#home'), stage = $('#stage'), world = $('#world');
  const S = {
    layout: 'stack', p: 0, pv: 0,
    mx: 0, my: 0, mxv: 0, myv: 0,
    px: innerWidth / 2, py: innerHeight / 2, pxv: innerWidth / 2, pyv: innerHeight / 2,
    hover: -1, sticky: -1, t: 0, running: true, dot: 0,
    w: { tz: 0, rx: 0, ry: 0, tx: 0, ty: 0 }
  };
  const A5 = 1.414; // poster ratio (1 : 1.414)
  let W = innerWidth, H = innerHeight, cw = 300, ch = 424;

  const cards = ARTISTS.map((a, i) => {
    const el = document.createElement('button');
    el.type = 'button';
    el.className = 'card';
    el.dataset.cursor = 'View';
    el.setAttribute('aria-label', `${a.name} — ${a.title}`);
    el.innerHTML = `<span class="card-inner"><img src="${a._thumb}" alt="" draggable="false"><span class="card-meta"><span>${a.name}</span><span>${a.title}</span></span></span>`;
    const inner = el.querySelector('.card-inner');
    el.addEventListener('pointerenter', () => hoverCard(i));
    el.addEventListener('pointerleave', () => {
      inner.style.transform = '';
      if (S.layout !== 'stack' && S.hover === i) S.hover = -1; // stack keeps its featured card (see hoverCard)
    });
    el.addEventListener('pointermove', e => {
      if (!finePointer || drag || S.layout === 'tunnel' || S.layout === 'stack') return;
      const r = el.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width - 0.5, py = (e.clientY - r.top) / r.height - 0.5;
      inner.style.transform = `perspective(900px) rotateX(${(-py * 10).toFixed(2)}deg) rotateY(${(px * 12).toFixed(2)}deg)`;
    });
    el.addEventListener('click', () => onCardClick(i, el));
    world.append(el);
    return el;
  });
  const state = ARTISTS.map(() => ({ x: 0, y: 0, z: -900, rx: 0, ry: 0, rz: 0, s: 0.6, o: 0 }));

  /* Stack: hovering a card slides the whole row (tilt unchanged) so that card sits
     near the centre of the screen. A row sliding under a resting cursor would keep
     re-targeting, so a new card is only taken once the pointer itself has moved
     (≥24px since the last shift) and rested on it briefly. */
  // slot offset that puts a card at screen centre (matches x0 in the stack layout)
  const stackCentre = () => (W < 760 ? 0.75 : 1.5);
  let hoverT, clearT, cand = -1;
  let lastPt = { x: 0, y: 0 }, anchorPt = { x: -999, y: -999 };
  function hoverCard(i) {
    if (S.layout === 'stack') return; // handled by the pointermove logic below
    clearTimeout(clearT);
    S.hover = i;
  }
  function commitStack(i) {
    S.hover = i;
    S.sticky = i;
    S.p = i - stackCentre();
    anchorPt = { ...lastPt };
  }
  home.addEventListener('pointermove', e => {
    lastPt = { x: e.clientX, y: e.clientY };
    if (S.layout !== 'stack' || drag) return;
    const c = e.target.closest('.card');
    if (!c) {
      cand = -1;
      clearTimeout(hoverT);
      if (S.hover >= 0 && !clearT) clearT = setTimeout(() => { S.hover = -1; clearT = 0; }, 400);
      return;
    }
    clearTimeout(clearT); clearT = 0;
    const i = cards.indexOf(c);
    if (i === S.hover || i === cand) return;
    if (Math.hypot(lastPt.x - anchorPt.x, lastPt.y - anchorPt.y) < 24) return;
    cand = i;
    clearTimeout(hoverT);
    hoverT = setTimeout(() => { if (cand === i) { cand = -1; commitStack(i); } }, 140);
  });

  // index list
  const indexList = $('#indexList');
  ARTISTS.forEach((a, i) => {
    const li = document.createElement('li');
    li.style.setProperty('--d', i);
    li.innerHTML = `<button type="button" data-cursor="Play"><span class="il-name">${a.name}<em>${a.nameKo}</em></span><span class="il-title">${a.title}</span><span class="il-year">${a.runtime}</span></button>`;
    const b = li.querySelector('button');
    b.addEventListener('pointerenter', () => { S.hover = i; });
    b.addEventListener('pointerleave', () => { if (S.hover === i) S.hover = -1; });
    b.addEventListener('click', () => openWork(i, cards[i]));
    indexList.append(li);
  });

  // ruler
  const marks = $('#rulerMarks'), rulerDot = $('#rulerDot');
  const markBtns = ARTISTS.map((a, i) => {
    const b = document.createElement('button');
    b.type = 'button';
    b.setAttribute('aria-label', `${a.name} — ${a.title}`);
    b.dataset.cursor = a.name;
    b.style.left = (N === 1 ? 50 : (i / (N - 1)) * 100) + '%';
    b.addEventListener('click', () => goTo(i));
    marks.append(b);
    return b;
  });

  // layout switcher
  const LAYOUTS = [['stack', 'Stack'], ['frame', 'Frame'], ['orbit', 'Orbit'], ['tunnel', 'Tunnel'], ['index', 'Index']];
  const lnav = $('#layouts');
  LAYOUTS.forEach(([k, label], n) => {
    const b = document.createElement('button');
    b.type = 'button';
    b.className = 'layout-btn';
    b.dataset.layout = k;
    b.textContent = label;
    b.addEventListener('click', () => setLayout(k));
    lnav.append(b);
  });

  let layoutAt = 0;
  function setLayout(k) {
    const fi = focusIndex();
    S.layout = k;
    layoutAt = performance.now();
    S.sticky = -1;
    S.p = S.pv = fi;
    S.hover = -1;
    home.dataset.layout = k;
    $$('#layouts button').forEach(b => b.classList.toggle('on', b.dataset.layout === k));
    store.set('seven-layout', k);
    lastFi = -1;
  }

  function measure() {
    W = innerWidth; H = innerHeight;
    ch = Math.min(H * 0.5, W * 0.6 * A5);
    cw = ch / A5;
    home.style.setProperty('--cw', cw + 'px');
    home.style.setProperty('--ch', ch + 'px');
  }
  addEventListener('resize', measure);

  /* ───────── HOME: layouts ─────────
     Every layout returns a target pose per card; the loop eases each card
     toward it, so switching layouts morphs the cards into place. */
  const tunnelCyc = [];
  const wrapD = (i, p) => { let d = (((i - p) % N) + N) % N; if (d > N / 2) d -= N; return d; };

  const L = {
    // 01 — diagonal stack of glass planes (scroll walks through it)
    stack(i) {
      const d = i - S.pv;
      const x0 = -cw * (W < 760 ? 0.45 : 0.9), y0 = ch * 0.22;
      let x, y, z, o;
      if (d >= 0) {
        x = x0 + d * cw * 0.6;
        y = y0 - d * ch * 0.2;
        z = -d * cw * 0.45;
        o = clamp(1 - (d - 5) * 0.8);
      } else {
        x = x0 + d * cw * 1.4;
        y = y0 - d * ch * 0.15;
        z = -d * cw * 0.8;
        o = clamp(1 + d * 1.2);
      }
      if (S.hover === i) z += 40;
      return { x, y, z, rx: 0, ry: 34, rz: 0, s: 1, o };
    },
    // 02 — viewfinder carousel (reference 2)
    frame(i) {
      const d = wrapD(i, S.pv), ad = Math.abs(d);
      const s = ad < 1 ? 1 - ad * 0.22 : 0.78;
      let o = ad < 1 ? 1 - ad * 0.45 : clamp(0.55 - (ad - 1) * 0.22);
      if (ad > 3.1) o = 0;
      if (S.hover === i && ad > 0.5) o = Math.max(o, 0.9);
      return { x: d * cw * 1.2, y: 0, z: -ad * 60, rx: 0, ry: 0, rz: 0, s, o };
    },
    // 03 — rotating ring
    orbit(i) {
      const d = wrapD(i, S.pv);
      const a = d * (Math.PI * 2 / N);
      const R = orbitR();
      const front = (Math.cos(a) + 1) / 2;
      return {
        x: Math.sin(a) * R,
        y: Math.sin(S.t * 0.8 + i * 1.3) * 8,
        z: (Math.cos(a) - 1) * R,
        rx: 0, ry: a * 180 / Math.PI, rz: 0,
        s: S.hover === i ? 0.84 : 0.78,
        o: S.hover === i ? 1 : 0.25 + 0.75 * front * front
      };
    },
    // 04 — deep fly-through tunnel, cards always face the viewer
    tunnel(i) {
      // Depth window [-0.5g, 6.5g): at rest all seven sit at 0…6g. Scrolling pulls the
      // front card toward the camera while pushing it outward, so it grows and leaves
      // the frame; it then reappears, faint, at the far end.
      const gap = 600, total = gap * N;
      const raw = (i - S.pv + 0.5) * gap;
      const cyc = Math.floor(raw / total);
      const snap = tunnelCyc[i] !== undefined && tunnelCyc[i] !== cyc; // wrapped: jump, don't fly back
      tunnelCyc[i] = cyc;
      const zz = raw - cyc * total - gap * 0.5;
      let z, o, push = 1;
      if (zz < 0) {
        const t = -zz / (gap * 0.5);
        z = 200 + t * t * 1100;
        push = 1 + t * t * 3; // radial push so the card exits through the edge
        o = t < 0.9 ? 1 : clamp((1 - t) / 0.1);
      } else {
        const fadeIn = clamp((total - gap * 0.5 - zz) / (gap * 0.5));
        z = 200 - zz;
        o = fadeIn * fadeIn * lerp(1, 0.55, zz / (total - gap));
      }
      if (S.hover === i) z += 40;
      const ang = i * 2.39996; // golden angle spreads the cards around the axis
      const r = W < 760 ? 0.6 : 1;
      return {
        x: Math.cos(ang) * W * 0.22 * r * push,
        y: Math.sin(ang) * H * 0.17 * push,
        z,
        rx: 0, ry: 0, rz: 0,
        s: 0.72, o, snap
      };
    },
    // 05 — typographic index, image follows cursor
    index(i) {
      const off = i - (N - 1) / 2;
      // straight, untilted stack: each card steps up-right behind the previous one
      const pile = { x: W * 0.28 + off * 14, y: off * -14, z: -i * 2, rx: 0, ry: 0, rz: 0, s: 0.5, o: W < 760 ? 0 : 1 };
      if (S.hover === i) {
        return { x: S.pxv - W / 2, y: S.pyv - H / 2, z: 80, rx: 0, ry: 0, rz: 0, s: 0.56, o: 1 };
      }
      if (S.hover >= 0) pile.o *= 0.25;
      return pile;
    }
  };
  const orbitR = () => Math.max(cw * 1.2, Math.min(W * 0.36, 560));

  function worldTarget() {
    switch (S.layout) {
      case 'stack': return { tz: 0, rx: -S.myv * 1.5, ry: S.mxv * 2, tx: 0, ty: 0 };
      case 'orbit': return { tz: orbitR(), rx: -10 - S.myv * 6, ry: S.mxv * 10, tx: 0, ty: 0 };
      case 'tunnel': return { tz: 0, rx: 0, ry: 0, tx: -S.mxv * 50, ty: -S.myv * 30 };
      default: return { tz: 0, rx: 0, ry: 0, tx: 0, ty: 0 };
    }
  }

  const focusIndex = () => {
    if (S.layout === 'stack') return S.sticky >= 0 ? S.sticky : clamp(Math.round(S.pv), 0, N - 1);
    return ((Math.round(S.pv) % N) + N) % N;
  };

  /* ───────── HOME: focus UI ───────── */
  const caption = $('#caption'), bigTitle = $('#bigTitle');
  const bgA = $('#bgA'), bgB = $('#bgB');
  let lastFi = -1, bgFlip = false;
  function updateFocus(fi) {
    if (fi === lastFi) return;
    lastFi = fi;
    const a = ARTISTS[fi];
    caption.innerHTML = `<span class="c-name">${a.name}</span><span class="c-title">${a.title}</span>`;
    bigTitle.innerHTML = `<span class="swap"><span class="bt-name">${a.name}</span><span class="bt-title">${a.title}</span><small>${a.runtime}</small></span>`;
    markBtns.forEach((b, k) => b.classList.toggle('on', k === fi));
    cards.forEach((c, k) => c.classList.toggle('is-focus', k === fi));
    const next = bgFlip ? bgA : bgB, prev = bgFlip ? bgB : bgA;
    next.src = a._thumb;
    next.classList.add('on');
    prev.classList.remove('on');
    bgFlip = !bgFlip;
  }

  /* ───────── HOME: loop ───────── */
  let last = performance.now();
  const t0 = last;
  function loop(now) {
    requestAnimationFrame(loop);
    const dt = clamp((now - last) / 1000, 0, 0.05); // rAF time can precede performance.now()
    last = Math.max(last, now);
    // cursor label follows everywhere
    cur.x = lerp(cur.x, cur.tx, 1 - Math.pow(0.0001, dt));
    cur.y = lerp(cur.y, cur.ty, 1 - Math.pow(0.0001, dt));
    cursor.style.transform = `translate3d(${cur.x}px,${cur.y}px,0)`;
    if (!S.running) return;

    S.t += dt;
    const k = 1 - Math.pow(0.0006, dt);
    S.pv = lerp(S.pv, S.p, 1 - Math.pow(0.003, dt));
    if (Math.abs(S.pv - S.p) < 0.0005) S.pv = S.p;
    S.mxv = lerp(S.mxv, S.mx, k * 0.5);
    S.myv = lerp(S.myv, S.my, k * 0.5);
    S.pxv = lerp(S.pxv, S.px, k);
    S.pyv = lerp(S.pyv, S.py, k);

    const f = L[S.layout];
    for (let i = 0; i < N; i++) {
      const t = f(i), c = state[i];
      const intro = (now - t0) / 1000;
      if (intro < 2.2) t.o *= clamp((intro - 0.15 - i * 0.08) / 0.5); // intro stagger
      // tunnel cards track the (already eased) scroll directly once the layout has settled
      const kc = S.layout === 'tunnel' && now - layoutAt > 1200 ? 1 : k;
      if (t.snap) {
        Object.assign(c, t, { o: 0 });
      } else if (t.o < 0.02 && c.o < 0.02) {
        Object.assign(c, t);
      } else {
        c.x = lerp(c.x, t.x, kc); c.y = lerp(c.y, t.y, kc); c.z = lerp(c.z, t.z, kc);
        c.rx = lerp(c.rx, t.rx, k); c.ry += angDiff(c.ry, t.ry) * k; c.rz = lerp(c.rz, t.rz, k);
        c.s = lerp(c.s, t.s, k); c.o = lerp(c.o, t.o, k);
      }
      const el = cards[i];
      el.style.transform = `translate3d(${c.x.toFixed(1)}px,${c.y.toFixed(1)}px,${c.z.toFixed(1)}px) rotateX(${c.rx.toFixed(2)}deg) rotateY(${c.ry.toFixed(2)}deg) rotateZ(${c.rz.toFixed(2)}deg) scale(${c.s.toFixed(4)})`;
      el.style.opacity = c.o.toFixed(3);
      el.style.visibility = c.o < 0.01 ? 'hidden' : 'visible';
      el.classList.toggle('is-hover', S.hover === i);
    }
    world.classList.toggle('has-hover', S.hover >= 0 && S.layout !== 'index');

    const wt = worldTarget(), w = S.w;
    for (const key in wt) w[key] = lerp(w[key], wt[key], k * 0.7);
    world.style.transform = `translate3d(${w.tx.toFixed(1)}px,${w.ty.toFixed(1)}px,0) translateZ(${(-w.tz).toFixed(1)}px) rotateX(${w.rx.toFixed(2)}deg) rotateY(${w.ry.toFixed(2)}deg) translateZ(${w.tz.toFixed(1)}px)`;

    const fi = focusIndex();
    updateFocus(fi);
    S.dot = lerp(S.dot, fi, k);
    rulerDot.style.left = (N === 1 ? 50 : (S.dot / (N - 1)) * 100) + '%';
  }

  /* ───────── HOME: input ───────── */
  let snapT, drag = null, suppressUntil = 0;
  function settle() {
    if (S.layout === 'stack') S.p = clamp(S.p, -stackCentre(), N - 1);
  }
  function nudge(dp) {
    S.sticky = -1;
    S.p += dp;
    settle();
    clearTimeout(snapT);
    snapT = setTimeout(() => { S.p = Math.round(S.p); settle(); }, 170);
  }
  function step(dir) { S.sticky = -1; S.p = Math.round(S.p) + dir; settle(); }
  function goTo(i) {
    if (S.layout === 'stack') { S.p = i - stackCentre(); S.sticky = i; return; }
    S.p = S.p + wrapD(i, S.p);
  }

  home.addEventListener('wheel', e => {
    if (S.layout === 'index') return;
    e.preventDefault();
    let d = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY;
    if (e.deltaMode === 1) d *= 16;
    nudge(clamp(d, -120, 120) * 0.0032);
  }, { passive: false });

  stage.addEventListener('pointerdown', e => {
    if (S.layout === 'index' || e.button !== 0) return;
    drag = { x: e.clientX, y: e.clientY, p: S.p, moved: false };
  });
  addEventListener('pointermove', e => {
    cur.tx = e.clientX; cur.ty = e.clientY;
    S.mx = e.clientX / W * 2 - 1;
    S.my = e.clientY / H * 2 - 1;
    S.px = e.clientX; S.py = e.clientY;
    if (!drag) return;
    const dx = e.clientX - drag.x, dy = e.clientY - drag.y;
    if (!drag.moved && Math.hypot(dx, dy) > 6) { drag.moved = true; S.sticky = -1; home.classList.add('dragging'); }
    if (drag.moved) {
      const amount = S.layout === 'tunnel' ? -(dx + dy) / 260 : -dx / (cw * (S.layout === 'stack' ? 0.8 : 1.1));
      S.p = drag.p + amount;
      settle();
    }
  });
  const endDrag = () => {
    if (!drag) return;
    if (drag.moved) { suppressUntil = performance.now() + 120; S.p = Math.round(S.p); settle(); }
    drag = null;
    home.classList.remove('dragging');
  };
  addEventListener('pointerup', endDrag);
  addEventListener('pointercancel', endDrag);

  $('#prevBtn').addEventListener('click', () => step(-1));
  $('#nextBtn').addEventListener('click', () => step(1));

  function onCardClick(i, el) {
    if (performance.now() < suppressUntil) return;
    const fi = focusIndex();
    if ((S.layout === 'frame' || S.layout === 'orbit') && i !== fi) { goTo(i); return; }
    openWork(i, el);
  }

  /* ───────── open (card → hero) ───────── */
  let opening = false;
  // same video box for every work (matches .hero in CSS); the catalog peeks in below it
  const TOP = 76, PEEK = 48; // keep in sync with --top / --peek on .hero
  const isPhone = () => innerWidth <= 760; // matches the CSS breakpoint
  const heroHeight = () => (isPhone() ? 56 + innerWidth * 9 / 16 + 112 : Math.min(innerWidth * 9 / 16 + TOP * 2, innerHeight - PEEK));
  // where the video box sits inside the hero (phones: fixed 16:9 strip under the bar)
  const videoBox = () => (isPhone() ? { top: 56, h: innerWidth * 9 / 16 } : { top: TOP, h: heroHeight() - TOP * 2 });
  function openWork(i, el) {
    if (opening) return;
    const a = ARTISTS[i];
    const go = () => { location.hash = `#/work/${a.id}`; };
    const img = el && el.querySelector('img');
    const r = img && img.getBoundingClientRect();
    if (reduced || !r || r.width < 4 || r.bottom < 0 || r.top > innerHeight) { go(); return; }
    opening = true;
    // The growing element plays the work's own video (poster behind it until the
    // first frame arrives), so the opening reads as the video itself zooming in.
    // It is the detail player's own <video>: it zooms inside the overlay and is then
    // moved (still playing) into the player, so playback never restarts.
    const fl = document.createElement('div');
    fl.className = 'flip';
    fl.style.backgroundImage = `url("${a._thumb}")`;
    video.classList.remove('on');
    video.addEventListener('playing', () => video.classList.add('on'), { once: true });
    video.removeAttribute('poster');
    video.src = a.video;
    fl.append(video);
    document.body.append(fl);
    startPlayback(); // inside the click, so sound is normally allowed
    if (!home.hidden) { home.classList.add('leaving'); el.classList.add('is-opening'); }

    // land exactly on the picture area inside the hero (contain-fit of the work's ratio),
    // so cover-fit here and contain-fit in the player match on the last frame
    const [rw, rh] = String(a.ratio || '16:9').split(':').map(Number);
    const ratio = rw / rh || 16 / 9;
    const { top: boxTop, h: boxH } = videoBox();
    const w = Math.min(innerWidth, boxH * ratio), h = w / ratio;
    const from = { left: r.left + 'px', top: r.top + 'px', width: r.width + 'px', height: r.height + 'px' };
    const to = { left: (innerWidth - w) / 2 + 'px', top: boxTop + (boxH - h) / 2 + 'px', width: w + 'px', height: h + 'px' };
    Object.assign(fl.style, from);
    const anim = fl.animate([from, to], { duration: 900, easing: 'cubic-bezier(.76,0,.24,1)', fill: 'forwards' });
    anim.onfinish = () => {
      let finished = false;
      const done = () => {
        if (finished) return;
        finished = true;
        opening = false;
        player.insertBefore(video, player.firstChild); // same frame as removing the overlay
        video.classList.remove('on');
        fl.remove();
      };
      handoff = { id: a.id, done };
      go();
      setTimeout(done, 2500); // safety net if the route never fires
    };
  }
  let handoff = null;

  /* ───────── DETAIL ───────── */
  const detail = $('#detail'), player = $('#player'), video = $('#video'), hero = $('#hero');
  const playBtn = $('#playBtn'), progress = $('#progress'), progressBar = $('#progressBar');
  let curWork = -1, pipDismissed = false;
  const fmt = s => (isFinite(s) ? `${pad(Math.floor(s / 60))}:${pad(Math.floor(s % 60))}` : '00:00');

  function setPlayUI() {
    const playing = !video.paused;
    playBtn.innerHTML = playing ? '<i class="ic-pause"></i>Pause' : '<i class="ic-play"></i>Play';
    player.classList.toggle('playing', playing);
  }
  // No sound button: we try to play with sound (allowed right after the opening click);
  // if the browser refuses, play muted and let the first click on the video unmute.
  let autoMuted = false;
  function startPlayback() {
    video.muted = false;
    autoMuted = false;
    const pr = video.play();
    if (pr) pr.catch(() => {
      autoMuted = true;
      video.muted = true;
      const p2 = video.play();
      if (p2) p2.catch(() => setPlayUI());
    });
  }
  function togglePlay() {
    if (video.paused) { const pr = video.play(); if (pr) pr.catch(() => {}); } else video.pause();
  }
  video.addEventListener('play', setPlayUI);
  video.addEventListener('pause', setPlayUI);
  video.addEventListener('error', () => player.classList.add('has-error'));
  video.addEventListener('timeupdate', () => {
    const d = video.duration || 0;
    progressBar.style.transform = `scaleX(${d ? video.currentTime / d : 0})`;
  });
  playBtn.addEventListener('click', togglePlay);
  $('#fsBtn').addEventListener('click', () => {
    if (document.fullscreenElement) return document.exitFullscreen();
    if (player.requestFullscreen) player.requestFullscreen();
    else if (video.webkitEnterFullscreen) video.webkitEnterFullscreen();
  });
  video.addEventListener('click', () => {
    if (autoMuted) { autoMuted = false; video.muted = false; return; }
    if (player.classList.contains('pip')) scrollTo({ top: 0, behavior: 'smooth' });
    else togglePlay();
  });
  $('#pipClose').addEventListener('click', e => {
    e.stopPropagation();
    pipDismissed = true;
    player.classList.remove('pip');
    video.pause();
  });

  // scrubbing
  let scrubbing = false;
  const seek = e => {
    const r = progress.getBoundingClientRect();
    if (video.duration) video.currentTime = clamp((e.clientX - r.left) / r.width) * video.duration;
  };
  progress.addEventListener('pointerdown', e => { scrubbing = true; progress.setPointerCapture(e.pointerId); seek(e); });
  progress.addEventListener('pointermove', e => { if (scrubbing) seek(e); });
  progress.addEventListener('pointerup', () => { scrubbing = false; });

  // idle → hide overlay while watching
  let idleT;
  // info shows briefly, then gets out of the way so the video has the screen
  const setIdle = on => {
    player.classList.toggle('idle', on);
    document.body.classList.toggle('video-idle', on);
  };
  const wake = () => {
    setIdle(false);
    clearTimeout(idleT);
    idleT = setTimeout(() => {
      if (!video.paused && !player.classList.contains('pip') && scrollY < heroHeight() * 0.5) setIdle(true);
    }, 2400);
  };
  player.addEventListener('pointermove', wake);
  player.addEventListener('pointerdown', wake);
  addEventListener('scroll', () => { if (player.classList.contains('idle') && scrollY > 40) setIdle(false); }, { passive: true });
  video.addEventListener('play', wake);
  video.addEventListener('pause', wake);

  // mini player when the hero scrolls away
  new IntersectionObserver(([e]) => {
    const out = e.intersectionRatio < 0.3;
    if (!out) pipDismissed = false;
    player.classList.toggle('pip', out && !pipDismissed && !video.paused && !detail.hidden);
  }, { threshold: [0, 0.3, 0.6, 1] }).observe(hero);

  // catalog
  const catPages = $('#catPages'), catProgress = $('#catProgress'), catProgressBar = $('#catProgressBar');
  let catToken = 0;
  const revealIO = new IntersectionObserver(entries => {
    entries.forEach(en => { if (en.isIntersecting) { en.target.classList.add('in'); revealIO.unobserve(en.target); } });
  }, { threshold: 0.06 });

  // thin reading-progress bar across the catalog pages
  let progRaf = 0;
  const updateProgress = () => {
    progRaf = 0;
    if (detail.hidden) return;
    const r = catPages.getBoundingClientRect();
    catProgressBar.style.transform = `scaleX(${clamp((innerHeight * 0.5 - r.top) / Math.max(r.height, 1))})`;
  };
  addEventListener('scroll', () => { if (!progRaf) progRaf = requestAnimationFrame(updateProgress); }, { passive: true });
  catProgress.addEventListener('click', e => {
    const r = catProgress.getBoundingClientRect();
    const t = clamp((e.clientX - r.left) / r.width);
    const pr = catPages.getBoundingClientRect();
    scrollTo({ top: scrollY + pr.top + t * pr.height - innerHeight * 0.5 + 1, behavior: 'smooth' });
  });

  async function renderCatalog(i) {
    const tok = ++catToken;
    const a = ARTISTS[i];
    const pageCount = (a.catalog && a.catalog.length) || 6;
    catPages.innerHTML = '';
    const figs = [];
    for (let k = 0; k < pageCount; k++) {
      const fig = document.createElement('figure');
      fig.className = 'page';
      fig.dataset.k = k;
      fig.innerHTML = `<div class="page-img loading"></div>`;
      catPages.append(fig);
      revealIO.observe(fig);
      figs.push(fig);
    }
    const srcs = await getCatalog(i);
    if (tok !== catToken) return;
    srcs.forEach((src, k) => {
      const box = figs[k] && figs[k].querySelector('.page-img');
      if (!box) return;
      const img = new Image();
      img.alt = `${a.name} 웹 도록 ${k + 1}페이지`;
      img.decoding = 'async';
      img.onload = () => {
        box.style.aspectRatio = `${img.naturalWidth} / ${img.naturalHeight}`; // follow the real image ratio
        box.classList.remove('loading');
        img.classList.add('ready');
      };
      img.loading = 'lazy'; // real catalogs can be dozens of large images
      box.append(img);
      img.src = src;
    });
  }

  function renderMore(i) {
    const row = $('#moreRow');
    row.innerHTML = '';
    for (let n = 1; n < N; n++) {
      const j = (i + n) % N, a = ARTISTS[j];
      const b = document.createElement('button');
      b.type = 'button';
      b.className = 'more-card';
      b.dataset.cursor = 'View';
      b.innerHTML = `<span class="mc-img"><img src="${a._thumb}" alt="" loading="lazy"></span><span class="mc-meta"><b>${a.name}</b><span>${a.title}<br>${a.runtime}</span></span>`;
      b.addEventListener('click', () => openWork(j, b));
      row.append(b);
    }
  }

  function renderNext(i) {
    const j = (i + 1) % N, a = ARTISTS[j];
    const link = $('#nextLink');
    link.href = `#/work/${a.id}`;
    link.dataset.cursor = 'Next';
    link.innerHTML = `<small>Next Work</small><span class="next-name">${a.name} <i>→</i></span><span class="next-thumb"><img src="${a._thumb}" alt=""></span>`;
    link.onclick = e => { e.preventDefault(); openWork(j, link.querySelector('.next-thumb')); };
  }

  function showDetail(i) {
    const a = ARTISTS[i];
    curWork = i;
    S.running = false;
    S.hover = -1;
    home.hidden = true;
    home.classList.remove('leaving');
    cards.forEach(c => c.classList.remove('is-opening'));
    detail.hidden = false;
    document.body.classList.remove('is-home');
    document.body.classList.add('is-detail');
    scrollTo(0, 0);
    goTo(i);

    document.title = `${a.name} — ${a.title} · ${EX.title} ${EX.year}`;
    $('#dName').textContent = `${a.name} ${a.nameKo}`;
    $('#dTitle').textContent = a.title;
    $('#catNum').textContent = a.title;
    $('#catDesc').textContent = a.description || '';
    const link = $('#catLink');
    link.hidden = !(a.link && a.link.url);
    if (!link.hidden) { link.href = a.link.url; link.firstChild.textContent = a.link.label || 'Link'; }
    catProgressBar.style.transform = 'scaleX(0)';
    $('#catDl').innerHTML = `<dt>Artist</dt><dd>${a.name} ${a.nameKo}</dd><dt>Runtime</dt><dd>${a.runtime}</dd>`;

    player.classList.remove('pip', 'has-error', 'idle');
    pipDismissed = false;
    const [rw, rh] = String(a.ratio || '16:9').split(':');
    detail.style.setProperty('--ratio', `${rw} / ${rh}`);
    // arriving from the zoom: the video is already playing, just take it back
    const h = handoff && handoff.id === a.id ? handoff : null;
    handoff = null;
    if (h) {
      h.done();
    } else {
      video.removeAttribute('poster');
      video.src = a.video;
      startPlayback();
    }
    setPlayUI();

    renderCatalog(i);
    renderMore(i);
    renderNext(i);
    detail.classList.remove('enter');
    void detail.offsetWidth;
    detail.classList.add('enter');
  }

  function showHome() {
    curWork = -1;
    video.pause();
    setIdle(false);
    player.classList.remove('pip');
    detail.hidden = true;
    home.hidden = false;
    home.classList.remove('leaving');
    cards.forEach(c => c.classList.remove('is-opening'));
    document.body.classList.add('is-home');
    document.body.classList.remove('is-detail');
    document.title = `${EX.title} — ${EX.subtitle} ${EX.year}`;
    S.running = true;
    last = performance.now();
  }


  /* ───────── router ───────── */
  function route() {
    const m = location.hash.match(/^#\/work\/([\w-]+)/);
    if (m) {
      const i = ARTISTS.findIndex(a => a.id === m[1]);
      if (i >= 0) { showDetail(i); return; }
    }
    showHome();
  }
  addEventListener('hashchange', route);

  /* ───────── about ───────── */
  const about = $('#about');
  $('#aboutInner').innerHTML = `
    <h2>${EX.title}</h2>
    <div class="lede">${[].concat(EX.statement).map(t => `<p>${t}</p>`).join('')}</div>
    <div class="facts"><span>${EX.dates}</span><span>${EX.venue}</span></div>
    <ol class="about-list">${ARTISTS.map(a => `<li><a href="#/work/${a.id}"><b>${a.name} ${a.nameKo}</b><span>${a.title}</span></a></li>`).join('')}</ol>`;
  const setAbout = open => { about.classList.toggle('open', open); about.setAttribute('aria-hidden', String(!open)); };
  $('#aboutBtn').addEventListener('click', () => setAbout(true));
  $('#aboutClose').addEventListener('click', () => setAbout(false));
  about.addEventListener('click', e => { if (e.target.closest('a')) setAbout(false); });

  /* ───────── keyboard ───────── */
  addEventListener('keydown', e => {
    if (e.metaKey || e.ctrlKey || e.altKey) return;
    if (about.classList.contains('open')) { if (e.key === 'Escape') setAbout(false); return; }
    if (!detail.hidden) {
      if (e.key === 'Escape') location.hash = '#/';
      else if ((e.key === ' ' || e.key === 'k') && scrollY < heroHeight() * 0.6) { e.preventDefault(); togglePlay(); }
      else if (e.key === 'm') { autoMuted = false; video.muted = !video.muted; }
      return;
    }
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') { e.preventDefault(); step(1); }
    else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') { e.preventDefault(); step(-1); }
    else if (e.key === 'Enter' && S.layout !== 'index') { const fi = focusIndex(); openWork(fi, cards[fi]); }
    else if (/^[1-5]$/.test(e.key)) setLayout(LAYOUTS[+e.key - 1][0]);
  });

  /* ───────── init ───────── */
  measure();
  const saved = new URLSearchParams(location.search).get('layout') || store.get('seven-layout');
  setLayout(LAYOUTS.some(l => l[0] === saved) ? saved : 'stack');
  route();
  requestAnimationFrame(loop);
})();
