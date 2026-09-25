import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { theme } from "../theme";
import { ease, useIn } from "./Motion";
import { body, display } from "./Type";

// Recetas adaptadas de HyperFrames (heygen-com/hyperframes, Apache 2.0):
// aurora-drift / mesh-gradient-bg (fondos) y liquid-glass-notification (vidrio).

/** Fondo "aurora": manchas de color grandes y desenfocadas que derivan lento (solo fondo, nunca texto). */
export const Aurora: React.FC<{ base: string; colors: [string, string, string]; strength?: number }> = ({ base, colors, strength = 1 }) => {
  const f = useCurrentFrame();
  const blob = (i: number, x: number, y: number, w: number, c: string) => {
    const dx = Math.sin(f / (70 + i * 13) + i * 2) * 140;
    const dy = Math.cos(f / (90 + i * 11) + i) * 120;
    return (
      <div key={i} style={{
        position: "absolute", left: x + dx - w / 2, top: y + dy - w / 2, width: w, height: w, borderRadius: "50%",
        background: `radial-gradient(circle, ${c} 0%, transparent 62%)`, filter: "blur(90px)", opacity: 0.85 * strength, mixBlendMode: "screen",
      }} />
    );
  };
  return (
    <AbsoluteFill style={{ background: base, overflow: "hidden" }}>
      {blob(0, 180, 420, 1300, colors[0])}
      {blob(1, 950, 1100, 1200, colors[1])}
      {blob(2, 420, 1700, 1100, colors[2])}
    </AbsoluteFill>
  );
};

/** Pantalla bloqueada de un celular con la hora, sobre un fondo aurora de marca. */
export const LockScreen: React.FC<{ children?: React.ReactNode }> = ({ children }) => (
  <AbsoluteFill>
    <Aurora base="#0D5A4A" colors={["rgba(40,220,170,1)", "rgba(255,196,70,1)", "rgba(255,140,110,0.8)"]} strength={1.15} />
    <div style={{ position: "absolute", left: 0, right: 0, top: 110, textAlign: "center", ...body(30, "rgba(255,255,255,0.85)", 600) }}>martes 9 de marzo</div>
    <div style={{ position: "absolute", left: 0, right: 0, top: 140, textAlign: "center", ...display(170, "rgba(255,255,255,0.95)", 700), letterSpacing: "-0.02em" }}>20:41</div>
    {children}
  </AbsoluteFill>
);

/**
 * Notificación "liquid glass": vidrio esmerilado que cae con resorte,
 * borde con luz y un reflejo especular que la cruza una vez.
 */
export const GlassNotification: React.FC<{ at: number; title: string; text: string; app?: string; top?: number }> = ({ at, title, text, app = "WhatsApp", top = 390 }) => {
  const frame = useCurrentFrame();
  const p = useIn(at, theme.spring.bouncy);
  const sheen = ease(frame, [at + 10, at + 34], [0, 1], theme.ease.inOut);
  if (frame < at) return null;
  return (
    <div
      style={{
        position: "absolute", left: 22, right: 22, top, borderRadius: 38, padding: "22px 24px", overflow: "hidden",
        background: "rgba(255,255,255,0.20)", backdropFilter: "blur(26px) saturate(1.9)", WebkitBackdropFilter: "blur(26px) saturate(1.9)",
        border: "1.5px solid rgba(255,255,255,0.55)",
        boxShadow: "inset 0 1.5px 0 rgba(255,255,255,0.7), inset 0 -1px 0 rgba(255,255,255,0.15), 0 24px 50px -18px rgba(0,0,0,0.45)",
        transform: `translateY(${interpolate(p, [0, 1], [-220, 0])}px) scale(${interpolate(p, [0, 1], [0.92, 1])})`, opacity: Math.min(1, p * 2),
      }}
    >
      {/* reflejo especular */}
      <div style={{ position: "absolute", top: -40, bottom: -40, width: 160, left: interpolate(sheen, [0, 1], [-220, 640]), background: "linear-gradient(100deg, transparent, rgba(255,255,255,0.45), transparent)", transform: "skewX(-18deg)", opacity: sheen > 0 && sheen < 1 ? 1 : 0 }} />
      <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
        <div style={{ width: 52, height: 52, borderRadius: 14, background: "#25D366", display: "grid", placeItems: "center", boxShadow: "0 4px 10px rgba(0,0,0,0.2)" }}>
          <svg width={32} height={32} viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 3.5a8.5 8.5 0 0 0-7.4 12.7L3.5 20.5l4.4-1.1A8.5 8.5 0 1 0 12 3.5Z" />
          </svg>
        </div>
        <div style={{ flex: 1, ...body(24, "rgba(255,255,255,0.8)", 700), textTransform: "uppercase", letterSpacing: "0.06em" }}>{app}</div>
        <div style={{ ...body(24, "rgba(255,255,255,0.75)", 600) }}>ahora</div>
      </div>
      <div style={{ ...body(36, "#fff", 800), marginTop: 14, textShadow: "0 1px 6px rgba(0,0,0,0.25)" }}>{title}</div>
      <div style={{ ...body(33, "#fff", 600), lineHeight: 1.3, marginTop: 4, textShadow: "0 1px 6px rgba(0,0,0,0.25)" }}>{text}</div>
    </div>
  );
};

