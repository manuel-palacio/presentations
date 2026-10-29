// One component per scene of SOURCE.md. Frames are relative to the scene's content (after any divider);
// `cue()` finds when a phrase is reached in the narration, so visuals land with their subtitles.
import React from "react";
import { AbsoluteFill, Easing, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { Beat, C, Eyebrow, Rich, clamp, fadeBetween, sans, serif, useSpring } from "./ui";
import {
  Bust, BookIcon, Clock, Dog, Feather, FilmIcon, Figure, LoopArrow, MAP_SIZE, Stone, borderPath, project,
} from "./art";
import { META, Divider, contentFrames, cue, sceneById } from "./slides";

const at = (id: string, phrase: string) => cue(sceneById(id), phrase);
const length = (id: string) => contentFrames(sceneById(id));

const body: React.CSSProperties = { fontFamily: sans, fontSize: 38, lineHeight: 1.4, color: C.paper };
const italic: React.CSSProperties = { fontFamily: serif, fontStyle: "italic", fontSize: 54, lineHeight: 1.25, color: C.paper };
const quote: React.CSSProperties = { fontFamily: serif, fontWeight: 700, fontSize: 76, lineHeight: 1.12, color: C.paper };

/** Beats shown one at a time in a column: each lasts until the next one starts. */
const Sequenced: React.FC<{ beats: { from: number; node: React.ReactNode }[]; end: number; style: React.CSSProperties }> = ({ beats, end, style }) => (
  <>
    {beats.map((b, i) => (
      <Beat key={i} from={b.from} to={i + 1 < beats.length ? beats[i + 1].from : end}
        style={{ position: "absolute", display: "flex", flexDirection: "column", justifyContent: "center", ...style }}>
        {b.node}
      </Beat>
    ))}
  </>
);

// ---- Section divider ------------------------------------------------------------------------------------

export const DividerCard: React.FC<Divider> = ({ numeral, title, spoiler }) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const opacity = fadeBetween(frame, 0, durationInFrames, 15);
  const p = useSpring(4);
  const rule = interpolate(frame, [10, 50], [0, 1], { ...clamp, easing: Easing.inOut(Easing.ease) });
  return (
    <AbsoluteFill style={{ backgroundColor: "#0b0908", justifyContent: "center", alignItems: "center", opacity }}>
      <div style={{ fontFamily: serif, fontSize: 210, lineHeight: 1, color: C.gold, opacity: p, transform: `scale(${0.94 + p * 0.06})` }}>{numeral}</div>
      <div style={{ display: "flex", alignItems: "center", gap: 28, margin: "26px 0 30px" }}>
        <div style={{ opacity: rule, transform: "rotate(-60deg)" }}><Feather size={70} /></div>
        <div style={{ width: 420 * rule, height: 2, backgroundColor: C.line }} />
        <div style={{ opacity: rule }}><Stone width={56} /></div>
      </div>
      <div style={{ ...useEnterStyle(14), fontFamily: serif, fontSize: 72, color: C.paper, textAlign: "center", maxWidth: 1500 }}>{title}</div>
      {spoiler ? (
        <div style={{ ...useEnterStyle(30), marginTop: 34, display: "flex", alignItems: "center", gap: 12, fontFamily: sans, fontSize: 26,
          letterSpacing: 4, textTransform: "uppercase", color: C.red, border: `2px solid ${C.red}`, borderRadius: 999, padding: "8px 22px" }}>
          <svg width={28} height={26} viewBox="0 0 28 26"><path d="M14 2 L 26 24 L 2 24 Z" fill="none" stroke={C.red} strokeWidth={2.5} strokeLinejoin="round" />
            <path d="M14 10 L 14 16" stroke={C.red} strokeWidth={2.5} strokeLinecap="round" /><circle cx={14} cy={20} r={1.6} fill={C.red} /></svg>
          spoilers
        </div>
      ) : null}
    </AbsoluteFill>
  );
};

function useEnterStyle(delay: number): React.CSSProperties {
  const p = useSpring(delay);
  return { opacity: p, transform: `translateY(${(1 - p) * 26}px)` };
}

// ---- 1 · intro --------------------------------------------------------------------------------------------

export const Intro: React.FC = () => {
  const frame = useCurrentFrame();
  const baseline = 742;
  const lines = ["The Unbearable", "Lightness of Being"];
  let index = 0;

  // The feather drifts down the right side, then glides in to settle on the baseline.
  const fall = interpolate(frame, [0, 300], [0, 1], { ...clamp, easing: Easing.out(Easing.sin) });
  const fy = interpolate(fall, [0, 1], [-160, baseline - 24]);
  const fx = interpolate(fy, [-160, 640, baseline - 24], [1660, 1640, 1190], clamp) + Math.sin(frame / 20) * 55 * (1 - fall);
  const frot = Math.sin(frame / 26) * 22 * (1 - fall) + interpolate(frame, [240, 300], [0, 80], { ...clamp, easing: Easing.inOut(Easing.ease) });

  // The stone thuds down when the subtitle appears.
  const drop = interpolate(frame, [138, 152], [-760, 0], { ...clamp, easing: Easing.in(Easing.quad) });
  const squash = interpolate(frame, [152, 156, 166], [1, 0.86, 1], clamp);
  const ruleWidth = interpolate(frame, [0, 50], [0, 760], { ...clamp, easing: Easing.out(Easing.ease) });

  return (
    <AbsoluteFill style={{ backgroundColor: C.bg }}>
      <div style={{ position: "absolute", left: 960 - ruleWidth / 2, top: baseline, width: ruleWidth, height: 2, backgroundColor: C.line }} />
      <div style={{ position: "absolute", left: 770 - 65, top: baseline - 84, transform: `translateY(${drop}px) scaleY(${squash})`, transformOrigin: "50% 100%",
        opacity: frame < 136 ? 0 : 1 }}>
        <Stone width={130} />
      </div>
      <div style={{ position: "absolute", left: fx - 30, top: fy - 100, transform: `rotate(${frot}deg)` }}>
        <Feather size={200} />
      </div>
      <div style={{ position: "absolute", top: 200, width: "100%", textAlign: "center", fontFamily: serif, fontSize: 132, lineHeight: 1.06, color: C.paper }}>
        {lines.map((line) => (
          <div key={line}>
            {line.split("").map((ch, i) => {
              const delay = 20 + 2 * index++;
              return <span key={i} style={{ opacity: interpolate(frame, [delay, delay + 18], [0, 1], clamp) }}>{ch}</span>;
            })}
          </div>
        ))}
      </div>
      <Beat from={140} style={{ position: "absolute", top: 512, width: "100%", textAlign: "center", fontFamily: serif, fontStyle: "italic", fontSize: 50, color: C.gold }}>
        {`${META.author}, ${META.year}`}
      </Beat>
      <Beat from={200} style={{ position: "absolute", top: 596, width: "100%", textAlign: "center", fontFamily: serif, fontStyle: "italic", fontSize: 34, color: C.dim }}>
        {META.tagline}
      </Beat>
    </AbsoluteFill>
  );
};

// ---- 2 · hook ---------------------------------------------------------------------------------------------

const HOOK = [
  "Decisions we can never correct",
  "The traps of love",
  "Not understanding those closest to us",
  "The lies we decorate our lives with",
  "The real nature of happiness",
];

export const Hook: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ backgroundColor: C.paper }}>
      <Eyebrow color={C.red} style={{ position: "absolute", left: 300, top: 92 }}>Why this novel unsettles us</Eyebrow>
      {HOOK.map((line, i) => {
        const from = 24 + i * 96;
        const underline = interpolate(frame, [from + 18, from + 50], [0, 1], { ...clamp, easing: Easing.inOut(Easing.ease) });
        return (
          <Beat key={line} from={from} style={{ position: "absolute", left: 300, top: 180 + i * 132 }}>
            <div style={{ position: "relative", display: "inline-block", fontFamily: serif, fontSize: 68, color: C.bg }}>
              {line}
              <div style={{ position: "absolute", left: 0, bottom: -6, height: 6, width: `${underline * 100}%`, backgroundColor: C.red }} />
            </div>
          </Beat>
        );
      })}
    </AbsoluteFill>
  );
};

