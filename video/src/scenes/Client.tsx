import React from "react";
import { AbsoluteFill, Img, interpolate, random, staticFile, useCurrentFrame } from "remotion";
import { Character } from "../components/Character";
import { Phone, Qr } from "../components/Device";
import { Emoji3D, PhoneBody, Tilt3D } from "../components/Emoji";
import { Star3D } from "../components/Star3D";
import { DoubleCheckIcon, SparkleIcon, StarIcon } from "../components/Icons";
import { SceneBg } from "../components/Layers";
import { ease, useIn } from "../components/Motion";
import { body, display, StepHeader } from "../components/Type";
import { T, theme } from "../theme";

const PHONE_W = 560;
const PHONE_X = 540 - PHONE_W / 2;
const PHONE_Y = 540;
const VENUE = "Brasa Restó";

// ---------- piezas de interfaz del teléfono ----------
const ChatHeader: React.FC<{ status?: string }> = ({ status = "en línea" }) => (
  <div style={{ background: T.ink, padding: "86px 26px 22px", display: "flex", alignItems: "center", gap: 16 }}>
    <div style={{ width: 66, height: 66, borderRadius: "50%", background: T.star, display: "grid", placeItems: "center", ...display(34, T.ink) }}>B</div>
    <div>
      <div style={{ ...body(32, T.cream, 700) }}>{VENUE}</div>
      <div style={{ ...body(22, "rgba(253,249,242,0.7)", 500) }}>{status}</div>
    </div>
  </div>
);

const Bubble: React.FC<{ at: number; out?: boolean; children: React.ReactNode; tagAt?: number; time?: string }> = ({ at, out = false, children, tagAt, time = "20:41" }) => {
  const frame = useCurrentFrame();
  const p = useIn(at, theme.spring.snappy);
  const tag = useIn(tagAt ?? 1e9, theme.spring.bouncy);
  if (frame < at) return null;
  return (
    <div
      style={{
        alignSelf: out ? "flex-end" : "flex-start", maxWidth: out ? 420 : 470, background: out ? T.bubbleOut : T.bubbleIn,
        borderRadius: out ? "30px 30px 8px 30px" : "30px 30px 30px 8px", padding: "20px 24px 14px",
        opacity: p, transform: `translateY(${(1 - p) * 40}px) scale(${interpolate(p, [0, 1], [0.8, 1])})`, transformOrigin: out ? "right bottom" : "left bottom",
        boxShadow: "0 3px 0 rgba(2,49,42,0.06)",
      }}
    >
      <div style={{ ...body(33, T.ink, 500), lineHeight: 1.3 }}>{children}</div>
      <div style={{ display: "flex", justifyContent: tagAt ? "space-between" : "flex-end", alignItems: "center", marginTop: 10, gap: 10 }}>
        {tagAt !== undefined && (
          <div style={{ display: "flex", alignItems: "center", gap: 6, background: T.mintSoft, borderRadius: 30, padding: "6px 14px", ...body(22, T.mintDeep, 700), opacity: tag, transform: `scale(${interpolate(tag, [0, 1], [0.6, 1])})`, transformOrigin: "left center" }}>
            <SparkleIcon size={24} color={T.mint} /> automático
          </div>
        )}
        <span style={{ display: "flex", alignItems: "center", gap: 6, ...body(20, T.inkMuted) }}>
          {time} {out && <DoubleCheckIcon size={28} color="#2F9BD6" />}
        </span>
      </div>
    </div>
  );
};

const Typing: React.FC<{ from: number; to: number }> = ({ from, to }) => {
  const frame = useCurrentFrame();
  if (frame < from || frame >= to) return null;
  return (
    <div style={{ alignSelf: "flex-start", background: T.bubbleIn, borderRadius: 28, padding: "22px 26px", display: "flex", gap: 10 }}>
      {[0, 1, 2].map((i) => <div key={i} style={{ width: 15, height: 15, borderRadius: "50%", background: T.inkMuted, transform: `translateY(${Math.sin(frame / 3 - i) * 5}px)` }} />)}
    </div>
  );
};

