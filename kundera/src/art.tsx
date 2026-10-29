// Line drawings and shapes used by the scenes. All drawn here; no images.
import React from "react";
import { C } from "./ui";

/** The feather (lightness). Natural size 60×200, quill pointing down. */
export const Feather: React.FC<{ size?: number; color?: string }> = ({ size = 200, color = C.paper }) => (
  <svg width={(size * 60) / 200} height={size} viewBox="0 0 60 200" style={{ overflow: "visible" }}>
    <path d="M31 8 C 54 36, 57 104, 34 168 L 30 168 C 6 118, 8 44, 31 8 Z" fill={color} opacity={0.92} />
    {[30, 50, 70, 90, 110, 130, 150].map((y, i) => (
      <path key={y} d={`M31 ${y + 8} L ${i % 2 ? 50 : 12} ${y - 6}`} stroke={C.bg} strokeOpacity={0.35} strokeWidth={1.4} />
    ))}
    <path d="M31 10 C 33 70, 33 130, 31 196" stroke={C.bg} strokeOpacity={0.5} strokeWidth={2} fill="none" />
    <path d="M31 168 L 31 196" stroke={color} strokeWidth={2.4} />
  </svg>
);

/** The stone (weight). Natural size 120×80. */
export const Stone: React.FC<{ width?: number }> = ({ width = 120 }) => (
  <svg width={width} height={(width * 80) / 120} viewBox="0 0 120 80">
    <defs>
      <radialGradient id="stoneShade" cx="38%" cy="30%" r="75%">
        <stop offset="0%" stopColor="#8d847a" />
        <stop offset="100%" stopColor="#3d3631" />
      </radialGradient>
    </defs>
    <path d="M8 62 C 3 36, 30 12, 60 10 C 92 8, 117 30, 113 56 C 110 75, 82 79, 58 78 C 30 77, 11 74, 8 62 Z" fill="url(#stoneShade)" />
    <path d="M30 30 C 40 22, 55 19, 66 20" stroke="#b2a99e" strokeOpacity={0.4} strokeWidth={3} fill="none" strokeLinecap="round" />
  </svg>
);

/** Abstract head-and-shoulders portrait. */
export const Bust: React.FC<{ color: string; variant?: number; size?: number }> = ({ color, variant = 0, size = 150 }) => (
  <svg width={size} height={size * 1.2} viewBox="0 0 100 120">
    <circle cx={50} cy={50} r={46} fill={color} opacity={0.12} />
    {variant % 2 === 1 ? (
      <path d="M24 60 C 22 22, 78 22, 76 60 C 76 74, 70 80, 66 82 L 34 82 C 30 80, 24 74, 24 60 Z" fill={color} opacity={0.55} />
    ) : null}
    <circle cx={50} cy={46} r={19} fill={color} />
    <path d="M14 120 C 14 88, 30 74, 50 74 C 70 74, 86 88, 86 120 Z" fill={color} />
  </svg>
);

/** A standing figure seen from the side, for the dance and the unchanged person. */
export const Figure: React.FC<{ color: string; dress?: boolean; height?: number; lean?: number }> = ({ color, dress, height = 300, lean = 0 }) => (
  <svg width={height * 0.42} height={height} viewBox="0 0 84 200" style={{ transform: `rotate(${lean}deg)`, transformOrigin: "50% 100%" }}>
    <circle cx={42} cy={20} r={14} fill={color} />
    {dress ? (
      <path d="M32 38 C 36 34, 48 34, 52 38 L 56 80 C 66 120, 74 150, 78 176 L 6 176 C 12 150, 20 120, 28 80 Z" fill={color} />
    ) : (
      <path d="M28 38 C 34 34, 50 34, 56 38 L 58 104 L 54 196 L 45 196 L 42 116 L 39 196 L 30 196 L 26 104 Z" fill={color} />
    )}
    {dress ? <path d="M30 176 L 32 196 M 54 176 L 52 196" stroke={color} strokeWidth={6} strokeLinecap="round" /> : null}
  </svg>
);

