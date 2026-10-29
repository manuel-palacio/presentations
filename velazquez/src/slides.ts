// Slide content and timing, shared by the Remotion composition and the web player page.
// Facts checked against Wikipedia (en: Diego Velázquez); Spanish titles as the Museo del Prado gives them.
// Every text exists in English and Spanish: a plain string is the same in both, `{ en, es }` differs.
// Timing (slides, seconds) is shared, so both languages stay in sync with the music and the chapters.

export const FPS = 30;
export const TRANSITION = 20; // frames of crossfade between slides

export type Lang = "en" | "es";
export const LANGS: Lang[] = ["en", "es"];
export type L<T> = Record<Lang, T>;
/** A text: the same in both languages, or one per language. */
export type Text = string | L<string>;
export const tr = (text: Text, lang: Lang): string => (typeof text === "string" ? text : text[lang]);

export type Painting = { src: string; title: Text; year: Text };

export type Slide =
  | { kind: "title"; id: string; chapter: Text; seconds: number; image: string; heading: Text; subheading: Text; dates: Text }
  | { kind: "split"; id: string; chapter: Text; seconds: number; painting: Painting; eyebrow: Text; heading: Text; points: L<string[]>; side?: "left" | "right" }
  | { kind: "gallery"; id: string; chapter: Text; seconds: number; eyebrow: Text; heading: Text; paintings: Painting[] }
  | { kind: "quote"; id: string; chapter: Text; seconds: number; image: string; quote: Text; caption: Text; focus?: string }
  | { kind: "credits"; id: string; chapter: Text; seconds: number };

export const META = {
  name: "Diego Velázquez",
  tagline: { en: "The Painter of Painters", es: "El pintor de pintores" },
  places: { en: "Seville 1599 · Madrid 1660", es: "Sevilla 1599 · Madrid 1660" },
  years: "1599 – 1660",
  wikipedia: {
    en: "https://en.wikipedia.org/wiki/Diego_Vel%C3%A1zquez",
    es: "https://es.wikipedia.org/wiki/Diego_Vel%C3%A1zquez",
  },
  description: {
    en: "An animated presentation about the Spanish painter Diego Velázquez (1599–1660), made with Remotion.",
    es: "Una presentación animada sobre el pintor español Diego Velázquez (1599–1660), hecha con Remotion.",
  },
  footer: {
    en: "Made with Remotion. Paintings by Diego Velázquez via Wikimedia Commons.",
    es: "Hecho con Remotion. Cuadros de Diego Velázquez, vía Wikimedia Commons.",
  },
} satisfies Record<string, Text>;

const circa = (year: string): L<string> => ({ en: `c. ${year}`, es: `h. ${year}` });

