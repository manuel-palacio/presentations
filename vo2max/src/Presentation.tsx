import React from "react";
import { AbsoluteFill, Audio, Sequence, interpolate, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { Backdrop, C, DividerCard, LangContext, Subtitles, clamp, useLang, useText } from "./ui";
import {
  CascadeScene, Curves, Decline, Extraction, Fick, Finale, FourByFour, Intro, Outro, Progression, Short, Split, Strength, Tools,
  Trainable, Week, Zones,
} from "./scenes";
import { FADE, FPS, Lang, MUSIC, SCENES, Scene, TOTAL_FRAMES, contentFrames, sceneFrames, sceneLead, sceneStarts, subtitles } from "./slides";

export type PresentationProps = { lang: Lang };

const CONTENT: Record<string, React.FC> = {
  intro: Intro, decline: Decline, fick: Fick, curves: Curves, split: Split, extraction: Extraction, cascade: CascadeScene,
  trainable: Trainable, tools: Tools, zones: Zones, fourbyfour: FourByFour, short: Short, week: Week, strength: Strength,
  progression: Progression, finale: Finale, outro: Outro,
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
const PART2 = STARTS[SCENES.findIndex((s) => s.id === "tools")];
const OUTRO = STARTS[SCENES.findIndex((s) => s.id === "outro")];
const XFADE = 2 * FPS;

/** Part I on "Windswept", part II on "Carefree": they cross-fade over the part II divider; the end fades out. */
const firstVolume = (frame: number) => interpolate(frame, [0, FPS, PART2 - 10, PART2 - 10 + XFADE], [0, 0.45, 0.45, 0], clamp);
const secondVolume = (frame: number) => interpolate(frame, [0, XFADE, OUTRO - PART2, TOTAL_FRAMES - PART2], [0, 0.42, 0.42, 0], clamp);

const Divider: React.FC<{ scene: Scene }> = ({ scene }) => {
  const t = useText();
  const lang = useLang();
  const d = scene.divider!;
  return <DividerCard numeral={d.numeral} title={d.title[lang]} part={t.part} color={d.numeral === "I" ? C.oxygen : C.train} />;
};

/** The whole presentation in one language (`lang` prop); timing is the same in every language. */
export const Presentation: React.FC<PresentationProps> = ({ lang = "en" }) => (
  <LangContext.Provider value={lang}>
    <AbsoluteFill style={{ backgroundColor: C.bg }}>
      <Backdrop />
      <Sequence durationInFrames={PART2 + XFADE} name="music I">
        <Audio src={staticFile(MUSIC[0].src)} volume={firstVolume} />
      </Sequence>
      <Sequence from={PART2 - 10} name="music II">
        <Audio src={staticFile(MUSIC[1].src)} volume={secondVolume} />
      </Sequence>
      {SCENES.map((scene, i) => (
        <Sequence key={scene.id} from={STARTS[i]} durationInFrames={sceneFrames(scene)} name={scene.id}>
          {scene.divider ? (
            <Sequence durationInFrames={sceneLead(scene)} name="divider"><Divider scene={scene} /></Sequence>
          ) : null}
          <Sequence from={sceneLead(scene)} durationInFrames={contentFrames(scene)} name="content"><SceneContent scene={scene} /></Sequence>
        </Sequence>
      ))}
    </AbsoluteFill>
  </LangContext.Provider>
);
