import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import type { Language } from '../translations';

// Orion's familiar outline, stylized in depth; technology associations are personal.
const skills = [
  { star: 'Betelgeuse', name: 'Python', position: [-1.75, 1.55, .45] },
  { star: 'Bellatrix', name: 'C++', position: [1.4, 1.45, -.35] },
  { star: 'Mintaka', name: 'PyTorch', position: [-.65, .15, -.15] },
  { star: 'Alnilam', name: 'FastAPI', position: [0, 0, .15] },
  { star: 'Alnitak', name: 'PostgreSQL', position: [.65, -.15, .3] },
  { star: 'Saiph', name: 'ClickHouse', position: [-1.35, -1.75, -.5] },
  { star: 'Rigel', name: 'Docker', position: [1.55, -1.6, .5] },
  { star: 'Meissa', name: 'Linux', position: [-.1, 2.05, -.2] },
] as const;
const connections = [[0, 7], [7, 1], [0, 2], [1, 4], [2, 3], [3, 4], [2, 5], [4, 6], [5, 6]] as const;

export function KnowledgeConstellation({ language }: { language: Language }) {
  const host = useRef<HTMLDivElement>(null);
  const labels = useRef<(HTMLButtonElement | null)[]>([]);
  const [selected, setSelected] = useState<number | null>(null);
  const [hovered, setHovered] = useState<number | null>(null);
  const engaged = useRef(false);
  useEffect(() => {
    const container = host.current;
    if (!container) return;
    let renderer: THREE.WebGLRenderer;
    try { renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true }); } catch { return; }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.domElement.className = 'constellation-canvas';
    container.prepend(renderer.domElement);
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(40, 1, .1, 100);
    const group = new THREE.Group(); scene.add(group);
    let seed = 2847;
    const random = () => { seed = (seed * 16807) % 2147483647; return (seed - 1) / 2147483646; };
    const nodes = skills.map(skill => new THREE.Vector3(...skill.position));
    const stars: number[] = [];
    // Fine particles form a luminous three-dimensional cloud around each skill.
    nodes.forEach(node => {
      for (let i = 0; i < 3500; i++) {
        const angle = random() * Math.PI * 2, z = random() * 2 - 1;
        const r = Math.pow(random(), 1.6) * .55, ring = Math.sqrt(1 - z * z);
        stars.push(node.x + Math.cos(angle) * ring * r, node.y + z * r, node.z + Math.sin(angle) * ring * r);
      }
    });
    const geometry = new THREE.BufferGeometry(); geometry.setAttribute('position', new THREE.Float32BufferAttribute(stars, 3));
    const material = new THREE.ShaderMaterial({
      uniforms: { pointSize: { value: 3.5 * Math.min(window.devicePixelRatio, 2) } },
      vertexShader: `uniform float pointSize; varying float vDistance;
        void main() { vec4 mv = modelViewMatrix * vec4(position, 1.0); vDistance = length(mv.xyz); gl_Position = projectionMatrix * mv; gl_PointSize = pointSize * 3.0 / vDistance; }`,
      fragmentShader: `varying float vDistance;
        void main() { vec2 xy = 2.0 * gl_PointCoord - 1.0; float d = length(xy); if (d > .8) discard; gl_FragColor = vec4(vec3(1.0), 1.0 - clamp(vDistance, 0.0, .75) * d * 1.8); }`,
      transparent: true, blending: THREE.AdditiveBlending, depthWrite: false,
    });
    group.add(new THREE.Points(geometry, material));
    const edges: number[] = [];
    connections.forEach(([a, b]) => edges.push(...nodes[a].toArray(), ...nodes[b].toArray()));
    const lines = new THREE.BufferGeometry(); lines.setAttribute('position', new THREE.Float32BufferAttribute(edges, 3));
    const lineMaterial = new THREE.LineBasicMaterial({ color: '#b7dfff', transparent: true, opacity: .48, blending: THREE.AdditiveBlending, depthWrite: false });
    group.add(new THREE.LineSegments(lines, lineMaterial));
    const starGeometry = new THREE.SphereGeometry(.045, 12, 8);
    const starMaterial = new THREE.MeshBasicMaterial({ color: '#ffffff' });
    nodes.forEach(node => { const star = new THREE.Mesh(starGeometry, starMaterial); star.position.copy(node); group.add(star); });
    group.rotation.set(.05, -.12, -.08);
    let targetX = .05, targetY = -.12;
    let dragging = false, pointerX = 0, pointerY = 0;
    const pointerDown = (event: PointerEvent) => {
      if ((event.target as HTMLElement).closest('button')) return;
      dragging = true; engaged.current = true; pointerX = event.clientX; pointerY = event.clientY;
      container.setPointerCapture(event.pointerId);
    };
    const pointerMove = (event: PointerEvent) => {
      if (!dragging) return;
      targetY += (event.clientX - pointerX) * .006;
      targetX = THREE.MathUtils.clamp(targetX + (event.clientY - pointerY) * .006, -.7, .7);
      pointerX = event.clientX; pointerY = event.clientY;
      if (motion.matches) { group.rotation.set(targetX, targetY, -.08); draw(); }
    };
    const pointerUp = () => { dragging = false; engaged.current = false; };
    container.addEventListener('pointerdown', pointerDown);
    container.addEventListener('pointermove', pointerMove);
    container.addEventListener('pointerup', pointerUp);
    container.addEventListener('pointercancel', pointerUp);
    const project = () => {
      group.updateMatrixWorld();
      nodes.forEach((node, i) => {
        const projected = node.clone().applyMatrix4(group.matrixWorld).project(camera);
        const label = labels.current[i];
        if (label) { label.style.left = `${(projected.x * .5 + .5) * 100}%`; label.style.top = `${(-projected.y * .5 + .5) * 100}%`; }
      });
    };
    const draw = () => { renderer.render(scene, camera); project(); };
    const resize = () => { const w = container.clientWidth, h = container.clientHeight; if (!w || !h) return; renderer.setSize(w, h); camera.aspect = w / h; camera.position.z = w < 600 ? 12.5 : 6.2; camera.updateProjectionMatrix(); draw(); };
    const observer = new ResizeObserver(resize); observer.observe(container); resize();
    const motion = matchMedia('(prefers-reduced-motion: reduce)');
    let animation = 0; let last = 0;
    const render = (now: number) => { if (last && !engaged.current) targetY = -.12 + Math.sin(now * .00022) * .24; group.rotation.x += (targetX - group.rotation.x) * .05; group.rotation.y += (targetY - group.rotation.y) * .05; last = now; draw(); animation = requestAnimationFrame(render); };
    const update = () => { cancelAnimationFrame(animation); last = 0; draw(); if (!motion.matches && !document.hidden) animation = requestAnimationFrame(render); };
    motion.addEventListener('change', update); document.addEventListener('visibilitychange', update); update();
    return () => { cancelAnimationFrame(animation); container.removeEventListener('pointerdown', pointerDown); container.removeEventListener('pointermove', pointerMove); container.removeEventListener('pointerup', pointerUp); container.removeEventListener('pointercancel', pointerUp); observer.disconnect(); motion.removeEventListener('change', update); document.removeEventListener('visibilitychange', update); geometry.dispose(); material.dispose(); lines.dispose(); lineMaterial.dispose(); starGeometry.dispose(); starMaterial.dispose(); renderer.dispose(); renderer.domElement.remove(); };
  }, []);
  const active = hovered ?? selected;
  return <div ref={host} className="knowledge-constellation" role="group" aria-label={language === 'pt' ? 'Constelação de Órion e tecnologias' : 'Orion constellation and technologies'}>
    {skills.map((skill, i) => <button key={skill.star} ref={element => { labels.current[i] = element; }} className="constellation-star" type="button" aria-label={`${skill.star}: ${skill.name}`} aria-pressed={selected === i} onMouseEnter={() => { setHovered(i); engaged.current = true; }} onMouseLeave={() => { setHovered(null); engaged.current = false; }} onFocus={() => { setHovered(i); engaged.current = true; }} onBlur={() => { setHovered(null); engaged.current = false; }} onClick={() => setSelected(selected === i ? null : i)}><span className="star-glow" /><span className="star-label">{skill.star} · {skill.name}</span></button>)}
    <div className="constellation-caption" aria-live="polite"><span>ORION / ÓRION</span><strong>{active === null ? (language === 'pt' ? 'Uma constelação de ideias' : 'A constellation of ideas') : `${skills[active].star} / ${skills[active].name}`}</strong><small>{language === 'pt' ? 'Arraste para girar · selecione uma estrela' : 'Drag to rotate · select a star'}</small></div>
  </div>;
}
