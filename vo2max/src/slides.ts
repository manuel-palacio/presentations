// Scene content and timing, shared by the Remotion composition and the web player page.
// All narration and on-screen facts come from SOURCE.md (the presentation script, from the Healthspan article).
// There is no recorded voice: the narration is shown as subtitles, timed by word count.
// Every text exists in English and Spanish (here: narration, chapters, dividers, page texts; the words drawn
// inside the scenes are in text.ts). Timing is shared, so both languages keep the same chapters and music.

export const FPS = 30;
export const DIVIDER = 3 * FPS; // part divider before the first scene of each part
export const FADE = 18; // frames of fade at the start and end of every scene

export type Lang = "en" | "es";
export const LANGS: Lang[] = ["en", "es"];
export type L<T> = Record<Lang, T>;
/** A text: the same in both languages, or one per language. */
export type Text = string | L<string>;
export const tr = (text: Text, lang: Lang): string => (typeof text === "string" ? text : text[lang]);

export type Divider = { numeral: string; title: L<string> };

export type Scene = {
  id: string;
  chapter: L<string>;
  seconds: number; // including the divider, when there is one
  narration: L<string>;
  divider?: Divider;
};

export const META = {
  name: { en: "VO₂ max and ageing", es: "El VO₂ máx y la edad" },
  tagline: {
    en: "Why the body's oxygen engine fades with age, and how interval training wins it back",
    es: "Por qué el motor de oxígeno del cuerpo se apaga con la edad, y cómo los intervalos lo recuperan",
  },
  eyebrow: { en: "Exercise science · healthspan", es: "Ciencia del ejercicio · salud" },
  description: {
    en: "An animated presentation on why VO₂ max declines with age and a concrete interval-training plan to counter it, made with Remotion.",
    es: "Una presentación animada sobre por qué el VO₂ máx disminuye con la edad y un plan concreto de entrenamiento por intervalos para contrarrestarlo, hecha con Remotion.",
  },
  source: {
    title: "Why VO₂ Max Declines With Age, and How to Train the System That Limits It",
    authors: "Daniel Tawfik & Anthony G. Pinzone",
    publisher: "Healthspan",
    date: "2026-04-04",
    url: "https://www.gethealthspan.com/research/article/why-vo2-max-declines-with-age",
  },
  studies: [
    "Capelli, Ferretti, di Prampero et al. (2025), European Journal of Applied Physiology",
    "Mølmen, Almquist & Skattebo (2025), Sports Medicine 55(1)",
  ],
};

/** Part I runs on the first track, part II on the second; they cross-fade at the part II divider. */
export const MUSIC = [
  {
    src: "audio/windswept.m4a", title: "Windswept", composer: "Kevin MacLeod (incompetech.com)", license: "CC BY 3.0",
    page: "https://commons.wikimedia.org/wiki/File:Kevin_MacLeod_-_Windswept.ogg",
  },
  {
    src: "audio/carefree.m4a", title: "Carefree", composer: "Kevin MacLeod (incompetech.com)", license: "CC BY 3.0",
    page: "https://commons.wikimedia.org/wiki/File:Kevin_MacLeod_-_Carefree.ogg",
  },
];

/** Words of the web page and the credits, per language. */
const UI_EN = {
  chapters: "Chapters",
  readArticle: "Read the original article",
  source: "Source",
  sourcePrefix: "Based on the article",
  by: "by",
  studies: "Its figures come from",
  example: "The 12-week progression is an example built on the article's weekly templates, not its prescription.",
  noVoice: "There is no voiceover: the narration runs as subtitles.",
  medical: "Not medical advice: check with your doctor before starting high-intensity training.",
  music: "Music",
  licensed: "licensed under",
  footer: "Made with Remotion. All charts and illustrations are drawn in code.",
};

export const UI: L<typeof UI_EN> = {
  en: UI_EN,
  es: {
    chapters: "Capítulos",
    readArticle: "Leer el artículo original",
    source: "Fuente",
    sourcePrefix: "Basado en el artículo",
    by: "de",
    studies: "Sus cifras proceden de",
    example: "La progresión de 12 semanas es un ejemplo construido sobre las plantillas semanales del artículo, no una prescripción suya.",
    noVoice: "No hay voz en off: la narración aparece como subtítulos.",
    medical: "No es consejo médico: consulta a tu médico antes de empezar a entrenar a alta intensidad.",
    music: "Música",
    licensed: "con licencia",
    footer: "Hecho con Remotion. Todos los gráficos e ilustraciones están dibujados en código.",
  },
};

