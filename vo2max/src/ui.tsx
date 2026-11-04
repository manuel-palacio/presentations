import React, { createContext, useContext } from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { loadFont as loadDisplay } from "@remotion/google-fonts/SpaceGrotesk";
import { loadFont as loadSans } from "@remotion/google-fonts/Inter";
import { Lang, Subtitle, cue, sceneById } from "./slides";
import { TEXT } from "./text";

const { fontFamily: display } = loadDisplay("normal", { weights: ["500", "700"], subsets: ["latin", "latin-ext"] });
const { fontFamily: sans } = loadSans("normal", { weights: ["400", "500", "600", "700"], subsets: ["latin", "latin-ext"] });
export { display, sans };

/** Deep night blue; oxygen cyan, heart red, muscle amber, training green. */
export const C = {
  bg: "#0B1320", panel: "#111C2E", line: "rgba(226,236,248,0.14)", grid: "rgba(226,236,248,0.08)",
  text: "#E6EDF6", dim: "rgba(230,237,246,0.62)", faint: "rgba(230,237,246,0.35)",
  oxygen: "#38BDF8", heart: "#F43F5E", muscle: "#F59E0B", train: "#34D399", violet: "#A78BFA",
};

/** The composition's language, set once by <Presentation lang>. */
export const LangContext = createContext<Lang>("en");
export const useLang = () => useContext(LangContext);
/** The words drawn in the scenes, in the composition's language. */
export const useText = () => TEXT[useLang()];
/** `at(sceneId, phrase)`: the frame at which the phrase is reached in that scene's narration, in this language. */
export const useAt = () => {
  const lang = useLang();
  return (id: string, phrase: string) => cue(sceneById(id), phrase, lang);
};

export const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

/** 0 → 1 with a spring, starting `delay` frames into the sequence. */
export const useSpring = (delay = 0, damping = 18, mass = 0.8) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return spring({ frame: frame - delay, fps, config: { damping, mass } });
};

/** 0 → 1 linearly between two frames (clamped). */
export const ramp = (frame: number, from: number, to: number) => interpolate(frame, [from, to], [0, 1], clamp);

/** Shows its children from `from`, popping in with a spring. */
export const Pop: React.FC<{ from: number; style?: React.CSSProperties; children: React.ReactNode }> = ({ from, style, children }) => {
  const frame = useCurrentFrame();
  const p = useSpring(from);
  if (frame < from) return null;
  return <div style={{ ...style, opacity: Math.min(1, p * 1.4), transform: `${style?.transform ?? ""} scale(${0.7 + 0.3 * p})` }}>{children}</div>;
};

/** Scene heading, top left: a small eyebrow and a title. */
export const Heading: React.FC<{ eyebrow: string; title: string; color?: string }> = ({ eyebrow, title, color = C.oxygen }) => {
  const p = useSpring(2, 200);
  return (
    <div style={{ position: "absolute", left: 120, top: 78, opacity: p, transform: `translateY(${(1 - p) * 20}px)` }}>
      <div style={{ fontFamily: sans, fontSize: 24, letterSpacing: 6, textTransform: "uppercase", fontWeight: 600, color }}>{eyebrow}</div>
      <div style={{ fontFamily: display, fontSize: 64, fontWeight: 700, color: C.text, marginTop: 6, letterSpacing: -1 }}>{title}</div>
    </div>
  );
};

/** Narration as subtitles in the lower band: dark plate, soft fades. Frames are relative to the content. */
export const Subtitles: React.FC<{ subs: Subtitle[] }> = ({ subs }) => {
  const frame = useCurrentFrame();
  const sub = subs.find((s) => frame >= s.from && frame < s.to);
  if (!sub) return null;
  const opacity = Math.min(interpolate(frame, [sub.from, sub.from + 8], [0, 1], clamp), interpolate(frame, [sub.to - 8, sub.to], [1, 0], clamp));
  return (
    <AbsoluteFill style={{ justifyContent: "flex-end", alignItems: "center", paddingBottom: 50, pointerEvents: "none" }}>
      <div style={{ opacity, maxWidth: 1500, textAlign: "center", fontFamily: sans, fontSize: 36, lineHeight: 1.36, fontWeight: 500,
        color: C.text, background: "rgba(11,19,32,0.84)", padding: "10px 28px 12px", borderRadius: 12,
        boxShadow: "0 8px 30px rgba(0,0,0,0.3)", textWrap: "balance" }}>
        {sub.text}
      </div>
    </AbsoluteFill>
  );
};

/** Part divider: a big numeral and the part's title, over a slow pulse. */
export const DividerCard: React.FC<{ numeral: string; title: string; part: string; color: string }> = ({ numeral, title, part, color }) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const p = useSpring(0, 200);
  const out = interpolate(frame, [durationInFrames - 15, durationInFrames], [1, 0], clamp);
  const pulse = 1 + 0.04 * Math.sin(frame / 6);
  return (
    <AbsoluteFill style={{ backgroundColor: C.bg, alignItems: "center", justifyContent: "center", opacity: out }}>
      <div style={{ position: "absolute", width: 760, height: 760, borderRadius: "50%", transform: `scale(${pulse * (0.6 + 0.4 * p)})`,
        background: `radial-gradient(circle, ${color}33 0%, ${color}00 65%)` }} />
      <div style={{ fontFamily: sans, fontSize: 28, letterSpacing: 10, textTransform: "uppercase", color, opacity: p, fontWeight: 600 }}>{part} {numeral}</div>
      <div style={{ fontFamily: display, fontSize: 120, fontWeight: 700, color: C.text, opacity: p, transform: `translateY(${(1 - p) * 30}px)`, letterSpacing: -2 }}>{title}</div>
    </AbsoluteFill>
  );
};

/** A soft vignette and faint grid over the background. */
export const Backdrop: React.FC = () => (
  <AbsoluteFill style={{ pointerEvents: "none" }}>
    <AbsoluteFill style={{ backgroundImage: `linear-gradient(${C.grid} 1px, transparent 1px), linear-gradient(90deg, ${C.grid} 1px, transparent 1px)`,
      backgroundSize: "96px 96px", opacity: 0.5 }} />
    <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 40%, rgba(56,189,248,0.07) 0%, rgba(0,0,0,0) 55%, rgba(0,0,0,0.55) 100%)" }} />
  </AbsoluteFill>
);
