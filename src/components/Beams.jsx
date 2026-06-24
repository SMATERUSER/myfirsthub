/* eslint-disable react/no-unknown-property */
import { forwardRef, useImperativeHandle, useEffect, useRef, useMemo } from 'react';
import * as THREE from 'three';
import { Canvas, useFrame } from '@react-three/fiber';
import { PerspectiveCamera } from '@react-three/drei';
import { degToRad } from 'three/src/math/MathUtils.js';
import './Beams.css';

var noise = '\nfloat random (in vec2 st) { return fract(sin(dot(st.xy, vec2(12.9898,78.233)))*43758.5453123); }\nfloat noise (in vec2 st) { vec2 i = floor(st); vec2 f = fract(st); float a = random(i); float b = random(i + vec2(1.0, 0.0)); float c = random(i + vec2(0.0, 1.0)); float d = random(i + vec2(1.0, 1.0)); vec2 u = f * f * (3.0 - 2.0 * f); return mix(a, b, u.x) + (c - a)* u.y * (1.0 - u.x) + (d - b) * u.x * u.y; }\nvec4 permute(vec4 x){return mod(((x*34.0)+1.0)*x, 289.0);}\nvec4 taylorInvSqrt(vec4 r){return 1.79284291400159 - 0.85373472095314 * r;}\nvec3 fade(vec3 t) {return t*t*t*(t*(t*6.0-15.0)+10.0);}\nfloat cnoise(vec3 P){ vec3 Pi0 = floor(P); vec3 Pi1 = Pi0 + vec3(1.0); Pi0 = mod(Pi0, 289.0); Pi1 = mod(Pi1, 289.0); vec3 Pf0 = fract(P); vec3 Pf1 = Pf0 - vec3(1.0); vec4 ix = vec4(Pi0.x, Pi1.x, Pi0.x, Pi1.x); vec4 iy = vec4(Pi0.yy, Pi1.yy); vec4 iz0 = Pi0.zzzz; vec4 iz1 = Pi1.zzzz; vec4 ixy = permute(permute(ix) + iy); vec4 ixy0 = permute(ixy + iz0); vec4 ixy1 = permute(ixy + iz1); vec4 gx0 = ixy0 / 7.0; vec4 gy0 = fract(floor(gx0) / 7.0) - 0.5; gx0 = fract(gx0); vec4 gz0 = vec4(0.5) - abs(gx0) - abs(gy0); vec4 sz0 = step(gz0, vec4(0.0)); gx0 -= sz0 * (step(0.0, gx0) - 0.5); gy0 -= sz0 * (step(0.0, gy0) - 0.5); vec4 gx1 = ixy1 / 7.0; vec4 gy1 = fract(floor(gx1) / 7.0) - 0.5; gx1 = fract(gx1); vec4 gz1 = vec4(0.5) - abs(gx1) - abs(gy1); vec4 sz1 = step(gz1, vec4(0.0)); gx1 -= sz1 * (step(0.0, gx1) - 0.5); gy1 -= sz1 * (step(0.0, gy1) - 0.5); vec3 g000 = vec3(gx0.x,gy0.x,gz0.x); vec3 g100 = vec3(gx0.y,gy0.y,gz0.y); vec3 g010 = vec3(gx0.z,gy0.z,gz0.z); vec3 g110 = vec3(gx0.w,gy0.w,gz0.w); vec3 g001 = vec3(gx1.x,gy1.x,gz1.x); vec3 g101 = vec3(gx1.y,gy1.y,gz1.y); vec3 g011 = vec3(gx1.z,gy1.z,gz1.z); vec3 g111 = vec3(gx1.w,gy1.w,gz1.w); vec4 norm0 = taylorInvSqrt(vec4(dot(g000,g000),dot(g010,g010),dot(g100,g100),dot(g110,g110))); g000 *= norm0.x; g010 *= norm0.y; g100 *= norm0.z; g110 *= norm0.w; vec4 norm1 = taylorInvSqrt(vec4(dot(g001,g001),dot(g011,g011),dot(g101,g101),dot(g111,g111))); g001 *= norm1.x; g011 *= norm1.y; g101 *= norm1.z; g111 *= norm1.w; float n000 = dot(g000, Pf0); float n100 = dot(g100, vec3(Pf1.x,Pf0.yz)); float n010 = dot(g010, vec3(Pf0.x,Pf1.y,Pf0.z)); float n110 = dot(g110, vec3(Pf1.xy,Pf0.z)); float n001 = dot(g001, vec3(Pf0.xy,Pf1.z)); float n101 = dot(g101, vec3(Pf1.x,Pf0.y,Pf1.z)); float n011 = dot(g011, vec3(Pf0.x,Pf1.yz)); float n111 = dot(g111, Pf1); vec3 fade_xyz = fade(Pf0); vec4 n_z = mix(vec4(n000,n100,n010,n110),vec4(n001,n101,n011,n111),fade_xyz.z); vec2 n_yz = mix(n_z.xy,n_z.zw,fade_xyz.y); float n_xyz = mix(n_yz.x,n_yz.y,fade_xyz.x); return 2.2 * n_xyz; }';

