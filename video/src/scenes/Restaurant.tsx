import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { useBass } from "../components/AudioReactive";
import { Character } from "../components/Character";
import { MaskLines } from "../components/Marks";
import { ease } from "../components/Motion";
import { display } from "../components/Type";
import { T, theme } from "../theme";

// Gancho · "¿Tenés un comercio gastronómico?" sobre un restó ilustrado.
// La cámara avanza lento y cada capa se mueve a su propia velocidad (parallax):
// fondo lejos, mesas en el medio, mozo y plantas cerca. El título no se mueve.

const WALL = "#F5D6B8";
const WOOD = "#C98A55";

/** Capa con parallax: se acerca y se desplaza según su profundidad. */
const Layer: React.FC<{ depth: number; children: React.ReactNode }> = ({ depth, children }) => {
  const f = useCurrentFrame();
  const t = ease(f, [0, 110], [0, 1], theme.ease.inOut);
  const s = 1 + t * 0.07 * depth;
  const y = -t * 26 * depth;
  return <AbsoluteFill style={{ transform: `translateY(${y}px) scale(${s})`, transformOrigin: "50% 62%" }}>{children}</AbsoluteFill>;
};

const Window: React.FC<{ x: number }> = ({ x }) => (
  <div style={{ position: "absolute", left: x, top: 640, width: 330, height: 440, borderRadius: "165px 165px 16px 16px", border: `8px solid ${T.ink}`, overflow: "hidden", background: "linear-gradient(180deg, #F9B27A 0%, #F48C7F 46%, #FFD9A0 62%)" }}>
    {/* sol bajo y mar */}
    <div style={{ position: "absolute", left: 120, top: 200, width: 110, height: 110, borderRadius: "50%", background: "#FFE7A8", boxShadow: "0 0 60px 20px rgba(255,231,168,0.7)" }} />
    <div style={{ position: "absolute", left: 0, right: 0, top: 268, bottom: 0, background: "linear-gradient(180deg, #3FA7A0, #2A7E80)" }} />
    {[0, 1, 2].map((i) => <div key={i} style={{ position: "absolute", left: 30 + i * 70, top: 290 + i * 34, width: 120, height: 6, borderRadius: 6, background: "rgba(255,255,255,0.55)" }} />)}
    {/* parantes */}
    <div style={{ position: "absolute", left: 157, top: 0, bottom: 0, width: 8, background: T.ink }} />
    <div style={{ position: "absolute", left: 0, right: 0, top: 230, height: 8, background: T.ink }} />
  </div>
);

/** Haces de luz del atardecer que entran por las ventanas. */
const LightBeams: React.FC = () => {
  const f = useCurrentFrame();
  const o = 0.28 + Math.sin(f / 30) * 0.04;
  return (
    <AbsoluteFill style={{ mixBlendMode: "screen", opacity: o, pointerEvents: "none" }}>
      {[245, 835].map((x) => (
        <div key={x} style={{ position: "absolute", left: x - 180, top: 700, width: 360, height: 1100, background: "linear-gradient(180deg, rgba(255,210,150,0.9), transparent 85%)", clipPath: "polygon(20% 0, 80% 0, 115% 100%, 35% 100%)", filter: "blur(14px)" }} />
      ))}
    </AbsoluteFill>
  );
};

/** Cartel de neón que se enciende con un parpadeo. */
const Neon: React.FC = () => {
  const f = useCurrentFrame();
  const flick = [8, 10, 13, 15].some((a) => f >= a && f < a + 1) ? 0.25 : 1;
  const on = f < 7 ? 0.15 : flick;
  const bass = useBass();
  const glow = 18 + bass * 18;
  return (
    <div style={{ position: "absolute", left: 0, right: 0, top: 440, display: "flex", justifyContent: "center" }}>
      {/* cadenitas */}
      <div style={{ position: "absolute", left: 540 - 200, top: -60, width: 4, height: 70, background: T.ink }} />
      <div style={{ position: "absolute", left: 540 + 196, top: -60, width: 4, height: 70, background: T.ink }} />
      <div style={{ padding: "22px 54px 28px", borderRadius: 28, background: "#0B2A24", border: `6px solid ${T.ink}`, boxShadow: `0 20px 40px -18px rgba(0,0,0,0.6), 0 0 ${on > 0.5 ? glow * 2 : 0}px rgba(5,171,135,0.45)` }}>
        <div style={{ ...display(92, "#E9FFF7", 800), letterSpacing: "0.01em", opacity: 0.3 + 0.7 * on, textShadow: on > 0.5 ? `0 0 6px #fff, 0 0 ${glow}px ${T.mint}, 0 0 ${glow * 2.4}px ${T.mint}` : "none" }}>
          Brasa Restó
        </div>
      </div>
    </div>
  );
};

