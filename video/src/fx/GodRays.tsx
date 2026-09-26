import React, { useLayoutEffect, useRef } from "react";
import { useCurrentFrame, useVideoConfig } from "remotion";

// "God Rays" — shader de rayos de luz volumétricos.
// Tomado de 21st.dev (componente de paper-design, generado con su Shader Builder),
// adaptado de Paper Shaders (https://shaders.paper.design/god-rays), licencia Apache-2.0.
// Cambios: el tiempo sale del número de cuadro (render determinístico), paleta de la
// marca, sin interacción con el cursor, y control de origen/intensidad por props.

const VERT = `attribute vec2 a_position;
void main() { gl_Position = vec4(a_position, 0.0, 1.0); }`;

const FRAG = `precision highp float;
uniform vec3 u_colors[4];
uniform vec2 u_resolution;
uniform float u_time;
uniform float u_intensity;
uniform float u_bloom;
uniform vec2 u_origin;
uniform float u_scale;
uniform float u_seed;

float hash21(vec2 p) {
  p = fract(p * vec2(234.34, 435.345));
  p += dot(p, p + 34.23);
  return fract(p.x * p.y);
}
float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(mix(hash21(i), hash21(i + vec2(1.0, 0.0)), u.x),
             mix(hash21(i + vec2(0.0, 1.0)), hash21(i + vec2(1.0, 1.0)), u.x), u.y);
}
float fbm(vec2 p) {
  float v = 0.0;
  float a = 0.5;
  for (int i = 0; i < 5; i++) {
    v += a * noise(p);
    p = p * 2.03 + vec2(17.0, 9.2);
    a *= 0.5;
  }
  return v;
}
vec3 palette(float x) {
  float f = clamp(x, 0.0, 1.0) * 3.0;
  vec3 col = u_colors[0];
  col = mix(col, u_colors[1], smoothstep(0.0, 1.0, clamp(f, 0.0, 1.0)));
  col = mix(col, u_colors[2], smoothstep(0.0, 1.0, clamp(f - 1.0, 0.0, 1.0)));
  col = mix(col, u_colors[3], smoothstep(0.0, 1.0, clamp(f - 2.0, 0.0, 1.0)));
  return col;
}
void main() {
  vec2 p = (gl_FragCoord.xy - 0.5 * u_resolution.xy) / min(u_resolution.x, u_resolution.y);
  p *= u_scale;
  vec2 q = p - u_origin;
  float angle = atan(q.y, q.x);
  float radius = length(q);
  float density = 5.0 + u_intensity * 18.0;
  float n = fbm(vec2(angle * density * 0.16 + u_seed, radius * 1.7 - u_time * 0.08));
  float rays = pow(max(0.0, sin(angle * density + n * 5.0 + u_time * 0.16)), 5.0);
  rays *= exp(-radius * 1.15) * (1.0 - smoothstep(0.05, 1.1, radius));
  float bloom = exp(-radius * (9.0 - u_bloom * 6.0));
  float v = clamp(rays * (0.8 + u_intensity) + bloom * (0.25 + u_bloom), 0.0, 1.0);
  gl_FragColor = vec4(palette(v), 1.0);
}`;

const hex = (h: string) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16) / 255);

/**
 * Rayos de luz de fondo. `origin` en coordenadas del shader (0,0 = centro; y+ = arriba).
 * Se dibuja a media resolución y se escala: la luz es suave, no necesita más.
 */
export const GodRays: React.FC<{
  colors?: [string, string, string, string]; origin?: [number, number]; intensity?: number; bloom?: number; scale?: number; seed?: number; speed?: number; opacity?: number;
}> = ({ colors = ["#011A15", "#034A3D", "#05AB87", "#FFD58A"], origin = [0, 0.95], intensity = 0.35, bloom = 0.3, scale = 1.25, seed = 1, speed = 0.6, opacity = 1 }) => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();
  const ref = useRef<HTMLCanvasElement>(null);
  const glRef = useRef<{ gl: WebGLRenderingContext; u: Record<string, WebGLUniformLocation | null> } | null>(null);
  const W = Math.round(width / 2), H = Math.round(height / 2);

  useLayoutEffect(() => {
    const canvas = ref.current!;
    if (!glRef.current) {
      const gl = canvas.getContext("webgl", { antialias: false, preserveDrawingBuffer: true })!;
      const sh = (type: number, src: string) => { const s = gl.createShader(type)!; gl.shaderSource(s, src); gl.compileShader(s); return s; };
      const prog = gl.createProgram()!;
      gl.attachShader(prog, sh(gl.VERTEX_SHADER, VERT));
      gl.attachShader(prog, sh(gl.FRAGMENT_SHADER, FRAG));
      gl.linkProgram(prog);
      gl.useProgram(prog);
      const buf = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, buf);
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
      const loc = gl.getAttribLocation(prog, "a_position");
      gl.enableVertexAttribArray(loc);
      gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
      const names = ["u_colors", "u_resolution", "u_time", "u_intensity", "u_bloom", "u_origin", "u_scale", "u_seed"];
      glRef.current = { gl, u: Object.fromEntries(names.map((n) => [n, gl.getUniformLocation(prog, n)])) };
    }
    const { gl, u } = glRef.current;
    gl.viewport(0, 0, W, H);
    gl.uniform3fv(u.u_colors, new Float32Array(colors.flatMap(hex)));
    gl.uniform2f(u.u_resolution, W, H);
    gl.uniform1f(u.u_time, (frame / fps) * speed);
    gl.uniform1f(u.u_intensity, intensity);
    gl.uniform1f(u.u_bloom, bloom);
    gl.uniform2f(u.u_origin, origin[0], origin[1]);
    gl.uniform1f(u.u_scale, scale);
    gl.uniform1f(u.u_seed, seed);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
  }, [frame, fps, speed, intensity, bloom, origin, scale, seed, colors, W, H]);

  return <canvas ref={ref} width={W} height={H} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", opacity }} />;
};
