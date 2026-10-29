// Page language, the same in every presentation and on the home page (copied verbatim into each project).
// Initial language: ?lang= in the URL, else the saved choice, else the browser's language.
import React from "react";
import type { Lang } from "../src/slides";

export const STORAGE_KEY = "presentations.lang";

const isLang = (value: unknown): value is Lang => value === "en" || value === "es";

export const initialLang = (): Lang => {
  const fromUrl = new URLSearchParams(window.location.search).get("lang");
  if (isLang(fromUrl)) return fromUrl;
  try {
    const saved = window.localStorage.getItem(STORAGE_KEY);
    if (isLang(saved)) return saved;
  } catch {
    // storage blocked: fall through to the browser language
  }
  return (navigator.language || "").toLowerCase().startsWith("es") ? "es" : "en";
};

/** Reflects the language in the document (lang attribute, title). */
export const showLang = (lang: Lang, title: string) => {
  document.documentElement.lang = lang;
  document.title = title;
};

/** A choice made with the switch: put it in the URL and remember it for every presentation. */
export const chooseLang = (lang: Lang) => {
  const url = new URL(window.location.href);
  url.searchParams.set("lang", lang);
  window.history.replaceState(window.history.state, "", url);
  try {
    window.localStorage.setItem(STORAGE_KEY, lang);
  } catch {
    // storage blocked: the URL still carries the choice
  }
};

export const LangSwitch: React.FC<{ lang: Lang; onChange: (lang: Lang) => void }> = ({ lang, onChange }) => (
  <div className="lang-switch" role="group" aria-label={lang === "es" ? "Idioma" : "Language"}>
    {(["en", "es"] as const).map((l, i) => (
      <React.Fragment key={l}>
        {i ? <span aria-hidden="true">|</span> : null}
        <button type="button" lang={l} aria-pressed={l === lang} className={l === lang ? "active" : ""} onClick={() => onChange(l)}>
          {l.toUpperCase()}
        </button>
      </React.Fragment>
    ))}
  </div>
);

/** Back to the home page with all presentations, in the same language. */
export const HomeLink: React.FC<{ lang: Lang }> = ({ lang }) => (
  <a className="home-link" href={`../?lang=${lang}`}>
    ← {lang === "es" ? "Presentaciones" : "Presentations"}
  </a>
);
