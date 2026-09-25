import React from "react";
import { AbsoluteFill, interpolate, interpolateColors, useCurrentFrame } from "remotion";
import { LogoReveal } from "../components/Brand";
import { GiftIcon, PersonIcon, SparkleIcon, StarIcon } from "../components/Icons";
import { SceneBg } from "../components/Layers";
import { ease, useBreathe, useIn, useOut, WordReveal } from "../components/Motion";
import { display, Lines } from "../components/Type";
import { T, theme } from "../theme";

// Escena 2 · Qué es Mejores Amigos (local 0–330 = absoluto 120–450)
export const WhatIs: React.FC = () => {
  const frame = useCurrentFrame();
  const exit = ease(frame, [315, 328], [0, 1], theme.ease.in);

  // Logo: grande al centro → chico arriba
  const shrink = ease(frame, [75, 92], [0, 1], theme.ease.inOut);
  const logoW = 900;
  const logoScale = interpolate(shrink, [0, 1], [1, 0.6]);
  const logoTop = interpolate(shrink, [0, 1], [640, 250]);

  // Definición: entra en 2b y se achica/sube en 2c
  const defShrink = ease(frame, [165, 182], [0, 1], theme.ease.inOut);
  const accent = interpolateColors(defShrink, [0, 1], [T.mint, T.mintDeep]);

  return (
    <AbsoluteFill style={{ transform: `translateX(${-exit * 220}px)`, opacity: 1 - exit }}>
      <SceneBg />
      <div style={{ position: "absolute", left: 540 - logoW / 2, top: logoTop, transform: `scale(${logoScale})`, transformOrigin: "50% 0%" }}>
        <LogoReveal width={logoW} delay={2} />
      </div>

      {/* 2a · La respuesta */}
      {frame < 90 && (
        <div style={{ position: "absolute", left: 0, right: 0, top: 1010, display: "flex", justifyContent: "center" }}>
          <WordReveal
            text="Con Mejores Amigos, sí."
            delay={44}
            per={4}
            exitAt={75}
            style={{ ...display(84), justifyContent: "center" }}
            wordStyle={(i) => (i === 3 ? { color: T.mint } : undefined)}
          />
        </div>
      )}

      {/* 2b · La definición */}
      {frame >= 80 && (
        <div
          style={{
            position: "absolute", left: 90, width: 980, whiteSpace: "nowrap", top: interpolate(defShrink, [0, 1], [640, 470]),
            transform: `scale(${interpolate(defShrink, [0, 1], [1, 0.56])})`, transformOrigin: "0% 0%",
          }}
        >
          <Lines
            lines={["Un nuevo sistema", "de fidelización", "de clientes", "para restaurantes."]}
            size={112}
            delay={85}
            lineGap={6}
            accent={["fidelización", "clientes"]}
            accentColor={accent}
          />
        </div>
      )}

      {/* 2c · Qué hace, en cuatro líneas */}
      {frame >= 175 && (
        <div style={{ position: "absolute", left: 90, right: 70, top: 800, display: "flex", flexDirection: "column", gap: 26 }}>
          <Row at={180} icon={<RowStar />} text="Tus clientes suman estrellitas en cada visita." />
          <Row at={205} icon={<RowGift />} text="Las canjean por premios que vos elegís." />
          <Row at={230} icon={<PersonIcon size={62} color={T.ink} stroke={2} />} text="Vos sabés quién es cada uno." />
          <KeyRow at={255} />
        </div>
      )}
    </AbsoluteFill>
  );
};

const Row: React.FC<{ at: number; icon: React.ReactNode; text: string }> = ({ at, icon, text }) => {
  const p = useIn(at, theme.spring.smooth);
  const ico = useIn(at + 4, theme.spring.bouncy);
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 30, opacity: p, transform: `translateX(${(1 - p) * -80}px) scale(${interpolate(p, [0, 1], [0.95, 1])})` }}>
      <div
        style={{
          width: 116, height: 116, borderRadius: "50%", background: T.white, border: `3px solid ${T.line}`, flex: "none",
          display: "grid", placeItems: "center", transform: `scale(${interpolate(ico, [0, 1], [0.5, 1])})`,
          boxShadow: "0 10px 24px -12px rgba(2,49,42,0.3)",
        }}
      >
        {icon}
      </div>
      <div style={{ ...display(54, T.ink, 700), letterSpacing: "-0.02em", lineHeight: 1.12 }}>{text}</div>
    </div>
  );
};

const RowStar: React.FC = () => {
  const frame = useCurrentFrame();
  const r = ease(frame, [180, 200], [-120, 0]);
  return <StarIcon size={64} color={T.star} style={{ transform: `rotate(${r}deg)` }} />;
};
const RowGift: React.FC = () => {
  const frame = useCurrentFrame();
  const lid = Math.max(0, Math.sin(ease(frame, [212, 226], [0, 1]) * Math.PI));
  return <GiftIcon size={62} color={T.ink} stroke={2} lid={lid} />;
};

/** La línea clave: el sistema de IA sugiere y los mensajes salen solos. */
const KeyRow: React.FC<{ at: number }> = ({ at }) => {
  const frame = useCurrentFrame();
  const p = useIn(at, theme.spring.bouncy);
  const breathe = useBreathe(0.01, 18);
  const glow = 0.5 + 0.5 * Math.sin(frame / 10);
  const settled = frame > at + 20 ? breathe : 1;
  return (
    <div
      style={{
        marginTop: 10, display: "flex", alignItems: "center", gap: 30, padding: "34px 36px", borderRadius: 40,
        background: T.ink, opacity: Math.min(1, p * 1.4),
        transform: `translateX(${(1 - p) * -80}px) scale(${interpolate(p, [0, 1], [0.85, 1]) * settled})`,
        boxShadow: `0 30px 70px -26px rgba(2,49,42,0.6), 0 0 ${40 + glow * 30}px ${T.mintGlow}`,
      }}
    >
      <div style={{ width: 116, height: 116, borderRadius: "50%", background: T.mint, flex: "none", display: "grid", placeItems: "center" }}>
        <SparkleIcon size={66} color={T.white} style={{ transform: `rotate(${Math.sin(frame / 14) * 8}deg)` }} />
      </div>
      <div style={{ ...display(50, T.cream, 700), letterSpacing: "-0.02em", lineHeight: 1.14 }}>
        Un sistema de IA te sugiere qué enviarles, y los mensajes <span style={{ color: T.mint }}>salen solos</span> por WhatsApp.
      </div>
    </div>
  );
};

