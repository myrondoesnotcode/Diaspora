import { useState, useEffect, useCallback, useRef } from 'react';
import { SNAPSHOT_YEARS } from '../data/types';
import type { SnapshotYear } from '../data/types';
import { COMMUNITIES } from '../data/communities';
import { MIGRATIONS } from '../data/migrations';
import DiasporaMap from './DiasporaMap';
import Timeline from './Timeline';

// Free-explore mode: the original interactive map + timeline, reached after
// the scroll story ends.

function getPopulation(year: number): number {
  let total = 0;
  for (const c of COMMUNITIES) {
    const years = Object.keys(c.populations).map(Number).sort((a, b) => a - b);
    let val = 0;
    for (const y of years) {
      if (y <= year) val = c.populations[y] ?? 0;
    }
    total += val;
  }
  return total;
}

function getActiveMigrationCount(year: number): number {
  return MIGRATIONS.filter((m) => year >= m.startYear && year <= m.endYear).length;
}

export default function Explore() {
  const [currentYear, setCurrentYear] = useState<SnapshotYear>(70);
  const [isPlaying, setIsPlaying] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const advanceYear = useCallback(() => {
    setCurrentYear((prev) => {
      const idx = SNAPSHOT_YEARS.indexOf(prev);
      if (idx >= SNAPSHOT_YEARS.length - 1) {
        setIsPlaying(false);
        return prev;
      }
      return SNAPSHOT_YEARS[idx + 1];
    });
  }, []);

  useEffect(() => {
    if (isPlaying) {
      intervalRef.current = setInterval(advanceYear, 1500);
    } else if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isPlaying, advanceYear]);

  const handlePlayPause = useCallback(() => {
    setIsPlaying((p) => {
      if (!p && currentYear === SNAPSHOT_YEARS[SNAPSHOT_YEARS.length - 1]) {
        setCurrentYear(SNAPSHOT_YEARS[0]);
      }
      return !p;
    });
  }, [currentYear]);

  return (
    <section className="explore" id="explore">
      <div className="explore-header">
        <div className="explore-kicker">Epilogue</div>
        <h2 className="explore-title">Explore the Full Map</h2>
        <p className="explore-sub">
          Now go even deeper — scrub through nearly 4,000 years, from Abraham to
          today. Every community, every migration, color-coded by tradition.
          Zoom, pan, and click any city for its story.
        </p>
      </div>
      <div className="explore-app">
        <DiasporaMap year={currentYear} />
        <Timeline
          currentYear={currentYear}
          isPlaying={isPlaying}
          onYearChange={setCurrentYear}
          onPlayPause={handlePlayPause}
          totalPopulation={getPopulation(currentYear)}
          activeMigrations={getActiveMigrationCount(currentYear)}
        />
      </div>
    </section>
  );
}
