// Cortes del reel, atados a la canción (cancion.mp3, ~133,6 BPM → 13,47 cuadros por pulso).
// La canción arranca en 4,675 s (3 compases antes de la subida) para acortar la intro.
export const FPS = 30;
export const BEAT = 13.4735; // cuadros por pulso
export const SONG_START = 4.675; // s recortados al principio de cancion.mp3

// Anclas medidas sobre el audio, ya corridas por SONG_START.
export const DROP = 162; // 10,06 s en la canción — entra el bajo: respuesta + logo
export const BREAK = 1351; // 49,70 s — se va el bajo
export const RETURN = 1578; // 57,26 s — vuelve la energía

/** Cuadro del pulso n contado desde una ancla. */
export const beat = (n: number, from = DROP) => Math.round(from + n * BEAT);

const span = (from: number, to: number) => ({ from, to, dur: to - from });

export const SCENES = {
  hook: span(0, DROP), // "12 veces" (0–84) + "¿Sabés quién es?" (84–162)
  logo: span(DROP, beat(10)), // "Con Mejores Amigos, sí." + definición
  ai: span(beat(10), beat(20)), // línea del sistema de IA
  p1: span(beat(20), beat(29)), // escanea el QR en la mesa → +1 estrellita (3D)
  p2: span(beat(29), beat(37)), // cada visita suma una estrellita
  p3: span(beat(37), beat(48)), // junta 5 y desbloquea su premio
  title: span(beat(48), beat(58)), // ¿Y tu comercio qué gana? · grilla de 4 beneficios
  b1t: span(beat(58), beat(64)), // 1 · Conocé a tus clientes (solo placa)
  b2t: span(beat(64), beat(71)), // 2 · Llená los días flojos: placa con la frase grande…
  b2: span(beat(71), beat(84)), // …y el ejemplo en otra pantalla
  b3t: span(beat(84), beat(91)), // 3 · Mensajes automáticos
  b3: span(beat(91), beat(103)),
  b4t: span(beat(103), beat(110)), // 4 · Vuelven más seguido (la energía vuelve durante la placa)
  b4: span(beat(110), beat(119)),
  closing: span(beat(119), beat(119) + 160), // remate + cierre
} as const;

export const TOTAL_FRAMES = SCENES.closing.to; // ~64 s
