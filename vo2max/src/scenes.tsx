// The scenes, drawn in SVG and CSS: every chart, diagram and figure is code. Values come from SOURCE.md;
// words come from text.ts; a visual appears when its narration cue is reached (useAt).
import React from "react";
import { AbsoluteFill, interpolate, random, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { getLength, getPointAtLength } from "@remotion/paths";
import { C, Pop, Heading, Reveal, Sub, clamp, display, ramp, sans, useAt, useCount, useLang, useSpring, useText } from "./ui";
import { BloodCell, Bike, Bolt, Capillaries, Cross, Dumbbell, Fibre, Heart, Lungs, Mitochondrion, Speech, Walker } from "./icons";
import { META, MUSIC } from "./slides";

const W = 1920;
const H = 1080;
const out3 = (x: number) => 1 - (1 - x) ** 3;

/** A path drawn progressively (0 → 1) using a normalised path length; `glow` adds a soft halo. */
const Draw: React.FC<{ d: string; p: number; color: string; width?: number; glow?: boolean; opacity?: number }> = ({
  d, p, color, width = 6, glow, opacity = 1,
}) => (
  <g opacity={opacity}>
    {glow ? <path d={d} fill="none" stroke={color} strokeWidth={width * 3.4} strokeOpacity={0.14} strokeLinecap="round"
      pathLength={1} strokeDasharray="1" strokeDashoffset={1 - p} /> : null}
    <path d={d} fill="none" stroke={color} strokeWidth={width} strokeLinecap="round" strokeLinejoin="round"
      pathLength={1} strokeDasharray="1" strokeDashoffset={1 - p} />
  </g>
);

/** The point a fraction `p` of the way along a path. */
const along = (d: string, p: number) => getPointAtLength(d, getLength(d) * Math.max(0, Math.min(1, p)));

/** A glowing dot that leads a line as it draws. */
const Spark: React.FC<{ x: number; y: number; color: string; r?: number; opacity?: number }> = ({ x, y, color, r = 12, opacity = 1 }) => (
  <g opacity={opacity}>
    <circle cx={x} cy={y} r={r * 3.2} fill={color} opacity={0.14} />
    <circle cx={x} cy={y} r={r * 1.8} fill={color} opacity={0.25} />
    <circle cx={x} cy={y} r={r} fill="#fff" />
    <circle cx={x} cy={y} r={r * 0.62} fill={color} />
  </g>
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

/** A soft beat (0–1) at `bpm`, from an accumulated phase so a changing rate never jumps. */
const beatOf = (phase: number) => Math.max(0, Math.sin(phase * Math.PI * 2)) ** 8;

// ---- An age chart (20 → 70) shared by the decline, curves and finale scenes ----------------------------------

const CH = { x0: 260, x1: 1480, y0: 250, y1: 790 }; // plot box (room on the right for labels)
const ax = (age: number) => CH.x0 + ((age - 20) / 50) * (CH.x1 - CH.x0);
const ay = (pct: number) => CH.y1 - ((pct - 40) / 65) * (CH.y1 - CH.y0); // 40 % … 105 %
const ageOf = (x: number) => 20 + ((x - CH.x0) / (CH.x1 - CH.x0)) * 50;
const pctOf = (y: number) => 40 + ((CH.y1 - y) / (CH.y1 - CH.y0)) * 65;
/** Sedentary VO₂ max, % of age 20: flat to ~30, then ≈ −10 % per decade, −46 % by 70 (SOURCE.md). */
const VO2: [number, number][] = [[20, 100], [30, 97], [40, 87], [50, 76], [60, 65], [70, 54]];
/** Maximal cardiac output, % of age 20: −31 % by 70. */
const CO: [number, number][] = [[20, 100], [30, 96], [40, 89], [50, 82], [60, 75], [70, 69]];
const toXY = (pts: [number, number][]) => pts.map(([a, v]) => [ax(a), ay(v)] as [number, number]);

const AgeAxes: React.FC<{ p: number; label: string; yLabel?: string }> = ({ p, label, yLabel }) => (
  <g>
    {[20, 30, 40, 50, 60, 70].map((age, i) => {
      const q = ramp(p * 10, i * 0.8, i * 0.8 + 3);
      return (
        <g key={age} opacity={q}>
          <line x1={ax(age)} x2={ax(age)} y1={CH.y1 - (CH.y1 - CH.y0) * q} y2={CH.y1} stroke={C.grid} strokeWidth={2} />
          <text x={ax(age)} y={CH.y1 + 46} textAnchor="middle" style={{ fontFamily: display, fontSize: 30, fill: C.dim }}>{age}</text>
        </g>
      );
    })}
    <line x1={CH.x0} x2={CH.x0 + (CH.x1 - CH.x0) * p} y1={CH.y1} y2={CH.y1} stroke={C.line} strokeWidth={3} />
    <text x={CH.x1} y={CH.y1 + 90} textAnchor="end" opacity={p} style={{ fontFamily: sans, fontSize: 24, fill: C.faint, letterSpacing: 3 }}>{label.toUpperCase()}</text>
    {yLabel ? <text x={CH.x0 - 20} y={CH.y0 - 24} opacity={p} style={{ fontFamily: sans, fontSize: 24, fill: C.faint }}>{yLabel}</text> : null}
  </g>
);

// ---- 1 · Intro ----------------------------------------------------------------------------------------------

/** A heartbeat trace sweeps across behind a glowing spark; oxygen gathers into the title. */
export const Intro: React.FC = () => {
  const frame = useCurrentFrame();
  const t = useText().intro;
  const beats = [180, 520, 860, 1200, 1540];
  const beat = (x: number) => `L ${x} 540 L ${x + 30} 540 L ${x + 50} 470 L ${x + 70} 610 L ${x + 92} 380 L ${x + 118} 640 L ${x + 140} 540`;
  const d = `M 0 540 ${beats.map(beat).join(" ")} L ${W} 540`;
  const p = interpolate(frame, [0, 78], [0, 1], clamp);
  const head = along(d, p);
  // the orb behind the title flashes each time the spark crosses a beat
  const flash = beats.reduce((m, b) => Math.max(m, Math.exp(-(((head.x - (b + 92)) / 60) ** 2))), 0);
  const title = interpolate(frame, [62, 100], [0, 1], { ...clamp, easing: out3 });
  const gather = interpolate(frame, [30, 92], [0, 1], { ...clamp, easing: (x) => x * x * (3 - 2 * x) });
  const pulse = beatOf(frame / 26);
  return (
    <AbsoluteFill>
      <div style={{ position: "absolute", left: W / 2 - 600, top: H / 2 - 600, width: 1200, height: 1200, borderRadius: "50%",
        background: `radial-gradient(circle, ${C.oxygen}${Math.round(20 + 50 * Math.max(flash * (1 - title), title * (0.6 + 0.4 * pulse))).toString(16).padStart(2, "0")} 0%, ${C.oxygen}00 55%)`,
        transform: `scale(${0.7 + 0.3 * title + 0.04 * pulse})` }} />
      <svg width={W} height={H} style={{ position: "absolute", opacity: interpolate(frame, [80, 120], [1, 0.22], clamp) }}>
        <Draw d={d} p={p} color={C.heart} width={7} glow />
        {p < 1 ? <Spark x={head.x} y={head.y} color={C.heart} r={10} /> : null}
      </svg>
      <svg width={W} height={H} style={{ position: "absolute" }}>
        {Array.from({ length: 70 }, (_, i) => {
          const sx = random(`ix${i}`) * W, sy = random(`iy${i}`) * H;
          const tx = W / 2 + (random(`tx${i}`) - 0.5) * 760, ty = H / 2 - 40 + (random(`ty${i}`) - 0.5) * 200;
          const g = Math.min(1, gather * (1 + random(`d${i}`) * 0.6));
          const x = sx + (tx - sx) * g, y = sy + (ty - sy) * g;
          const o = interpolate(frame, [28, 40, 92, 104], [0, 0.85, 0.85, 0], clamp);
          return <circle key={i} cx={x} cy={y} r={3 + random(`s${i}`) * 4} fill={C.oxygen} opacity={o} />;
        })}
      </svg>
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
        <div style={{ fontFamily: display, fontSize: 240, fontWeight: 700, letterSpacing: -7, lineHeight: 1, opacity: title,
          filter: `blur(${(1 - title) * 18}px)`, transform: `scale(${1.12 - 0.12 * title})`,
          background: `linear-gradient(180deg, #ffffff 30%, ${C.oxygen} 130%)`, WebkitBackgroundClip: "text", backgroundClip: "text", color: "transparent",
          textShadow: "none", paddingBottom: 12 }}>
          <Sub text={t.title} />
        </div>
        <div style={T({ fontSize: 42, color: C.dim, marginTop: 18 })}><Reveal text={t.subtitle} delay={96} stagger={3} /></div>
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
  const axes = interpolate(frame, [6, 40], [0, 1], { ...clamp, easing: out3 });
  const line = interpolate(frame, [decade - 20, decade + 150], [0, 1], { ...clamp, easing: (x) => x * x * (3 - 2 * x) });
  const brace = useSpring(half);
  const lost = ramp(frame, half - 6, half + 30);
  const pts = toXY(VO2);
  const d = smooth(pts);
  const head = along(d, line);
  const total = useCount(0, 46, half, 36);
  const area = `${d} L ${ax(70)} ${CH.y1} L ${ax(20)} ${CH.y1} Z`;
  const gap = `${d} L ${ax(70)} ${ay(100)} L ${ax(20)} ${ay(100)} Z`;
  const chip = Math.min(ramp(frame, decade - 10, decade + 6), 1 - ramp(frame, half - 10, half + 6));
  return (
    <AbsoluteFill>
      <Heading eyebrow={t.eyebrow} title={t.title} />
      <svg width={W} height={H} style={{ position: "absolute" }}>
        <defs>
          <linearGradient id="dec-fill" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0" stopColor={C.oxygen} stopOpacity={0.32} />
            <stop offset="1" stopColor={C.oxygen} stopOpacity={0} />
          </linearGradient>
          <pattern id="dec-hatch" width="14" height="14" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
            <rect width="14" height="14" fill={C.heart} opacity={0.12} />
            <line x1="0" y1="0" x2="0" y2="14" stroke={C.heart} strokeWidth="4" opacity={0.35} />
          </pattern>
          <clipPath id="dec-clip"><rect x={0} y={0} width={head.x} height={H} /></clipPath>
        </defs>
        <AgeAxes p={axes} label={t.age} yLabel={t.axis} />
        <line x1={ax(20)} x2={ax(20) + (ax(70) - ax(20)) * axes} y1={ay(100)} y2={ay(100)} stroke={C.faint} strokeWidth={2} strokeDasharray="8 10" />
        <path d={area} fill="url(#dec-fill)" clipPath="url(#dec-clip)" />
        <path d={gap} fill="url(#dec-hatch)" opacity={lost} />
        <Draw d={d} p={line} color={C.oxygen} width={9} glow />
        {pts.slice(2).map(([x, y], i) => {
          const show = spring({ frame: frame - (decade + 30 + i * 26), fps: 30, config: { damping: 12 } });
          return (
            <g key={i} opacity={Math.min(1, show)} transform={`translate(${x} ${y}) scale(${show})`}>
              <circle r={11} fill={C.bg} stroke={C.oxygen} strokeWidth={5} />
              <text y={-30} textAnchor="middle" style={{ fontFamily: display, fontSize: 28, fill: C.oxygen, fontWeight: 700 }}>−10 %</text>
            </g>
          );
        })}
        <g opacity={ramp(frame, decade, decade + 20)}>
          <text x={ax(30)} y={ay(97) + 56} textAnchor="middle" style={{ fontFamily: sans, fontSize: 26, fill: C.dim }}>{t.start}</text>
        </g>
        {line > 0 ? <Spark x={head.x} y={head.y} color={C.oxygen} r={11} /> : null}
        <g opacity={chip} transform={`translate(${head.x + 26} ${head.y + 30})`}>
          <rect width={176} height={84} rx={16} fill="rgba(11,19,32,0.88)" stroke={C.oxygen} strokeWidth={2} />
          <text x={20} y={46} style={{ fontFamily: display, fontSize: 40, fontWeight: 700, fill: C.text }}>{Math.round(pctOf(head.y))} %</text>
          <text x={20} y={72} style={{ fontFamily: sans, fontSize: 20, fill: C.dim }}>{t.age} {Math.round(ageOf(head.x))}</text>
        </g>
        <g opacity={brace} transform={`translate(${(1 - brace) * 30} 0)`}>
          <path d={`M ${ax(70) + 40} ${ay(100)} Q ${ax(70) + 70} ${ay(100)} ${ax(70) + 70} ${ay(77)} L ${ax(70) + 90} ${ay(77)} M ${ax(70) + 70} ${ay(77)} Q ${ax(70) + 70} ${ay(54)} ${ax(70) + 40} ${ay(54)}`}
            fill="none" stroke={C.heart} strokeWidth={5} />
          <text x={ax(70) + 96} y={ay(77) + 30} style={{ fontFamily: display, fontSize: 86, fontWeight: 700, fill: C.heart, filter: `drop-shadow(0 0 24px ${C.heart}88)` }}>−{total} %</text>
        </g>
        <text x={ax(52)} y={ay(64)} style={{ fontFamily: sans, fontSize: 26, fill: C.dim, fontStyle: "italic" }} opacity={ramp(frame, decade + 100, decade + 130)}>{t.sedentary}</text>
      </svg>
    </AbsoluteFill>
  );
};

// ---- 3 · Fick -----------------------------------------------------------------------------------------------

const MuscleIcon: React.FC<{ glow: number; size?: number; flex: number }> = ({ glow, size = 230, flex }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" style={{ overflow: "visible", filter: `drop-shadow(0 0 ${10 + 30 * glow}px ${C.muscle}88)` }}>
    <g transform={`translate(50 50) scale(${1 + 0.05 * flex} ${1 - 0.04 * flex}) translate(-50 -50)`}>
      <path d="M10 50 C 30 18 70 18 90 50 C 70 82 30 82 10 50 Z" fill={C.muscle} />
      {[34, 42, 50, 58, 66].map((y) => (
        <path key={y} d={`M18 ${50 + (y - 50) * 0.2} C 38 ${y - 6} 62 ${y - 6} 82 ${50 + (y - 50) * 0.2}`} stroke="#7c4a03" strokeWidth={2.4} fill="none" opacity={0.55} />
      ))}
      <ellipse cx={40} cy={36} rx={14} ry={5} fill="#fff" opacity={0.2} />
    </g>
  </svg>
);

/** Heart × muscle = VO₂ max: blood loops from the heart to the muscle (red cells carrying oxygen) and back. */
export const Fick: React.FC = () => {
  const frame = useCurrentFrame();
  const t = useText().fick;
  const vo2Name = useText().curves.vo2;
  const at = useAt();
  const heartAt = at("fick", t.cues.heart);
  const muscleAt = at("fick", t.cues.muscle);
  const eqAt = at("fick", t.cues.equals);
  const beat = beatOf(frame / 24);
  const flow = ramp(frame, heartAt + 10, heartAt + 40);
  const take = ramp(frame, muscleAt, muscleAt + 20);
  const artery = "M 520 400 C 620 210, 820 210, 920 400";
  const vein = "M 920 540 C 820 730, 620 730, 520 540";
  const ring = interpolate(frame, [eqAt, eqAt + 50], [0, 1], { ...clamp, easing: out3 });
  const cells = 7;
  const label = (x: number, from: number, name: string, sub: string, color: string) => (
    <div style={{ position: "absolute", left: x - 200, top: 640, width: 400, textAlign: "center", opacity: ramp(frame, from, from + 14) }}>
      <div style={{ fontFamily: display, fontSize: 54, fontWeight: 700, color }}><Sub text={name} /></div>
      <div style={T({ fontSize: 30, color: C.dim })}>{sub}</div>
    </div>
  );
  return (
    <AbsoluteFill>
      <Heading eyebrow={t.eyebrow} title={t.title} />
      <svg width={W} height={H} style={{ position: "absolute" }}>
        <defs>
          <linearGradient id="fick-art" x1="0" x2="1"><stop offset="0" stopColor={C.heart} /><stop offset="1" stopColor="#fb7185" /></linearGradient>
        </defs>
        <g opacity={flow}>
          <path d={artery} fill="none" stroke="url(#fick-art)" strokeWidth={34} strokeLinecap="round" opacity={0.25} />
          <path d={vein} fill="none" stroke={C.violet} strokeWidth={30} strokeLinecap="round" opacity={0.16} />
          {Array.from({ length: cells }, (_, i) => {
            const u = (frame / 70 + i / cells) % 1;
            const a = along(artery, u);
            const v = along(vein, u);
            const o = Math.sin(u * Math.PI);
            const drop = take * Math.max(0, (u - 0.75) / 0.25); // oxygen leaves the cell into the muscle
            return (
              <g key={i}>
                <g transform={`translate(${a.x - 18} ${a.y - 18})`} opacity={o}><BloodCell size={36} color={C.heart} t={frame + i * 20} /></g>
                <circle cx={a.x + 4 + drop * 60} cy={a.y - 14 + drop * 110} r={8} fill={C.oxygen} opacity={o * (1 - drop * 0.9) + drop * (1 - drop)} />
                <g transform={`translate(${v.x - 15} ${v.y - 15})`} opacity={o * 0.7}><BloodCell size={30} color={C.violet} t={frame + i * 20} /></g>
              </g>
            );
          })}
        </g>
        <g opacity={ring > 0 ? 1 : 0}>
          <circle cx={1530} cy={470} r={118} fill="none" stroke={C.line} strokeWidth={12} />
          <circle cx={1530} cy={470} r={118} fill="none" stroke={C.oxygen} strokeWidth={12} strokeLinecap="round" pathLength={1}
            strokeDasharray="1" strokeDashoffset={1 - ring} transform="rotate(-90 1530 470)" style={{ filter: `drop-shadow(0 0 18px ${C.oxygen})` }} />
        </g>
      </svg>
      <div style={{ position: "absolute", left: 430 - 125, top: 470 - 125 }}>
        <Pop from={heartAt}><Heart size={250} color={C.heart} beat={beat} style={{ filter: `drop-shadow(0 0 ${24 + 30 * beat}px ${C.heart}88)` }} /></Pop>
      </div>
      <div style={{ position: "absolute", left: 1010 - 125, top: 470 - 125 }}>
        <Pop from={muscleAt}><MuscleIcon size={250} glow={take} flex={take * beatOf(frame / 24 - 0.1)} /></Pop>
      </div>
      <Pop from={muscleAt} style={{ position: "absolute", left: 665, top: 395, width: 120, textAlign: "center", fontFamily: display, fontSize: 120, color: C.text }}>×</Pop>
      <Pop from={eqAt} style={{ position: "absolute", left: 1210, top: 395, width: 120, textAlign: "center", fontFamily: display, fontSize: 120, color: C.text }}>=</Pop>
      <div style={{ position: "absolute", left: 1530 - 120, top: 470 - 50, width: 240, textAlign: "center", fontFamily: display, fontSize: 84, fontWeight: 700,
        color: C.oxygen, opacity: ring, transform: `scale(${0.6 + 0.4 * ring})`, textShadow: `0 0 30px ${C.oxygen}` }}><Sub text="O₂" /></div>
      {label(430, heartAt, t.heart, t.pump, C.heart)}
      {label(1010, muscleAt, t.muscle, t.extract, C.muscle)}
      {label(1530, eqAt, vo2Name, " ", C.oxygen)}
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
  const axes = interpolate(frame, [4, 36], [0, 1], { ...clamp, easing: out3 });
  const co = interpolate(frame, [coAt - 10, coAt + 70], [0, 1], { ...clamp, easing: (x) => x * x * (3 - 2 * x) });
  const vo2 = interpolate(frame, [vo2At - 10, vo2At + 60], [0, 1], { ...clamp, easing: (x) => x * x * (3 - 2 * x) });
  const gap = ramp(frame, gapAt - 10, gapAt + 30);
  const hrOf = (f: number) => interpolate(f, [hrAt, hrAt + 90], [200, 150], clamp);
  let phase = 0;
  for (let f = 0; f <= frame; f++) phase += hrOf(f) / 60 / 30;
  const beat = frame >= hrAt ? beatOf(phase) : 0;
  const coPts = toXY(CO);
  const vo2Pts = toXY(VO2);
  const dCo = smooth(coPts);
  const dVo2 = smooth(vo2Pts);
  const hCo = along(dCo, co);
  const hVo2 = along(dVo2, vo2);
  const area = `${dCo} L ${vo2Pts[vo2Pts.length - 1][0]} ${vo2Pts[vo2Pts.length - 1][1]} ${smooth([...vo2Pts].reverse()).replace(/^M [^C]+/, "")} Z`;
  const coPct = useCount(0, 31, coAt + 40, 40);
  const voPct = useCount(0, 46, vo2At + 30, 40);
  return (
    <AbsoluteFill>
      <Heading eyebrow={t.eyebrow} title={t.title} />
      <svg width={W} height={H} style={{ position: "absolute" }}>
        <defs>
          <linearGradient id="gap-fill" x1="0" x2="1">
            <stop offset="0" stopColor={C.muscle} stopOpacity={0} />
            <stop offset="1" stopColor={C.muscle} stopOpacity={0.5} />
          </linearGradient>
          <clipPath id="gap-clip"><rect x={0} y={0} width={CH.x0 + (CH.x1 - CH.x0) * gap} height={H} /></clipPath>
        </defs>
        <AgeAxes p={axes} label={t.age} />
        <path d={area} fill="url(#gap-fill)" clipPath="url(#gap-clip)" />
        <Draw d={dCo} p={co} color={C.heart} width={8} glow />
        <Draw d={dVo2} p={vo2} color={C.oxygen} width={8} glow />
        {co > 0 ? <Spark x={hCo.x} y={hCo.y} color={C.heart} r={9} /> : null}
        {vo2 > 0 ? <Spark x={hVo2.x} y={hVo2.y} color={C.oxygen} r={9} /> : null}
        <g opacity={ramp(frame, coAt + 40, coAt + 56)}>
          <text x={ax(70) + 30} y={ay(69) + 10} style={{ fontFamily: display, fontSize: 44, fontWeight: 700, fill: C.heart }}>−{coPct} %</text>
          <text x={ax(70) + 30} y={ay(69) + 44} style={{ fontFamily: sans, fontSize: 24, fill: C.dim }}>{t.output}</text>
        </g>
        <g opacity={ramp(frame, vo2At + 30, vo2At + 46)}>
          <text x={ax(70) + 30} y={ay(54) + 10} style={{ fontFamily: display, fontSize: 44, fontWeight: 700, fill: C.oxygen }}>−{voPct} %</text>
          <text x={ax(70) + 30} y={ay(54) + 44} style={{ fontFamily: sans, fontSize: 24, fill: C.dim }}><Sub text={t.vo2} /></text>
        </g>
        <g opacity={gap} transform={`translate(${ax(60)} ${(ay(75) + ay(65)) / 2 + 10})`}>
          <text textAnchor="middle" style={{ fontFamily: display, fontSize: 44, fontWeight: 700, fill: C.muscle, filter: `drop-shadow(0 0 14px ${C.muscle})` }}>{t.gap}</text>
        </g>
      </svg>
      <Pop from={hrAt} style={{ position: "absolute", right: 130, top: 84, display: "flex", alignItems: "center", gap: 24 }}>
        <Heart size={110} color={C.heart} beat={beat} style={{ filter: `drop-shadow(0 0 ${10 + 24 * beat}px ${C.heart})` }} />
        <div style={{ textAlign: "right" }}>
          <div style={T({ fontSize: 22, color: C.dim, letterSpacing: 3, textTransform: "uppercase" })}>{t.hr}</div>
          <div style={{ fontFamily: display, fontSize: 96, fontWeight: 700, color: C.heart, lineHeight: 1 }}>{Math.round(hrOf(frame))}<span style={{ fontSize: 34, color: C.dim }}> bpm</span></div>
          <div style={T({ fontSize: 26, color: C.dim })}>{t.perYear}</div>
        </div>
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
  const grow = interpolate(frame, [16, 56], [0, 1], { ...clamp, easing: out3 });
  const m = useSpring(olderAt, 22);
  const heart = 77 + (56 - 77) * m;
  const width = 1500;
  const x0 = (W - width) / 2;
  const shine = interpolate((frame % 120), [0, 60], [-0.2, 1.2], clamp);
  const beat = beatOf(frame / 26);
  return (
    <AbsoluteFill>
      <Heading eyebrow={t.eyebrow} title={t.title} />
      <div style={{ position: "absolute", left: x0, top: 330, width }}>
        <div style={{ fontFamily: display, fontSize: 52, fontWeight: 700, color: C.text, marginBottom: 30, height: 64, position: "relative" }}>
          <span style={{ opacity: 1 - m, position: "absolute", filter: `blur(${m * 8}px)` }}>{t.young}</span>
          <span style={{ opacity: m, position: "absolute", filter: `blur(${(1 - m) * 8}px)` }}>{t.older}</span>
        </div>
        <div style={{ display: "flex", height: 200, borderRadius: 26, overflow: "hidden", clipPath: `inset(0 ${(1 - grow) * 100}% 0 0 round 26px)`, position: "relative",
          boxShadow: `0 20px 60px rgba(0,0,0,0.4)` }}>
          <div style={{ width: `${heart}%`, background: `linear-gradient(90deg, #be123c, ${C.heart} 60%, #fb7185)`, display: "flex", alignItems: "center", paddingLeft: 36, gap: 26 }}>
            <Heart size={110} color="#fff" beat={beat} style={{ opacity: 0.95 }} />
            <span style={{ fontFamily: display, fontSize: 96, fontWeight: 700, color: "#fff" }}>{Math.round(heart)} %</span>
          </div>
          <div style={{ flex: 1, background: `linear-gradient(90deg, #d97706, ${C.muscle} 40%, #fcd34d)`, display: "flex", alignItems: "center", justifyContent: "flex-end", paddingRight: 36, gap: 22 }}>
            <span style={{ fontFamily: display, fontSize: 96, fontWeight: 700, color: "#3b2203" }}>{Math.round(100 - heart)} %</span>
            <Fibre size={100} color="#3b2203" />
          </div>
          <div style={{ position: "absolute", inset: 0, background: `linear-gradient(100deg, rgba(255,255,255,0) ${shine * 100 - 12}%, rgba(255,255,255,0.22) ${shine * 100}%, rgba(255,255,255,0) ${shine * 100 + 12}%)` }} />
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", marginTop: 26, opacity: grow }}>
          <span style={T({ fontSize: 34, color: C.heart, fontWeight: 600 })}>{t.heart}</span>
          <span style={T({ fontSize: 34, color: C.muscle, fontWeight: 600, transform: `scale(${1 + 0.1 * m})`, transformOrigin: "right" })}>{t.muscle}</span>
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ---- 6 · Extraction -----------------------------------------------------------------------------------------

/** A dial (0–100 %) whose needle springs to `value`, over a row of ten oxygen molecules of which `value / 10` are caught. */
const Gauge: React.FC<{ value: number; from: number; label: string; color: string }> = ({ value, from, label, color }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame: frame - from, fps, config: { damping: 11, mass: 1.1 } });
  const v = value * s;
  const show = ramp(frame, from - 10, from + 8);
  const r = 230;
  const a = Math.PI * (1 - v / 100);
  const arc = (x: number) => {
    const angle = Math.PI * (1 - Math.max(0.01, x) / 100);
    return `M ${-r} 0 A ${r} ${r} 0 0 1 ${r * Math.cos(angle)} ${-r * Math.sin(angle)}`;
  };
  const caught = Math.round(value / 10);
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", opacity: show, transform: `translateY(${(1 - show) * 30}px)` }}>
      <svg width={620} height={390} viewBox="-310 -300 620 390" style={{ overflow: "visible" }}>
        <path d={`M ${-r} 0 A ${r} ${r} 0 0 1 ${r} 0`} fill="none" stroke={C.line} strokeWidth={44} strokeLinecap="round" />
        {Array.from({ length: 11 }, (_, i) => {
          const ang = Math.PI * (1 - i / 10);
          return <line key={i} x1={(r + 34) * Math.cos(ang)} y1={-(r + 34) * Math.sin(ang)} x2={(r + (i % 5 ? 44 : 54)) * Math.cos(ang)} y2={-(r + (i % 5 ? 44 : 54)) * Math.sin(ang)}
            stroke={C.faint} strokeWidth={i % 5 ? 3 : 5} />;
        })}
        <path d={arc(v)} fill="none" stroke={color} strokeWidth={44} strokeLinecap="round" style={{ filter: `drop-shadow(0 0 18px ${color})` }} />
        <line x1={0} y1={0} x2={(r - 56) * Math.cos(a)} y2={-(r - 56) * Math.sin(a)} stroke={C.text} strokeWidth={9} strokeLinecap="round" />
        <circle r={20} fill={C.text} />
        <text y={92} textAnchor="middle" style={{ fontFamily: display, fontSize: 96, fontWeight: 700, fill: color }}>{Math.round(v)} %</text>
        <text y={-r - 76} textAnchor="middle" style={{ fontFamily: sans, fontSize: 36, fontWeight: 600, fill: C.text }}>{label}</text>
      </svg>
      <div style={{ display: "flex", gap: 14, marginTop: 30 }}>
        {Array.from({ length: 10 }, (_, i) => {
          const lit = ramp(frame, from + 20 + i * 5, from + 30 + i * 5);
          const got = i < caught;
          return (
            <div key={i} style={{ width: 34, height: 34, borderRadius: "50%", border: `3px solid ${got ? color : C.faint}`,
              background: got ? color : "transparent", opacity: got ? 0.3 + 0.7 * lit : 0.25 + 0.3 * lit,
              transform: `scale(${got ? 0.7 + 0.3 * lit : 1})`, boxShadow: got && lit > 0.5 ? `0 0 16px ${color}` : "none" }} />
          );
        })}
      </div>
    </div>
  );
};

export const Extraction: React.FC = () => {
  const frame = useCurrentFrame();
  const t = useText().extraction;
  const at = useAt();
  const youngAt = at("extraction", t.cues.young);
  const oldAt = at("extraction", t.cues.old);
  return (
    <AbsoluteFill>
      <Heading eyebrow={t.eyebrow} title={t.title} color={C.muscle} />
      <AbsoluteFill style={{ flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 110, paddingTop: 110 }}>
        <Gauge value={80} from={youngAt} label={t.young} color={C.train} />
        <Gauge value={60} from={oldAt} label={t.old} color={C.muscle} />
      </AbsoluteFill>
      <div style={T({ position: "absolute", width: W, top: 868, textAlign: "center", fontSize: 30, color: C.dim, opacity: ramp(frame, youngAt, youngAt + 20) })}>{t.label}</div>
    </AbsoluteFill>
  );
};

// ---- 7–8 · The oxygen cascade -------------------------------------------------------------------------------

const STAGE_X = [260, 610, 960, 1310, 1660];
const STAGE_Y = 520;

/** Five stages joined by tubes; `damage[i]` (0–1) narrows and reddens a stage, `healed[i]` turns it green. */
const Cascade: React.FC<{ shown: number; damage: number[]; healed: number[]; tags: number[]; labels: string[]; tagText: string[] }> = ({
  shown, damage, healed, tags, labels, tagText,
}) => {
  const frame = useCurrentFrame();
  const xs = STAGE_X, y = STAGE_Y;
  const tubeW = (i: number) => 50 - 32 * damage[i + 1];
  const ringOf = (i: number) => (healed[i] > 0.5 ? C.train : damage[i] > 0.4 ? C.heart : C.oxygen);
  const icons = [
    (c: string, d: number) => <Lungs size={92} color={c} t={frame} />,
    (c: string) => <BloodCell size={92} color={c} t={frame} />,
    (c: string, d: number) => <Capillaries size={96} color={c} damage={d} />,
    (c: string, d: number) => <Fibre size={92} color={c} damage={d} />,
    (c: string, d: number) => <Mitochondrion size={96} color={c} damage={d} t={frame} />,
  ];
  const iconColor = (i: number) => (healed[i] > 0.5 ? C.train : damage[i] > 0.4 ? "#fda4af" : i === 1 ? C.heart : C.oxygen);
  const avg = damage.reduce((s, d) => s + d, 0) / damage.length;
  const speed = 0.0055 * (1 - 0.6 * avg);
  return (
    <AbsoluteFill>
      <svg width={W} height={H} style={{ position: "absolute" }}>
        {xs.slice(0, -1).map((x, i) => (
          <rect key={i} x={x} y={y - tubeW(i) / 2} width={xs[i + 1] - x} height={tubeW(i)} rx={tubeW(i) / 2}
            fill={ringOf(i + 1)} opacity={0.22 * ramp(shown, i + 0.5, i + 1.5)} />
        ))}
        {Array.from({ length: 40 }, (_, k) => {
          const u = (frame * speed + k / 40) % 1;
          const pos = u * (xs.length - 1);
          const seg = Math.floor(pos);
          if (pos > shown - 0.5) return null;
          const lostAt = damage.findIndex((d, i) => i >= 2 && d > 0.3 && k % (i + 1) === 0);
          if (lostAt >= 0 && pos > lostAt - 0.5) return null; // fewer molecules make it through a damaged stage
          const x = xs[seg] + (pos - seg) * (xs[seg + 1] - xs[seg]);
          const jitter = Math.sin(k * 12.9 + frame / 10) * Math.min(14, tubeW(Math.min(seg, 3)) / 3);
          return <circle key={k} cx={x} cy={y + jitter} r={7} fill={healed[seg] > 0.5 ? "#a7f3d0" : C.oxygen} opacity={0.9} />;
        })}
      </svg>
      {xs.map((x, i) => {
        const p = ramp(shown, i, i + 1);
        const ring = ringOf(i);
        const burst = healed[i] > 0 && healed[i] < 1 ? healed[i] : 0;
        return (
          <div key={i} style={{ position: "absolute", left: x - 90, top: y - 90, width: 180, opacity: p, transform: `scale(${0.6 + 0.4 * p})`,
            display: "flex", flexDirection: "column", alignItems: "center" }}>
            {burst ? <div style={{ position: "absolute", left: 90 - 90 * (1 + burst), top: 90 - 90 * (1 + burst), width: 180 * (1 + burst), height: 180 * (1 + burst),
              borderRadius: "50%", border: `4px solid ${C.train}`, opacity: 1 - burst }} /> : null}
            <div style={{ width: 180, height: 180, borderRadius: "50%", background: C.panel, border: `6px solid ${ring}`, display: "flex", alignItems: "center",
              justifyContent: "center", boxShadow: `0 0 40px ${ring}55, inset 0 0 30px ${ring}22` }}>
              {icons[i](iconColor(i), damage[i])}
            </div>
            <div style={T({ fontSize: 30, fontWeight: 600, marginTop: 20, whiteSpace: "nowrap" })}>{labels[i]}</div>
          </div>
        );
      })}
      {tagText.map((tag, i) => {
        const p = tags[i] * (1 - healed[i + 2]);
        return (
          <div key={tag} style={{ position: "absolute", left: xs[i + 2] - 160, width: 320, top: y - 196 - (1 - p) * 20, opacity: p, textAlign: "center" }}>
            <span style={T({ fontSize: 26, fontWeight: 600, color: "#fda4af", padding: "10px 22px", borderRadius: 30, background: "rgba(244,63,94,0.16)", border: `2px solid ${C.heart}` })}>{tag}</span>
          </div>
        );
      })}
    </AbsoluteFill>
  );
};

export const CascadeScene: React.FC = () => {
  const frame = useCurrentFrame();
  const t = useText().cascade;
  const at = useAt();
  const stagesAt = at("cascade", t.cues.stages);
  const tagAt = t.cues.tags.map((c) => at("cascade", c));
  const shown = interpolate(frame, [stagesAt - 10, stagesAt + 110], [0, 5], clamp);
  const tags = tagAt.map((a) => ramp(frame, a, a + 18));
  const damage = [0, 0, ...tagAt.map((a) => ramp(frame, a, a + 40))];
  return (
    <AbsoluteFill>
      <Heading eyebrow={t.eyebrow} title={t.title} />
      <Cascade shown={shown} damage={damage} healed={[0, 0, 0, 0, 0]} tags={tags} labels={t.stages} tagText={t.tags} />
    </AbsoluteFill>
  );
};

/** A green wave sweeps the damaged cascade from left to right and heals each stage as it passes. */
export const Trainable: React.FC = () => {
  const frame = useCurrentFrame();
  const t = useText().trainable;
  const at = useAt();
  const subAt = at("trainable", t.cues.sub);
  const stages = useText().cascade;
  const waveX = interpolate(frame, [24, 110], [-200, W + 200], { ...clamp, easing: (x) => x * x * (3 - 2 * x) });
  const healed = STAGE_X.map((x) => ramp(waveX, x - 60, x + 140));
  const damage = [0, 0, 1, 1, 1].map((d, i) => d * (1 - healed[i]));
  return (
    <AbsoluteFill>
      <div style={{ position: "absolute", left: waveX - 260, top: 0, width: 520, height: H,
        background: `linear-gradient(90deg, ${C.train}00, ${C.train}30 50%, ${C.train}00)`, opacity: waveX > -150 && waveX < W + 150 ? 1 : 0 }} />
      <Cascade shown={5} damage={damage} healed={healed} tags={[1, 1, 1]} labels={stages.stages} tagText={stages.tags} />
      <div style={{ position: "absolute", top: 110, width: W, textAlign: "center" }}>
        <div style={T({ fontSize: 26, letterSpacing: 8, textTransform: "uppercase", color: C.train, fontWeight: 600, opacity: ramp(frame, 4, 20) })}>{t.eyebrow}</div>
        <div style={{ fontFamily: display, fontSize: 92, fontWeight: 700, color: C.text, marginTop: 6, textShadow: `0 0 40px ${C.train}55` }}>
          <Reveal text={t.line} delay={14} stagger={5} />
        </div>
      </div>
      <Pop from={subAt} style={{ position: "absolute", top: 772, width: W, textAlign: "center", fontFamily: display, fontSize: 64, color: C.train, fontWeight: 700,
        textShadow: `0 0 30px ${C.train}` }}>{t.sub}</Pop>
    </AbsoluteFill>
  );
};

// ---- 9 · Tools ----------------------------------------------------------------------------------------------

/** Mølmen et al. (2025), 8–10 weeks: mitochondria, capillary-to-fibre ratio, VO₂ max (SIT VO₂ max: 6.6–8.9 %). */
const TOOLS = [
  { color: C.train, values: [22.7, 15.0, 12.5], range: null as string | null },
  { color: C.oxygen, values: [27.0, 13.3, 12.1], range: null as string | null },
  { color: C.violet, values: [27.0, 10.4, 7.8], range: "6.6–8.9" },
];

export const Tools: React.FC = () => {
  const frame = useCurrentFrame();
  const t = useText().tools;
  const at = useAt();
  const colAt = t.cues.columns.map((c) => at("tools", c));
  const vo2At = at("tools", t.cues.vo2);
  const lang = useLang();
  const num = (v: string) => (lang === "es" ? v.replace(/\./g, ",") : v);
  const maxH = 380;
  const icon = [<Bike key="w" size={64} color={C.train} t={frame} />, <Bolt key="b" size={64} color={C.oxygen} />, <Bolt key="s" size={64} color={C.violet} />];
  const call = useSpring(vo2At, 14);
  return (
    <AbsoluteFill>
      <Heading eyebrow={t.eyebrow} title={t.title} color={C.train} />
      <Pop from={vo2At} style={{ position: "absolute", right: 130, top: 92, padding: "14px 32px", borderRadius: 50, background: `${C.oxygen}22`,
        border: `3px solid ${C.oxygen}`, boxShadow: `0 0 ${40 * call}px ${C.oxygen}66`, fontFamily: display, fontSize: 48, fontWeight: 700, color: C.oxygen }}>
        <Sub text={`${t.metrics[2]} ≈ +12 %`} />
      </Pop>
      <AbsoluteFill style={{ flexDirection: "row", justifyContent: "center", gap: 80, paddingTop: 220 }}>
        {TOOLS.map((tool, c) => {
          const show = interpolate(frame, [colAt[c] - 6, colAt[c] + 16], [0, 1], { ...clamp, easing: out3 });
          const active = frame >= colAt[c] && (c === 2 || frame < colAt[c + 1]) && frame < vo2At;
          return (
            <div key={c} style={{ width: 480, opacity: show, transform: `translateY(${(1 - show) * 40}px)`, padding: "22px 0 18px", borderRadius: 28,
              background: active ? `${tool.color}10` : "transparent", border: `2px solid ${active ? tool.color + "55" : "transparent"}` }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 16 }}>
                {icon[c]}
                <div style={{ fontFamily: display, fontSize: 56, fontWeight: 700, color: tool.color }}>{t.columns[c]}</div>
              </div>
              <div style={T({ fontSize: 24, color: C.dim, textAlign: "center", marginBottom: 18 })}>{t.best[c]}</div>
              <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "center", gap: 26, height: maxH + 60 }}>
                {tool.values.map((v, m) => {
                  const g = interpolate(frame, [colAt[c] + 6 + m * 8, colAt[c] + 46 + m * 8], [0, 1], { ...clamp, easing: out3 });
                  const hl = m === 2 ? ramp(frame, vo2At, vo2At + 12) : 0;
                  const h = (v / 27) * maxH * g;
                  const label = tool.range && m === 2 ? `+${num(tool.range)} %` : `+${num((v * g).toFixed(1))} %`;
                  const barColor = m === 2 ? C.oxygen : tool.color;
                  return (
                    <div key={m} style={{ width: 118, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "flex-end" }}>
                      <div style={{ fontFamily: display, fontSize: 27, fontWeight: 700, color: hl ? C.oxygen : C.text, opacity: g, marginBottom: 8, whiteSpace: "nowrap",
                        transform: `scale(${1 + 0.2 * hl})` }}>{label}</div>
                      <div style={{ width: 98, height: h, borderRadius: "16px 16px 4px 4px", position: "relative", overflow: "hidden",
                        background: `linear-gradient(180deg, ${barColor}, ${barColor}99)`, opacity: m === 2 ? 0.6 + 0.4 * hl : 0.92,
                        boxShadow: hl ? `0 0 ${36 * hl}px ${C.oxygen}` : "none" }}>
                        <div style={{ position: "absolute", left: 0, right: 0, top: 0, height: 16, background: "rgba(255,255,255,0.25)", borderRadius: "16px 16px 0 0" }} />
                      </div>
                    </div>
                  );
                })}
              </div>
              <div style={{ display: "flex", justifyContent: "center", gap: 26, marginTop: 12 }}>
                {t.metrics.map((m) => <div key={m} style={T({ width: 118, fontSize: 19, color: C.dim, textAlign: "center" })}><Sub text={m} /></div>)}
              </div>
            </div>
          );
        })}
      </AbsoluteFill>
      <div style={T({ position: "absolute", left: 120, top: 880, fontSize: 20, color: C.faint, opacity: ramp(frame, colAt[0], colAt[0] + 20) })}>{t.note}</div>
    </AbsoluteFill>
  );
};

// ---- 10 · Zones ---------------------------------------------------------------------------------------------

const zoneHard = (u: number) => u > 0.1 && (u * 4.2) % 1 < 0.55;

export const Zones: React.FC = () => {
  const frame = useCurrentFrame();
  const t = useText().zones;
  const at = useAt();
  const hardAt = at("zones", t.cues.hard);
  const easyAt = at("zones", t.cues.easy);
  const x0 = 200, x1 = 1720, top = 330, bottom = 800;
  const yOf = (pct: number) => bottom - ((pct - 40) / 60) * (bottom - top);
  const pts: [number, number][] = [];
  for (let i = 0; i <= 200; i++) {
    const u = i / 200;
    pts.push([x0 + u * (x1 - x0), yOf(zoneHard(u) ? 92 + 2 * Math.sin(i) : 58 + 2 * Math.sin(i / 3))]);
  }
  const d = smooth(pts.filter((_, i) => i % 2 === 0));
  const traceOf = (f: number) => interpolate(f, [10, 400], [0, 1], clamp);
  const trace = traceOf(frame);
  const head = along(d, trace);
  let phase = 0;
  for (let f = 0; f <= frame; f++) phase += (zoneHard(traceOf(f)) ? 165 : 95) / 60 / 30;
  const isHard = head.y < yOf(76);
  const beat = beatOf(phase);
  const hard = useSpring(hardAt);
  const easy = useSpring(easyAt);
  const mid = yOf(76);
  return (
    <AbsoluteFill>
      <Heading eyebrow={t.eyebrow} title={t.title} color={C.heart} />
      <svg width={W} height={H} style={{ position: "absolute" }}>
        <defs>
          <clipPath id="z-hard"><rect x={0} y={0} width={W} height={mid} /></clipPath>
          <clipPath id="z-easy"><rect x={0} y={mid} width={W} height={H} /></clipPath>
          <linearGradient id="z-hb" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stopColor={C.heart} stopOpacity={0.32} /><stop offset="1" stopColor={C.heart} stopOpacity={0.06} /></linearGradient>
          <linearGradient id="z-eb" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stopColor={C.train} stopOpacity={0.24} /><stop offset="1" stopColor={C.train} stopOpacity={0.03} /></linearGradient>
        </defs>
        <rect x={x0} y={yOf(100)} width={(x1 - x0) * hard} height={yOf(87) - yOf(100)} fill="url(#z-hb)" rx={8} />
        <rect x={x0} y={yOf(65)} width={(x1 - x0) * easy} height={yOf(40) - yOf(65)} fill="url(#z-eb)" rx={8} />
        <line x1={x0} x2={x1} y1={bottom} y2={bottom} stroke={C.line} strokeWidth={3} />
        <text x={x1} y={bottom + 40} textAnchor="end" style={{ fontFamily: sans, fontSize: 24, fill: C.faint, letterSpacing: 3 }}>{t.time.toUpperCase()}</text>
        <g clipPath="url(#z-hard)"><Draw d={d} p={trace} color={C.heart} width={7} glow /></g>
        <g clipPath="url(#z-easy)"><Draw d={d} p={trace} color={C.train} width={7} glow /></g>
        {trace > 0 && trace < 1 ? <Spark x={head.x} y={head.y} color={isHard ? C.heart : C.train} r={11} /> : null}
      </svg>
      <div style={{ position: "absolute", right: W - x1, top: yOf(100) - 70, opacity: hard, fontFamily: display, fontSize: 42, fontWeight: 700, color: C.heart }}><Sub text={t.hard} /></div>
      <div style={{ position: "absolute", left: x0 + 20, top: yOf(40) + 28, opacity: easy, fontFamily: display, fontSize: 42, fontWeight: 700, color: C.train }}><Sub text={t.easy} /></div>
      <div style={{ position: "absolute", left: x0, top: yOf(100) - 64, display: "flex", alignItems: "center", gap: 12, opacity: hard }}>
        <Speech size={44} color="#fda4af" full={false} />
        <span style={T({ fontSize: 28, color: "#fda4af" })}>{t.hardTalk}</span>
      </div>
      <div style={{ position: "absolute", left: x0 + 700, top: yOf(40) + 40, display: "flex", alignItems: "center", gap: 12, opacity: easy }}>
        <Speech size={44} color="#a7f3d0" full />
        <span style={T({ fontSize: 28, color: "#a7f3d0" })}>{t.easyTalk}</span>
      </div>
      <div style={{ position: "absolute", right: 150, top: 96, opacity: ramp(frame, 10, 30) }}>
        <Heart size={110} color={isHard ? C.heart : C.train} beat={beat} style={{ filter: `drop-shadow(0 0 ${12 + 24 * beat}px ${isHard ? C.heart : C.train})` }} />
      </div>
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
  const frame = useCurrentFrame();
  const total = blocks.reduce((s, b) => s + b.min, 0);
  const scale = (x1 - x0) / total;
  let at = 0;
  const head = x0 + fill * (x1 - x0);
  const pulse = 0.5 + 0.5 * Math.sin(frame / 4);
  return (
    <svg width={W} height={H} style={{ position: "absolute", overflow: "visible" }}>
      <line x1={x0} x2={x1} y1={base + 3} y2={base + 3} stroke={C.line} strokeWidth={2} />
      {blocks.map((b, i) => {
        const x = x0 + at * scale;
        const w = b.min * scale - 6;
        at += b.min;
        const h = KIND[b.kind].h * maxH;
        const lit = Math.max(0, Math.min(1, (head - x) / w));
        const live = lit > 0 && lit < 1;
        const rise = live ? 1 : lit >= 1 ? 1 : 0.92;
        const color = KIND[b.kind].color;
        return (
          <g key={i}>
            <rect x={x} y={base - h} width={w} height={h} rx={12} fill={color} opacity={0.12} />
            <rect x={x} y={base - h * rise} width={w * lit} height={h * rise} rx={12} fill={color} opacity={0.92}
              style={{ filter: live && b.kind === "hard" ? `drop-shadow(0 0 ${14 + 16 * pulse}px ${color})` : lit >= 1 ? `drop-shadow(0 0 8px ${color}66)` : undefined }} />
            {labels && (i === 0 || i === 1 || i === 2 || i === blocks.length - 1) ? (
              <text x={x + w / 2} y={base + 44} textAnchor="middle" style={{ fontFamily: sans, fontSize: 24, fill: color, fontWeight: 600 }} opacity={lit > 0 ? 1 : 0.4}>
                {labels[b.kind]}
              </text>
            ) : null}
            <text x={x + w / 2} y={base - h + 46} textAnchor="middle" style={{ fontFamily: display, fontSize: 34, fontWeight: 700, fill: "#0b1320" }} opacity={numbers && lit > 0.5 ? 1 : 0}>
              {b.min}
            </text>
          </g>
        );
      })}
      {fill > 0 && fill < 1 ? (
        <g>
          <line x1={head} x2={head} y1={base - maxH - 30} y2={base + 10} stroke="#fff" strokeWidth={4} />
          <circle cx={head} cy={base - maxH - 30} r={9} fill="#fff" />
        </g>
      ) : null}
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
  const minute = fill * 43;
  let acc = 0, idx = 0, rep = 0;
  for (let i = 0; i < FOUR.length; i++) {
    if (minute >= acc) { idx = i; rep = FOUR.slice(0, i + 1).filter((b) => b.kind === "hard").length; }
    acc += FOUR[i].min;
  }
  const kind = FOUR[idx].kind;
  const names = { warm: t.warm, hard: t.hard, easy: t.easy, cool: t.cool };
  const phaseText = kind === "hard" || kind === "easy" ? `${names[kind]} · ${rep}/4` : names[kind];
  const color = fill >= 1 ? C.text : KIND[kind].color;
  const R = 88;
  const show = ramp(frame, startAt - 20, startAt);
  return (
    <AbsoluteFill>
      <Heading eyebrow={t.eyebrow} title={t.title} color={C.heart} />
      <Timeline blocks={FOUR} x0={160} x1={1760} base={800} maxH={360} fill={fill}
        labels={{ warm: t.warm, hard: t.hard, easy: t.easy, cool: t.cool }} />
      <div style={{ position: "absolute", right: 160, top: 70, display: "flex", alignItems: "center", gap: 34, opacity: show }}>
        <div style={{ textAlign: "right" }}>
          <div style={{ fontFamily: display, fontSize: 48, fontWeight: 700, color, textShadow: `0 0 24px ${color}88` }}>{fill > 0 ? phaseText : names.warm}</div>
          <div style={T({ fontSize: 24, color: C.dim, letterSpacing: 3, textTransform: "uppercase" })}>10 + 4 × (4 + 3) + 5</div>
        </div>
        <svg width={2 * R + 24} height={2 * R + 24} viewBox={`${-R - 12} ${-R - 12} ${2 * R + 24} ${2 * R + 24}`}>
          <circle r={R} fill="none" stroke={C.line} strokeWidth={14} />
          <circle r={R} fill="none" stroke={color} strokeWidth={14} strokeLinecap="round" pathLength={1} strokeDasharray="1" strokeDashoffset={1 - fill}
            transform="rotate(-90)" style={{ filter: `drop-shadow(0 0 10px ${color})` }} />
          <text y={18} textAnchor="middle" style={{ fontFamily: display, fontSize: 64, fontWeight: 700, fill: C.text }}>{Math.round(minute)}</text>
          <text y={52} textAnchor="middle" style={{ fontFamily: sans, fontSize: 22, fill: C.dim }}>{t.min}</text>
        </svg>
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
  const row = (label: string, sub: string, y: number, from: number, color: string, icon: React.ReactNode) => {
    const show = interpolate(frame, [from - 8, from + 12], [0, 1], { ...clamp, easing: out3 });
    return (
      <div style={{ position: "absolute", left: 160, top: y, opacity: show, transform: `translateX(${(1 - show) * -40}px)`, display: "flex", alignItems: "center", gap: 22 }}>
        {icon}
        <span style={{ fontFamily: display, fontSize: 60, fontWeight: 700, color }}>{label}</span>
        <span style={T({ fontSize: 28, color: C.dim, marginLeft: 6 })}>{sub}</span>
      </div>
    );
  };
  return (
    <AbsoluteFill>
      <Heading eyebrow={t.eyebrow} title={t.title} color={C.heart} />
      {row(t.a, t.aSub, 244, aAt, C.heart, <Bolt size={56} color={C.heart} />)}
      <div style={{ opacity: ramp(frame, aAt - 8, aAt + 8) }}><Timeline blocks={SIX} x0={160} x1={1760} base={510} maxH={160} fill={fa} /></div>
      {row(t.b, t.bSub, 556, bAt, C.violet, <Bolt size={56} color={C.violet} />)}
      <div style={{ opacity: ramp(frame, bAt - 8, bAt + 8) }}><Timeline blocks={SIT} x0={160} x1={1760} base={822} maxH={160} fill={fb} numbers={false} /></div>
    </AbsoluteFill>
  );
};

// ---- 13 · Week ----------------------------------------------------------------------------------------------

type Activity = "intervals" | "zone2" | "strength" | "walk";
const PLAN: Activity[] = ["strength", "intervals", "walk", "strength", "walk", "zone2", "walk"];
const ACT_COLOR: Record<Activity, string> = { intervals: C.heart, zone2: C.oxygen, strength: C.muscle, walk: C.train };

const ActIcon: React.FC<{ act: Activity; size: number; t: number }> = ({ act, size, t }) => {
  const color = ACT_COLOR[act];
  if (act === "intervals") return <Bolt size={size} color={color} />;
  if (act === "zone2") return <Bike size={size} color={color} t={t} />;
  if (act === "strength") return <Dumbbell size={size} color={color} />;
  return <Walker size={size} color={color} t={t} />;
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
  return (
    <AbsoluteFill>
      <Heading eyebrow={t.eyebrow} title={t.title} color={C.train} />
      <AbsoluteFill style={{ flexDirection: "row", justifyContent: "center", gap: 22, paddingTop: 290 }}>
        {t.days.map((day, i) => {
          const act = PLAN[i];
          const order = PLAN.slice(0, i).filter((a) => a === act).length;
          const from = cueOf[act] + order * 10;
          const col = interpolate(frame, [8 + i * 4, 30 + i * 4], [0, 1], { ...clamp, easing: out3 });
          const on = ramp(frame, from, from + 14);
          const color = ACT_COLOR[act];
          return (
            <div key={day} style={{ width: 208, height: 480, borderRadius: 26, position: "relative", overflow: "hidden",
              background: `linear-gradient(180deg, ${C.panel}, ${color}${on > 0 ? Math.round(on * 34).toString(16).padStart(2, "0") : "00"})`,
              border: `2px solid ${on > 0.5 ? color + "aa" : C.line}`, boxShadow: on > 0.5 ? `0 0 40px ${color}33` : "none",
              opacity: col, transform: `translateY(${(1 - col) * 60}px)`, display: "flex", flexDirection: "column", alignItems: "center", paddingTop: 28 }}>
              <div style={T({ fontSize: 30, fontWeight: 600, color: on > 0.5 ? C.text : C.dim, letterSpacing: 2 })}>{day}</div>
              <Pop from={from} style={{ display: "flex", flexDirection: "column", alignItems: "center", marginTop: 56 }}>
                <div style={{ width: 132, height: 132, borderRadius: "50%", background: `${color}1f`, border: `4px solid ${color}`,
                  display: "flex", alignItems: "center", justifyContent: "center", boxShadow: `0 0 30px ${color}55` }}>
                  <ActIcon act={act} size={76} t={frame} />
                </div>
                <div style={{ fontFamily: display, fontSize: 32, fontWeight: 700, color, marginTop: 24, textAlign: "center" }}>{label[act][0]}</div>
                <div style={T({ fontSize: 24, color: C.dim })}>{label[act][1]}</div>
              </Pop>
            </div>
          );
        })}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ---- 14 · Strength ------------------------------------------------------------------------------------------

/** Joint positions of a side-view figure (facing right) in a 200 × 300 box; ground at y = 266. */
type Pose = { head: number[]; s: number[]; e: number[]; h: number[]; hip: number[]; k: number[]; f: number[]; k2?: number[]; f2?: number[] };
/** Two poses per movement (top and bottom of the rep); the figure moves between them. */
const POSES: [Pose, Pose][] = [
  [ // squat: hips back and down, knees forward, arms out for balance
    { head: [104, 38], s: [100, 66], e: [136, 70], h: [172, 70], hip: [98, 150], k: [102, 208], f: [100, 264] },
    { head: [128, 98], s: [116, 124], e: [152, 126], h: [188, 124], hip: [66, 196], k: [128, 202], f: [104, 264] },
  ],
  [ // hinge (deadlift): hips back, flat back, weight slides down the legs
    { head: [104, 38], s: [100, 66], e: [102, 108], h: [104, 150], hip: [98, 150], k: [102, 208], f: [100, 264] },
    { head: [176, 96], s: [148, 108], e: [142, 156], h: [138, 204], hip: [66, 154], k: [90, 210], f: [100, 264] },
  ],
  [ // push-up: a straight plank lowers to the floor
    { head: [174, 168], s: [150, 182], e: [152, 222], h: [152, 262], hip: [96, 208], k: [60, 234], f: [24, 260] },
    { head: [178, 222], s: [152, 232], e: [122, 222], h: [152, 262], hip: [96, 242], k: [60, 252], f: [24, 262] },
  ],
  [ // pull-up: hang from the bar, then pull the chin over it
    { head: [112, 74], s: [100, 96], e: [102, 62], h: [104, 30], hip: [100, 182], k: [104, 230], f: [98, 274] },
    { head: [112, 20], s: [100, 46], e: [72, 62], h: [104, 30], hip: [100, 134], k: [108, 182], f: [100, 226] },
  ],
  [ // carry: upright walk with a weight in each hand
    { head: [106, 38], s: [102, 66], e: [104, 108], h: [106, 148], hip: [100, 150], k: [118, 206], f: [128, 264], k2: [88, 208], f2: [72, 262] },
    { head: [106, 34], s: [102, 62], e: [104, 104], h: [106, 144], hip: [100, 146], k: [88, 204], f: [72, 262], k2: [118, 206], f2: [128, 264] },
  ],
];

const Figure: React.FC<{ move: number; u: number; color: string }> = ({ move, u, color }) => {
  const [a, b] = POSES[move];
  const mix = (k: keyof Pose) => (a[k] ? (a[k] as number[]).map((v, i) => v + ((b[k] as number[])[i] - v) * u) : null);
  const [head, s, e, h, hip, k, f] = (["head", "s", "e", "h", "hip", "k", "f"] as const).map((key) => mix(key)!);
  const k2 = mix("k2") ?? k, f2 = mix("f2") ?? f;
  const st = { stroke: color, strokeWidth: 11, strokeLinecap: "round" as const, strokeLinejoin: "round" as const, fill: "none" };
  const back = { ...st, stroke: color, opacity: 0.5 };
  return (
    <svg width={300} height={420} viewBox="0 -10 200 300" style={{ overflow: "visible" }}>
      <ellipse cx={100} cy={270} rx={80} ry={8} fill={color} opacity={0.12} />
      <line x1={14} y1={268} x2={186} y2={268} stroke={C.line} strokeWidth={4} />
      {move === 3 ? <line x1={50} y1={28} x2={160} y2={28} stroke={C.dim} strokeWidth={8} strokeLinecap="round" /> : null}
      <polyline points={`${hip} ${k2} ${f2}`} {...back} />
      {move === 4 ? <polyline points={`${s} ${[e[0] - 8, e[1]]} ${[h[0] - 10, h[1]]}`} {...back} /> : null}
      <polyline points={`${hip} ${k} ${f}`} {...st} />
      <line x1={hip[0]} y1={hip[1]} x2={s[0]} y2={s[1]} {...st} strokeWidth={14} />
      <polyline points={`${s} ${e} ${h}`} {...st} />
      <circle cx={head[0]} cy={head[1]} r={19} fill={color} />
      {move === 1 ? <g><line x1={h[0] - 30} y1={h[1] + 4} x2={h[0] + 30} y2={h[1] + 4} {...st} strokeWidth={7} /><circle cx={h[0] - 30} cy={h[1] + 4} r={16} fill={color} /><circle cx={h[0] + 30} cy={h[1] + 4} r={16} fill={color} opacity={0.6} /></g> : null}
      {move === 4 ? <rect x={h[0] - 14} y={h[1] - 2} width={28} height={34} rx={7} fill={color} /> : null}
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
      <AbsoluteFill style={{ flexDirection: "row", justifyContent: "center", alignItems: "center", gap: 24, paddingTop: 90 }}>
        {t.moves.map((m, i) => {
          const local = frame - movesAt - i * 12;
          const u = local < 0 ? 0 : (1 - Math.cos((local / 34) * Math.PI)) / 2;
          const eased = u * u * (3 - 2 * u);
          return (
            <Pop key={m} from={movesAt + i * 12} style={{ display: "flex", flexDirection: "column", alignItems: "center", width: 320, padding: "20px 0 26px",
              borderRadius: 30, background: `linear-gradient(180deg, ${C.panel}, ${C.muscle}14)`, border: `2px solid ${C.line}` }}>
              <Figure move={i} u={move4(i, eased, local)} color={C.muscle} />
              <div style={{ fontFamily: display, fontSize: 40, fontWeight: 700, color: C.text, marginTop: 4 }}>{m}</div>
            </Pop>
          );
        })}
      </AbsoluteFill>
      <Pop from={badgeAt} style={{ position: "absolute", right: 150, top: 196, padding: "14px 34px", borderRadius: 40, border: `4px solid ${C.muscle}`,
        background: `${C.muscle}1a`, boxShadow: `0 0 30px ${C.muscle}55`, fontFamily: display, fontSize: 46, fontWeight: 700, color: C.muscle, display: "flex", alignItems: "center", gap: 16 }}>
        <Dumbbell size={50} color={C.muscle} />{t.badge}
      </Pop>
    </AbsoluteFill>
  );
};

/** The carry walks continuously (alternating steps); the other movements go up and down. */
const move4 = (i: number, eased: number, local: number) => (i === 4 ? (local < 0 ? 0 : (1 - Math.cos((local / 16) * Math.PI)) / 2) : eased);

// ---- 15 · Progression ---------------------------------------------------------------------------------------

type Mini = "bike" | "dumb" | "bolt" | "walk";
const MiniIcon: React.FC<{ k: Mini; t: number }> = ({ k, t }) =>
  k === "bike" ? <Bike size={52} color={C.oxygen} t={t} /> : k === "dumb" ? <Dumbbell size={52} color={C.muscle} /> : k === "bolt" ? <Bolt size={52} color={C.heart} /> : <Walker size={52} color={C.train} t={t} />;

export const Progression: React.FC = () => {
  const frame = useCurrentFrame();
  const t = useText().progression;
  const at = useAt();
  const stepAt = t.cues.steps.map((c) => at("progression", c));
  const colors = [C.oxygen, C.muscle, C.heart];
  const icons: Mini[][] = [["bike", "bike", "dumb", "dumb"], ["bike", "bike", "dumb", "dumb", "bolt"], ["bolt", "bike", "dumb", "dumb", "walk"]];
  const geo = (i: number) => ({ x: 200 + i * 520, top: 760 - (i + 1) * 150 });
  // a spark climbs the staircase, one step per cue
  const climb = stepAt.reduce((acc, s) => acc + interpolate(frame, [s, s + 26], [0, 1], { ...clamp, easing: out3 }), 0);
  const stairs: [number, number][] = [[200, 820]];
  for (let i = 0; i < 3; i++) { const g = geo(i); stairs.push([g.x, g.top], [g.x + 500, g.top]); }
  const path = stairs.map(([x, y], i) => `${i ? "L" : "M"} ${x} ${y}`).join(" ");
  const p = climb / 3;
  const head = along(path, p);
  return (
    <AbsoluteFill>
      <Heading eyebrow={t.eyebrow} title={t.title} color={C.train} />
      <svg width={W} height={H} style={{ position: "absolute" }}>
        <defs>
          {colors.map((c, i) => (
            <linearGradient key={i} id={`step-${i}`} x1="0" x2="0" y1="0" y2="1">
              <stop offset="0" stopColor={c} stopOpacity={0.4} /><stop offset="1" stopColor={c} stopOpacity={0.04} />
            </linearGradient>
          ))}
        </defs>
        {stepAt.map((s, i) => {
          const q = interpolate(frame, [s - 6, s + 22], [0, 1], { ...clamp, easing: out3 });
          const { x, top } = geo(i);
          return (
            <g key={i}>
              <rect x={x} y={top + (1 - q) * (820 - top)} width={500} height={(820 - top) * q} rx={18} fill={`url(#step-${i})`} />
              <line x1={x + 10} x2={x + 490} y1={top + (1 - q) * (820 - top)} y2={top + (1 - q) * (820 - top)} stroke={colors[i]} strokeWidth={5} strokeLinecap="round" opacity={q}
                style={{ filter: `drop-shadow(0 0 10px ${colors[i]})` }} />
            </g>
          );
        })}
        {p > 0 ? <Draw d={path} p={p} color="#fff" width={3} opacity={0.5} /> : null}
        {p > 0 ? <Spark x={head.x} y={head.y} color={colors[Math.min(2, Math.floor(climb - 0.001))]} r={11} /> : null}
      </svg>
      {stepAt.map((s, i) => {
        const { x, top } = geo(i);
        return (
          <Pop key={i} from={s + 10} style={{ position: "absolute", left: x, top: top - 214, width: 500, textAlign: "center" }}>
            <div style={{ fontFamily: display, fontSize: 46, fontWeight: 700, color: colors[i] }}>{t.weeks[i]}</div>
            <div style={{ display: "flex", justifyContent: "center", gap: 14, margin: "14px 0" }}>{icons[i].map((k, j) => <MiniIcon key={j} k={k} t={frame} />)}</div>
            <div style={T({ fontSize: 27, color: C.text, fontWeight: 500 })}>{t.steps[i]}</div>
          </Pop>
        );
      })}
      <div style={T({ position: "absolute", left: 200, top: 846, fontSize: 22, color: C.faint, opacity: ramp(frame, stepAt[0], stepAt[0] + 20) })}>{t.note}</div>
    </AbsoluteFill>
  );
};

// ---- 16 · Finale --------------------------------------------------------------------------------------------

/** The sedentary decline again; a trained line lifts off it and holds higher: a picture of the idea, not data. */
export const Finale: React.FC = () => {
  const frame = useCurrentFrame();
  const t = useText().finale;
  const at = useAt();
  const trainedAt = at("finale", t.cues.trained);
  const noteAt = at("finale", t.cues.note);
  const axes = interpolate(frame, [0, 30], [0, 1], { ...clamp, easing: out3 });
  const sed = interpolate(frame, [6, 60], [0, 1], { ...clamp, easing: (x) => x * x * (3 - 2 * x) });
  const lift = interpolate(frame, [trainedAt - 10, trainedAt + 60], [0, 1], { ...clamp, easing: (x) => x * x * (3 - 2 * x) });
  const trained: [number, number][] = [[20, 100], [30, 98], [40, 95], [50, 91], [60, 86], [70, 80]];
  const liftPts = VO2.map(([a, v], i) => [a, v + (trained[i][1] - v) * lift] as [number, number]);
  const dSed = smooth(toXY(VO2));
  const dLift = smooth(toXY(liftPts));
  const between = `${dLift} L ${ax(70)} ${ay(54)} ${smooth([...toXY(VO2)].reverse()).replace(/^M [^C]+/, "")} Z`;
  const end = toXY(liftPts)[5];
  return (
    <AbsoluteFill>
      <svg width={W} height={H} style={{ position: "absolute" }}>
        <defs>
          <linearGradient id="fin-fill" x1="0" x2="1"><stop offset="0" stopColor={C.train} stopOpacity={0} /><stop offset="1" stopColor={C.train} stopOpacity={0.4} /></linearGradient>
        </defs>
        <g opacity={axes}>
          {[20, 30, 40, 50, 60, 70].map((age) => (
            <text key={age} x={ax(age)} y={CH.y1 + 46} textAnchor="middle" style={{ fontFamily: display, fontSize: 30, fill: C.dim }}>{age}</text>
          ))}
          <line x1={CH.x0} x2={CH.x1} y1={CH.y1} y2={CH.y1} stroke={C.line} strokeWidth={3} />
          <text x={CH.x1} y={CH.y1 + 90} textAnchor="end" style={{ fontFamily: sans, fontSize: 24, fill: C.faint, letterSpacing: 3 }}>{t.age.toUpperCase()}</text>
        </g>
        <path d={between} fill="url(#fin-fill)" opacity={lift} />
        <Draw d={dSed} p={sed} color={C.faint} width={7} />
        <text x={ax(70) + 24} y={ay(54) + 10} style={{ fontFamily: sans, fontSize: 28, fill: C.faint }} opacity={sed}>{t.sedentary}</text>
        {lift > 0 ? <Draw d={dLift} p={1} color={C.train} width={10} glow /> : null}
        {lift > 0 ? <Spark x={end[0]} y={end[1]} color={C.train} r={12} /> : null}
        <text x={ax(70) + 28} y={end[1] + 12} style={{ fontFamily: display, fontSize: 38, fontWeight: 700, fill: C.train }} opacity={lift}>{t.trained}</text>
      </svg>
      <div style={{ position: "absolute", top: 104, width: W, textAlign: "center", fontFamily: display, fontSize: 84, fontWeight: 700, color: C.text,
        textShadow: `0 0 40px ${C.train}44` }}><Reveal text={t.line} delay={8} stagger={5} /></div>
      <Pop from={noteAt} style={{ position: "absolute", top: 232, width: W, display: "flex", justifyContent: "center" }}>
        <span style={T({ fontSize: 30, color: "#fde68a", background: "rgba(245,158,11,0.14)", border: `2px solid ${C.muscle}`, borderRadius: 30, padding: "10px 28px",
          display: "flex", alignItems: "center", gap: 14 })}>
          <Cross size={26} color={C.muscle} /> {t.note}
        </span>
      </Pop>
    </AbsoluteFill>
  );
};

// ---- 17 · Outro ---------------------------------------------------------------------------------------------

export const Outro: React.FC = () => {
  const frame = useCurrentFrame();
  const t = useText().outro;
  const line = (label: string, text: string, i: number) => {
    const p = interpolate(frame, [24 + i * 8, 44 + i * 8], [0, 1], { ...clamp, easing: out3 });
    return (
      <div style={T({ fontSize: 28, color: C.dim, marginTop: 16, opacity: p, transform: `translateY(${(1 - p) * 18}px)` })}>
        <span style={{ color: C.oxygen, fontWeight: 600 }}>{label}</span> <Sub text={text} />
      </div>
    );
  };
  const beat = beatOf(frame / 28);
  return (
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", textAlign: "center", padding: "0 220px" }}>
      <Heart size={90} color={C.heart} beat={beat} style={{ marginBottom: 20, opacity: ramp(frame, 0, 16), filter: `drop-shadow(0 0 ${10 + 20 * beat}px ${C.heart})` }} />
      <div style={{ fontFamily: display, fontSize: 100, fontWeight: 700, color: C.text, marginBottom: 30, letterSpacing: -2 }}><Reveal text={t.title} delay={4} stagger={5} /></div>
      {line(t.basedOn, `“${META.source.title}”, ${META.source.authors}, ${META.source.publisher} (2026)`, 0)}
      {line(t.studies, META.studies.join(" · "), 1)}
      {line(t.music, MUSIC.map((m) => `“${m.title}”`).join(" · ") + ` — ${MUSIC[0].composer}, ${MUSIC[0].license}`, 2)}
      <div style={T({ fontSize: 24, color: C.faint, marginTop: 44, opacity: ramp(frame, 60, 80) })}>{t.made}</div>
    </AbsoluteFill>
  );
};
