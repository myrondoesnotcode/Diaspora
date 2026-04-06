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
  worldPopulation: number;
  activeMigrations: number;
}

function formatYear(y: number): string {
  return y < 1000 ? `${y} CE` : `${y}`;
}

export default function Timeline({
  currentYear,
  isPlaying,
  onYearChange,
  onPlayPause,
  totalPopulation,
  worldPopulation,
  activeMigrations,
}: Props) {
  const epoch = getEpochForYear(currentYear);
  const yearIndex = SNAPSHOT_YEARS.indexOf(currentYear);
  const progress = (yearIndex / (SNAPSHOT_YEARS.length - 1)) * 100;

  const sliderRef = useRef<HTMLInputElement>(null);

  const handleSliderChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const idx = parseInt(e.target.value, 10);
      onYearChange(SNAPSHOT_YEARS[idx]);
    },
    [onYearChange]
  );

  function fmt(n: number): string {
    if (n >= 1_000_000) return (n / 1_000_000).toFixed(2) + 'M';
    if (n >= 1_000) return (n / 1000).toFixed(0) + 'k';
    return n.toString();
  }

  return (
    <div className="timeline-container">
      <EpochBar currentYear={currentYear} onSelectYear={onYearChange} />

      <div className="flex items-center gap-4 mt-3">
        {/* Play/Pause */}
        <button
          onClick={onPlayPause}
          className="flex-shrink-0 w-9 h-9 rounded-full flex items-center justify-center transition-all hover:scale-110 active:scale-95"
          style={{
            backgroundColor: epoch.color,
            boxShadow: `0 0 12px ${epoch.color}88`,
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

        {/* Year display */}
        <div
          className="text-2xl font-bold tabular-nums flex-shrink-0 w-24 text-center"
          style={{ color: epoch.color, textShadow: `0 0 20px ${epoch.color}66` }}
        >
          {formatYear(currentYear)}
        </div>

        {/* Slider */}
        <div className="flex-1 relative">
          {/* Tick marks */}
          <div className="flex justify-between mb-1.5 px-0">
            {SNAPSHOT_YEARS.map((y) => {
              const isCurrent = y === currentYear;
              const tickEpoch = getEpochForYear(y);
              return (
                <button
                  key={y}
                  onClick={() => onYearChange(y)}
                  className="flex flex-col items-center gap-0.5 group"
                  style={{ width: `${100 / SNAPSHOT_YEARS.length}%` }}
                  title={formatYear(y)}
                >
                  <div
                    className="w-0.5 transition-all"
                    style={{
                      height: isCurrent ? 12 : 6,
                      backgroundColor: isCurrent ? tickEpoch.color : 'rgba(255,255,255,0.25)',
                      boxShadow: isCurrent ? `0 0 6px ${tickEpoch.color}` : 'none',
                    }}
                  />
                  <span
                    className="text-[9px] leading-none transition-all"
                    style={{
                      color: isCurrent ? tickEpoch.color : 'rgba(255,255,255,0.35)',
                      fontWeight: isCurrent ? 700 : 400,
                    }}
                  >
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
        <div className="flex-shrink-0 text-right">
          <div className="text-xs text-slate-400">World Jewish Pop.</div>
          <div className="font-bold text-sm" style={{ color: epoch.color }}>
            ~{fmt(totalPopulation)}
          </div>
          <div className="text-xs mt-0.5" style={{ color: 'rgba(255,255,255,0.35)' }}>
            {((totalPopulation / worldPopulation) * 100).toFixed(2)}% of humanity
          </div>
          {activeMigrations > 0 && (
            <div className="text-xs text-slate-400 mt-0.5">
              {activeMigrations} migration{activeMigrations !== 1 ? 's' : ''} active
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
