// Cortes del reel, atados a la canción (cancion.mp3, ~133,6 BPM → 13,47 cuadros por pulso).
export const FPS = 30;
export const BEAT = 13.4735; // cuadros por pulso

// Anclas medidas sobre el audio.
export const DROP = 302; // 10,06 s — entra el bajo: revelación del logo
export const BREAK = 1491; // 49,70 s — se va el bajo
export const RETURN = 1718; // 57,26 s — vuelve la energía
export const SONG_END = 2389; // 79,63 s — termina la sección B

/** Cuadro del pulso n contado desde una ancla. */
export const beat = (n: number, from = DROP) => Math.round(from + n * BEAT);

const span = (from: number, to: number) => ({ from, to, dur: to - from });

export const SCENES = {
  hook: span(0, DROP), // "12 veces" (0–150) + "¿Sabés quién es?" (150–302)
  logo: span(DROP, beat(10)), // revelación + definición
  explain: span(beat(10), beat(22)), // tres líneas
  ai: span(beat(22), beat(32)), // línea del sistema de IA
  p1: span(beat(32), beat(52)), // escanea el QR en la mesa + registro
  p2: span(beat(52), beat(72)), // cada visita suma + "¿cuántas estrellitas tengo?"
  p3: span(beat(72), BREAK), // junta 5 y canjea
  title: span(BREAK, 1590), // ¿Y tu comercio qué gana?
  b1: span(1590, RETURN), // sabés quién es cada cliente
  b2: span(RETURN, beat(18, RETURN)), // mensajes automáticos (el beneficio central, más tiempo)
  b3: span(beat(18, RETURN), beat(29, RETURN)), // vuelve más seguido
  b4: span(beat(29, RETURN), beat(40, RETURN)), // días flojos
  closing: span(beat(40, RETURN), 2460), // cierre
} as const;

export const TOTAL_FRAMES = 2460; // 82 s
