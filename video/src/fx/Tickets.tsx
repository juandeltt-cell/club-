import React from "react";
import { AbsoluteFill, random, useCurrentFrame } from "remotion";
import { MONO } from "../brag/Kit";
import { T } from "../theme";

// Comandas de restaurante flotando en profundidad: cerca nítidas, lejos desenfocadas
// (profundidad de campo). Cada comanda es una visita; algunas llevan "+1 estrellita".

type Item = [string, string];
const ORDERS: { head: string; items: Item[]; total: string; star?: boolean }[] = [
  { head: "MESA 7 · 21:14", items: [["2", "Café con leche"], ["1", "Medialuna"]], total: "$ 8.400", star: true },
  { head: "MESA 3 · 13:02", items: [["1", "Milanesa napo"], ["1", "Agua s/gas"]], total: "$ 16.900" },
  { head: "BARRA · 19:40", items: [["2", "Pinta IPA"], ["1", "Papas"]], total: "$ 14.200", star: true },
  { head: "MESA 12 · 20:55", items: [["1", "Bife de chorizo"], ["1", "Malbec"]], total: "$ 29.500" },
  { head: "MESA 5 · 09:30", items: [["2", "Tostado"], ["2", "Exprimido"]], total: "$ 12.800", star: true },
  { head: "DELIVERY · 21:40", items: [["1", "Muzza grande"], ["1", "Fainá"]], total: "$ 13.600" },
  { head: "MESA 9 · 22:10", items: [["2", "Sorrentinos"], ["1", "Tiramisú"]], total: "$ 31.200", star: true },
  { head: "MESA 1 · 17:15", items: [["1", "Submarino"], ["3", "Churros"]], total: "$ 7.900" },
];

const Ticket: React.FC<{ o: (typeof ORDERS)[number]; w: number }> = ({ o, w }) => (
  <div
    style={{
      width: w, background: "#FFFDF7", padding: `${w * 0.08}px ${w * 0.08}px ${w * 0.12}px`, fontFamily: MONO, color: "#1F2A27",
      clipPath: `polygon(0 0, 100% 0, 100% calc(100% - ${w * 0.04}px), ${Array.from({ length: 12 }, (_, i) => `${100 - (i + 0.5) * (100 / 12)}% ${i % 2 ? "calc(100% - " + w * 0.04 + "px)" : "100%"}`).join(", ")}, 0 calc(100% - ${w * 0.04}px))`,
      boxShadow: "0 30px 60px rgba(0,0,0,0.35)",
    }}
  >
    <div style={{ fontSize: w * 0.075, fontWeight: 700, letterSpacing: "0.08em", borderBottom: `${w * 0.008}px dashed #1F2A27`, paddingBottom: w * 0.035, marginBottom: w * 0.04 }}>{o.head}</div>
    {o.items.map(([q, t]) => (
      <div key={t} style={{ display: "flex", gap: w * 0.04, fontSize: w * 0.07, lineHeight: 1.5 }}>
        <span style={{ fontWeight: 700 }}>{q}×</span><span>{t}</span>
      </div>
    ))}
    <div style={{ display: "flex", justifyContent: "space-between", marginTop: w * 0.04, paddingTop: w * 0.035, borderTop: `${w * 0.008}px dashed #1F2A27`, fontSize: w * 0.072, fontWeight: 700 }}>
      <span>TOTAL</span><span>{o.total}</span>
    </div>
    {o.star && (
      <div style={{ marginTop: w * 0.05, display: "inline-block", background: T.mint, color: T.ink, fontWeight: 700, fontSize: w * 0.065, padding: `${w * 0.02}px ${w * 0.04}px`, borderRadius: w * 0.02 }}>
        ★ +1 ESTRELLITA
      </div>
    )}
  </div>
);

export const Tickets: React.FC<{ count?: number; seed?: string }> = ({ count = 16, seed = "tk" }) => {
  const f = useCurrentFrame();
  const items = Array.from({ length: count }).map((_, i) => {
    const r = (k: string) => random(`${seed}${k}${i}`);
    const z = -1100 + r("z") * 1250; // -1100 (lejos) … 150 (cerca)
    return { i, r, z };
  }).sort((a, b) => a.z - b.z);
  return (
    <AbsoluteFill style={{ perspective: 1200, perspectiveOrigin: "50% 45%", overflow: "hidden" }}>
      {items.map(({ i, r, z }) => {
        const x = -200 + r("x") * 1300;
        const speed = 2.2 + r("v") * 2.4;
        const y = -700 + ((r("y") * 3000 + f * speed) % 3000);
        const rot = -18 + r("r") * 36 + Math.sin(f / 40 + i) * 3;
        const ry = -25 + r("ry") * 50;
        const blur = Math.min(14, Math.abs(z + 250) / 70);
        return (
          <div key={i} style={{ position: "absolute", left: x, top: y, transform: `translateZ(${z}px) rotateZ(${rot}deg) rotateY(${ry}deg)`, filter: `blur(${blur}px)`, opacity: 0.55 + 0.45 * ((z + 1100) / 1250) }}>
            <Ticket o={ORDERS[i % ORDERS.length]} w={380} />
          </div>
        );
      })}
    </AbsoluteFill>
  );
};
