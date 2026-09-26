import React from "react";
import { noise2D } from "@remotion/noise";
import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";
import { Character } from "../components/Character";
import { GodRays } from "../fx/GodRays";
import { Sparkles } from "../fx/Sparkles";
import { RedeemStage, TableScene } from "../scenes/Client";
import { LockDelivery } from "../scenes/Owner";
import { LightLeak } from "../components/Light";
import { Bars3D } from "../components/Bars3D";
import { DepthIn } from "../components/Camera";
import { PanelShot, Tap } from "../components/Device";
import { Aurora } from "../components/Glass";
import { Spotlight } from "../components/Marks";
import { Tickets, VisitStack } from "../fx/Tickets";
import { Emoji3D as E3D, EmojiName } from "../components/Emoji";
import { Emoji3D } from "../components/Emoji";
import { CheckIcon, SparkleIcon, StarIcon } from "../components/Icons";
import { useIn } from "../components/Motion";
import { Star3D } from "../components/Star3D";
import { body, display } from "../components/Type";
import { T, theme } from "../theme";
import { Field, Mono, Typed, Words } from "./Kit";

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const expoOut = Easing.bezier(0.16, 1, 0.3, 1);
const L = 84; // margen izquierdo de los titulares

// ---------- gancho ----------
export const HookQuestion: React.FC = () => (
  <Field c="ink">
    <Tickets />
    {/* velo oscuro detrás de la pregunta para que se lea sobre las comandas */}
    <AbsoluteFill style={{ background: "linear-gradient(180deg, rgba(2,49,42,0.2) 0%, rgba(2,49,42,0.93) 26%, rgba(2,49,42,0.93) 56%, rgba(2,49,42,0.15) 78%)" }} />
    <Words c="ink" size={128} at={2} per={3} lines={[["¿Tenés", "un"], ["comercio"], [{ t: "gastronómico?", hl: true }]]} style={{ position: "absolute", left: L, top: 560 }} />
  </Field>
);

export const HookClaim: React.FC = () => {
  const f = useCurrentFrame();
  const n = Math.round(interpolate(f, [8, 34], [0, 12], { ...clamp, easing: expoOut }));
  const pop = useIn(8, theme.spring.bouncy);
  const v = interpolate(f, [12, 22], [0, 1], { ...clamp, easing: expoOut });
  const paint = interpolate(f, [16, 26], [0, 1], { ...clamp, easing: expoOut });
  return (
    <Field c="mint">
      <VisitStack count={n} x={300} y={1020} />
      <div style={{ position: "absolute", left: L, top: 330 }}>
        <Words c="mint" size={112} at={0} lines={[["Un", "cliente", "vino"]]} />
        {/* número y "veces" comparten la línea de base */}
        <div style={{ display: "flex", alignItems: "baseline", gap: 46, marginTop: -10 }}>
          <span style={{ ...display(400, T.ink, 800), letterSpacing: "-0.06em", lineHeight: 1, fontVariantNumeric: "tabular-nums", display: "inline-block", transform: `scale(${interpolate(pop, [0, 1], [0.6, 1])})`, transformOrigin: "20% 80%", opacity: Math.min(1, pop * 2) }}>{n}</span>
          <span style={{ position: "relative", display: "inline-block", ...display(150, paint > 0.5 ? T.cream : T.ink, 800), letterSpacing: "-0.045em", opacity: Math.min(1, v * 1.6), transform: `translateY(${(1 - v) * 60}px)` }}>
            <span style={{ position: "absolute", left: -26, right: -26, top: 22, bottom: -6, background: T.ink, borderRadius: 18, transform: `scaleX(${paint})`, transformOrigin: "left center" }} />
            <span style={{ position: "relative" }}>veces</span>
          </span>
        </div>
        <Words c="mint" size={112} at={20} lines={[["este", "año."]]} style={{ marginTop: -6 }} />
      </div>
    </Field>
  );
};

const FloatQ: React.FC<{ at: number; x: number; y: number; size: number; color: string; rotate: number }> = ({ at, x, y, size, color, rotate }) => {
  const f = useCurrentFrame();
  const p = useIn(at, theme.spring.bouncy);
  if (f < at) return null;
  const dx = noise2D(`qx${x}`, f / 60, 0) * 18;
  const dy = noise2D(`qy${y}`, f / 60, 0) * 18;
  return <div style={{ position: "absolute", left: x + dx, top: y + dy, ...display(size, color, 800), opacity: Math.min(1, p * 1.5), transform: `scale(${p}) rotate(${rotate}deg)` }}>?</div>;
};

