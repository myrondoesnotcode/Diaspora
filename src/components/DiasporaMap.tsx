import { useEffect, useRef, useState, useCallback } from 'react';
import * as d3 from 'd3';
import * as topojson from 'topojson-client';
import type { Topology, GeometryCollection } from 'topojson-specification';
import type { Community, CulturalType } from '../data/types';
import { SNAPSHOT_YEARS } from '../data/types';
import { COMMUNITIES } from '../data/communities';
import { MIGRATIONS } from '../data/migrations';
import { getEpochForYear } from '../data/epochs';
import EventCard from './EventCard';

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

interface SelectedCommunity {
  community: Community;
  population: number;
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

function fmt(n: number): string {
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1) + 'M';
  if (n >= 1_000) return Math.round(n / 1000) + 'k';
  return n.toString();
}

function Sparkline({ community }: { community: Community }) {
  const W = 120, H = 32;
  const values = SNAPSHOT_YEARS.map(y => getPopulation(community, y));
  const maxVal = Math.max(...values, 1);
  const points = values
    .map((v, i) => {
      const x = (i / (SNAPSHOT_YEARS.length - 1)) * W;
      const y = H - 2 - ((v / maxVal) * (H - 4));
      return `${x},${y}`;
    })
    .join(' ');
  const color = CULTURAL_COLORS[community.culturalType];
  return (
    <svg width={W} height={H} style={{ display: 'block' }}>
      <polyline points={points} fill="none" stroke={color} strokeWidth={1.5} strokeLinejoin="round" />
      {values.map((v, i) => v > 0 && (
        <circle
          key={i}
          cx={(i / (SNAPSHOT_YEARS.length - 1)) * W}
          cy={H - 2 - ((v / maxVal) * (H - 4))}
          r={2}
          fill={color}
        />
      ))}
    </svg>
  );
}

