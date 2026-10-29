// Scene content and timing, shared by the Remotion composition and the web player page.
// All on-screen text and narration come from SOURCE.md (the presentation script); nothing is added here.
// There is no recorded voice: the narration is shown as subtitles, timed by word count.

export const FPS = 30;
export const DIVIDER = 3 * FPS; // section divider before each theme
export const FADE = 18; // frames of fade at the start and end of every scene

export type Divider = { numeral: string; title: string; spoiler?: boolean };

export type Scene = {
  id: string;
  chapter: string;
  seconds: number;
  narration: string;
  divider?: Divider;
};

export const META = {
  name: "The Unbearable Lightness of Being",
  author: "Milan Kundera",
  year: "1984",
  tagline: "On choices we can't undo, love, and the happiness we overlook",
  eyebrow: "A novel by Milan Kundera · 1984",
  wikipedia: "https://en.wikipedia.org/wiki/The_Unbearable_Lightness_of_Being",
  source: {
    title: "La insoportable levedad del ser, de Milan Kundera - Análisis",
    channel: "Club de los lectores muermos",
    host: "Fabián C. Barrio",
    url: "https://www.youtube.com/watch?v=p-OaSA0n3cY",
  },
};

export const MUSIC = {
  src: "audio/gymnopedie.m4a",
  title: "Gymnopédie No. 1 (Lent et douloureux)",
  composer: "Erik Satie (1866–1925)",
  performer: "Robin Alciatore (Musopen)",
  arrangement: "for solo piano",
  license: "Public domain",
  page: "https://commons.wikimedia.org/wiki/File:Erik_Satie_-_gymnopedies_-_la_1_ere._lent_et_douloureux.ogg",
};

