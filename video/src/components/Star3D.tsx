import React, { useEffect, useMemo } from "react";
import { ThreeCanvas } from "@remotion/three";
import { useThree } from "@react-three/fiber";
import * as THREE from "three";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";

/** Estrella de 5 puntas extruida, con bisel redondeado (la "estrellita" del sistema, en 3D real). */
const useStarGeometry = () =>
  useMemo(() => {
    const shape = new THREE.Shape();
    const R = 1, r = 0.5;
    for (let i = 0; i < 10; i++) {
      const a = Math.PI / 2 + (i * Math.PI) / 5;
      const rad = i % 2 === 0 ? R : r;
      const x = Math.cos(a) * rad, y = Math.sin(a) * rad;
      if (i === 0) shape.moveTo(x, y); else shape.lineTo(x, y);
    }
    shape.closePath();
    const g = new THREE.ExtrudeGeometry(shape, { depth: 0.08, bevelEnabled: true, bevelThickness: 0.26, bevelSize: 0.16, bevelSegments: 18, curveSegments: 8 });
    g.center();
    g.computeVertexNormals();
    return g;
  }, []);

/** Entorno de estudio para reflejos suaves. */
const Studio: React.FC = () => {
  const { gl, scene } = useThree();
  useEffect(() => {
    const pmrem = new THREE.PMREMGenerator(gl);
    const env = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
    scene.environment = env;
    scene.environmentIntensity = 0.55;
    return () => { env.dispose(); pmrem.dispose(); };
  }, [gl, scene]);
  return null;
};

const StarMesh: React.FC<{ rotY: number; rotX: number; scale: number; color: string }> = ({ rotY, rotX, scale, color }) => {
  const geo = useStarGeometry();
  return (
    <mesh geometry={geo} rotation={[rotX, rotY, 0]} scale={scale}>
      <meshPhysicalMaterial color={color} roughness={0.3} metalness={0.05} clearcoat={0.8} clearcoatRoughness={0.2} />
    </mesh>
  );
};

/**
 * Estrellita 3D que entra girando con resorte y queda rotando suave.
 * `turns` = vueltas completas en la entrada.
 */
export const Star3D: React.FC<{ size: number; at?: number; x?: number; y?: number; turns?: number; color?: string; style?: React.CSSProperties }> = ({
  size, at = 0, x, y, turns = 1, color = "#F0A020", style,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = spring({ frame: frame - at, fps, config: { damping: 14, stiffness: 90, mass: 1 } });
  if (frame < at) return null;
  const t = frame - at;
  const rotY = (1 - p) * Math.PI * 2 * turns + Math.sin(t / 28) * 0.45;
  const rotX = -0.18 + Math.sin(t / 36) * 0.08;
  return (
    <div style={{ position: x !== undefined ? "absolute" : "relative", left: x, top: y, width: size, height: size, pointerEvents: "none", filter: "drop-shadow(0 30px 30px rgba(2,49,42,0.25))", ...style }}>
      <ThreeCanvas width={size} height={size} camera={{ position: [0, 0, 4.2], fov: 38 }} gl={{ antialias: true, alpha: true }}>
        <Studio />
        <ambientLight intensity={0.2} />
        <directionalLight position={[3, 4, 5]} intensity={1.6} />
        <directionalLight position={[-4, -2, 2]} intensity={0.6} color="#ffe7b0" />
        <StarMesh rotY={rotY} rotX={rotX} scale={interpolate(p, [0, 1], [0.1, 1])} color={color} />
      </ThreeCanvas>
    </div>
  );
};
