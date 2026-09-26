import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { Character } from "../components/Character";
import { PanelShot, Phone, Tap } from "../components/Device";
import { CameraMotionBlur } from "@remotion/motion-blur";
import { DepthIn } from "../components/Camera";
import { Aurora, GlassNotification, LockScreen } from "../components/Glass";
import { Emoji3D, EmojiName, PhoneBody, Tilt3D } from "../components/Emoji";
import { MaskLines, Spotlight } from "../components/Marks";
import { Bars3D } from "../components/Bars3D";
import { Star3D } from "../components/Star3D";
import { CheckIcon, SparkleIcon, StarIcon } from "../components/Icons";
import { SceneBg } from "../components/Layers";
import { ease, useIn, WordReveal } from "../components/Motion";
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

// ---------- ¿Y tu comercio qué gana? · grilla de 4 beneficios (local 0–121) ----------
const BENTO: { n: number; label: string[]; icon: EmojiName; bg: string; fg: string }[] = [
  { n: 1, label: ["Conocé a", "tus clientes"], icon: "eyes", bg: T.cream, fg: T.ink },
  { n: 2, label: ["Días flojos,", "llenos"], icon: "tear-off_calendar", bg: T.mint, fg: T.ink },
  { n: 3, label: ["Mensajes", "automáticos"], icon: "speech_balloon", bg: T.star, fg: T.ink },
  { n: 4, label: ["Clientes que", "vuelven"], icon: "counterclockwise_arrows_button", bg: "#FCE3CF", fg: T.ink },
];

const BentoTile: React.FC<{ i: number; x: number; y: number }> = ({ i, x, y }) => {
  const t = BENTO[i];
  const at = 24 + i * 8;
  return (
    <DepthIn at={at} dur={22} from={{ rx: 22, ry: i % 2 ? 26 : -26, z: -600, y: 80 }} style={{ position: "absolute", left: x, top: y }}>
      <div style={{ width: 450, height: 380, borderRadius: 48, background: t.bg, padding: "30px 34px", overflow: "hidden", position: "relative", boxShadow: "0 30px 60px -30px rgba(0,0,0,0.55)" }}>
        <div style={{ ...display(40, t.fg, 800), opacity: 0.55 }}>0{t.n}</div>
        <div style={{ position: "absolute", right: 16, top: 14 }}><Emoji3D name={t.icon} size={130} at={at + 6} depth={0.8} float={0.5} /></div>
        <div style={{ position: "absolute", left: 34, bottom: 30, ...display(54, t.fg, 800), lineHeight: 1.02 }}>
          {t.label.map((l) => <div key={l}>{l}</div>)}
        </div>
      </div>
    </DepthIn>
  );
};