/** Karenin as a line drawing. `step` (radians) swings the legs; `sitting` folds them. */
export const Dog: React.FC<{ width?: number; color?: string; step?: number; sitting?: boolean }> = ({
  width = 180, color = C.paper, step = 0, sitting,
}) => {
  const a = Math.sin(step) * 8;
  const leg = (x: number, swing: number) => (
    <path d={`M${x} 52 L ${x + swing} 78`} stroke={color} strokeWidth={4} strokeLinecap="round" fill="none" />
  );
  return (
    <svg width={width} height={width * 0.55} viewBox="0 0 160 88" style={{ overflow: "visible" }}>
      <g fill="none" stroke={color} strokeWidth={4} strokeLinecap="round" strokeLinejoin="round">
        {sitting ? (
          <path d="M40 34 C 52 26, 76 28, 82 46 C 86 60, 80 74, 66 78 L 40 78 C 34 70, 34 56, 40 50 Z" />
        ) : (
          <path d="M34 36 C 54 28, 92 28, 116 34 C 122 40, 120 52, 110 54 L 40 54 C 30 52, 28 40, 34 36 Z" />
        )}
        <path d={sitting ? "M78 34 C 84 22, 94 14, 106 16" : "M114 36 C 120 26, 126 20, 132 18"} />
        <path d={sitting ? "M104 14 C 116 12, 124 20, 120 28 C 116 34, 106 32, 100 28" : "M130 16 C 142 12, 152 20, 148 28 C 144 34, 134 32, 128 28"} />
        <path d={sitting ? "M100 14 L 96 4 L 108 10" : "M128 16 L 124 6 L 136 12"} />
        <path d={sitting ? "M40 60 C 26 62, 18 70, 16 78" : "M34 38 C 22 34, 14 26, 10 18"} />
      </g>
      {sitting ? (
        <>
          <path d="M70 56 L 72 80" stroke={color} strokeWidth={4} strokeLinecap="round" />
          <path d="M60 60 L 58 80" stroke={color} strokeWidth={4} strokeLinecap="round" />
        </>
      ) : (
        <>
          {leg(44, a)}
          {leg(56, -a)}
          {leg(100, -a)}
          {leg(110, a)}
        </>
      )}
      <circle cx={sitting ? 112 : 140} cy={sitting ? 21 : 23} r={2.2} fill={color} />
    </svg>
  );
};

