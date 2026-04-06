import { EPOCHS, getEpochForYear } from '../data/epochs';
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

function formatYear(y: number): string {
  if (y <= 0) return `${Math.abs(y)} BCE`;
  return y < 1000 ? `${y} CE` : `${y}`;
}

function epochDateRange(epoch: (typeof EPOCHS)[0]): string {
  return `${formatYear(epoch.startYear)} – ${formatYear(epoch.endYear)}`;
}

function nearestSnapshotYear(midYear: number): SnapshotYear {
  return SNAPSHOT_YEARS.reduce((prev, curr) =>
    Math.abs(curr - midYear) < Math.abs(prev - midYear) ? curr : prev
  );
}

export default function ExploreTab({ currentYear, onSelectEpoch }: Props) {
  const activeEpoch = getEpochForYear(currentYear);

  return (
    <div
      style={{ background: '#f5f0e8', flex: 1, overflowY: 'auto', WebkitOverflowScrolling: 'touch' }}
    >
      {/* Header */}
      <div className="px-4 pt-5 pb-3">
        <div
          className="text-xs font-bold tracking-widest uppercase mb-1"
          style={{ color: '#c0392b' }}
        >
          The Jewish Diaspora
        </div>
        <div className="text-2xl font-bold" style={{ color: '#1a1a1a' }}>
          2,000 Years of History
        </div>
        <div className="text-sm mt-1" style={{ color: '#6b6b6b' }}>
          70 CE – 2024 · Scroll to explore every era
        </div>
      </div>

      {/* Navigate by Era pills */}
      <div className="px-4 pb-4">
        <div
          className="rounded-2xl p-4"
          style={{ background: 'rgba(255,255,255,0.7)', border: '1px solid rgba(0,0,0,0.07)' }}
        >
          <div
            className="text-xs font-bold tracking-widest uppercase mb-3"
            style={{ color: '#555' }}
          >
            Navigate by Era
          </div>
          <div className="flex flex-wrap gap-2">
            {EPOCHS.map((epoch) => {
              const isActive = epoch.name === activeEpoch.name;
              const midYear = Math.round((epoch.startYear + epoch.endYear) / 2);
              const targetYear = nearestSnapshotYear(midYear);
              return (
                <button
                  key={epoch.name}
                  onClick={() => onSelectEpoch(targetYear)}
                  className="text-xs px-3 py-1.5 rounded-full font-medium transition-all"
                  style={{
                    backgroundColor: isActive ? epoch.color : epoch.color + '18',
                    color: isActive ? '#fff' : epoch.color,
                    border: `1px solid ${epoch.color}${isActive ? 'ff' : '44'}`,
                    boxShadow: isActive ? `0 2px 8px ${epoch.color}55` : 'none',
                  }}
                >
                  {epoch.name}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Vertical timeline */}
      <div className="px-4 pb-2">
        <div
          className="text-xs font-bold tracking-widest uppercase mb-4"
          style={{ color: '#555' }}
        >
          Timeline
        </div>

        <div className="relative">
          {/* Vertical line */}
          <div
            className="absolute top-0 bottom-0"
            style={{ left: 11, width: 2, background: 'rgba(0,0,0,0.1)' }}
          />

          <div className="flex flex-col gap-0">
            {EPOCHS.map((epoch, i) => {
              const isActive = epoch.name === activeEpoch.name;
              const midYear = Math.round((epoch.startYear + epoch.endYear) / 2);
              const targetYear = nearestSnapshotYear(midYear);
              const isLast = i === EPOCHS.length - 1;

              return (
                <div key={epoch.name} className={isLast ? 'pb-0' : 'pb-6'}>
                  <div className="flex gap-4">
                    {/* Dot */}
                    <div className="flex-shrink-0 flex flex-col items-center" style={{ width: 24 }}>
                      <div
                        className="rounded-full transition-all"
                        style={{
                          width: isActive ? 22 : 16,
                          height: isActive ? 22 : 16,
                          backgroundColor: epoch.color,
                          border: `3px solid ${isActive ? epoch.color : '#f5f0e8'}`,
                          boxShadow: isActive ? `0 0 0 3px ${epoch.color}44` : 'none',
                          marginTop: 2,
                          marginLeft: isActive ? -3 : 0,
                        }}
                      />
                    </div>

                    {/* Card */}
                    <div
                      className="flex-1 rounded-2xl p-4 transition-all"
                      style={{
                        background: isActive
                          ? `${epoch.color}12`
                          : 'rgba(255,255,255,0.65)',
                        border: `1px solid ${isActive ? epoch.color + '44' : 'rgba(0,0,0,0.06)'}`,
                        boxShadow: isActive ? `0 2px 16px ${epoch.color}22` : 'none',
                      }}
                    >
                      {/* Epoch name + date */}
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <div
                          className="text-base font-bold leading-tight"
                          style={{ color: isActive ? epoch.color : '#1a1a1a' }}
                        >
                          {epoch.name}
                        </div>
                        <button
                          onClick={() => onSelectEpoch(targetYear)}
                          className="flex-shrink-0 text-xs px-2 py-0.5 rounded-full font-medium"
                          style={{
                            backgroundColor: epoch.color + '20',
                            color: epoch.color,
                            border: `1px solid ${epoch.color}44`,
                          }}
                        >
                          View on map
                        </button>
                      </div>

                      <div className="text-xs font-semibold mb-2" style={{ color: '#888' }}>
                        {epochDateRange(epoch)}
                      </div>

                      {/* Long description */}
                      <p className="text-sm leading-relaxed mb-3" style={{ color: '#333' }}>
                        {epoch.longDescription ?? epoch.description}
                      </p>

                      {/* Key events */}
                      {epoch.keyEvents && epoch.keyEvents.length > 0 && (
                        <div className="flex flex-col gap-1.5">
                          {epoch.keyEvents.map((ev) => (
                            <div key={ev.year} className="flex items-start gap-2">
                              <div
                                className="flex-shrink-0 text-xs font-bold tabular-nums mt-0.5 px-1.5 py-0.5 rounded"
                                style={{
                                  background: epoch.color + '20',
                                  color: epoch.color,
                                  minWidth: 44,
                                  textAlign: 'center',
                                }}
                              >
                                {formatYear(ev.year)}
                              </div>
                              <div className="text-xs leading-relaxed" style={{ color: '#444' }}>
                                {ev.label}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Cultural Tradition legend */}
      <div className="px-4 pb-4 mt-2">
        <div
          className="rounded-2xl p-4"
          style={{ background: 'rgba(255,255,255,0.7)', border: '1px solid rgba(0,0,0,0.07)' }}
        >
          <div
            className="text-xs font-bold tracking-widest uppercase mb-3"
            style={{ color: '#555' }}
          >
            Cultural Tradition
          </div>
          <div className="flex flex-wrap gap-x-4 gap-y-2">
            {(Object.entries(CULTURAL_COLORS) as [CulturalType, string][]).map(([type, color]) => (
              <div key={type} className="flex items-center gap-2">
                <div
                  className="w-3 h-3 rounded-full flex-shrink-0"
                  style={{ backgroundColor: color }}
                />
                <span className="text-sm" style={{ color: '#333' }}>
                  {type}
                </span>
              </div>
            ))}
          </div>

          <div
            className="mt-3 pt-3"
            style={{ borderTop: '1px solid rgba(0,0,0,0.07)' }}
          >
            <div
              className="text-xs font-bold tracking-widest uppercase mb-3"
              style={{ color: '#555' }}
            >
              Migration Type
            </div>
            <div className="flex gap-6">
              <div className="flex items-center gap-2">
                <div className="w-8 h-0.5 rounded" style={{ background: '#ff4444' }} />
                <span className="text-sm" style={{ color: '#333' }}>
                  Forced migration
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-8 h-0.5 rounded" style={{ background: '#44aaff' }} />
                <span className="text-sm" style={{ color: '#333' }}>
                  Voluntary
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Sources */}
      <div className="px-4 pb-8">
        <div className="text-xs" style={{ color: '#999' }}>
          * Population estimates from DellaPergola (2001) and supplementary sources. Community data is
          illustrative and not exhaustive.
        </div>
      </div>
    </div>
  );
}
