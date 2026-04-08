export interface StoryBeat {
  year: number;
  mapFocus: { lng: number; lat: number; zoom: number };
  title: string;
  narration: string;
  duration: number; // ms before auto-advance
}

export const STORY_BEATS: StoryBeat[] = [
  {
    year: -1800,
    mapFocus: { lng: 44, lat: 32, zoom: 3.5 },
    title: 'A Family Leaves Mesopotamia',
    narration: 'Around 1800 BCE, a man named Abraham leaves Ur of the Chaldees and journeys west to Canaan. With this single migration, the story of the Jewish people begins.',
    duration: 7000,
  },
  {
    year: -1000,
    mapFocus: { lng: 35, lat: 32, zoom: 4 },
    title: 'David Captures Jerusalem',
    narration: 'King David unites the Twelve Tribes and makes Jerusalem his capital. His son Solomon builds the First Temple on Mount Moriah — the spiritual center of the nation.',
    duration: 7000,
  },
  {
    year: -586,
    mapFocus: { lng: 38, lat: 32, zoom: 3 },
    title: 'Babylon Burns the Temple',
    narration: 'In 586 BCE, Nebuchadnezzar destroys Jerusalem and the First Temple. The elite are marched to Babylon in chains. "By the rivers of Babylon, we sat and wept."',
    duration: 8000,
  },
  {
    year: -516,
    mapFocus: { lng: 37, lat: 32, zoom: 3 },
    title: 'Return and Rebuild',
    narration: 'Cyrus the Great conquers Babylon and issues a decree: the Jews may go home. They rebuild the Temple in 516 BCE. But many choose to stay — the diaspora has already begun.',
    duration: 7000,
  },
  {
    year: -167,
    mapFocus: { lng: 35, lat: 33, zoom: 3 },
    title: 'The Maccabees Rise',
    narration: 'When Antiochus desecrates the Temple, the Maccabees fight back. They win independence and rededicate the Temple — the origin of Hanukkah. For 80 years, Jews rule their own state.',
    duration: 7000,
  },
  {
    year: 70,
    mapFocus: { lng: 35, lat: 32, zoom: 3 },
    title: 'Rome Destroys Everything',
    narration: 'In 70 CE, Roman legions burn Jerusalem and the Second Temple. A million captives are paraded through Rome. Temple-based Judaism is over. Something new must be built from the ashes.',
    duration: 8000,
  },
  {
    year: 200,
    mapFocus: { lng: 40, lat: 33, zoom: 2.8 },
    title: 'A Religion Remade',
    narration: 'At Yavneh, then in Babylon, the rabbis transform Judaism. The Mishnah is written. Prayer replaces sacrifice. A portable faith, carried in books and memory, will survive anything.',
    duration: 7000,
  },
  {
    year: 700,
    mapFocus: { lng: 44, lat: 33, zoom: 2.8 },
    title: 'The Babylonian Golden Age',
    narration: 'Under Islamic rule, the great academies of Sura and Pumbedita lead world Jewry. The Talmud reaches its final form. From Baghdad, Jewish law and learning flow to every corner of the diaspora.',
    duration: 7000,
  },
  {
    year: 1000,
    mapFocus: { lng: -4, lat: 40, zoom: 3.5 },
    title: 'The Golden Age of Spain',
    narration: 'In Umayyad Córdoba, Jewish poets, philosophers, and scientists flourish alongside Muslim scholars. Judah Halevi writes immortal Hebrew poetry. Maimonides is born. It will not last.',
    duration: 7000,
  },
  {
    year: 1170,
    mapFocus: { lng: 10, lat: 47, zoom: 2.5 },
    title: 'The Crusades and Expulsions',
    narration: 'Crusaders massacre Rhineland Jews on their way to Jerusalem. Then come the expulsions — England 1290, France 1306, one German city after another. Jews are driven eastward.',
    duration: 7000,
  },
  {
    year: 1492,
    mapFocus: { lng: -4, lat: 40, zoom: 2.5 },
    title: '1492: The Great Expulsion',
    narration: 'Ferdinand and Isabella give 200,000 Jews ninety days to leave Spain. The refugees scatter to the Ottoman Empire, North Africa, Amsterdam. The Sephardic diaspora is born.',
    duration: 8000,
  },
  {
    year: 1550,
    mapFocus: { lng: 25, lat: 43, zoom: 2.5 },
    title: 'Two Great Refuges',
    narration: 'Poland welcomes Jews with legal protections; by 1650 it houses half of world Jewry. The Ottoman sultans recruit Sephardic exiles. In Safed, the Kabbalists dream of redemption.',
    duration: 7000,
  },
  {
    year: 1650,
    mapFocus: { lng: 25, lat: 48, zoom: 2.5 },
    title: 'Catastrophe in Poland',
    narration: 'The Khmelnytsky Cossack massacres of 1648 kill up to 500,000 Jews in eastern Poland — the worst slaughter before the Holocaust. Survivors flee west. The Hasidic movement will rise from these ashes.',
    duration: 7000,
  },
  {
    year: 1800,
    mapFocus: { lng: 10, lat: 50, zoom: 2.8 },
    title: 'Emancipation',
    narration: 'The French Revolution grants Jews citizenship for the first time. Slowly, Western Europe opens its doors. Moses Mendelssohn argues Jews can be fully modern and fully Jewish.',
    duration: 6000,
  },
  {
    year: 1900,
    mapFocus: { lng: -20, lat: 48, zoom: 1.3 },
    title: 'The Great Migration',
    narration: 'Pogroms drive two million Jews from Eastern Europe to America. New York\'s Lower East Side becomes the largest Jewish city in history. Meanwhile, Zionist pioneers drain swamps in Palestine.',
    duration: 7000,
  },
  {
    year: 1939,
    mapFocus: { lng: 18, lat: 50, zoom: 2.2 },
    title: 'The World Before',
    narration: '16.5 million Jews alive. 9 million in Europe. Ancient communities stretching back a thousand years — Warsaw, Vilna, Thessaloniki, Amsterdam. In a few years, most of them will be gone.',
    duration: 8000,
  },
  {
    year: 1948,
    mapFocus: { lng: 18, lat: 50, zoom: 2.2 },
    title: 'After the Darkness',
    narration: 'Six million murdered. Two-thirds of European Jewry erased. But from the ashes: on May 14, 1948, David Ben-Gurion declares the State of Israel. For the first time in 2,000 years, Jews have a homeland.',
    duration: 9000,
  },
  {
    year: 1970,
    mapFocus: { lng: 30, lat: 35, zoom: 1.8 },
    title: 'Ingathering',
    narration: 'Jews from Iraq, Morocco, Yemen, and Ethiopia are airlifted to Israel. The Six-Day War transforms Jewish identity worldwide. A million Soviet Jews will follow after the Iron Curtain falls.',
    duration: 7000,
  },
  {
    year: 2026,
    mapFocus: { lng: 20, lat: 30, zoom: 1.3 },
    title: 'The Story Continues',
    narration: '16 million Jews. 7.2 million in Israel, 6 million in America, the rest scattered across every continent. Four thousand years, and the story is still being written.',
    duration: 8000,
  },
];
