import React from "react";
import { Easing, interpolate, useCurrentFrame } from "remotion";
import { Bars3D } from "../components/Bars3D";
import { DepthIn } from "../components/Camera";
import { Qr, Tap } from "../components/Device";
import { Emoji3D } from "../components/Emoji";
import { CheckIcon, SparkleIcon, StarIcon } from "../components/Icons";
import { useIn } from "../components/Motion";
import { Star3D } from "../components/Star3D";
import { body, display } from "../components/Type";
import { T, theme } from "../theme";
import { Field, Mono, Ticker, Typed, Words } from "./Kit";

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const expoOut = Easing.bezier(0.16, 1, 0.3, 1);
const L = 84; // margen izquierdo de los titulares

// ---------- gancho ----------
export const HookQuestion: React.FC = () => (
  <Field c="ink">
    <Ticker words={["RESTÓ", "BAR", "CAFÉ", "PARRILLA", "PIZZERÍA", "HELADERÍA"]} y={1230} size={230} speed={-5} color={T.mint} opacity={0.55} />
    <Ticker words={["CERVECERÍA", "PANADERÍA", "BODEGÓN", "CAFETERÍA", "RESTÓ"]} y={1500} size={230} speed={5} color={T.cream} opacity={0.18} />
    <Words c="ink" size={128} at={2} per={3} lines={[["¿Tenés", "un"], ["comercio"], [{ t: "gastronómico?", hl: true }]]} style={{ position: "absolute", left: L, top: 470 }} />
  </Field>
);

export const HookClaim: React.FC = () => {
  const f = useCurrentFrame();
  const n = Math.round(interpolate(f, [8, 30], [0, 12], { ...clamp, easing: expoOut }));
  const pop = useIn(8, theme.spring.bouncy);
  return (
    <Field c="mint">
      <div style={{ position: "absolute", left: L, top: 430 }}>
        <Words c="mint" size={112} at={0} lines={[["Un", "cliente", "vino"]]} />
        {/* número y "veces" sobre la misma línea de base */}
        <div style={{ display: "flex", alignItems: "baseline", gap: 44, marginTop: -10 }}>
          <span style={{ ...display(400, T.ink, 800), letterSpacing: "-0.06em", lineHeight: 1, fontVariantNumeric: "tabular-nums", display: "inline-block", transform: `scale(${interpolate(pop, [0, 1], [0.6, 1])})`, transformOrigin: "20% 80%", opacity: Math.min(1, pop * 2) }}>{n}</span>
          <Words c="mint" size={150} at={12} lines={[[{ t: "veces", hl: true }]]} />
        </div>
        <Words c="mint" size={112} at={20} lines={[["este", "año."]]} style={{ marginTop: -6 }} />
      </div>
    </Field>
  );
};

export const HookWho: React.FC = () => {
  const f = useCurrentFrame();
  const shake = f > 34 ? Math.sin(f * 2.1) * (f - 34) * 0.5 : 0;
  return (
    <Field c="ink">
      <Ticker words={["¿QUIÉN ES?"]} y={1330} size={300} speed={-7} color={T.mint} opacity={0.25} />
      <Words c="ink" size={200} at={0} per={4} align="center" lines={[["¿Sabés"], [{ t: "quién es?", hl: true }]]} style={{ position: "absolute", left: 0, right: 0, top: 640, transform: `translateX(${shake}px)` }} />
    </Field>
  );
};

// ---------- los tres pasos del cliente ----------
export const StepQR: React.FC = () => {
  const f = useCurrentFrame();
  const qr = interpolate(f, [8, 32], [0, 1], { ...clamp, easing: expoOut });
  const scan = interpolate(f, [30, 58], [0, 1], clamp);
  return (
    <Field c="ink">
      <Mono c="ink" text="PASO 01 · TU CLIENTE" at={0} style={{ position: "absolute", left: L, top: 300 }} />
      <Words c="ink" size={170} at={2} lines={[["Escanea"], ["el", { t: "QR.", hl: true }]]} style={{ position: "absolute", left: L, top: 380 }} />
      <DepthIn at={6} from={{ rx: 20, ry: -16, z: -400 }} style={{ position: "absolute", left: 540 - 250, top: 1020 }}>
        <div style={{ position: "relative", width: 500, height: 500, borderRadius: 48, background: T.cream, display: "grid", placeItems: "center", boxShadow: "0 40px 80px -30px rgba(0,0,0,0.6)" }}>
          <Qr size={400} progress={qr} />
          {f >= 30 && f < 60 && <div style={{ position: "absolute", left: 30, right: 30, top: 40 + scan * 400, height: 10, borderRadius: 10, background: T.mint, boxShadow: `0 0 30px 8px ${T.mintGlow}` }} />}
        </div>
      </DepthIn>
    </Field>
  );
};

