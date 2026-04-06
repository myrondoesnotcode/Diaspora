import { useState } from 'react';
import { SNAPSHOT_YEARS, WORLD_TOTALS } from '../data/types';
import type { SnapshotYear, CulturalType } from '../data/types';
import { getEpochForYear } from '../data/epochs';
import EpochBar from './EpochBar';

interface Props {
  currentYear: SnapshotYear;
  onSelectYear: (year: SnapshotYear) => void;
  totalPopulation: number;
  activeMigrations: number;
}

const CULTURAL_COLORS: Record<CulturalType, string> = {
  Ashkenazi: '#3a7fd4',
  Sephardic: '#c4832a',
  Mizrahi: '#4a9440',
  Yemenite: '#8a40c0',
  Ethiopian: '#c45a28',
  Mixed: '#7a7068',
};

function fmt(n: number): string {
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1) + 'M';
  if (n >= 1_000) return Math.round(n / 1000) + 'k';
  return n.toString();
}

function PopulationSparkline({ currentYear, color }: { currentYear: SnapshotYear; color: string }) {
  const values = SNAPSHOT_YEARS.map((y) => WORLD_TOTALS[y] ?? 0);
  const max = Math.max(...values);
  const W = 300;
  const H = 50;
  const xOf = (i: number) => (i / (SNAPSHOT_YEARS.length - 1)) * W;
  const yOf = (v: number) => H - (v / max) * H * 0.88 + H * 0.06;

  const pathD = values
    .map((v, i) => `${i === 0 ? 'M' : 'L'} ${xOf(i).toFixed(1)},${yOf(v).toFixed(1)}`)
    .join(' ');

  const curIdx = SNAPSHOT_YEARS.indexOf(currentYear);
  const curVal = values[curIdx];

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      width="100%"
      height={H}
      preserveAspectRatio="none"
      style={{ display: 'block' }}
    >
      <path
        d={`${pathD} L ${xOf(SNAPSHOT_YEARS.length - 1).toFixed(1)},${H} L 0,${H} Z`}
        fill={color}
        fillOpacity={0.15}
      />
      <path d={pathD} fill="none" stroke={color} strokeWidth="2" strokeLinejoin="round" />
      <circle cx={xOf(curIdx)} cy={yOf(curVal)} r="4" fill={color} />
    </svg>
  );
}