// ---- 3 · characters ---------------------------------------------------------------------------------------

const CHARACTERS = [
  { name: "Tomás", line: "surgeon who can't give up his lovers", cue: "surgeon", color: C.paper, left: 330, top: 110 },
  { name: "Teresa", line: "loves so much she becomes sick with jealousy", cue: "woman", color: C.red, left: 1030, top: 110 },
  { name: "Sabina", line: "painter who confuses freedom with permanent escape", cue: "artist", color: C.gold, left: 330, top: 480 },
  { name: "Franz", line: "intellectual who turns every feeling into a grand cause", cue: "intellectual", color: C.blue, left: 1030, top: 480 },
];

export const Characters: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const linesFrom = at("characters", "intellectual") + 70;
  const draw = (delay: number) => interpolate(frame, [linesFrom + delay, linesFrom + delay + 30], [0, 1], { ...clamp, easing: Easing.inOut(Easing.ease) });
  return (
    <AbsoluteFill style={{ backgroundColor: C.bg }}>
      {/* Love map: Tomás–Teresa (thick red), Tomás–Sabina (thin red), Sabina–Franz (blue). */}
      <div style={{ position: "absolute", left: 890, top: 241, width: 140 * draw(0), height: 9, backgroundColor: C.red, borderRadius: 5 }} />
      <div style={{ position: "absolute", left: 609, top: 380, width: 3, height: 100 * draw(14), backgroundColor: C.red }} />
      <div style={{ position: "absolute", left: 890, top: 612, width: 140 * draw(28), height: 4, backgroundColor: C.blue, borderRadius: 2 }} />
      {CHARACTERS.map((c, i) => {
        const from = at("characters", c.cue) - 6;
        const flip = spring({ frame: frame - from, fps, config: { damping: 200 }, durationInFrames: 30 });
        return (
          <div key={c.name} style={{ position: "absolute", left: c.left, top: c.top, width: 560, height: 270, perspective: 1400 }}>
            <div style={{ width: "100%", height: "100%", transform: `rotateY(${(1 - flip) * 90}deg)`, opacity: frame < from ? 0 : Math.min(1, flip * 3),
              backgroundColor: C.card, border: `1px solid ${C.line}`, borderTop: `4px solid ${c.color}`, borderRadius: 14,
              display: "flex", alignItems: "center", gap: 26, padding: "0 34px 0 26px", boxSizing: "border-box" }}>
              <Bust color={c.color} variant={i} size={150} />
              <div>
                <div style={{ fontFamily: serif, fontSize: 58, color: C.paper }}>{c.name}</div>
                <div style={{ fontFamily: sans, fontSize: 28, lineHeight: 1.35, color: C.dim, marginTop: 6 }}>{c.line}</div>
              </div>
            </div>
          </div>
        );
      })}
    </AbsoluteFill>
  );
};

// ---- 4 · plot ---------------------------------------------------------------------------------------------

const PLOT = [
  { title: "1960s Prague", line: "Tomás, divorced, free, many lovers", cue: "Prague, the" },
  { title: "A provincial town", line: "he meets Teresa, a waitress", cue: "Then he meets" },
  { title: "Prague", line: "she arrives with a suitcase; he falls in love", cue: "suitcase," },
  { title: "Infidelity", line: "affairs continue (Sabina); Teresa's jealousy", cue: "other women" },
  { title: "August 1968", line: "Soviet tanks", cue: "August 1968" },
  { title: "Switzerland", line: "exile, which solves nothing", cue: "flee to" },
  { title: "Karenin", line: "the dog who teaches what the humans can't learn", cue: "a dog" },
];

export const Plot: React.FC = () => {
  const frame = useCurrentFrame();
  const y = 440;
  const xs = PLOT.map((_, i) => 170 + i * 263);
  const cues = PLOT.map((p) => at("plot", p.cue));
  // The line reaches each node as its moment is narrated.
  const head = interpolate(frame, [0, ...cues.map((c) => c + 4), Math.max(length("plot") - 30, cues[6] + 20)], [110, ...xs, 1810], {
    ...clamp, easing: Easing.inOut(Easing.ease),
  });
  const total = 1700;
  return (
    <AbsoluteFill style={{ backgroundColor: C.bg }}>
      <Eyebrow style={{ position: "absolute", left: 110, top: 86 }}>The story</Eyebrow>
      <svg width={1920} height={1080} style={{ position: "absolute" }}>
        <line x1={110} y1={y} x2={1810} y2={y} stroke={C.paper} strokeOpacity={0.75} strokeWidth={3}
          strokeDasharray={total} strokeDashoffset={total - (head - 110)} />
      </svg>
      {PLOT.map((p, i) => {
        const from = cues[i];
        const pop = spring({ frame: frame - from, fps: 30, config: { damping: 12, mass: 0.6 } });
        const red = i === 4;
        const flash = red ? 0.5 + 0.5 * Math.cos((frame - from) / 5) * interpolate(frame, [from, from + 60], [1, 0], clamp) : 0;
        const above = i % 2 === 0;
        const left = Math.min(Math.max(xs[i] - 170, 60), 1860 - 340);
        return (
          <React.Fragment key={p.title}>
            {frame >= from ? (
              <>
                {red ? <div style={{ position: "absolute", left: xs[i] - 40, top: y - 40, width: 80, height: 80, borderRadius: 40,
                  backgroundColor: C.red, opacity: 0.35 * flash * pop }} /> : null}
                <div style={{ position: "absolute", left: xs[i] - 14, top: y - 14, width: 28, height: 28, borderRadius: 14,
                  backgroundColor: red ? C.red : C.paper, transform: `scale(${pop})`, boxShadow: red ? `0 0 ${30 * flash}px ${C.red}` : undefined }} />
                <div style={{ position: "absolute", left: xs[i] - 1, top: above ? y - 54 : y + 22, width: 2, height: 32, backgroundColor: C.line }} />
              </>
            ) : null}
            <Beat from={from + 4} style={{ position: "absolute", left, width: 340, textAlign: "center",
              ...(above ? { bottom: 1080 - (y - 66) } : { top: y + 66 }) }}>
              <div style={{ fontFamily: serif, fontStyle: "italic", fontSize: 38, color: red ? "#e0574c" : C.gold }}>{p.title}</div>
              <div style={{ fontFamily: sans, fontSize: 26, lineHeight: 1.35, color: C.dim, marginTop: 6 }}>{p.line}</div>
            </Beat>
          </React.Fragment>
        );
      })}
    </AbsoluteFill>
  );
};

// ---- 5 · author -------------------------------------------------------------------------------------------

const AUTHOR = [
  { mark: "1929", text: "Born **1 April 1929**, Brno, Czechoslovakia (April Fools' Day)", cue: "born" },
  { mark: "♪", text: "Father: a renowned **pianist**, so his novels are structured like music", cue: "pianist," },
  { mark: "1950s–70", text: "Communist Party: joined → expelled (1950s) → readmitted → expelled for good (1970)", cue: "He lived both" },
  { mark: "1975–79", text: "**1975** moves to France · **1979** Czech citizenship revoked · becomes French", cue: "exile in France" },
  { mark: "", text: "Very private, avoided interviews", cue: "" },
  { mark: "", text: "Distrusted absolute certainties", cue: "" },
  { mark: "2023", text: "Died in **Paris, 2023**, aged 94", cue: "He died" },
];

