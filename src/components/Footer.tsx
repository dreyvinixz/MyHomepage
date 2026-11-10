import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { areAnimationsEnabled } from '../lib/motionPreference';
import type { Copy, Language } from '../translations';
import './Footer.css';
import { ArrowIcon } from './ArrowIcon';
import { CoffeeIcon } from './CoffeeIcon';

export function Footer({ copy, language }: { copy: Copy; language: Language }) {
  const [time, setTime] = useState(() => new Date());
  const [dimensions, setDimensions] = useState(() => `${window.innerWidth} × ${window.innerHeight}`);
  const footer = useRef<HTMLElement>(null);
  useEffect(() => {
    const timer = window.setInterval(() => setTime(new Date()), 1000);
    const resize = () => setDimensions(`${window.innerWidth} × ${window.innerHeight}`);
    window.addEventListener('resize', resize);
    return () => { window.clearInterval(timer); window.removeEventListener('resize', resize); };
  }, []);
  useEffect(() => {
    const root = footer.current; if (!root) return;
    const media = gsap.matchMedia(); let observer: IntersectionObserver | undefined;
    media.add('(prefers-reduced-motion: no-preference)', () => {
      observer = new IntersectionObserver(entries => entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        if (!areAnimationsEnabled()) { observer?.unobserve(entry.target); return; }
        gsap.fromTo(entry.target, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: .8, ease: 'power3.out', clearProps: 'opacity,transform' });
        observer?.unobserve(entry.target);
      }), { threshold: .1 });
      root.querySelectorAll('.footer-panel, .footer-signature-inner').forEach(element => observer?.observe(element));
    });
    return () => { observer?.disconnect(); media.revert(); gsap.killTweensOf(root.querySelectorAll('.footer-panel, .footer-signature-inner')); };
  }, []);
  const pt = language === 'pt';
  return <footer ref={footer} className="site-footer">
    <div className="footer-panel">
      <section className="footer-section" aria-labelledby="metadata-title"><h2 id="metadata-title">{copy.metadata}<span aria-hidden="true"> ✳</span></h2><dl className="footer-details footer-metadata">
        <div><dt>{copy.localTime}</dt><dd><time dateTime={time.toISOString()}>{time.toLocaleTimeString(pt ? 'pt-BR' : 'en-US')}</time></dd></div>
        <div><dt>{copy.dimensions}</dt><dd>{dimensions} px</dd></div>
        <div className="footer-stack"><dt>{copy.technologies}</dt><dd>React · TypeScript · Vite · Three.js · GSAP</dd></div>
      </dl></section>
      <section className="footer-section footer-links" aria-labelledby="links-title"><h2 id="links-title">{copy.links}<span aria-hidden="true"> ✳</span></h2><nav className="footer-details footer-nav" aria-label={pt ? 'Navegação do rodapé' : 'Footer navigation'}><a href="#inicio">{copy.home}</a><a href="#expertise">{pt ? 'Experiência técnica' : 'Technical Expertise'}</a><a href="#skill-tree">{pt ? 'Habilidades' : 'Skill Tree'}</a><a href="#selected-work">{pt ? 'Projetos' : 'Selected Work'}</a><a href="/privacy">{pt ? 'Privacidade' : 'Privacy'}</a><button className="footer-cookie-settings" type="button" onClick={() => window.dispatchEvent(new Event('open-cookie-settings'))}>{pt ? 'Configurações de cookies' : 'Cookie settings'}</button><a href="/updates">{pt ? 'Notas e novidades' : 'Notes & Updates'}</a><a href="#research">{pt ? 'Pesquisa' : 'Research'}</a><a href="#about">{pt ? 'Sobre e contato' : 'About & Contact'}</a><a href="https://github.com/dreyvinixz" target="_blank" rel="noopener noreferrer">GitHub <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden="true"><path d="M7 17 17 7M8 7h9v9"/></svg></a><a className="footer-support-link" href="https://buymeacoffee.com/andreyvinia" target="_blank" rel="noopener noreferrer"><CoffeeIcon />{pt ? 'Apoie meu trabalho' : 'Support my work'}</a></nav></section>
    </div>
    <div className="footer-signature"><div className="footer-signature-inner"><a href="#inicio" className="footer-logo" aria-label={copy.back}>a<span>✳</span></a><p>© {time.getFullYear()} Andrey Souza<br/><em>{copy.signature}</em></p><a className="footer-credit" href="https://github.com/MaximeHeckel/blog.maximeheckel.com" target="_blank" rel="noopener noreferrer">{pt ? 'Agradecimentos a Maxime Heckel pela inspiração' : 'With thanks to Maxime Heckel for the inspiration'}<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden="true"><path d="M7 17 17 7M8 7h9v9"/></svg></a><a className="footer-back" href="#inicio">{pt ? 'VOLTAR AO TOPO' : 'BACK TO TOP'} <ArrowIcon direction="up" /></a></div></div>
  </footer>;
}
