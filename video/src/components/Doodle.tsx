import React, { useMemo } from "react";
import rough from "roughjs";
import { useCurrentFrame } from "remotion";
import { T, theme } from "../theme";
import { ease } from "./Motion";

// Trazos "a mano" con rough.js: se generan una vez (semilla fija) y se dibujan con pathLength.
const gen = rough.generator();
type Paths = { d: string; stroke: string; strokeWidth: number; fill?: string }[];

const useRough = (key: string, build: () => ReturnType<typeof gen.path>) =>
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useMemo(() => gen.toPaths(build()) as Paths, [key]);

const Draw: React.FC<{ paths: Paths; at: number; dur?: number; color?: string; width?: number; until?: number; w: number; h: number; style?: React.CSSProperties }> = ({
  paths, at, dur = 14, color = T.mint, width = 7, until = 1e9, w, h, style,
}) => {
  const frame = useCurrentFrame();
  const p = ease(frame, [at, at + dur], [0, 1], theme.ease.inOut);
  const out = ease(frame, [until, until + 6], [0, 1], theme.ease.in);
  if (frame < at || frame > until + 6) return null;
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} style={{ position: "absolute", overflow: "visible", pointerEvents: "none", opacity: 1 - out, ...style }}>
      {paths.map((p0, i) => (
        <path key={i} d={p0.d} fill="none" stroke={color} strokeWidth={width} strokeLinecap="round" strokeLinejoin="round"
          pathLength={1} strokeDasharray={1} strokeDashoffset={1 - Math.min(1, Math.max(0, p * paths.length - i))} />
      ))}
    </svg>
  );
};

type Base = { x: number; y: number; at: number; dur?: number; color?: string; width?: number; until?: number; seed?: number };

/** Óvalo a mano alrededor de un área. */
export const HandCircle: React.FC<Base & { w: number; h: number }> = ({ x, y, w, h, seed = 3, ...rest }) => {
  const paths = useRough(`c${w}${h}${seed}`, () => gen.ellipse(w / 2 + 10, h / 2 + 10, w, h, { roughness: 1.6, bowing: 1.2, seed, strokeWidth: 1, curveStepCount: 14 }) as never);
  return <Draw paths={paths} w={w + 20} h={h + 20} style={{ left: x - 10, top: y - 10 }} {...rest} />;
};

/** Subrayado a mano. */
export const HandUnderline: React.FC<Base & { w: number }> = ({ x, y, w, seed = 5, ...rest }) => {
  const paths = useRough(`u${w}${seed}`, () => gen.curve([[4, 10], [w * 0.3, 4], [w * 0.65, 12], [w - 4, 6]], { roughness: 1.4, seed }) as never);
  return <Draw paths={paths} w={w} h={20} style={{ left: x, top: y }} {...rest} />;
};

/** Flecha curva a mano, de (0,0) a (dx,dy) relativos a (x,y). */
export const HandArrow: React.FC<Base & { dx: number; dy: number; bend?: number }> = ({ x, y, dx, dy, bend = 0.3, seed = 7, ...rest }) => {
  const paths = useRough(`a${dx}${dy}${bend}${seed}`, () => {
    const mx = dx / 2 - dy * bend, my = dy / 2 + dx * bend;
    const ang = Math.atan2(dy - my, dx - mx), L = 34;
    const h1: [number, number] = [dx - L * Math.cos(ang - 0.5), dy - L * Math.sin(ang - 0.5)];
    const h2: [number, number] = [dx - L * Math.cos(ang + 0.5), dy - L * Math.sin(ang + 0.5)];
    const ox = Math.max(0, -Math.min(dx, mx, 0)) + 40, oy = Math.max(0, -Math.min(dy, my, 0)) + 40;
    const sh = (p: [number, number]): [number, number] => [p[0] + ox, p[1] + oy];
    return gen.path(
      `M${sh([0, 0])} Q${sh([mx, my])} ${sh([dx, dy])} M${sh(h1)} L${sh([dx, dy])} L${sh(h2)}`,
      { roughness: 1.2, seed },
    ) as never;
  });
  const ox = Math.max(0, -Math.min(dx, 0)) + 40, oy = Math.max(0, -Math.min(dy, 0)) + 40;
  return <Draw paths={paths} w={Math.abs(dx) + 200} h={Math.abs(dy) + 200} style={{ left: x - ox, top: y - oy }} {...rest} />;
};

/** Destellos a mano (tres rayitas) para enfatizar. */
export const HandSparks: React.FC<Base & { size?: number; rotate?: number }> = ({ x, y, size = 90, rotate = 0, seed = 9, ...rest }) => {
  const paths = useRough(`s${size}${seed}`, () =>
    gen.path(`M${size * 0.5} ${size * 0.45} L${size * 0.5} ${size * 0.05} M${size * 0.62} ${size * 0.52} L${size * 0.92} ${size * 0.28} M${size * 0.66} ${size * 0.7} L${size * 0.98} ${size * 0.72}`, { roughness: 1, seed }) as never,
  );
  return <Draw paths={paths} w={size} h={size} dur={10} style={{ left: x, top: y, transform: `rotate(${rotate}deg)` }} {...rest} />;
};

/** Signo de pregunta a mano. */
export const HandQuestion: React.FC<Base & { size?: number; rotate?: number }> = ({ x, y, size = 120, rotate = 0, seed = 11, ...rest }) => {
  const s = size;
  const paths = useRough(`q${s}${seed}`, () =>
    gen.path(`M${s * 0.25} ${s * 0.3} C${s * 0.25} ${s * 0.02} ${s * 0.8} ${s * 0.02} ${s * 0.78} ${s * 0.32} C${s * 0.76} ${s * 0.55} ${s * 0.5} ${s * 0.5} ${s * 0.5} ${s * 0.72} M${s * 0.5} ${s * 0.9} L${s * 0.51} ${s * 0.93}`, { roughness: 1.1, seed }) as never,
  );
  return <Draw paths={paths} w={s} h={s} style={{ left: x, top: y, transform: `rotate(${rotate}deg)` }} {...rest} />;
};
