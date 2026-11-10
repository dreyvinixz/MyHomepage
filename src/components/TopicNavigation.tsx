import { useEffect, useState } from 'react';
import type { Language } from '../translations';

const topics = [
  { en: 'COMPUTING', pt: 'COMPUTAÇÃO', quoteEn: 'Computer science is no more about computers than astronomy is about telescopes.', quotePt: 'A ciência da computação não trata mais de computadores do que a astronomia trata de telescópios.', author: 'Edsger W. Dijkstra', source: 'https://www.cs.utexas.edu/~EWD/DijkstraMemorialLectures/Tony%20Hoare.html' },
  { en: 'RESEARCH', pt: 'PESQUISA', quoteEn: 'Not knowing is much more interesting than believing an answer which might be wrong.', quotePt: 'Não saber é muito mais interessante do que acreditar em uma resposta que pode estar errada.', author: 'Richard Feynman', source: 'https://calteches.library.caltech.edu/684/1/ES65.2.2002.pdf' },
  { en: 'SYSTEMS', pt: 'SISTEMAS', quoteEn: 'A system is any set of interconnected elements.', quotePt: 'Um sistema é qualquer conjunto de elementos interconectados.', author: 'Donella Meadows', source: 'https://donellameadows.org/wp-content/userfiles/Whole-Earth-Models-and-Systems.pdf' },
] as const;

export function TopicNavigation({ language }: { language: Language }) {
  const [selected, setSelected] = useState(0);
  useEffect(() => {
    const motion = matchMedia('(prefers-reduced-motion: reduce)');
    let timer = 0;
    const schedule = () => {
      window.clearTimeout(timer);
      if (!motion.matches && !document.hidden) timer = window.setTimeout(() => setSelected(current => (current + 1) % topics.length), 7000);
    };
    motion.addEventListener('change', schedule); document.addEventListener('visibilitychange', schedule); schedule();
    return () => { window.clearTimeout(timer); motion.removeEventListener('change', schedule); document.removeEventListener('visibilitychange', schedule); };
  }, [selected]);
  const pt = language === 'pt'; const topic = topics[selected];
  return <div className="topic-navigation"><div className="topic-links" aria-label={pt ? 'Áreas de interesse' : 'Areas of interest'}>{topics.map((item, index) => <span className="topic-item" key={item.en}>{index > 0 && <span className="topic-divider" aria-hidden="true"> / </span>}<button type="button" className="topic-link" aria-pressed={selected === index} onClick={() => setSelected(index)}>{pt ? item.pt : item.en}</button></span>)}</div><div className="topic-status" aria-live="off"><p key={topic.en} className="topic-quote">“{pt ? topic.quotePt : topic.quoteEn}” <a href={topic.source} target="_blank" rel="noopener noreferrer">— {topic.author}</a>{pt && <span className="topic-translation"> (tradução livre)</span>}</p></div></div>;
}
