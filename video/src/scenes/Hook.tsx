import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { Character } from "../components/Character";
import { HandCircle, HandQuestion, HandSparks } from "../components/Doodle";
import { SceneBg } from "../components/Layers";
import { Counter, ease, useIn, WordReveal } from "../components/Motion";
import { display, Lines } from "../components/Type";
import { T, theme } from "../theme";

// Escena 1 · Gancho (0–302, intro tranquila de la canción)
export const Hook: React.FC = () => {
  const frame = useCurrentFrame();
  return <AbsoluteFill>{frame < 150 ? <Claim /> : <Question />}</AbsoluteFill>;
};

const Claim: React.FC = () => {
  const drop = useIn(12, theme.spring.bouncy);
  const veces = useIn(18, theme.spring.snappy);
  return (
    <AbsoluteFill>
      <SceneBg />
      <div style={{ position: "absolute", left: 90, top: 470, right: 50 }}>
        <Lines lines={["Hay un cliente", "que vino"]} size={116} delay={0} lineGap={5} />
        <div style={{ position: "relative", display: "flex", alignItems: "baseline", gap: 30, marginTop: 6 }}>
          <div
            style={{
              ...display(400, T.mint), lineHeight: 0.9, opacity: Math.min(1, drop * 1.5),
              transform: `translateY(${interpolate(drop, [0, 1], [60, 0])}px) scale(${interpolate(drop, [0, 1], [1.5, 1])})`, transformOrigin: "30% 70%",
              textShadow: `0 0 60px ${T.mintGlow}`,
            }}
          >
            <Counter to={12} delay={12} />
          </div>
          <div style={{ ...display(150), opacity: veces, transform: `translateX(${(1 - veces) * 40}px)` }}>veces</div>
          <HandCircle x={-30} y={20} w={500} h={330} at={44} dur={16} color={T.ink} width={6} />
          <HandSparks x={440} y={-10} size={110} at={58} color={T.star} width={9} rotate={-10} />
        </div>
        <div style={{ marginTop: 10 }}>
          <Lines lines={["a tu restaurante", "este año."]} size={116} delay={24} lineGap={5} />
        </div>
      </div>
    </AbsoluteFill>
  );
};

const Question: React.FC = () => {
  const frame = useCurrentFrame();
  const pill = ease(frame, [166, 178], [0, 1]);
  const card = useIn(172, theme.spring.bouncy);
  // la tensión sube hacia la subida de la canción (cuadro 302)
  const build = ease(frame, [250, 300], [0, 1], theme.ease.in);
  const shake = Math.sin(frame * 1.7) * build * 6;
  return (
    <AbsoluteFill>
      <SceneBg variant="ink" />
      <div style={{ position: "absolute", left: 0, right: 0, top: 330, display: "flex", flexDirection: "column", alignItems: "center" }}>
        <WordReveal text="¿Sabés" delay={156} style={{ ...display(190, T.cream) }} />
        <div style={{ position: "relative", marginTop: 6 }}>
          <div
            style={{
              position: "absolute", left: -34, right: -34, top: 18, bottom: -6, borderRadius: 160, background: T.mint,
              transform: `scaleX(${pill})`, transformOrigin: "left center",
            }}
          />
          <WordReveal text="quién es?" delay={160} style={{ ...display(190, T.cream), position: "relative" }} />
        </div>
      </div>
      {/* El cliente misterioso: detrás de un vidrio esmerilado */}
      <div
        style={{
          position: "absolute", left: 540 - 300, top: 900, width: 600, height: 600, borderRadius: "50%", overflow: "hidden",
          background: T.mint, opacity: card,
          transform: `scale(${interpolate(card, [0, 1], [0.5, 1]) * (1 + build * 0.08)}) translateX(${shake}px)`,
          boxShadow: `0 0 0 10px ${T.mint}, 0 30px 80px rgba(0,0,0,0.4)`,
        }}
      >
        <div style={{ position: "absolute", left: 70, top: 80, filter: `blur(${16 - build * 6}px)`, opacity: 0.9 }}>
          <Character body="Device" hair="Long" face="SmileBig" width={460} fill={T.white} />
        </div>
        <AbsoluteFill style={{ background: "rgba(5,171,135,0.25)" }} />
      </div>
      <HandQuestion x={150} y={930} size={170} at={188} color={T.star} width={10} rotate={-14} />
      <HandQuestion x={800} y={1010} size={140} at={196} color={T.cream} width={9} rotate={12} />
      <HandQuestion x={760} y={1400} size={120} at={204} color={T.mint} width={9} rotate={-6} />
    </AbsoluteFill>
  );
};
