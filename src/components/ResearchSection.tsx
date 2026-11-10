import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { areAnimationsEnabled } from '../lib/motionPreference';
import { siPython, siR } from 'simple-icons';
import type { Language } from '../translations';
import './ResearchSection.css';
import { ArrowIcon } from './ArrowIcon';

type Entry = { title: string; meta: string; href: string; tags: string[]; extra?: string };
const groups: { heading: string; entries: Entry[] }[] = [
  { heading: '2026', entries: [{ title: 'Impact of Feature Selection and Genetic Algorithms on Machine Learning Performance for Intraday Financial Trend Prediction', meta: 'ICEIS 2026 · SCITEPRESS', href: 'https://www.scitepress.org/PublicationsDetail.aspx?ID=%2FRtIAFuiVC8%3D&t=1', tags: ['Machine Learning', 'Genetic Algorithms', 'Feature Selection'] }] },
  { heading: '2025', entries: [{ title: 'Predictive Analysis with Technical Indicators and Features Selection for Futures Contracts Trading', meta: 'ICCSA 2025 · SPRINGER', href: 'https://doi.org/10.1007/978-3-031-96997-3_22', tags: ['Machine Learning', 'Feature Selection', 'Time Series'] }] },
  { heading: 'research', entries: [
    { title: 'RMT, Planar Networks & Volatility', meta: 'RESEARCH CODE', href: 'https://github.com/dreyvinixz/RMT_Planar_Networks_Volatility_Forecasting_Brazil', tags: ['RMT', 'Networks', 'Machine Learning', 'Python'] },
    { title: 'BovDB — Stock Quotes Dataset for Machine Learning', meta: 'DATASET · CONTRIBUTION', href: 'https://github.com/Ginfofinance/BovDBrepository', extra: 'https://doi.org/10.7910/DVN/TMB4IG', tags: ['Data', 'Machine Learning', 'Python'] },
    { title: 'NCA Optimizer Benchmark', meta: 'RESEARCH IN PROGRESS', href: 'https://github.com/dreyvinixz/nca-optimizer-benchmark', tags: ['Deep Learning', 'Optimization', 'Time Series'] },
    { title: 'Exploratory & Correlation Analysis', meta: 'ANALYSIS · CODE', href: 'https://github.com/dreyvinixz/Exploratory-and-Correlation-Analysis', tags: ['Statistics', 'Time Series', 'R'] },
    { title: 'Chess-AI — Neural Policy & Value Network', meta: 'RESEARCH CODE', href: 'https://github.com/dreyvinixz/Chess-AI', tags: ['Deep Learning', 'Neural Networks', 'Python'] },
    { title: 'Anomaly Detection — DARPA 1999', meta: 'ACADEMIC PROJECT · CODE', href: 'https://github.com/dreyvinixz/Anomaly_Detection', tags: ['Anomaly Detection', 'Network Security', 'Python'] },
  ] },
];
function Tags({ items }: { items: string[] }) {
  return <div className="research-tags">{items.map(item => <span key={item}>{item === 'Python' || item === 'R' ? <svg viewBox="0 0 24 24" aria-hidden="true"><path d={item === 'Python' ? siPython.path : siR.path}/></svg> : <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true"><circle cx="5" cy="6" r="2"/><circle cx="19" cy="6" r="2"/><circle cx="12" cy="18" r="2"/><path d="M7 7l4 9M17 7l-4 9M7 6h10"/></svg>}{item}</span>)}</div>;
}
export function ResearchSection({ language }: { language: Language }) {
  const pt = language === 'pt'; const translatedMeta: Record<string, string> = { 'RESEARCH CODE': 'CÓDIGO DE PESQUISA', 'DATASET · CONTRIBUTION': 'DATASET · CONTRIBUIÇÃO', 'RESEARCH IN PROGRESS': 'PESQUISA EM DESENVOLVIMENTO', 'ANALYSIS · CODE': 'ANÁLISE · CÓDIGO', 'ACADEMIC PROJECT · CODE': 'PROJETO ACADÊMICO · CÓDIGO' }; const section = useRef<HTMLElement>(null);
  useEffect(() => {
    const root = section.current; if (!root) return;
    const media = gsap.matchMedia(); let observer: IntersectionObserver | undefined;
    media.add('(prefers-reduced-motion: no-preference)', () => {
      observer = new IntersectionObserver(entries => entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        if (!areAnimationsEnabled()) { observer?.unobserve(entry.target); return; }
        gsap.fromTo(entry.target, { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: .65, ease: 'power3.out', clearProps: 'opacity,transform' });
        observer?.unobserve(entry.target);
      }), { threshold: .1 });
      root.querySelectorAll('.research-heading, .research-group h3, .research-row').forEach(item => observer?.observe(item));
    });
    return () => { observer?.disconnect(); media.revert(); gsap.killTweensOf(root.querySelectorAll('.research-heading, .research-group h3, .research-row')); };
  }, []);
  return <section ref={section} id="research" className="research-section" aria-labelledby="research-title"><div className="research-shell">
    <header className="research-heading"><p className="research-kicker">04 / {pt ? 'PESQUISA E PUBLICAÇÕES' : 'RESEARCH & PUBLICATIONS'}</p><h2 id="research-title">{pt ? 'Perguntas que movem ideias' : 'Questions that move ideas'}<span>.</span></h2><p className="research-intro">{pt ? 'Pesquisa aplicada na interseção de inteligência artificial, dados e mercados financeiros.' : 'Applied research at the intersection of artificial intelligence, data, and financial markets.'}</p></header>
    <div className="research-list">{groups.map(group => <section className="research-group" key={group.heading}><h3>{group.heading === 'research' ? (pt ? 'PESQUISA E CONTRIBUIÇÕES' : 'RESEARCH & CONTRIBUTIONS') : group.heading}</h3><div>{group.entries.map(entry => <article className="research-row" key={entry.title}><div className="research-row-main"><a className="research-row-title" href={entry.href} target="_blank" rel="noopener noreferrer">{entry.title}<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden="true"><path d="M7 17 17 7M8 7h9v9"/></svg></a><Tags items={entry.tags}/>{entry.extra && <a className="research-dataset" href={entry.extra} target="_blank" rel="noopener noreferrer">Harvard Dataverse <ArrowIcon /></a>}</div><span className="research-row-meta">{pt ? (translatedMeta[entry.meta] ?? entry.meta) : entry.meta}</span></article>)}</div></section>)}</div>
  </div></section>;
}