// ---------- ilustración de la mesa ----------
const TableScene: React.FC<{ scanAt: number }> = ({ scanAt }) => {
  const frame = useCurrentFrame();
  const juli = useIn(4, theme.spring.smooth);
  const stand = useIn(14, theme.spring.bouncy);
  const beam = frame >= scanAt && frame < scanAt + 46 ? 0.35 + 0.25 * Math.sin((frame - scanAt) / 2.5) : 0;
  const done = useIn(scanAt + 44, theme.spring.bouncy);
  const steam = (i: number) => Math.sin(frame / 9 + i) * 8;
  return (
    <AbsoluteFill>
      {/* pared del restó */}
      <div style={{ position: "absolute", left: 50, top: 560, width: 980, height: 1110, borderRadius: 64, background: T.peach, border: `6px solid ${T.ink}`, overflow: "hidden" }}>
        <div style={{ position: "absolute", left: 540, top: 70, width: 340, height: 260, borderRadius: "170px 170px 20px 20px", background: "#FFF6EA", border: `6px solid ${T.ink}` }} />
      </div>
      {/* Juli con su celular */}
      <div style={{ position: "absolute", left: 90, top: 560, opacity: juli, transform: `translateY(${(1 - juli) * 120}px)` }}>
        <Character body="Device" hair="Long" face={frame > scanAt + 44 ? "SmileBig" : "Calm"} width={600} />
      </div>
      {/* haz de escaneo */}
      <svg width={1080} height={1920} style={{ position: "absolute", inset: 0, opacity: beam }}>
        <polygon points="676,1190 800,1080 960,1080 960,1280 800,1280" fill={T.mint} />
      </svg>
      {/* exhibidor con el QR */}
      <div
        style={{
          position: "absolute", left: 770, top: 990, width: 230, padding: "18px 16px 20px", borderRadius: 26, background: T.white,
          border: `6px solid ${T.ink}`, textAlign: "center", transform: `rotate(-3deg) scale(${stand})`, transformOrigin: "50% 100%",
        }}
      >
        <div style={{ ...display(26, T.ink) }}>{VENUE}</div>
        <div style={{ ...body(17, T.inkSoft, 700), margin: "2px 0 10px" }}>Sumá estrellitas</div>
        <div style={{ display: "grid", placeItems: "center" }}><Qr size={180} progress={1} /></div>
      </div>
      {/* mesa, plato y café */}
      <div style={{ position: "absolute", left: 20, top: 1330, width: 1040, height: 90, borderRadius: 24, background: "#E7B98A", border: `7px solid ${T.ink}` }} />
      <div style={{ position: "absolute", left: 80, top: 1413, width: 920, height: 260, background: "#D9A36E", borderLeft: `7px solid ${T.ink}`, borderRight: `7px solid ${T.ink}` }} />
      <div style={{ position: "absolute", left: 140, top: 1296, width: 300, height: 64, borderRadius: "50%", background: T.white, border: `6px solid ${T.ink}` }} />
      <div style={{ position: "absolute", left: 200, top: 1250, width: 180, height: 80, borderRadius: "90px 90px 10px 10px", background: T.star, border: `6px solid ${T.ink}` }} />
      {[0, 1, 2].map((i) => (
        <div key={i} style={{ position: "absolute", left: 240 + i * 45 + steam(i), top: 1150, width: 10, height: 70, borderRadius: 10, background: T.inkMuted, opacity: 0.35 }} />
      ))}
      {/* sticker de confirmación */}
      <div
        style={{
          position: "absolute", left: 300, top: 1490, display: "flex", alignItems: "center", gap: 12, background: T.ink, color: T.cream,
          borderRadius: 60, padding: "18px 30px", ...display(44, T.cream, 800), opacity: done, transform: `scale(${interpolate(done, [0, 1], [0.3, 1])}) rotate(6deg)`,
          boxShadow: "0 20px 40px -18px rgba(0,0,0,0.5)",
        }}
      >
        <StarIcon size={44} color={T.star} /> ¡Escaneado!
      </div>
    </AbsoluteFill>
  );
};

// ---------- PASO 01 · escanea el QR → +1 estrellita (local 0–122) ----------
export const StepScan: React.FC = () => {
  const frame = useCurrentFrame();
  const pill = useIn(84, theme.spring.bouncy);
  return (
    <AbsoluteFill>
      <SceneBg />
      <div style={{ position: "absolute", left: 90, top: 250, right: 40 }}>
        <StepHeader num="01" label={["El cliente escanea", "el QR en la mesa"]} at={0} />
      </div>
      <TableScene scanAt={22} />
      {/* la estrellita que gana, en 3D real */}
      <Star3D size={380} at={70} x={640} y={500} turns={1.5} />
      {frame >= 84 && (
        <div
          style={{
            position: "absolute", left: 650, top: 860, display: "flex", alignItems: "center", gap: 10, background: T.star, borderRadius: 60, padding: "14px 28px",
            ...display(44, T.ink, 800), opacity: pill, transform: `scale(${interpolate(pill, [0, 1], [0.4, 1])}) rotate(-4deg)`, boxShadow: "0 16px 30px -14px rgba(0,0,0,0.45)",
          }}
        >
          +1 estrellita
        </div>
      )}
    </AbsoluteFill>
  );
};

