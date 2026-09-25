import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { Character } from "../components/Character";
import { PanelShot, Tap } from "../components/Device";
import { CameraMotionBlur } from "@remotion/motion-blur";
import { Emoji3D, EmojiName } from "../components/Emoji";
import { MaskLines, Spotlight } from "../components/Marks";
import { Bars3D } from "../components/Bars3D";
import { Star3D } from "../components/Star3D";
import { CheckIcon, SparkleIcon, StarIcon } from "../components/Icons";
import { SceneBg } from "../components/Layers";
import { Counter, ease, useBreathe, useIn } from "../components/Motion";
import { body, display, Lines } from "../components/Type";
import { T, theme } from "../theme";

const WIN_X = 70;
const WIN_W = 940;

/** Plano del panel: entra con spring y sale más rápido. */
const Shot: React.FC<{ from: number; to: number; top: number; left?: number; children: React.ReactNode }> = ({ from, to, top, left = WIN_X, children }) => {
  const frame = useCurrentFrame();
  const p = useIn(from, theme.spring.smooth);
  const out = ease(frame, [to - 8, to], [0, 1], theme.ease.in);
  if (frame < from || frame > to) return null;
  return (
    <div style={{ position: "absolute", left, top, opacity: p * (1 - out), transform: `translateY(${interpolate(p, [0, 1], [90, 0]) - out * 50}px) scale(${interpolate(p, [0, 1], [0.94, 1])})`, transformOrigin: "50% 0%" }}>
      {children}
    </div>
  );
};

const Sub: React.FC<{ text: string; from: number; to?: number; top: number; color?: string }> = ({ text, from, to = 1e9, top, color }) => {
  const frame = useCurrentFrame();
  const p = ease(frame, [from, from + 14], [0, 1]);
  const out = ease(frame, [to - 6, to], [0, 1], theme.ease.in);
  if (frame < from || frame > to) return null;
  return <div style={{ position: "absolute", left: 90, right: 80, top, ...body(46, color ?? T.ink, 700), opacity: p * (1 - out), transform: `translateY(${(1 - p) * 18}px)` }}>{text}</div>;
};

const Sticker: React.FC<{ at: number; x: number; y: number; rotate?: number; bg?: string; color?: string; children: React.ReactNode }> = ({ at, x, y, rotate = -4, bg = T.ink, color = T.cream, children }) => {
  const p = useIn(at, theme.spring.bouncy);
  const frame = useCurrentFrame();
  if (frame < at) return null;
  return (
    <div style={{ position: "absolute", left: x, top: y, display: "flex", alignItems: "center", gap: 14, background: bg, color, borderRadius: 60, padding: "20px 32px", ...display(46, color, 800), transform: `scale(${interpolate(p, [0, 1], [0.3, 1])}) rotate(${rotate}deg)`, opacity: Math.min(1, p * 2), boxShadow: "0 20px 40px -18px rgba(0,0,0,0.5)" }}>
      {children}
    </div>
  );
};

// ---------- ¿Y tu comercio qué gana? · grilla de 4 beneficios (local 0–148) ----------
const BENTO: { n: number; label: string[]; icon: EmojiName; bg: string; fg: string }[] = [
  { n: 1, label: ["Conocé a", "tus clientes"], icon: "eyes", bg: T.cream, fg: T.ink },
  { n: 2, label: ["Días flojos,", "llenos"], icon: "tear-off_calendar", bg: T.mint, fg: T.ink },
  { n: 3, label: ["Mensajes", "automáticos"], icon: "speech_balloon", bg: T.star, fg: T.ink },
  { n: 4, label: ["Clientes que", "vuelven"], icon: "counterclockwise_arrows_button", bg: "#FCE3CF", fg: T.ink },
];

const BentoTile: React.FC<{ i: number; x: number; y: number }> = ({ i, x, y }) => {
  const t = BENTO[i];
  const at = 26 + i * 9;
  const p = useIn(at, theme.spring.bouncy);
  return (
    <div
      style={{
        position: "absolute", left: x, top: y, width: 450, height: 380, borderRadius: 48, background: t.bg, padding: "30px 34px", overflow: "hidden",
        opacity: Math.min(1, p * 2), transform: `translateY(${(1 - p) * 120}px) scale(${interpolate(p, [0, 1], [0.8, 1])}) rotate(${(1 - p) * (i % 2 ? 6 : -6)}deg)`,
        boxShadow: "0 30px 60px -30px rgba(0,0,0,0.55)",
      }}
    >
      <div style={{ ...display(40, t.fg, 800), opacity: 0.55 }}>0{t.n}</div>
      <div style={{ position: "absolute", right: 16, top: 14 }}><Emoji3D name={t.icon} size={140} at={at + 4} depth={0.8} /></div>
      <div style={{ position: "absolute", left: 34, bottom: 30, ...display(54, t.fg, 800), lineHeight: 1.02 }}>
        {t.label.map((l) => <div key={l}>{l}</div>)}
      </div>
    </div>
  );
};

