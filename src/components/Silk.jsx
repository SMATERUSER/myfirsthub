import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { forwardRef, useRef, useMemo, useLayoutEffect } from 'react';
import { Color } from 'three';

function hexToRGB(h) { h = h.replace('#',''); return [parseInt(h.slice(0,2),16)/255, parseInt(h.slice(2,4),16)/255, parseInt(h.slice(4,6),16)/255]; }

var vs = 'varying vec2 vUv; varying vec3 vPosition; void main() { vPosition = position; vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }';
var fs = 'varying vec2 vUv; varying vec3 vPosition; uniform float uTime; uniform vec3 uColor; uniform float uSpeed; uniform float uScale; uniform float uRotation; uniform float uNoiseIntensity; const float e = 2.71828182845904523536; float noise(vec2 texCoord) { float G = e; vec2 r = (G * sin(G * texCoord)); return fract(r.x * r.y * (1.0 + texCoord.x)); } vec2 rotateUvs(vec2 uv, float angle) { float c = cos(angle); float s = sin(angle); mat2 rot = mat2(c, -s, s, c); return rot * uv; } void main() { float rnd = noise(gl_FragCoord.xy); vec2 uv = rotateUvs(vUv * uScale, uRotation); vec2 tex = uv * uScale; float tOffset = uSpeed * uTime; tex.y += 0.03 * sin(8.0 * tex.x - tOffset); float pattern = 0.6 + 0.4 * sin(5.0 * (tex.x + tex.y + cos(3.0 * tex.x + 5.0 * tex.y) + 0.02 * tOffset) + sin(20.0 * (tex.x + tex.y - 0.1 * tOffset))); vec4 col = vec4(uColor, 1.0) * vec4(pattern) - rnd / 15.0 * uNoiseIntensity; col.a = 1.0; gl_FragColor = col; }';

var SilkPlane = forwardRef(function SilkPlane({ uniforms }, ref) {
  var vp = useThree().viewport;
  useLayoutEffect(function () { if (ref.current) ref.current.scale.set(vp.width, vp.height, 1); }, [ref, vp]);
  useFrame(function (_, d) { if (ref.current && ref.current.material) ref.current.material.uniforms.uTime.value += 0.1 * d; });
  return <mesh ref={ref}><planeGeometry args={[1, 1, 1, 1]} /><shaderMaterial uniforms={uniforms} vertexShader={vs} fragmentShader={fs} /></mesh>;
});
SilkPlane.displayName = 'SilkPlane';

export default function Silk(p) {
  var meshRef = useRef();
  var uniforms = useMemo(function () { return { uSpeed: { value: p.speed || 5 }, uScale: { value: p.scale || 1 }, uNoiseIntensity: { value: p.noiseIntensity || 1.5 }, uColor: { value: new Color(...hexToRGB(p.color || '#414144')) }, uRotation: { value: p.rotation || 0 }, uTime: { value: 0 } }; }, [p.speed, p.scale, p.noiseIntensity, p.color, p.rotation]);
  return <Canvas dpr={[1, 2]} frameloop="always" style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', zIndex: 0, pointerEvents: 'none', overflow: 'hidden', display: 'block' }}>
    <SilkPlane ref={meshRef} uniforms={uniforms} />
  </Canvas>;
}