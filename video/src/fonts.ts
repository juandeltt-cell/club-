import { useEffect, useState } from "react";
import { continueRender, delayRender, staticFile } from "remotion";
import { MONO } from "./brag/Kit";
import { theme } from "./theme";

const FONTS = [
  { family: theme.fonts.display, file: "fonts/bricolage-grotesque-latin-wght-normal.woff2", weight: "100 900" },
  { family: theme.fonts.display, file: "fonts/bricolage-grotesque-latin-ext-wght-normal.woff2", weight: "100 900" },
  { family: theme.fonts.body, file: "fonts/inter-latin-wght-normal.woff2", weight: "100 900" },
  { family: theme.fonts.body, file: "fonts/inter-latin-ext-wght-normal.woff2", weight: "100 900" },
  { family: MONO, file: "fonts/jetbrains-mono-latin-500-normal.woff2", weight: "500" },
  { family: MONO, file: "fonts/jetbrains-mono-latin-700-normal.woff2", weight: "700" },
];

/** Carga las tipografías propias antes de renderizar. */
export const useFonts = () => {
  const [handle] = useState(() => delayRender("Cargando tipografías"));
  useEffect(() => {
    Promise.all(
      FONTS.map(async ({ family, file, weight }) => {
        const face = new FontFace(family, `url(${staticFile(file)}) format("woff2")`, { weight });
        await face.load();
        (document.fonts as unknown as { add: (f: FontFace) => void }).add(face);
      }),
    ).then(() => continueRender(handle));
  }, [handle]);
};
