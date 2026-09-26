import React, { useEffect, useMemo } from "react";
import { ThreeCanvas } from "@remotion/three";
import { useThree } from "@react-three/fiber";
import * as THREE from "three";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";
import { Easing, interpolate, useCurrentFrame } from "remotion";

// Plato con campana plateada, en 3D real (three.js). La campana se levanta y
// debajo aparece la estrellita dorada del sistema.

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

const Studio: React.FC = () => {
  const { gl, scene } = useThree();
  useEffect(() => {
    const pmrem = new THREE.PMREMGenerator(gl);
    const env = pmrem.fromScene(new RoomEnvironment(), 0.03).texture;
    scene.environment = env;
    scene.environmentIntensity = 0.9;
    return () => { env.dispose(); pmrem.dispose(); };
  }, [gl, scene]);
  return null;
};

/** Perfil girado (torno) → geometría de revolución. */
const useLathe = (pts: [number, number][], segments = 96) =>
  useMemo(() => new THREE.LatheGeometry(pts.map(([x, y]) => new THREE.Vector2(x, y)), segments), [pts, segments]);

const PLATE: [number, number][] = [[0, 0], [1.05, 0], [1.25, 0.06], [1.6, 0.16], [1.72, 0.2], [1.74, 0.23], [1.62, 0.21], [1.2, 0.1], [0, 0.07]];
const DOME: [number, number][] = (() => {
  const p: [number, number][] = [];
  for (let i = 0; i <= 28; i++) {
    const a = (i / 28) * (Math.PI / 2);
    p.push([Math.cos(a) * 1.28, Math.sin(a) * 1.02]);
  }
  p.reverse();
  p.push([1.36, 0], [1.36, -0.05]);
  return p;
})();

const useStar = () =>
  useMemo(() => {
    const shape = new THREE.Shape();
    for (let i = 0; i < 10; i++) {
      const a = Math.PI / 2 + (i * Math.PI) / 5;
      const r = i % 2 === 0 ? 0.62 : 0.3;
      const x = Math.cos(a) * r, y = Math.sin(a) * r;
      if (i === 0) shape.moveTo(x, y); else shape.lineTo(x, y);
    }
    const g = new THREE.ExtrudeGeometry(shape, { depth: 0.05, bevelEnabled: true, bevelThickness: 0.16, bevelSize: 0.1, bevelSegments: 16 });
    g.center();
    return g;
  }, []);

const Dish: React.FC<{ lift: number; t: number; starIn: number }> = ({ lift, t, starIn }) => {
  const plate = useLathe(PLATE);
  const dome = useLathe(DOME);
  const star = useStar();
  return (
    <group rotation={[0.42, t * 0.25, 0]} position={[0, -0.55, 0]}>
      <mesh geometry={plate} receiveShadow>
        <meshPhysicalMaterial color="#EDE6DA" roughness={0.38} clearcoat={0.8} clearcoatRoughness={0.2} />
      </mesh>
      {/* la estrellita, parada sobre el plato */}
      <mesh geometry={star} castShadow position={[0, 0.72 + starIn * 0.08, 0]} rotation={[0, t * 1.2, 0]} scale={0.2 + 0.8 * starIn}>
        <meshPhysicalMaterial color="#F0A020" roughness={0.28} metalness={0.1} clearcoat={0.9} emissive="#6b3b00" emissiveIntensity={0.25 * starIn} />
      </mesh>
      {/* campana cromada que se levanta y se inclina */}
      <group position={[3.2 * lift, 0.08 + lift * 0.9, -0.3 * lift]} rotation={[0, 0, -lift * 0.9]}>
        <mesh geometry={dome} castShadow>
          <meshPhysicalMaterial color="#E9ECEF" metalness={1} roughness={0.12} side={THREE.DoubleSide} />
        </mesh>
        <mesh position={[0, 1.1, 0]}>
          <sphereGeometry args={[0.13, 32, 32]} />
          <meshPhysicalMaterial color="#DDE1E5" metalness={1} roughness={0.15} />
        </mesh>
        <mesh position={[0, 1.02, 0]}>
          <cylinderGeometry args={[0.05, 0.08, 0.1, 32]} />
          <meshPhysicalMaterial color="#DDE1E5" metalness={1} roughness={0.15} />
        </mesh>
      </group>
    </group>
  );
};

/** Escena 3D del plato. `liftAt`: cuadro en que se levanta la campana. */
export const Cloche3D: React.FC<{ width: number; height: number; liftAt: number; fov?: number }> = ({ width, height, liftAt, fov = 34 }) => {
  const f = useCurrentFrame();
  const lift = interpolate(f, [liftAt, liftAt + 22], [0, 1], { ...clamp, easing: Easing.bezier(0.65, 0, 0.35, 1) });
  const starIn = interpolate(f, [liftAt + 6, liftAt + 26], [0, 1], { ...clamp, easing: Easing.bezier(0.16, 1, 0.3, 1) });
  const t = f / 30;
  const camZ = interpolate(f, [0, 110], [7.4, 6.6], { ...clamp, easing: Easing.bezier(0.45, 0, 0.55, 1) });
  return (
    <ThreeCanvas width={width} height={height} shadows camera={{ position: [0, 0.6, camZ], fov: fov }} gl={{ antialias: true, alpha: true }}>
      <Studio />
      <ambientLight intensity={0.15} />
      <spotLight position={[0, 6, 2.5]} angle={0.5} penumbra={0.8} intensity={32} color="#FFE3B0" castShadow shadow-mapSize-width={2048} shadow-mapSize-height={2048} shadow-bias={-0.0004} />
      <directionalLight position={[-4, 2, 3]} intensity={0.8} color="#9FE8D3" />
      <directionalLight position={[4, 1, -3]} intensity={1.2} color="#FFD08A" />
      <Dish lift={lift} t={t} starIn={starIn} />
    </ThreeCanvas>
  );
};
