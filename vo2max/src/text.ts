// The words drawn inside the scenes (scenes.tsx), per language, from SOURCE.md. `cue` fields are phrases of
// that language's narration (slides.ts): a visual appears when its phrase is reached in the subtitles.
// Layout (positions, colours, values) stays in scenes.tsx.
import type { L } from "./slides";

const EN = {
  part: "Part",
  intro: { title: "VO₂ max", subtitle: "Why it fades with age, and how to train it back" },
  decline: {
    eyebrow: "The decline", title: "Almost half, gone", age: "Age", axis: "VO₂ max (% of age 20)", sedentary: "sedentary",
    perDecade: "−10 % per decade", total: "−46 %", start: "starts ≈ 30",
    cues: { decade: "ten percent", half: "almost half" },
  },
  fick: {
    eyebrow: "The Fick principle", title: "Pump × extraction", heart: "Heart", pump: "pump", muscle: "Muscle", extract: "extraction",
    cues: { heart: "The heart", muscle: "the muscles", equals: "pump times" },
  },
  curves: {
    eyebrow: "Two curves, unequal", title: "The heart doesn't explain it all", output: "Cardiac output", vo2: "VO₂ max", gap: "the muscle",
    hr: "Max heart rate", perYear: "−1 / year", age: "Age",
    cues: { hr: "maximal heart rate", output: "cardiac output", vo2: "forty-six", gap: "doesn't explain" },
  },
  split: {
    eyebrow: "What limits VO₂ max", title: "Heart or muscle?", young: "Young adults", older: "Late middle age",
    heart: "Heart · central", muscle: "Muscle · peripheral", cues: { older: "late middle age" },
  },
  extraction: {
    eyebrow: "At full effort", title: "Muscles use less of what arrives", young: "Young", old: "75–80 years", label: "of the oxygen extracted",
    cues: { young: "young muscle", old: "seventy-five" },
  },
  cascade: {
    eyebrow: "The oxygen cascade", title: "From air to mitochondria",
    stages: ["Lungs", "Blood", "Capillaries", "Muscle fibre", "Mitochondria"],
    tags: ["fewer capillaries", "lost fibres", "fewer mitochondria"],
    cues: { stages: "lungs", age: "With age", tags: ["fewer capillaries", "lost muscle", "fewer, less"] },
  },
  trainable: { eyebrow: "The good news", line: "The cascade is trainable", sub: "at any age", cues: { sub: "any age" } },
  tools: {
    eyebrow: "8–10 weeks of training", title: "Three tools", columns: ["Endurance", "HIIT", "Sprints"],
    metrics: ["Mitochondria", "Capillaries", "VO₂ max"], note: "Mølmen et al., Sports Medicine 2025 · capillaries: capillary-to-fibre ratio",
    best: ["best for capillaries", "most time-efficient", "fastest signal / min"],
    cues: { columns: ["Endurance training", "High-intensity", "Sprint intervals"], vo2: "twelve percent" },
  },
  zones: {
    eyebrow: "Intervals", title: "Hard, then easy", hard: "Hard · ≥ 87 % VO₂ max", hardTalk: "a few words at most",
    easy: "Easy · ≤ 65 % VO₂ max", easyTalk: "you can chat", time: "time", cues: { hard: "Hard means", easy: "Easy means" },
  },
  fourbyfour: {
    eyebrow: "The classic session", title: "4 × 4", warm: "Warm-up", hard: "Hard", easy: "Easy", cool: "Cool-down", min: "min",
    cues: { start: "ten minutes", total: "forty minutes" },
  },
  short: {
    eyebrow: "Short on time", title: "Two quick options", a: "6 × 1 min", aSub: "1 min easy between · 10–15 min",
    b: "4–6 × 20–30 s", bSub: "all-out sprints", cues: { a: "Six one-minute", b: "four to six" },
  },
  week: {
    eyebrow: "A week that works", title: "≈ 60–90 min of cardio + strength", days: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    intervals: "4 × 4", zone2: "Zone 2", zone2Sub: "30–45 min", strength: "Strength", walk: "Walk",
    cues: { intervals: "one interval", zone2: "Zone 2", strength: "two strength", walk: "easy walking" },
  },
  strength: {
    eyebrow: "Keep the muscle", title: "Five movements, twice a week", moves: ["Squat", "Hinge", "Push", "Pull", "Carry"], badge: "2 × week",
    cues: { moves: "squat", badge: "twice a week" },
  },
  progression: {
    eyebrow: "Example plan", title: "12 weeks, step by step", weeks: ["Weeks 1–4", "Weeks 5–8", "Weeks 9–12"],
    steps: ["Zone 2 ×2 · strength ×2", "+ 6 × 1 min", "4 × 4 · Zone 2 · strength ×2"],
    note: "An example built on the article's weekly templates",
    cues: { steps: ["Weeks one", "Five to eight", "Nine to twelve"] },
  },
  finale: {
    line: "Train the pump and the muscle", sedentary: "sedentary", trained: "trained", age: "Age",
    note: "Check with your doctor before high-intensity training", cues: { trained: "the curve bends", note: "doctor" },
  },
  outro: {
    title: "VO₂ max and ageing", basedOn: "Based on", studies: "Figures from", music: "Music", made: "Made with Remotion · charts drawn in code",
  },
};

