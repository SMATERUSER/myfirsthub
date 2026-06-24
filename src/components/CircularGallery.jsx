import { Camera, Mesh, Plane, Program, Renderer, Texture, Transform } from 'ogl';
import { useEffect, useRef, useCallback } from 'react';
import './CircularGallery.css';

function debounce(func, wait) {
  let timeout;
  return function (...args) { clearTimeout(timeout); timeout = setTimeout(() => func.apply(this, args), wait); };
}

function lerp(p1, p2, t) { return p1 + (p2 - p1) * t; }

function autoBind(instance) {
  const proto = Object.getPrototypeOf(instance);
  Object.getOwnPropertyNames(proto).forEach(key => {
    if (key !== 'constructor' && typeof instance[key] === 'function') instance[key] = instance[key].bind(instance);
  });
}

function getFontSize(font) {
  const match = font.match(/(\d+)px/); return match ? parseInt(match[1], 10) : 30;
}

function createTextTexture(gl, text, font, color) {
  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d');
  context.font = font;
  const metrics = context.measureText(text);
  const textWidth = Math.ceil(metrics.width);
  const textHeight = Math.ceil(getFontSize(font) * 1.2);
  canvas.width = textWidth + 20;
  canvas.height = textHeight + 20;
  context.font = font;
  context.fillStyle = color;
  context.textBaseline = 'middle';
  context.textAlign = 'center';
  context.fillText(text, canvas.width / 2, canvas.height / 2);
  const texture = new Texture(gl, { image: canvas, premultiplyAlpha: false });
  return texture;
}

function createCardTexture(gl, image, borderRadius) {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  const img = new Image();
  img.crossOrigin = 'anonymous';
  return new Promise((resolve) => {
    img.onload = () => {
      const aspect = img.width / img.height;
      const w = 600; const h = w / aspect;
      canvas.width = w; canvas.height = h;
      if (borderRadius > 0) {
        const r = Math.min(w, h) * borderRadius;
        ctx.beginPath(); ctx.moveTo(r, 0);
        ctx.lineTo(w - r, 0); ctx.quadraticCurveTo(w, 0, w, r);
        ctx.lineTo(w, h - r); ctx.quadraticCurveTo(w, h, w - r, h);
        ctx.lineTo(r, h); ctx.quadraticCurveTo(0, h, 0, h - r);
        ctx.lineTo(0, r); ctx.quadraticCurveTo(0, 0, r, 0); ctx.closePath();
        ctx.clip();
      }
      ctx.drawImage(img, 0, 0, w, h);
      const texture = new Texture(gl, { image: canvas, premultiplyAlpha: false });
      resolve(texture);
    };
    img.onerror = () => {
      ctx.fillStyle = '#333'; ctx.fillRect(0, 0, canvas.width, canvas.height);
      const texture = new Texture(gl, { image: canvas, premultiplyAlpha: false });
      resolve(texture);
    };
    img.src = image;
  });
}

export default function CircularGallery({
  items = [],
  onItemClick,
  bend = 3,
  textColor = '#ffffff',
  borderRadius = 0.05,
  font = 'bold 24px Inter, sans-serif',
  scrollSpeed = 2,
  scrollEase = 0.05
}) {
  const containerRef = useRef(null);
  const galleryRef = useRef(null);
  const initialYRef = useRef(0);
  const targetYRef = useRef(0);
  const currentYRef = useRef(0);
  const textureCache = useRef({});

  const handleWheel = useCallback((e) => {
    targetYRef.current += e.deltaY * scrollSpeed * 0.01;
  }, [scrollSpeed]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container || items.length === 0) return;

    const rect = container.getBoundingClientRect();
    const w = rect.width;
    const h = rect.height;

    const renderer = new Renderer({ alpha: true });
    const gl = renderer.gl;
    gl.canvas.style.position = 'absolute';
    gl.canvas.style.top = '0';
    gl.canvas.style.left = '0';
    gl.canvas.style.width = '100%';
    gl.canvas.style.height = '100%';
    gl.canvas.style.pointerEvents = 'none';
    container.appendChild(gl.canvas);

    const camera = new Camera(gl, { fov: 40 });
    camera.position.set(0, 0, 4);
    camera.lookAt([0, 0, 0]);

    const scene = new Transform();

    const cardW = 2.2;
    const cardH = cardW * 1.4;
    const spacing = 3.2;
    const numItems = items.length;

    const meshes = [];

    const initGallery = async () => {
      for (let i = 0; i < numItems; i++) {
        const texture = await createCardTexture(gl, items[i].image, borderRadius);
        const program = new Program(gl, {
          vertex: 'attribute vec2 uv;attribute vec2 position;varying vec2 vUv;void main(){vUv=uv;gl_Position=vec4(position,0,1);}',
          fragment: 'precision highp float;uniform sampler2D uTexture;varying vec2 vUv;void main(){gl_FragColor=texture2D(uTexture,vUv);}',
          uniforms: { uTexture: { value: texture } }
        });
        const plane = new Plane(gl, { width: cardW, height: cardH });
        const mesh = new Mesh(gl, { geometry: plane, program });
        mesh.position.set(0, 0, 0);
        mesh.setParent(scene);

        const labelTexture = createTextTexture(gl, items[i].text, font, textColor);
        const labelProgram = new Program(gl, {
          vertex: 'attribute vec2 uv;attribute vec2 position;varying vec2 vUv;void main(){vUv=uv;gl_Position=vec4(position,0,1);}',
          fragment: 'precision highp float;uniform sampler2D uTexture;varying vec2 vUv;void main(){gl_FragColor=texture2D(uTexture,vUv);}',
          uniforms: { uTexture: { value: labelTexture } }
        });
        const labelWH = cardW * 0.5;
        const labelPlane = new Plane(gl, { width: labelWH, height: labelWH * 0.25 });
        const labelMesh = new Mesh(gl, { geometry: labelPlane, program: labelProgram });
        labelMesh.position.set(0, -cardH / 2 - 0.25, 0);
        labelMesh.setParent(mesh);

        meshes.push(mesh);
      }
    };

    initGallery();

    const resize = () => {
      const r = container.getBoundingClientRect();
      renderer.setSize(r.width, r.height);
      camera.perspective({ aspect: r.width / r.height });
    };
    window.addEventListener('resize', resize);

    gl.canvas.addEventListener('wheel', handleWheel, { passive: true });

    let lastTime = 0;
    const animate = (time) => {
      const dt = Math.min(time - lastTime, 50) / 1000;
      lastTime = time;
      currentYRef.current = lerp(currentYRef.current, targetYRef.current, Math.min(1, dt / scrollEase));

      const totalWidth = numItems * spacing;
      for (let i = 0; i < numItems; i++) {
        const mesh = meshes[i];
        if (!mesh) continue;
        const offset = (i - numItems / 2) * spacing + currentYRef.current;
        const x = Math.sin(offset / totalWidth * Math.PI * 2) * bend;
        const z = Math.cos(offset / totalWidth * Math.PI * 2) * 3 - 3;
        mesh.position.set(x, 0, z);
        mesh.scale.set(1, 1, 1);
        mesh.rotation.y = -x * 0.3;
      }

      renderer.render({ scene, camera });
      requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('resize', resize);
      gl.canvas.removeEventListener('wheel', handleWheel);
      container.removeChild(gl.canvas);
    };
  }, [items, bend, textColor, borderRadius, font, scrollSpeed, scrollEase, handleWheel]);

  return <div ref={containerRef} className="circular-gallery" />;
}