const StarInline: React.FC = () => <StarIcon size={30} color={T.star} style={{ display: "inline-block", verticalAlign: "-4px" }} />;

// ---------- PASO 02 · cada visita suma (local 0–108) ----------
const VISITS = [
  { date: "Vie 7/3", at: 12 },
  { date: "Sáb 15/3", at: 28 },
  { date: "Dom 23/3", at: 44 },
];

export const StepVisits: React.FC = () => {
  const frame = useCurrentFrame();
  const sub = ease(frame, [14, 28], [0, 1]);
  const filled = VISITS.filter((v) => frame >= v.at + 16).length;
  return (
    <AbsoluteFill>
      <SceneBg />
      <div style={{ position: "absolute", left: 90, top: 250, right: 40 }}>
        <StepHeader num="02" label={["En cada visita,", "suma una estrellita"]} at={0} />
      </div>
      <div style={{ position: "absolute", left: 90, right: 60, top: 500, ...body(40, T.inkSoft, 600), opacity: sub }}>
        Escanea el QR de la mesa cada vez que va.
      </div>
      <div style={{ position: "absolute", left: 70, top: 640 }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          {VISITS.map((v, i) => <VisitRow key={v.date} {...v} index={i} />)}
        </div>
        <div style={{ marginTop: 44, width: 940, background: T.ink, borderRadius: 44, padding: "30px 34px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ ...display(44, T.cream, 700) }}>Tarjeta de Juli</div>
          <div style={{ display: "flex", gap: 10 }}>
            {[0, 1, 2, 3, 4].map((i) => <MeterSlot key={i} filled={i < filled} at={VISITS[i]?.at !== undefined ? VISITS[i].at + 16 : -99} />)}
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

const VisitRow: React.FC<{ date: string; at: number; index: number }> = ({ date, at, index }) => {
  const frame = useCurrentFrame();
  const p = useIn(at, theme.spring.bouncy);
  const star = useIn(at + 8, theme.spring.bouncy);
  const fly = ease(frame, [at + 12, at + 22], [0, 1], theme.ease.in);
  return (
    <div
      style={{
        width: 940, display: "flex", alignItems: "center", gap: 26, background: T.white, borderRadius: 40, padding: "18px 30px 18px 18px",
        border: `3px solid ${T.ink}`, opacity: Math.min(1, p * 1.5), transform: `translateX(${(1 - p) * (index % 2 ? 600 : -600)}px) rotate(${index % 2 ? 1 : -1}deg)`,
      }}
    >
      <div style={{ width: 130, height: 130, borderRadius: "50%", overflow: "hidden", background: T.mintSoft, border: `3px solid ${T.ink}`, flex: "none", position: "relative" }}>
        <div style={{ position: "absolute", left: -8, top: 8 }}><Character body="Device" hair="Long" face="SmileBig" width={150} /></div>
      </div>
      <div style={{ flex: 1 }}>
        <div style={{ ...body(26, T.inkMuted, 700) }}>{date}</div>
        <div style={{ ...display(46, T.ink, 800) }}>Escaneó el QR</div>
      </div>
      <div style={{ transform: `scale(${star * (1 - fly * 0.6)}) translate(${fly * 200}px, ${fly * (380 - index * 150)}px) rotate(${star * 360}deg)`, opacity: 1 - fly }}>
        <Emoji3D name="star" size={88} float={0} depth={0.6} />
      </div>
    </div>
  );
};

const MeterSlot: React.FC<{ filled: boolean; at: number }> = ({ filled, at }) => {
  const frame = useCurrentFrame();
  const pop = useIn(Math.max(0, at), theme.spring.bouncy);
  const s = filled && at > 0 && frame >= at ? interpolate(pop, [0, 0.6, 1], [0.2, 1.35, 1]) : 1;
  return (
    <div style={{ width: 88, height: 88, borderRadius: "50%", background: "rgba(253,249,242,0.12)", display: "grid", placeItems: "center" }}>
      <StarIcon size={70} color={filled ? T.star : "rgba(253,249,242,0.25)"} style={{ transform: `scale(${s})` }} />
    </div>
  );
};

// ---------- PASO 03 · desbloquea su premio (local 0–148) ----------
export const StepRedeem: React.FC = () => {
  const frame = useCurrentFrame();
  const flip = ease(frame, [48, 70], [0, 180], theme.ease.inOut);
  const filled = 3 + (frame >= 12 ? 1 : 0) + (frame >= 24 ? 1 : 0);
  // el acercamiento ocurre durante el giro de la tarjeta; después, todo queda quieto
  const push = ease(frame, [48, 70], [1, 1.1], theme.ease.inOut);
  // el teléfono sube y se asienta (parallax device rise)
  const rise = ease(frame, [0, 22], [0, 1], theme.ease.out);
  return (
    <AbsoluteFill>
      <SceneBg />
      <div style={{ position: "absolute", left: 90, top: 250, right: 40 }}>
        <StepHeader num="03" label={["Junta 5 y desbloquea", "su premio"]} at={0} />
      </div>
      <div style={{ position: "absolute", left: PHONE_X, top: PHONE_Y, transform: `translateY(${(1 - rise) * 380}px) scale(${push * (0.86 + 0.14 * rise)})`, transformOrigin: "50% 30%", opacity: Math.min(1, rise * 2) }}>
        <Tilt3D range={[0, 40]} from={[22, 10]} to={[-8, 2]}>
        <PhoneBody width={PHONE_W}>
        <Phone width={PHONE_W} screenBg={T.cream}>
          <AbsoluteFill style={{ background: T.cream, padding: "100px 30px 30px" }}>
            <div style={{ ...body(24, T.inkMuted, 700), letterSpacing: "0.08em", textTransform: "uppercase" }}>Tu tarjeta en {VENUE}</div>
            <div style={{ ...display(66, T.ink), marginTop: 6 }}>Hola, Juli</div>
            <div style={{ perspective: 1600, marginTop: 30 }}>
              <div style={{ position: "relative", height: 560, transformStyle: "preserve-3d", transform: `rotateY(${flip}deg)` }}>
                <div style={{ position: "absolute", inset: 0, backfaceVisibility: "hidden", borderRadius: 40, background: T.ink, padding: "36px 28px" }}>
                  <div style={{ ...body(26, "rgba(253,249,242,0.75)", 600) }}>Tus estrellitas</div>
                  <div style={{ display: "flex", justifyContent: "space-between", marginTop: 26 }}>
                    {[0, 1, 2, 3, 4].map((i) => <MeterSlot key={i} filled={i < filled} at={i === 3 ? 12 : i === 4 ? 24 : -99} />)}
                  </div>
                  <div style={{ ...display(46, filled >= 5 ? T.star : T.cream, 800), marginTop: 44 }}>{filled >= 5 ? "¡Premio desbloqueado!" : "Te falta 1 para tu premio"}</div>
                </div>
                <div style={{ position: "absolute", inset: 0, backfaceVisibility: "hidden", transform: "rotateY(180deg)", borderRadius: 40, background: T.white, border: `5px dashed ${T.mint}`, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 14, padding: "0 30px", textAlign: "center" }}>
                  <div style={{ ...display(58, T.mintDeep) }}>¡Primer premio!</div>
                  <Emoji3D name="shortcake" size={120} at={60} float={0.3} />
                  <div style={{ ...body(34, T.ink, 700), lineHeight: 1.25 }}>Con tu próximo plato, el postre va sin cargo.</div>
                  <div style={{ ...display(46, T.inkMuted), letterSpacing: "0.08em", marginTop: 4 }}>482 913</div>
                </div>
              </div>
            </div>
          </AbsoluteFill>
        </Phone>
        </PhoneBody>
        </Tilt3D>
      </div>
      {frame >= 26 && frame < 74 && <StarRain from={26} />}
      <Star3D size={300} at={24} x={-20} y={1240} turns={2} />
      <Emoji3D name="wrapped_gift" size={130} at={78} x={850} y={660} rotate={12} />
    </AbsoluteFill>
  );
};

const StarRain: React.FC<{ from: number }> = ({ from }) => {
  const frame = useCurrentFrame();
  const t = frame - from;
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      {Array.from({ length: 32 }).map((_, i) => {
        const a = random(`r${i}`) * Math.PI * 2, v = 18 + random(`rv${i}`) * 26;
        const x = 540 + Math.cos(a) * v * t, y = 1000 + Math.sin(a) * v * t * 0.8 + 1.1 * t * t;
        const size = 34 + random(`rs${i}`) * 44;
        const o = interpolate(t, [0, 4, 34, 48], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
        return <div key={i} style={{ position: "absolute", left: x, top: y, opacity: o, transform: `rotate(${t * (4 + i * 0.5)}deg)` }}><Img src={staticFile(`emoji/${i % 5 === 0 ? "sparkles" : "star"}.png`)} style={{ width: size * 1.3, height: size * 1.3 }} /></div>;
      })}
    </AbsoluteFill>
  );
};