export const SCENES: Scene[] = [
  {
    id: "intro", chapter: "Title", seconds: 12,
    narration: "One life. No rehearsal, no second take. That is the problem at the heart of Milan Kundera's most famous novel.",
  },
  {
    id: "hook", chapter: "Why it unsettles us", seconds: 22,
    narration: "The disturbing thing about this book is how easily we recognize ourselves in characters who should feel foreign. Kundera looks at people with tenderness and irony at once: too contradictory to take completely seriously, too fragile to mock without compassion. We finish the novel without answers, but with better questions.",
  },
  {
    id: "characters", chapter: "The characters", seconds: 24,
    narration: "Four people. A surgeon who cannot renounce his lovers. A woman who needs to be loved to the point of illness. An artist for whom freedom means always leaving. And an intellectual who needs every emotion to be a cause.",
  },
  {
    id: "plot", chapter: "The story", seconds: 30,
    narration: "Prague, the 1960s. Tomás is a respected surgeon who has arranged his life to enjoy sex without emotional obligations. Then he meets Teresa, who soon appears at his door with a suitcase, and he falls hopelessly in love. But he keeps seeing other women, including the painter Sabina. They love each other, hurt each other, and can't find a way to live together. Then, in August 1968, the tanks arrive. They flee to Switzerland, but exile solves nothing. And through it all there's a dog, Karenin.",
  },
  {
    id: "author", chapter: "Milan Kundera", seconds: 30,
    narration: "Kundera was born on April first, a fitting date for a writer who spent his life studying the cruel jokes existence plays on us. His father was a pianist, and his novels work like compositions: themes appear, vanish, and return with new meanings. He lived both the enthusiasm of the revolution and the censorship that followed, was expelled from the Party, and went into exile in France. He died in Paris in 2023, at ninety-four.",
  },
  {
    id: "context", chapter: "Prague, 1968", seconds: 32,
    narration: "In early 1968 Czechoslovakia tried to loosen its regime: the Prague Spring. Newspapers spoke more freely and people began to believe in a more open society. Then, on the night of August twentieth, Warsaw Pact troops invaded. Imagine going out for bread and finding a foreign tank parked by the pharmacy. The repression that followed had an almost comic name: normalization. Kundera lived it, and wrote the novel in exile. Its question goes beyond history: how much of our life really belongs to us?",
  },
  {
    id: "influences", chapter: "Related works", seconds: 22,
    narration: "The novel talks with Anna Karenina, which gives the dog his name, and with Nietzsche's eternal return. It continues Kundera's earlier work on memory and power. And there's a 1988 film, but it can't capture the novel's narrator, who keeps stepping in to argue with us.",
  },
  {
    id: "theme1", chapter: "I · One life only", seconds: 45,
    divider: { numeral: "I", title: "One life only" },
    narration: "We live only once. We can't marry two people, live twenty years with each, and then decide who was right. When Teresa goes back to Prague, Tomás gets his freedom back, and discovers it no longer pleases him. He follows her into an occupied country and gives up a promising career. Was it the right decision? He'll never know. The host tells his own story: he left a radio job he loved for a lot of money at a dot-com, and still imagines how wonderful radio would have been. But imaginary lives never have to pay their bills. The lesson: stop demanding guarantees from the future. Decide with the information you have, accept uncertainty, and judge old decisions by what you knew then. You may never know you chose the best path, but you can know why you chose it.",
  },
  {
    id: "theme2", chapter: "II · Love ≠ compatibility", seconds: 45,
    divider: { numeral: "II", title: "Love ≠ compatibility" },
    narration: "Teresa grew up in a home where her privacy meant nothing, and took refuge in books. When she meets Tomás, he has a book open on the table, and to her that means everything. But Tomás believes desire and love can be separated. For Teresa, every affair erases her uniqueness. Don't divide them into hero and villain: Tomás truly loves her and sacrifices for her, and still hurts her again and again. The lesson is that love and compatibility are different things. You can negotiate and compromise, but you can't build a relationship forever on the hope that the other person will one day want what they never wanted. Ask yourself: could I live in peace with this person if, ten years from now, they were essentially the same?",
  },
  {
    id: "theme3", chapter: "III · Misunderstood words", seconds: 38,
    divider: { numeral: "III", title: "A dictionary of misunderstood words" },
    narration: "Sabina has spent her life escaping anything that could limit her. In Switzerland she's with Franz, a professor who adores her. Kundera gives them a little dictionary of misunderstood words: they use the same words but mean different things. It happens all the time. A couple argues about freedom, but for one it means a weekly dinner with friends and for the other something else entirely. The fix is simple: translate big words into concrete behavior. Franz leaves his wife, convinced it proves his love. To Sabina, it turns a free relationship into a cage, and she disappears. Same event, two incompatible readings. Love doesn't make us telepathic. Caring means working to understand what things mean to the other person.",
  },
  {
    id: "theme4", chapter: "IV · Kitsch", seconds: 35,
    divider: { numeral: "IV", title: "Kitsch" },
    narration: "Kundera devotes a fascinating part of the book to kitsch. Picture an advert: a perfect family at breakfast, golden light, everyone smiling. Now picture what was left out of the frame: the mortgage that keeps the father awake, the marriage that's gone months without intimacy, the sick grandmother. Kitsch removes everything that spoils the picture. And there's a second emotion: being moved by how wonderful it is that everyone is moved, which makes us feel good and superior. Think of social media, where life ends up serving the image. Our memory does the same thing, rewriting the past to protect our self-esteem. So the question is: how much are we willing to sacrifice to keep that image intact?",
  },
  {
    id: "theme5", chapter: "V · Happiness", seconds: 40,
    divider: { numeral: "V", title: "Happiness", spoiler: true },
    narration: "Tomás refuses to retract a critical article, loses his profession, and ends up cleaning windows. And something surprising happens: the man who fought so hard for his freedom finds serenity in routine and commitment. Teresa realizes what he has given up for her. Then there's Karenin, the dog. He loves repetition: the same walks, the same hours, the same rituals. We humans tend to despise what repeats; we want extraordinary trips and unforgettable passions, while most of our life goes by unnoticed. The novel separates what we have achieved from what we are able to enjoy. So ask: if everything you use to prove your life matters vanished tomorrow, what would still be worth getting up for?",
  },
  {
    id: "finale", chapter: "The dance", seconds: 25,
    narration: "Kundera begins with the problem of a life lived only once, and after desire, jealousy, humiliation and exile, he leaves us watching two people dance together in a room. They could have had other lives. But they are dancing. Perhaps the great human tragedy is realizing too late that, while we were busy asking whether our life was worth it, we missed a good part of it. Next time you enjoy a simple moment, don't ask more of it. And if you have someone to dance with, dance.",
  },
  { id: "outro", chapter: "Credits", seconds: 10, narration: "" },
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

export const MAX_WORDS = 16;
const SUB_START = 12; // frames after the content starts
const SUB_END = 24; // frames of silence left at the end of the scene

const words = (text: string) => text.split(/\s+/).filter(Boolean);

/** Splits a long sentence at commas, colons and semicolons, then packs the pieces greedily. */
const splitLong = (sentence: string): string[] => {
  const pieces = sentence.split(/(?<=[,:;])\s+/);
  const out: string[] = [];
  let current = "";
  for (const piece of pieces) {
    const joined = current ? `${current} ${piece}` : piece;
    if (current && words(joined).length > MAX_WORDS) {
      out.push(current);
      current = piece;
    } else current = joined;
  }
  if (current) out.push(current);
  return out.flatMap(splitAtConjunction);
};

/** A piece that is still too long is cut before the conjunction nearest its middle (or at the middle). */
const splitAtConjunction = (chunk: string): string[] => {
  const w = words(chunk);
  if (w.length <= MAX_WORDS) return [chunk];
  const middle = w.length / 2;
  let cut = Math.round(middle);
  let best = Infinity;
  w.forEach((word, i) => {
    if (i > 2 && i < w.length - 2 && /^(and|but|while|which|who|or|so)$/i.test(word) && Math.abs(i - middle) < best) {
      best = Math.abs(i - middle);
      cut = i;
    }
  });
  return [...splitAtConjunction(w.slice(0, cut).join(" ")), ...splitAtConjunction(w.slice(cut).join(" "))];
};

/** Narration split into subtitle chunks: whole sentences, or phrases of at most MAX_WORDS words. */
export const chunkNarration = (narration: string): string[] =>
  narration
    .split(/(?<=[.?!])\s+/)
    .filter(Boolean)
    .flatMap((sentence) => (words(sentence).length > MAX_WORDS ? splitLong(sentence) : [sentence]));

export type Subtitle = { text: string; from: number; to: number };

/** Reading weight of a chunk: its words plus a fixed overhead, so short lines don't flash by. */
const weight = (text: string) => words(text).length + 2.5;

/** Subtitle chunks with start/end frames relative to the scene's content (after the divider). */
export const subtitles = (scene: Scene): Subtitle[] => {
  const chunks = chunkNarration(scene.narration);
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

/** Frame (relative to the scene's content) at which `phrase` is reached in the narration's subtitles. */
export const cue = (scene: Scene, phrase: string): number => {
  const clean = (w: string) => w.toLowerCase().replace(/[^\p{L}\p{N}'-]/gu, "");
  const target = words(phrase).map(clean);
  for (const sub of subtitles(scene)) {
    const w = words(sub.text).map(clean);
    const index = w.findIndex((_, i) => target.every((t, j) => w[i + j] === t));
    if (index >= 0) return Math.round(sub.from + (index / w.length) * (sub.to - sub.from));
  }
  throw new Error(`cue "${phrase}" not found in ${scene.id}`);
};
