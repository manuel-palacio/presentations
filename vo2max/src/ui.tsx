import React, { createContext, useContext } from "react";
import { AbsoluteFill, interpolate, random, spring, useCurrentFrame, useVideoConfig } from "remotion";
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

/** Text with "₂" drawn as a small lowered digit, for the display font, which has no subscript glyphs. */
export const Sub: React.FC<{ text: string }> = ({ text }) => (
  <>
    {text.split("₂").map((part, i) => (
      <React.Fragment key={i}>
        {i ? <span style={{ fontSize: "0.5em", verticalAlign: "-0.12em" }}>2</span> : null}
        {part}
      </React.Fragment>
    ))}
  </>
);

/** Words that rise in one by one out of a blur, starting `delay` frames in. */
export const Reveal: React.FC<{ text: string; delay?: number; stagger?: number; style?: React.CSSProperties }> = ({ text, delay = 0, stagger = 4, style }) => {
  const frame = useCurrentFrame();
  return (
    <span style={style}>
      {text.split(" ").map((word, i) => {
        const p = interpolate(frame, [delay + i * stagger, delay + i * stagger + 16], [0, 1], { ...clamp, easing: (x) => 1 - (1 - x) ** 3 });
        return (
          <span key={i} style={{ display: "inline-block", whiteSpace: "pre", opacity: p, filter: `blur(${(1 - p) * 10}px)`,
            transform: `translateY(${(1 - p) * 26}px)` }}><Sub text={word} />{i < text.split(" ").length - 1 ? " " : ""}</span>
        );
      })}
    </span>
  );
};

