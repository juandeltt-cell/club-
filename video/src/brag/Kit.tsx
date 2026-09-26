import React from "react";
import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";
import { T, theme } from "../theme";

// Lenguaje visual tomado de latent-spaces/brag: campos de color plano, tipografía
// gigante, una palabra clave dentro de un bloque, etiquetas monoespaciadas, cortes secos.

export const MONO = "JetBrains Mono";
const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const expoOut = Easing.bezier(0.16, 1, 0.3, 1);

export type FieldColor = "ink" | "mint" | "cream";
export const FIELD: Record<FieldColor, { bg: string; fg: string; hlBg: string; hlFg: string; soft: string }> = {
  ink: { bg: T.ink, fg: T.cream, hlBg: T.mint, hlFg: T.ink, soft: "rgba(253,249,242,0.55)" },
  mint: { bg: T.mint, fg: T.ink, hlBg: T.ink, hlFg: T.cream, soft: "rgba(2,49,42,0.6)" },
  cream: { bg: T.cream, fg: T.ink, hlBg: T.mint, hlFg: T.ink, soft: "rgba(2,49,42,0.5)" },
};

/** Campo de color plano con una luz muy suave, para que no sea un plano muerto. */
export const Field: React.FC<{ c: FieldColor; children?: React.ReactNode }> = ({ c, children }) => (
  <AbsoluteFill style={{ background: FIELD[c].bg, overflow: "hidden" }}>
    <AbsoluteFill style={{ background: `radial-gradient(ellipse at 30% 20%, ${c === "ink" ? "rgba(5,171,135,0.16)" : "rgba(255,255,255,0.14)"}, transparent 60%)` }} />
    {children}
  </AbsoluteFill>
);

export type W = string | { t: string; hl?: boolean; it?: boolean; soft?: boolean };

/**
 * Palabras que entran de a una: suben, pasan de desenfocadas a nítidas y quedan
 * quietas. `hl` = palabra dentro de un bloque que se pinta de izquierda a derecha.
 */
export const Words: React.FC<{
  lines: W[][]; size: number; c: FieldColor; at?: number; per?: number; align?: "left" | "center"; lineHeight?: number; style?: React.CSSProperties;
}> = ({ lines, size, c, at = 0, per = 3, align = "left", lineHeight = 1.0, style }) => {
  const f = useCurrentFrame();
  const pal = FIELD[c];
  let k = 0;
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: align === "center" ? "center" : "flex-start", ...style }}>
      {lines.map((line, li) => (
        <div key={li} style={{ display: "flex", gap: size * 0.26, justifyContent: align === "center" ? "center" : "flex-start", lineHeight, marginBottom: size * 0.02 }}>
          {line.map((w0, wi) => {
            const w = typeof w0 === "string" ? { t: w0 } : w0;
            const start = at + k++ * per;
            const p = interpolate(f, [start, start + 10], [0, 1], { ...clamp, easing: expoOut });
            const paint = interpolate(f, [start + 5, start + 13], [0, 1], { ...clamp, easing: expoOut });
            const color = w.hl ? (paint > 0.5 ? pal.hlFg : pal.fg) : w.soft ? pal.soft : pal.fg;
            return (
              <span key={wi} style={{ position: "relative", display: "inline-block", overflow: "visible" }}>
                {w.hl && (
                  <span style={{ position: "absolute", left: -size * 0.12, right: -size * 0.12, top: size * 0.1, bottom: size * 0.02, background: pal.hlBg, borderRadius: size * 0.1, transform: `scaleX(${paint})`, transformOrigin: "left center", overflow: "hidden" }}>
                    {/* reflejo de luz que cruza el bloque una vez (idea de "Animated Shiny Text", 21st.dev) */}
                    <span style={{ position: "absolute", top: 0, bottom: 0, width: "40%", left: `${interpolate(f, [start + 12, start + 30], [-50, 130], clamp)}%`, background: "linear-gradient(100deg, transparent, rgba(255,255,255,0.45), transparent)", transform: "skewX(-20deg)" }} />
                  </span>
                )}
                <span
                  style={{
                    position: "relative", display: "inline-block", fontFamily: theme.fonts.display, fontWeight: 800, fontSize: size, letterSpacing: "-0.045em", color,
                    opacity: Math.min(1, p * 1.6), filter: p < 1 ? `blur(${(1 - p) * 12}px)` : undefined,
                    transform: `translateY(${(1 - p) * size * 0.45}px)${w.it ? " skewX(-9deg)" : ""}`,
                  }}
                >
                  {w.t}
                </span>
              </span>
            );
          })}
        </div>
      ))}
    </div>
  );
};

/** Etiqueta chica monoespaciada, con un punto que late. */
export const Mono: React.FC<{ text: string; c: FieldColor; at?: number; dot?: boolean; size?: number; style?: React.CSSProperties }> = ({ text, c, at = 0, dot = true, size = 30, style }) => {
  const f = useCurrentFrame();
  const o = interpolate(f, [at, at + 6], [0, 1], clamp);
  const pal = FIELD[c];
  const n = Math.floor(interpolate(f, [at, at + 12], [0, text.length], clamp));
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 14, fontFamily: MONO, fontWeight: 700, fontSize: size, letterSpacing: "0.14em", color: c === "mint" ? T.ink : T.mint, opacity: o, ...style }}>
      {dot && <span style={{ width: size * 0.4, height: size * 0.4, borderRadius: "50%", background: c === "mint" ? T.ink : T.mint, opacity: Math.floor(f / 8) % 2 ? 1 : 0.35 }} />}
      <span>{text.slice(0, n)}</span>
      <span style={{ color: pal.soft }}>{n < text.length ? "▍" : ""}</span>
    </div>
  );
};

/** Cinta de palabras gigantes que pasan de fondo (contorno o relleno suave). */
export const Ticker: React.FC<{ words: string[]; y: number; size: number; speed: number; color: string; outline?: boolean; opacity?: number; rotate?: number }> = ({
  words, y, size, speed, color, outline = true, opacity = 1, rotate = 0,
}) => {
  const f = useCurrentFrame();
  const text = Array.from({ length: 6 }, () => words.join("  ·  ")).join("  ·  ");
  const x = speed > 0 ? -4000 + Math.round(f * speed) : -Math.round(f * -speed);
  return (
    <div style={{ position: "absolute", left: 0, top: y, whiteSpace: "nowrap", transform: `translateX(${x}px) rotate(${rotate}deg)`, opacity }}>
      <span style={{ fontFamily: theme.fonts.display, fontWeight: 800, fontSize: size, letterSpacing: "-0.03em", color: outline ? "transparent" : color, WebkitTextStroke: outline ? `3px ${color}` : undefined }}>{text}</span>
    </div>
  );
};

/** Texto que se tipea con cursor. */
export const Typed: React.FC<{ text: string; at: number; cps?: number; caret?: string }> = ({ text, at, cps = 1.6, caret = T.mint }) => {
  const f = useCurrentFrame();
  const n = Math.max(0, Math.min(text.length, Math.floor((f - at) * cps)));
  const on = n < text.length || Math.floor(f / 10) % 2 === 0;
  return (
    <span>
      {text.slice(0, n)}
      <span style={{ display: "inline-block", width: "0.08em", height: "0.95em", marginLeft: 4, verticalAlign: "-0.1em", background: caret, opacity: f >= at && on ? 1 : 0 }} />
    </span>
  );
};
