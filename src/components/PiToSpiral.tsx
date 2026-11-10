import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import * as THREE from 'three';
import { areAnimationsEnabled, subscribeMotionPreference } from '../lib/motionPreference';

/** Particles move from the hero's pi toward the expertise spiral as the page scrolls. */
export function PiToSpiral() {
  const host = useRef<HTMLDivElement>(null);
  const [hasScrolled, setHasScrolled] = useState(() => window.scrollY > 5);
  useEffect(() => { const onScroll = () => { if (window.scrollY > 5) setHasScrolled(true); }; window.addEventListener('scroll', onScroll, { passive: true }); return () => window.removeEventListener('scroll', onScroll); }, []);
  useEffect(() => {
    if (!hasScrolled) return;
    const el = host.current, hero = document.querySelector<HTMLElement>('.hero'), pi = document.querySelector<HTMLElement>('.pi-particles'), spiral = document.querySelector<HTMLElement>('.expertise-ambient');
    if (!el || !hero || !pi || !spiral) return;
    const motion = matchMedia('(prefers-reduced-motion: reduce)');
    let renderer: THREE.WebGLRenderer;
    try { renderer = new THREE.WebGLRenderer({ alpha:true, antialias:false }); } catch { return; }
    renderer.setPixelRatio(1); el.appendChild(renderer.domElement);
    const canvas = document.createElement('canvas'); canvas.width=256; canvas.height=256; const ctx=canvas.getContext('2d');
    if (!ctx) { renderer.dispose(); renderer.domElement.remove(); return; }
    ctx.fillStyle='#fff'; ctx.font='bold 220px Georgia, serif'; ctx.textAlign='center'; ctx.textBaseline='middle'; ctx.fillText('π',128,117);
    const pixels=ctx.getImageData(0,0,256,256).data; const candidates:number[]=[];
    for(let y=0;y<256;y+=2) for(let x=0;x<256;x+=2) if(pixels[(y*256+x)*4+3]>100) candidates.push(x,y);
    const count=4000, coords=new Float32Array(count*3), destinations=new Float32Array(count*3), seeds=new Float32Array(count);
    let seed=3987; const random=()=>{seed=seed*16807%2147483647;return(seed-1)/2147483646;};
    for(let i=0;i<count;i++){ const k=Math.floor(random()*candidates.length/2)*2; coords[i*3]=(candidates[k]/256-.5); coords[i*3+1]=(.5-candidates[k+1]/256); const value=random(), angle=value*90, radius=.12+((value*127)%1)*.88; destinations[i*3]=Math.cos(angle)*radius; destinations[i*3+1]=Math.sin(angle)*radius*.4; seeds[i]=value; }
    const geometry=new THREE.BufferGeometry(); geometry.setAttribute('position',new THREE.BufferAttribute(coords,3)); geometry.setAttribute('aDestination',new THREE.BufferAttribute(destinations,3)); geometry.setAttribute('aSeed',new THREE.BufferAttribute(seeds,1));
    const material=new THREE.ShaderMaterial({ uniforms:{uProgress:{value:0},uViewport:{value:new THREE.Vector2(1,1)},uPi:{value:new THREE.Vector4()},uSpiral:{value:new THREE.Vector4()}}, vertexShader:`attribute vec3 aDestination; attribute float aSeed; uniform float uProgress; uniform vec2 uViewport; uniform vec4 uPi; uniform vec4 uSpiral; varying float vAlpha;
      void main(){ float travel=smoothstep(aSeed*.08,.88+aSeed*.08,uProgress); vec2 start=uPi.xy+vec2(position.x*uPi.z,-position.y*uPi.w); vec2 end=uSpiral.xy+vec2(aDestination.x*uSpiral.z,-aDestination.y*uSpiral.w); vec2 p=mix(start,end,travel); p.x+=sin(travel*3.14159)*sin(aSeed*90.)*50.; gl_Position=vec4(p.x/uViewport.x*2.-1.,1.-p.y/uViewport.y*2.,0.,1.); gl_PointSize=.8+aSeed*1.6; vAlpha=smoothstep(0.,.08,uProgress)*(1.-smoothstep(.83,1.,uProgress))*(.35+aSeed*.5); }`, fragmentShader:`varying float vAlpha; void main(){if(length(gl_PointCoord-.5)>.5) discard;gl_FragColor=vec4(.9,.96,1.,vAlpha);}`,transparent:true,blending:THREE.AdditiveBlending,depthWrite:false});
    const scene=new THREE.Scene();scene.add(new THREE.Points(geometry,material));const camera=new THREE.OrthographicCamera(-1,1,1,-1,0,1);let pending=0;
    const update=()=>{pending=0;if(motion.matches||!areAnimationsEnabled()||innerWidth<=700||document.hidden){renderer.clear();return;}const h=hero.getBoundingClientRect(),a=pi.getBoundingClientRect(),b=spiral.getBoundingClientRect();const start=h.top+scrollY+innerHeight*.05,end=b.top+scrollY-innerHeight*.58;material.uniforms.uProgress.value=THREE.MathUtils.clamp((scrollY-start)/Math.max(end-start,1),0,1);material.uniforms.uPi.value.set(a.left+a.width/2,a.top+a.height/2,a.height*1.15,a.height*1.15);const scale=Math.min(1,b.height/b.width*2.2);material.uniforms.uSpiral.value.set(b.left+b.width/2,b.top+b.height/2,b.width*.5*scale,b.height*.5);renderer.render(scene,camera);};
    const schedule=()=>{if(!pending)pending=requestAnimationFrame(update);}; const resize=()=>{renderer.setSize(innerWidth,innerHeight);material.uniforms.uViewport.value.set(innerWidth,innerHeight);schedule();};
    window.addEventListener('scroll',schedule,{passive:true});window.addEventListener('resize',resize);document.addEventListener('visibilitychange',schedule);motion.addEventListener('change',schedule);const unsubscribeMotionPreference=subscribeMotionPreference(schedule);resize();
    return()=>{cancelAnimationFrame(pending);unsubscribeMotionPreference();window.removeEventListener('scroll',schedule);window.removeEventListener('resize',resize);document.removeEventListener('visibilitychange',schedule);motion.removeEventListener('change',schedule);geometry.dispose();material.dispose();renderer.dispose();renderer.domElement.remove();};
  },[hasScrolled]);
  return createPortal(<div ref={host} className="expertise-particle-flow" aria-hidden="true"/>,document.body);
}
