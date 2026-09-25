import React from "react";
import { AbsoluteFill, interpolate, Sequence, useCurrentFrame } from "remotion";
import { LogoReveal, LuzSurBadge } from "../components/Brand";
import { Character } from "../components/Character";
import { MaskLines } from "../components/Marks";
import { ArrowIcon } from "../components/Icons";
import { SceneBg } from "../components/Layers";
import { useBreathe, useIn, WordReveal } from "../components/Motion";
import { body, display, Lines } from "../components/Type";
import { T, theme } from "../theme";

const PhoneGlyph: React.FC<{ size: number; color: string }> = ({ size, color }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 3.5a8.5 8.5 0 0 0-7.4 12.7L3.5 20.5l4.4-1.1A8.5 8.5 0 1 0 12 3.5Z" />
    <path d="M9 8.5c0 3.5 2.5 6.5 6.5 6.8l1-1.6-2-1-1 .9c-1.1-.5-2-1.4-2.5-2.5l.9-1-1-2-1.6 1c-.2.1-.3.3-.3.4Z" fill={color} stroke="none" />
  </svg>
);
const CameraGlyph: React.FC<{ size: number; color: string }> = ({ size, color }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round">
    <rect x="3.5" y="3.5" width="17" height="17" rx="5" />
    <circle cx="12" cy="12" r="4" />
    <circle cx="17" cy="7" r="0.9" fill={color} stroke="none" />
  </svg>
);

const Friend: React.FC<{ at: number; x: number; body: string; hair: string; face: string; width: number; flip?: boolean; facialHair?: string }> = ({ at, x, width, flip, ...peep }) => {
  const p = useIn(at, theme.spring.bouncy);
  const frame = useCurrentFrame();
  const bob = frame > at + 20 ? Math.sin((frame + x) / 10) * 6 : 0;
  return (
    <div style={{ position: "absolute", left: x, bottom: -40, transform: `translateY(${(1 - p) * 500 + bob}px)` }}>
      <Character {...peep} width={width} flip={flip} />
    </div>
  );
};

export const PUNCH_DUR = 54;

/** Remate: tres golpes al ritmo. */
const Punch: React.FC = () => (
  <AbsoluteFill>
    <SceneBg variant="ink" />
    <div style={{ position: "absolute", left: 90, top: 560 }}>
      <MaskLines lines={["Más frecuencia.", "Más clientes.", "Más ventas."]} size={128} delay={2} gap={9} color={T.cream} accent={["frecuencia", "clientes", "ventas"]} />
    </div>
  </AbsoluteFill>
);

// Escena final (local 0–180): remate (0–54) + marca y contacto
export const Closing: React.FC = () => (
  <AbsoluteFill>
    <Punch />
    <Sequence from={PUNCH_DUR}>
      <Brand />
    </Sequence>
  </AbsoluteFill>
);

const Brand: React.FC = () => {
  const frame = useCurrentFrame();
  const breathe = useBreathe(0.012, 20);
  const btn = useIn(50, theme.spring.bouncy);
  const contact = useIn(62, theme.spring.smooth);
  const sign = useIn(76, theme.spring.smooth);
  const arrow = Math.sin(frame / 6) * 6;
  return (
    <AbsoluteFill>
      <SceneBg />
      <div style={{ position: "absolute", left: 540 - 420, top: 280, transform: `scale(${frame > 40 ? breathe : 1})` }}>
        <LogoReveal width={840} delay={2} />
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 590 }}>
        <Lines lines={["Convertí a tus clientes", "en mejores amigos."]} size={84} delay={18} lineGap={5} align="center" accent={["mejores", "amigos."]} />
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 810, display: "flex", justifyContent: "center" }}>
        <WordReveal text="Sin apps · Sin tarjetas · Solo WhatsApp" delay={34} per={2} style={{ ...body(42, T.inkSoft, 700), justifyContent: "center" }} wordStyle={(_, w) => (w === "·" ? { color: T.mint } : undefined)} />
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 910, display: "flex", justifyContent: "center" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 18, background: T.ink, borderRadius: 100, padding: "28px 52px", opacity: btn, transform: `scale(${interpolate(btn, [0, 1], [0.6, 1])})`, boxShadow: "0 26px 50px -22px rgba(2,49,42,0.7)" }}>
          <span style={{ ...display(52, T.cream, 700) }}>Lo instalamos en tu restó</span>
          <ArrowIcon size={52} color={T.mint} style={{ transform: `translateX(${arrow}px)` }} />
        </div>
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 1070, display: "flex", flexDirection: "column", alignItems: "center", gap: 14, opacity: contact, transform: `translateY(${(1 - contact) * 30}px)` }}>
        <div style={{ display: "flex", alignItems: "center", gap: 16, ...display(56, T.ink, 800) }}>
          <PhoneGlyph size={58} color={T.mint} /> 2254447706
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 16, ...display(56, T.ink, 800) }}>
          <CameraGlyph size={58} color={T.mint} /> @luz.sur.arg
        </div>
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 1280, display: "flex", alignItems: "center", justifyContent: "center", gap: 18, opacity: sign }}>
        <span style={{ ...body(30, T.inkMuted, 600) }}>un producto de</span>
        <LuzSurBadge width={230} />
      </div>
      {/* amigos festejando */}
      <Friend at={14} x={-40} body="PointingUp" hair="Bun" face="SmileBig" width={330} />
      <Friend at={19} x={230} body="Device" hair="Long" face="LoveGrin" width={320} />
      <Friend at={24} x={500} body="Coffee" hair="ShortVolumed" face="SmileTeeth" facialHair="FullMedium" width={320} flip />
      <Friend at={29} x={770} body="Explaining" hair="Afro" face="SmileBig" width={330} flip />
    </AbsoluteFill>
  );
};
