// The scenes, drawn in SVG and CSS: every chart, diagram and figure is code. Values come from SOURCE.md;
// words come from text.ts; a visual appears when its narration cue is reached (useAt).
import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { C, Heading, Pop, clamp, display, ramp, sans, useAt, useLang, useSpring, useText } from "./ui";
import { META, MUSIC } from "./slides";

const W = 1920;
const H = 1080;

/** A path drawn progressively (0 → 1) using a normalised path length. */
const Draw: React.FC<{ d: string; p: number; color: string; width?: number; dash?: string; glow?: boolean }> = ({
  d, p, color, width = 6, dash, glow,
}) => (
  <>
    {glow ? <path d={d} fill="none" stroke={color} strokeWidth={width * 3} strokeOpacity={0.15} strokeLinecap="round"
      pathLength={1} strokeDasharray="1" strokeDashoffset={1 - p} /> : null}
    <path d={d} fill="none" stroke={color} strokeWidth={width} strokeLinecap="round" strokeLinejoin="round"
      pathLength={1} strokeDasharray={dash ?? "1"} strokeDashoffset={dash ? 0 : 1 - p} opacity={dash ? p : 1} />
  </>
);

/** A smooth path through points (Catmull-Rom as cubic Béziers). */
const smooth = (pts: [number, number][]) => {
  let d = `M ${pts[0][0]} ${pts[0][1]}`;
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[Math.max(0, i - 1)], p1 = pts[i], p2 = pts[i + 1], p3 = pts[Math.min(pts.length - 1, i + 2)];
    const c1 = [p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6];
    const c2 = [p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6];
    d += ` C ${c1[0]} ${c1[1]}, ${c2[0]} ${c2[1]}, ${p2[0]} ${p2[1]}`;
  }
  return d;
};

const T = (style: React.CSSProperties = {}): React.CSSProperties => ({ fontFamily: sans, color: C.text, ...style });

/** Text with "₂" drawn as a small lowered digit, for the display font, which has no subscript glyphs. */
const Sub: React.FC<{ text: string }> = ({ text }) => (
  <>
    {text.split("₂").map((part, i) => (
      <React.Fragment key={i}>
        {i ? <span style={{ fontSize: "0.5em", verticalAlign: "-0.12em" }}>2</span> : null}
        {part}
      </React.Fragment>
    ))}
  </>
);

// ---- An age chart (20 → 70) shared by the decline, curves and finale scenes ----------------------------------

const CH = { x0: 260, x1: 1480, y0: 250, y1: 790 }; // plot box (room on the right for labels)
const ax = (age: number) => CH.x0 + ((age - 20) / 50) * (CH.x1 - CH.x0);
const ay = (pct: number) => CH.y1 - ((pct - 40) / 65) * (CH.y1 - CH.y0); // 40 % … 105 %
/** Sedentary VO₂ max, % of age 20: flat to ~30, then ≈ −10 % per decade, −46 % by 70 (SOURCE.md). */
const VO2: [number, number][] = [[20, 100], [30, 97], [40, 87], [50, 76], [60, 65], [70, 54]];
/** Maximal cardiac output, % of age 20: −31 % by 70. */
const CO: [number, number][] = [[20, 100], [30, 96], [40, 89], [50, 82], [60, 75], [70, 69]];
const toXY = (pts: [number, number][]) => pts.map(([a, v]) => [ax(a), ay(v)] as [number, number]);

const AgeAxes: React.FC<{ p: number; label: string; yLabel?: string }> = ({ p, label, yLabel }) => (
  <g opacity={p}>
    {[20, 30, 40, 50, 60, 70].map((age) => (
      <g key={age}>
        <line x1={ax(age)} x2={ax(age)} y1={CH.y0} y2={CH.y1} stroke={C.grid} strokeWidth={2} />
        <text x={ax(age)} y={CH.y1 + 46} textAnchor="middle" style={{ fontFamily: display, fontSize: 30, fill: C.dim }}>{age}</text>
      </g>
    ))}
    <line x1={CH.x0} x2={CH.x1} y1={CH.y1} y2={CH.y1} stroke={C.line} strokeWidth={3} />
    <text x={CH.x1} y={CH.y1 + 90} textAnchor="end" style={{ fontFamily: sans, fontSize: 24, fill: C.faint, letterSpacing: 3 }}>{label.toUpperCase()}</text>
    {yLabel ? <text x={CH.x0 - 20} y={CH.y0 - 24} style={{ fontFamily: sans, fontSize: 24, fill: C.faint }}>{yLabel}</text> : null}
  </g>
);

// ---- 1 · Intro ----------------------------------------------------------------------------------------------

