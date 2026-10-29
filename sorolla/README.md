# Joaquín Sorolla: The Painter of Light

An animated presentation about the Spanish painter Joaquín Sorolla (1863–1923), made with
[Remotion](https://www.remotion.dev/). Live at https://palace-presentations.fly.dev/sorolla/

- `src/slides.ts`: slide content in English and Spanish, timing and music (shared by the video and the web page);
  the composition takes `lang` (`"en"` | `"es"`), e.g. `npx remotion still src/index.ts Sorolla x.jpg --props='{"lang":"es"}'`
- `src/Presentation.tsx`: the Remotion composition (10 slides + credits, 1920×1080, 30 fps)
- `web/`: the page with the interactive Remotion Player, chapter buttons and the EN | ES switch (the MP4 is rendered to out/ but not published)
- `public/img/`: paintings from Wikimedia Commons (public domain or CC0), credits in `credits.json`

```sh
npm install
npm run studio     # edit in Remotion Studio
npm run render     # out/sorolla.mp4
npm run still      # out/poster.jpg and out/poster-es.jpg
npm run build      # dist/ (web page + both posters; no MP4)
cd .. && ./build-site.sh && fly deploy --ha=false --remote-only   # the shared site, see ../README.md
```
