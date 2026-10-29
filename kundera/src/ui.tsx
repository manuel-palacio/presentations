import React, { createContext, useContext } from "react";
import { AbsoluteFill, interpolate, random, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { loadFont as loadSerif } from "@remotion/google-fonts/PlayfairDisplay";
import { loadFont as loadSans } from "@remotion/google-fonts/Inter";
import { Lang, Subtitle, cue, sceneById } from "./slides";
import { TEXT } from "./text";

const { fontFamily: serif } = loadSerif("normal", { weights: ["400", "700"], subsets: ["latin", "latin-ext"] });
loadSerif("italic", { weights: ["400"], subsets: ["latin", "latin-ext"] });
const { fontFamily: sans } = loadSans("normal", { weights: ["400", "500", "600"], subsets: ["latin", "latin-ext"] });
export { serif, sans };

/** The script's palette: warm near-black, paper, Soviet red, exile blue, happiness gold. */
export const C = {
  bg: "#14110F", paper: "#EFE6D8", red: "#B3261E", blue: "#4A6178", gold: "#C9A24A",
  card: "#1E1A17", line: "rgba(239,230,216,0.16)", dim: "rgba(239,230,216,0.66)", grey: "#8a8279", inkDim: "#5b5149",
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

/** 0 → 1 with a slow, weighty spring, starting `delay` frames into the sequence. */
export const useSpring = (delay = 0, damping = 200) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return spring({ frame: frame - delay, fps, config: { damping } });
};

/** Renders `**bold**` and `*italic*` (serif italic) in script text. */
export const Rich: React.FC<{ text: string; boldColor?: string }> = ({ text, boldColor }) => (
  <>
    {text.split(/(\*\*[^*]+\*\*|\*[^*]+\*)/).map((part, i) => {
      if (part.startsWith("**")) return <strong key={i} style={{ fontWeight: 700, color: boldColor }}>{part.slice(2, -2)}</strong>;
      if (part.startsWith("*")) return <em key={i} style={{ fontFamily: serif, fontStyle: "italic" }}>{part.slice(1, -1)}</em>;
      return <React.Fragment key={i}>{part}</React.Fragment>;
    })}
  </>
);

/** Shows its children from `from` (rising in) until `to` (fading out over 15 frames). */
export const Beat: React.FC<{ from: number; to?: number; style?: React.CSSProperties; rise?: number; children: React.ReactNode }> = ({
  from, to, style, rise = 26, children,
}) => {
  const frame = useCurrentFrame();
  const p = useSpring(from);
  if (frame < from || (to !== undefined && frame >= to)) return null;
  const out = to === undefined ? 1 : interpolate(frame, [to - 16, to], [1, 0], clamp);
  return <div style={{ ...style, opacity: p * out, transform: `translateY(${(1 - p) * rise}px)` }}>{children}</div>;
};

/** Fades a whole layer in at `from` and out at `to`. */
export const fadeBetween = (frame: number, from: number, to: number, length = 16) =>
  Math.min(interpolate(frame, [from, from + length], [0, 1], clamp), interpolate(frame, [to - length, to], [1, 0], clamp));

export const Eyebrow: React.FC<{ children: React.ReactNode; color?: string; style?: React.CSSProperties }> = ({ children, color = C.gold, style }) => {
  const p = useSpring(4);
  return (
    <div style={{ fontFamily: sans, fontSize: 24, letterSpacing: 7, textTransform: "uppercase", fontWeight: 500, color,
      opacity: p, ...style }}>
      {children}
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
    <AbsoluteFill style={{ justifyContent: "flex-end", alignItems: "center", paddingBottom: 58, pointerEvents: "none" }}>
      <div style={{ opacity, maxWidth: 1500, textAlign: "center", fontFamily: sans, fontSize: 36, lineHeight: 1.36, fontWeight: 500,
        color: C.paper, background: "rgba(20,17,15,0.8)", padding: "10px 28px 12px", borderRadius: 10,
        boxShadow: "0 8px 30px rgba(0,0,0,0.25)", textWrap: "balance" }}>
        {sub.text}
      </div>
    </AbsoluteFill>
  );
};

/** Animated film grain (a new noise seed every other frame) and a soft vignette, over everything. */
export const Grain: React.FC = () => {
  const frame = useCurrentFrame();
  const seed = Math.floor(frame / 2) % 24;
  const dx = Math.floor(random(`gx${seed}`) * 40);
  const dy = Math.floor(random(`gy${seed}`) * 40);
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <AbsoluteFill style={{ opacity: 0.05, mixBlendMode: "screen" }}>
        <svg width={960} height={540} style={{ width: 1920 + 80, height: 1080 + 80, transform: `translate(${-dx}px, ${-dy}px)` }}>
          <filter id={`grain${seed}`}>
            <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves={2} seed={seed} stitchTiles="stitch" />
            <feColorMatrix type="saturate" values="0" />
          </filter>
          <rect width="100%" height="100%" filter={`url(#grain${seed})`} />
        </svg>
      </AbsoluteFill>
      <AbsoluteFill style={{ background: "radial-gradient(ellipse at center, rgba(0,0,0,0) 55%, rgba(0,0,0,0.5) 100%)" }} />
    </AbsoluteFill>
  );
};
