import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { T } from "../theme";

/** Capa 1 — fondo con malla de color en movimiento lento (nunca un plano liso). */
export const SceneBg: React.FC<{ variant?: "cream" | "ink" }> = ({ variant = "cream" }) => {
  const frame = useCurrentFrame();
  const d1 = Math.sin(frame / 55) * 60;
  const d2 = Math.cos(frame / 70) * 50;
  const dark = variant === "ink";
  return (
    <AbsoluteFill style={{ background: dark ? T.ink : T.cream, overflow: "hidden" }}>
      <div
        style={{
          position: "absolute", width: 1400, height: 1400, borderRadius: "50%",
          top: -620, left: -420 + d1, filter: "blur(60px)",
          background: `radial-gradient(circle, ${dark ? "rgba(5,171,135,0.30)" : "rgba(5,171,135,0.16)"}, transparent 62%)`,
        }}
      />
      <div
        style={{
          position: "absolute", width: 1200, height: 1200, borderRadius: "50%",
          bottom: -560, right: -420 - d2, filter: "blur(70px)",
          background: `radial-gradient(circle, ${dark ? "rgba(245,184,61,0.14)" : "rgba(245,184,61,0.16)"}, transparent 64%)`,
        }}
      />
      <div
        style={{
          position: "absolute", width: 900, height: 900, borderRadius: "50%",
          top: 760 + d2 * 0.6, left: 520 + d1 * 0.4, filter: "blur(80px)",
          background: `radial-gradient(circle, ${dark ? "rgba(253,249,242,0.05)" : "rgba(2,49,42,0.05)"}, transparent 65%)`,
        }}
      />
    </AbsoluteFill>
  );
};

/** Capa 4 — grade cálido que unifica capturas y gráficos. */
export const Grade: React.FC = () => (
  <AbsoluteFill style={{ pointerEvents: "none" }}>
    <AbsoluteFill style={{ backgroundColor: "#F5B83D", mixBlendMode: "soft-light", opacity: 0.06 }} />
    <AbsoluteFill
      style={{ background: "linear-gradient(180deg, rgba(2,49,42,0.04), transparent 20%, transparent 82%, rgba(2,49,42,0.06))" }}
    />
  </AbsoluteFill>
);

/** Capa 5a — grano procedural (sin archivos). */
export const Grain: React.FC = () => {
  const frame = useCurrentFrame();
  const noise =
    "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='220' height='220'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2'/%3E%3C/filter%3E%3Crect width='220' height='220' filter='url(%23n)' opacity='0.5'/%3E%3C/svg%3E\")";
  return (
    <AbsoluteFill
      style={{
        pointerEvents: "none", backgroundImage: noise, backgroundSize: "220px",
        backgroundPosition: `${(frame * 7) % 220}px ${(frame * 13) % 220}px`,
        opacity: 0.06, mixBlendMode: "multiply",
      }}
    />
  );
};

/** Capa 5b — viñeta (la más alta). */
export const Vignette: React.FC = () => (
  <AbsoluteFill
    style={{ pointerEvents: "none", background: "radial-gradient(ellipse at center, transparent 62%, rgba(60,40,10,0.10) 100%)" }}
  />
);