export const CommerceTitle: React.FC = () => (
  <AbsoluteFill>
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

// ---------- Placa de título de cada beneficio (pantalla propia) ----------
const TITLES: Record<number, { lines: string[]; say: string; accent: string[]; size: number; hero: EmojiName }> = {
  1: { lines: ["Conocé a", "tus clientes."], say: "Sabé quién viene. Sabé quién vuelve.", accent: ["clientes"], size: 132, hero: "eyes" },
  2: { lines: ["Llená los", "días flojos."], say: "El sistema detecta tu día más flojo y te propone una promo.", accent: ["flojos"], size: 132, hero: "tear-off_calendar" },
  3: { lines: ["Mensajes", "automáticos,", "en el momento", "justo."], say: "El sistema de IA te sugiere qué enviar.", accent: ["automáticos", "justo"], size: 112, hero: "speech_balloon" },
  4: { lines: ["Los clientes", "vuelven más", "seguido."], say: "Vos decidís. El sistema te sugiere propuestas de mensajes, y vos autorizás el envío.", accent: ["vuelven", "seguido"], size: 116, hero: "counterclockwise_arrows_button" },
};

const TitleCard: React.FC<{ n: number }> = ({ n }) => {
  const frame = useCurrentFrame();
  const t = TITLES[n];
  const dark = n % 2 === 1;
  const fg = dark ? T.cream : T.ink;
  const acc = dark ? T.mint : T.white;
  const tag = ease(frame, [0, 10], [0, 1]);
  const titleH = t.lines.length * t.size * 1.06;
  return (
    <AbsoluteFill>
      {dark
        ? <Aurora base={T.ink} colors={["rgba(5,171,135,0.55)", "rgba(245,184,61,0.22)", "rgba(5,171,135,0.35)"]} />
        : <Aurora base={T.mint} colors={["rgba(253,249,242,0.45)", "rgba(245,184,61,0.35)", "rgba(2,49,42,0.35)"]} />}
      {/* línea de avance: beneficio n de 4 */}
      <div style={{ position: "absolute", left: 90, top: 300, display: "flex", alignItems: "center", gap: 14, opacity: tag }}>
        <div style={{ ...body(34, fg, 800), letterSpacing: "0.14em", marginRight: 12 }}>BENEFICIO {n}/4</div>
        {[1, 2, 3, 4].map((i) => {
          const fill = i < n ? 1 : i === n ? ease(frame, [4, 20], [0, 1]) : 0;
          return (
            <div key={i} style={{ width: 90, height: 12, borderRadius: 12, background: dark ? "rgba(253,249,242,0.18)" : "rgba(2,49,42,0.18)", overflow: "hidden" }}>
              <div style={{ width: `${fill * 100}%`, height: "100%", background: dark ? T.mint : T.ink }} />
            </div>
          );
        })}
      </div>
      <CameraMotionBlur samples={6} shutterAngle={160}>
        <div style={{ position: "absolute", left: 86, right: 40, top: 400 }}>
          <MaskLines lines={t.lines} size={t.size} delay={3} gap={4} color={fg} accent={t.accent} accentColor={acc} />
        </div>
      </CameraMotionBlur>
      {/* la frase que explica, grande */}
      <div style={{ position: "absolute", left: 90, right: 80, top: 400 + titleH + 60 }}>
        <WordReveal text={t.say} delay={18} per={2} style={{ ...display(80, fg, 700), lineHeight: 1.1, letterSpacing: "-0.02em", opacity: dark ? 0.92 : 1 }} gap={0.26} />
      </div>
      <Emoji3D name={t.hero} size={200} at={10} x={760} y={1500} rotate={-8} depth={1.2} float={0.6} />
    </AbsoluteFill>
  );
};

export const B1Title: React.FC = () => <TitleCard n={1} />;
export const B2Title: React.FC = () => <TitleCard n={2} />;
export const B3Title: React.FC = () => <TitleCard n={3} />;
export const B4Title: React.FC = () => <TitleCard n={4} />;

// ---------- 3 · Mensajes automáticos (local 0–242): se aprueba → le llega a Juli ----------
export const OwnerMessages: React.FC = () => {
  const frame = useCurrentFrame();
  const mark = ease(frame, [30, 52], [0, 1], theme.ease.inOut);
  const btn = useIn(110, theme.spring.bouncy);
  const pressed = frame >= 150 ? ease(frame, [150, 154], [0.94, 1]) : 1;
  const done = frame >= 156;
  // la tarjeta se va hacia el fondo y aparece el celular de Juli
  const away = ease(frame, [164, 176], [0, 1], theme.ease.in);
  const rise = ease(frame, [168, 192], [0, 1], theme.ease.out);
  return (
    <AbsoluteFill>
      <SceneBg />
      {frame < 178 && (
        <div style={{ position: "absolute", inset: 0, opacity: 1 - away, transform: `scale(${1 - away * 0.25})`, filter: `blur(${away * 12}px)` }}>
          <DepthIn at={2} from={{ rx: 18, ry: -14, z: -500 }} style={{ position: "absolute", left: WIN_X, top: 380, width: WIN_W }}>
            <div style={{ position: "relative" }}>
              <div style={{ background: T.white, borderRadius: 44, border: `4px solid ${T.ink}`, padding: "34px 40px 40px", boxShadow: "0 30px 60px -30px rgba(2,49,42,0.45)" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12, ...body(30, T.mintDeep, 800), textTransform: "uppercase", letterSpacing: "0.04em" }}>
                  <SparkleIcon size={34} color={T.mint} /> Sugerido por el sistema de IA
                </div>
                <div style={{ ...body(56, T.ink, 600), lineHeight: 1.3, marginTop: 22 }}>
                  ¡Hola, Juli! Se viene tu cumple y en Brasa Restó queremos festejarlo con vos:{" "}
                  <span style={{ fontWeight: 800, backgroundImage: `linear-gradient(${T.star}88, ${T.star}88)`, backgroundRepeat: "no-repeat", backgroundPosition: "0 85%", backgroundSize: `${mark * 100}% 42%` }}>
                    si venís con 4 amigos, tu plato va por nuestra cuenta.
                  </span>{" "}
                  ¿Te reservamos mesa?
                </div>
                <div style={{ marginTop: 34, display: "inline-flex", alignItems: "center", gap: 14, background: done ? T.ink : T.mint, borderRadius: 80, padding: "24px 44px", ...body(40, T.white, 800), transform: `scale(${interpolate(btn, [0, 1], [0.6, 1]) * pressed})`, opacity: btn, transformOrigin: "left center", boxShadow: "0 16px 30px -10px rgba(5,171,135,0.6)" }}>
                  {done ? <><CheckIcon size={42} color={T.mint} /> Enviado</> : "Aprobar y enviar mensaje"}
                </div>
              </div>
              <Emoji3D name="birthday_cake" size={130} at={16} x={830} y={-80} rotate={12} depth={1.2} float={0.5} />
              <Tap x={300} y={BTN_Y} at={150} />
            </div>
          </DepthIn>
        </div>
      )}
      {/* …y le llega a Juli: notificación de vidrio sobre su pantalla bloqueada */}
      {frame >= 166 && (
        <div style={{ position: "absolute", left: 540 - 300, top: 360, opacity: Math.min(1, rise * 2), transform: `translateY(${(1 - rise) * 420}px) scale(${0.86 + 0.14 * rise})`, transformOrigin: "50% 30%" }}>
          <Tilt3D range={[168, 196]} from={[-20, 12]} to={[6, 2]}>
            <PhoneBody width={600}>
              <Phone width={600} screenBg="#0A3D34">
                <LockScreen>
                  <GlassNotification at={194} title="Brasa Restó" text="¡Hola, Juli! Se viene tu cumple y en Brasa Restó queremos festejarlo con vos…" />
                </LockScreen>
              </Phone>
            </PhoneBody>
          </Tilt3D>
        </div>
      )}
    </AbsoluteFill>
  );
};

const BTN_Y = 650; // centro del botón "Aprobar y enviar mensaje", relativo a la tarjeta

// ---------- 4 · Vuelven más seguido (local 0–148) ----------
export const OwnerReturns: React.FC = () => {
  const frame = useCurrentFrame();
  const mark = ease(frame, [28, 48], [0, 1], theme.ease.inOut);
  return (
    <AbsoluteFill>
      <SceneBg />
      <DepthIn at={2} from={{ rx: 18, ry: 14, z: -500 }} style={{ position: "absolute", left: WIN_X, top: 420, width: WIN_W }}>
        <div style={{ position: "relative" }}>
          <div style={{ background: T.chat, borderRadius: 44, border: `4px solid ${T.ink}`, overflow: "hidden", boxShadow: "0 30px 60px -30px rgba(2,49,42,0.45)" }}>
            <div style={{ background: T.ink, padding: "26px 34px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div style={{ ...body(34, T.cream, 700) }}>Para: Martín</div>
              <div style={{ display: "flex", alignItems: "center", gap: 8, background: "rgba(5,171,135,0.25)", borderRadius: 40, padding: "8px 18px", ...body(26, T.mint, 800) }}>
                <SparkleIcon size={28} color={T.mint} /> Sugerido · 45 días sin venir
              </div>
            </div>
            <div style={{ padding: "34px 30px 40px" }}>
              <div style={{ background: T.bubbleIn, borderRadius: "34px 34px 34px 8px", padding: "28px 32px", ...body(54, T.ink, 600), lineHeight: 1.3 }}>
                ¡Hola, Martín! Hace un tiempo que no te vemos por Brasa Restó y te extrañamos. Te esperamos esta semana:{" "}
                <span style={{ fontWeight: 800, backgroundImage: `linear-gradient(${T.star}88, ${T.star}88)`, backgroundRepeat: "no-repeat", backgroundPosition: "0 85%", backgroundSize: `${mark * 100}% 42%` }}>
                  el café corre por nuestra cuenta.
                </span>
              </div>
            </div>
          </div>
          <Emoji3D name="hot_beverage" size={130} at={18} x={830} y={-90} rotate={10} depth={1.2} float={0.5} />
        </div>
      </DepthIn>
    </AbsoluteFill>
  );
};

// ---------- 2 · Días flojos (local 0–229) ----------
export const OwnerSlowDays: React.FC = () => {
  const frame = useCurrentFrame();
  const kT = 900 / 1194;
  const out = ease(frame, [120, 130], [0, 1], theme.ease.in);
  const lift = useIn(188, theme.spring.bouncy);
  return (
    <AbsoluteFill>
      <SceneBg />
      {/* a · la sugerencia del sistema, con tiempo para leerla */}
      {frame < 130 && (
        <div style={{ opacity: 1 - out, transform: `translateY(${-out * 60}px) scale(${1 - out * 0.05})` }}>
          <DepthIn at={2} from={{ rx: 16, ry: -16, z: -500 }} style={{ position: "absolute", left: 90, top: 340 }}>
            <div style={{ position: "relative" }}>
              <PanelShot frames={["panel/sugg-tuesday.png"]} srcWidth={1194} srcHeight={1250} width={900}>
                <Spotlight x={236 * kT} y={150 * kT} w={860 * kT} h={210 * kT} at={18} until={58} />
                <Spotlight x={96 * kT} y={755 * kT} w={990 * kT} h={180 * kT} at={64} until={104} />
              </PanelShot>
              <Tap x={470 * kT} y={1167 * kT} at={112} />
            </div>
          </DepthIn>
        </div>
      )}
      {/* b · la promo y el martes que crece */}
      <DepthIn at={126} from={{ rx: -14, ry: 10, z: -400, y: -40 }} style={{ position: "absolute", left: WIN_X, top: 330, width: WIN_W }}>
        <div style={{ display: "flex", alignItems: "center", gap: 20, background: T.ink, borderRadius: 44, padding: "18px 40px 18px 20px" }}>
          <div style={{ display: "flex", flex: "none", width: 190, height: 150, position: "relative" }}>
            <Star3D size={150} at={130} x={-6} y={0} />
            <Star3D size={150} at={136} x={62} y={0} />
          </div>
          <div style={{ ...display(58, T.cream, 800), lineHeight: 1.05 }}>
            Los martes, cada visita suma <span style={{ color: T.star }}>2 estrellitas</span>
          </div>
        </div>
      </DepthIn>
      <DepthIn at={138} from={{ rx: 20, ry: -10, z: -500 }} style={{ position: "absolute", left: WIN_X, top: 620 }}>
        <Bars3D at={138} grow={[160, 186]} boostTo={232} width={WIN_W} />
      </DepthIn>
      {frame >= 188 && (
        <div style={{ position: "absolute", left: 400, top: 790, background: T.mint, borderRadius: 40, padding: "10px 24px", ...display(44, T.white, 800), transform: `scale(${lift}) rotate(-5deg)`, boxShadow: "0 14px 26px -12px rgba(0,0,0,0.4)" }}>
          +55% los martes
        </div>
      )}
    </AbsoluteFill>
  );
};

/** El mensaje le llega al cliente: celular bloqueado (20:41) que sube y notificación de vidrio (local 0–81). */
export const LockDelivery: React.FC<{ title?: string; text?: string }> = ({
  title = "Brasa Restó", text = "¡Hola, Juli! Se viene tu cumple: si venís con 4 amigos, tu plato va por nuestra cuenta.",
}) => {
  const frame = useCurrentFrame();
  const rise = ease(frame, [0, 24], [0, 1], theme.ease.out);
  return (
    <div style={{ position: "absolute", left: 540 - 300, top: 360, opacity: Math.min(1, rise * 2), transform: `translateY(${(1 - rise) * 420}px) scale(${0.86 + 0.14 * rise})`, transformOrigin: "50% 30%" }}>
      <Tilt3D range={[0, 28]} from={[-20, 12]} to={[6, 2]}>
        <PhoneBody width={600}>
          <Phone width={600} screenBg="#0A3D34">
            <LockScreen>
              <GlassNotification at={26} title={title} text={text} />
            </LockScreen>
          </Phone>
        </PhoneBody>
      </Tilt3D>
    </div>
  );
};
