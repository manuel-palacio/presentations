import React, { createContext, useContext } from "react";
import {
  AbsoluteFill, Audio, Easing, Img, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig,
} from "remotion";
import { TransitionSeries, linearTiming } from "@remotion/transitions";
import { fade } from "@remotion/transitions/fade";
import { loadFont as loadSerif } from "@remotion/google-fonts/CormorantGaramond";
import { loadFont as loadSans } from "@remotion/google-fonts/Inter";
import credits from "../public/img/credits.json";
import { FPS, Lang, META, MUSIC, Painting, SLIDES, Slide, TOTAL_FRAMES, TRANSITION, Text, UI, slideFrames, tr } from "./slides";

const { fontFamily: serif } = loadSerif("normal", { weights: ["500", "600"], subsets: ["latin", "latin-ext"] });
const { fontFamily: sans } = loadSans("normal", { weights: ["400", "500"], subsets: ["latin", "latin-ext"] });

// Palette taken from the paintings: Baroque black, umber, the Pope's crimson, canvas.
const C = { ink: "#1b1511", sea: "#7a5234", sand: "#e4d7c3", paper: "#f3ede3", sun: "#a8322d", muted: "#6b5e52" };

export type PresentationProps = { lang: Lang };

const LangContext = createContext<Lang>("en");
/** Translates a text into the composition's language. */
const useTr = () => {
  const lang = useContext(LangContext);
  return (text: Text) => tr(text, lang);
};

/** Rises and fades in, `delay` frames after the slide starts. */
const useEnter = (delay = 0) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const progress = spring({ frame: frame - delay, fps, config: { damping: 200 } });
  return { opacity: progress, transform: `translateY(${interpolate(progress, [0, 1], [28, 0])}px)` };
};

/** Slow zoom and pan across the slide's duration (the "Ken Burns" effect). */
const KenBurns: React.FC<{ src: string; from?: number; to?: number; fit?: "cover" | "contain"; focus?: string }> = ({
  src, from = 1, to = 1.08, fit = "cover", focus = "50% 50%",
}) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const scale = interpolate(frame, [0, durationInFrames], [from, to], { easing: Easing.inOut(Easing.ease) });
  return (
    <Img src={staticFile(src)} style={{ width: "100%", height: "100%", objectFit: fit, objectPosition: focus, transformOrigin: focus,
      transform: `scale(${scale})` }} />
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

const Caption: React.FC<{ painting: Painting; delay?: number }> = ({ painting, delay = 0 }) => {
  const t = useTr();
  return (
  <div style={{ ...useEnter(delay), fontFamily: sans, fontSize: 24, color: C.muted, marginTop: 16, textAlign: "center" }}>
    <span style={{ fontFamily: serif, fontStyle: "italic", fontSize: 30, color: C.ink }}>{t(painting.title)}</span>
    {t(painting.year) ? <span>{"  ·  "}<span style={{ whiteSpace: "nowrap" }}>{t(painting.year)}</span></span> : null}
  </div>
  );
};

/** A painting in a white frame that hugs it, with a slow zoom inside the frame. */
const Framed: React.FC<{ painting: Painting; maxWidth: number; maxHeight: number; delay?: number }> = ({
  painting, maxWidth, maxHeight, delay = 0,
}) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const scale = interpolate(frame, [0, durationInFrames], [1, 1.06], { easing: Easing.inOut(Easing.ease) });
  return (
    <div style={{ ...useEnter(delay), display: "flex", flexDirection: "column", alignItems: "center" }}>
      <div style={{ overflow: "hidden", boxShadow: "0 30px 60px rgba(27,21,17,0.4)", border: `10px solid ${C.paper}` }}>
        <Img src={staticFile(painting.src)}
          style={{ display: "block", maxWidth, maxHeight, width: "auto", height: "auto", transform: `scale(${scale})` }} />
      </div>
      <Caption painting={painting} delay={delay + 10} />
    </div>
  );
};