const PART1: Divider = { numeral: "I", title: { en: "Why it falls", es: "Por qué cae" } };
const PART2: Divider = { numeral: "II", title: { en: "Train it back", es: "Recupéralo entrenando" } };

export const SCENES: Scene[] = [
  {
    id: "intro", chapter: { en: "Title", es: "Inicio" }, seconds: 10,
    narration: {
      en: "VO₂ max is the engine of a long life. Why does it fade with age, and how can we train it back?",
      es: "El VO₂ máx es el motor de una vida larga. ¿Por qué se apaga con la edad, y cómo podemos recuperarlo entrenando?",
    },
  },
  {
    id: "decline", chapter: { en: "The decline", es: "La caída" }, seconds: 25, divider: PART1,
    narration: {
      en: "VO₂ max is the most oxygen your body can use at full effort, and one of the strongest predictors of longevity. In sedentary people it falls about ten percent per decade from around thirty. Between twenty and seventy, almost half is gone.",
      es: "El VO₂ máx es el máximo de oxígeno que tu cuerpo puede usar a pleno esfuerzo, y uno de los mejores predictores de longevidad. En las personas sedentarias cae alrededor de un diez por ciento por década a partir de los treinta. Entre los veinte y los setenta se pierde casi la mitad.",
    },
  },
  {
    id: "fick", chapter: { en: "Pump × extraction", es: "Bomba × extracción" }, seconds: 18,
    narration: {
      en: "Think of it as a simple equation. The heart pumps oxygen-rich blood, and the muscles pull the oxygen out. VO₂ max is the pump times the extraction.",
      es: "Piénsalo como una ecuación sencilla. El corazón bombea sangre cargada de oxígeno y los músculos lo extraen. El VO₂ máx es la bomba por la extracción.",
    },
  },
  {
    id: "curves", chapter: { en: "Heart vs VO₂ max", es: "Corazón frente a VO₂ máx" }, seconds: 20,
    narration: {
      en: "With age the pump weakens: maximal heart rate drops about one beat a year, and maximal cardiac output falls about thirty-one percent from twenty to seventy. But VO₂ max falls forty-six percent. The heart alone doesn't explain the gap.",
      es: "Con la edad la bomba se debilita: la frecuencia cardiaca máxima baja casi un latido al año y el gasto cardiaco máximo cae un treinta y uno por ciento entre los veinte y los setenta. Pero el VO₂ máx cae un cuarenta y seis. El corazón solo no explica la diferencia.",
    },
  },
  {
    id: "split", chapter: { en: "Heart or muscle?", es: "¿Corazón o músculo?" }, seconds: 18,
    narration: {
      en: "In young adults about three quarters of the limit is central, in the heart. By late middle age nearly half of it is peripheral: in the muscles themselves.",
      es: "En los adultos jóvenes, unas tres cuartas partes del límite son centrales, del corazón. Al final de la mediana edad, casi la mitad es periférico: está en los propios músculos.",
    },
  },
  {
    id: "extraction", chapter: { en: "Extraction", es: "Extracción" }, seconds: 16,
    narration: {
      en: "At full effort, young muscle extracts about eighty percent of the oxygen it receives. At seventy-five to eighty, only about sixty percent.",
      es: "A pleno esfuerzo, el músculo joven extrae alrededor del ochenta por ciento del oxígeno que recibe. Entre los setenta y cinco y los ochenta años, solo un sesenta por ciento.",
    },
  },
  {
    id: "cascade", chapter: { en: "The oxygen cascade", es: "La cascada del oxígeno" }, seconds: 26,
    narration: {
      en: "Oxygen travels down a cascade: lungs, blood, capillaries, the muscle fibre and finally the mitochondria. With age the bottlenecks grow in the muscle: fewer capillaries and longer distances, lost muscle fibres, and fewer, less efficient mitochondria.",
      es: "El oxígeno baja por una cascada: pulmones, sangre, capilares, la fibra muscular y por último las mitocondrias. Con la edad, los cuellos de botella crecen en el músculo: menos capilares y distancias más largas, fibras musculares perdidas y mitocondrias menos numerosas y menos eficientes.",
    },
  },
  {
    id: "trainable", chapter: { en: "It's trainable", es: "Se puede entrenar" }, seconds: 14,
    narration: {
      en: "The good news: the cascade is trainable. Capillaries and mitochondria respond to exercise at any age.",
      es: "La buena noticia: la cascada se puede entrenar. Los capilares y las mitocondrias responden al ejercicio a cualquier edad.",
    },
  },
  {
    id: "tools", chapter: { en: "Three tools", es: "Tres herramientas" }, seconds: 27, divider: PART2,
    narration: {
      en: "Three tools. Endurance training builds capillaries best. High-intensity intervals remodel mitochondria and raise VO₂ max as much, in less time. Sprint intervals send the fastest signal per minute. In eight to ten weeks, endurance or intervals raised VO₂ max about twelve percent.",
      es: "Tres herramientas. El entrenamiento de resistencia es el que mejor construye capilares. Los intervalos de alta intensidad remodelan las mitocondrias y suben el VO₂ máx lo mismo, en menos tiempo. Los sprints dan la señal más rápida por minuto. En ocho a diez semanas, la resistencia o los intervalos subieron el VO₂ máx un doce por ciento.",
    },
  },
  {
    id: "zones", chapter: { en: "Hard and easy", es: "Fuerte y suave" }, seconds: 16,
    narration: {
      en: "An interval alternates hard and easy. Hard means about eighty-seven percent of VO₂ max or more: you can barely talk. Easy means under about sixty-five percent: you can hold a conversation.",
      es: "Un intervalo alterna esfuerzo fuerte y suave. Fuerte es un ochenta y siete por ciento del VO₂ máx o más: apenas puedes hablar. Suave es menos de un sesenta y cinco por ciento: puedes mantener una conversación.",
    },
  },
  {
    id: "fourbyfour", chapter: { en: "The 4 × 4 session", es: "La sesión 4 × 4" }, seconds: 24,
    narration: {
      en: "The classic session: ten minutes of warm-up, then four minutes hard and three minutes easy, four times, and a cool-down. About forty minutes in all.",
      es: "La sesión clásica: diez minutos de calentamiento, luego cuatro minutos fuerte y tres suave, cuatro veces, y una vuelta a la calma. Unos cuarenta minutos en total.",
    },
  },
  {
    id: "short", chapter: { en: "Short on time", es: "Con poco tiempo" }, seconds: 16,
    narration: {
      en: "Short on time? Six one-minute efforts with a minute easy in between. Or four to six all-out sprints of twenty to thirty seconds.",
      es: "¿Poco tiempo? Seis esfuerzos de un minuto con un minuto suave entre ellos. O de cuatro a seis sprints a tope de veinte a treinta segundos.",
    },
  },
  {
    id: "week", chapter: { en: "A week that works", es: "Una semana que funciona" }, seconds: 24,
    narration: {
      en: "A week that works: one interval session, one long easy session in Zone 2 of thirty to forty-five minutes, two strength sessions, and easy walking on the other days.",
      es: "Una semana que funciona: una sesión de intervalos, una sesión larga y suave en zona 2 de treinta a cuarenta y cinco minutos, dos de fuerza y paseos tranquilos el resto de días.",
    },
  },
  {
    id: "strength", chapter: { en: "Strength", es: "Fuerza" }, seconds: 14,
    narration: {
      en: "Strength keeps the muscle that oxygen needs: squat, hinge, push, pull and carry, twice a week.",
      es: "La fuerza conserva el músculo que necesita el oxígeno: sentadilla, bisagra de cadera, empuje, tirón y acarreo, dos veces por semana.",
    },
  },
  {
    id: "progression", chapter: { en: "12 weeks", es: "12 semanas" }, seconds: 22,
    narration: {
      en: "Build it up over twelve weeks. Weeks one to four: easy endurance and strength. Five to eight: add a short interval session. Nine to twelve: the full week, with the four-by-four.",
      es: "Ve subiendo en doce semanas. De la uno a la cuatro: resistencia suave y fuerza. De la cinco a la ocho: añade una sesión corta de intervalos. De la nueve a la doce: la semana completa, con el cuatro por cuatro.",
    },
  },
  {
    id: "finale", chapter: { en: "Bend the curve", es: "Dobla la curva" }, seconds: 16,
    narration: {
      en: "Train the pump and the muscle, and the curve bends. Before starting hard intervals, talk to your doctor, especially with a heart condition.",
      es: "Entrena la bomba y el músculo, y la curva se dobla. Antes de empezar con intervalos intensos, consulta a tu médico, sobre todo si tienes una enfermedad cardiaca.",
    },
  },
  { id: "outro", chapter: { en: "Credits", es: "Créditos" }, seconds: 10, narration: { en: "", es: "" } },
];

