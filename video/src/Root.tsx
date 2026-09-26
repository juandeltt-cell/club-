import React from "react";
import { Composition } from "remotion";
import { ReelBrag } from "./ReelBrag";
import { FPS, TOTAL } from "./brag/timeline";

export const RemotionRoot: React.FC = () => (
  <>
    <Composition id="MejoresAmigosReel" component={ReelBrag} durationInFrames={TOTAL} fps={FPS} width={1080} height={1920} />
  </>
);
