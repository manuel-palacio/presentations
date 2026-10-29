// Slide content and timing, shared by the Remotion composition and the web player page.
// Facts checked against Wikipedia (en: Joaquín Sorolla; es: ¡Aún dicen que el pescado es caro!).
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
  name: "Joaquín Sorolla",
  tagline: { en: "The Painter of Light", es: "El pintor de la luz" },
  places: "Valencia 1863 · Cercedilla 1923",
  years: "1863 – 1923",
  wikipedia: {
    en: "https://en.wikipedia.org/wiki/Joaqu%C3%ADn_Sorolla",
    es: "https://es.wikipedia.org/wiki/Joaqu%C3%ADn_Sorolla",
  },
  description: {
    en: "An animated presentation about the Spanish painter Joaquín Sorolla (1863–1923), made with Remotion.",
    es: "Una presentación animada sobre el pintor español Joaquín Sorolla (1863–1923), hecha con Remotion.",
  },
  footer: {
    en: "Made with Remotion. Paintings by Joaquín Sorolla y Bastida via Wikimedia Commons.",
    es: "Hecho con Remotion. Cuadros de Joaquín Sorolla y Bastida, vía Wikimedia Commons.",
  },
} satisfies Record<string, Text>;

export const SLIDES: Slide[] = [
  {
    kind: "title", id: "title", chapter: { en: "Title", es: "Inicio" }, seconds: 7, image: "img/pescadoras.jpg",
    heading: META.name, subheading: META.tagline, dates: META.places,
  },
  {
    kind: "split", id: "early", chapter: { en: "Early years", es: "Primeros años" }, seconds: 10,
    painting: { src: "img/selfportrait.jpg", title: { en: "Self-Portrait", es: "Autorretrato" }, year: "1904" },
    eyebrow: "1863 – 1888", heading: { en: "An orphan from Valencia", es: "Un huérfano de Valencia" },
    points: {
      en: [
        "Born in Valencia on 27 February 1863",
        "Orphaned at two; raised by his aunt and her husband, a locksmith",
        "Copied the masters at the Prado at 18",
        "A grant took him to Rome; Paris showed him modern painting",
      ],
      es: [
        "Nace en Valencia el 27 de febrero de 1863",
        "Huérfano a los dos años, lo crían su tía y el marido de esta, cerrajero",
        "A los 18 años copia a los maestros en el Prado",
        "Una beca lo lleva a Roma; en París descubre la pintura moderna",
      ],
    },
  },
  {
    kind: "split", id: "realism", chapter: { en: "Social realism", es: "Realismo social" }, seconds: 10, side: "right",
    painting: { src: "img/pescado.jpg", title: "¡Aún dicen que el pescado es caro!", year: "1894" },
    eyebrow: { en: "1890s", es: "Década de 1890" }, heading: { en: "Painting hard lives", es: "Pintar vidas duras" },
    points: {
      en: [
        "“And they still say fish is expensive!”: an injured young fisherman",
        "First Class Medal, National Exhibition of Fine Arts, 1895",
        "Bought by the Spanish State; today in the Prado",
      ],
      es: [
        "«¡Aún dicen que el pescado es caro!»: un joven pescador herido",
        "Medalla de primera clase en la Exposición Nacional de Bellas Artes de 1895",
        "Lo compró el Estado; hoy está en el Prado",
      ],
    },
  },
  {
    kind: "split", id: "triste", chapter: { en: "Sad Inheritance", es: "Triste herencia" }, seconds: 10,
    painting: { src: "img/triste.jpg", title: "Triste herencia", year: "1899" },
    eyebrow: "1899 – 1900", heading: "Triste herencia",
    points: {
      en: [
        "Disabled children bathing at the beach of Valencia",
        "Medal of honour at the Paris Universal Exposition, 1900",
        "Nominated to the Legion of Honour",
      ],
      es: [
        "Niños con discapacidad bañándose en la playa de Valencia",
        "Medalla de honor en la Exposición Universal de París de 1900",
        "Propuesto para la Legión de Honor",
      ],
    },
  },
  {
    kind: "gallery", id: "family", chapter: { en: "Family", es: "Familia" }, seconds: 10,
    eyebrow: "Clotilde, María, Joaquín, Elena", heading: { en: "His favourite models", es: "Sus modelos favoritos" },
    paintings: [
      { src: "img/madre.jpg", title: "Madre", year: "1895" },
      { src: "img/clotilde.jpg", title: { en: "Clotilde in Black", es: "Clotilde con traje negro" }, year: "1906" },
    ],
  },
  {
    kind: "gallery", id: "light", chapter: { en: "The light of Valencia", es: "La luz de Valencia" }, seconds: 11,
    eyebrow: { en: "Luminism", es: "Luminismo" }, heading: { en: "Sunlight as the subject", es: "La luz del sol como tema" },
    paintings: [
      { src: "img/vela.jpg", title: { en: "Sewing the Sail", es: "Cosiendo la vela" }, year: "1896" },
      { src: "img/pescadoras.jpg", title: { en: "Valencian Fisherwomen", es: "Pescadoras valencianas" }, year: "" },
      { src: "img/chicos.jpg", title: { en: "Boys on the Beach", es: "Chicos en la playa" }, year: "1910" },
    ],
  },
  {
    kind: "quote", id: "seashore", chapter: { en: "Strolling along the seashore", es: "Paseo a orillas del mar" }, seconds: 9,
    image: "img/seashore.jpg",
    quote: { en: "White dresses, wind and the Mediterranean glare", es: "Vestidos blancos, viento y el resplandor del Mediterráneo" },
    caption: {
      en: "Strolling along the Seashore, 1909 · Clotilde and María on the beach of Valencia",
      es: "Paseo a orillas del mar, 1909 · Clotilde y María en la playa de Valencia",
    },
  },
  {
    kind: "gallery", id: "beach", chapter: { en: "Beach masterpieces", es: "Obras maestras en la playa" }, seconds: 10,
    eyebrow: "1909 – 1916", heading: { en: "Painted outdoors, at full speed", es: "Al aire libre y a toda velocidad" },
    paintings: [
      { src: "img/caballo.jpg", title: { en: "The Horse’s Bath", es: "El baño del caballo" }, year: "1909" },
      { src: "img/bata.jpg", title: { en: "The Pink Robe", es: "La bata rosa" }, year: "1916" },
    ],
  },
  {
    kind: "split", id: "fame", chapter: { en: "International fame", es: "Fama internacional" }, seconds: 10, side: "right",
    painting: { src: "img/vision.jpg", title: { en: "Vision of Spain: Valencia", es: "Visión de España: Valencia" }, year: "1911–1919" },
    eyebrow: "1906 – 1919", heading: { en: "From Paris to New York", es: "De París a Nueva York" },
    points: {
      en: [
        "Paris, 1906: nearly 500 works at the Galerie Georges Petit",
        "New York, 1909: 356 paintings at the Hispanic Society, 195 sold",
        "Vision of Spain: 14 panels, 227 feet long, finished in 1919",
      ],
      es: [
        "París, 1906: casi 500 obras en la Galerie Georges Petit",
        "Nueva York, 1909: 356 cuadros en la Hispanic Society; vendió 195",
        "Visión de España: 14 paneles y unos 70 metros de largo, terminados en 1919",
      ],
    },
  },
  {
    kind: "split", id: "legacy", chapter: { en: "Legacy", es: "Legado" }, seconds: 10,
    painting: { src: "img/garden.jpg", title: { en: "The Gardens at the Sorolla Family House", es: "Jardín de la casa Sorolla" }, year: "1920" },
    eyebrow: { en: "1920 – today", es: "De 1920 a hoy" }, heading: { en: "The light remains", es: "La luz permanece" },
    points: {
      en: [
        "A stroke in 1920, while painting in his Madrid garden, ended his career",
        "Died in Cercedilla on 10 August 1923",
        "His house in Madrid opened as the Museo Sorolla in 1932",
      ],
      es: [
        "Un ictus en 1920, mientras pintaba en su jardín de Madrid, puso fin a su carrera",
        "Murió en Cercedilla el 10 de agosto de 1923",
        "Su casa de Madrid abrió como Museo Sorolla en 1932",
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
  src: "audio/andaluza.m4a",
  title: { en: "Danza española No. 5 “Andaluza”", es: "Danza española n.º 5 «Andaluza»" },
  composer: "Enrique Granados (1867–1916)",
  performer: { en: "Sharon Isbin at the White House, 2009", es: "Sharon Isbin en la Casa Blanca, 2009" },
  arrangement: {
    en: "for solo guitar, a staple of Andrés Segovia’s repertoire",
    es: "para guitarra sola, un clásico del repertorio de Andrés Segovia",
  },
  license: { en: "Public domain", es: "Dominio público" },
  page: "https://commons.wikimedia.org/wiki/File:20091104_Sharon_Isbin_-_Enrique_Granados,_Spanish_Dance_number_5_of_12,_1890_edit_1.ogg",
} satisfies Record<string, Text>;

/** Words around names and titles, for the video and the page. */
const UI_EN = {
  imagesCredit: (n: number) => `All ${n} images: Wikimedia Commons, public domain or CC0. Made with Remotion.`,
  musicCredit: (lang: Lang) =>
    `Music: ${tr(MUSIC.title, lang)} by ${MUSIC.composer}, ${tr(MUSIC.arrangement, lang)}, performed by ${tr(MUSIC.performer, lang)} (${tr(MUSIC.license, lang).toLowerCase()}).`,
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
      `Música: ${tr(MUSIC.title, lang)}, de ${MUSIC.composer}, ${tr(MUSIC.arrangement, lang)}, interpretada por ${tr(MUSIC.performer, lang)} (${tr(MUSIC.license, lang).toLowerCase()}).`,
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
