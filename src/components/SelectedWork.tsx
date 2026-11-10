import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import type { Language } from '../translations';
import './SelectedWork.css';
import { WorkWave } from './WorkWave';
import { QuantBaseVisual } from './QuantBaseVisual';
import { FrameBridgeVisual } from './FrameBridgeVisual';
import { ServidorVisual } from './ServidorVisual';

const projects = [
  { id: '01', name: 'QuantBase', categoryEn: 'DATA PLATFORM', categoryPt: 'PLATAFORMA DE DADOS', titleEn: 'Financial data, built for exploration.', titlePt: 'Dados financeiros feitos para explorar.', en: 'A financial data platform focused on ingestion, processing, analytical storage, and access to structured information.', pt: 'Uma plataforma de dados financeiros voltada à ingestão, processamento, armazenamento analítico e acesso a informações estruturadas.', tags: ['Python', 'FastAPI', 'ClickHouse', 'Data Engineering'], url: 'https://quantbase.com.br', art: 'data' },
  { id: '02', name: 'FrameBridge', categoryEn: 'GRAPHICS & TOOLING', categoryPt: 'GRÁFICOS E FERRAMENTAS', titleEn: 'Connecting technologies across GPUs.', titlePt: 'Conectando tecnologias entre GPUs.', en: 'A community-driven OptiScaler fork exploring upscaling and frame generation, with an automated installer.', pt: 'Um fork comunitário do OptiScaler que reúne tecnologias de upscaling e geração de quadros, com instalador automatizado.', tags: ['C++', 'Graphics', 'Automation'], url: 'https://github.com/dreyvinixz/FrameBridge', art: 'frame' },
  { id: '03', name: 'ServidorBR', categoryEn: 'FULL-STACK APPLICATION', categoryPt: 'APLICAÇÃO FULL STACK', titleEn: 'Making public data easier to explore.', titlePt: 'Dados públicos mais fáceis de explorar.', en: 'A full-stack application for exploring public data about employees of Brazil’s federal executive branch.', pt: 'Uma aplicação full stack para explorar dados públicos de servidores do Poder Executivo Federal.', tags: ['Full Stack', 'Public Data', 'Web'], url: 'https://github.com/dreyvinixz/ServidorBR', art: 'public' },
] as const;

function ExternalArrow() {
  return <svg className="work-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M7 17 17 7M8 7h9v9" /></svg>;
}

export function SelectedWork({ language }: { language: Language }) {
  const pt = language === 'pt';
  const section = useRef<HTMLElement>(null);
  useEffect(() => {
    const root = section.current;
    if (!root) return;
    const media = gsap.matchMedia();
    let observer: IntersectionObserver | undefined;
    media.add('(prefers-reduced-motion: no-preference)', () => {
      observer = new IntersectionObserver(entries => entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        gsap.fromTo(entry.target, { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: .8, ease: 'power3.out', clearProps: 'opacity,transform' });
        observer?.unobserve(entry.target);
      }), { threshold: .1 });
      root.querySelectorAll('.work-heading, .work-card').forEach(el => observer?.observe(el));
    });
    return () => { observer?.disconnect(); media.revert(); gsap.killTweensOf(root.querySelectorAll('.work-heading, .work-card')); };
  }, []);
  return <section ref={section} id="selected-work" className="selected-work" aria-labelledby="work-title">
    <div className="work-shell">
      <header className="work-heading"><div><p className="work-kicker">02 / {pt ? 'PROJETOS EM DESTAQUE' : 'SELECTED WORK'}</p><h2 id="work-title">{pt ? 'Ideias em prática' : 'Ideas in practice'}<span>.</span></h2></div><p>{pt ? 'Uma seleção de projetos que transformam problemas em produtos, ferramentas e experiências.' : 'A selection of projects turning problems into products, tools, and experiences.'}</p></header>
      <div className="work-grid">{projects.map((project, index) => <article className={`work-card work-card-${project.art}`} key={project.id}>
        <div className="work-visual" aria-hidden="true">{project.art === 'data' ? <QuantBaseVisual /> : project.art === 'frame' ? <FrameBridgeVisual /> : <ServidorVisual />}<span className="work-visual-mark">✳</span></div>
        <div className="work-body"><WorkWave variant={index} /><div className="work-meta"><span>{pt ? project.categoryPt : project.categoryEn}</span><span>{project.id} / 03</span></div><h3>{project.name}</h3><p className="work-project-title">{pt ? project.titlePt : project.titleEn}</p><p className="work-description">{pt ? project.pt : project.en}</p><ul className="work-tags">{project.tags.map(tag => <li key={tag}>{tag}</li>)}</ul>{project.url && <a className="work-link" href={project.url} target="_blank" rel="noopener noreferrer">{project.art === 'data' ? (pt ? 'Visitar site' : 'View site') : (pt ? 'Ver repositório' : 'View repository')} <ExternalArrow /></a>}</div>
      </article>)}</div>
      <a className="work-all" href="https://github.com/dreyvinixz" target="_blank" rel="noopener noreferrer">{pt ? 'Explorar mais no GitHub' : 'Explore more on GitHub'} <ExternalArrow /></a>
    </div>
  </section>;
}
