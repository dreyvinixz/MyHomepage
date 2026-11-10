import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { areAnimationsEnabled } from '../lib/motionPreference';
import type { Language } from '../translations';
import './ExpertiseSection.css';
import { ParticleFlow } from './ParticleFlow';
import { ExpertiseAmbient } from './ExpertiseAmbient';

const domains = [
  { id: '01', en: 'Software & APIs', pt: 'Software e APIs', descEn: 'Building applications and services that organize data and make it accessible.', descPt: 'Construção de aplicações e serviços que organizam dados e os tornam acessíveis.', tags: ['Python', 'FastAPI', 'Node.js', 'REST APIs'], refEn: 'EXPLORE / QUANTBASE', refPt: 'EXPLORAR / QUANTBASE', href: '#selected-work' },
  { id: '02', en: 'Machine Learning & Research', pt: 'Machine Learning e Pesquisa', descEn: 'Exploring predictive models, feature selection, optimization, and temporal validation.', descPt: 'Exploração de modelos preditivos, seleção de características, otimização e validação temporal.', tags: ['PyTorch', 'TensorFlow', 'Scikit-Learn', 'NumPy'], refEn: 'EXPLORE / RESEARCH', refPt: 'EXPLORAR / PESQUISA', href: '#research' },
  { id: '03', en: 'Data & Infrastructure', pt: 'Dados e Infraestrutura', descEn: 'Working with databases, analytical storage, reproducible workflows, and containers.', descPt: 'Trabalho com bancos de dados, armazenamento analítico, fluxos reproduzíveis e contêineres.', tags: ['PostgreSQL', 'ClickHouse', 'Docker', 'Linux'], refEn: 'EXPLORE / SKILL TREE', refPt: 'EXPLORAR / HABILIDADES', href: '#skill-tree' },
  { id: '04', en: 'Frontend & Experiences', pt: 'Frontend e Experiências', descEn: 'Creating responsive interfaces and interactive experiences for the web.', descPt: 'Criação de interfaces responsivas e experiências interativas para a web.', tags: ['React', 'TypeScript', 'Tailwind CSS', 'Vite'], refEn: 'EXPLORE / PROJECTS', refPt: 'EXPLORAR / PROJETOS', href: '#selected-work' },
] as const;
export function ExpertiseSection({ language }: { language: Language }) {
  const pt = language === 'pt'; const section = useRef<HTMLElement>(null);
  useEffect(() => {
    const root = section.current; if (!root) return;
    const media = gsap.matchMedia(); let observer: IntersectionObserver | undefined;
    media.add('(prefers-reduced-motion: no-preference)', () => {
      observer = new IntersectionObserver(entries => entries.forEach(entry => { if (!entry.isIntersecting) return; if (!areAnimationsEnabled()) { observer?.unobserve(entry.target); return; } gsap.fromTo(entry.target, { opacity: 0, y: 18 }, { opacity: 1, y: 0, duration: .7, ease: 'power3.out', clearProps: 'opacity,transform' }); observer?.unobserve(entry.target); }), { threshold: .1 });
      root.querySelectorAll('.expertise-heading, .expertise-row').forEach(item => observer?.observe(item));
    });
    return () => { observer?.disconnect(); media.revert(); gsap.killTweensOf(root.querySelectorAll('.expertise-heading, .expertise-row')); };
  }, []);
  return <section ref={section} className="expertise" id="expertise" aria-labelledby="expertise-title"><ParticleFlow /><div className="expertise-shell">
    <header className="expertise-heading"><div><p className="expertise-kicker">01 / {pt ? 'EXPERIÊNCIA TÉCNICA' : 'TECHNICAL EXPERTISE'}</p><h2 id="expertise-title">{pt ? 'Da teoria à prática' : 'From theory to practice'}<span>.</span></h2></div><p>{pt ? 'Áreas que conectam minhas ferramentas aos problemas que gosto de explorar.' : 'The areas connecting my tools to the problems I like to explore.'}</p></header>
    <div className="expertise-list">{domains.map(domain => <article className="expertise-row" key={domain.id}><div className="expertise-number">{domain.id} <span aria-hidden="true">✳</span></div><div><h3>{pt ? domain.pt : domain.en}</h3><p>{pt ? domain.descPt : domain.descEn}</p><div className="expertise-tags">{domain.tags.map(tag => <span key={tag}>{tag}</span>)}</div></div><a href={domain.href}>{pt ? domain.refPt : domain.refEn}<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true"><path d="M7 17 17 7M8 7h9v9"/></svg></a></article>)}</div>
    <ExpertiseAmbient />
  </div></section>;
}
