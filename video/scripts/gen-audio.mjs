// Sintetiza la música y los efectos del reel como WAV de 16 bits (determinístico, sin descargas).
// Música: 120 BPM (1 pulso = 0,5 s = 15 cuadros a 30 fps), progresión D – A – Bm – G.
import { writeFileSync, mkdirSync } from "node:fs";

const SR = 44100;
const OUT = new URL("../public/audio/", import.meta.url).pathname;
mkdirSync(OUT, { recursive: true });

// ---------- utilidades ----------
let seed = 1234567;
const rand = () => ((seed = (seed * 1664525 + 1013904223) >>> 0) / 4294967296) * 2 - 1;
const buf = (sec, ch = 2) => Array.from({ length: ch }, () => new Float32Array(Math.ceil(sec * SR)));
const midi = (n) => 440 * Math.pow(2, (n - 69) / 12);

function writeWav(name, chans, gain = 1) {
  const n = chans[0].length, ch = chans.length;
  let peak = 0;
  for (const c of chans) for (let i = 0; i < n; i++) peak = Math.max(peak, Math.abs(c[i]));
  const norm = peak > 0 ? (0.89 / peak) * gain : 1;
  const data = Buffer.alloc(44 + n * ch * 2);
  data.write("RIFF", 0); data.writeUInt32LE(36 + n * ch * 2, 4); data.write("WAVE", 8);
  data.write("fmt ", 12); data.writeUInt32LE(16, 16); data.writeUInt16LE(1, 20); data.writeUInt16LE(ch, 22);
  data.writeUInt32LE(SR, 24); data.writeUInt32LE(SR * ch * 2, 28); data.writeUInt16LE(ch * 2, 32); data.writeUInt16LE(16, 34);
  data.write("data", 36); data.writeUInt32LE(n * ch * 2, 40);
  for (let i = 0; i < n; i++) for (let c = 0; c < ch; c++) {
    const v = Math.max(-1, Math.min(1, chans[c][i] * norm));
    data.writeInt16LE(Math.round(v * 32767), 44 + (i * ch + c) * 2);
  }
  writeFileSync(OUT + name, data);
  console.log("✓", name, (n / SR).toFixed(2) + "s");
}

// Biquad (RBJ) para filtros con frecuencia variable.
function biquad(type) {
  let x1 = 0, x2 = 0, y1 = 0, y2 = 0;
  return (x, f, q = 0.707) => {
    const w = (2 * Math.PI * Math.min(f, SR * 0.45)) / SR, cs = Math.cos(w), a = Math.sin(w) / (2 * q);
    let b0, b1, b2;
    if (type === "lp") { b0 = (1 - cs) / 2; b1 = 1 - cs; b2 = b0; }
    else if (type === "hp") { b0 = (1 + cs) / 2; b1 = -(1 + cs); b2 = b0; }
    else { b0 = a; b1 = 0; b2 = -a; } // bandpass
    const a0 = 1 + a, a1 = -2 * cs, a2 = 1 - a;
    const y = (b0 * x + b1 * x1 + b2 * x2 - a1 * y1 - a2 * y2) / a0;
    x2 = x1; x1 = x; y2 = y1; y1 = y;
    return y;
  };
}
const add = (dst, src, at, gain = 1, pan = 0) => {
  const s = Math.floor(at * SR), gl = gain * Math.min(1, 1 - pan), gr = gain * Math.min(1, 1 + pan);
  for (let i = 0; i < src.length && s + i < dst[0].length; i++) {
    if (s + i < 0) continue;
    dst[0][s + i] += src[i] * gl;
    dst[1][s + i] += src[i] * gr;
  }
};

