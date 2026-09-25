#!/bin/sh
# Extrae cuadros clave del render para inspección visual (loop del skill).
# Uso: sh scripts/extract-frames.sh out/reel.mp4 out/check
IN=${1:-out/mejores-amigos-reel.mp4}
OUT=${2:-out/check}
mkdir -p "$OUT"
for f in 15 45 75 100 112 150 180 230 300 390 420 500 540 600 650 700 760 800 850 900 960 1010 1080 1130 1160 1200 1250 1300 1330 1380 1440 1460 1500 1560 1620; do
  t=$(awk "BEGIN { printf \"%.3f\", $f / 30 }")
  ffmpeg -v error -y -ss "$t" -i "$IN" -frames:v 1 "$OUT/f$(printf %04d $f).png"
done
echo "listo: $OUT"
