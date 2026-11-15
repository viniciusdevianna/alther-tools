// Partes usadas tanto pela ficha (app.js) quanto pela batalha (batalha.js).
window.Alther = (() => {
  'use strict';

  const CHAVE_FICHAS = 'alther-fichas:v1';
  const chaveBatalha = (idPersonagem) => `alther-batalha:v1:${idPersonagem}`;

  const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const norm = (s) => String(s ?? '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().trim();
  const num = (v) => (v === '' || v == null || isNaN(Number(v)) ? null : Number(v));

  const CARTAS = (window.ALTHER_CARTAS && window.ALTHER_CARTAS.cartas) || [];
  const cartaPorId = new Map(CARTAS.map((c) => [c.id, c]));

  // Companheiro animal: cartas da classe Fera vão para o deck do companheiro (máx. 10),
  // que só Druida e Bestial usam. O companheiro tem só estes quatro atributos.
  const ehFera = (c) => (c.classes || []).some((x) => norm(x) === 'fera');
  const ATRIBUTOS_FERA = [['corpo', 'Corpo'], ['mente', 'Mente'], ['foco', 'Foco'], ['espirito', 'Espírito']];
  const DECK_FERA_MAX = 10;
  const CAMINHOS_COM_FERA = ['Druida', 'Bestial'];
  const temCompanheiro = (p) => !!p && (p.caminhos || []).some((c) => CAMINHOS_COM_FERA.includes(c.nome));
  const ehBestial = (p) => !!p && (p.caminhos || []).some((c) => c.nome === 'Bestial');

  const STATS = [['custo', 'Custo'], ['alcance', 'Alcance'], ['acerto', 'Acerto'], ['defFisica', 'Def. física'], ['defArtistica', 'Def. artística'], ['desequilibrio', 'Desequilíbrio']];
  const temValor = (v) => v !== '' && v != null && norm(v) !== 'na';

  // Classe CSS da cor do atributo (Corpo vermelho, Mente azul, Foco amarelo, Espírito roxo, Natureza verde, Social rosa).
  const classeAtributo = (c) => (c.atributo ? `atr atr-${norm(c.atributo)}` : 'atr');

  function htmlTags(c) {
    return `<div class="tags">
      ${c.caminho ? `<span class="tag caminho">${esc(c.caminho)}</span>` : '<span class="tag caminho">Sem caminho</span>'}
      ${c.tipo ? `<span class="tag">${esc(c.tipo)}</span>` : ''}
      ${c.atributo ? `<span class="tag atributo">${esc(c.atributo)}</span>` : ''}
      ${c.classes.map((x) => `<span class="tag classe ${norm(x) === 'unica' ? 'unica' : ''}">${esc(x)}</span>`).join('')}
    </div>`;
  }
  // Valores de jogo, efeito e palavras-chave.
  function htmlCorpoCarta(c) {
    const stats = STATS.filter(([k]) => temValor(c[k])).map(([k, t]) => `<div><dt>${t}</dt><dd>${esc(c[k])}</dd></div>`).join('');
    return `
      ${stats ? `<dl class="stats">${stats}</dl>` : ''}
      ${c.efeito ? `<p class="efeito">${esc(c.efeito)}</p>` : ''}
      ${c.palavras.length ? `<div class="chips">${c.palavras.map((w) => `<span class="chip">${esc(w)}</span>`).join('')}</div>` : ''}`;
  }

  function lerFichas() {
    try {
      const s = JSON.parse(localStorage.getItem(CHAVE_FICHAS));
      if (s && Array.isArray(s.personagens)) return s;
    } catch (e) { /* vazio */ }
    return { versao: 1, personagens: [] };
  }
  function existeBatalha(idPersonagem) {
    try { return !!localStorage.getItem(chaveBatalha(idPersonagem)); } catch (e) { return false; }
  }

  return { CHAVE_FICHAS, chaveBatalha, esc, norm, num, CARTAS, cartaPorId, classeAtributo, htmlTags, htmlCorpoCarta, lerFichas, existeBatalha, ehFera, ATRIBUTOS_FERA, DECK_FERA_MAX, temCompanheiro, ehBestial };
})();
