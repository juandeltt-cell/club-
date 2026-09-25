// theme.ts — única fuente de colores, tipografías, easings y springs del reel.
import { Easing } from "remotion";

export const theme = {
  colors: {
    cream: "#FDF9F2", // fondo del logo de Mejores Amigos
    creamDeep: "#F4EDDF",
    ink: "#02312A", // tipografía del logo
    inkSoft: "#4F6660",
    inkMuted: "#7D8F8A",
    mint: "#05AB87", // sonrisa y puntitos del logo — color protagonista
    mintDeep: "#047A61",
    mintSoft: "#E2F5EF",
    mintGlow: "rgba(5, 171, 135, 0.35)",
    star: "#F5B83D",
    starSoft: "#FDF1D6",
    peach: "#FDE8D4",
    white: "#FFFFFF",
    line: "#E9E2D4",
    chat: "#EFE7DA", // fondo del chat
    bubbleIn: "#FFFFFF",
    bubbleOut: "#D9F4E9",
  },
  fonts: {
    display: "Bricolage Grotesque",
    body: "Inter",
  },
  ease: {
    out: Easing.bezier(0.16, 1, 0.3, 1),
    inOut: Easing.bezier(0.83, 0, 0.17, 1),
    in: Easing.bezier(0.7, 0, 0.84, 0),
  },
  spring: {
    snappy: { damping: 14, stiffness: 160, mass: 0.6 },
    smooth: { damping: 20, stiffness: 90, mass: 1 },
    bouncy: { damping: 11, stiffness: 170, mass: 0.7 },
    soft: { damping: 26, stiffness: 70, mass: 1 },
  },
  layout: {
    width: 1080,
    height: 1920,
    gutter: 90,
    safeTop: 240,
    safeBottom: 1680,
  },
} as const;

export const T = theme.colors;
