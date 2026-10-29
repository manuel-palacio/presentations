import React, { useEffect, useMemo, useRef, useState } from "react";
import { createRoot } from "react-dom/client";
import { Player, PlayerRef } from "@remotion/player";
import { Presentation } from "../src/Presentation";
import { FPS, Lang, META, MUSIC, SLIDES, TOTAL_FRAMES, UI, slideStarts, tr } from "../src/slides";
import credits from "../public/img/credits.json";
import { LangSwitch, chooseLang, initialLang, showLang } from "./lang";
import "./style.css";

// staticFile() resolves to /img/..., /audio/... from the site root; serve them from this page's own folder
// instead, so the presentation works at the root or under a subpath (/sorolla/) of the shared site.
(window as unknown as { remotion_staticBase: string }).remotion_staticBase = new URL(".", window.location.href)
  .pathname.replace(/\/$/, "");

const STARTS = slideStarts();

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

  useEffect(() => showLang(lang, `${META.name} · ${t(META.tagline)}`), [lang]);

  const switchTo = (next: Lang) => {
    chooseLang(next);
    setLang(next);
  };

  const active = STARTS.reduce((found, start, i) => (frame >= start ? i : found), 0);
  const seconds = Math.round(TOTAL_FRAMES / FPS);

  return (
    <main>
      <header>
        <LangSwitch lang={lang} onChange={switchTo} />
        <div className="eyebrow">{t(META.places)}</div>
        <h1>{META.name}</h1>
        <p className="subtitle">{t(META.tagline)}: {ui.duration(Math.floor(seconds / 60), seconds % 60)}</p>
      </header>
      <div className="player">
        <Player ref={player} component={Presentation} inputProps={inputProps} durationInFrames={TOTAL_FRAMES} fps={FPS}
          compositionWidth={1920} compositionHeight={1080} style={{ width: "100%" }}
          controls allowFullscreen clickToPlay doubleClickToFullscreen acknowledgeRemotionLicense />
      </div>
      <nav className="chapters" aria-label={ui.chapters}>
        {SLIDES.map((slide, i) => (
          <button key={slide.id} className={i === active ? "active" : ""}
            onClick={() => { player.current?.seekTo(STARTS[i] + 1); player.current?.play(); }}>
            {t(slide.chapter)}
          </button>
        ))}
      </nav>
      <div className="actions">
        <a href={t(META.wikipedia)} hrefLang={lang} target="_blank" rel="noreferrer">{ui.wikipedia}</a>
      </div>
      <section>
        <h2>{ui.music}</h2>
        <p className="credits-line">
          <a href={MUSIC.page} target="_blank" rel="noreferrer">{t(MUSIC.title)}</a> {ui.by} {MUSIC.composer}, {t(MUSIC.arrangement)},{" "}
          {ui.performedBy} {t(MUSIC.performer)} · {t(MUSIC.license)}
        </p>
        <h2>{ui.imageCredits}</h2>
        <ul className="credits">
          {Object.values(credits).map((c) => (
            <li key={c.page}><a href={c.page} target="_blank" rel="noreferrer">{c.title.replace(/\.(jpe?g|png)$/i, "")}</a> · {ui.license(c.license)}</li>
          ))}
        </ul>
      </section>
      <footer>{t(META.footer)}</footer>
    </main>
  );
};

createRoot(document.getElementById("root")!).render(<App />);
