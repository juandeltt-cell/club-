import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { HighlightRing, PanelShot, Phone, Tap } from "../components/Device";
import { SparkleIcon } from "../components/Icons";
import { SceneBg } from "../components/Layers";
import { Counter, ease, useBreathe, useIn, WordReveal } from "../components/Motion";
import { BenefitHeader, body, display } from "../components/Type";
import { T, theme } from "../theme";

const WIN_X = 70;
const WIN_W = 940;

/** Envoltorio de cada "plano" del panel: entra con spring y sale más rápido. */
const Shot: React.FC<{ from: number; to: number; top: number; left?: number; children: React.ReactNode; zoomTo?: number }> = ({
  from, to, top, left = WIN_X, children,
}) => {
  const frame = useCurrentFrame();
  const p = useIn(from, theme.spring.smooth);
  const out = ease(frame, [to - 8, to], [0, 1], theme.ease.in);
  if (frame < from || frame > to) return null;
  return (
    <div
      style={{
        position: "absolute", left, top, opacity: p * (1 - out),
        transform: `translateY(${interpolate(p, [0, 1], [90, 0]) - out * 50}px) scale(${interpolate(p, [0, 1], [0.94, 1]) * (1 - out * 0.04)})`,
        transformOrigin: "50% 0%",
      }}
    >
      {children}
    </div>
  );
};

/** Subtítulo que se reemplaza en el momento indicado. */
const Sub: React.FC<{ text: string; from: number; to?: number; top: number }> = ({ text, from, to = 1e9, top }) => {
  const frame = useCurrentFrame();
  const p = ease(frame, [from, from + 14], [0, 1]);
  const out = ease(frame, [to - 6, to], [0, 1], theme.ease.in);
  if (frame < from || frame > to) return null;
  return <div style={{ position: "absolute", left: 90, right: 80, top, ...body(40), opacity: p * (1 - out), transform: `translateY(${(1 - p) * 18}px)` }}>{text}</div>;
};

// ---------- Título de bloque (local 0–60) ----------
export const BenefitsTitle: React.FC = () => {
  const frame = useCurrentFrame();
  const out = ease(frame, [50, 60], [0, 1], theme.ease.in);
  return (
    <AbsoluteFill>
      <SceneBg variant="ink" />
      <div style={{ position: "absolute", left: 0, right: 0, top: 700, display: "flex", flexDirection: "column", alignItems: "center", transform: `translateY(${-out * 160}px)`, opacity: 1 - out }}>
        <WordReveal text="¿Y vos" delay={2} per={4} style={{ ...display(180, T.cream) }} wordStyle={(i) => (i === 1 ? { color: T.mint } : undefined)} />
        <WordReveal text="qué ganás?" delay={14} per={4} style={{ ...display(180, T.cream) }} />
      </div>
    </AbsoluteFill>
  );
};

// ---------- Beneficio 1 · quién es cada cliente (local 0–120) ----------
export const Benefit1: React.FC = () => {
  const frame = useCurrentFrame();
  const exit = ease(frame, [112, 120], [0, 1], theme.ease.in);
  // chips: Todos → Nuevos → Frecuentes → En riesgo
  const seg = ease(frame, [16, 20], [0, 1]) + ease(frame, [28, 32], [0, 1]) + ease(frame, [40, 44], [0, 1]);
  return (
    <AbsoluteFill style={{ opacity: 1 - exit }}>
      <SceneBg />
      <div style={{ position: "absolute", left: 90, right: 60, top: 250 }}>
        <BenefitHeader num={1} lines={["Sabés quién es", "cada cliente"]} at={0} />
      </div>
      <Sub text="Nuevos, frecuentes y los que dejaron de venir." from={16} top={540} />
      <Shot from={8} to={120} top={660}>
        <div style={{ width: WIN_W, background: T.white, borderRadius: 40, padding: "34px 40px", border: `2px solid ${T.line}`, boxShadow: "0 30px 60px -30px rgba(2,49,42,0.35)" }}>
          <div style={{ ...body(26, T.inkMuted, 700), letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: 18 }}>Tus clientes</div>
          <PanelShot
            frames={["panel/seg-all.png", "panel/seg-new.png", "panel/seg-frequent.png", "panel/seg-risk.png"]}
            index={seg} srcWidth={1044} srcHeight={372} width={WIN_W - 80} radius={0}
            style={{ boxShadow: "none", border: "none", background: "transparent" }}
          />
        </div>
      </Shot>
      <Shot from={50} to={120} top={1050}>
        <PanelShot frames={["panel/ficha-juli.png"]} srcWidth={1290} srcHeight={820} width={WIN_W} />
        <HighlightRing x={40} y={414} w={262} h={122} at={78} radius={24} />
      </Shot>
    </AbsoluteFill>
  );
};

