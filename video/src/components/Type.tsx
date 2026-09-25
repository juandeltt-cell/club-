import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { T, theme } from "../theme";
import { ease, useIn, useOut, WordReveal } from "./Motion";

export const display = (size: number, color: string = T.ink, weight = 800): React.CSSProperties => ({
  fontFamily: theme.fonts.display,
  fontWeight: weight,
  fontSize: size,
  lineHeight: 1.02,
  letterSpacing: "-0.03em",
  color,
});

export const body = (size: number, color: string = T.inkSoft, weight = 500): React.CSSProperties => ({
  fontFamily: theme.fonts.body,
  fontWeight: weight,
  fontSize: size,
  lineHeight: 1.3,
  color,
});

/** Líneas de titular que entran escalonadas palabra por palabra. `accent` = palabras en menta. */
export const Lines: React.FC<{
  lines: string[];
  size: number;
  delay?: number;
  lineGap?: number;
  per?: number;
  color?: string;
  accent?: string[];
  accentColor?: string;
  exitAt?: number;
  align?: "left" | "center";
}> = ({ lines, size, delay = 0, lineGap = 5, per = 3, color = T.ink, accent = [], accentColor = T.mint, exitAt, align = "left" }) => {
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: align === "center" ? "center" : "flex-start", gap: size * 0.06 }}>
      {lines.map((line, li) => {
        const start = delay + li * lineGap;
        return (
          <WordReveal
            key={li}
            text={line}
            delay={start}
            per={per}
            exitAt={exitAt}
            style={{ ...display(size, color), justifyContent: align === "center" ? "center" : "flex-start" }}
            wordStyle={(_, w) => (accent.includes(w.replace(/[.,¿?¡!]/g, "")) ? { color: accentColor } : undefined)}
          />
        );
      })}
    </div>
  );
};

/** Encabezado de paso: número grande + etiqueta. */
export const StepHeader: React.FC<{ num: string; label: string[]; at?: number; exitAt?: number }> = ({ num, label, at = 0, exitAt }) => {
  const p = useIn(at, theme.spring.bouncy);
  const out = useOut(exitAt ?? 1e9, 8);
  return (
    <div style={{ display: "flex", alignItems: "flex-start", gap: 34 }}>
      <div
        style={{
          ...display(168, T.mint, 800),
          lineHeight: 0.86,
          opacity: p * (1 - out),
          transform: `translateY(${interpolate(p, [0, 1], [-70, 0]) - out * 40}px) rotateX(${interpolate(p, [0, 1], [70, 0])}deg)`,
          fontVariantNumeric: "tabular-nums",
        }}
      >
        {num}
      </div>
      <div style={{ paddingTop: 10 }}>
        <Lines lines={label} size={72} delay={at + 4} exitAt={exitAt} />
      </div>
    </div>
  );
};

/** Encabezado de beneficio: número en círculo + frase + bajada opcional. */
export const BenefitHeader: React.FC<{ num: number; lines: string[]; sub?: string; at?: number; exitAt?: number; accent?: string[]; size?: number }> = ({
  num, lines, sub, at = 0, exitAt, accent = [], size = 78,
}) => {
  const frame = useCurrentFrame();
  const p = useIn(at, theme.spring.bouncy);
  const out = useOut(exitAt ?? 1e9, 8);
  const subIn = ease(frame, [at + 14, at + 30], [0, 1]);
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 22 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 26 }}>
        <div
          style={{
            width: 104, height: 104, borderRadius: "50%", border: `6px solid ${T.mint}`, display: "grid", placeItems: "center",
            ...display(58, T.mint), opacity: p * (1 - out), transform: `scale(${interpolate(p, [0, 1], [0.4, 1])}) rotate(${interpolate(p, [0, 1], [-90, 0])}deg)`,
            flex: "none",
          }}
        >
          {num}
        </div>
        <Lines lines={lines} size={size} delay={at + 3} exitAt={exitAt} accent={accent} />
      </div>
      {sub && (
        <div style={{ ...body(40), opacity: subIn * (1 - out), transform: `translateY(${(1 - subIn) * 20}px)`, maxWidth: 900 }}>{sub}</div>
      )}
    </div>
  );
};
