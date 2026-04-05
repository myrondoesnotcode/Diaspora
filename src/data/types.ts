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
