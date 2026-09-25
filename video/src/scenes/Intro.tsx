import React from "react";
import { AbsoluteFill, interpolate, random, useCurrentFrame } from "remotion";
import { LogoReveal } from "../components/Brand";
import { noise2D } from "@remotion/noise";
import { Underline } from "../components/Marks";
import { Img, staticFile } from "remotion";
import { Emoji3D } from "../components/Emoji";
import { SceneBg } from "../components/Layers";
import { ease, useBreathe, useIn, WordReveal } from "../components/Motion";
import { body, display, Lines } from "../components/Type";
import { T, theme } from "../theme";

/** Rayos de sol que giran lento detrás del logo. */
const Sunburst: React.FC<{ color: string; opacity?: number; cx?: number; cy?: number }> = ({ color, opacity = 0.5, cx = 540, cy = 700 }) => {
  const frame = useCurrentFrame();
  const n = 18;
  return (
    <svg width={1080} height={1920} style={{ position: "absolute", inset: 0, opacity }}>
      <g transform={`translate(${cx} ${cy}) rotate(${frame * 0.25})`}>
        {Array.from({ length: n }).map((_, i) => (
          <path key={i} d="M0 0 L-110 -1600 L110 -1600 Z" fill={color} transform={`rotate(${(360 / n) * i})`} />
        ))}
      </g>
    </svg>
  );
};

/** Estallido de estrellitas en la subida de la canción. */
const Burst: React.FC<{ at: number; cx: number; cy: number; count?: number }> = ({ at, cx, cy, count = 26 }) => {
  const frame = useCurrentFrame();
  const t = frame - at;
  if (t < 0 || t > 45) return null;
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      {Array.from({ length: count }).map((_, i) => {
        const a = random(`ba${i}`) * Math.PI * 2;
        const v = 22 + random(`bv${i}`) * 30;
        const d = v * t * (1 - t / 90);
        const size = 50 + random(`bs${i}`) * 70;
        const o = interpolate(t, [0, 3, 30, 45], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
        const names = ["star", "star", "sparkles", "red_heart", "glowing_star"];
        return (
          <div key={i} style={{ position: "absolute", left: cx + Math.cos(a) * d - size / 2, top: cy + Math.sin(a) * d - size / 2, opacity: o, transform: `rotate(${t * (6 + i)}deg)` }}>
            <Img src={staticFile(`emoji/${names[i % names.length]}.png`)} style={{ width: size, height: size, filter: "drop-shadow(0 8px 10px rgba(2,49,42,0.25))" }} />
          </div>
        );
      })}
    </AbsoluteFill>
  );
};

// ---------- 2a · "Con Mejores Amigos, sí." + definición (local 0–135) ----------
export const LogoDrop: React.FC = () => {
  const frame = useCurrentFrame();
  const rays = useIn(0, theme.spring.smooth);
  const br = useBreathe(0.012, 16);
  const logoBreathe = frame > 40 ? br : 1;
  const si = useIn(12, theme.spring.bouncy);
  const answerOut = ease(frame, [58, 66], [0, 1], theme.ease.in);
  return (
    <AbsoluteFill>
      <SceneBg />
      <div style={{ opacity: rays * 0.9 }}>
        <Sunburst color="rgba(5,171,135,0.10)" cy={960} />
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 640, display: "flex", justifyContent: "center", opacity: 1 - answerOut, transform: `translateY(${-answerOut * 40}px)` }}>
        <WordReveal text="Con" delay={0} style={{ ...display(150, T.ink) }} />
      </div>
      <div style={{ position: "absolute", left: 540 - 450, top: 960 - 117, transform: `scale(${logoBreathe})` }}>
        <LogoReveal width={900} delay={0} />
      </div>
      <Burst at={2} cx={540} cy={960} count={18} />
      <div
        style={{
          position: "absolute", left: 0, right: 0, top: 1100, display: "flex", justifyContent: "center", ...display(190, T.mint),
          opacity: Math.min(1, si * 1.5) * (1 - answerOut), transform: `scale(${interpolate(si, [0, 1], [0.4, 1])}) rotate(${interpolate(si, [0, 1], [-12, -3])}deg) translateY(${answerOut * 40}px)`,
          textShadow: `0 0 50px ${T.mintGlow}`,
        }}
      >
        sí.
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 1150 }}>
        <Lines
          lines={["Un nuevo sistema de", "fidelización de clientes", "para restaurantes."]}
          size={80} delay={66} lineGap={5} align="center" accent={["fidelización", "clientes"]}
        />
      </div>
    </AbsoluteFill>
  );
};

