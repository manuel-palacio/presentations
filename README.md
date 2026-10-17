# Joaquín Sorolla: The Painter of Light

An animated presentation about the Spanish painter Joaquín Sorolla (1863–1923), made with
[Remotion](https://www.remotion.dev/). Live at https://sorolla-painter-of-light.fly.dev/

- `src/slides.ts`: slide content and timing (shared by the video and the web page)
- `src/Presentation.tsx`: the Remotion composition (10 slides + credits, 1920×1080, 30 fps)
- `web/`: the page with the interactive Remotion Player, chapter buttons and MP4 download
- `public/img/`: paintings from Wikimedia Commons (public domain or CC0), credits in `credits.json`

```sh
npm install
npm run studio     # edit in Remotion Studio
npm run render     # out/sorolla.mp4
npm run still      # out/poster.jpg
npm run build      # dist/ (web page + MP4 + poster)
fly deploy --ha=false --remote-only
```
