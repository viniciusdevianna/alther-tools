(() => {
  'use strict';

  const { esc, norm, num, cartaPorId, classeAtributo, htmlTags, htmlCorpoCarta, CHAVE_FICHAS, chaveBatalha, lerFichas } = window.Alther;

  const MAO_INICIAL = 5;
  const DESFAZER_MAX = 40;
  const ATRIBUTOS = [['corpo', 'Corpo'], ['mente', 'Mente'], ['foco', 'Foco'], ['espirito', 'Espírito'], ['social', 'Social'], ['natureza', 'Natureza']];
  const ZONAS = { deck: 'Deck', mao: 'Mão', campo: 'Campo', descarte: 'Descarte', banidas: 'Banidas' };

  const $app = document.getElementById('app');
  const $titulo = document.getElementById('titulo');
  const $rodada = document.getElementById('rodada');
  const $voltar = document.getElementById('voltar');
  const $janela = document.getElementById('janela');
  const $aviso = document.getElementById('aviso');
  const $painelFicha = document.getElementById('painel-ficha');
  const $abrirFicha = document.getElementById('abrir-ficha');

  const idPersonagem = decodeURIComponent(location.hash.slice(1));
  const CHAVE = chaveBatalha(idPersonagem);
  $voltar.href = `./#/p/${encodeURIComponent(idPersonagem)}/deck`;

  // Estado da batalha. Ordem das pilhas: deck[0] é o topo (próxima compra);
  // descarte[último] é o topo (a carta descartada mais recente). O descarte nunca é embaralhado.
  let estado = null;
  const pilhaDesfazer = [];

  // ---------- personagem: recargas e pontos de atributo (ficam na ficha) ----------
  const personagem = () => lerFichas().personagens.find((p) => p.id === idPersonagem);
  const par = (x) => ({ atual: num(x && x.atual), total: num(x && x.total) });
  function recargas() { const p = personagem(); return par(p && p.recargas); }
  function pontos(chave) { const p = personagem(); return par(p && p.atributos && p.atributos[chave]); }

  // Lê a ficha mais recente, altera e grava (a ficha pode ter sido editada em outra aba).
  function alterarFicha(fn) {
    const fichas = lerFichas();
    const p = fichas.personagens.find((x) => x.id === idPersonagem);
    if (!p) return;
    fn(p);
    p.atualizadoEm = Date.now();
    localStorage.setItem(CHAVE_FICHAS, JSON.stringify(fichas));
  }
  const gravarRecargas = (valor) => alterarFicha((p) => { p.recargas = { ...(p.recargas || {}), atual: valor == null ? '' : String(valor) }; });
  const gravarAtributo = (chave, valor) => alterarFicha((p) => {
    p.atributos = p.atributos || {};
    p.atributos[chave] = { ...(p.atributos[chave] || {}), atual: String(valor) };
  });
  // Foto dos valores da ficha que a batalha altera, para o Desfazer devolvê-los.
  function fotoFicha() {
    const p = personagem() || {};
    const at = p.atributos || {};
    return JSON.stringify({ recargas: (p.recargas && p.recargas.atual) ?? '', atributos: Object.fromEntries(ATRIBUTOS.map(([k]) => [k, (at[k] && at[k].atual) ?? ''])) });
  }
  function restaurarFoto(foto) {
    const f = JSON.parse(foto);
    alterarFicha((p) => {
      p.recargas = { ...(p.recargas || {}), atual: f.recargas };
      p.atributos = p.atributos || {};
      for (const [k, v] of Object.entries(f.atributos)) p.atributos[k] = { ...(p.atributos[k] || {}), atual: v };
    });
  }

  // Custo da carta: pago com pontos do atributo atual da própria carta (Corpo, Mente...).
  // Itens têm atributo "Qualquer" (o X da carta): o jogador escolhe qual atributo paga.
  // Devolve as formas de pagar; lista vazia = carta sem custo.
  function custosDe(c) {
    const valor = num(c.custo);
    const chave = norm(c.atributo);
    if (!valor || valor <= 0) return [];
    const opcoes = chave === 'qualquer' ? ATRIBUTOS : ATRIBUTOS.filter(([k]) => k === chave);
    return opcoes.map(([k, nome]) => ({ chave: k, valor, nome }));
  }
  function motivoNaoPagar(k) {
    const disponivel = pontos(k.chave).atual ?? 0;
    return disponivel < k.valor ? `${k.nome} insuficiente: tem ${disponivel}, a carta custa ${k.valor}.` : '';
  }
  // Motivo para não poder jogar: só quando nenhuma forma de pagar é possível.
  function motivoNaoJogar(inst) {
    const ks = custosDe(cartaDe(inst));
    if (!ks.length || ks.some((k) => !motivoNaoPagar(k))) return '';
    return ks.length === 1 ? motivoNaoPagar(ks[0]) : `Nenhum atributo tem ${ks[0].valor} pontos para pagar a carta.`;
  }

  // ---------- armazenamento ----------
  function carregar() {
    try { estado = JSON.parse(localStorage.getItem(CHAVE)); } catch (e) { estado = null; }
  }
  function salvar() {
    try {
      if (estado) localStorage.setItem(CHAVE, JSON.stringify(estado));
      else localStorage.removeItem(CHAVE);
    } catch (e) { avisar('Não foi possível salvar a batalha neste aparelho.'); }
  }

  // ---------- utilidades ----------
  function aleatorio(n) {
    const a = new Uint32Array(1);
    crypto.getRandomValues(a);
    return a[0] % n;
  }
  function embaralhar(lista) {
    for (let i = lista.length - 1; i > 0; i--) {
      const j = aleatorio(i + 1);
      [lista[i], lista[j]] = [lista[j], lista[i]];
    }
    return lista;
  }
  const cartaDe = (inst) => cartaPorId.get(estado.instancias[inst]) || { id: estado.instancias[inst], nome: `${estado.instancias[inst]} (fora do catálogo)`, classes: [], palavras: [] };
  const nomeDe = (inst) => cartaDe(inst).nome;

  let timerAviso = null;
  function avisar(texto) {
    $aviso.textContent = texto;
    $aviso.classList.add('mostrar');
    clearTimeout(timerAviso);
    timerAviso = setTimeout(() => $aviso.classList.remove('mostrar'), 2600);
  }
  function registrar(texto) {
    estado.historico.push(`${estado.rodada ? `R${estado.rodada} · ` : ''}${texto}`);
    if (estado.historico.length > 200) estado.historico.shift();
  }

  // Toda ação passa por aqui: guarda o estado anterior (para Desfazer), executa, salva e redesenha.
  function acao(fn) {
    const antes = { estado: JSON.stringify(estado), ficha: fotoFicha() };
    const resultado = fn();
    if (resultado === false) return;
    pilhaDesfazer.push(antes);
    if (pilhaDesfazer.length > DESFAZER_MAX) pilhaDesfazer.shift();
    salvar();
    render();
  }
  function desfazer() {
    const antes = pilhaDesfazer.pop();
    if (!antes) return;
    estado = JSON.parse(antes.estado);
    if (antes.ficha !== fotoFicha()) restaurarFoto(antes.ficha);
    salvar();
    fecharJanela(false);
    render();
    avisar('Última ação desfeita.');
  }

  // ---------- regras ----------
  function novaBatalha(p) {
    const instancias = {};
    const deck = [];
    let n = 0;
    for (const [id, q] of Object.entries(p.deck || {})) {
      for (let i = 0; i < q; i++) {
        const inst = `c${++n}`;
        instancias[inst] = id;
        deck.push(inst);
      }
    }
    estado = { versao: 1, personagemId: p.id, iniciadaEm: Date.now(), rodada: 0, emRodada: false, instancias, deck: embaralhar(deck), mao: [], campo: [], descarte: [], banidas: [], historico: [] };
    registrar(`Batalha iniciada com ${deck.length} cartas. Deck embaralhado.`);
    pilhaDesfazer.length = 0;
    salvar();
    render();
  }

  function comprar(qtd) {
    const compradas = estado.deck.splice(0, qtd);
    estado.mao.push(...compradas);
    return compradas.length;
  }
  function iniciarRodada() {
    acao(() => {
      estado.rodada += 1;
      estado.emRodada = true;
      const n = comprar(MAO_INICIAL);
      registrar(`Início da rodada: comprou ${n} carta(s).`);
      if (n < MAO_INICIAL) avisar(n ? `O deck só tinha ${n} carta(s). Use Recarregar.` : 'O deck está vazio. Use Recarregar.');
    });
  }
  function fimRodada() {
    acao(() => {
      const n = estado.mao.length;
      estado.descarte.push(...estado.mao);
      estado.mao = [];
      estado.emRodada = false;
      registrar(`Fim da rodada: ${n} carta(s) da mão foram para o descarte.`);
    });
  }
  function comprarAvulsa() {
    if (!estado.deck.length) { avisar('O deck está vazio. Use Recarregar.'); return; }
    acao(() => {
      const [inst] = estado.deck.slice(0, 1);
      comprar(1);
      registrar(`Comprou 1 carta avulsa (${nomeDe(inst)}).`);
    });
  }
  function recarregar() {
    const r = recargas();
    if (!estado.descarte.length) { avisar('O descarte está vazio.'); return; }
    if (r.atual == null || r.atual < 1) { avisar('Sem recargas. Ajuste as Recargas na ficha.'); return; }
    if (!confirm(`Recarregar? As ${estado.descarte.length} carta(s) do descarte voltam ao deck, o deck é embaralhado e você gasta 1 recarga (${r.atual} → ${r.atual - 1}).`)) return;
    acao(() => {
      const n = estado.descarte.length;
      estado.deck.push(...estado.descarte);
      estado.descarte = [];
      embaralhar(estado.deck);
      gravarRecargas(r.atual - 1);
      registrar(`Recarregou: ${n} carta(s) do descarte voltaram ao deck, que foi embaralhado. Recargas: ${r.atual - 1}.`);
    });
  }

  // Jogar: paga o custo com o atributo escolhido (k, de custosDe) e coloca a carta no campo.
  function jogar(inst, k) {
    const motivo = k ? motivoNaoPagar(k) : motivoNaoJogar(inst);
    if (motivo) { avisar(motivo); return; }
    const c = cartaDe(inst);
    acao(() => {
      const i = estado.mao.indexOf(inst);
      if (i < 0) return false;
      estado.mao.splice(i, 1);
      estado.campo.push(inst);
      if (k) {
        const resta = (pontos(k.chave).atual ?? 0) - k.valor;
        gravarAtributo(k.chave, resta);
        registrar(`Jogou ${c.nome}: pagou ${k.valor} de ${k.nome} (resta ${resta}).`);
      } else {
        registrar(`Jogou ${c.nome}.`);
      }
    });
  }

  // Move uma carta entre zonas. posicao (só para o deck): 'topo' | 'fundo' | 'embaralhar'.
  function mover(inst, de, para, posicao, texto) {
    acao(() => {
      const i = estado[de].indexOf(inst);
      if (i < 0) return false;
      estado[de].splice(i, 1);
      if (para === 'deck') {
        if (posicao === 'topo') estado.deck.unshift(inst);
        else if (posicao === 'fundo') estado.deck.push(inst);
        else { estado.deck.push(inst); embaralhar(estado.deck); }
      } else {
        estado[para].push(inst);
      }
      registrar(texto);
    });
  }

  // Ações disponíveis para uma carta em cada zona.
  function acoesDe(zona, inst) {
    const nome = nomeDe(inst);
    const a = (rotulo, para, texto, extra = {}) => ({ rotulo, fn: () => mover(inst, zona, para, extra.posicao, texto), ...extra });
    if (zona === 'mao') {
      const ks = custosDe(cartaDe(inst));
      // Um botão Jogar por forma de pagar (itens: um por atributo).
      const jogadas = ks.length
        ? ks.map((k) => ({ rotulo: `Jogar (−${k.valor} ${k.nome})`, fn: () => jogar(inst, k), principal: true, motivo: ks.length > 1 ? '' : motivoNaoPagar(k), bloqueado: !!motivoNaoPagar(k) }))
        : [{ rotulo: 'Jogar', fn: () => jogar(inst, null), principal: true }];
      return [
        ...jogadas,
        a('Descartar', 'descarte', `Descartou ${nome} da mão.`),
        a('Banir', 'banidas', `Baniu ${nome} da mão.`, { perigo: true }),
      ];
    }
    if (zona === 'campo') {
      return [
        a('Descartar', 'descarte', `Descartou ${nome} do campo.`, { principal: true }),
        a('Voltar para a mão', 'mao', `${nome} voltou do campo para a mão.`),
        a('Banir', 'banidas', `Baniu ${nome} do campo.`, { perigo: true }),
      ];
    }
    if (zona === 'descarte') {
      return [
        a('Para a mão', 'mao', `${nome} foi do descarte para a mão.`, { principal: true }),
        a('Topo do deck', 'deck', `${nome} foi do descarte para o topo do deck.`, { posicao: 'topo' }),
        a('Fundo do deck', 'deck', `${nome} foi do descarte para o fundo do deck.`, { posicao: 'fundo' }),
        a('Embaralhar no deck', 'deck', `${nome} foi do descarte para o deck, que foi embaralhado.`, { posicao: 'embaralhar' }),
        a('Banir', 'banidas', `Baniu ${nome} do descarte.`, { perigo: true }),
      ];
    }
    if (zona === 'deck') {
      return [a('Pegar para a mão', 'mao', `Buscou ${nome} no deck.`, { principal: true })];
    }
    return [];
  }

  // ---------- janela ----------
  // Ao fechar a janela depois de ver o deck, ele é embaralhado (como ao procurar no deck físico).
  let deckFoiVisto = false;
  function abrirJanela(titulo, corpo, voltar) {
    $janela.innerHTML = `<div class="janela-topo">
        ${voltar ? '<button class="btn pequeno" data-j="voltar" aria-label="Voltar">←</button>' : ''}
        <h2>${esc(titulo)}</h2>
        <button class="btn pequeno" data-j="fechar" aria-label="Fechar">✕</button>
      </div>
      <div class="janela-corpo">${corpo}</div>`;
    $janela._voltar = voltar || null;
    if (!$janela.open) $janela.showModal();
    $janela.scrollTop = 0;
  }
  function fecharJanela(embaralharSeVisto = true) {
    if ($janela.open) $janela.close();
    if (embaralharSeVisto && deckFoiVisto) {
      deckFoiVisto = false;
      if (estado && estado.deck.length > 1) {
        acao(() => { embaralhar(estado.deck); registrar('Deck embaralhado depois da busca.'); });
        avisar('Deck embaralhado.');
      }
    }
    deckFoiVisto = false;
  }
  $janela.addEventListener('cancel', (e) => { e.preventDefault(); fecharJanela(); });
  $janela.addEventListener('click', (e) => {
    if (e.target === $janela) { fecharJanela(); return; } // clique fora
    const j = e.target.closest('[data-j]');
    if (!j) return;
    if (j.dataset.j === 'fechar') fecharJanela();
    else if (j.dataset.j === 'voltar' && $janela._voltar) $janela._voltar();
    else if (j.dataset.j === 'item') abrirCarta(j.dataset.inst, j.dataset.zona, $janela._lista);
    else if (j.dataset.j === 'acao') {
      const fn = $janela._acoes[Number(j.dataset.i)];
      const deVolta = $janela._lista;
      fn();
      // Ao mexer numa carta vinda de uma lista, volta para a lista; senão fecha.
      if (deVolta && deVolta.zona !== 'deck' && estado[deVolta.zona].length) abrirLista(deVolta.zona);
      else fecharJanela();
    }
  });

  function abrirCarta(inst, zona, lista) {
    const c = cartaDe(inst);
    const acoes = acoesDe(zona, inst);
    $janela._acoes = acoes.map((x) => x.fn);
    $janela._lista = lista || null;
    const botoes = acoes.map((x, i) => `<button class="btn ${x.principal ? 'principal' : ''} ${x.perigo ? 'perigo' : ''}" data-j="acao" data-i="${i}" ${x.motivo || x.bloqueado ? 'disabled' : ''}>${esc(x.rotulo)}</button>`).join('');
    const nenhum = zona === 'mao' && motivoNaoJogar(inst);
    const motivos = (nenhum ? [{ motivo: nenhum }] : acoes).filter((x) => x.motivo).map((x) => `<p class="aviso-janela">${esc(x.motivo)} Ajuste pela 📜 Ficha se precisar.</p>`).join('');
    abrirJanela(`${ZONAS[zona]}`, `
      <article class="carta ${classeAtributo(c)}">
        <header><h3>${esc(c.nome)}</h3><span class="codigo">${esc(c.id)}</span></header>
        ${htmlTags(c)}
        ${htmlCorpoCarta(c)}
      </article>
      ${motivos}
      ${botoes ? `<div class="acoes-carta">${botoes}</div>` : ''}`, lista ? () => abrirLista(lista.zona) : null);
  }

  function itemLista(inst, zona, pos) {
    const c = cartaDe(inst);
    return `<button class="item-lista ${classeAtributo(c)}" data-j="item" data-inst="${inst}" data-zona="${zona}">
      ${pos ? `<span class="pos">${esc(pos)}</span>` : ''}
      <span class="nome">${esc(c.nome)}<br><small>${esc([c.tipo, c.atributo, c.custo !== '' && c.custo != null ? `Custo ${c.custo}` : ''].filter(Boolean).join(' · '))}</small></span>
    </button>`;
  }
  function abrirLista(zona) {
    const itens = estado[zona];
    let corpo;
    if (zona === 'deck') {
      deckFoiVisto = true;
      // Em ordem alfabética, para achar a carta; a ordem real não é revelada.
      const ordenados = [...itens].sort((a, b) => nomeDe(a).localeCompare(nomeDe(b), 'pt-BR'));
      corpo = `<p class="aviso-janela">Ao fechar, o deck será embaralhado.</p>
        <div class="lista-cartas">${ordenados.map((i) => itemLista(i, zona)).join('') || '<div class="zona-vazia">Deck vazio.</div>'}</div>`;
    } else if (zona === 'descarte') {
      // Do topo (mais recente) para baixo. A ordem do descarte nunca muda.
      const doTopo = [...itens].reverse();
      corpo = `<div class="lista-cartas">${doTopo.map((i, k) => itemLista(i, zona, k === 0 ? 'topo' : `${k + 1}º`)).join('') || '<div class="zona-vazia">Descarte vazio.</div>'}</div>`;
    } else {
      corpo = `<div class="lista-cartas">${itens.map((i) => itemLista(i, zona)).join('') || '<div class="zona-vazia">Nenhuma carta.</div>'}</div>`;
    }
    $janela._lista = { zona };
    abrirJanela(`${ZONAS[zona]} · ${itens.length}`, corpo);
    $janela._lista = { zona };
  }

  // ---------- ficha por cima da batalha ----------
  // A ficha abre num iframe (index.html em modo embutido) para editar PV, atributos etc.
  // sem sair da batalha. Um iframe novo a cada abertura garante dados atualizados.
  function abrirFicha() {
    const corpo = $painelFicha.querySelector('.painel-corpo');
    corpo.innerHTML = `<iframe src="index.html?embutida#/p/${encodeURIComponent(idPersonagem)}/ficha" title="Ficha do personagem"></iframe>`;
    $painelFicha.showModal();
  }
  let fechandoFicha = false;
  function fecharFicha() {
    if (fechandoFicha) return;
    fechandoFicha = true;
    const iframe = $painelFicha.querySelector('iframe');
    const concluir = () => {
      removeEventListener('message', aoSalvar);
      $painelFicha.close();
      $painelFicha.querySelector('.painel-corpo').innerHTML = '';
      fechandoFicha = false;
      render(); // recargas podem ter mudado
    };
    const aoSalvar = (e) => { if (e.data && e.data.tipo === 'alther-salvo') { clearTimeout(limite); concluir(); } };
    // Pede para a ficha gravar o que ainda está pendente antes de fechar.
    const limite = setTimeout(concluir, 600);
    addEventListener('message', aoSalvar);
    try { iframe.contentWindow.postMessage({ tipo: 'alther-salvar' }, '*'); } catch (e) { clearTimeout(limite); concluir(); }
  }
  $abrirFicha.addEventListener('click', abrirFicha);
  document.getElementById('fechar-ficha').addEventListener('click', fecharFicha);
  $painelFicha.addEventListener('cancel', (e) => { e.preventDefault(); fecharFicha(); });

  // ---------- desenho ----------
  function mini(inst, zona) {
    const c = cartaDe(inst);
    const caro = zona === 'mao' && !!motivoNaoJogar(inst);
    const nums = [['Custo', c.custo], ['Alc.', c.alcance], ['Acerto', c.acerto]]
      .filter(([, v]) => v !== '' && v != null && v !== 'NA' && v !== '-')
      .map(([t, v]) => `<span class="${t === 'Custo' && caro ? 'caro' : ''}" ${t === 'Custo' && caro ? 'title="Pontos insuficientes"' : ''}>${t} <b>${esc(v)}</b></span>`).join('');
    return `<button class="mini ${classeAtributo(c)}" data-inst="${inst}" data-zona="${zona}">
      <h3>${esc(c.nome)}</h3>
      <span class="sub">${esc([c.tipo, ...(c.classes || [])].filter(Boolean).join(' · '))}</span>
      ${nums ? `<span class="nums">${nums}</span>` : ''}
      ${c.efeito ? `<p>${esc(c.efeito)}</p>` : ''}
    </button>`;
  }

  function renderInicio(p) {
    $rodada.textContent = '';
    const total = Object.values(p.deck || {}).reduce((s, q) => s + q, 0);
    const avisos = [];
    if (total < 15) avisos.push(`O deck tem ${total} carta(s); o mínimo é 15.`);
    if (total > 30) avisos.push(`O deck tem ${total} cartas; o máximo é 30.`);
    $app.innerHTML = `<div class="inicio">
      <h2>Nova batalha</h2>
      <p>O deck de <b>${esc(p.keyper || 'personagem sem nome')}</b> tem <b>${total}</b> carta(s). Ele será embaralhado e você começa sem cartas na mão.</p>
      ${avisos.length ? `<ul>${avisos.map((x) => `<li>${esc(x)}</li>`).join('')}</ul>` : ''}
      <button class="btn grande principal" data-acao="comecar" ${total ? '' : 'disabled'}>Embaralhar e começar</button>
      ${total ? '' : `<a href="${$voltar.href}">Monte o deck primeiro</a>`}
    </div>`;
  }

  function render() {
    const p = personagem();
    if (!p) {
      $titulo.textContent = 'Batalha';
      $app.innerHTML = '<div class="inicio"><h2>Personagem não encontrado</h2><p>Abra a batalha pela ficha do personagem.</p><a class="btn" href="./">Ir para as fichas</a></div>';
      return;
    }
    $titulo.textContent = p.keyper || 'Batalha';
    $abrirFicha.hidden = false;
    $painelFicha.querySelector('h2').textContent = `Ficha · ${p.keyper || 'Personagem'}`;
    document.title = `Batalha · ${p.keyper || 'Personagem'}`;
    if (!estado) { renderInicio(p); return; }

    $rodada.textContent = estado.rodada ? `Rodada ${estado.rodada}` : 'Antes da 1ª rodada';
    const r = recargas();
    const topo = estado.descarte[estado.descarte.length - 1];
    const cTopo = topo && cartaDe(topo);
    const semRecarga = r.atual == null || r.atual < 1;

    $app.innerHTML = `
      <section class="mesa">
        <div class="pilha">
          <h2>Deck</h2>
          <button class="monte ${estado.deck.length ? 'verso' : 'vazio'}" data-acao="comprar" aria-label="Comprar 1 carta"><span>${estado.deck.length}</span></button>
          <div class="botoes">
            <button class="btn pequeno" data-acao="comprar" ${estado.deck.length ? '' : 'disabled'}>Comprar 1</button>
            <button class="btn pequeno" data-acao="ver-deck" ${estado.deck.length ? '' : 'disabled'}>Ver deck</button>
          </div>
        </div>
        <div class="pilha">
          <h2>Descarte</h2>
          ${cTopo
            ? `<button class="monte topo ${classeAtributo(cTopo)}" data-acao="ver-descarte" aria-label="Ver descarte"><b>${estado.descarte.length}</b>${esc(cTopo.nome)}</button>`
            : '<button class="monte vazio" data-acao="ver-descarte" aria-label="Descarte vazio">0</button>'}
          <div class="botoes"><button class="btn pequeno" data-acao="ver-descarte" ${estado.descarte.length ? '' : 'disabled'}>Ver descarte</button></div>
        </div>
        <div class="pilha">
          <h2>Banidas</h2>
          <button class="monte vazio" data-acao="ver-banidas" aria-label="Ver banidas">${estado.banidas.length}</button>
          <div class="botoes"><button class="btn pequeno" data-acao="ver-banidas" ${estado.banidas.length ? '' : 'disabled'}>Ver banidas</button></div>
        </div>
        <div class="pilha recargas">
          <h2>Recargas</h2>
          <b>${r.atual ?? '—'}${r.total != null ? `<small class="contagem-pilha"> / ${r.total}</small>` : ''}</b>
          <span class="contagem-pilha">${semRecarga ? 'Sem recargas' : 'Embaralha o descarte no deck'}</span>
          <div class="botoes"><button class="btn pequeno" data-acao="recarregar" ${estado.descarte.length && !semRecarga ? '' : 'disabled'}>Recarregar</button></div>
        </div>
      </section>

      <section class="pontos" aria-label="Pontos atuais da ficha">
        ${ATRIBUTOS.map(([k, t]) => {
          const v = pontos(k);
          return `<button class="ponto atr atr-${k}" data-acao="abrir-ficha" title="${t}: atual / total"><span>${t}</span><b>${v.atual ?? '—'}</b>${v.total != null ? `<small>/ ${v.total}</small>` : ''}</button>`;
        }).join('')}
        ${(() => { const v = par(personagem().pv); return `<button class="ponto pv" data-acao="abrir-ficha" title="PV: atual / total"><span>PV</span><b>${v.atual ?? '—'}</b>${v.total != null ? `<small>/ ${v.total}</small>` : ''}</button>`; })()}
      </section>

      <div class="turno">
        ${estado.emRodada
          ? '<button class="btn grande" data-acao="fim-rodada">Fim da rodada</button>'
          : `<button class="btn grande principal" data-acao="iniciar-rodada">Iniciar rodada${estado.rodada ? ` ${estado.rodada + 1}` : ''}</button>`}
        <button class="btn desfazer" data-acao="desfazer" ${pilhaDesfazer.length ? '' : 'disabled'}>↶ Desfazer</button>
      </div>

      <section class="zona" id="campo">
        <h2>Campo <small>${estado.campo.length} carta(s) · ficam até serem descartadas ou banidas</small></h2>
        ${estado.campo.length ? `<div class="fileira">${estado.campo.map((i) => mini(i, 'campo')).join('')}</div>` : '<div class="zona-vazia">Nenhuma carta em campo.</div>'}
      </section>

      <section class="zona" id="mao">
        <h2>Mão <small>${estado.mao.length} carta(s) · toque numa carta para jogar, descartar ou banir</small></h2>
        ${estado.mao.length ? `<div class="fileira">${estado.mao.map((i) => mini(i, 'mao')).join('')}</div>` : `<div class="zona-vazia">${estado.emRodada ? 'Mão vazia.' : 'Toque em Iniciar rodada para comprar 5 cartas.'}</div>`}
      </section>

      <details class="historico">
        <summary>Histórico (${estado.historico.length})</summary>
        <ol reversed>${[...estado.historico].reverse().map((h) => `<li>${esc(h)}</li>`).join('')}</ol>
      </details>

      <div class="fim"><button class="btn perigo" data-acao="encerrar">Encerrar batalha</button></div>`;
  }

  // ---------- eventos ----------
  $app.addEventListener('click', (e) => {
    const m = e.target.closest('.mini');
    if (m) { abrirCarta(m.dataset.inst, m.dataset.zona); return; }
    const b = e.target.closest('[data-acao]');
    if (!b || b.disabled) return;
    const a = b.dataset.acao;
    if (a === 'comecar') { const p = personagem(); if (p) novaBatalha(p); }
    else if (a === 'iniciar-rodada') iniciarRodada();
    else if (a === 'fim-rodada') fimRodada();
    else if (a === 'comprar') comprarAvulsa();
    else if (a === 'recarregar') recarregar();
    else if (a === 'desfazer') desfazer();
    else if (a === 'abrir-ficha') abrirFicha();
    else if (a === 'ver-deck') { if (estado.deck.length) abrirLista('deck'); }
    else if (a === 'ver-descarte') { if (estado.descarte.length) abrirLista('descarte'); }
    else if (a === 'ver-banidas') { if (estado.banidas.length) abrirLista('banidas'); }
    else if (a === 'encerrar') {
      if (!confirm('Encerrar a batalha? O estado das cartas (mão, campo, descarte) será apagado. O deck do personagem não muda.')) return;
      estado = null;
      pilhaDesfazer.length = 0;
      salvar();
      render();
    }
  });
  // Outra aba (a ficha) pode ter mudado as recargas.
  addEventListener('storage', (e) => { if (e.key === CHAVE_FICHAS) render(); });
  addEventListener('hashchange', () => location.reload());

  carregar();
  render();
})();
