import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import type { Language } from '../translations';
import { siPython, siTypescript, siJavascript, siHtml5, siCss, siC, siR, siReact, siNextdotjs, siTailwindcss, siVite, siSass, siPwa, siFastapi, siNodedotjs, siDiscorddotjs, siPostgresql, siClickhouse, siRedis, siSqlite, siSupabase, siTensorflow, siKeras, siScikitlearn, siPandas, siNumpy, siGooglegemini, siDocker, siGithubactions, siPytest, siEslint, siLinux, siGit, siGithub } from 'simple-icons';
import './SkillTree.css';
import { ParticleTree } from './ParticleTree';

type Skill = { name: string; icon?: { path: string } };
const branches: { id: string; index: string; en: string; pt: string; skills: Skill[] }[] = [
  { id: 'languages', index: '01', en: 'Languages', pt: 'Linguagens', skills: [{name:'Python',icon:siPython},{name:'TypeScript',icon:siTypescript},{name:'JavaScript',icon:siJavascript},{name:'HTML5',icon:siHtml5},{name:'CSS3',icon:siCss},{name:'C',icon:siC},{name:'R',icon:siR},{name:'SQL'}] },
  { id: 'frontend', index: '02', en: 'Frontend & Web', pt: 'Frontend e Web', skills: [{name:'React',icon:siReact},{name:'Next.js',icon:siNextdotjs},{name:'Tailwind CSS',icon:siTailwindcss},{name:'Vite',icon:siVite},{name:'Sass',icon:siSass},{name:'PWA',icon:siPwa}] },
  { id: 'backend', index: '03', en: 'Backend & APIs', pt: 'Backend e APIs', skills: [{name:'FastAPI',icon:siFastapi},{name:'Node.js',icon:siNodedotjs},{name:'Discord.js',icon:siDiscorddotjs},{name:'REST APIs'}] },
  { id: 'data', index: '04', en: 'Databases & Storage', pt: 'Bancos de Dados e Storage', skills: [{name:'PostgreSQL',icon:siPostgresql},{name:'ClickHouse',icon:siClickhouse},{name:'Redis',icon:siRedis},{name:'SQLite',icon:siSqlite},{name:'Supabase',icon:siSupabase},{name:'Dexie.js'}] },
  { id: 'ai', index: '05', en: 'Machine Learning, AI & Data', pt: 'Machine Learning, IA e Dados', skills: [{name:'TensorFlow',icon:siTensorflow},{name:'Keras',icon:siKeras},{name:'Scikit-Learn',icon:siScikitlearn},{name:'Pandas',icon:siPandas},{name:'NumPy',icon:siNumpy},{name:'Matplotlib'},{name:'OpenAI'},{name:'Gemini',icon:siGooglegemini}] },
  { id: 'devops', index: '06', en: 'DevOps, Testing & Automation', pt: 'DevOps, Testes e Automação', skills: [{name:'Docker',icon:siDocker},{name:'GitHub Actions',icon:siGithubactions},{name:'Pytest',icon:siPytest},{name:'ESLint',icon:siEslint},{name:'Linux',icon:siLinux},{name:'Git',icon:siGit},{name:'GitHub',icon:siGithub},{name:'Visual Studio'},{name:'VS Code'}] },
];

