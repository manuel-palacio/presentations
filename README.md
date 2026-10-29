# Presentations

Animated presentations made with [Remotion](https://www.remotion.dev/), one per folder. Each folder is
a self-contained Remotion project (its own `package.json`, composition and web player page). All of them
are served by **one** static site: a home page at `/` (`home/index.html`) and each presentation at
`/<folder>/`. A presentation's web page loads its images and music relative to its own folder, so it also
works on its own at a site root.

Every presentation and the home page are in **English and Spanish**. Each project's composition takes an input prop
`lang` (`"en"` | `"es"`) and draws all its text from per-language content in its slides file (`src/slides.ts`; kundera
also `src/text.ts` for the words inside its scenes); timing is shared, so chapters and music line up in both. The pages
have an `EN | ES` switch; the first language comes from `?lang=`, else the saved choice (localStorage
`presentations.lang`, shared by all pages), else the browser. `npm run still` renders `out/poster.jpg` and
`out/poster-es.jpg`; the home page shows the poster of the current language.

| Folder | Subject | Path |
|---|---|---|
| [`sorolla/`](sorolla/) | Joaquín Sorolla, the painter of light (1863–1923) | `/sorolla/` |
| [`velazquez/`](velazquez/) | Diego Velázquez, the painter of painters (1599–1660) | `/velazquez/` |
| [`kundera/`](kundera/) | Milan Kundera, *The Unbearable Lightness of Being* (1984) | `/kundera/` |

## Deploying

Live at https://palace-presentations.fly.dev/ (Fly.io app `palace-presentations`, the only one; the old
per-presentation apps were deleted on 2026-10-29). `./build-site.sh` builds every presentation and
assembles `_site/`; the root `Dockerfile` serves it with
nginx (`nginx.conf`). Then `fly deploy --ha=false --remote-only` from the repo root.

## Link previews

Shared links preview in the link's language: `share_meta.py` (run by `build-site.sh`) writes each page as
`index.html` (English) and `index.es.html` (Spanish) with its own title, description and poster from `share.json`, and
nginx serves the Spanish one for `?lang=es`. So `https://palace-presentations.fly.dev/kundera/?lang=es` previews in Spanish.

## Adding a presentation

1. Create a new folder next to the others (copying `velazquez/` is the quickest start: its name, dates and
   links live in `META` in `src/slides.ts`, so nothing else is hardcoded).
2. Edit its `src/slides.ts` (every text in English **and** Spanish) and assets in `public/`.
3. In the folder: `npm install && npm run render && npm run still`.
4. Add a card for it to `home/index.html` (the link is the folder name; texts in `data-en`/`data-es`) and a row to the
   table above.
5. Add its link-preview title and description in English and Spanish to `share.json`.
6. `./build-site.sh && fly deploy --ha=false --remote-only` from the repo root.
