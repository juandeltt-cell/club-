import React, { createContext, useContext } from "react";
import { useAudioData, visualizeAudio } from "@remotion/media-utils";
import { staticFile, useCurrentFrame, useVideoConfig } from "remotion";

// Reacción sutil a la música (idea de latent-spaces/brag): la energía de los graves
// de la canción, suavizada, empuja el brillo de lámparas, auroras y fondos.
// Nunca se aplica a texto, solo a luz y color.

const BassContext = createContext(0);

export const AudioReactiveProvider: React.FC<{ src: string; children: React.ReactNode }> = ({ src, children }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const audioData = useAudioData(staticFile(src));
  let bass = 0;
  if (audioData) {
    let sum = 0;
    const span = [-2, -1, 0, 1];
    for (const d of span) {
      const f = Math.max(0, frame + d);
      const bins = visualizeAudio({ fps, frame: f, audioData, numberOfSamples: 32 });
      sum += (bins[0] + bins[1] + bins[2]) / 3;
    }
    const v = sum / span.length;
    bass = Math.max(0, Math.min(1, (v - 0.08) / 0.45));
  }
  return <BassContext.Provider value={bass}>{children}</BassContext.Provider>;
};

/** Energía de graves 0–1 del cuadro actual del reel. */
export const useBass = () => useContext(BassContext);