export const sceneFrames = (scene: Scene) => Math.round(scene.seconds * FPS);
/** Frames before the scene's own content starts (the section divider, if any). */
export const sceneLead = (scene: Scene) => (scene.divider ? DIVIDER : 0);
export const contentFrames = (scene: Scene) => sceneFrames(scene) - sceneLead(scene);

/** First frame of each scene. */
export const sceneStarts = (): number[] => {
  const starts: number[] = [];
  let frame = 0;
  for (const scene of SCENES) {
    starts.push(frame);
    frame += sceneFrames(scene);
  }
  return starts;
};

export const TOTAL_FRAMES = SCENES.reduce((sum, s) => sum + sceneFrames(s), 0);
export const sceneById = (id: string) => SCENES.find((s) => s.id === id)!;

// ---- Subtitles -------------------------------------------------------------------------------------------

/** Most words in one subtitle (Spanish needs more, shorter words for the same line). */
export const MAX_WORDS: L<number> = { en: 16, es: 18 };
const SUB_START = 12; // frames after the content starts
const SUB_END = 24; // frames of silence left at the end of the scene

const words = (text: string) => text.split(/\s+/).filter(Boolean);

/** Words before which a too-long subtitle may be cut, per language. */
const CONJUNCTIONS: L<RegExp> = {
  en: /^(and|but|while|which|who|or|so)$/i,
  es: /^(y|pero|mientras|aunque|o|porque|donde|así)$/i,
};