/** Anillos que se abren hacia cámara mientras el círculo queda igual (dolly zoom). */
const DollyRings: React.FC<{ dur: number }> = ({ dur }) => {
  const f = useCurrentFrame();
  const t = interpolate(f, [0, dur], [0, 1], { ...clamp, easing: Easing.bezier(0.65, 0, 0.35, 1) });
  const o = interpolate(f, [0, 10], [0, 1], clamp);
  return (
    <svg width={1080} height={1920} style={{ position: "absolute", inset: 0, opacity: o }}>
      {Array.from({ length: 9 }).map((_, i) => {
        const r = (340 + i * 150) * (1 + t * (1.1 + i * 0.12));
        return <circle key={i} cx={540} cy={1200} r={r} fill="none" stroke={T.mint} strokeOpacity={0.4 - i * 0.035} strokeWidth={5 + i * 3} />;
      })}
    </svg>
  );
};

export const HookWho: React.FC<{ dur: number }> = ({ dur }) => {
  const f = useCurrentFrame();
  const pill = interpolate(f, [8, 20], [0, 1], { ...clamp, easing: expoOut });
  const card = useIn(10, theme.spring.bouncy);
  const build = interpolate(f, [dur * 0.55, dur - 2], [0, 1], { ...clamp, easing: Easing.in(Easing.cubic) });
  const shake = Math.sin(f * 1.7) * build * 6;
  return (
    <Field c="ink">
      <GodRays origin={[0, -0.28]} intensity={0.3 + build * 0.25} bloom={0.35 + build * 0.3} />
      <DollyRings dur={dur} />
      <div style={{ position: "absolute", left: 0, right: 0, top: 330, display: "flex", flexDirection: "column", alignItems: "center" }}>
        <Words c="ink" size={190} at={0} lines={[["¿Sabés"]]} />
        <div style={{ position: "relative", marginTop: 6 }}>
          <div style={{ position: "absolute", left: -34, right: -34, top: 18, bottom: -6, borderRadius: 160, background: T.mint, transform: `scaleX(${pill})`, transformOrigin: "left center" }} />
          <Words c="ink" size={190} at={4} lines={[["quién", "es?"]]} style={{ position: "relative" }} />
        </div>
      </div>
      {/* la clienta, detrás de un vidrio esmerilado e iluminada desde atrás */}
      <div style={{
        position: "absolute", left: 540 - 300, top: 900, width: 600, height: 600, borderRadius: "50%", overflow: "hidden", background: T.mint, opacity: card,
        transform: `scale(${interpolate(card, [0, 1], [0.5, 1]) * (1 + build * 0.08)}) translateX(${shake}px)`,
        boxShadow: `0 0 0 10px ${T.mint}, 0 0 ${80 + build * 80}px ${20 + build * 30}px rgba(5,171,135,0.55), 0 30px 80px rgba(0,0,0,0.4)`,
      }}>
        <div style={{ position: "absolute", left: 70, top: 80, filter: `blur(${16 - build * 6}px)`, opacity: 0.9 }}>
          <Character body="Device" hair="Long" face="SmileBig" width={460} fill={T.white} />
        </div>
        <AbsoluteFill style={{ background: "rgba(5,171,135,0.25)" }} />
      </div>
      <FloatQ at={20} x={130} y={930} size={200} color={T.star} rotate={-14} />
      <FloatQ at={25} x={830} y={1000} size={150} color={T.cream} rotate={12} />
      <FloatQ at={30} x={800} y={1390} size={130} color={T.mint} rotate={-6} />
    </Field>
  );
};

// ---------- los tres pasos del cliente ----------
export const StepScan: React.FC = () => {
  const f = useCurrentFrame();
  const pill = useIn(66, theme.spring.bouncy);
  return (
    <Field c="cream">
      <Words c="cream" size={96} at={0} per={2} lines={[["El", "cliente", "escanea"], ["el", { t: "QR", hl: true }, "en", "la", "mesa."]]} style={{ position: "absolute", left: 70, top: 250, zIndex: 3 }} />
      <TableScene scanAt={22} />
      <Star3D size={330} at={56} x={680} y={560} turns={1.5} />
      {f >= 66 && (
        <div style={{ position: "absolute", left: 680, top: 880, background: T.star, borderRadius: 60, padding: "14px 28px", ...display(44, T.ink, 800), transform: `scale(${interpolate(pill, [0, 1], [0.4, 1])}) rotate(-4deg)`, boxShadow: "0 16px 30px -14px rgba(0,0,0,0.45)" }}>
          +1 estrellita
        </div>
      )}
    </Field>
  );
};

