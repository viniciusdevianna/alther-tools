(() => {
  'use strict';

  const DADOS = window.ALTHER_DADOS || {};
  const CARTAS = (window.ALTHER_CARTAS && window.ALTHER_CARTAS.cartas) || [];
  const CHAVE = 'alther-fichas:v1';

  // Regras
  const DECK_MIN = 15;
  const DECK_MAX = 30;
  const PC_MAX = 10000;
  const NIVEL_MAX = 10; // nível 10 no caminho = Mestre

  const ATRIBUTOS = [['corpo', 'Corpo'], ['mente', 'Mente'], ['foco', 'Foco'], ['espirito', 'Espírito'], ['social', 'Social'], ['natureza', 'Natureza']];
  const TESTES = [['acertar', 'Acertar'], ['esquivar', 'Esquivar'], ['canalizar', 'Canalizar'], ['restaurar', 'Restaurar'], ['concentrar', 'Concentrar']];
  const STATS = [['custo', 'Custo'], ['alcance', 'Alcance'], ['acerto', 'Acerto'], ['defFisica', 'Def. física'], ['defArtistica', 'Def. artística'], ['desequilibrio', 'Desequilíbrio']];

  const $app = document.getElementById('app');
  const $titulo = document.getElementById('titulo');
  const $abas = document.getElementById('abas');
  const $voltar = document.getElementById('voltar');
  const $salvo = document.getElementById('salvo');
  const $arquivo = document.getElementById('arquivo');

  // ---------- utilidades ----------
  const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const norm = (s) => String(s ?? '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().trim();
  const uid = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
  const ehObjeto = (v) => v !== null && typeof v === 'object' && !Array.isArray(v);
  const num = (v) => (v === '' || v == null || isNaN(Number(v)) ? null : Number(v));
  const ordenar = (lista) => [...lista].sort((a, b) => a.localeCompare(b, 'pt-BR'));

  function lerCaminho(obj, caminho) {
    return caminho.split('.').reduce((a, k) => (a == null ? undefined : a[k]), obj);
  }
  function gravarCaminho(obj, caminho, valor) {
    const ks = caminho.split('.');
    let a = obj;
    for (let i = 0; i < ks.length - 1; i++) {
      if (a[ks[i]] == null) a[ks[i]] = {};
      a = a[ks[i]];
    }
    a[ks[ks.length - 1]] = valor;
  }
  // Completa um objeto salvo com os campos que faltarem (fichas antigas ou importadas).
  function completar(padrao, obj) {
    if (!ehObjeto(obj)) return padrao;
    const out = { ...obj };
    for (const k of Object.keys(padrao)) {
      if (!(k in obj)) out[k] = padrao[k];
      else if (ehObjeto(padrao[k])) out[k] = completar(padrao[k], obj[k]);
    }
    return out;
  }

  // ---------- modelo ----------
  const trio = () => ({ atual: '', total: '', temp: '' });
  const caminhoVazio = () => ({ nome: '', atual: '', total: '', nivel: '', mestre: false });
  function novoPersonagem() {
    const atributos = {};
    ATRIBUTOS.forEach(([k]) => { atributos[k] = { atual: '', total: '', temp: '', treino: '' }; });
    const dados = {};
    TESTES.forEach(([k]) => { dados[k] = { prof: '', bonus: '', temp: '' }; });
    const agora = Date.now();
    return {
      id: uid(), criadoEm: agora, atualizadoEm: agora,
      keyper: '', jogador: '', raca: '', arquetipo: '', origem: '', idade: '', peso: '', altura: '', escola: '', aspiracao: '',
      np: '', xp: { atual: '', total: '' }, pd: '',
      atributos, pv: trio(), recargas: trio(), moedas: '', acessorio: '',
      dados,
      caminhos: [caminhoVazio()],
      inventario: '', anotacoes: '',
      companheiro: { nome: '', familia: '', especie: '', dados: '', pv: trio(), am: '', ap: '', mp: '', dano: '', habilidades: [] },
      adquiridas: {}, // código da carta -> cópias adquiridas
      deck: {}, // código da carta -> cópias no deck
    };
  }
  const ehMestre = (c) => (num(c.nivel) ?? 0) >= NIVEL_MAX;
  function normalizarPersonagem(p) {
    const base = novoPersonagem();
    const out = completar(base, p);
    if (!out.id) out.id = base.id;
    if (!Array.isArray(out.caminhos)) out.caminhos = [];
    out.caminhos = out.caminhos.map((c) => ({ ...caminhoVazio(), ...c }));
    out.caminhos.forEach((c) => { c.mestre = ehMestre(c); });
    if (!Array.isArray(out.companheiro.habilidades)) out.companheiro.habilidades = [];
    if (!ehObjeto(out.deck)) out.deck = {};
    if (!ehObjeto(out.adquiridas)) out.adquiridas = {};
    return out;
  }

  // ---------- armazenamento ----------
  let store = { versao: 1, personagens: [] };
  let timerSalvar = null;

  function carregar() {
    try {
      const s = JSON.parse(localStorage.getItem(CHAVE));
      if (s && Array.isArray(s.personagens)) store = { versao: 1, personagens: s.personagens.map(normalizarPersonagem) };
    } catch (e) { /* começa vazio */ }
  }
  function salvarAgora() {
    clearTimeout(timerSalvar);
    timerSalvar = null;
    try {
      localStorage.setItem(CHAVE, JSON.stringify(store));
      $salvo.textContent = 'Salvo neste aparelho';
      $salvo.classList.remove('erro');
    } catch (e) {
      $salvo.textContent = 'Não foi possível salvar';
      $salvo.classList.add('erro');
    }
  }
  function salvar(p) {
    if (p) p.atualizadoEm = Date.now();
    $salvo.textContent = 'Salvando…';
    clearTimeout(timerSalvar);
    timerSalvar = setTimeout(salvarAgora, 400);
  }
  addEventListener('pagehide', () => { if (timerSalvar) salvarAgora(); });
  document.addEventListener('visibilitychange', () => { if (document.hidden && timerSalvar) salvarAgora(); });

  const buscarPersonagem = (id) => store.personagens.find((p) => p.id === id);
  const nomeDe = (p) => p.keyper.trim() || 'Personagem sem nome';

  // ---------- cartas: aquisição e deck ----------
  const cartaPorId = new Map(CARTAS.map((c) => [c.id, c]));
  const ehUnica = (c) => c.classes.some((x) => norm(x) === 'unica');
  // Classe Única sempre limita a 1 cópia, mesmo que a coluna "Limite no Deck" diga outra coisa.
  const limiteCarta = (c) => (ehUnica(c) ? 1 : c.limite || 3);
  // Cartas com o mesmo Deck Name (ex.: Pummel I, II e III) dividem o limite de cópias no deck.
  const grupoDe = (c) => norm(c.deckName || c.nome);
  const cartasDoGrupo = new Map();
  CARTAS.forEach((c) => {
    const g = grupoDe(c);
    if (!cartasDoGrupo.has(g)) cartasDoGrupo.set(g, []);
    cartasDoGrupo.get(g).push(c);
  });
  const limiteGrupo = (c) => Math.min(...cartasDoGrupo.get(grupoDe(c)).map(limiteCarta));
  const noDeckGrupo = (p, c) => cartasDoGrupo.get(grupoDe(c)).reduce((s, x) => s + (p.deck[x.id] || 0), 0);
  const nomeGrupo = (c) => c.deckName || c.nome;

  const somar = (obj) => Object.values(obj).reduce((s, q) => s + (Number(q) || 0), 0);
  const totalDeck = (p) => somar(p.deck);
  const meusCaminhos = (p) => new Set(p.caminhos.map((c) => c.nome).filter(Boolean));
  const entradaCaminho = (p, nome) => p.caminhos.find((c) => c.nome === nome);
  const custoAquisicao = (c) => Number(c.custoAquisicao) || 0;
  const adquiridasDoCaminho = (p, nome) => CARTAS.reduce((s, c) => s + (c.caminho === nome ? p.adquiridas[c.id] || 0 : 0), 0);

  function motivoNaoAdquirir(p, c) {
    if (c.caminho && !meusCaminhos(p).has(c.caminho)) return `Só para quem tem o caminho ${c.caminho}`;
    if ((p.adquiridas[c.id] || 0) >= limiteCarta(c)) return limiteCarta(c) === 1 ? 'Única: já adquirida' : `Já tem ${limiteCarta(c)} cópias`;
    const custo = custoAquisicao(c);
    if (custo > 0 && c.caminho) {
      const pc = num(entradaCaminho(p, c.caminho).atual) ?? 0;
      if (pc < custo) return `PC insuficiente (${pc} de ${custo})`;
    }
    return '';
  }
  function adquirir(p, c) {
    if (motivoNaoAdquirir(p, c)) return;
    const custo = custoAquisicao(c);
    if (custo > 0 && c.caminho) {
      const e = entradaCaminho(p, c.caminho);
      e.atual = String((num(e.atual) ?? 0) - custo);
    }
    p.adquiridas[c.id] = (p.adquiridas[c.id] || 0) + 1;
  }
  // Desfaz uma aquisição: devolve os PC e tira do deck a cópia que sobrar.
  function desfazerAquisicao(p, c) {
    const q = p.adquiridas[c.id] || 0;
    if (!q) return;
    if (q === 1) delete p.adquiridas[c.id];
    else p.adquiridas[c.id] = q - 1;
    const custo = custoAquisicao(c);
    const e = c.caminho && entradaCaminho(p, c.caminho);
    if (custo > 0 && e) {
      let pc = (num(e.atual) ?? 0) + custo;
      const total = num(e.total);
      if (total != null) pc = Math.min(pc, total);
      e.atual = String(pc);
    }
    if ((p.deck[c.id] || 0) > (p.adquiridas[c.id] || 0)) {
      if (p.adquiridas[c.id]) p.deck[c.id] = p.adquiridas[c.id];
      else delete p.deck[c.id];
    }
  }

  function motivoNaoPorNoDeck(p, c) {
    const q = p.deck[c.id] || 0;
    const a = p.adquiridas[c.id] || 0;
    if (!a) return 'Adquira a carta primeiro';
    if (q >= a) return 'Todas as cópias adquiridas já estão no deck';
    const lim = limiteGrupo(c);
    if (noDeckGrupo(p, c) >= lim) {
      const grupo = cartasDoGrupo.get(grupoDe(c)).length > 1 ? ` de "${nomeGrupo(c)}"` : '';
      return lim === 1 ? `Única: só 1${grupo} no deck` : `Máximo de ${lim}${grupo} no deck`;
    }
    if (totalDeck(p) >= DECK_MAX) return `Deck cheio (${DECK_MAX})`;
    return '';
  }
  function alterarDeck(p, c, delta) {
    if (delta > 0 && motivoNaoPorNoDeck(p, c)) return;
    const q = Math.max(0, (p.deck[c.id] || 0) + delta);
    if (q) p.deck[c.id] = q;
    else delete p.deck[c.id];
  }

  function problemasDeck(p) {
    const lista = [];
    const total = totalDeck(p);
    if (total < DECK_MIN) lista.push(`Faltam ${DECK_MIN - total} carta(s) para o mínimo de ${DECK_MIN}.`);
    if (total > DECK_MAX) lista.push(`Sobram ${total - DECK_MAX} carta(s): o máximo é ${DECK_MAX}.`);
    const gruposVistos = new Set();
    for (const [id, q] of Object.entries(p.deck)) {
      const c = cartaPorId.get(id);
      if (!c) { lista.push(`A carta ${id} do deck não existe mais no catálogo.`); continue; }
      if (q > (p.adquiridas[id] || 0)) lista.push(`${c.nome}: ${q} no deck, mas só ${p.adquiridas[id] || 0} adquirida(s).`);
      const g = grupoDe(c);
      if (!gruposVistos.has(g)) {
        gruposVistos.add(g);
        const n = noDeckGrupo(p, c);
        if (n > limiteGrupo(c)) lista.push(`${nomeGrupo(c)}: ${n} cópias no deck, o limite é ${limiteGrupo(c)}.`);
      }
    }
    return lista;
  }
  function seloDeck(p) {
    const total = totalDeck(p);
    const ok = problemasDeck(p).length === 0;
    const cls = ok ? 'ok' : total > DECK_MAX ? 'erro' : 'aviso';
    return `<span class="selo ${cls}">Deck ${total}/${DECK_MAX}${ok ? ' ✓' : ''}</span>`;
  }

  // ---------- rotas ----------
  // #/                      lista de personagens
  // #/catalogo              catálogo (só consulta)
  // #/p/<id>/<aba>          personagem: ficha | deck | catalogo
  function rotaAtual() {
    const partes = location.hash.replace(/^#\/?/, '').split('/').filter(Boolean);
    if (partes[0] === 'catalogo') return { tela: 'catalogo' };
    if (partes[0] === 'p' && partes[1]) return { tela: 'personagem', id: decodeURIComponent(partes[1]), aba: partes[2] || 'ficha' };
    return { tela: 'lista' };
  }
  const ir = (hash) => { location.hash = hash; };
  const personagemDaRota = () => { const r = rotaAtual(); return r.tela === 'personagem' ? buscarPersonagem(r.id) : null; };

  function render() {
    const r = rotaAtual();
    if (r.tela === 'personagem') {
      const p = buscarPersonagem(r.id);
      if (!p) return ir('#/');
      renderPersonagem(p, ['ficha', 'deck', 'catalogo'].includes(r.aba) ? r.aba : 'ficha');
    } else if (r.tela === 'catalogo') {
      cabecalho('Catálogo de cartas', '#/', '← Fichas');
      renderCatalogo(null);
    } else {
      cabecalho('Fichas e Decks', '../../', '← Ferramentas');
      renderLista();
    }
  }
  function cabecalho(titulo, voltarHref, voltarTexto, abas) {
    $titulo.textContent = titulo;
    document.title = titulo === 'Fichas e Decks' ? titulo : `${titulo} · Fichas e Decks`;
    $voltar.href = voltarHref;
    $voltar.textContent = voltarTexto;
    $abas.hidden = !abas;
    $abas.innerHTML = abas || '';
  }
  addEventListener('hashchange', () => { render(); scrollTo(0, 0); });

  // ---------- lista de personagens ----------
  function renderLista() {
    const ordenados = [...store.personagens].sort((a, b) => b.atualizadoEm - a.atualizadoEm);
    const itens = ordenados.map((p) => {
      const caminhos = p.caminhos.filter((c) => c.nome).map((c) => c.nome + (c.mestre ? ' ★' : '')).join(', ');
      const linha2 = [p.raca, p.escola].filter(Boolean).join(' · ');
      return `<li><a class="personagem" href="#/p/${encodeURIComponent(p.id)}/ficha">
        <h2>${esc(nomeDe(p))}</h2>
        ${p.jogador ? `<div class="linha">Jogador: ${esc(p.jogador)}</div>` : ''}
        ${linha2 ? `<div class="linha">${esc(linha2)}</div>` : ''}
        ${caminhos ? `<div class="linha">Caminhos: ${esc(caminhos)}</div>` : ''}
        <div class="rodape">${seloDeck(p)}<span>Editado em ${new Date(p.atualizadoEm).toLocaleDateString('pt-BR')}</span></div>
      </a></li>`;
    }).join('');
    $app.innerHTML = `
      <div class="acoes">
        <button class="btn principal" data-acao="novo">+ Novo personagem</button>
        <a class="btn" href="#/catalogo">Catálogo de cartas</a>
        <button class="btn" data-acao="exportar-todos" ${store.personagens.length ? '' : 'disabled'}>Exportar</button>
        <button class="btn" data-acao="importar">Importar</button>
      </div>
      ${itens ? `<ul class="personagens">${itens}</ul>` : `<div class="vazio">Nenhum personagem ainda.<br>Toque em <b>+ Novo personagem</b> para criar a primeira ficha.</div>`}`;
  }

  // ---------- personagem ----------
  function renderPersonagem(p, aba) {
    const base = `#/p/${encodeURIComponent(p.id)}`;
    const abas = [['ficha', 'Ficha'], ['deck', `Deck (${totalDeck(p)})`], ['catalogo', 'Catálogo']]
      .map(([k, t]) => `<a href="${base}/${k}" class="${k === aba ? 'ativa' : ''}" data-aba="${k}">${esc(t)}</a>`).join('');
    cabecalho(nomeDe(p), '#/', '← Fichas', abas);
    if (aba === 'deck') renderDeck(p);
    else if (aba === 'catalogo') renderCatalogo(p);
    else renderFicha(p);
  }
  function atualizarAbaDeck(p) {
    const a = $abas.querySelector('[data-aba="deck"]');
    if (a) a.textContent = `Deck (${totalDeck(p)})`;
  }

  // Campos do formulário. O valor é preenchido depois por preencher(), a partir de data-f.
  const campo = (rotulo, f, extra = '') => `<label class="f ${extra}"><span>${esc(rotulo)}</span><input type="text" data-f="${f}" autocomplete="off"></label>`;
  const campoNum = (rotulo, f, attrs = '') => `<label class="f"><span>${esc(rotulo)}</span><input type="number" inputmode="numeric" data-f="${f}" ${attrs}></label>`;
  const selecao = (rotulo, f, opcoes, extra = '') => `<label class="f ${extra}"><span>${esc(rotulo)}</span><select data-f="${f}"><option value="">—</option>${opcoes.map((o) => `<option>${esc(o)}</option>`).join('')}</select></label>`;
  const celula = (f, rotulo, tipo = 'number') => `<td><input type="${tipo}" ${tipo === 'number' ? 'inputmode="numeric"' : ''} data-f="${f}" aria-label="${esc(rotulo)}"></td>`;
  const grade = (titulos, linhas) => `<table class="grade"><thead><tr><th class="col-rotulo"></th>${titulos.map((t) => `<th>${esc(t)}</th>`).join('')}</tr></thead><tbody>${linhas.join('')}</tbody></table>`;

  function blocoRacial(raca) {
    const r = DADOS.racial && DADOS.racial[raca];
    if (!r) return '';
    const item = (x, tipo, cls) => (x ? `<details class="info ${cls}"><summary><span class="tipo">${tipo}</span><b>${esc(x.nome)}</b></summary><p>${esc(x.descricao)}</p></details>` : '');
    return item(r.habilidade, 'Habilidade racial', '') + item(r.restricao, 'Restrição racial', 'restricao');
  }
  function blocoIntrinseca(nomeCaminho) {
    const h = DADOS.intrinseca && DADOS.intrinseca[nomeCaminho];
    if (!h) return '';
    return `<details class="info"><summary><span class="tipo">Intrínseca</span><b>${esc(h.nome)}</b></summary><p>${esc(h.descricao)}</p></details>`;
  }
  // Partes calculadas de um caminho: cartas adquiridas, selo de Mestre e intrínseca.
  function extrasCaminho(p, c) {
    const n = c.nome ? adquiridasDoCaminho(p, c.nome) : 0;
    return `<div class="caminho-extras">
        <span class="adq">Cartas adquiridas: <b>${n}</b></span>
        ${c.mestre ? '<span class="selo mestre">★ Mestre</span>' : `<span class="motivo">Mestre no nível ${NIVEL_MAX}</span>`}
      </div>
      ${blocoIntrinseca(c.nome)}`;
  }
  function htmlCaminhos(p) {
    if (!p.caminhos.length) return '<p class="contador">Nenhum caminho.</p>';
    const opcoes = ordenar(DADOS.caminhos || []);
    return p.caminhos.map((c, i) => `
      <div class="cartao-caminho ${c.mestre ? 'e-mestre' : ''}" data-caminho="${i}">
        <div class="caminho-topo">
          ${selecao('Caminho', `caminhos.${i}.nome`, opcoes)}
          <button type="button" class="remover" data-acao="remover-caminho" data-i="${i}" aria-label="Remover caminho" title="Remover caminho">✕</button>
        </div>
        <div class="caminho-numeros">
          ${campoNum('PC atual', `caminhos.${i}.atual`, `min="0" max="${PC_MAX}"`)}
          ${campoNum('PC total', `caminhos.${i}.total`, `min="0" max="${PC_MAX}"`)}
          ${campoNum('Nível', `caminhos.${i}.nivel`, `min="0" max="${NIVEL_MAX}"`)}
        </div>
        <div data-extras="${i}">${extrasCaminho(p, c)}</div>
      </div>`).join('');
  }
  function htmlHabilidadesCompanheiro(p) {
    const hs = p.companheiro.habilidades;
    if (!hs.length) return '<p class="contador">Nenhuma habilidade.</p>';
    return hs.map((h, i) => `
      <div class="linha-hab">
        <input type="text" data-f="companheiro.habilidades.${i}.nome" placeholder="Habilidade" aria-label="Habilidade">
        <textarea data-f="companheiro.habilidades.${i}.descricao" rows="2" placeholder="Descrição" aria-label="Descrição"></textarea>
        <button type="button" class="remover" data-acao="remover-hab" data-i="${i}" aria-label="Remover habilidade" title="Remover habilidade">✕</button>
      </div>`).join('');
  }

  function renderFicha(p) {
    const atributos = ATRIBUTOS.map(([k, t]) => `<tr><td>${t}</td>${celula(`atributos.${k}.atual`, `${t} atual`)}${celula(`atributos.${k}.total`, `${t} total`)}${celula(`atributos.${k}.temp`, `${t} temporário`)}${celula(`atributos.${k}.treino`, `${t} treino`)}</tr>`);
    const testes = TESTES.map(([k, t]) => `<tr><td>${t}</td>${celula(`dados.${k}.prof`, `${t} proficiência`, 'text')}${celula(`dados.${k}.bonus`, `${t} bônus`)}${celula(`dados.${k}.temp`, `${t} temporário`)}</tr>`);
    const recursos = [['pv', 'PV'], ['recargas', 'Recargas']].map(([k, t]) => `<tr><td>${t}</td>${celula(`${k}.atual`, `${t} atual`)}${celula(`${k}.total`, `${t} total`)}${celula(`${k}.temp`, `${t} temporário`)}</tr>`);

    $app.innerHTML = `
    <form class="ficha" id="ficha" autocomplete="off" onsubmit="return false">
      <section class="painel largo">
        <h2>Identificação</h2>
        <div class="campos">
          ${campo('Keyper', 'keyper', 'dois')}
          ${campo('Jogador', 'jogador', 'dois')}
          ${selecao('Raça', 'raca', DADOS.racas || [])}
          ${selecao('Arquétipo', 'arquetipo', DADOS.arquetipos || [])}
          ${selecao('Escola', 'escola', DADOS.escolas || [], 'dois')}
          ${selecao('Aspiração', 'aspiracao', DADOS.aspiracoes || [])}
          ${campo('Origem', 'origem')}
          ${campo('Idade', 'idade')}
          ${campo('Peso', 'peso')}
          ${campo('Altura', 'altura')}
        </div>
        <div id="racial">${blocoRacial(p.raca)}</div>
      </section>

      <section class="painel largo">
        <h2>Progresso</h2>
        <div class="campos">
          ${campoNum('NP', 'np')}
          ${campoNum('XP atual', 'xp.atual')}
          ${campoNum('XP total', 'xp.total')}
          ${campoNum('PD', 'pd')}
        </div>
      </section>

      <section class="painel">
        <h2>Atributos</h2>
        ${grade(['Atual', 'Total', 'Temp', 'Treino'], atributos)}
      </section>

      <section class="painel">
        <h2>Dados</h2>
        ${grade(['Prof.', 'Bônus', 'Temp'], testes)}
      </section>

      <section class="painel largo">
        <h2>Caminhos</h2>
        <div class="caminhos" id="caminhos">${htmlCaminhos(p)}</div>
        <div style="margin-top:10px"><button type="button" class="btn pequeno" data-acao="add-caminho">+ Caminho</button></div>
      </section>

      <section class="painel">
        <h2>Recursos</h2>
        ${grade(['Atual', 'Total', 'Temp'], recursos)}
        <div class="campos" style="margin-top:10px">
          ${campoNum('Moedas', 'moedas')}
          ${campo('Acessório', 'acessorio')}
        </div>
      </section>

      <section class="painel">
        <h2>Inventário</h2>
        <textarea data-f="inventario" aria-label="Inventário" rows="8"></textarea>
      </section>

      <section class="painel largo">
        <h2>Anotações</h2>
        <textarea data-f="anotacoes" aria-label="Anotações" rows="8"></textarea>
      </section>

      <section class="painel largo">
        <h2>Companheiro animal</h2>
        <div class="campos">
          ${campo('Nome', 'companheiro.nome', 'dois')}
          ${selecao('Família', 'companheiro.familia', DADOS.familiasCompanheiro || [])}
          ${campo('Espécie', 'companheiro.especie')}
          ${campo('Dados', 'companheiro.dados')}
        </div>
        <div class="campos" style="margin-top:10px">
          ${campoNum('PV atual', 'companheiro.pv.atual')}
          ${campoNum('PV total', 'companheiro.pv.total')}
          ${campoNum('PV temp', 'companheiro.pv.temp')}
          ${campoNum('AM', 'companheiro.am')}
          ${campoNum('AP', 'companheiro.ap')}
          ${campoNum('MP', 'companheiro.mp')}
          ${campo('Dano', 'companheiro.dano')}
        </div>
        <h2 style="margin-top:16px">Habilidades do companheiro</h2>
        <div class="lista-linhas" id="hab-companheiro">${htmlHabilidadesCompanheiro(p)}</div>
        <div style="margin-top:10px"><button type="button" class="btn pequeno" data-acao="add-hab">+ Habilidade</button></div>
      </section>
    </form>
    <div class="zona-perigo">
      <button class="btn" data-acao="exportar-um">Exportar esta ficha</button>
      <button class="btn" data-acao="duplicar">Duplicar</button>
      <button class="btn perigo" data-acao="excluir">Excluir personagem</button>
    </div>`;
    preencher($app, p);
  }

  function preencher(raiz, p) {
    raiz.querySelectorAll('[data-f]').forEach((el) => {
      const v = lerCaminho(p, el.dataset.f);
      if (el.type === 'checkbox') { el.checked = !!v; return; }
      const valor = v == null ? '' : String(v);
      if (el.tagName === 'SELECT' && valor && ![...el.options].some((o) => o.value === valor)) {
        // Valor que não está mais na lista (ex.: caminho renomeado): mantém visível para não se perder.
        el.add(new Option(`${valor} (fora da lista)`, valor));
      }
      el.value = valor;
    });
    marcarInvalidos(raiz, p);
  }

  // Atual nunca maior que total: durante a digitação só marca o campo; ao sair dele, corrige.
  function parAtualTotal(f) {
    const m = f.match(/^(.*)\.(atual|total)$/);
    return m ? m[1] : null;
  }
  function marcarInvalidos(raiz, p) {
    raiz.querySelectorAll('[data-f$=".atual"]').forEach((el) => {
      const base = el.dataset.f.slice(0, -'.atual'.length);
      const a = num(lerCaminho(p, `${base}.atual`));
      const t = num(lerCaminho(p, `${base}.total`));
      el.classList.toggle('invalido', a != null && t != null && a > t);
    });
  }
  function definir(p, f, valor) {
    gravarCaminho(p, f, valor);
    const el = $app.querySelector(`[data-f="${f}"]`);
    if (el) el.value = valor;
  }
  function aplicarRegras(p, f) {
    const pc = f.match(/^caminhos\.(\d+)\.(atual|total|nivel)$/);
    if (pc) {
      const max = pc[2] === 'nivel' ? NIVEL_MAX : PC_MAX;
      const v = num(lerCaminho(p, f));
      if (v != null && (v > max || v < 0)) definir(p, f, String(Math.min(max, Math.max(0, v))));
    }
    const base = parAtualTotal(f);
    if (base) {
      const a = num(lerCaminho(p, `${base}.atual`));
      const t = num(lerCaminho(p, `${base}.total`));
      if (a != null && t != null && a > t) definir(p, `${base}.atual`, String(t));
    }
    marcarInvalidos($app, p);
  }

  function atualizarCaminho(p, i) {
    const c = p.caminhos[i];
    if (!c) return;
    c.mestre = ehMestre(c);
    const box = $app.querySelector(`[data-extras="${i}"]`);
    if (box) box.innerHTML = extrasCaminho(p, c);
    const cartao = $app.querySelector(`[data-caminho="${i}"]`);
    if (cartao) cartao.classList.toggle('e-mestre', c.mestre);
  }

  function aoEditar(e, final) {
    const el = e.target.closest('[data-f]');
    if (!el) return;
    const p = personagemDaRota();
    if (!p) return;
    const f = el.dataset.f;
    gravarCaminho(p, f, el.type === 'checkbox' ? el.checked : el.value);
    if (final) aplicarRegras(p, f);
    else marcarInvalidos($app, p);
    salvar(p);
    if (f === 'keyper') { $titulo.textContent = nomeDe(p); document.title = `${nomeDe(p)} · Fichas e Decks`; }
    if (f === 'raca') document.getElementById('racial').innerHTML = blocoRacial(p.raca);
    const m = f.match(/^caminhos\.(\d+)\./);
    if (m) atualizarCaminho(p, Number(m[1]));
  }
  $app.addEventListener('input', (e) => aoEditar(e, false));
  $app.addEventListener('change', (e) => aoEditar(e, true));

  // ---------- exibição de cartas ----------
  const temValor = (v) => v !== '' && v != null && norm(v) !== 'na';

  function htmlDetalhesCarta(c) {
    const stats = STATS.filter(([k]) => temValor(c[k])).map(([k, t]) => `<div><dt>${t}</dt><dd>${esc(c[k])}</dd></div>`).join('');
    const extras = [
      custoAquisicao(c) ? `Aquisição: ${custoAquisicao(c)} PC` : '',
      limiteGrupo(c) !== 3 || cartasDoGrupo.get(grupoDe(c)).length > 1
        ? `Limite no deck: ${limiteGrupo(c)}${cartasDoGrupo.get(grupoDe(c)).length > 1 ? ` (somando todas as "${nomeGrupo(c)}")` : ''}` : '',
    ].filter(Boolean);
    return `
      ${stats ? `<dl class="stats">${stats}</dl>` : ''}
      ${c.efeito ? `<p class="efeito">${esc(c.efeito)}</p>` : ''}
      ${c.palavras.length ? `<div class="chips">${c.palavras.map((w) => `<span class="chip">${esc(w)}</span>`).join('')}</div>` : ''}
      ${extras.length ? `<p class="meta">${extras.map(esc).join(' · ')}</p>` : ''}`;
  }
  function htmlTags(c) {
    return `<div class="tags">
      ${c.caminho ? `<span class="tag caminho">${esc(c.caminho)}</span>` : '<span class="tag caminho">Sem caminho</span>'}
      ${c.tipo ? `<span class="tag">${esc(c.tipo)}</span>` : ''}
      ${c.atributo ? `<span class="tag">${esc(c.atributo)}</span>` : ''}
      ${c.classes.map((x) => `<span class="tag classe ${norm(x) === 'unica' ? 'unica' : ''}">${esc(x)}</span>`).join('')}
    </div>`;
  }
  function controle(rotulo, acaoMenos, acaoMais, c, q, podeMenos, motivoMais) {
    return `<div class="controle">
      <span class="rotulo">${rotulo}</span>
      <button class="btn pequeno" data-acao="${acaoMenos}" data-carta="${esc(c.id)}" ${podeMenos ? '' : 'disabled'} aria-label="${rotulo}: tirar uma">−</button>
      <span class="qtd">${q}</span>
      <button class="btn pequeno" data-acao="${acaoMais}" data-carta="${esc(c.id)}" ${motivoMais ? 'disabled' : ''} aria-label="${rotulo}: adicionar uma">+</button>
      <span class="motivo">${esc(motivoMais)}</span>
    </div>`;
  }
  function htmlControles(p, c) {
    const a = p.adquiridas[c.id] || 0;
    const q = p.deck[c.id] || 0;
    return `<footer>
      ${controle('Adquiridas', 'desadquirir', 'adquirir', c, a, a > 0, motivoNaoAdquirir(p, c))}
      ${a ? controle('No deck', 'menos', 'mais', c, q, q > 0, motivoNaoPorNoDeck(p, c)) : ''}
    </footer>`;
  }
  function htmlCarta(c, p) {
    const a = p ? p.adquiridas[c.id] || 0 : 0;
    const q = p ? p.deck[c.id] || 0 : 0;
    return `<article class="carta ${q ? 'no-deck' : a ? 'adquirida' : ''}" data-id="${esc(c.id)}">
      <header><h3>${esc(c.nome)}</h3><span class="codigo">${esc(c.id)}</span></header>
      ${htmlTags(c)}
      ${htmlDetalhesCarta(c)}
      ${p ? htmlControles(p, c) : ''}
    </article>`;
  }

  // ---------- catálogo ----------
  const MEUS = '__meus__';
  const novoFiltro = () => ({ busca: '', caminho: null, tipo: '', classe: '', atributo: '', situacao: '' });
  // Filtros separados para o catálogo geral e o do personagem (que começa em "Meus caminhos").
  const filtroGeral = novoFiltro();
  let filtroPersonagem = novoFiltro();
  let filtroDe = null; // id do personagem dono de filtroPersonagem
  let filtro = filtroGeral;
  const valoresDe = (fn) => ordenar([...new Set(CARTAS.flatMap((c) => [].concat(fn(c))).filter(Boolean))]);
  const opcoesFiltro = {
    caminho: valoresDe((c) => c.caminho),
    tipo: valoresDe((c) => c.tipo),
    classe: valoresDe((c) => c.classes),
    atributo: valoresDe((c) => c.atributo),
  };

  function cartasFiltradas(p) {
    const termos = norm(filtro.busca).split(/\s+/).filter(Boolean);
    const meus = p ? meusCaminhos(p) : null;
    const caminho = filtro.caminho || '';
    return CARTAS.filter((c) => {
      if (caminho === MEUS) { if (c.caminho && !meus.has(c.caminho)) return false; }
      else if (caminho && c.caminho !== caminho) return false;
      if (filtro.tipo && c.tipo !== filtro.tipo) return false;
      if (filtro.classe && !c.classes.includes(filtro.classe)) return false;
      if (filtro.atributo && c.atributo !== filtro.atributo) return false;
      if (p && filtro.situacao === 'adquiridas' && !p.adquiridas[c.id]) return false;
      if (p && filtro.situacao === 'deck' && !p.deck[c.id]) return false;
      if (!termos.length) return true;
      const texto = norm([c.id, c.nome, c.deckName, c.caminho, c.tipo, c.atributo, c.efeito, ...c.classes, ...c.palavras].join(' '));
      return termos.every((t) => texto.includes(t));
    });
  }
  function renderResultados(p) {
    const lista = cartasFiltradas(p);
    document.getElementById('resultados').innerHTML = `<p class="contador">${lista.length} de ${CARTAS.length} cartas</p>
      ${lista.length ? `<div class="cartas">${lista.map((c) => htmlCarta(c, p)).join('')}</div>` : '<div class="vazio">Nenhuma carta encontrada.</div>'}`;
  }
  function selectFiltro(chave, rotuloTodos, opcoes, extra = '') {
    const atual = filtro[chave] || '';
    return `<select data-filtro="${chave}" aria-label="${esc(rotuloTodos)}"><option value="">${esc(rotuloTodos)}</option>${extra}${opcoes.map((o) => `<option ${o === atual ? 'selected' : ''}>${esc(o)}</option>`).join('')}</select>`;
  }
  function renderCatalogo(p) {
    if (!CARTAS.length) {
      $app.innerHTML = '<div class="vazio">O catálogo de cartas ainda está vazio.</div>';
      return;
    }
    if (p && filtroDe !== p.id) { filtroPersonagem = novoFiltro(); filtroDe = p.id; }
    filtro = p ? filtroPersonagem : filtroGeral;
    // No personagem, começa mostrando só as cartas dos caminhos dele.
    if (filtro.caminho === null) filtro.caminho = p && meusCaminhos(p).size ? MEUS : '';
    const meusOpt = p ? `<option value="${MEUS}" ${filtro.caminho === MEUS ? 'selected' : ''}>Meus caminhos</option>` : '';
    $app.innerHTML = `
      ${p ? htmlResumoDeck(p, false) : ''}
      <div class="filtros">
        <input type="text" id="busca" class="busca" placeholder="Buscar por nome, código, efeito…" aria-label="Buscar cartas" value="${esc(filtro.busca)}">
        ${selectFiltro('caminho', 'Todos os caminhos', opcoesFiltro.caminho, meusOpt)}
        ${selectFiltro('tipo', 'Todos os tipos', opcoesFiltro.tipo)}
        ${selectFiltro('classe', 'Todas as classes', opcoesFiltro.classe)}
        ${selectFiltro('atributo', 'Todos os atributos', opcoesFiltro.atributo)}
        ${p ? `<select data-filtro="situacao" aria-label="Situação">
          <option value="">Adquiridas ou não</option>
          <option value="adquiridas" ${filtro.situacao === 'adquiridas' ? 'selected' : ''}>Só adquiridas</option>
          <option value="deck" ${filtro.situacao === 'deck' ? 'selected' : ''}>Só no deck</option>
        </select>` : ''}
      </div>
      <div id="resultados"></div>`;
    document.getElementById('busca').addEventListener('input', (e) => { filtro.busca = e.target.value; renderResultados(p); });
    $app.querySelectorAll('[data-filtro]').forEach((s) => s.addEventListener('change', () => { filtro[s.dataset.filtro] = s.value; renderResultados(p); }));
    renderResultados(p);
  }
  // Redesenha as cartas visíveis e o resumo, sem refazer a busca (mantém filtros e rolagem).
  // Todas, porque uma mudança pode liberar ou bloquear o "+" de outras cartas.
  function atualizarCatalogo(p) {
    $app.querySelectorAll('.carta').forEach((art) => {
      const c = cartaPorId.get(art.dataset.id);
      if (c) art.outerHTML = htmlCarta(c, p);
    });
    const resumo = document.getElementById('resumo-deck');
    if (resumo) resumo.outerHTML = htmlResumoDeck(p, false);
  }

  // ---------- deck ----------
  function htmlResumoDeck(p, comProblemas) {
    const total = totalDeck(p);
    const problemas = problemasDeck(p);
    const pct = Math.min(100, (total / DECK_MAX) * 100);
    const status = problemas.length ? (total > DECK_MAX ? '<span class="selo erro">Acima do limite</span>' : '<span class="selo aviso">Incompleto</span>') : '<span class="selo ok">Deck válido ✓</span>';
    return `<div class="resumo-deck" id="resumo-deck">
      <span class="contagem">${total} <small>/ ${DECK_MAX} cartas</small></span>
      <div class="barra" title="Mínimo ${DECK_MIN}, máximo ${DECK_MAX}"><i style="width:${pct}%"></i><span class="marca" style="left:${(DECK_MIN / DECK_MAX) * 100}%"></span></div>
      ${status}
      <span class="motivo">${somar(p.adquiridas)} adquiridas</span>
      ${comProblemas && problemas.length ? `<ul>${problemas.map((x) => `<li>${esc(x)}</li>`).join('')}</ul>` : ''}
    </div>`;
  }
  const modoDeck = { soDeck: false };
  function renderDeck(p) {
    const ids = new Set([...Object.keys(p.adquiridas), ...Object.keys(p.deck)]);
    const regras = `Regras: de ${DECK_MIN} a ${DECK_MAX} cartas; até 3 cópias de cada carta (cartas com o mesmo nome de deck, como Pummel I, II e III, somam juntas); cartas Únicas, só 1.`;
    if (!ids.size) {
      $app.innerHTML = `${htmlResumoDeck(p, false)}<div class="vazio">Nenhuma carta adquirida ainda.<br>Adquira cartas pela aba <a href="#/p/${encodeURIComponent(p.id)}/catalogo">Catálogo</a> e depois monte o deck aqui.<br><small>${esc(regras)}</small></div>`;
      return;
    }
    const grupos = new Map();
    for (const id of ids) {
      const c = cartaPorId.get(id);
      if (modoDeck.soDeck && !p.deck[id]) continue;
      const g = c ? c.caminho || 'Sem caminho' : 'Fora do catálogo';
      if (!grupos.has(g)) grupos.set(g, []);
      grupos.get(g).push({ id, c });
    }
    const html = ordenar([...grupos.keys()]).map((g) => {
      const itens = grupos.get(g).sort((a, b) => a.id.localeCompare(b.id, 'pt-BR', { numeric: true }));
      const noDeck = itens.reduce((s, x) => s + (p.deck[x.id] || 0), 0);
      return `<div class="deck-grupo"><h3>${esc(g)} <small>${noDeck} no deck</small></h3>${itens.map(({ id, c }) => {
        const a = p.adquiridas[id] || 0;
        const q = p.deck[id] || 0;
        if (!c) {
          return `<div class="deck-linha problema"><div class="resumo-linha"><span class="nome">${esc(id)}<small>Esta carta não existe mais no catálogo.</small></span>
            <button class="btn pequeno perigo" data-acao="esquecer" data-carta="${esc(id)}">Remover</button></div></div>`;
        }
        const motivo = motivoNaoPorNoDeck(p, c);
        return `<details class="deck-linha ${q ? 'em-uso' : ''}" data-id="${esc(id)}">
          <summary class="resumo-linha">
            <span class="nome">${esc(c.nome)} <span class="codigo">${esc(c.id)}</span><small class="sub">${esc([c.tipo, ...c.classes].filter(Boolean).join(' · '))}</small></span>
            <span class="contas"><span class="qtd-grande">${q}</span><span class="de">/ ${a}</span></span>
            <button class="btn pequeno" data-acao="menos" data-carta="${esc(id)}" ${q ? '' : 'disabled'} aria-label="Tirar uma do deck">−</button>
            <button class="btn pequeno" data-acao="mais" data-carta="${esc(id)}" ${motivo ? 'disabled' : ''} title="${esc(motivo)}" aria-label="Pôr uma no deck">+</button>
          </summary>
          <div class="corpo">${htmlTags(c)}${htmlDetalhesCarta(c)}${motivo && a > q ? `<p class="motivo">${esc(motivo)}</p>` : ''}</div>
        </details>`;
      }).join('')}</div>`;
    }).join('');
    const abertas = new Set([...$app.querySelectorAll('details.deck-linha[open]')].map((d) => d.dataset.id));
    $app.innerHTML = `${htmlResumoDeck(p, true)}
      <div class="alternar">
        <button class="btn pequeno ${modoDeck.soDeck ? '' : 'ativo'}" data-acao="ver-todas">Todas as adquiridas</button>
        <button class="btn pequeno ${modoDeck.soDeck ? 'ativo' : ''}" data-acao="ver-deck">Só o deck</button>
        <span class="motivo">Números: no deck / adquiridas</span>
      </div>
      ${html || '<div class="vazio">Nenhuma carta no deck.</div>'}
      <p class="motivo" style="margin-top:16px">${esc(regras)}</p>`;
    $app.querySelectorAll('details.deck-linha').forEach((d) => { if (abertas.has(d.dataset.id)) d.open = true; });
  }

  // ---------- importar / exportar ----------
  function baixar(nomeArquivo, dados) {
    const blob = new Blob([JSON.stringify(dados, null, 2)], { type: 'application/json' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = nomeArquivo;
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(a.href), 1000);
  }
  const hoje = () => new Date().toISOString().slice(0, 10);
  const nomeArquivo = (s) => norm(s).replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'personagem';

  function importar(texto) {
    let dados;
    try { dados = JSON.parse(texto); } catch (e) { alert('Esse arquivo não é um backup válido.'); return; }
    const lista = Array.isArray(dados && dados.personagens) ? dados.personagens : ehObjeto(dados) && 'keyper' in dados ? [dados] : null;
    if (!lista || !lista.length) { alert('Nenhum personagem encontrado nesse arquivo.'); return; }
    let novos = lista.filter(ehObjeto).map(normalizarPersonagem);
    const repetidos = novos.filter((n) => buscarPersonagem(n.id));
    if (repetidos.length && !confirm(`${repetidos.length} personagem(ns) do arquivo já existe(m) aqui (${repetidos.map(nomeDe).join(', ')}).\nSubstituir pela versão do arquivo?`)) {
      const ids = new Set(repetidos.map((r) => r.id));
      novos = novos.filter((n) => !ids.has(n.id));
    }
    for (const n of novos) {
      const i = store.personagens.findIndex((p) => p.id === n.id);
      if (i >= 0) store.personagens[i] = n;
      else store.personagens.push(n);
    }
    salvarAgora();
    if (novos.length) alert(`${novos.length} personagem(ns) importado(s).`);
    render();
  }
  $arquivo.addEventListener('change', () => {
    const f = $arquivo.files[0];
    if (!f) return;
    const leitor = new FileReader();
    leitor.onload = () => importar(String(leitor.result));
    leitor.readAsText(f);
    $arquivo.value = '';
  });

  // ---------- ações ----------
  document.addEventListener('click', (e) => {
    const b = e.target.closest('[data-acao]');
    if (!b || b.disabled) return;
    const r = rotaAtual();
    const p = personagemDaRota();
    const acao = b.dataset.acao;

    if (acao === 'novo') {
      const n = novoPersonagem();
      store.personagens.push(n);
      salvarAgora();
      ir(`#/p/${encodeURIComponent(n.id)}/ficha`);
      return;
    }
    if (acao === 'importar') { $arquivo.click(); return; }
    if (acao === 'exportar-todos') { baixar(`alther-fichas-${hoje()}.json`, store); return; }
    if (!p) return;

    const carta = b.dataset.carta && cartaPorId.get(b.dataset.carta);
    if (['mais', 'menos', 'adquirir', 'desadquirir', 'esquecer'].includes(acao)) {
      e.preventDefault(); // dentro de <summary>, não abre/fecha a linha
      if (acao === 'esquecer') { delete p.deck[b.dataset.carta]; delete p.adquiridas[b.dataset.carta]; }
      else if (!carta) return;
      else if (acao === 'mais') alterarDeck(p, carta, 1);
      else if (acao === 'menos') alterarDeck(p, carta, -1);
      else if (acao === 'adquirir') adquirir(p, carta);
      else if (acao === 'desadquirir') {
        if ((p.deck[carta.id] || 0) >= (p.adquiridas[carta.id] || 0) && !confirm(`Desfazer a aquisição de uma cópia de "${carta.nome}"? Ela também sai do deck.`)) return;
        desfazerAquisicao(p, carta);
      }
      salvar(p);
      if (r.aba === 'catalogo') atualizarCatalogo(p);
      else renderDeck(p);
      atualizarAbaDeck(p);
      return;
    }
    if (acao === 'ver-todas' || acao === 'ver-deck') { modoDeck.soDeck = acao === 'ver-deck'; renderDeck(p); return; }
    if (acao === 'add-caminho' || acao === 'remover-caminho') {
      if (acao === 'add-caminho') p.caminhos.push(caminhoVazio());
      else {
        const c = p.caminhos[Number(b.dataset.i)];
        if (c && (c.nome || c.atual || c.nivel) && !confirm(`Remover o caminho${c.nome ? ` ${c.nome}` : ''} da ficha? As cartas já adquiridas continuam com o personagem.`)) return;
        p.caminhos.splice(Number(b.dataset.i), 1);
      }
      salvar(p);
      const box = document.getElementById('caminhos');
      box.innerHTML = htmlCaminhos(p);
      preencher(box, p);
      return;
    }
    if (acao === 'add-hab' || acao === 'remover-hab') {
      if (acao === 'add-hab') p.companheiro.habilidades.push({ nome: '', descricao: '' });
      else p.companheiro.habilidades.splice(Number(b.dataset.i), 1);
      salvar(p);
      const box = document.getElementById('hab-companheiro');
      box.innerHTML = htmlHabilidadesCompanheiro(p);
      preencher(box, p);
      return;
    }
    if (acao === 'exportar-um') { baixar(`${nomeArquivo(nomeDe(p))}.json`, { versao: 1, personagens: [p] }); return; }
    if (acao === 'duplicar') {
      const copia = normalizarPersonagem(JSON.parse(JSON.stringify(p)));
      copia.id = uid();
      copia.keyper = `${p.keyper || 'Personagem'} (cópia)`;
      copia.criadoEm = copia.atualizadoEm = Date.now();
      store.personagens.push(copia);
      salvarAgora();
      ir(`#/p/${encodeURIComponent(copia.id)}/ficha`);
      return;
    }
    if (acao === 'excluir') {
      if (!confirm(`Excluir "${nomeDe(p)}"? A ficha, as cartas adquiridas e o deck serão apagados deste aparelho.`)) return;
      store.personagens = store.personagens.filter((x) => x.id !== p.id);
      salvarAgora();
      ir('#/');
    }
  });

  carregar();
  render();
})();
