import React from "react";
import { AbsoluteFill, interpolate, random, useCurrentFrame } from "remotion";
import { CakeIcon, CameraCorners, DoubleCheckIcon, SparkleIcon, StarIcon } from "../components/Icons";
import { Phone, Qr, Tap } from "../components/Device";
import { SceneBg } from "../components/Layers";
import { ease, useBreathe, useIn } from "../components/Motion";
import { body, display, StepHeader } from "../components/Type";
import { T, theme } from "../theme";

// Escena 3 · Cómo funciona (local 0–420 = absoluto 450–870)
// 01 escanea (0–120) · 02 WhatsApp (120–270) · 03 tarjeta (270–420)
const PHONE_W = 540;
const PHONE_X = 540 - PHONE_W / 2;
const PHONE_Y = 548;

export const Steps: React.FC = () => {
  const frame = useCurrentFrame();
  const enter = useIn(0, theme.spring.smooth);
  const exit = ease(frame, [398, 414], [0, 1], theme.ease.in);
  // pequeño giro y "respiro" del teléfono en cada cambio de paso
  const wiggle = (at: number) => Math.sin(ease(frame, [at, at + 18], [0, 1]) * Math.PI) * 5;
  const rot = wiggle(120) - wiggle(270) + Math.sin(frame / 40) * 0.8;
  const pulse = 1 + Math.sin(ease(frame, [120, 136], [0, 1]) * Math.PI) * 0.03 + Math.sin(ease(frame, [270, 286], [0, 1]) * Math.PI) * 0.03;

  return (
    <AbsoluteFill>
      <SceneBg />
      <div style={{ position: "absolute", left: 90, top: 250, right: 40 }}>
        {frame < 120 && <StepHeader num="01" label={["Escanea", "el QR"]} at={0} exitAt={112} />}
        {frame >= 120 && frame < 270 && <StepHeader num="02" label={["Suma estrellitas", "por WhatsApp"]} at={122} exitAt={262} />}
        {frame >= 270 && <StepHeader num="03" label={["Sigue su tarjeta", "y canjea"]} at={272} exitAt={400} />}
      </div>

      <div
        style={{
          position: "absolute", left: PHONE_X, top: PHONE_Y,
          opacity: enter,
          transform: `translateY(${interpolate(enter, [0, 1], [260, 0]) + exit * 1300}px) rotate(${rot + exit * 12}deg) scale(${pulse})`,
          transformOrigin: "50% 60%",
        }}
      >
        <Phone width={PHONE_W} screenBg={frame < 72 ? "#0B2621" : T.cream}>
          {frame < 72 && <CameraScreen />}
          {frame >= 72 && frame < 134 && <LandingScreen />}
          {frame >= 134 && frame < 272 && <ChatScreen />}
          {frame >= 272 && <CardScreen />}
        </Phone>
        <Tap x={PHONE_W / 2} y={896} at={128} />
      </div>

      {frame >= 200 && frame < 270 && <FlyingStars />}
      {frame >= 318 && frame < 380 && <StarRain />}
    </AbsoluteFill>
  );
};

