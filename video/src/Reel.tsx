import React, { useEffect, useState } from "react";
import { AbsoluteFill, Audio, continueRender, delayRender, Sequence, staticFile } from "remotion";
import { Grade, Grain, Vignette } from "./components/Layers";
import { LightLeak } from "./components/Light";
import { CameraMove, Move, T } from "./components/Camera";
import { CircleWipe, Flash, StarWipe } from "./components/Wipes";
import { StepRedeem, StepScan, StepVisits } from "./scenes/Client";
import { Closing, PUNCH_DUR } from "./scenes/Closing";
import { Hook, QUESTION_AT } from "./scenes/Hook";
import { AiLine, LogoDrop } from "./scenes/Intro";
import { B1Title, B2Title, B3Title, B4Title, CommerceTitle, OwnerMessages, OwnerReturns, OwnerSlowDays } from "./scenes/Owner";
import { SCENES } from "./timeline";
import { T as C, theme } from "./theme";

const FONTS = [
  { family: theme.fonts.display, file: "fonts/bricolage-grotesque-latin-wght-normal.woff2" },
  { family: theme.fonts.display, file: "fonts/bricolage-grotesque-latin-ext-wght-normal.woff2" },
  { family: theme.fonts.body, file: "fonts/inter-latin-wght-normal.woff2" },
  { family: theme.fonts.body, file: "fonts/inter-latin-ext-wght-normal.woff2" },
];

const useFonts = () => {
  const [handle] = useState(() => delayRender("Cargando tipografías"));
  useEffect(() => {
    Promise.all(
      FONTS.map(async ({ family, file }) => {
        const face = new FontFace(family, `url(${staticFile(file)}) format("woff2")`, { weight: "100 900" });
        await face.load();
        (document.fonts as unknown as { add: (f: FontFace) => void }).add(face);
      }),
    ).then(() => continueRender(handle));
  }, [handle]);
};

// Efectos por encima de la canción: [cuadro, archivo, volumen]. Arrancan 2–3 cuadros antes del golpe visual.
const S = SCENES;
const at = (sc: { from: number }, f: number) => sc.from + f;
const SFX: [number, string, number][] = [
  // gancho
  [6, "pop3", 0.35], [16, "swish", 0.22], ...[24, 26, 28, 30, 32, 34, 36, 38, 40, 42, 44, 46].map((f): [number, string, number] => [f, "tick", 0.14]),
  [QUESTION_AT - 8, "whoosh", 0.3], [QUESTION_AT + 20, "pop4", 0.3], [QUESTION_AT + 34, "pop1", 0.22], [QUESTION_AT + 40, "pop2", 0.22], [QUESTION_AT + 46, "pop3", 0.22],
  // subida: respuesta + logo
  [S.logo.from, "hit", 0.45], [S.logo.from + 1, "shimmer", 0.35], [at(S.logo, 12), "pop6", 0.3], [at(S.logo, 58), "swish", 0.22],
  // cortes con movimiento de cámara
  ...[S.ai, S.p1, S.p2, S.p3, S.title, S.b1t, S.b2t, S.b2, S.b3t, S.b3, S.b4t, S.b4, S.closing].map((sc): [number, string, number] => [sc.from - 2, "whoosh", 0.28]),
  // sistema de IA
  [at(S.ai, 36), "swish", 0.22], [at(S.ai, 42), "pop1", 0.28], [at(S.ai, 48), "pop2", 0.28], [at(S.ai, 54), "pop3", 0.28],
  // paso 01: escanea → +1 estrellita
  [at(S.p1, 22), "tick", 0.22], [at(S.p1, 30), "tick", 0.22], [at(S.p1, 38), "tick", 0.22], [at(S.p1, 66), "pop6", 0.35], [at(S.p1, 70), "shimmer", 0.35], [at(S.p1, 84), "ding", 0.35],
  // paso 02
  [at(S.p2, 12), "pop1", 0.25], [at(S.p2, 28), "pop4", 0.3], [at(S.p2, 28), "pop2", 0.22], [at(S.p2, 44), "pop5", 0.3], [at(S.p2, 44), "pop3", 0.22], [at(S.p2, 60), "pop6", 0.3],
  // paso 03
  [at(S.p3, 12), "pop5", 0.35], [at(S.p3, 24), "pop6", 0.35], [at(S.p3, 24), "shimmer", 0.35], [at(S.p3, 48), "whoosh", 0.25], [at(S.p3, 70), "ding", 0.35],
  // ¿y tu comercio qué gana? + grilla
  [S.title.from + 2, "shimmer", 0.25], [at(S.title, 26), "pop1", 0.28], [at(S.title, 34), "pop2", 0.28], [at(S.title, 42), "pop3", 0.28], [at(S.title, 50), "pop4", 0.28],
  // placas de beneficio
  ...[S.b1t, S.b2t, S.b3t, S.b4t].flatMap((sc): [number, string, number][] => [[sc.from + 3, "swish", 0.25], [sc.from + 12, "pop6", 0.2]]),
  // 2 · días flojos
  [at(S.b2, 20), "pop4", 0.22], [at(S.b2, 70), "pop4", 0.22], [at(S.b2, 128), "tap", 0.45], [at(S.b2, 144), "whoosh", 0.22], [at(S.b2, 148), "shimmer", 0.3], [at(S.b2, 180), "swish", 0.25], [at(S.b2, 208), "pop6", 0.35],
  // 3 · mensajes
  [at(S.b3, 16), "pop4", 0.24], [at(S.b3, 30), "swish", 0.22], [at(S.b3, 88), "pop6", 0.3], [at(S.b3, 118), "tap", 0.45], [at(S.b3, 124), "ding", 0.3],
  [at(S.b3, 136), "whoosh", 0.25], [at(S.b3, 166), "pop5", 0.35], [at(S.b3, 168), "shimmer", 0.28],
  // 4 · vuelven
  [at(S.b4, 18), "pop4", 0.24], [at(S.b4, 28), "swish", 0.22],
  // remate + cierre
  [S.closing.from, "hit", 0.4], [at(S.closing, 11), "hit", 0.3], [at(S.closing, 20), "hit", 0.3], [at(S.closing, 24), "pop6", 0.28],
  [at(S.closing, PUNCH_DUR - 6), "whoosh", 0.3], [at(S.closing, PUNCH_DUR + 1), "shimmer", 0.3],
  ...[14, 19, 24, 29].map((f, i): [number, string, number] => [at(S.closing, PUNCH_DUR + f), `pop${i + 1}`, 0.24]), [at(S.closing, PUNCH_DUR + 30), "swish", 0.25], [at(S.closing, PUNCH_DUR + 50), "pop6", 0.35],
];

