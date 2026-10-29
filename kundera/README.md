# The Unbearable Lightness of Being

An animated presentation about Milan Kundera's novel *The Unbearable Lightness of Being* (1984), made with
[Remotion](https://www.remotion.dev/). Live at https://palace-presentations.fly.dev/kundera/

- `SOURCE.md`: the presentation script (scenes, on-screen text, narration, visual direction), the authority on content
- `src/slides.ts`: scenes, narration, timing and music (shared by the video and the web page); the narration is
  shown as subtitles, split into phrases and timed by word count
- `src/scenes.tsx`, `src/art.tsx`, `src/ui.tsx`: the 14 scenes, the drawings (feather, stone, map, dog…) and
  shared pieces (subtitles, film grain, vignette); everything is drawn in code, no images
- `src/Presentation.tsx`: the Remotion composition (1920×1080, 30 fps, 6 min 50 s)
- `web/`: the page with the interactive Remotion Player and chapter buttons
- `public/audio/`: Satie, *Gymnopédie No. 1*, played by Robin Alciatore (Musopen, public domain), chained three times

```sh
npm install
npm run studio     # edit in Remotion Studio
npm run render     # out/presentation.mp4 (not published)
npm run still      # out/poster.jpg
npm run build      # dist/ (web page + poster)
cd .. && ./build-site.sh && fly deploy --ha=false --remote-only   # the shared site, see ../README.md
```