export const StepStars: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <Field c="mint">
      <Sparkles count={36} seed="st" color="#FFF6D8" area={{ x: 0, y: 700, w: 1080, h: 900 }} />
      <Words c="mint" size={138} at={0} per={3} lines={[["En", "cada"], ["visita,", "suma"], [{ t: "estrellitas.", hl: true }]]} style={{ position: "absolute", left: 70, top: 260 }} />
      <Star3D size={480} at={8} x={540 - 240} y={960} turns={1.5} />
      <div style={{ position: "absolute", left: 0, right: 0, top: 1500, display: "flex", justifyContent: "center", gap: 22 }}>
        {[0, 1, 2, 3, 4].map((i) => {
          const on = f >= 22 + i * 7;
          const p = interpolate(f, [22 + i * 7, 30 + i * 7], [0.4, 1], { ...clamp, easing: expoOut });
          return (
            <div key={i} style={{ width: 120, height: 120, borderRadius: "50%", background: on ? T.ink : "rgba(2,49,42,0.15)", display: "grid", placeItems: "center" }}>
              <StarIcon size={80} color={on ? T.star : "rgba(2,49,42,0.25)"} style={{ transform: `scale(${on ? p : 1})` }} />
            </div>
          );
        })}
      </div>
    </Field>
  );
};

export const StepPrize: React.FC = () => (
  <Field c="cream">
    <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 60%, rgba(245,184,61,0.28), transparent 60%)" }} />
    <Words c="cream" size={130} at={0} lines={[["Desbloquea"], [{ t: "premios.", hl: true }]]} style={{ position: "absolute", left: 70, top: 230, zIndex: 3 }} />
    <RedeemStage dy={150} />
    <LightLeak at={26} dur={40} dir={-1} strength={0.55} />
  </Field>
);

// ---------- el comercio ----------
export const Commerce: React.FC = () => (
  <Field c="mint">
    <Sparkles count={40} seed="co" color="#FFFFFF" area={{ x: 0, y: 1000, w: 1080, h: 920 }} size={4} opacity={0.8} />
    <Words c="mint" size={160} at={0} lines={[["¿Y", "tu"], ["comercio"], [{ t: "qué gana?", hl: true }]]} style={{ position: "absolute", left: L, top: 470 }} />
  </Field>
);

const Segment: React.FC<{ at: number; label: string; n: string; dot: string }> = ({ at, label, n, dot }) => (
  <DepthIn at={at} dur={16} from={{ rx: 0, ry: -30, z: -300, y: 0 }}>
    <div style={{ width: 912, display: "flex", alignItems: "center", gap: 26, padding: "30px 40px", borderRadius: 40, background: "rgba(253,249,242,0.07)", border: "2px solid rgba(253,249,242,0.18)" }}>
      <span style={{ width: 34, height: 34, borderRadius: "50%", background: dot, boxShadow: `0 0 24px ${dot}` }} />
      <span style={{ ...display(62, T.cream, 800), flex: 1 }}>{label}</span>
      <span style={{ fontFamily: "JetBrains Mono", fontWeight: 700, fontSize: 60, color: T.mint }}>{n}</span>
    </div>
  </DepthIn>
);

export const BenefitKnow: React.FC = () => (
  <Field c="ink">
    <Words c="ink" size={150} at={0} lines={[["Conocés", "a"], ["tus", { t: "clientes.", hl: true }]]} style={{ position: "absolute", left: L, top: 330 }} />
    <div style={{ position: "absolute", left: 84, top: 790, display: "flex", flexDirection: "column", gap: 26 }}>
      <Segment at={14} label="Nuevos" n="63" dot="#6EA8FE" />
      <Segment at={20} label="Frecuentes" n="148" dot={T.mint} />
      <Segment at={26} label="En riesgo" n="37" dot="#F08A4B" />
    </div>
  </Field>
);

