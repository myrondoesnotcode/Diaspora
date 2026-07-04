import { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import * as topojson from 'topojson-client';
import type { GeometryCollection } from 'topojson-specification';
import { COMMUNITIES } from '../data/communities';
import { MIGRATIONS } from '../data/migrations';
import type { Community } from '../data/types';
import { MOMENTS } from '../data/moments';
import type { StoryState } from '../utils/story';
import { populationAt, clamp01, mixHex, CENTROID_TRAIL } from '../utils/story';

// Screen-space positions of drawn communities, refreshed every frame so the
// click handler can hit-test without re-deriving the projection.
export interface DrawnCommunity {
  id: string;
  x: number;
  y: number;
  r: number;
  pop: number;
}

// The cinematic background map. Visual system: "light on dark vellum" —
// near-black ink ocean with faint stars, quiet slate land, and all color
// carried by LIGHT: additive-blended community flames, comet-trail migration
// particles, and rim-lit coastlines tinted by each era's light color.
// Renders every animation frame from a mutable StoryState ref so scrolling
// never forces a React re-render.

interface Props {
  stateRef: React.MutableRefObject<StoryState>;
  visible: boolean;
  onPickCommunity?: (id: string | null) => void;
}

const MAX_POP = Math.max(
  ...COMMUNITIES.flatMap((c) => Object.values(c.populations).map(Number))
);
const radiusScale = d3.scaleSqrt().domain([0, MAX_POP]).range([0, 46]).clamp(true);

const COMMUNITY_INDEX: Record<string, Community> = Object.fromEntries(
  COMMUNITIES.map((c) => [c.id, c])
);

// Historical peak population per community — used for "ghost rings": a
// community that collapses below a fraction of its peak leaves a faint
// memorial ring at its former size. The map remembers.
const PEAK_POP: Record<string, number> = Object.fromEntries(
  COMMUNITIES.map((c) => [c.id, Math.max(0, ...Object.values(c.populations).map(Number))])
);

// First year each community reaches its peak — rings only appear afterwards.
const PEAK_YEAR: Record<string, number> = Object.fromEntries(
  COMMUNITIES.map((c) => {
    const peak = PEAK_POP[c.id];
    const years = Object.keys(c.populations).map(Number).sort((a, b) => a - b);
    const yr = years.find((y) => (c.populations[y] ?? 0) >= peak) ?? Infinity;
    return [c.id, yr];
  })
);

const FORCED_COLOR = '#ff6252';
const VOLUNTARY_COLOR = '#ffe3a1';

// One particle field per migration, generated lazily and kept for the session.
interface Particle {
  offset: number; // 0..1 phase along the arc
  speed: number; // cycles per second
  size: number;
  drift: number; // perpendicular offset, in px at reference scale
}
const particleFields = new Map<string, Particle[]>();

function particlesFor(id: string, seed: number): Particle[] {
  let field = particleFields.get(id);
  if (!field) {
    // Deterministic pseudo-random so renders are stable
    let s = seed;
    const rand = () => {
      s = (s * 16807) % 2147483647;
      return (s - 1) / 2147483646;
    };
    field = Array.from({ length: 22 }, () => ({
      offset: rand(),
      speed: 0.09 + rand() * 0.11,
      size: 0.8 + rand() * 1.5,
      drift: (rand() - 0.5) * 14,
    }));
    particleFields.set(id, field);
  }
  return field;
}

// Starfield: regenerated when the canvas size changes.
interface Star {
  x: number;
  y: number;
  size: number;
  phase: number;
  speed: number;
  base: number;
}
let starCache: { w: number; h: number; stars: Star[] } | null = null;

function starsFor(w: number, h: number): Star[] {
  if (starCache && starCache.w === w && starCache.h === h) return starCache.stars;
  let s = 42;
  const rand = () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
  const n = Math.round((w * h) / 7000);
  const stars: Star[] = Array.from({ length: n }, () => ({
    x: rand() * w,
    y: rand() * h,
    size: 0.4 + rand() * 1.1,
    phase: rand() * Math.PI * 2,
    speed: 0.3 + rand() * 1.2,
    base: 0.05 + rand() * 0.22,
  }));
  starCache = { w, h, stars };
  return stars;
}

function quadPoint(
  x1: number, y1: number, cx: number, cy: number, x2: number, y2: number, t: number
): [number, number] {
  const u = 1 - t;
  return [
    u * u * x1 + 2 * u * t * cx + t * t * x2,
    u * u * y1 + 2 * u * t * cy + t * t * y2,
  ];
}

export default function ScrollMap({ stateRef, visible, onPickCommunity }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const worldRef = useRef<d3.GeoPermissibleObjects | null>(null);
  const drawnRef = useRef<DrawnCommunity[]>([]);
  const visibleRef = useRef(visible);

  useEffect(() => {
    visibleRef.current = visible;
  }, [visible]);

  useEffect(() => {
    fetch(`${import.meta.env.BASE_URL}countries-110m.json`)
      .then((r) => r.json())
      .then((topo) => {
        worldRef.current = topojson.feature(
          topo,
          topo.objects.countries as GeometryCollection
        );
      })
      .catch(console.error);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let raf = 0;
    const start = performance.now();

    const draw = (now: number) => {
      raf = requestAnimationFrame(draw);
      if (!visibleRef.current) return;

      const time = (now - start) / 1000;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = window.innerWidth;
      const h = window.innerHeight;
      if (canvas.width !== w * dpr || canvas.height !== h * dpr) {
        canvas.width = w * dpr;
        canvas.height = h * dpr;
        canvas.style.width = `${w}px`;
        canvas.style.height = `${h}px`;
      }
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.globalCompositeOperation = 'source-over';

      const { camera, palette, year, somber } = stateRef.current;
      const glow = 1 - somber * 0.8; // additive light dies down in the dark chapter

      // ── Ink ocean ──
      const grad = ctx.createRadialGradient(w / 2, h / 2, 0, w / 2, h / 2, Math.max(w, h) * 0.75);
      grad.addColorStop(0, palette.oceanInner);
      grad.addColorStop(1, palette.oceanOuter);
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, w, h);

      // ── Stars: a scattered people, a night sky ──
      ctx.fillStyle = '#cdd6ff';
      for (const st of starsFor(w, h)) {
        const tw = 0.5 + 0.5 * Math.sin(time * st.speed + st.phase);
        ctx.globalAlpha = st.base * tw;
        ctx.fillRect(st.x, st.y, st.size, st.size);
      }
      ctx.globalAlpha = 1;

      const world = worldRef.current;
      if (!world) return;

      const baseScale = Math.max(w / 6.3, h / 3.4);
      const projection = d3
        .geoNaturalEarth1()
        .rotate([-camera.lon, 0])
        .center([0, camera.lat])
        .scale(baseScale * camera.zoom)
        .translate([w / 2, h / 2]);
      const path = d3.geoPath(projection, ctx);

      // ── Land: quiet slate, faintly warmed by the era's light ──
      ctx.beginPath();
      path(world);
      ctx.fillStyle = mixHex(palette.land, palette.accent, 0.05);
      ctx.fill();

      // Rim-lit coastline: the era's light grazing the continents
      ctx.save();
      ctx.globalCompositeOperation = 'lighter';
      ctx.strokeStyle = palette.accent;
      ctx.lineWidth = 2.4;
      ctx.globalAlpha = 0.07 * glow;
      ctx.stroke();
      ctx.restore();

      ctx.strokeStyle = palette.border;
      ctx.lineWidth = 0.6;
      ctx.globalAlpha = 0.9;
      ctx.stroke();
      ctx.globalAlpha = 1;

      // ── Graticule (above land, whisper-faint) ──
      ctx.beginPath();
      path(d3.geoGraticule().step([20, 20])());
      ctx.strokeStyle = 'rgba(200,215,255,0.03)';
      ctx.lineWidth = 0.5;
      ctx.stroke();

      // ── Ghost rings: the map remembers vanished communities ──
      ctx.setLineDash([2, 3]);
      for (const c of COMMUNITIES) {
        const peak = PEAK_POP[c.id];
        if (peak < 30000) continue;
        if (year <= PEAK_YEAR[c.id]) continue; // hasn't risen and fallen yet
        const pop = populationAt(c, year);
        if (pop > peak * 0.15) continue;
        const pos = projection([c.lng, c.lat]);
        if (!pos) continue;
        const [x, y] = pos;
        if (x < -60 || x > w + 60 || y < -60 || y > h + 60) continue;
        const r = Math.max(5, radiusScale(peak) * (0.75 + camera.zoom * 0.12));
        ctx.beginPath();
        ctx.arc(x, y, r, 0, Math.PI * 2);
        ctx.strokeStyle = 'rgba(205,210,225,0.16)';
        ctx.lineWidth = 0.8;
        ctx.stroke();
      }
      ctx.setLineDash([]);

      // ── The Golden Thread: population center of gravity through time ──
      if (year > 90) {
        ctx.save();
        ctx.globalCompositeOperation = 'lighter';
        ctx.lineCap = 'round';
        let prev: [number, number] | null = null;
        for (const tp of CENTROID_TRAIL) {
          if (tp.year > year) break;
          const pos = projection([tp.lon, tp.lat]);
          if (!pos) {
            prev = null;
            continue;
          }
          if (prev) {
            // Older segments fade; the head of the thread burns brightest
            const age = clamp01((year - tp.year) / 900);
            ctx.beginPath();
            ctx.moveTo(prev[0], prev[1]);
            ctx.lineTo(pos[0], pos[1]);
            ctx.strokeStyle = '#ffd98a';
            ctx.globalAlpha = (0.5 - age * 0.38) * glow;
            ctx.lineWidth = 1.6 - age * 0.8;
            ctx.stroke();
          }
          prev = pos;
        }
        // Bead of light at the thread's head
        if (prev) {
          const bead = ctx.createRadialGradient(prev[0], prev[1], 0, prev[0], prev[1], 10);
          bead.addColorStop(0, '#ffe9bd');
          bead.addColorStop(1, 'rgba(0,0,0,0)');
          ctx.globalAlpha = 0.8 * glow;
          ctx.fillStyle = bead;
          ctx.beginPath();
          ctx.arc(prev[0], prev[1], 10, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.restore();
        ctx.globalAlpha = 1;
      }

      // ── Moment pings: history arriving at its coordinates ──
      for (const m of MOMENTS) {
        const age = year - m.year;
        if (age < 0 || age > 16) continue;
        const pos = projection([m.lng, m.lat]);
        if (!pos) continue;
        const [x, y] = pos;
        if (x < -40 || x > w + 40 || y < -40 || y > h + 40) continue;
        const phase = age / 16; // 0..1 lifetime
        const color = m.kind === 'dark' ? '#ff6252' : '#ffd98a';
        // Two expanding rings, offset in phase
        for (const off of [0, 0.45]) {
          const p = (phase + off) % 1;
          const rr = 4 + p * 34;
          ctx.beginPath();
          ctx.arc(x, y, rr, 0, Math.PI * 2);
          ctx.strokeStyle = color;
          ctx.globalAlpha = 0.5 * (1 - p) * (1 - phase * 0.6);
          ctx.lineWidth = 1.2;
          ctx.stroke();
        }
        // Bright center flash in the first years
        if (phase < 0.3) {
          ctx.beginPath();
          ctx.arc(x, y, 2.5, 0, Math.PI * 2);
          ctx.fillStyle = '#ffffff';
          ctx.globalAlpha = 0.9 * (1 - phase / 0.3);
          ctx.fill();
        }
        ctx.globalAlpha = 1;
      }

      // ── Migration arcs + comet particles (additive light) ──
      const active = MIGRATIONS.filter((m) => year >= m.startYear && year <= m.endYear);
      ctx.save();
      ctx.globalCompositeOperation = 'lighter';
      for (const m of active) {
        const from = COMMUNITY_INDEX[m.from];
        const to = COMMUNITY_INDEX[m.to];
        if (!from || !to) continue;
        const src = projection([from.lng, from.lat]);
        const dst = projection([to.lng, to.lat]);
        if (!src || !dst) continue;
        const [x1, y1] = src;
        const [x2, y2] = dst;
        const len = Math.hypot(x2 - x1, y2 - y1);
        if (len < 4) continue;
        const cx = (x1 + x2) / 2;
        const cy = (y1 + y2) / 2 - len * 0.24;
        const color = m.type === 'forced' ? FORCED_COLOR : VOLUNTARY_COLOR;

        // Fade arcs in/out near the migration's start and end years
        const life = clamp01((year - m.startYear) / 12) * clamp01((m.endYear - year) / 12 + 0.2);

        // Faint guide arc
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.quadraticCurveTo(cx, cy, x2, y2);
        ctx.strokeStyle = color;
        ctx.globalAlpha = 0.06 * life * glow;
        ctx.lineWidth = 1;
        ctx.stroke();

        // Comet particles: head + fading tail along the curve
        const seed = m.id.split('').reduce((a, ch) => a + ch.charCodeAt(0), 7);
        const field = particlesFor(m.id, seed);
        const nx = -(y2 - y1) / len; // unit normal for drift
        const ny = (x2 - x1) / len;
        for (const pt of field) {
          const head = (pt.offset + time * pt.speed) % 1;
          for (let k = 0; k < 4; k++) {
            const t = head - k * 0.012;
            if (t < 0) continue;
            const [px, py] = quadPoint(x1, y1, cx, cy, x2, y2, t);
            const endFade = Math.min(1, t * 6, (1 - t) * 6);
            const wobble = Math.sin(t * Math.PI) * pt.drift * (len / 400);
            const tail = 1 - k / 4;
            ctx.beginPath();
            ctx.arc(px + nx * wobble, py + ny * wobble, pt.size * (0.5 + 0.5 * tail), 0, Math.PI * 2);
            ctx.fillStyle = color;
            ctx.globalAlpha = 0.5 * endFade * life * tail * tail * glow;
            ctx.fill();
          }
        }
      }
      ctx.restore();
      ctx.globalAlpha = 1;

      // ── Communities: candle flames (additive), white-hot cores ──
      const labels: { x: number; y: number; r: number; text: string; pop: number }[] = [];
      const drawn: DrawnCommunity[] = [];
      ctx.save();
      ctx.globalCompositeOperation = somber > 0.5 ? 'source-over' : 'lighter';
      const dotColor = somber > 0 ? mixHex(palette.accent, '#8d929c', somber * 0.8) : palette.accent;
      const coreColor = mixHex(dotColor, '#ffffff', 0.55);
      for (const c of COMMUNITIES) {
        const pop = populationAt(c, year);
        if (pop <= 0) continue;
        const pos = projection([c.lng, c.lat]);
        if (!pos) continue;
        const [x, y] = pos;
        if (x < -60 || x > w + 60 || y < -60 || y > h + 60) continue;
        const r = Math.max(2.2, radiusScale(pop) * (0.75 + camera.zoom * 0.12));

        const flicker = 1 + Math.sin(time * 1.7 + x * 0.07 + y * 0.05) * 0.05;
        const glowR = r * 2.6 * flicker;
        const halo = ctx.createRadialGradient(x, y, 0, x, y, glowR);
        halo.addColorStop(0, dotColor);
        halo.addColorStop(0.45, mixHex(dotColor, '#000000', 0.35));
        halo.addColorStop(1, 'rgba(0,0,0,0)');
        ctx.globalAlpha = (0.34 - somber * 0.18) * flicker;
        ctx.fillStyle = halo;
        ctx.beginPath();
        ctx.arc(x, y, glowR, 0, Math.PI * 2);
        ctx.fill();

        // Body
        ctx.globalAlpha = 0.5 - somber * 0.15;
        ctx.fillStyle = dotColor;
        ctx.beginPath();
        ctx.arc(x, y, r, 0, Math.PI * 2);
        ctx.fill();

        // White-hot core — the wick of the candle
        ctx.globalAlpha = 0.85 - somber * 0.5;
        ctx.fillStyle = coreColor;
        ctx.beginPath();
        ctx.arc(x, y, Math.max(1, r * 0.32), 0, Math.PI * 2);
        ctx.fill();

        drawn.push({ id: c.id, x, y, r, pop });
        if (r > 9) labels.push({ x, y, r, text: c.name.split(' (')[0], pop });
      }
      drawnRef.current = drawn;
      ctx.restore();
      ctx.globalAlpha = 1;

      // Labels last so they sit above the light; cap to the biggest few
      labels.sort((a, b) => b.pop - a.pop);
      ctx.textAlign = 'center';
      ctx.font = '600 10.5px Inter, system-ui, sans-serif';
      for (const l of labels.slice(0, 14)) {
        ctx.globalAlpha = 0.8;
        ctx.fillStyle = 'rgba(240,244,255,0.85)';
        ctx.shadowColor = 'rgba(0,0,0,0.95)';
        ctx.shadowBlur = 7;
        ctx.fillText(l.text.toUpperCase(), l.x, l.y + l.r + 13);
        ctx.shadowBlur = 0;
        ctx.globalAlpha = 1;
      }

      // Vignette for cinema feel
      const vg = ctx.createRadialGradient(w / 2, h / 2, Math.min(w, h) * 0.45, w / 2, h / 2, Math.max(w, h) * 0.85);
      vg.addColorStop(0, 'rgba(0,0,0,0)');
      vg.addColorStop(1, 'rgba(0,0,0,0.4)');
      ctx.fillStyle = vg;
      ctx.fillRect(0, 0, w, h);
    };

    raf = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(raf);
  }, [stateRef]);

  const handleClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!onPickCommunity) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const px = e.clientX - rect.left;
    const py = e.clientY - rect.top;
    let best: DrawnCommunity | null = null;
    let bestDist = Infinity;
    for (const d of drawnRef.current) {
      const dist = Math.hypot(d.x - px, d.y - py);
      if (dist < Math.max(d.r + 8, 18) && dist < bestDist) {
        best = d;
        bestDist = dist;
      }
    }
    onPickCommunity(best ? best.id : null);
  };

  return (
    <canvas
      ref={canvasRef}
      className="story-canvas"
      style={{ opacity: visible ? 1 : 0, pointerEvents: visible ? 'auto' : 'none' }}
      onClick={handleClick}
      aria-hidden="true"
    />
  );
}
