import React from 'react';
import { EPOCHS, getEpochForYear } from '../data/epochs';
import { SNAPSHOT_YEARS } from '../data/types';
import type { SnapshotYear } from '../data/types';

interface Props {
  currentYear: number;
  onSelectYear: (year: SnapshotYear) => void;
}

export default function EpochBar({ currentYear, onSelectYear }: Props) {
  const activeEpoch = getEpochForYear(currentYear);

  return (
    <div
      className="flex gap-1.5 overflow-x-auto pb-1 flex-wrap"
      style={{ scrollbarWidth: 'none' } as React.CSSProperties}
    >
      {EPOCHS.map((epoch) => {
        const isActive = epoch.name === activeEpoch.name;
        const midYear = Math.round((epoch.startYear + epoch.endYear) / 2);
        const targetYear = SNAPSHOT_YEARS.reduce((prev, curr) =>
          Math.abs(curr - midYear) < Math.abs(prev - midYear) ? curr : prev
        );

        return (
          <button
            key={epoch.name}
            onClick={() => onSelectYear(targetYear)}
            className="epoch-pill text-xs px-2.5 py-1 rounded-full font-medium"
            style={{
              backgroundColor: isActive ? epoch.color : epoch.color + '20',
              color: isActive ? '#fff' : epoch.color,
              border: `1px solid ${epoch.color}${isActive ? 'ff' : '55'}`,
              boxShadow: isActive ? `0 0 8px ${epoch.color}55` : 'none',
            }}
            title={epoch.description}
          >
            {epoch.name}
          </button>
        );
      })}
    </div>
  );
}
