import React, { useEffect, useRef, useState } from "react";
import { createRoot } from "react-dom/client";
import { Player, PlayerRef } from "@remotion/player";
import { Presentation } from "../src/Presentation";
import { FPS, META, MUSIC, SCENES, TOTAL_FRAMES, sceneStarts } from "../src/slides";
import "./style.css";

// staticFile() resolves to /audio/... from the site root; serve it from this page's own folder
// instead, so the presentation works at the root or under a subpath (/kundera/) of the shared site.
(window as unknown as { remotion_staticBase: string }).remotion_staticBase = new URL(".", window.location.href)
  .pathname.replace(/\/$/, "");

const STARTS = sceneStarts();

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
        <div className="eyebrow">{META.eyebrow}</div>
        <h1>{META.name}</h1>
        <p className="subtitle">{META.tagline}: a {Math.floor(seconds / 60)} min {seconds % 60} s presentation</p>
      </header>
      <div className="player">
        <Player ref={player} component={Presentation} durationInFrames={TOTAL_FRAMES} fps={FPS}
          compositionWidth={1920} compositionHeight={1080} style={{ width: "100%" }}
          controls allowFullscreen clickToPlay doubleClickToFullscreen acknowledgeRemotionLicense />
      </div>
      <nav className="chapters" aria-label="Chapters">
        {SCENES.map((scene, i) => (
          <button key={scene.id} className={i === active ? "active" : ""}
            onClick={() => { player.current?.seekTo(STARTS[i] + 1); player.current?.play(); }}>
            {scene.chapter}
          </button>
        ))}
      </nav>
      <div className="actions">
        <a href={META.wikipedia} target="_blank" rel="noreferrer">Read more on Wikipedia</a>
        <a href={META.source.url} target="_blank" rel="noreferrer">Watch the original analysis</a>
      </div>
      <section>
        <h2>Source</h2>
        <p className="credits-line">
          Based on the analysis <a href={META.source.url} target="_blank" rel="noreferrer">{META.source.title}</a> by{" "}
          <em>{META.source.channel}</em> ({META.source.host}). There is no voiceover: the narration runs as subtitles.
        </p>
        <h2>Music</h2>
        <p className="credits-line">
          <a href={MUSIC.page} target="_blank" rel="noreferrer">{MUSIC.title}</a> by {MUSIC.composer}, {MUSIC.arrangement},
          performed by {MUSIC.performer} · {MUSIC.license}
        </p>
      </section>
      <footer>Made with Remotion. All illustrations are drawn in code; no film stills or photographs.</footer>
    </main>
  );
};

createRoot(document.getElementById("root")!).render(<App />);
