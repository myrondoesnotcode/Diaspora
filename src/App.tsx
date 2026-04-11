import { useState, useEffect, useCallback, useRef } from 'react';
import { SNAPSHOT_YEARS } from './data/types';
import type { SnapshotYear } from './data/types';
import { COMMUNITIES } from './data/communities';
import { MIGRATIONS } from './data/migrations';
import DiasporaMap from './components/DiasporaMap';
import MapOverlay from './components/MapOverlay';
import ExploreTab from './components/ExploreTab';
import IntroModal from './components/IntroModal';
import StoryMode from './components/StoryMode';
import LineagePoster from './components/LineagePoster';

type ActiveTab = 'map' | 'explore';
type ActiveView = 'main' | 'poster';

function getInitialView(): ActiveView {
  return window.location.hash.startsWith('#poster') ? 'poster' : 'main';
}

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

function nearestSnapshotYear(year: number): SnapshotYear {
  return SNAPSHOT_YEARS.reduce((prev, curr) =>
    Math.abs(curr - year) < Math.abs(prev - year) ? curr : prev
  );
}

function getInitialYear(): SnapshotYear {
  const hash = window.location.hash;
  const match = hash.match(/year=(-?\d+)/);
  if (match) return nearestSnapshotYear(parseInt(match[1], 10));
  return 70;
}

export default function App() {
  const [currentYear, setCurrentYear] = useState<SnapshotYear>(getInitialYear);
  const [isPlaying, setIsPlaying] = useState(false);
  const [activeTab, setActiveTab] = useState<ActiveTab>('map');
  const [showIntro, setShowIntro] = useState(true);
  const [storyMode, setStoryMode] = useState(false);
  const [activeView, setActiveView] = useState<ActiveView>(getInitialView);
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

  useEffect(() => {
    const onHashChange = () => {
      setActiveView(window.location.hash.startsWith('#poster') ? 'poster' : 'main');
    };
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);

  const handleYearChange = useCallback((year: SnapshotYear) => {
    setCurrentYear(year);
    window.history.replaceState(null, '', `#year=${year}`);
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
          {storyMode ? (
            <StoryMode
              onYearChange={handleYearChange}
              onExit={() => setStoryMode(false)}
            />
          ) : (
            <MapOverlay
              currentYear={currentYear}
              isPlaying={isPlaying}
              onYearChange={handleYearChange}
              onPlayPause={handlePlayPause}
              totalPopulation={totalPop}
              activeMigrations={activeMigrations}
            />
          )}
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

      {showIntro && activeView !== 'poster' && (
        <IntroModal
          onClose={() => setShowIntro(false)}
          onStoryMode={() => {
            setShowIntro(false);
            setStoryMode(true);
            setActiveTab('map');
          }}
        />
      )}

      {/* Lineage Poster overlay — accessible via #poster URL hash */}
      {activeView === 'poster' && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 100, overflowY: 'auto', WebkitOverflowScrolling: 'touch' } as React.CSSProperties}>
          <LineagePoster
            currentYear={currentYear}
            onClose={() => {
              window.history.pushState(null, '', `#year=${currentYear}`);
              setActiveView('main');
            }}
          />
        </div>
      )}

      {/* Bottom tab bar — zIndex 60 keeps it above IntroModal backdrop (zIndex 50) */}
      <div style={{
        flexShrink: 0, height: 56,
        display: 'flex',
        background: '#f5f0e8',
        borderTop: '1px solid rgba(0,0,0,0.1)',
        position: 'relative',
        zIndex: 60,
      }}>
        <button
          onClick={() => { setActiveView('main'); setActiveTab('map'); }}
          style={{
            flex: 1, display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center', gap: 3,
            background: 'none', border: 'none', cursor: 'pointer',
            color: activeView === 'main' && activeTab === 'map' ? '#e07b39' : '#9a8a7a',
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
          onClick={() => { setActiveView('main'); setActiveTab('explore'); }}
          style={{
            flex: 1, display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center', gap: 3,
            background: 'none', border: 'none', cursor: 'pointer',
            color: activeView === 'main' && activeTab === 'explore' ? '#e07b39' : '#9a8a7a',
          }}
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
            <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
          </svg>
          <span style={{ fontSize: 10, fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase' }}>Explore</span>
        </button>

        <button
          onClick={() => {
            window.history.pushState(null, '', '#poster');
            setActiveView('poster');
          }}
          style={{
            flex: 1, display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center', gap: 3,
            background: 'none', border: 'none', cursor: 'pointer',
            color: activeView === 'poster' ? '#e07b39' : '#9a8a7a',
            position: 'relative',
          }}
        >
          {/* Star of David icon */}
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
          </svg>
          <span style={{ fontSize: 10, fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase' }}>Lineage</span>
        </button>
      </div>
    </div>
  );
}
