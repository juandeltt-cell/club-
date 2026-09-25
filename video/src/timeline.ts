// Cortes del reel en cuadros (30 fps, 120 BPM → 15 cuadros por pulso).
export const FPS = 30;
export const s = (seconds: number) => Math.round(seconds * FPS);

export const SCENES = {
  hook: { from: 0, dur: 120 },
  whatIs: { from: 120, dur: 330 },
  step1: { from: 450, dur: 120 },
  step2: { from: 570, dur: 150 },
  step3: { from: 720, dur: 150 },
  benefitsTitle: { from: 870, dur: 60 },
  b1: { from: 930, dur: 120 },
  b2: { from: 1050, dur: 180 },
  b3: { from: 1230, dur: 120 },
  b4: { from: 1350, dur: 120 },
  closing: { from: 1470, dur: 180 },
} as const;

export const TOTAL_FRAMES = 1650;
