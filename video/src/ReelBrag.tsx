import React from "react";
import { AbsoluteFill, Audio, Easing, interpolate, Sequence, staticFile, useCurrentFrame } from "remotion";
import * as Sc from "./brag/Scenes";
import { S } from "./brag/timeline";
import { AudioReactiveProvider } from "./components/AudioReactive";
import { Grain, Vignette } from "./components/Layers";
import { LightLeak } from "./components/Light";
import { Flash } from "./components/Wipes";
import { useFonts } from "./fonts";
import { Brand } from "./scenes/Closing";
import { LogoDrop } from "./scenes/Intro";
import { T } from "./theme";

// Cortes secos sobre el pulso, con un barrido de color de 6 cuadros (la escena nueva
// entra encima mientras la anterior sigue debajo). Fuera del barrido no hay movimiento de cámara.
const WIPE = 6;
type Dir = "up" | "left" | "none";

const Wipe: React.FC<{ dir: Dir; children: React.ReactNode }> = ({ dir, children }) => {
  const f = useCurrentFrame();
  if (dir === "none" || f >= WIPE) return <AbsoluteFill>{children}</AbsoluteFill>;
  const p = interpolate(f, [0, WIPE], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.bezier(0.16, 1, 0.3, 1) });
  const clip = dir === "up" ? `inset(${(1 - p) * 100}% 0 0 0)` : `inset(0 0 0 ${(1 - p) * 100}%)`;
  return <AbsoluteFill style={{ clipPath: clip }}>{children}</AbsoluteFill>;
};

const Scene: React.FC<{ s: { from: number; dur: number }; dir?: Dir; last?: boolean; children: React.ReactNode }> = ({ s, dir = "up", last, children }) => (
  <Sequence from={s.from} durationInFrames={s.dur + (last ? 0 : WIPE)} style={{ isolation: "isolate" }}>
    <Wipe dir={dir}>{children}</Wipe>
  </Sequence>
);

// Sonido: kit Kenney (CC0) en public/sfx + brillo propio en public/audio.
const KIT: Record<string, string> = {
  cut: "sfx/card-slide-1", cut2: "sfx/card-slide-2", tap: "sfx/click2", key: "sfx/click_005", ding: "sfx/impactBell_heavy_000",
  bell: "sfx/impactBell_heavy_003", hit: "sfx/impactSoft_heavy_003", soft: "sfx/impactSoft_medium_000", soft2: "sfx/impactSoft_medium_002",
  pop: "sfx/bong_001", chip: "sfx/chip-lay-1", card: "sfx/card-place-1", sel: "sfx/select_008", shimmer: "audio/shimmer",
};
type Fx = [number, string, number];
const cuts = [S.claim, S.who, S.scan, S.stars, S.prize, S.commerce, S.know, S.slowQ, S.slowA, S.aiQ, S.aiMsg, S.lock, S.ret, S.punch, S.closing];
const SFX: Fx[] = [
  [2, "soft", 0.3], [8, "soft2", 0.22],
  ...cuts.map((s, i): Fx => [s.from - 1, i % 2 ? "cut2" : "cut", 0.22]),
  ...cuts.map((s): Fx => [s.from + 6, "soft", 0.16]),
  [S.claim.from + 8, "pop", 0.26], [S.who.from + 4, "soft2", 0.26],
  [S.logo.from, "hit", 0.5], [S.logo.from + 1, "shimmer", 0.3], [S.logo.from + 12, "bell", 0.26],
  [S.scan.from + 22, "sel", 0.18], [S.scan.from + 66, "pop", 0.26], [S.scan.from + 70, "shimmer", 0.26], [S.scan.from + 80, "ding", 0.26],
  [S.stars.from + 8, "shimmer", 0.26], ...[0, 1, 2, 3, 4].map((i): Fx => [S.stars.from + 22 + i * 7, "chip", 0.2]),
  [S.prize.from + 12, "chip", 0.26], [S.prize.from + 24, "chip", 0.28], [S.prize.from + 26, "shimmer", 0.3], [S.prize.from + 48, "cut2", 0.2], [S.prize.from + 70, "ding", 0.3],
  [S.who.from + 12, "pop", 0.22], [S.who.from + 20, "sel", 0.16], [S.who.from + 25, "sel", 0.16], [S.who.from + 30, "sel", 0.16],
  [S.lock.from + 26, "pop", 0.3], [S.lock.from + 28, "shimmer", 0.24],
  [S.slowA.from + 26, "cut2", 0.18], [S.slowA.from + 52, "pop", 0.26],
  ...Array.from({ length: 14 }, (_, i): Fx => [S.aiMsg.from + 6 + i * 3, "key", 0.1]),
  [S.aiMsg.from + 50, "pop", 0.22], [S.aiMsg.from + 130, "tap", 0.45], [S.aiMsg.from + 136, "ding", 0.3],
  [S.punch.from, "hit", 0.32], [S.punch.from + 10, "hit", 0.28], [S.punch.from + 20, "hit", 0.3],
  [S.closing.from + 2, "shimmer", 0.28], [S.closing.from + 3, "bell", 0.24],
];

export const ReelBrag: React.FC = () => {
  useFonts();
  return (
    <AbsoluteFill style={{ background: T.ink }}>
      <AudioReactiveProvider src="music/song-reel.wav">
        <Scene s={S.q} dir="none"><Sc.HookQuestion /></Scene>
        <Scene s={S.claim}><Sc.HookClaim /></Scene>
        <Scene s={S.who} dir="left"><Sc.HookWho dur={S.who.dur} /></Scene>
        <Scene s={S.logo} dir="none"><LogoDrop /></Scene>
        <Scene s={S.scan}><Sc.StepScan /></Scene>
        <Scene s={S.stars} dir="left"><Sc.StepStars /></Scene>
        <Scene s={S.prize}><Sc.StepPrize /></Scene>
        <Scene s={S.commerce} dir="left"><Sc.Commerce /></Scene>
        <Scene s={S.know}><Sc.BenefitKnow /></Scene>
        <Scene s={S.slowQ} dir="left"><Sc.BenefitSlowQ /></Scene>
        <Scene s={S.slowA}><Sc.BenefitSlowA /></Scene>
        <Scene s={S.aiQ} dir="left"><Sc.BenefitAIQ /></Scene>
        <Scene s={S.aiMsg}><Sc.BenefitAIMsg /></Scene>
        <Scene s={S.lock} dir="left"><Sc.Delivered /></Scene>
        <Scene s={S.ret} dir="left"><Sc.BenefitReturn /></Scene>
        <Scene s={S.punch}><Sc.Punch /></Scene>
        <Scene s={S.closing} last><Brand /></Scene>

        <Flash at={S.logo.from} dur={12} />
        <LightLeak at={S.logo.from - 4} dur={46} />
        <LightLeak at={S.commerce.from} dur={40} strength={0.45} />
        <LightLeak at={S.punch.from} dur={40} dir={-1} strength={0.4} />
        <LightLeak at={S.closing.from - 2} dur={50} dir={-1} />
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
