import { useEffect, useState } from 'react';
import type { RefObject } from 'react';
import type { LineageResult } from '../utils/lineageAlgorithm';
import { getPeakPopulation, getEarliestYear, formatYear, fmtPop } from '../utils/lineageAlgorithm';
import type { CulturalType, Migration } from '../data/types';

interface Props {
  lineage: LineageResult;
  posterRef: RefObject<HTMLDivElement>;
}

const CULTURAL_COLORS: Record<CulturalType, string> = {
  Ashkenazi: '#4a9eff',
  Sephardic: '#f5a623',
  Mizrahi: '#ff8c42',
  Yemenite: '#e8c547',
  Ethiopian: '#6ecf6e',
  Mixed: '#9b8cff',
  Ancient: '#d4af37',
};

const CULTURAL_LABELS: Record<CulturalType, string> = {
  Ashkenazi: 'Ashkenazi',
  Sephardic: 'Sephardic',
  Mizrahi: 'Mizrahi',
  Yemenite: 'Yemenite',
  Ethiopian: 'Ethiopian',
  Mixed: 'Global Diaspora',
  Ancient: 'Ancient',
};

function MigrationPathSvg({ lineage }: { lineage: LineageResult }) {
  const { path, migrations } = lineage;
  if (path.length <= 1) return null;

  const SVG_W = 800;
  const SVG_H = 200;
  const PAD_X = 55;
  const NODE_Y = 110;
  const NODE_R = 16;

  // Determine which nodes to display (max 5, with ellipsis if needed)
  type DisplayNode = { community: typeof path[0]; ellipsis?: false } | { ellipsis: true };

  let displayItems: DisplayNode[];
  let migrationSlots: (Migration | null)[]; // migration between displayItems[i] and displayItems[i+1]

  if (path.length <= 5) {
    displayItems = path.map(c => ({ community: c }));
    migrationSlots = migrations;
  } else {
    // Show: [0], [1], ellipsis, [n-2], [n-1]
    displayItems = [
      { community: path[0] },
      { community: path[1] },
      { ellipsis: true },
      { community: path[path.length - 2] },
      { community: path[path.length - 1] },
    ];
    migrationSlots = [
      migrations[0],           // 0 → 1
      null,                     // 1 → ellipsis (no migration line)
      null,                     // ellipsis → n-2 (no migration line)
      migrations[migrations.length - 1], // n-2 → n-1
    ];
  }

  const count = displayItems.length;
  const spacing = (SVG_W - 2 * PAD_X) / (count - 1);
  const xs = displayItems.map((_, i) => PAD_X + i * spacing);

  return (
    <svg
      width={SVG_W}
      height={SVG_H}
      viewBox={`0 0 ${SVG_W} ${SVG_H}`}
      style={{ display: 'block' }}
    >
      {/* Draw arcs between consecutive non-ellipsis pairs */}
      {displayItems.slice(0, -1).map((item, i) => {
        const migration = migrationSlots[i];
        if (!migration || item.ellipsis || displayItems[i + 1].ellipsis) return null;
        const x1 = xs[i];
        const x2 = xs[i + 1];
        const midX = (x1 + x2) / 2;
        const arcHeight = Math.min(45, (x2 - x1) * 0.22);
        const cy = NODE_Y - arcHeight;
        const color = migration.type === 'forced' ? '#ff4d4d' : '#44aaff';
        return (
          <g key={i}>
            <path
              d={`M ${x1} ${NODE_Y} Q ${midX} ${cy} ${x2} ${NODE_Y}`}
              fill="none"
              stroke={color}
              strokeWidth={2.5}
              strokeDasharray={migration.type === 'forced' ? '6 3' : 'none'}
              opacity={0.75}
            />
            {/* Arrowhead */}
            <polygon
              points={`${x2 - 10},${NODE_Y - 5} ${x2},${NODE_Y} ${x2 - 10},${NODE_Y + 5}`}
              fill={color}
              opacity={0.75}
            />
          </g>
        );
      })}

      {/* Draw nodes */}
      {displayItems.map((item, i) => {
        const x = xs[i];
        if (item.ellipsis) {
          return (
            <g key={i}>
              <text
                x={x}
                y={NODE_Y + 5}
                textAnchor="middle"
                fontSize={20}
                fill="#9a8a7a"
                fontFamily="system-ui"
              >
                ···
              </text>
            </g>
          );
        }
        const c = item.community;
        const color = CULTURAL_COLORS[c.culturalType];
        const shortName = c.name.replace(/\s*\(.*?\)\s*/g, '').trim();
        const displayName = shortName.length > 14 ? shortName.slice(0, 13) + '…' : shortName;

        return (
          <g key={i}>
            {/* Shadow ring */}
            <circle cx={x} cy={NODE_Y} r={NODE_R + 3} fill="rgba(0,0,0,0.06)" />
            {/* Node circle */}
            <circle cx={x} cy={NODE_Y} r={NODE_R} fill={color} stroke="white" strokeWidth={2.5} />
            {/* City label */}
            <text
              x={x}
              y={NODE_Y + NODE_R + 14}
              textAnchor="middle"
              fontSize={11}
              fontWeight="600"
              fill="#1a1410"
              fontFamily="system-ui"
            >
              {displayName}
            </text>
          </g>
        );
      })}

      {/* Legend */}
      <g transform={`translate(${SVG_W - 145}, ${SVG_H - 28})`}>
        <line x1={0} y1={8} x2={20} y2={8} stroke="#ff4d4d" strokeWidth={2} strokeDasharray="5 2" />
        <text x={25} y={12} fontSize={9} fill="#9a8a7a" fontFamily="system-ui">Forced migration</text>
        <line x1={0} y1={22} x2={20} y2={22} stroke="#44aaff" strokeWidth={2} />
        <text x={25} y={26} fontSize={9} fill="#9a8a7a" fontFamily="system-ui">Voluntary migration</text>
      </g>
    </svg>
  );
}

