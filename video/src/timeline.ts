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
  p1: span(beat(20), beat(37)), // escanea el QR en la mesa + registro
  p2: span(beat(37), beat(52)), // cada visita suma + "¿cuántas estrellitas tengo?"
  p3: span(beat(52), beat(66)), // junta 5 y desbloquea su premio
  title: span(beat(66), beat(71)), // ¿Y tu comercio qué gana? · 4 beneficios
  b1t: span(beat(71), beat(76)), // cada título de beneficio, en pantalla propia
  b1: span(beat(76), beat(85)), // conocé a tus clientes
  b2t: span(beat(85), beat(90)),
  b2: span(beat(90), beat(3, RETURN)), // mensajes automáticos (el envío cae en la vuelta de la energía)
  b3t: span(beat(3, RETURN), beat(8, RETURN)),
  b3: span(beat(8, RETURN), beat(20, RETURN)), // vuelven más seguido
  b4t: span(beat(20, RETURN), beat(25, RETURN)),
  b4: span(beat(25, RETURN), beat(35, RETURN)), // días flojos
  closing: span(beat(35, RETURN), 2284), // remate + cierre
} as const;

export const TOTAL_FRAMES = 2284; // 76,1 s
