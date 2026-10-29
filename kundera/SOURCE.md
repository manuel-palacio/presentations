# The Unbearable Lightness of Being: presentation source for Remotion

> Base material for an animated presentation built with Remotion. Each scene has on-screen text, voiceover narration, visual direction, animation cues and a target duration, so it can be turned straight into a `scenes` data array and composed with `<Series>` / `<Sequence>`.

- **Source video:** "La insoportable levedad del ser, de Milan Kundera - Análisis", *Club de los lectores muermos* (Fabián C. Barrio), https://www.youtube.com/watch?v=p-OaSA0n3cY
- **Subject:** Milan Kundera, *The Unbearable Lightness of Being* (1984)
- **Language:** English
- **Target runtime:** ~6 min 30 s (390 s) · **1920×1080 · 30 fps** (≈ 11,700 frames)
- **Narration pace:** ~140 words/min. Each scene's duration below fits its narration plus ~1 s of breathing room.

---

## 1. Global style guide

| Element | Spec |
|---|---|
| Mood | Melancholic, intimate, ironic. Prague at dusk, 1960s film grain. |
| Palette | Background `#14110F` (near-black warm) · Paper `#EFE6D8` · Accent red `#B3261E` (Soviet/1968, passion) · Muted blue `#4A6178` (exile, Switzerland) · Gold `#C9A24A` (happiness, final scene) |
| Typography | Headlines: a high-contrast serif (e.g. *Playfair Display* / *DM Serif Display*) · Body: a clean sans (*Inter*) · Quotes/keywords: serif italic |
| Texture | Subtle film grain overlay (animated noise, 4–6% opacity), slight vignette |
| Motion language | Slow and weighty: `spring({damping: 200})` for entrances, 15–20 frame fades, gentle Ken Burns (scale 1.00 → 1.06) on images. Avoid snappy motion except in the 1968 invasion scene. |
| Recurring motif | **Weight vs lightness**: a feather (lightness) and a stone (weight) that reappear as icons or section dividers. |
| Section dividers | Big serif number + theme title on black, 3 s each (included in the scene durations). |
| Audio | Soft piano bed (Kundera's father was a pianist; the novel is built like music). Duck to 20% under voiceover. |

---

## 2. Scene timeline (overview)

| # | Scene ID | Title | Duration (s) | Frames @30 |
|---|---|---|---|---|
| 1 | `intro` | Title card | 12 | 360 |
| 2 | `hook` | Why this novel unsettles us | 22 | 660 |
| 3 | `characters` | The four characters | 24 | 720 |
| 4 | `plot` | The story | 30 | 900 |
| 5 | `author` | Milan Kundera | 30 | 900 |
| 6 | `context` | Prague Spring & invasion | 32 | 960 |
| 7 | `influences` | Related works | 22 | 660 |
| 8 | `theme1` | One life only | 45 | 1350 |
| 9 | `theme2` | Love vs compatibility | 45 | 1350 |
| 10 | `theme3` | Same words, different meanings | 38 | 1140 |
| 11 | `theme4` | Kitsch | 35 | 1050 |
| 12 | `theme5` | Happiness & Karenin | 40 | 1200 |
| 13 | `finale` | The dance | 25 | 750 |
| 14 | `outro` | Credits | 10 | 300 |
| | | **Total** | **410** | **12,300** |

---

## 3. Scenes

### Scene 1 · `intro` · 12 s
- **On-screen:**
  - Title: **The Unbearable Lightness of Being**
  - Subtitle: *Milan Kundera, 1984*
  - Small tagline: *On choices we can't undo, love, and the happiness we overlook*
- **Narration:** "One life. No rehearsal, no second take. That is the problem at the heart of Milan Kundera's most famous novel."
- **Visual:** Black screen, a feather drifts down slowly from the top; title letters fade in one by one (stagger 2 frames). A stone thuds onto the baseline when the subtitle appears.
- **Animation cues:** feather `translateY` via `interpolate` over 0–300 frames with a sine sway on X; title `opacity` staggered.

### Scene 2 · `hook` · 22 s
- **On-screen (appear one by one):**
  - Decisions we can never correct
  - The traps of love
  - Not understanding those closest to us
  - The lies we decorate our lives with
  - The real nature of happiness
- **Narration:** "The disturbing thing about this book is how easily we recognize ourselves in characters who should feel foreign. Kundera looks at people with tenderness and irony at once: too contradictory to take completely seriously, too fragile to mock without compassion. We finish the novel without answers, but with better questions."
- **Visual:** Five lines on paper-colored background, each underlined in accent red as it's narrated.

### Scene 3 · `characters` · 24 s
- **On-screen:** four character cards in a 2×2 grid.
  - **Tomás**: surgeon who can't give up his lovers
  - **Teresa**: loves so much she becomes sick with jealousy
  - **Sabina**: painter who confuses freedom with permanent escape
  - **Franz**: intellectual who turns every feeling into a grand cause
- **Narration:** "Four people. A surgeon who cannot renounce his lovers. A woman who needs to be loved to the point of illness. An artist for whom freedom means always leaving. And an intellectual who needs every emotion to be a cause."
- **Visual:** Cards flip in (rotateY 90° → 0°) one per name. Use silhouettes or abstract portraits (no film stills). Lines connect them into a love map: Tomás–Teresa (red, thick), Tomás–Sabina (thin red), Sabina–Franz (blue).

### Scene 4 · `plot` · 30 s
- **On-screen timeline (horizontal, left → right):**
  1. *1960s Prague*: Tomás, divorced, free, many lovers
  2. *A provincial town*: he meets Teresa, a waitress
  3. *Prague*: she arrives with a suitcase; he falls in love
  4. *Infidelity*: affairs continue (Sabina); Teresa's jealousy
  5. *August 1968*: Soviet tanks
  6. *Switzerland*: exile, which solves nothing
  7. *Karenin*: the dog who teaches what the humans can't learn
- **Narration:** "Prague, the 1960s. Tomás is a respected surgeon who has arranged his life to enjoy sex without emotional obligations. Then he meets Teresa, who soon appears at his door with a suitcase, and he falls hopelessly in love. But he keeps seeing other women, including the painter Sabina. They love each other, hurt each other, and can't find a way to live together. Then, in August 1968, the tanks arrive. They flee to Switzerland, but exile solves nothing. And through it all there's a dog, Karenin."
- **Visual:** A line draws across the screen (`strokeDashoffset`); each node pops in with a label. Node 5 flashes accent red.

### Scene 5 · `author` · 30 s
- **On-screen facts (cards):**
  - Born **1 April 1929**, Brno, Czechoslovakia (April Fools' Day)
  - Father: a renowned **pianist**, so his novels are structured like music
  - Communist Party: joined → expelled (1950s) → readmitted → expelled for good (1970)
  - **1975** moves to France · **1979** Czech citizenship revoked · becomes French
  - Very private, avoided interviews
  - Distrusted absolute certainties
  - Died in **Paris, 2023**, aged 94
- **Narration:** "Kundera was born on April first, a fitting date for a writer who spent his life studying the cruel jokes existence plays on us. His father was a pianist, and his novels work like compositions: themes appear, vanish, and return with new meanings. He lived both the enthusiasm of the revolution and the censorship that followed, was expelled from the Party, and went into exile in France. He died in Paris in 2023, at ninety-four."
- **Visual:** A vertical timeline with year markers; musical staff lines faintly in the background, with notes that "return" (same shape re-appearing) as a visual pun on recurring themes.

### Scene 6 · `context` · 32 s
- **On-screen:**
  - **Prague Spring (1968):** reforms, more civil liberties, less censorship, hope
  - **20–21 August 1968:** Warsaw Pact invasion
  - **"Normalization":** party control restored, censorship, reformers purged from their professions
  - Novel written in exile; published **1984 in French**, **1985 in Czech** (exile publisher, Toronto)
  - Key question: *How much of our life is really ours?*
- **Narration:** "In early 1968 Czechoslovakia tried to loosen its regime: the Prague Spring. Newspapers spoke more freely and people began to believe in a more open society. Then, on the night of August twentieth, Warsaw Pact troops invaded. Imagine going out for bread and finding a foreign tank parked by the pharmacy. The repression that followed had an almost comic name: normalization. Kundera lived it, and wrote the novel in exile. Its question goes beyond history: how much of our life really belongs to us?"
- **Visual:** Sepia map of Czechoslovakia; at "invaded", arrows sweep in from the borders in accent red with a quick, harsh motion (the only fast motion in the piece). Then a newspaper headline gets stamped "CENSORED".

### Scene 7 · `influences` · 22 s
- **On-screen (four book/film tiles):**
  - *Anna Karenina* (Tolstoy): love, infidelity, consequences; the dog is named after her
  - **Nietzsche, eternal return**: what does a life that happens only once mean?
  - *The Joke* · *The Book of Laughter and Forgetting*: intimacy, history, memory, power
  - **Film (1988)**: Daniel Day-Lewis, Juliette Binoche. Good, but it loses the narrator who interrupts to make us think.
- **Narration:** "The novel talks with Anna Karenina, which gives the dog his name, and with Nietzsche's eternal return. It continues Kundera's earlier work on memory and power. And there's a 1988 film, but it can't capture the novel's narrator, who keeps stepping in to argue with us."
- **Visual:** Tiles slide in from bottom with stagger; a looping circle arrow around the Nietzsche tile.

---

### Scene 8 · `theme1` · 45 s · **Theme 1: The drama of having only one life**
- **Divider (3 s):** "I · One life only"
- **On-screen beats:**
  1. *We can't go back to a crossroads and try the other path.*
  2. Tomás leaves Switzerland to follow Teresa back to occupied Prague. Right choice? **He can never know.**
  3. Host's anecdote: left radio (passion, little money) for a dot-com (lots of money) in 2000, and still daydreams about radio.
  4. Big quote card: **"Imaginary lives never have to pay their bills."**
  5. *Counterfactual thinking*: useful for learning, a trap when used to despise your real life.
  6. **Practical lesson** (checklist):
     - Stop demanding guarantees from the future
     - Gather the information you have
     - Weigh likely consequences
     - Decide which values you're defending
     - Judge past decisions by what you knew *then*
- **Narration:** "We live only once. We can't marry two people, live twenty years with each, and then decide who was right. When Teresa goes back to Prague, Tomás gets his freedom back, and discovers it no longer pleases him. He follows her into an occupied country and gives up a promising career. Was it the right decision? He'll never know. The host tells his own story: he left a radio job he loved for a lot of money at a dot-com, and still imagines how wonderful radio would have been. But imaginary lives never have to pay their bills. The lesson: stop demanding guarantees from the future. Decide with the information you have, accept uncertainty, and judge old decisions by what you knew then. You may never know you chose the best path, but you can know why you chose it."
- **Visual:** A road splitting into two paths (SVG). One path stays fully drawn (lived life, warm color); the other is dashed and fades into fog (imagined life). The checklist ticks appear one by one.

### Scene 9 · `theme2` · 45 s · **Theme 2: Love and the cruelty of wanting to change the other**
- **Divider (3 s):** "II · Love ≠ compatibility"
- **On-screen beats:**
  1. Teresa's childhood: a mother who mocked her modesty and didn't let her close the bathroom door. She escaped into books.
  2. She meets Tomás reading a book, a sign of the world she longed for.
  3. Tomás: sex ≠ love. Teresa: each infidelity denies her uniqueness.
  4. *No hero, no villain.* Tomás loves and sacrifices yet keeps hurting her. Teresa bets her security on him becoming someone else.
  5. Two-column card:
     - **Broken agreement** → a problem of *trust*
     - **Different fundamental expectations** → a problem of *incompatibility*
  6. Big question card: **"Could I live in peace with this person if, in 10 years, they were essentially the same as today?"**
- **Narration:** "Teresa grew up in a home where her privacy meant nothing, and took refuge in books. When she meets Tomás, he has a book open on the table, and to her that means everything. But Tomás believes desire and love can be separated. For Teresa, every affair erases her uniqueness. Don't divide them into hero and villain: Tomás truly loves her and sacrifices for her, and still hurts her again and again. The lesson is that love and compatibility are different things. You can negotiate and compromise, but you can't build a relationship forever on the hope that the other person will one day want what they never wanted. Ask yourself: could I live in peace with this person if, ten years from now, they were essentially the same?"
- **Visual:** Two overlapping circles (Venn) that try to merge but snap back. For the "10 years" question, a calendar flips 10 pages while a silhouette stays unchanged.

### Scene 10 · `theme3` · 38 s · **Theme 3: Same words, different meanings**
- **Divider (3 s):** "III · A dictionary of misunderstood words"
- **On-screen beats:**
  1. Sabina flees every constraint: art conventions, family, politics, commitment.
  2. Franz adores her. Kundera gives them a **"short dictionary of misunderstood words."**
  3. Word-split animation: **FREEDOM** →
     - dinner with friends once a week
     - many sexual partners
     - a room of one's own
  4. **Technique:** translate big words into concrete behaviors (respect? commitment? "sharing a life"?).
  5. Franz leaves his wife as the ultimate romantic gesture; Sabina sees a door closing and leaves.
  6. Closing line: **"Love doesn't grant telepathy."**
- **Narration:** "Sabina has spent her life escaping anything that could limit her. In Switzerland she's with Franz, a professor who adores her. Kundera gives them a little dictionary of misunderstood words: they use the same words but mean different things. It happens all the time. A couple argues about freedom, but for one it means a weekly dinner with friends and for the other something else entirely. The fix is simple: translate big words into concrete behavior. Franz leaves his wife, convinced it proves his love. To Sabina, it turns a free relationship into a cage, and she disappears. Same event, two incompatible readings. Love doesn't make us telepathic. Caring means working to understand what things mean to the other person."
- **Visual:** Dictionary-page layout. The word "FREEDOM" splits into three branches showing different definitions. Two speech bubbles with the same word in different colors.

### Scene 11 · `theme4` · 35 s · **Theme 4: Kitsch and the stories we tell ourselves**
- **Divider (3 s):** "IV · Kitsch"
- **On-screen beats:**
  1. A perfect family breakfast in golden light, the ad image.
  2. Pull back to reveal what's cut out: the mortgage, the sexless marriage, the sick grandmother.
  3. **Kitsch = removing everything that spoils the image.**
  4. The second-level emotion: being moved *that everyone is moved*, and so feeling morally superior.
  5. Social media: a perfect photo needs more perfect photos; life serves the image; happiness becomes a staged obligation.
  6. Questions (one per line):
     - Can I admit my parents were wrong and still love them?
     - Can a relationship have been wonderful *and* miserable?
     - Can I admit I was petty, ridiculous, or cowardly, without inventing a heroic excuse?
- **Narration:** "Kundera devotes a fascinating part of the book to kitsch. Picture an advert: a perfect family at breakfast, golden light, everyone smiling. Now picture what was left out of the frame: the mortgage that keeps the father awake, the marriage that's gone months without intimacy, the sick grandmother. Kitsch removes everything that spoils the picture. And there's a second emotion: being moved by how wonderful it is that everyone is moved, which makes us feel good and superior. Think of social media, where life ends up serving the image. Our memory does the same thing, rewriting the past to protect our self-esteem. So the question is: how much are we willing to sacrifice to keep that image intact?"
- **Visual:** A glossy "perfect" frame in the center; the camera zooms out (scale 1.0 → 0.4) to reveal grey, messy surroundings outside the frame. Then the frame becomes a phone screen with a stream of likes.

### Scene 12 · `theme5` · 40 s · **Theme 5: The happiness that appears when we stop chasing it** *(spoiler warning)*
- **Divider (3 s):** "V · Happiness" + small tag: ⚠ spoilers
- **On-screen beats:**
  1. Tomás refuses to retract a critical article → loses medicine → becomes a **window cleaner**.
  2. The man who guarded his freedom finds **serenity in routine and commitment**.
  3. Teresa sees the price he paid: love can also produce guilt.
  4. **Karenin**: affection made of habit and small rituals. Dogs love repetition; humans despise it.
  5. Not a praise of poverty: the losses are political and real.
  6. Two-column contrast: **What we have achieved** vs **what we are able to enjoy**
  7. Question card: **"If everything you use to prove your life matters vanished tomorrow, what would still be worth getting up for?"** (answers fade in: a person · a dog · a project · a garden · a conversation)
  8. Line: *A life spent chasing the next goal turns the present into a waiting room.*
- **Narration:** "Tomás refuses to retract a critical article, loses his profession, and ends up cleaning windows. And something surprising happens: the man who fought so hard for his freedom finds serenity in routine and commitment. Teresa realizes what he has given up for her. Then there's Karenin, the dog. He loves repetition: the same walks, the same hours, the same rituals. We humans tend to despise what repeats; we want extraordinary trips and unforgettable passions, while most of our life goes by unnoticed. The novel separates what we have achieved from what we are able to enjoy. So ask: if everything you use to prove your life matters vanished tomorrow, what would still be worth getting up for?"
- **Visual:** Warm palette shift toward gold. A simple dog line-illustration walking in a loop (the circle motif = repetition, contrasting with Nietzsche's eternal return from scene 7). A clock whose hands move gently; a door with a dog waiting.

### Scene 13 · `finale` · 25 s · **The dance**
- **On-screen beats:**
  1. *The novel opens with the problem of a single life…*
  2. *…and ends with two people dancing in a room.*
  3. **"They could have had other lives. But they are dancing."**
  4. *Happiness doesn't need to last forever to have been real.*
  5. Final line, large: **"If you have someone to dance with, dance."**
- **Narration:** "Kundera begins with the problem of a life lived only once, and after desire, jealousy, humiliation and exile, he leaves us watching two people dance together in a room. They could have had other lives. But they are dancing. Perhaps the great human tragedy is realizing too late that, while we were busy asking whether our life was worth it, we missed a good part of it. Next time you enjoy a simple moment, don't ask more of it. And if you have someone to dance with, dance."
- **Visual:** Two abstract silhouettes slowly rotating around each other in warm gold light; the feather from Scene 1 drifts down and lands softly, with no stone this time. Music swells slightly, then fades.

### Scene 14 · `outro` · 10 s
- **On-screen:**
  - *The Unbearable Lightness of Being*, Milan Kundera (1984)
  - Based on the analysis by *Club de los lectores muermos* (Fabián C. Barrio)
  - youtube.com/watch?v=p-OaSA0n3cY
- **Visual:** Fade to black with credits, grain stays.

---

## 4. Key quotes / pull lines bank
Short lines for kinetic typography. These are paraphrases from the analysis, not quotes from the novel.
- "Imaginary lives never have to pay their bills."
- "Everyone is a genius in hindsight."
- "You may never know you chose the best path, but you can know why you chose it."
- "Love and compatibility are two different things."
- "Falling in love with a promise of transformation is a bet you almost always lose."
- "Love doesn't grant telepathy."
- "Translate big words into concrete behavior."
- "Kitsch removes everything that spoils the picture."
- "What we have achieved ≠ what we are able to enjoy."
- "A life spent chasing the next goal turns the present into a waiting room."
- "Happiness doesn't need to last forever to have been real."
- "If you have someone to dance with, dance."

## 5. Asset checklist
- [ ] Fonts: serif display + Inter (via `@remotion/google-fonts`)
- [ ] SVG icons: feather, stone, suitcase, tank, book, window/squeegee, dog (line style), dancing silhouettes
- [ ] Map of Czechoslovakia (SVG, public domain outline)
- [ ] Film grain overlay (generated noise via `@remotion/noise` or a looping PNG sequence)
- [ ] Piano music bed (royalty-free) + voiceover WAV per scene (`vo_01_intro.wav` … `vo_14_outro.wav`)
- [ ] Optional: archival-style 1968 Prague photos (only public-domain / licensed; no film stills)

## 6. Suggested data structure (TypeScript)
```ts
export type Scene = {
  id: string;
  title: string;
  durationInSeconds: number;
  divider?: string;          // section divider text for theme scenes
  onScreen: string[];        // lines revealed in order
  highlight?: string;        // big pull-quote card
  narration: string;         // voiceover script
  voiceover?: string;        // staticFile path, e.g. "vo/vo_08_theme1.wav"
  palette?: "dark" | "paper" | "red" | "blue" | "gold";
  visual: string;            // direction for the component
};

export const FPS = 30;
// Compose with <Series> and <Series.Sequence durationInFrames={s.durationInSeconds * FPS}>
// Total duration = scenes.reduce((a, s) => a + s.durationInSeconds, 0) * FPS
```
Tip: once the voiceover is recorded, use `getAudioDurationInSeconds()` in `calculateMetadata` to set each scene's real duration instead of the estimates above.