/** Lámpara colgante que se balancea, con cono de luz. */
const Pendant: React.FC<{ x: number; len: number; phase: number }> = ({ x, len, phase }) => {
  const f = useCurrentFrame();
  const bass = useBass();
  const a = Math.sin(f / 22 + phase) * 3;
  return (
    <div style={{ position: "absolute", left: x, top: 0, width: 0, height: 0, transform: `rotate(${a}deg)`, transformOrigin: "0 0" }}>
      <div style={{ position: "absolute", left: -2, top: 0, width: 4, height: len, background: T.ink }} />
      <div style={{ position: "absolute", left: -250, top: len + 40, width: 500, height: 700, background: `radial-gradient(ellipse at 50% 0%, rgba(255,214,140,${0.5 + bass * 0.25}), transparent 65%)`, mixBlendMode: "screen", filter: "blur(8px)" }} />
      <div style={{ position: "absolute", left: -70, top: len, width: 140, height: 70, background: T.ink, borderRadius: "70px 70px 10px 10px" }} />
      <div style={{ position: "absolute", left: -26, top: len + 58, width: 52, height: 30, borderRadius: "0 0 26px 26px", background: "#FFE7A8", boxShadow: `0 0 ${30 + bass * 30}px 12px rgba(255,220,150,0.8)` }} />
    </div>
  );
};

const Steam: React.FC<{ x: number; y: number }> = ({ x, y }) => {
  const f = useCurrentFrame();
  return (
    <>
      {[0, 1, 2].map((i) => {
        const t = ((f + i * 12) % 36) / 36;
        return <div key={i} style={{ position: "absolute", left: x + i * 22 + Math.sin(f / 7 + i) * 6, top: y - t * 70, width: 10, height: 44, borderRadius: 10, background: "rgba(255,255,255,0.8)", opacity: Math.sin(t * Math.PI) * 0.8 }} />;
      })}
    </>
  );
};

const Plate: React.FC<{ x: number; y: number; food: string }> = ({ x, y, food }) => (
  <div style={{ position: "absolute", left: x, top: y }}>
    <div style={{ width: 150, height: 40, borderRadius: "50%", background: T.white, border: `5px solid ${T.ink}` }} />
    <div style={{ position: "absolute", left: 32, top: -22, width: 86, height: 44, borderRadius: "44px 44px 10px 10px", background: food, border: `5px solid ${T.ink}` }} />
    <Steam x={40} y={-40} />
  </div>
);

const Glass: React.FC<{ x: number; y: number }> = ({ x, y }) => (
  <div style={{ position: "absolute", left: x, top: y }}>
    <div style={{ width: 54, height: 60, borderRadius: "6px 6px 27px 27px", border: `5px solid ${T.ink}`, background: "linear-gradient(180deg, rgba(255,255,255,0.6) 40%, #B8364A 40%)" }} />
    <div style={{ marginLeft: 22, width: 8, height: 34, background: T.ink }} />
    <div style={{ marginLeft: 6, width: 42, height: 8, borderRadius: 8, background: T.ink }} />
  </div>
);

const Table: React.FC<{ x: number; w: number; children?: React.ReactNode }> = ({ x, w, children }) => (
  <div style={{ position: "absolute", left: x, top: 1330, width: w }}>
    {children}
    <div style={{ position: "relative", height: 70, borderRadius: 18, background: T.white, border: `7px solid ${T.ink}` }} />
    <div style={{ height: 150, margin: "0 30px", background: "#EDE3D3", borderLeft: `7px solid ${T.ink}`, borderRight: `7px solid ${T.ink}`, borderBottom: `7px solid ${T.ink}`, borderRadius: "0 0 14px 14px" }} />
  </div>
);

/** El mozo cruza con la bandeja: paso con rebote y bandeja con plato humeante. */
const Waiter: React.FC = () => {
  const f = useCurrentFrame();
  const x = interpolate(f, [0, 110], [-120, 520], { extrapolateRight: "clamp" });
  const bob = Math.abs(Math.sin((f / 9) * Math.PI)) * -12;
  return (
    <div style={{ position: "absolute", left: x, top: 1150 + bob }}>
      <Character pose="standing" body="WalkingWB" hair="ShortWavy" face="Smile" facialHair="Handlebars" width={360} />
      {/* moño */}
      <div style={{ position: "absolute", left: 128, top: 160, width: 44, height: 20, background: T.ink, clipPath: "polygon(0 0, 50% 45%, 100% 0, 100% 100%, 50% 55%, 0 100%)" }} />
      {/* bandeja en la mano, con campana */}
      <div style={{ position: "absolute", left: 96, top: 318, width: 230, height: 24, borderRadius: "50%", background: "#D9D9D9", border: `6px solid ${T.ink}` }} />
      <div style={{ position: "absolute", left: 140, top: 246, width: 142, height: 80, borderRadius: "71px 71px 6px 6px", background: "linear-gradient(135deg, #F4F4F4, #CFCFCF)", border: `6px solid ${T.ink}` }} />
      <div style={{ position: "absolute", left: 202, top: 230, width: 18, height: 18, borderRadius: "50%", background: T.ink }} />
    </div>
  );
};

