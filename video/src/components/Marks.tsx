import React from "react";
import { evolvePath } from "@remotion/paths";
import { interpolate, useCurrentFrame } from "remotion";
import { T, theme } from "../theme";
import { ease } from "./Motion";

/**
 * Foco sobre una zona de una captura: oscurece el resto y deja un marco nítido
 * alrededor del dato. Va dentro de un contenedor con `overflow: hidden`.
 */
export const Spotlight: React.FC<{ x: number; y: number; w: number; h: number; at: number; until?: number; radius?: number; dim?: number }> = ({
  x, y, w, h, at, until = 1e9, radius = 26, dim = 0.5,
}) => {
  const frame = useCurrentFrame();
  const p = ease(frame, [at, at + 12], [0, 1], theme.ease.out);
  const gone = ease(frame, [until, until + 8], [0, 1], theme.ease.in);
  if (frame < at || frame > until + 8) return null;
  const o = p * (1 - gone);
  const pad = interpolate(p, [0, 1], [60, 10]);
  return (
    <div
      style={{
        position: "absolute", left: x - pad, top: y - pad, width: w + pad * 2, height: h + pad * 2, borderRadius: radius, pointerEvents: "none",
        boxShadow: `0 0 0 3000px rgba(2,49,42,${dim * o}), 0 0 0 ${6 * o}px ${T.mint}, 0 0 40px ${14 * o}px ${T.mintGlow}`,
      }}
    />
  );
};

/** Subrayado vectorial limpio que se dibuja de izquierda a derecha. */
export const Underline: React.FC<{ w: number; at: number; color?: string; width?: number; style?: React.CSSProperties }> = ({ w, at, color = T.star, width = 12, style }) => {
  const frame = useCurrentFrame();
  const p = ease(frame, [at, at + 12], [0, 1], theme.ease.inOut);
  const d = `M ${width} ${width} Q ${w / 2} ${width * 0.2} ${w - width} ${width}`;
  const ev = evolvePath(p, d);
  return (
    <svg width={w} height={width * 2} style={{ overflow: "visible", display: "block", ...style }}>
      <path d={d} fill="none" stroke={color} strokeWidth={width} strokeLinecap="round" strokeDasharray={ev.strokeDasharray} strokeDashoffset={ev.strokeDashoffset} />
    </svg>
  );
};

/** Líneas de titular que suben desde una máscara (tipografía cinética). */
export const MaskLines: React.FC<{
  lines: string[]; size: number; delay?: number; gap?: number; color?: string; accent?: string[]; accentColor?: string; align?: "left" | "center"; lineHeight?: number;
}> = ({ lines, size, delay = 0, gap = 4, color = T.ink, accent = [], accentColor = T.mint, align = "left", lineHeight = 1.02 }) => {
  const frame = useCurrentFrame();
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: align === "center" ? "center" : "flex-start" }}>
      {lines.map((line, i) => {
        const p = ease(frame, [delay + i * gap, delay + i * gap + 14], [0, 1], theme.ease.out);
        // peso variable: la línea entra fina y se "infla" hasta 800
        const wght = ease(frame, [delay + i * gap + 4, delay + i * gap + 20], [260, 800], theme.ease.out);
        return (
          <div key={i} style={{ overflow: "hidden", paddingBottom: size * 0.12, marginBottom: -size * 0.08 }}>
            <div
              style={{
                fontFamily: theme.fonts.display, fontWeight: wght, fontSize: size, lineHeight, letterSpacing: "-0.035em", color, whiteSpace: "nowrap",
                transform: `translateY(${(1 - p) * 110}%) rotate(${(1 - p) * 4}deg)`, transformOrigin: "0% 100%",
              }}
            >
              {line.split(" ").map((w, wi) => (
                <span key={wi} style={{ color: accent.includes(w.replace(/[.,¿?¡!]/g, "")) ? accentColor : undefined }}>
                  {wi > 0 ? " " : ""}{w}
                </span>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
};
