import { EPOCHS, getEpochForYear } from '../data/epochs';
import { COMMUNITIES } from '../data/communities';
import { WORLD_JEWISH_POP, WORLD_TOTAL_POP } from '../data/worldStats';
import { SNAPSHOT_YEARS } from '../data/types';
import type { SnapshotYear, CulturalType } from '../data/types';

const CULTURAL_COLORS: Record<CulturalType, string> = {
  Ashkenazi: '#4a9eff',
  Sephardic: '#f5a623',
  Mizrahi: '#7ed321',
  Yemenite: '#bd10e0',
  Ethiopian: '#e86c2c',
  Mixed: '#9b9b9b',
};

interface Props {
  currentYear: number;
  onSelectEpoch: (year: SnapshotYear) => void;
}

function getPopulation(community: { populations: Partial<Record<number, number>> }, year: number): number {
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

function formatYear(y: number): string {
  if (y <= 0) return `${Math.abs(y)} BCE`;
  return y < 1000 ? `${y} CE` : `${y}`;
}

function nearestSnapshotYear(midYear: number): SnapshotYear {
  return SNAPSHOT_YEARS.reduce((prev, curr) =>
    Math.abs(curr - midYear) < Math.abs(prev - midYear) ? curr : prev
  );
}

/**
 * Returns the two snapshot years that best represent the start and end of an epoch.
 * - snapA: first snapshot year >= epoch.startYear
 * - snapB: last snapshot year <= epoch.endYear that is after snapA;
 *   if the epoch spans only one snapshot interval, use the next snapshot after snapA.
 */
function getEpochSnapshotYears(epoch: typeof EPOCHS[0]): [SnapshotYear, SnapshotYear] {
  const snapAIdx = SNAPSHOT_YEARS.findIndex(y => y >= epoch.startYear);
  const snapA = SNAPSHOT_YEARS[snapAIdx < 0 ? 0 : snapAIdx];

  // Find the last snapshot year within the epoch that comes AFTER snapA
  let snapBIdx = -1;
  for (let i = SNAPSHOT_YEARS.length - 1; i > snapAIdx; i--) {
    if (SNAPSHOT_YEARS[i] <= epoch.endYear) {
      snapBIdx = i;
      break;
    }
  }
  // If no snapshot falls within the epoch after snapA, use the very next snapshot
  if (snapBIdx === -1) snapBIdx = Math.min(snapAIdx + 1, SNAPSHOT_YEARS.length - 1);

  return [snapA as SnapshotYear, SNAPSHOT_YEARS[snapBIdx] as SnapshotYear];
}

function fmtWorldPop(n: number): string {
  if (n >= 1_000_000) return `~${(n / 1_000_000).toFixed(2)}M`;
  if (n >= 1_000) return `~${Math.round(n / 1000)}k`;
  return `~${n}`;
}

function getTopCommunitiesForEpoch(epoch: typeof EPOCHS[0]): { name: string; pop: number; type: CulturalType }[] {
  const midYear = nearestSnapshotYear(Math.round((epoch.startYear + epoch.endYear) / 2));
  return COMMUNITIES
    .map(c => ({ name: c.name, pop: getPopulation(c, midYear), type: c.culturalType }))
    .filter(c => c.pop > 0)
    .sort((a, b) => b.pop - a.pop)
    .slice(0, 4);
}

export default function ExploreTab({ currentYear, onSelectEpoch }: Props) {
  const activeEpoch = getEpochForYear(currentYear);

  // Collect all unique sources
  const allSources = EPOCHS.flatMap(e => e.sources ?? []);
  const uniqueSources = [...new Set(allSources)];

  return (
    <div style={{ background: '#f5f0e8', flex: 1 }}>
      {/* Header */}
      <div style={{
        background: 'linear-gradient(135deg, #2a1000 0%, #0a1428 100%)',
        color: '#f5f0e8',
        padding: '24px 20px 20px',
      }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: '#e07b39', textTransform: 'uppercase', letterSpacing: '0.15em', marginBottom: 6 }}>
          The Jewish Diaspora
        </div>
        <div style={{ fontSize: 26, fontWeight: 800, lineHeight: 1.15, letterSpacing: '-0.02em', marginBottom: 6 }}>
          2,000 Years of<br />Exile &amp; Return
        </div>
        <div style={{ fontSize: 13, color: 'rgba(245,240,232,0.55)' }}>
          70 CE – 2024 · Nine eras of history
        </div>
      </div>

      {/* Intro blurb */}
      <div style={{ padding: '16px 20px 4px' }}>
        <p style={{ fontSize: 13, color: '#4a3a2a', lineHeight: 1.65, margin: 0 }}>
          The Jewish Diaspora — the dispersion of Jewish communities from the ancient homeland in Judea — is one of history's longest and most consequential migrations. From the destruction of Jerusalem in 70 CE to the founding of Israel in 1948, Jewish communities maintained a living culture, a continuous legal tradition, and an unbroken sense of collective identity across 2,000 years and every continent.
        </p>
      </div>

      {/* Vertical timeline */}
      <div style={{ padding: '20px 20px 0' }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: '#6b5a4a', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 16 }}>
          Nine Eras of History
        </div>

        <div style={{ position: 'relative' }}>
          {/* Vertical connector */}
          <div style={{
            position: 'absolute', left: 11, top: 0, bottom: 0, width: 2,
            background: 'linear-gradient(to bottom, transparent, rgba(0,0,0,0.1) 4%, rgba(0,0,0,0.1) 96%, transparent)',
          }} />

          {EPOCHS.map((epoch, i) => {
            const isActive = epoch.name === activeEpoch.name;
            const targetYear = nearestSnapshotYear(Math.round((epoch.startYear + epoch.endYear) / 2));
            const topCommunities = getTopCommunitiesForEpoch(epoch);
            const [snapA, snapB] = getEpochSnapshotYears(epoch);
            const popA = WORLD_JEWISH_POP[snapA];
            const popB = WORLD_JEWISH_POP[snapB];
            const pctA = (popA / WORLD_TOTAL_POP[snapA]) * 100;
            const pctB = (popB / WORLD_TOTAL_POP[snapB]) * 100;
            const popChange = ((popB - popA) / popA) * 100;

            return (
              <div key={epoch.name} style={{ paddingLeft: 32, paddingBottom: i < EPOCHS.length - 1 ? 28 : 0, position: 'relative' }}>
                {/* Dot */}
                <div style={{
                  position: 'absolute', left: 4, top: 3,
                  width: isActive ? 18 : 14, height: isActive ? 18 : 14,
                  marginLeft: isActive ? -2 : 0,
                  borderRadius: '50%',
                  backgroundColor: epoch.color,
                  boxShadow: isActive ? `0 0 0 4px ${epoch.color}33, 0 0 14px ${epoch.color}66` : '0 1px 3px rgba(0,0,0,0.15)',
                  zIndex: 1,
                }} />

                {/* Card */}
                <div style={{
                  background: isActive ? '#fff' : 'rgba(255,255,255,0.65)',
                  borderRadius: 14,
                  padding: '14px 16px',
                  border: `1px solid ${isActive ? epoch.color + '55' : 'rgba(0,0,0,0.06)'}`,
                  boxShadow: isActive ? `0 3px 20px ${epoch.color}22` : '0 1px 4px rgba(0,0,0,0.06)',
                }}>
                  {/* Title row */}
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 8, marginBottom: 6 }}>
                    <div>
                      <div style={{ fontSize: 15, fontWeight: 700, color: isActive ? epoch.color : '#1a1410', lineHeight: 1.2 }}>
                        {epoch.name}
                      </div>
                      <div style={{ fontSize: 11, color: '#9a8a7a', marginTop: 2 }}>
                        {formatYear(epoch.startYear)} – {epoch.endYear}
                      </div>
                    </div>
                    <button
                      onClick={() => onSelectEpoch(targetYear)}
                      style={{
                        flexShrink: 0, padding: '4px 10px',
                        borderRadius: 20, border: `1px solid ${epoch.color}55`,
                        background: epoch.color + '14', color: epoch.color,
                        fontSize: 10, fontWeight: 700, cursor: 'pointer',
                        letterSpacing: '0.04em', textTransform: 'uppercase',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      View map
                    </button>
                  </div>

                  {/* Population stat boxes */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                    {/* Start snapshot */}
                    <div style={{
                      flex: 1, background: epoch.color + '0f', borderRadius: 10,
                      padding: '8px 10px', border: `1px solid ${epoch.color}22`,
                    }}>
                      <div style={{ fontSize: 10, fontWeight: 700, color: '#9a8a7a', marginBottom: 2 }}>
                        {formatYear(snapA)}
                      </div>
                      <div style={{ fontSize: 16, fontWeight: 800, color: epoch.color, lineHeight: 1.1 }}>
                        {fmtWorldPop(popA)}
                      </div>
                      <div style={{ fontSize: 10, color: '#6b5a4a', marginTop: 2 }}>
                        {pctA.toFixed(2)}% of world
                      </div>
                    </div>

                    {/* Change indicator */}
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flexShrink: 0 }}>
                      <svg width="12" height="12" viewBox="0 0 12 12" fill="none"
                        style={{ transform: popChange >= 0 ? 'rotate(180deg)' : undefined }}>
                        <path d="M6 10L1 4h10L6 10z"
                          fill={popChange >= 0 ? '#27ae60' : '#e74c3c'} />
                      </svg>
                      <div style={{
                        fontSize: 11, fontWeight: 700, marginTop: 2,
                        color: popChange >= 0 ? '#27ae60' : '#e74c3c',
                      }}>
                        {popChange >= 0 ? '+' : ''}{popChange.toFixed(0)}%
                      </div>
                    </div>

                    {/* End snapshot */}
                    <div style={{
                      flex: 1, background: epoch.color + '0f', borderRadius: 10,
                      padding: '8px 10px', border: `1px solid ${epoch.color}22`,
                    }}>
                      <div style={{ fontSize: 10, fontWeight: 700, color: '#9a8a7a', marginBottom: 2 }}>
                        {formatYear(snapB)}
                      </div>
                      <div style={{ fontSize: 16, fontWeight: 800, color: epoch.color, lineHeight: 1.1 }}>
                        {fmtWorldPop(popB)}
                      </div>
                      <div style={{ fontSize: 10, color: '#6b5a4a', marginTop: 2 }}>
                        {pctB.toFixed(2)}% of world
                      </div>
                    </div>
                  </div>

                  {/* Description */}
                  <p style={{ fontSize: 13, color: '#2a1a0a', lineHeight: 1.6, margin: '0 0 12px' }}>
                    {epoch.longDescription ?? epoch.description}
                  </p>

                  {/* Key events */}
                  {epoch.keyEvents && epoch.keyEvents.length > 0 && (
                    <div style={{ marginBottom: 12 }}>
                      <div style={{ fontSize: 10, fontWeight: 700, color: '#9a8a7a', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 7 }}>
                        Key Events
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
                        {epoch.keyEvents.map((ev) => (
                          <div key={ev.year} style={{ display: 'flex', gap: 8, alignItems: 'flex-start' }}>
                            <span style={{
                              flexShrink: 0, fontSize: 10, fontWeight: 700,
                              color: epoch.color,
                              background: epoch.color + '14',
                              borderRadius: 4, padding: '1px 6px',
                              minWidth: 44, textAlign: 'center',
                            }}>
                              {formatYear(ev.year)}
                            </span>
                            <span style={{ fontSize: 12, color: '#3a2a1a', lineHeight: 1.5 }}>
                              {ev.label}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Top communities for this epoch */}
                  {topCommunities.length > 0 && (
                    <div>
                      <div style={{ fontSize: 10, fontWeight: 700, color: '#9a8a7a', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 6 }}>
                        Major Communities
                      </div>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>
                        {topCommunities.map(c => (
                          <div key={c.name} style={{ display: 'flex', alignItems: 'center', gap: 4, background: 'rgba(0,0,0,0.04)', borderRadius: 20, padding: '3px 8px' }}>
                            <div style={{ width: 7, height: 7, borderRadius: '50%', backgroundColor: CULTURAL_COLORS[c.type], flexShrink: 0 }} />
                            <span style={{ fontSize: 11, color: '#2a1a0a' }}>{c.name}</span>
                            <span style={{ fontSize: 10, color: '#9a8a7a' }}>{fmt(c.pop)}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Legend */}
      <div style={{ padding: '28px 20px 8px' }}>
        <div style={{ background: 'rgba(255,255,255,0.7)', borderRadius: 16, padding: '16px', border: '1px solid rgba(0,0,0,0.06)' }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: '#6b5a4a', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 10 }}>
            Cultural Traditions
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px 16px', marginBottom: 14 }}>
            {(Object.entries(CULTURAL_COLORS) as [CulturalType, string][]).map(([type, color]) => (
              <div key={type} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <div style={{ width: 10, height: 10, borderRadius: '50%', backgroundColor: color, flexShrink: 0 }} />
                <span style={{ fontSize: 12, color: '#2a1a0a' }}>{type}</span>
              </div>
            ))}
          </div>
          <div style={{ fontSize: 11, fontWeight: 700, color: '#6b5a4a', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 8 }}>
            Migration Types
          </div>
          <div style={{ display: 'flex', gap: 20 }}>
            {[['#ff4444', 'Forced', 'Expulsions, persecution, flight'], ['#44aaff', 'Voluntary', 'Trade, opportunity, religious pilgrimage']] .map(([color, label, sub]) => (
              <div key={label} style={{ display: 'flex', alignItems: 'flex-start', gap: 7 }}>
                <div style={{ width: 18, height: 2, backgroundColor: color, marginTop: 7, flexShrink: 0, borderRadius: 1 }} />
                <div>
                  <div style={{ fontSize: 12, fontWeight: 600, color: '#1a1410' }}>{label}</div>
                  <div style={{ fontSize: 10, color: '#9a8a7a', marginTop: 1 }}>{sub}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Sources */}
      <div style={{ padding: '8px 20px 32px' }}>
        <div style={{ background: 'rgba(255,255,255,0.7)', borderRadius: 16, padding: '16px', border: '1px solid rgba(0,0,0,0.06)' }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: '#6b5a4a', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 10 }}>
            Sources &amp; Further Reading
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
            {uniqueSources.map((source, i) => (
              <div key={i} style={{ fontSize: 11, color: '#4a3a2a', lineHeight: 1.5 }}>
                · {source}
              </div>
            ))}
            <div style={{ fontSize: 11, color: '#9a8a7a', marginTop: 6, lineHeight: 1.5 }}>
              Population estimates: DellaPergola, Sergio. "World Jewish Population." <em>American Jewish Year Book</em>, 2020. Community data is illustrative; absolute figures carry historical uncertainty.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
