// Scene content and timing, shared by the Remotion composition and the web player page.
// All on-screen text and narration come from SOURCE.md (the presentation script); nothing is added here.
// There is no recorded voice: the narration is shown as subtitles, timed by word count.
// Every text exists in English and Spanish (here: narration, chapters, dividers, page texts; the words drawn
// inside the scenes are in text.ts). Timing is shared, so both languages keep the same chapters and music.

export const FPS = 30;
export const DIVIDER = 3 * FPS; // section divider before each theme
export const FADE = 18; // frames of fade at the start and end of every scene

export type Lang = "en" | "es";
export const LANGS: Lang[] = ["en", "es"];
export type L<T> = Record<Lang, T>;
/** A text: the same in both languages, or one per language. */
export type Text = string | L<string>;
export const tr = (text: Text, lang: Lang): string => (typeof text === "string" ? text : text[lang]);

export type Divider = { numeral: string; title: L<string>; spoiler?: boolean };

export type Scene = {
  id: string;
  chapter: L<string>;
  seconds: number;
  narration: L<string>;
  divider?: Divider;
};

export const META = {
  name: { en: "The Unbearable Lightness of Being", es: "La insoportable levedad del ser" },
  author: "Milan Kundera",
  year: "1984",
  tagline: {
    en: "On choices we can't undo, love, and the happiness we overlook",
    es: "Sobre las decisiones que no podemos deshacer, el amor y la felicidad que pasamos por alto",
  },
  eyebrow: { en: "A novel by Milan Kundera · 1984", es: "Una novela de Milan Kundera · 1984" },
  wikipedia: {
    en: "https://en.wikipedia.org/wiki/The_Unbearable_Lightness_of_Being",
    es: "https://es.wikipedia.org/wiki/La_insoportable_levedad_del_ser",
  },
  description: {
    en: "An animated presentation about Milan Kundera's novel The Unbearable Lightness of Being (1984), made with Remotion.",
    es: "Una presentación animada sobre la novela de Milan Kundera La insoportable levedad del ser (1984), hecha con Remotion.",
  },
  source: {
    title: "La insoportable levedad del ser, de Milan Kundera - Análisis",
    channel: "Club de los lectores muermos",
    host: "Fabián C. Barrio",
    url: "https://www.youtube.com/watch?v=p-OaSA0n3cY",
  },
};

export const MUSIC = {
  src: "audio/gymnopedie.m4a",
  title: { en: "Gymnopédie No. 1 (Lent et douloureux)", es: "Gymnopédie n.º 1 (Lent et douloureux)" },
  composer: "Erik Satie (1866–1925)",
  performer: "Robin Alciatore (Musopen)",
  arrangement: { en: "for solo piano", es: "para piano solo" },
  license: { en: "Public domain", es: "Dominio público" },
  page: "https://commons.wikimedia.org/wiki/File:Erik_Satie_-_gymnopedies_-_la_1_ere._lent_et_douloureux.ogg",
} satisfies Record<string, Text>;

/** Words of the web page and the credits, per language. */
const UI_EN = {
  musicCredit: (lang: Lang) =>
    `Music: ${tr(MUSIC.title, lang)} by ${MUSIC.composer}, ${tr(MUSIC.arrangement, lang)}, performed by ${MUSIC.performer} (${tr(MUSIC.license, lang)}).`,
  madeWith: "Made with Remotion.",
  basedOn: "Based on the analysis by",
  duration: (min: number, sec: number) => `a ${min} min ${sec} s presentation`,
  chapters: "Chapters",
  wikipedia: "Read more on Wikipedia",
  watchSource: "Watch the original analysis",
  source: "Source",
  sourcePrefix: "Based on the analysis",
  by: "by",
  noVoice: "There is no voiceover: the narration runs as subtitles.",
  music: "Music",
  performedBy: "performed by",
  footer: "Made with Remotion. All illustrations are drawn in code; no film stills or photographs.",
};

