import type { Epoch } from './types';

export const EPOCHS: Epoch[] = [
  {
    name: 'Roman Diaspora',
    startYear: 70,
    endYear: 399,
    color: '#c0392b',
    description: 'Destruction of the Second Temple scatters Jewish communities across the Roman Empire and beyond.',
    longDescription: 'The destruction of the Second Temple by Rome in 70 CE shattered the center of Jewish religious and political life, scattering communities from Judea across the empire and into Babylonia. Synagogues replaced the Temple as the heart of worship, enabling Judaism to survive and adapt without a homeland. By 200 CE, Jewish communities stretched from Mesopotamia to North Africa, Spain, and the Rhine valley.',
    keyEvents: [
      { year: 70, label: 'Destruction of the Second Temple; Jerusalem falls to Rome' },
      { year: 135, label: 'Bar Kokhba revolt crushed; Judea renamed Syria Palaestina' },
      { year: 200, label: 'Mishnah compiled by Rabbi Judah HaNasi in Galilee' },
    ],
  },
  {
    name: 'Geonic Era',
    startYear: 400,
    endYear: 999,
    color: '#d4a017',
    description: 'Babylonian academies (yeshivot) flourish under Sasanian and later Islamic rule. The Geonim lead world Jewry.',
    longDescription: 'Under Sasanian Persian and later Abbasid Islamic rule, the great yeshivot of Babylonia — at Sura and Pumbedita — became the undisputed centers of Jewish scholarship. The Geonim (academy heads) issued legal rulings that shaped Jewish practice worldwide. The Talmud, compiled in this era, became the foundation of all subsequent Jewish law and learning.',
    keyEvents: [
      { year: 500, label: 'Babylonian Talmud reaches its final edited form' },
      { year: 638, label: 'Arab conquest of the Middle East; Jews gain relative toleration' },
      { year: 900, label: 'Saadia Gaon leads Sura academy; pioneers Hebrew grammar and philosophy' },
    ],
  },
  {
    name: 'Golden Age of Spain',
    startYear: 1000,
    endYear: 1148,
    color: '#f39c12',
    description: 'Umayyad Iberia witnesses an extraordinary flowering of Jewish philosophy, poetry, science, and culture.',
    longDescription: 'Under the Umayyad caliphate of Córdoba, Jewish scholars, poets, and physicians flourished alongside Muslim and Christian counterparts in one of history\'s most remarkable cultural syntheses. Figures like Maimonides, Judah Halevi, and Samuel ibn Naghrillah produced works in philosophy, poetry, and medicine that shaped Western civilization. The period ended violently with the Almohad invasion from North Africa.',
    keyEvents: [
      { year: 1013, label: 'Samuel ibn Naghrillah becomes vizier of Granada' },
      { year: 1058, label: 'Judah Halevi born; becomes greatest Hebrew poet of the medieval era' },
      { year: 1135, label: 'Maimonides born in Córdoba; will transform Jewish philosophy' },
    ],
  },
  {
    name: 'Era of Expulsions',
    startYear: 1149,
    endYear: 1549,
    color: '#e74c3c',
    description: 'Crusades, the Black Death, and rising Christian nationalism drive waves of expulsions across Western Europe.',
    longDescription: 'Four centuries of escalating persecution culminated in the mass expulsion of Jews from England (1290), France (1306), and most devastatingly, Spain (1492) and Portugal (1497). The Black Death sparked continent-wide massacres as Jews were falsely blamed for poisoning wells. Refugees flooded into Poland-Lithuania and the Ottoman Empire, reshaping the geography of world Jewry.',
    keyEvents: [
      { year: 1290, label: 'Expulsion of Jews from England by Edward I' },
      { year: 1348, label: 'Black Death massacres: Jews blamed and killed across Europe' },
      { year: 1492, label: 'Alhambra Decree expels 200,000 Jews from Spain' },
    ],
  },
  {
    name: 'Polish–Ottoman Axis',
    startYear: 1550,
    endYear: 1788,
    color: '#8e44ad',
    description: 'Poland-Lithuania and the Ottoman Empire become twin centers of Jewish life, each harboring hundreds of thousands.',
    longDescription: 'After the expulsions from Western Europe, Poland-Lithuania and the Ottoman Empire emerged as the twin pillars of Jewish civilization. Polish Jewry developed a rich culture of Talmudic scholarship, Yiddish literature, and autonomous communal governance (the Council of Four Lands). In the Ottoman Empire, Sephardic exiles from Spain rebuilt thriving communities in Salonika, Istanbul, and Safed, blending Spanish-Jewish and Eastern traditions.',
    keyEvents: [
      { year: 1567, label: 'Council of Four Lands established; Jewish self-governance in Poland' },
      { year: 1648, label: 'Khmelnytsky massacres kill hundreds of thousands of Polish Jews' },
      { year: 1665, label: 'Sabbatai Zevi declared Messiah; mass messianic movement sweeps Jewry' },
    ],
  },
  {
    name: 'Emancipation',
    startYear: 1789,
    endYear: 1879,
    color: '#2980b9',
    description: 'The French Revolution triggers a century-long struggle for legal equality in Western and Central Europe.',
    longDescription: 'The French Revolution\'s proclamation of universal rights opened the door to Jewish civic equality for the first time in Western Europe. Over the following century, Jews in France, Germany, Britain, and Austria-Hungary gained legal emancipation — the right to live, work, and study without restriction. In exchange, many Jews embraced secular culture and national identity, transforming both European society and Judaism itself.',
    keyEvents: [
      { year: 1791, label: 'France grants full citizenship to Jews; first in Europe' },
      { year: 1810, label: 'Hamburg Temple founded; Reform Judaism movement begins' },
      { year: 1871, label: 'German unification brings full emancipation to German Jews' },
    ],
  },
  {
    name: 'Mass Migration',
    startYear: 1880,
    endYear: 1932,
    color: '#27ae60',
    description: 'Pogroms and poverty propel two million Jews from Eastern Europe to the Americas and Palestine.',
    longDescription: 'A wave of Russian pogroms beginning in 1881 set off the largest Jewish migration in history. Over fifty years, more than two million Jews left the Pale of Settlement for the United States, Argentina, and Palestine. New York\'s Lower East Side became the world\'s largest Jewish city. Simultaneously, Zionist pioneers began draining swamps and founding kibbutzim in Ottoman and later British Palestine.',
    keyEvents: [
      { year: 1881, label: 'Russian pogroms begin; mass emigration to USA accelerates' },
      { year: 1897, label: 'First Zionist Congress in Basel; Herzl founds the Zionist movement' },
      { year: 1924, label: 'US Immigration Act cuts Jewish immigration; Palestine absorbs more' },
    ],
  },
  {
    name: 'Holocaust & Founding',
    startYear: 1933,
    endYear: 1952,
    color: '#888888',
    description: 'Nazi genocide destroys European Jewry. Survivors and refugees help establish the State of Israel in 1948.',
    longDescription: 'The Nazi regime\'s systematic murder of six million Jews — two thirds of European Jewry — was the most destructive event in Jewish history. Entire communities that had existed for a thousand years were annihilated. Yet out of catastrophe came rebirth: Holocaust survivors and Jewish refugees from Arab lands converged on British Mandatory Palestine, and in 1948 the State of Israel declared independence, ending two millennia of statelessness.',
    keyEvents: [
      { year: 1939, label: 'World War II begins; Nazi persecution escalates to genocide' },
      { year: 1945, label: 'Holocaust ends; six million Jews murdered across Europe' },
      { year: 1948, label: 'State of Israel declared independent on May 14' },
    ],
  },
  {
    name: 'Israeli Era',
    startYear: 1953,
    endYear: 2024,
    color: '#2563eb',
    description: 'Israel absorbs waves of Jewish immigrants from the Arab world, Soviet Union, and Ethiopia while diaspora communities reshape.',
    longDescription: 'Israel\'s first decades were defined by mass immigration (aliyah): Jews from Arab countries, Holocaust survivors, and eventually a million immigrants from the collapsing Soviet Union transformed the young state. Meanwhile, diaspora communities in North America, France, and Argentina became major centers of Jewish life and culture. The 21st century sees a global Jewish population of roughly 15 million, split nearly evenly between Israel and the diaspora.',
    keyEvents: [
      { year: 1967, label: 'Six-Day War; Israel captures Jerusalem, West Bank, Sinai, Golan' },
      { year: 1990, label: 'Soviet collapse; one million Jews emigrate to Israel' },
      { year: 2005, label: 'Israel disengages from Gaza; Ethiopian Jewish community nearly complete' },
    ],
  },
];

export function getEpochForYear(year: number): Epoch {
  return (
    EPOCHS.find((e) => year >= e.startYear && year <= e.endYear) ?? EPOCHS[EPOCHS.length - 1]
  );
}
