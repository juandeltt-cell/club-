import React, { useEffect, useState } from "react";
import { AbsoluteFill, Audio, continueRender, delayRender, Sequence, staticFile } from "remotion";
import { Grade, Grain, Vignette } from "./components/Layers";
import { BarsWipe, CircleWipe, DipToInk, Flash, SlashWipe, StarWipe } from "./components/Wipes";
import { StepRedeem, StepScan, StepVisits } from "./scenes/Client";
import { Closing } from "./scenes/Closing";
import { Hook } from "./scenes/Hook";
import { AiLine, Explain, LogoDrop } from "./scenes/Intro";
import { CommerceTitle, OwnerKnows, OwnerMessages, OwnerReturns, OwnerSlowDays } from "./scenes/Owner";
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
const SFX: [number, string, number][] = [
  // gancho
  [10, "pop3", 0.35], [13, "tick", 0.2], [16, "tick", 0.2], [19, "tick", 0.2], [22, "tick", 0.2], [42, "swish", 0.25],
  [143, "whoosh", 0.3], [170, "pop4", 0.3], [187, "pop1", 0.25], [195, "pop2", 0.25], [203, "pop3", 0.25],
  // subida y qué es
  [302, "hit", 0.45], [303, "shimmer", 0.35],
  [431, "whoosh", 0.3], [442, "pop1", 0.3], [466, "pop2", 0.3], [490, "pop3", 0.3],
  [592, "whoosh", 0.3], [667, "swish", 0.25], [675, "swish", 0.25], [683, "swish", 0.25],
  // paso 01
  [727, "whoosh", 0.3], [773, "tick", 0.25], [781, "tick", 0.25], [789, "tick", 0.25], [815, "pop6", 0.35], [829, "whoosh", 0.3],
  [853, "tick", 0.18], [856, "tick", 0.18], [859, "tick", 0.18], [862, "tick", 0.18], [869, "tick", 0.18], [872, "tick", 0.18], [875, "tick", 0.18], [878, "tick", 0.18], [881, "tick", 0.18],
  [882, "pop4", 0.3], [898, "tap", 0.45], [920, "swish", 0.25], [928, "ding", 0.35],
  // paso 02
  [997, "whoosh", 0.3], [1020, "pop1", 0.25], [1036, "pop4", 0.3], [1045, "pop2", 0.25], [1061, "pop5", 0.3], [1070, "pop3", 0.25], [1086, "pop6", 0.3],
  [1132, "swish", 0.3], [1140, "swish", 0.25], [1168, "ding", 0.35],
  // paso 03
  [1266, "whoosh", 0.3], [1287, "pop5", 0.35], [1301, "pop6", 0.35], [1303, "shimmer", 0.35], [1329, "whoosh", 0.3], [1403, "swish", 0.3], [1421, "ding", 0.35],
  // ¿y tu comercio qué gana? (corte de la canción)
  [1500, "shimmer", 0.25], [1584, "whoosh", 0.25], [1607, "tick", 0.25], [1619, "tick", 0.25], [1631, "tick", 0.25], [1641, "swish", 0.25],
  // vuelve la energía
  [1712, "whoosh", 0.3], [1718, "hit", 0.45], [1725, "swish", 0.25], [1793, "whoosh", 0.3], [1845, "pop4", 0.3], [1877, "tap", 0.45],
  [1903, "whoosh", 0.3], [1907, "pop1", 0.3], [1913, "pop2", 0.3], [1919, "pop3", 0.3], [1925, "pop4", 0.3], [1933, "ding", 0.35], [1937, "pop6", 0.35],
  [1955, "whoosh", 0.3], [1980, "pop5", 0.35], [2034, "whoosh", 0.25], [2056, "pop6", 0.3], [2059, "tick", 0.2], [2063, "tick", 0.2], [2067, "tick", 0.2], [2071, "tick", 0.2],
  [2103, "whoosh", 0.3], [2164, "tap", 0.45], [2170, "whoosh", 0.25], [2181, "shimmer", 0.3], [2208, "swish", 0.25], [2212, "pop5", 0.3],
  // cierre
  [2251, "whoosh", 0.3], [2257, "hit", 0.4], [2259, "shimmer", 0.3], [2276, "pop1", 0.25], [2282, "pop2", 0.25], [2288, "pop3", 0.25], [2294, "pop4", 0.25], [2326, "pop6", 0.35],
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
      <Scene s={SCENES.explain}><Explain /></Scene>
      <Scene s={SCENES.ai}><AiLine /></Scene>
      <Scene s={SCENES.p1}><StepScan /></Scene>
      <Scene s={SCENES.p2}><StepVisits /></Scene>
      <Scene s={SCENES.p3}><StepRedeem /></Scene>
      <Scene s={SCENES.title}><CommerceTitle /></Scene>
      <Scene s={SCENES.b1}><OwnerKnows /></Scene>
      <Scene s={SCENES.b2}><OwnerMessages /></Scene>
      <Scene s={SCENES.b3}><OwnerReturns /></Scene>
      <Scene s={SCENES.b4}><OwnerSlowDays /></Scene>
      <Scene s={SCENES.closing}><Closing /></Scene>

      {/* transiciones de marca en cada corte */}
      <CircleWipe at={150} color={T.ink} cx={260} cy={830} />
      <Flash at={SCENES.logo.from} dur={12} />
      <BarsWipe at={SCENES.explain.from} />
      <CircleWipe at={SCENES.ai.from} color={T.ink} />
      <StarWipe at={SCENES.p1.from} color={T.star} />
      <SlashWipe at={SCENES.p2.from} color={T.mint} />
      <BarsWipe at={SCENES.p3.from} colors={[T.mint, T.star, T.ink]} />
      <DipToInk at={SCENES.title.from} dur={16} />
      <CircleWipe at={SCENES.b1.from} color={T.cream} cy={1400} />
      <Flash at={SCENES.b2.from} dur={8} />
      <BarsWipe at={SCENES.b2.from} dur={7} colors={[T.star, T.mint, T.ink]} />
      <SlashWipe at={SCENES.b3.from} color={T.ink} dir={-1} />
      <CircleWipe at={SCENES.b4.from} color={T.mint} />
      <StarWipe at={SCENES.closing.from} color={T.mint} />

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