/** A circular arrow that keeps going round (eternal return / repetition). */
export const LoopArrow: React.FC<{ size?: number; color?: string; rotation?: number }> = ({ size = 130, color = C.gold, rotation = 0 }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" style={{ transform: `rotate(${rotation}deg)` }}>
    <path d="M50 12 A 38 38 0 1 1 15 35" fill="none" stroke={color} strokeWidth={5} strokeLinecap="round" />
    <path d="M6 28 L 16 38 L 26 26" fill="none" stroke={color} strokeWidth={5} strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const BookIcon: React.FC<{ size?: number; color?: string; count?: number }> = ({ size = 130, color = C.paper, count = 1 }) => (
  <svg width={size} height={size} viewBox="0 0 100 100">
    {Array.from({ length: count }, (_, i) => (
      <g key={i} transform={`translate(${count > 1 ? (i - 0.5) * 22 : 0}, ${count > 1 ? i * 6 - 3 : 0})`} fill="none" stroke={color} strokeWidth={3.5} strokeLinejoin="round">
        <path d="M50 28 C 40 22, 26 20, 14 22 L 14 76 C 26 74, 40 76, 50 82 C 60 76, 74 74, 86 76 L 86 22 C 74 20, 60 22, 50 28 Z" />
        <path d="M50 28 L 50 82" />
      </g>
    ))}
  </svg>
);

export const FilmIcon: React.FC<{ size?: number; color?: string }> = ({ size = 130, color = C.paper }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" fill="none" stroke={color} strokeWidth={3.5}>
    <rect x={14} y={24} width={72} height={52} rx={4} />
    {[22, 34, 46, 58, 70].map((x) => (
      <g key={x}>
        <rect x={x} y={29} width={6} height={6} fill={color} stroke="none" />
        <rect x={x} y={65} width={6} height={6} fill={color} stroke="none" />
      </g>
    ))}
    <path d="M14 40 L 86 40 M 14 60 L 86 60" />
  </svg>
);

/** A clock whose hands move with the frame. */
export const Clock: React.FC<{ frame: number; size?: number; color?: string }> = ({ frame, size = 220, color = C.gold }) => {
  const minute = frame * 1.2;
  const hour = 300 + frame * 0.1;
  return (
    <svg width={size} height={size} viewBox="0 0 100 100">
      <circle cx={50} cy={50} r={44} fill="none" stroke={color} strokeWidth={3} />
      {Array.from({ length: 12 }, (_, i) => (
        <line key={i} x1={50} y1={10} x2={50} y2={i % 3 === 0 ? 17 : 14} stroke={color} strokeWidth={i % 3 === 0 ? 3 : 2}
          transform={`rotate(${i * 30} 50 50)`} />
      ))}
      <line x1={50} y1={50} x2={50} y2={26} stroke={color} strokeWidth={4} strokeLinecap="round" transform={`rotate(${hour} 50 50)`} />
      <line x1={50} y1={50} x2={50} y2={16} stroke={color} strokeWidth={2.5} strokeLinecap="round" transform={`rotate(${minute} 50 50)`} />
      <circle cx={50} cy={50} r={3.5} fill={color} />
    </svg>
  );
};

// Czechoslovakia (1968 borders, i.e. today's Czechia + Slovakia), simplified by hand from approximate
// border coordinates (longitude, latitude). Not a survey map: a recognisable outline.
const BORDER: [number, number][] = [
  [12.1, 50.32], [12.5, 50.42], [13.0, 50.5], [13.5, 50.7], [14.3, 50.88], [14.35, 51.03], [14.9, 50.87], [15.0, 51.0],
  [15.3, 50.8], [16.2, 50.66], [16.4, 50.4], [16.9, 50.45], [17.0, 50.22], [17.7, 50.32], [18.0, 50.05], [18.6, 49.92],
  [18.9, 49.5], [19.4, 49.6], [19.8, 49.2], [20.3, 49.4], [21.0, 49.4], [21.6, 49.45], [22.2, 49.2], [22.56, 49.08],
  [22.15, 48.4], [21.6, 48.5], [20.8, 48.57], [20.3, 48.28], [19.6, 48.22], [19.0, 48.06], [18.8, 47.85], [18.0, 47.76],
  [17.2, 48.0], [17.05, 48.15], [16.95, 48.6], [16.6, 48.78], [16.0, 48.75], [15.0, 49.0], [14.7, 48.6], [14.0, 48.6],
  [13.8, 48.77], [13.4, 49.05], [12.9, 49.35], [12.5, 49.7], [12.4, 50.05],
];
export const MAP_SCALE = 120;
/** Projects longitude/latitude into the map's pixel space (equirectangular, corrected for 49.5° N). */
export const project = (lon: number, lat: number): [number, number] => [
  (lon - 12.0) * MAP_SCALE * 0.65 + 20, (51.15 - lat) * MAP_SCALE + 20,
];
export const MAP_SIZE = { width: Math.round(10.6 * MAP_SCALE * 0.65 + 40), height: Math.round(3.45 * MAP_SCALE + 40) };
export const borderPath = () => BORDER.map(([lon, lat], i) => `${i ? "L" : "M"}${project(lon, lat).map((v) => v.toFixed(1)).join(" ")}`).join(" ") + " Z";
