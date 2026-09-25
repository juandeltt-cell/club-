import React from "react";
import { noise2D } from "@remotion/noise";
import { Img, interpolate, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { T, theme } from "../theme";
import { ease, settledSpring, useIn } from "./Motion";

// Íconos 3D (Microsoft Fluent Emoji, MIT) en public/emoji.
export type EmojiName =
  | "star" | "glowing_star" | "birthday_cake" | "shortcake" | "wrapped_gift" | "hot_beverage" | "party_popper" | "sparkles"
  | "speech_balloon" | "mobile_phone" | "robot" | "tear-off_calendar" | "chart_increasing" | "bell" | "red_heart" | "eyes"
  | "fork_and_knife_with_plate" | "trophy" | "clinking_glasses" | "rocket" | "magnifying_glass_tilted_left" | "envelope_with_arrow"
  | "love_letter" | "hundred_points" | "fire" | "heart_with_ribbon" | "growing_heart" | "pot_of_food" | "pizza" | "hamburger"
  | "money_bag" | "bar_chart" | "crown" | "magic_wand" | "counterclockwise_arrows_button" | "clockwise_vertical_arrows"
  | "alarm_clock" | "spiral_calendar" | "smiling_face_with_heart-eyes" | "partying_face" | "face_with_monocle" | "ticket"
  | "admission_tickets" | "light_bulb" | "brain" | "balloon";

/**
 * Objeto 3D: entra con resorte (escala + giro), flota con ruido suave
 * y proyecta una sombra de contacto. Si hay x/y se posiciona en absoluto.
 */
export const Emoji3D: React.FC<{
  name: EmojiName; size: number; at?: number; x?: number; y?: number; rotate?: number; float?: number; depth?: number; style?: React.CSSProperties; out?: number;
}> = ({ name, size, at = 0, x, y, rotate = 0, float = 1, depth = 1, style, out }) => {
  const frame = useCurrentFrame();
  const p = useIn(at, theme.spring.bouncy);
  const gone = out !== undefined ? ease(frame, [out, out + 8], [0, 1], theme.ease.in) : 0;
  if (frame < at) return null;
  const seed = `${name}${x ?? 0}${y ?? 0}`;
  const dx = noise2D(`x${seed}`, frame / 70, 0) * 14 * float;
  const dy = noise2D(`y${seed}`, frame / 70, 0) * 16 * float;
  const dr = noise2D(`r${seed}`, frame / 90, 0) * 6 * float;
  const tilt = noise2D(`t${seed}`, frame / 80, 0) * 14 * float;
  const s = interpolate(p, [0, 1], [0.2, 1]) * (1 - gone * 0.6);
  return (
    <div
      style={{
        position: x !== undefined ? "absolute" : "relative", left: x, top: y, width: size, height: size, pointerEvents: "none",
        opacity: Math.min(1, p * 2) * (1 - gone), perspective: 800,
        transform: `translate(${dx}px, ${dy}px) scale(${s}) rotate(${rotate + dr + (1 - p) * -40}deg)`,
        ...style,
      }}
    >
      <Img
        src={staticFile(`emoji/${name}.png`)}
        style={{
          width: size, height: size, display: "block", transform: `rotateY(${tilt}deg)`,
          // borde blanco tipo sticker troquelado + sombra
          filter: `drop-shadow(3px 0 0 #fff) drop-shadow(-3px 0 0 #fff) drop-shadow(0 3px 0 #fff) drop-shadow(0 -3px 0 #fff) drop-shadow(0 ${size * 0.08 * depth}px ${size * 0.1 * depth}px rgba(2,49,42,${0.22 + 0.1 * depth}))`,
        }}
      />
    </div>
  );
};

/** Contador tipo cuentakilómetros: las cifras ruedan hasta `to` (0–99). */
export const Odometer: React.FC<{ to: number; delay?: number; size: number; color: string; style?: React.CSSProperties }> = ({ to, delay = 0, size, color, style }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = settledSpring(frame - delay, fps, { damping: 28, stiffness: 50, mass: 1 });
  const v = p * to;
  const h = size * 0.92;
  const strip = (items: string[], pos: number) => (
    <div style={{ height: h, overflow: "hidden", display: "inline-block" }}>
      <div style={{ transform: `translateY(${-pos * h}px)` }}>
        {items.map((d, i) => <div key={i} style={{ height: h, lineHeight: `${h}px` }}>{d}</div>)}
      </div>
    </div>
  );
  const ones = Array.from({ length: to + 1 }, (_, i) => String(i % 10));
  // las decenas ruedan mientras las unidades pasan de 9 a 0
  const tensPos = Math.floor(v / 10) + Math.max(0, (v % 10) - 9);
  const tensItems = ["", "1", "2", "3", "4", "5", "6", "7", "8", "9"];
  return (
    <div style={{ display: "inline-flex", fontVariantNumeric: "tabular-nums", color, fontSize: size, fontFamily: theme.fonts.display, fontWeight: 800, letterSpacing: "-0.04em", ...style }}>
      {to >= 10 && strip(tensItems, tensPos)}
      {strip(ones, v)}
    </div>
  );
};

/** Cinta de texto que corre, inclinada (estilo social). */
export const Marquee: React.FC<{ text: string; y: number; rotate?: number; bg?: string; color?: string; speed?: number; size?: number; at?: number }> = ({
  text, y, rotate = -4, bg = T.ink, color = T.cream, speed = 4, size = 54, at = 0,
}) => {
  const frame = useCurrentFrame();
  const p = ease(frame, [at, at + 14], [0, 1], theme.ease.out);
  const unit = `${text}  ✦  `;
  const reps = 8;
  return (
    <div
      style={{
        position: "absolute", left: -200, right: -200, top: y, background: bg, padding: `${size * 0.32}px 0`, overflow: "hidden",
        transform: `rotate(${rotate}deg) scaleX(${p})`, boxShadow: "0 20px 40px -20px rgba(2,49,42,0.5)",
      }}
    >
      <div style={{ whiteSpace: "nowrap", transform: `translateX(${-((frame * speed) % (size * unit.length * 0.62))}px)`, fontFamily: theme.fonts.display, fontWeight: 800, fontSize: size, color, letterSpacing: "0.02em" }}>
        {Array.from({ length: reps }).map((_, i) => <span key={i}>{unit}</span>)}
      </div>
    </div>
  );
};

/**
 * Inclinación 3D (perspectiva): va de `from` a `to` dentro de `range` y queda quieta,
 * así el texto no "vibra" al redibujarse cuadro a cuadro.
 */
export const Tilt3D: React.FC<{ from?: [number, number]; to?: [number, number]; range: [number, number]; children: React.ReactNode; style?: React.CSSProperties }> = ({
  from = [-22, 8], to = [-8, 3], range, children, style,
}) => {
  const frame = useCurrentFrame();
  const p = ease(frame, range, [0, 1], theme.ease.inOut);
  const ry = interpolate(p, [0, 1], [from[0], to[0]]);
  const rx = interpolate(p, [0, 1], [from[1], to[1]]);
  return (
    <div style={{ perspective: 2200, ...style }}>
      <div style={{ transform: `rotateY(${ry}deg) rotateX(${rx}deg)`, transformStyle: "preserve-3d" }}>{children}</div>
    </div>
  );
};

/** Canto del teléfono: capas apiladas detrás de la pantalla para que tenga espesor al girar. */
export const PhoneBody: React.FC<{ width: number; children: React.ReactNode }> = ({ width, children }) => {
  const h = width * 2.05;
  const r = width * 0.14;
  return (
    <div style={{ position: "relative", width, height: h, transformStyle: "preserve-3d" }}>
      {Array.from({ length: 16 }).map((_, i) => (
        <div key={i} style={{ position: "absolute", inset: 0, borderRadius: r, background: i === 15 ? "#0A1714" : i % 3 === 0 ? "#3A5A52" : "#27433C", transform: `translateZ(${-(i + 1) * 1.6}px)` }} />
      ))}
      <div style={{ position: "relative", transform: "translateZ(0.5px)" }}>{children}</div>
    </div>
  );
};

/** Sombra de texto en capas: tipografía "extruida" con volumen. */
export const extrude = (depth: number, color: string, glow?: string) =>
  [...Array.from({ length: depth }, (_, i) => `${(i + 1) * 0.7}px ${i + 1}px 0 ${color}`), `${depth * 0.7}px ${depth + 8}px 24px rgba(2,49,42,0.25)`, ...(glow ? [`0 0 60px ${glow}`] : [])].join(", ");