export default function PosterDisplay({ lineage, posterRef }: Props) {
  const { destination, path, migrations, relevantEpochs, primaryCulturalType } = lineage;
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handler = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handler);
    return () => window.removeEventListener('resize', handler);
  }, []);

  const POSTER_W = 800;
  const POSTER_H = 1100;
  const scale = Math.min(1, (windowWidth - 24) / POSTER_W);
  const culturalColor = CULTURAL_COLORS[primaryCulturalType];
  const culturalLabel = CULTURAL_LABELS[primaryCulturalType];

  const peakPop = getPeakPopulation(destination);
  const earliestYear = getEarliestYear(destination);

  const hasPath = path.length > 1;

  // Year range for the journey
  const journeyStart = migrations.length > 0 ? migrations[0].startYear : null;
  const journeyEnd = migrations.length > 0 ? migrations[migrations.length - 1].endYear : null;

  return (
    <div
      style={{
        transformOrigin: 'top center',
        transform: `scale(${scale})`,
        marginBottom: scale < 1 ? `${(POSTER_H * scale - POSTER_H)}px` : 0,
      }}
    >
      <div
        ref={posterRef}
        style={{
          width: POSTER_W,
          height: POSTER_H,
          background: '#f5f0e8',
          fontFamily: 'system-ui, -apple-system, sans-serif',
          overflow: 'hidden',
          position: 'relative',
          boxShadow: '0 8px 40px rgba(0,0,0,0.18)',
        }}
      >
        {/* ── HEADER ── */}
        <div
          style={{
            background: 'linear-gradient(135deg, #2a1000 0%, #0a1428 100%)',
            padding: '22px 30px 18px',
            position: 'relative',
          }}
        >
          {/* Decorative corner ornaments */}
          <div style={{ position: 'absolute', top: 12, left: 14, opacity: 0.15, fontSize: 22, color: '#d4af37' }}>✦</div>
          <div style={{ position: 'absolute', top: 12, right: 14, opacity: 0.15, fontSize: 22, color: '#d4af37' }}>✦</div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12, marginBottom: 6 }}>
            <span style={{ color: '#d4af37', fontSize: 26, lineHeight: 1 }}>✡</span>
            <div style={{ textAlign: 'center' }}>
              <div style={{
                color: '#d4af37',
                fontSize: 11,
                fontWeight: 700,
                letterSpacing: '0.22em',
                textTransform: 'uppercase',
              }}>
                The Jewish Diaspora
              </div>
              <div style={{
                color: 'rgba(255,255,255,0.55)',
                fontSize: 10,
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                marginTop: 2,
              }}>
                3,800 Years of Migration &amp; Memory
              </div>
            </div>
            <span style={{ color: '#d4af37', fontSize: 26, lineHeight: 1 }}>✡</span>
          </div>

          <div style={{ textAlign: 'center', marginTop: 10 }}>
            <div style={{
              color: 'white',
              fontSize: 28,
              fontWeight: 700,
              letterSpacing: '-0.01em',
              lineHeight: 1.2,
            }}>
              Your Family&apos;s Lineage
            </div>
            <div style={{
              marginTop: 8,
              display: 'inline-flex',
              alignItems: 'center',
              gap: 7,
              background: 'rgba(255,255,255,0.10)',
              borderRadius: 20,
              padding: '4px 14px',
            }}>
              <span style={{
                width: 9,
                height: 9,
                borderRadius: '50%',
                background: culturalColor,
                display: 'inline-block',
                flexShrink: 0,
              }} />
              <span style={{ color: culturalColor, fontSize: 12, fontWeight: 600, letterSpacing: '0.06em' }}>
                {culturalLabel} Tradition
              </span>
            </div>
          </div>
        </div>

        {/* ── DESTINATION BANNER ── */}
        <div style={{
          background: 'white',
          borderBottom: '1px solid rgba(0,0,0,0.07)',
          padding: '14px 30px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
          <div>
            <div style={{
              fontSize: 9,
              fontWeight: 700,
              letterSpacing: '0.18em',
              textTransform: 'uppercase',
              color: '#9a8a7a',
              marginBottom: 3,
            }}>
              Your Community
            </div>
            <div style={{
              fontSize: 24,
              fontWeight: 800,
              color: '#1a1410',
              lineHeight: 1.15,
            }}>
              The Jews of {destination.name.replace(/\s*\(.*?\)\s*/g, '').trim()}
            </div>
          </div>
          {journeyStart !== null && (
            <div style={{
              textAlign: 'right',
              background: '#f5f0e8',
              borderRadius: 10,
              padding: '8px 14px',
              flexShrink: 0,
            }}>
              <div style={{ fontSize: 9, color: '#9a8a7a', fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase' }}>Journey</div>
              <div style={{ fontSize: 13, fontWeight: 700, color: '#1a1410', marginTop: 2 }}>
                {formatYear(journeyStart)}
              </div>
              <div style={{ fontSize: 10, color: '#9a8a7a' }}>to {formatYear(journeyEnd ?? 2026)}</div>
            </div>
          )}
        </div>

        {/* ── MIGRATION PATH ── */}
        {hasPath ? (
          <div style={{ background: '#fdfaf5', borderBottom: '1px solid rgba(0,0,0,0.06)', padding: '12px 0 6px' }}>
            <div style={{
              fontSize: 9,
              fontWeight: 700,
              letterSpacing: '0.18em',
              textTransform: 'uppercase',
              color: '#9a8a7a',
              textAlign: 'center',
              marginBottom: 4,
            }}>
              Migration Path
            </div>
            <MigrationPathSvg lineage={lineage} />
          </div>
        ) : (
          <div style={{
            background: '#fdfaf5',
            borderBottom: '1px solid rgba(0,0,0,0.06)',
            padding: '22px 30px',
            textAlign: 'center',
          }}>
            <div style={{ fontSize: 13, color: '#9a8a7a', fontStyle: 'italic' }}>
              This community has no recorded migration history in our dataset.
            </div>
          </div>
        )}

        {/* ── EPOCH TIMELINE ── */}
        <div style={{ padding: '14px 28px 0' }}>
          <div style={{
            fontSize: 9,
            fontWeight: 700,
            letterSpacing: '0.18em',
            textTransform: 'uppercase',
            color: '#9a8a7a',
            marginBottom: 10,
          }}>
            Key Historical Epochs in This Journey
          </div>

          {relevantEpochs.length === 0 && (
            <div style={{ fontSize: 12, color: '#9a8a7a', fontStyle: 'italic' }}>
              No epoch data available.
            </div>
          )}

          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {relevantEpochs.map((epoch, i) => {
              // Find the most relevant key event for this path
              const relevantMig = migrations.find(
                m => epoch.startYear <= m.endYear && epoch.endYear >= m.startYear
              );
              const bestEvent = epoch.keyEvents?.find(
                e => relevantMig && e.year >= relevantMig.startYear && e.year <= relevantMig.endYear
              ) ?? epoch.keyEvents?.[0];

              return (
                <div
                  key={i}
                  style={{
                    display: 'flex',
                    gap: 12,
                    padding: '9px 12px',
                    background: 'white',
                    borderRadius: 8,
                    borderLeft: `4px solid ${epoch.color}`,
                  }}
                >
                  <div style={{ flexShrink: 0, paddingTop: 1 }}>
                    <div style={{
                      width: 9,
                      height: 9,
                      borderRadius: '50%',
                      background: epoch.color,
                      marginTop: 3,
                    }} />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, flexWrap: 'wrap' }}>
                      <span style={{ fontSize: 12, fontWeight: 700, color: '#1a1410' }}>{epoch.name}</span>
                      <span style={{ fontSize: 10, color: '#9a8a7a', whiteSpace: 'nowrap' }}>
                        {formatYear(epoch.startYear)} – {formatYear(epoch.endYear)}
                      </span>
                    </div>
                    <div style={{ fontSize: 11, color: '#555', marginTop: 2, lineHeight: 1.45 }}>
                      {epoch.description}
                    </div>
                    {bestEvent && (
                      <div style={{
                        marginTop: 4,
                        fontSize: 10,
                        color: '#7a6a5a',
                        fontStyle: 'italic',
                        lineHeight: 1.4,
                      }}>
                        {formatYear(bestEvent.year)}: {bestEvent.label.length > 110
                          ? bestEvent.label.slice(0, 107) + '…'
                          : bestEvent.label}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ── STATS BAR ── */}
        <div style={{
          position: 'absolute',
          bottom: 64,
          left: 0,
          right: 0,
          background: 'white',
          borderTop: '1px solid rgba(0,0,0,0.07)',
          display: 'flex',
          justifyContent: 'space-around',
          padding: '10px 20px',
        }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 9, color: '#9a8a7a', fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase' }}>Peak Community</div>
            <div style={{ fontSize: 16, fontWeight: 800, color: '#1a1410', marginTop: 2 }}>
              {peakPop > 0 ? fmtPop(peakPop) : '—'}
            </div>
          </div>
          <div style={{ width: 1, background: 'rgba(0,0,0,0.1)' }} />
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 9, color: '#9a8a7a', fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase' }}>Active Since</div>
            <div style={{ fontSize: 16, fontWeight: 800, color: '#1a1410', marginTop: 2 }}>
              {earliestYear !== 0 ? formatYear(earliestYear) : '—'}
            </div>
          </div>
          <div style={{ width: 1, background: 'rgba(0,0,0,0.1)' }} />
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 9, color: '#9a8a7a', fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase' }}>Tradition</div>
            <div style={{ fontSize: 14, fontWeight: 800, color: culturalColor, marginTop: 2 }}>
              {culturalLabel}
            </div>
          </div>
          <div style={{ width: 1, background: 'rgba(0,0,0,0.1)' }} />
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 9, color: '#9a8a7a', fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase' }}>Migration Steps</div>
            <div style={{ fontSize: 16, fontWeight: 800, color: '#1a1410', marginTop: 2 }}>
              {migrations.length > 0 ? migrations.length : '—'}
            </div>
          </div>
        </div>

        {/* ── FOOTER ── */}
        <div style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: 64,
          background: 'linear-gradient(135deg, #2a1000 0%, #0a1428 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 28px',
        }}>
          <div>
            <div style={{ color: '#d4af37', fontSize: 12, fontWeight: 700, letterSpacing: '0.06em' }}>
              ✡ jewishdiaspora.app
            </div>
            <div style={{ color: 'rgba(255,255,255,0.45)', fontSize: 9, marginTop: 2 }}>
              62 communities · 3,800 years of recorded migration
            </div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ color: 'rgba(255,255,255,0.55)', fontSize: 9, lineHeight: 1.5 }}>
              Based on historical scholarship
            </div>
            <div style={{ color: 'rgba(255,255,255,0.35)', fontSize: 8 }}>
              Data may represent one of several possible lineages
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
