import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { SceneBg } from "../components/Layers";
import { Counter, ease, useIn, useOut, WordReveal } from "../components/Motion";
import { Smile } from "../components/Brand";
import { display, Lines } from "../components/Type";
import { T, theme } from "../theme";

// Escena 1 · Gancho (0–120)
export const Hook: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill>
      {frame < 60 ? <Claim /> : <Question />}
    </AbsoluteFill>
  );
};

const Claim: React.FC = () => {
  const drop = useIn(12, theme.spring.bouncy);
  const veces = useIn(18, theme.spring.snappy);
  return (
    <AbsoluteFill>
      <SceneBg />
      <div style={{ position: "absolute", left: 90, top: 470, right: 50 }}>
        <Lines lines={["Hay un cliente", "que vino"]} size={116} delay={0} lineGap={5} />
        <div style={{ display: "flex", alignItems: "baseline", gap: 30, marginTop: 6 }}>
          <div
            style={{
              ...display(400, T.mint), lineHeight: 0.9, opacity: Math.min(1, drop * 1.5),
              transform: `translateY(${interpolate(drop, [0, 1], [-260, 0])}px) scale(${interpolate(drop, [0, 1], [1.25, 1])})`,
              textShadow: `0 0 60px ${T.mintGlow}`,
            }}
          >
            <Counter to={12} delay={12} />
          </div>
          <div style={{ ...display(150), opacity: veces, transform: `translateX(${(1 - veces) * 40}px)` }}>veces</div>
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
  const pill = ease(frame, [69, 81], [0, 1]);
  const out = useOut(98, 8);
  const smileDraw = ease(frame, [88, 104], [0, 1]);
  const wipe = ease(frame, [102, 119], [0, 1], theme.ease.inOut);
  return (
    <AbsoluteFill>
      <SceneBg variant="ink" />
      <div style={{ position: "absolute", left: 0, right: 0, top: 640, display: "flex", flexDirection: "column", alignItems: "center" }}>
        <WordReveal text="¿Sabés" delay={60} style={{ ...display(200, T.cream) }} exitAt={98} />
        <div style={{ position: "relative", marginTop: 6 }}>
          <div
            style={{
              position: "absolute", left: -34, right: -34, top: 18, bottom: -6, borderRadius: 160, background: T.mint,
              transform: `scaleX(${pill})`, transformOrigin: "left center", opacity: 1 - out,
            }}
          />
          <WordReveal text="quién es?" delay={64} style={{ ...display(200, T.cream), position: "relative" }} exitAt={98} />
        </div>
      </div>
      <div style={{ position: "absolute", left: 540 - 300, top: 1200, opacity: smileDraw > 0 ? 1 : 0 }}>
        <Smile width={600} progress={smileDraw} stroke={34} />
      </div>
      {/* Transición: círculo crema que nace de la sonrisa y cubre todo */}
      <AbsoluteFill style={{ background: T.cream, clipPath: `circle(${wipe * 2300}px at 540px 1330px)` }} />
    </AbsoluteFill>
  );
};