export const CommerceTitle: React.FC = () => {
  const frame = useCurrentFrame();
  const push = ease(frame, [0, 148], [1, 1.04], theme.ease.inOut);
  return (
    <AbsoluteFill style={{ transform: `scale(${push})` }}>
      <SceneBg variant="ink" />
      <div style={{ position: "absolute", left: 0, right: 0, top: 250 }}>
        <MaskLines lines={["¿Y tu comercio", "qué gana?"]} size={128} delay={2} gap={5} color={T.cream} accent={["comercio"]} align="center" />
      </div>
      <BentoTile i={0} x={70} y={640} />
      <BentoTile i={1} x={560} y={640} />
      <BentoTile i={2} x={70} y={1050} />
      <BentoTile i={3} x={560} y={1050} />
    </AbsoluteFill>
  );
};

// ---------- Placa de título de cada beneficio (pantalla propia) ----------
const TITLES: Record<number, { lines: string[]; sub: string; accent: string[]; size: number; hero: EmojiName; side: EmojiName }> = {
  1: { lines: ["Conocé a", "tus clientes."], sub: "Sabé quién viene. Sabé quién vuelve.", accent: ["clientes"], size: 132, hero: "eyes", side: "red_heart" },
  2: { lines: ["Llená los", "días flojos."], sub: "Promos automáticas para tu día más tranquilo.", accent: ["flojos"], size: 132, hero: "tear-off_calendar", side: "star" },
  3: { lines: ["Mensajes", "automáticos,", "en el momento", "justo."], sub: "Más interacción con tus clientes, sin trabajo extra.", accent: ["automáticos", "justo"], size: 116, hero: "speech_balloon", side: "birthday_cake" },
  4: { lines: ["Los clientes", "vuelven más", "seguido."], sub: "Recuperá a los que dejaron de venir.", accent: ["vuelven", "seguido"], size: 124, hero: "counterclockwise_arrows_button", side: "hot_beverage" },
};

const TitleCard: React.FC<{ n: number }> = ({ n }) => {
  const frame = useCurrentFrame();
  const t = TITLES[n];
  const dark = n % 2 === 1;
  const fg = dark ? T.cream : T.ink;
  const acc = dark ? T.mint : T.white;
  const num = useIn(0, theme.spring.snappy);
  const subIn = ease(frame, [16, 28], [0, 1]);
  const drift = frame * 0.6;
  return (
    <AbsoluteFill>
      {dark ? <SceneBg variant="ink" /> : <AbsoluteFill style={{ background: T.mint }} />}
      {/* número gigante calado */}
      <div
        style={{
          position: "absolute", right: -60 + drift, top: 1040, ...display(760, "transparent", 800), lineHeight: 0.8,
          WebkitTextStroke: `5px ${dark ? "rgba(5,171,135,0.55)" : "rgba(2,49,42,0.28)"}`,
          transform: `translateX(${(1 - num) * 500}px) rotate(${(1 - num) * 10}deg)`,
        }}
      >
        0{n}
      </div>
      {/* línea de avance: beneficio n de 4 */}
      <div style={{ position: "absolute", left: 90, top: 420, display: "flex", alignItems: "center", gap: 14 }}>
        <div style={{ ...body(34, fg, 800), letterSpacing: "0.14em", marginRight: 12, opacity: num }}>BENEFICIO {n}/4</div>
        {[1, 2, 3, 4].map((i) => {
          const fill = i < n ? 1 : i === n ? ease(frame, [4, 20], [0, 1]) : 0;
          return (
            <div key={i} style={{ width: 90, height: 12, borderRadius: 12, background: dark ? "rgba(253,249,242,0.18)" : "rgba(2,49,42,0.18)", overflow: "hidden" }}>
              <div style={{ width: `${fill * 100}%`, height: "100%", background: dark ? T.mint : T.ink }} />
            </div>
          );
        })}
      </div>
      <Emoji3D name={t.hero} size={240} at={8} x={700} y={1300} rotate={-8} depth={1.3} />
      <Emoji3D name={t.side} size={120} at={14} x={560} y={1500} rotate={12} depth={1.1} />
      <CameraMotionBlur samples={6} shutterAngle={160}>
        <div style={{ position: "absolute", left: 86, right: 40, top: 540 }}>
          <MaskLines lines={t.lines} size={t.size} delay={3} gap={4} color={fg} accent={t.accent} accentColor={acc} />
        </div>
      </CameraMotionBlur>
      <div
        style={{
          position: "absolute", left: 90, right: 90, top: 540 + t.lines.length * t.size * 1.06 + 50, ...body(50, fg, 600), lineHeight: 1.25,
          opacity: subIn * (dark ? 0.9 : 1), transform: `translateY(${(1 - subIn) * 24}px)`,
        }}
      >
        {t.sub}
      </div>
    </AbsoluteFill>
  );
};

