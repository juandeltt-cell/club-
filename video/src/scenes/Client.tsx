import React from "react";
import { AbsoluteFill, interpolate, random, useCurrentFrame } from "remotion";
import { Character } from "../components/Character";
import { Phone, Qr, Tap } from "../components/Device";
import { HandSparks } from "../components/Doodle";
import { CakeIcon, CheckIcon, DoubleCheckIcon, SparkleIcon, StarIcon } from "../components/Icons";
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

/** Texto que se "tipea" letra por letra. */
const Typed: React.FC<{ text: string; from: number; perChar?: number }> = ({ text, from, perChar = 2.5 }) => {
  const frame = useCurrentFrame();
  const n = Math.max(0, Math.min(text.length, Math.floor((frame - from) / perChar)));
  const caret = frame >= from - 6 && n < text.length && Math.floor(frame / 8) % 2 === 0;
  return <span>{text.slice(0, n)}<span style={{ opacity: caret ? 1 : 0, color: T.mint }}>|</span></span>;
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
          position: "absolute", left: 600, top: 820, display: "flex", alignItems: "center", gap: 12, background: T.ink, color: T.cream,
          borderRadius: 60, padding: "18px 30px", ...display(44, T.cream, 800), opacity: done, transform: `scale(${interpolate(done, [0, 1], [0.3, 1])}) rotate(6deg)`,
          boxShadow: "0 20px 40px -18px rgba(0,0,0,0.5)",
        }}
      >
        <StarIcon size={44} color={T.star} /> ¡Escaneado!
      </div>
      <HandSparks x={960} y={960} size={100} at={scanAt + 20} color={T.ink} width={7} />
    </AbsoluteFill>
  );
};

// ---------- PASO 01 · escanea + registro (local 0–270) ----------
export const StepScan: React.FC = () => {
  const frame = useCurrentFrame();
  const zoom = ease(frame, [96, 118], [0, 1], theme.ease.inOut);
  const phoneIn = useIn(106, theme.spring.smooth);
  const btn = useIn(150, theme.spring.bouncy);
  const pressed = frame >= 166 ? ease(frame, [166, 170], [0.93, 1]) : 1;
  return (
    <AbsoluteFill>
      <SceneBg />
      <div style={{ position: "absolute", left: 90, top: 250, right: 40, zIndex: 5 }}>
        <StepHeader num="01" label={["El cliente escanea", "el QR en la mesa"]} at={0} exitAt={262} />
      </div>
      {frame < 120 && (
        <AbsoluteFill style={{ transform: `scale(${1 + zoom * 2.4})`, transformOrigin: "676px 1190px", opacity: 1 - ease(frame, [108, 118], [0, 1]) }}>
          <TableScene scanAt={40} />
        </AbsoluteFill>
      )}
      {frame >= 104 && (
        <div style={{ position: "absolute", left: PHONE_X, top: PHONE_Y, opacity: phoneIn, transform: `scale(${interpolate(phoneIn, [0, 1], [0.5, 1])}) rotate(${interpolate(phoneIn, [0, 1], [-8, 0])}deg)`, transformOrigin: "50% 60%" }}>
          <Phone width={PHONE_W} screenBg={T.cream}>
            {frame < 186 ? (
              <AbsoluteFill style={{ background: T.cream }}>
                <div style={{ background: T.ink, padding: "96px 34px 36px" }}>
                  <div style={{ ...display(54, T.cream) }}>{VENUE}</div>
                  <div style={{ ...body(28, "rgba(253,249,242,0.85)", 600), marginTop: 6 }}>Sumate al club y ganá premios</div>
                </div>
                <div style={{ padding: "34px 30px", display: "flex", flexDirection: "column", gap: 26 }}>
                  <Field label="Tu nombre" value={<Typed text="Juli" from={120} perChar={3} />} />
                  <Field label="Tu cumpleaños" value={<Typed text="14/03" from={136} perChar={3} />} icon />
                  <div style={{ display: "flex", alignItems: "center", gap: 10, ...body(24, T.inkSoft, 600) }}>
                    <CakeIcon size={30} color="#C0641F" /> Para sorprenderte en tu día
                  </div>
                </div>
                <div
                  style={{
                    position: "absolute", left: 30, right: 30, top: 830, height: 100, borderRadius: 100, background: T.mint, display: "grid", placeItems: "center",
                    ...body(32, T.white, 700), opacity: btn, transform: `scale(${interpolate(btn, [0, 1], [0.7, 1]) * pressed})`, boxShadow: "0 16px 30px -10px rgba(5,171,135,0.6)",
                  }}
                >
                  Registrarme con WhatsApp
                </div>
              </AbsoluteFill>
            ) : (
              <AbsoluteFill style={{ background: T.chat }}>
                <ChatHeader />
                <div style={{ padding: "30px 22px", display: "flex", flexDirection: "column", gap: 20 }}>
                  <Bubble at={188} out>Quiero sumarme al club de {VENUE}</Bubble>
                  <Bubble at={196} tagAt={206}>
                    <b>¡Bienvenida al club, Juli!</b> Sumaste tu 1.ª estrellita <StarInline />. Con 5 tenés un postre de regalo.
                  </Bubble>
                </div>
              </AbsoluteFill>
            )}
          </Phone>
          <Tap x={PHONE_W / 2} y={900} at={166} />
        </div>
      )}
    </AbsoluteFill>
  );
};