export function SkillTree({ language }: { language: Language }) {
  const pt = language === 'pt';
  const section = useRef<HTMLElement>(null);
  useEffect(() => {
    const root = section.current;
    if (!root) return;
    const media = gsap.matchMedia();
    let observer: IntersectionObserver | undefined;
    media.add('(prefers-reduced-motion: no-preference)', () => {
      const seen = new WeakSet<Element>();
      observer = new IntersectionObserver(entries => {
        for (const entry of entries) {
          if (!entry.isIntersecting || seen.has(entry.target)) continue;
          seen.add(entry.target);
          gsap.fromTo(entry.target, { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: .8, ease: 'power3.out', clearProps: 'opacity,transform' });
          if (entry.target.classList.contains('tree-cluster')) {
            gsap.fromTo(entry.target.querySelectorAll('li'), { opacity: 0, y: 12, scale: .96 }, { opacity: 1, y: 0, scale: 1, duration: .5, delay: .15, stagger: .06, ease: 'power2.out', clearProps: 'opacity,transform' });
          }
          observer?.unobserve(entry.target);
        }
      }, { threshold: .12 });
      root.querySelectorAll('.skill-heading, .tree-cluster, .tree-root, .skill-footnote').forEach(item => observer?.observe(item));
    });
    return () => { observer?.disconnect(); media.revert(); gsap.killTweensOf(root.querySelectorAll('.skill-heading, .tree-cluster, .tree-cluster li, .tree-root, .skill-footnote')); };
  }, []);
  return <section ref={section} id="skill-tree" className="skill-tree" aria-labelledby="skill-tree-title">
    <div className="skill-shell">
      <header className="skill-heading"><p className="skill-kicker">02 / {pt ? 'ÁREAS DE CONHECIMENTO' : 'AREAS OF PRACTICE'}</p><h2 id="skill-tree-title">{pt ? 'Árvore de habilidades' : 'Skill Tree'}<span>.</span></h2><p className="skill-description">{pt ? 'As ferramentas e ideias que crescem a partir da minha prática em engenharia e pesquisa.' : 'The tools and ideas growing from my work in engineering and research.'}</p></header>
      <div className="tree-illustration">
        <svg className="tree-art" viewBox="0 0 1000 1100" preserveAspectRatio="none" aria-hidden="true">
          <defs><linearGradient id="tree-light" x1="0" x2="0" y1="1" y2="0"><stop stopColor="#aab6c8"/><stop offset="1" stopColor="#ffffff"/></linearGradient><filter id="tree-glow"><feGaussianBlur stdDeviation="5"/></filter></defs>
          <g className="tree-glow" fill="none" stroke="#ffffff" filter="url(#tree-glow)"><path d="M500 1060 L500 817 M500 803 L500 760 M500 810 C500 760 370 725 235 650 M500 810 C500 760 630 725 765 650 M500 760 C500 640 345 570 235 430 M500 760 C500 640 655 570 765 430 M500 760 C500 500 390 350 235 210 M500 760 C500 500 610 350 765 210"/></g>
          <g className="tree-lines" fill="none" stroke="#ffffff"><path className="trunk" d="M500 1060 L500 817 M500 803 L500 760"/><path d="M500 810 C500 760 370 725 235 650 M500 810 C500 760 630 725 765 650 M500 760 C500 640 345 570 235 430 M500 760 C500 640 655 570 765 430 M500 760 C500 500 390 350 235 210 M500 760 C500 500 610 350 765 210"/></g>
          <g fill="#ffffff"><circle cx="500" cy="810" r="5"/><circle cx="235" cy="650" r="4"/><circle cx="765" cy="650" r="4"/><circle cx="235" cy="430" r="4"/><circle cx="765" cy="430" r="4"/><circle cx="235" cy="210" r="4"/><circle cx="765" cy="210" r="4"/></g>
        </svg>
        <ParticleTree />
        <div className="tree-canopy">{branches.map(branch => <article className={`tree-cluster tree-cluster-${branch.id}`} key={branch.id}><div className="cluster-head"><span className="cluster-index">{branch.index} / <span className="cluster-stars" aria-label={pt ? 'cinco estrelas' : 'five stars'}>{Array.from({ length: 5 }, (_, index) => <svg key={index} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" aria-hidden="true"><path d="m12 2.8 2.7 5.5 6.1.9-4.4 4.3 1 6.1L12 16.7l-5.4 2.9 1-6.1-4.4-4.3 6.1-.9L12 2.8Z" /></svg>)}</span></span><h3>{pt ? branch.pt : branch.en}</h3></div><ul>{branch.skills.map(skill => <li key={skill.name}>{skill.icon ? <svg viewBox="0 0 24 24" aria-hidden="true"><path d={skill.icon.path}/></svg> : <span className="skill-leaf" aria-hidden="true">✳</span>}<span>{skill.name}</span></li>)}</ul></article>)}</div>
        <div className="tree-root"><span className="tree-root-symbol" aria-hidden="true">✳</span><span><small>{pt ? 'RAIZ' : 'ROOT'}</small><strong>Software Engineering<br /><em>&</em> AI Research</strong></span></div>
      </div>
      <p className="skill-footnote">✳ {pt ? 'Uma árvore em evolução, alimentada por curiosidade e prática.' : 'An evolving tree, shaped by curiosity and practice.'}</p>
    </div>
  </section>;
}
