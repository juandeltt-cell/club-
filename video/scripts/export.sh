#!/usr/bin/env bash
# Exportación final del reel.
# Remotion renderiza cuadros PNG (idénticos cuadro a cuadro cuando nada se mueve) y ffmpeg
# los comprime. El codificador interno de Remotion hacía "temblar" el texto quieto
# (cuadros alternados con distinta calidad); así queda firme. Se renderiza con UNA sola
# pestaña del navegador: con varias en paralelo, cada una suaviza los bordes de las letras
# un poco distinto y los cuadros alternados hacían "vibrar" el texto y trabar la cinta. Además se quitan todos los
# metadatos del archivo (sin marcas de herramientas ni de IA).
set -euo pipefail
cd "$(dirname "$0")/.."
BROWSER=${BROWSER:-/opt/pw-browsers/chromium_headless_shell-1194/chrome-linux/headless_shell}
rm -rf out/frames
npx remotion render src/index.ts MejoresAmigosReel out/frames --sequence --image-format=png --concurrency=1 --gl=angle --browser-executable="$BROWSER" --log=error
# solo el audio (música + efectos), con cuadros mínimos
npx remotion render src/index.ts MejoresAmigosReel out/audio.wav --codec wav --browser-executable="$BROWSER" --log=error
ffmpeg -v error -y -framerate 30 -i out/frames/element-%04d.png -i out/audio.wav \
  -map 0:v -map 1:a -map_metadata -1 -map_chapters -1 -fflags +bitexact -flags:v +bitexact -flags:a +bitexact \
  -metadata:s:v handler_name="" -metadata:s:a handler_name="" \
  -c:v libx264 -crf 16 -preset slow -tune film -pix_fmt yuv420p -x264-params no-info=1:bframes=2:b-adapt=0 \
  -af "loudnorm=I=-14:TP=-1.5:LRA=9" -ar 48000 -c:a aac -b:a 192k -movflags +faststart -shortest \
  out/mejores-amigos-reel.mp4
rm -rf out/frames out/audio.wav
echo "listo: out/mejores-amigos-reel.mp4"