const StarInline: React.FC = () => <StarIcon size={30} color={T.star} style={{ display: "inline-block", verticalAlign: "-4px" }} />;

const Field: React.FC<{ label: string; value: React.ReactNode; icon?: boolean }> = ({ label, value }) => (
  <div>
    <div style={{ ...body(24, T.inkMuted, 700), marginBottom: 10 }}>{label}</div>
    <div style={{ background: T.white, border: `3px solid ${T.line}`, borderRadius: 22, padding: "20px 24px", ...body(40, T.ink, 700), minHeight: 92 }}>{value}</div>
  </div>
);

// ---------- PASO 02 · cada visita suma (local 0–269) ----------
const VISITS = [
  { date: "Vie 7/3", at: 18 },
  { date: "Sáb 15/3", at: 43 },
  { date: "Dom 23/3", at: 68 },
];

export const StepVisits: React.FC = () => {
  const frame = useCurrentFrame();
  const sub = ease(frame, [14, 28], [0, 1]);
  const partA = 1 - ease(frame, [122, 132], [0, 1], theme.ease.in);
  const phoneIn = useIn(130, theme.spring.smooth);
  const filled = VISITS.filter((v) => frame >= v.at + 16).length;
  return (
    <AbsoluteFill>
      <SceneBg />
      <div style={{ position: "absolute", left: 90, top: 250, right: 40, zIndex: 5 }}>
        <StepHeader num="02" label={["En cada visita,", "suma una estrellita"]} at={0} exitAt={260} />
      </div>
      <div style={{ position: "absolute", left: 90, right: 60, top: 500, ...body(40, T.inkSoft, 600), opacity: sub * (frame < 262 ? 1 : 0) }}>
        Escanea el QR de la mesa cada vez que va.
      </div>
      {frame < 134 && (
        <div style={{ position: "absolute", left: 70, top: 620, opacity: partA, transform: `translateY(${(1 - partA) * -80}px)` }}>
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
      )}
      {frame >= 128 && (
        <div style={{ position: "absolute", left: PHONE_X, top: PHONE_Y + 60, opacity: phoneIn, transform: `translateY(${(1 - phoneIn) * 700}px)` }}>
          <Phone width={PHONE_W} screenBg={T.chat}>
            <AbsoluteFill style={{ background: T.chat }}>
              <ChatHeader status={frame >= 150 && frame < 166 ? "escribiendo…" : "en línea"} />
              <div style={{ padding: "30px 22px", display: "flex", flexDirection: "column", gap: 20 }}>
                <Bubble at={138} out time="21:05">¿Cuántas estrellitas tengo?</Bubble>
                <Typing from={150} to={166} />
                <Bubble at={166} tagAt={176} time="21:05">
                  <b>¡Tenés 3, Juli!</b> <StarInline /><StarInline /><StarInline /><br />Te faltan 2 para tu postre de regalo.
                </Bubble>
              </div>
            </AbsoluteFill>
          </Phone>
        </div>
      )}
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
        <StarIcon size={96} color={T.star} />
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

// ---------- PASO 03 · canjea (local 0–219) ----------
export const StepRedeem: React.FC = () => {
  const frame = useCurrentFrame();
  const flip = ease(frame, [58, 82], [0, 180], theme.ease.inOut);
  const filled = 3 + (frame >= 16 ? 1 : 0) + (frame >= 30 ? 1 : 0);
  const move = ease(frame, [122, 142], [0, 1], theme.ease.inOut);
  const waiter = useIn(132, theme.spring.smooth);
  const bubble = useIn(150, theme.spring.bouncy);
  return (
    <AbsoluteFill>
      <SceneBg />
      <div style={{ position: "absolute", left: 90, top: 250, right: 40, zIndex: 5 }}>
        <StepHeader num="03" label={["Junta 5 y canjea", "su premio"]} at={0} exitAt={210} />
      </div>
      <div style={{ position: "absolute", left: PHONE_X, top: PHONE_Y, transform: `translateX(${-move * 250}px) scale(${1 - move * 0.2})`, transformOrigin: "50% 0%" }}>
        <Phone width={PHONE_W} screenBg={T.cream}>
          <AbsoluteFill style={{ background: T.cream, padding: "100px 30px 30px" }}>
            <div style={{ ...body(24, T.inkMuted, 700), letterSpacing: "0.08em", textTransform: "uppercase" }}>Tu tarjeta en {VENUE}</div>
            <div style={{ ...display(66, T.ink), marginTop: 6 }}>Hola, Juli</div>
            <div style={{ perspective: 1600, marginTop: 30 }}>
              <div style={{ position: "relative", height: 500, transformStyle: "preserve-3d", transform: `rotateY(${flip}deg)` }}>
                <div style={{ position: "absolute", inset: 0, backfaceVisibility: "hidden", borderRadius: 40, background: T.ink, padding: "36px 28px" }}>
                  <div style={{ ...body(26, "rgba(253,249,242,0.75)", 600) }}>Tus estrellitas</div>
                  <div style={{ display: "flex", justifyContent: "space-between", marginTop: 26 }}>
                    {[0, 1, 2, 3, 4].map((i) => <MeterSlot key={i} filled={i < filled} at={i === 3 ? 16 : i === 4 ? 30 : -99} />)}
                  </div>
                  <div style={{ ...display(44, T.cream, 700), marginTop: 40 }}>{filled >= 5 ? "¡Ganaste tu postre!" : `Te falta ${5 - filled} para tu postre`}</div>
                </div>
                <div style={{ position: "absolute", inset: 0, backfaceVisibility: "hidden", transform: "rotateY(180deg)", borderRadius: 40, background: T.white, border: `5px dashed ${T.mint}`, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 16 }}>
                  <div style={{ width: 130, height: 130, borderRadius: 36, background: T.peach, display: "grid", placeItems: "center" }}><CakeIcon size={84} color="#C0641F" stroke={1.7} /></div>
                  <div style={{ ...display(58, T.ink) }}>Postre de regalo</div>
                  <div style={{ ...display(54, T.mintDeep), letterSpacing: "0.08em" }}>482 913</div>
                </div>
              </div>
            </div>
          </AbsoluteFill>
        </Phone>
      </div>
      {frame >= 32 && frame < 80 && <StarRain from={32} />}
      {frame >= 128 && (
        <>
          <div style={{ position: "absolute", left: 560, top: 820, opacity: waiter, transform: `translateX(${(1 - waiter) * 500}px)` }}>
            <Character body="Explaining" hair="ShortWavy" face="SmileTeeth" facialHair="Handlebars" width={480} flip />
          </div>
          <div
            style={{
              position: "absolute", left: 470, top: 640, display: "flex", alignItems: "center", gap: 16, background: T.white, border: `5px solid ${T.ink}`,
              borderRadius: "40px 40px 40px 10px", padding: "22px 30px", whiteSpace: "nowrap", ...display(46, T.ink, 800), opacity: bubble, transform: `scale(${interpolate(bubble, [0, 1], [0.3, 1])}) rotate(-3deg)`, transformOrigin: "0% 100%",
            }}
          >
            <div style={{ width: 60, height: 60, borderRadius: "50%", background: T.mint, display: "grid", placeItems: "center" }}><CheckIcon size={40} color={T.white} /></div>
            ¡Canje confirmado!
          </div>
          <HandSparks x={960} y={560} size={100} at={158} color={T.star} width={9} />
        </>
      )}
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
        return <div key={i} style={{ position: "absolute", left: x, top: y, opacity: o, transform: `rotate(${t * (8 + i)}deg)` }}><StarIcon size={size} color={i % 5 === 0 ? T.mint : T.star} /></div>;
      })}
    </AbsoluteFill>
  );
};
