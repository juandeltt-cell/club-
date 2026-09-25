// Captura componentes del panel real (panel/index.html) para usarlos como B-roll.
// Usa el layout para celular (angosto y alto = ideal para 9:16) a 3x de resolución.
// Requiere el panel servido en http://127.0.0.1:8765 (cd panel && python3 -m http.server 8765).
import { chromium } from "playwright-core";
import { mkdirSync } from "node:fs";

const BASE = process.env.PANEL_URL || "http://127.0.0.1:8765/index.html";
const OUT = new URL("../public/panel/", import.meta.url).pathname;
const CHROME = process.env.CHROME_PATH || "/opt/pw-browsers/chromium-1194/chrome-linux/chrome";
mkdirSync(OUT, { recursive: true });

// Ajustes solo de captura: sin transiciones (estados deterministas) y fondo limpio.
const CAPTURE_CSS = `
  *, *::before, *::after { transition: none !important; animation: none !important; }
  .toast { display: none !important; }
  .modal-backdrop { background: transparent !important; }
  .modal { box-shadow: 0 2px 6px rgba(2,49,42,.06), 0 18px 48px rgba(2,49,42,.14) !important; }
`;
const COMPACT_AUTOMATIONS = `
  .automation .msg-preview, .automation .automation__stats { display: none !important; }
  .automation { align-items: center !important; grid-template-columns: 52px 1fr auto !important; padding: 18px 20px !important; }
  .automation__trigger { font-size: 13px; }
`;

const browser = await chromium.launch({
  executablePath: CHROME,
  args: ["--disable-background-networking", "--disable-component-update", "--no-first-run"],
});
const page = await browser.newPage({ viewport: { width: 430, height: 932 }, deviceScaleFactor: 3 });
const errors = [];
page.on("pageerror", (e) => errors.push(e.message));

async function load(hash = "inicio", query = "") {
  await page.goto(`${BASE}${query}#${hash}`);
  await page.addStyleTag({ content: CAPTURE_CSS });
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(1300); // deja terminar el conteo de los KPIs
}
const shot = async (sel, name) => {
  await page.locator(sel).first().screenshot({ path: `${OUT}${name}.png`, animations: "disabled" });
  console.log("✓", name);
};

// — Beneficio 1: segmentos y ficha —
await load("inicio");
await shot("#home-segments", "seg-all");
for (const seg of ["new", "frequent", "risk"]) {
  await page.click(`#home-segments [data-seg="${seg}"]`);
  await shot("#home-segments", `seg-${seg}`);
}
await page.evaluate(() => MA.openCustomer("juli"));
await page.waitForTimeout(200);
await shot("#drawer .profile", "ficha-juli");
await page.evaluate(() => MA.closeCustomer());

// — Beneficio 2: sugerencia de cumpleaños y envío —
await shot('#home-suggestions [data-suggestion="birthday"]', "sugg-birthday");
await page.evaluate(() => MA.openSend("birthday"));
await page.waitForTimeout(200);
await shot("#modal", "send-0");
const ids = await page.$$eval("#modal [data-recipient]", (els) => els.map((e) => e.dataset.recipient));
for (let i = 0; i < ids.length; i++) {
  await page.evaluate((id) => document.querySelector(`#modal [data-recipient="${id}"]`).classList.add("is-sent"), ids[i]);
  await shot("#modal", `send-${i + 1}`);
}
await page.evaluate(() => {
  document.querySelector("#send-status").innerHTML =
    '<svg class="icon" aria-hidden="true"><use href="#i-checks"/></svg> Enviado automáticamente a 4 clientes';
  const b = document.querySelector("[data-confirm]");
  b.classList.add("is-done");
  b.innerHTML = '<svg class="icon icon--sm" aria-hidden="true"><use href="#i-check"/></svg>Listo';
});
await shot("#modal", "send-done");
await page.evaluate(() => MA.confirmSend());
await page.waitForTimeout(3000);

// — Beneficio 3: ficha después del envío y cuando vuelve —
await page.evaluate(() => MA.openCustomer("juli"));
await page.waitForTimeout(200);
await shot("#drawer .profile", "ficha-sent");
await page.evaluate(() => MA.markReturned("juli"));
await page.waitForTimeout(200);
await shot("#drawer .profile", "ficha-returned");
await page.evaluate(() => MA.closeCustomer());

// — Mensajes automáticos: apagados y encendiéndose de a uno —
await load("automaticos", "?demo=automations-off");
await page.addStyleTag({ content: COMPACT_AUTOMATIONS });
await shot("#automations", "auto-0");
const autos = ["welcome", "birthday", "reward", "missyou"];
for (let i = 0; i < autos.length; i++) {
  await page.evaluate((id) => MA.setAutomation(id, true), autos[i]);
  await shot("#automations", `auto-${i + 1}`);
}

// — Beneficio 4: martes flojo —
await load("sugerencias");
await shot('#all-suggestions [data-suggestion="tuesday"]', "sugg-tuesday");
await load("inicio");
const STEPS = 10;
for (let i = 0; i <= STEPS; i++) {
  await page.evaluate(({ i, STEPS }) => {
    const days = window.MA_DEMO.weekdays;
    const max = Math.max(...days.map((d) => Math.max(d.value, d.target || 0)));
    const d = days.find((x) => x.id === "mar");
    const t = i / STEPS;
    const v = Math.round(d.value + (d.target - d.value) * t);
    const bar = document.querySelector('[data-day="mar"] .bars__bar');
    bar.style.setProperty("--h", `${(v / max) * 100}%`);
    bar.querySelector(".bars__value").textContent = v;
    bar.classList.toggle("bars__bar--low", i === 0);
    bar.classList.toggle("bars__bar--boosted", i > 0);
  }, { i, STEPS });
  await shot("#weekday-card", `bars-${String(i).padStart(2, "0")}`);
}

await browser.close();
if (errors.length) { console.error("Errores de página:", errors); process.exit(1); }
