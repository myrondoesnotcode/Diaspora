import { useCallback } from 'react';
import { EPOCHS, getEpochForYear, getEpochIndex } from '../data/epochs';
import { SNAPSHOT_YEARS } from '../data/types';
import type { SnapshotYear } from '../data/types';

interface Props {
  currentYear: SnapshotYear;
  isPlaying: boolean;
  onYearChange: (year: SnapshotYear) => void;
  onPlayPause: () => void;
  totalPopulation: number;
  activeMigrations: number;
}

function formatYear(y: number): string {
  return y < 1000 ? `${y} CE` : `${y}`;
}

function fmt(n: number): string {
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1) + 'M';
  if (n >= 1_000) return Math.round(n / 1000) + 'k';
  return n.toString();
}

function nearestSnapshotYear(year: number): SnapshotYear {
  return SNAPSHOT_YEARS.reduce((prev, curr) =>
    Math.abs(curr - year) < Math.abs(prev - year) ? curr : prev
  );
}

export default function MapOverlay({
  currentYear,
  isPlaying,
  onYearChange,
  onPlayPause,
  totalPopulation,
  activeMigrations,
}: Props) {
  const epoch = getEpochForYear(currentYear);
  const epochIdx = getEpochIndex(epoch);
  const yearIndex = SNAPSHOT_YEARS.indexOf(currentYear);
  const progress = (yearIndex / (SNAPSHOT_YEARS.length - 1)) * 100;

  const goPrevEpoch = useCallback(() => {
    if (epochIdx <= 0) return;
    const prev = EPOCHS[epochIdx - 1];
    onYearChange(nearestSnapshotYear(prev.startYear));
  }, [epochIdx, onYearChange]);

  const goNextEpoch = useCallback(() => {
    if (epochIdx >= EPOCHS.length - 1) return;
    const next = EPOCHS[epochIdx + 1];
    onYearChange(nearestSnapshotYear(next.startYear));
  }, [epochIdx, onYearChange]);

  const handleSlider = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      onYearChange(SNAPSHOT_YEARS[parseInt(e.target.value, 10)]);
    },
    [onYearChange]
  );

  return (
    <div style={{
      position: 'absolute', bottom: 0, left: 0, right: 0,
      background: 'rgba(245,240,232,0.96)',
      backdropFilter: 'blur(12px)',
      borderTop: '1px solid rgba(0,0,0,0.08)',
      padding: '10px 16px 14px',
    }}>
      {/* Top row: play, epoch nav, year, stats */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>

        {/* Play/Pause */}
        <button
          onClick={onPlayPause}
          style={{
            flexShrink: 0, width: 34, height: 34, borderRadius: '50%',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            background: epoch.color, border: 'none', cursor: 'pointer',
            boxShadow: `0 2px 10px ${epoch.color}66`,
          }}
          aria-label={isPlaying ? 'Pause' : 'Play'}
        >
          {isPlaying ? (
            <svg width="12" height="12" viewBox="0 0 12 12" fill="white">
              <rect x="1" y="0" width="3.5" height="12" rx="1" />
              <rect x="7.5" y="0" width="3.5" height="12" rx="1" />
            </svg>
          ) : (
            <svg width="12" height="12" viewBox="0 0 12 12" fill="white">
              <polygon points="1,0 12,6 1,12" />
            </svg>
          )}
        </button>

        {/* Epoch navigation */}
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 6, minWidth: 0 }}>
          <button
            onClick={goPrevEpoch}
            disabled={epochIdx === 0}
            style={{
              flexShrink: 0, width: 24, height: 24, borderRadius: 6,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              background: epochIdx === 0 ? 'rgba(0,0,0,0.05)' : epoch.color + '18',
              border: `1px solid ${epochIdx === 0 ? 'rgba(0,0,0,0.08)' : epoch.color + '44'}`,
              cursor: epochIdx === 0 ? 'default' : 'pointer',
              color: epochIdx === 0 ? '#ccc' : epoch.color,
              fontSize: 13, fontWeight: 700,
            }}
          >‹</button>

          <div style={{ flex: 1, textAlign: 'center', minWidth: 0 }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: epoch.color, lineHeight: 1.2, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {epoch.name}
            </div>
            <div style={{ fontSize: 10, color: '#9a8a7a', lineHeight: 1 }}>
              {formatYear(epoch.startYear)} – {epoch.endYear}
            </div>
          </div>

          <button
            onClick={goNextEpoch}
            disabled={epochIdx === EPOCHS.length - 1}
            style={{
              flexShrink: 0, width: 24, height: 24, borderRadius: 6,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              background: epochIdx === EPOCHS.length - 1 ? 'rgba(0,0,0,0.05)' : epoch.color + '18',
              border: `1px solid ${epochIdx === EPOCHS.length - 1 ? 'rgba(0,0,0,0.08)' : epoch.color + '44'}`,
              cursor: epochIdx === EPOCHS.length - 1 ? 'default' : 'pointer',
              color: epochIdx === EPOCHS.length - 1 ? '#ccc' : epoch.color,
              fontSize: 13, fontWeight: 700,
            }}
          >›</button>
        </div>

        {/* Year display */}
        <div style={{ flexShrink: 0, textAlign: 'right' }}>
          <div style={{ fontSize: 18, fontWeight: 700, color: epoch.color, lineHeight: 1, fontVariantNumeric: 'tabular-nums' }}>
            {formatYear(currentYear)}
          </div>
          <div style={{ fontSize: 10, color: '#9a8a7a', lineHeight: 1.3 }}>
            ~{fmt(totalPopulation)}
            {activeMigrations > 0 && ` · ${activeMigrations} routes`}
          </div>
        </div>
      </div>

      {/* Progress bar / scrubber */}
      <input
        type="range"
        min={0}
        max={SNAPSHOT_YEARS.length - 1}
        value={yearIndex}
        onChange={handleSlider}
        className="timeline-slider"
        style={{
          '--epoch-color': epoch.color,
          '--progress': `${progress}%`,
        } as React.CSSProperties}
      />
    </div>
  );
}