/** Faint musical staves; the same three-note figure appears, vanishes and returns elsewhere. */
const Staves: React.FC = () => {
  const frame = useCurrentFrame();
  const staves = [150, 640];
  const returns = [
    { x: 1460, staff: 0, from: 30 }, { x: 1500, staff: 1, from: 260 }, { x: 1220, staff: 1, from: 500 }, { x: 1640, staff: 0, from: 700 },
  ];
  return (
    <svg width={1920} height={1080} style={{ position: "absolute" }}>
      {staves.map((top) => [0, 1, 2, 3, 4].map((l) => (
        <line key={`${top}-${l}`} x1={0} x2={1920} y1={top + l * 22} y2={top + l * 22} stroke={C.paper} strokeOpacity={0.07} strokeWidth={2} />
      )))}
      {returns.map((r, i) => {
        const o = fadeBetween(frame, r.from, r.from + 200, 30) * 0.22;
        const base = staves[r.staff];
        return (
          <g key={i} opacity={o} fill={C.gold} stroke={C.gold}>
            {[0, 1, 2].map((n) => {
              const cy = base + 66 - n * 22 + (n === 2 ? 11 : 0);
              const cx = r.x + n * 54;
              return (
                <g key={n}>
                  <ellipse cx={cx} cy={cy} rx={13} ry={9} transform={`rotate(-20 ${cx} ${cy})`} stroke="none" />
                  <line x1={cx + 12} y1={cy} x2={cx + 12} y2={cy - 70} strokeWidth={3} />
                </g>
              );
            })}
            <line x1={r.x + 12} y1={base - 4 - 0} x2={r.x + 120} y2={base - 4 - 11} strokeWidth={8} />
          </g>
        );
      })}
    </svg>
  );
};

export const Author: React.FC = () => {
  const frame = useCurrentFrame();
  const top = 236;
  const step = 92;
  const lineHeight = interpolate(frame, [10, 120], [0, step * (AUTHOR.length - 1)], { ...clamp, easing: Easing.inOut(Easing.ease) });
  const died = at("author", "He died");
  const france = at("author", "exile in France");
  // The two traits are not narrated: they arrive between "France" and "died".
  const cues = AUTHOR.map((a, i) => (a.cue ? at("author", a.cue) : Math.round(france + ((died - france) * (i - 3)) / 3)));
  return (
    <AbsoluteFill style={{ backgroundColor: C.bg }}>
      <Staves />
      <Beat from={0} style={{ position: "absolute", left: 140, top: 66, display: "flex", alignItems: "baseline", gap: 30 }}>
        <span style={{ fontFamily: serif, fontSize: 84, color: C.paper }}>Milan Kundera</span>
        <span style={{ fontFamily: serif, fontStyle: "italic", fontSize: 42, color: C.gold }}>1929 – 2023</span>
      </Beat>
      <div style={{ position: "absolute", left: 419, top: top, width: 2, height: lineHeight, backgroundColor: C.line }} />
      {AUTHOR.map((a, i) => (
        <Beat key={a.text} from={cues[i]} style={{ position: "absolute", left: 140, top: top - 24 + i * step, display: "flex", alignItems: "center", height: 48 }}>
          <div style={{ width: 250, textAlign: "right", fontFamily: serif, fontSize: 32, color: C.gold }}>{a.mark}</div>
          <div style={{ width: 22, height: 22, borderRadius: 11, backgroundColor: C.paper, margin: "0 28px 0 18px", flex: "0 0 auto" }} />
          <div style={{ fontFamily: sans, fontSize: 30, color: C.paper, whiteSpace: "nowrap" }}><Rich text={a.text} boldColor={C.gold} /></div>
        </Beat>
      ))}
    </AbsoluteFill>
  );
};

// ---- 6 · context ------------------------------------------------------------------------------------------

const CONTEXT = [
  { text: "**Prague Spring (1968):** reforms, more civil liberties, less censorship, hope", cue: "In early 1968" },
  { text: "**20–21 August 1968:** Warsaw Pact invasion", cue: "invaded." },
  { text: "**\"Normalization\":** party control restored, censorship, reformers purged from their professions", cue: "normalization." },
  { text: "Novel written in exile; published **1984 in French**, **1985 in Czech** (exile publisher, Toronto)", cue: "wrote the novel" },
  { text: "Key question: *How much of our life is really ours?*", cue: "Its question" },
];

/** Invasion arrows: from East Germany, Poland, the USSR and Hungary towards the interior. */
const ARROWS: { from: [number, number]; to: [number, number] }[] = [
  { from: [12.3, 51.4], to: [13.8, 50.4] },
  { from: [16.6, 51.4], to: [16.4, 50.2] },
  { from: [19.8, 51.1], to: [19.3, 49.4] },
  { from: [23.1, 48.6], to: [21.5, 48.85] },
  { from: [19.4, 47.5], to: [19.2, 48.45] },
  { from: [18.3, 47.5], to: [18.1, 48.3] },
];

export const Context: React.FC = () => {
  const frame = useCurrentFrame();
  const invaded = at("context", "invaded.") - 6;
  const press = at("context", "Newspapers");
  const stamp = at("context", "normalization.");
  const shake = frame >= invaded && frame < invaded + 14 ? Math.sin(frame * 2.7) * 6 * (1 - (frame - invaded) / 14) : 0;
  const stampScale = interpolate(frame, [stamp, stamp + 7], [2.4, 1], { ...clamp, easing: Easing.in(Easing.quad) });
  const prague = project(14.42, 50.08);
  const bratislava = project(17.11, 48.15);
  return (
    <AbsoluteFill style={{ backgroundColor: C.bg }}>
      {/* Sepia map card */}
      <Beat from={0} style={{ position: "absolute", left: 90, top: 96, width: MAP_SIZE.width + 40, height: MAP_SIZE.height + 40,
        backgroundColor: "#cdb48e", borderRadius: 10, boxShadow: "0 20px 50px rgba(0,0,0,0.45)" }}>
        <div style={{ transform: `translate(${shake}px, ${shake * 0.4}px)`, position: "absolute", left: 20, top: 20 }}>
          <svg width={MAP_SIZE.width} height={MAP_SIZE.height} style={{ overflow: "visible" }}>
            <path d={borderPath()} fill="#e6d3b0" stroke="#5b4630" strokeWidth={3} strokeLinejoin="round" />
            <circle cx={prague[0]} cy={prague[1]} r={8} fill="#5b4630" />
            <text x={prague[0] + 16} y={prague[1] + 8} fontFamily={serif} fontStyle="italic" fontSize={28} fill="#3d2e1f">Prague</text>
            <circle cx={bratislava[0]} cy={bratislava[1]} r={6} fill="#5b4630" />
            <text x={bratislava[0] - 14} y={bratislava[1] - 6} textAnchor="end" fontFamily={serif} fontStyle="italic" fontSize={24} fill="#3d2e1f">Bratislava</text>
            <text x={project(15.6, 0)[0]} y={project(0, 49.45)[1]} textAnchor="middle" fontFamily={sans} fontSize={22} letterSpacing={6} fill="#6f5a40">
              CZECHOSLOVAKIA
            </text>
            {ARROWS.map((a, i) => {
              const [x1, y1] = project(...a.from);
              const [x2, y2] = project(...a.to);
              const t = interpolate(frame, [invaded + i * 3, invaded + i * 3 + 7], [0, 1], clamp);
              const angle = (Math.atan2(y2 - y1, x2 - x1) * 180) / Math.PI;
              const ex = x1 + (x2 - x1) * t;
              const ey = y1 + (y2 - y1) * t;
              return t > 0 ? (
                <g key={i}>
                  <line x1={x1} y1={y1} x2={ex} y2={ey} stroke={C.red} strokeWidth={10} strokeLinecap="round" />
                  <path d="M -6 -18 L 22 0 L -6 18 Z" fill={C.red} transform={`translate(${ex} ${ey}) rotate(${angle})`} />
                </g>
              ) : null;
            })}
          </svg>
        </div>
      </Beat>
      {/* Newspaper, stamped CENSORED at "normalization" */}
      <Beat from={press} style={{ position: "absolute", left: 160, top: 620, width: 780, height: 220, backgroundColor: "#e9e0cf",
        borderRadius: 4, padding: "18px 30px", boxSizing: "border-box", boxShadow: "0 16px 40px rgba(0,0,0,0.4)", transform: "rotate(-1.2deg)" }}>
        <div style={{ fontFamily: serif, fontSize: 20, letterSpacing: 6, color: "#4a4038", borderBottom: "2px solid #4a4038", paddingBottom: 6 }}>
          PRAGUE · 1968
        </div>
        <div style={{ fontFamily: serif, fontWeight: 700, fontSize: 52, color: "#1d1915", marginTop: 8 }}>PRAGUE SPRING</div>
        {[0, 1, 2].map((r) => (
          <div key={r} style={{ display: "flex", gap: 14, marginTop: 10 }}>
            {[0, 1, 2].map((c) => <div key={c} style={{ flex: 1, height: 8, backgroundColor: "#b9ae9c", borderRadius: 4, opacity: (r + c) % 3 === 2 ? 0.5 : 1 }} />)}
          </div>
        ))}
        {frame >= stamp ? (
          <div style={{ position: "absolute", left: 210, top: 60, transform: `rotate(-12deg) scale(${stampScale})`, opacity: interpolate(frame, [stamp, stamp + 4], [0, 0.92], clamp),
            border: `6px solid ${C.red}`, color: C.red, fontFamily: sans, fontWeight: 600, fontSize: 64, letterSpacing: 8, padding: "2px 22px", borderRadius: 8 }}>
            CENSORED
          </div>
        ) : null}
      </Beat>
      <div style={{ position: "absolute", left: 1110, top: 110, width: 720 }}>
        {CONTEXT.map((c) => (
          <Beat key={c.text} from={at("context", c.cue)} style={{ fontFamily: sans, fontSize: 30, lineHeight: 1.38, color: C.paper, marginBottom: 30,
            paddingLeft: 24, borderLeft: `4px solid ${c.cue === "invaded." ? C.red : C.line}` }}>
            <Rich text={c.text} boldColor={c.cue === "invaded." ? "#e0574c" : C.gold} />
          </Beat>
        ))}
      </div>
    </AbsoluteFill>
  );
};