export const SLIDES: Slide[] = [
  {
    kind: "title", id: "title", chapter: { en: "Title", es: "Inicio" }, seconds: 7, image: "img/breda.jpg",
    heading: META.name, subheading: META.tagline, dates: META.places,
  },
  {
    kind: "split", id: "seville", chapter: { en: "Seville", es: "Sevilla" }, seconds: 10,
    painting: { src: "img/eggs.jpg", title: { en: "Old Woman Frying Eggs", es: "Vieja friendo huevos" }, year: "1618" },
    eyebrow: "1599 – 1622", heading: { en: "A young painter in Seville", es: "Un joven pintor en Sevilla" },
    points: {
      en: [
        "Baptised in Seville on 6 June 1599",
        "Apprenticed to the painter Francisco Pacheco from 1610",
        "Married Pacheco’s daughter Juana in 1618",
        "Painted bodegones: kitchen scenes full of everyday objects",
      ],
      es: [
        "Bautizado en Sevilla el 6 de junio de 1599",
        "Aprendiz del pintor Francisco Pacheco desde 1610",
        "En 1618 se casó con Juana, la hija de Pacheco",
        "Pintó bodegones: escenas de cocina llenas de objetos cotidianos",
      ],
    },
  },
  {
    kind: "split", id: "bodegones", chapter: { en: "The Waterseller", es: "El aguador" }, seconds: 9, side: "right",
    painting: { src: "img/water.jpg", title: { en: "The Waterseller of Seville", es: "El aguador de Sevilla" }, year: "1618–1622" },
    eyebrow: "Bodegones", heading: { en: "Light on clay, glass and skin", es: "Luz sobre barro, vidrio y piel" },
    points: {
      en: [
        "A water seller hands a glass to a boy",
        "Called “the peak of Velázquez’s bodegones”",
        "Ordinary people, painted with the dignity of saints",
      ],
      es: [
        "Un aguador ofrece una copa a un muchacho",
        "Considerado «la cumbre de los bodegones de Velázquez»",
        "Gente corriente, pintada con la dignidad de los santos",
      ],
    },
  },
  {
    kind: "split", id: "court", chapter: { en: "Painter to the King", es: "Pintor del rey" }, seconds: 10,
    painting: { src: "img/philip.jpg", title: { en: "Philip IV on Horseback", es: "Felipe IV, a caballo" }, year: circa("1635") },
    eyebrow: "1622 – 1629", heading: { en: "Painter to the King", es: "Pintor del rey" },
    points: {
      en: [
        "Travelled to Madrid in April 1622",
        "Philip IV sat for him on 30 August 1623",
        "Settled at court in 1624, where he stayed for the rest of his life",
      ],
      es: [
        "Viajó a Madrid en abril de 1622",
        "Felipe IV posó para él el 30 de agosto de 1623",
        "En 1624 se instaló en la corte, donde pasó el resto de su vida",
      ],
    },
  },
  {
    kind: "gallery", id: "italy", chapter: { en: "First journey to Italy", es: "Primer viaje a Italia" }, seconds: 10,
    eyebrow: { en: "Italy, 1629 – 1631", es: "Italia, 1629 – 1631" }, heading: { en: "Gods among ordinary men", es: "Dioses entre hombres corrientes" },
    paintings: [
      { src: "img/borrachos.jpg", title: { en: "The Triumph of Bacchus (Los Borrachos)", es: "El triunfo de Baco (Los borrachos)" }, year: "1629" },
      { src: "img/vulcan.jpg", title: { en: "Apollo in the Forge of Vulcan", es: "La fragua de Vulcano" }, year: "1630" },
    ],
  },
  {
    kind: "split", id: "rome", chapter: { en: "Rome", es: "Roma" }, seconds: 10, side: "right",
    painting: { src: "img/innocent.jpg", title: { en: "Portrait of Pope Innocent X", es: "Retrato de Inocencio X" }, year: "1650" },
    eyebrow: { en: "Second journey to Italy", es: "Segundo viaje a Italia" }, heading: { en: "A pope, painted as he was", es: "Un papa, pintado tal como era" },
    points: {
      en: [
        "Left for Italy in 1649 with his assistant Juan de Pareja",
        "The Pope displayed his portrait approvingly",
        "In November 1650 Velázquez freed Pareja from slavery",
      ],
      es: [
        "Partió hacia Italia en 1649 con su ayudante Juan de Pareja",
        "Al papa le agradó su retrato y lo mostró en público",
        "En noviembre de 1650 Velázquez liberó a Pareja de la esclavitud",
      ],
    },
  },
  {
    kind: "gallery", id: "portraits", chapter: { en: "Portraits", es: "Retratos" }, seconds: 10,
    eyebrow: "1635 – 1659", heading: { en: "Looking people in the eye", es: "Mirar a la gente a los ojos" },
    paintings: [
      { src: "img/pareja.jpg", title: "Juan de Pareja", year: circa("1650") },
      { src: "img/balthasar.jpg", title: { en: "Prince Baltasar Carlos on Horseback", es: "El príncipe Baltasar Carlos, a caballo" }, year: circa("1635") },
      { src: "img/margarita.jpg", title: { en: "Infanta Margarita Teresa in a Blue Dress", es: "La infanta Margarita Teresa con vestido azul" }, year: "1659" },
    ],
  },
  {
    kind: "quote", id: "meninas", chapter: "Las Meninas", seconds: 10,
    image: "img/meninas.jpg", focus: "50% 72%",
    quote: { en: "Who is looking at whom?", es: "¿Quién mira a quién?" },
    caption: {
      en: "Las Meninas, 1656 · the Infanta, her maids of honour, the painter at his easel, and the king and queen in the mirror",
      es: "Las Meninas, 1656 · la infanta, sus damas de honor, el pintor ante su caballete y los reyes en el espejo",
    },
  },
  {
    kind: "split", id: "late", chapter: { en: "Last years", es: "Últimos años" }, seconds: 10,
    painting: { src: "img/hilanderas.jpg", title: { en: "The Spinners (Las Hilanderas)", es: "Las hilanderas" }, year: circa("1657") },
    eyebrow: "1657 – 1660", heading: { en: "The last masterpieces", es: "Las últimas obras maestras" },
    points: {
      en: [
        "Las Hilanderas hides the myth of Arachne behind a weaving workshop",
        "Made a Knight of the Order of Santiago in 1659",
        "Died in Madrid on 6 August 1660",
      ],
      es: [
        "Las hilanderas esconde el mito de Aracne tras un taller de tejedoras",
        "Nombrado caballero de la Orden de Santiago en 1659",
        "Murió en Madrid el 6 de agosto de 1660",
      ],
    },
  },
  {
    kind: "split", id: "legacy", chapter: { en: "Legacy", es: "Legado" }, seconds: 10, side: "right",
    painting: { src: "img/christ.jpg", title: { en: "Christ Crucified", es: "Cristo crucificado" }, year: circa("1632") },
    eyebrow: { en: "Legacy", es: "Legado" }, heading: { en: "The painter of painters", es: "El pintor de pintores" },
    points: {
      en: [
        "Only about 110 to 120 of his canvases survive",
        "Manet called him “the painter of painters”",
        "In 1957 Picasso painted 44 variations of Las Meninas",
      ],
      es: [
        "Solo se conservan entre 110 y 120 de sus lienzos",
        "Manet lo llamó «el pintor de los pintores»",
        "En 1957 Picasso pintó 44 variaciones de Las Meninas",
      ],
    },
  },
  { kind: "credits", id: "credits", chapter: { en: "Credits", es: "Créditos" }, seconds: 6 },
];