// ---------- Paso 01 ----------
const CameraScreen: React.FC = () => {
  const frame = useCurrentFrame();
  const stand = useIn(4, theme.spring.smooth);
  const qr = ease(frame, [10, 50], [0, 1]);
  const corners = useIn(38, theme.spring.bouncy);
  const scan = ease(frame, [50, 68], [0, 1], theme.ease.inOut);
  const flash = frame >= 66 ? ease(frame, [66, 72], [0, 1]) : 0;
  return (
    <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 45%, #1E4A41, #0B2621 70%)" }}>
      <div style={{ ...body(24, "rgba(253,249,242,0.75)", 600), position: "absolute", top: 90, width: "100%", textAlign: "center" }}>
        Apuntá la cámara al código
      </div>
      <div
        style={{
          position: "absolute", left: "50%", top: 190, width: 380, marginLeft: -190, borderRadius: 34, background: T.cream,
          padding: "30px 30px 34px", textAlign: "center", opacity: stand,
          transform: `translateY(${(1 - stand) * 60}px) rotate(${-2 + Math.sin(frame / 25) * 0.6}deg)`,
          boxShadow: "0 30px 60px -20px rgba(0,0,0,0.6)",
        }}
      >
        <div style={{ ...display(44, T.ink) }}>Brasa</div>
        <div style={{ ...body(22, T.inkSoft, 600), marginTop: 6, marginBottom: 22 }}>Sumá estrellitas en cada visita</div>
        <div style={{ position: "relative", width: 300, height: 300, margin: "0 auto" }}>
          <Qr size={300} progress={qr} />
          <div style={{ position: "absolute", inset: -26, opacity: corners, transform: `scale(${interpolate(corners, [0, 1], [1.3, 1])})` }}>
            <CameraCorners size={352} color={T.mint} stroke={9} />
          </div>
          {scan > 0 && scan < 1 && (
            <div style={{ position: "absolute", left: -14, right: -14, top: scan * 300, height: 6, borderRadius: 6, background: T.mint, boxShadow: `0 0 24px 6px ${T.mintGlow}` }} />
          )}
        </div>
      </div>
      <AbsoluteFill style={{ background: "#fff", opacity: flash }} />
    </AbsoluteFill>
  );
};

const REWARDS = [
  { n: 5, label: "Postre de regalo" },
  { n: 10, label: "Plato principal" },
  { n: 15, label: "Cena para dos" },
];

const LandingScreen: React.FC = () => {
  const frame = useCurrentFrame();
  const head = useIn(72, theme.spring.smooth);
  const btn = useIn(100, theme.spring.bouncy);
  const pressed = frame >= 128 ? ease(frame, [128, 132], [0.94, 1]) : 1;
  return (
    <AbsoluteFill style={{ background: T.cream }}>
      <div style={{ background: T.ink, padding: "96px 34px 40px", opacity: head, transform: `translateY(${(1 - head) * -40}px)` }}>
        <div style={{ ...display(62, T.cream) }}>Brasa</div>
        <div style={{ ...body(25, "rgba(253,249,242,0.8)", 600), marginTop: 8 }}>Sumá estrellitas en cada visita</div>
      </div>
      <div style={{ padding: "34px 30px", display: "flex", flexDirection: "column", gap: 16 }}>
        <div style={{ ...body(22, T.inkMuted, 700), letterSpacing: "0.08em", textTransform: "uppercase" }}>Premios</div>
        {REWARDS.map((r, i) => (
          <RewardRow key={r.n} {...r} at={80 + i * 5} />
        ))}
      </div>
      <div
        style={{
          position: "absolute", left: 30, right: 30, top: 830, height: 96, borderRadius: 96, background: T.mint,
          display: "grid", placeItems: "center", ...body(31, T.white, 700), opacity: btn,
          transform: `scale(${interpolate(btn, [0, 1], [0.7, 1]) * pressed})`,
          boxShadow: "0 16px 30px -10px rgba(5,171,135,0.6)",
        }}
      >
        Sumar mis estrellitas
      </div>
    </AbsoluteFill>
  );
};

const RewardRow: React.FC<{ n: number; label: string; at: number }> = ({ n, label, at }) => {
  const p = useIn(at, theme.spring.snappy);
  return (
    <div
      style={{
        display: "flex", alignItems: "center", gap: 18, background: T.white, borderRadius: 26, padding: "18px 20px",
        border: `2px solid ${T.line}`, opacity: p, transform: `translateX(${(1 - p) * 60}px)`,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 6, background: T.starSoft, borderRadius: 40, padding: "8px 14px" }}>
        <StarIcon size={30} color={T.star} />
        <span style={{ ...display(32, T.ink) }}>{n}</span>
      </div>
      <span style={{ ...body(30, T.ink, 700) }}>{label}</span>
    </div>
  );
};

