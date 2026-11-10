# MyHomepage

[![CI Pipeline](https://github.com/dreyvinixz/MyHomepage/actions/workflows/quality.yml/badge.svg)](https://github.com/dreyvinixz/MyHomepage/actions/workflows/quality.yml)
[![CodeQL Security](https://github.com/dreyvinixz/MyHomepage/actions/workflows/codeql.yml/badge.svg)](https://github.com/dreyvinixz/MyHomepage/actions/workflows/codeql.yml)
[![Node.js](https://img.shields.io/badge/Node.js-24%20LTS-339933?logo=nodedotjs&logoColor=white)](https://nodejs.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

Portfólio pessoal bilíngue de Andrey Souza, dedicado a engenharia de software, inteligência artificial e pesquisa. Inclui uma hero com partículas, árvore de habilidades, projetos, publicações, página de notas, perfil e contatos.

## Stack

React e TypeScript, Vite, Tailwind CSS, Three.js, GSAP e Vitest. A preferência de idioma e o consentimento de análise são guardados no navegador. As animações respeitam movimento reduzido e cenas de partículas pausam fora da tela.

## Desenvolvimento

Requer Node.js 24 LTS, indicado em `.nvmrc`.

```sh
npm ci
npm run dev
```

Para verificar e gerar a versão de produção:

```sh
npm test
npm run build
node scripts/check-build.mjs
npm run preview
```

## Analytics e privacidade

Copie `.env.example` para `.env` se quiser personalizar a configuração. O Google Analytics 4 usa `generic-key` por padrão e só carrega depois do aceite dos cookies; a escolha pode ser revista no rodapé ou na página de privacidade. `VITE_GA_MEASUREMENT_ID` pode substituir o ID no build. O ID é público, não uma credencial.

## Notas e publicações

Edite `src/content/updates.ts`. Cada publicação requer `slug` único, `date` no formato `YYYY-MM-DD`, `category` (`article`, `youtube`, `instagram`, `linkedin`) e `title`/`summary` em `en` e `pt`. Para links externos use `url`; para um artigo no site, omita `url` e forneça `body` como listas de parágrafos nos dois idiomas. Não há painel de edição ou publicação automática.

```ts
{
  slug: 'my-first-note', date: '2026-01-01', category: 'article',
  title: { en: 'My first note', pt: 'Minha primeira nota' },
  summary: { en: 'A short introduction.', pt: 'Uma breve introdução.' },
  body: { en: ['English paragraph.'], pt: ['Parágrafo em português.'] },
}
```

## CI e publicação

A CI executa instalação limpa, testes, build e verificação dos arquivos em Linux e Windows com Node 24, além de auditoria de dependências. O CodeQL analisa JavaScript e TypeScript. Consulte [implantação](docs/DEPLOYMENT.md), [arquitetura](docs/ARCHITECTURE.md) e [robots](ROBOTS.md). O domínio final e o ID do Analytics ainda precisam ser configurados.

## Licença e créditos

O código deste projeto está sob a [licença MIT](LICENSE). A foto pessoal, marcas e outros recursos de terceiros não são concedidos sob essa licença apenas por estarem no repositório. Partes do efeito visual são adaptadas do blog de Maxime Heckel, cuja licença está em [REFERENCE-LICENSE.txt](REFERENCE-LICENSE.txt). Inter é carregada pelo Google Fonts e Departure Mono pelo jsDelivr; veja suas licenças nos projetos originais. Ícones de tecnologias usam Simple Icons.
