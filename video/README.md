# Reel "Mejores Amigos" (Remotion)

Reel vertical 1080×1920 · 30 fps · 55 s. Guion y storyboard en `docs/video/`.

## Regenerar desde cero
```bash
npm install
npm run sfx                                   # música y efectos sintetizados → public/audio/
(cd ../panel && python3 -m http.server 8765 &) # servir el panel real
npm run capture                               # capturas del panel → public/panel/
npx remotion render src/index.ts MejoresAmigosReel out/reel.mp4 --codec h264 --crf 16 \
  --browser-executable=/opt/pw-browsers/chromium_headless_shell-1194/chrome-linux/headless_shell
# normalizar volumen para redes (-14 LUFS)
ffmpeg -i out/reel.mp4 -c:v copy -af "loudnorm=I=-14:TP=-1.5:LRA=7" -c:a aac -b:a 192k -movflags +faststart out/mejores-amigos-reel.mp4
sh scripts/extract-frames.sh out/mejores-amigos-reel.mp4 out/check   # cuadros para revisar
```

## Estructura
- `src/theme.ts` — colores (muestreados de los logos), tipografías, easings y springs.
- `src/timeline.ts` — cortes de cada escena en cuadros (120 BPM → 15 cuadros por pulso).
- `src/scenes/` — Gancho, Qué es, Cómo funciona (3 pasos), Beneficios (4) y Cierre.
- `src/components/` — fondo en capas, logo animado, teléfono, QR, ventanas del panel, tipografía cinética.
- `scripts/capture-panel.mjs` — captura componentes del panel real (layout de celular, 3×) para el B-roll.
- `scripts/gen-audio.mjs` — sintetiza la música y los efectos (sin descargas).

Para cambiar el nombre del restaurante o del cliente de ejemplo: `panel/js/demo-data.js` (y volver a capturar) y los textos de `src/scenes/Steps.tsx` / `Benefits.tsx`.
