// Cortes del reel, atados a la canción (cancion.mp3, ~133,6 BPM → 13,47 cuadros por pulso).
// La canción arranca en 2,879 s (4 compases antes de la subida) para acortar la intro.
export const FPS = 30;
export const BEAT = 13.4735; // cuadros por pulso
export const SONG_START = 2.879; // s recortados al principio de cancion.mp3

// Anclas medidas sobre el audio, ya corridas por SONG_START.
export const DROP = 216; // 10,06 s en la canción — entra el bajo: respuesta + logo
export const BREAK = 1405; // 49,70 s — se va el bajo
export const RETURN = 1632; // 57,26 s — vuelve la energía

/** Cuadro del pulso n contado desde una ancla. */
export const beat = (n: number, from = DROP) => Math.round(from + n * BEAT);

const span = (from: number, to: number) => ({ from, to, dur: to - from });

export const SCENES = {
  hook: span(0, DROP), // "12 veces" (0–112) + "¿Sabés quién es?" (112–216)
  logo: span(DROP, beat(10)), // "Con Mejores Amigos, sí." + definición
  ai: span(beat(10), beat(20)), // línea del sistema de IA
  p1: span(beat(20), beat(29)), // escanea el QR en la mesa → +1 estrellita (3D)
  p2: span(beat(29), beat(38)), // cada visita suma una estrellita
  p3: span(beat(38), beat(51)), // junta 5 y desbloquea su premio
  title: span(beat(51), beat(62)), // ¿Y tu comercio qué gana? · grilla de 4 beneficios
  b1t: span(beat(62), beat(68)), // 1 · Conocé a tus clientes (solo título)
  b2t: span(beat(68), beat(73)), // 2 · Llená los días flojos
  b2: span(beat(73), beat(88)),
  b3t: span(beat(88), beat(93)), // 3 · Mensajes automáticos
  b3: span(beat(93), beat(3, RETURN)), // "¡Enviado solo!" cae en la vuelta de la energía
  b4t: span(beat(3, RETURN), beat(8, RETURN)), // 4 · Los clientes vuelven más seguido
  b4: span(beat(8, RETURN), beat(20, RETURN)),
  closing: span(beat(20, RETURN), beat(20, RETURN) + 180), // remate + cierre
} as const;

export const TOTAL_FRAMES = SCENES.closing.to; // ~69,4 s
