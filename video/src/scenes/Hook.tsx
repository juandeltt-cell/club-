import React from "react";
import { noise2D } from "@remotion/noise";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { Character } from "../components/Character";
import { Emoji3D, extrude, Odometer } from "../components/Emoji";
import { SceneBg } from "../components/Layers";
import { ease, useIn, WordReveal } from "../components/Motion";
import { display, Lines } from "../components/Type";
import { T, theme } from "../theme";

export const QUESTION_AT = 112;

// Escena 1 · Gancho (0–216, intro tranquila de la canción)
export const Hook: React.FC = () => {
  const frame = useCurrentFrame();
  return <AbsoluteFill>{frame < QUESTION_AT ? <Claim /> : <Question />}</AbsoluteFill>;
};

/** Una estrellita 3D por visita: se van sumando al ritmo del contador. */
const VisitStars: React.FC<{ at: number }> = ({ at }) => (
  <div style={{ display: "flex", gap: 6 }}>
    {Array.from({ length: 12 }).map((_, i) => (
      <Emoji3D key={i} name="star" size={62} at={at + i * 2} float={0.3} depth={0.6} />
    ))}
  </div>
);

const Claim: React.FC = () => {
  const drop = useIn(8, theme.spring.bouncy);
  const veces = useIn(12, theme.spring.snappy);
  return (
    <AbsoluteFill>
      <SceneBg />
      <div style={{ position: "absolute", left: 90, top: 380, right: 50 }}>
        <Lines lines={["Hay un cliente", "que vino"]} size={116} delay={0} lineGap={4} />
        <div style={{ display: "flex", alignItems: "baseline", gap: 30, marginTop: 6 }}>
          <div
            style={{
              ...display(400, T.mint), lineHeight: 0.9, opacity: Math.min(1, drop * 1.5),
              transform: `translateY(${interpolate(drop, [0, 1], [60, 0])}px) scale(${interpolate(drop, [0, 1], [1.5, 1])})`, transformOrigin: "30% 70%",
              textShadow: extrude(14, T.mintDeep, T.mintGlow),
            }}
          >
            <Odometer to={12} delay={8} size={400} color={T.mint} />
          </div>
          <div style={{ ...display(150), opacity: veces, transform: `translateX(${(1 - veces) * 40}px)` }}>veces</div>
        </div>
        <div style={{ marginTop: 10 }}>
          <Lines lines={["a tu restaurante", "este año."]} size={116} delay={22} lineGap={4} />
        </div>
        <div style={{ marginTop: 44, marginLeft: 2 }}>
          <VisitStars at={30} />
        </div>
      </div>
    </AbsoluteFill>
  );
};

/** Signo de pregunta tipográfico que flota con ruido suave. */
const FloatQ: React.FC<{ at: number; x: number; y: number; size: number; color: string; rotate: number }> = ({ at, x, y, size, color, rotate }) => {
  const frame = useCurrentFrame();
  const p = useIn(at, theme.spring.bouncy);
  if (frame < at) return null;
  const dx = noise2D(`qx${x}`, frame / 60, 0) * 18;
  const dy = noise2D(`qy${y}`, frame / 60, 0) * 18;
  return (
    <div style={{ position: "absolute", left: x + dx, top: y + dy, ...display(size, color, 800), opacity: Math.min(1, p * 1.5), transform: `scale(${p}) rotate(${rotate}deg)` }}>?</div>
  );
};

const Question: React.FC = () => {
  const frame = useCurrentFrame();
  const q = QUESTION_AT;
  const pill = ease(frame, [q + 12, q + 24], [0, 1]);
  const card = useIn(q + 20, theme.spring.bouncy);
  // la tensión sube hacia la subida de la canción (cuadro 216)
  const build = ease(frame, [170, 214], [0, 1], theme.ease.in);
  const shake = Math.sin(frame * 1.7) * build * 6;
  return (
    <AbsoluteFill>
      <SceneBg variant="ink" />
      <div style={{ position: "absolute", left: 0, right: 0, top: 330, display: "flex", flexDirection: "column", alignItems: "center" }}>
        <WordReveal text="¿Sabés" delay={q + 4} style={{ ...display(190, T.cream) }} />
        <div style={{ position: "relative", marginTop: 6 }}>
          <div
            style={{
              position: "absolute", left: -34, right: -34, top: 18, bottom: -6, borderRadius: 160, background: T.mint,
              transform: `scaleX(${pill})`, transformOrigin: "left center",
            }}
          />
          <WordReveal text="quién es?" delay={q + 8} style={{ ...display(190, T.cream), position: "relative" }} />
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
      <FloatQ at={q + 34} x={130} y={930} size={200} color={T.star} rotate={-14} />
      <FloatQ at={q + 40} x={830} y={1000} size={150} color={T.cream} rotate={12} />
      <FloatQ at={q + 46} x={800} y={1390} size={130} color={T.mint} rotate={-6} />
    </AbsoluteFill>
  );
};