export const Restaurant: React.FC = () => {
  const f = useCurrentFrame();
  const dim = ease(f, [0, 10], [0.35, 0]);
  return (
    <AbsoluteFill style={{ background: WALL, overflow: "hidden" }}>
      {/* capa lejana: pared, ventanas, cartel */}
      <Layer depth={0.4}>
        <AbsoluteFill style={{ background: `linear-gradient(180deg, #F9E2CB 0%, ${WALL} 60%)` }} />
        <Window x={80} />
        <Window x={670} />
        <LightBeams />
        <Neon />
        <div style={{ position: "absolute", left: 0, right: 0, top: 1180, height: 320, background: T.mintDeep, borderTop: `8px solid ${T.ink}` }} />
        <div style={{ position: "absolute", left: 0, right: 0, top: 1480, bottom: 0, background: `repeating-linear-gradient(90deg, ${WOOD} 0 120px, #B97A47 120px 124px)`, borderTop: `8px solid ${T.ink}` }} />
      </Layer>
      {/* capa media: lámparas y mesas con comensales */}
      <Layer depth={0.8}>
        <Pendant x={250} len={560} phase={0} />
        <Pendant x={830} len={600} phase={1.7} />
        <Table x={30} w={470}>
          <div style={{ position: "absolute", left: -10, top: -360 }}><Character body="Coffee" hair="Bun" face="SmileBig" width={270} /></div>
          <div style={{ position: "absolute", left: 200, top: -370 }}><Character body="Explaining" hair="ShortVolumed" face="SmileTeeth" facialHair="FullMedium" width={270} flip /></div>
          <Plate x={60} y={-24} food="#E9A23B" />
          <Glass x={300} y={-78} />
        </Table>
        <Table x={580} w={470}>
          <div style={{ position: "absolute", left: 10, top: -370 }}><Character body="Device" hair="Long" face="LoveGrin" width={270} /></div>
          <div style={{ position: "absolute", left: 210, top: -360 }}><Character body="PointingUp" hair="Afro" face="SmileBig" width={270} flip /></div>
          <Glass x={80} y={-78} />
          <Plate x={250} y={-24} food="#C8553D" />
        </Table>
      </Layer>
      {/* capa cercana: el mozo y plantas desenfocadas */}
      <Layer depth={1.3}>
        <Waiter />
        <div style={{ position: "absolute", left: -120, top: 1480, width: 420, height: 520, filter: "blur(10px)" }}>
          {[0, 1, 2, 3].map((i) => (
            <div key={i} style={{ position: "absolute", left: 60 + i * 60, top: 60 + (i % 2) * 70, width: 110, height: 300, borderRadius: "50% 50% 50% 50% / 70% 70% 30% 30%", background: i % 2 ? "#0F7A5F" : "#11563F", transform: `rotate(${-30 + i * 22 + Math.sin(f / 30 + i) * 2}deg)`, transformOrigin: "50% 100%" }} />
          ))}
        </div>
        <div style={{ position: "absolute", right: -60, top: 1560, width: 300, height: 300, borderRadius: "50%", background: "radial-gradient(circle, rgba(255,226,160,0.8), transparent 65%)", filter: "blur(18px)" }} />
      </Layer>
      {/* el título, quieto: no participa del movimiento de cámara */}
      <AbsoluteFill style={{ background: "linear-gradient(180deg, rgba(253,249,242,0.96) 0%, rgba(253,249,242,0.8) 16%, rgba(253,249,242,0) 23%)" }} />
      <div style={{ position: "absolute", left: 0, right: 0, top: 170 }}>
        <MaskLines lines={["¿Tenés un comercio", "gastronómico?"]} size={112} delay={4} gap={6} color={T.ink} accent={["gastronómico?", "gastronómico"]} accentColor={T.mintDeep} align="center" />
      </div>
      <AbsoluteFill style={{ background: T.ink, opacity: dim }} />
    </AbsoluteFill>
  );
};
