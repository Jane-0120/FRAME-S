/* 임시 이미지 생성기 — 실제 이미지가 없을 때 커버/도록 페이지를 캔버스로 그립니다. */
window.Placeholder = (() => {
  const PALETTES = [
    ['#ff1e1e', '#ff8fb3', '#2a0505', '#ffd9cc'],
    ['#9fb4c7', '#2c3440', '#0e1217', '#e6edf2'],
    ['#d8bfa3', '#7a5f4a', '#2e2620', '#f3e6d8'],
    ['#cfcfcf', '#4a4a4a', '#070707', '#ffffff'],
    ['#6f8f5a', '#b9c79a', '#0d150d', '#e9efe0'],
    ['#1d4dff', '#8fb2ff', '#05081a', '#d6e2ff'],
    ['#ff7a1a', '#ffd08a', '#1f0e04', '#fff1e0']
  ];
  const FONT = '"Inter Tight", "Helvetica Neue", Arial, sans-serif';
  const MONO = '"JetBrains Mono", ui-monospace, Menlo, monospace';

  function rand(seed) {
    let s = (seed * 2654435761) % 2147483647;
    if (s <= 0) s += 2147483646;
    return () => (s = (s * 16807) % 2147483647) / 2147483647;
  }
  function rgba(hex, a) {
    const n = parseInt(hex.slice(1), 16);
    return `rgba(${(n >> 16) & 255},${(n >> 8) & 255},${n & 255},${a})`;
  }
  function mk(w, h) {
    const c = document.createElement('canvas');
    c.width = w; c.height = h;
    return c;
  }
  let noiseC;
  function noise() {
    if (noiseC) return noiseC;
    noiseC = mk(160, 160);
    const x = noiseC.getContext('2d');
    const d = x.createImageData(160, 160);
    for (let k = 0; k < d.data.length; k += 4) {
      const v = Math.random() * 255;
      d.data[k] = d.data[k + 1] = d.data[k + 2] = v;
      d.data[k + 3] = 255;
    }
    x.putImageData(d, 0, 0);
    return noiseC;
  }

  /* 추상적인 블러 이미지 (레퍼런스의 흐릿한 색면 느낌) */
  function art(idx, w, h, seed = 0) {
    const pal = PALETTES[idx % PALETTES.length];
    const r = rand(idx * 97 + seed * 13 + 1);
    const c = mk(w, h), x = c.getContext('2d');
    const type = (idx + seed) % 4;
    x.fillStyle = idx === 3 || r() > 0.7 ? pal[2] : pal[3];
    if (idx === 3) x.fillStyle = seed % 2 ? '#e9e9e9' : '#060606';
    x.fillRect(0, 0, w, h);

    const n = 5 + Math.floor(r() * 4);
    for (let k = 0; k < n; k++) {
      const col = pal[Math.floor(r() * pal.length)];
      const cx = r() * w, cy = r() * h;
      const rad = (0.22 + r() * 0.5) * Math.max(w, h);
      x.save();
      x.translate(cx, cy);
      if (type === 1) x.scale(2.6, 0.32);
      x.rotate(r() * Math.PI);
      const g = x.createRadialGradient(0, 0, 0, 0, 0, rad);
      g.addColorStop(0, rgba(col, 0.9));
      g.addColorStop(0.5, rgba(col, 0.35));
      g.addColorStop(1, rgba(col, 0));
      x.fillStyle = g;
      x.fillRect(-rad, -rad, rad * 2, rad * 2);
      x.restore();
    }

    if (type === 0) {
      x.fillStyle = rgba(pal[1], 0.85);
      x.beginPath();
      x.ellipse(w * (0.3 + r() * 0.4), h * (0.35 + r() * 0.3), w * (0.05 + r() * 0.08), h * (0.08 + r() * 0.1), r(), 0, Math.PI * 2);
      x.fill();
    } else if (type === 1) {
      x.fillStyle = rgba(pal[3], 0.55);
      x.fillRect(0, h * (0.3 + r() * 0.4), w, Math.max(1, h * 0.002));
    } else if (type === 2) {
      x.strokeStyle = rgba(pal[3], 0.14);
      x.lineWidth = 1;
      const step = w / 22;
      x.beginPath();
      for (let gx = step; gx < w; gx += step) { x.moveTo(gx, 0); x.lineTo(gx, h); }
      for (let gy = step; gy < h; gy += step) { x.moveTo(0, gy); x.lineTo(w, gy); }
      x.stroke();
    } else {
      x.strokeStyle = rgba(pal[3], 0.75);
      x.lineWidth = Math.max(1, w * 0.004);
      x.beginPath();
      x.arc(w * 0.5, h * 0.5, Math.min(w, h) * (0.18 + r() * 0.12), 0, Math.PI * 2);
      x.stroke();
    }

    const v = x.createRadialGradient(w / 2, h / 2, Math.min(w, h) * 0.3, w / 2, h / 2, Math.max(w, h) * 0.75);
    v.addColorStop(0, 'rgba(0,0,0,0)');
    v.addColorStop(1, 'rgba(0,0,0,0.42)');
    x.fillStyle = v;
    x.fillRect(0, 0, w, h);

    x.globalAlpha = 0.09;
    x.globalCompositeOperation = 'overlay';
    x.fillStyle = x.createPattern(noise(), 'repeat');
    x.fillRect(0, 0, w, h);
    x.globalAlpha = 1;
    x.globalCompositeOperation = 'source-over';
    return c;
  }

  const covers = {};
  function cover(idx) {
    return covers[idx] || (covers[idx] = art(idx, 800, 1131).toDataURL('image/jpeg', 0.86));
  }

  /* ── 도록 페이지 ── */
  function text(x, str, X, Y, size, col, font = MONO, weight = 400, align = 'left') {
    x.font = `${weight} ${size}px ${font}`;
    x.fillStyle = col;
    x.textAlign = align;
    x.textBaseline = 'alphabetic';
    x.fillText(str, X, Y);
  }
  function bars(x, X, Y, maxW, lines, lh, col, r) {
    x.fillStyle = col;
    for (let k = 0; k < lines; k++) {
      const ww = k === lines - 1 ? maxW * (0.3 + r() * 0.4) : maxW * (0.86 + r() * 0.14);
      x.fillRect(X, Y + k * lh, ww, lh * 0.26);
    }
  }
  const tick = () => new Promise(res => requestAnimationFrame(() => res()));

  async function catalog(idx, a) {
    try { await document.fonts.load(`600 80px "Inter Tight"`); await document.fonts.load(`400 20px "JetBrains Mono"`); } catch (e) { /* 폰트 없이 진행 */ }
    const W = 1920, H = 1080;
    const r = rand(idx * 31 + 7);
    const paper = '#efede8', ink = '#111111';
    const out = [];
    const page = draw => {
      const c = mk(W, H), x = c.getContext('2d');
      draw(x);
      out.push(c.toDataURL('image/jpeg', 0.85));
    };

    // 1 — cover
    page(x => {
      x.drawImage(art(idx, W, H, 0), 0, 0);
      const g = x.createLinearGradient(0, H * 0.4, 0, H);
      g.addColorStop(0, 'rgba(0,0,0,0)'); g.addColorStop(1, 'rgba(0,0,0,.65)');
      x.fillStyle = g; x.fillRect(0, 0, W, H);
      text(x, a.title, 96, H - 190, 150, '#fff', FONT, 600);
      text(x, `${a.name}  ${a.nameKo}`, 100, H - 110, 40, 'rgba(255,255,255,.85)', FONT, 400);
    });
    await tick();
    // 2 — statement (text left, image right)
    page(x => {
      x.fillStyle = paper; x.fillRect(0, 0, W, H);
      text(x, 'Artist Statement', 96, 200, 84, ink, FONT, 600);
      bars(x, 96, 300, 760, 14, 46, 'rgba(0,0,0,.75)', r);
      x.drawImage(art(idx, 840, H - 192, 1), W - 96 - 840, 96);
    });
    await tick();
    // 3 — full bleed still
    page(x => { x.drawImage(art(idx, W, H, 2), 0, 0); });
    await tick();
    // 4 — frames grid 3×2
    page(x => {
      x.fillStyle = '#0c0c0c'; x.fillRect(0, 0, W, H);
      const gw = (W - 192 - 48) / 3, gh = gw * 9 / 16;
      const top = (H - gh * 2 - 24) / 2;
      for (let k = 0; k < 6; k++) {
        const X = 96 + (k % 3) * (gw + 24), Y = top + Math.floor(k / 3) * (gh + 24);
        x.drawImage(art(idx, Math.round(gw), Math.round(gh), k + 3), X, Y, gw, gh);
      }
    });
    await tick();
    // 5 — about the work (image left, text right)
    page(x => {
      x.fillStyle = paper; x.fillRect(0, 0, W, H);
      x.drawImage(art(idx, 960, H, 9), 0, 0);
      text(x, 'About the Work', 1056, 220, 72, ink, FONT, 600);
      bars(x, 1056, 310, W - 1056 - 96, 13, 46, 'rgba(0,0,0,.75)', r);
    });
    await tick();
    // 6 — biography
    page(x => {
      x.fillStyle = paper; x.fillRect(0, 0, W, H);
      text(x, 'Biography', 96, 200, 84, ink, FONT, 600);
      text(x, a.nameKo, 100, 270, 36, 'rgba(0,0,0,.45)', FONT, 400);
      bars(x, 96, 360, 700, 6, 46, 'rgba(0,0,0,.7)', r);
      for (let k = 0; k < 9; k++) {
        const Y = 220 + k * 82;
        text(x, String(2026 - Math.floor(k / 2)), 1000, Y, 26, ink);
        bars(x, 1140, Y - 22, (W - 1236) * (0.5 + r() * 0.5), 1, 40, 'rgba(0,0,0,.7)', r);
      }
    });
    return out;
  }

  return { cover, catalog };
})();
