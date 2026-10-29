# Diego Velázquez: The Painter of Painters

An animated presentation about the Spanish painter Diego Velázquez (1599–1660), made with
[Remotion](https://www.remotion.dev/). Live at https://palace-presentations.fly.dev/velazquez/

- `src/slides.ts`: name, slide content, timing and music (shared by the video and the web page)
- `src/Presentation.tsx`: the Remotion composition (10 slides + credits, 1920×1080, 30 fps)
- `web/`: the page with the interactive Remotion Playerand chapter buttons (the MP4 is rendered to out/ but not published)
- `public/img/`: paintings from Wikimedia Commons (public domain), credits in `credits.json`
- `public/audio/`: Victoria, *O vos omnes*, sung by The Tudor Consort (CC BY 2.5)

```sh
npm install
npm run studio     # edit in Remotion Studio
npm run render     # out/presentation.mp4
npm run still      # out/poster.jpg
npm run build      # dist/ (web page + MP4 + poster)
cd .. && ./build-site.sh && fly deploy --ha=false --remote-only   # the shared site, see ../README.md
```
