import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { Character } from "../components/Character";
import { PanelShot, Tap } from "../components/Device";
import { HandCircle, HandSparks } from "../components/Doodle";
import { CheckIcon, SparkleIcon, StarIcon } from "../components/Icons";
import { SceneBg } from "../components/Layers";
import { Counter, ease, useBreathe, useIn, WordReveal } from "../components/Motion";
import { BenefitHeader, body, display, Lines } from "../components/Type";
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
  return <div style={{ position: "absolute", left: 90, right: 80, top, ...body(42, color ?? T.inkSoft, 600), opacity: p * (1 - out), transform: `translateY(${(1 - p) * 18}px)` }}>{text}</div>;
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

// ---------- ¿Y tu comercio qué gana? (local 0–99, en el corte de la canción) ----------
export const CommerceTitle: React.FC = () => {
  const frame = useCurrentFrame();
  const push = ease(frame, [0, 99], [1, 1.06], theme.ease.inOut);
  const shop = useIn(10, theme.spring.smooth);
  const owner = useIn(24, theme.spring.bouncy);
  return (
    <AbsoluteFill style={{ transform: `scale(${push})` }}>
      <SceneBg variant="ink" />
      <div style={{ position: "absolute", left: 0, right: 0, top: 290 }}>
        <Lines lines={["¿Y tu comercio", "qué gana?"]} size={140} delay={2} lineGap={8} per={4} color={T.cream} align="center" accent={["comercio"]} />
      </div>
      <Sub text="Para dueños de restós, bares y cafés." from={30} top={660} color="rgba(253,249,242,0.8)" />
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
      <HandSparks x={880} y={1000} size={120} at={40} color={T.star} width={9} />
    </AbsoluteFill>
  );
};

// ---------- 1 · Sabés quién es cada cliente (local 0–128) ----------
export const OwnerKnows: React.FC = () => {
  const frame = useCurrentFrame();
  const seg = ease(frame, [18, 22], [0, 1]) + ease(frame, [30, 34], [0, 1]) + ease(frame, [42, 46], [0, 1]);
  return (
    <AbsoluteFill>
      <SceneBg />
      <div style={{ position: "absolute", left: 90, right: 60, top: 250 }}>
        <BenefitHeader num={1} lines={["Sabés quién es", "cada cliente"]} at={0} />
      </div>
      <Sub text="Nuevos, frecuentes y los que dejaron de venir." from={14} top={530} />
      <Shot from={8} to={128} top={670}>
        <div style={{ width: WIN_W, background: T.white, borderRadius: 40, padding: "26px 40px", border: `2px solid ${T.line}`, boxShadow: "0 30px 60px -30px rgba(2,49,42,0.35)" }}>
          <PanelShot frames={["panel/seg-all.png", "panel/seg-new.png", "panel/seg-frequent.png", "panel/seg-risk.png"]} index={seg} srcWidth={1044} srcHeight={372} width={WIN_W - 80} radius={0} style={{ boxShadow: "none", border: "none", background: "transparent" }} />
        </div>
      </Shot>
      <Shot from={52} to={128} top={1062}>
        <PanelShot frames={["panel/ficha-juli.png"]} srcWidth={1290} srcHeight={860} width={WIN_W} />
        <HandCircle x={40} y={520} w={600} h={104} at={78} color={T.mint} width={8} />
      </Shot>
    </AbsoluteFill>
  );
};

