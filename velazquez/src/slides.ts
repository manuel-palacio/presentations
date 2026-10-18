// Slide content and timing, shared by the Remotion composition and the web player page.
// Facts checked against Wikipedia (en: Diego Velázquez).

export const FPS = 30;
export const TRANSITION = 20; // frames of crossfade between slides

export type Painting = { src: string; title: string; year: string };

export type Slide =
  | { kind: "title"; id: string; chapter: string; seconds: number; image: string; heading: string; subheading: string; dates: string }
  | { kind: "split"; id: string; chapter: string; seconds: number; painting: Painting; eyebrow: string; heading: string; points: string[]; side?: "left" | "right" }
  | { kind: "gallery"; id: string; chapter: string; seconds: number; eyebrow: string; heading: string; paintings: Painting[] }
  | { kind: "quote"; id: string; chapter: string; seconds: number; image: string; quote: string; caption: string; focus?: string }
  | { kind: "credits"; id: string; chapter: string; seconds: number };

export const META = {
  name: "Diego Velázquez",
  tagline: "The Painter of Painters",
  places: "Seville 1599 · Madrid 1660",
  years: "1599 – 1660",
  wikipedia: "https://en.wikipedia.org/wiki/Diego_Vel%C3%A1zquez",
};

export const SLIDES: Slide[] = [
  {
    kind: "title", id: "title", chapter: "Title", seconds: 7, image: "img/breda.jpg",
    heading: META.name, subheading: META.tagline, dates: META.places,
  },
  {
    kind: "split", id: "seville", chapter: "Seville", seconds: 10,
    painting: { src: "img/eggs.jpg", title: "Old Woman Frying Eggs", year: "1618" },
    eyebrow: "1599 – 1622", heading: "A young painter in Seville",
    points: [
      "Baptised in Seville on 6 June 1599",
      "Apprenticed to the painter Francisco Pacheco from 1610",
      "Married Pacheco\u2019s daughter Juana in 1618",
      "Painted bodegones: kitchen scenes full of everyday objects",
    ],
  },
  {
    kind: "split", id: "bodegones", chapter: "The Waterseller", seconds: 9, side: "right",
    painting: { src: "img/water.jpg", title: "The Waterseller of Seville", year: "1618–1622" },
    eyebrow: "Bodegones", heading: "Light on clay, glass and skin",
    points: [
      "A water seller hands a glass to a boy",
      "Called \u201cthe peak of Velázquez\u2019s bodegones\u201d",
      "Ordinary people, painted with the dignity of saints",
    ],
  },
  {
    kind: "split", id: "court", chapter: "Painter to the King", seconds: 10,
    painting: { src: "img/philip.jpg", title: "Philip IV on Horseback", year: "c. 1635" },
    eyebrow: "1622 – 1629", heading: "Painter to the King",
    points: [
      "Travelled to Madrid in April 1622",
      "Philip IV sat for him on 30 August 1623",
      "Settled at court in 1624, where he stayed for the rest of his life",
    ],
  },
  {
    kind: "gallery", id: "italy", chapter: "First journey to Italy", seconds: 10,
    eyebrow: "Italy, 1629 – 1631", heading: "Gods among ordinary men",
    paintings: [
      { src: "img/borrachos.jpg", title: "The Triumph of Bacchus (Los Borrachos)", year: "1629" },
      { src: "img/vulcan.jpg", title: "Apollo in the Forge of Vulcan", year: "1630" },
    ],
  },
  {
    kind: "split", id: "rome", chapter: "Rome", seconds: 10, side: "right",
    painting: { src: "img/innocent.jpg", title: "Portrait of Pope Innocent X", year: "1650" },
    eyebrow: "Second journey to Italy", heading: "A pope, painted as he was",
    points: [
      "Left for Italy in 1649 with his assistant Juan de Pareja",
      "The Pope displayed his portrait approvingly",
      "In November 1650 Velázquez freed Pareja from slavery",
    ],
  },
  {
    kind: "gallery", id: "portraits", chapter: "Portraits", seconds: 10,
    eyebrow: "1635 – 1659", heading: "Looking people in the eye",
    paintings: [
      { src: "img/pareja.jpg", title: "Juan de Pareja", year: "c. 1650" },
      { src: "img/balthasar.jpg", title: "Prince Baltasar Carlos on Horseback", year: "c. 1635" },
      { src: "img/margarita.jpg", title: "Infanta Margarita Teresa in a Blue Dress", year: "1659" },
    ],
  },
  {
    kind: "quote", id: "meninas", chapter: "Las Meninas", seconds: 10,
    image: "img/meninas.jpg", focus: "50% 72%",
    quote: "Who is looking at whom?",
    caption: "Las Meninas, 1656 · the Infanta, her maids of honour, the painter at his easel, and the king and queen in the mirror",
  },
  {
    kind: "split", id: "late", chapter: "Last years", seconds: 10,
    painting: { src: "img/hilanderas.jpg", title: "The Spinners (Las Hilanderas)", year: "c. 1657" },
    eyebrow: "1657 – 1660", heading: "The last masterpieces",
    points: [
      "Las Hilanderas hides the myth of Arachne behind a weaving workshop",
      "Made a Knight of the Order of Santiago in 1659",
      "Died in Madrid on 6 August 1660",
    ],
  },
  {
    kind: "split", id: "legacy", chapter: "Legacy", seconds: 10, side: "right",
    painting: { src: "img/christ.jpg", title: "Christ Crucified", year: "c. 1632" },
    eyebrow: "Legacy", heading: "The painter of painters",
    points: [
      "Only about 110 to 120 of his canvases survive",
      "Manet called him \u201cthe painter of painters\u201d",
      "In 1957 Picasso painted 44 variations of Las Meninas",
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
  src: "audio/ovosomnes.m4a",
  title: "O vos omnes",
  composer: "Tomás Luis de Victoria (1548–1611)",
  performer: "The Tudor Consort",
  arrangement: "a motet for unaccompanied choir",
  license: "CC BY 2.5",
  page: "https://commons.wikimedia.org/wiki/File:Tomas_Luis_de_Victoria_O_vos_omnes_(The_Tudor_Consort).ogg",
};
