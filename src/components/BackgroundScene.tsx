import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { ShaderPass } from 'three/addons/postprocessing/ShaderPass.js';

// Background scene adapted from Maxime Heckel's blog (MIT); see REFERENCE-LICENSE.txt.
export function BackgroundScene() {
  const host = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const element = host.current;
    if (!element) return;
    let renderer: THREE.WebGLRenderer;
    try { renderer = new THREE.WebGLRenderer({ antialias: true }); }
    catch { return; }
    renderer.setPixelRatio(1);
    renderer.setClearColor('#090a0e');
    element.appendChild(renderer.domElement);
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, 1, .1, 100);
    camera.position.set(0, 0, 4);
    const light = new THREE.SpotLight('#ffffff', 15, 0, .25, 1, .25);
    light.position.set(35, 30, 20);
    light.target.position.set(-5, 5, -10);
    scene.add(light, light.target);
    const planeGeometry = new THREE.PlaneGeometry(300, 300);
    const planeMaterial = new THREE.MeshStandardMaterial({ color: '#0f53b7' });
    const plane = new THREE.Mesh(planeGeometry, planeMaterial);
    plane.position.z = -10;
    scene.add(plane);
    // Grid geometry, material and framing follow the original scene.
    const grid = new THREE.GridHelper(50, 120);
    grid.rotation.x = -Math.PI / 2;
    grid.position.z = -4.5;
    const defaultGridMaterial = grid.material;
    const gridMaterial = new THREE.MeshBasicMaterial({ color: '#ffffff', transparent: true, opacity: .02 });
    grid.material = gridMaterial as unknown as THREE.LineBasicMaterial;
    scene.add(grid);

    // Adapted from the reference scene's halftone and color post-processing.
    const composer = new EffectComposer(renderer);
    composer.addPass(new RenderPass(scene, camera));
    const effect = new ShaderPass({
      uniforms: { tDiffuse: { value: null }, resolution: { value: new THREE.Vector2(1, 1) }, pixelSize: { value: 4 } },
      vertexShader: `varying vec2 vUv; void main() { vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }`,
      fragmentShader: `uniform sampler2D tDiffuse; uniform vec2 resolution; uniform float pixelSize; varying vec2 vUv;
        void main() {
          vec2 stepSize = pixelSize / resolution;
          vec2 pixel = stepSize * floor(vUv / stepSize);
          vec3 color = texture2D(tDiffuse, pixel).rgb;
          color = floor(color * 31.0 + 0.5) / 31.0;
          vec3 original = vec3(texture2D(tDiffuse, vUv + vec2(.00025, 0.)).r, texture2D(tDiffuse, vUv).g, texture2D(tDiffuse, vUv - vec2(.0005, 0.)).b);
          float luma = dot(color, vec3(.2126, .7152, .0722));
          float d = distance(fract(vUv / stepSize), vec2(.5));
          float circle = 1.0 - smoothstep(luma - .001, luma, d);
          vec3 asciiColor = vec3(circle * luma);
          original *= 1.5;
          float intensity = dot(original, vec3(.2125, .7154, .0721));
          original = mix(vec3(intensity), original, 1.35);
          float transition = smoothstep(0., .35, vUv.y - vUv.x * vUv.x);
          gl_FragColor = vec4(mix(asciiColor, original, transition), 1.);
          #include <tonemapping_fragment>
          #include <colorspace_fragment>
        }`,
    });
    composer.addPass(effect);
    const resize = () => {
      const width = element.clientWidth, height = element.clientHeight;
      if (!width || !height) return;
      renderer.setSize(width, height);
      composer.setSize(width, height);
      effect.uniforms.resolution.value.set(width, height);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      composer.render();
    };
    const observer = new ResizeObserver(resize);
    observer.observe(element);
    resize();
    return () => {
      observer.disconnect(); planeGeometry.dispose(); planeMaterial.dispose();
      grid.geometry.dispose(); gridMaterial.dispose();
      (Array.isArray(defaultGridMaterial) ? defaultGridMaterial : [defaultGridMaterial]).forEach(material => material.dispose());
      effect.dispose(); composer.dispose(); renderer.dispose(); renderer.domElement.remove();
    };
  }, []);
  return <div ref={host} className="background-scene" aria-hidden="true" />;
}