// ---------- Paso 02 ----------
const ChatScreen: React.FC = () => {
  const frame = useCurrentFrame();
  const out = useIn(140, theme.spring.snappy);
  const read = frame >= 156;
  const typing = frame >= 164 && frame < 184;
  const incoming = useIn(184, theme.spring.snappy);
  const tag = useIn(194, theme.spring.bouncy);
  return (
    <AbsoluteFill style={{ background: T.chat }}>
      <div style={{ background: T.ink, padding: "84px 26px 22px", display: "flex", alignItems: "center", gap: 16 }}>
        <div style={{ width: 64, height: 64, borderRadius: "50%", background: T.star, display: "grid", placeItems: "center", ...display(34, T.ink) }}>B</div>
        <div>
          <div style={{ ...body(30, T.cream, 700) }}>Brasa</div>
          <div style={{ ...body(20, "rgba(253,249,242,0.7)", 500) }}>{typing ? "escribiendo…" : "en línea"}</div>
        </div>
      </div>
      <div style={{ padding: "30px 22px", display: "flex", flexDirection: "column", gap: 20 }}>
        <div
          style={{
            alignSelf: "flex-end", maxWidth: 400, background: T.bubbleOut, borderRadius: "28px 28px 8px 28px", padding: "18px 22px 12px",
            opacity: out, transform: `translateY(${(1 - out) * 40}px) scale(${interpolate(out, [0, 1], [0.8, 1])})`, transformOrigin: "right bottom",
            boxShadow: "0 3px 0 rgba(2,49,42,0.06)",
          }}
        >
          <div style={{ ...body(28, T.ink, 500) }}>Quiero sumar mis estrellitas en Brasa</div>
          <div style={{ display: "flex", justifyContent: "flex-end", alignItems: "center", gap: 6, ...body(18, T.inkMuted), marginTop: 4 }}>
            20:41 <DoubleCheckIcon size={26} color={read ? "#2F9BD6" : T.inkMuted} />
          </div>
        </div>
        {typing && <Typing />}
        {frame >= 184 && (
          <div
            style={{
              alignSelf: "flex-start", maxWidth: 440, background: T.bubbleIn, borderRadius: "28px 28px 28px 8px", padding: "20px 22px 14px",
              opacity: incoming, transform: `translateY(${(1 - incoming) * 40}px) scale(${interpolate(incoming, [0, 1], [0.8, 1])})`, transformOrigin: "left bottom",
              boxShadow: "0 3px 0 rgba(2,49,42,0.06)",
            }}
          >
            <div style={{ ...body(30, T.ink, 700) }}>¡Sumaste tu 3.ª estrellita, Juli!</div>
            <div style={{ display: "flex", gap: 6, margin: "12px 0" }}>
              {[0, 1, 2].map((i) => (
                <StarIcon key={i} size={44} color={T.star} style={{ opacity: frame >= 200 + i * 5 ? 0.25 : 1 }} />
              ))}
              {[3, 4].map((i) => <StarIcon key={i} size={44} color={T.line} />)}
            </div>
            <div style={{ ...body(28, T.ink, 500) }}>Te faltan 2 para tu postre de regalo.</div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 12 }}>
              <div
                style={{
                  display: "flex", alignItems: "center", gap: 6, background: T.mintSoft, borderRadius: 30, padding: "6px 14px",
                  ...body(20, T.mintDeep, 700), opacity: tag, transform: `scale(${interpolate(tag, [0, 1], [0.6, 1])})`, transformOrigin: "left center",
                }}
              >
                <SparkleIcon size={22} color={T.mint} /> automático
              </div>
              <span style={{ ...body(18, T.inkMuted) }}>20:41</span>
            </div>
          </div>
        )}
      </div>
    </AbsoluteFill>
  );
};

