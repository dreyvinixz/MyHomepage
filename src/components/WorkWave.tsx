import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { useNearViewport } from '../lib/useNearViewport';
import { observeAnimation } from '../lib/observeAnimation';

export function WorkWave({ variant }: { variant: number }) {
  const host = useRef<HTMLDivElement>(null);
  const ready = useNearViewport(host);
  useEffect(() => {
    if (!ready) return;
    const el = host.current;
    if (!el) return;
    let renderer: THREE.WebGLRenderer;
    try { renderer = new THREE.WebGLRenderer({ antialias: false, alpha: false, powerPreference: 'low-power' }); } catch { return; }
    renderer.setPixelRatio(Math.min(devicePixelRatio, 1.5));
    el.appendChild(renderer.domElement);
    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
    const geometry = new THREE.PlaneGeometry(2, 2);
    const material = new THREE.ShaderMaterial({
      uniforms: { uTime: { value: 0 }, uVariant: { value: variant }, uResolution: { value: new THREE.Vector2(1, 1) } },
      vertexShader: `varying vec2 vUv; void main() { vUv = uv; gl_Position = vec4(position, 1.0); }`,
      fragmentShader: `
        precision highp float;
        varying vec2 vUv; uniform float uTime; uniform float uVariant; uniform vec2 uResolution;
        float surface(vec2 p, float t) {
          float wave = sin(p.x * 2.5 + sin(p.y * 1.5 + t * .45) * 1.4 + t * .32);
          wave += .5 * sin(p.y * 3.1 - p.x * 1.2 - t * .27);
          wave += .2 * sin(p.x * 5.2 + p.y * 3.8 + t * .18);
          return wave * .28;
        }
        float noise(vec2 p) { return fract(sin(dot(p, vec2(12.9898,78.233))) * 43758.5453); }
        void main() {
          vec2 p = (vUv - .5) * vec2(uResolution.x / uResolution.y, 1.0) * 2.2;
          float t = uTime * (uVariant == 1.0 ? -.8 : 1.0) + uVariant * 3.7;
          p = mat2(.85,-.52,.52,.85) * p;
          float h = surface(p,t); float e = .015;
          vec3 normal = normalize(vec3(surface(p-vec2(e,0.),t)-surface(p+vec2(e,0.),t), surface(p-vec2(0.,e),t)-surface(p+vec2(0.,e),t), 2.0*e));
          vec3 light = normalize(vec3(-.5,.8,1.0));
          float diffuse = max(dot(normal,light),0.0);
          float spec = pow(max(dot(reflect(-light,normal),vec3(0.,0.,1.)),0.0), 22.0);
          vec3 color = vec3(.006,.025,.05) + vec3(.012,.12,.24) * diffuse + vec3(.025,.18,.32) * smoothstep(-.3,.45,h);
          color += vec3(.12,.29,.42) * spec * .6;
          color *= .7 + .3 * smoothstep(-.6,.7,h);
          color += (noise(gl_FragCoord.xy) - .5) * .025;
          gl_FragColor = vec4(color,1.0);
          #include <colorspace_fragment>
        }`,
    });
    scene.add(new THREE.Mesh(geometry, material));
    const draw = () => renderer.render(scene, camera);
    const resize = () => { const w = el.clientWidth, h = el.clientHeight; if (!w || !h) return; renderer.setSize(w,h); material.uniforms.uResolution.value.set(w,h); draw(); };
    const observer = new ResizeObserver(resize); observer.observe(el); resize();
    const stop = observeAnimation(el, time => { material.uniforms.uTime.value = Number.isFinite(time) ? time / 1000 : 0; draw(); }, 24);
    return () => { stop(); observer.disconnect(); geometry.dispose(); material.dispose(); renderer.dispose(); renderer.domElement.remove(); };
  }, [variant, ready]);
  return <div className="work-wave" ref={host} aria-hidden="true" />;
}
