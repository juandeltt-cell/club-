import React from "react";
import { AbsoluteFill, interpolate, random, useCurrentFrame } from "remotion";
import { LogoReveal } from "../components/Brand";
import { Character } from "../components/Character";
import { HandSparks, HandUnderline } from "../components/Doodle";
import { ChatIcon, GiftIcon, SparkleIcon, StarIcon } from "../components/Icons";
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
        const size = 30 + random(`bs${i}`) * 60;
        const o = interpolate(t, [0, 3, 30, 45], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
        const colors = [T.star, T.mint, T.ink];
        return (
          <div key={i} style={{ position: "absolute", left: cx + Math.cos(a) * d - size / 2, top: cy + Math.sin(a) * d - size / 2, opacity: o, transform: `rotate(${t * (6 + i)}deg)` }}>
            <StarIcon size={size} color={colors[i % 3]} />
          </div>
        );
      })}
    </AbsoluteFill>
  );
};

// ---------- 2a · Revelación del logo + definición (local 0–135) ----------
export const LogoDrop: React.FC = () => {
  const frame = useCurrentFrame();
  const rays = useIn(0, theme.spring.smooth);
  const br = useBreathe(0.012, 16);
  const logoBreathe = frame > 40 ? br : 1;
  return (
    <AbsoluteFill>
      <SceneBg />
      <div style={{ opacity: rays * 0.9 }}>
        <Sunburst color="rgba(5,171,135,0.10)" cy={680} />
      </div>
      <div style={{ position: "absolute", left: 540 - 450, top: 540, transform: `scale(${logoBreathe})` }}>
        <LogoReveal width={900} delay={0} />
      </div>
      <Burst at={2} cx={540} cy={660} />
      <div style={{ position: "absolute", left: 0, right: 0, top: 930 }}>
        <Lines
          lines={["Un nuevo sistema de", "fidelización de clientes", "para restaurantes."]}
          size={80} delay={40} lineGap={6} align="center" accent={["fidelización", "clientes"]}
        />
      </div>
    </AbsoluteFill>
  );
};

// ---------- 2b · Tres líneas, pantalla propia (local 0–161) ----------
const ExplainCard: React.FC<{ at: number; from: -1 | 1; tilt: number; visual: React.ReactNode; text: string; tint: string }> = ({ at, from, tilt, visual, text, tint }) => {
  const p = useIn(at, theme.spring.bouncy);
  const frame = useCurrentFrame();
  const float = frame > at + 20 ? Math.sin((frame + at) / 24) * 4 : 0;
  return (
    <div
      style={{
        display: "flex", alignItems: "center", gap: 34, width: 940, padding: "26px 40px 26px 26px", borderRadius: 44, background: T.white,
        boxShadow: "0 24px 50px -26px rgba(2,49,42,0.45)", border: `3px solid ${T.ink}`,
        opacity: Math.min(1, p * 1.6),
        transform: `translateX(${(1 - p) * from * 700}px) rotate(${interpolate(p, [0, 1], [from * 10, tilt])}deg) translateY(${float}px)`,
      }}
    >
      <div style={{ width: 190, height: 190, borderRadius: 34, background: tint, flex: "none", display: "grid", placeItems: "center", overflow: "hidden", border: `3px solid ${T.ink}` }}>
        {visual}
      </div>
      <div style={{ ...display(58, T.ink, 800), letterSpacing: "-0.02em", lineHeight: 1.08 }}>{text}</div>
    </div>
  );
};

export const Explain: React.FC = () => {
  const frame = useCurrentFrame();
  const lid = Math.max(0, Math.sin(ease(frame, [40, 56], [0, 1]) * Math.PI));
  return (
    <AbsoluteFill>
      <AbsoluteFill style={{ background: T.mint }} />
      <SceneDots color="rgba(255,255,255,0.18)" />
      <div style={{ position: "absolute", left: 70, top: 500, display: "flex", flexDirection: "column", gap: 60, alignItems: "center" }}>
        <ExplainCard at={6} from={-1} tilt={-2} tint={T.starSoft} text="Tus clientes suman estrellitas en cada visita."
          visual={<StarIcon size={130} color={T.star} style={{ transform: `rotate(${ease(frame, [6, 30], [-140, 0])}deg)` }} />} />
        <ExplainCard at={30} from={1} tilt={1.5} tint={T.peach} text="Las canjean por premios que vos elegís."
          visual={<GiftIcon size={130} color={T.ink} stroke={1.8} lid={lid} />} />
        <ExplainCard at={54} from={-1} tilt={-1} tint={T.mintSoft} text="Vos sabés quién es cada uno."
          visual={<div style={{ marginTop: 40 }}><Character body="Coffee" hair="ShortVolumed" face="Smile" width={200} /></div>} />
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

// ---------- 2c · La línea del sistema de IA (local 0–135) ----------
const FlyingBubble: React.FC<{ at: number; label: string; icon: React.ReactNode; tx: number; ty: number; tilt: number }> = ({ at, label, icon, tx, ty, tilt }) => {
  const frame = useCurrentFrame();
  const t = frame - at;
  if (t < 0) return null;
  const p = ease(frame, [at, at + 40], [0, 1], theme.ease.out);
  const x = interpolate(p, [0, 1], [400, tx]);
  const y = interpolate(p, [0, 1], [1320, ty]) + Math.sin(frame / 12 + tx) * 6;
  const o = interpolate(t, [0, 6, 55, 70], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <div
      style={{
        position: "absolute", left: x, top: y, display: "flex", alignItems: "center", gap: 12, background: T.white, borderRadius: "30px 30px 30px 8px",
        padding: "16px 24px", whiteSpace: "nowrap", ...body(34, T.ink, 700), opacity: o, transform: `scale(${interpolate(p, [0, 1], [0.4, 1])}) rotate(${tilt}deg)`,
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
      <div style={{ position: "absolute", left: 540 - 90, top: 300, transform: `scale(${spark}) rotate(${frame * 1.5}deg)` }}>
        <SparkleIcon size={180} color={T.mint} />
      </div>
      <HandSparks x={680} y={270} size={120} at={10} color={T.star} width={9} />
      <div style={{ position: "absolute", left: 0, right: 0, top: 560 }}>
        <Lines lines={["Un sistema de IA", "te sugiere", "qué enviarles…"]} size={104} delay={6} lineGap={6} color={T.cream} align="center" />
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 960 }}>
        <Lines lines={["…y los mensajes salen", "solos por WhatsApp."]} size={74} delay={44} lineGap={6} color={T.cream} align="center" accent={["salen", "solos"]} />
      </div>
      <div style={{ position: "absolute", left: 250, top: 1120 }}>
        <HandUnderline x={0} y={0} w={560} at={62} color={T.star} width={9} />
      </div>
      <FlyingBubble at={70} tx={80} ty={1330} tilt={-6} label="¡Feliz cumple!" icon={<StarIcon size={34} color={T.star} />} />
      <FlyingBubble at={78} tx={560} ty={1440} tilt={5} label="Tu premio te espera" icon={<GiftIcon size={34} color={T.ink} stroke={2} />} />
      <FlyingBubble at={86} tx={180} ty={1570} tilt={-3} label="¡Te extrañamos!" icon={<ChatIcon size={34} color={T.mint} stroke={2} />} />
    </AbsoluteFill>
  );
};
