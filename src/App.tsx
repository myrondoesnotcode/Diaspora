import { useState, useEffect, useCallback, useRef } from 'react';
import { SNAPSHOT_YEARS } from './data/types';
import type { SnapshotYear } from './data/types';
import { COMMUNITIES } from './data/communities';
import { MIGRATIONS } from './data/migrations';
import DiasporaMap from './components/DiasporaMap';
import MapControls from './components/MapControls';
import HistoryPanel from './components/HistoryPanel';

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

export default function App() {
  const [currentYear, setCurrentYear] = useState<SnapshotYear>(-500);
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
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isPlaying, advanceYear]);

  const handleYearChange = useCallback((year: SnapshotYear) => {
    setCurrentYear(year);
  }, []);

  const handlePlayPause = useCallback(() => {
    setIsPlaying((p) => {
      if (!p && currentYear === SNAPSHOT_YEARS[SNAPSHOT_YEARS.length - 1]) {
        setCurrentYear(SNAPSHOT_YEARS[0]);
      }
      return !p;
    });
  }, [currentYear]);

  const totalPop = getPopulation(currentYear);
  const activeMigrations = getActiveMigrationCount(currentYear);

  return (
    <div className="app-layout">
      <div className="panel-map">
        <DiasporaMap year={currentYear} />
        <MapControls
          currentYear={currentYear}
          isPlaying={isPlaying}
          onYearChange={handleYearChange}
          onPlayPause={handlePlayPause}
        />
      </div>
      <HistoryPanel
        currentYear={currentYear}
        onSelectYear={handleYearChange}
        totalPopulation={totalPop}
        activeMigrations={activeMigrations}
      />
    </div>
  );
}
