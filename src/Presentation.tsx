import React from "react";
import {
  AbsoluteFill, Audio, Easing, Img, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig,
} from "remotion";
import { TransitionSeries, linearTiming } from "@remotion/transitions";
import { fade } from "@remotion/transitions/fade";
import { loadFont as loadSerif } from "@remotion/google-fonts/CormorantGaramond";
import { loadFont as loadSans } from "@remotion/google-fonts/Inter";
import credits from "../public/img/credits.json";
import { FPS, MUSIC, Painting, SLIDES, Slide, TOTAL_FRAMES, TRANSITION, slideFrames } from "./slides";

const { fontFamily: serif } = loadSerif("normal", { weights: ["500", "600"], subsets: ["latin", "latin-ext"] });
const { fontFamily: sans } = loadSans("normal", { weights: ["400", "500"], subsets: ["latin", "latin-ext"] });

// Palette taken from the paintings: Mediterranean blue, sand, sunlit white.
const C = { ink: "#14202b", sea: "#1f5a7a", sand: "#e9dcc4", paper: "#f7f2e8", sun: "#e8a33d", muted: "#5d6b75" };

/** Rises and fades in, `delay` frames after the slide starts. */
const useEnter = (delay = 0) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const progress = spring({ frame: frame - delay, fps, config: { damping: 200 } });
  return { opacity: progress, transform: `translateY(${interpolate(progress, [0, 1], [28, 0])}px)` };
};

/** Slow zoom and pan across the slide's duration (the "Ken Burns" effect). */
const KenBurns: React.FC<{ src: string; from?: number; to?: number; fit?: "cover" | "contain" }> = ({
  src, from = 1, to = 1.08, fit = "cover",
}) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const scale = interpolate(frame, [0, durationInFrames], [from, to], { easing: Easing.inOut(Easing.ease) });
  return (
    <Img src={staticFile(src)} style={{ width: "100%", height: "100%", objectFit: fit, transform: `scale(${scale})` }} />
  );
};

const Eyebrow: React.FC<{ children: React.ReactNode; delay?: number; light?: boolean }> = ({ children, delay = 0, light }) => (
  <div style={{ ...useEnter(delay), fontFamily: sans, fontSize: 26, letterSpacing: 6, textTransform: "uppercase",
    color: light ? C.sand : C.sea, fontWeight: 500 }}>
    {children}
  </div>
);

const Heading: React.FC<{ children: React.ReactNode; delay?: number; size?: number; light?: boolean }> = ({
  children, delay = 6, size = 92, light,
}) => (
  <div style={{ ...useEnter(delay), fontFamily: serif, fontSize: size, lineHeight: 1.02, fontWeight: 600,
    color: light ? C.paper : C.ink, marginTop: 14 }}>
    {children}
  </div>
);

const Caption: React.FC<{ painting: Painting; delay?: number }> = ({ painting, delay = 0 }) => (
  <div style={{ ...useEnter(delay), fontFamily: sans, fontSize: 24, color: C.muted, marginTop: 16 }}>
    <span style={{ fontFamily: serif, fontStyle: "italic", fontSize: 30, color: C.ink }}>{painting.title}</span>
    {painting.year ? <span>{`  ·  ${painting.year}`}</span> : null}
  </div>
);

/** A painting in a white frame that hugs it, with a slow zoom inside the frame. */
const Framed: React.FC<{ painting: Painting; maxWidth: number; maxHeight: number; delay?: number }> = ({
  painting, maxWidth, maxHeight, delay = 0,
}) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const scale = interpolate(frame, [0, durationInFrames], [1, 1.06], { easing: Easing.inOut(Easing.ease) });
  return (
    <div style={{ ...useEnter(delay), display: "flex", flexDirection: "column", alignItems: "center" }}>
      <div style={{ overflow: "hidden", boxShadow: "0 30px 60px rgba(20,32,43,0.35)", border: `10px solid ${C.paper}` }}>
        <Img src={staticFile(painting.src)}
          style={{ display: "block", maxWidth, maxHeight, width: "auto", height: "auto", transform: `scale(${scale})` }} />
      </div>
      <Caption painting={painting} delay={delay + 10} />
    </div>
  );
};

