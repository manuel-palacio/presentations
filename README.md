# Presentations

Animated presentations made with [Remotion](https://www.remotion.dev/), one per folder. Each folder is
a self-contained Remotion project (its own `package.json`, composition and web player page). All of them
are served by **one** static site: a home page at `/` (`home/index.html`) and each presentation at
`/<folder>/`. A presentation's web page loads its images and music relative to its own folder, so it also
works on its own at a site root.

| Folder | Subject | Path |
|---|---|---|
| [`sorolla/`](sorolla/) | Joaquín Sorolla, the painter of light (1863–1923) | `/sorolla/` |
| [`velazquez/`](velazquez/) | Diego Velázquez, the painter of painters (1599–1660) | `/velazquez/` |

## Deploying

Live at https://palace-presentations.fly.dev/ (Fly.io app `palace-presentations`, the only one; the old
per-presentation apps were deleted on 2026-10-29). `./build-site.sh` builds every presentation and
assembles `_site/`; the root `Dockerfile` serves it with
nginx (`nginx.conf`). Then `fly deploy --ha=false --remote-only` from the repo root.

## Adding a presentation

1. Create a new folder next to the others (copying `velazquez/` is the quickest start: its name, dates and
   links live in `META` in `src/slides.ts`, so nothing else is hardcoded).
2. Edit its `src/slides.ts` and assets in `public/`.
3. In the folder: `npm install && npm run render && npm run still`.
4. Add a card for it to `home/index.html` (the link is the folder name) and a row to the table above.
5. `./build-site.sh && fly deploy --ha=false --remote-only` from the repo root.