const ProfileRow: React.FC<{ at: number; y: number; big?: boolean; children: React.ReactNode }> = ({ at, y, big, children }) => {
  const f = useCurrentFrame();
  const p = interpolate(f, [at, at + 10], [0, 1], { ...clamp, easing: expoOut });
  const line = interpolate(f, [at - 6, at + 2], [0, 1], clamp);
  return (
    <>
      <div style={{ position: "absolute", left: 132, top: y + (big ? 44 : 34), width: 60 * line, height: 5, background: T.mint, borderRadius: 4 }} />
      <div style={{ position: "absolute", left: 210, top: y, opacity: p, transform: `translateX(${(1 - p) * 40}px)`, filter: p < 1 ? `blur(${(1 - p) * 8}px)` : undefined, ...(big ? display(88, T.cream, 800) : body(54, T.cream, 700)) }}>{children}</div>
    </>
  );
};

/** El sistema identifica el perfil: retrato escaneado y los datos saliendo en líneas. */
export const Profile: React.FC = () => {
  const f = useCurrentFrame();
  const card = useIn(0, theme.spring.smooth);
  const scan = interpolate(f, [8, 36], [0, 1], { ...clamp, easing: Easing.inOut(Easing.cubic) });
  const spine = interpolate(f, [34, 80], [0, 1], clamp);
  const corner = interpolate(f, [4, 14], [0, 1], { ...clamp, easing: expoOut });
  return (
    <Field c="ink">
      <Aurora base={T.ink} colors={["rgba(5,171,135,0.3)", "rgba(245,184,61,0.12)", "rgba(5,171,135,0.2)"]} />
      <Mono c="ink" text="PERFIL DEL CLIENTE" at={0} style={{ position: "absolute", left: 90, top: 250 }} />
      {/* retrato con marco de reconocimiento */}
      <div style={{ position: "absolute", left: 540 - 250, top: 330, width: 500, height: 520, borderRadius: 48, overflow: "hidden", background: T.mintSoft, opacity: card, transform: `scale(${interpolate(card, [0, 1], [0.85, 1])})` }}>
        <div style={{ position: "absolute", left: 50, top: 70 }}><Character body="Coffee" hair="ShortVolumed" face="Smile" facialHair="FullMedium" width={400} /></div>
        {f >= 8 && f < 40 && <div style={{ position: "absolute", left: 0, right: 0, top: scan * 520 - 6, height: 12, background: T.mint, boxShadow: `0 0 40px 14px ${T.mintGlow}` }} />}
        <AbsoluteFill style={{ background: `linear-gradient(180deg, transparent ${scan * 100}%, rgba(5,171,135,0.18) ${scan * 100}%)` }} />
      </div>
      {[[0, 0], [1, 0], [0, 1], [1, 1]].map(([cx, cy], i) => (
        <div key={i} style={{
          position: "absolute", left: 540 - 250 - 22 + cx * 544 - (cx ? 60 : 0), top: 330 - 22 + cy * 564 - (cy ? 60 : 0), width: 60, height: 60, opacity: corner,
          borderLeft: cx ? "none" : `8px solid ${T.mint}`, borderRight: cx ? `8px solid ${T.mint}` : "none", borderTop: cy ? "none" : `8px solid ${T.mint}`, borderBottom: cy ? `8px solid ${T.mint}` : "none",
          borderRadius: 14, transform: `scale(${interpolate(corner, [0, 1], [1.3, 1])})`,
        }} />
      ))}
      {/* datos */}
      <div style={{ position: "absolute", left: 128, top: 940, width: 5, height: 560 * spine, background: T.mint, borderRadius: 4 }} />
      <ProfileRow at={38} y={930} big>Pedro</ProfileRow>
      <ProfileRow at={50} y={1080}>Viene 1 vez por semana</ProfileRow>
      <ProfileRow at={62} y={1200}>Cumple el 7 de enero</ProfileRow>
      <ProfileRow at={74} y={1320}>Pide café con leche</ProfileRow>
      <ProfileRow at={86} y={1440}><span style={{ color: T.mint }}>● Frecuente</span></ProfileRow>
    </Field>
  );
};

export const BenefitSlowQ: React.FC = () => (
  <Field c="cream">
    <Words c="cream" size={140} at={0} lines={[["Llená", "los", "días"], [{ t: "más flojos.", hl: true }]]} style={{ position: "absolute", left: 70, top: 330 }} />
    <Words c="cream" size={78} at={16} per={2} lines={[["El", "sistema", "detecta", "tu"], ["día", "más", "flojo", "y", "te"], ["propone", "una", "promo."]]} style={{ position: "absolute", left: 74, top: 760 }} />
  </Field>
);