/** Scene heading, top left: an eyebrow behind a growing accent bar, and a title revealed word by word. */
export const Heading: React.FC<{ eyebrow: string; title: string; color?: string }> = ({ eyebrow, title, color = C.oxygen }) => {
  const frame = useCurrentFrame();
  const bar = interpolate(frame, [0, 22], [0, 1], { ...clamp, easing: (x) => 1 - (1 - x) ** 3 });
  return (
    <div style={{ position: "absolute", left: 120, top: 74 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
        <div style={{ width: 56 * bar, height: 4, borderRadius: 2, background: color, boxShadow: `0 0 16px ${color}` }} />
        <div style={{ fontFamily: sans, fontSize: 24, letterSpacing: 6, textTransform: "uppercase", fontWeight: 600, color,
          opacity: ramp(frame, 6, 22), transform: `translateX(${(1 - ramp(frame, 6, 22)) * -14}px)` }}>{eyebrow}</div>
      </div>
      <div style={{ fontFamily: display, fontSize: 66, fontWeight: 700, color: C.text, marginTop: 8, letterSpacing: -1.5 }}>
        <Reveal text={title} delay={8} />
      </div>
    </div>
  );
};

/** A number that counts from `from` to `to` between two frames, eased; `digits` decimals. */
export const useCount = (from: number, to: number, start: number, frames = 40, digits = 0) => {
  const frame = useCurrentFrame();
  const v = interpolate(frame, [start, start + frames], [from, to], { ...clamp, easing: (x) => 1 - (1 - x) ** 3 });
  return v.toFixed(digits);
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

/** Part divider: a giant outlined numeral drawn stroke by stroke, a light sweep, and the part's title. */
export const DividerCard: React.FC<{ numeral: string; title: string; part: string; color: string }> = ({ numeral, title, part, color }) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const out = interpolate(frame, [durationInFrames - 14, durationInFrames], [1, 0], clamp);
  const zoom = interpolate(frame, [0, durationInFrames], [1.08, 1], clamp);
  const draw = interpolate(frame, [0, 50], [0, 1], { ...clamp, easing: (x) => 1 - (1 - x) ** 2 });
  const sweep = interpolate(frame, [10, 60], [-0.3, 1.3], clamp);
  return (
    <AbsoluteFill style={{ backgroundColor: C.bg, alignItems: "center", justifyContent: "center", opacity: out }}>
      <div style={{ position: "absolute", width: 1100, height: 1100, borderRadius: "50%", transform: `scale(${0.7 + 0.3 * draw})`,
        background: `radial-gradient(circle, ${color}30 0%, ${color}00 62%)` }} />
      <svg width={1920} height={1080} style={{ position: "absolute", transform: `scale(${zoom})` }}>
        {[0, 1, 2, 3].map((k) => {
          const u = ((frame + k * 22) % 88) / 88; // pulse rings, like a heartbeat spreading out
          return <circle key={k} cx={960} cy={540} r={180 + u * 620} fill="none" stroke={color} strokeWidth={3 - 2 * u} opacity={(1 - u) * 0.45 * draw} />;
        })}
        <defs>
          <linearGradient id={`sweep-${numeral}`} x1="0" x2="1">
            <stop offset={Math.max(0, sweep - 0.15)} stopColor={color} stopOpacity={0.25} />
            <stop offset={Math.min(1, Math.max(0, sweep))} stopColor="#fff" stopOpacity={0.9} />
            <stop offset={Math.min(1, sweep + 0.15)} stopColor={color} stopOpacity={0.25} />
          </linearGradient>
        </defs>
        <circle cx={960} cy={540} r={330} fill="none" stroke={`url(#sweep-${numeral})`} strokeWidth={2} opacity={draw} />
      </svg>
      <div style={{ fontFamily: sans, fontSize: 28, letterSpacing: 14, textTransform: "uppercase", color, fontWeight: 600,
        opacity: ramp(frame, 8, 24), transform: `translateY(${(1 - ramp(frame, 8, 24)) * 16}px)` }}>{part} {numeral}</div>
      <div style={{ fontFamily: display, fontSize: 132, fontWeight: 700, color: C.text, letterSpacing: -3, textShadow: `0 0 60px ${color}66` }}>
        <Reveal text={title} delay={16} stagger={6} />
      </div>
      <div style={{ width: 420 * ramp(frame, 26, 56), height: 3, background: `linear-gradient(90deg, ${color}00, ${color}, ${color}00)`, marginTop: 18 }} />
    </AbsoluteFill>
  );
};

// Film grain: one noise tile, shifted every frame.
const GRAIN = `url("data:image/svg+xml;utf8,${encodeURIComponent(
  "<svg xmlns='http://www.w3.org/2000/svg' width='240' height='240'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 0.55 0'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>",
).replace(/%2523/g, "%23")}")`;

const MOTES = Array.from({ length: 46 }, (_, i) => ({
  x: random(`x${i}`) * 1920, y: random(`y${i}`) * 1080, r: 1.5 + random(`r${i}`) * 4.5,
  vx: 0.15 + random(`vx${i}`) * 0.45, vy: -0.05 - random(`vy${i}`) * 0.25, phase: random(`p${i}`) * 100, blur: random(`b${i}`) > 0.7,
}));

/** The living background: slow aurora light in the part's colour, drifting oxygen motes, a faint grid, grain. */
export const Backdrop: React.FC<{ accent: number }> = ({ accent }) => {
  const frame = useCurrentFrame();
  const a1 = `rgba(56,189,248,${0.13 * (1 - accent)})`;
  const a2 = `rgba(52,211,153,${0.13 * accent})`;
  const ox = 50 + 18 * Math.sin(frame / 240);
  const oy = 38 + 10 * Math.cos(frame / 310);
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <AbsoluteFill style={{ background: `radial-gradient(ellipse 70% 60% at ${ox}% ${oy}%, ${a1} 0%, rgba(0,0,0,0) 70%), radial-gradient(ellipse 60% 55% at ${100 - ox}% ${100 - oy}%, ${a2} 0%, rgba(0,0,0,0) 70%), radial-gradient(ellipse 50% 50% at ${100 - ox}% ${oy + 30}%, rgba(167,139,250,0.06) 0%, rgba(0,0,0,0) 70%)` }} />
      <AbsoluteFill style={{ backgroundImage: `linear-gradient(${C.grid} 1px, transparent 1px), linear-gradient(90deg, ${C.grid} 1px, transparent 1px)`,
        backgroundSize: "96px 96px", opacity: 0.35, maskImage: "radial-gradient(ellipse at 50% 45%, #000 20%, transparent 75%)" }} />
      <svg width={1920} height={1080} style={{ position: "absolute" }}>
        {MOTES.map((m, i) => {
          const x = (((m.x + frame * m.vx) % 1980) + 1980) % 1980 - 30;
          const y = (((m.y + frame * m.vy + 12 * Math.sin((frame + m.phase * 20) / 50)) % 1140) + 1140) % 1140 - 30;
          const tw = 0.35 + 0.35 * Math.sin((frame + m.phase * 9) / 30);
          return <circle key={i} cx={x} cy={y} r={m.blur ? m.r * 2.2 : m.r} fill={i % 5 === 0 ? C.train : C.oxygen}
            opacity={(m.blur ? 0.12 : 0.4) * tw} />;
        })}
      </svg>
      <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 42%, rgba(0,0,0,0) 45%, rgba(0,0,0,0.6) 100%)" }} />
      <AbsoluteFill style={{ backgroundImage: GRAIN, opacity: 0.05, mixBlendMode: "overlay",
        backgroundPosition: `${random(`gx${frame % 24}`) * 240}px ${random(`gy${frame % 24}`) * 240}px` }} />
    </AbsoluteFill>
  );
};
