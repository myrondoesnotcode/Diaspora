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

type Tab = 'map' | 'explore';

function TabBar({ active, onChange }: { active: Tab; onChange: (t: Tab) => void }) {
  return (
    <nav className="tab-bar">
      <button
        className={`tab-item ${active === 'map' ? 'tab-item--active' : ''}`}
        onClick={() => onChange('map')}
        aria-label="Map view"
      >
        {/* Map icon */}
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
          <polygon points="3 6 9 3 15 6 21 3 21 18 15 21 9 18 3 21" />
          <line x1="9" y1="3" x2="9" y2="18" />
          <line x1="15" y1="6" x2="15" y2="21" />
        </svg>
        <span>Map</span>
      </button>

      <button
        className={`tab-item ${active === 'explore' ? 'tab-item--active' : ''}`}
        onClick={() => onChange('explore')}
        aria-label="Explore history"
      >
        {/* Book / history icon */}
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
          <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
          <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
        </svg>
        <span>Explore</span>
      </button>
    </nav>
  );
}

export default function App() {
  const [currentYear, setCurrentYear] = useState<SnapshotYear>(-500);
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

  const totalPop = getPopulation(currentYear);
  const activeMigrations = getActiveMigrationCount(currentYear);

  return (
    <div className="app-root">
      {/* Tab content — fills remaining height above tab bar */}
      <div className="tab-content">
        {/* MAP tab — always mounted so D3 state is preserved */}
        <div className={`map-view ${activeTab !== 'map' ? 'map-view--hidden' : ''}`}>
          <DiasporaMap year={currentYear} />
          <MapControls
            currentYear={currentYear}
            isPlaying={isPlaying}
            onYearChange={handleYearChange}
            onPlayPause={handlePlayPause}
          />
        </div>

        {/* EXPLORE tab */}
        {activeTab === 'explore' && (
          <HistoryPanel
            currentYear={currentYear}
            onSelectYear={(year) => { handleYearChange(year); setActiveTab('map'); }}
            totalPopulation={totalPop}
            activeMigrations={activeMigrations}
          />
        )}
      </div>

      <TabBar active={activeTab} onChange={setActiveTab} />
    </div>
  );
}