const ES: typeof EN = {
  part: "Parte",
  intro: { title: "VO₂ máx", subtitle: "Por qué se apaga con la edad y cómo recuperarlo entrenando" },
  decline: {
    eyebrow: "La caída", title: "Casi la mitad, perdida", age: "Edad", axis: "VO₂ máx (% del de los 20 años)", sedentary: "sedentarios",
    perDecade: "−10 % por década", total: "−46 %", start: "empieza ≈ 30",
    cues: { decade: "diez por ciento", half: "casi la mitad" },
  },
  fick: {
    eyebrow: "El principio de Fick", title: "Bomba × extracción", heart: "Corazón", pump: "bomba", muscle: "Músculo", extract: "extracción",
    cues: { heart: "El corazón", muscle: "los músculos", equals: "la bomba por" },
  },
  curves: {
    eyebrow: "Dos curvas desiguales", title: "El corazón no lo explica todo", output: "Gasto cardiaco", vo2: "VO₂ máx", gap: "el músculo",
    hr: "Frecuencia cardiaca máx.", perYear: "−1 / año", age: "Edad",
    cues: { hr: "frecuencia cardiaca máxima", output: "gasto cardiaco", vo2: "cuarenta y seis", gap: "no explica" },
  },
  split: {
    eyebrow: "Qué limita el VO₂ máx", title: "¿Corazón o músculo?", young: "Adultos jóvenes", older: "Final de la mediana edad",
    heart: "Corazón · central", muscle: "Músculo · periférico", cues: { older: "mediana edad" },
  },
  extraction: {
    eyebrow: "A pleno esfuerzo", title: "El músculo aprovecha menos lo que le llega", young: "Joven", old: "75–80 años", label: "del oxígeno extraído",
    cues: { young: "el músculo joven", old: "setenta y cinco" },
  },
  cascade: {
    eyebrow: "La cascada del oxígeno", title: "Del aire a las mitocondrias",
    stages: ["Pulmones", "Sangre", "Capilares", "Fibra muscular", "Mitocondrias"],
    tags: ["menos capilares", "fibras perdidas", "menos mitocondrias"],
    cues: { stages: "pulmones", age: "Con la edad", tags: ["menos capilares", "fibras musculares perdidas", "mitocondrias menos"] },
  },
  trainable: { eyebrow: "La buena noticia", line: "La cascada se puede entrenar", sub: "a cualquier edad", cues: { sub: "cualquier edad" } },
  tools: {
    eyebrow: "8–10 semanas de entrenamiento", title: "Tres herramientas", columns: ["Resistencia", "HIIT", "Sprints"],
    metrics: ["Mitocondrias", "Capilares", "VO₂ máx"], note: "Mølmen et al., Sports Medicine 2025 · capilares: capilares por fibra",
    best: ["la mejor para capilares", "la más eficiente en tiempo", "la señal más rápida / min"],
    cues: { columns: ["El entrenamiento", "alta intensidad", "Los sprints"], vo2: "doce por ciento" },
  },
  zones: {
    eyebrow: "Intervalos", title: "Fuerte, y luego suave", hard: "Fuerte · ≥ 87 % VO₂ máx", hardTalk: "apenas unas palabras",
    easy: "Suave · ≤ 65 % VO₂ máx", easyTalk: "puedes charlar", time: "tiempo", cues: { hard: "Fuerte es", easy: "Suave es" },
  },
  fourbyfour: {
    eyebrow: "La sesión clásica", title: "4 × 4", warm: "Calentamiento", hard: "Fuerte", easy: "Suave", cool: "Vuelta a la calma", min: "min",
    cues: { start: "diez minutos", total: "cuarenta minutos" },
  },
  short: {
    eyebrow: "Con poco tiempo", title: "Dos opciones rápidas", a: "6 × 1 min", aSub: "1 min suave entre medias · 10–15 min",
    b: "4–6 × 20–30 s", bSub: "sprints a tope", cues: { a: "Seis esfuerzos", b: "de cuatro a seis" },
  },
  week: {
    eyebrow: "Una semana que funciona", title: "≈ 60–90 min de cardio + fuerza", days: ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"],
    intervals: "4 × 4", zone2: "Zona 2", zone2Sub: "30–45 min", strength: "Fuerza", walk: "Paseo",
    cues: { intervals: "una sesión de intervalos", zone2: "zona 2", strength: "dos de fuerza", walk: "paseos tranquilos" },
  },
  strength: {
    eyebrow: "Conserva el músculo", title: "Cinco movimientos, dos veces por semana", moves: ["Sentadilla", "Bisagra", "Empuje", "Tirón", "Acarreo"],
    badge: "2 × semana", cues: { moves: "sentadilla", badge: "dos veces" },
  },
  progression: {
    eyebrow: "Plan de ejemplo", title: "12 semanas, paso a paso", weeks: ["Semanas 1–4", "Semanas 5–8", "Semanas 9–12"],
    steps: ["Zona 2 ×2 · fuerza ×2", "+ 6 × 1 min", "4 × 4 · zona 2 · fuerza ×2"],
    note: "Un ejemplo construido sobre las plantillas semanales del artículo",
    cues: { steps: ["De la uno", "De la cinco", "De la nueve"] },
  },
  finale: {
    line: "Entrena la bomba y el músculo", sedentary: "sedentarios", trained: "entrenados", age: "Edad",
    note: "Consulta a tu médico antes de entrenar a alta intensidad", cues: { trained: "la curva se dobla", note: "médico" },
  },
  outro: {
    title: "El VO₂ máx y la edad", basedOn: "Basado en", studies: "Cifras de", music: "Música", made: "Hecho con Remotion · gráficos dibujados en código",
  },
};

export const TEXT: L<typeof EN> = { en: EN, es: ES };
