# Entregas por aula

Cada aula tem seu próprio Pull Request (a cada rodada o revisor avalia o PR mais recente). Siga o calendário da turma: o projeto final está pronto, mas cada entrega deve conter o que a aula pede. Antes de cada PR, rode `git switch main && git pull`.

| Aula | Branch | O que mostrar | Commit sugerido |
|---|---|---|---|
| 1 | feature/git-github | README, .gitignore, commits descritivos | `chore: adiciona .gitignore` |
| 2 | feature/estrutura-inicial | pastas, HTML mínimo, sem erro no Console | `feat: adiciona estrutura inicial do projeto` |
| 3 | feature/semantica-formularios | semântica, labels, validação nativa | `feat: adiciona html semântico e formulário` |
| 4 | feature/multimidia | `<video>` com 2 `<source>`, poster, legenda | `feat: adiciona vídeo de apresentação` |
| 5 | feature/graficos | selo SVG e gráfico Canvas com fallback | `feat: adiciona selo svg e gráfico canvas` |
| 6 a 9 | feature/css-layout | CSS externo, box-sizing, navbar, formulário, JS de lógica | `style: ...` / `feat: ...` |
| 10 | feature/javascript-fundamentos | funções, `let`/`const`, teste no console | `feat: adiciona funções de classificação` |
| 11 | feature/dom-interatividade | DOMContentLoaded, localStorage, delegation, textContent | `feat: adiciona favoritos e filtros` |
| 12 | feature/bootstrap-integracao | bundle, modal, `col-md-*`, sem `!important` | `feat: integra bootstrap` |
| 13 | feature/componente-ia | comparador + prompts na descrição do PR | `feat: adiciona comparador de celulares` |
| 14 | feature/acessibilidade | Lighthouse antes/depois, 4+ correções comentadas | `fix: corrige problemas de acessibilidade` |
| 15 | feature/deploy | GitHub Pages, README com link, HTTPS | `docs: adiciona link do site publicado` |

As nomes de branch das Aulas 11 a 15 seguem o checklist do Guia do Aluno. Confira com o professor os das demais.

## Aula 13: prompts (preencha com o que você realmente rodar)

**Prompt vago:** `Crie um componente para comparar celulares.`
Resultado: [cole aqui o que a IA devolveu e anote a stack usada]

**Prompt reforçado:**
```
Crie um comparador de celulares em HTML, CSS e JavaScript puros (sem React ou Vue), usando Bootstrap 5.
Regras: no máximo 3 celulares; seleção por checkbox com label; tabela com caption e th scope;
deve funcionar só com teclado (Tab, Espaço, Enter); textos inseridos com textContent; sem innerHTML.
```
Resultado: [cole aqui] 
Comparação: [o que melhorou: stack, teclado, acessibilidade]

O comparador do projeto (`renderComparacao` em `js/main.js`) segue esse prompt reforçado.

## Aula 14: acessibilidade

1. Rode o Lighthouse (aba Accessibility) e anote a nota antes: [__]
2. Correções já comentadas no código (procure por `A11Y`): link de salto, botão real no menu, região `aria-live`, foco visível, nomes acessíveis nos botões dos cards.
3. Rode de novo e anote a nota depois: [__]

## Aula 15: deploy

1. No GitHub: Settings, Pages, Source: `main` / root.
2. Aguarde a URL `https://SEU-USUARIO.github.io/NOME-DO-REPOSITORIO/`.
3. Teste no site publicado: filtros, favoritos, comparador, vídeo, formulário. Confira o cadeado de HTTPS e o DevTools sem 404.
4. Cole o link no README.