// ---- 7 · influences ---------------------------------------------------------------------------------------

const INFLUENCES = [
  { title: "*Anna Karenina* (Tolstoy)", body: "love, infidelity, consequences; the dog is named after her", cue: "Anna Karenina", icon: "book" },
  { title: "Nietzsche, eternal return", body: "what does a life that happens only once mean?", cue: "Nietzsche's", icon: "loop" },
  { title: "*The Joke* · *The Book of Laughter and Forgetting*", body: "intimacy, history, memory, power", cue: "earlier work", icon: "books" },
  { title: "Film (1988)", body: "Daniel Day-Lewis, Juliette Binoche. Good, but it loses the narrator who interrupts to make us think.", cue: "1988 film", icon: "film" },
];

export const Influences: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ backgroundColor: C.bg }}>
      <Eyebrow style={{ position: "absolute", left: 110, top: 86 }}>In conversation with</Eyebrow>
      {INFLUENCES.map((inf, i) => {
        const from = at("influences", inf.cue) - 4;
        return (
          <Beat key={inf.title} from={from} rise={140} style={{ position: "absolute", left: 110 + i * 430, top: 160, width: 400, height: 600,
            backgroundColor: C.card, border: `1px solid ${inf.icon === "loop" ? C.gold : C.line}`, borderRadius: 14, padding: "36px 32px", boxSizing: "border-box" }}>
            <div style={{ height: 150, display: "flex", alignItems: "center" }}>
              {inf.icon === "book" ? <BookIcon /> : inf.icon === "books" ? <BookIcon count={2} /> : inf.icon === "film" ? <FilmIcon /> :
                <LoopArrow size={140} rotation={(frame - from) * 2.2} />}
            </div>
            <div style={{ fontFamily: serif, fontWeight: 700, fontSize: 40, lineHeight: 1.15, color: C.paper, marginTop: 18 }}><Rich text={inf.title} /></div>
            <div style={{ fontFamily: sans, fontSize: 27, lineHeight: 1.42, color: C.dim, marginTop: 18 }}>{inf.body}</div>
          </Beat>
        );
      })}
    </AbsoluteFill>
  );
};

// ---- 8 · theme1: one life only ----------------------------------------------------------------------------

const CHECKLIST = [
  "Stop demanding guarantees from the future",
  "Gather the information you have",
  "Weigh likely consequences",
  "Decide which values you're defending",
  "Judge past decisions by what you knew *then*",
];

/** A road that splits: the lived path stays drawn and warm, the imagined one is dashed and fades into fog. */
const Crossroads: React.FC = () => {
  const frame = useCurrentFrame();
  const d = (from: number, to: number) => interpolate(frame, [from, to], [1, 0], { ...clamp, easing: Easing.inOut(Easing.ease) });
  const fog = Math.sin(frame / 50);
  return (
    <svg width={820} height={760} viewBox="0 0 820 760" style={{ position: "absolute", left: 90, top: 90, overflow: "visible" }}>
      <defs>
        <linearGradient id="fade" x1="0" y1="1" x2="0.4" y2="0">
          <stop offset="0.35" stopColor={C.paper} stopOpacity={0.85} />
          <stop offset="1" stopColor={C.paper} stopOpacity={0} />
        </linearGradient>
        <radialGradient id="fog"><stop offset="0" stopColor="#cfc6b8" stopOpacity={0.5} /><stop offset="1" stopColor="#cfc6b8" stopOpacity={0} /></radialGradient>
      </defs>
      <path d="M410 760 L 410 470" stroke={C.gold} strokeWidth={30} strokeLinecap="round" pathLength={1} strokeDasharray={1} strokeDashoffset={d(10, 60)} fill="none" />
      <path d="M410 470 C 410 330, 150 300, 140 60" stroke={C.gold} strokeWidth={26} strokeLinecap="round" pathLength={1} strokeDasharray={1} strokeDashoffset={d(55, 130)} fill="none" />
      <path d="M410 470 C 410 330, 680 300, 690 60" stroke="url(#fade)" strokeWidth={22} strokeDasharray="34 26" fill="none"
        opacity={interpolate(frame, [70, 140], [0, 1], clamp)} />
      <ellipse cx={680 + fog * 20} cy={110} rx={210} ry={120} fill="url(#fog)" opacity={interpolate(frame, [90, 160], [0, 1], clamp)} />
      <ellipse cx={620 - fog * 26} cy={210} rx={170} ry={90} fill="url(#fog)" opacity={interpolate(frame, [110, 180], [0, 0.8], clamp)} />
      <text x={90} y={40} fontFamily={serif} fontStyle="italic" fontSize={34} fill={C.gold} opacity={interpolate(frame, [120, 150], [0, 1], clamp)}>the life you live</text>
      <text x={500} y={540} fontFamily={serif} fontStyle="italic" fontSize={34} fill={C.dim} opacity={interpolate(frame, [150, 180], [0, 1], clamp)}>the one you imagine</text>
    </svg>
  );
};

