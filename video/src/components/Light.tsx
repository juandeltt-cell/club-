import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { theme } from "../theme";
import { ease } from "./Motion";

/**
 * Luz de película: dos manchas cálidas desenfocadas que barren la pantalla
 * en modo "screen". Va en la capa de arriba, en momentos clave.
 */
export const LightLeak: React.FC<{ at: number; dur?: number; dir?: 1 | -1; strength?: number }> = ({ at, dur = 40, dir = 1, strength = 0.75 }) => {
  const frame = useCurrentFrame();
  if (frame < at || frame > at + dur) return null;
  const t = ease(frame, [at, at + dur], [0, 1], theme.ease.inOut);
  const o = interpolate(frame, [at, at + dur * 0.25, at + dur * 0.7, at + dur], [0, strength, strength, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const x = dir === 1 ? interpolate(t, [0, 1], [-600, 900]) : interpolate(t, [0, 1], [900, -600]);
  return (
    <AbsoluteFill style={{ pointerEvents: "none", mixBlendMode: "screen", opacity: o }}>
      <div style={{ position: "absolute", left: x, top: -200, width: 900, height: 1500, borderRadius: "50%", filter: "blur(120px)", background: "radial-gradient(circle, rgba(255,180,90,0.95), rgba(255,120,60,0.5) 45%, transparent 70%)", transform: "rotate(-20deg)" }} />
      <div style={{ position: "absolute", left: x * 0.6 + 200, top: 900, width: 700, height: 1100, borderRadius: "50%", filter: "blur(140px)", background: "radial-gradient(circle, rgba(255,226,150,0.9), rgba(245,184,61,0.4) 50%, transparent 72%)" }} />
    </AbsoluteFill>
  );
};
