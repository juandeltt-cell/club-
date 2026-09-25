import React, { useEffect, useState } from "react";
import { AbsoluteFill, Audio, continueRender, delayRender, Sequence, staticFile } from "remotion";
import { Grade, Grain, Vignette } from "./components/Layers";
import { Benefit1, Benefit2, Benefit3, Benefit4, BenefitsTitle } from "./scenes/Benefits";
import { Closing } from "./scenes/Closing";
import { Hook } from "./scenes/Hook";
import { Steps } from "./scenes/Steps";
import { WhatIs } from "./scenes/WhatIs";
import { SCENES } from "./timeline";
import { theme } from "./theme";

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

// Efectos: [cuadro, archivo, volumen]. Arrancan 2–3 cuadros antes del golpe visual.
const SFX: [number, string, number][] = [
  // gancho
  [0, "hit", 0.55], [13, "tick", 0.4], [15, "tick", 0.4], [17, "tick", 0.4], [19, "tick", 0.4], [21, "tick", 0.4], [18, "pop3", 0.5],
  [59, "hit", 0.7], [86, "swish", 0.5], [100, "whoosh", 0.55],
  // qué es
  [121, "shimmer", 0.45], [127, "pop4", 0.5], [131, "pop5", 0.5], [174, "pop6", 0.5], [202, "whoosh", 0.45],
  [298, "pop1", 0.45], [323, "pop2", 0.45], [348, "pop3", 0.45], [372, "shimmer", 0.55], [433, "whoosh", 0.5],
  // cómo funciona
  [448, "whoosh", 0.45], [500, "tick", 0.5], [514, "pop6", 0.5], [529, "pop1", 0.4], [534, "pop2", 0.4], [539, "pop3", 0.4], [549, "pop4", 0.45],
  [568, "whoosh", 0.4], [577, "tap", 0.6], [588, "swish", 0.45], [606, "tick", 0.5], [632, "ding", 0.55], [643, "pop3", 0.4],
  [649, "pop1", 0.5], [654, "pop3", 0.5], [659, "pop5", 0.5],
  [718, "whoosh", 0.45], [748, "pop5", 0.55], [763, "pop6", 0.55], [766, "shimmer", 0.6], [786, "whoosh", 0.45], [846, "whoosh", 0.45],
  // ¿y vos qué ganás?
  [834, "riser", 0.45], [870, "hit", 0.75],
  // beneficio 1
  [930, "hit", 0.45], [937, "swish", 0.4], [945, "tick", 0.5], [957, "tick", 0.5], [969, "tick", 0.5], [979, "whoosh", 0.4],
  // beneficio 2
  [1050, "hit", 0.45], [1059, "swish", 0.4], [1110, "whoosh", 0.4], [1140, "tap", 0.6], [1149, "whoosh", 0.4],
  [1153, "pop1", 0.45], [1158, "pop2", 0.45], [1163, "pop3", 0.45], [1168, "pop4", 0.45], [1175, "ding", 0.5],
  [1191, "swish", 0.4], [1197, "tap", 0.45], [1202, "tap", 0.45], [1207, "tap", 0.45], [1212, "tap", 0.45],
  // beneficio 3
  [1230, "hit", 0.45], [1235, "swish", 0.4], [1245, "ding", 0.5], [1287, "whoosh", 0.4], [1301, "pop5", 0.45], [1307, "pop6", 0.5],
  [1311, "tick", 0.35], [1314, "tick", 0.35], [1317, "tick", 0.35], [1320, "tick", 0.35], [1323, "tick", 0.35],
  // beneficio 4
  [1350, "hit", 0.45], [1357, "swish", 0.4], [1398, "tap", 0.6], [1405, "whoosh", 0.4], [1413, "shimmer", 0.45], [1443, "pop4", 0.45], [1445, "pop5", 0.4],
  // cierre
  [1470, "hit", 0.6], [1472, "shimmer", 0.5], [1478, "pop4", 0.45], [1482, "pop5", 0.45], [1500, "swish", 0.4],
  [1531, "pop1", 0.35], [1537, "pop3", 0.35], [1543, "pop5", 0.35], [1561, "pop6", 0.5], [1591, "swish", 0.35],
];

export const Reel: React.FC = () => {
  useFonts();
  return (
    <AbsoluteFill style={{ background: theme.colors.cream }}>
      <Sequence from={SCENES.hook.from} durationInFrames={SCENES.hook.dur}><Hook /></Sequence>
      <Sequence from={SCENES.whatIs.from} durationInFrames={SCENES.whatIs.dur}><WhatIs /></Sequence>
      <Sequence from={SCENES.step1.from} durationInFrames={SCENES.step1.dur + SCENES.step2.dur + SCENES.step3.dur}><Steps /></Sequence>
      <Sequence from={SCENES.benefitsTitle.from} durationInFrames={SCENES.benefitsTitle.dur}><BenefitsTitle /></Sequence>
      <Sequence from={SCENES.b1.from} durationInFrames={SCENES.b1.dur}><Benefit1 /></Sequence>
      <Sequence from={SCENES.b2.from} durationInFrames={SCENES.b2.dur}><Benefit2 /></Sequence>
      <Sequence from={SCENES.b3.from} durationInFrames={SCENES.b3.dur}><Benefit3 /></Sequence>
      <Sequence from={SCENES.b4.from} durationInFrames={SCENES.b4.dur}><Benefit4 /></Sequence>
      <Sequence from={SCENES.closing.from} durationInFrames={SCENES.closing.dur}><Closing /></Sequence>

      {/* capas 4 y 5: grade, grano y viñeta por encima de todo */}
      <Grade />
      <Grain />
      <Vignette />

      <Audio src={staticFile("audio/music.wav")} volume={0.42} />
      {SFX.map(([at, name, vol], i) => (
        <Sequence key={i} from={Math.max(0, at)} durationInFrames={60} layout="none">
          <Audio src={staticFile(`audio/${name}.wav`)} volume={vol} />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};
