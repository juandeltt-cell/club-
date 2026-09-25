import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { T, theme } from "../theme";
import { ease } from "./Motion";
import { StarIcon } from "./Icons";

// Transiciones de marca: cubren la pantalla hasta el cuadro `at` (donde ocurre el corte) y la destapan después.
type W = { at: number; dur?: number; color?: string };

const useCover = (at: number, dur: number) => {
  const frame = useCurrentFrame();
  const inP = ease(frame, [at - dur, at], [0, 1], theme.ease.inOut);
  const outP = ease(frame, [at, at + dur], [0, 1], theme.ease.inOut);
  const active = frame >= at - dur && frame <= at + dur;
  return { inP, outP, active, frame };
};

/** Círculo que nace en (cx,cy), tapa y se abre hacia afuera en otro color. */
export const CircleWipe: React.FC<W & { cx?: number; cy?: number }> = ({ at, dur = 9, color = T.mint, cx = 540, cy = 960 }) => {
  const { inP, outP, active } = useCover(at, dur);
  if (!active) return null;
  const R = 2300;
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <AbsoluteFill style={{ background: color, clipPath: `circle(${inP * R}px at ${cx}px ${cy}px)` }} />
      {outP > 0 && <AbsoluteFill style={{ background: color, clipPath: `circle(${R}px at ${cx}px ${cy}px)`, WebkitMaskImage: `radial-gradient(circle at ${cx}px ${cy}px, transparent ${outP * R}px, black ${outP * R + 1}px)` }} />}
    </AbsoluteFill>
  );
};

/** Tres franjas diagonales de colores de marca que barren la pantalla. */
export const BarsWipe: React.FC<W & { colors?: string[] }> = ({ at, dur = 10, colors = [T.star, T.mint, T.ink] }) => {
  const frame = useCurrentFrame();
  if (frame < at - dur - 6 || frame > at + dur + 6) return null;
  return (
    <AbsoluteFill style={{ pointerEvents: "none", overflow: "hidden" }}>
      {colors.map((c, i) => {
        const d = i * 3;
        const p = ease(frame, [at - dur - 6 + d, at + dur - 6 + d], [0, 1], theme.ease.inOut);
        const x = -2400 + p * 4800;
        return <div key={i} style={{ position: "absolute", top: -600, width: 1500, height: 3100, left: x, background: c, transform: "skewX(-18deg)" }} />;
      })}
    </AbsoluteFill>
  );
};

/** Una estrella gigante que gira, tapa y se va. */
export const StarWipe: React.FC<W> = ({ at, dur = 10, color = T.star }) => {
  const { inP, outP, active, frame } = useCover(at, dur);
  if (!active) return null;
  const s = frame <= at ? inP * 9 : 9 + outP * 9;
  const o = frame <= at ? 1 : 1 - outP;
  return (
    <AbsoluteFill style={{ pointerEvents: "none", display: "grid", placeItems: "center" }}>
      <div style={{ transform: `scale(${s}) rotate(${(inP + outP) * 90}deg)`, opacity: o }}>
        <StarIcon size={420} color={color} />
      </div>
    </AbsoluteFill>
  );
};

/** Barrido lateral con desenfoque de movimiento (whip pan). */
export const SlashWipe: React.FC<W & { dir?: 1 | -1 }> = ({ at, dur = 8, color = T.ink, dir = 1 }) => {
  const frame = useCurrentFrame();
  if (frame < at - dur || frame > at + dur) return null;
  const p = ease(frame, [at - dur, at + dur], [0, 1], theme.ease.inOut);
  const x = dir * (-1700 + p * 3400);
  return (
    <AbsoluteFill style={{ pointerEvents: "none", overflow: "hidden" }}>
      <div style={{ position: "absolute", top: -400, left: x - 300, width: 1700, height: 2800, background: color, transform: "skewX(-12deg)", filter: "blur(6px)" }} />
    </AbsoluteFill>
  );
};

/** Destello blanco para golpes fuertes (la subida de la canción). */
export const Flash: React.FC<{ at: number; dur?: number }> = ({ at, dur = 10 }) => {
  const frame = useCurrentFrame();
  const o = frame < at ? 0 : ease(frame, [at, at + dur], [0.95, 0], theme.ease.out);
  if (frame < at || frame > at + dur) return null;
  return <AbsoluteFill style={{ background: "#fff", opacity: o, pointerEvents: "none" }} />;
};

/** Fundido a oscuro, suave (para el corte de la canción). */
export const DipToInk: React.FC<W> = ({ at, dur = 14 }) => {
  const frame = useCurrentFrame();
  if (frame < at - dur || frame > at + dur) return null;
  const o = frame <= at ? ease(frame, [at - dur, at], [0, 1], theme.ease.inOut) : ease(frame, [at, at + dur], [1, 0], theme.ease.inOut);
  return <AbsoluteFill style={{ background: T.ink, opacity: o, pointerEvents: "none" }} />;
};
