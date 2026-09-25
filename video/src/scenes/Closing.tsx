import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { LogoReveal, LuzSurBadge } from "../components/Brand";
import { ArrowIcon } from "../components/Icons";
import { SceneBg } from "../components/Layers";
import { useBreathe, useIn, WordReveal } from "../components/Motion";
import { body, display, Lines } from "../components/Type";
import { T, theme } from "../theme";

// Escena 5 · Cierre (local 0–180 = absoluto 1470–1650)
export const Closing: React.FC = () => {
  const frame = useCurrentFrame();
  const breathe = useBreathe(0.012, 20);
  const btn = useIn(92, theme.spring.bouncy);
  const sign = useIn(122, theme.spring.smooth);
  const arrow = Math.sin(frame / 6) * 6;
  const logoFloat = frame > 50 ? breathe : 1;
  return (
    <AbsoluteFill>
      <SceneBg />
      <div style={{ position: "absolute", left: 540 - 440, top: 470, transform: `scale(${logoFloat})` }}>
        <LogoReveal width={880} delay={2} />
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 820 }}>
        <Lines lines={["Convertí a tus clientes", "en mejores amigos."]} size={88} delay={32} lineGap={6} align="center" accent={["mejores", "amigos"]} />
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 1060, display: "flex", justifyContent: "center" }}>
        <WordReveal
          text="Sin apps · Sin tarjetas · Solo WhatsApp"
          delay={62}
          per={3}
          style={{ ...body(44, T.inkSoft, 600), justifyContent: "center" }}
          wordStyle={(_, w) => (w === "·" ? { color: T.mint } : undefined)}
        />
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 1170, display: "flex", justifyContent: "center" }}>
        <div
          style={{
            display: "flex", alignItems: "center", gap: 18, background: T.ink, borderRadius: 100, padding: "30px 56px",
            opacity: btn, transform: `scale(${interpolate(btn, [0, 1], [0.6, 1])})`,
            boxShadow: "0 26px 50px -22px rgba(2,49,42,0.7)",
          }}
        >
          <span style={{ ...display(58, T.cream, 700) }}>Pedí tu demo</span>
          <ArrowIcon size={56} color={T.mint} style={{ transform: `translateX(${arrow}px)` }} />
        </div>
      </div>
      <div
        style={{
          position: "absolute", left: 0, right: 0, top: 1420, display: "flex", flexDirection: "column", alignItems: "center", gap: 18,
          opacity: sign, transform: `translateY(${(1 - sign) * 30}px)`,
        }}
      >
        <span style={{ ...body(30, T.inkMuted, 600) }}>un producto de</span>
        <LuzSurBadge width={250} />
      </div>
    </AbsoluteFill>
  );
};


