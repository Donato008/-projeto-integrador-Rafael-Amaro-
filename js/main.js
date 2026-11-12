// main.js — Aulas 9 a 14: lógica, funções, DOM, localStorage, Bootstrap, comparador e acessibilidade.
// Aula 11: todo o código roda dentro de DOMContentLoaded (e o script usa defer).
document.addEventListener('DOMContentLoaded', function () {
  'use strict';

  const CHAVE_FAVORITOS = 'catalogo-celulares:favoritos';
  const CHAVE_SUGESTOES = 'catalogo-celulares:sugestoes';
  const MAX_COMPARAR = 3;

  const FAIXAS = {
    'entrada': { nome: 'Entrada', cor: '#0f766e' },
    'intermediario': { nome: 'Intermediário', cor: '#9a5b00' },
    'intermediario-superior': { nome: 'Intermediário superior', cor: '#1d4ed8' },
    'premium-acessivel': { nome: 'Premium acessível', cor: '#6d28d9' }
  };

  const estado = { faixa: 'todas', busca: '', ordem: 'nota', soFavoritos: false, comparar: [] };

  // ---------- Funções utilitárias (Aula 10) ----------
  function classificarFaixa(preco) {
    if (preco <= 1500) return 'entrada';
    if (preco <= 3000) return 'intermediario';
    if (preco <= 5000) return 'intermediario-superior';
    return 'premium-acessivel';
  }
  const formatarPreco = (valor) => valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  const formatarNota = (nota) => nota.toFixed(1).replace('.', ',');
  const buscarCelular = (id) => CELULARES.find((celular) => celular.id === id);
  const $ = (seletor) => document.querySelector(seletor);

  // Cria um elemento com texto seguro (sempre via textContent)
  function el(tag, texto, classe) {
    const elemento = document.createElement(tag);
    if (texto !== undefined) elemento.textContent = texto;
    if (classe) elemento.className = classe;
    return elemento;
  }

  // ---------- Persistência (Aula 11) ----------
  function lerStorage(chave) {
    try {
      const bruto = localStorage.getItem(chave);
      const valor = bruto ? JSON.parse(bruto) : [];
      return Array.isArray(valor) ? valor : [];
    } catch (erro) {
      return [];
    }
  }
  function salvarStorage(chave, valor) {
    try { localStorage.setItem(chave, JSON.stringify(valor)); } catch (erro) { /* sem storage: segue em memória */ }
  }

  let favoritos = lerStorage(CHAVE_FAVORITOS);
  let sugestoes = lerStorage(CHAVE_SUGESTOES);
  CELULARES.forEach((celular) => { celular.faixa = classificarFaixa(celular.preco); });

  const lista = $('#lista');
  const resultado = $('#resultado');
  const vazio = $('#vazio');
  const comparacao = $('#comparacao');
  const avisoComparar = $('#aviso-comparar');

  // ---------- Catálogo ----------
  function celularesVisiveis() {
    const termo = estado.busca.trim().toLowerCase();
    return CELULARES
      .filter((c) => estado.faixa === 'todas' || c.faixa === estado.faixa)
      .filter((c) => c.nome.toLowerCase().includes(termo))
      .filter((c) => !estado.soFavoritos || favoritos.includes(c.id))
      .sort((a, b) => (estado.ordem === 'preco' ? a.preco - b.preco : b.nota - a.nota));
  }

  function definirEstadoFavorito(botao, ativo) {
    botao.setAttribute('aria-pressed', String(ativo));
    botao.replaceChildren();
    const estrela = el('span', ativo ? '★ ' : '☆ ');
    estrela.setAttribute('aria-hidden', 'true');
    botao.append(estrela, 'Favorito');
  }

  function criarCard(c) {
    const coluna = el('div', undefined, 'col-12 col-md-6 col-lg-4');
    const card = el('article', undefined, 'card card-celular h-100');
    const corpo = el('div', undefined, 'card-body d-flex flex-column');

    const topo = el('div', undefined, 'd-flex justify-content-between align-items-start gap-2');
    const nota = el('span', undefined, 'nota-badge');
    nota.append(el('span', 'Nota ', 'visually-hidden'), formatarNota(c.nota));
    topo.append(el('h3', c.nome, 'h5 card-title mb-0'), nota);

    const tag = el('span', FAIXAS[c.faixa].nome, 'faixa-tag faixa-' + c.faixa);
    const preco = el('p', formatarPreco(c.preco), 'preco');
    const dataPreco = el('small', 'Preço de loja em ' + c.precoData, 'text-secondary');

    const ficha = el('dl', undefined, 'ficha');
    [['Tela', c.tela], ['Chip', c.chip], ['Bateria', c.bateria]].forEach(([rotulo, valor]) => {
      ficha.append(el('dt', rotulo), el('dd', valor));
    });

    const acoes = el('div', undefined, 'mt-auto d-flex flex-wrap align-items-center gap-2 pt-3');
    const detalhes = el('button', 'Ver detalhes', 'btn btn-primary btn-sm');
    detalhes.type = 'button';
    detalhes.dataset.acao = 'detalhes';
    detalhes.dataset.id = c.id;
    detalhes.setAttribute('aria-label', 'Ver detalhes de ' + c.nome);

    const favorito = el('button', undefined, 'btn btn-outline-secondary btn-sm');
    favorito.type = 'button';
    favorito.dataset.acao = 'favoritar';
    favorito.dataset.id = c.id;
    favorito.setAttribute('aria-label', 'Favoritar ' + c.nome);
    definirEstadoFavorito(favorito, favoritos.includes(c.id));

    const grupo = el('div', undefined, 'form-check ms-auto');
    const caixa = el('input', undefined, 'form-check-input');
    caixa.type = 'checkbox';
    caixa.id = 'comparar-' + c.id;
    caixa.dataset.acao = 'comparar';
    caixa.dataset.id = c.id;
    caixa.checked = estado.comparar.includes(c.id);
    const rotulo = el('label', 'Comparar', 'form-check-label');
    rotulo.htmlFor = caixa.id;
    rotulo.append(el('span', ' ' + c.nome, 'visually-hidden'));
    grupo.append(caixa, rotulo);

    acoes.append(detalhes, favorito, grupo);
    corpo.append(topo, tag, preco, dataPreco, ficha, acoes);
    card.append(corpo);
    coluna.append(card);
    return coluna;
  }

  function renderLista() {
    const itens = celularesVisiveis();
    lista.replaceChildren(...itens.map(criarCard));
    resultado.textContent = itens.length === 1 ? '1 celular encontrado.' : itens.length + ' celulares encontrados.';
    vazio.hidden = itens.length !== 0;
    if (itens.length === 0) {
      const faixaEmPesquisa = estado.faixa === 'intermediario-superior' || estado.faixa === 'premium-acessivel';
      vazio.textContent = faixaEmPesquisa && !estado.busca && !estado.soFavoritos
        ? 'Esta faixa ainda está em pesquisa. Os modelos entram no catálogo quando houver preços e testes confiáveis.'
        : 'Nenhum celular encontrado com esses filtros.';
    }
    document.querySelectorAll('#filtros [data-faixa]').forEach((botao) => {
      const ativo = botao.dataset.faixa === estado.faixa;
      botao.classList.toggle('active', ativo);
      botao.setAttribute('aria-pressed', String(ativo));
    });
  }

  function atualizarContador() {
    $('#contador-favoritos').textContent = String(favoritos.length);
  }

  function alternarFavorito(id, botao) {
    const indice = favoritos.indexOf(id);
    if (indice === -1) favoritos.push(id); else favoritos.splice(indice, 1);
    salvarStorage(CHAVE_FAVORITOS, favoritos);
    atualizarContador();
    if (estado.soFavoritos) renderLista(); else definirEstadoFavorito(botao, indice === -1);
  }

  // ---------- Comparador (Aula 13) ----------
  function alternarComparacao(id, caixa) {
    avisoComparar.textContent = '';
    if (caixa.checked) {
      if (estado.comparar.length >= MAX_COMPARAR) {
        caixa.checked = false;
        avisoComparar.textContent = 'Você pode comparar no máximo ' + MAX_COMPARAR + ' celulares. Desmarque um para escolher outro.';
        return;
      }
      estado.comparar.push(id);
    } else {
      estado.comparar = estado.comparar.filter((item) => item !== id);
    }
    renderComparacao();
  }

  function renderComparacao() {
    if (estado.comparar.length < 2) {
      comparacao.replaceChildren(el('p', 'Marque pelo menos 2 celulares para ver a comparação.', 'text-secondary'));
      return;
    }
    const escolhidos = estado.comparar.map(buscarCelular);
    const tabela = el('table', undefined, 'table table-sm tabela-comparacao');
    tabela.append(el('caption', 'Comparação entre os celulares selecionados'));
    const cabecalho = el('tr');
    const primeiro = el('th', 'Característica');
    primeiro.scope = 'col';
    cabecalho.append(primeiro);
    escolhidos.forEach((c) => { const th = el('th', c.nome); th.scope = 'col'; cabecalho.append(th); });
    const thead = el('thead');
    thead.append(cabecalho);
    const corpo = el('tbody');
    [['Preço', (c) => formatarPreco(c.preco)], ['Nota do catálogo', (c) => formatarNota(c.nota)],
     ['Tela', (c) => c.tela], ['Chip', (c) => c.chip], ['Bateria', (c) => c.bateria],
     ['Atualizações', (c) => c.atualizacoes], ['Resistência', (c) => c.resistencia]].forEach(([nome, valor]) => {
      const linha = el('tr');
      const th = el('th', nome);
      th.scope = 'row';
      linha.append(th);
      escolhidos.forEach((c) => linha.append(el('td', valor(c))));
      corpo.append(linha);
    });
    tabela.append(thead, corpo);
    const envoltorio = el('div', undefined, 'table-responsive');
    envoltorio.append(tabela);
    comparacao.replaceChildren(envoltorio);
  }

  // ---------- Detalhes no modal do Bootstrap (Aula 12) ----------
  function abrirDetalhes(id) {
    const c = buscarCelular(id);
    if (!c) return;
    $('#modal-titulo').textContent = c.nome;
    const corpo = $('#modal-corpo');
    corpo.replaceChildren(el('p', 'Preço de loja encontrado em ' + c.precoData + ': ' + formatarPreco(c.preco), 'fw-semibold'));
    const pontos = el('ul');
    c.fortes.forEach((texto) => pontos.append(el('li', texto)));
    const atencao = el('p');
    atencao.append(el('strong', 'Atenção: '), c.atencao);
    corpo.append(el('p', 'Faixa: ' + FAIXAS[c.faixa].nome + '. Nota do catálogo: ' + formatarNota(c.nota) + '.'),
      el('h3', 'Pontos fortes', 'h6'), pontos, atencao);
    if (window.bootstrap) window.bootstrap.Modal.getOrCreateInstance($('#modal-detalhes')).show();
  }

  // Aula 11: UM único ouvinte no elemento pai da lista (event delegation)
  lista.addEventListener('click', function (evento) {
    const alvo = evento.target.closest('[data-acao]');
    if (!alvo) return;
    if (alvo.dataset.acao === 'detalhes') abrirDetalhes(alvo.dataset.id);
    else if (alvo.dataset.acao === 'favoritar') alternarFavorito(alvo.dataset.id, alvo);
    else if (alvo.dataset.acao === 'comparar') alternarComparacao(alvo.dataset.id, alvo);
  });

  // ---------- Filtros, busca e ordenação ----------
  document.addEventListener('click', function (evento) {
    const botao = evento.target.closest('[data-faixa]');
    if (!botao) return;
    estado.faixa = botao.dataset.faixa;
    renderLista();
    if (botao.classList.contains('dropdown-item')) $('#catalogo').scrollIntoView();
  });
  $('#busca').addEventListener('input', function (evento) { estado.busca = evento.target.value; renderLista(); });
  $('#ordem').addEventListener('change', function (evento) { estado.ordem = evento.target.value; renderLista(); });
  $('#btn-favoritos').addEventListener('click', function (evento) {
    estado.soFavoritos = !estado.soFavoritos;
    evento.currentTarget.setAttribute('aria-pressed', String(estado.soFavoritos));
    renderLista();
    $('#catalogo').scrollIntoView();
  });
  $('#btn-limpar-comparacao').addEventListener('click', function () {
    estado.comparar = [];
    avisoComparar.textContent = '';
    lista.querySelectorAll('input[data-acao="comparar"]').forEach((caixa) => { caixa.checked = false; });
    renderComparacao();
  });
  $('#menu').addEventListener('click', function (evento) {
    const link = evento.target.closest('a.nav-link');
    if (!link || link.getAttribute('href').length < 2) return;
    document.querySelectorAll('#menu .nav-link').forEach((item) => { item.classList.remove('ativo'); item.removeAttribute('aria-current'); });
    link.classList.add('ativo');
    link.setAttribute('aria-current', 'true');
  });

  // ---------- Gráfico em Canvas (Aula 5) ----------
  function desenharGrafico() {
    const canvas = $('#grafico-notas');
    if (!canvas || !canvas.getContext) return;
    const ctx = canvas.getContext('2d');
    const dados = CELULARES.slice().sort((a, b) => b.nota - a.nota);
    $('#grafico-fallback').textContent = 'Notas de custo-benefício: '
      + dados.map((c) => c.nome + ', ' + formatarNota(c.nota)).join('; ') + '.';
    const margemEsquerda = 170;
    const alturaLinha = canvas.height / dados.length;
    let progresso = window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 1 : 0;
    function quadro() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.font = '13px "Segoe UI", system-ui, sans-serif';
      ctx.textBaseline = 'middle';
      dados.forEach((c, i) => {
        const y = i * alturaLinha + alturaLinha / 2;
        const largura = (canvas.width - margemEsquerda - 50) * (c.nota / 10) * progresso;
        ctx.fillStyle = '#16211d';
        ctx.textAlign = 'right';
        ctx.fillText(c.nome.replace(/^(Samsung|Motorola|Xiaomi)\s/, ''), margemEsquerda - 10, y);
        ctx.fillStyle = FAIXAS[c.faixa].cor;
        ctx.fillRect(margemEsquerda, y - 9, largura, 18);
        ctx.fillStyle = '#16211d';
        ctx.textAlign = 'left';
        ctx.fillText(formatarNota(c.nota), margemEsquerda + largura + 6, y);
      });
      if (progresso < 1) {
        progresso = Math.min(1, progresso + 0.04);
        requestAnimationFrame(quadro);
      }
    }
    quadro();
  }

  // ---------- Formulário de sugestões (Aulas 3 e 11) ----------
  const formulario = $('#form-sugestao');
  const listaSugestoes = $('#lista-sugestoes');

  function renderSugestoes() {
    if (sugestoes.length === 0) {
      listaSugestoes.replaceChildren(el('li', 'Nenhuma sugestão enviada ainda.', 'list-group-item text-secondary'));
      return;
    }
    listaSugestoes.replaceChildren(...sugestoes.map((s) => {
      const item = el('li', undefined, 'list-group-item d-flex justify-content-between align-items-center gap-2');
      // textContent: o que o usuário digita entra sempre como texto puro
      item.append(el('span', s.modelo + ' (sugerido por ' + s.nome + ', orçamento de ' + formatarPreco(s.orcamento) + ')'));
      const remover = el('button', 'Remover', 'btn btn-outline-secondary btn-sm');
      remover.type = 'button';
      remover.dataset.id = String(s.id);
      remover.setAttribute('aria-label', 'Remover sugestão ' + s.modelo);
      item.append(remover);
      return item;
    }));
  }

  formulario.addEventListener('submit', function (evento) {
    evento.preventDefault(); // a validação nativa já bloqueou envios inválidos
    const dados = new FormData(formulario);
    sugestoes.push({
      id: Date.now(),
      modelo: String(dados.get('modelo')).trim(),
      nome: String(dados.get('nome')).trim(),
      orcamento: Number(dados.get('orcamento'))
    }); // o e-mail não é guardado
    salvarStorage(CHAVE_SUGESTOES, sugestoes);
    renderSugestoes();
    formulario.reset();
    $('#aviso-form').textContent = 'Sugestão salva. Obrigado!';
  });

  listaSugestoes.addEventListener('click', function (evento) {
    const botao = evento.target.closest('button[data-id]');
    if (!botao) return;
    sugestoes = sugestoes.filter((s) => String(s.id) !== botao.dataset.id);
    salvarStorage(CHAVE_SUGESTOES, sugestoes);
    renderSugestoes();
  });

  // ---------- Inicialização ----------
  renderLista();
  renderComparacao();
  renderSugestoes();
  atualizarContador();
  desenharGrafico();
});