const TitleSlide: React.FC<Extract<Slide, { kind: "title" }>> = ({ image, heading, subheading, dates }) => {
  const t = useTr();
  const frame = useCurrentFrame();
  const line = interpolate(frame, [20, 60], [0, 360], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <AbsoluteFill style={{ backgroundColor: C.ink }}>
      <AbsoluteFill><KenBurns src={image} from={1.12} to={1.0} /></AbsoluteFill>
      <AbsoluteFill style={{ background: "linear-gradient(90deg, rgba(27,21,17,0.88) 0%, rgba(27,21,17,0.45) 55%, rgba(27,21,17,0.1) 100%)" }} />
      <AbsoluteFill style={{ justifyContent: "center", padding: "0 140px" }}>
        <Eyebrow light>{t(dates)}</Eyebrow>
        <Heading light size={150} delay={8}>{t(heading)}</Heading>
        <div style={{ height: 4, width: line, backgroundColor: C.sun, margin: "28px 0" }} />
        <div style={{ ...useEnter(22), fontFamily: serif, fontStyle: "italic", fontSize: 64, color: C.sand }}>{t(subheading)}</div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

const SplitSlide: React.FC<Extract<Slide, { kind: "split" }>> = ({ painting, eyebrow, heading, points, side = "left" }) => {
  const t = useTr();
  const lang = useContext(LangContext);
  return (
  <AbsoluteFill style={{ backgroundColor: C.paper, flexDirection: side === "left" ? "row" : "row-reverse",
    alignItems: "center", padding: "0 110px", gap: 100 }}>
    <div style={{ flex: "0 0 auto" }}><Framed painting={painting} maxWidth={860} maxHeight={760} /></div>
    <div style={{ flex: 1, minWidth: 0 }}>
      <Eyebrow delay={4}>{t(eyebrow)}</Eyebrow>
      <Heading delay={10}>{t(heading)}</Heading>
      <div style={{ marginTop: 44 }}>
        {points[lang].map((point, i) => (
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
};

const GallerySlide: React.FC<Extract<Slide, { kind: "gallery" }>> = ({ eyebrow, heading, paintings }) => {
  const t = useTr();
  return (
  <AbsoluteFill style={{ backgroundColor: C.sand, padding: "80px 110px", alignItems: "center" }}>
    <div style={{ textAlign: "center" }}>
      <Eyebrow>{t(eyebrow)}</Eyebrow>
      <Heading delay={8} size={80}>{t(heading)}</Heading>
    </div>
    <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 70, marginTop: 30 }}>
      {paintings.map((painting, i) => (
        <Framed key={painting.src} painting={painting} delay={24 + i * 18}
          maxWidth={paintings.length > 2 ? 520 : 760} maxHeight={paintings.length > 2 ? 560 : 640} />
      ))}
    </div>
  </AbsoluteFill>
  );
};

const QuoteSlide: React.FC<Extract<Slide, { kind: "quote" }>> = ({ image, quote, caption, focus }) => {
  const t = useTr();
  const lang = useContext(LangContext);
  return (
    <AbsoluteFill style={{ backgroundColor: C.ink }}>
      <AbsoluteFill><KenBurns src={image} from={1.0} to={1.1} focus={focus} /></AbsoluteFill>
      <AbsoluteFill style={{ background: "linear-gradient(0deg, rgba(27,21,17,0.9) 0%, rgba(27,21,17,0) 55%)" }} />
      <AbsoluteFill style={{ justifyContent: "flex-end", padding: "0 140px 110px" }}>
        <Heading light size={84} delay={12}>{lang === "es" ? `«${t(quote)}»` : `“${t(quote)}”`}</Heading>
        <div style={{ ...useEnter(30), fontFamily: sans, fontSize: 28, color: C.sand, marginTop: 24 }}>{t(caption)}</div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

const CreditsSlide: React.FC = () => {
  const lang = useContext(LangContext);
  return (
    <AbsoluteFill style={{ backgroundColor: C.ink, justifyContent: "center", alignItems: "center", textAlign: "center" }}>
      <Heading light size={96} delay={0}>{META.name}</Heading>
      <div style={{ ...useEnter(12), fontFamily: serif, fontStyle: "italic", fontSize: 48, color: "#d4a373", marginTop: 10 }}>
        {META.years}
      </div>
      <div style={{ ...useEnter(28), fontFamily: sans, fontSize: 24, color: C.sand, marginTop: 60, maxWidth: 1300, lineHeight: 1.6 }}>
        {UI[lang].imagesCredit(Object.keys(credits).length)}
      </div>
      <div style={{ ...useEnter(40), fontFamily: sans, fontSize: 24, color: C.sand, marginTop: 14, maxWidth: 1100, lineHeight: 1.6 }}>
        {UI[lang].musicCredit(lang)}
      </div>
    </AbsoluteFill>
  );
};

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

/** The whole presentation in one language (`lang` prop); timing is the same in every language. */
export const Presentation: React.FC<PresentationProps> = ({ lang = "en" }) => (
  <LangContext.Provider value={lang}>
    <AbsoluteFill>
      <Audio src={staticFile(MUSIC.src)} volume={musicVolume} />
      <Slides />
    </AbsoluteFill>
  </LangContext.Provider>
);

const Slides: React.FC = () => (
  <TransitionSeries>
    {SLIDES.flatMap((slide, i) => [
      ...(i > 0 ? [<TransitionSeries.Transition key={`${slide.id}-in`} presentation={fade()} timing={linearTiming({ durationInFrames: TRANSITION })} />] : []),
      <TransitionSeries.Sequence key={slide.id} durationInFrames={slideFrames(slide)}>{renderSlide(slide)}</TransitionSeries.Sequence>,
    ])}
  </TransitionSeries>
);
