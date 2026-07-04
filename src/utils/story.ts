// Interpolation helpers for the scroll-driven story: continuous population
// curves, palette blending, and camera easing between chapter keyframes.

import type { Community } from '../data/types';
import type { CameraKeyframe, EraPalette } from '../data/chapters';
import { CHAPTERS, HERO_CAMERA, HERO_PALETTE } from '../data/chapters';
import { COMMUNITIES } from '../data/communities';

export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

export const clamp01 = (t: number) => Math.min(1, Math.max(0, t));

// Smooth ease for camera flights
export const easeInOut = (t: number) => t * t * (3 - 2 * t);

const yearsCache = new WeakMap<Community, number[]>();

function sortedYears(c: Community): number[] {
  let ys = yearsCache.get(c);
  if (!ys) {
    ys = Object.keys(c.populations).map(Number).sort((a, b) => a - b);
    yearsCache.set(c, ys);
  }
  return ys;
}

// Linear interpolation between the community's population snapshots, so dots
// grow and shrink continuously as the story year advances.
export function populationAt(c: Community, year: number): number {
  const ys = sortedYears(c);
  if (ys.length === 0 || year < ys[0]) return 0;
  for (let i = 0; i < ys.length; i++) {
    if (year === ys[i]) return c.populations[ys[i]] ?? 0;
    if (year < ys[i]) {
      const y0 = ys[i - 1];
      const y1 = ys[i];
      const p0 = c.populations[y0] ?? 0;
      const p1 = c.populations[y1] ?? 0;
      return lerp(p0, p1, (year - y0) / (y1 - y0));
    }
  }
  return c.populations[ys[ys.length - 1]] ?? 0;
}

function hexToRgb(hex: string): [number, number, number] {
  const n = parseInt(hex.slice(1), 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

export function mixHex(a: string, b: string, t: number): string {
  const ca = hexToRgb(a);
  const cb = hexToRgb(b);
  const c = ca.map((v, i) => Math.round(lerp(v, cb[i], t)));
  return `rgb(${c[0]},${c[1]},${c[2]})`;
}

export function mixPalette(a: EraPalette, b: EraPalette, t: number): EraPalette {
  if (t <= 0) return a;
  if (t >= 1) return b;
  return {
    oceanInner: mixHex(a.oceanInner, b.oceanInner, t),
    oceanOuter: mixHex(a.oceanOuter, b.oceanOuter, t),
    land: mixHex(a.land, b.land, t),
    border: mixHex(a.border, b.border, t),
    accent: mixHex(a.accent, b.accent, t),
  };
}

export function mixCamera(a: CameraKeyframe, b: CameraKeyframe, t: number): CameraKeyframe {
  return {
    lon: lerp(a.lon, b.lon, t),
    lat: lerp(a.lat, b.lat, t),
    // Interpolate zoom logarithmically so long flights dip out then back in.
    zoom: Math.exp(lerp(Math.log(a.zoom), Math.log(b.zoom), t)),
  };
}

// ── The Golden Thread ──
// The population-weighted center of gravity of the Jewish world, sampled
// across the whole timeline. Drawn on the map as a single continuous stroke:
// Jerusalem → Babylon → Iberia → Poland → across the Atlantic → back.
export interface TrailPoint {
  year: number;
  lon: number;
  lat: number;
}

export const CENTROID_TRAIL: TrailPoint[] = (() => {
  const pts: TrailPoint[] = [];
  for (let year = 70; year <= 2024; year += 6) {
    let wLon = 0;
    let wLat = 0;
    let total = 0;
    for (const c of COMMUNITIES) {
      const p = populationAt(c, year);
      if (p <= 0) continue;
      wLon += c.lng * p;
      wLat += c.lat * p;
      total += p;
    }
    if (total > 0) pts.push({ year, lon: wLon / total, lat: wLat / total });
  }
  return pts;
})();

// The story timeline `t` runs 0..CHAPTERS.length. t in [0,1) is the hero,
// [i, i+1) is chapter i-1... we instead use: t = 0 hero, t = i+1 midpoint of
// chapter i. Keyframes: hero + one per chapter.
const CAMERAS: CameraKeyframe[] = [HERO_CAMERA, ...CHAPTERS.map((c) => c.camera)];
const PALETTES: EraPalette[] = [HERO_PALETTE, ...CHAPTERS.map((c) => c.palette)];

// Fraction of each chapter's scroll length spent flying to the NEXT keyframe.
const FLY = 0.35;

export interface StoryState {
  camera: CameraKeyframe;
  palette: EraPalette;
  year: number;
  chapterIndex: number; // -1 while in the hero
  somber: number; // 0..1 muting factor for the Holocaust chapter
}

// t: 0 = top of hero, 1 = hero fully scrolled / chapter 0 begins,
// 1 + i + p = progress p through chapter i. Max = 1 + CHAPTERS.length.
export function storyStateAt(t: number): StoryState {
  const n = CHAPTERS.length;
  const clamped = Math.min(Math.max(t, 0), 1 + n - 0.0001);

  let seg: number; // index into CAMERAS of the segment we're in
  let p: number; // progress 0..1 within that segment
  if (clamped < 1) {
    seg = 0;
    p = clamped;
  } else {
    seg = Math.min(Math.floor(clamped - 1) + 1, n);
    p = clamped - Math.floor(clamped);
    if (seg === n) p = Math.min(p, 1);
  }

  // Within segment `seg` (keyframe CAMERAS[seg]): hold, then fly to seg+1
  // during the final FLY fraction.
  const hasNext = seg < CAMERAS.length - 1;
  const flyT = hasNext ? easeInOut(clamp01((p - (1 - FLY)) / FLY)) : 0;
  const camera = hasNext ? mixCamera(CAMERAS[seg], CAMERAS[seg + 1], flyT) : CAMERAS[seg];
  const palette = hasNext ? mixPalette(PALETTES[seg], PALETTES[seg + 1], flyT) : PALETTES[seg];

  // Year: advances through the chapter's span during the hold portion.
  let year: number;
  let chapterIndex: number;
  if (seg === 0) {
    chapterIndex = -1;
    year = CHAPTERS[0].startYear;
  } else {
    const ch = CHAPTERS[seg - 1];
    chapterIndex = seg - 1;
    const yearT = clamp01(p / (1 - FLY * 0.6)); // finish the span slightly early
    year = lerp(ch.startYear, ch.endYear, yearT);
    if (flyT > 0 && seg < CAMERAS.length - 1) {
      // Ease the year onward toward the next chapter's start during the flight
      year = lerp(ch.endYear, CHAPTERS[seg].startYear, flyT);
    }
  }

  // Somber factor peaks inside the Holocaust chapter, releases at its end.
  let somber = 0;
  const holoIdx = CHAPTERS.findIndex((c) => c.somber);
  if (holoIdx >= 0) {
    const holoSeg = holoIdx + 1;
    if (seg === holoSeg) somber = 1 - flyT;
    else if (seg === holoSeg - 1) somber = flyT;
  }

  return { camera, palette, year, chapterIndex, somber };
}