// ---------- Beneficio 2 · mensajes automáticos (local 0–180) ----------
export const Benefit2: React.FC = () => {
  const frame = useCurrentFrame();
  const exit = ease(frame, [172, 180], [0, 1], theme.ease.in);
  const k = WIN_W / 1194;
  // a) sugerencia: título + cuenta regresiva; b) paneo al mensaje y al botón
  const pan = ease(frame, [62, 80], [0, 830], theme.ease.inOut);
  // c) envío: destinatarios marcándose
  const sent = ease(frame, [104, 108], [0, 1]) + ease(frame, [109, 113], [0, 1]) + ease(frame, [114, 118], [0, 1]) + ease(frame, [119, 123], [0, 1]) + ease(frame, [126, 130], [0, 1]);
  // d) mensajes automáticos encendiéndose
  const autos = ease(frame, [148, 152], [0, 1]) + ease(frame, [153, 157], [0, 1]) + ease(frame, [158, 162], [0, 1]) + ease(frame, [163, 167], [0, 1]);
  return (
    <AbsoluteFill style={{ opacity: 1 - exit }}>
      <SceneBg />
      <div style={{ position: "absolute", left: 90, right: 50, top: 250 }}>
        <BenefitHeader num={2} lines={["Mensajes automáticos,", "en el momento justo"]} at={0} size={70} />
      </div>
      <Sub text="Un sistema de IA te sugiere qué enviar. Vos aprobás y sale solo." from={14} to={140} top={520} />
      <Sub text="Vos decidís qué se envía. El sistema lo hace solo." from={142} top={520} />

      <Shot from={10} to={100} top={690}>
        <PanelShot frames={["panel/sugg-birthday.png"]} srcWidth={1194} srcTop={pan} srcHeight={870} width={WIN_W} />
        <HighlightRing x={188} y={150 * k} w={(1150 - 240) * k} h={140 * k} at={26} radius={20} />
        <Tap x={380 * k} y={(1465 - 830) * k} at={92} />
      </Shot>

      <Shot from={100} to={142} top={720}>
        <PanelShot
          frames={["panel/send-0.png", "panel/send-1.png", "panel/send-2.png", "panel/send-3.png", "panel/send-4.png", "panel/send-done.png"]}
          index={sent} srcWidth={1146} srcTop={1060} srcHeight={560} width={WIN_W}
        />
      </Shot>

      <Shot from={142} to={180} top={660}>
        <PanelShot
          frames={["panel/auto-0.png", "panel/auto-1.png", "panel/auto-2.png", "panel/auto-3.png", "panel/auto-4.png"]}
          index={autos} srcWidth={1194} srcHeight={1180} width={WIN_W} style={{ background: T.cream, border: "none", boxShadow: "none" }}
        />
      </Shot>
    </AbsoluteFill>
  );
};

// ---------- Beneficio 3 · vuelve (local 0–120) ----------
export const Benefit3: React.FC = () => {
  const frame = useCurrentFrame();
  const exit = ease(frame, [112, 120], [0, 1], theme.ease.in);
  const pill = useIn(78, theme.spring.bouncy);
  const breathe = useBreathe(0.015, 14);
  return (
    <AbsoluteFill style={{ opacity: 1 - exit }}>
      <SceneBg />
      <div style={{ position: "absolute", left: 90, right: 60, top: 250 }}>
        <BenefitHeader num={3} lines={["Vuelve", "más seguido"]} at={0} />
      </div>
      <Sub text="La invitación le llega por WhatsApp…" from={10} to={58} top={540} />
      <Sub text="…y vuelve. El panel te lo muestra." from={60} top={540} />

      <Shot from={6} to={60} top={660} left={540 - 230}>
        <Phone width={460}>
          <InvitationChat />
        </Phone>
      </Shot>

      <Shot from={58} to={120} top={660}>
        <PanelShot frames={["panel/ficha-returned.png"]} srcWidth={1290} srcHeight={1180} width={WIN_W} />
        <HighlightRing x={345} y={172} w={140} h={48} at={72} radius={24} />
      </Shot>
      {frame >= 78 && (
        <div
          style={{
            position: "absolute", left: 0, right: 0, top: 1545, display: "flex", justifyContent: "center",
            opacity: pill, transform: `scale(${interpolate(pill, [0, 1], [0.6, 1]) * breathe})`,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 20, background: T.ink, borderRadius: 100, padding: "22px 44px", boxShadow: "0 24px 50px -20px rgba(2,49,42,0.6)" }}>
            <span style={{ ...display(76, T.mint) }}>+<Counter to={23} delay={80} /></span>
            <span style={{ ...display(44, T.cream, 700) }}>clientes recuperados</span>
          </div>
        </div>
      )}
    </AbsoluteFill>
  );
};

