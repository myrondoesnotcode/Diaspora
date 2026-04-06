import { useState, useEffect, useCallback, useRef } from 'react';
import { SNAPSHOT_YEARS } from './data/types';
import type { SnapshotYear } from './data/types';
import { COMMUNITIES } from './data/communities';
import { MIGRATIONS } from './data/migrations';
import DiasporaMap from './components/DiasporaMap';
import Timeline from './components/Timeline';
import ExploreTab from './components/ExploreTab';

type ActiveTab = 'map' | 'explore';

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
  const [currentYear, setCurrentYear] = useState<SnapshotYear>(70);
  const [isPlaying, setIsPlaying] = useState(false);
  const [activeTab, setActiveTab] = useState<ActiveTab>('map');
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

  const handleSelectEpoch = useCallback((year: SnapshotYear) => {
    setCurrentYear(year);
    setActiveTab('map');
  }, []);

  const totalPop = getPopulation(currentYear);
  const activeMigrations = getActiveMigrationCount(currentYear);

  return (
    <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      {/* Content area — both tabs kept mounted to preserve D3 state */}
      <div style={{ flex: 1, position: 'relative', overflow: 'hidden' }}>
        {/* Map tab */}
        <div style={{
          display: activeTab === 'map' ? 'block' : 'none',
          width: '100%',
          height: '100%',
          position: 'relative',
        }}>
          <DiasporaMap year={currentYear} />
          <Timeline
            currentYear={currentYear}
            isPlaying={isPlaying}
            onYearChange={handleYearChange}
            onPlayPause={handlePlayPause}
            totalPopulation={totalPop}
            activeMigrations={activeMigrations}
          />
        </div>

        {/* Explore tab */}
        <div style={{
          display: activeTab === 'explore' ? 'flex' : 'none',
          flexDirection: 'column',
          width: '100%',
          height: '100%',
          overflowY: 'auto',
          WebkitOverflowScrolling: 'touch',
        } as React.CSSProperties}>
          <ExploreTab currentYear={currentYear} onSelectEpoch={handleSelectEpoch} />
        </div>
      </div>

      {/* Bottom tab bar — always cream */}
      <div
        style={{
          height: 56,
          flexShrink: 0,
          display: 'flex',
          borderTop: '1px solid rgba(0,0,0,0.1)',
          background: '#f5f0e8',
        }}
      >
        {/* MAP tab */}
        <button
          onClick={() => setActiveTab('map')}
          style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 3,
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            color: activeTab === 'map' ? '#e07b39' : '#9a8a7a',
          }}
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <polygon points="3 6 9 3 15 6 21 3 21 18 15 21 9 18 3 21" />
            <line x1="9" y1="3" x2="9" y2="18" />
            <line x1="15" y1="6" x2="15" y2="21" />
          </svg>
          <span style={{ fontSize: 10, fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase' }}>
            Map
          </span>
        </button>

        {/* EXPLORE tab */}
        <button
          onClick={() => setActiveTab('explore')}
          style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 3,
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            color: activeTab === 'explore' ? '#e07b39' : '#9a8a7a',
          }}
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
            <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
          </svg>
          <span style={{ fontSize: 10, fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase' }}>
            Explore
          </span>
        </button>
      </div>
    </div>
  );
}