/** Splits a long sentence at commas, colons and semicolons, then packs the pieces greedily. */
const splitLong = (sentence: string, lang: Lang): string[] => {
  const pieces = sentence.split(/(?<=[,:;])\s+/);
  const out: string[] = [];
  let current = "";
  for (const piece of pieces) {
    const joined = current ? `${current} ${piece}` : piece;
    if (current && words(joined).length > MAX_WORDS[lang]) {
      out.push(current);
      current = piece;
    } else current = joined;
  }
  if (current) out.push(current);
  return out.flatMap((chunk) => splitAtConjunction(chunk, lang));
};

/** A piece that is still too long is cut before the conjunction nearest its middle (or at the middle). */
const splitAtConjunction = (chunk: string, lang: Lang): string[] => {
  const w = words(chunk);
  if (w.length <= MAX_WORDS[lang]) return [chunk];
  const middle = w.length / 2;
  let cut = Math.round(middle);
  let best = Infinity;
  w.forEach((word, i) => {
    if (i > 2 && i < w.length - 2 && CONJUNCTIONS[lang].test(word) && Math.abs(i - middle) < best) {
      best = Math.abs(i - middle);
      cut = i;
    }
  });
  return [...splitAtConjunction(w.slice(0, cut).join(" "), lang), ...splitAtConjunction(w.slice(cut).join(" "), lang)];
};

/** Narration split into subtitle chunks: whole sentences, or phrases of at most MAX_WORDS words. */
export const chunkNarration = (narration: string, lang: Lang): string[] =>
  narration
    .split(/(?<=[.?!])\s+/)
    .filter(Boolean)
    .flatMap((sentence) => (words(sentence).length > MAX_WORDS[lang] ? splitLong(sentence, lang) : [sentence]));

export type Subtitle = { text: string; from: number; to: number };

/** Reading weight of a chunk: its words plus a fixed overhead, so short lines don't flash by. */
const weight = (text: string) => words(text).length + 2.5;

/** Subtitle chunks with start/end frames relative to the scene's content (after the divider). */
export const subtitles = (scene: Scene, lang: Lang): Subtitle[] => {
  const chunks = chunkNarration(scene.narration[lang], lang);
  const total = chunks.reduce((n, c) => n + weight(c), 0);
  const span = contentFrames(scene) - SUB_START - SUB_END;
  let at = SUB_START;
  return chunks.map((text) => {
    const length = (weight(text) / total) * span;
    const sub = { text, from: Math.round(at), to: Math.round(at + length) };
    at += length;
    return sub;
  });
};

/** Frame (relative to the scene's content) at which `phrase` is reached in the narration's subtitles in `lang`. */
export const cue = (scene: Scene, phrase: string, lang: Lang): number => {
  const clean = (w: string) => w.toLowerCase().replace(/[^\p{L}\p{N}'-]/gu, "");
  const target = words(phrase).map(clean);
  for (const sub of subtitles(scene, lang)) {
    const w = words(sub.text).map(clean);
    const index = w.findIndex((_, i) => target.every((t, j) => w[i + j] === t));
    if (index >= 0) return Math.round(sub.from + (index / w.length) * (sub.to - sub.from));
  }
  throw new Error(`cue "${phrase}" not found in ${scene.id} (${lang})`);
};
