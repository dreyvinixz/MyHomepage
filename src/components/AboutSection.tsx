import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { areAnimationsEnabled } from '../lib/motionPreference';
import { siX, siInstagram, siYoutube, siOrcid, siWhatsapp, siGithub } from 'simple-icons';
import type { Language } from '../translations';
import './AboutSection.css';
import { ArrowIcon } from './ArrowIcon';
import { CoffeeIcon } from './CoffeeIcon';

const linkedin = 'M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.94v5.666H9.35V9h3.414v1.561h.049c.476-.9 1.637-1.85 3.37-1.85 3.602 0 4.268 2.37 4.268 5.455v6.286zM5.337 7.433a2.062 2.062 0 1 1 0-4.124 2.062 2.062 0 0 1 0 4.124zM7.119 20.452H3.554V9h3.565v11.452z';
const links = [
  { label:'X / Twitter', handle:'@dreycodetaday', href:'https://x.com/dreycodetaday', path:siX.path },
  { label:'Instagram', handle:'@drey_vinixz', href:'https://www.instagram.com/drey_vinixz/', path:siInstagram.path },
  { label:'YouTube', handle:'@CTWhynotToday', href:'https://www.youtube.com/channel/UCkIvBD69tK-1jGkipcNqRNg', path:siYoutube.path },
  { label:'LinkedIn', handle:'Andrey Vinicius', href:'https://www.linkedin.com/in/andrey-vinicius-073711257/', path:linkedin },
  { label:'ORCID', handle:'0009-0006-4177-758X', href:'https://orcid.org/0009-0006-4177-758X', path:siOrcid.path },
  { label:'GitHub', handle:'@dreyvinixz', href:'https://github.com/dreyvinixz', path:siGithub.path },
];
export function AboutSection({ language }: { language: Language }) {
  const pt = language === 'pt'; const section = useRef<HTMLElement>(null);
  const buyMeACoffee = 'https://buymeacoffee.com/andreyvinia';
  const message = pt ? 'Olá, Andrey! Encontrei seu site e gostaria de conversar sobre uma possível colaboração.' : 'Hi Andrey! I found your website and would like to discuss a potential collaboration.';
  const whatsapp = `https://wa.me/5594991273989?text=${encodeURIComponent(message)}`;
  useEffect(() => {
    const root = section.current; if (!root) return;
    const media = gsap.matchMedia(); let observer: IntersectionObserver | undefined;
    media.add('(prefers-reduced-motion: no-preference)', () => {
      observer = new IntersectionObserver(entries => entries.forEach(entry => { if (!entry.isIntersecting) return; if (!areAnimationsEnabled()) { observer?.unobserve(entry.target); return; } gsap.fromTo(entry.target, { opacity:0, y:20 }, { opacity:1, y:0, duration:.8, ease:'power3.out', clearProps:'opacity,transform' }); observer?.unobserve(entry.target); }), { threshold:.1 });
      root.querySelectorAll('.about-heading, .about-profile, .about-contact').forEach(item => observer?.observe(item));
    });
    return () => { observer?.disconnect(); media.revert(); gsap.killTweensOf(root.querySelectorAll('.about-heading, .about-profile, .about-contact')); };
  }, []);
  return <section ref={section} id="about" className="about-section" aria-labelledby="about-title"><div className="about-shell">
    <header className="about-heading"><p className="about-label">05 / {pt ? 'SOBRE E CONTATO' : 'ABOUT & CONTACT'}</p><h2 id="about-title">{pt ? 'Vamos nos conectar' : 'Let’s connect'}<span>.</span></h2><p>{pt ? 'Pessoas, ideias e boas perguntas fazem parte do processo.' : 'People, ideas, and good questions are part of the process.'}</p></header>
    <div className="about-profile"><div className="about-photo"><img src="/profile/andrey-souza.png" alt={pt ? 'Retrato de Andrey Souza' : 'Portrait of Andrey Souza'} loading="lazy" width="1086" height="1448" /></div><div className="about-copy"><p className="about-label">{pt ? 'OLÁ, EU SOU' : 'HELLO, I’M'}</p><h3>Andrey Souza<span>✳</span></h3><p>{pt ? 'Sou brasileiro, estudante de Engenharia de Computação na FURG. Trabalho entre engenharia de software, ciência de dados e inteligência artificial, construindo sistemas e explorando problemas de pesquisa.' : 'I’m a computer engineering student at FURG, based in Brazil. I work across software engineering, data science, and artificial intelligence, building systems and exploring research questions.'}</p><div className="about-facts"><div><span>{pt ? 'FORMAÇÃO' : 'EDUCATION'}</span><p>{pt ? 'Engenharia de Computação · FURG' : 'Computer Engineering · FURG'}</p></div><div><span>{pt ? 'EXPERIÊNCIA' : 'EXPERIENCE'}</span><p>{pt ? 'Pesquisa em ML financeiro, contribuição ao BovDB e desenvolvimento de software.' : 'Financial ML research, BovDB contributions, and software development.'}</p></div><div><span>{pt ? 'LOCALIZAÇÃO' : 'LOCATION'}</span><p>{pt ? 'Brasil' : 'Brazil'}</p></div></div></div></div>
    <div className="about-contact"><div className="about-contact-heading"><div><p className="about-label">{pt ? 'ENCONTRE-ME' : 'FIND ME'}</p><h3>{pt ? 'Uma conversa pode iniciar algo novo.' : 'A conversation can start something new.'}</h3></div><a className="about-whatsapp" href={whatsapp} target="_blank" rel="noopener noreferrer"><svg viewBox="0 0 24 24" aria-hidden="true"><path d={siWhatsapp.path}/></svg>{pt ? 'Conversar no WhatsApp' : 'Chat on WhatsApp'}<ArrowIcon /></a></div><div className="about-socials">{links.map(link => <a key={link.label} href={link.href} target="_blank" rel="noopener noreferrer"><svg viewBox="0 0 24 24" aria-hidden="true"><path d={link.path}/></svg><span><strong>{link.label}</strong><small>{link.handle}</small></span><ArrowIcon className="social-arrow" /></a>)}</div>
      <div className="about-support"><div className="about-support-copy"><p className="about-label">{pt ? 'APOIE O MEU TRABALHO' : 'SUPPORT MY WORK'}</p><h4>{pt ? 'Gostou do que estou construindo?' : 'Enjoying what I’m building?'}</h4><p>{pt ? 'Seu apoio ajuda a manter meus projetos, pesquisas e conteúdo técnico.' : 'Your support helps me keep building projects, research, and technical content.'}</p><a className="about-support-button" href={buyMeACoffee} target="_blank" rel="noopener noreferrer"><CoffeeIcon />{pt ? 'Apoie no Buy Me a Coffee' : 'Support on Buy Me a Coffee'}<ArrowIcon /></a></div><a className="about-support-qr" href={buyMeACoffee} target="_blank" rel="noopener noreferrer" aria-label={pt ? 'Abrir Buy Me a Coffee usando o QR code' : 'Open Buy Me a Coffee from the QR code'}><img src="/support/buymeacoffee-qr.png" alt={pt ? 'QR code para apoiar Andrey Souza no Buy Me a Coffee' : 'QR code to support Andrey Souza on Buy Me a Coffee'} loading="lazy" width="1600" height="1600" /></a></div>
    </div>
  </div></section>;
}
