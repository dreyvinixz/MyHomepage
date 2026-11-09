import { useState } from 'react';
import type { Language } from '../translations';

export function TopicNavigation({ language }: { language: Language }) {
  const [selected, setSelected] = useState<number | null>(null);
  const names = language === 'pt' ? ['COMPUTAÇÃO', 'PESQUISA', 'SISTEMAS'] : ['COMPUTING', 'RESEARCH', 'SYSTEMS'];
  return <div className="topic-navigation">
    <nav className="topic-links" aria-label={language === 'pt' ? 'Áreas de interesse' : 'Areas of interest'}>
      {names.map((name, index) => <span className="topic-item" key={index}>{index > 0 && <span className="topic-divider" aria-hidden="true"> / </span>}<button type="button" className="topic-link" onClick={() => setSelected(index)} aria-describedby="topic-status">{name}</button></span>)}
    </nav>
    <p id="topic-status" role="status" className="topic-status">{selected === null ? '' : language === 'pt' ? `${names[selected]} — seção em breve.` : `${names[selected]} — section coming soon.`}</p>
  </div>;
}