export const UI: L<typeof UI_EN> = {
  en: UI_EN,
  es: {
    musicCredit: (lang: Lang) =>
      `Música: ${tr(MUSIC.title, lang)}, de ${MUSIC.composer}, ${tr(MUSIC.arrangement, lang)}, interpretada por ${MUSIC.performer} (${tr(MUSIC.license, lang).toLowerCase()}).`,
    madeWith: "Hecho con Remotion.",
    basedOn: "Basado en el análisis de",
    duration: (min: number, sec: number) => `una presentación de ${min} min ${sec} s`,
    chapters: "Capítulos",
    wikipedia: "Leer más en Wikipedia",
    watchSource: "Ver el análisis original",
    source: "Fuente",
    sourcePrefix: "Basado en el análisis",
    by: "de",
    noVoice: "No hay voz en off: la narración aparece como subtítulos.",
    music: "Música",
    performedBy: "interpretada por",
    footer: "Hecho con Remotion. Todas las ilustraciones están dibujadas en código; ni fotogramas de la película ni fotografías.",
  },
};

export const SCENES: Scene[] = [
  {
    id: "intro", chapter: { en: "Title", es: "Inicio" }, seconds: 12,
    narration: {
      en: "One life. No rehearsal, no second take. That is the problem at the heart of Milan Kundera's most famous novel.",
      es: "Una sola vida. Sin ensayo, sin segunda toma. Ese es el problema que late en el corazón de la novela más famosa de Milan Kundera.",
    },
  },
  {
    id: "hook", chapter: { en: "Why it unsettles us", es: "Por qué inquieta" }, seconds: 22,
    narration: {
      en: "The disturbing thing about this book is how easily we recognize ourselves in characters who should feel foreign. Kundera looks at people with tenderness and irony at once: too contradictory to take completely seriously, too fragile to mock without compassion. We finish the novel without answers, but with better questions.",
      es: "Lo inquietante de este libro es la facilidad con que nos reconocemos en personajes que deberían resultarnos ajenos. Kundera mira a la gente con ternura e ironía a la vez: demasiado contradictoria para tomarla del todo en serio, demasiado frágil para burlarse de ella sin compasión. Terminamos la novela sin respuestas, pero con mejores preguntas.",
    },
  },
  {
    id: "characters", chapter: { en: "The characters", es: "Los personajes" }, seconds: 24,
    narration: {
      en: "Four people. A surgeon who cannot renounce his lovers. A woman who needs to be loved to the point of illness. An artist for whom freedom means always leaving. And an intellectual who needs every emotion to be a cause.",
      es: "Cuatro personas. Un cirujano incapaz de renunciar a sus amantes. Una mujer que necesita ser amada hasta enfermar. Una artista para quien la libertad significa marcharse siempre. Y un intelectual que necesita que cada emoción sea una causa.",
    },
  },
  {
    id: "plot", chapter: { en: "The story", es: "La historia" }, seconds: 30,
    narration: {
      en: "Prague, the 1960s. Tomás is a respected surgeon who has arranged his life to enjoy sex without emotional obligations. Then he meets Teresa, who soon appears at his door with a suitcase, and he falls hopelessly in love. But he keeps seeing other women, including the painter Sabina. They love each other, hurt each other, and can't find a way to live together. Then, in August 1968, the tanks arrive. They flee to Switzerland, but exile solves nothing. And through it all there's a dog, Karenin.",
      es: "Praga, años sesenta. Tomás es un cirujano respetado que ha organizado su vida para disfrutar del sexo sin ataduras emocionales. Entonces conoce a Teresa, que pronto se presenta en su puerta con una maleta, y él se enamora sin remedio. Pero sigue viendo a otras mujeres, entre ellas la pintora Sabina. Se quieren, se hacen daño y no encuentran la manera de vivir juntos. Y en agosto de 1968 llegan los tanques. Huyen a Suiza, pero el exilio no resuelve nada. Y en medio de todo hay un perro, Karenin.",
    },
  },
  {
    id: "author", chapter: { en: "Milan Kundera", es: "Milan Kundera" }, seconds: 30,
    narration: {
      en: "Kundera was born on April first, a fitting date for a writer who spent his life studying the cruel jokes existence plays on us. His father was a pianist, and his novels work like compositions: themes appear, vanish, and return with new meanings. He lived both the enthusiasm of the revolution and the censorship that followed, was expelled from the Party, and went into exile in France. He died in Paris in 2023, at ninety-four.",
      es: "Kundera nació un 1 de abril, día de bromas en medio mundo: una fecha muy apropiada para un escritor que pasó la vida estudiando las bromas crueles que nos gasta la existencia. Su padre era pianista, y sus novelas funcionan como composiciones: los temas aparecen, desaparecen y vuelven con significados nuevos. Vivió el entusiasmo de la revolución y la censura que vino después, fue expulsado del Partido y se exilió en Francia. Murió en París en 2023, a los noventa y cuatro años.",
    },
  },
  {
    id: "context", chapter: { en: "Prague, 1968", es: "Praga, 1968" }, seconds: 32,
    narration: {
      en: "In early 1968 Czechoslovakia tried to loosen its regime: the Prague Spring. Newspapers spoke more freely and people began to believe in a more open society. Then, on the night of August twentieth, Warsaw Pact troops invaded. Imagine going out for bread and finding a foreign tank parked by the pharmacy. The repression that followed had an almost comic name: normalization. Kundera lived it, and wrote the novel in exile. Its question goes beyond history: how much of our life really belongs to us?",
      es: "A principios de 1968, Checoslovaquia intentó aflojar su régimen: la Primavera de Praga. Los periódicos hablaban con más libertad y la gente empezó a creer en una sociedad más abierta. Entonces, la noche del 20 de agosto, invadieron el país las tropas del Pacto de Varsovia. Imagina salir a por pan y encontrarte un tanque extranjero aparcado junto a la farmacia. La represión que siguió tuvo un nombre casi cómico: la normalización. Kundera la vivió, y escribió la novela en el exilio. Su pregunta va más allá de la historia: ¿cuánto de nuestra vida nos pertenece de verdad?",
    },
  },
  {
    id: "influences", chapter: { en: "Related works", es: "Obras relacionadas" }, seconds: 22,
    narration: {
      en: "The novel talks with Anna Karenina, which gives the dog his name, and with Nietzsche's eternal return. It continues Kundera's earlier work on memory and power. And there's a 1988 film, but it can't capture the novel's narrator, who keeps stepping in to argue with us.",
      es: "La novela dialoga con Ana Karenina, que da nombre al perro, y con el eterno retorno de Nietzsche. Continúa la obra anterior de Kundera sobre la memoria y el poder. Y hay una película de 1988, pero no logra captar al narrador de la novela, que no deja de intervenir para discutir con nosotros.",
    },
  },
  {
    id: "theme1", chapter: { en: "I · One life only", es: "I · Una sola vida" }, seconds: 45,
    divider: { numeral: "I", title: { en: "One life only", es: "Una sola vida" } },
    narration: {
      en: "We live only once. We can't marry two people, live twenty years with each, and then decide who was right. When Teresa goes back to Prague, Tomás gets his freedom back, and discovers it no longer pleases him. He follows her into an occupied country and gives up a promising career. Was it the right decision? He'll never know. The host tells his own story: he left a radio job he loved for a lot of money at a dot-com, and still imagines how wonderful radio would have been. But imaginary lives never have to pay their bills. The lesson: stop demanding guarantees from the future. Decide with the information you have, accept uncertainty, and judge old decisions by what you knew then. You may never know you chose the best path, but you can know why you chose it.",
      es: "Solo vivimos una vez. No podemos casarnos con dos personas, vivir veinte años con cada una y luego decidir quién tenía razón. Cuando Teresa vuelve a Praga, Tomás recupera su libertad, y descubre que ya no le gusta. La sigue a un país ocupado y renuncia a una carrera prometedora. ¿Fue la decisión correcta? Nunca lo sabrá. El presentador cuenta su propia historia: dejó un trabajo en la radio que le encantaba por mucho dinero en una puntocom, y aún imagina lo maravillosa que habría sido la radio. Pero las vidas imaginarias nunca tienen que pagar facturas. La lección: deja de exigirle garantías al futuro. Decide con la información que tienes, acepta la incertidumbre y juzga las decisiones pasadas por lo que sabías entonces. Quizá nunca sepas si elegiste el mejor camino, pero puedes saber por qué lo elegiste.",
    },
  },
  {
    id: "theme2", chapter: { en: "II · Love ≠ compatibility", es: "II · Amor ≠ compatibilidad" }, seconds: 45,
    divider: { numeral: "II", title: { en: "Love ≠ compatibility", es: "Amor ≠ compatibilidad" } },
    narration: {
      en: "Teresa grew up in a home where her privacy meant nothing, and took refuge in books. When she meets Tomás, he has a book open on the table, and to her that means everything. But Tomás believes desire and love can be separated. For Teresa, every affair erases her uniqueness. Don't divide them into hero and villain: Tomás truly loves her and sacrifices for her, and still hurts her again and again. The lesson is that love and compatibility are different things. You can negotiate and compromise, but you can't build a relationship forever on the hope that the other person will one day want what they never wanted. Ask yourself: could I live in peace with this person if, ten years from now, they were essentially the same?",
      es: "Teresa creció en una casa donde su intimidad no valía nada, y se refugió en los libros. Cuando conoce a Tomás, él tiene un libro abierto sobre la mesa, y para ella eso lo significa todo. Pero Tomás cree que el deseo y el amor pueden separarse. Para Teresa, cada aventura borra lo que la hace única. No los dividas en héroe y villano: Tomás la quiere de verdad y se sacrifica por ella, y aun así la hiere una y otra vez. La lección es que el amor y la compatibilidad son cosas distintas. Se puede negociar y ceder, pero no se puede construir una relación para siempre con la esperanza de que el otro quiera algún día lo que nunca ha querido. Pregúntate: ¿podría vivir en paz con esta persona si, dentro de diez años, siguiera siendo esencialmente la misma?",
    },
  },
  {
    id: "theme3", chapter: { en: "III · Misunderstood words", es: "III · Palabras incomprendidas" }, seconds: 38,
    divider: { numeral: "III", title: { en: "A dictionary of misunderstood words", es: "Un diccionario de palabras incomprendidas" } },
    narration: {
      en: "Sabina has spent her life escaping anything that could limit her. In Switzerland she's with Franz, a professor who adores her. Kundera gives them a little dictionary of misunderstood words: they use the same words but mean different things. It happens all the time. A couple argues about freedom, but for one it means a weekly dinner with friends and for the other something else entirely. The fix is simple: translate big words into concrete behavior. Franz leaves his wife, convinced it proves his love. To Sabina, it turns a free relationship into a cage, and she disappears. Same event, two incompatible readings. Love doesn't make us telepathic. Caring means working to understand what things mean to the other person.",
      es: "Sabina se ha pasado la vida huyendo de todo lo que pudiera limitarla. En Suiza está con Franz, un profesor que la adora. Kundera les dedica un pequeño diccionario de palabras incomprendidas: usan las mismas palabras, pero quieren decir cosas distintas. Pasa constantemente. Una pareja discute sobre la libertad, pero para uno significa cenar con los amigos una vez por semana y para el otro algo completamente distinto. La solución es sencilla: traducir las grandes palabras a conductas concretas. Franz deja a su mujer, convencido de que así demuestra su amor. Para Sabina, eso convierte una relación libre en una jaula, y desaparece. El mismo hecho, dos lecturas incompatibles. El amor no nos vuelve telépatas. Querer a alguien es esforzarse por entender lo que las cosas significan para el otro.",
    },
  },
  {
    id: "theme4", chapter: { en: "IV · Kitsch", es: "IV · El kitsch" }, seconds: 35,
    divider: { numeral: "IV", title: { en: "Kitsch", es: "El kitsch" } },
    narration: {
      en: "Kundera devotes a fascinating part of the book to kitsch. Picture an advert: a perfect family at breakfast, golden light, everyone smiling. Now picture what was left out of the frame: the mortgage that keeps the father awake, the marriage that's gone months without intimacy, the sick grandmother. Kitsch removes everything that spoils the picture. And there's a second emotion: being moved by how wonderful it is that everyone is moved, which makes us feel good and superior. Think of social media, where life ends up serving the image. Our memory does the same thing, rewriting the past to protect our self-esteem. So the question is: how much are we willing to sacrifice to keep that image intact?",
      es: "Kundera dedica una parte fascinante del libro al kitsch. Imagina un anuncio: una familia perfecta desayunando, luz dorada, todos sonrientes. Ahora imagina lo que quedó fuera del encuadre: la hipoteca que no deja dormir al padre, el matrimonio que lleva meses sin intimidad, la abuela enferma. El kitsch elimina todo lo que estropea la imagen. Y hay una segunda emoción: conmoverse por lo maravilloso que es que todos se conmuevan, que nos hace sentir buenos y superiores. Piensa en las redes sociales, donde la vida acaba al servicio de la imagen. Nuestra memoria hace lo mismo: reescribe el pasado para proteger nuestra autoestima. Así que la pregunta es: ¿cuánto estamos dispuestos a sacrificar para mantener intacta esa imagen?",
    },
  },
  {
    id: "theme5", chapter: { en: "V · Happiness", es: "V · La felicidad" }, seconds: 40,
    divider: { numeral: "V", title: { en: "Happiness", es: "La felicidad" }, spoiler: true },
    narration: {
      en: "Tomás refuses to retract a critical article, loses his profession, and ends up cleaning windows. And something surprising happens: the man who fought so hard for his freedom finds serenity in routine and commitment. Teresa realizes what he has given up for her. Then there's Karenin, the dog. He loves repetition: the same walks, the same hours, the same rituals. We humans tend to despise what repeats; we want extraordinary trips and unforgettable passions, while most of our life goes by unnoticed. The novel separates what we have achieved from what we are able to enjoy. So ask: if everything you use to prove your life matters vanished tomorrow, what would still be worth getting up for?",
      es: "Tomás se niega a retractarse de un artículo crítico, pierde su profesión y acaba limpiando ventanas. Y ocurre algo sorprendente: el hombre que tanto luchó por su libertad encuentra la serenidad en la rutina y el compromiso. Teresa se da cuenta de todo lo que él ha sacrificado por ella. Y luego está Karenin, el perro. Le encanta la repetición: los mismos paseos, las mismas horas, los mismos rituales. Los humanos solemos despreciar lo que se repite; queremos viajes extraordinarios y pasiones inolvidables, mientras la mayor parte de nuestra vida pasa sin que nos demos cuenta. La novela separa lo que hemos conseguido de lo que somos capaces de disfrutar. Así que pregúntate: si mañana desapareciera todo lo que usas para demostrar que tu vida importa, ¿por qué seguiría valiendo la pena levantarse?",
    },
  },
  {
    id: "finale", chapter: { en: "The dance", es: "El baile" }, seconds: 25,
    narration: {
      en: "Kundera begins with the problem of a life lived only once, and after desire, jealousy, humiliation and exile, he leaves us watching two people dance together in a room. They could have had other lives. But they are dancing. Perhaps the great human tragedy is realizing too late that, while we were busy asking whether our life was worth it, we missed a good part of it. Next time you enjoy a simple moment, don't ask more of it. And if you have someone to dance with, dance.",
      es: "Kundera empieza con el problema de una vida que se vive una sola vez y, tras el deseo, los celos, la humillación y el exilio, nos deja mirando a dos personas que bailan juntas en una habitación. Podrían haber tenido otras vidas. Pero están bailando. Quizá la gran tragedia humana sea darse cuenta demasiado tarde de que, mientras nos preguntábamos si nuestra vida valía la pena, nos perdimos buena parte de ella. La próxima vez que disfrutes de un momento sencillo, no le pidas más. Y si tienes a alguien con quien bailar, baila.",
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