export const slideFrames = (slide: Slide) => Math.round(slide.seconds * FPS);

/** First frame of each slide, accounting for the crossfade overlap. */
export const slideStarts = (): number[] => {
  const starts: number[] = [];
  let frame = 0;
  for (const slide of SLIDES) {
    starts.push(frame);
    frame += slideFrames(slide) - TRANSITION;
  }
  return starts;
};

export const TOTAL_FRAMES = SLIDES.reduce((sum, s) => sum + slideFrames(s), 0) - TRANSITION * (SLIDES.length - 1);

export const MUSIC = {
  src: "audio/ovosomnes.m4a",
  title: "O vos omnes",
  composer: "Tomás Luis de Victoria (1548–1611)",
  performer: "The Tudor Consort",
  arrangement: { en: "a motet for unaccompanied choir", es: "un motete para coro a cappella" },
  license: "CC BY 2.5",
  page: "https://commons.wikimedia.org/wiki/File:Tomas_Luis_de_Victoria_O_vos_omnes_(The_Tudor_Consort).ogg",
} satisfies Record<string, Text>;

/** Words around names and titles, for the video and the page. */
const UI_EN = {
  imagesCredit: (n: number) => `All ${n} images: Wikimedia Commons, public domain or CC0. Made with Remotion.`,
  musicCredit: (lang: Lang) =>
    `Music: ${tr(MUSIC.title, lang)} by ${MUSIC.composer}, ${tr(MUSIC.arrangement, lang)}, performed by ${tr(MUSIC.performer, lang)} (${tr(MUSIC.license, lang)}).`,
  duration: (min: number, sec: number) => `a ${min} min ${sec} s presentation`,
  chapters: "Chapters",
  wikipedia: "Read more on Wikipedia",
  music: "Music",
  by: "by",
  performedBy: "performed by",
  imageCredits: "Image credits",
  /** An image license as written in credits.json, in this language. */
  license: (license: string) => license,
};

export const UI: L<typeof UI_EN> = {
  en: UI_EN,
  es: {
    imagesCredit: (n: number) => `Las ${n} imágenes: Wikimedia Commons, dominio público o CC0. Hecho con Remotion.`,
    musicCredit: (lang: Lang) =>
      `Música: ${tr(MUSIC.title, lang)}, de ${MUSIC.composer}, ${tr(MUSIC.arrangement, lang)}, interpretada por ${tr(MUSIC.performer, lang)} (${tr(MUSIC.license, lang)}).`,
    duration: (min: number, sec: number) => `una presentación de ${min} min ${sec} s`,
    chapters: "Capítulos",
    wikipedia: "Leer más en Wikipedia",
    music: "Música",
    by: "de",
    performedBy: "interpretada por",
    imageCredits: "Créditos de las imágenes",
    license: (license: string) => (license === "Public domain" ? "Dominio público" : license),
  },
};
