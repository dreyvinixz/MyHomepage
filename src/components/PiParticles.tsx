import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { observeAnimation } from '../lib/observeAnimation';

// Particle rendering adapted from Maxime Heckel's MIT-licensed blog; see REFERENCE-LICENSE.txt.
export function PiParticles() {
  const host = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = host.current;
    if (!el) return;
    let renderer: THREE.WebGLRenderer;
    try { renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true }); } catch { return; }
    renderer.setPixelRatio(1);
    el.prepend(renderer.domElement);
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, 1, .1, 100);
    camera.position.z = 4;
    const canvas = document.createElement('canvas'); canvas.width = 512; canvas.height = 512;
    const ctx = canvas.getContext('2d');
    if (!ctx) { renderer.dispose(); renderer.domElement.remove(); return; }
    ctx.fillStyle = '#fff'; ctx.font = 'bold 440px Georgia, serif'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText('π', 256, 235);
    const pixels = ctx.getImageData(0, 0, 512, 512).data;
    const candidates: number[] = [];
    for (let y = 0; y < 512; y += 2) for (let x = 0; x < 512; x += 2) if (pixels[(y * 512 + x) * 4 + 3] > 100) candidates.push(x, y);
    const count = 24000; const positions = new Float32Array(count * 3); const seeds = new Float32Array(count); const origins = new Float32Array(count * 3);
    let seed = 1947; const random = () => { seed = seed * 16807 % 2147483647; return (seed - 1) / 2147483646; };
    for (let i = 0; i < count; i++) {
      const k = (Math.floor((i + random()) * (candidates.length / 2) / count) % (candidates.length / 2)) * 2;
      positions[i * 3] = (candidates[k] / 512 - .5) * 6.8 + (random() - .5) * .06;
      positions[i * 3 + 1] = (.5 - candidates[k + 1] / 512) * 6.8 + (random() - .5) * .06;
      positions[i * 3 + 2] = (random() - .5) * .8;
      seeds[i] = random();
      const angle = random() * Math.PI * 2;
      const radius = 2.6 + random() * 2.8;
      origins[i * 3] = Math.cos(angle) * radius;
      origins[i * 3 + 1] = Math.sin(angle) * radius;
      origins[i * 3 + 2] = (random() - .5) * 3;
    }
    const geometry = new THREE.BufferGeometry(); geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3)); geometry.setAttribute('aSeed', new THREE.BufferAttribute(seeds, 1)); geometry.setAttribute('aOrigin', new THREE.BufferAttribute(origins, 3));
    const material = new THREE.ShaderMaterial({
      uniforms: { uTime: { value: 0 }, uFormation: { value: 0 }, uDissolve: { value: 0 }, pointSize: { value: 3.5 } },
      vertexShader: `uniform float uTime; uniform float uFormation; uniform float uDissolve; uniform float pointSize; attribute float aSeed; attribute vec3 aOrigin; varying float vDistance; varying float vEdgeFade;
        void main() { float formed = smoothstep(aSeed * .35, .65 + aSeed * .35, uFormation); vec3 p = mix(aOrigin, position, formed); p += formed * .08 * vec3(sin(uTime*.6+aSeed*15.0+p.y*2.0), cos(uTime*.5+aSeed*11.0+p.x*2.0), sin(uTime*.4+aSeed*13.0)); p += uDissolve * vec3(aOrigin.x * .65, -1.8 - aSeed * 2.0, aOrigin.z); vec4 mv = modelViewMatrix * vec4(p,1.0); gl_Position = projectionMatrix * mv; vec2 screen = abs(gl_Position.xy / gl_Position.w); vEdgeFade = (1.0 - smoothstep(.72, .98, max(screen.x, screen.y))) * (1.0 - smoothstep(.35, 1.0, uDissolve)); vDistance = length(mv.xyz); gl_PointSize = pointSize * 3.0 / vDistance; }`,
      fragmentShader: `varying float vDistance; varying float vEdgeFade; void main() { vec2 cxy = 2.0 * gl_PointCoord - 1.0; float dist = length(cxy); if (dist > .8) discard; float intensity = dist * 1.8; gl_FragColor = vec4(vec3(1.0), (1.0 - clamp(vDistance, 0.0, .75) * intensity) * vEdgeFade); }`,
      transparent: true, blending: THREE.AdditiveBlending, depthWrite: false,
    });
    const points = new THREE.Points(geometry, material); points.rotation.z = -.04; scene.add(points);
    let shaderReady = false;
    const draw = () => { if (shaderReady) renderer.render(scene, camera); };
    const hero = el.closest<HTMLElement>('.hero');
    const enteredAtHero = (hero?.getBoundingClientRect().top ?? 0) > -window.innerHeight * .3;
    const motion = matchMedia('(prefers-reduced-motion: reduce)');
    const onScroll = () => {
      const top = hero?.getBoundingClientRect().top ?? 0;
      material.uniforms.uDissolve.value = motion.matches ? 0 : THREE.MathUtils.clamp(-top / (window.innerHeight * .75), 0, 1);
      if (el.getBoundingClientRect().bottom > 0 && el.getBoundingClientRect().top < innerHeight) draw();
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    motion.addEventListener('change', onScroll);
    onScroll();
    let stopAnimation: (() => void) | undefined;
    let disposed = false;
    const resize = () => { const w = el.clientWidth, h = el.clientHeight; if (!w || !h) return; renderer.setSize(w,h); camera.aspect = w / h; camera.position.z = w < 600 ? 5.5 : 3.2; camera.updateProjectionMatrix(); draw(); };
    const observer = new ResizeObserver(resize); observer.observe(el); resize();
    void renderer.compileAsync(scene, camera).then(() => {
      if (disposed) return;
      shaderReady = true;
      stopAnimation = observeAnimation(el, elapsed => {
        const reduced = !Number.isFinite(elapsed);
        const seconds = reduced ? 0 : elapsed / 1000;
        material.uniforms.uTime.value = seconds;
        material.uniforms.uFormation.value = reduced || !enteredAtHero ? 1 : Math.min(elapsed / 1800, 1);
        points.position.y = reduced ? 0 : Math.sin(seconds * .8) * .18 * material.uniforms.uFormation.value;
        draw();
      });
    }).catch(() => {
      if (disposed) return;
      shaderReady = true;
      material.uniforms.uFormation.value = 1;
      draw();
    });
    return () => { disposed = true; stopAnimation?.(); observer.disconnect(); window.removeEventListener('scroll', onScroll); motion.removeEventListener('change', onScroll); geometry.dispose(); material.dispose(); renderer.dispose(); renderer.domElement.remove(); };
  }, []);
  return <div ref={host} className="pi-particles" aria-hidden="true" />;
}