type Sc = { from: number; dur: number };

/** Escena aislada, con movimiento de cámara al entrar y `T` cuadros extra para salir por debajo de la siguiente. */
const Scene: React.FC<{ s: Sc; enter?: Move; exit?: Move; origin?: string; children: React.ReactNode }> = ({ s, enter = "none", exit = "none", origin, children }) => (
  <Sequence from={s.from} durationInFrames={s.dur + (exit === "none" ? 0 : T)} style={{ isolation: "isolate" }}>
    <CameraMove enter={enter} exit={exit} dur={s.dur} origin={origin}>{children}</CameraMove>
  </Sequence>
);

export const Reel: React.FC = () => {
  useFonts();
  return (
    <AbsoluteFill style={{ background: C.cream }}>
      {/* Orden de dibujo: cada escena queda encima de la anterior, que sale por debajo. */}
      <Scene s={SCENES.hook}><Hook /></Scene>
      <Scene s={SCENES.logo} enter="zoom" exit="push"><LogoDrop /></Scene>
      <Scene s={SCENES.ai} enter="push" exit="zoom"><AiLine /></Scene>
      <Scene s={SCENES.p1} enter="zoom" exit="push"><StepScan /></Scene>
      <Scene s={SCENES.p2} enter="push" exit="push"><StepVisits /></Scene>
      <Scene s={SCENES.p3} enter="push" exit="dive" origin="50% 46%"><StepRedeem /></Scene>
      <Scene s={SCENES.title} enter="zoom" exit="zoom"><CommerceTitle /></Scene>
      <Scene s={SCENES.b1t} enter="zoom" exit="push"><B1Title /></Scene>
      <Scene s={SCENES.b2t} enter="push" exit="zoom"><B2Title /></Scene>
      <Scene s={SCENES.b2} enter="zoom" exit="push"><OwnerSlowDays /></Scene>
      <Scene s={SCENES.b3t} enter="push" exit="zoom"><B3Title /></Scene>
      <Scene s={SCENES.b3} enter="zoom" exit="push"><OwnerMessages /></Scene>
      <Scene s={SCENES.b4t} enter="push" exit="zoom"><B4Title /></Scene>
      <Scene s={SCENES.b4} enter="zoom" exit="zoom"><OwnerReturns /></Scene>
      <Scene s={SCENES.closing} enter="zoom"><Closing /></Scene>

      {/* acentos de marca: pregunta, subida y cierre */}
      <CircleWipe at={QUESTION_AT} color={C.ink} cx={260} cy={830} />
      <Flash at={SCENES.logo.from} dur={12} />
      <StarWipe at={SCENES.closing.from + PUNCH_DUR} color={C.mint} />

      {/* luces de película en los momentos clave */}
      <LightLeak at={SCENES.logo.from - 4} dur={46} />
      <LightLeak at={SCENES.p3.from + 20} dur={40} dir={-1} strength={0.5} />
      <LightLeak at={SCENES.title.from + 4} dur={40} strength={0.4} />
      <LightLeak at={SCENES.closing.from + PUNCH_DUR - 4} dur={50} dir={-1} />

      {/* capas 4 y 5 */}
      <Grade />
      <Grain />
      <Vignette />

      <Audio src={staticFile("music/song-reel.wav")} volume={0.92} />
      {SFX.map(([at, name, vol], i) => (
        <Sequence key={i} from={Math.max(0, at)} durationInFrames={60} layout="none">
          <Audio src={staticFile(`audio/${name}.wav`)} volume={vol} />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};
