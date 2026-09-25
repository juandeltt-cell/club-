import React from "react";
import { interpolate, measureSpring, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { theme } from "../theme";

type SpringCfg = { damping: number; stiffness: number; mass: number };

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

/**
 * Resorte que, una vez asentado, vale exactamente 1. Sin esto el resorte oscila
 * décimas de píxel durante segundos y el texto "vibra" al redibujarse.
 */
export const settledSpring = (frame: number, fps: number, config: SpringCfg) => {
  const rest = measureSpring({ fps, config, threshold: 0.004 });
  return frame >= rest ? 1 : spring({ frame, fps, config });
};

/** Progreso 0→1 de un spring que arranca en `delay`. */
export const useIn = (delay = 0, config: SpringCfg = theme.spring.smooth) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return settledSpring(frame - delay, fps, config);
};

/** Progreso 0→1 de una salida con ease-in entre `start` y `start + dur`. */
export const useOut = (start: number, dur = 9) => {
  const frame = useCurrentFrame();
  return interpolate(frame, [start, start + dur], [0, 1], { ...clamp, easing: theme.ease.in });
};

/** Interpolación con easing y clamp obligatorios. */
export const ease = (
  frame: number,
  input: [number, number],
  output: [number, number],
  easing: (t: number) => number = theme.ease.out,
) => interpolate(frame, input, output, { ...clamp, easing });

/** Respiración sutil para lo que queda quieto más de 2 s. */
export const useBreathe = (amp = 0.012, speed = 22) => {
  const frame = useCurrentFrame();
  return 1 + Math.sin(frame / speed) * amp;
};

/** Entrada premium: aparece + sube + escala. Salida opcional más rápida. */
export const Entrance: React.FC<{
  delay?: number;
  exitAt?: number;
  exitDur?: number;
  y?: number;
  x?: number;
  scaleFrom?: number;
  config?: SpringCfg;
  style?: React.CSSProperties;
  children: React.ReactNode;
}> = ({ delay = 0, exitAt, exitDur = 9, y = 40, x = 0, scaleFrom = 0.94, config = theme.spring.smooth, style, children }) => {
  const p = useIn(delay, config);
  const out = useOut(exitAt ?? 1e9, exitDur);
  return (
    <div
      style={{
        opacity: p * (1 - out),
        transform: `translate(${interpolate(p, [0, 1], [x, 0])}px, ${interpolate(p, [0, 1], [y, 0]) - out * 36}px) scale(${interpolate(p, [0, 1], [scaleFrom, 1])})`,
        ...style,
      }}
    >
      {children}
    </div>
  );
};

/** Texto palabra por palabra. `highlight` recibe índices de palabra para pintar en otro color. */
export const WordReveal: React.FC<{
  text: string;
  delay?: number;
  per?: number;
  style?: React.CSSProperties;
  wordStyle?: (i: number, word: string) => React.CSSProperties | undefined;
  exitAt?: number;
  gap?: number;
}> = ({ text, delay = 0, per = 3, style, wordStyle, exitAt, gap = 0.24 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const out = useOut(exitAt ?? 1e9, 8);
  const words = text.split(" ");
  return (
    <div style={{ display: "flex", flexWrap: "wrap", columnGap: `${gap}em`, ...style }}>
      {words.map((w, i) => {
        const p = settledSpring(frame - delay - i * per, fps, theme.spring.snappy);
        return (
          <span
            key={i}
            style={{
              display: "inline-block",
              opacity: p * (1 - out),
              transform: `translateY(${interpolate(p, [0, 1], [0.5, 0]) * 100 - out * 40}%) scale(${interpolate(p, [0, 1], [0.92, 1])})`,
              transformOrigin: "left bottom",
              ...(wordStyle?.(i, w) ?? {}),
            }}
          >
            {w}
          </span>
        );
      })}
    </div>
  );
};

/** Contador animado con cifras tabulares. */
export const Counter: React.FC<{ to: number; delay?: number; from?: number; prefix?: string; style?: React.CSSProperties }> = ({
  to,
  delay = 0,
  from = 0,
  prefix = "",
  style,
}) => {
  const p = useIn(delay, { damping: 30, stiffness: 60, mass: 1 });
  const v = Math.round(interpolate(p, [0, 1], [from, to]));
  return <span style={{ fontVariantNumeric: "tabular-nums", ...style }}>{prefix}{v.toLocaleString("es-AR")}</span>;
};
