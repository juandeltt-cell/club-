import React from "react";
import { AbsoluteFill, random, useCurrentFrame } from "remotion";

// Partículas de brillo que titilan y suben lento (idea de "Sparkles" de 21st.dev,
// reescrito para que cada cuadro sea determinístico).
export const Sparkles: React.FC<{ count?: number; color?: string; area?: { x: number; y: number; w: number; h: number }; size?: number; seed?: string; opacity?: number }> = ({
  count = 60, color = "#FFE3A3", area = { x: 0, y: 0, w: 1080, h: 1920 }, size = 5, seed = "s", opacity = 1,
}) => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{ pointerEvents: "none", opacity }}>
      {Array.from({ length: count }).map((_, i) => {
        const r = (k: string) => random(`${seed}${k}${i}`);
        const x = area.x + r("x") * area.w + Math.sin(f / (40 + r("w") * 40) + i) * 12;
        const y = area.y + ((r("y") * area.h - f * (0.4 + r("v") * 0.9)) % area.h + area.h) % area.h;
        const tw = 0.5 + 0.5 * Math.sin(f / (6 + r("t") * 10) + r("p") * 6.28);
        const s = size * (0.5 + r("s") * 1.3);
        return (
          <div key={i} style={{ position: "absolute", left: x, top: y, width: s, height: s, borderRadius: "50%", background: color, opacity: tw * (0.35 + r("o") * 0.65), boxShadow: `0 0 ${s * 3}px ${s}px ${color}` }} />
        );
      })}
    </AbsoluteFill>
  );
};
