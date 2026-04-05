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
  const gRef = useRef<SVGGElement>(null);
  const zoomRef = useRef<d3.ZoomBehavior<SVGSVGElement, unknown> | undefined>(undefined);
  const pointerDownRef = useRef<{ x: number; y: number } | null>(null);

  const [worldData, setWorldData] = useState<Topology | null>(null);
  const [tooltip, setTooltip] = useState<TooltipState | null>(null);
  const [dims, setDims] = useState({
    width: window.innerWidth,
    height: window.visualViewport?.height ?? window.innerHeight,
  });
  const [zoomLevel, setZoomLevel] = useState(1);

  // Load world atlas
  useEffect(() => {
    fetch('countries-110m.json')
      .then((r) => r.json())
      .then(setWorldData)
      .catch(console.error);
  }, []);

  // Track container size — use visualViewport for iOS Safari accuracy
  useEffect(() => {
    const update = () =>
      setDims({
        width: window.visualViewport?.width ?? window.innerWidth,
        height: window.visualViewport?.height ?? window.innerHeight,
      });
    window.addEventListener('resize', update);
    window.visualViewport?.addEventListener('resize', update);
    return () => {
      window.removeEventListener('resize', update);
      window.visualViewport?.removeEventListener('resize', update);
    };
  }, []);

  // D3 zoom behavior
  const mapHeight = dims.height - 160;
  useEffect(() => {
    if (!svgRef.current || !gRef.current) return;

    // Preserve zoom transform across resizes
    const prevTransform = d3.zoomTransform(svgRef.current);

    const zoom = d3.zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.8, 8])
      .on('zoom', (event: d3.D3ZoomEvent<SVGSVGElement, unknown>) => {
        d3.select(gRef.current).attr('transform', event.transform.toString());
        setZoomLevel(Math.round(event.transform.k * 10) / 10);
      });

    zoomRef.current = zoom;
    d3.select(svgRef.current).call(zoom).call(zoom.transform, prevTransform);

    return () => {
      if (svgRef.current) d3.select(svgRef.current).on('.zoom', null);
    };
  }, [dims.width, mapHeight]);

  // Derived data for current year
  const communities = COMMUNITIES.map((c) => ({
    community: c,
    population: getPopulation(c, year),
  })).filter((d) => d.population > 0);

  const activeMigrations = getActiveMigrations(year);

  // Build projection
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
  const isMobile = dims.width < 640;

  return (
    <div className="map-container" style={{ height: mapHeight }}>
      <svg
        ref={svgRef}
        className="map-svg"
        width={dims.width}
        height={mapHeight}
        viewBox={`0 0 ${dims.width} ${mapHeight}`}
        onPointerDown={(e) => {
          pointerDownRef.current = { x: e.clientX, y: e.clientY };
          // Dismiss tooltip when touching map background on mobile
          if (
            e.pointerType === 'touch' &&
            !(e.target instanceof Element && e.target.classList.contains('community-circle'))
          ) {
            setTooltip(null);
          }
        }}
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

        {/* Ocean — outside zoom group so it always fills the SVG */}
        <rect width={dims.width} height={mapHeight} fill="url(#oceanGradient)" />

        {/* Graticule — outside zoom group as fixed background reference */}
        <path d={pathGen(graticule) ?? ''} className="graticule" />

        {/* Everything zoomable lives inside this group */}
        <g ref={gRef}>
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
                  onPointerEnter={(e) => {
                    if (e.pointerType === 'touch') return;
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
                  onPointerMove={(e) => {
                    if (e.pointerType === 'touch') return;
                    const svg = svgRef.current;
                    if (!svg) return;
                    const rect = svg.getBoundingClientRect();
                    setTooltip((prev) =>
                      prev ? { ...prev, x: e.clientX - rect.left, y: e.clientY - rect.top } : prev
                    );
                  }}
                  onPointerLeave={(e) => {
                    if (e.pointerType === 'touch') return;
                    setTooltip(null);
                  }}
                  onPointerUp={(e) => {
                    if (e.pointerType !== 'touch') return;
                    const down = pointerDownRef.current;
                    if (!down) return;
                    const dist = Math.hypot(e.clientX - down.x, e.clientY - down.y);
                    if (dist > 8) return; // was a drag, not a tap
                    const svg = svgRef.current;
                    if (!svg) return;
                    const rect = svg.getBoundingClientRect();
                    setTooltip((prev) =>
                      prev?.community.id === community.id
                        ? null
                        : { community, population, x: e.clientX - rect.left, y: e.clientY - rect.top }
                    );
                  }}
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
        </g>
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
          isMobile={isMobile}
        />
      )}

      {/* Zoom controls */}
      <div
        className="absolute flex flex-col gap-1.5"
        style={{ bottom: 12, right: 12 }}
      >
        <button
          className="zoom-btn"
          aria-label="Zoom in"
          disabled={zoomLevel >= 7.5}
          onClick={() => {
            if (!svgRef.current || !zoomRef.current) return;
            d3.select(svgRef.current)
              .transition().duration(300)
              .call(zoomRef.current.scaleBy, 1.5);
          }}
        >
          +
        </button>
        <button
          className="zoom-btn"
          aria-label="Zoom out"
          disabled={zoomLevel <= 0.85}
          onClick={() => {
            if (!svgRef.current || !zoomRef.current) return;
            d3.select(svgRef.current)
              .transition().duration(300)
              .call(zoomRef.current.scaleBy, 1 / 1.5);
          }}
        >
          −
        </button>
        <button
          className="zoom-btn"
          aria-label="Reset zoom"
          style={{ fontSize: 14 }}
          onClick={() => {
            if (!svgRef.current || !zoomRef.current) return;
            d3.select(svgRef.current)
              .transition().duration(500)
              .call(zoomRef.current.transform, d3.zoomIdentity);
          }}
        >
          ↺
        </button>
      </div>

      {/* Legend */}
      {dims.width >= 480 && (
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
      )}

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
