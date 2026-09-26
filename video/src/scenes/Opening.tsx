import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { useBass } from "../components/AudioReactive";
import { Cloche3D } from "../components/Cloche3D";
import { Aurora } from "../components/Glass";
import { MaskLines } from "../components/Marks";
import { ease } from "../components/Motion";
import { T, theme } from "../theme";

// Gancho · "¿Tenés un comercio gastronómico?"
// Solo la pregunta, y un plato con campana en 3D bajo un foco: la campana se levanta
// y aparece la estrellita dorada del sistema.

const LIFT_AT = 40;

const Steam: React.FC = () => {
  const f = useCurrentFrame();
  if (f < LIFT_AT + 8) return null;
  return (
    <>
      {[0, 1, 2, 3].map((i) => {
        const t = ((f - LIFT_AT - 8 + i * 11) % 44) / 44;
        const o = Math.sin(t * Math.PI) * ease(f, [LIFT_AT + 8, LIFT_AT + 20], [0, 1]);
        return (
          <div key={i} style={{
            position: "absolute", left: 470 + i * 38 + Math.sin(f / 9 + i) * 14, top: 1080 - t * 260, width: 34, height: 150, borderRadius: 40,
            background: "linear-gradient(180deg, rgba(255,255,255,0), rgba(255,255,255,0.55), rgba(255,255,255,0))", filter: "blur(10px)", opacity: o * 0.8,
          }} />
        );
      })}
    </>
  );
};

export const Opening: React.FC = () => {
  const f = useCurrentFrame();
  const bass = useBass();
  const light = ease(f, [0, 16], [0, 1], theme.ease.out);
  const burst = interpolate(f, [LIFT_AT + 6, LIFT_AT + 16, LIFT_AT + 40], [0, 1, 0.35], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <AbsoluteFill>
      <Aurora base={T.ink} colors={["rgba(5,171,135,0.35)", "rgba(245,184,61,0.18)", "rgba(5,171,135,0.25)"]} />
      {/* haz del foco que cae sobre el plato */}
      <div style={{
        position: "absolute", left: 540 - 420, top: 380, width: 840, height: 1250, opacity: light * (0.55 + bass * 0.2),
        background: "linear-gradient(180deg, rgba(255,226,170,0) 0%, rgba(255,226,170,0.22) 55%, rgba(255,226,170,0.35) 100%)",
        clipPath: "polygon(40% 0, 60% 0, 100% 100%, 0 100%)", filter: "blur(24px)", mixBlendMode: "screen",
      }} />
      {/* charco de luz sobre la mesa */}
      <div style={{ position: "absolute", left: 540 - 520, top: 1220, width: 1040, height: 420, borderRadius: "50%", background: "radial-gradient(ellipse, rgba(255,226,170,0.45), transparent 65%)", opacity: light, filter: "blur(10px)" }} />
      {/* destello dorado al levantarse la campana */}
      <div style={{ position: "absolute", left: 540 - 400, top: 780, width: 800, height: 800, borderRadius: "50%", background: "radial-gradient(circle, rgba(255,200,90,0.75), transparent 60%)", opacity: burst, mixBlendMode: "screen", filter: "blur(20px)" }} />
      <div style={{ position: "absolute", left: 0, top: 360, opacity: light }}>
        <Cloche3D width={1080} height={1400} liftAt={LIFT_AT} fov={42.5} />
      </div>
      <Steam />
      <div style={{ position: "absolute", left: 0, right: 0, top: 260 }}>
        <MaskLines lines={["¿Tenés un comercio", "gastronómico?"]} size={116} delay={4} gap={6} color={T.cream} accent={["gastronómico"]} accentColor={T.mint} align="center" />
      </div>
    </AbsoluteFill>
  );
};
