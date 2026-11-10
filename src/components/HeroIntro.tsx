import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import type { Copy, Language } from '../translations';
import { TopicNavigation } from './TopicNavigation';

export function HeroIntro({ copy, language }: { copy: Copy; language: Language }) {
  const root = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const element = root.current;
    if (!element) return;
    const media = gsap.matchMedia();
    media.add('(prefers-reduced-motion: no-preference)', () => {
      const timeline = gsap.timeline({ paused: true, defaults: { ease: 'power3.out' }, delay: .25 });
      timeline.from(element.querySelectorAll('[data-intro]'), { opacity: 0, y: 20, duration: .9, stagger: .16, clearProps: 'opacity,transform', immediateRender: true })
        .from(element.querySelector('[data-name]'), { color: '#96c8ff', textShadow: '0 0 18px rgba(124,196,255,.95)', duration: 1.1, clearProps: 'color,textShadow' }, '-=.65');
      let visible = false;
      const update = () => { if (visible && !document.hidden && timeline.progress() < 1) timeline.play(); else timeline.pause(); };
      const observer = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; update(); }, { threshold: .05 });
      observer.observe(element);
      document.addEventListener('visibilitychange', update);
      return () => { observer.disconnect(); document.removeEventListener('visibilitychange', update); timeline.kill(); };
    });
    return () => media.revert();
  }, []);
  return <div ref={root} className="intro-grid grid w-full max-w-2xl gap-7 md:grid-cols-2 md:gap-10">
    <div><div data-intro><TopicNavigation language={language} /></div><h1 data-intro className="text-3xl font-medium leading-tight tracking-tight md:text-4xl">{copy.heading}</h1><a data-intro className="hero-about-link" href="#about">{language === 'pt' ? 'Sobre e contato' : 'About & contact'}<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M7 17 17 7M8 7h9v9"/></svg></a></div>
    <div className="text-base leading-7 text-blue-100/80"><p data-intro>{copy.hello} <strong data-name className="hero-name">Andrey Souza</strong>{copy.intro}</p><p data-intro className="mt-4">{copy.description}</p></div>
  </div>;
}
