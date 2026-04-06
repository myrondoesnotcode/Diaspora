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
    <div className="flex flex-col gap-2">
      {/* Epoch pills */}
      <div className="flex flex-wrap gap-1.5 justify-center">
        {EPOCHS.map((epoch) => {
          const isActive = epoch.name === activeEpoch.name;
          // Jump to the nearest snapshot year for this epoch
          const midYear = Math.round((epoch.startYear + epoch.endYear) / 2);
          const targetYear = SNAPSHOT_YEARS.reduce((prev, curr) =>
            Math.abs(curr - midYear) < Math.abs(prev - midYear) ? curr : prev
          );

          return (
            <button
              key={epoch.name}
              onClick={() => onSelectYear(targetYear)}
              className="epoch-pill text-xs px-2.5 py-1 rounded-full font-medium transition-all"
              style={{
                backgroundColor: isActive ? epoch.color : epoch.color + '22',
                color: isActive ? '#fff' : epoch.color,
                border: `1px solid ${epoch.color}${isActive ? 'ff' : '55'}`,
                boxShadow: isActive ? `0 0 10px ${epoch.color}66` : 'none',
              }}
              title={epoch.description}
            >
              {epoch.name}
            </button>
          );
        })}
      </div>

      {/* Active epoch description */}
      <div
        className="text-center text-xs px-4 py-1.5 rounded-lg mx-auto max-w-xl"
        style={{
          backgroundColor: activeEpoch.color + '14',
          color: activeEpoch.color,
          border: `1px solid ${activeEpoch.color}30`,
        }}
      >
        {activeEpoch.description}
      </div>
    </div>
  );
}
