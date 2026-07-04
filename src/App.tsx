import { useEffect, useRef, useState } from 'react';
import { CHAPTERS } from './data/chapters';
import { COMMUNITIES } from './data/communities';
import { MIGRATIONS } from './data/migrations';
import { MOMENTS } from './data/moments';
import { storyStateAt, populationAt } from './utils/story';
import type { StoryState } from './utils/story';
import ScrollMap from './components/ScrollMap';
import Hero from './components/Hero';
import ChapterSection from './components/ChapterSection';
import StoryHUD, { StoryFeed } from './components/StoryHUD';
import type { FeedMoment } from './components/StoryHUD';
import CommunityCard from './components/CommunityCard';
import Explore from './components/Explore';

function totalPopulationAt(year: number): number {
  let total = 0;
  for (const c of COMMUNITIES) total += populationAt(c, year);
  return total;
}

function momentsAt(year: number): FeedMoment[] {
  // Most recent moments still "echoing" (shown for ~30 years of story time)
  return MOMENTS.filter((m) => year >= m.year && year - m.year < 30)
    .slice(-3)
    .reverse()
    .map((m) => ({ year: m.year, label: m.label, kind: m.kind }));
}

function migrationsAt(year: number): string[] {
  return MIGRATIONS.filter((m) => year >= m.startYear && year <= m.endYear)
    .slice(0, 2)
    .map((m) => m.description);
}

export default function App() {
  const storyRef = useRef<HTMLDivElement>(null);
  const stateRef = useRef<StoryState>(storyStateAt(0));
  const [picked, setPicked] = useState<string | null>(null);
  const [hud, setHud] = useState({
    year: CHAPTERS[0].startYear,
    population: totalPopulationAt(CHAPTERS[0].startYear),
    chapterIndex: -1,
    accent: '#e8b54d',
    inStory: true,
    progress: 0,
    moments: momentsAt(CHAPTERS[0].startYear),
    migrations: migrationsAt(CHAPTERS[0].startYear),
  });

  useEffect(() => {
    let raf = 0;
    let lastYear = -1;
    let lastChapter = -2;
    let lastInStory: boolean | null = null;

    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const story = storyRef.current;
        if (!story) return;
        const vh = window.innerHeight;
        const rect = story.getBoundingClientRect();
        const scrolled = -rect.top;

        // Measure actual section boundaries: t = 0..1 across the hero, then
        // 1 + i + progress through chapter i.
        let t: number;
        const sections = Array.from(
          story.querySelectorAll<HTMLElement>('.hero, .chapter')
        );
        const heroLen = sections[0]?.offsetHeight ?? vh;
        if (scrolled < heroLen) {
          t = Math.max(0, scrolled / heroLen);
        } else {
          t = 1 + CHAPTERS.length - 0.0001; // past the last chapter
          for (let i = 1; i < sections.length; i++) {
            const top = sections[i].offsetTop;
            const len = sections[i].offsetHeight;
            if (scrolled < top + len) {
              t = i + (scrolled - top) / len;
              break;
            }
          }
        }

        const s = storyStateAt(t);
        stateRef.current = s;

        const storyBottom = rect.bottom - vh; // >0 while story still on screen
        const inStory = storyBottom > -vh * 0.2;

        const yr = Math.round(s.year);
        if (yr !== lastYear || s.chapterIndex !== lastChapter || inStory !== lastInStory) {
          lastYear = yr;
          lastChapter = s.chapterIndex;
          lastInStory = inStory;
          setHud({
            year: s.year,
            population: totalPopulationAt(s.year),
            chapterIndex: s.chapterIndex,
            accent: s.palette.accent,
            inStory,
            progress: Math.min(1, Math.max(0, t / (1 + CHAPTERS.length))),
            moments: momentsAt(s.year),
            migrations: migrationsAt(s.year),
          });
        }
      });
    };

    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, []);

  return (
    <div className="story-root">
      <ScrollMap stateRef={stateRef} visible={hud.inStory} onPickCommunity={setPicked} />
      <div className="film-grain" aria-hidden="true" />
      <StoryFeed moments={hud.moments} migrations={hud.migrations} visible={hud.inStory} />
      <StoryHUD
        year={hud.year}
        population={hud.population}
        chapterIndex={hud.chapterIndex}
        accent={hud.accent}
        visible={hud.inStory}
        progress={hud.progress}
      />
      {picked && hud.inStory && (
        <CommunityCard communityId={picked} year={hud.year} onClose={() => setPicked(null)} />
      )}
      <div ref={storyRef} className="story-scroll">
        <Hero />
        {CHAPTERS.map((c) => (
          <ChapterSection key={c.id} chapter={c} />
        ))}
      </div>
      <Explore />
    </div>
  );
}
