import { StrictMode, useEffect, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import * as THREE from 'three';
import './style.css';

// Background scene adapted from Maxime Heckel's blog (MIT); see REFERENCE-LICENSE.txt.
function BackgroundScene() {
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
    const grid = new THREE.GridHelper(50, 120);
    grid.rotation.x = -Math.PI / 2;
    grid.position.z = -4.5;
    const gridMaterial = new THREE.LineBasicMaterial({ color: '#ffffff', transparent: true, opacity: .02 });
    const originalMaterial = grid.material;
    grid.material = gridMaterial;
    scene.add(grid);
    const resize = () => {
      const width = element.clientWidth, height = element.clientHeight;
      if (!width || !height) return;
      renderer.setSize(width, height);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.render(scene, camera);
    };
    const observer = new ResizeObserver(resize);
    observer.observe(element);
    resize();
    return () => {
      observer.disconnect(); planeGeometry.dispose(); planeMaterial.dispose();
      grid.geometry.dispose(); gridMaterial.dispose();
      (Array.isArray(originalMaterial) ? originalMaterial : [originalMaterial]).forEach(material => material.dispose());
      renderer.dispose(); renderer.domElement.remove();
    };
  }, []);
  return <div ref={host} className="background-scene" aria-hidden="true" />;
}

type Language = 'en' | 'pt';
const translations = {
  en: { eyebrow: 'COMPUTING / RESEARCH / SYSTEMS', nav: 'Main navigation', home: 'Home', homeLabel: 'Andrey Souza, home', back: 'Back to top', language: 'Language', heading: 'Where engineering meets intelligence.', hello: 'Hello, I’m', intro: '. I explore the connections between software engineering, artificial intelligence, and applied research.', description: 'A space for ideas, experiments, and systems built with curiosity.', metadata: 'Metadata', localTime: 'Local time', dimensions: 'Dimensions', technologies: 'Technologies', links: 'Links', signature: 'Designed and built in Brazil', meta: 'Andrey Souza — engineering, artificial intelligence, and research.' },
  pt: { eyebrow: 'COMPUTAÇÃO / PESQUISA / SISTEMAS', nav: 'Navegação principal', home: 'Início', homeLabel: 'Andrey Souza, início', back: 'Voltar ao início', language: 'Idioma', heading: 'Onde a engenharia encontra a inteligência.', hello: 'Olá, eu sou', intro: '. Exploro as conexões entre engenharia de software, inteligência artificial e pesquisa aplicada.', description: 'Um espaço para ideias, experimentos e sistemas construídos com curiosidade.', metadata: 'Metadados', localTime: 'Horário local', dimensions: 'Dimensões', technologies: 'Tecnologias', links: 'Links', signature: 'Projetado e construído no Brasil', meta: 'Andrey Souza — engenharia, inteligência artificial e pesquisa.' },
} as const;
type Copy = (typeof translations)[Language];

function Footer({ copy, language }: { copy: Copy; language: Language }) {
  const [time, setTime] = useState(() => new Date());
  const [dimensions, setDimensions] = useState(() => `${window.innerWidth} × ${window.innerHeight}`);
  useEffect(() => {
    const timer = window.setInterval(() => setTime(new Date()), 1000);
    const resize = () => setDimensions(`${window.innerWidth} × ${window.innerHeight}`);
    window.addEventListener('resize', resize);
    return () => { window.clearInterval(timer); window.removeEventListener('resize', resize); };
  }, []);
  return <footer className="site-footer">
    <div className="footer-panel">
      <section className="footer-section" aria-labelledby="metadata-title">
        <h2 id="metadata-title">{copy.metadata}</h2>
        <div className="footer-details">
          <div><h3>{copy.localTime}</h3><time>{time.toLocaleTimeString(language === 'pt' ? 'pt-BR' : 'en-US')}</time></div>
          <div><h3>{copy.dimensions}</h3><span>{dimensions}</span></div>
          <div><h3>{copy.technologies}</h3><span>React · Vite · Three.js</span></div>
        </div>
      </section>
      <section className="footer-section footer-links" aria-labelledby="links-title">
        <h2 id="links-title">{copy.links}</h2>
        <div className="footer-details"><a href="#inicio">{copy.home}</a><a href="https://github.com/dreyvinixz" target="_blank" rel="noopener noreferrer">GitHub ↗</a></div>
      </section>
    </div>
    <div className="footer-signature"><div className="footer-signature-inner"><a href="#inicio" className="footer-logo" aria-label={copy.back}>a<span>✳</span></a><p>© {time.getFullYear()} Andrey Souza<br /><em>{copy.signature}</em></p></div></div>
  </footer>;
}

function App() {
  const [language, setLanguage] = useState<Language>(() => {
    try { return localStorage.getItem('homepage-language') === 'pt' ? 'pt' : 'en'; } catch { return 'en'; }
  });
  const copy = translations[language];
  useEffect(() => {
    document.documentElement.lang = language === 'pt' ? 'pt-BR' : 'en';
    document.querySelector('meta[name="description"]')?.setAttribute('content', copy.meta);
    try { localStorage.setItem('homepage-language', language); } catch { /* Storage may be unavailable. */ }
  }, [language, copy]);
  return <><main className="hero relative isolate flex min-h-screen flex-col items-center overflow-hidden px-6 text-white">
    <BackgroundScene />
    <header className="relative z-10 mt-8"><nav aria-label={copy.nav} className="flex items-center gap-6 rounded-xl border border-white/15 bg-white/10 px-5 py-3 text-sm font-medium backdrop-blur-xl"><a href="#inicio" className="brand" aria-label={copy.homeLabel}>a<span>✳</span></a><span className="h-5 w-px bg-white/25"/><a href="#inicio" className="nav-link">{copy.home}</a><a href="https://github.com/dreyvinixz" target="_blank" rel="noreferrer" className="nav-link">GitHub ↗</a><label className="language-picker"><span className="sr-only">{copy.language}</span><select aria-label={copy.language} value={language} onChange={event => setLanguage(event.target.value as Language)}><option value="en">EN</option><option value="pt">PT</option></select></label></nav></header>
    <section id="inicio" className="relative z-10 flex w-full max-w-5xl flex-1 flex-col items-center justify-center pb-20">
      <div className="hero-space" aria-hidden="true" />
      <div className="intro-grid grid w-full max-w-2xl gap-7 md:grid-cols-2 md:gap-10"><div><p className="mb-3 text-sm text-blue-200">{copy.eyebrow}</p><h1 className="text-3xl font-medium leading-tight tracking-tight md:text-4xl">{copy.heading}</h1></div><div className="text-base leading-7 text-blue-100/80"><p>{copy.hello} <strong className="font-medium text-white">Andrey Souza</strong>{copy.intro}</p><p className="mt-4">{copy.description}</p></div></div>
    </section>
  </main><Footer copy={copy} language={language} /></>;
}

createRoot(document.getElementById('root')!).render(<StrictMode><App /></StrictMode>);

