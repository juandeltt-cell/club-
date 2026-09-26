// Control de legibilidad con Tesseract (OCR).
// Para cada pantalla del reel: lee el texto de los cuadros renderizados, encuentra el
// primer cuadro en que la frase se lee completa y mide cuánto tiempo queda en pantalla.
// Compara con la regla de brag: ~0,3 s por palabra desde que la frase terminó de entrar.
//
// Uso: node scripts/check-legibility.mjs out/mejores-amigos-reel.mp4
import { execFileSync } from "node:child_process";
import { mkdtempSync, readFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { createRequire } from "node:module";
import { createWorker } from "tesseract.js";

const require = createRequire(import.meta.url);
const video = process.argv[2] ?? "out/mejores-amigos-reel.mp4";
const FPS = 30, BEAT = 13.4735, DROP = 194;
const b = (n) => Math.round(DROP + n * BEAT);
// mismos pulsos que src/brag/timeline.ts
const src = readFileSync(new URL("../src/brag/timeline.ts", import.meta.url), "utf8");
const BEATS = Object.fromEntries([...src.match(/BEATS = \{([^}]*)\}/)[1].matchAll(/(\w+): (\d+)/g)].map((m) => [m[1], +m[2]]));
const at = {};
{ let n = 0; for (const [k, v] of Object.entries(BEATS)) { at[k] = [b(n), b(n + v)]; n += v; } at.end = b(n); }

// [pantalla, desde, hasta, texto que tiene que leerse]
const SCREENS = [
  ["pregunta", 0, 54, "¿Tenés un comercio gastronómico?"],
  ["12 veces", 54, 128, "Un cliente vino veces este año."],
  ["quién es", 128, DROP, "¿Sabés quién es?"],
  ["definición", ...at.logo, "Un nuevo sistema de fidelización de clientes para restaurantes."],
  ["escanea", ...at.scan, "El cliente escanea el QR en la mesa."],
  ["estrellitas", ...at.stars, "En cada visita, suma estrellitas."],
  ["premio", ...at.prize, "Desbloquea premios. Primer premio. Con tu próximo plato, el postre va sin cargo."],
  ["comercio", ...at.commerce, "¿Y tu comercio qué gana?"],
  ["conocés", ...at.know, "Conocés a tus clientes."],
  ["martes ?", ...at.slowQ, "¿El sistema detectó que va poca gente los martes?"],
  ["martes !", ...at.slowA, "Doble estrellita los martes."],
  ["IA", ...at.aiQ, "La IA te sugiere el mensaje."],
  ["mensaje", ...at.aiMsg, "Hola, Juli! Se viene tu cumple: si venís con 4 amigos, tu plato va por nuestra cuenta."],
  ["le llega", ...at.lock, "Le llega por WhatsApp."],
  ["vuelven", ...at.ret, "Tus clientes vuelven."],
  ["remate", ...at.punch, "Más frecuencia. Más clientes. Más ventas."],
  ["cierre", at.end, at.end + 180, "Convertí a tus clientes en mejores amigos. Lo instalamos en tu restó"],
];

const norm = (t) => t.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9ñ ]/g, " ").split(/\s+/).filter(Boolean);
const recall = (expected, got) => {
  const g = new Set(norm(got));
  const e = norm(expected);
  return e.filter((w) => g.has(w)).length / e.length;
};

const dir = mkdtempSync(join(tmpdir(), "ocr-"));
const langPath = join(require.resolve("@tesseract.js-data/spa/package.json"), "..", "4.0.0_best_int");
const worker = await createWorker("spa", 1, { langPath, cachePath: dir, gzip: true, logger: () => {}, errorHandler: () => {} });

// cada cuadro se lee dos veces: normal y en negativo (el OCR no ve bien texto claro sobre oscuro)
const frameAt = (n, neg = false) => {
  const out = join(dir, `f${n}${neg ? "n" : ""}.png`);
  execFileSync("ffmpeg", ["-v", "error", "-y", "-i", video, "-vf", `select=eq(n\\,${n})${neg ? ",negate" : ""}`, "-frames:v", "1", out]);
  return readFileSync(out);
};
const readFrame = async (n) => (await worker.recognize(frameAt(n))).data.text + "\n" + (await worker.recognize(frameAt(n, true))).data.text;

console.log("pantalla      | palabras | se lee desde | queda en pantalla | necesita | resultado");
let fails = 0;
const only = process.argv[3]?.split(",");
for (const [name, from, to, text] of SCREENS) {
  if (only && !only.includes(name)) continue;
  const words = norm(text).length;
  const need = words * 0.3;
  let first = null;
  for (let n = from; n < to; n += 3) {
    if (recall(text, await readFrame(n)) >= 0.8) { first = n; break; }
  }
  const hold = first === null ? 0 : (to - first) / FPS;
  const ok = first !== null && hold >= need;
  if (!ok) fails++;
  console.log(
    `${name.padEnd(13)} | ${String(words).padStart(8)} | ${first === null ? "   no se lee" : `${(first / FPS).toFixed(2).padStart(10)} s`} | ${hold.toFixed(2).padStart(15)} s | ${need.toFixed(2).padStart(6)} s | ${ok ? "OK" : "CORTO"}`,
  );
}
await worker.terminate();
console.log(fails ? `\n${fails} pantalla(s) para revisar.` : "\nTodas las pantallas se leen con tiempo suficiente.");
