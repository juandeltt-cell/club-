import React, { useEffect, useState } from "react";
import { AbsoluteFill, Audio, continueRender, delayRender, Sequence, staticFile } from "remotion";
import { Grade, Grain, Vignette } from "./components/Layers";
import { BarsWipe, CircleWipe, DipToInk, Flash, SlashWipe, StarWipe } from "./components/Wipes";
import { StepRedeem, StepScan, StepVisits } from "./scenes/Client";
import { Closing, PUNCH_DUR } from "./scenes/Closing";
import { Hook, QUESTION_AT } from "./scenes/Hook";
import { AiLine, LogoDrop } from "./scenes/Intro";
import { B1Title, B2Title, B3Title, B4Title, CommerceTitle, OwnerKnows, OwnerMessages, OwnerReturns, OwnerSlowDays } from "./scenes/Owner";
import { SCENES } from "./timeline";
import { T, theme } from "./theme";

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
  [8, "pop3", 0.35], ...[14, 18, 22, 26, 30, 34].map((f): [number, string, number] => [f, "tick", 0.16]), [22, "swish", 0.22],
  [QUESTION_AT - 8, "whoosh", 0.3], [QUESTION_AT + 20, "pop4", 0.3], [QUESTION_AT + 34, "pop1", 0.22], [QUESTION_AT + 40, "pop2", 0.22], [QUESTION_AT + 46, "pop3", 0.22],
  // subida: respuesta + logo
  [S.logo.from, "hit", 0.45], [S.logo.from + 1, "shimmer", 0.35], [at(S.logo, 12), "pop6", 0.3], [at(S.logo, 58), "swish", 0.22],
  // sistema de IA
  [S.ai.from - 6, "whoosh", 0.3], [at(S.ai, 36), "swish", 0.22], [at(S.ai, 42), "pop1", 0.28], [at(S.ai, 48), "pop2", 0.28], [at(S.ai, 54), "pop3", 0.28],
  // paso 01
  [S.p1.from - 6, "whoosh", 0.3], [at(S.p1, 22), "tick", 0.22], [at(S.p1, 30), "tick", 0.22], [at(S.p1, 38), "tick", 0.22], [at(S.p1, 66), "pop6", 0.35], [at(S.p1, 72), "whoosh", 0.28],
  ...[92, 94, 96, 98, 101, 103, 105, 107, 109].map((f): [number, string, number] => [at(S.p1, f), "tick", 0.16]),
  [at(S.p1, 106), "pop4", 0.3], [at(S.p1, 118), "tap", 0.45], [at(S.p1, 129), "swish", 0.25], [at(S.p1, 136), "ding", 0.35],
  // paso 02
  [S.p2.from - 6, "whoosh", 0.3], [at(S.p2, 12), "pop1", 0.25], [at(S.p2, 28), "pop4", 0.3], [at(S.p2, 28), "pop2", 0.22], [at(S.p2, 44), "pop5", 0.3], [at(S.p2, 44), "pop3", 0.22], [at(S.p2, 60), "pop6", 0.3],
  [at(S.p2, 90), "swish", 0.3], [at(S.p2, 96), "swish", 0.25], [at(S.p2, 116), "ding", 0.35],
  // paso 03
  [S.p3.from - 6, "whoosh", 0.3], [at(S.p3, 12), "pop5", 0.35], [at(S.p3, 24), "pop6", 0.35], [at(S.p3, 26), "shimmer", 0.35], [at(S.p3, 48), "whoosh", 0.28], [at(S.p3, 70), "ding", 0.35],
  // ¿y tu comercio qué gana? (corte de la canción)
  [S.title.from + 2, "shimmer", 0.25], [at(S.title, 23), "tick", 0.22], [at(S.title, 26), "tick", 0.22], [at(S.title, 29), "tick", 0.22], [at(S.title, 32), "tick", 0.22],
  // beneficios: título propio + ejemplo
  ...[S.b1t, S.b2t, S.b3t, S.b4t].flatMap((sc): [number, string, number][] => [[sc.from - 5, "whoosh", 0.3], [sc.from + 3, "swish", 0.25]]),
  ...[S.b1, S.b2, S.b3, S.b4].map((sc): [number, string, number] => [sc.from - 5, "whoosh", 0.25]),
  [at(S.b1, 10), "tick", 0.22], [at(S.b1, 20), "tick", 0.22], [at(S.b1, 30), "tick", 0.22], [at(S.b1, 58), "pop4", 0.28], [at(S.b1, 88), "pop5", 0.28],
  [at(S.b2, 14), "pop4", 0.28], [at(S.b2, 50), "whoosh", 0.25], [at(S.b2, 74), "swish", 0.22], [at(S.b2, 146), "pop6", 0.3], [at(S.b2, 182), "tap", 0.45],
  [at(S.b2, 204), "pop1", 0.3], [at(S.b2, 209), "pop2", 0.3], [at(S.b2, 214), "pop3", 0.3], [at(S.b2, 219), "pop4", 0.3], [at(S.b2, 225), "ding", 0.35], [at(S.b2, 228), "pop6", 0.35],
  [at(S.b3, 30), "swish", 0.22], [at(S.b3, 94), "whoosh", 0.28], [at(S.b3, 108), "pop6", 0.35], [at(S.b3, 128), "pop5", 0.3],
  ...[132, 136, 140, 144].map((f): [number, string, number] => [at(S.b3, f), "tick", 0.18]),
  [at(S.b4, 16), "pop4", 0.26], [at(S.b4, 52), "tap", 0.45], [at(S.b4, 62), "pop5", 0.35], [at(S.b4, 70), "whoosh", 0.25], [at(S.b4, 104), "shimmer", 0.3],
  // remate + cierre
  [S.closing.from - 6, "whoosh", 0.3], [S.closing.from, "hit", 0.4], [at(S.closing, 11), "hit", 0.3], [at(S.closing, 20), "hit", 0.3],
  [at(S.closing, PUNCH_DUR - 6), "whoosh", 0.3], [at(S.closing, PUNCH_DUR + 1), "shimmer", 0.3],
  ...[14, 19, 24, 29].map((f, i): [number, string, number] => [at(S.closing, PUNCH_DUR + f), `pop${i + 1}`, 0.24]), [at(S.closing, PUNCH_DUR + 50), "pop6", 0.35],
];

