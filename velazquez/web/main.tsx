import React, { useEffect, useRef, useState } from "react";
import { createRoot } from "react-dom/client";
import { Player, PlayerRef } from "@remotion/player";
import { Presentation } from "../src/Presentation";
import { FPS, META, MUSIC, SLIDES, TOTAL_FRAMES, slideStarts } from "../src/slides";
import credits from "../public/img/credits.json";
import "./style.css";

// staticFile() resolves to /img/..., /audio/... from the site root; serve them from this page's own folder
// instead, so the presentation works at the root or under a subpath (/sorolla/) of the shared site.
(window as unknown as { remotion_staticBase: string }).remotion_staticBase = new URL(".", window.location.href)
  .pathname.replace(/\/$/, "");

const STARTS = slideStarts();

const App: React.FC = () => {
  const player = useRef<PlayerRef>(null);
  const [frame, setFrame] = useState(0);

  useEffect(() => {
    const current = player.current;
    if (!current) return;
    const onFrame = (e: { detail: { frame: number } }) => setFrame(e.detail.frame);
    current.addEventListener("frameupdate", onFrame);
    return () => current.removeEventListener("frameupdate", onFrame);
  }, []);

  const active = STARTS.reduce((found, start, i) => (frame >= start ? i : found), 0);
  const seconds = Math.round(TOTAL_FRAMES / FPS);

  return (
    <main>
      <header>
        <div className="eyebrow">{META.places}</div>
        <h1>{META.name}</h1>
        <p className="subtitle">{META.tagline}: a {Math.floor(seconds / 60)} min {seconds % 60} s presentation</p>
      </header>
      <div className="player">
        <Player ref={player} component={Presentation} durationInFrames={TOTAL_FRAMES} fps={FPS}
          compositionWidth={1920} compositionHeight={1080} style={{ width: "100%" }}
          controls allowFullscreen clickToPlay doubleClickToFullscreen acknowledgeRemotionLicense />
      </div>
      <nav className="chapters" aria-label="Chapters">
        {SLIDES.map((slide, i) => (
          <button key={slide.id} className={i === active ? "active" : ""}
            onClick={() => { player.current?.seekTo(STARTS[i] + 1); player.current?.play(); }}>
            {slide.chapter}
          </button>
        ))}
      </nav>
      <div className="actions">
        <a href={META.wikipedia} target="_blank" rel="noreferrer">Read more on Wikipedia</a>
      </div>
      <section>
        <h2>Music</h2>
        <p className="credits-line">
          <a href={MUSIC.page} target="_blank" rel="noreferrer">{MUSIC.title}</a> by {MUSIC.composer}, {MUSIC.arrangement},
          performed by {MUSIC.performer} · {MUSIC.license}
        </p>
        <h2>Image credits</h2>
        <ul className="credits">
          {Object.values(credits).map((c) => (
            <li key={c.page}><a href={c.page} target="_blank" rel="noreferrer">{c.title.replace(/\.(jpe?g|png)$/i, "")}</a> · {c.license}</li>
          ))}
        </ul>
      </section>
      <footer>Made with Remotion. Paintings by {META.name} via Wikimedia Commons.</footer>
    </main>
  );
};

createRoot(document.getElementById("root")!).render(<App />);
