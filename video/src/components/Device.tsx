import React from "react";
import { Img, interpolate, staticFile, useCurrentFrame } from "remotion";
import { T, theme } from "../theme";
import { ease } from "./Motion";

/** Teléfono dibujado en código (sin marca de fabricante). */
export const Phone: React.FC<{ width: number; children: React.ReactNode; style?: React.CSSProperties; screenBg?: string }> = ({
  width, children, style, screenBg = T.white,
}) => {
  const bezel = width * 0.034;
  const h = width * 2.05;
  const r = width * 0.14;
  return (
    <div
      style={{
        position: "relative", width, height: h, borderRadius: r, background: "#0E1F1B", padding: bezel,
        boxShadow: "0 50px 90px -30px rgba(2,49,42,0.55), 0 18px 40px -18px rgba(2,49,42,0.35), inset 0 0 0 3px rgba(255,255,255,0.06)",
        ...style,
      }}
    >
      <div style={{ position: "relative", width: "100%", height: "100%", borderRadius: r - bezel, overflow: "hidden", background: screenBg }}>
        {children}
        <div
          style={{
            position: "absolute", top: width * 0.03, left: "50%", transform: "translateX(-50%)",
            width: width * 0.3, height: width * 0.075, borderRadius: width, background: "#0E1F1B",
          }}
        />
      </div>
    </div>
  );
};

/** QR determinístico que se arma módulo por módulo en diagonal. */
export const Qr: React.FC<{ size: number; progress: number; color?: string }> = ({ size, progress, color = T.ink }) => {
  const N = 25;
  const cell = size / N;
  const finder = (r: number, c: number) => {
    const inBox = (r0: number, c0: number) => r >= r0 && r < r0 + 7 && c >= c0 && c < c0 + 7;
    for (const [r0, c0] of [[0, 0], [0, N - 7], [N - 7, 0]]) {
      if (inBox(r0, c0)) {
        const rr = r - r0, cc = c - c0;
        return rr === 0 || rr === 6 || cc === 0 || cc === 6 || (rr >= 2 && rr <= 4 && cc >= 2 && cc <= 4) ? 1 : 0;
      }
    }
    return -1;
  };
  const cells: React.ReactNode[] = [];
  for (let r = 0; r < N; r++) {
    for (let c = 0; c < N; c++) {
      const f = finder(r, c);
      const on = f >= 0 ? f === 1 : ((r * 7 + c * 13 + r * c * 3) % 5) < 2;
      if (!on) continue;
      const wave = (r + c) / (2 * N - 2);
      const p = Math.max(0, Math.min(1, (progress - wave * 0.75) / 0.25));
      cells.push(
        <rect key={`${r}-${c}`} x={c * cell + (cell * (1 - p)) / 2} y={r * cell + (cell * (1 - p)) / 2}
          width={cell * p * 0.98} height={cell * p * 0.98} rx={cell * 0.18} fill={color} />,
      );
    }
  }
  return <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ display: "block" }}>{cells}</svg>;
};

/** Indicador de toque (dedo): se achica al presionar y deja una onda. */
export const Tap: React.FC<{ x: number; y: number; at: number; color?: string }> = ({ x, y, at, color = T.ink }) => {
  const frame = useCurrentFrame();
  const appear = ease(frame, [at - 12, at - 4], [0, 1]);
  const press = frame < at ? 1 : ease(frame, [at, at + 4], [0.78, 1]);
  const ripple = ease(frame, [at, at + 16], [0, 1]);
  const gone = ease(frame, [at + 12, at + 20], [1, 0], theme.ease.in);
  if (frame < at - 12 || frame > at + 22) return null;
  return (
    <div style={{ position: "absolute", left: x, top: y, width: 0, height: 0, pointerEvents: "none", zIndex: 50 }}>
      <div style={{
        position: "absolute", width: 170, height: 170, left: -85, top: -85, borderRadius: "50%",
        border: `5px solid ${color}`, opacity: (1 - ripple) * 0.5 * (frame >= at ? 1 : 0), transform: `scale(${0.4 + ripple})`,
      }} />
      <div style={{
        position: "absolute", width: 96, height: 96, left: -48, top: -48, borderRadius: "50%",
        background: "rgba(2,49,42,0.28)", border: "4px solid rgba(255,255,255,0.9)",
        boxShadow: "0 10px 24px rgba(2,49,42,0.35)",
        opacity: appear * gone, transform: `scale(${interpolate(appear, [0, 1], [1.4, 1]) * press})`,
      }} />
    </div>
  );
};

/**
 * Ventana con una captura real del panel. Muestra una franja de la imagen
 * (desde `srcTop`) escalada a `width`. Si `frames` tiene varios estados,
 * `index` (float) funde entre el estado actual y el siguiente.
 */
export const PanelShot: React.FC<{
  frames: string[];
  index?: number;
  srcWidth: number;
  srcTop?: number;
  srcHeight: number;
  width: number;
  radius?: number;
  zoom?: number;
  style?: React.CSSProperties;
  children?: React.ReactNode;
}> = ({ frames, index = 0, srcWidth, srcTop = 0, srcHeight, width, radius = 40, zoom = 1, style, children }) => {
  const k = width / srcWidth;
  const h = srcHeight * k;
  const i0 = Math.max(0, Math.min(frames.length - 1, Math.floor(index)));
  const i1 = Math.min(frames.length - 1, i0 + 1);
  const t = Math.max(0, Math.min(1, index - i0));
  const imgStyle = (o: number): React.CSSProperties => ({
    position: "absolute", left: 0, top: -srcTop * k, width, opacity: o, display: "block",
  });
  return (
    <div
      style={{
        position: "relative", width, height: h, borderRadius: radius, overflow: "hidden", background: T.white,
        boxShadow: "0 40px 80px -30px rgba(2,49,42,0.40), 0 10px 30px -12px rgba(2,49,42,0.18)",
        border: `2px solid ${T.line}`, ...style,
      }}
    >
      <div style={{ position: "absolute", inset: 0, transform: `scale(${zoom})`, transformOrigin: "50% 30%" }}>
        <Img src={staticFile(frames[i0])} style={imgStyle(1)} />
        {i1 !== i0 && t > 0 && <Img src={staticFile(frames[i1])} style={imgStyle(t)} />}
      </div>
      {children}
    </div>
  );
};

/** Anillo menta que se dibuja alrededor de un elemento para resaltarlo. */
export const HighlightRing: React.FC<{ x: number; y: number; w: number; h: number; at: number; radius?: number }> = ({ x, y, w, h, at, radius = 28 }) => {
  const frame = useCurrentFrame();
  const p = ease(frame, [at, at + 14], [0, 1]);
  const per = 2 * (w + h);
  return (
    <svg style={{ position: "absolute", left: x - 10, top: y - 10, overflow: "visible", pointerEvents: "none" }} width={w + 20} height={h + 20}>
      <rect x={4} y={4} width={w + 12} height={h + 12} rx={radius} fill="none" stroke={T.mint} strokeWidth={7}
        strokeDasharray={per + 60} strokeDashoffset={(per + 60) * (1 - p)} strokeLinecap="round"
        style={{ filter: `drop-shadow(0 0 14px ${T.mintGlow})` }} />
    </svg>
  );
};
