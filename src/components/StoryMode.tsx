import { useState, useEffect, useCallback } from 'react';
import { STORY_BEATS } from '../data/storyBeats';
import type { SnapshotYear } from '../data/types';
import { SNAPSHOT_YEARS } from '../data/types';

interface Props {
  onYearChange: (year: SnapshotYear) => void;
  onExit: () => void;
}

function formatYear(y: number): string {
  if (y <= 0) return `${Math.abs(y)} BCE`;
  return y < 1000 ? `${y} CE` : `${y}`;
}

function nearestSnapshotYear(year: number): SnapshotYear {
  return SNAPSHOT_YEARS.reduce((prev, curr) =>
    Math.abs(curr - year) < Math.abs(prev - year) ? curr : prev
  );
}

export default function StoryMode({ onYearChange, onExit }: Props) {
  const [beatIndex, setBeatIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const beat = STORY_BEATS[beatIndex];
  const isLast = beatIndex === STORY_BEATS.length - 1;
  const snapshotYear = nearestSnapshotYear(beat.year);

  // Navigate map to current beat's year
  useEffect(() => {
    onYearChange(snapshotYear);
  }, [snapshotYear, onYearChange]);

  // Auto-advance timer
  useEffect(() => {
    if (isPaused || isLast) return;
    const timer = setTimeout(() => {
      setBeatIndex((i) => i + 1);
    }, beat.duration);
    return () => clearTimeout(timer);
  }, [beatIndex, isPaused, isLast, beat.duration]);

  const goNext = useCallback(() => {
    if (isLast) {
      onExit();
    } else {
      setBeatIndex((i) => i + 1);
    }
  }, [isLast, onExit]);

  const goPrev = useCallback(() => {
    setBeatIndex((i) => Math.max(0, i - 1));
  }, []);

  const togglePause = useCallback(() => {
    setIsPaused((p) => !p);
  }, []);

  return (
    <div
      style={{
        position: 'absolute', bottom: 0, left: 0, right: 0,
        zIndex: 30,
        pointerEvents: 'none',
      }}
    >
      {/* Narration card */}
      <div
        style={{
          pointerEvents: 'auto',
          margin: '0 12px 12px',
          background: 'rgba(10, 15, 30, 0.88)',
          backdropFilter: 'blur(16px)',
          border: '1px solid rgba(255,255,255,0.08)',
          borderRadius: 16,
          padding: '16px 18px 14px',
          opacity: 1,
          transform: 'translateY(0)',
          transition: 'opacity 0.5s ease, transform 0.5s ease',
        }}
      >
        {/* Progress dots */}
        <div style={{ display: 'flex', gap: 4, justifyContent: 'center', marginBottom: 12 }}>
          {STORY_BEATS.map((_, i) => (
            <div
              key={i}
              style={{
                width: i === beatIndex ? 16 : 5,
                height: 5,
                borderRadius: 3,
                background: i === beatIndex ? '#e07b39' : i < beatIndex ? 'rgba(255,255,255,0.4)' : 'rgba(255,255,255,0.15)',
                transition: 'all 0.3s ease',
              }}
            />
          ))}
        </div>

        <div style={{ fontSize: 11, fontWeight: 700, color: '#e07b39', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 4 }}>
          {formatYear(beat.year)}
        </div>
        <div style={{ fontSize: 16, fontWeight: 700, color: '#f5f0e8', marginBottom: 6, lineHeight: 1.2 }}>
          {beat.title}
        </div>
        <p style={{ fontSize: 13, color: 'rgba(245,240,232,0.8)', lineHeight: 1.6, margin: '0 0 14px' }}>
          {beat.narration}
        </p>

        {/* Controls */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <button
            onClick={goPrev}
            disabled={beatIndex === 0}
            style={{
              background: 'none', border: 'none', cursor: beatIndex === 0 ? 'default' : 'pointer',
              color: beatIndex === 0 ? 'rgba(255,255,255,0.2)' : 'rgba(255,255,255,0.7)',
              fontSize: 13, fontWeight: 600, padding: '6px 10px',
            }}
          >
            ← Back
          </button>

          <button
            onClick={togglePause}
            style={{
              background: 'rgba(255,255,255,0.1)',
              border: '1px solid rgba(255,255,255,0.15)',
              borderRadius: 20,
              color: 'rgba(245,240,232,0.9)',
              fontSize: 12, fontWeight: 600, padding: '5px 14px',
              cursor: 'pointer',
            }}
          >
            {isPaused ? '▶ Resume' : '⏸ Pause'}
          </button>

          <button
            onClick={goNext}
            style={{
              background: 'none', border: 'none', cursor: 'pointer',
              color: 'rgba(255,255,255,0.7)',
              fontSize: 13, fontWeight: 600, padding: '6px 10px',
            }}
          >
            {isLast ? 'Explore →' : 'Next →'}
          </button>
        </div>
      </div>

      {/* Skip button at top right */}
      <button
        onClick={onExit}
        style={{
          pointerEvents: 'auto',
          position: 'fixed', top: 14, right: 14,
          background: 'rgba(10, 15, 30, 0.7)',
          backdropFilter: 'blur(8px)',
          border: '1px solid rgba(255,255,255,0.12)',
          borderRadius: 20,
          color: 'rgba(245,240,232,0.7)',
          fontSize: 11, fontWeight: 600, padding: '5px 14px',
          cursor: 'pointer',
          zIndex: 31,
        }}
      >
        Skip Story
      </button>
    </div>
  );
}
