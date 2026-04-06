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

const MAX_POP = Math.max(
  ...COMMUNITIES.flatMap((c) => Object.values(c.populations).map(Number))
);
const radiusScale = d3.scaleSqrt().domain([0, MAX_POP]).range([0, 22]).clamp(true);

function getPopulation(community: Community, year: number): number {
  const years = Object.keys(community.populations).map(Number).sort((a, b) => a - b);
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
  const containerRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const [worldData, setWorldData] = useState<Topology | null>(null);
  const [tooltip, setTooltip] = useState<TooltipState | null>(null);
  // dims tracks the actual rendered container size
  const [dims, setDims] = useState({ width: 300, height: 300 });

  // Load world topology once
  useEffect(() => {
    fetch('countries-110m.json')
      .then((r) => r.json())
      .then(setWorldData)
      .catch(console.error);
  }, []);

  // Track container size with ResizeObserver — no window.innerHeight hacks
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const observer = new ResizeObserver((entries) => {
      const { width, height } = entries[0].contentRect;
      if (width > 0 && height > 0) setDims({ width, height });
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // Derived data
  const communities = COMMUNITIES.map((c) => ({
    community: c,
    population: getPopulation(c, year),
  })).filter((d) => d.population > 0);

  const activeMigrations = getActiveMigrations(year);

  // Projection — centered in the container
  const projection = d3
    .geoNaturalEarth1()
    .scale(dims.width / 6.3)
    .translate([dims.width / 2, dims.height / 2]);

  const pathGen = d3.geoPath().projection(projection);
  const graticule = d3.geoGraticule().step([30, 30])();

  const countryFeatures = worldData
    ? (topojson.feature(
        worldData as any,
        (worldData as any).objects.countries as GeometryCollection
      ) as any).features
    : [];

  function arcPath(from: Community, to: Community): string | null {
    const src = projection([from.lng, from.lat]);
    const dst = projection([to.lng, to.lat]);
    if (!src || !dst) return null;
    const [x1, y1] = src;
    const [x2, y2] = dst;
    const mx = (x1 + x2) / 2;
    const my = (y1 + y2) / 2;
    const len = Math.hypot(x2 - x1, y2 - y1);
    return `M ${x1},${y1} Q ${mx},${my - len * 0.28} ${x2},${y2}`;
  }

  const communityIndex = Object.fromEntries(COMMUNITIES.map((c) => [c.id, c]));

  return (
    // Fills the parent container absolutely
    <div ref={containerRef} className="map-container">
      <svg
        ref={svgRef}
        className="map-svg"
        viewBox={`0 0 ${dims.width} ${dims.height}`}
        preserveAspectRatio="xMidYMid meet"
      >
        <defs>
          <radialGradient id="oceanGradient" cx="50%" cy="50%" r="70%">
            <stop offset="0%" stopColor="#0d1b3e" />
            <stop offset="100%" stopColor="#020510" />
          </radialGradient>
        </defs>

        {/* Ocean */}
        <rect width={dims.width} height={dims.height} fill="url(#oceanGradient)" />

        {/* Graticule */}
        <path d={pathGen(graticule) ?? ''} className="graticule" />

        {/* Countries */}
        {countryFeatures.map((feature: any, i: number) => (
          <path key={i} d={pathGen(feature) ?? ''} className="country" />
        ))}

        {/* Migration arcs — glow */}
        {activeMigrations.map((m) => {
          const from = communityIndex[m.from];
          const to = communityIndex[m.to];
          if (!from || !to) return null;
          const d = arcPath(from, to);
          if (!d) return null;
          return (
            <path key={`glow-${m.id}`} d={d} className="arc-glow" stroke={ARC_COLORS[m.type]} strokeWidth={4} />
          );
        })}

        {/* Migration arcs — animated dash */}
        {activeMigrations.map((m) => {
          const from = communityIndex[m.from];
          const to = communityIndex[m.to];
          if (!from || !to) return null;
          const d = arcPath(from, to);
          if (!d) return null;
          return (
            <path key={`dash-${m.id}`} d={d} className="arc-dash" stroke={ARC_COLORS[m.type]} />
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
              <circle cx={cx} cy={cy} r={r + 2} fill="none" stroke={color} strokeOpacity={0.2} strokeWidth={3} />
              <circle
                cx={cx} cy={cy} r={r}
                fill={color} fillOpacity={0.75}
                stroke={color} strokeWidth={1} strokeOpacity={0.9}
                className="community-circle"
                onMouseEnter={(e) => {
                  const svg = svgRef.current;
                  if (!svg) return;
                  const rect = svg.getBoundingClientRect();
                  setTooltip({ community, population, x: e.clientX - rect.left, y: e.clientY - rect.top });
                }}
                onMouseMove={(e) => {
                  const svg = svgRef.current;
                  if (!svg) return;
                  const rect = svg.getBoundingClientRect();
                  setTooltip((prev) => prev ? { ...prev, x: e.clientX - rect.left, y: e.clientY - rect.top } : prev);
                }}
                onMouseLeave={() => setTooltip(null)}
              />
              {r > 18 && (
                <text x={cx} y={cy + r + 10} className="community-label" style={{ fontSize: Math.min(11, Math.max(8, r * 0.55)) }}>
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
          mapHeight={dims.height}
        />
      )}

      {/* Legend */}
      <div
        style={{
          position: 'absolute', top: 12, right: 12,
          background: 'rgba(245,240,232,0.93)',
          border: '1px solid rgba(0,0,0,0.08)',
          backdropFilter: 'blur(8px)',
          borderRadius: 12, padding: '10px 12px',
          fontSize: 12,
        }}
      >
        <div style={{ fontSize: 10, fontWeight: 700, color: '#6b5a4a', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 6, textAlign: 'center' }}>
          Cultural Tradition
        </div>
        {(Object.entries(CULTURAL_COLORS) as [CulturalType, string][]).map(([type, color]) => (
          <div key={type} style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 3 }}>
            <div style={{ width: 10, height: 10, borderRadius: '50%', backgroundColor: color, flexShrink: 0 }} />
            <span style={{ color: '#1a1410' }}>{type}</span>
          </div>
        ))}
        <div style={{ marginTop: 8, paddingTop: 8, borderTop: '1px solid rgba(0,0,0,0.08)' }}>
          <div style={{ fontSize: 10, fontWeight: 700, color: '#6b5a4a', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 6, textAlign: 'center' }}>
            Migration
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 3 }}>
            <div style={{ width: 20, height: 2, background: '#ff4444', borderRadius: 1, flexShrink: 0 }} />
            <span style={{ color: '#1a1410' }}>Forced</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <div style={{ width: 20, height: 2, background: '#44aaff', borderRadius: 1, flexShrink: 0 }} />
            <span style={{ color: '#1a1410' }}>Voluntary</span>
          </div>
        </div>
      </div>

      {/* Title */}
      <div style={{ position: 'absolute', top: 12, left: 12 }}>
        <div style={{ fontSize: 17, fontWeight: 700, color: '#f5f0e8', textShadow: '0 1px 8px rgba(0,0,0,0.8)', letterSpacing: '-0.01em' }}>
          The Jewish Diaspora
        </div>
        <div style={{ fontSize: 11, color: 'rgba(245,240,232,0.55)', textShadow: '0 1px 4px rgba(0,0,0,0.7)' }}>
          70 CE – 2024 · 1,954 Years of History
        </div>
      </div>
    </div>
  );
}
