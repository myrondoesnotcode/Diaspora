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
  Ashkenazi: '#4a9eff',
  Sephardic: '#f5a623',
  Mizrahi: '#7ed321',
  Yemenite: '#bd10e0',
  Ethiopian: '#e86c2c',
  Mixed: '#9b9b9b',
};

function fmt(n: number): string {
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1) + 'M';
  if (n >= 1_000) return Math.round(n / 1000) + 'k';
  return n.toString();
}

function PopulationSparkline({ currentYear, color }: { currentYear: SnapshotYear; color: string }) {
  const values = SNAPSHOT_YEARS.map((y) => WORLD_TOTALS[y] ?? 0);
  const max = Math.max(...values);
  const W = 200;
  const H = 40;
  const xOf = (i: number) => (i / (SNAPSHOT_YEARS.length - 1)) * W;
  const yOf = (v: number) => H - (v / max) * H * 0.9 + H * 0.05;

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
      {/* Area fill */}
      <path
        d={`${pathD} L ${xOf(SNAPSHOT_YEARS.length - 1).toFixed(1)},${H} L 0,${H} Z`}
        fill={color}
        fillOpacity={0.12}
      />
      {/* Line */}
      <path d={pathD} fill="none" stroke={color} strokeWidth="1.5" strokeLinejoin="round" />
      {/* Current year dot */}
      <circle
        cx={xOf(curIdx)}
        cy={yOf(curVal)}
        r="3.5"
        fill={color}
        style={{ filter: `drop-shadow(0 0 4px ${color})` }}
      />
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
    <div className="panel-history">
      {/* Epoch bar */}
      <EpochBar currentYear={currentYear} onSelectYear={onSelectYear} />

      {/* Stats */}
      <div className="flex gap-2 mt-3">
        <div
          className="flex-1 rounded-lg p-2.5 text-center"
          style={{
            background: epoch.color + '18',
            border: `1px solid ${epoch.color}33`,
          }}
        >
          <div className="text-[10px] text-slate-400 mb-0.5">World Jewish Pop.*</div>
          <div className="font-bold text-sm" style={{ color: epoch.color }}>
            ~{fmt(worldPop ?? totalPopulation)}
          </div>
          <div className="text-[10px] text-slate-500">tracked: ~{fmt(totalPopulation)}</div>
        </div>

        {activeMigrations > 0 && (
          <div
            className="rounded-lg p-2.5 text-center"
            style={{
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,255,255,0.08)',
              minWidth: '80px',
            }}
          >
            <div className="text-[10px] text-slate-400 mb-0.5">Migrations</div>
            <div className="font-bold text-sm text-white">{activeMigrations}</div>
            <div className="text-[10px] text-slate-500">active</div>
          </div>
        )}
      </div>

      {/* Population sparkline */}
      <div className="mt-3">
        <div className="text-[10px] text-slate-500 mb-1.5">
          Jewish population, 500 BCE → 2024
        </div>
        <PopulationSparkline currentYear={currentYear} color={epoch.color} />
        <div className="flex justify-between text-[9px] text-slate-600 mt-0.5">
          <span>500 BCE</span>
          <span>2024</span>
        </div>
      </div>

      {/* Legend */}
      <div className="mt-4">
        <div className="text-[10px] text-slate-500 uppercase tracking-wide mb-2">
          Cultural Tradition
        </div>
        <div className="flex flex-wrap gap-x-3 gap-y-1.5">
          {(Object.entries(CULTURAL_COLORS) as [CulturalType, string][]).map(([type, color]) => (
            <div key={type} className="flex items-center gap-1.5">
              <div
                className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                style={{ backgroundColor: color, boxShadow: `0 0 4px ${color}` }}
              />
              <span className="text-[11px]" style={{ color: 'rgba(255,255,255,0.65)' }}>
                {type}
              </span>
            </div>
          ))}
        </div>
        <div className="flex gap-5 mt-2.5">
          <div className="flex items-center gap-1.5">
            <div className="w-5 h-0.5 flex-shrink-0" style={{ background: '#ff4444' }} />
            <span className="text-[11px]" style={{ color: 'rgba(255,255,255,0.65)' }}>
              Forced migration
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-5 h-0.5 flex-shrink-0" style={{ background: '#44aaff' }} />
            <span className="text-[11px]" style={{ color: 'rgba(255,255,255,0.65)' }}>
              Voluntary
            </span>
          </div>
        </div>
      </div>

      {/* Sources & Methodology */}
      <div className="mt-4 pb-4">
        <button
          onClick={() => setSourcesOpen((v) => !v)}
          className="text-[10px] text-slate-500 hover:text-slate-300 transition-colors tracking-wide"
        >
          Sources & Methodology {sourcesOpen ? '▲' : '▼'}
        </button>
        {sourcesOpen && (
          <div
            className="mt-2 text-[10px] leading-relaxed rounded-lg p-3 space-y-1.5"
            style={{
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,255,255,0.08)',
            }}
          >
            <p>
              <span className="text-slate-300 font-semibold">World population totals: </span>
              <span className="text-slate-400">
                DellaPergola, S. <em>World Jewish Population</em>, American Jewish Year Book
                (ongoing). Standard academic reference for 70 CE–present.
              </span>
            </p>
            <p>
              <span className="text-slate-300 font-semibold">Ancient & medieval demography: </span>
              <span className="text-slate-400">
                Baron, S.W. <em>A Social and Religious History of the Jews</em>, 18 vols.
                (1952–83); Broshi, M. & Finkelstein, I. "Population of Palestine in Iron Age II,"{' '}
                <em>BASOR</em> 287 (1992).
              </span>
            </p>
            <p>
              <span className="text-slate-300 font-semibold">Pre-70 CE primary sources: </span>
              <span className="text-slate-400">
                Josephus, <em>Jewish War</em> & <em>Antiquities</em>; Philo,{' '}
                <em>In Flaccum</em>; Ezra & Nehemiah; Porten, B.{' '}
                <em>Archives from Elephantine</em> (1968).
              </span>
            </p>
            <p>
              <span className="text-slate-300 font-semibold">Community & migration data: </span>
              <span className="text-slate-400">
                Encyclopaedia Judaica, 2nd ed. (2007); Jewish Virtual Library.
              </span>
            </p>
            <p className="text-slate-500 italic">
              Pre-500 CE figures carry ±50–100% uncertainty. All community populations are
              estimates; see tracked vs. world totals above.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
