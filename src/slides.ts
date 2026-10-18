// Slide content and timing, shared by the Remotion composition and the web player page.
// Facts checked against Wikipedia (en: Joaquín Sorolla; es: ¡Aún dicen que el pescado es caro!).

export const FPS = 30;
export const TRANSITION = 20; // frames of crossfade between slides

export type Painting = { src: string; title: string; year: string };

export type Slide =
  | { kind: "title"; id: string; chapter: string; seconds: number; image: string; heading: string; subheading: string; dates: string }
  | { kind: "split"; id: string; chapter: string; seconds: number; painting: Painting; eyebrow: string; heading: string; points: string[]; side?: "left" | "right" }
  | { kind: "gallery"; id: string; chapter: string; seconds: number; eyebrow: string; heading: string; paintings: Painting[] }
  | { kind: "quote"; id: string; chapter: string; seconds: number; image: string; quote: string; caption: string }
  | { kind: "credits"; id: string; chapter: string; seconds: number };

export const SLIDES: Slide[] = [
  {
    kind: "title", id: "title", chapter: "Title", seconds: 7, image: "img/pescadoras.jpg",
    heading: "Joaquín Sorolla", subheading: "The Painter of Light", dates: "Valencia 1863 · Cercedilla 1923",
  },
  {
    kind: "split", id: "early", chapter: "Early years", seconds: 10,
    painting: { src: "img/selfportrait.jpg", title: "Self-Portrait", year: "1904" },
    eyebrow: "1863 – 1888", heading: "An orphan from Valencia",
    points: [
      "Born in Valencia on 27 February 1863",
      "Orphaned at two; raised by his aunt and her husband, a locksmith",
      "Copied the masters at the Prado at 18",
      "A grant took him to Rome; Paris showed him modern painting",
    ],
  },
  {
    kind: "split", id: "realism", chapter: "Social realism", seconds: 10, side: "right",
    painting: { src: "img/pescado.jpg", title: "¡Aún dicen que el pescado es caro!", year: "1894" },
    eyebrow: "1890s", heading: "Painting hard lives",
    points: [
      "“And they still say fish is expensive!”: an injured young fisherman",
      "First Class Medal, National Exhibition of Fine Arts, 1895",
      "Bought by the Spanish State; today in the Prado",
    ],
  },
  {
    kind: "split", id: "triste", chapter: "Sad Inheritance", seconds: 10,
    painting: { src: "img/triste.jpg", title: "Triste herencia", year: "1899" },
    eyebrow: "1899 – 1900", heading: "Triste herencia",
    points: [
      "Disabled children bathing at the beach of Valencia",
      "Medal of honour at the Paris Universal Exposition, 1900",
      "Nominated to the Legion of Honour",
    ],
  },
  {
    kind: "gallery", id: "family", chapter: "Family", seconds: 10,
    eyebrow: "Clotilde, María, Joaquín, Elena", heading: "His favourite models",
    paintings: [
      { src: "img/madre.jpg", title: "Madre", year: "1895" },
      { src: "img/clotilde.jpg", title: "Clotilde in Black", year: "1906" },
    ],
  },
  {
    kind: "gallery", id: "light", chapter: "The light of Valencia", seconds: 11,
    eyebrow: "Luminism", heading: "Sunlight as the subject",
    paintings: [
      { src: "img/vela.jpg", title: "Sewing the Sail", year: "1896" },
      { src: "img/pescadoras.jpg", title: "Valencian Fisherwomen", year: "" },
      { src: "img/chicos.jpg", title: "Boys on the Beach", year: "1910" },
    ],
  },
  {
    kind: "quote", id: "seashore", chapter: "Strolling along the seashore", seconds: 9,
    image: "img/seashore.jpg",
    quote: "White dresses, wind and the Mediterranean glare",
    caption: "Strolling along the Seashore, 1909 · Clotilde and María on the beach of Valencia",
  },
  {
    kind: "gallery", id: "beach", chapter: "Beach masterpieces", seconds: 10,
    eyebrow: "1909 – 1916", heading: "Painted outdoors, at full speed",
    paintings: [
      { src: "img/caballo.jpg", title: "The Horse’s Bath", year: "1909" },
      { src: "img/bata.jpg", title: "The Pink Robe", year: "1916" },
    ],
  },
  {
    kind: "split", id: "fame", chapter: "International fame", seconds: 10, side: "right",
    painting: { src: "img/vision.jpg", title: "Vision of Spain: Valencia", year: "1911–1919" },
    eyebrow: "1906 – 1919", heading: "From Paris to New York",
    points: [
      "Paris, 1906: nearly 500 works at the Galerie Georges Petit",
      "New York, 1909: 356 paintings at the Hispanic Society, 195 sold",
      "Vision of Spain: 14 panels, 227 feet long, finished in 1919",
    ],
  },
  {
    kind: "split", id: "legacy", chapter: "Legacy", seconds: 10,
    painting: { src: "img/garden.jpg", title: "The Gardens at the Sorolla Family House", year: "1920" },
    eyebrow: "1920 – today", heading: "The light remains",
    points: [
      "A stroke in 1920, while painting in his Madrid garden, ended his career",
      "Died in Cercedilla on 10 August 1923",
      "His house in Madrid opened as the Museo Sorolla in 1932",
    ],
  },
  { kind: "credits", id: "credits", chapter: "Credits", seconds: 6 },
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
  title: "Danza española No. 5 \u201cAndaluza\u201d",
  composer: "Enrique Granados (1867–1916)",
  performer: "Sharon Isbin at the White House, 2009",
  arrangement: "for solo guitar, a staple of Andrés Segovia\u2019s repertoire",
  license: "Public domain",
  page: "https://commons.wikimedia.org/wiki/File:20091104_Sharon_Isbin_-_Enrique_Granados,_Spanish_Dance_number_5_of_12,_1890_edit_1.ogg",
};
