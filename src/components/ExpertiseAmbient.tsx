import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { useNearViewport } from '../lib/useNearViewport';
import { observeAnimation } from '../lib/observeAnimation';

/** Flat particle spiral, centered in Technical Expertise. */
export function ExpertiseAmbient() {
  const host = useRef<HTMLDivElement>(null);
  const ready = useNearViewport(host);
  useEffect(() => {
    if (!ready) return;
    const el = host.current; const section = el?.closest<HTMLElement>('#expertise');
    if (!el || !section) return;
    let renderer: THREE.WebGLRenderer;
    try { renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true }); } catch { return; }
    renderer.setPixelRatio(Math.min(devicePixelRatio, 1.5)); el.appendChild(renderer.domElement);
    // Recover the original transition's correlated angle and radius distribution.
    const count = 7500, positions = new Float32Array(count * 3), seeds = new Float32Array(count);
    let seed = 3987; const random = () => { seed = seed * 16807 % 2147483647; return (seed - 1) / 2147483646; };
    for (let i = 0; i < count; i++) {
      const value = random();
      const angle = value * 90;
      const radius = .12 + ((value * 127) % 1) * .88;
      positions[i * 3] = Math.cos(angle) * radius;
      positions[i * 3 + 1] = Math.sin(angle) * radius * .4;
      seeds[i] = value;
    }
    const geometry = new THREE.BufferGeometry(); geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3)); geometry.setAttribute('aSeed', new THREE.BufferAttribute(seeds, 1));
    const material = new THREE.ShaderMaterial({ uniforms: { uTime: { value: 0 }, uEnter: { value: 0 }, uExit: { value: 0 }, uScale: { value: new THREE.Vector2(1, 1) } },
      vertexShader: `attribute float aSeed; uniform float uTime; uniform float uEnter; uniform float uExit; uniform vec2 uScale; varying float vAlpha;
        void main(){ float formed=smoothstep(aSeed*.3,.7+aSeed*.3,uEnter); vec2 target=position.xy; float angle=uTime*.08; target=mat2(cos(angle),-sin(angle)*.38,sin(angle)/.38,cos(angle))*target; vec2 origin=vec2((aSeed-.5)*.6,1.0+aSeed*.35); vec2 p=mix(origin,target,formed); p=mix(p,vec2((aSeed-.5)*.5,-1.0-aSeed*.3),uExit); gl_Position=vec4(p*uScale,0.,1.); gl_PointSize=.8+aSeed*1.7; vAlpha=formed*(1.-uExit)*(.4+aSeed*.6); }`,
      fragmentShader: `varying float vAlpha; void main(){ if(length(gl_PointCoord-.5)>.5) discard; gl_FragColor=vec4(.91,.96,1.,vAlpha); }`, transparent:true, blending:THREE.AdditiveBlending, depthWrite:false });
    const scene = new THREE.Scene(); scene.add(new THREE.Points(geometry,material)); const camera = new THREE.OrthographicCamera(-1,1,1,-1,0,1);
    const draw = () => renderer.render(scene,camera);
    const motion = matchMedia('(prefers-reduced-motion: reduce)');
    const onScroll = () => { const rect = section.getBoundingClientRect(); const spiral = el.getBoundingClientRect(); const hero = document.querySelector<HTMLElement>('.hero'); const start = (hero?.getBoundingClientRect().top ?? 0) + scrollY + innerHeight * .05; const end = spiral.top + scrollY - innerHeight * .58; const progress = THREE.MathUtils.clamp((scrollY - start) / Math.max(end - start, 1), 0, 1); material.uniforms.uEnter.value = motion.matches ? 1 : THREE.MathUtils.clamp((progress - .72) / .28, 0, 1); material.uniforms.uExit.value = motion.matches ? 0 : THREE.MathUtils.clamp((innerHeight * .55 - rect.bottom) / (innerHeight * .55),0,1); if (rect.top < innerHeight && rect.bottom > 0) draw(); };
    window.addEventListener('scroll',onScroll,{passive:true}); motion.addEventListener('change',onScroll);
    const resize = () => { const w=el.clientWidth,h=el.clientHeight; if(!w||!h)return; renderer.setSize(w,h); material.uniforms.uScale.value.set(Math.min(1,h/w*2.2),1); onScroll(); };
    const observer=new ResizeObserver(resize); observer.observe(el); resize();
    const stop=observeAnimation(el,time=>{ material.uniforms.uTime.value=Number.isFinite(time)?time/1000:0; draw(); });
    return ()=>{ stop(); observer.disconnect(); window.removeEventListener('scroll',onScroll); motion.removeEventListener('change',onScroll); geometry.dispose(); material.dispose(); renderer.dispose(); renderer.domElement.remove(); };
  },[ready]);
  return <div ref={host} className="expertise-ambient" aria-hidden="true" />;
}
