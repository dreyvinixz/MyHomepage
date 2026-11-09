import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import type { Language } from '../translations';

export function NeuralNetwork({ language }: { language: Language }) {
  const host = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const element = host.current;
    if (!element) return;
    let renderer: THREE.WebGLRenderer;
    try { renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true }); } catch { return; }
    renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
    element.prepend(renderer.domElement);
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(38, 1, .1, 100);
    camera.position.set(0, 3, 9);
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enablePan = false;
    controls.enableZoom = false;
    controls.enableDamping = true;
    controls.minPolarAngle = Math.PI * .2;
    controls.maxPolarAngle = Math.PI * .8;
    const group = new THREE.Group();
    group.rotation.set(.02, -.24, -.02);
    scene.add(group);
    const layers: THREE.Vector3[][] = [];
    // Dense input plane followed by visibly separated neuron columns.
    const input: THREE.Vector3[] = [];
    for (let row = 0; row < 16; row++) {
      for (let col = 0; col < 5; col++) {
        input.push(new THREE.Vector3(-3.65, (row - 7.5) * .19, (col - 2) * .38));
      }
    }
    layers.push(input);
    // Each layer has two rows in depth, visible when the camera is orbited.
    [12, 10, 8, 6].forEach((count, layer) => {
      const points: THREE.Vector3[] = [];
      const rows = count / 2;
      for (let i = 0; i < count; i++) {
        const y = (Math.floor(i / 2) - (rows - 1) / 2) * .56;
        const z = (i % 2 === 0 ? -.48 : .48);
        points.push(new THREE.Vector3(-1.75 + layer * 1.6, y, z));
      }
      layers.push(points);
    });
    const allNodes = layers.slice(1).flat();
    const connectionColors: THREE.Color[] = [];
    const paths: [THREE.Vector3, THREE.Vector3][] = [];
    const pathLayers: number[] = [];
    layers.slice(0, -1).forEach((layer, index) => layer.forEach((node, i) => {
      const next = layers[index + 1];
      next.forEach((target, j) => {
        if (index === 0 && (i * 7 + j * 3) % 4 === 0) return;
        connectionColors.push(new THREE.Color((i * 7 + j * 3 + index) % 2 ? '#31dd92' : '#ec8a45'));
        paths.push([node, target]);
        pathLayers.push(index);
      });
    }));
    // Instanced cylinders give the connections real depth while keeping draw calls low.
    const edges = new THREE.CylinderGeometry(.0025, .0025, 1, 5, 1);
    const edgeMaterial = new THREE.MeshBasicMaterial({ transparent: true, opacity: .48, depthWrite: false });
    const edgeMesh = new THREE.InstancedMesh(edges, edgeMaterial, paths.length);
    const transform = new THREE.Object3D();
    const up = new THREE.Vector3(0, 1, 0);
    paths.forEach(([source, target], index) => {
      const direction = target.clone().sub(source);
      transform.position.copy(source).addScaledVector(direction, .5);
      transform.quaternion.setFromUnitVectors(up, direction.clone().normalize());
      transform.scale.set(1, direction.length(), 1);
      transform.updateMatrix();
      edgeMesh.setMatrixAt(index, transform.matrix);
      edgeMesh.setColorAt(index, connectionColors[index]);
    });
    edgeMesh.instanceMatrix.needsUpdate = true;
    if (edgeMesh.instanceColor) edgeMesh.instanceColor.needsUpdate = true;
    group.add(edgeMesh);
    const nodeGeometry = new THREE.SphereGeometry(.105, 20, 16);
    const nodeMaterial = new THREE.MeshStandardMaterial({ color: '#b9bec7', emissive: '#343941', emissiveIntensity: .35, metalness: .15, roughness: .4 });
    const ambient = new THREE.AmbientLight('#b9dbff', 1.3);
    const keyLight = new THREE.PointLight('#ffffff', 35);
    keyLight.position.set(-2, 3, 5);
    scene.add(ambient, keyLight);
    const neuronMeshes: THREE.Mesh<THREE.SphereGeometry, THREE.MeshStandardMaterial>[] = [];
    allNodes.forEach((position, i) => { const node = new THREE.Mesh(nodeGeometry, nodeMaterial.clone()); node.position.copy(position); node.material.color.set(i % 7 === 0 ? '#f1f2f2' : i % 3 === 0 ? '#16181b' : '#74777c'); group.add(node); neuronMeshes.push(node); });
    const inputGeometry = new THREE.BufferGeometry();
    inputGeometry.setAttribute('position', new THREE.Float32BufferAttribute(input.flatMap(point => point.toArray()), 3));
    const inputMaterial = new THREE.PointsMaterial({ color: '#a5b8b7', size: .035, transparent: true, opacity: .55 });
    group.add(new THREE.Points(inputGeometry, inputMaterial));
    const count = 240;
    const pulsePositions = new Float32Array(count * 3);
    const pulseGeometry = new THREE.BufferGeometry(); pulseGeometry.setAttribute('position', new THREE.BufferAttribute(pulsePositions, 3));
    const pulseMaterial = new THREE.PointsMaterial({ color: '#ffffff', size: .075, transparent: true, opacity: .95, blending: THREE.AdditiveBlending, depthWrite: false });
    group.add(new THREE.Points(pulseGeometry, pulseMaterial));
    const motion = matchMedia('(prefers-reduced-motion: reduce)');
    let frame = 0, start = 0;
    const draw = (time: number) => {
      const seconds = time / 1000;
      for (let i = 0; i < count; i++) {
        const path = paths[(i * 23) % paths.length];
        const pathIndex = (i * 23) % paths.length;
        const cycle = (seconds * .5 + (i % 4) * .25) % 4;
        const t = THREE.MathUtils.clamp(cycle - pathLayers[pathIndex], 0, 1);
        pulsePositions[i * 3] = THREE.MathUtils.lerp(path[0].x, path[1].x, t);
        pulsePositions[i * 3 + 1] = THREE.MathUtils.lerp(path[0].y, path[1].y, t);
        pulsePositions[i * 3 + 2] = THREE.MathUtils.lerp(path[0].z, path[1].z, t);
      }
      pulseGeometry.attributes.position.needsUpdate = true;
      neuronMeshes.forEach((node, index) => {
        const layer = index < 12 ? 1 : index < 22 ? 2 : index < 30 ? 3 : 4;
        const phase = (seconds * .5 + (index % 4) * .25) % 4;
        const distance = Math.abs(phase - (layer % 4));
        const wave = Math.max(0, 1 - Math.min(distance, 4 - distance) * 3);
        node.material.color.setRGB(.12 + wave * .85, .14 + wave * .86, .16 + wave * .8);
        node.material.emissive.setRGB(.05 * wave, .8 * wave, .4 * wave);
        node.material.emissiveIntensity = wave * 2;
        node.scale.setScalar(1 + wave * .45);
      });
      renderer.render(scene, camera);
    };
    const animate = (now: number) => { if (!start) start = now; controls.update(); draw(now - start); frame = requestAnimationFrame(animate); };
    const update = () => { cancelAnimationFrame(frame); draw(0); if (!motion.matches && !document.hidden) { start = 0; frame = requestAnimationFrame(animate); } };
    const resize = () => { const w = element.clientWidth, h = element.clientHeight; if (!w || !h) return; renderer.setSize(w, h); camera.aspect = w / h; camera.updateProjectionMatrix(); draw(0); };
    const observer = new ResizeObserver(resize); observer.observe(element); resize();
    const onControlsChange = () => { if (motion.matches) draw(0); };
    controls.addEventListener('change', onControlsChange);
    motion.addEventListener('change', update); document.addEventListener('visibilitychange', update); update();
    return () => { cancelAnimationFrame(frame); observer.disconnect(); controls.removeEventListener('change', onControlsChange); controls.dispose(); motion.removeEventListener('change', update); document.removeEventListener('visibilitychange', update); edges.dispose(); edgeMaterial.dispose(); nodeGeometry.dispose(); group.traverse(object => { if (object instanceof THREE.Mesh && object.geometry === nodeGeometry && object.material instanceof THREE.Material) object.material.dispose(); }); nodeMaterial.dispose(); inputGeometry.dispose(); inputMaterial.dispose(); pulseGeometry.dispose(); pulseMaterial.dispose(); renderer.dispose(); renderer.domElement.remove(); };
  }, []);
  return <div ref={host} className="neural-network" role="img" aria-label={language === 'pt' ? 'Rede neural tridimensional ilustrativa. Arraste para girar.' : 'Illustrative three-dimensional neural network. Drag to rotate.'}><span className="neural-hint">{language === 'pt' ? 'Arraste para girar' : 'Drag to rotate'}</span></div>;
}
