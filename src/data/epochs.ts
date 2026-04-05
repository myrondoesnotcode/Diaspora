import type { Epoch } from './types';

export const EPOCHS: Epoch[] = [
  {
    name: 'Persian Return',
    startYear: -500,
    endYear: -201,
    color: '#795548',
    description: 'Cyrus the Great\'s Edict (538 BCE) allows exiles to return from Babylon. Second Temple founded. Three major centers: Judea, Babylon, and Egypt.',
  },
  {
    name: 'Hellenistic Period',
    startYear: -200,
    endYear: 69,
    color: '#4a7c59',
    description: 'Greek and Roman rule transforms the diaspora. Alexandria rivals Babylon. Maccabean revolt (164 BCE) wins Hasmonean independence; Rome gradually tightens its grip.',
  },
  {
    name: 'Roman Diaspora',
    startYear: 70,
    endYear: 399,
    color: '#c0392b',
    description: 'Destruction of the Second Temple scatters Jewish communities across the Roman Empire and beyond.',
  },
  {
    name: 'Geonic Era',
    startYear: 400,
    endYear: 999,
    color: '#d4a017',
    description: 'Babylonian academies (yeshivot) flourish under Sasanian and later Islamic rule. The Geonim lead world Jewry.',
  },
  {
    name: 'Golden Age of Spain',
    startYear: 1000,
    endYear: 1148,
    color: '#f39c12',
    description: 'Umayyad Iberia witnesses an extraordinary flowering of Jewish philosophy, poetry, science, and culture.',
  },
  {
    name: 'Era of Expulsions',
    startYear: 1149,
    endYear: 1549,
    color: '#e74c3c',
    description: 'Crusades, the Black Death, and rising Christian nationalism drive waves of expulsions across Western Europe.',
  },
  {
    name: 'Polish–Ottoman Axis',
    startYear: 1550,
    endYear: 1788,
    color: '#8e44ad',
    description: 'Poland-Lithuania and the Ottoman Empire become twin centers of Jewish life, each harboring hundreds of thousands.',
  },
  {
    name: 'Emancipation',
    startYear: 1789,
    endYear: 1879,
    color: '#2980b9',
    description: 'The French Revolution triggers a century-long struggle for legal equality in Western and Central Europe.',
  },
  {
    name: 'Mass Migration',
    startYear: 1880,
    endYear: 1932,
    color: '#27ae60',
    description: 'Pogroms and poverty propel two million Jews from Eastern Europe to the Americas and Palestine.',
  },
  {
    name: 'Holocaust & Founding',
    startYear: 1933,
    endYear: 1952,
    color: '#888888',
    description: 'Nazi genocide destroys European Jewry. Survivors and refugees help establish the State of Israel in 1948.',
  },
  {
    name: 'Israeli Era',
    startYear: 1953,
    endYear: 2024,
    color: '#2563eb',
    description: 'Israel absorbs waves of Jewish immigrants from the Arab world, Soviet Union, and Ethiopia while diaspora communities reshape.',
  },
];

export function getEpochForYear(year: number): Epoch {
  return (
    EPOCHS.find((e) => year >= e.startYear && year <= e.endYear) ?? EPOCHS[EPOCHS.length - 1]
  );
}