const InvitationChat: React.FC = () => {
  const frame = useCurrentFrame();
  const b = useIn(16, theme.spring.snappy);
  const tag = useIn(28, theme.spring.bouncy);
  return (
    <AbsoluteFill style={{ background: T.chat }}>
      <div style={{ background: T.ink, padding: "72px 22px 18px", display: "flex", alignItems: "center", gap: 14 }}>
        <div style={{ width: 54, height: 54, borderRadius: "50%", background: T.star, display: "grid", placeItems: "center", ...display(28, T.ink) }}>B</div>
        <div style={{ ...body(26, T.cream, 700) }}>Brasa</div>
      </div>
      {frame >= 16 && (
        <div
          style={{
            margin: "26px 18px", background: T.bubbleIn, borderRadius: "26px 26px 26px 8px", padding: "20px 22px 14px",
            opacity: b, transform: `translateY(${(1 - b) * 40}px) scale(${interpolate(b, [0, 1], [0.8, 1])})`, transformOrigin: "left bottom",
          }}
        >
          <div style={{ ...body(29, T.ink, 500), lineHeight: 1.34 }}>
            <b>¡Hola, Juli!</b> Faltan pocos días para tu cumple y en Brasa queremos festejarlo con vos. Vení cuando quieras esta semana: <b>el postre corre por nuestra cuenta.</b> ¿Te reservamos una mesa?
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 12 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 6, background: T.mintSoft, borderRadius: 30, padding: "5px 12px", ...body(18, T.mintDeep, 700), opacity: tag, transform: `scale(${interpolate(tag, [0, 1], [0.6, 1])})`, transformOrigin: "left center" }}>
              <SparkleIcon size={20} color={T.mint} /> automático
            </div>
            <span style={{ ...body(17, T.inkMuted) }}>10:02</span>
          </div>
        </div>
      )}
    </AbsoluteFill>
  );
};

// ---------- Beneficio 4 · días flojos (local 0–120) ----------
export const Benefit4: React.FC = () => {
  const frame = useCurrentFrame();
  const exit = ease(frame, [112, 120], [0, 1], theme.ease.in);
  const kT = 900 / 1194;
  const grow = ease(frame, [64, 92], [0, 10], theme.ease.out);
  const kB = WIN_W / 1194;
  return (
    <AbsoluteFill style={{ opacity: 1 - exit }}>
      <SceneBg />
      <div style={{ position: "absolute", left: 90, right: 60, top: 250 }}>
        <BenefitHeader num={4} lines={["Llenás los", "días flojos"]} at={0} />
      </div>
      <Sub text="El sistema de IA detecta tu día más flojo y te propone qué hacer." from={14} to={56} top={540} />
      <Sub text="Un toque, y se avisa sola por WhatsApp." from={58} top={540} />

      <Shot from={8} to={58} top={670} left={90}>
        <PanelShot frames={["panel/sugg-tuesday.png"]} srcWidth={1194} srcHeight={1296} width={900} />
        <Tap x={365 * kT} y={1100 * kT} at={50} />
      </Shot>

      <Shot from={56} to={120} top={760}>
        <PanelShot frames={Array.from({ length: 11 }, (_, i) => `panel/bars-${String(i).padStart(2, "0")}.png`)} index={grow} srcWidth={1194} srcHeight={864} width={WIN_W} />
        <HighlightRing x={220 * kB} y={380 * kB} w={140 * kB} h={350 * kB} at={94} radius={22} />
      </Shot>
      {frame >= 96 && (
        <div style={{ position: "absolute", left: 0, right: 0, top: 1500, display: "flex", justifyContent: "center" }}>
          <WordReveal text="Doble estrellita los martes" delay={96} style={{ ...display(60, T.ink, 800) }} wordStyle={(i) => (i === 3 ? { color: T.mintDeep } : undefined)} />
        </div>
      )}
    </AbsoluteFill>
  );
};