export const Theme1: React.FC = () => {
  const frame = useCurrentFrame();
  const end = length("theme1");
  const lesson = at("theme1", "The lesson:");
  const lastCue = at("theme1", "You may never");
  const quoteAt = at("theme1", "But imaginary");
  const beats = [
    { from: 0, node: <div style={italic}>We can't go back to a crossroads and try the other path.</div> },
    { from: at("theme1", "When Teresa"), node: <div style={body}><Rich text="Tomás leaves Switzerland to follow Teresa back to occupied Prague. Right choice? **He can never know.**" boldColor={C.gold} /></div> },
    { from: at("theme1", "The host tells"), node: <div style={body}>Host's anecdote: left radio (passion, little money) for a dot-com (lots of money) in 2000, and still daydreams about radio.</div> },
    { from: quoteAt, node: <div style={quote}>“Imaginary lives never have to pay their bills.”</div> },
    { from: Math.round((quoteAt + lesson) / 2) + 20, node: <div style={body}><Rich text="*Counterfactual thinking*: useful for learning, a trap when used to despise your real life." /></div> },
    {
      from: lesson, node: (
        <div>
          <div style={{ fontFamily: sans, fontWeight: 600, fontSize: 30, letterSpacing: 5, textTransform: "uppercase", color: C.gold, marginBottom: 26 }}>Practical lesson</div>
          {CHECKLIST.map((item, i) => {
            const tick = lesson + 20 + (i * (lastCue - lesson)) / CHECKLIST.length;
            const t = interpolate(frame, [tick, tick + 14], [0, 1], clamp);
            return (
              <div key={item} style={{ display: "flex", alignItems: "center", gap: 22, marginBottom: 20, fontFamily: sans, fontSize: 34, color: C.paper }}>
                <svg width={40} height={40} viewBox="0 0 40 40" style={{ flex: "0 0 auto" }}>
                  <rect x={2} y={2} width={36} height={36} rx={6} fill="none" stroke={C.line} strokeWidth={3} />
                  <path d="M9 21 L 17 29 L 32 11" fill="none" stroke={C.gold} strokeWidth={5} strokeLinecap="round" strokeLinejoin="round"
                    pathLength={1} strokeDasharray={1} strokeDashoffset={1 - t} />
                </svg>
                <span style={{ opacity: 0.55 + 0.45 * t }}><Rich text={item} /></span>
              </div>
            );
          })}
        </div>
      ),
    },
  ];
  return (
    <AbsoluteFill style={{ backgroundColor: C.bg }}>
      <Crossroads />
      <Sequenced beats={beats} end={end + 100} style={{ left: 1000, top: 110, width: 840, height: 740 }} />
    </AbsoluteFill>
  );
};

// ---- 9 · theme2: love ≠ compatibility ---------------------------------------------------------------------

/** Two circles that keep trying to merge and snap back apart. */
const Venn: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const cycle = 165;
  const t = frame % cycle;
  const approach = interpolate(t, [0, 110], [0, 1], { ...clamp, easing: Easing.inOut(Easing.ease) });
  const snap = spring({ frame: t - 110, fps, config: { damping: 9, stiffness: 140 } });
  const gap = 170 - 125 * approach * (1 - snap);
  return (
    <div style={{ position: "absolute", left: 90, top: 160, width: 820, height: 560 }}>
      {[{ x: 410 - gap, color: C.red, label: "Tomás" }, { x: 410 + gap, color: C.blue, label: "Teresa" }].map((c) => (
        <div key={c.label} style={{ position: "absolute", left: c.x - 210, top: 70, width: 420, height: 420, borderRadius: 210,
          backgroundColor: c.color, opacity: 0.55, mixBlendMode: "screen", border: `3px solid ${c.color}` }} />
      ))}
      {[{ x: 410 - gap - 90, label: "Tomás" }, { x: 410 + gap + 90, label: "Teresa" }].map((c) => (
        <div key={c.label} style={{ position: "absolute", left: c.x - 100, top: 255, width: 200, textAlign: "center", fontFamily: serif,
          fontStyle: "italic", fontSize: 42, color: C.paper }}>{c.label}</div>
      ))}
    </div>
  );
};

/** A calendar flipping ten years while the person beside it stays the same. */
const TenYears: React.FC<{ from: number; to: number }> = ({ from, to }) => {
  const frame = useCurrentFrame();
  const per = Math.max(12, Math.floor((to - from - 40) / 10));
  const n = Math.min(10, Math.max(1, Math.floor((frame - from) / per) + 1));
  const flip = interpolate((frame - from) % per, [0, 10], [90, 0], clamp);
  return (
    <div style={{ position: "absolute", left: 150, top: 250, display: "flex", alignItems: "flex-end", gap: 90 }}>
      <div style={{ width: 340, height: 380, perspective: 900 }}>
        <div style={{ width: "100%", height: 64, backgroundColor: C.red, borderRadius: "14px 14px 0 0" }} />
        <div style={{ height: 316, backgroundColor: C.paper, borderRadius: "0 0 14px 14px", transformOrigin: "50% 0%",
          transform: n < 10 || flip > 0 ? `rotateX(${flip}deg)` : undefined, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
          <div style={{ fontFamily: serif, fontWeight: 700, fontSize: 150, lineHeight: 1, color: C.bg }}>{n}</div>
          <div style={{ fontFamily: sans, fontSize: 30, color: C.inkDim, marginTop: 10 }}>{n === 1 ? "year" : "years"}</div>
        </div>
      </div>
      <Figure color={C.blue} height={380} />
    </div>
  );
};

export const Theme2: React.FC = () => {
  const frame = useCurrentFrame();
  const end = length("theme2");
  const ask = at("theme2", "Ask yourself:");
  const beats = [
    { from: 0, node: <div style={body}>Teresa's childhood: a mother who mocked her modesty and didn't let her close the bathroom door. She escaped into books.</div> },
    { from: at("theme2", "When she meets"), node: <div style={body}>She meets Tomás reading a book, a sign of the world she longed for.</div> },
    { from: at("theme2", "But Tomás believes"), node: <div style={body}><Rich text="**Tomás:** sex ≠ love. **Teresa:** each infidelity denies her uniqueness." boldColor={C.gold} /></div> },
    { from: at("theme2", "Don't divide"), node: <div style={body}><Rich text="*No hero, no villain.* Tomás loves and sacrifices yet keeps hurting her. Teresa bets her security on him becoming someone else." /></div> },
    {
      from: at("theme2", "The lesson is"), node: (
        <div style={{ display: "flex", flexDirection: "column", gap: 26 }}>
          {[["Broken agreement", "a problem of *trust*"], ["Different fundamental expectations", "a problem of *incompatibility*"]].map(([a, b]) => (
            <div key={a} style={{ backgroundColor: C.card, border: `1px solid ${C.line}`, borderRadius: 14, padding: "26px 34px" }}>
              <div style={{ fontFamily: sans, fontWeight: 600, fontSize: 36, color: C.gold }}>{a}</div>
              <div style={{ fontFamily: sans, fontSize: 34, color: C.paper, marginTop: 8 }}>→ <Rich text={b} /></div>
            </div>
          ))}
        </div>
      ),
    },
    { from: ask, node: <div style={{ ...quote, fontSize: 62 }}>“Could I live in peace with this person if, in 10 years, they were essentially the same as today?”</div> },
  ];
  return (
    <AbsoluteFill style={{ backgroundColor: C.bg }}>
      <div style={{ opacity: interpolate(frame, [ask - 16, ask], [1, 0], clamp) }}><Venn /></div>
      {frame >= ask ? <div style={{ opacity: interpolate(frame, [ask, ask + 16], [0, 1], clamp) }}><TenYears from={ask + 10} to={end - 20} /></div> : null}
      <Sequenced beats={beats} end={end + 100} style={{ left: 1000, top: 110, width: 840, height: 740 }} />
    </AbsoluteFill>
  );
};

// ---- 10 · theme3: a dictionary of misunderstood words ----------------------------------------------------

const DEFINITIONS = ["dinner with friends once a week", "many sexual partners", "a room of one's own"];

const Bubble: React.FC<{ color: string; tail: "left" | "right" }> = ({ color, tail }) => (
  <div style={{ position: "relative", backgroundColor: color, borderRadius: 40, padding: "26px 54px", fontFamily: serif, fontStyle: "italic",
    fontSize: 64, color: C.paper }}>
    freedom
    <div style={{ position: "absolute", bottom: -26, [tail]: 60, width: 0, height: 0, borderLeft: "22px solid transparent",
      borderRight: "22px solid transparent", borderTop: `30px solid ${color}` }} />
  </div>
);

export const Theme3: React.FC = () => {
  const frame = useCurrentFrame();
  const end = length("theme3");
  const split = at("theme3", "It happens");
  const fix = at("theme3", "The fix");
  const franz = at("theme3", "Franz leaves");
  const love = at("theme3", "Love doesn't");
  const ink = C.bg;
  const entry: React.CSSProperties = { fontFamily: serif, fontSize: 46, lineHeight: 1.35, color: ink };
  return (
    <AbsoluteFill style={{ backgroundColor: C.paper }}>
      {/* Dictionary page furniture */}
      <div style={{ position: "absolute", left: 120, right: 120, top: 70, display: "flex", justifyContent: "space-between", alignItems: "baseline",
        borderBottom: `2px solid ${ink}`, paddingBottom: 12, fontFamily: serif, color: ink }}>
        <span style={{ fontStyle: "italic", fontSize: 34 }}>A short dictionary of misunderstood words</span>
        <span style={{ fontFamily: sans, fontSize: 22, letterSpacing: 5, color: C.inkDim }}>FREEDOM · SABINA · FRANZ</span>
      </div>

      <div style={{ position: "absolute", left: 160, top: 210, width: 1600, opacity: fadeBetween(frame, 0, split, 16) }}>
        <Beat from={10} style={entry}><Rich text="**Sabina** flees every constraint: art conventions, family, politics, commitment." /></Beat>
        <Beat from={at("theme3", "In Switzerland")} style={{ ...entry, marginTop: 50 }}>
          <Rich text={`**Franz** adores her. Kundera gives them a **“short dictionary of misunderstood words.”**`} />
        </Beat>
      </div>

      {frame >= split && frame < fix ? (
        <div style={{ opacity: fadeBetween(frame, split, fix, 16) }}>
          <Beat from={split} style={{ position: "absolute", left: 150, top: 380, fontFamily: serif, fontWeight: 700, fontSize: 130, letterSpacing: 6, color: ink }}>
            FREEDOM
          </Beat>
          <svg width={1920} height={1080} style={{ position: "absolute" }}>
            {DEFINITIONS.map((_, i) => {
              const y = 250 + i * 210;
              const t = interpolate(frame, [split + 20 + i * 24, split + 50 + i * 24], [1, 0], clamp);
              return <path key={i} d={`M880 460 C 960 460, 960 ${y}, 1040 ${y}`} fill="none" stroke={[C.red, C.blue, C.gold][i]} strokeWidth={5}
                pathLength={1} strokeDasharray={1} strokeDashoffset={t} />;
            })}
          </svg>
          {DEFINITIONS.map((def, i) => (
            <Beat key={def} from={split + 44 + i * 24} style={{ position: "absolute", left: 1070, top: 250 + i * 210 - 34, fontFamily: serif,
              fontStyle: "italic", fontSize: 50, color: ink, borderLeft: `6px solid ${[C.red, C.blue, C.gold][i]}`, paddingLeft: 24 }}>
              {def}
            </Beat>
          ))}
        </div>
      ) : null}

      {frame >= fix && frame < franz ? (
        <div style={{ opacity: fadeBetween(frame, fix, franz, 16) }}>
          <Beat from={fix} style={{ position: "absolute", left: 420, top: 220 }}><Bubble color={C.red} tail="left" /></Beat>
          <Beat from={fix + 12} style={{ position: "absolute", left: 1080, top: 220 }}><Bubble color={C.blue} tail="right" /></Beat>
          <Beat from={fix + 30} style={{ position: "absolute", left: 160, top: 500, width: 1600, ...entry, textAlign: "center" }}>
            <Rich text={`**Technique:** translate big words into concrete behaviors (respect? commitment? “sharing a life”?).`} />
          </Beat>
        </div>
      ) : null}

      {frame >= franz ? (
        <>
          <Beat from={franz} style={{ position: "absolute", left: 160, top: 260, width: 1600, ...entry, textAlign: "center" }}>
            Franz leaves his wife as the ultimate romantic gesture; Sabina sees a door closing and leaves.
          </Beat>
          <Beat from={love} style={{ position: "absolute", left: 160, top: 520, width: 1600, textAlign: "center", fontFamily: serif, fontWeight: 700,
            fontSize: 92, color: C.red }}>
            “Love doesn't grant telepathy.”
          </Beat>
        </>
      ) : null}
    </AbsoluteFill>
  );
};

// ---- 11 · theme4: kitsch ----------------------------------------------------------------------------------

/** The advert: a perfect family at breakfast in golden light. Drawn at 1920×1080. */
const Advert: React.FC = () => (
  <svg width={1920} height={1080} viewBox="0 0 1920 1080" style={{ display: "block" }}>
    <defs>
      <linearGradient id="gold" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#f8dc95" /><stop offset="1" stopColor="#e6a24a" /></linearGradient>
      <linearGradient id="gloss" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#fff" stopOpacity={0.38} /><stop offset="0.45" stopColor="#fff" stopOpacity={0} /></linearGradient>
    </defs>
    <rect width={1920} height={1080} fill="url(#gold)" />
    <circle cx={1590} cy={230} r={130} fill="#fff6d2" opacity={0.85} />
    <rect x={180} y={150} width={420} height={320} rx={10} fill="#fff4dc" opacity={0.5} />
    <path d="M390 150 L 390 470 M 180 310 L 600 310" stroke="#e8b866" strokeWidth={10} />
    {[{ x: 520, c: "#c0563f", h: 1 }, { x: 830, c: "#4f7a8c", h: 0.82 }, { x: 1110, c: "#d4a03a", h: 0.7 }, { x: 1400, c: "#7a9a5a", h: 1 }].map((p) => {
      const headY = 720 - 360 * p.h;
      return (
        <g key={p.x}>
          <rect x={p.x - 110} y={headY + 70} width={220} height={720 - headY} rx={90} fill={p.c} />
          <circle cx={p.x} cy={headY} r={72} fill="#f3c9a0" />
          <path d={`M${p.x - 30} ${headY + 18} Q ${p.x} ${headY + 46} ${p.x + 30} ${headY + 18}`} stroke="#7a3b2a" strokeWidth={7} fill="none" strokeLinecap="round" />
          <circle cx={p.x - 24} cy={headY - 12} r={7} fill="#5b3324" />
          <circle cx={p.x + 24} cy={headY - 12} r={7} fill="#5b3324" />
        </g>
      );
    })}
    <rect x={200} y={700} width={1520} height={70} rx={20} fill="#fffaf0" />
    <rect x={240} y={770} width={1440} height={310} fill="#b06f35" />
    {[420, 760, 1100, 1440].map((x) => (
      <g key={x}><ellipse cx={x} cy={712} rx={90} ry={16} fill="#fff" stroke="#e7c58f" strokeWidth={4} />
        <rect x={x + 100} y={650} width={50} height={60} rx={10} fill="#fff" stroke="#e7c58f" strokeWidth={4} /></g>
    ))}
    <rect width={1920} height={1080} fill="url(#gloss)" />
  </svg>
);

/** Grey clutter around the frame, in screen positions at the final zoom (0.4). */
const CLUTTER: [number, number][] = [[520, 850], [760, 870], [1180, 870], [1430, 840], [1480, 330], [1760, 320], [140, 560], [1800, 760]];

const OUTSIDE = [
  { label: "the mortgage", x: -615, y: 170, kind: "papers" },
  { label: "the sick grandmother", x: -615, y: 930, kind: "bed" },
  { label: "the sexless marriage", x: 2535, y: 540, kind: "pillows" },
];

const Outside: React.FC<{ kind: string }> = ({ kind }) => {
  const g = "#9a948d";
  if (kind === "papers")
    return (
      <svg width={600} height={420} viewBox="0 0 600 420">
        {[-8, 4, 12].map((r, i) => (
          <g key={i} transform={`rotate(${r} 300 210)`}>
            <rect x={120 + i * 20} y={40 + i * 10} width={340} height={340} fill="#4a4541" stroke={g} strokeWidth={5} />
            {[0, 1, 2, 3, 4].map((l) => <rect key={l} x={160 + i * 20} y={110 + i * 10 + l * 48} width={240 - l * 20} height={14} fill={g} opacity={0.6} />)}
          </g>
        ))}
        <text x={300} y={115} textAnchor="middle" fontFamily={sans} fontWeight={600} fontSize={52} fill="#cfc9c2">%</text>
      </svg>
    );
  if (kind === "bed")
    return (
      <svg width={600} height={420} viewBox="0 0 600 420" fill="none" stroke={g} strokeWidth={8} strokeLinecap="round">
        <path d="M60 330 L 60 160 M 60 250 L 540 250 L 540 330 M 60 300 L 540 300" />
        <circle cx={140} cy={210} r={34} />
        <path d="M180 240 C 260 190, 420 190, 520 240" />
        <rect x={430} y={100} width={56} height={90} rx={10} />
        <path d="M430 128 L 486 128" />
      </svg>
    );
  return (
    <svg width={600} height={420} viewBox="0 0 600 420" fill="none" stroke={g} strokeWidth={8} strokeLinecap="round">
      <rect x={40} y={140} width={520} height={200} rx={16} />
      <rect x={70} y={160} width={120} height={60} rx={24} />
      <rect x={410} y={160} width={120} height={60} rx={24} />
      <path d="M300 150 L 300 330" strokeDasharray="14 18" />
    </svg>
  );
};

const Heart: React.FC<{ size: number }> = ({ size }) => (
  <svg width={size} height={size} viewBox="0 0 32 30"><path d="M16 28 C 6 20, 1 14, 1 8.5 C 1 4.5, 4 1.5, 8 1.5 C 11 1.5, 14 3.5, 16 6.5 C 18 3.5, 21 1.5, 24 1.5 C 28 1.5, 31 4.5, 31 8.5 C 31 14, 26 20, 16 28 Z" fill={C.red} /></svg>
);

export const Theme4: React.FC = () => {
  const frame = useCurrentFrame();
  const end = length("theme4");
  const pull = at("theme4", "Now picture");
  const kitsch = at("theme4", "Kitsch removes");
  const second = at("theme4", "And there's a second");
  const social = at("theme4", "Think of social");
  const memory = at("theme4", "Our memory");
  const zoom = interpolate(frame, [pull, pull + 150], [1, 0.4], { ...clamp, easing: Easing.inOut(Easing.cubic) });
  const outside = interpolate(frame, [pull + 40, pull + 140], [0, 1], clamp);
  const phone = interpolate(frame, [social, social + 30], [0, 1], { ...clamp, easing: Easing.inOut(Easing.ease) });
  const dim = interpolate(frame, [memory, memory + 24], [1, 0.07], clamp);
  const top: React.CSSProperties = { left: 160, top: 70, width: 1600, height: 220, textAlign: "center", alignItems: "center" };
  const beats = [
    { from: 0, node: <div style={{ ...italic, color: "#3a2410", textShadow: "0 0 30px rgba(255,240,200,0.8)" }}>A perfect family breakfast in golden light, the ad image.</div> },
    { from: pull + 30, node: <div style={{ ...body, fontSize: 40 }}>Pull back to reveal what's cut out: the mortgage, the sexless marriage, the sick grandmother.</div> },
    { from: kitsch, node: <div style={{ ...quote, fontSize: 70 }}>Kitsch = removing everything that spoils the image.</div> },
    { from: second, node: <div style={{ ...body, fontSize: 40 }}><Rich text="The second-level emotion: being moved *that everyone is moved*, and so feeling morally superior." /></div> },
    { from: social, node: <div style={{ ...body, fontSize: 40 }}>Social media: a perfect photo needs more perfect photos; life serves the image; happiness becomes a staged obligation.</div> },
  ];
  return (
    <AbsoluteFill style={{ backgroundColor: "#2e2b28" }}>
      <AbsoluteFill style={{ opacity: dim }}>
        <div style={{ position: "absolute", left: 0, top: 0, width: 1920, height: 1080, transformOrigin: "960px 540px", transform: `scale(${zoom})` }}>
          {/* Grey clutter outside the frame */}
          {CLUTTER.map(([sx, sy], i) => (
            <div key={i} style={{ position: "absolute", left: 960 + (sx - 960) / 0.4 - 110, top: 540 + (sy - 540) / 0.4 - 60,
              width: 220 + (i % 3) * 60, height: 120 + (i % 2) * 40, border: "6px solid #57524d", transform: `rotate(${(i * 37) % 50 - 25}deg)`,
              opacity: outside * 0.7 }} />
          ))}
          {OUTSIDE.map((o) => (
            <div key={o.label} style={{ position: "absolute", left: o.x - 450, top: o.y - 260, width: 900, opacity: outside, textAlign: "center" }}>
              <Outside kind={o.kind} />
              <div style={{ fontFamily: serif, fontStyle: "italic", fontSize: 72, color: "#c9c2b9", marginTop: 6 }}>{o.label}</div>
            </div>
          ))}
          {/* Phone body appears around the frame for social media */}
          <div style={{ position: "absolute", left: -110, top: -110, width: 2140, height: 1300, borderRadius: 150, backgroundColor: "#0b0a09",
            border: "10px solid #57524d", opacity: phone }} />
          <div style={{ position: "absolute", left: 0, top: 0, width: 1920, height: 1080, overflow: "hidden", borderRadius: 60 * phone,
            boxShadow: `0 0 0 ${24 * (1 - phone)}px #fffaf0` }}>
            <Advert />
          </div>
        </div>
        {/* A stream of likes */}
        {phone > 0
          ? Array.from({ length: 14 }, (_, i) => {
            const start = social + 20 + i * 14;
            const t = (frame - start) / 70;
            if (t < 0 || t > 1) return null;
            return <div key={i} style={{ position: "absolute", left: 1270 + ((i * 53) % 90), top: 720 - t * 380, opacity: Math.sin(t * Math.PI) }}><Heart size={44 + (i % 3) * 12} /></div>;
          })
          : null}
        {phone > 0 ? (
          <div style={{ position: "absolute", left: 1400, top: 780, display: "flex", alignItems: "center", gap: 10, opacity: phone, fontFamily: sans,
            fontWeight: 600, fontSize: 30, color: C.paper }}>
            <Heart size={30} /> {Math.round(interpolate(frame, [social + 20, memory], [128, 9840], clamp)).toLocaleString("en-US")}
          </div>
        ) : null}
      </AbsoluteFill>
      <Sequenced beats={beats} end={memory} style={top} />
      {frame >= memory ? (
        <div style={{ position: "absolute", left: 210, top: 170, width: 1500 }}>
          {[
            "Can I admit my parents were wrong and still love them?",
            "Can a relationship have been wonderful *and* miserable?",
            "Can I admit I was petty, ridiculous, or cowardly, without inventing a heroic excuse?",
          ].map((q, i) => (
            <Beat key={q} from={memory + 10 + i * 40} style={{ fontFamily: serif, fontSize: 54, lineHeight: 1.3, color: C.paper, marginBottom: 46,
              paddingLeft: 30, borderLeft: `5px solid ${C.gold}` }}>
              <Rich text={q} />
            </Beat>
          ))}
        </div>
      ) : null}
    </AbsoluteFill>
  );
};

// ---- 12 · theme5: happiness ------------------------------------------------------------------------------

/** Karenin walking round and round an oval track (repetition), under a clock whose hands move gently. */
const DogLoop: React.FC = () => {
  const frame = useCurrentFrame();
  const cx = 480;
  const cy = 610;
  const rx = 330;
  const ry = 110;
  const angle = frame * 0.014 - Math.PI / 2;
  const depth = Math.sin(angle); // -1 far side, +1 near side
  const x = cx + Math.cos(angle) * rx;
  const y = cy + depth * ry;
  const facing = -Math.sin(angle) >= 0 ? 1 : -1; // moving right on the far side, left on the near side
  const scale = 0.85 + 0.15 * (depth + 1) / 2;
  const dog = (
    <div style={{ position: "absolute", left: x - 90, top: y - 92, transform: `scale(${facing * scale}, ${scale})`, transformOrigin: "90px 92px" }}>
      <Dog width={180} color={C.paper} step={frame / 4} />
    </div>
  );
  return (
    <div style={{ position: "absolute", left: 0, top: 0, width: 960, height: 960 }}>
      <svg width={960} height={960} style={{ position: "absolute" }}>
        <ellipse cx={cx} cy={cy} rx={rx} ry={ry} fill="none" stroke={C.gold} strokeOpacity={0.45} strokeWidth={3} strokeDasharray="4 16" strokeLinecap="round" />
      </svg>
      {depth < 0 ? dog : null}
      <div style={{ position: "absolute", left: cx - 110, top: 250 }}><Clock frame={frame} /></div>
      {depth >= 0 ? dog : null}
    </div>
  );
};

/** A door with the dog waiting beside it, warm light under it. */
const DoorWaiting: React.FC = () => (
  <div style={{ position: "absolute", left: 200, top: 200 }}>
    <div style={{ width: 280, height: 520, border: `5px solid ${C.gold}`, borderRadius: "8px 8px 0 0", position: "relative", backgroundColor: "rgba(201,162,74,0.08)" }}>
      <div style={{ position: "absolute", right: 30, top: 270, width: 22, height: 22, borderRadius: 11, backgroundColor: C.gold }} />
      <div style={{ position: "absolute", left: -5, right: -5, bottom: -10, height: 10, backgroundColor: C.gold, boxShadow: `0 0 40px 10px ${C.gold}` }} />
    </div>
    <div style={{ position: "absolute", left: 300, top: 412 }}><Dog sitting width={220} color={C.paper} /></div>
  </div>
);

export const Theme5: React.FC = () => {
  const frame = useCurrentFrame();
  const end = length("theme5");
  const ask = at("theme5", "So ask:");
  const warm = interpolate(frame, [0, 300], [0, 1], clamp);
  const answers = ["a person", "a dog", "a project", "a garden", "a conversation"];
  const waiting = Math.min(end - 120, ask + 170);
  const beats = [
    { from: 0, node: <div style={body}><Rich text="Tomás refuses to retract a critical article → loses medicine → becomes a **window cleaner**." boldColor={C.gold} /></div> },
    { from: at("theme5", "And something surprising"), node: <div style={body}><Rich text="The man who guarded his freedom finds **serenity in routine and commitment**." boldColor={C.gold} /></div> },
    { from: at("theme5", "Teresa realizes"), node: <div style={body}>Teresa sees the price he paid: love can also produce guilt.</div> },
    { from: at("theme5", "Then there's Karenin"), node: <div style={body}><Rich text="**Karenin**: affection made of habit and small rituals. Dogs love repetition; humans despise it." boldColor={C.gold} /></div> },
    { from: at("theme5", "while most"), node: <div style={body}>Not a praise of poverty: the losses are political and real.</div> },
    {
      from: at("theme5", "The novel separates"), node: (
        <div style={{ display: "flex", gap: 26 }}>
          {["What we have achieved", "what we are able to enjoy"].map((t, i) => (
            <div key={t} style={{ flex: 1, backgroundColor: i ? "rgba(201,162,74,0.16)" : C.card, border: `1px solid ${i ? C.gold : C.line}`,
              borderRadius: 14, padding: "40px 30px", fontFamily: serif, fontSize: 48, lineHeight: 1.2, color: i ? C.gold : C.dim, textAlign: "center" }}>
              {t}
            </div>
          ))}
        </div>
      ),
    },
    {
      from: ask, node: (
        <div>
          <div style={{ fontFamily: serif, fontWeight: 700, fontSize: 48, lineHeight: 1.22, color: C.paper }}>
            “If everything you use to prove your life matters vanished tomorrow, what would still be worth getting up for?”
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "8px 0", marginTop: 30, fontFamily: sans, fontSize: 32, color: C.gold }}>
            {answers.map((a, i) => (
              <span key={a} style={{ opacity: interpolate(frame, [ask + 40 + i * 18, ask + 58 + i * 18], [0, 1], clamp) }}>{i ? " · " : ""}{a}</span>
            ))}
          </div>
          <div style={{ fontFamily: serif, fontStyle: "italic", fontSize: 36, lineHeight: 1.3, color: C.dim, marginTop: 40,
            opacity: interpolate(frame, [waiting, waiting + 20], [0, 1], clamp) }}>
            A life spent chasing the next goal turns the present into a waiting room.
          </div>
        </div>
      ),
    },
  ];
  return (
    <AbsoluteFill style={{ backgroundColor: C.bg }}>
      <AbsoluteFill style={{ opacity: warm, background: "radial-gradient(ellipse at 30% 45%, rgba(201,162,74,0.32) 0%, rgba(58,44,20,0.6) 45%, #1d170e 100%)" }} />
      <div style={{ opacity: interpolate(frame, [ask - 16, ask], [1, 0], clamp) }}><DogLoop /></div>
      {frame >= ask ? <div style={{ opacity: interpolate(frame, [ask, ask + 20], [0, 1], clamp) }}><DoorWaiting /></div> : null}
      <Sequenced beats={beats} end={end + 100} style={{ left: 980, top: 100, width: 860, height: 760 }} />
    </AbsoluteFill>
  );
};

// ---- 13 · finale: the dance ------------------------------------------------------------------------------

export const Finale: React.FC = () => {
  const frame = useCurrentFrame();
  const end = length("finale");
  const angle = frame * 0.02;
  const cx = 560;
  const floor = 790;
  const dancers = [0, Math.PI].map((offset, i) => {
    const a = angle + offset;
    return { x: cx + Math.cos(a) * 80, depth: Math.sin(a), dress: i === 1 };
  }).sort((a, b) => a.depth - b.depth);
  const fall = interpolate(frame, [30, 560], [0, 1], { ...clamp, easing: Easing.out(Easing.sin) });
  const fy = interpolate(fall, [0, 1], [-180, floor - 20]);
  const fx = 820 + Math.sin(frame / 22) * 60 * (1 - fall);
  const frot = Math.sin(frame / 28) * 24 * (1 - fall) + interpolate(frame, [500, 560], [0, 84], clamp);
  const groups = [
    { from: 0, to: at("finale", "Next time") },
    { from: at("finale", "Next time"), to: at("finale", "And if you") },
  ];
  return (
    <AbsoluteFill style={{ backgroundColor: C.bg }}>
      <AbsoluteFill style={{ background: `radial-gradient(ellipse at 29% 52%, rgba(201,162,74,${0.55 + 0.08 * Math.sin(frame / 40)}) 0%, rgba(120,90,40,0.35) 32%, #14110F 72%)` }} />
      <div style={{ position: "absolute", left: 250, top: floor, width: 640, height: 2, backgroundColor: "rgba(239,230,216,0.3)" }} />
      {dancers.map((d, i) => (
        <div key={i} style={{ position: "absolute", left: d.x - 63, top: floor - 300 - d.depth * 8, transform: `scale(${1 + d.depth * 0.04})`,
          transformOrigin: "50% 100%", filter: `brightness(${1 - d.depth * 0.15})` }}>
          <Figure color="#1a1410" dress={d.dress} height={300} lean={Math.sin(angle * 2) * 3} />
        </div>
      ))}
      <div style={{ position: "absolute", left: fx - 24, top: fy - 80, transform: `rotate(${frot}deg)` }}><Feather size={160} /></div>
      <div style={{ position: "absolute", left: 1040, top: 150, width: 800 }}>
        <Beat from={groups[0].from + 10} to={groups[0].to} style={{ ...italic, fontSize: 50, marginBottom: 20 }}>The novel opens with the problem of a single life…</Beat>
        <Beat from={at("finale", "he leaves us")} to={groups[0].to} style={{ ...italic, fontSize: 50, marginBottom: 50 }}>…and ends with two people dancing in a room.</Beat>
        <Beat from={at("finale", "They could have")} to={groups[0].to} style={{ ...quote, fontSize: 60 }}>“They could have had other lives. But they are dancing.”</Beat>
      </div>
      <Beat from={groups[1].from} to={groups[1].to} style={{ position: "absolute", left: 1040, top: 300, width: 800, ...italic, fontSize: 60 }}>
        Happiness doesn't need to last forever to have been real.
      </Beat>
      <Beat from={groups[1].to} style={{ position: "absolute", left: 1040, top: 250, width: 820, ...quote, fontSize: 92, color: C.gold }}>
        “If you have someone to dance with, dance.”
      </Beat>
    </AbsoluteFill>
  );
};

// ---- 14 · outro -------------------------------------------------------------------------------------------

export const Outro: React.FC<{ music: string }> = ({ music }) => (
  <AbsoluteFill style={{ backgroundColor: C.bg, justifyContent: "center", alignItems: "center", textAlign: "center" }}>
    <Beat from={0} style={{ fontFamily: serif, fontStyle: "italic", fontSize: 76, color: C.paper }}>{META.name}</Beat>
    <Beat from={10} style={{ fontFamily: serif, fontSize: 44, color: C.gold, marginTop: 12 }}>{`${META.author} (${META.year})`}</Beat>
    <Beat from={30} style={{ fontFamily: sans, fontSize: 28, color: C.dim, marginTop: 70, lineHeight: 1.6 }}>
      Based on the analysis by <em style={{ fontFamily: serif }}>{META.source.channel}</em> ({META.source.host})
      <br />youtube.com/watch?v=p-OaSA0n3cY
    </Beat>
    <Beat from={50} style={{ fontFamily: sans, fontSize: 22, color: C.dim, marginTop: 40, maxWidth: 1300, lineHeight: 1.6 }}>
      {music} Made with Remotion.
    </Beat>
  </AbsoluteFill>
);