export default function DiasporaMap({ year }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const gRef = useRef<SVGGElement>(null);
  const [worldData, setWorldData] = useState<Topology | null>(null);
  const [dims, setDims] = useState({ width: 300, height: 300 });
  const [selected, setSelected] = useState<SelectedCommunity | null>(null);
  const zoomRef = useRef<d3.ZoomBehavior<SVGSVGElement, unknown> | null>(null);
  const dimsRef = useRef(dims);
  const prevEpochRef = useRef<string>(getEpochForYear(year).name);

  // Load world topology
  useEffect(() => {
    fetch('countries-110m.json')
      .then((r) => r.json())
      .then(setWorldData)
      .catch(console.error);
  }, []);

  // Track container size
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const observer = new ResizeObserver((entries) => {
      const { width, height } = entries[0].contentRect;
      if (width > 0 && height > 0) {
        setDims({ width, height });
        dimsRef.current = { width, height };
      }
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // Set up D3 zoom/pan
  useEffect(() => {
    if (!svgRef.current) return;
    const zoom = d3.zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.5, 12])
      .on('zoom', (event) => {
        if (gRef.current) {
          gRef.current.setAttribute('transform', event.transform.toString());
        }
      });
    zoomRef.current = zoom;
    d3.select(svgRef.current).call(zoom);
    return () => {
      d3.select(svgRef.current!).on('.zoom', null);
    };
  }, [dims]);

  // Animate to epoch region when epoch changes
  useEffect(() => {
    const epoch = getEpochForYear(year);
    if (epoch.name === prevEpochRef.current) return;
    prevEpochRef.current = epoch.name;

    if (!epoch.mapFocus || !svgRef.current || !zoomRef.current) return;
    const { lng, lat, zoom: k } = epoch.mapFocus;
    const { width, height } = dimsRef.current;

    const proj = d3.geoNaturalEarth1()
      .scale(width / 3.2)
      .rotate([-35, 0])
      .translate([width / 2, height / 2]);

    const pos = proj([lng, lat]);
    if (!pos) return;
    const [px, py] = pos;
    const tx = width / 2 - px * k;
    const ty = height / 2 - py * k;
    const transform = d3.zoomIdentity.translate(tx, ty).scale(k);

    d3.select(svgRef.current)
      .transition()
      .duration(900)
      .ease(d3.easeCubicInOut)
      .call(zoomRef.current.transform, transform);
  }, [year]);

  const handleReset = useCallback(() => {
    if (!svgRef.current || !zoomRef.current) return;
    d3.select(svgRef.current)
      .transition()
      .duration(600)
      .call(zoomRef.current.transform, d3.zoomIdentity);
  }, []);

  // Projection — centered on Middle East/Mediterranean at 2× zoom
  const projection = d3
    .geoNaturalEarth1()
    .scale(dims.width / 3.2)
    .rotate([-35, 0])
    .translate([dims.width / 2, dims.height / 2]);

  const pathGen = d3.geoPath().projection(projection);
  const graticule = d3.geoGraticule().step([30, 30])();

  const countryFeatures = worldData
    ? (topojson.feature(
        worldData as any,
        (worldData as any).objects.countries as GeometryCollection
      ) as any).features
    : [];

  const communities = COMMUNITIES.map((c) => ({
    community: c,
    population: getPopulation(c, year),
  })).filter((d) => d.population > 0);

  const activeMigrations = MIGRATIONS.filter((m) => year >= m.startYear && year <= m.endYear);
  const communityIndex = Object.fromEntries(COMMUNITIES.map((c) => [c.id, c]));

  function arcPath(fromId: string, toId: string): string | null {
    const from = communityIndex[fromId];
    const to = communityIndex[toId];
    if (!from || !to) return null;
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

  return (
    <div ref={containerRef} className="map-container" onClick={() => setSelected(null)}>
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

        <rect width={dims.width} height={dims.height} fill="url(#oceanGradient)" />

        {/* All zoomable content inside <g> */}
        <g ref={gRef}>
          <path d={pathGen(graticule) ?? ''} className="graticule" />
          {countryFeatures.map((feature: any, i: number) => (
            <path key={i} d={pathGen(feature) ?? ''} className="country" />
          ))}

          {/* Migration arcs — glow */}
          {activeMigrations.map((m) => {
            const d = arcPath(m.from, m.to);
            if (!d) return null;
            return <path key={`glow-${m.id}`} d={d} className="arc-glow" stroke={ARC_COLORS[m.type]} strokeWidth={4} />;
          })}

          {/* Migration arcs — animated */}
          {activeMigrations.map((m) => {
            const d = arcPath(m.from, m.to);
            if (!d) return null;
            return <path key={`dash-${m.id}`} d={d} className="arc-dash" stroke={ARC_COLORS[m.type]} />;
          })}

          {/* Community circles */}
          {communities.map(({ community, population }) => {
            const pos = projection([community.lng, community.lat]);
            if (!pos) return null;
            const [cx, cy] = pos;
            const r = Math.max(4, radiusScale(population));
            const color = CULTURAL_COLORS[community.culturalType];
            const isSelected = selected?.community.id === community.id;
            return (
              <g key={community.id} style={{ cursor: 'pointer' }}>
                <circle cx={cx} cy={cy} r={r + 4} fill="none" stroke={color} strokeOpacity={isSelected ? 0.5 : 0.15} strokeWidth={isSelected ? 3 : 2} />
                <circle
                  cx={cx} cy={cy} r={r}
                  fill={color} fillOpacity={0.8}
                  stroke={color} strokeWidth={1.5} strokeOpacity={1}
                  className="community-circle"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelected(
                      selected?.community.id === community.id
                        ? null
                        : { community, population }
                    );
                  }}
                />
                {r > 16 && (
                  <text x={cx} y={cy + r + 11} className="community-label" style={{ fontSize: Math.min(11, Math.max(8, r * 0.6)) }}>
                    {community.name.split(' ')[0]}
                  </text>
                )}
              </g>
            );
          })}
        </g>
      </svg>

      {/* What's happening card */}
      <EventCard year={year} migrations={activeMigrations} />

      {/* Legend — fixed, doesn't zoom */}
      <div style={{
        position: 'absolute', top: 12, right: 12,
        background: 'rgba(245,240,232,0.93)',
        border: '1px solid rgba(0,0,0,0.08)',
        backdropFilter: 'blur(10px)',
        borderRadius: 12, padding: '10px 12px', fontSize: 11,
      }}>
        <div style={{ fontSize: 9, fontWeight: 700, color: '#6b5a4a', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 5, textAlign: 'center' }}>
          Tradition
        </div>
        {(Object.entries(CULTURAL_COLORS) as [CulturalType, string][]).map(([type, color]) => (
          <div key={type} style={{ display: 'flex', alignItems: 'center', gap: 5, marginBottom: 3 }}>
            <div style={{ width: 9, height: 9, borderRadius: '50%', backgroundColor: color, flexShrink: 0 }} />
            <span style={{ color: '#1a1410', fontSize: 10 }}>{type}</span>
          </div>
        ))}
        <div style={{ marginTop: 6, paddingTop: 6, borderTop: '1px solid rgba(0,0,0,0.08)' }}>
          {[['#ff4444', 'Forced'], ['#44aaff', 'Voluntary']].map(([color, label]) => (
            <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 5, marginBottom: 3 }}>
              <div style={{ width: 14, height: 2, background: color, borderRadius: 1, flexShrink: 0 }} />
              <span style={{ color: '#1a1410', fontSize: 10 }}>{label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Reset zoom button */}
      <button
        onClick={(e) => { e.stopPropagation(); handleReset(); }}
        style={{
          position: 'absolute', bottom: 12, right: 12,
          width: 36, height: 36, borderRadius: 10,
          background: 'rgba(245,240,232,0.93)',
          border: '1px solid rgba(0,0,0,0.08)',
          backdropFilter: 'blur(10px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          cursor: 'pointer', fontSize: 16, color: '#6b5a4a',
        }}
        title="Reset view"
      >
        ↺
      </button>

      {/* Community bottom sheet */}
      {selected && (
        <div
          onClick={(e) => e.stopPropagation()}
          style={{
            position: 'absolute', bottom: 0, left: 0, right: 0,
            background: '#f5f0e8',
            borderTop: '1px solid rgba(0,0,0,0.1)',
            borderRadius: '16px 16px 0 0',
            padding: '16px 20px 24px',
            animation: 'slideUp 0.25s ease',
          }}
        >
          {/* Handle */}
          <div style={{ width: 36, height: 4, background: 'rgba(0,0,0,0.15)', borderRadius: 2, margin: '0 auto 14px' }} />

          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12 }}>
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                <div style={{ width: 12, height: 12, borderRadius: '50%', backgroundColor: CULTURAL_COLORS[selected.community.culturalType], flexShrink: 0 }} />
                <div style={{ fontSize: 17, fontWeight: 700, color: '#1a1410' }}>{selected.community.name}</div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
                <span style={{
                  fontSize: 11, fontWeight: 600,
                  color: CULTURAL_COLORS[selected.community.culturalType],
                  background: CULTURAL_COLORS[selected.community.culturalType] + '18',
                  border: `1px solid ${CULTURAL_COLORS[selected.community.culturalType]}33`,
                  borderRadius: 20, padding: '2px 8px',
                }}>
                  {selected.community.culturalType}
                </span>
                {selected.population > 0 && (
                  <span style={{ fontSize: 13, fontWeight: 700, color: '#1a1410' }}>
                    {fmt(selected.population)} Jews
                  </span>
                )}
              </div>
              <p style={{ fontSize: 13, color: '#3a2a1a', lineHeight: 1.55, margin: 0 }}>
                {selected.community.significance}
              </p>
            </div>

            {/* Sparkline */}
            <div style={{ flexShrink: 0 }}>
              <div style={{ fontSize: 9, color: '#9a8a7a', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 4, textAlign: 'center' }}>Population over time</div>
              <Sparkline community={selected.community} />
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes slideUp {
          from { transform: translateY(100%); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
      `}</style>
    </div>
  );
}
