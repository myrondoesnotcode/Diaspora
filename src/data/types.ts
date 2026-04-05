export type CulturalType = 'Ashkenazi' | 'Sephardic' | 'Mizrahi' | 'Yemenite' | 'Ethiopian' | 'Mixed';

export interface Community {
  id: string;
  name: string;
  lat: number;
  lng: number;
  culturalType: CulturalType;
  populations: Partial<Record<number, number>>;
  significance: string;
}

export type MigrationType = 'forced' | 'voluntary';

export interface Migration {
  id: string;
  from: string;
  to: string;
  startYear: number;
  endYear: number;
  type: MigrationType;
  description: string;
}

export interface Epoch {
  name: string;
  startYear: number;
  endYear: number;
  color: string;
  description: string;
}

export const SNAPSHOT_YEARS = [70, 200, 500, 700, 1000, 1170, 1300, 1492, 1550, 1650, 1800, 1850, 1900, 1939, 1948, 1970, 2000, 2024] as const;
export type SnapshotYear = typeof SNAPSHOT_YEARS[number];

// Historical world Jewish population estimates (Sergio DellaPergola)
export const WORLD_TOTALS: Partial<Record<SnapshotYear, number>> = {
  70: 4_500_000,
  200: 5_000_000,
  500: 4_000_000,
  700: 3_500_000,
  1000: 3_500_000,
  1170: 3_500_000,
  1300: 3_500_000,
  1492: 3_500_000,
  1550: 3_500_000,
  1650: 3_000_000,
  1800: 2_500_000,
  1850: 4_750_000,
  1900: 10_600_000,
  1939: 16_600_000,
  1948: 11_500_000,
  1970: 12_100_000,
  2000: 13_200_000,
  2024: 15_200_000,
};
