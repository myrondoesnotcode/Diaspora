// Scrollytelling chapter definitions. One chapter per epoch, each with a
// camera keyframe, an era palette, narrative copy, and archival imagery.
// All images are public-domain / freely licensed files served locally
// (downloaded from Wikimedia Commons).

export interface EraPalette {
  oceanInner: string;
  oceanOuter: string;
  land: string;
  border: string;
  accent: string;
}

export interface CameraKeyframe {
  lon: number;
  lat: number;
  zoom: number; // multiplier on the base world-fit scale
}

export interface ChapterFact {
  value: string;
  label: string;
}

export interface Chapter {
  id: string;
  index: number;
  title: string;
  dates: string;
  startYear: number;
  endYear: number;
  kicker: string; // small label above the title
  narrative: string[]; // paragraphs
  facts: ChapterFact[];
  image: string; // path under BASE_URL
  imageAlt: string;
  imageCaption: string;
  imageCredit: string;
  ghostYear: string; // giant translucent date shown over the clean-map stretch
  camera: CameraKeyframe;
  palette: EraPalette;
  somber?: boolean; // mutes the visual treatment (Holocaust chapter)
}

export const HERO_CAMERA: CameraKeyframe = { lon: 20, lat: 24, zoom: 1.0 };

export const HERO_PALETTE: EraPalette = {
  oceanInner: '#070a12',
  oceanOuter: '#020409',
  land: '#161c28',
  border: '#333e55',
  accent: '#e8b54d',
};