// ---------- 2 · Mensajes automáticos (local 0–243, vuelve la energía) ----------
export const OwnerMessages: React.FC = () => {
  const frame = useCurrentFrame();
  const sent = [190, 196, 202, 208, 216].reduce((acc, at) => acc + ease(frame, [at, at + 4], [0, 1]), 0);
  const cardIn = useIn(76, theme.spring.smooth);
  const cardOut = ease(frame, [180, 188], [0, 1], theme.ease.in);
  const mark = ease(frame, [104, 124], [0, 1], theme.ease.inOut);
  const btn = useIn(128, theme.spring.bouncy);
  const pressed = frame >= 160 ? ease(frame, [160, 164], [0.94, 1]) : 1;
  return (
    <AbsoluteFill>
      <SceneBg />
      <div style={{ position: "absolute", left: 90, right: 50, top: 250 }}>
        <BenefitHeader num={2} lines={["Mensajes automáticos,", "en el momento justo"]} at={0} size={70} />
      </div>
      <Sub text="Un sistema de IA te sugiere qué enviar. Vos aprobás y sale solo." from={12} to={186} top={520} />
      <Sub text="Vos decidís qué se envía. El sistema lo hace solo." from={188} top={520} />

      {/* a · la sugerencia con cuenta regresiva */}
      <Shot from={8} to={78} top={690}>
        <PanelShot frames={["panel/sugg-birthday.png"]} srcWidth={1194} srcHeight={820} width={WIN_W} />
        <HandCircle x={296} y={114} w={164} h={76} at={24} color={T.mint} width={8} />
      </Shot>

      {/* b · el mensaje sugerido, grande y legible */}
      {frame >= 76 && frame < 190 && (
        <div style={{ position: "absolute", left: WIN_X, top: 680, width: WIN_W, opacity: cardIn * (1 - cardOut), transform: `translateY(${(1 - cardIn) * 120 - cardOut * 60}px) scale(${interpolate(cardIn, [0, 1], [0.94, 1])})` }}>
          <div style={{ background: T.white, borderRadius: 44, border: `4px solid ${T.ink}`, padding: "34px 40px 40px", boxShadow: "0 30px 60px -30px rgba(2,49,42,0.45)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12, ...body(30, T.mintDeep, 800), textTransform: "uppercase", letterSpacing: "0.04em" }}>
              <SparkleIcon size={34} color={T.mint} /> Mensaje sugerido por el sistema de IA
            </div>
            <div style={{ ...body(50, T.ink, 600), lineHeight: 1.32, marginTop: 22 }}>
              ¡Hola, Juli! Se viene tu cumple y en Brasa Restó queremos festejarlo con vos:{" "}
              <span style={{ fontWeight: 800, backgroundImage: `linear-gradient(${T.star}88, ${T.star}88)`, backgroundRepeat: "no-repeat", backgroundPosition: "0 85%", backgroundSize: `${mark * 100}% 42%` }}>
                el postre va por nuestra cuenta.
              </span>{" "}
              ¿Te reservamos mesa?
            </div>
            <div style={{ marginTop: 34, display: "inline-flex", alignItems: "center", gap: 14, background: T.mint, borderRadius: 80, padding: "24px 40px", ...body(38, T.white, 800), transform: `scale(${interpolate(btn, [0, 1], [0.6, 1]) * pressed})`, opacity: btn, transformOrigin: "left center", boxShadow: "0 16px 30px -10px rgba(5,171,135,0.6)" }}>
              Aprobar y enviar a los 4
            </div>
          </div>
          <Tap x={300} y={447} at={160} />
        </div>
      )}

      {/* c · se envía solo */}
      <Shot from={186} to={243} top={720}>
        <PanelShot frames={["panel/send-0.png", "panel/send-1.png", "panel/send-2.png", "panel/send-3.png", "panel/send-4.png", "panel/send-done.png"]} index={sent} srcWidth={1146} srcTop={980} srcHeight={560} width={WIN_W} />
      </Shot>
      <Sticker at={220} x={560} y={1270} rotate={5} bg={T.mint}>
        <CheckIcon size={46} color={T.white} /> ¡Enviado solo!
      </Sticker>
      <HandSparks x={930} y={1220} size={100} at={226} color={T.star} width={9} />
    </AbsoluteFill>
  );
};

// ---------- 3 · Vuelve más seguido (local 0–148) ----------
export const OwnerReturns: React.FC = () => {
  const frame = useCurrentFrame();
  const scene = useIn(4, theme.spring.smooth);
  const sceneOut = ease(frame, [68, 76], [0, 1], theme.ease.in);
  const pill = useIn(96, theme.spring.bouncy);
  const breathe = useBreathe(0.015, 14);
  const flame = 1 + Math.sin(frame / 3) * 0.15;
  return (
    <AbsoluteFill>
      <SceneBg />
      <div style={{ position: "absolute", left: 90, right: 60, top: 250 }}>
        <BenefitHeader num={3} lines={["Vuelve", "más seguido"]} at={0} />
      </div>
      <Sub text="Juli recibió la invitación… y volvió a festejar." from={10} to={74} top={540} />
      <Sub text="El panel te muestra quién volvió." from={78} top={540} />
      {frame < 78 && (
        <AbsoluteFill style={{ opacity: scene * (1 - sceneOut), transform: `translateY(${(1 - scene) * 150}px)` }}>
          <div style={{ position: "absolute", left: 50, top: 650, width: 980, height: 1000, borderRadius: 64, background: T.mintSoft, border: `6px solid ${T.ink}`, overflow: "hidden" }}>
            <div style={{ position: "absolute", left: 200, top: 90 }}>
              <Character body="Explaining" hair="Long" face="EatingHappy" width={580} />
            </div>
            <div style={{ position: "absolute", left: -10, top: 700, width: 1000, height: 90, borderRadius: 24, background: "#E7B98A", border: `7px solid ${T.ink}` }} />
            <div style={{ position: "absolute", left: 30, top: 783, width: 920, height: 240, background: "#D9A36E", borderLeft: `7px solid ${T.ink}`, borderRight: `7px solid ${T.ink}` }} />
            {/* porción de torta con vela */}
            <div style={{ position: "absolute", left: 90, top: 560, width: 250, height: 150 }}>
              <div style={{ position: "absolute", left: 0, top: 80, width: 250, height: 60, borderRadius: "50%", background: T.white, border: `6px solid ${T.ink}` }} />
              <div style={{ position: "absolute", left: 50, top: 10, width: 150, height: 100, background: T.peach, border: `6px solid ${T.ink}`, borderRadius: "14px 14px 8px 8px" }} />
              <div style={{ position: "absolute", left: 50, top: 40, width: 150, height: 18, background: T.star, borderLeft: `6px solid ${T.ink}`, borderRight: `6px solid ${T.ink}` }} />
              <div style={{ position: "absolute", left: 118, top: -50, width: 14, height: 60, background: T.mint, border: `4px solid ${T.ink}`, borderRadius: 6 }} />
              <div style={{ position: "absolute", left: 113, top: -92, width: 24, height: 38, borderRadius: "50% 50% 50% 50% / 60% 60% 40% 40%", background: T.star, transform: `scale(${flame})`, transformOrigin: "50% 100%" }} />
            </div>
          </div>
          <Sticker at={20} x={560} y={700} rotate={6} bg={T.star} color={T.ink}>
            <StarIcon size={46} color={T.ink} /> ¡Volvió!
          </Sticker>
          <HandSparks x={900} y={600} size={110} at={26} color={T.ink} width={8} />
        </AbsoluteFill>
      )}
      <Shot from={74} to={148} top={650}>
        <PanelShot frames={["panel/ficha-returned.png"]} srcWidth={1290} srcHeight={1180} width={WIN_W} />
        <HandCircle x={430} y={212} w={194} h={76} at={88} color={T.mint} width={8} />
      </Shot>
      {frame >= 96 && (
        <div style={{ position: "absolute", left: 0, right: 0, top: 1545, display: "flex", justifyContent: "center", opacity: pill, transform: `scale(${interpolate(pill, [0, 1], [0.6, 1]) * breathe})` }}>
          <div style={{ display: "flex", alignItems: "center", gap: 20, background: T.ink, borderRadius: 100, padding: "22px 44px", boxShadow: "0 24px 50px -20px rgba(2,49,42,0.6)" }}>
            <span style={{ ...display(76, T.mint) }}>+<Counter to={23} delay={98} /></span>
            <span style={{ ...display(44, T.cream, 700) }}>clientes recuperados</span>
          </div>
        </div>
      )}
    </AbsoluteFill>
  );
};

// ---------- 4 · Días flojos (local 0–148) ----------
export const OwnerSlowDays: React.FC = () => {
  const frame = useCurrentFrame();
  const kT = 900 / 1194;
  const grow = ease(frame, [72, 100], [0, 10], theme.ease.out);
  return (
    <AbsoluteFill>
      <SceneBg />
      <div style={{ position: "absolute", left: 90, right: 60, top: 250 }}>
        <BenefitHeader num={4} lines={["Llenás los", "días flojos"]} at={0} />
      </div>
      <Sub text="El sistema de IA detecta tu día más flojo y te propone qué hacer." from={12} to={62} top={530} />
      <Sub text="Un toque, y se avisa sola por WhatsApp." from={64} top={540} />
      <Shot from={6} to={66} top={680} left={90}>
        <PanelShot frames={["panel/sugg-tuesday.png"]} srcWidth={1194} srcHeight={1296} width={900} />
        <Tap x={365 * kT} y={1100 * kT} at={56} />
      </Shot>
      <Shot from={62} to={148} top={760}>
        <PanelShot frames={Array.from({ length: 11 }, (_, i) => `panel/bars-${String(i).padStart(2, "0")}.png`)} index={grow} srcWidth={1194} srcHeight={864} width={WIN_W} />
        <HandCircle x={156} y={270} w={150} h={400} at={100} color={T.mint} width={9} />
      </Shot>
      {frame >= 104 && (
        <div style={{ position: "absolute", left: 0, right: 0, top: 1500, display: "flex", justifyContent: "center" }}>
          <WordReveal text="Doble estrellita los martes" delay={104} style={{ ...display(62, T.ink, 800) }} wordStyle={(i) => (i === 3 ? { color: T.mintDeep } : undefined)} />
        </div>
      )}
    </AbsoluteFill>
  );
};