// ---------- instrumentos (mono) ----------
function kick(dur = 0.42) {
  const o = new Float32Array(dur * SR); let ph = 0;
  for (let i = 0; i < o.length; i++) {
    const t = i / SR, f = 45 + 95 * Math.exp(-t * 28);
    ph += (2 * Math.PI * f) / SR;
    o[i] = Math.sin(ph) * Math.exp(-t * 7.5) + (i < 90 ? rand() * 0.25 * (1 - i / 90) : 0);
  }
  return o;
}
function clap(dur = 0.22) {
  const o = new Float32Array(dur * SR), bp = biquad("bp");
  for (let i = 0; i < o.length; i++) {
    const t = i / SR, env = Math.exp(-t * 22) * (t < 0.03 ? 0.6 + 0.4 * Math.sin(t * 900) : 1);
    o[i] = bp(rand(), 1800, 0.9) * env;
  }
  return o;
}
function hat(dur = 0.06) {
  const o = new Float32Array(dur * SR), hp = biquad("hp");
  for (let i = 0; i < o.length; i++) o[i] = hp(rand(), 7500) * Math.exp((-i / SR) * 70);
  return o;
}
function bassNote(freq, dur) {
  const o = new Float32Array(dur * SR), lp = biquad("lp"); let ph = 0;
  for (let i = 0; i < o.length; i++) {
    const t = i / SR; ph += freq / SR;
    const saw = 2 * (ph % 1) - 1, sub = Math.sin(2 * Math.PI * ph);
    const env = Math.min(1, t / 0.008) * Math.exp(-t * 3.2);
    o[i] = (lp(saw, 220 + 900 * Math.exp(-t * 9), 1.1) * 0.6 + sub * 0.55) * env;
  }
  return o;
}
function padChord(notes, dur) {
  const o = new Float32Array(dur * SR), lp = biquad("lp");
  for (let i = 0; i < o.length; i++) {
    const t = i / SR;
    let v = 0;
    for (const n of notes) {
      const f = midi(n);
      v += Math.sin(2 * Math.PI * f * t) + 0.5 * Math.sin(2 * Math.PI * f * 1.003 * t + 1) + 0.35 * Math.sin(2 * Math.PI * f * 0.997 * t + 2);
    }
    const env = Math.min(1, t / 0.35) * Math.min(1, (dur - t) / 0.5);
    o[i] = lp(v / notes.length, 1400) * env;
  }
  return o;
}
function pluck(freq, dur = 0.35) {
  const o = new Float32Array(dur * SR);
  for (let i = 0; i < o.length; i++) {
    const t = i / SR;
    o[i] = (Math.sin(2 * Math.PI * freq * t) + 0.3 * Math.sin(4 * Math.PI * freq * t)) * Math.exp(-t * 9) * Math.min(1, t / 0.004);
  }
  return o;
}

// ---------- música ----------
const BPM = 120, BEAT = 60 / BPM, BAR = BEAT * 4, TOTAL = 55;
const music = buf(TOTAL);
// D – A – Bm – G
const prog = [
  { root: 38, chord: [62, 66, 69, 74] },
  { root: 33, chord: [61, 64, 69, 73] },
  { root: 35, chord: [62, 66, 71, 74] },
  { root: 31, chord: [59, 62, 67, 71] },
];
const K = kick(), C = clap(), H = hat();
const bars = Math.floor(TOTAL / BAR);
for (let b = 0; b < bars; b++) {
  const t0 = b * BAR, p = prog[b % 4];
  const end = t0 >= 48.5; // cierre: queda solo el pad
  add(music, padChord(p.chord, BAR + 0.4), t0, 0.16);
  if (end) continue;
  for (let k = 0; k < 4; k++) {
    const tb = t0 + k * BEAT;
    add(music, K, tb, 0.9);
    if (k % 2 === 1) add(music, C, tb, 0.28, 0.1);
    add(music, H, tb + BEAT / 2, 0.16, -0.3);
    if (b >= 2) add(music, H, tb + BEAT / 4 * 3, 0.07, 0.3);
    add(music, bassNote(midi(p.root), BEAT * 0.9), tb, 0.36);
    add(music, bassNote(midi(p.root + 12), BEAT * 0.4), tb + BEAT / 2, 0.16);
  }
  // arpegio suave desde la sección "cómo funciona"
  if (t0 >= 14) p.chord.forEach((n, i) => add(music, pluck(midi(n + 12)), t0 + i * BEAT, 0.09, i % 2 ? 0.35 : -0.35));
}
// acorde final que se apaga
add(music, padChord([62, 66, 69, 74, 78], 6.5), 48.5, 0.22);
writeWav("music.wav", music, 0.9);

