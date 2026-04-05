import { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import * as topojson from 'topojson-client';
import type { Topology, GeometryCollection } from 'topojson-specification';
import type { Community, Migration, CulturalType } from '../data/types';
import { COMMUNITIES } from '../data/communities';
import { MIGRATIONS } from '../data/migrations';
import Tooltip from './Tooltip';

const CULTURAL_COLORS: Record<CulturalType, string> = {
  Ashkenazi: '#4a9eff',
  Sephardic: '#f5a623',
  Mizrahi: '#7ed321',
  Yemenite: '#bd10e0',
  Ethiopian: '#e86c2c',
  Mixed: '#9b9b9b',
};

const ARC_COLORS: Record<string, string> = {
  forced: '#ff4444',
  voluntary: '#44aaff',
};

interface TooltipState {
  community: Community;
  population: number;
  x: number;
  y: number;
}

interface Props {
  year: number;
}

// Max population across all time for radius scale
const MAX_POP = Math.max(
  ...COMMUNITIES.flatMap((c) => Object.values(c.populations).map(Number))
);
const radiusScale = d3.scaleSqrt().domain([0, MAX_POP]).range([0, 42]).clamp(true);

function getPopulation(community: Community, year: number): number {
  const years = Object.keys(community.populations).map(Number).sort((a, b) => a - b);
  // find exact or nearest past year
  let val = 0;
  for (const y of years) {
    if (y <= year) val = community.populations[y] ?? 0;
  }
  return val;
}

function getActiveMigrations(year: number): Migration[] {
  return MIGRATIONS.filter((m) => year >= m.startYear && year <= m.endYear);
}

export default function DiasporaMap({ year }: Props) {
  const svgRef = useRef<SVGSVGElement>(null);
  const [worldData, setWorldData] = useState<Topology | null>(null);
  const [tooltip, setTooltip] = useState<TooltipState | null>(null);
  const [dims, setDims] = useState({ width: window.innerWidth, height: window.innerHeight });

  // Load world atlas
  useEffect(() => {
    fetch('countries-110m.json')
      .then((r) => r.json())
      .then(setWorldData)
      .catch(console.error);
  }, []);

  // Track container size
  useEffect(() => {
    const handler = () => setDims({ width: window.innerWidth, height: window.innerHeight });
    window.addEventListener('resize', handler);
    return () => window.removeEventListener('resize', handler);
  }, []);

  // Derived data for current year
  const communities = COMMUNITIES.map((c) => ({
    community: c,
    population: getPopulation(c, year),
  })).filter((d) => d.population > 0);

  const activeMigrations = getActiveMigrations(year);

  // Build projection
  const mapHeight = dims.height - 160; // leave room for timeline
  const projection = d3
    .geoNaturalEarth1()
    .scale(dims.width / 6.3)
    .translate([dims.width / 2, mapHeight / 2]);

  const pathGen = d3.geoPath().projection(projection);
  const graticule = d3.geoGraticule().step([30, 30])();

  // Country features
  const countryFeatures =
    worldData
      ? (
          topojson.feature(
            worldData as any,
            (worldData as any).objects.countries as GeometryCollection
          ) as any
        ).features
      : [];

  // Arc path builder
  function arcPath(from: Community, to: Community): string | null {
    const src = projection([from.lng, from.lat]);
    const dst = projection([to.lng, to.lat]);
    if (!src || !dst) return null;
    const [x1, y1] = src;
    const [x2, y2] = dst;
    const mx = (x1 + x2) / 2;
    const my = (y1 + y2) / 2;
    const len = Math.hypot(x2 - x1, y2 - y1);
    const cx = mx;
    const cy = my - len * 0.28;
    return `M ${x1},${y1} Q ${cx},${cy} ${x2},${y2}`;
  }

  const communityIndex = Object.fromEntries(COMMUNITIES.map((c) => [c.id, c]));

  return (
    <div className="map-container" style={{ height: mapHeight }}>
      <svg
        ref={svgRef}
        className="map-svg"
        width={dims.width}
        height={mapHeight}
        viewBox={`0 0 ${dims.width} ${mapHeight}`}
      >
        <defs>
          <radialGradient id="oceanGradient" cx="50%" cy="50%" r="70%">
            <stop offset="0%" stopColor="#0d1b3e" />
            <stop offset="100%" stopColor="#020510" />
          </radialGradient>
          <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Ocean */}
        <rect width={dims.width} height={mapHeight} fill="url(#oceanGradient)" />

        {/* Graticule */}
        <path d={pathGen(graticule) ?? ''} className="graticule" />

        {/* Countries */}
        {countryFeatures.map((feature: any, i: number) => (
          <path
            key={i}
            d={pathGen(feature) ?? ''}
            className="country"
          />
        ))}

        {/* Migration arcs — glow layer */}
        {activeMigrations.map((m) => {
          const from = communityIndex[m.from];
          const to = communityIndex[m.to];
          if (!from || !to) return null;
          const d = arcPath(from, to);
          if (!d) return null;
          const color = ARC_COLORS[m.type];
          return (
            <path
              key={`glow-${m.id}`}
              d={d}
              className="arc-glow"
              stroke={color}
              strokeWidth={4}
            />
          );
        })}

        {/* Migration arcs — animated dash layer */}
        {activeMigrations.map((m) => {
          const from = communityIndex[m.from];
          const to = communityIndex[m.to];
          if (!from || !to) return null;
          const d = arcPath(from, to);
          if (!d) return null;
          const color = ARC_COLORS[m.type];
          return (
            <path
              key={`dash-${m.id}`}
              d={d}
              className="arc-dash"
              stroke={color}
            />
          );
        })}

        {/* Community circles */}
        {communities.map(({ community, population }) => {
          const pos = projection([community.lng, community.lat]);
          if (!pos) return null;
          const [cx, cy] = pos;
          const r = Math.max(3, radiusScale(population));
          const color = CULTURAL_COLORS[community.culturalType];

          return (
            <g key={community.id}>
              {/* Glow ring */}
              <circle
                cx={cx}
                cy={cy}
                r={r + 2}
                fill="none"
                stroke={color}
                strokeOpacity={0.2}
                strokeWidth={3}
              />
              {/* Main circle */}
              <circle
                cx={cx}
                cy={cy}
                r={r}
                fill={color}
                fillOpacity={0.75}
                stroke={color}
                strokeWidth={1}
                strokeOpacity={0.9}
                className="community-circle"
                onMouseEnter={(e) => {
                  const svg = svgRef.current;
                  if (!svg) return;
                  const rect = svg.getBoundingClientRect();
                  setTooltip({
                    community,
                    population,
                    x: e.clientX - rect.left,
                    y: e.clientY - rect.top,
                  });
                }}
                onMouseMove={(e) => {
                  const svg = svgRef.current;
                  if (!svg) return;
                  const rect = svg.getBoundingClientRect();
                  setTooltip((prev) =>
                    prev ? { ...prev, x: e.clientX - rect.left, y: e.clientY - rect.top } : prev
                  );
                }}
                onMouseLeave={() => setTooltip(null)}
              />
              {/* City label for large circles */}
              {r > 14 && (
                <text
                  x={cx}
                  y={cy + r + 10}
                  className="community-label"
                  style={{ fontSize: Math.min(11, Math.max(8, r * 0.55)) }}
                >
                  {community.name.split(' ')[0]}
                </text>
              )}
            </g>
          );
        })}
      </svg>

      {/* Tooltip */}
      {tooltip && (
        <Tooltip
          community={tooltip.community}
          population={tooltip.population}
          x={tooltip.x}
          y={tooltip.y}
          mapWidth={dims.width}
          mapHeight={mapHeight}
        />
      )}

      {/* Legend */}
      <div
        className="absolute top-3 right-3 rounded-xl p-3 text-xs"
        style={{
          background: 'rgba(10,15,40,0.88)',
          border: '1px solid rgba(255,255,255,0.1)',
          backdropFilter: 'blur(8px)',
        }}
      >
        <div className="font-semibold text-white mb-2 text-center tracking-wide uppercase text-[10px]">
          Cultural Tradition
        </div>
        {(Object.entries(CULTURAL_COLORS) as [CulturalType, string][]).map(([type, color]) => (
          <div key={type} className="flex items-center gap-2 mb-1">
            <div
              className="w-2.5 h-2.5 rounded-full flex-shrink-0"
              style={{ backgroundColor: color, boxShadow: `0 0 4px ${color}` }}
            />
            <span style={{ color: 'rgba(255,255,255,0.75)' }}>{type}</span>
          </div>
        ))}
        <div className="mt-2 pt-2 border-t border-white/10">
          <div className="font-semibold text-white mb-1 text-center tracking-wide uppercase text-[10px]">
            Migration
          </div>
          <div className="flex items-center gap-2 mb-1">
            <div className="w-6 h-0.5" style={{ background: '#ff4444' }} />
            <span style={{ color: 'rgba(255,255,255,0.75)' }}>Forced</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-6 h-0.5" style={{ background: '#44aaff' }} />
            <span style={{ color: 'rgba(255,255,255,0.75)' }}>Voluntary</span>
          </div>
        </div>
      </div>

      {/* Title overlay */}
      <div className="absolute top-3 left-3">
        <div
          className="text-lg font-bold tracking-tight"
          style={{ color: 'rgba(255,255,255,0.9)', textShadow: '0 2px 12px rgba(0,0,0,0.8)' }}
        >
          The Jewish Diaspora
        </div>
        <div className="text-xs" style={{ color: 'rgba(255,255,255,0.45)' }}>
          70 CE – 2024 · 1,954 Years of History
        </div>
      </div>
    </div>
  );
}
