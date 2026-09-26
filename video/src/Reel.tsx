import React, { useEffect, useState } from "react";
import { AbsoluteFill, Audio, continueRender, delayRender, Sequence, staticFile } from "remotion";
import { AudioReactiveProvider } from "./components/AudioReactive";
import { Grade, Grain, Vignette } from "./components/Layers";
import { LightLeak } from "./components/Light";
import { CameraMove, Move, T } from "./components/Camera";
import { CircleWipe, Flash, StarWipe } from "./components/Wipes";
import { StepRedeem, StepScan, StepVisits } from "./scenes/Client";
import { Closing, PUNCH_DUR } from "./scenes/Closing";
import { CLAIM_AT, Hook, QUESTION_AT } from "./scenes/Hook";
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

// Efectos por encima de la canción: [cuadro, sonido, volumen]. Suenan suaves, por debajo de la música.
// Los de uso general son grabaciones de Kenney (CC0, vía latent-spaces/brag) en public/sfx;
// "shimmer" es el brillo sintetizado propio (public/audio).
const KIT: Record<string, string> = {
  whoosh: "sfx/card-slide-1", swish: "sfx/card-slide-2", tap: "sfx/click2", tick: "sfx/click_005",
  ding: "sfx/impactBell_heavy_000", bell: "sfx/impactBell_heavy_003", hit: "sfx/impactSoft_heavy_003",
  pop1: "sfx/bong_001", pop2: "sfx/click_003", pop3: "sfx/rollover2", pop4: "sfx/select_008", pop5: "sfx/drop_002", pop6: "sfx/impactSoft_medium_001",
  soft: "sfx/impactSoft_medium_000", card: "sfx/card-place-1", chip: "sfx/chip-lay-1",
  plate: "sfx/impactPlate_light_000", plate2: "sfx/impactPlate_light_002", glass: "sfx/impactGlass_light_001", glass2: "sfx/impactGlass_light_002",
  step1: "sfx/footstep_wood_000", step2: "sfx/footstep_wood_001", step3: "sfx/footstep_wood_002", step4: "sfx/footstep_wood_003",
  shimmer: "audio/shimmer",
};
const S = SCENES;
const at = (sc: { from: number }, f: number) => sc.from + f;
type Fx = [number, string, number];
const SFX: Fx[] = [
  // gancho · el plato: aparece, se levanta la campana, brilla la estrellita
  [6, "plate", 0.24], [38, "glass", 0.22], [46, "shimmer", 0.3], [50, "bell", 0.24],
  // gancho · 12 veces + pregunta
  [CLAIM_AT - 4, "whoosh", 0.3], [CLAIM_AT + 6, "soft", 0.35], ...[24, 26, 28, 30, 32, 34, 36, 38, 40, 42, 44, 46].map((f): Fx => [CLAIM_AT + f, "tick", 0.14]),
  [QUESTION_AT - 8, "whoosh", 0.3], [QUESTION_AT + 20, "pop4", 0.26], [QUESTION_AT + 34, "pop1", 0.2], [QUESTION_AT + 40, "pop2", 0.2], [QUESTION_AT + 46, "pop3", 0.2],
  // subida: respuesta + logo
  [S.logo.from, "hit", 0.5], [S.logo.from + 1, "shimmer", 0.3], [at(S.logo, 12), "bell", 0.28], [at(S.logo, 58), "swish", 0.2],
  // cortes con movimiento de cámara
  ...[S.ai, S.p1, S.p2, S.p3, S.title, S.b1t, S.b2t, S.b2, S.b3t, S.b3, S.b4t, S.b4, S.closing].map((sc): Fx => [sc.from - 3, "whoosh", 0.26]),
  // sistema de IA
  [at(S.ai, 36), "swish", 0.2], [at(S.ai, 42), "pop1", 0.26], [at(S.ai, 48), "pop2", 0.26], [at(S.ai, 54), "pop3", 0.26],
  // paso 01: escanea → +1 estrellita
  [at(S.p1, 22), "tick", 0.2], [at(S.p1, 30), "tick", 0.2], [at(S.p1, 38), "tick", 0.2], [at(S.p1, 66), "pop6", 0.32], [at(S.p1, 70), "shimmer", 0.3], [at(S.p1, 84), "ding", 0.3],
  // paso 02
  [at(S.p2, 12), "card", 0.22], [at(S.p2, 28), "card", 0.22], [at(S.p2, 28), "chip", 0.2], [at(S.p2, 44), "card", 0.22], [at(S.p2, 44), "chip", 0.2], [at(S.p2, 60), "chip", 0.24],
  // paso 03
  [at(S.p3, 12), "chip", 0.28], [at(S.p3, 24), "pop6", 0.32], [at(S.p3, 24), "shimmer", 0.32], [at(S.p3, 48), "swish", 0.22], [at(S.p3, 70), "ding", 0.32],
  // ¿y tu comercio qué gana? + grilla
  [S.title.from + 2, "shimmer", 0.22], [at(S.title, 24), "card", 0.24], [at(S.title, 32), "card", 0.24], [at(S.title, 40), "card", 0.24], [at(S.title, 48), "card", 0.24],
  // placas de beneficio
  ...[S.b1t, S.b2t, S.b3t, S.b4t].flatMap((sc): Fx[] => [[sc.from + 3, "swish", 0.22], [sc.from + 12, "soft", 0.22]]),
  // 2 · días flojos
  [at(S.b2, 18), "pop4", 0.2], [at(S.b2, 64), "pop4", 0.2], [at(S.b2, 112), "tap", 0.45], [at(S.b2, 126), "swish", 0.22], [at(S.b2, 130), "shimmer", 0.26], [at(S.b2, 160), "swish", 0.22], [at(S.b2, 188), "pop6", 0.3],
  // 3 · mensajes: aprobar → enviado → le llega a Juli
  [at(S.b3, 16), "pop4", 0.22], [at(S.b3, 30), "swish", 0.2], [at(S.b3, 110), "pop6", 0.26], [at(S.b3, 150), "tap", 0.45], [at(S.b3, 156), "ding", 0.3],
  [at(S.b3, 164), "whoosh", 0.24], [at(S.b3, 194), "pop5", 0.32], [at(S.b3, 196), "shimmer", 0.24],
  // 4 · vuelven
  [at(S.b4, 18), "pop4", 0.22], [at(S.b4, 28), "swish", 0.2],
  // remate + cierre
  [S.closing.from, "hit", 0.42], [at(S.closing, 11), "soft", 0.32], [at(S.closing, 20), "soft", 0.32], [at(S.closing, 24), "pop6", 0.24],
  [at(S.closing, PUNCH_DUR - 6), "whoosh", 0.28], [at(S.closing, PUNCH_DUR + 1), "shimmer", 0.28], [at(S.closing, PUNCH_DUR + 2), "bell", 0.26],
  ...[14, 19, 24, 29].map((f, i): Fx => [at(S.closing, PUNCH_DUR + f), `pop${i + 1}`, 0.2]), [at(S.closing, PUNCH_DUR + 30), "swish", 0.2], [at(S.closing, PUNCH_DUR + 50), "pop6", 0.3],
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
      <AudioReactiveProvider src="music/song-reel.wav">
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

      {/* acentos de marca: del restó al "12 veces", pregunta, subida y cierre */}
      <CircleWipe at={CLAIM_AT} color={C.cream} cx={540} cy={1250} />
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
      </AudioReactiveProvider>

      <Audio src={staticFile("music/song-reel.wav")} volume={0.92} />
      {SFX.map(([at, name, vol], i) => (
        <Sequence key={i} from={Math.max(0, at)} durationInFrames={60} layout="none">
          <Audio src={staticFile(`${KIT[name] ?? `audio/${name}`}.wav`)} volume={vol} />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};
