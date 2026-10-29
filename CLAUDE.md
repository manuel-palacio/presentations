# Working in this repo

Animated presentations made with Remotion, one per folder (`sorolla/`, `velazquez/`, `kundera/`), all served by
one Fly.io app, `palace-presentations` (https://palace-presentations.fly.dev/): a home page at `/`
(`home/index.html`) and each presentation at `/<folder>/`. README.md explains building, deploying and adding one.

## Where new presentations come from

**Always look in the Google Drive folder `presentations` for scripts and information about new presentations**
(folder ID `1gbZ4H_uXOH2RzbZ1ovvxYZy0dSkzW-6B`, https://drive.google.com/drive/folders/1gbZ4H_uXOH2RzbZ1ovvxYZy0dSkzW-6B).
Search it with the Google Drive connector, e.g. `search_files` with `parentId = '1gbZ4H_uXOH2RzbZ1ovvxYZy0dSkzW-6B'`,
and read files with `read_file_content`. It holds, per subject, a summary of the source (often a YouTube video) and a
"presentation source (Remotion)" script with scenes, on-screen text, narration, visual direction and timings. The script
is the authority on content: use its text, do not invent facts. Keep a copy as `<folder>/SOURCE.md`.

## Conventions

- Copy the structure of an existing folder (`kundera/` for script-driven scenes, `velazquez/` for painting slides).
- Every presentation is in English and Spanish (natural European Spanish): one composition with a `lang` prop, all
  text per language in the slides file, identical timing in both, an `EN | ES` switch on the page, and posters for
  both (`out/poster.jpg`, `out/poster-es.jpg`, made by `npm run still`). A new presentation needs both languages and a
  bilingual card on the home page.
- Link previews: crawlers don't run JavaScript, so `share_meta.py` (run by `build-site.sh`) writes each page twice,
  `index.html` (English) and `index.es.html` (Spanish), with title, description, Open Graph/Twitter tags and an absolute
  poster URL; nginx serves the Spanish one for `?lang=es`. A new presentation needs its texts in `share.json`.
- Page headers show the title and tagline only: never the duration ("a 6 min 50 s presentation"), in any language.
- No voiceover: narration is shown as timed subtitles. Music is public domain or CC from Wikimedia Commons, verified on
  its file page and credited in `MUSIC` and on the page.
- No video download: `npm run build` publishes the web player, assets and both posters only; the MP4 stays in `out/`.
- Each web page sets `window.remotion_staticBase` from its own folder so assets load under `/<folder>/`.
- Deploy from the repo root: `./build-site.sh && fly deploy --ha=false --remote-only`, then check the live pages.
