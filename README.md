# Catálogo de Celulares Custo-Benefício 2026

Site com celulares de bom custo-benefício em 2026, organizados por faixa de preço (até R$ 7.000). Dá para buscar, filtrar, ordenar, favoritar, comparar até 3 modelos, ver detalhes, assistir a um vídeo de apresentação e sugerir um celular.

Projeto da disciplina **Desenvolvimento Front-End para Web**, construído aula a aula.

**Site publicado:** https://SEU-USUARIO.github.io/NOME-DO-REPOSITORIO/ (troque pelo link real após o deploy)

## Faixas de preço

| Faixa | Preço | Situação |
|---|---|---|
| Entrada | até R$ 1.500 | 3 modelos |
| Intermediário | R$ 1.500 a R$ 3.000 | 7 modelos |
| Intermediário superior | R$ 3.000 a R$ 5.000 | em pesquisa |
| Premium acessível | R$ 5.000 a R$ 7.000 | em pesquisa |

## Funcionalidades

- Filtro por faixa (botões e menu), busca por nome e ordenação por nota ou preço
- Favoritos salvos no `localStorage` (continuam após recarregar a página)
- Comparador de até 3 celulares, com tabela acessível
- Modal de detalhes (Bootstrap)
- Gráfico de notas em Canvas e selo em SVG
- Vídeo com MP4 e WebM, poster e legendas em português
- Formulário de sugestões com validação nativa e lista salva no navegador

## Tecnologias

HTML5 semântico, CSS3, JavaScript puro e Bootstrap 5.3.3 (via CDN, precisa de internet).

## Como rodar

Abra o `index.html` no navegador (ou use a extensão Live Server no VS Code).

## Estrutura

```
├── index.html
├── css/style.css
├── js/dados.js        (fichas dos celulares)
├── js/main.js         (lógica e interatividade)
├── assets/images/logo.svg
├── assets/media/      (vídeo, poster e legendas)
├── docs/entregas-por-aula.md
├── .gitignore
└── README.md
```

## Sobre os dados

Preços e fichas vêm de testes e listas publicados pelo Oficina da Net em jul/2026 e out/2026. Os preços mudam com frequência, então confira nas lojas. A nota é uma avaliação própria do catálogo (0 a 10), baseada em preço, tela, bateria, desempenho e atualizações.

Fontes:
- https://www.oficinadanet.com.br/topsmartphones/64420-top-10-celulares-ate-1500
- https://www.oficinadanet.com.br/topsmartphones/73012-melhores-celulares-custo-beneficio-outubro

## Autor

[Seu nome aqui]
