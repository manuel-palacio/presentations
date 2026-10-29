#!/usr/bin/env python3
"""Link previews per language, written into the assembled site (_site/) by build-site.sh.

Link previews (WhatsApp, Telegram, Slack, ...) are built by crawlers that read the page's <head> and never run its
JavaScript, so the language switch on the page cannot change them. For every page in share.json this writes:
  _site/<page>/index.html     English <title>, description, Open Graph and Twitter tags, <html lang="en">
  _site/<page>/index.es.html  the same in Spanish, with the Spanish poster
nginx serves index.es.html for ?lang=es (nginx.conf). Image URLs are absolute: many crawlers ignore relative ones.
"""

import html
import json
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent
SITE = ROOT / "_site"
LOCALES = {"en": "en_US", "es": "es_ES"}
# Tags this script owns: removed from the built page before its own are written.
OWNED = re.compile(
    r'\s*<title>.*?</title>'
    r'|\s*<meta\s+(?:name="description"|property="og:[^"]*"|name="twitter:[^"]*")[^>]*>'
    r'|\s*<link\s+rel="alternate"\s+hreflang[^>]*>',
    re.S,
)


def tags(site: str, page: str, lang: str, info: dict) -> str:
    folder = f"{page}/" if page else ""
    url = f"{site}/{folder}" + ("?lang=es" if lang == "es" else "")
    image = f"{site}/{info.get('image') or folder + ('poster-es.jpg' if lang == 'es' else 'poster.jpg')}"
    other = "es" if lang == "en" else "en"
    title, description = html.escape(info["title"]), html.escape(info["description"])
    lines = [
        f"<title>{title}</title>",
        f'<meta name="description" content="{description}" />',
        f'<meta property="og:type" content="website" />',
        f'<meta property="og:site_name" content="{"Presentaciones" if lang == "es" else "Presentations"}" />',
        f'<meta property="og:title" content="{title}" />',
        f'<meta property="og:description" content="{description}" />',
        f'<meta property="og:url" content="{url}" />',
        f'<meta property="og:image" content="{image}" />',
        f'<meta property="og:image:width" content="1920" />',
        f'<meta property="og:image:height" content="1080" />',
        f'<meta property="og:locale" content="{LOCALES[lang]}" />',
        f'<meta property="og:locale:alternate" content="{LOCALES[other]}" />',
        f'<meta name="twitter:card" content="summary_large_image" />',
        f'<meta name="twitter:title" content="{title}" />',
        f'<meta name="twitter:description" content="{description}" />',
        f'<meta name="twitter:image" content="{image}" />',
        f'<link rel="alternate" hreflang="en" href="{site}/{folder}" />',
        f'<link rel="alternate" hreflang="es" href="{site}/{folder}?lang=es" />',
    ]
    return "\n    ".join(lines)


def main() -> int:
    share = json.loads((ROOT / "share.json").read_text(encoding="utf-8"))
    for page, languages in share["pages"].items():
        source = SITE / page / "index.html"
        if not source.exists():
            print(f"share_meta: {source} missing", file=sys.stderr)
            return 1
        built = OWNED.sub("", source.read_text(encoding="utf-8"))
        for lang, info in languages.items():
            text = re.sub(r'<html lang="[^"]*"', f'<html lang="{lang}"', built, count=1)
            text = text.replace("</head>", f"    {tags(share['site'], page, lang, info)}\n  </head>", 1)
            (SITE / page / ("index.html" if lang == "en" else f"index.{lang}.html")).write_text(text, encoding="utf-8")
        print(f"share_meta: /{page + '/' if page else ''} en+es")
    return 0


if __name__ == "__main__":
    sys.exit(main())