export const B1Title: React.FC = () => <TitleCard n={1} />;
export const B2Title: React.FC = () => <TitleCard n={2} />;
export const B3Title: React.FC = () => <TitleCard n={3} />;
export const B4Title: React.FC = () => <TitleCard n={4} />;

// ---------- 3 · Mensajes automáticos (local 0–203; "¡Enviado solo!" en la vuelta de la energía, 163) ----------
export const OwnerMessages: React.FC = () => {
  const frame = useCurrentFrame();
  const cardIn = useIn(4, theme.spring.smooth);
  const done = ease(frame, [150, 158], [0, 1]);
  const mark = ease(frame, [34, 56], [0, 1], theme.ease.inOut);
  const btn = useIn(112, theme.spring.bouncy);
  const pressed = frame >= 146 ? ease(frame, [146, 150], [0.94, 1]) : 1;
  return (
    <AbsoluteFill>
      <SceneBg />
      <Sub text="El sistema de IA te sugiere qué enviar, en el momento justo." from={2} top={250} />

      {/* el mensaje sugerido, grande y con tiempo para leerlo */}
      {(
        <div style={{ position: "absolute", left: WIN_X, top: 440, width: WIN_W, opacity: cardIn, transform: `translateY(${(1 - cardIn) * 120}px) scale(${interpolate(cardIn, [0, 1], [0.94, 1])})` }}>
          <div style={{ background: T.white, borderRadius: 44, border: `4px solid ${T.ink}`, padding: "34px 40px 40px", boxShadow: "0 30px 60px -30px rgba(2,49,42,0.45)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12, ...body(30, T.mintDeep, 800), textTransform: "uppercase", letterSpacing: "0.04em" }}>
              <SparkleIcon size={34} color={T.mint} /> Sugerido por el sistema de IA
            </div>
            <div style={{ ...body(54, T.ink, 600), lineHeight: 1.3, marginTop: 22 }}>
              ¡Hola, Juli! Se viene tu cumple y en Brasa Restó queremos festejarlo con vos:{" "}
              <span style={{ fontWeight: 800, backgroundImage: `linear-gradient(${T.star}88, ${T.star}88)`, backgroundRepeat: "no-repeat", backgroundPosition: "0 85%", backgroundSize: `${mark * 100}% 42%` }}>
                si venís con 4 amigos, tu plato va por nuestra cuenta.
              </span>{" "}
              ¿Te reservamos mesa?
            </div>
            <div style={{ marginTop: 34, display: "inline-flex", alignItems: "center", gap: 14, background: done > 0.5 ? T.ink : T.mint, borderRadius: 80, padding: "24px 40px", ...body(38, T.white, 800), transform: `scale(${interpolate(btn, [0, 1], [0.6, 1]) * pressed})`, opacity: btn, transformOrigin: "left center", boxShadow: "0 16px 30px -10px rgba(5,171,135,0.6)" }}>
              {done > 0.5 ? <><CheckIcon size={40} color={T.mint} /> Enviado a los 4</> : "Aprobar y enviar a los 4"}
            </div>
          </div>
          <Emoji3D name="birthday_cake" size={140} at={14} x={820} y={-90} rotate={12} depth={1.2} />
          <Tap x={260} y={BTN_Y} at={146} />
        </div>
      )}

      <Sticker at={163} x={520} y={1150} rotate={5} bg={T.mint}>
        <CheckIcon size={46} color={T.white} /> ¡Enviado solo!
      </Sticker>
      <Emoji3D name="party_popper" size={140} at={166} x={330} y={1150} rotate={-10} depth={1.2} />
    </AbsoluteFill>
  );
};

const BTN_Y = 620; // centro del botón "Aprobar y enviar", relativo a la tarjeta

// ---------- 4 · Vuelven más seguido (local 0–161) ----------
export const OwnerReturns: React.FC = () => {
  const frame = useCurrentFrame();
  const msgIn = useIn(4, theme.spring.smooth);
  const mark = ease(frame, [30, 50], [0, 1], theme.ease.inOut);
  return (
    <AbsoluteFill>
      <SceneBg />
      <Sub text="Vos decidís. El sistema te sugiere propuestas de mensajes, y vos autorizás el envío." from={2} top={250} />
      <div style={{ position: "absolute", left: WIN_X, top: 500, width: WIN_W, opacity: msgIn, transform: `translateY(${(1 - msgIn) * 120}px)` }}>
        <div style={{ background: T.chat, borderRadius: 44, border: `4px solid ${T.ink}`, overflow: "hidden", boxShadow: "0 30px 60px -30px rgba(2,49,42,0.45)" }}>
          <div style={{ background: T.ink, padding: "26px 34px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div style={{ ...body(34, T.cream, 700) }}>Para: Martín</div>
            <div style={{ display: "flex", alignItems: "center", gap: 8, background: "rgba(5,171,135,0.25)", borderRadius: 40, padding: "8px 18px", ...body(26, T.mint, 800) }}>
              <SparkleIcon size={28} color={T.mint} /> Automático · 45 días sin venir
            </div>
          </div>
          <div style={{ padding: "34px 30px 40px" }}>
            <div style={{ background: T.bubbleIn, borderRadius: "34px 34px 34px 8px", padding: "28px 32px", ...body(52, T.ink, 600), lineHeight: 1.3 }}>
              ¡Hola, Martín! Hace un tiempo que no te vemos por Brasa Restó y te extrañamos. Te esperamos esta semana:{" "}
              <span style={{ fontWeight: 800, backgroundImage: `linear-gradient(${T.star}88, ${T.star}88)`, backgroundRepeat: "no-repeat", backgroundPosition: "0 85%", backgroundSize: `${mark * 100}% 42%` }}>
                el café corre por nuestra cuenta.
              </span>
            </div>
          </div>
        </div>
        <Emoji3D name="hot_beverage" size={140} at={20} x={820} y={-100} rotate={10} depth={1.2} />
      </div>
      <Sticker at={104} x={250} y={1310} rotate={-4} bg={T.mint}>
        <CheckIcon size={46} color={T.white} /> Enviado automáticamente
      </Sticker>
    </AbsoluteFill>
  );
};

// ---------- 2 · Días flojos (local 0–202) ----------
export const OwnerSlowDays: React.FC = () => {
  const frame = useCurrentFrame();
  const kT = 900 / 1194;
  const promo = useIn(118, theme.spring.bouncy);
  const lift = useIn(172, theme.spring.bouncy);
  return (
    <AbsoluteFill>
      <SceneBg />
      <Sub text="El sistema detecta tu día más flojo y te propone una promo." from={2} to={116} top={250} />
      <Sub text="Así tus clientes eligen el martes para sumar más rápido." from={120} top={250} />
      <Shot from={4} to={118} top={420} left={90}>
        <PanelShot frames={["panel/sugg-tuesday.png"]} srcWidth={1194} srcHeight={1250} width={900}>
          <Spotlight x={236 * kT} y={150 * kT} w={860 * kT} h={210 * kT} at={18} until={52} />
          <Spotlight x={96 * kT} y={755 * kT} w={990 * kT} h={180 * kT} at={58} until={94} />
        </PanelShot>
        <Tap x={470 * kT} y={1167 * kT} at={104} />
      </Shot>
      {frame >= 116 && (
        <div style={{ position: "absolute", left: WIN_X, top: 420, width: WIN_W, display: "flex", alignItems: "center", gap: 20, background: T.ink, borderRadius: 44, padding: "18px 40px 18px 20px", opacity: promo, transform: `scale(${interpolate(promo, [0, 1], [0.7, 1])})` }}>
          <div style={{ display: "flex", flex: "none", width: 190, height: 150, position: "relative" }}>
            <Star3D size={150} at={122} x={-6} y={0} />
            <Star3D size={150} at={128} x={62} y={0} />
          </div>
          <div style={{ ...display(58, T.cream, 800), lineHeight: 1.05 }}>
            Los martes, cada visita suma <span style={{ color: T.star }}>2 estrellitas</span>
          </div>
        </div>
      )}
      <Shot from={126} to={202} top={700}>
        <Bars3D at={126} grow={[146, 172]} boostTo={232} width={WIN_W} />
      </Shot>
      {frame >= 172 && (
        <div style={{ position: "absolute", left: 400, top: 870, background: T.mint, borderRadius: 40, padding: "10px 24px", ...display(44, T.white, 800), transform: `scale(${lift}) rotate(-5deg)`, boxShadow: "0 14px 26px -12px rgba(0,0,0,0.4)" }}>
          +55% los martes
        </div>
      )}
    </AbsoluteFill>
  );
};