/** Trama de puntos para darle textura a los fondos de color. */
export const SceneDots: React.FC<{ color: string }> = ({ color }) => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill
      style={{
        backgroundImage: `radial-gradient(${color} 3px, transparent 3.5px)`, backgroundSize: "44px 44px",
        backgroundPosition: `${frame * 0.4}px ${frame * 0.8}px`,
      }}
    />
  );
};

// ---------- 2b · La línea del sistema de IA (local 0–135) ----------
const FlyingBubble: React.FC<{ at: number; label: string; icon: React.ReactNode; tx: number; ty: number; tilt: number }> = ({ at, label, icon, tx, ty, tilt }) => {
  const frame = useCurrentFrame();
  const t = frame - at;
  if (t < 0) return null;
  const p = ease(frame, [at, at + 22], [0, 1], theme.ease.out);
  const x = interpolate(p, [0, 1], [400, tx]) + noise2D(`bx${tx}`, frame / 50, 0) * 14;
  const y = interpolate(p, [0, 1], [1320, ty]) + noise2D(`by${ty}`, frame / 50, 0) * 14;
  const o = interpolate(t, [0, 6], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <div
      style={{
        position: "absolute", left: x, top: y, display: "flex", alignItems: "center", gap: 14, background: T.white, borderRadius: "34px 34px 34px 8px",
        padding: "14px 30px 14px 18px", whiteSpace: "nowrap", ...body(40, T.ink, 700), opacity: o, transform: `scale(${interpolate(p, [0, 1], [0.4, 1])}) rotate(${tilt}deg)`,
        boxShadow: "0 16px 30px -12px rgba(0,0,0,0.5)",
      }}
    >
      {icon}
      {label}
    </div>
  );
};

export const AiLine: React.FC = () => {
  const frame = useCurrentFrame();
  const spark = useIn(0, theme.spring.bouncy);
  return (
    <AbsoluteFill>
      <SceneBg variant="ink" />
      <div style={{ position: "absolute", left: 540 - 80, top: 300, transform: `scale(${spark})` }}>
        <Emoji3D name="sparkles" size={160} at={0} float={1.2} />
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 500 }}>
        <Lines lines={["Un sistema de IA", "te sugiere", "qué enviarles…"]} size={104} delay={4} lineGap={5} color={T.cream} align="center" />
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 890 }}>
        <Lines lines={["…y los mensajes salen", "solos por WhatsApp."]} size={74} delay={24} lineGap={5} color={T.cream} align="center" accent={["salen", "solos"]} />
      </div>
      <div style={{ position: "absolute", left: 250, top: 1062 }}>
        <Underline w={580} at={36} />
      </div>
      <FlyingBubble at={42} tx={70} ty={1240} tilt={-5} label="¡Feliz cumple!" icon={<Emoji3D name="birthday_cake" size={54} float={0} depth={0.4} />} />
      <FlyingBubble at={48} tx={470} ty={1390} tilt={4} label="Tu premio te espera" icon={<Emoji3D name="wrapped_gift" size={54} float={0} depth={0.4} />} />
      <FlyingBubble at={54} tx={140} ty={1550} tilt={-3} label="¡Te extrañamos!" icon={<Emoji3D name="red_heart" size={54} float={0} depth={0.4} />} />
    </AbsoluteFill>
  );
};
