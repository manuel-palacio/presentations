import React from "react";
import { AbsoluteFill, Audio, Sequence, interpolate, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { C, Grain, LangContext, Subtitles, clamp, useLang } from "./ui";
import {
  Author, Characters, Context, DividerCard, Finale, Hook, Influences, Intro, Outro, Plot, Theme1, Theme2, Theme3, Theme4, Theme5,
} from "./scenes";
import { FADE, FPS, Lang, MUSIC, SCENES, Scene, TOTAL_FRAMES, contentFrames, sceneFrames, sceneLead, sceneStarts, subtitles } from "./slides";

export type PresentationProps = { lang: Lang };

const CONTENT: Record<string, React.FC> = {
  intro: Intro, hook: Hook, characters: Characters, plot: Plot, author: Author, context: Context, influences: Influences,
  theme1: Theme1, theme2: Theme2, theme3: Theme3, theme4: Theme4, theme5: Theme5, finale: Finale,
  outro: Outro,
};

/** The scene's content, faded in and out, with its narration as subtitles on top. */
const SceneContent: React.FC<{ scene: Scene }> = ({ scene }) => {
  const frame = useCurrentFrame();
  const lang = useLang();
  const { durationInFrames } = useVideoConfig();
  const opacity = Math.min(interpolate(frame, [0, FADE], [0, 1], clamp), interpolate(frame, [durationInFrames - FADE, durationInFrames], [1, 0], clamp));
  const Content = CONTENT[scene.id];
  return (
    <AbsoluteFill style={{ opacity }}>
      <Content />
      <Subtitles subs={subtitles(scene, lang)} />
    </AbsoluteFill>
  );
};

const STARTS = sceneStarts();
const FINALE = STARTS[SCENES.findIndex((s) => s.id === "finale")];
const OUTRO = STARTS[SCENES.findIndex((s) => s.id === "outro")];

/** A soft piano bed: fades in, swells slightly during the dance, then fades out over the credits. */
const musicVolume = (frame: number) =>
  interpolate(frame, [0, FPS, FINALE + 60, FINALE + 360, OUTRO + 30, TOTAL_FRAMES], [0, 0.5, 0.5, 0.62, 0.55, 0], clamp);

/** The whole presentation in one language (`lang` prop); timing is the same in every language. */
export const Presentation: React.FC<PresentationProps> = ({ lang = "en" }) => (
  <LangContext.Provider value={lang}>
  <AbsoluteFill style={{ backgroundColor: C.bg }}>
    <Audio src={staticFile(MUSIC.src)} volume={musicVolume} />
    {SCENES.map((scene, i) => (
      <Sequence key={scene.id} from={STARTS[i]} durationInFrames={sceneFrames(scene)} name={scene.id}>
        {scene.divider ? (
          <Sequence durationInFrames={sceneLead(scene)} name="divider">
            <DividerCard numeral={scene.divider.numeral} title={scene.divider.title[lang]} spoiler={scene.divider.spoiler} />
          </Sequence>
        ) : null}
        <Sequence from={sceneLead(scene)} durationInFrames={contentFrames(scene)} name="content"><SceneContent scene={scene} /></Sequence>
      </Sequence>
    ))}
    <Grain />
  </AbsoluteFill>
  </LangContext.Provider>
);