const kT = 900 / 1194;

/** La sugerencia real del panel: foco en el diagnóstico y después en el mensaje sugerido. */
export const SlowPanel: React.FC = () => {
  const f = useCurrentFrame();
  const toast = useIn(172, theme.spring.bouncy);
  return (
    <Field c="cream">
      <Mono c="cream" text="SUGERENCIA DEL SISTEMA DE IA" at={0} style={{ position: "absolute", left: 90, top: 240 }} />
      <DepthIn at={2} from={{ rx: 16, ry: -16, z: -500 }} style={{ position: "absolute", left: 90, top: 330 }}>
        <div style={{ position: "relative" }}>
          <PanelShot frames={["panel/sugg-tuesday.png"]} srcWidth={1194} srcHeight={1250} width={900}>
            <Spotlight x={236 * kT} y={150 * kT} w={860 * kT} h={210 * kT} at={12} until={88} />
            <Spotlight x={96 * kT} y={755 * kT} w={990 * kT} h={180 * kT} at={92} until={158} />
          </PanelShot>
          <Tap x={470 * kT} y={1167 * kT} at={166} />
        </div>
      </DepthIn>
      {f >= 172 && (
        <div style={{ position: "absolute", left: 70, right: 70, top: 1320, display: "flex", alignItems: "center", gap: 22, background: T.ink, borderRadius: 40, padding: "26px 34px", opacity: Math.min(1, toast * 2), transform: `translateY(${(1 - toast) * 120}px)`, boxShadow: "0 30px 60px -24px rgba(2,49,42,0.6)" }}>
          <div style={{ width: 72, height: 72, borderRadius: "50%", background: T.mint, display: "grid", placeItems: "center", flex: "none" }}><CheckIcon size={44} color={T.ink} /></div>
          <div>
            <div style={{ fontFamily: "JetBrains Mono", fontWeight: 700, fontSize: 24, letterSpacing: "0.12em", color: T.mint }}>PROMO AUTOMÁTICA ACTIVADA</div>
            <div style={{ ...display(46, T.cream, 800), marginTop: 6 }}>Martes de doble estrellita</div>
          </div>
        </div>
      )}
    </Field>
  );
};

/** Gráfico corto: los martes suben. */
export const SlowChart: React.FC = () => (
  <Field c="ink">
    <Words c="ink" size={112} at={0} lines={[["Los", "martes"], [{ t: "+55% de visitas.", hl: true }]]} style={{ position: "absolute", left: 70, top: 300 }} />
    <DepthIn at={6} from={{ rx: 20, ry: -10, z: -500 }} style={{ position: "absolute", left: 70, top: 660 }}>
      <Bars3D at={6} grow={[14, 40]} boostTo={232} width={940} />
    </DepthIn>
  </Field>
);

export const BenefitAIQ: React.FC = () => (
  <Field c="mint">
    <Words c="mint" size={128} at={2} per={2} lines={[["La", "IA", "te"], ["sugiere", "el"], ["mensaje", "para"], [{ t: "cada cliente.", hl: true }]]} style={{ position: "absolute", left: L, top: 380 }} />
  </Field>
);

const SUGGESTIONS: { icon: EmojiName; text: string; action: string }[] = [
  { icon: "hot_beverage", text: "Martín no viene hace 45 días.", action: "Proponele un café sin cargo" },
  { icon: "star", text: "Caro está a 1 estrellita de su premio.", action: "Avisale" },
  { icon: "tear-off_calendar", text: "Los martes vienen pocos clientes.", action: "Activá doble estrellita" },
  { icon: "shortcake", text: "Lucas vino 3 veces esta semana.", action: "Regalale un postre" },
  { icon: "bell", text: "12 frecuentes no vinieron este mes.", action: "Mandales una promo" },
  { icon: "clinking_glasses", text: "Sofi cumple 1 año como clienta.", action: "Saludala" },
  { icon: "birthday_cake", text: "Juli cumple en 5 días.", action: "Invitala a festejar" },
];
const EVERY = 17;
const PEEK = 104; // lo que asoma de cada tarjeta de atrás (la frase principal queda visible)

/**
 * Mazo de sugerencias: cada nueva cae adelante y empuja a las anteriores hacia atrás
 * (más chicas y oscuras), dejando ver su frase. La última es la de Juli.
 */