// ---------- efectos ----------
function sfx(name, dur, fn, gain = 1) {
  const o = buf(dur); const g = fn(o);
  writeWav(name, g || o, gain);
}
sfx("whoosh.wav", 0.55, (o) => {
  const bp = biquad("bp");
  for (let i = 0; i < o[0].length; i++) {
    const t = i / SR, u = t / 0.55;
    const v = bp(rand(), 400 + 3600 * Math.sin(Math.PI * u), 1.2) * Math.sin(Math.PI * u) ** 1.5;
    o[0][i] = v * (1 - u * 0.4); o[1][i] = v * (0.6 + u * 0.4);
  }
});
sfx("riser.wav", 1.2, (o) => {
  const bp = biquad("bp");
  for (let i = 0; i < o[0].length; i++) {
    const t = i / SR, u = t / 1.2;
    const v = bp(rand(), 300 + 5000 * u * u, 2) * u ** 2;
    o[0][i] = o[1][i] = v;
  }
});
sfx("hit.wav", 1.1, (o) => {
  const lp = biquad("lp"); let ph = 0;
  for (let i = 0; i < o[0].length; i++) {
    const t = i / SR; ph += (2 * Math.PI * (38 + 60 * Math.exp(-t * 18))) / SR;
    const v = Math.sin(ph) * Math.exp(-t * 3.5) + lp(rand(), 900) * Math.exp(-t * 14) * 0.6;
    o[0][i] = o[1][i] = v;
  }
});
[0, 2, 4, 5, 7, 9].forEach((st, idx) => sfx(`pop${idx + 1}.wav`, 0.22, (o) => {
  let ph = 0; const base = 620 * Math.pow(2, st / 12);
  for (let i = 0; i < o[0].length; i++) {
    const t = i / SR; ph += (2 * Math.PI * base * (1 + 0.9 * Math.exp(-t * 45))) / SR;
    const v = Math.sin(ph) * Math.exp(-t * 26) * Math.min(1, t / 0.002);
    o[0][i] = o[1][i] = v;
  }
}, 0.8));
sfx("tick.wav", 0.04, (o) => {
  for (let i = 0; i < o[0].length; i++) { const t = i / SR; o[0][i] = o[1][i] = Math.sin(2 * Math.PI * 2400 * t) * Math.exp(-t * 180); }
}, 0.5);
sfx("tap.wav", 0.08, (o) => {
  const hp = biquad("hp");
  for (let i = 0; i < o[0].length; i++) { const t = i / SR; o[0][i] = o[1][i] = (hp(rand(), 2000) * 0.6 + Math.sin(2 * Math.PI * 900 * t)) * Math.exp(-t * 90); }
}, 0.6);
sfx("ding.wav", 1.3, (o) => {
  for (let i = 0; i < o[0].length; i++) {
    const t = i / SR;
    const v = (Math.sin(2 * Math.PI * 1318.5 * t) + 0.5 * Math.sin(2 * Math.PI * 1975.5 * t) * Math.exp(-t * 3) + 0.25 * Math.sin(2 * Math.PI * 2637 * t) * Math.exp(-t * 6)) * Math.exp(-t * 3.2) * Math.min(1, t / 0.003);
    o[0][i] = v; o[1][i] = v * 0.9;
  }
}, 0.7);
sfx("shimmer.wav", 1.6, (o) => {
  const notes = [86, 90, 93, 98, 102, 105];
  for (let k = 0; k < 14; k++) {
    const f = midi(notes[k % notes.length]), at = k * 0.045, pan = rand();
    for (let i = Math.floor(at * SR); i < o[0].length; i++) {
      const t = i / SR - at, v = Math.sin(2 * Math.PI * f * t) * Math.exp(-t * 4.5) * Math.min(1, t / 0.004) * 0.3;
      o[0][i] += v * (1 - pan * 0.5); o[1][i] += v * (1 + pan * 0.5);
    }
  }
}, 0.7);
sfx("swish.wav", 0.3, (o) => {
  const hp = biquad("hp");
  for (let i = 0; i < o[0].length; i++) { const t = i / SR, u = t / 0.3; const v = hp(rand(), 2500 + 4000 * u) * Math.sin(Math.PI * u) ** 2; o[0][i] = v * (1 - u); o[1][i] = v * u; }
}, 0.6);
