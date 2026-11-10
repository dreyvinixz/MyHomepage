import type { Language } from '../translations';
import './SkillTreeCards.css';

const branches = [
  { id: 'engineering', index: '01', en: 'Software Engineering', pt: 'Engenharia de Software', descEn: 'Building applications and dependable services.', descPt: 'Construção de aplicações e serviços confiáveis.', skills: ['Python', 'C++', 'FastAPI', 'APIs'] },
  { id: 'ai', index: '02', en: 'AI & Machine Learning', pt: 'IA e Aprendizado de Máquina', descEn: 'Models, experiments, and learning from data.', descPt: 'Modelos, experimentos e aprendizado a partir de dados.', skills: ['PyTorch', 'Machine Learning', 'Deep Learning', 'Time Series'] },
  { id: 'data', index: '03', en: 'Data & Infrastructure', pt: 'Dados e Infraestrutura', descEn: 'Tools for working with data and running systems.', descPt: 'Ferramentas para trabalhar com dados e executar sistemas.', skills: ['PostgreSQL', 'ClickHouse', 'Docker', 'Linux'] },
  { id: 'research', index: '04', en: 'Applied Research', pt: 'Pesquisa Aplicada', descEn: 'Investigating complex questions through experimentation.', descPt: 'Investigação de questões complexas por meio de experimentos.', skills: ['Financial ML', 'Complex Networks', 'RMT', 'Model Evaluation'] },
] as const;

export function SkillTreeCards({ language }: { language: Language }) {
  const pt = language === 'pt';
  return <section id="skill-tree" className="skill-tree" aria-labelledby="skill-tree-title">
    <div className="skill-shell">
      <div className="skill-heading"><div><p className="skill-kicker">01 / {pt ? 'ÁREAS DE CONHECIMENTO' : 'AREAS OF PRACTICE'}</p><h2 id="skill-tree-title">{pt ? 'Árvore de habilidades' : 'Skill Tree'}<span className="skill-heading-dot">.</span></h2></div><p>{pt ? 'Uma visão das áreas, ferramentas e ideias que conectam minha prática em engenharia e pesquisa.' : 'A map of the areas, tools, and ideas connecting my work in engineering and research.'}</p></div>
      <div className="tree-map">
        <div className="tree-root"><span className="tree-root-icon" aria-hidden="true">✳</span><div><span className="tree-root-label">{pt ? 'RAIZ / INTERESSES' : 'ROOT / INTERESTS'}</span><h3>Software Engineering <span>&</span> AI Research</h3></div></div>
        <div className="tree-branches">{branches.map(branch => <article className="tree-branch" id={`skills-${branch.id}`} key={branch.id}>
          <div className="branch-line" aria-hidden="true"><span /></div><div className="branch-card"><div className="branch-top"><span>{branch.index} / {pt ? 'ÁREA' : 'DOMAIN'}</span><span className="branch-cross" aria-hidden="true">↗</span></div><h3>{pt ? branch.pt : branch.en}</h3><p>{pt ? branch.descPt : branch.descEn}</p><ul aria-label={pt ? 'Tecnologias e tópicos' : 'Technologies and topics'}>{branch.skills.map(skill => <li key={skill}>{skill}</li>)}</ul></div>
        </article>)}</div>
      </div>
      <p className="skill-footnote"><span aria-hidden="true">✳</span> {pt ? 'Uma árvore em evolução, alimentada por curiosidade e prática.' : 'An evolving tree, shaped by curiosity and practice.'}</p>
    </div>
  </section>;
}