function extendMaterial(BaseMaterial, cfg) {
  var physical = THREE.ShaderLib.physical;
  var baseVert = physical.vertexShader;
  var baseFrag = physical.fragmentShader;
  var baseUniforms = physical.uniforms;
  var uniforms = THREE.UniformsUtils.clone(baseUniforms);
  var defaults = new BaseMaterial(cfg.material || {});
  if (defaults.color) uniforms.diffuse.value = defaults.color;
  if ('roughness' in defaults) uniforms.roughness.value = defaults.roughness;
  if ('metalness' in defaults) uniforms.metalness.value = defaults.metalness;
  Object.entries(cfg.uniforms || {}).forEach(function (entry) { var key = entry[0]; var u = entry[1]; uniforms[key] = (u !== null && typeof u === 'object' && 'value' in u) ? u : { value: u }; });
  var vert = cfg.header + '\n' + (cfg.vertexHeader || '') + '\n' + baseVert;
  var frag = cfg.header + '\n' + (cfg.fragmentHeader || '') + '\n' + baseFrag;
  for (var inc in cfg.vertex || {}) { vert = vert.replace(inc, inc + '\n' + cfg.vertex[inc]); }
  for (var inc2 in cfg.fragment || {}) { frag = frag.replace(inc2, inc2 + '\n' + cfg.fragment[inc2]); }
  return new THREE.ShaderMaterial({ uniforms: uniforms, vertexShader: vert, fragmentShader: frag, lights: true, fog: !!cfg.material?.fog });
}

function hexToRGB(hex) { var c = hex.replace('#', ''); return [parseInt(c.substring(0,2),16)/255, parseInt(c.substring(2,4),16)/255, parseInt(c.substring(4,6),16)/255]; }

function MergedPlanes({ material, width, count, height }) {
  var mesh = useRef(null);
  var geometry = useMemo(function () {
    var n = count; var w = width; var h = height; var spacing = 0; var segs = 100;
    var numVerts = n * (segs + 1) * 2; var numFaces = n * segs * 2;
    var pos = new Float32Array(numVerts * 3); var idx = new Uint32Array(numFaces * 3); var uvs = new Float32Array(numVerts * 2);
    var vo = 0; var io = 0; var uo = 0; var tw = n * w + (n - 1) * spacing; var xb = -tw / 2;
    for (var i = 0; i < n; i++) {
      var xo = xb + i * (w + spacing); var ux = Math.random() * 300; var uy = Math.random() * 300;
      for (var j = 0; j <= segs; j++) {
        var y = h * (j / segs - 0.5);
        pos.set([xo, y, 0, xo + w, y, 0], vo * 3);
        uvs.set([ux, j/segs + uy, ux + 1, j/segs + uy], uo);
        if (j < segs) { var a = vo, b = vo + 1, c = vo + 2, d = vo + 3; idx.set([a, b, c, c, b, d], io); io += 6; }
        vo += 2; uo += 4;
      }
    }
    var g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    g.setAttribute('uv', new THREE.BufferAttribute(uvs, 2));
    g.setIndex(new THREE.BufferAttribute(idx, 1));
    g.computeVertexNormals(); return g;
  }, [count, width, height]);
  useFrame(function (_, delta) { if (mesh.current && mesh.current.material.uniforms) { mesh.current.material.uniforms.time.value += 0.1 * delta; } });
  return <mesh ref={mesh} geometry={geometry} material={material} />;
}

export default function Beams({ beamWidth = 2, beamHeight = 15, beamNumber = 12, lightColor = '#ffffff', speed = 2, noiseIntensity = 1.75, scale = 0.2, rotation = 0 }) {
  var beamMat = useMemo(function () {
    return extendMaterial(THREE.MeshStandardMaterial, {
      header: 'varying vec3 vEye; varying float vNoise; varying vec2 vUv; varying vec3 vPosition; uniform float time; uniform float uSpeed; uniform float uNoiseIntensity; uniform float uScale; ' + noise,
      vertexHeader: 'float getPos(vec3 pos) { vec3 noisePos = vec3(pos.x * 0., pos.y - uv.y, pos.z + time * uSpeed * 3.) * uScale; return cnoise(noisePos); } vec3 getCurrentPos(vec3 pos) { vec3 newpos = pos; newpos.z += getPos(pos); return newpos; } vec3 getNormal(vec3 pos) { vec3 curpos = getCurrentPos(pos); vec3 nextposX = getCurrentPos(pos + vec3(0.01, 0.0, 0.0)); vec3 nextposZ = getCurrentPos(pos + vec3(0.0, -0.01, 0.0)); vec3 tangentX = normalize(nextposX - curpos); vec3 tangentZ = normalize(nextposZ - curpos); return normalize(cross(tangentZ, tangentX)); }',
      vertex: { '#include <begin_vertex>': 'transformed.z += getPos(transformed.xyz);', '#include <beginnormal_vertex>': 'objectNormal = getNormal(position.xyz);' },
      fragment: { '#include <dithering_fragment>': 'float randomNoise = noise(gl_FragCoord.xy); gl_FragColor.rgb -= randomNoise / 15. * uNoiseIntensity;' },
      material: { fog: true },
      uniforms: { diffuse: new THREE.Color(...hexToRGB('#000000')), time: { shared: true, value: 0 }, roughness: 0.3, metalness: 0.3, uSpeed: { shared: true, value: speed }, envMapIntensity: 10, uNoiseIntensity: noiseIntensity, uScale: scale }
    });
  }, [speed, noiseIntensity, scale]);

  return <div className="beams-wrapper">
    <Canvas dpr={[1, 2]} frameloop="always" className="beams-container">
      <group rotation={[0, 0, degToRad(rotation)]}>
        <MergedPlanes material={beamMat} width={beamWidth} count={beamNumber} height={beamHeight} />
      </group>
      <ambientLight intensity={1} />
      <color attach="background" args={['#000000']} />
      <PerspectiveCamera makeDefault position={[0, 0, 20]} fov={30} />
    </Canvas>
  </div>;
}