export const StepStars: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <Field c="mint">
      <Mono c="mint" text="PASO 02 · EN CADA VISITA" at={0} style={{ position: "absolute", left: L, top: 300 }} />
      <Words c="mint" size={170} at={2} lines={[["Suma"], [{ t: "estrellitas.", hl: true }]]} style={{ position: "absolute", left: L, top: 380 }} />
      <Star3D size={520} at={6} x={540 - 260} y={880} turns={1.5} />
      <div style={{ position: "absolute", left: 0, right: 0, top: 1480, display: "flex", justifyContent: "center", gap: 22 }}>
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
    <Mono c="cream" text="PASO 03 · PREMIO" at={0} style={{ position: "absolute", left: L, top: 300 }} />
    <Words c="cream" size={150} at={2} lines={[["Desbloquea"], [{ t: "premios.", hl: true }]]} style={{ position: "absolute", left: L, top: 380 }} />
    <DepthIn at={6} from={{ rx: -18, ry: 20, z: -500 }} style={{ position: "absolute", left: 540 - 360, top: 900 }}>
      <div style={{ width: 720, borderRadius: 48, background: T.white, border: `6px dashed ${T.mint}`, padding: "40px 40px 46px", display: "flex", flexDirection: "column", alignItems: "center", gap: 18, boxShadow: "0 40px 80px -40px rgba(2,49,42,0.5)" }}>
        <div style={{ fontFamily: "JetBrains Mono", fontWeight: 700, fontSize: 30, letterSpacing: "0.14em", color: T.mintDeep }}>¡PRIMER PREMIO!</div>
        <Emoji3D name="shortcake" size={190} at={12} float={0.3} />
        <div style={{ ...display(66, T.ink, 800) }}>Postre sin cargo</div>
      </div>
    </DepthIn>
  </Field>
);

// ---------- el comercio ----------
export const Commerce: React.FC = () => (
  <Field c="mint">
    <Ticker words={["MÁS VISITAS", "MÁS CLIENTES", "MÁS VENTAS"]} y={1380} size={200} speed={-6} color={T.ink} opacity={0.3} />
    <Words c="mint" size={160} at={0} lines={[["¿Y", "tu"], ["comercio"], [{ t: "qué gana?", hl: true }]]} style={{ position: "absolute", left: L, top: 470 }} />
  </Field>
);

const Chip: React.FC<{ at: number; label: string; n: string; dot: string }> = ({ at, label, n, dot }) => {
  const p = useIn(at, theme.spring.bouncy);
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 14, padding: "18px 28px", borderRadius: 60, border: "2px solid rgba(253,249,242,0.25)", background: "rgba(253,249,242,0.06)", transform: `scale(${interpolate(p, [0, 1], [0.5, 1])})`, opacity: Math.min(1, p * 2) }}>
      <span style={{ width: 18, height: 18, borderRadius: "50%", background: dot }} />
      <span style={{ ...body(38, T.cream, 700) }}>{label}</span>
      <span style={{ fontFamily: "JetBrains Mono", fontWeight: 700, fontSize: 34, color: T.mint }}>{n}</span>
    </div>
  );
};

export const BenefitKnow: React.FC = () => (
  <Field c="ink">
    <Mono c="ink" text="BENEFICIO 01" at={0} style={{ position: "absolute", left: L, top: 300 }} />
    <Words c="ink" size={150} at={2} lines={[["Conocés", "a"], ["tus", { t: "clientes.", hl: true }]]} style={{ position: "absolute", left: L, top: 380 }} />
    <div style={{ position: "absolute", left: L, right: 60, top: 1000, display: "flex", flexWrap: "wrap", gap: 20 }}>
      <Chip at={14} label="Nuevos" n="63" dot="#6EA8FE" />
      <Chip at={18} label="Frecuentes" n="148" dot={T.mint} />
      <Chip at={22} label="En riesgo" n="37" dot="#F08A4B" />
    </div>
  </Field>
);

export const BenefitSlowQ: React.FC = () => (
  <Field c="cream">
    <Mono c="cream" text="BENEFICIO 02" at={0} style={{ position: "absolute", left: L, top: 300 }} />
    <Words c="cream" size={230} at={2} per={4} lines={[["¿Martes"], [{ t: "flojo?", hl: true }]]} style={{ position: "absolute", left: L, top: 620 }} />
  </Field>
);

