// Icons drawn in SVG (100 × 100 view box), used in place of emoji so they look the same everywhere and can be
// animated: `damage` (0–1) shows what ageing does to a stage of the oxygen cascade, `t` is a frame for motion.
import React from "react";

type P = { size?: number; color: string; damage?: number; t?: number; style?: React.CSSProperties };

const Svg: React.FC<{ size: number; style?: React.CSSProperties; children: React.ReactNode }> = ({ size, style, children }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" style={{ overflow: "visible", ...style }}>{children}</svg>
);

const line = (color: string, w = 5) => ({ stroke: color, strokeWidth: w, strokeLinecap: "round" as const, strokeLinejoin: "round" as const, fill: "none" });

/** Two lobes and the trachea; they breathe with `t`. */
export const Lungs: React.FC<P> = ({ size = 100, color, t = 0, style }) => {
  const s = 1 + 0.05 * Math.sin(t / 14);
  return (
    <Svg size={size} style={style}>
      <g transform={`translate(50 54) scale(${s}) translate(-50 -54)`}>
        <path d="M46 30 C 30 26 16 44 16 66 C 16 80 26 86 36 82 C 44 79 46 70 46 60 Z" fill={color} opacity={0.9} />
        <path d="M54 30 C 70 26 84 44 84 66 C 84 80 74 86 64 82 C 56 79 54 70 54 60 Z" fill={color} opacity={0.9} />
        <path d="M30 56 L 40 50 M 28 68 L 40 62 M 70 56 L 60 50 M 72 68 L 60 62" {...line("#0b1320", 3)} opacity={0.45} />
      </g>
      <path d="M50 12 L 50 44 M 50 40 L 42 48 M 50 40 L 58 48" {...line(color, 6)} />
    </Svg>
  );
};

/** A red blood cell (a biconcave disc) carrying oxygen. */
export const BloodCell: React.FC<P> = ({ size = 100, color, t = 0, style }) => (
  <Svg size={size} style={style}>
    <g transform={`rotate(${-18 + 6 * Math.sin(t / 20)} 50 50)`}>
      <ellipse cx={50} cy={50} rx={38} ry={30} fill={color} />
      <ellipse cx={50} cy={50} rx={20} ry={14} fill="#0b1320" opacity={0.28} />
      <ellipse cx={42} cy={40} rx={12} ry={5} fill="#fff" opacity={0.25} />
    </g>
  </Svg>
);

/** A branching capillary net; `damage` thins it out (fewer capillaries, longer distances). */
export const Capillaries: React.FC<P> = ({ size = 100, color, damage = 0, style }) => {
  const branches = [
    "M10 50 C 30 50 34 30 50 28 C 66 26 74 40 90 38",
    "M10 50 C 30 52 36 70 52 72 C 68 74 76 62 90 64",
    "M34 40 C 40 50 46 54 52 72",
    "M50 28 C 54 40 60 46 66 52 C 72 58 80 58 90 52",
    "M24 50 C 30 60 36 84 50 88",
    "M62 74 C 70 82 80 84 90 82",
  ];
  return (
    <Svg size={size} style={style}>
      {branches.map((d, i) => (
        <path key={i} d={d} {...line(color, i < 2 ? 7 : 4.5)} opacity={i < 2 ? 1 - 0.35 * damage : Math.max(0.08, 1 - damage * (1.2 + i * 0.15))} />
      ))}
    </Svg>
  );
};

/** A bundle of striated muscle fibres; `damage` fades some of them (lost fibres). */
export const Fibre: React.FC<P> = ({ size = 100, color, damage = 0, style }) => (
  <Svg size={size} style={style}>
    {[24, 40, 56, 72].map((y, i) => {
      const lost = i === 1 || i === 3 ? damage : 0;
      return (
        <g key={y} opacity={1 - 0.85 * lost} transform={`translate(${lost * 8} 0)`}>
          <rect x={10} y={y - 6} width={80} height={13} rx={6.5} fill={color} />
          {[22, 34, 46, 58, 70, 82].map((x) => <line key={x} x1={x} x2={x} y1={y - 4} y2={y + 5} stroke="#0b1320" strokeWidth={2} opacity={0.35} />)}
        </g>
      );
    })}
  </Svg>
);

/** A mitochondrion: outer membrane and folded cristae; `damage` shrinks and dims it. */
export const Mitochondrion: React.FC<P> = ({ size = 100, color, damage = 0, t = 0, style }) => {
  const s = 1 - 0.3 * damage;
  const glow = (1 - damage) * (0.5 + 0.5 * Math.sin(t / 9));
  return (
    <Svg size={size} style={style}>
      <g transform={`translate(50 50) scale(${s}) rotate(-20) translate(-50 -50)`} opacity={1 - 0.45 * damage}>
        <ellipse cx={50} cy={50} rx={44} ry={26} fill={color} opacity={0.25 + 0.2 * glow} />
        <ellipse cx={50} cy={50} rx={44} ry={26} {...line(color, 5)} />
        <path d="M14 50 C 20 34 24 34 26 50 C 28 66 34 66 38 50 C 42 34 48 34 50 50 C 52 66 58 66 62 50 C 66 34 72 34 74 50 C 76 66 82 66 86 50" {...line(color, 4)} />
      </g>
    </Svg>
  );
};

