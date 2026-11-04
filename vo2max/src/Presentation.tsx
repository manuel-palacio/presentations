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

/** The scene's content under a slow camera push-in; it arrives out of a soft zoom-blur and leaves into one.
 *  The narration's subtitles stay steady on top. */
const SceneContent: React.FC<{ scene: Scene }> = ({ scene }) => {
  const frame = useCurrentFrame();
  const lang = useLang();
  const { durationInFrames } = useVideoConfig();
  const ease = (x: number) => 1 - (1 - x) ** 3;
  const inP = interpolate(frame, [0, FADE + 6], [0, 1], { ...clamp, easing: ease });
  const outP = interpolate(frame, [durationInFrames - FADE, durationInFrames], [0, 1], { ...clamp, easing: (x) => x * x });
  const push = interpolate(frame, [0, durationInFrames], [1, 1.035], clamp);
  const scale = push * (1 + 0.05 * (1 - inP)) * (1 - 0.04 * outP);
  const blur = 12 * (1 - inP) + 10 * outP;
  const Content = CONTENT[scene.id];
  return (
    <AbsoluteFill>
      <AbsoluteFill style={{ opacity: Math.min(inP, 1 - outP), transform: `scale(${scale})`, filter: blur > 0.2 ? `blur(${blur}px)` : undefined }}>
        <Content />
      </AbsoluteFill>
      <AbsoluteFill style={{ opacity: Math.min(inP, 1 - outP) }}>
        <Subtitles subs={subtitles(scene, lang)} />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

/** The backdrop's colour drifts from oxygen blue (part I) to training green (part II). */
const LivingBackdrop: React.FC = () => {
  const frame = useCurrentFrame();
  return <Backdrop accent={interpolate(frame, [PART2 - 60, PART2 + 60], [0, 1], clamp)} />;
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
      <LivingBackdrop />
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
