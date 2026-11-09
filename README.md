# MyHomepage — Andrey Souza

Portfólio pessoal de engenharia de software, inteligência artificial e pesquisa científica.

## Conceito visual

**Scientific Futurism / Blue Editorial** — identidade autoral inspirada na atmosfera cromática e tipográfica do [blog de Maxime Heckel](https://blog.maximeheckel.com/), sem copiar seus componentes, textos, gráficos ou imagens. A homepage tem layout responsivo, visualização própria em Canvas 2D, conteúdo semântico e navegação acessível.

### Tipografia

- **Inter Variable**: fonte principal usada no blog de referência. Carregada via Google Fonts.
- **Departure Mono** (Helena Zhang, licença SIL OFL 1.1): usada em pequenas etiquetas e elementos técnicos. Carregada via jsDelivr do [repositório oficial](https://github.com/rektdeckard/departure-mono); nenhum arquivo de fonte é redistribuído aqui.
- **Fira Code**: fallback para caracteres técnicos e eventual exibição de código.

Fonte original de referência: [Fonts.tsx](https://github.com/MaximeHeckel/blog.maximeheckel.com/blob/main/core/components/Fonts.tsx).

## Executar localmente

Este primeiro MVP é um site estático, sem dependências ou build. Abra index.html em seu navegador ou sirva a pasta localmente com o comando:

    python3 -m http.server 8080

Acesse http://localhost:8080/.

## Publicar

Após revisar e integrar o Pull Request, o site pode ser hospedado no **GitHub Pages**: Settings → Pages → Deploy from a branch → main / root.

Também pode ser publicado no Cloudflare Pages ou Vercel como site estático (sem comando de build e com saída na raiz).

## Estrutura

- index.html — conteúdo, navegação e metadados.
- styles.css — design tokens, cores, tipografia, composições e responsividade.
- script.js — teclado, menu, filtros de projetos e visualização Canvas.
- favicon.svg — ícone original.
- .github/workflows/quality.yml — verificação básica em CI.

## Melhorias futuras

1. Revisar cada descrição e substituir as figuras ilustrativas por resultados originais da pesquisa.
2. Adicionar links públicos verificados para artigos, DOIs, experimentos e repositórios.
3. Completar os canais de contato, domínio e metadados públicos.
4. Criar estudos de caso individuais e artigos técnicos.
5. Migrar para Next.js + TypeScript + MDX quando o conteúdo justificar uma camada de renderização mais complexa.

**Aviso:** os gráficos e a rede da homepage são ilustrações originais para composição visual; não apresentam resultados experimentais ou dados financeiros reais.
