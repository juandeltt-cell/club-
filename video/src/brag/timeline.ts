// Reel estilo brag: ~41 s, cortes sobre los pulsos de cancion.mp3 (~133,6 BPM).
// La canción arranca en 3,593 s (2 compases antes de la subida).
export const FPS = 30;
export const BEAT = 13.4735;
export const SONG_START = 3.593;
export const DROP = 194; // subida: "Con Mejores Amigos, sí."

const b = (n: number) => Math.round(DROP + n * BEAT);
const span = (from: number, to: number) => ({ from, to, dur: to - from });

// Pulsos por pantalla (después de la subida). Ajustados con el control de legibilidad (Tesseract).
export const BEATS = { logo: 11, scan: 8, stars: 6, prize: 12, commerce: 5, know: 4, slowQ: 8, slowA: 6, aiQ: 5, aiMsg: 12, lock: 6, ret: 4, punch: 6 } as const;

const after = (() => {
  let n = 0;
  const out = {} as Record<keyof typeof BEATS, { from: number; to: number; dur: number }>;
  for (const k of Object.keys(BEATS) as (keyof typeof BEATS)[]) {
    out[k] = span(b(n), b(n + BEATS[k]));
    n += BEATS[k];
  }
  return { ...out, end: b(n) };
})();

export const S = {
  q: span(0, 54), // ¿Tenés un comercio gastronómico?
  claim: span(54, 128), // Un cliente vino 12 veces este año.
  who: span(128, DROP), // ¿Sabés quién es? (anillos, persona borrosa, rayos de luz)
  logo: after.logo, // Con Mejores Amigos, sí. + definición
  scan: after.scan, // El cliente escanea el QR en la mesa. (dibujo + estrellita 3D)
  stars: after.stars, // En cada visita, suma estrellitas.
  prize: after.prize, // Desbloquea premios. (celular que da vuelta la tarjeta)
  commerce: after.commerce, // ¿Y tu comercio qué gana?
  know: after.know, // Conocés a tus clientes.
  slowQ: after.slowQ, // ¿El sistema detectó que va poca gente los martes?
  slowA: after.slowA, // Doble estrellita los martes.
  aiQ: after.aiQ, // La IA te sugiere el mensaje.
  aiMsg: after.aiMsg, // el mensaje se tipea → Aprobar → Enviado
  lock: after.lock, // le llega por WhatsApp (celular bloqueado 20:41)
  ret: after.ret, // Tus clientes vuelven.
  punch: after.punch, // Más frecuencia. Más clientes. Más ventas.
  closing: span(after.end, after.end + 180), // logo + contacto
} as const;

export const TOTAL = S.closing.to;
