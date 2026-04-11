import { useEffect, useState } from 'react';
import type { RefObject } from 'react';
import type { DualLineageResult } from '../utils/lineageAlgorithm';
import { getPeakPopulation, getEarliestYear, formatYear, fmtPop } from '../utils/lineageAlgorithm';
import type { CulturalType, Migration } from '../data/types';
import type { LineageResult } from '../utils/lineageAlgorithm';

interface DualProps {
  lineage: DualLineageResult;
  posterRef: React.RefObject<HTMLDivElement>;
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

interface MiniProps {
  path: LineageResult['path'];
  migrations: Migration[];
  width?: number;
  height?: number;
}

function MiniMigrationPathSvg({ path, migrations, width = 380, height = 160 }: MiniProps) {
  if (path.length <= 1) return null;

  const SVG_W = width;
  const SVG_H = height;
  const PAD_X = 36;
  const NODE_Y = Math.round(SVG_H * 0.62);
  const NODE_R = 12;

  // Max 4 nodes
  type DisplayNode = { community: typeof path[0]; ellipsis?: false } | { ellipsis: true };

  let displayItems: DisplayNode[];
  let migrationSlots: (Migration | null)[];

  if (path.length <= 4) {
    displayItems = path.map(c => ({ community: c }));
    migrationSlots = migrations.slice(0, path.length - 1);
  } else {
    displayItems = [
      { community: path[0] },
      { community: path[1] },
      { ellipsis: true },
      { community: path[path.length - 1] },
    ];
    migrationSlots = [
      migrations[0],
      null,
      migrations[migrations.length - 1],
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
      {/* Draw arcs */}
      {displayItems.slice(0, -1).map((item, i) => {
        const migration = migrationSlots[i];
        if (!migration || item.ellipsis || displayItems[i + 1].ellipsis) return null;
        const x1 = xs[i];
        const x2 = xs[i + 1];
        const midX = (x1 + x2) / 2;
        const arcHeight = Math.min(32, (x2 - x1) * 0.22);
        const cy = NODE_Y - arcHeight;
        const color = migration.type === 'forced' ? '#ff4d4d' : '#44aaff';
        return (
          <g key={i}>
            <path
              d={`M ${x1} ${NODE_Y} Q ${midX} ${cy} ${x2} ${NODE_Y}`}
              fill="none"
              stroke={color}
              strokeWidth={2}
              strokeDasharray={migration.type === 'forced' ? '5 2.5' : 'none'}
              opacity={0.75}
            />
            <polygon
              points={`${x2 - 8},${NODE_Y - 4} ${x2},${NODE_Y} ${x2 - 8},${NODE_Y + 4}`}
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
                y={NODE_Y + 4}
                textAnchor="middle"
                fontSize={16}
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
        const displayName = shortName.length > 11 ? shortName.slice(0, 10) + '…' : shortName;

        return (
          <g key={i}>
            <circle cx={x} cy={NODE_Y} r={NODE_R + 2} fill="rgba(0,0,0,0.06)" />
            <circle cx={x} cy={NODE_Y} r={NODE_R} fill={color} stroke="white" strokeWidth={2} />
            <text
              x={x}
              y={NODE_Y + NODE_R + 12}
              textAnchor="middle"
              fontSize={9}
              fontWeight="600"
              fill="#1a1410"
              fontFamily="system-ui"
            >
              {displayName}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

export default function DualPosterDisplay({ lineage, posterRef }: DualProps) {
  const { lineage1, lineage2, combinedEpochs } = lineage;
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handler = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handler);
    return () => window.removeEventListener('resize', handler);
  }, []);

  const POSTER_W = 800;
  const POSTER_H = 1200;
  const scale = Math.min(1, (windowWidth - 24) / POSTER_W);

  const color1 = CULTURAL_COLORS[lineage1.primaryCulturalType];
  const color2 = CULTURAL_COLORS[lineage2.primaryCulturalType];
  const label1 = CULTURAL_LABELS[lineage1.primaryCulturalType];
  const label2 = CULTURAL_LABELS[lineage2.primaryCulturalType];

  const peakPop1 = getPeakPopulation(lineage1.destination);
  const peakPop2 = getPeakPopulation(lineage2.destination);
  const earliestYear1 = getEarliestYear(lineage1.destination);
  const earliestYear2 = getEarliestYear(lineage2.destination);

  return (
    <div
      style={{
        transformOrigin: 'top center',
        transform: `scale(${scale})`,
        marginBottom: scale < 1 ? `${(POSTER_H * scale - POSTER_H)}px` : 0,
      }}
    >
      <div
        ref={posterRef as RefObject<HTMLDivElement>}
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
        {/* ── HEADER (130px) ── */}
        <div
          style={{
            background: 'linear-gradient(135deg, #2a1000 0%, #0a1428 100%)',
            padding: '18px 30px 16px',
            height: 130,
            boxSizing: 'border-box',
            position: 'relative',
          }}
        >
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

          <div style={{ textAlign: 'center', marginTop: 8 }}>
            <div style={{
              color: 'white',
              fontSize: 24,
              fontWeight: 700,
              letterSpacing: '-0.01em',
              lineHeight: 1.2,
            }}>
              MIXED HERITAGE LINEAGE
            </div>
            <div style={{
              marginTop: 7,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 10,
            }}>
              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
                background: 'rgba(255,255,255,0.10)',
                borderRadius: 20,
                padding: '3px 12px',
              }}>
                <span style={{
                  width: 8,
                  height: 8,
                  borderRadius: '50%',
                  background: color1,
                  display: 'inline-block',
                  flexShrink: 0,
                }} />
                <span style={{ color: color1, fontSize: 11, fontWeight: 600, letterSpacing: '0.06em' }}>
                  {label1}
                </span>
              </div>
              <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: 12 }}>×</span>
              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
                background: 'rgba(255,255,255,0.10)',
                borderRadius: 20,
                padding: '3px 12px',
              }}>
                <span style={{
                  width: 8,
                  height: 8,
                  borderRadius: '50%',
                  background: color2,
                  display: 'inline-block',
                  flexShrink: 0,
                }} />
                <span style={{ color: color2, fontSize: 11, fontWeight: 600, letterSpacing: '0.06em' }}>
                  {label2}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* ── TWO-COLUMN SECTION (280px) ── */}
        <div style={{
          display: 'flex',
          height: 280,
          background: '#fdfaf5',
          borderBottom: '1px solid rgba(0,0,0,0.08)',
        }}>
          {/* Left column — Lineage 1 */}
          <div style={{
            flex: 1,
            borderRight: '1px solid rgba(0,0,0,0.08)',
            padding: '14px 10px 10px',
            display: 'flex',
            flexDirection: 'column',
          }}>
            <div style={{
              fontSize: 9,
              fontWeight: 700,
              letterSpacing: '0.18em',
              textTransform: 'uppercase',
              color: '#9a8a7a',
              marginBottom: 2,
            }}>
              Lineage 1
            </div>
            <div style={{
              fontSize: 14,
              fontWeight: 800,
              color: '#1a1410',
              lineHeight: 1.2,
              marginBottom: 4,
            }}>
              {lineage1.destination.name.replace(/\s*\(.*?\)\s*/g, '').trim()}
            </div>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 5,
              marginBottom: 8,
            }}>
              <span style={{
                width: 7,
                height: 7,
                borderRadius: '50%',
                background: color1,
                display: 'inline-block',
                flexShrink: 0,
              }} />
              <span style={{ fontSize: 10, color: color1, fontWeight: 600 }}>{label1} Tradition</span>
            </div>
            {lineage1.path.length > 1 ? (
              <div style={{ flex: 1, display: 'flex', alignItems: 'center', overflow: 'hidden' }}>
                <MiniMigrationPathSvg
                  path={lineage1.path}
                  migrations={lineage1.migrations}
                  width={380}
                  height={160}
                />
              </div>
            ) : (
              <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{ fontSize: 11, color: '#9a8a7a', fontStyle: 'italic', textAlign: 'center' }}>
                  No migration path recorded
                </div>
              </div>
            )}
          </div>

          {/* Right column — Lineage 2 */}
          <div style={{
            flex: 1,
            padding: '14px 10px 10px',
            display: 'flex',
            flexDirection: 'column',
          }}>
            <div style={{
              fontSize: 9,
              fontWeight: 700,
              letterSpacing: '0.18em',
              textTransform: 'uppercase',
              color: '#9a8a7a',
              marginBottom: 2,
            }}>
              Lineage 2
            </div>
            <div style={{
              fontSize: 14,
              fontWeight: 800,
              color: '#1a1410',
              lineHeight: 1.2,
              marginBottom: 4,
            }}>
              {lineage2.destination.name.replace(/\s*\(.*?\)\s*/g, '').trim()}
            </div>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 5,
              marginBottom: 8,
            }}>
              <span style={{
                width: 7,
                height: 7,
                borderRadius: '50%',
                background: color2,
                display: 'inline-block',
                flexShrink: 0,
              }} />
              <span style={{ fontSize: 10, color: color2, fontWeight: 600 }}>{label2} Tradition</span>
            </div>
            {lineage2.path.length > 1 ? (
              <div style={{ flex: 1, display: 'flex', alignItems: 'center', overflow: 'hidden' }}>
                <MiniMigrationPathSvg
                  path={lineage2.path}
                  migrations={lineage2.migrations}
                  width={380}
                  height={160}
                />
              </div>
            ) : (
              <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{ fontSize: 11, color: '#9a8a7a', fontStyle: 'italic', textAlign: 'center' }}>
                  No migration path recorded
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ── SHARED EPOCH TIMELINE (450px) ── */}
        <div style={{ padding: '14px 28px 0', height: 450, boxSizing: 'border-box', overflow: 'hidden' }}>
          <div style={{
            fontSize: 9,
            fontWeight: 700,
            letterSpacing: '0.18em',
            textTransform: 'uppercase',
            color: '#9a8a7a',
            marginBottom: 10,
          }}>
            Shared Historical Epochs
          </div>

          {combinedEpochs.length === 0 && (
            <div style={{ fontSize: 12, color: '#9a8a7a', fontStyle: 'italic' }}>
              No epoch data available.
            </div>
          )}

          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {combinedEpochs.map((epoch, i) => {
              // Find the most relevant key event across both lineages
              const allMigrations = [...lineage1.migrations, ...lineage2.migrations];
              const relevantMig = allMigrations.find(
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
                    padding: '8px 12px',
                    background: 'white',
                    borderRadius: 8,
                    borderLeft: `4px solid ${epoch.color}`,
                  }}
                >
                  <div style={{ flexShrink: 0, paddingTop: 1 }}>
                    <div style={{
                      width: 8,
                      height: 8,
                      borderRadius: '50%',
                      background: epoch.color,
                      marginTop: 3,
                    }} />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, flexWrap: 'wrap' }}>
                      <span style={{ fontSize: 11, fontWeight: 700, color: '#1a1410' }}>{epoch.name}</span>
                      <span style={{ fontSize: 9, color: '#9a8a7a', whiteSpace: 'nowrap' }}>
                        {formatYear(epoch.startYear)} – {formatYear(epoch.endYear)}
                      </span>
                    </div>
                    <div style={{ fontSize: 10, color: '#555', marginTop: 2, lineHeight: 1.45 }}>
                      {epoch.description}
                    </div>
                    {bestEvent && (
                      <div style={{
                        marginTop: 3,
                        fontSize: 9,
                        color: '#7a6a5a',
                        fontStyle: 'italic',
                        lineHeight: 1.4,
                      }}>
                        {formatYear(bestEvent.year)}: {bestEvent.label.length > 100
                          ? bestEvent.label.slice(0, 97) + '…'
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
            <div style={{ fontSize: 8, color: '#9a8a7a', fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase' }}>
              {lineage1.destination.name.replace(/\s*\(.*?\)\s*/g, '').trim()} Peak
            </div>
            <div style={{ fontSize: 15, fontWeight: 800, color: '#1a1410', marginTop: 2 }}>
              {peakPop1 > 0 ? fmtPop(peakPop1) : '—'}
            </div>
          </div>
          <div style={{ width: 1, background: 'rgba(0,0,0,0.1)' }} />
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 8, color: '#9a8a7a', fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase' }}>
              {lineage1.destination.name.replace(/\s*\(.*?\)\s*/g, '').trim()} Since
            </div>
            <div style={{ fontSize: 15, fontWeight: 800, color: '#1a1410', marginTop: 2 }}>
              {earliestYear1 !== 0 ? formatYear(earliestYear1) : '—'}
            </div>
          </div>
          <div style={{ width: 1, background: 'rgba(0,0,0,0.1)' }} />
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 8, color: '#9a8a7a', fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase' }}>
              {lineage2.destination.name.replace(/\s*\(.*?\)\s*/g, '').trim()} Peak
            </div>
            <div style={{ fontSize: 15, fontWeight: 800, color: '#1a1410', marginTop: 2 }}>
              {peakPop2 > 0 ? fmtPop(peakPop2) : '—'}
            </div>
          </div>
          <div style={{ width: 1, background: 'rgba(0,0,0,0.1)' }} />
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 8, color: '#9a8a7a', fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase' }}>
              {lineage2.destination.name.replace(/\s*\(.*?\)\s*/g, '').trim()} Since
            </div>
            <div style={{ fontSize: 15, fontWeight: 800, color: '#1a1410', marginTop: 2 }}>
              {earliestYear2 !== 0 ? formatYear(earliestYear2) : '—'}
            </div>
          </div>
        </div>

        {/* ── FOOTER (64px) ── */}
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
