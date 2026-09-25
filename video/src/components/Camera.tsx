import React from "react";
import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";

// Movimientos de cámara entre escenas, adaptados de las recetas de HyperFrames
// (heygen-com/hyperframes, Apache 2.0): zoom-through-transition y parallax-device-dive.
// Las escenas se superponen `T` cuadros: la nueva entra encima mientras la anterior sale debajo.
// Fuera de esos cuadros la transformación es exactamente la identidad (texto quieto, sin vibrar).

export const T = 12;
export type Move = "push" | "zoom" | "dive" | "none";

const inOut = Easing.bezier(0.65, 0, 0.35, 1); // power3.inOut
const out4 = Easing.bezier(0.16, 1, 0.3, 1); // power4.out
const in4 = Easing.bezier(0.7, 0, 0.84, 0); // power4.in
const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

const enterStyle = (move: Move, f: number): React.CSSProperties | null => {
  if (f >= T || move === "none") return null;
  if (move === "push") {
    const p = interpolate(f, [0, T], [0, 1], { ...clamp, easing: inOut });
    return { clipPath: `inset(0 0 0 ${(1 - p) * 100}%)`, transform: `translateX(${(1 - p) * 80}px) scale(${1.05 - 0.05 * p})` };
  }
  // zoom y dive: la escena nueva llega desde cerca de cámara y entra en foco
  const p = interpolate(f, [0, T], [0, 1], { ...clamp, easing: out4 });
  return { opacity: Math.min(1, p * 2.2), transform: `scale(${1.3 - 0.3 * p})`, filter: `blur(${(1 - p) * 18}px)` };
};

const exitStyle = (move: Move, f: number, dur: number, origin: string): React.CSSProperties | null => {
  const t = f - dur;
  if (t < 0 || move === "none") return null;
  if (move === "push") {
    const p = interpolate(t, [0, T], [0, 1], { ...clamp, easing: inOut });
    return { transform: `translateX(${-p * 120}px) scale(${1 - 0.06 * p})`, filter: `blur(${p * 6}px) brightness(${1 - 0.25 * p})` };
  }
  if (move === "dive") {
    const p = interpolate(t, [0, T], [0, 1], { ...clamp, easing: in4 });
    return { transform: `scale(${1 + p * 5})`, transformOrigin: origin, filter: `blur(${p * 10}px)`, opacity: 1 - interpolate(t, [T * 0.6, T], [0, 1], clamp) };
  }
  const p = interpolate(t, [0, T], [0, 1], { ...clamp, easing: in4 });
  return { transform: `scale(${1 + p * 0.5})`, filter: `blur(${p * 20}px)`, opacity: 1 - p };
};

/** Envuelve una escena: entra con `enter`, y en sus `T` cuadros extra sale con `exit`. */
export const CameraMove: React.FC<{ enter: Move; exit: Move; dur: number; origin?: string; children: React.ReactNode }> = ({ enter, exit, dur, origin = "50% 50%", children }) => {
  const f = useCurrentFrame();
  const style = enterStyle(enter, f) ?? exitStyle(exit, f, dur, origin) ?? {};
  return <AbsoluteFill style={{ ...style, transformOrigin: style.transformOrigin ?? "50% 50%" }}>{children}</AbsoluteFill>;
};

/**
 * Entrada "depth stack": la tarjeta viene desde el fondo del espacio, girada en 3D,
 * y se asienta plana. Al terminar queda exactamente en su lugar.
 */
export const DepthIn: React.FC<{ at: number; dur?: number; from?: { rx?: number; ry?: number; z?: number; y?: number }; style?: React.CSSProperties; children: React.ReactNode }> = ({
  at, dur = 22, from = {}, style, children,
}) => {
  const f = useCurrentFrame();
  const { rx = 16, ry = -18, z = -420, y = 60 } = from;
  if (f < at) return null;
  if (f >= at + dur) return <div style={style}>{children}</div>;
  const p = interpolate(f, [at, at + dur], [0, 1], { ...clamp, easing: out4 });
  return (
    <div style={{ perspective: 1400, ...style }}>
      <div
        style={{
          opacity: Math.min(1, p * 2),
          transform: `translateY(${(1 - p) * y}px) translateZ(${(1 - p) * z}px) rotateX(${(1 - p) * rx}deg) rotateY(${(1 - p) * ry}deg)`,
          filter: `blur(${(1 - p) * 8}px)`,
        }}
      >
        {children}
      </div>
    </div>
  );
};
