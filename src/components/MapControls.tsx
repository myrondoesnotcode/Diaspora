import { useRef, useCallback, useEffect, useState } from 'react';
import { SNAPSHOT_YEARS } from '../data/types';
import type { SnapshotYear } from '../data/types';
import { getEpochForYear } from '../data/epochs';

interface Props {
  currentYear: SnapshotYear;
  isPlaying: boolean;
  onYearChange: (year: SnapshotYear) => void;
  onPlayPause: () => void;
}

function formatYear(y: number): string {
  if (y < 0) return `${Math.abs(y)} BCE`;
  if (y < 1000) return `${y} CE`;
  return `${y}`;
}

function tickLabel(y: number): string {
  if (y < 0) return `${Math.abs(y)}b`;
  if (y < 1000) return String(y);
  if (y >= 1900) return String(y).slice(2);
  return String(y);
}

// Only show these labels when compact (narrow container)
const KEY_YEARS = new Set([-500, 1, 500, 1492, 1900, 2024]);

export default function MapControls({ currentYear, isPlaying, onYearChange, onPlayPause }: Props) {
  const epoch = getEpochForYear(currentYear);
  const yearIndex = SNAPSHOT_YEARS.indexOf(currentYear);
  const progress = (yearIndex / (SNAPSHOT_YEARS.length - 1)) * 100;

  const containerRef = useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = useState(0);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) => {
      setContainerWidth(entry.contentRect.width);
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const handleSliderChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const idx = parseInt(e.target.value, 10);
      onYearChange(SNAPSHOT_YEARS[idx]);
    },
    [onYearChange]
  );

  const compact = containerWidth > 0 && containerWidth < 520;

  return (
    <div ref={containerRef} className="map-controls">
      <div className="flex items-center gap-3">
        {/* Play/Pause */}
        <button
          onClick={onPlayPause}
          className="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center transition-all hover:scale-110 active:scale-95"
          style={{
            backgroundColor: epoch.color,
            boxShadow: `0 0 12px ${epoch.color}88`,
          }}
          aria-label={isPlaying ? 'Pause' : 'Play'}
        >
          {isPlaying ? (
            <svg width="12" height="12" viewBox="0 0 14 14" fill="white">
              <rect x="2" y="1" width="4" height="12" rx="1" />
              <rect x="8" y="1" width="4" height="12" rx="1" />
            </svg>
          ) : (
            <svg width="12" height="12" viewBox="0 0 14 14" fill="white">
              <polygon points="2,1 13,7 2,13" />
            </svg>
          )}
        </button>

        {/* Year display */}
        <div
          className="text-lg font-bold tabular-nums flex-shrink-0 w-24 text-center"
          style={{ color: epoch.color, textShadow: `0 0 20px ${epoch.color}66` }}
        >
          {formatYear(currentYear)}
        </div>

        {/* Slider + tick marks */}
        <div className="flex-1 relative">
          <div className="flex justify-between mb-1">
            {SNAPSHOT_YEARS.map((y) => {
              const isCurrent = y === currentYear;
              const tickEpoch = getEpochForYear(y);
              const showLabel = !compact || KEY_YEARS.has(y) || isCurrent;
              return (
                <button
                  key={y}
                  onClick={() => onYearChange(y)}
                  className="flex flex-col items-center gap-0.5"
                  style={{ width: `${100 / SNAPSHOT_YEARS.length}%` }}
                  title={formatYear(y)}
                >
                  <div
                    className="w-0.5 transition-all"
                    style={{
                      height: isCurrent ? 10 : 5,
                      backgroundColor: isCurrent ? tickEpoch.color : 'rgba(120,100,70,0.45)',
                      boxShadow: isCurrent ? `0 0 6px ${tickEpoch.color}` : 'none',
                    }}
                  />
                  <span
                    className="text-[8px] leading-none"
                    style={{
                      color: isCurrent ? tickEpoch.color : 'rgba(100,80,55,0.65)',
                      fontWeight: isCurrent ? 700 : 400,
                      visibility: showLabel ? 'visible' : 'hidden',
                    }}
                  >
                    {tickLabel(y)}
                  </span>
                </button>
              );
            })}
          </div>

          <input
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
      </div>
    </div>
  );
}