export const AiWall: React.FC<{ dur: number }> = ({ dur }) => {
  const f = useCurrentFrame();
  const arrived = SUGGESTIONS.reduce((acc, _, j) => acc + interpolate(f, [4 + j * EVERY, 4 + j * EVERY + 14], [0, 1], { ...clamp, easing: expoOut }), 0);
  const last = SUGGESTIONS.length - 1;
  const lit = interpolate(f, [dur - 34, dur - 24], [0, 1], clamp);
  const dive = interpolate(f, [dur - 16, dur], [0, 1], { ...clamp, easing: Easing.in(Easing.cubic) });
  const FRONT = 1290;
  return (
    <Field c="ink">
      <Aurora base={T.ink} colors={["rgba(5,171,135,0.32)", "rgba(245,184,61,0.12)", "rgba(5,171,135,0.22)"]} />
      <Sparkles count={24} seed="wl" area={{ x: 0, y: 0, w: 1080, h: 1920 }} opacity={0.45} />
      <div style={{ position: "absolute", inset: 0, transform: `scale(${1 + dive * 1.8})`, transformOrigin: `540px ${FRONT + 120}px`, filter: dive > 0 ? `blur(${dive * 8}px)` : undefined }}>
        <Mono c="ink" text="SUGERENCIAS DE HOY" at={0} style={{ position: "absolute", left: 90, top: 300 }} />
        {SUGGESTIONS.map((sg, k) => {
          const at = 4 + k * EVERY;
          if (f < at) return null;
          const inP = interpolate(f, [at, at + 14], [0, 1], { ...clamp, easing: expoOut });
          const d = Math.max(0, arrived - 1 - k); // 0 = adelante
          const juli = k === last;
          const y = FRONT - d * PEEK + (1 - inP) * 520;
          const sc = 1 - d * 0.035;
          const shade = Math.min(0.55, d * 0.09);
          const tilt = (1 - inP) * (k % 2 ? 9 : -9) + (k % 2 ? 0.6 : -0.6) * Math.min(1, d);
          return (
            <div key={k} style={{
              position: "absolute", left: 90, top: y, width: 900, height: 240, borderRadius: 36, background: T.cream, overflow: "hidden",
              transform: `scale(${sc}) rotate(${tilt}deg)`, transformOrigin: "50% 0%", zIndex: k, opacity: Math.min(1, inP * 1.8),
              boxShadow: `0 -14px 40px -16px rgba(0,0,0,0.55), 0 30px 60px -30px rgba(0,0,0,0.7), 0 0 0 ${juli ? lit * 8 : 0}px ${T.mint}, 0 0 ${juli ? lit * 70 : 0}px ${juli ? lit * 18 : 0}px rgba(5,171,135,0.55)`,
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: 22, padding: "22px 30px 0" }}>
                <E3D name={sg.icon} size={64} at={at} float={0} depth={0.4} />
                <div style={{ ...body(38, T.ink, 800), lineHeight: 1.15, whiteSpace: "nowrap" }}>{sg.text}</div>
              </div>
              <div style={{ padding: "22px 30px 0 116px" }}>
                <div style={{ display: "inline-block", background: T.mint, borderRadius: 30, padding: "10px 20px", ...body(30, T.ink, 800) }}>→ {sg.action}</div>
              </div>
              <div style={{ position: "absolute", right: 28, top: 26, fontFamily: "JetBrains Mono", fontWeight: 700, fontSize: 20, letterSpacing: "0.12em", color: T.mintDeep }}>IA</div>
              <AbsoluteFill style={{ background: `rgba(2,49,42,${shade})`, pointerEvents: "none" }} />
            </div>
          );
        })}
      </div>
    </Field>
  );
};