export const CHAPTERS: Chapter[] = [
  {
    id: 'roman',
    index: 0,
    title: 'The Scattering',
    dates: '70 – 399 CE',
    startYear: 70,
    endYear: 399,
    kicker: 'The Roman Diaspora',
    narrative: [
      'In the summer of 70 CE, after a brutal siege, the legions of Titus breached Jerusalem and burned the Second Temple to the ground. Tens of thousands were killed or enslaved; the spiritual center of the Jewish world was gone in a single season.',
      'Two generations later, the failed Bar Kokhba revolt (132–135 CE) sealed the catastrophe. Rome renamed the devastated province Syria Palaestina, and the center of Jewish life shifted decisively outward — to Alexandria, Rome, Babylon, and the cities of the Mediterranean rim. Exile was no longer an episode. It had become the condition.',
    ],
    facts: [
      { value: '70 CE', label: 'Second Temple destroyed' },
      { value: '132–135', label: 'Bar Kokhba revolt crushed' },
      { value: 'Syria Palaestina', label: "Rome renames Judaea" },
    ],
    image: 'images/eras/01-roman.jpg',
    imageAlt: 'Relief on the Arch of Titus showing Roman soldiers carrying off the Temple menorah',
    imageCaption: 'Roman soldiers parade the Temple menorah through Rome — carved in stone on the Arch of Titus, c. 81 CE.',
    imageCredit: 'Arch of Titus, Rome · Wikimedia Commons',
    ghostYear: '70',
    camera: { lon: 27, lat: 36, zoom: 2.5 },
    palette: {
      oceanInner: '#0c0709',
      oceanOuter: '#030204',
      land: '#1d1614',
      border: '#4a352a',
      accent: '#ff9a5c',
    },
  },
  {
    id: 'geonic',
    index: 1,
    title: 'The Waters of Babylon',
    dates: '400 – 999 CE',
    startYear: 400,
    endYear: 999,
    kicker: 'The Geonic Era',
    narrative: [
      'While Rome fell, Jewish life flowered between the Tigris and Euphrates. In the academies of Sura and Pumbedita, the Babylonian Talmud was compiled, studied, and expounded — the text that would anchor Jewish law for the next fifteen centuries.',
      'The heads of these academies, the Geonim, were accepted as the spiritual leaders of Jews everywhere. From Baghdad under the Abbasid caliphs, their legal responsa traveled by caravan and ship to communities from Spain to Persia — a world religion administered by correspondence.',
    ],
    facts: [
      { value: 'Sura & Pumbedita', label: 'The great Talmudic academies' },
      { value: '~450 years', label: 'The Geonim lead world Jewry' },
      { value: 'Baghdad', label: 'Seat of the Exilarch' },
    ],
    image: 'images/eras/02-geonic.jpg',
    imageAlt: 'Illuminated carpet page of the Leningrad Codex',
    imageCaption: 'A carpet page of the Leningrad Codex (1008 CE), the oldest complete Hebrew Bible — the crowning fruit of the Masoretic schools.',
    imageCredit: 'Leningrad Codex · Wikimedia Commons',
    ghostYear: '500',
    camera: { lon: 44, lat: 33, zoom: 2.7 },
    palette: {
      oceanInner: '#0c0a05',
      oceanOuter: '#030302',
      land: '#1e1a12',
      border: '#554522',
      accent: '#ffcf6b',
    },
  },
  {
    id: 'spain',
    index: 2,
    title: 'The Golden Age',
    dates: '1000 – 1148',
    startYear: 1000,
    endYear: 1148,
    kicker: 'Al-Andalus',
    narrative: [
      'In Muslim Iberia, something extraordinary happened: Jews rose to the heights of a brilliant civilization. Hasdai ibn Shaprut served as de facto vizier in Córdoba; Samuel ha-Nagid commanded armies; Judah Halevi wrote poetry that is still sung.',
      'Philosophy, medicine, astronomy, Hebrew grammar, and verse flourished side by side with Arabic learning. Maimonides was born in Córdoba near the era’s end — and driven out as a child when the Almohad invasion of 1148 brought the golden age to a violent close.',
    ],
    facts: [
      { value: 'Córdoba', label: 'Cradle of the Golden Age' },
      { value: 'Judah Halevi', label: 'Poetry still sung today' },
      { value: '1148', label: 'Almohad invasion ends the era' },
    ],
    image: 'images/eras/03-spain.jpg',
    imageAlt: 'Intricate stucco walls inside the medieval Synagogue of Córdoba',
    imageCaption: 'The Synagogue of Córdoba — Hebrew inscriptions woven into Mudéjar stucco, where two civilizations shared one wall.',
    imageCredit: 'Synagogue of Córdoba · Wikimedia Commons',
    ghostYear: '1090',
    camera: { lon: -5, lat: 38.5, zoom: 3.1 },
    palette: {
      oceanInner: '#0d0a04',
      oceanOuter: '#040302',
      land: '#201a10',
      border: '#5e4a1f',
      accent: '#ffc24d',
    },
  },
  {
    id: 'expulsions',
    index: 3,
    title: 'The Wandering Centuries',
    dates: '1149 – 1549',
    startYear: 1149,
    endYear: 1549,
    kicker: 'The Era of Expulsions',
    narrative: [
      'Door after door slammed shut. England expelled its Jews in 1290. France followed, finally and completely, in 1394. Massacres accompanying the Black Death emptied the Rhineland. Then came the greatest blow: the Alhambra Decree of 1492, by which Ferdinand and Isabella expelled every unconverted Jew from Spain — tens of thousands of people, with estimates ranging far higher.',
      'Yet every expulsion traced a new arrow on the map. Sephardic exiles rebuilt in Ottoman Salonika and Istanbul, in Amsterdam, in North Africa — carrying Spanish romances and the Ladino language with them for five hundred years.',
    ],
    facts: [
      { value: '1290', label: 'Expelled from England' },
      { value: '1492', label: 'The Alhambra Decree' },
      { value: 'Salonika', label: 'A majority-Jewish Ottoman city by 1567' },
    ],
    image: 'images/eras/04-expulsions.jpg',
    imageAlt: 'Painting of the expulsion of the Jews from Spain, with Ferdinand and Isabella enthroned',
    imageCaption: 'Emilio Sala’s “Expulsion of the Jews from Spain” (1889): Torquemada presses the Catholic Monarchs to sign the decree.',
    imageCredit: 'Emilio Sala, 1889 · Wikimedia Commons',
    ghostYear: '1492',
    camera: { lon: 3, lat: 44, zoom: 2.2 },
    palette: {
      oceanInner: '#0e0607',
      oceanOuter: '#040203',
      land: '#1f1414',
      border: '#5c322e',
      accent: '#ff5e52',
    },
  },
  {
    id: 'polish-ottoman',
    index: 4,
    title: 'Twin Havens',
    dates: '1550 – 1788',
    startYear: 1550,
    endYear: 1788,
    kicker: 'The Polish–Ottoman Axis',
    narrative: [
      'Two empires became the twin poles of the Jewish world. In Poland–Lithuania, Jews ran their own parliament — the Council of Four Lands — and built wooden synagogues whose painted ceilings blazed with lions, zodiacs, and Hebrew prayer.',
      'In the Ottoman south, Sephardic Salonika and Istanbul thrived under the sultans’ protection. The axis was tested by horror — the Khmelnytsky massacres of 1648 destroyed hundreds of communities — yet by the 18th century, more Jews lived in the Polish lands than anywhere on earth.',
    ],
    facts: [
      { value: 'Council of Four Lands', label: 'Jewish self-government, 1580–1764' },
      { value: '1648', label: 'Khmelnytsky massacres' },
      { value: '#1 in the world', label: 'Poland’s Jewish population by the 1700s' },
    ],
    image: 'images/eras/05-polish.jpg',
    imageAlt: 'Brilliantly painted wooden synagogue ceiling covered in zodiac medallions and Hebrew text',
    imageCaption: 'The painted heavens of the Gwoździec synagogue — a reconstruction of the lost wooden synagogues of the Commonwealth.',
    imageCredit: 'POLIN Museum, Warsaw · Wikimedia Commons',
    ghostYear: '1648',
    camera: { lon: 25, lat: 45, zoom: 2.1 },
    palette: {
      oceanInner: '#0b0710',
      oceanOuter: '#030208',
      land: '#191423',
      border: '#4a3a63',
      accent: '#c891ff',
    },
  },
  {
    id: 'emancipation',
    index: 5,
    title: 'Out of the Ghetto',
    dates: '1789 – 1879',
    startYear: 1789,
    endYear: 1879,
    kicker: 'Emancipation',
    narrative: [
      'On 27 September 1791, revolutionary France became the first state in Europe to grant Jews full legal equality. Napoleon carried the principle across the continent at bayonet-point, even convening a “Grand Sanhedrin” of rabbis in 1807 to bind Judaism to the modern state.',
      'Ghetto walls came down, city by city. Jews entered universities, parliaments, and concert halls; German Jewry invented Reform Judaism; an urban Jewish middle class was born. Equality on paper, though, would prove easier to win than acceptance.',
    ],
    facts: [
      { value: '1791', label: 'France grants full citizenship' },
      { value: '1807', label: 'Napoleon’s Grand Sanhedrin' },
      { value: 'City by city', label: 'Europe’s ghetto walls fall' },
    ],
    image: 'images/eras/06-emancipation.jpg',
    imageAlt: 'Allegorical engraving of Napoleon restoring the Jewish faith, with a menorah and tablets',
    imageCaption: 'A French allegory of 1806: Napoleon raises Judaism from her knees, restoring “le culte des Israélites.”',
    imageCredit: 'French engraving, 1806 · Wikimedia Commons',
    ghostYear: '1791',
    camera: { lon: 8, lat: 48, zoom: 2.6 },
    palette: {
      oceanInner: '#060a12',
      oceanOuter: '#020408',
      land: '#131a26',
      border: '#35507a',
      accent: '#6fb4ff',
    },
  },
  {
    id: 'mass-migration',
    index: 6,
    title: 'The Great Crossing',
    dates: '1880 – 1932',
    startYear: 1880,
    endYear: 1932,
    kicker: 'Mass Migration',
    narrative: [
      'The assassination of the tsar in 1881 was falsely blamed on the Jews, and the Russian Empire erupted in pogroms. The 1903 Kishinev massacre — 49 dead, hundreds wounded, whole streets destroyed — told Eastern Europe’s Jews everything they needed to know about their future.',
      'So they left. Between 1881 and 1924, more than two million Jews crossed the ocean, most through Ellis Island into the tenements of New York’s Lower East Side — the largest voluntary migration in Jewish history. Smaller streams flowed to Argentina, Britain, South Africa, and Ottoman Palestine.',
    ],
    facts: [
      { value: '2,000,000+', label: 'Jews leave Eastern Europe, 1881–1924' },
      { value: '1903', label: 'The Kishinev pogrom' },
      { value: 'New York', label: 'Becomes the largest Jewish city on earth' },
    ],
    image: 'images/eras/07-migration.jpg',
    imageAlt: 'Lewis Hine photograph of immigrants climbing at Ellis Island carrying baskets and cases',
    imageCaption: '“Climbing into the Promised Land” — Lewis Hine’s photograph of new arrivals at Ellis Island, 1908.',
    imageCredit: 'Lewis W. Hine, 1908 · Brooklyn Museum / Wikimedia Commons',
    ghostYear: '1904',
    camera: { lon: -32, lat: 44, zoom: 1.35 },
    palette: {
      oceanInner: '#05100f',
      oceanOuter: '#020606',
      land: '#12201d',
      border: '#2c5a4d',
      accent: '#57e0a6',
    },
  },
  {
    id: 'holocaust',
    index: 7,
    title: 'Darkness and Dawn',
    dates: '1933 – 1952',
    startYear: 1933,
    endYear: 1952,
    kicker: 'The Holocaust & the Founding',
    somber: true,
    narrative: [
      'Between 1941 and 1945, Nazi Germany and its collaborators murdered six million Jews — two out of every three Jews in Europe. A thousand years of Ashkenazi civilization: the yeshivas, the Yiddish theaters, the wooden synagogues — annihilated. Watch the lights on this map go out.',
      'Three years after the camps were liberated, on 14 May 1948, David Ben-Gurion stood in the Tel Aviv Museum and proclaimed the State of Israel. Within four years, hundreds of thousands of survivors and refugees — including some 49,000 Yemenite Jews airlifted in Operation Magic Carpet — had come home to a state that had not existed when the war began.',
    ],
    facts: [
      { value: '6,000,000', label: 'Jews murdered in the Holocaust' },
      { value: 'May 14, 1948', label: 'The State of Israel is declared' },
      { value: '~49,000', label: 'Yemenite Jews airlifted, 1949–50' },
    ],
    image: 'images/eras/08-founding.jpg',
    imageAlt: 'David Ben-Gurion declaring the State of Israel beneath a portrait of Theodor Herzl',
    imageCaption: 'Ben-Gurion proclaims the State of Israel beneath Herzl’s portrait, Tel Aviv, 14 May 1948.',
    imageCredit: 'Rudi Weissenstein, 1948 · Wikimedia Commons',
    ghostYear: '1948',
    camera: { lon: 23, lat: 44, zoom: 1.9 },
    palette: {
      oceanInner: '#08080a',
      oceanOuter: '#020203',
      land: '#16161a',
      border: '#38383f',
      accent: '#9aa0ab',
    },
  },
  {
    id: 'israel',
    index: 8,
    title: 'The Ingathering',
    dates: '1953 – 2024',
    startYear: 1953,
    endYear: 2024,
    kicker: 'The Israeli Era',
    narrative: [
      'The map redrew itself one last time. Ancient communities across the Arab world — Baghdad, Cairo, Casablanca, Sana’a — emptied into Israel. Nearly a million Jews arrived from the collapsing Soviet Union. In 1991, Operation Solomon airlifted over 14,000 Ethiopian Jews to Israel in a single 36-hour weekend.',
      'Today roughly 15.8 million Jews live worldwide — about 85% of them in just two centers, Israel and the United States. Two millennia after the Temple fell, the diaspora hasn’t ended. It has come full circle: a scattered people, and a center once more.',
    ],
    facts: [
      { value: '~1,000,000', label: 'Soviet Jews arrive, 1989 onward' },
      { value: '36 hours', label: 'Operation Solomon airlifts 14,000+ Ethiopian Jews' },
      { value: '15.8M', label: 'Jews worldwide today' },
    ],
    image: 'images/eras/09-israel.jpg',
    imageAlt: 'Aerial view of Jerusalem’s Old City and the Temple Mount',
    imageCaption: 'Jerusalem’s Old City from the air — the point on the map where this story began, and where it returns.',
    imageCredit: 'Andrew Shiva · Wikimedia Commons, CC BY-SA 4.0',
    ghostYear: '2024',
    camera: { lon: 18, lat: 30, zoom: 1.15 },
    palette: {
      oceanInner: '#050a16',
      oceanOuter: '#02040c',
      land: '#101a2e',
      border: '#2c4a78',
      accent: '#7fb3ff',
    },
  },
];
