import { useState, useEffect, useCallback, useRef } from 'react';
import { SNAPSHOT_YEARS } from './data/types';
import type { SnapshotYear } from './data/types';
import { MIGRATIONS } from './data/migrations';
import { WORLD_JEWISH_POP, WORLD_TOTAL_POP } from './data/worldPopulation';
import DiasporaMap from './components/DiasporaMap';
import Timeline from './components/Timeline';
import Explore from './components/Explore';

type Tab = 'map' | 'explore';

function getActiveMigrationCount(year: number): number {
  return MIGRATIONS.filter((m) => year >= m.startYear && year <= m.endYear).length;
}

export default function App() {
  const [currentYear, setCurrentYear] = useState<SnapshotYear>(70);
  const [isPlaying, setIsPlaying] = useState(false);
  const [activeTab, setActiveTab] = useState<Tab>('map');
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

  const handleViewMap = useCallback((year: SnapshotYear) => {
    setCurrentYear(year);
    setActiveTab('map');
  }, []);

  const totalPop = WORLD_JEWISH_POP[currentYear];
  const worldPop = WORLD_TOTAL_POP[currentYear];
  const activeMigrations = getActiveMigrationCount(currentYear);

  return (
    <div style={{ width: '100vw', height: '100vh', position: 'relative', overflow: 'hidden', background: '#0a0f1e' }}>
      {/* Map view */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          visibility: activeTab === 'map' ? 'visible' : 'hidden',
          pointerEvents: activeTab === 'map' ? 'auto' : 'none',
        }}
      >
        <DiasporaMap year={currentYear} />
        <Timeline
          currentYear={currentYear}
          isPlaying={isPlaying}
          onYearChange={handleYearChange}
          onPlayPause={handlePlayPause}
          totalPopulation={totalPop}
          worldPopulation={worldPop}
          activeMigrations={activeMigrations}
        />
      </div>

      {/* Explore view */}
      {activeTab === 'explore' && (
        <Explore onViewMap={handleViewMap} />
      )}

      {/* Bottom tab bar */}
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: 60,
          display: 'flex',
          alignItems: 'center',
          background: activeTab === 'map'
            ? 'transparent'
            : 'rgba(245,242,238,0.97)',
          borderTop: activeTab === 'map'
            ? 'none'
            : '1px solid rgba(0,0,0,0.08)',
          zIndex: 200,
          pointerEvents: 'auto',
        }}
      >
        {/* MAP tab */}
        <button
          onClick={() => setActiveTab('map')}
          style={{
            flex: 1,
            height: '100%',
            background: 'transparent',
            border: 'none',
            cursor: 'pointer',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 3,
            color: activeTab === 'map'
              ? 'rgba(255,255,255,0.9)'
              : '#aaa',
          }}
        >
          {/* Map icon */}
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <polygon points="3 6 9 3 15 6 21 3 21 18 15 21 9 18 3 21" />
            <line x1="9" y1="3" x2="9" y2="18" />
            <line x1="15" y1="6" x2="15" y2="21" />
          </svg>
          <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
            Map
          </span>
        </button>

        {/* EXPLORE tab */}
        <button
          onClick={() => setActiveTab('explore')}
          style={{
            flex: 1,
            height: '100%',
            background: 'transparent',
            border: 'none',
            cursor: 'pointer',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 3,
            color: activeTab === 'explore'
              ? '#f5a623'
              : (activeTab === 'map' ? 'rgba(255,255,255,0.45)' : '#aaa'),
          }}
        >
          {/* Book / explore icon */}
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
            <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
          </svg>
          <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
            Explore
          </span>
        </button>
      </div>
    </div>
  );
}
