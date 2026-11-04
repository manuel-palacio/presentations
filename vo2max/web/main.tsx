import React, { useEffect, useMemo, useRef, useState } from "react";
import { createRoot } from "react-dom/client";
import { Player, PlayerRef } from "@remotion/player";
import { Presentation } from "../src/Presentation";
import { FPS, Lang, META, MUSIC, SCENES, TOTAL_FRAMES, UI, sceneStarts, tr } from "../src/slides";
import { HomeLink, LangSwitch, chooseLang, initialLang, showLang } from "./lang";
import "./style.css";

// staticFile() resolves to /audio/... from the site root; serve it from this page's own folder
// instead, so the presentation works at the root or under a subpath (/vo2max/) of the shared site.
(window as unknown as { remotion_staticBase: string }).remotion_staticBase = new URL(".", window.location.href)
  .pathname.replace(/\/$/, "");

const STARTS = sceneStarts();

/** "₂" as a small lowered digit: the display font has no subscript glyphs. */
const Sub: React.FC<{ text: string }> = ({ text }) => (
  <>{text.split("₂").map((part, i) => <React.Fragment key={i}>{i ? <sub>2</sub> : null}{part}</React.Fragment>)}</>
);

const App: React.FC = () => {
  const player = useRef<PlayerRef>(null);
  const [frame, setFrame] = useState(0);
  const [lang, setLang] = useState<Lang>(initialLang);
  const t = (text: Parameters<typeof tr>[0]) => tr(text, lang);
  const ui = UI[lang];
  const inputProps = useMemo(() => ({ lang }), [lang]);

  useEffect(() => {
    const current = player.current;
    if (!current) return;
    const onFrame = (e: { detail: { frame: number } }) => setFrame(e.detail.frame);
    current.addEventListener("frameupdate", onFrame);
    return () => current.removeEventListener("frameupdate", onFrame);
  }, []);

  useEffect(() => showLang(lang, `${t(META.name)} · ${META.source.publisher}`), [lang]);

  const switchTo = (next: Lang) => {
    chooseLang(next);
    setLang(next);
  };

  const active = STARTS.reduce((found, start, i) => (frame >= start ? i : found), 0);

  return (
    <main>
      <header>
        <LangSwitch lang={lang} onChange={switchTo} />
        <HomeLink lang={lang} />
        <div className="eyebrow">{t(META.eyebrow)}</div>
        <h1><Sub text={t(META.name)} /></h1>
        <p className="subtitle">{t(META.tagline)}</p>
      </header>
      <div className="player">
        <Player ref={player} component={Presentation} inputProps={inputProps} durationInFrames={TOTAL_FRAMES} fps={FPS}
          compositionWidth={1920} compositionHeight={1080} style={{ width: "100%" }}
          controls allowFullscreen clickToPlay doubleClickToFullscreen acknowledgeRemotionLicense />
      </div>
      <nav className="chapters" aria-label={ui.chapters}>
        {SCENES.map((scene, i) => (
          <button key={scene.id} className={i === active ? "active" : ""}
            onClick={() => { player.current?.seekTo(STARTS[i] + 1); player.current?.play(); }}>
            {t(scene.chapter)}
          </button>
        ))}
      </nav>
      <div className="actions">
        <a href={META.source.url} hrefLang="en" target="_blank" rel="noreferrer">{ui.readArticle}</a>
      </div>
      <section>
        <h2>{ui.source}</h2>
        <p className="credits-line">
          {ui.sourcePrefix} <a href={META.source.url} hrefLang="en" target="_blank" rel="noreferrer">{META.source.title}</a> {ui.by}{" "}
          {META.source.authors} (<em>{META.source.publisher}</em>, {META.source.date}). {ui.studies} {META.studies.join("; ")}.
        </p>
        <p className="credits-line">{ui.example} {ui.medical} {ui.noVoice}</p>
        <h2>{ui.music}</h2>
        {MUSIC.map((m) => (
          <p className="credits-line" key={m.src}>
            <a href={m.page} target="_blank" rel="noreferrer">{m.title}</a> {ui.by} {m.composer} · {ui.licensed} {m.license}
          </p>
        ))}
      </section>
      <footer>{ui.footer}</footer>
    </main>
  );
};

createRoot(document.getElementById("root")!).render(<App />);