const TitleSlide: React.FC<Extract<Slide, { kind: "title" }>> = ({ image, heading, subheading, dates }) => {
  const frame = useCurrentFrame();
  const line = interpolate(frame, [20, 60], [0, 360], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <AbsoluteFill style={{ backgroundColor: C.ink }}>
      <AbsoluteFill><KenBurns src={image} from={1.12} to={1.0} /></AbsoluteFill>
      <AbsoluteFill style={{ background: "linear-gradient(90deg, rgba(20,32,43,0.85) 0%, rgba(20,32,43,0.35) 55%, rgba(20,32,43,0) 100%)" }} />
      <AbsoluteFill style={{ justifyContent: "center", padding: "0 140px" }}>
        <Eyebrow light>{dates}</Eyebrow>
        <Heading light size={150} delay={8}>{heading}</Heading>
        <div style={{ height: 4, width: line, backgroundColor: C.sun, margin: "28px 0" }} />
        <div style={{ ...useEnter(22), fontFamily: serif, fontStyle: "italic", fontSize: 64, color: C.sand }}>{subheading}</div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

const SplitSlide: React.FC<Extract<Slide, { kind: "split" }>> = ({ painting, eyebrow, heading, points, side = "left" }) => (
  <AbsoluteFill style={{ backgroundColor: C.paper, flexDirection: side === "left" ? "row" : "row-reverse",
    alignItems: "center", padding: "0 110px", gap: 100 }}>
    <div style={{ flex: "0 0 auto" }}><Framed painting={painting} maxWidth={860} maxHeight={760} /></div>
    <div style={{ flex: 1, minWidth: 0 }}>
      <Eyebrow delay={4}>{eyebrow}</Eyebrow>
      <Heading delay={10}>{heading}</Heading>
      <div style={{ marginTop: 44 }}>
        {points.map((point, i) => (
          <div key={point} style={{ ...useEnter(30 + i * 22), display: "flex", gap: 22, marginBottom: 26,
            fontFamily: sans, fontSize: 36, lineHeight: 1.35, color: C.ink }}>
            <div style={{ flex: "0 0 12px", height: 12, marginTop: 18, borderRadius: 6, backgroundColor: C.sun }} />
            <div>{point}</div>
          </div>
        ))}
      </div>
    </div>
  </AbsoluteFill>
);

const GallerySlide: React.FC<Extract<Slide, { kind: "gallery" }>> = ({ eyebrow, heading, paintings }) => (
  <AbsoluteFill style={{ backgroundColor: C.sand, padding: "80px 110px", alignItems: "center" }}>
    <div style={{ textAlign: "center" }}>
      <Eyebrow>{eyebrow}</Eyebrow>
      <Heading delay={8} size={80}>{heading}</Heading>
    </div>
    <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 70, marginTop: 30 }}>
      {paintings.map((painting, i) => (
        <Framed key={painting.src} painting={painting} delay={24 + i * 18}
          maxWidth={paintings.length > 2 ? 520 : 760} maxHeight={paintings.length > 2 ? 560 : 640} />
      ))}
    </div>
  </AbsoluteFill>
);

const QuoteSlide: React.FC<Extract<Slide, { kind: "quote" }>> = ({ image, quote, caption }) => (
  <AbsoluteFill style={{ backgroundColor: C.ink }}>
    <AbsoluteFill><KenBurns src={image} from={1.0} to={1.15} /></AbsoluteFill>
    <AbsoluteFill style={{ background: "linear-gradient(0deg, rgba(20,32,43,0.85) 0%, rgba(20,32,43,0) 55%)" }} />
    <AbsoluteFill style={{ justifyContent: "flex-end", padding: "0 140px 110px" }}>
      <Heading light size={84} delay={12}>{`“${quote}”`}</Heading>
      <div style={{ ...useEnter(30), fontFamily: sans, fontSize: 28, color: C.sand, marginTop: 24 }}>{caption}</div>
    </AbsoluteFill>
  </AbsoluteFill>
);

const CreditsSlide: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: C.ink, justifyContent: "center", alignItems: "center", textAlign: "center" }}>
    <Heading light size={96} delay={0}>Joaquín Sorolla</Heading>
    <div style={{ ...useEnter(12), fontFamily: serif, fontStyle: "italic", fontSize: 48, color: C.sun, marginTop: 10 }}>
      1863 – 1923
    </div>
    <div style={{ ...useEnter(28), fontFamily: sans, fontSize: 24, color: C.sand, marginTop: 60, maxWidth: 1300, lineHeight: 1.6 }}>
      {`All ${Object.keys(credits).length} images: Wikimedia Commons, public domain or CC0. Made with Remotion.`}
    </div>
    <div style={{ ...useEnter(40), fontFamily: sans, fontSize: 24, color: C.sand, marginTop: 14, maxWidth: 1100, lineHeight: 1.6 }}>
      {`Music: ${MUSIC.title} by ${MUSIC.composer}, ${MUSIC.arrangement}, performed by ${MUSIC.performer} (public domain).`}
    </div>
  </AbsoluteFill>
);

const renderSlide = (slide: Slide) => {
  switch (slide.kind) {
    case "title": return <TitleSlide {...slide} />;
    case "split": return <SplitSlide {...slide} />;
    case "gallery": return <GallerySlide {...slide} />;
    case "quote": return <QuoteSlide {...slide} />;
    case "credits": return <CreditsSlide />;
  }
};

/** Fade the music in over half a second and out over the last three seconds. */
const musicVolume = (frame: number) =>
  interpolate(frame, [0, FPS / 2, TOTAL_FRAMES - 3 * FPS, TOTAL_FRAMES], [0, 0.8, 0.8, 0], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
  });

export const Presentation: React.FC = () => (
  <AbsoluteFill>
    <Audio src={staticFile(MUSIC.src)} volume={musicVolume} />
    <Slides />
  </AbsoluteFill>
);

const Slides: React.FC = () => (
  <TransitionSeries>
    {SLIDES.flatMap((slide, i) => [
      ...(i > 0 ? [<TransitionSeries.Transition key={`${slide.id}-in`} presentation={fade()} timing={linearTiming({ durationInFrames: TRANSITION })} />] : []),
      <TransitionSeries.Sequence key={slide.id} durationInFrames={slideFrames(slide)}>{renderSlide(slide)}</TransitionSeries.Sequence>,
    ])}
  </TransitionSeries>
);