/** A heartbeat trace that sweeps across, then the title. */
export const Intro: React.FC = () => {
  const frame = useCurrentFrame();
  const t = useText().intro;
  const beat = (x: number) => `L ${x} 540 L ${x + 30} 540 L ${x + 50} 470 L ${x + 70} 610 L ${x + 92} 380 L ${x + 118} 640 L ${x + 140} 540`;
  const d = `M 0 540 ${[180, 520, 860, 1200, 1540].map(beat).join(" ")} L ${W} 540`;
  const p = ramp(frame, 0, 70);
  const title = useSpring(55);
  const sub = useSpring(80);
  return (
    <AbsoluteFill>
      <svg width={W} height={H} style={{ position: "absolute", opacity: interpolate(frame, [70, 110], [1, 0.25], clamp) }}>
        <Draw d={d} p={p} color={C.heart} width={7} glow />
      </svg>
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
        <div style={{ fontFamily: display, fontSize: 220, fontWeight: 700, color: C.text, letterSpacing: -6, opacity: title,
          transform: `scale(${0.85 + 0.15 * title})`, textShadow: `0 0 60px ${C.oxygen}55` }}><Sub text={t.title} /></div>
        <div style={T({ fontSize: 42, color: C.dim, opacity: sub, marginTop: 10 })}>{t.subtitle}</div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ---- 2 · Decline --------------------------------------------------------------------------------------------

export const Decline: React.FC = () => {
  const frame = useCurrentFrame();
  const t = useText().decline;
  const at = useAt();
  const decade = at("decline", t.cues.decade);
  const half = at("decline", t.cues.half);
  const axes = useSpring(10, 200);
  const line = ramp(frame, decade - 20, decade + 150);
  const brace = useSpring(half);
  const pts = toXY(VO2);
  return (
    <AbsoluteFill>
      <Heading eyebrow={t.eyebrow} title={t.title} />
      <svg width={W} height={H} style={{ position: "absolute" }}>
        <AgeAxes p={axes} label={t.age} yLabel={t.axis} />
        <line x1={ax(20)} x2={ax(70)} y1={ay(100)} y2={ay(100)} stroke={C.faint} strokeWidth={2} strokeDasharray="8 10" opacity={axes} />
        <Draw d={smooth(pts)} p={line} color={C.oxygen} width={9} glow />
        {pts.slice(2).map(([x, y], i) => {
          const show = ramp(frame, decade + 30 + i * 26, decade + 50 + i * 26);
          return (
            <g key={i} opacity={show}>
              <circle cx={x} cy={y} r={11} fill={C.bg} stroke={C.oxygen} strokeWidth={5} />
              <text x={x} y={y - 30} textAnchor="middle" style={{ fontFamily: display, fontSize: 28, fill: C.oxygen, fontWeight: 700 }}>−10 %</text>
            </g>
          );
        })}
        <g opacity={ramp(frame, decade, decade + 20)}>
          <circle cx={ax(30)} cy={ay(97)} r={12} fill={C.oxygen} />
          <text x={ax(30)} y={ay(97) + 56} textAnchor="middle" style={{ fontFamily: sans, fontSize: 26, fill: C.dim }}>{t.start}</text>
        </g>
        <g opacity={brace} transform={`translate(${(1 - brace) * 30} 0)`}>
          <path d={`M ${ax(70) + 40} ${ay(100)} Q ${ax(70) + 70} ${ay(100)} ${ax(70) + 70} ${ay(77)} L ${ax(70) + 90} ${ay(77)} M ${ax(70) + 70} ${ay(77)} Q ${ax(70) + 70} ${ay(54)} ${ax(70) + 40} ${ay(54)}`}
            fill="none" stroke={C.heart} strokeWidth={5} />
          <text x={ax(70) + 110} y={ay(77) + 26} style={{ fontFamily: display, fontSize: 92, fontWeight: 700, fill: C.heart }}>{t.total}</text>
        </g>
        <text x={ax(52)} y={ay(64)} style={{ fontFamily: sans, fontSize: 26, fill: C.dim, fontStyle: "italic" }} opacity={line}>{t.sedentary}</text>
      </svg>
    </AbsoluteFill>
  );
};

// ---- 3 · Fick -----------------------------------------------------------------------------------------------

const HeartIcon: React.FC<{ beat: number; size?: number }> = ({ beat, size = 230 }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" style={{ transform: `scale(${1 + 0.08 * beat})`, filter: `drop-shadow(0 0 24px ${C.heart}66)` }}>
    <path d="M50 88 C 18 66 6 46 12 30 C 18 14 40 12 50 30 C 60 12 82 14 88 30 C 94 46 82 66 50 88 Z" fill={C.heart} />
    <path d="M30 40 L 42 40 L 47 30 L 54 52 L 59 40 L 70 40" stroke="#fff" strokeWidth={4} fill="none" strokeLinecap="round" strokeLinejoin="round" opacity={0.9} />
  </svg>
);

/** A muscle as a bundle of fibres. */
const MuscleIcon: React.FC<{ glow: number; size?: number }> = ({ glow, size = 230 }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" style={{ filter: `drop-shadow(0 0 ${10 + 20 * glow}px ${C.muscle}66)` }}>
    <path d="M10 50 C 30 18 70 18 90 50 C 70 82 30 82 10 50 Z" fill={C.muscle} />
    {[34, 42, 50, 58, 66].map((y) => (
      <path key={y} d={`M18 ${50 + (y - 50) * 0.2} C 38 ${y - 6} 62 ${y - 6} 82 ${50 + (y - 50) * 0.2}`} stroke="#7c4a03" strokeWidth={2.4} fill="none" opacity={0.55} />
    ))}
  </svg>
);

export const Fick: React.FC = () => {
  const frame = useCurrentFrame();
  const t = useText().fick;
  const at = useAt();
  const heartAt = at("fick", t.cues.heart);
  const muscleAt = at("fick", t.cues.muscle);
  const eqAt = at("fick", t.cues.equals);
  const beat = Math.max(0, Math.sin(frame / 4.5)) ** 6;
  const flow = ramp(frame, muscleAt, muscleAt + 30);
  const block = (from: number, child: React.ReactNode, label: string, sub: string, color: string) => (
    <Pop from={from} style={{ display: "flex", flexDirection: "column", alignItems: "center", width: 380 }}>
      {child}
      <div style={{ fontFamily: display, fontSize: 52, fontWeight: 700, color, marginTop: 16 }}>{label}</div>
      <div style={T({ fontSize: 30, color: C.dim })}>{sub}</div>
    </Pop>
  );
  const op = (from: number, sign: string) => (
    <Pop from={from} style={{ fontFamily: display, fontSize: 120, color: C.dim, width: 120, textAlign: "center", marginTop: -80 }}>{sign}</Pop>
  );
  return (
    <AbsoluteFill>
      <Heading eyebrow={t.eyebrow} title={t.title} />
      <svg width={W} height={H} style={{ position: "absolute" }} opacity={flow}>
        {Array.from({ length: 10 }, (_, i) => {
          const u = ((frame * 0.012 + i / 10) % 1);
          return <circle key={i} cx={560 + u * 400} cy={470 + Math.sin(u * Math.PI * 2) * 18} r={9} fill={C.oxygen} opacity={Math.sin(u * Math.PI)} />;
        })}
      </svg>
      <AbsoluteFill style={{ flexDirection: "row", alignItems: "center", justifyContent: "center", paddingTop: 40 }}>
        {block(heartAt, <HeartIcon beat={beat} />, t.heart, t.pump, C.heart)}
        {op(muscleAt, "×")}
        {block(muscleAt, <MuscleIcon glow={flow} />, t.muscle, t.extract, C.muscle)}
        {op(eqAt, "=")}
        <Pop from={eqAt} style={{ display: "flex", flexDirection: "column", alignItems: "center", width: 380 }}>
          <div style={{ width: 230, height: 230, borderRadius: "50%", border: `10px solid ${C.oxygen}`, display: "flex", alignItems: "center", justifyContent: "center",
            boxShadow: `0 0 50px ${C.oxygen}55`, fontFamily: display, fontSize: 64, fontWeight: 700, color: C.oxygen }}><Sub text="O₂" /></div>
          <div style={{ fontFamily: display, fontSize: 52, fontWeight: 700, color: C.oxygen, marginTop: 16 }}><Sub text="VO₂ max" /></div>
          <div style={T({ fontSize: 30, color: C.dim })}>&nbsp;</div>
        </Pop>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ---- 4 · Curves ---------------------------------------------------------------------------------------------

export const Curves: React.FC = () => {
  const frame = useCurrentFrame();
  const t = useText().curves;
  const at = useAt();
  const hrAt = at("curves", t.cues.hr);
  const coAt = at("curves", t.cues.output);
  const vo2At = at("curves", t.cues.vo2);
  const gapAt = at("curves", t.cues.gap);
  const axes = useSpring(8, 200);
  const co = ramp(frame, coAt - 10, coAt + 70);
  const vo2 = ramp(frame, vo2At - 10, vo2At + 60);
  const gap = ramp(frame, gapAt - 10, gapAt + 30);
  const hr = Math.round(interpolate(frame, [hrAt, hrAt + 90], [200, 150], clamp));
  const coPts = toXY(CO);
  const vo2Pts = toXY(VO2);
  const area = `${smooth(coPts)} L ${vo2Pts[vo2Pts.length - 1][0]} ${vo2Pts[vo2Pts.length - 1][1]} ${smooth([...vo2Pts].reverse()).replace(/^M [^C]+/, "")} Z`;
  return (
    <AbsoluteFill>
      <Heading eyebrow={t.eyebrow} title={t.title} />
      <svg width={W} height={H} style={{ position: "absolute" }}>
        <AgeAxes p={axes} label={t.age} />
        <path d={area} fill={C.muscle} opacity={0.22 * gap} />
        <Draw d={smooth(coPts)} p={co} color={C.heart} width={8} glow />
        <Draw d={smooth(vo2Pts)} p={vo2} color={C.oxygen} width={8} glow />
        <g opacity={co}>
          <text x={ax(70) + 24} y={ay(69) + 10} style={{ fontFamily: display, fontSize: 40, fontWeight: 700, fill: C.heart }}>−31 %</text>
          <text x={ax(70) + 24} y={ay(69) + 44} style={{ fontFamily: sans, fontSize: 24, fill: C.dim }}>{t.output}</text>
        </g>
        <g opacity={vo2}>
          <text x={ax(70) + 24} y={ay(54) + 10} style={{ fontFamily: display, fontSize: 40, fontWeight: 700, fill: C.oxygen }}>−46 %</text>
          <text x={ax(70) + 24} y={ay(54) + 44} style={{ fontFamily: sans, fontSize: 24, fill: C.dim }}>{t.vo2}</text>
        </g>
        <text x={ax(60)} y={(ay(75) + ay(65)) / 2 + 10} textAnchor="middle" opacity={gap}
          style={{ fontFamily: display, fontSize: 40, fontWeight: 700, fill: C.muscle }}>{t.gap}</text>
      </svg>
      <Pop from={hrAt} style={{ position: "absolute", right: 140, top: 96, textAlign: "right" }}>
        <div style={T({ fontSize: 24, color: C.dim, letterSpacing: 3, textTransform: "uppercase" })}>{t.hr}</div>
        <div style={{ fontFamily: display, fontSize: 96, fontWeight: 700, color: C.heart, lineHeight: 1 }}>{hr}<span style={{ fontSize: 36, color: C.dim }}> bpm</span></div>
        <div style={T({ fontSize: 26, color: C.dim })}>{t.perYear}</div>
      </Pop>
    </AbsoluteFill>
  );
};

// ---- 5 · Split ----------------------------------------------------------------------------------------------

export const Split: React.FC = () => {
  const frame = useCurrentFrame();
  const t = useText().split;
  const at = useAt();
  const olderAt = at("split", t.cues.older);
  const grow = useSpring(20, 200);
  const m = useSpring(olderAt, 26);
  const heart = 77 + (56 - 77) * m;
  const width = 1500;
  const x0 = (W - width) / 2;
  const old = frame >= olderAt;
  return (
    <AbsoluteFill>
      <Heading eyebrow={t.eyebrow} title={t.title} />
      <div style={{ position: "absolute", left: x0, top: 360, width }}>
        <div style={{ fontFamily: display, fontSize: 48, fontWeight: 700, color: C.text, marginBottom: 26, height: 60 }}>
          <span style={{ opacity: 1 - m }}>{t.young}</span>
          <span style={{ opacity: m, position: "absolute", left: 0 }}>{t.older}</span>
        </div>
        <div style={{ display: "flex", height: 170, borderRadius: 20, overflow: "hidden", transform: `scaleX(${grow})`, transformOrigin: "left" }}>
          <div style={{ width: `${heart}%`, background: `linear-gradient(90deg, ${C.heart}, #fb7185)`, display: "flex", alignItems: "center", paddingLeft: 36 }}>
            <span style={{ fontFamily: display, fontSize: 84, fontWeight: 700, color: "#fff" }}>{Math.round(heart)} %</span>
          </div>
          <div style={{ flex: 1, background: `linear-gradient(90deg, ${C.muscle}, #fbbf24)`, display: "flex", alignItems: "center", justifyContent: "flex-end", paddingRight: 36 }}>
            <span style={{ fontFamily: display, fontSize: 84, fontWeight: 700, color: "#3b2203" }}>{Math.round(100 - heart)} %</span>
          </div>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", marginTop: 22, opacity: grow }}>
          <span style={T({ fontSize: 32, color: C.heart, fontWeight: 600 })}>♥ {t.heart}</span>
          <span style={T({ fontSize: 32, color: C.muscle, fontWeight: 600, transform: old ? "scale(1.08)" : "none" })}>{t.muscle}</span>
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ---- 6 · Extraction -----------------------------------------------------------------------------------------

const Gauge: React.FC<{ value: number; label: string; color: string; show: number }> = ({ value, label, color, show }) => {
  const r = 230;
  const a = Math.PI * (1 - value / 100);
  const arc = (v: number) => {
    const angle = Math.PI * (1 - v / 100);
    return `M ${-r} 0 A ${r} ${r} 0 0 1 ${r * Math.cos(angle)} ${-r * Math.sin(angle)}`;
  };
  return (
    <svg width={600} height={400} viewBox="-300 -290 600 400" style={{ opacity: show }}>
      <path d={`M ${-r} 0 A ${r} ${r} 0 0 1 ${r} 0`} fill="none" stroke={C.line} strokeWidth={42} strokeLinecap="round" />
      {value > 0 ? <path d={arc(value)} fill="none" stroke={color} strokeWidth={42} strokeLinecap="round" style={{ filter: `drop-shadow(0 0 14px ${color}88)` }} /> : null}
      <line x1={0} y1={0} x2={(r - 60) * Math.cos(a)} y2={-(r - 60) * Math.sin(a)} stroke={C.text} strokeWidth={8} strokeLinecap="round" />
      <circle r={18} fill={C.text} />
      <text y={86} textAnchor="middle" style={{ fontFamily: display, fontSize: 84, fontWeight: 700, fill: color }}>{Math.round(value)} %</text>
      <text y={-r - 30} textAnchor="middle" style={{ fontFamily: sans, fontSize: 34, fontWeight: 600, fill: C.text }}>{label}</text>
    </svg>
  );
};

export const Extraction: React.FC = () => {
  const frame = useCurrentFrame();
  const t = useText().extraction;
  const at = useAt();
  const youngAt = at("extraction", t.cues.young);
  const oldAt = at("extraction", t.cues.old);
  const y = interpolate(frame, [youngAt, youngAt + 45], [0, 80], { ...clamp, easing: (x) => 1 - (1 - x) ** 3 });
  const o = interpolate(frame, [oldAt, oldAt + 45], [0, 60], { ...clamp, easing: (x) => 1 - (1 - x) ** 3 });
  return (
    <AbsoluteFill>
      <Heading eyebrow={t.eyebrow} title={t.title} color={C.muscle} />
      <AbsoluteFill style={{ flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 120, paddingTop: 120 }}>
        <Gauge value={y} label={t.young} color={C.train} show={ramp(frame, youngAt - 10, youngAt + 10)} />
        <Gauge value={o} label={t.old} color={C.muscle} show={ramp(frame, oldAt - 10, oldAt + 10)} />
      </AbsoluteFill>
      <div style={T({ position: "absolute", width: W, top: 820, textAlign: "center", fontSize: 30, color: C.dim, opacity: ramp(frame, youngAt, youngAt + 20) })}>{t.label}</div>
    </AbsoluteFill>
  );
};

// ---- 7–8 · The oxygen cascade -------------------------------------------------------------------------------

/** Five stages joined by tubes; `narrow` (0–1) narrows and reddens the last three; `heal` (0–1) widens them again. */
const Cascade: React.FC<{ stagesShown: number; narrow: number; heal: number; tags: number[]; labels: string[]; tagText: string[] }> = ({
  stagesShown, narrow, heal, tags, labels, tagText,
}) => {
  const frame = useCurrentFrame();
  const xs = [260, 610, 960, 1310, 1660];
  const y = 520;
  const damage = narrow * (1 - heal);
  const tubeW = (i: number) => (i < 2 ? 46 : 46 - 30 * damage);
  const tubeColor = (i: number) => (i < 2 ? C.oxygen : interpolate(damage, [0, 1], [0, 1]) > 0.5 ? C.heart : heal > 0.5 ? C.train : C.oxygen);
  const speed = 0.006 * (1 - 0.55 * damage) * (1 + 0.6 * heal);
  const icons = ["🫁", "🩸", "〰", "💪", "⚡"];
  return (
    <svg width={W} height={H} style={{ position: "absolute" }}>
      {xs.slice(0, -1).map((x, i) => (
        <rect key={i} x={x} y={y - tubeW(i) / 2} width={xs[i + 1] - x} height={tubeW(i)} rx={tubeW(i) / 2}
          fill={tubeColor(i)} opacity={0.28 * ramp(stagesShown, i + 0.5, i + 1.5)} />
      ))}
      {Array.from({ length: 34 }, (_, k) => {
        const u = (frame * speed + k / 34) % 1;
        const pos = u * (xs.length - 1);
        const seg = Math.floor(pos);
        if (pos > stagesShown - 0.5) return null;
        const x = xs[seg] + (pos - seg) * (xs[seg + 1] - xs[seg]);
        const jitter = Math.sin(k * 12.9 + frame / 10) * Math.min(14, tubeW(seg) / 3);
        const lost = seg >= 2 && damage > 0.3 && k % 3 === 0; // fewer molecules make it through
        return lost ? null : <circle key={k} cx={x} cy={y + jitter} r={8} fill={C.oxygen} opacity={0.9} />;
      })}
      {xs.map((x, i) => {
        const p = ramp(stagesShown, i, i + 1);
        const hurt = i >= 2 ? damage : 0;
        const ring = hurt > 0.5 ? C.heart : heal > 0.5 && i >= 2 ? C.train : C.oxygen;
        return (
          <g key={i} opacity={p} transform={`translate(${x} ${y}) scale(${0.6 + 0.4 * p})`}>
            <circle r={78} fill={C.panel} stroke={ring} strokeWidth={6} />
            <text y={20} textAnchor="middle" style={{ fontSize: 56 }}>{icons[i]}</text>
            <text y={128} textAnchor="middle" style={{ fontFamily: sans, fontSize: 30, fontWeight: 600, fill: C.text }}>{labels[i]}</text>
          </g>
        );
      })}
      {tagText.map((tag, i) => {
        const p = tags[i] * (1 - heal);
        const x = xs[i + 2];
        return (
          <g key={tag} opacity={p} transform={`translate(${x} ${y - 140 - (1 - p) * 20})`}>
            <rect x={-150} y={-38} width={300} height={56} rx={28} fill={C.heart} opacity={0.18} stroke={C.heart} strokeWidth={2} />
            <text y={0} textAnchor="middle" style={{ fontFamily: sans, fontSize: 26, fontWeight: 600, fill: "#fda4af" }}>{tag}</text>
          </g>
        );
      })}
    </svg>
  );
};

export const CascadeScene: React.FC = () => {
  const frame = useCurrentFrame();
  const t = useText().cascade;
  const at = useAt();
  const stagesAt = at("cascade", t.cues.stages);
  const ageAt = at("cascade", t.cues.age);
  const tagAt = t.cues.tags.map((c) => at("cascade", c));
  const stages = interpolate(frame, [stagesAt - 10, stagesAt + 110], [0, 5], clamp);
  return (
    <AbsoluteFill>
      <Heading eyebrow={t.eyebrow} title={t.title} />
      <Cascade stagesShown={stages} narrow={ramp(frame, ageAt, ageAt + 60)} heal={0}
        tags={tagAt.map((a) => ramp(frame, a, a + 18))} labels={t.stages} tagText={t.tags} />
    </AbsoluteFill>
  );
};

export const Trainable: React.FC = () => {
  const frame = useCurrentFrame();
  const t = useText().trainable;
  const at = useAt();
  const subAt = at("trainable", t.cues.sub);
  const stages = useText().cascade;
  const heal = ramp(frame, 20, 90);
  const line = useSpring(40);
  return (
    <AbsoluteFill>
      <Cascade stagesShown={5} narrow={1} heal={heal} tags={[1, 1, 1]} labels={stages.stages} tagText={stages.tags} />
      <div style={{ position: "absolute", top: 120, width: W, textAlign: "center" }}>
        <div style={T({ fontSize: 26, letterSpacing: 6, textTransform: "uppercase", color: C.train, fontWeight: 600, opacity: line })}>{t.eyebrow}</div>
        <div style={{ fontFamily: display, fontSize: 84, fontWeight: 700, color: C.text, opacity: line, transform: `scale(${0.9 + 0.1 * line})` }}>{t.line}</div>
      </div>
      <Pop from={subAt} style={{ position: "absolute", top: 760, width: W, textAlign: "center", fontFamily: display, fontSize: 56, color: C.train, fontWeight: 700 }}>{t.sub}</Pop>
    </AbsoluteFill>
  );
};

// ---- 9 · Tools ----------------------------------------------------------------------------------------------

/** Mølmen et al. (2025), 8–10 weeks: mitochondria, capillary-to-fibre ratio, VO₂ max (SIT VO₂ max: 6.6–8.9 %). */
const TOOLS = [
  { color: C.train, values: [22.7, 15.0, 12.5], labels: ["+22.7 %", "+15.0 %", "+12.5 %"] },
  { color: C.oxygen, values: [27.0, 13.3, 12.1], labels: ["+27.0 %", "+13.3 %", "+12.1 %"] },
  { color: C.violet, values: [27.0, 10.4, 7.8], labels: ["+27.0 %", "+10.4 %", "+6.6–8.9 %"] },
];

export const Tools: React.FC = () => {
  const frame = useCurrentFrame();
  const t = useText().tools;
  const at = useAt();
  const colAt = t.cues.columns.map((c) => at("tools", c));
  const vo2At = at("tools", t.cues.vo2);
  const lang = useLang();
  const maxH = 380;
  const base = 820;
  return (
    <AbsoluteFill>
      <Heading eyebrow={t.eyebrow} title={t.title} color={C.train} />
      <AbsoluteFill style={{ flexDirection: "row", justifyContent: "center", gap: 90, paddingTop: 230 }}>
        {TOOLS.map((tool, c) => {
          const show = ramp(frame, colAt[c] - 6, colAt[c] + 14);
          return (
            <div key={c} style={{ width: 460, opacity: show, transform: `translateY(${(1 - show) * 30}px)` }}>
              <div style={{ fontFamily: display, fontSize: 56, fontWeight: 700, color: tool.color, textAlign: "center" }}>{t.columns[c]}</div>
              <div style={T({ fontSize: 24, color: C.dim, textAlign: "center", marginBottom: 20 })}>{t.best[c]}</div>
              <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "center", gap: 26, height: maxH + 60, position: "relative" }}>
                {tool.values.map((v, m) => {
                  const g = interpolate(frame, [colAt[c] + 6 + m * 8, colAt[c] + 40 + m * 8], [0, 1], { ...clamp, easing: (x) => 1 - (1 - x) ** 3 });
                  const hl = m === 2 ? ramp(frame, vo2At, vo2At + 12) : 0;
                  const h = (v / 27) * maxH * g;
                  return (
                    <div key={m} style={{ width: 118, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "flex-end" }}>
                      <div style={{ fontFamily: display, fontSize: 26, fontWeight: 700, color: C.text, opacity: g, marginBottom: 8, whiteSpace: "nowrap",
                        transform: `scale(${1 + 0.15 * hl})` }}>{lang === "es" ? tool.labels[m].replace(/\./g, ",") : tool.labels[m]}</div>
                      <div style={{ width: 96, height: h, borderRadius: "14px 14px 4px 4px", background: m === 2 ? C.oxygen : tool.color,
                        opacity: m === 2 ? 0.55 + 0.45 * hl : 0.85, boxShadow: hl ? `0 0 ${30 * hl}px ${C.oxygen}` : "none" }} />
                    </div>
                  );
                })}
              </div>
              <div style={{ display: "flex", justifyContent: "center", gap: 26, marginTop: 12 }}>
                {t.metrics.map((m) => <div key={m} style={T({ width: 118, fontSize: 19, color: C.dim, textAlign: "center" })}>{m}</div>)}
              </div>
            </div>
          );
        })}
      </AbsoluteFill>
      <div style={T({ position: "absolute", left: 120, top: base + 40, fontSize: 20, color: C.faint, opacity: ramp(frame, colAt[0], colAt[0] + 20) })}>{t.note}</div>
    </AbsoluteFill>
  );
};

// ---- 10 · Zones ---------------------------------------------------------------------------------------------

export const Zones: React.FC = () => {
  const frame = useCurrentFrame();
  const t = useText().zones;
  const at = useAt();
  const hardAt = at("zones", t.cues.hard);
  const easyAt = at("zones", t.cues.easy);
  const x0 = 200, x1 = 1720, top = 330, bottom = 800;
  const yOf = (pct: number) => bottom - ((pct - 40) / 60) * (bottom - top);
  // intensity over time: easy, then 4 hard/easy cycles
  const pts: [number, number][] = [];
  for (let i = 0; i <= 200; i++) {
    const u = i / 200;
    const cyc = (u * 4.2) % 1;
    const hard = u > 0.1 && cyc < 0.55;
    pts.push([x0 + u * (x1 - x0), yOf(hard ? 92 + 2 * Math.sin(i) : 58 + 2 * Math.sin(i / 3))]);
  }
  const d = smooth(pts.filter((_, i) => i % 2 === 0));
  const trace = ramp(frame, 10, 220);
  const hard = useSpring(hardAt);
  const easy = useSpring(easyAt);
  return (
    <AbsoluteFill>
      <Heading eyebrow={t.eyebrow} title={t.title} color={C.heart} />
      <svg width={W} height={H} style={{ position: "absolute" }}>
        <rect x={x0} y={yOf(100)} width={(x1 - x0) * hard} height={yOf(87) - yOf(100)} fill={C.heart} opacity={0.18} />
        <rect x={x0} y={yOf(65)} width={(x1 - x0) * easy} height={yOf(40) - yOf(65)} fill={C.train} opacity={0.14} />
        <line x1={x0} x2={x1} y1={bottom} y2={bottom} stroke={C.line} strokeWidth={3} />
        <text x={x1} y={bottom + 40} textAnchor="end" style={{ fontFamily: sans, fontSize: 24, fill: C.faint, letterSpacing: 3 }}>{t.time.toUpperCase()}</text>
        <Draw d={d} p={trace} color={C.text} width={6} />
        <g opacity={hard}>
          <text x={x1} y={yOf(100) - 22} textAnchor="end" style={{ fontFamily: display, fontSize: 40, fontWeight: 700, fill: C.heart }}>{t.hard}</text>
          <text x={x0} y={yOf(100) - 22} style={{ fontFamily: sans, fontSize: 28, fill: "#fda4af" }}>🗣 {t.hardTalk}</text>
        </g>
        <g opacity={easy}>
          <text x={x0 + 20} y={yOf(40) + 76} style={{ fontFamily: display, fontSize: 40, fontWeight: 700, fill: C.train }}>{t.easy}</text>
          <text x={x0 + 680} y={yOf(40) + 76} style={{ fontFamily: sans, fontSize: 28, fill: "#a7f3d0" }}>💬 {t.easyTalk}</text>
        </g>
      </svg>
    </AbsoluteFill>
  );
};

// ---- 11 · 4 × 4 ---------------------------------------------------------------------------------------------

type Block = { min: number; kind: "warm" | "hard" | "easy" | "cool" };
const FOUR: Block[] = [
  { min: 10, kind: "warm" },
  ...Array.from({ length: 4 }, () => [{ min: 4, kind: "hard" as const }, { min: 3, kind: "easy" as const }]).flat(),
  { min: 5, kind: "cool" },
];
const KIND = {
  warm: { color: C.oxygen, h: 0.45 }, hard: { color: C.heart, h: 1 }, easy: { color: C.train, h: 0.42 }, cool: { color: C.violet, h: 0.35 },
};

/** A session as blocks whose height is intensity and width is time; a playhead fills them. */
const Timeline: React.FC<{
  blocks: Block[]; x0: number; x1: number; base: number; maxH: number; fill: number; labels?: Record<Block["kind"], string>; numbers?: boolean;
}> = ({ blocks, x0, x1, base, maxH, fill, labels, numbers = true }) => {
  const total = blocks.reduce((s, b) => s + b.min, 0);
  const scale = (x1 - x0) / total;
  let at = 0;
  const head = x0 + fill * (x1 - x0);
  return (
    <svg width={W} height={H} style={{ position: "absolute" }}>
      {blocks.map((b, i) => {
        const x = x0 + at * scale;
        const w = b.min * scale - 6;
        at += b.min;
        const h = KIND[b.kind].h * maxH;
        const lit = Math.max(0, Math.min(1, (head - x) / w));
        return (
          <g key={i}>
            <rect x={x} y={base - h} width={w} height={h} rx={12} fill={KIND[b.kind].color} opacity={0.16} />
            <rect x={x} y={base - h} width={w * lit} height={h} rx={12} fill={KIND[b.kind].color} opacity={0.9} />
            {labels && (i === 0 || i === 1 || i === 2 || i === blocks.length - 1) ? (
              <text x={x + w / 2} y={base + 44} textAnchor="middle" style={{ fontFamily: sans, fontSize: 24, fill: KIND[b.kind].color, fontWeight: 600 }} opacity={lit > 0 ? 1 : 0.4}>
                {labels[b.kind]}
              </text>
            ) : null}
            <text x={x + w / 2} y={base - h + 46} textAnchor="middle" style={{ fontFamily: display, fontSize: 34, fontWeight: 700, fill: "#0b1320" }} opacity={numbers && lit > 0.5 ? 1 : 0}>
              {b.min}
            </text>
          </g>
        );
      })}
      <line x1={head} x2={head} y1={base - maxH - 30} y2={base + 10} stroke={C.text} strokeWidth={4} opacity={fill > 0 && fill < 1 ? 1 : 0} />
    </svg>
  );
};

export const FourByFour: React.FC = () => {
  const frame = useCurrentFrame();
  const t = useText().fourbyfour;
  const at = useAt();
  const startAt = at("fourbyfour", t.cues.start);
  const totalAt = at("fourbyfour", t.cues.total);
  const fill = interpolate(frame, [startAt, totalAt], [0, 1], clamp);
  const minutes = Math.round(fill * 43);
  return (
    <AbsoluteFill>
      <Heading eyebrow={t.eyebrow} title={t.title} color={C.heart} />
      <Timeline blocks={FOUR} x0={160} x1={1760} base={760} maxH={360} fill={fill}
        labels={{ warm: t.warm, hard: t.hard, easy: t.easy, cool: t.cool }} />
      <div style={{ position: "absolute", right: 160, top: 90, textAlign: "right" }}>
        <div style={{ fontFamily: display, fontSize: 120, fontWeight: 700, color: C.text, lineHeight: 1 }}>
          {minutes}<span style={{ fontSize: 44, color: C.dim }}> {t.min}</span>
        </div>
        <div style={{ height: 10, width: 300, background: C.line, borderRadius: 5, marginTop: 14, marginLeft: "auto" }}>
          <div style={{ height: 10, width: 300 * fill, background: C.heart, borderRadius: 5 }} />
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ---- 12 · Short options -------------------------------------------------------------------------------------

const SIX: Block[] = [{ min: 3, kind: "warm" }, ...Array.from({ length: 6 }, () => [{ min: 1, kind: "hard" as const }, { min: 1, kind: "easy" as const }]).flat(), { min: 2, kind: "cool" }];
const SIT: Block[] = [{ min: 3, kind: "warm" }, ...Array.from({ length: 5 }, () => [{ min: 0.45, kind: "hard" as const }, { min: 1.6, kind: "easy" as const }]).flat(), { min: 2, kind: "cool" }];

export const Short: React.FC = () => {
  const frame = useCurrentFrame();
  const t = useText().short;
  const at = useAt();
  const aAt = at("short", t.cues.a);
  const bAt = at("short", t.cues.b);
  const fa = ramp(frame, aAt, aAt + 150);
  const fb = ramp(frame, bAt, bAt + 150);
  const row = (label: string, sub: string, y: number, show: number, color: string) => (
    <div style={{ position: "absolute", left: 160, top: y, opacity: show }}>
      <span style={{ fontFamily: display, fontSize: 58, fontWeight: 700, color }}>{label}</span>
      <span style={T({ fontSize: 28, color: C.dim, marginLeft: 26 })}>{sub}</span>
    </div>
  );
  return (
    <AbsoluteFill>
      <Heading eyebrow={t.eyebrow} title={t.title} color={C.heart} />
      {row(t.a, t.aSub, 250, ramp(frame, aAt - 8, aAt + 8), C.heart)}
      <div style={{ opacity: ramp(frame, aAt - 8, aAt + 8) }}><Timeline blocks={SIX} x0={160} x1={1760} base={510} maxH={160} fill={fa} /></div>
      {row(t.b, t.bSub, 560, ramp(frame, bAt - 8, bAt + 8), C.violet)}
      <div style={{ opacity: ramp(frame, bAt - 8, bAt + 8) }}><Timeline blocks={SIT} x0={160} x1={1760} base={820} maxH={160} fill={fb} numbers={false} /></div>
    </AbsoluteFill>
  );
};

// ---- 13 · Week ----------------------------------------------------------------------------------------------

type Activity = "intervals" | "zone2" | "strength" | "walk";
const PLAN: (Activity | null)[] = ["strength", "intervals", "walk", "strength", "walk", "zone2", "walk"];
const ACT = {
  intervals: { icon: "⚡", color: C.heart }, zone2: { icon: "🚴", color: C.oxygen }, strength: { icon: "🏋️", color: C.muscle }, walk: { icon: "🚶", color: C.train },
};

export const Week: React.FC = () => {
  const frame = useCurrentFrame();
  const t = useText().week;
  const at = useAt();
  const cueOf: Record<Activity, number> = {
    intervals: at("week", t.cues.intervals), zone2: at("week", t.cues.zone2), strength: at("week", t.cues.strength), walk: at("week", t.cues.walk),
  };
  const label: Record<Activity, [string, string]> = {
    intervals: [t.intervals, ""], zone2: [t.zone2, t.zone2Sub], strength: [t.strength, ""], walk: [t.walk, ""],
  };
  const cols = useSpring(6, 200);
  return (
    <AbsoluteFill>
      <Heading eyebrow={t.eyebrow} title={t.title} color={C.train} />
      <AbsoluteFill style={{ flexDirection: "row", justifyContent: "center", gap: 22, paddingTop: 290 }}>
        {t.days.map((day, i) => {
          const act = PLAN[i];
          const order = act ? PLAN.slice(0, i).filter((a) => a === act).length : 0;
          const from = act ? cueOf[act] + order * 10 : 0;
          return (
            <div key={day} style={{ width: 208, height: 470, borderRadius: 24, background: C.panel, border: `2px solid ${C.line}`,
              opacity: cols, transform: `translateY(${(1 - cols) * 30}px)`, display: "flex", flexDirection: "column", alignItems: "center", paddingTop: 26 }}>
              <div style={T({ fontSize: 30, fontWeight: 600, color: C.dim, letterSpacing: 2 })}>{day}</div>
              {act ? (
                <Pop from={from} style={{ display: "flex", flexDirection: "column", alignItems: "center", marginTop: 50 }}>
                  <div style={{ width: 124, height: 124, borderRadius: "50%", background: `${ACT[act].color}22`, border: `4px solid ${ACT[act].color}`,
                    display: "flex", alignItems: "center", justifyContent: "center", fontSize: 64 }}>{ACT[act].icon}</div>
                  <div style={{ fontFamily: display, fontSize: 32, fontWeight: 700, color: ACT[act].color, marginTop: 22, textAlign: "center" }}>{label[act][0]}</div>
                  <div style={T({ fontSize: 24, color: C.dim })}>{label[act][1]}</div>
                </Pop>
              ) : null}
            </div>
          );
        })}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ---- 14 · Strength ------------------------------------------------------------------------------------------

/** A stick figure from a few joint angles; `u` (0–1–0) runs the movement. */
const Figure: React.FC<{ move: number; u: number; color: string }> = ({ move, u, color }) => {
  const s = { stroke: color, strokeWidth: 9, strokeLinecap: "round" as const, fill: "none" };
  // hip height, torso lean, knee bend, arm angles per movement
  const hipY = move === 0 ? 150 + 60 * u : move === 1 ? 150 + 10 * u : 150;
  const lean = move === 1 ? 70 * u : move === 0 ? 20 * u : 0; // degrees forward
  const rad = (d: number) => (d * Math.PI) / 180;
  const shoulder = [100 + Math.sin(rad(lean)) * 90, hipY - Math.cos(rad(lean)) * 90];
  const head = [100 + Math.sin(rad(lean)) * 128, hipY - Math.cos(rad(lean)) * 128];
  const kneeX = move === 0 ? 100 + 50 * u : 100 + 8 * u;
  const knee = [kneeX, (hipY + 260) / 2 + (move === 0 ? 0 : 0)];
  let hand: [number, number];
  if (move === 2) hand = [shoulder[0] + 30, shoulder[1] - 40 - 70 * u]; // overhead press
  else if (move === 3) hand = [shoulder[0] + 90 - 70 * u, shoulder[1] + 20]; // row
  else if (move === 4) hand = [shoulder[0] + 4, shoulder[1] + 92]; // carry
  else if (move === 1) hand = [shoulder[0] + 10, shoulder[1] + 86]; // hinge, arms hang
  else hand = [shoulder[0] + 70, shoulder[1] + 10]; // squat, arms forward
  const walk = move === 4 ? Math.sin(u * Math.PI * 2) * 24 : 0;
  return (
    <svg width={280} height={420} viewBox="0 0 200 300">
      <line x1={100} y1={hipY} x2={knee[0] + walk} y2={knee[1]} {...s} />
      <line x1={knee[0] + walk} y1={knee[1]} x2={100 + walk * 1.4} y2={262} {...s} />
      <line x1={100} y1={hipY} x2={knee[0] - walk} y2={knee[1]} {...s} opacity={0.6} />
      <line x1={knee[0] - walk} y1={knee[1]} x2={100 - walk * 1.4} y2={262} {...s} opacity={0.6} />
      <line x1={100} y1={hipY} x2={shoulder[0]} y2={shoulder[1]} {...s} />
      <line x1={shoulder[0]} y1={shoulder[1]} x2={hand[0]} y2={hand[1]} {...s} />
      <circle cx={head[0]} cy={head[1]} r={22} fill={color} />
      {move === 4 || move === 1 ? <rect x={hand[0] - 16} y={hand[1]} width={32} height={30} rx={6} fill={color} /> : null}
      {move === 2 || move === 0 ? <line x1={hand[0] - 34} y1={hand[1]} x2={hand[0] + 34} y2={hand[1]} {...s} strokeWidth={7} /> : null}
      <line x1={30} y1={266} x2={170} y2={266} stroke={C.line} strokeWidth={4} />
    </svg>
  );
};

export const Strength: React.FC = () => {
  const frame = useCurrentFrame();
  const t = useText().strength;
  const at = useAt();
  const movesAt = at("strength", t.cues.moves);
  const badgeAt = at("strength", t.cues.badge);
  return (
    <AbsoluteFill>
      <Heading eyebrow={t.eyebrow} title={t.title} color={C.muscle} />
      <AbsoluteFill style={{ flexDirection: "row", justifyContent: "center", alignItems: "center", gap: 20, paddingTop: 60 }}>
        {t.moves.map((m, i) => {
          const u = (1 - Math.cos(((frame + i * 9) / 26) * Math.PI)) / 2;
          return (
            <Pop key={m} from={movesAt + i * 12} style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
              <Figure move={i} u={u} color={C.muscle} />
              <div style={{ fontFamily: display, fontSize: 38, fontWeight: 700, color: C.text, marginTop: 10 }}>{m}</div>
            </Pop>
          );
        })}
      </AbsoluteFill>
      <Pop from={badgeAt} style={{ position: "absolute", right: 150, top: 96, padding: "14px 34px", borderRadius: 40, border: `4px solid ${C.muscle}`,
        fontFamily: display, fontSize: 46, fontWeight: 700, color: C.muscle }}>{t.badge}</Pop>
    </AbsoluteFill>
  );
};

// ---- 15 · Progression ---------------------------------------------------------------------------------------

export const Progression: React.FC = () => {
  const frame = useCurrentFrame();
  const t = useText().progression;
  const at = useAt();
  const stepAt = t.cues.steps.map((c) => at("progression", c));
  const colors = [C.oxygen, C.muscle, C.heart];
  const icons = [["🚴", "🚴", "🏋️", "🏋️"], ["🚴", "🚴", "🏋️", "🏋️", "⚡"], ["⚡", "🚴", "🏋️", "🏋️", "🚶"]];
  return (
    <AbsoluteFill>
      <Heading eyebrow={t.eyebrow} title={t.title} color={C.train} />
      <svg width={W} height={H} style={{ position: "absolute" }}>
        {stepAt.map((s, i) => {
          const p = ramp(frame, s - 6, s + 22);
          const x = 200 + i * 520;
          const top = 760 - (i + 1) * 150;
          return <rect key={i} x={x} y={top + (1 - p) * 150} width={500} height={(820 - top) * p} rx={18} fill={colors[i]} opacity={0.22} stroke={colors[i]} strokeWidth={3} />;
        })}
      </svg>
      {stepAt.map((s, i) => {
        const x = 200 + i * 520;
        const top = 760 - (i + 1) * 150;
        return (
          <Pop key={i} from={s + 10} style={{ position: "absolute", left: x, top: top - 210, width: 500, textAlign: "center" }}>
            <div style={{ fontFamily: display, fontSize: 44, fontWeight: 700, color: colors[i] }}>{t.weeks[i]}</div>
            <div style={{ fontSize: 50, margin: "10px 0", letterSpacing: 6 }}>{icons[i].join(" ")}</div>
            <div style={T({ fontSize: 27, color: C.text, fontWeight: 500 })}>{t.steps[i]}</div>
          </Pop>
        );
      })}
      <div style={T({ position: "absolute", left: 200, top: 840, fontSize: 22, color: C.faint, opacity: ramp(frame, stepAt[0], stepAt[0] + 20) })}>{t.note}</div>
    </AbsoluteFill>
  );
};

// ---- 16 · Finale --------------------------------------------------------------------------------------------

/** The sedentary decline again, with a trained line held higher: a picture of the idea, not data. */
export const Finale: React.FC = () => {
  const frame = useCurrentFrame();
  const t = useText().finale;
  const at = useAt();
  const trainedAt = at("finale", t.cues.trained);
  const noteAt = at("finale", t.cues.note);
  const axes = useSpring(4, 200);
  const sed = ramp(frame, 0, 50);
  const tr = ramp(frame, trainedAt - 10, trainedAt + 70);
  const trained: [number, number][] = [[20, 100], [30, 98], [40, 95], [50, 91], [60, 86], [70, 80]];
  return (
    <AbsoluteFill>
      <svg width={W} height={H} style={{ position: "absolute" }}>
        <g opacity={axes}>
          {[20, 30, 40, 50, 60, 70].map((age) => (
            <text key={age} x={ax(age)} y={CH.y1 + 46} textAnchor="middle" style={{ fontFamily: display, fontSize: 30, fill: C.dim }}>{age}</text>
          ))}
          <line x1={CH.x0} x2={CH.x1} y1={CH.y1} y2={CH.y1} stroke={C.line} strokeWidth={3} />
        </g>
        <Draw d={smooth(toXY(VO2))} p={sed} color={C.faint} width={7} />
        <text x={ax(70) + 20} y={ay(54) + 10} style={{ fontFamily: sans, fontSize: 28, fill: C.faint }} opacity={sed}>{t.sedentary}</text>
        <Draw d={smooth(toXY(trained))} p={tr} color={C.train} width={10} glow />
        <text x={ax(70) + 20} y={ay(80) + 10} style={{ fontFamily: display, fontSize: 34, fontWeight: 700, fill: C.train }} opacity={tr}>{t.trained}</text>
      </svg>
      <div style={{ position: "absolute", top: 110, width: W, textAlign: "center", fontFamily: display, fontSize: 80, fontWeight: 700, color: C.text,
        opacity: useSpring(10) }}>{t.line}</div>
      <Pop from={noteAt} style={{ position: "absolute", top: 230, width: W, textAlign: "center" }}>
        <span style={T({ fontSize: 30, color: "#fde68a", background: "rgba(245,158,11,0.14)", border: `2px solid ${C.muscle}`, borderRadius: 30, padding: "10px 28px" })}>
          ⚕ {t.note}
        </span>
      </Pop>
    </AbsoluteFill>
  );
};

// ---- 17 · Outro ---------------------------------------------------------------------------------------------

export const Outro: React.FC = () => {
  const t = useText().outro;
  const p = useSpring(6, 200);
  const line = (label: string, text: string, i: number) => (
    <div style={T({ fontSize: 28, color: C.dim, marginTop: 14, opacity: p, transform: `translateY(${(1 - p) * (10 + i * 6)}px)` })}>
      <span style={{ color: C.oxygen, fontWeight: 600 }}>{label}</span> {text}
    </div>
  );
  return (
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", textAlign: "center" }}>
      <div style={{ fontFamily: display, fontSize: 96, fontWeight: 700, color: C.text, opacity: p, marginBottom: 30 }}><Sub text={t.title} /></div>
      {line(t.basedOn, `“${META.source.title}”, ${META.source.authors}, ${META.source.publisher} (2026)`, 0)}
      {line(t.studies, META.studies.join(" · "), 1)}
      {line(t.music, MUSIC.map((m) => `“${m.title}”`).join(" · ") + ` — ${MUSIC[0].composer}, ${MUSIC[0].license}`, 2)}
      <div style={T({ fontSize: 24, color: C.faint, marginTop: 40, opacity: p })}>{t.made}</div>
    </AbsoluteFill>
  );
};