const Scene: React.FC<{ s: { from: number; dur: number }; children: React.ReactNode }> = ({ s, children }) => (
  <Sequence from={s.from} durationInFrames={s.dur}>{children}</Sequence>
);

export const Reel: React.FC = () => {
  useFonts();
  return (
    <AbsoluteFill style={{ background: T.cream }}>
      <Scene s={SCENES.hook}><Hook /></Scene>
      <Scene s={SCENES.logo}><LogoDrop /></Scene>
      <Scene s={SCENES.ai}><AiLine /></Scene>
      <Scene s={SCENES.p1}><StepScan /></Scene>
      <Scene s={SCENES.p2}><StepVisits /></Scene>
      <Scene s={SCENES.p3}><StepRedeem /></Scene>
      <Scene s={SCENES.title}><CommerceTitle /></Scene>
      <Scene s={SCENES.b1t}><B1Title /></Scene>
      <Scene s={SCENES.b1}><OwnerKnows /></Scene>
      <Scene s={SCENES.b2t}><B2Title /></Scene>
      <Scene s={SCENES.b2}><OwnerMessages /></Scene>
      <Scene s={SCENES.b3t}><B3Title /></Scene>
      <Scene s={SCENES.b3}><OwnerReturns /></Scene>
      <Scene s={SCENES.b4t}><B4Title /></Scene>
      <Scene s={SCENES.b4}><OwnerSlowDays /></Scene>
      <Scene s={SCENES.closing}><Closing /></Scene>

      {/* transiciones de marca en cada corte */}
      <CircleWipe at={QUESTION_AT} color={T.ink} cx={260} cy={830} />
      <Flash at={SCENES.logo.from} dur={12} />
      <CircleWipe at={SCENES.ai.from} color={T.ink} />
      <StarWipe at={SCENES.p1.from} color={T.star} />
      <SlashWipe at={SCENES.p2.from} color={T.mint} />
      <BarsWipe at={SCENES.p3.from} colors={[T.mint, T.star, T.ink]} />
      <DipToInk at={SCENES.title.from} dur={16} />
      <BarsWipe at={SCENES.b1t.from} dur={7} colors={[T.mint, T.star, T.cream]} />
      <CircleWipe at={SCENES.b1.from} color={T.cream} cy={1400} dur={7} />
      <CircleWipe at={SCENES.b2t.from} color={T.mint} dur={7} />
      <SlashWipe at={SCENES.b2.from} color={T.cream} dur={7} />
      <BarsWipe at={SCENES.b3t.from} dur={7} colors={[T.star, T.mint, T.ink]} />
      <SlashWipe at={SCENES.b3.from} color={T.cream} dir={-1} dur={7} />
      <CircleWipe at={SCENES.b4t.from} color={T.mint} dur={7} />
      <SlashWipe at={SCENES.b4.from} color={T.cream} dur={7} />
      <BarsWipe at={SCENES.closing.from} dur={7} colors={[T.mint, T.star, T.ink]} />
      <StarWipe at={SCENES.closing.from + PUNCH_DUR} color={T.mint} />

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
