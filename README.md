# Presentations

Animated presentations made with [Remotion](https://www.remotion.dev/), one per folder. Each folder is
a self-contained project (its own `package.json`, Remotion composition, web player page and Fly.io app).

| Folder | Subject | Live |
|---|---|---|
| [`sorolla/`](sorolla/) | Joaquín Sorolla, the painter of light (1863–1923) | https://sorolla-painter-of-light.fly.dev/ |
| [`velazquez/`](velazquez/) | Diego Velázquez, the painter of painters (1599–1660) | https://velazquez-painter-of-painters.fly.dev/ |

## Adding a presentation

1. Create a new folder next to the others (copying `velazquez/` is the quickest start: its name, dates and
   links live in `META` in `src/slides.ts`, so nothing else is hardcoded).
2. Edit its `src/slides.ts`, assets in `public/`, and the app name in `fly.toml`.
3. `npm install && npm run render && npm run still && npm run build && fly deploy --ha=false --remote-only`
4. Add a row to the table above.
