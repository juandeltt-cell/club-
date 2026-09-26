// Cortes del reel, atados a la canción (cancion.mp3, ~133,6 BPM → 13,47 cuadros por pulso).
// La canción arranca desde el principio: la intro (0–10 s) sostiene el gancho del restó.
export const FPS = 30;
export const BEAT = 13.4735; // cuadros por pulso
export const SONG_START = 0; // s recortados al principio de cancion.mp3

// Anclas medidas sobre el audio, ya corridas por SONG_START.
export const DROP = 302; // 10,06 s en la canción — entra el bajo: respuesta + logo
export const BREAK = 1491; // 49,70 s — se va el bajo
export const RETURN = 1718; // 57,26 s — vuelve la energía

/** Cuadro del pulso n contado desde una ancla. */
export const beat = (n: number, from = DROP) => Math.round(from + n * BEAT);

const span = (from: number, to: number) => ({ from, to, dur: to - from });

export const SCENES = {
  hook: span(0, DROP), // restó "¿Tenés un comercio gastronómico?" (0–90) + "12 veces" (90–215) + "¿Sabés quién es?" (215–302)
  logo: span(DROP, beat(12)), // "Con Mejores Amigos, sí." + definición
  ai: span(beat(12), beat(23)), // línea del sistema de IA
  p1: span(beat(23), beat(32)), // escanea el QR en la mesa → +1 estrellita (3D)
  p2: span(beat(32), beat(41)), // cada visita suma una estrellita
  p3: span(beat(41), beat(53)), // junta 5 y desbloquea su premio
  title: span(beat(53), beat(63)), // ¿Y tu comercio qué gana? · grilla de 4 beneficios
  b1t: span(beat(63), beat(71)), // 1 · Conocé a tus clientes (solo placa)
  b2t: span(beat(71), beat(82)), // 2 · Llená los días flojos (placa con la frase grande)
  b2: span(beat(82), beat(99)), // …y el ejemplo
  b3t: span(beat(99), beat(109)), // 3 · Mensajes automáticos
  b3: span(beat(109), beat(127)), // mensaje → "Enviado" → le llega a Juli
  b4t: span(beat(127), beat(138)), // 4 · Vuelven más seguido
  b4: span(beat(138), beat(149)),
  closing: span(beat(149), beat(149) + 175), // remate + cierre
} as const;

export const TOTAL_FRAMES = SCENES.closing.to; // ~82 s
