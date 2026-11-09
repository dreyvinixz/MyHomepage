import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import type { Language } from '../translations';

// An illustrative loss surface: the moving point is not a trained model.
const loss = (x: number, z: number) => .11 * (x*x + z*z) + .28 * Math.sin(x * 1.3) * Math.cos(z * 1.15);
const gradient = (x: number, z: number) => new THREE.Vector2(.22*x + .364*Math.cos(x*1.3)*Math.cos(z*1.15), .22*z - .322*Math.sin(x*1.3)*Math.sin(z*1.15));

export function GradientDescent({ language }: { language: Language }) {
  const host = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = host.current;
    if (!el) return;
    let renderer: THREE.WebGLRenderer;
    try { renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true }); } catch { return; }
    renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
    el.prepend(renderer.domElement);
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(40, 1, .1, 100);
    camera.position.set(6, 5, 9);
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enablePan = false; controls.enableZoom = false; controls.enableDamping = true;
    controls.target.set(0, .4, 0); controls.minPolarAngle = .3; controls.maxPolarAngle = Math.PI * .48;
    controls.update();
    const surface = new THREE.PlaneGeometry(7, 6, 55, 48);
    surface.rotateX(-Math.PI / 2);
    const positions = surface.getAttribute('position');
    for (let i = 0; i < positions.count; i++) positions.setY(i, loss(positions.getX(i), positions.getZ(i)));
    surface.computeVertexNormals();
    const fill = new THREE.MeshBasicMaterial({ color: '#1472e8', transparent: true, opacity: .10, side: THREE.DoubleSide, depthWrite: false });
    scene.add(new THREE.Mesh(surface, fill));
    const wire = new THREE.WireframeGeometry(surface);
    const wireMaterial = new THREE.LineBasicMaterial({ color: '#81c7ff', transparent: true, opacity: .26, depthWrite: false });
    scene.add(new THREE.LineSegments(wire, wireMaterial));
    const path: THREE.Vector3[] = [];
    let x = 2.7, z = 2.1;
    for (let i = 0; i < 90; i++) {
      path.push(new THREE.Vector3(x, loss(x, z) + .045, z));
      const g = gradient(x, z); x -= g.x * .12; z -= g.y * .12;
    }
    const lineGeometry = new THREE.BufferGeometry().setFromPoints(path);
    const lineMaterial = new THREE.LineBasicMaterial({ color: '#f3d2a0', transparent: true, opacity: .9 });
    scene.add(new THREE.Line(lineGeometry, lineMaterial));
    const pointGeometry = new THREE.SphereGeometry(.1, 20, 16);
    const pointMaterial = new THREE.MeshBasicMaterial({ color: '#ffffff' });
    const point = new THREE.Mesh(pointGeometry, pointMaterial); scene.add(point);
    const haloGeometry = new THREE.SphereGeometry(.19, 16, 12);
    const haloMaterial = new THREE.MeshBasicMaterial({ color: '#8ad8ff', transparent: true, opacity: .25, blending: THREE.AdditiveBlending, depthWrite: false });
    const halo = new THREE.Mesh(haloGeometry, haloMaterial); scene.add(halo);
    const motion = matchMedia('(prefers-reduced-motion: reduce)');
    let frame = 0, start = 0, elapsed = 0;
    const draw = () => {
      const progress = motion.matches ? 1 : Math.min((elapsed % 12000) / 9000, 1);
      const at = progress * (path.length - 1), i = Math.floor(at);
      point.position.copy(path[i]).lerp(path[Math.min(i + 1, path.length - 1)], at - i);
      halo.position.copy(point.position); renderer.render(scene, camera);
    };
    const animate = (now: number) => { if (!start) start = now; elapsed = now - start; controls.update(); draw(); frame = requestAnimationFrame(animate); };
    const update = () => { cancelAnimationFrame(frame); start = 0; draw(); if (!motion.matches && !document.hidden) frame = requestAnimationFrame(animate); };
    const onChange = () => { if (motion.matches) draw(); };
    const resize = () => { const w = el.clientWidth, h = el.clientHeight; if (!w || !h) return; renderer.setSize(w, h); camera.aspect = w / h; camera.updateProjectionMatrix(); draw(); };
    const observer = new ResizeObserver(resize); observer.observe(el); resize();
    controls.addEventListener('change', onChange); motion.addEventListener('change', update); document.addEventListener('visibilitychange', update); update();
    return () => { cancelAnimationFrame(frame); observer.disconnect(); controls.removeEventListener('change', onChange); controls.dispose(); motion.removeEventListener('change', update); document.removeEventListener('visibilitychange', update); surface.dispose(); fill.dispose(); wire.dispose(); wireMaterial.dispose(); lineGeometry.dispose(); lineMaterial.dispose(); pointGeometry.dispose(); pointMaterial.dispose(); haloGeometry.dispose(); haloMaterial.dispose(); renderer.dispose(); renderer.domElement.remove(); };
  }, []);
  return <div ref={host} className="neural-network" role="img" aria-label={language === 'pt' ? 'Visualização ilustrativa de descida do gradiente em uma superfície de erro' : 'Illustrative gradient descent on a loss surface'}><span className="neural-hint">{language === 'pt' ? 'Arraste para girar · descida do gradiente' : 'Drag to rotate · gradient descent'}</span></div>;
}
