// Reel estilo brag: ~41 s, cortes sobre los pulsos de cancion.mp3 (~133,6 BPM).
// La canción arranca en 3,593 s (2 compases antes de la subida).
export const FPS = 30;
export const BEAT = 13.4735;
export const SONG_START = 3.593;
export const DROP = 194; // subida: "Con Mejores Amigos, sí."

const b = (n: number) => Math.round(DROP + n * BEAT);
const span = (from: number, to: number) => ({ from, to, dur: to - from });

export const S = {
  q: span(0, 58), // ¿Tenés un comercio gastronómico?
  claim: span(58, 146), // Un cliente vino 12 veces este año.
  who: span(146, DROP), // ¿Sabés quién es?
  logo: span(DROP, b(10)), // Con Mejores Amigos, sí. + definición
  qr: span(b(10), b(15)), // Escanea el QR.
  stars: span(b(15), b(20)), // Suma estrellitas.
  prize: span(b(20), b(24)), // Desbloquea premios.
  commerce: span(b(24), b(28)), // ¿Y tu comercio qué gana?
  know: span(b(28), b(32)), // Conocés a tus clientes.
  slowQ: span(b(32), b(35)), // ¿Martes flojo?
  slowA: span(b(35), b(41)), // Doble estrellita los martes.
  aiQ: span(b(41), b(45)), // La IA te sugiere el mensaje.
  aiMsg: span(b(45), b(54)), // el mensaje se tipea → Aprobar → Enviado
  ret: span(b(54), b(58)), // Tus clientes vuelven.
  punch: span(b(58), b(64)), // Más frecuencia. Más clientes. Más ventas.
  closing: span(b(64), b(64) + 180), // logo + contacto
} as const;

export const TOTAL = S.closing.to;
