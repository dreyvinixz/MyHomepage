import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import * as THREE from 'three';
import { useNearViewport } from '../lib/useNearViewport';
import { areAnimationsEnabled, subscribeMotionPreference } from '../lib/motionPreference';

/** Scroll-driven transition from the expertise section to the tree. */
export function ParticleFlow() {
  const host = useRef<HTMLDivElement>(null);
  const ready = useNearViewport(host, '#expertise');
  useEffect(() => {
    if (!ready || window.innerWidth <= 700) return;
    const el = host.current;
    const expertise = document.getElementById('expertise');
    const tree = document.querySelector<HTMLElement>('.tree-illustration');
    const paths = Array.from(document.querySelectorAll<SVGPathElement>('.tree-lines path'));
    const motion = matchMedia('(prefers-reduced-motion: reduce)');
    if (!el || !expertise || !tree || !paths.length) return;
    let renderer: THREE.WebGLRenderer;
    try { renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true }); } catch { return; }
    renderer.setPixelRatio(Math.min(devicePixelRatio, 1.5)); el.appendChild(renderer.domElement);
    const count = 7500, coords = new Float32Array(count * 3), seeds = new Float32Array(count);
    const lengths = paths.map(path => path.getTotalLength()), total = lengths.reduce((a,b) => a+b,0);
    let seed = 3987; const random = () => { seed = seed * 16807 % 2147483647; return (seed - 1) / 2147483646; };
    for (let i = 0; i < count; i++) {
      let distance = random() * total, index = 0;
      while (index < paths.length - 1 && distance > lengths[index]) { distance -= lengths[index]; index++; }
      const p = paths[index].getPointAtLength(distance);
      coords[i * 3] = p.x / 1000; coords[i * 3 + 1] = p.y / 1100; seeds[i] = random();
    }
    const geometry = new THREE.BufferGeometry(); geometry.setAttribute('position', new THREE.BufferAttribute(coords,3)); geometry.setAttribute('aSeed',new THREE.BufferAttribute(seeds,1));
    const material = new THREE.ShaderMaterial({
      uniforms: { uProgress:{value:0}, uViewport:{value:new THREE.Vector2(1,1)}, uSource:{value:new THREE.Vector2()}, uTree:{value:new THREE.Vector4()}, uDpr:{value:Math.min(devicePixelRatio,1.5)} },
      vertexShader: `attribute float aSeed; uniform float uProgress; uniform vec2 uViewport; uniform vec2 uSource; uniform vec4 uTree; uniform float uDpr; varying float vAlpha;
        void main(){ float travel=smoothstep(aSeed*.12,.82+aSeed*.12,uProgress); float angle=aSeed*90.; float radius=(.12+fract(aSeed*127.)*.88)*min(uViewport.x*.2,180.); vec2 start=uSource+vec2(cos(angle)*radius,sin(angle)*radius*.4); vec2 end=uTree.xy+position.xy*uTree.zw; vec2 p=mix(start,end,travel); p.x+=sin(travel*3.14159)*sin(aSeed*31.)*80.; vec2 clip=vec2(p.x/uViewport.x*2.-1.,1.-p.y/uViewport.y*2.); gl_Position=vec4(clip,0.,1.); gl_PointSize=(.8+aSeed*1.5)*uDpr; vAlpha=smoothstep(0.,.08,uProgress)*(1.-smoothstep(.85,1.,uProgress))*(.35+aSeed*.45); }`,
      fragmentShader: `varying float vAlpha; void main(){ if(length(gl_PointCoord-.5)>.5) discard; gl_FragColor=vec4(.88,.94,1.,vAlpha); }`, transparent:true, blending:THREE.AdditiveBlending, depthWrite:false,
    });
    const scene = new THREE.Scene(); scene.add(new THREE.Points(geometry,material)); const camera = new THREE.OrthographicCamera(-1,1,1,-1,0,1);
    let pending = 0;
    const update = () => {
      pending = 0;
      if (motion.matches || !areAnimationsEnabled() || innerWidth <= 700 || document.hidden) { renderer.clear(); return; }
      const sectionRect = expertise.getBoundingClientRect(), treeRect = tree.getBoundingClientRect();
      const spiralRect = expertise.querySelector<HTMLElement>('.expertise-ambient')?.getBoundingClientRect();
      const sourceY = spiralRect ? spiralRect.top + spiralRect.height / 2 : sectionRect.bottom;
      // Begin the handoff after the expertise spiral has cleared the viewport.
      const start = sectionRect.bottom + scrollY - innerHeight * .4;
      const end = treeRect.top + scrollY - innerHeight * .3;
      const progress = THREE.MathUtils.clamp((scrollY-start)/Math.max(end-start,1),0,1);
      material.uniforms.uProgress.value = progress;
      material.uniforms.uSource.value.set(innerWidth / 2, sourceY);
      material.uniforms.uTree.value.set(treeRect.left, treeRect.top, treeRect.width, treeRect.height);
      renderer.render(scene,camera);
    };
    const schedule = () => { if (!pending) pending = requestAnimationFrame(update); };
    const resize = () => { renderer.setSize(innerWidth,innerHeight); material.uniforms.uViewport.value.set(innerWidth,innerHeight); schedule(); };
    window.addEventListener('scroll',schedule,{passive:true}); window.addEventListener('resize',resize); document.addEventListener('visibilitychange',schedule); motion.addEventListener('change',schedule); const unsubscribeMotionPreference = subscribeMotionPreference(schedule); resize();
    return () => { cancelAnimationFrame(pending); unsubscribeMotionPreference(); window.removeEventListener('scroll',schedule); window.removeEventListener('resize',resize); document.removeEventListener('visibilitychange',schedule); motion.removeEventListener('change',schedule); geometry.dispose(); material.dispose(); renderer.dispose(); renderer.domElement.remove(); };
  }, [ready]);
  return createPortal(<div ref={host} className="expertise-particle-flow" aria-hidden="true" />, document.body);
}
