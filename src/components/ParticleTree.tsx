import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { useNearViewport } from '../lib/useNearViewport';
import { observeAnimation } from '../lib/observeAnimation';

/** Particle overlay sampled from the existing tree paths. */
export function ParticleTree() {
  const host = useRef<HTMLDivElement>(null);
  const ready = useNearViewport(host);
  useEffect(() => {
    if (!ready) return;
    const el = host.current; const tree = el?.parentElement;
    if (!el || !tree) return;
    const paths = Array.from(tree.querySelectorAll<SVGPathElement>('.tree-lines path'));
    if (!paths.length) return;
    let renderer: THREE.WebGLRenderer;
    try { renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true }); } catch { return; }
    renderer.setPixelRatio(Math.min(devicePixelRatio, 1.5)); el.appendChild(renderer.domElement);
    const lengths = paths.map(path => path.getTotalLength());
    const total = lengths.reduce((a,b) => a+b, 0);
    const count = 7500, positions = new Float32Array(count * 3), seeds = new Float32Array(count);
    let seed = 2873; const random = () => { seed = seed * 16807 % 2147483647; return (seed - 1) / 2147483646; };
    for (let i = 0; i < count; i++) {
      let distance = random() * total; let index = 0;
      while (index < paths.length - 1 && distance > lengths[index]) { distance -= lengths[index]; index++; }
      const point = paths[index].getPointAtLength(distance);
      const spread = (random() - .5) * (random() < .8 ? 5 : 14);
      positions[i * 3] = (point.x + spread) / 1000 * 2 - 1;
      positions[i * 3 + 1] = 1 - (point.y + (random() - .5) * 5) / 1100 * 2;
      seeds[i] = random();
    }
    const geometry = new THREE.BufferGeometry(); geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3)); geometry.setAttribute('aSeed', new THREE.BufferAttribute(seeds, 1));
    const material = new THREE.ShaderMaterial({ uniforms: { uTime: { value: 0 }, uBuild: { value: 0 }, uDpr: { value: Math.min(devicePixelRatio, 1.5) } }, vertexShader: `attribute float aSeed; uniform float uTime; uniform float uBuild; uniform float uDpr; varying float vAlpha; void main(){ float formed=smoothstep(aSeed*.3,.7+aSeed*.3,uBuild); vec3 p=mix(vec3((aSeed-.5)*.35,-1.05,0.),position,formed); p.x+=sin(uTime*.7+aSeed*42.0)*.0015; p.y+=cos(uTime*.6+aSeed*35.0)*.0015; gl_Position=vec4(p.xy,0.,1.); gl_PointSize=(.8+aSeed*1.5)*uDpr; vAlpha=(.35+.65*(.5+.5*sin(uTime*1.3+aSeed*40.))) * smoothstep(0.,.16,uBuild); }`, fragmentShader: `varying float vAlpha; void main(){ if(length(gl_PointCoord-.5)>.5) discard; gl_FragColor=vec4(vec3(.88,.94,1.),vAlpha); }`, transparent:true, blending:THREE.AdditiveBlending, depthWrite:false });
    const scene = new THREE.Scene(); scene.add(new THREE.Points(geometry,material));
    const camera = new THREE.OrthographicCamera(-1,1,1,-1,0,1);
    const draw = () => renderer.render(scene,camera);
    const motion = matchMedia('(prefers-reduced-motion: reduce)');
    const onScroll = () => { const top = el.getBoundingClientRect().top; const expertise = document.getElementById('expertise'); const start = (expertise?.getBoundingClientRect().bottom ?? 0) + scrollY - innerHeight * .55; const end = top + scrollY - innerHeight * .3; const progress = THREE.MathUtils.clamp((scrollY - start) / Math.max(end - start, 1), 0, 1); material.uniforms.uBuild.value = motion.matches ? 1 : THREE.MathUtils.clamp((progress - .68) / .32, 0, 1); if (top < innerHeight && el.getBoundingClientRect().bottom > 0) draw(); };
    window.addEventListener('scroll', onScroll, { passive: true }); motion.addEventListener('change', onScroll); onScroll();
    const resize = () => { if (!el.clientWidth || !el.clientHeight) return; renderer.setSize(el.clientWidth,el.clientHeight); draw(); };
    const observer = new ResizeObserver(resize); observer.observe(el); resize();
    tree.classList.add('has-particle-tree'); onScroll();
    const stop = observeAnimation(el, time => { material.uniforms.uTime.value = Number.isFinite(time) ? time / 1000 : 0; draw(); });
    return () => { stop(); observer.disconnect(); window.removeEventListener('scroll', onScroll); motion.removeEventListener('change', onScroll); tree.classList.remove('has-particle-tree'); geometry.dispose(); material.dispose(); renderer.dispose(); renderer.domElement.remove(); };
  }, [ready]);
  return <div ref={host} className="particle-tree" aria-hidden="true" />;
}