export const BenefitAIMsg: React.FC = () => {
  const f = useCurrentFrame();
  const btn = useIn(50, theme.spring.bouncy);
  const pressed = f >= 108 ? interpolate(f, [108, 112], [0.94, 1], clamp) : 1;
  const done = f >= 114;
  return (
    <Field c="cream">
      <DepthIn at={0} dur={16} from={{ rx: 16, ry: -14, z: -400 }} style={{ position: "absolute", left: 70, top: 420, width: 940 }}>
        <div style={{ position: "relative", background: T.white, borderRadius: 48, border: `4px solid ${T.ink}`, padding: "34px 40px 40px", boxShadow: "0 40px 80px -40px rgba(2,49,42,0.5)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, fontFamily: "JetBrains Mono", fontWeight: 700, fontSize: 28, letterSpacing: "0.1em", color: T.mintDeep }}>
            <SparkleIcon size={32} color={T.mint} /> SUGERIDO POR IA · CUMPLE DE JULI
          </div>
          <div style={{ ...body(60, T.ink, 600), lineHeight: 1.28, marginTop: 24, minHeight: 470 }}>
            <Typed text="¡Hola, Juli! Se viene tu cumple: si venís con 4 amigos, tu plato va por nuestra cuenta." at={6} cps={2.2} />
          </div>
          <div style={{ marginTop: 20, display: "inline-flex", alignItems: "center", gap: 14, background: done ? T.ink : T.mint, borderRadius: 80, padding: "26px 46px", ...body(42, T.white, 800), transform: `scale(${interpolate(btn, [0, 1], [0.6, 1]) * pressed})`, opacity: btn, transformOrigin: "left center" }}>
            {done ? <><CheckIcon size={44} color={T.mint} /> Enviado</> : "Aprobar y enviar"}
          </div>
          <Tap x={250} y={700} at={108} />
        </div>
      </DepthIn>
    </Field>
  );
};

export const Delivered: React.FC = () => (
  <Field c="cream">
    <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 55%, rgba(5,171,135,0.22), transparent 62%)" }} />
    <Words c="cream" size={84} at={0} lines={[["Le", "llega", "por", { t: "WhatsApp.", hl: true }]]} style={{ position: "absolute", left: 70, top: 200 }} />
    <LockDelivery />
    <LightLeak at={24} dur={40} strength={0.45} />
  </Field>
);

export const BenefitReturn: React.FC = () => (
  <Field c="ink">
    <Words c="ink" size={170} at={2} lines={[["Tus"], ["clientes"], [{ t: "vuelven.", hl: true }]]} style={{ position: "absolute", left: L, top: 380 }} />
    <Emoji3D name="counterclockwise_arrows_button" size={220} at={16} x={760} y={1380} rotate={-8} depth={1.2} float={0.5} />
  </Field>
);

// ---------- remate ----------
const PlusLine: React.FC<{ at: number; word: string }> = ({ at, word }) => {
  const f = useCurrentFrame();
  const plus = useIn(at, theme.spring.bouncy);
  const reveal = interpolate(f, [at + 4, at + 16], [0, 1], { ...clamp, easing: expoOut });
  const paint = interpolate(f, [at + 10, at + 20], [0, 1], { ...clamp, easing: expoOut });
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 28, height: 200 }}>
      <div style={{ width: 150, height: 150, borderRadius: 40, background: T.mint, display: "grid", placeItems: "center", transform: `scale(${plus}) rotate(${interpolate(plus, [0, 1], [-180, 0])}deg)`, boxShadow: `0 0 ${60 * plus}px rgba(5,171,135,0.5)` }}>
        <span style={{ ...display(140, T.ink, 800), lineHeight: 1, marginTop: -12 }}>+</span>
      </div>
      <div style={{ position: "relative", clipPath: `inset(0 ${(1 - reveal) * 100}% 0 0)` }}>
        <span style={{ ...display(128, T.cream, 800), letterSpacing: "-0.045em", display: "inline-block", transform: `translateX(${(1 - reveal) * -60}px)` }}>{word}</span>
        <div style={{ position: "absolute", left: 0, bottom: 6, height: 12, width: `${paint * 100}%`, background: T.star, borderRadius: 8 }} />
      </div>
    </div>
  );
};

/** + frecuencia. + clientes. + ventas. */
export const Punch: React.FC = () => (
  <Field c="ink">
    <Aurora base={T.ink} colors={["rgba(5,171,135,0.35)", "rgba(245,184,61,0.16)", "rgba(5,171,135,0.25)"]} />
    <Sparkles count={30} seed="pu" area={{ x: 0, y: 0, w: 1080, h: 1920 }} opacity={0.6} />
    <div style={{ position: "absolute", left: 84, top: 620, display: "flex", flexDirection: "column", gap: 34 }}>
      <PlusLine at={0} word="frecuencia." />
      <PlusLine at={10} word="clientes." />
      <PlusLine at={20} word="ventas." />
    </div>
  </Field>
);
