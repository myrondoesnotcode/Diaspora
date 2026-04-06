import { useRef, useCallback } from 'react';
import { SNAPSHOT_YEARS } from '../data/types';
import type { SnapshotYear } from '../data/types';
import { getEpochForYear } from '../data/epochs';
import EpochBar from './EpochBar';

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

export default function Timeline({
  currentYear,
  isPlaying,
  onYearChange,
  onPlayPause,
  totalPopulation,
  activeMigrations,
}: Props) {
  const epoch = getEpochForYear(currentYear);
  const yearIndex = SNAPSHOT_YEARS.indexOf(currentYear);
  const progress = (yearIndex / (SNAPSHOT_YEARS.length - 1)) * 100;
  const sliderRef = useRef<HTMLInputElement>(null);

  const handleSliderChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      onYearChange(SNAPSHOT_YEARS[parseInt(e.target.value, 10)]);
    },
    [onYearChange]
  );

  return (
    <div className="timeline-panel">
      <EpochBar currentYear={currentYear} onSelectYear={onYearChange} />

      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 10 }}>
        {/* Play/Pause */}
        <button
          onClick={onPlayPause}
          style={{
            flexShrink: 0, width: 36, height: 36, borderRadius: '50%',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            background: epoch.color, border: 'none', cursor: 'pointer',
            boxShadow: `0 0 12px ${epoch.color}88`,
            transition: 'transform 0.1s',
          }}
          aria-label={isPlaying ? 'Pause' : 'Play'}
        >
          {isPlaying ? (
            <svg width="14" height="14" viewBox="0 0 14 14" fill="white">
              <rect x="2" y="1" width="4" height="12" rx="1" />
              <rect x="8" y="1" width="4" height="12" rx="1" />
            </svg>
          ) : (
            <svg width="14" height="14" viewBox="0 0 14 14" fill="white">
              <polygon points="2,1 13,7 2,13" />
            </svg>
          )}
        </button>

        {/* Year */}
        <div style={{ fontSize: 22, fontWeight: 700, color: epoch.color, flexShrink: 0, width: 80, textAlign: 'center', fontVariantNumeric: 'tabular-nums' }}>
          {formatYear(currentYear)}
        </div>

        {/* Slider + ticks */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
            {SNAPSHOT_YEARS.map((y) => {
              const isCurrent = y === currentYear;
              const tickEpoch = getEpochForYear(y);
              return (
                <button
                  key={y}
                  onClick={() => onYearChange(y)}
                  style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2, background: 'none', border: 'none', cursor: 'pointer', padding: 0, width: `${100 / SNAPSHOT_YEARS.length}%` }}
                  title={formatYear(y)}
                >
                  <div style={{
                    width: 2, height: isCurrent ? 12 : 5,
                    backgroundColor: isCurrent ? tickEpoch.color : 'rgba(0,0,0,0.2)',
                    boxShadow: isCurrent ? `0 0 6px ${tickEpoch.color}` : 'none',
                    transition: 'all 0.2s',
                  }} />
                  <span style={{
                    fontSize: 8, lineHeight: 1,
                    color: isCurrent ? tickEpoch.color : 'rgba(0,0,0,0.3)',
                    fontWeight: isCurrent ? 700 : 400,
                  }}>
                    {y < 1000 ? y : y >= 1900 ? String(y).slice(2) : y}
                  </span>
                </button>
              );
            })}
          </div>

          <input
            ref={sliderRef}
            type="range"
            min={0}
            max={SNAPSHOT_YEARS.length - 1}
            value={yearIndex}
            onChange={handleSliderChange}
            className="timeline-slider"
            style={{
              '--epoch-color': epoch.color,
              '--progress': `${progress}%`,
            } as React.CSSProperties}
          />
        </div>

        {/* Stats */}
        <div style={{ flexShrink: 0, textAlign: 'right' }}>
          <div style={{ fontSize: 11, color: '#6b5a4a' }}>World Jewish Pop.</div>
          <div style={{ fontSize: 13, fontWeight: 700, color: epoch.color }}>~{fmt(totalPopulation)}</div>
          {activeMigrations > 0 && (
            <div style={{ fontSize: 10, color: '#6b5a4a', marginTop: 1 }}>
              {activeMigrations} migration{activeMigrations !== 1 ? 's' : ''} active
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
