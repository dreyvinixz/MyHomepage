import { useEffect, useState } from 'react';
import { BackgroundScene } from './components/BackgroundScene';
import { PiParticles } from './components/PiParticles';
import { Footer } from './components/Footer';
import { translations, type Language } from './translations';

export function App() {
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
      <PiParticles />
      <div className="intro-grid grid w-full max-w-2xl gap-7 md:grid-cols-2 md:gap-10"><div><p className="mb-3 text-sm text-blue-200">{copy.eyebrow}</p><h1 className="text-3xl font-medium leading-tight tracking-tight md:text-4xl">{copy.heading}</h1></div><div className="text-base leading-7 text-blue-100/80"><p>{copy.hello} <strong className="font-medium text-white">Andrey Souza</strong>{copy.intro}</p><p className="mt-4">{copy.description}</p></div></div>
    </section>
  </main><Footer copy={copy} language={language} /></>;
}

