import React from "react";
import { Img, interpolate, staticFile, useCurrentFrame } from "remotion";
import { T, theme } from "../theme";
import { ease, useIn } from "./Motion";

// Geometría del logo recortado (public/brand/ma-logo.png, 1500×390).
const LOGO_W = 1500;
const LOGO_H = 390;
const DOTS = [
  { x: 348, y: 43 },
  { x: 1105, y: 43 },
];
const SMILE = "M487 233 Q743 428 1000 232";

/**
 * Revela el logo de Mejores Amigos "dibujándolo": primero la sonrisa, después caen
 * los dos puntitos y las letras aparecen con una máscara de izquierda a derecha.
 */
export const LogoReveal: React.FC<{ width: number; delay?: number; style?: React.CSSProperties }> = ({ width, delay = 0, style }) => {
  const frame = useCurrentFrame();
  const k = width / LOGO_W;
  const h = LOGO_H * k;
  const draw = ease(frame, [delay, delay + 16], [0, 1]);
  const reveal = ease(frame, [delay + 12, delay + 34], [0, 1], theme.ease.inOut);
  const overlayOut = ease(frame, [delay + 34, delay + 40], [1, 0]);
  const scaleIn = useIn(delay, theme.spring.smooth);
  const pathLen = 620;
  return (
    <div style={{ position: "relative", width, height: h, transform: `scale(${interpolate(scaleIn, [0, 1], [0.94, 1])})`, ...style }}>
      <Img
        src={staticFile("brand/ma-logo.png")}
        style={{ position: "absolute", inset: 0, width, height: h, clipPath: `inset(-2% ${100 - reveal * 100}% -2% 0)` }}
      />
      <svg
        width={width} height={h} viewBox={`0 0 ${LOGO_W} ${LOGO_H}`}
        style={{ position: "absolute", inset: 0, overflow: "visible", opacity: overlayOut }}
      >
        <path d={SMILE} fill="none" stroke={T.mint} strokeWidth={17} strokeLinecap="round"
          strokeDasharray={pathLen} strokeDashoffset={pathLen * (1 - draw)} />
        {DOTS.map((d, i) => (
          <DroppingDot key={i} x={d.x} y={d.y} delay={delay + 6 + i * 4} />
        ))}
      </svg>
    </div>
  );
};

const DroppingDot: React.FC<{ x: number; y: number; delay: number }> = ({ x, y, delay }) => {
  const p = useIn(delay, theme.spring.bouncy);
  return <circle cx={x} cy={y - (1 - p) * 140} r={16 * Math.min(1, p * 1.4)} fill={T.mint} opacity={Math.min(1, p * 2)} />;
};

/** Sonrisa aislada (motivo de transición), dibujada con progreso 0→1. */
export const Smile: React.FC<{ width: number; progress: number; stroke?: number; color?: string; dots?: number }> = ({
  width, progress, stroke = 22, color = T.mint, dots = 0,
}) => {
  const h = width * 0.42;
  const len = width * 1.25;
  return (
    <svg width={width} height={h} viewBox={`0 0 ${width} ${h}`} style={{ display: "block", overflow: "visible" }}>
      <path
        d={`M${stroke} ${h * 0.35} Q${width / 2} ${h * 1.25} ${width - stroke} ${h * 0.35}`}
        fill="none" stroke={color} strokeWidth={stroke} strokeLinecap="round"
        strokeDasharray={len} strokeDashoffset={len * (1 - progress)}
      />
      {dots > 0 && [0.22, 0.78].map((fx, i) => (
        <circle key={i} cx={width * fx} cy={-h * 0.25 - (1 - Math.min(1, dots)) * 80} r={stroke * 0.95} fill={color} opacity={Math.min(1, dots * 2)} />
      ))}
    </svg>
  );
};

/** Firma de Luz Sur: su logo original sobre su fondo negro, en una píldora discreta. */
export const LuzSurBadge: React.FC<{ width: number }> = ({ width }) => (
  <div style={{ background: "#000", borderRadius: width, padding: `${width * 0.04}px ${width * 0.1}px`, display: "inline-flex" }}>
    <Img src={staticFile("brand/luzsur-negro.png")} style={{ width, height: width * (250 / 940), display: "block" }} />
  </div>
);