const Typing: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <div style={{ alignSelf: "flex-start", background: T.bubbleIn, borderRadius: 28, padding: "20px 24px", display: "flex", gap: 10 }}>
      {[0, 1, 2].map((i) => (
        <div key={i} style={{ width: 14, height: 14, borderRadius: "50%", background: T.inkMuted, transform: `translateY(${Math.sin(frame / 3 - i) * 5}px)` }} />
      ))}
    </div>
  );
};

/** Las tres estrellitas saltan desde la burbuja y se acomodan afuera del teléfono. */
const FlyingStars: React.FC = () => {
  const frame = useCurrentFrame();
  // origen aproximado: fila de estrellas de la burbuja entrante
  const origin = { x: PHONE_X + 60, y: PHONE_Y + 560 };
  const targets = [
    { x: 150, y: 820, s: 150 },
    { x: 930, y: 700, s: 170 },
    { x: 925, y: 1080, s: 140 },
  ];
  const leave = ease(frame, [258, 268], [0, 1], theme.ease.in);
  const breathe = useBreathe(0.04, 9);
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      {targets.map((t, i) => {
        const at = 200 + i * 5;
        const p = ease(frame, [at, at + 18], [0, 1]);
        const x = interpolate(p, [0, 1], [origin.x + i * 50, t.x]);
        const y = interpolate(p, [0, 1], [origin.y, t.y]) - Math.sin(p * Math.PI) * 240;
        const sc = interpolate(p, [0, 1], [0.3, 1]) * (p >= 1 ? breathe : 1) * (1 - leave);
        if (frame < at) return null;
        return (
          <div key={i} style={{ position: "absolute", left: x - t.s / 2, top: y - t.s / 2, transform: `scale(${sc}) rotate(${(1 - p) * 200}deg)` }}>
            <StarIcon size={t.s} color={T.star} style={{ filter: "drop-shadow(0 16px 20px rgba(2,49,42,0.25))" }} />
          </div>
        );
      })}
    </AbsoluteFill>
  );
};

// ---------- Paso 03 ----------
const CardScreen: React.FC = () => {
  const frame = useCurrentFrame();
  const head = useIn(272, theme.spring.smooth);
  const flip = ease(frame, [338, 362], [0, 180], theme.ease.inOut);
  const filled = 3 + (frame >= 300 ? 1 : 0) + (frame >= 315 ? 1 : 0);
  const done = filled >= 5;
  return (
    <AbsoluteFill style={{ background: T.cream, padding: "96px 30px 30px" }}>
      <div style={{ opacity: head, transform: `translateY(${(1 - head) * 30}px)` }}>
        <div style={{ ...body(22, T.inkMuted, 700), letterSpacing: "0.08em", textTransform: "uppercase" }}>Tu tarjeta en Brasa</div>
        <div style={{ ...display(64, T.ink), marginTop: 6 }}>Hola, Juli</div>
      </div>
      <div style={{ perspective: 1600, marginTop: 30 }}>
        <div style={{ position: "relative", height: 470, transformStyle: "preserve-3d", transform: `rotateY(${flip}deg)` }}>
          {/* Frente: estrellitas */}
          <div
            style={{
              position: "absolute", inset: 0, backfaceVisibility: "hidden", borderRadius: 40, background: T.ink, padding: "36px 30px",
              boxShadow: "0 24px 50px -24px rgba(2,49,42,0.7)",
            }}
          >
            <div style={{ ...body(24, "rgba(253,249,242,0.7)", 600) }}>Tus estrellitas</div>
            <div style={{ display: "flex", justifyContent: "space-between", marginTop: 26 }}>
              {[0, 1, 2, 3, 4].map((i) => <Slot key={i} i={i} filled={i < filled} fillAt={i === 3 ? 300 : i === 4 ? 315 : -99} />)}
            </div>
            <div style={{ ...display(40, T.cream, 700), marginTop: 40, letterSpacing: "-0.02em" }}>
              {done ? "¡Ganaste tu postre!" : `Te faltan ${5 - filled} para tu postre`}
            </div>
            <div style={{ height: 14, borderRadius: 14, background: "rgba(253,249,242,0.15)", marginTop: 22, overflow: "hidden" }}>
              <div style={{ height: "100%", width: `${(filled / 5) * 100}%`, background: T.star, borderRadius: 14 }} />
            </div>
          </div>
          {/* Dorso: cupón */}
          <div
            style={{
              position: "absolute", inset: 0, backfaceVisibility: "hidden", transform: "rotateY(180deg)", borderRadius: 40,
              background: T.white, border: `4px dashed ${T.mint}`, display: "flex", flexDirection: "column", alignItems: "center",
              justifyContent: "center", gap: 16, textAlign: "center",
            }}
          >
            <div style={{ width: 120, height: 120, borderRadius: 36, background: T.peach, display: "grid", placeItems: "center" }}>
              <CakeIcon size={76} color="#C0641F" stroke={1.7} />
            </div>
            <div style={{ ...display(54, T.ink) }}>Postre de regalo</div>
            <div style={{ ...body(24, T.inkSoft, 600) }}>Mostrá este código en el local</div>
            <div style={{ ...display(52, T.mintDeep), letterSpacing: "0.08em", fontVariantNumeric: "tabular-nums" }}>482 913</div>
          </div>
        </div>
      </div>
      <div style={{ marginTop: 34, display: "flex", flexDirection: "column", gap: 14, opacity: head }}>
        {["Visita · hoy", "Visita · hace 6 días", "Visita · hace 13 días"].map((t, i) => (
          <div key={t} style={{ display: "flex", alignItems: "center", gap: 14, ...body(26, T.inkSoft, 600) }}>
            <StarIcon size={28} color={i === 0 && frame >= 315 ? T.star : T.inkMuted} /> {t}
          </div>
        ))}
      </div>
    </AbsoluteFill>
  );
};

