import type { Epoch } from './types';

export const EPOCHS: Epoch[] = [
  {
    name: 'Roman Diaspora',
    startYear: 70,
    endYear: 399,
    color: '#ff9a5c',
    description: 'Destruction of the Second Temple scatters Jewish communities across the Roman Empire and beyond.',
  },
  {
    name: 'Geonic Era',
    startYear: 400,
    endYear: 999,
    color: '#ffcf6b',
    description: 'Babylonian academies (yeshivot) flourish under Sasanian and later Islamic rule. The Geonim lead world Jewry.',
  },
  {
    name: 'Golden Age of Spain',
    startYear: 1000,
    endYear: 1148,
    color: '#ffc24d',
    description: 'Umayyad Iberia witnesses an extraordinary flowering of Jewish philosophy, poetry, science, and culture.',
  },
  {
    name: 'Era of Expulsions',
    startYear: 1149,
    endYear: 1549,
    color: '#ff5e52',
    description: 'Crusades, the Black Death, and rising Christian nationalism drive waves of expulsions across Western Europe.',
  },
  {
    name: 'Polish–Ottoman Axis',
    startYear: 1550,
    endYear: 1788,
    color: '#c891ff',
    description: 'Poland-Lithuania and the Ottoman Empire become twin centers of Jewish life, each harboring hundreds of thousands.',
  },
  {
    name: 'Emancipation',
    startYear: 1789,
    endYear: 1879,
    color: '#6fb4ff',
    description: 'The French Revolution triggers a century-long struggle for legal equality in Western and Central Europe.',
  },
  {
    name: 'Mass Migration',
    startYear: 1880,
    endYear: 1932,
    color: '#57e0a6',
    description: 'Pogroms and poverty propel two million Jews from Eastern Europe to the Americas and Palestine.',
  },
  {
    name: 'Holocaust & Founding',
    startYear: 1933,
    endYear: 1952,
    color: '#9aa0ab',
    description: 'Nazi genocide destroys European Jewry. Survivors and refugees help establish the State of Israel in 1948.',
  },
  {
    name: 'Israeli Era',
    startYear: 1953,
    endYear: 2024,
    color: '#7fb3ff',
    description: 'Israel absorbs waves of Jewish immigrants from the Arab world, Soviet Union, and Ethiopia while diaspora communities reshape.',
  },
];

export function getEpochForYear(year: number): Epoch {
  return (
    EPOCHS.find((e) => year >= e.startYear && year <= e.endYear) ?? EPOCHS[EPOCHS.length - 1]
  );
}
