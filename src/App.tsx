import { useState, useEffect, useCallback, useRef } from 'react';
import { SNAPSHOT_YEARS } from './data/types';
import type { SnapshotYear } from './data/types';
import { COMMUNITIES } from './data/communities';
import { MIGRATIONS } from './data/migrations';
import DiasporaMap from './components/DiasporaMap';
import MapOverlay from './components/MapOverlay';
import ExploreTab from './components/ExploreTab';
import IntroModal from './components/IntroModal';

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
  const [showIntro, setShowIntro] = useState(true);
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
    <div style={{ position: 'fixed', inset: 0, display: 'flex', flexDirection: 'column', background: '#f5f0e8' }}>

      {/* Content area */}
      <div style={{ flex: 1, position: 'relative', overflow: 'hidden', minHeight: 0 }}>

        {/* MAP TAB — full screen map with floating overlay */}
        <div style={{
          position: 'absolute', inset: 0,
          display: activeTab === 'map' ? 'block' : 'none',
        }}>
          <DiasporaMap year={currentYear} />
          <MapOverlay
            currentYear={currentYear}
            isPlaying={isPlaying}
            onYearChange={handleYearChange}
            onPlayPause={handlePlayPause}
            totalPopulation={totalPop}
            activeMigrations={activeMigrations}
          />
        </div>

        {/* EXPLORE TAB */}
        <div style={{
          position: 'absolute', inset: 0,
          display: activeTab === 'explore' ? 'flex' : 'none',
          flexDirection: 'column',
          overflowY: 'auto',
          WebkitOverflowScrolling: 'touch',
        } as React.CSSProperties}>
          <ExploreTab currentYear={currentYear} onSelectEpoch={handleSelectEpoch} />
        </div>
      </div>

      {showIntro && <IntroModal onClose={() => setShowIntro(false)} />}

      {/* Bottom tab bar */}
      <div style={{
        flexShrink: 0, height: 56,
        display: 'flex',
        background: '#f5f0e8',
        borderTop: '1px solid rgba(0,0,0,0.1)',
      }}>
        <button
          onClick={() => setActiveTab('map')}
          style={{
            flex: 1, display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center', gap: 3,
            background: 'none', border: 'none', cursor: 'pointer',
            color: activeTab === 'map' ? '#e07b39' : '#9a8a7a',
          }}
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <polygon points="3 6 9 3 15 6 21 3 21 18 15 21 9 18 3 21" />
            <line x1="9" y1="3" x2="9" y2="18" />
            <line x1="15" y1="6" x2="15" y2="21" />
          </svg>
          <span style={{ fontSize: 10, fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase' }}>Map</span>
        </button>

        <button
          onClick={() => setActiveTab('explore')}
          style={{
            flex: 1, display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center', gap: 3,
            background: 'none', border: 'none', cursor: 'pointer',
            color: activeTab === 'explore' ? '#e07b39' : '#9a8a7a',
          }}
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
            <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
          </svg>
          <span style={{ fontSize: 10, fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase' }}>Explore</span>
        </button>
      </div>
    </div>
  );
}