const Slot: React.FC<{ i: number; filled: boolean; fillAt: number }> = ({ filled, fillAt }) => {
  const frame = useCurrentFrame();
  const popRaw = useIn(Math.max(0, fillAt), theme.spring.bouncy);
  const pop = fillAt > 0 ? popRaw : 1;
  const ring = fillAt > 0 ? ease(frame, [fillAt, fillAt + 14], [0, 1]) : 1;
  const scale = fillAt > 0 && frame >= fillAt ? interpolate(pop, [0, 0.6, 1], [0, 1.3, 1]) : 1;
  return (
    <div style={{ position: "relative", width: 76, height: 76, borderRadius: "50%", background: "rgba(253,249,242,0.1)", display: "grid", placeItems: "center" }}>
      {fillAt > 0 && frame >= fillAt && ring < 1 && (
        <div style={{ position: "absolute", inset: -6, borderRadius: "50%", border: `4px solid ${T.star}`, transform: `scale(${1 + ring * 0.8})`, opacity: 1 - ring }} />
      )}
      <StarIcon size={60} color={filled ? T.star : "rgba(253,249,242,0.22)"} style={{ transform: `scale(${filled ? scale : 1})` }} />
    </div>
  );
};

/** Lluvia de estrellitas cuando se completa la tarjeta. */
const StarRain: React.FC = () => {
  const frame = useCurrentFrame();
  const t = frame - 318;
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      {Array.from({ length: 32 }).map((_, i) => {
        const a = random(`a${i}`) * Math.PI * 2;
        const v = 18 + random(`v${i}`) * 26;
        const x = 540 + Math.cos(a) * v * t;
        const y = 960 + Math.sin(a) * v * t * 0.8 + 1.1 * t * t;
        const size = 34 + random(`s${i}`) * 44;
        const o = interpolate(t, [0, 4, 40, 56], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
        return (
          <div key={i} style={{ position: "absolute", left: x, top: y, opacity: o, transform: `rotate(${t * (8 + i)}deg)` }}>
            <StarIcon size={size} color={i % 5 === 0 ? T.mint : T.star} />
          </div>
        );
      })}
    </AbsoluteFill>
  );
};
