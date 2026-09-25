import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { T, theme } from "../theme";
import { ease, useIn } from "./Motion";
import { body, display } from "./Type";

const DAYS = ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"];
const BASE = [142, 150, 158, 176, 248, 291, 185];

/**
 * Barras 3D (proyección oblicua) de visitas por día. La barra del martes
 * crece de `BASE[1]` a `boostTo` entre `grow[0]` y `grow[1]`.
 */
export const Bars3D: React.FC<{ at: number; grow: [number, number]; boostTo: number; width?: number }> = ({ at, grow, boostTo, width = 940 }) => {
  const frame = useCurrentFrame();
  const W = width, H = 640;
  const bw = 86, gap = (W - 80 - bw * 7) / 6, dx = 26, dy = 18;
  const k = 1.3; // px por visita
  const floor = H - 70;
  const g = ease(frame, grow, [0, 1], theme.ease.out);
  return (
    <div style={{ width: W, background: T.white, borderRadius: 44, border: `2px solid ${T.line}`, boxShadow: "0 40px 80px -30px rgba(2,49,42,0.35)", padding: "30px 0 10px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", padding: "0 40px" }}>
        <div style={{ ...display(44, T.ink, 800) }}>Visitas por día</div>
        <div style={{ ...body(28, T.inkMuted, 600), paddingTop: 10 }}>promedio del mes</div>
      </div>
      <svg width={W} height={H} style={{ display: "block" }}>
        {/* piso */}
        <polygon points={`30,${floor} ${W - 40},${floor} ${W - 40 + dx},${floor - dy} ${30 + dx},${floor - dy}`} fill={T.creamDeep} opacity={0.7} />
        {BASE.map((v0, i) => {
          const isTue = i === 1;
          const pop = useIn(at + i * 3, theme.spring.smooth);
          const v = isTue ? interpolate(g, [0, 1], [v0, boostTo]) : v0;
          const h = v * k * pop;
          const x = 40 + i * (bw + gap);
          const y = floor - h;
          const front = isTue ? T.mint : "#CFEFE5";
          const side = isTue ? T.mintDeep : "#A9DCCB";
          const top = isTue ? "#5CD3B4" : "#E6F7F1";
          return (
            <g key={i}>
              <polygon points={`${x + bw},${y} ${x + bw + dx},${y - dy} ${x + bw + dx},${floor - dy} ${x + bw},${floor}`} fill={side} />
              <polygon points={`${x},${y} ${x + dx},${y - dy} ${x + bw + dx},${y - dy} ${x + bw},${y}`} fill={top} />
              <rect x={x} y={y} width={bw} height={Math.max(0, h)} fill={front} />
              <text x={x + bw / 2} y={y - dy - 14} textAnchor="middle" style={{ ...display(isTue ? 34 : 28, isTue ? T.mintDeep : T.inkMuted, 800) }} fill={isTue ? T.mintDeep : T.inkMuted} opacity={pop}>{Math.round(v)}</text>
              <text x={x + bw / 2} y={floor + 44} textAnchor="middle" style={{ ...body(28, isTue ? T.ink : T.inkMuted, isTue ? 800 : 600) }} fill={isTue ? T.ink : T.inkMuted}>{DAYS[i]}</text>
            </g>
          );
        })}
      </svg>
    </div>
  );
};
