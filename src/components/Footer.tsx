import { useEffect, useState } from 'react';
import type { Copy, Language } from '../translations';

export function Footer({ copy, language }: { copy: Copy; language: Language }) {
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