/** A lightning bolt (intervals). */
export const Bolt: React.FC<P> = ({ size = 100, color, style }) => (
  <Svg size={size} style={style}>
    <path d="M58 8 L 22 56 L 46 56 L 38 92 L 78 40 L 54 40 Z" fill={color} />
  </Svg>
);

/** A bicycle (zone 2); the wheels turn with `t`. */
export const Bike: React.FC<P> = ({ size = 100, color, t = 0, style }) => (
  <Svg size={size} style={style}>
    {[24, 76].map((cx) => (
      <g key={cx}>
        <circle cx={cx} cy={66} r={17} {...line(color, 5)} />
        <line x1={cx} y1={66} x2={cx + 14 * Math.cos(t / 6)} y2={66 + 14 * Math.sin(t / 6)} {...line(color, 3)} opacity={0.6} />
      </g>
    ))}
    <path d="M24 66 L 40 40 L 66 40 L 76 66 M 40 40 L 50 66 L 66 40 M 36 32 L 46 32 M 62 30 L 70 30 L 66 40" {...line(color, 5)} />
  </Svg>
);

/** A dumbbell (strength). */
export const Dumbbell: React.FC<P> = ({ size = 100, color, style }) => (
  <Svg size={size} style={style}>
    <rect x={10} y={30} width={14} height={40} rx={4} fill={color} />
    <rect x={24} y={36} width={10} height={28} rx={3} fill={color} />
    <rect x={76} y={30} width={14} height={40} rx={4} fill={color} />
    <rect x={66} y={36} width={10} height={28} rx={3} fill={color} />
    <rect x={34} y={46} width={32} height={8} rx={3} fill={color} />
  </Svg>
);

/** A walking figure, like a pedestrian sign; arms and legs swing with `t`. */
export const Walker: React.FC<P> = ({ size = 100, color, t = 0, style }) => {
  const u = 0.14 + 0.14 * Math.sin(t / 7); // a gentle sway around an open stride, so it always reads as walking
  const mix = (a: number[], b: number[]) => a.map((v, i) => v + (b[i] - v) * u);
  const legA = [46, 58, 60, 74, 66, 94], legB = [46, 58, 38, 76, 26, 92];
  const armA = [52, 34, 64, 48, 72, 60], armB = [52, 34, 40, 48, 32, 60];
  const poly = (q: number[]) => `M${q[0]} ${q[1]} L ${q[2]} ${q[3]} L ${q[4]} ${q[5]}`;
  return (
    <Svg size={size} style={style}>
      <path d={poly(mix(legB, legA))} {...line(color, 9)} opacity={0.55} />
      <path d={poly(mix(armA, armB))} {...line(color, 8)} opacity={0.55} />
      <path d="M53 28 L 46 58" {...line(color, 12)} />
      <path d={poly(mix(legA, legB))} {...line(color, 9)} />
      <path d={poly(mix(armB, armA))} {...line(color, 8)} />
      <circle cx={56} cy={14} r={10} fill={color} />
    </Svg>
  );
};

/** A speech bubble: `full` shows a chat (three lines of talk), otherwise a gasp (a single short dash). */
export const Speech: React.FC<P & { full: boolean }> = ({ size = 100, color, full, style }) => (
  <Svg size={size} style={style}>
    <path d="M14 20 H 86 a 8 8 0 0 1 8 8 V 62 a 8 8 0 0 1 -8 8 H 40 L 24 86 L 26 70 H 14 a 8 8 0 0 1 -8 -8 V 28 a 8 8 0 0 1 8 -8 Z" {...line(color, 5)} />
    {full ? (
      <path d="M22 36 H 78 M 22 46 H 70 M 22 56 H 58" {...line(color, 5)} />
    ) : (
      <path d="M40 46 H 60" {...line(color, 6)} />
    )}
  </Svg>
);

/** A medical cross. */
export const Cross: React.FC<P> = ({ size = 100, color, style }) => (
  <Svg size={size} style={style}>
    <path d="M38 10 H 62 V 38 H 90 V 62 H 62 V 90 H 38 V 62 H 10 V 38 H 38 Z" fill={color} />
  </Svg>
);

/** A heart, beating with `beat` (0–1). */
export const Heart: React.FC<P & { beat?: number }> = ({ size = 100, color, beat = 0, style }) => (
  <Svg size={size} style={style}>
    <g transform={`translate(50 54) scale(${1 + 0.1 * beat}) translate(-50 -54)`}>
      <path d="M50 88 C 18 66 6 46 12 30 C 18 14 40 12 50 30 C 60 12 82 14 88 30 C 94 46 82 66 50 88 Z" fill={color} />
      <path d="M28 44 L 40 44 L 45 32 L 53 58 L 58 44 L 72 44" {...line("#fff", 4)} opacity={0.9} />
      <ellipse cx={30} cy={30} rx={8} ry={5} fill="#fff" opacity={0.22} transform="rotate(-30 30 30)" />
    </g>
  </Svg>
);
