import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { Character } from "../components/Character";
import { PanelShot, Tap } from "../components/Device";
import { CameraMotionBlur } from "@remotion/motion-blur";
import { MaskLines, Spotlight } from "../components/Marks";
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

// ---------- ¿Y tu comercio qué gana? (local 0–81) ----------
export const CommerceTitle: React.FC = () => {
  const frame = useCurrentFrame();
  const push = ease(frame, [0, 81], [1, 1.05], theme.ease.inOut);
  const shop = useIn(8, theme.spring.smooth);
  const owner = useIn(18, theme.spring.bouncy);
  const label = ease(frame, [30, 42], [0, 1]);
  return (
    <AbsoluteFill style={{ transform: `scale(${push})` }}>
      <SceneBg variant="ink" />
      <div style={{ position: "absolute", left: 0, right: 0, top: 270 }}>
        <Lines lines={["¿Y tu comercio", "qué gana?"]} size={140} delay={2} lineGap={6} per={3} color={T.cream} align="center" accent={["comercio"]} />
      </div>
      {/* línea ordenada: 4 beneficios */}
      <div style={{ position: "absolute", left: 0, right: 0, top: 640, display: "flex", alignItems: "center", justifyContent: "center", gap: 18 }}>
        {[1, 2, 3, 4].map((n) => {
          const p = useIn(20 + n * 3, theme.spring.bouncy);
          return (
            <div key={n} style={{ width: 76, height: 76, borderRadius: "50%", background: T.mint, display: "grid", placeItems: "center", ...display(42, T.ink), transform: `scale(${p})` }}>{n}</div>
          );
        })}
        <div style={{ ...display(52, T.cream, 700), marginLeft: 10, opacity: label, transform: `translateX(${(1 - label) * 30}px)` }}>beneficios</div>
      </div>
      {/* fachada ilustrada */}
      <div style={{ position: "absolute", left: 120, top: 860, width: 840, opacity: shop, transform: `translateY(${(1 - shop) * 200}px)` }}>
        <div style={{ height: 150, background: `repeating-linear-gradient(90deg, ${T.mint} 0 105px, ${T.cream} 105px 210px)`, border: `7px solid ${T.cream}`, borderRadius: "30px 30px 0 0", position: "relative" }}>
          <div style={{ position: "absolute", bottom: -44, left: 0, right: 0, height: 60, background: `radial-gradient(circle at 52px 0, ${T.mint} 52px, transparent 53px) 0 0/210px 60px repeat-x, radial-gradient(circle at 157px 0, ${T.cream} 52px, transparent 53px) 0 0/210px 60px repeat-x` }} />
        </div>
        <div style={{ height: 640, background: "#F4EDDF", border: `7px solid ${T.cream}`, borderTop: "none", position: "relative", overflow: "hidden" }}>
          <div style={{ position: "absolute", left: 60, top: 90, ...display(62, T.ink) }}>Brasa Restó</div>
          <div style={{ position: "absolute", left: 60, top: 190, width: 300, height: 380, background: "#FFF9EE", border: `7px solid ${T.ink}`, borderRadius: 20 }} />
          <div style={{ position: "absolute", right: 60, top: 170, width: 360, height: 470, background: T.ink, borderRadius: "180px 180px 0 0", overflow: "hidden" }}>
            <div style={{ position: "absolute", left: -10, top: 60, opacity: owner, transform: `translateY(${(1 - owner) * 300}px)` }}>
              <Character body="Coffee" hair="ShortVolumed" face="Smile" facialHair="FullMedium" width={380} />
            </div>
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ---------- Placa de título de cada beneficio (local 0–53, pantalla propia) ----------
const TITLES: Record<number, { lines: string[]; sub: string; accent: string[]; size: number }> = {
  1: { lines: ["Conocé a", "tus clientes."], sub: "Sabé quién viene. Sabé quién vuelve.", accent: ["clientes"], size: 132 },
  2: { lines: ["Mensajes", "automáticos,", "en el momento", "justo."], sub: "Más interacción con tus clientes, sin trabajo extra.", accent: ["automáticos", "justo"], size: 116 },
  3: { lines: ["Los clientes", "vuelven más", "seguido."], sub: "Recuperá a los que dejaron de venir.", accent: ["vuelven", "seguido"], size: 124 },
  4: { lines: ["Llená los", "días flojos."], sub: "Promos automáticas para tu día más tranquilo.", accent: ["flojos"], size: 132 },
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

// ---------- 1 · Conocé a tus clientes (local 0–122) ----------
export const OwnerKnows: React.FC = () => {
  const frame = useCurrentFrame();
  const seg = ease(frame, [10, 14], [0, 1]) + ease(frame, [20, 24], [0, 1]) + ease(frame, [30, 34], [0, 1]);
  const k = WIN_W / 1290;
  return (
    <AbsoluteFill>
      <SceneBg />
      <Sub text="Tu panel separa nuevos, frecuentes y los que dejaron de venir." from={2} to={50} top={250} />
      <Sub text="Juli vino 12 veces… y cumple en 5 días." from={54} top={250} />
      <Shot from={4} to={122} top={420}>
        <div style={{ width: WIN_W, background: T.white, borderRadius: 40, padding: "26px 40px", border: `2px solid ${T.line}`, boxShadow: "0 30px 60px -30px rgba(2,49,42,0.35)" }}>
          <PanelShot frames={["panel/seg-all.png", "panel/seg-new.png", "panel/seg-frequent.png", "panel/seg-risk.png"]} index={seg} srcWidth={1044} srcHeight={372} width={WIN_W - 80} radius={0} style={{ boxShadow: "none", border: "none", background: "transparent" }} />
        </div>
      </Shot>
      <Shot from={36} to={122} top={830}>
        <PanelShot frames={["panel/ficha-juli.png"]} srcWidth={1290} srcHeight={880} width={WIN_W}>
          <Spotlight x={72 * k} y={450 * k} w={356 * k} h={215 * k} at={58} until={84} />
          <Spotlight x={72 * k} y={737 * k} w={780 * k} h={93 * k} at={88} radius={40} />
        </PanelShot>
      </Shot>
    </AbsoluteFill>
  );
};

// ---------- 2 · Mensajes automáticos (local 0–243; la energía vuelve en 203) ----------
export const OwnerMessages: React.FC = () => {
  const frame = useCurrentFrame();
  const sent = [204, 209, 214, 219, 225].reduce((acc, at) => acc + ease(frame, [at, at + 4], [0, 1]), 0);
  const cardIn = useIn(50, theme.spring.smooth);
  const cardOut = ease(frame, [194, 202], [0, 1], theme.ease.in);
  const mark = ease(frame, [74, 96], [0, 1], theme.ease.inOut);
  const btn = useIn(146, theme.spring.bouncy);
  const pressed = frame >= 182 ? ease(frame, [182, 186], [0.94, 1]) : 1;
  const k = WIN_W / 1194;
  return (
    <AbsoluteFill>
      <SceneBg />
      <Sub text="El sistema de IA detecta el momento y te sugiere qué enviar." from={2} to={196} top={250} />
      <Sub text="Vos aprobás. Sale solo por WhatsApp." from={200} top={250} />

      {/* a · la sugerencia: faltan 5 días para el cumple */}
      <Shot from={4} to={54} top={420}>
        <PanelShot frames={["panel/sugg-birthday.png"]} srcWidth={1194} srcHeight={820} width={WIN_W}>
          <Spotlight x={236 * k} y={150 * k} w={730 * k} h={140 * k} at={14} />
        </PanelShot>
      </Shot>

      {/* b · el mensaje sugerido, grande y con tiempo para leerlo */}
      {frame >= 50 && frame < 204 && (
        <div style={{ position: "absolute", left: WIN_X, top: 420, width: WIN_W, opacity: cardIn * (1 - cardOut), transform: `translateY(${(1 - cardIn) * 120 - cardOut * 60}px) scale(${interpolate(cardIn, [0, 1], [0.94, 1])})` }}>
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
            <div style={{ marginTop: 34, display: "inline-flex", alignItems: "center", gap: 14, background: T.mint, borderRadius: 80, padding: "24px 40px", ...body(38, T.white, 800), transform: `scale(${interpolate(btn, [0, 1], [0.6, 1]) * pressed})`, opacity: btn, transformOrigin: "left center", boxShadow: "0 16px 30px -10px rgba(5,171,135,0.6)" }}>
              Aprobar y enviar a los 4
            </div>
          </div>
          <Tap x={260} y={BTN_Y} at={182} />
        </div>
      )}

      {/* c · se envía solo */}
      <Shot from={200} to={243} top={560}>
        <PanelShot frames={["panel/send-0.png", "panel/send-1.png", "panel/send-2.png", "panel/send-3.png", "panel/send-4.png", "panel/send-done.png"]} index={sent} srcWidth={1146} srcTop={980} srcHeight={560} width={WIN_W} />
      </Shot>
      <Sticker at={226} x={540} y={1110} rotate={5} bg={T.mint}>
        <CheckIcon size={46} color={T.white} /> ¡Enviado solo!
      </Sticker>
    </AbsoluteFill>
  );
};

const BTN_Y = 620; // centro del botón "Aprobar y enviar", relativo a la tarjeta

// ---------- 3 · Vuelven más seguido (local 0–175) ----------
export const OwnerReturns: React.FC = () => {
  const frame = useCurrentFrame();
  const msgIn = useIn(4, theme.spring.smooth);
  const msgOut = ease(frame, [92, 100], [0, 1], theme.ease.in);
  const mark = ease(frame, [30, 50], [0, 1], theme.ease.inOut);
  const scene = useIn(96, theme.spring.smooth);
  const pill = useIn(128, theme.spring.bouncy);
  const breathe = useBreathe(0.015, 14);
  return (
    <AbsoluteFill>
      <SceneBg />
      <Sub text="Vos decidís qué se envía. El sistema lo hace solo." from={2} to={96} top={250} />
      <Sub text="Martín volvió a Brasa Restó." from={100} top={250} />

      {/* a · mensaje automático a quien dejó de venir */}
      {frame < 100 && (
        <div style={{ position: "absolute", left: WIN_X, top: 420, width: WIN_W, opacity: msgIn * (1 - msgOut), transform: `translateY(${(1 - msgIn) * 120 - msgOut * 60}px)` }}>
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
        </div>
      )}

      {/* b · vuelve */}
      {frame >= 94 && (
        <AbsoluteFill style={{ opacity: scene, transform: `translateY(${(1 - scene) * 150}px)` }}>
          <div style={{ position: "absolute", left: 50, top: 400, width: 980, height: 1000, borderRadius: 64, background: T.mintSoft, border: `6px solid ${T.ink}`, overflow: "hidden" }}>
            <div style={{ position: "absolute", left: 180, top: 90 }}>
              <Character body="Coffee" hair="ShortWavy" face="SmileBig" facialHair="Goatee" width={600} />
            </div>
            <div style={{ position: "absolute", left: -10, top: 720, width: 1000, height: 90, borderRadius: 24, background: "#E7B98A", border: `7px solid ${T.ink}` }} />
            <div style={{ position: "absolute", left: 30, top: 803, width: 920, height: 240, background: "#D9A36E", borderLeft: `7px solid ${T.ink}`, borderRight: `7px solid ${T.ink}` }} />
          </div>
          <Sticker at={108} x={600} y={470} rotate={6} bg={T.star} color={T.ink}>
            <StarIcon size={46} color={T.ink} /> ¡Volvió!
          </Sticker>
        </AbsoluteFill>
      )}
      {frame >= 128 && (
        <div style={{ position: "absolute", left: 0, right: 0, top: 1460, display: "flex", justifyContent: "center", opacity: pill, transform: `scale(${interpolate(pill, [0, 1], [0.6, 1]) * breathe})` }}>
          <div style={{ display: "flex", alignItems: "center", gap: 20, background: T.ink, borderRadius: 100, padding: "22px 44px", boxShadow: "0 24px 50px -20px rgba(2,49,42,0.6)" }}>
            <span style={{ ...display(76, T.mint) }}>+<Counter to={23} delay={130} /></span>
            <span style={{ ...display(44, T.cream, 700) }}>clientes que volvieron</span>
          </div>
        </div>
      )}
    </AbsoluteFill>
  );
};

// ---------- 4 · Días flojos (local 0–135) ----------
export const OwnerSlowDays: React.FC = () => {
  const frame = useCurrentFrame();
  const kT = 900 / 1194;
  const grow = ease(frame, [80, 104], [0, 10], theme.ease.out);
  const promo = useIn(62, theme.spring.bouncy);
  return (
    <AbsoluteFill>
      <SceneBg />
      <Sub text="El sistema detecta tu día más flojo y te propone una promo." from={2} to={60} top={250} />
      <Sub text="Así tus clientes eligen el martes para sumar más rápido." from={64} top={250} />
      <Shot from={4} to={64} top={420} left={90}>
        <PanelShot frames={["panel/sugg-tuesday.png"]} srcWidth={1194} srcHeight={1250} width={900}>
          <Spotlight x={96 * kT} y={755 * kT} w={990 * kT} h={180 * kT} at={16} until={44} />
        </PanelShot>
        <Tap x={470 * kT} y={1167 * kT} at={52} />
      </Shot>
      {frame >= 60 && (
        <div style={{ position: "absolute", left: WIN_X, top: 420, width: WIN_W, display: "flex", alignItems: "center", gap: 30, background: T.ink, borderRadius: 44, padding: "30px 40px", opacity: promo, transform: `scale(${interpolate(promo, [0, 1], [0.7, 1])})` }}>
          <div style={{ display: "flex", flex: "none" }}>
            <StarIcon size={96} color={T.star} />
            <StarIcon size={96} color={T.star} style={{ marginLeft: -26 }} />
          </div>
          <div style={{ ...display(60, T.cream, 800), lineHeight: 1.05 }}>
            Los martes, cada visita suma <span style={{ color: T.star }}>2 estrellitas</span>
          </div>
        </div>
      )}
      <Shot from={70} to={135} top={740}>
        <PanelShot frames={Array.from({ length: 11 }, (_, i) => `panel/bars-${String(i).padStart(2, "0")}.png`)} index={grow} srcWidth={1194} srcHeight={864} width={WIN_W}>
          <Spotlight x={156} y={270} w={150} h={400} at={104} radius={30} dim={0.35} />
        </PanelShot>
      </Shot>
    </AbsoluteFill>
  );
};