export const BenefitSlowA: React.FC = () => {
  const f = useCurrentFrame();
  const pill = useIn(52, theme.spring.bouncy);
  return (
    <Field c="ink">
      <Words c="ink" size={116} at={0} lines={[["Doble", "estrellita"], [{ t: "los martes.", hl: true }]]} style={{ position: "absolute", left: L, top: 300 }} />
      <DepthIn at={8} from={{ rx: 20, ry: -10, z: -500 }} style={{ position: "absolute", left: 70, top: 640 }}>
        <Bars3D at={8} grow={[26, 50]} boostTo={232} width={940} />
      </DepthIn>
      {f >= 52 && (
        <div style={{ position: "absolute", left: 400, top: 800, background: T.mint, borderRadius: 40, padding: "10px 24px", ...display(44, T.ink, 800), transform: `scale(${pill}) rotate(-5deg)`, boxShadow: "0 14px 26px -12px rgba(0,0,0,0.4)" }}>
          +55% los martes
        </div>
      )}
    </Field>
  );
};

export const BenefitAIQ: React.FC = () => (
  <Field c="mint">
    <Mono c="mint" text="BENEFICIO 03" at={0} style={{ position: "absolute", left: L, top: 300 }} />
    <Words c="mint" size={150} at={2} lines={[["La", "IA"], ["te", "sugiere"], [{ t: "el mensaje.", hl: true }]]} style={{ position: "absolute", left: L, top: 380 }} />
  </Field>
);

export const BenefitAIMsg: React.FC = () => {
  const f = useCurrentFrame();
  const btn = useIn(66, theme.spring.bouncy);
  const pressed = f >= 90 ? interpolate(f, [90, 94], [0.94, 1], clamp) : 1;
  const done = f >= 96;
  return (
    <Field c="cream">
      <DepthIn at={0} dur={16} from={{ rx: 16, ry: -14, z: -400 }} style={{ position: "absolute", left: 70, top: 420, width: 940 }}>
        <div style={{ position: "relative", background: T.white, borderRadius: 48, border: `4px solid ${T.ink}`, padding: "34px 40px 40px", boxShadow: "0 40px 80px -40px rgba(2,49,42,0.5)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, fontFamily: "JetBrains Mono", fontWeight: 700, fontSize: 28, letterSpacing: "0.1em", color: T.mintDeep }}>
            <SparkleIcon size={32} color={T.mint} /> SUGERIDO POR IA · CUMPLE DE JULI
          </div>
          <div style={{ ...body(60, T.ink, 600), lineHeight: 1.28, marginTop: 24, minHeight: 470 }}>
            <Typed text="¡Hola, Juli! Se viene tu cumple: si venís con 4 amigos, tu plato va por nuestra cuenta." at={8} cps={1.7} />
          </div>
          <div style={{ marginTop: 20, display: "inline-flex", alignItems: "center", gap: 14, background: done ? T.ink : T.mint, borderRadius: 80, padding: "26px 46px", ...body(42, T.white, 800), transform: `scale(${interpolate(btn, [0, 1], [0.6, 1]) * pressed})`, opacity: btn, transformOrigin: "left center" }}>
            {done ? <><CheckIcon size={44} color={T.mint} /> Enviado</> : "Aprobar y enviar"}
          </div>
          <Tap x={250} y={700} at={90} />
        </div>
      </DepthIn>
    </Field>
  );
};

export const BenefitReturn: React.FC = () => (
  <Field c="ink">
    <Mono c="ink" text="BENEFICIO 04" at={0} style={{ position: "absolute", left: L, top: 300 }} />
    <Words c="ink" size={170} at={2} lines={[["Tus"], ["clientes"], [{ t: "vuelven.", hl: true }]]} style={{ position: "absolute", left: L, top: 380 }} />
    <Emoji3D name="counterclockwise_arrows_button" size={220} at={16} x={760} y={1380} rotate={-8} depth={1.2} float={0.5} />
  </Field>
);

// ---------- remate ----------
export const Punch: React.FC = () => (
  <Field c="mint">
    <div style={{ position: "absolute", left: L, top: 560, display: "flex", flexDirection: "column", gap: 8 }}>
      <Words c="mint" size={120} at={0} lines={[["Más", { t: "frecuencia.", hl: true }]]} />
      <Words c="mint" size={120} at={13} lines={[["Más", { t: "clientes.", hl: true }]]} />
      <Words c="mint" size={120} at={26} lines={[["Más", { t: "ventas.", hl: true }]]} />
    </div>
  </Field>
);

