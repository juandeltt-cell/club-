import React from "react";
import Peep from "react-peeps";
import { T } from "../theme";

// Encuadre de cada tipo de pose de Open Peeps (medido sobre la librería).
const VIEWBOX = {
  bust: { x: "0", y: "0", width: "850", height: "1200" },
  sitting: { x: "-260", y: "0", width: "1800", height: "2350" },
  standing: { x: "-80", y: "0", width: "1450", height: "2780" },
} as const;

export type Pose = keyof typeof VIEWBOX;

/** Personaje ilustrado (Open Peeps, CC0) con el trazo verde de la marca. */
export const Character: React.FC<{
  pose?: Pose;
  body: string;
  hair: string;
  face: string;
  facialHair?: string;
  accessory?: string;
  width: number;
  fill?: string;
  flip?: boolean;
  style?: React.CSSProperties;
}> = ({ pose = "bust", body, hair, face, facialHair, accessory, width, fill = T.white, flip, style }) => {
  const vb = VIEWBOX[pose];
  const h = (width * Number(vb.height)) / Number(vb.width);
  return (
    <div style={{ width, height: h, transform: flip ? "scaleX(-1)" : undefined, ...style }}>
      <Peep
        style={{ width, height: h, display: "block" }}
        body={body as never}
        hair={hair as never}
        face={face as never}
        facialHair={facialHair as never}
        accessory={accessory as never}
        strokeColor={T.ink}
        backgroundColor={fill}
        viewBox={vb}
      />
    </div>
  );
};
