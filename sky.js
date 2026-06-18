/**
 * Real-time day/night sky cycle.
 * Updates CSS custom properties on <html> every second based on the clock.
 *
 * Sky palette is keyed to your games:
 *   Day  → Rise's periwinkle (#5558c8 → #b8baff)
 *   Dusk → Wild West warm gold/orange
 *   Night → deep navy with visible stars
 */

// ── Colour waypoints ────────────────────────────────────────────────────────
// Each entry: { h: hour (0–24), top, mid, bot, cloud, stars (0–1) }
const WAYPOINTS = [
  { h:  0, top:'#060818', mid:'#0e1030', bot:'#1c1a50', cloud:'rgba(180,185,255,0.22)', stars:1.00 },
  { h:  5, top:'#100838', mid:'#201060', bot:'#38207a', cloud:'rgba(200,185,255,0.28)', stars:0.80 },
  { h:  6, top:'#b83010', mid:'#d85828', bot:'#f09050', cloud:'rgba(255,195,150,0.80)', stars:0.15 },
  { h:  7, top:'#4070c8', mid:'#6890e0', bot:'#a0bcf5', cloud:'rgba(255,255,255,0.82)', stars:0.00 },
  { h:  9, top:'#5558c8', mid:'#7b7ee8', bot:'#b8baff', cloud:'rgba(255,255,255,0.78)', stars:0.00 },
  { h: 16, top:'#5558c8', mid:'#7b7ee8', bot:'#b8baff', cloud:'rgba(255,255,255,0.78)', stars:0.00 },
  { h: 17, top:'#c85018', mid:'#d87030', bot:'#f0a048', cloud:'rgba(255,210,150,0.82)', stars:0.00 },
  { h: 18, top:'#881028', mid:'#b02838', bot:'#d05040', cloud:'rgba(255,175,140,0.70)', stars:0.08 },
  { h: 19, top:'#240840', mid:'#3c0e60', bot:'#581878', cloud:'rgba(200,155,225,0.38)', stars:0.55 },
  { h: 21, top:'#060818', mid:'#0e1030', bot:'#1c1a50', cloud:'rgba(180,185,255,0.22)', stars:1.00 },
  { h: 24, top:'#060818', mid:'#0e1030', bot:'#1c1a50', cloud:'rgba(180,185,255,0.22)', stars:1.00 },
];

// ── Helpers ──────────────────────────────────────────────────────────────────
function hexToRgb(hex) {
  const n = parseInt(hex.replace('#',''), 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

function lerpNum(a, b, t) { return a + (b - a) * t; }

function lerpHex(hexA, hexB, t) {
  const a = hexToRgb(hexA), b = hexToRgb(hexB);
  const r = Math.round(lerpNum(a[0], b[0], t));
  const g = Math.round(lerpNum(a[1], b[1], t));
  const bl = Math.round(lerpNum(a[2], b[2], t));
  return `rgb(${r},${g},${bl})`;
}

// Parse "rgba(r,g,b,a)" strings for interpolation
function parseRgba(str) {
  const m = str.match(/[\d.]+/g).map(Number);
  return m.length === 3 ? [...m, 1] : m;
}

function lerpRgba(strA, strB, t) {
  const a = parseRgba(strA), b = parseRgba(strB);
  const r = Math.round(lerpNum(a[0], b[0], t));
  const g = Math.round(lerpNum(a[1], b[1], t));
  const bl = Math.round(lerpNum(a[2], b[2], t));
  const al = +lerpNum(a[3], b[3], t).toFixed(3);
  return `rgba(${r},${g},${bl},${al})`;
}

function getWaypoints(hourFloat) {
  for (let i = 0; i < WAYPOINTS.length - 1; i++) {
    const a = WAYPOINTS[i], b = WAYPOINTS[i + 1];
    if (hourFloat >= a.h && hourFloat < b.h) {
      const t = (hourFloat - a.h) / (b.h - a.h);
      return {
        top:   lerpHex(a.top,   b.top,   t),
        mid:   lerpHex(a.mid,   b.mid,   t),
        bot:   lerpHex(a.bot,   b.bot,   t),
        cloud: lerpRgba(a.cloud, b.cloud, t),
        stars: +lerpNum(a.stars, b.stars, t).toFixed(4),
      };
    }
  }
  return WAYPOINTS[0]; // fallback midnight
}

// ── Stars ────────────────────────────────────────────────────────────────────
function buildStars(skyEl, count = 120) {
  for (let i = 0; i < count; i++) {
    const s = document.createElement('div');
    s.className = 'star';
    s.style.cssText = `
      left:   ${Math.random() * 100}%;
      top:    ${Math.random() * 70}%;
      width:  ${Math.random() < 0.15 ? 2 : 1}px;
      height: ${Math.random() < 0.15 ? 2 : 1}px;
      animation-delay: ${(Math.random() * 4).toFixed(2)}s;
      animation-duration: ${(2.5 + Math.random() * 3).toFixed(2)}s;
    `;
    skyEl.appendChild(s);
  }
}

// ── Main tick ────────────────────────────────────────────────────────────────
function tick() {
  const now  = new Date();
  const hour = now.getHours() + now.getMinutes() / 60 + now.getSeconds() / 3600;
  const sky  = getWaypoints(hour);
  const root = document.documentElement;

  root.style.setProperty('--sky-top',   sky.top);
  root.style.setProperty('--sky-mid',   sky.mid);
  root.style.setProperty('--sky-bot',   sky.bot);
  root.style.setProperty('--cloud-fill', sky.cloud);
  root.style.setProperty('--star-opacity', sky.stars);

  // Set text colour based on sky brightness (sky.mid is rgb() string)
  const rgbMatch = sky.mid.match(/\d+/g).map(Number);
  const luminance = (0.299 * rgbMatch[0] + 0.587 * rgbMatch[1] + 0.114 * rgbMatch[2]) / 255;
  root.style.setProperty('--text-on-sky', luminance > 0.45 ? '#1a1a2e' : '#ffffff');

  // Dim clouds at night
  document.querySelectorAll('.cloud').forEach(c => {
    c.style.background = sky.cloud;
  });
}

// ── Init ─────────────────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  const skyEl = document.querySelector('.sky');
  if (skyEl) buildStars(skyEl);
  tick();
  setInterval(tick, 1000);
});