export default function HistoryPanel({
  currentYear,
  onSelectYear,
  totalPopulation,
  activeMigrations,
}: Props) {
  const [sourcesOpen, setSourcesOpen] = useState(false);
  const epoch = getEpochForYear(currentYear);
  const worldPop = WORLD_TOTALS[currentYear];

  return (
    <div className="explore-panel">
      {/* Header */}
      <div className="mb-4">
        <div
          className="text-xs font-semibold uppercase tracking-widest mb-1"
          style={{ color: 'var(--accent)' }}
        >
          The Jewish Diaspora
        </div>
        <h1 className="text-2xl font-bold" style={{ color: 'var(--cream-text)' }}>
          {epoch.name}
        </h1>
        <div className="text-sm mt-0.5" style={{ color: 'var(--cream-muted)' }}>
          {epoch.startYear < 0 ? `${Math.abs(epoch.startYear)} BCE` : `${epoch.startYear} CE`}
          {' – '}
          {epoch.endYear < 0 ? `${Math.abs(epoch.endYear)} BCE` : `${epoch.endYear} CE`}
        </div>
      </div>

      {/* Epoch description card */}
      <div
        className="rounded-xl p-4 mb-4 text-sm leading-relaxed"
        style={{
          background: 'var(--cream-card)',
          border: '1px solid var(--cream-border)',
          color: 'var(--cream-text)',
        }}
      >
        {epoch.description}
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        <div
          className="rounded-xl p-3 text-center"
          style={{ background: 'var(--cream-card)', border: '1px solid var(--cream-border)' }}
        >
          <div className="text-xs mb-1" style={{ color: 'var(--cream-muted)' }}>
            World Jewish Pop.*
          </div>
          <div
            className="text-xl font-bold"
            style={{ color: 'var(--accent)' }}
          >
            ~{fmt(worldPop ?? totalPopulation)}
          </div>
          <div className="text-xs mt-0.5" style={{ color: 'var(--cream-muted)' }}>
            est. (DellaPergola)
          </div>
        </div>

        <div
          className="rounded-xl p-3 text-center"
          style={{ background: 'var(--cream-card)', border: '1px solid var(--cream-border)' }}
        >
          <div className="text-xs mb-1" style={{ color: 'var(--cream-muted)' }}>
            Tracked Communities
          </div>
          <div className="text-xl font-bold" style={{ color: 'var(--cream-text)' }}>
            ~{fmt(totalPopulation)}
          </div>
          {activeMigrations > 0 && (
            <div className="text-xs mt-0.5" style={{ color: 'var(--accent)' }}>
              {activeMigrations} migration{activeMigrations !== 1 ? 's' : ''} active
            </div>
          )}
        </div>
      </div>

      {/* Population sparkline */}
      <div
        className="rounded-xl p-4 mb-4"
        style={{ background: 'var(--cream-card)', border: '1px solid var(--cream-border)' }}
      >
        <div className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: 'var(--cream-muted)' }}>
          Jewish Population · 500 BCE → 2024
        </div>
        <PopulationSparkline currentYear={currentYear} color={epoch.color} />
        <div
          className="flex justify-between text-[10px] mt-1"
          style={{ color: 'var(--cream-muted)' }}
        >
          <span>500 BCE</span>
          <span>2024</span>
        </div>
      </div>

      {/* Epoch navigation */}
      <div
        className="rounded-xl p-4 mb-4"
        style={{ background: 'var(--cream-card)', border: '1px solid var(--cream-border)' }}
      >
        <div className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: 'var(--cream-muted)' }}>
          Navigate by Era
        </div>
        <EpochBar currentYear={currentYear} onSelectYear={onSelectYear} />
      </div>

      {/* Legend */}
      <div
        className="rounded-xl p-4 mb-4"
        style={{ background: 'var(--cream-card)', border: '1px solid var(--cream-border)' }}
      >
        <div className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: 'var(--cream-muted)' }}>
          Cultural Tradition
        </div>
        <div className="flex flex-wrap gap-x-4 gap-y-2 mb-3">
          {(Object.entries(CULTURAL_COLORS) as [CulturalType, string][]).map(([type, color]) => (
            <div key={type} className="flex items-center gap-2">
              <div
                className="w-3 h-3 rounded-full flex-shrink-0"
                style={{ backgroundColor: color }}
              />
              <span className="text-sm" style={{ color: 'var(--cream-text)' }}>{type}</span>
            </div>
          ))}
        </div>
        <div className="border-t pt-3 flex gap-5" style={{ borderColor: 'var(--cream-border)' }}>
          <div className="flex items-center gap-2">
            <div className="w-6 h-0.5" style={{ background: '#c4443a' }} />
            <span className="text-sm" style={{ color: 'var(--cream-text)' }}>Forced migration</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-6 h-0.5" style={{ background: '#3a8acc' }} />
            <span className="text-sm" style={{ color: 'var(--cream-text)' }}>Voluntary</span>
          </div>
        </div>
      </div>

      {/* Sources & Methodology */}
      <div className="mb-6">
        <button
          onClick={() => setSourcesOpen((v) => !v)}
          className="flex items-center gap-2 text-sm font-medium"
          style={{ color: 'var(--accent)' }}
        >
          <span>Sources & Methodology</span>
          <span className="text-xs">{sourcesOpen ? '▲' : '▼'}</span>
        </button>
        {sourcesOpen && (
          <div
            className="mt-3 rounded-xl p-4 text-sm leading-relaxed space-y-3"
            style={{ background: 'var(--cream-card)', border: '1px solid var(--cream-border)', color: 'var(--cream-text)' }}
          >
            <p>
              <strong>World population totals:</strong>{' '}
              <span style={{ color: 'var(--cream-muted)' }}>
                DellaPergola, S. <em>World Jewish Population</em>, American Jewish Year Book
                (ongoing). Standard academic reference for 70 CE–present.
              </span>
            </p>
            <p>
              <strong>Ancient & medieval demography:</strong>{' '}
              <span style={{ color: 'var(--cream-muted)' }}>
                Baron, S.W. <em>A Social and Religious History of the Jews</em> (1952–83);
                Broshi & Finkelstein, "Population of Palestine in Iron Age II," <em>BASOR</em> 287 (1992).
              </span>
            </p>
            <p>
              <strong>Pre-70 CE primary sources:</strong>{' '}
              <span style={{ color: 'var(--cream-muted)' }}>
                Josephus, <em>Jewish War</em> & <em>Antiquities</em>; Philo, <em>In Flaccum</em>;
                Ezra & Nehemiah; Porten, <em>Archives from Elephantine</em> (1968).
              </span>
            </p>
            <p>
              <strong>Community & migration data:</strong>{' '}
              <span style={{ color: 'var(--cream-muted)' }}>
                Encyclopaedia Judaica, 2nd ed. (2007); Jewish Virtual Library.
              </span>
            </p>
            <p className="italic" style={{ color: 'var(--cream-muted)' }}>
              Pre-500 CE figures carry ±50–100% uncertainty. All community populations are estimates.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
