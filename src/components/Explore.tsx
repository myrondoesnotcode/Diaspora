import { EPOCHS } from '../data/epochs';
import { SNAPSHOT_YEARS } from '../data/types';
import type { SnapshotYear } from '../data/types';

interface Props {
  onViewMap: (year: SnapshotYear) => void;
}

function nearestSnapshotYear(target: number): SnapshotYear {
  return SNAPSHOT_YEARS.reduce((prev, curr) =>
    Math.abs(curr - target) < Math.abs(prev - target) ? curr : prev
  );
}

function formatYearRange(start: number, end: number): string {
  const fmt = (y: number) => (y < 1000 ? `${y} CE` : `${y}`);
  return `${fmt(start)} – ${fmt(end)}`;
}

export default function Explore({ onViewMap }: Props) {
  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        display: 'flex',
        flexDirection: 'column',
        overflowY: 'auto',
        background: '#f5f2ee',
        WebkitOverflowScrolling: 'touch',
      }}
    >
      {/* Hero header */}
      <div
        style={{
          background: 'linear-gradient(160deg, #0d1b3e 0%, #1a2744 60%, #0a1628 100%)',
          padding: '48px 24px 36px',
          flexShrink: 0,
        }}
      >
        <div
          style={{
            fontSize: 11,
            fontWeight: 700,
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            color: '#f5a623',
            marginBottom: 12,
          }}
        >
          The Jewish Diaspora
        </div>
        <h1
          style={{
            margin: '0 0 10px',
            fontSize: 32,
            fontWeight: 800,
            lineHeight: 1.15,
            color: '#ffffff',
            letterSpacing: '-0.02em',
          }}
        >
          2,000 Years of<br />Exile &amp; Return
        </h1>
        <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.5)', marginBottom: 0 }}>
          70 CE – 2024 · Nine eras of history
        </div>
      </div>

      {/* Intro text */}
      <div style={{ padding: '28px 24px 8px', flexShrink: 0 }}>
        <p
          style={{
            margin: 0,
            fontSize: 15,
            lineHeight: 1.7,
            color: '#2d2d2d',
          }}
        >
          The Jewish Diaspora — the dispersion of Jewish communities from the ancient homeland in
          Judea — is one of history's longest and most consequential migrations. From the
          destruction of Jerusalem in 70 CE to the founding of Israel in 1948, Jewish communities
          maintained a living culture, a continuous legal tradition, and an unbroken sense of
          collective identity across 2,000 years and every continent.
        </p>
      </div>

      {/* Epoch list */}
      <div style={{ padding: '24px 24px 120px', flexShrink: 0 }}>
        <div
          style={{
            fontSize: 11,
            fontWeight: 700,
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            color: '#999',
            marginBottom: 16,
          }}
        >
          Nine Eras of History
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {EPOCHS.map((epoch) => {
            const targetYear = nearestSnapshotYear(epoch.startYear);

            return (
              <div
                key={epoch.name}
                style={{
                  display: 'flex',
                  gap: 14,
                  alignItems: 'flex-start',
                }}
              >
                {/* Color dot */}
                <div
                  style={{
                    width: 12,
                    height: 12,
                    borderRadius: '50%',
                    backgroundColor: epoch.color,
                    flexShrink: 0,
                    marginTop: 18,
                    boxShadow: `0 0 6px ${epoch.color}88`,
                  }}
                />

                {/* Card */}
                <div
                  style={{
                    flex: 1,
                    background: '#ffffff',
                    borderRadius: 14,
                    padding: '16px 16px 18px',
                    boxShadow: '0 1px 4px rgba(0,0,0,0.08)',
                    border: '1px solid rgba(0,0,0,0.06)',
                  }}
                >
                  {/* Card header row */}
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'flex-start',
                      marginBottom: 4,
                      gap: 8,
                    }}
                  >
                    <div>
                      <div
                        style={{
                          fontSize: 15,
                          fontWeight: 700,
                          color: epoch.color,
                          lineHeight: 1.3,
                        }}
                      >
                        {epoch.name}
                      </div>
                      <div
                        style={{
                          fontSize: 12,
                          color: '#999',
                          marginTop: 2,
                        }}
                      >
                        {formatYearRange(epoch.startYear, epoch.endYear)}
                      </div>
                    </div>

                    <button
                      onClick={() => onViewMap(targetYear)}
                      style={{
                        flexShrink: 0,
                        fontSize: 11,
                        fontWeight: 700,
                        letterSpacing: '0.06em',
                        textTransform: 'uppercase',
                        color: epoch.color,
                        background: 'transparent',
                        border: `1.5px solid ${epoch.color}`,
                        borderRadius: 20,
                        padding: '5px 11px',
                        cursor: 'pointer',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      View Map
                    </button>
                  </div>

                  {/* Long description */}
                  <p
                    style={{
                      margin: '10px 0 0',
                      fontSize: 14,
                      lineHeight: 1.65,
                      color: '#444',
                    }}
                  >
                    {epoch.longDescription}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
