# alther-tools

Ferramentas para as mesas de RPG.

Um conjunto de ferramentas, páginas e aplicações simples para deixar as sessões mais interessantes para os jogadores. Nada de aplicação complexa: cada ferramenta é pequena e independente, e dá para usar sem montar muita coisa.

## Estrutura

A página `index.html` na raiz é a entrada do site: ela lista as ferramentas com links para cada uma. Cada ferramenta fica na sua própria pasta dentro de `tools/`:

```
index.html                 (página inicial com links para as ferramentas)
tools/
  nome-da-ferramenta/
    index.html             (ou o ponto de entrada da ferramenta)
    ...
```

Ao criar uma ferramenta nova, adicione um card para ela na página inicial, com `data-ferramenta="<nome-da-pasta>"` no `<li>` (é assim que a publicação sabe esconder o card).

## Publicação (site para os jogadores)

O site fica no GitHub Pages, em `https://viniciusdevianna.github.io/alther-tools/`, e é atualizado sozinho a cada push na `main` (workflow `.github/workflows/publicar.yml`).

**Só vão para o site as ferramentas listadas em `publicar.txt`**, uma pasta de `tools/` por linha. As outras não são publicadas e o card delas some da página inicial. Para liberar o mapa, por exemplo, troque `# mapa-navegacao` por `mapa-navegacao`, faça commit e push; em um ou dois minutos ele está no ar. Para esconder de novo, comente a linha.

Planilhas, scripts (`.py`) e arquivos `.md` (como o `MESTRE.md`) nunca vão para o site. Mas o repositório é público, então quem procurar no GitHub consegue ver o código de tudo.

Para conferir o que vai ao ar sem publicar: `python3 publicar.py` monta a pasta `_site/` (ignorada pelo git).

**Configuração inicial (uma vez só):**
1. No GitHub, em **Settings → General → Danger Zone → Change visibility**, torne o repositório público.
2. Em **Settings → Pages → Build and deployment → Source**, escolha **GitHub Actions**.
3. Faça um push na `main` (ou rode o workflow em **Actions → Publicar site → Run workflow**).

**Para os jogadores:** abram o endereço no navegador do telefone ou tablet e usem **Compartilhar → Adicionar à Tela de Início** (iPhone/iPad) ou **⋮ → Adicionar à tela inicial** (Android) para ter um ícone de app. As fichas ficam salvas no navegador de cada aparelho; para trocar de aparelho, usem Exportar/Importar.

Quando você mesmo quiser usar uma ferramenta não liberada, abra o `index.html` dela direto da pasta no seu computador.

## Ferramentas

### Mapa de Navegação

**O que faz:** um mapa esférico 3D dos universos, usado para navegar com a nave entre universos. O universo escolhido como **base** fica no centro da esfera, e cada outro universo é localizado por coordenadas esféricas em relação a ele:

- **r**: distância até o centro;
- **θ (inclinação)**: ângulo a partir do eixo vertical (0° no polo de cima, 90° no equador, 180° no polo de baixo);
- **φ (azimute)**: ângulo em volta do equador, de 0° a 360°, a partir da marca 0°.

Os ângulos têm graus, minutos e segundos (ex.: 74°31′26″). Ao trocar a base, ou ao **saltar** para outro universo, todas as coordenadas são recalculadas a partir do novo centro.

O mapa aceita **coordenadas incompletas** e mostra o que se sabe de cada universo:

| Registro | O que aparece no mapa |
|---|---|
| só θ | um **anel**: o universo está em algum lugar dele |
| θ + φ | um **feixe** saindo do ponto de medida: a direção é conhecida, a distância não |
| θ + φ + r | um **ponto**: dá para saltar até ele |
| dois feixes, medidos de universos diferentes | o mapa **triangula** o cruzamento e o universo vira um ponto |

Anéis e feixes continuam no mapa mesmo depois que o universo é encontrado. O anel passa a ser desenhado na distância real, então dá para conferir se o ponto caiu sobre ele. Se dois feixes não se encontram, o universo aparece como "feixes sem cruzamento".

Quando um universo é encontrado, o mapa toca uma **animação com som**. Saltar entre universos também tem som.

**Conceitos da tela:**
- **Nave**: o universo onde a nave está de fato. Aparece com um pequeno ícone de nave ao lado.
- **Base**: o universo no centro do mapa, a partir do qual as coordenadas da lista são calculadas. A base pode ser trocada livremente para analisar o mapa de outros pontos de vista, sem mover a nave.

**Como usar:**
1. Abra `tools/mapa-navegacao/index.html` em qualquer navegador (ou pela página inicial). Funciona offline e não precisa instalar nada.
2. **Aba Universos**: toque num universo (na lista ou no mapa) para ver as coordenadas dele em relação à base e os registros ligados a ele. Pelo cartão do universo dá para **usar como base**, **registrar coordenada** ou remover. Tocar num registro abre esse registro para edição. O ✕ apaga o registro.
3. **Aba Registrar**: escolha o universo (ou **+ Novo**) e a partir de qual universo a medida foi feita. Depois ajuste os instrumentos:
   - **θ e φ**: discos concêntricos de graus (anel externo), minutos (anel do meio) e segundos (anel interno). Gire um anel arrastando o dedo sobre ele. Para ajuste fino, escolha o anel nos botões ° ′ ″ e use − e +, que repetem se você segurar. O valor fica sob o marcador no topo e aparece no centro do disco e no cabeçalho.
   - **r**: barra de energia de 0 a 100. Arraste a alavanca ou use os botões −1, −0,1, +0,1 e +1.
   - φ e r podem ser marcados como **desconhecidos**. Mexer em um instrumento desligado o liga.
4. Existe **um registro por par** (universo, medido a partir de). Ao escolher um par que já tem registro, os instrumentos vêm preenchidos e o botão vira **Atualizar registro**. Assim dá para testar valores e completar as coordenadas aos poucos. "Langtau a partir de Alther" e "Alther a partir de Langtau" são pares diferentes.
5. Uma medida completa também funciona "ao contrário". Registrar *Alther medida a partir de Langtau* posiciona Langtau.
6. **SALTAR**: o botão redondo no canto do mapa salta a nave para o universo selecionado, se ele tiver posição conhecida. Durante a viagem, a página entra no modo **viajando**: o mapa aproxima a rota, uma pequena nave percorre a linha entre os universos, um som de motor toca e o painel fica bloqueado. Ao chegar, o destino vira a nova posição da nave e a nova base.
7. Gestos no mapa: arraste para girar, use pinça ou a roda do mouse para dar zoom. O botão ⌖ restaura a vista e o botão 🔊/🔇 liga ou desliga o som. No iPad, o som não toca se o aparelho estiver no modo silencioso.
8. O progresso fica salvo no navegador do aparelho. Use **Exportar** para guardar um backup (`.json`) e **Importar** para restaurá-lo ou passá-lo para outro aparelho.

**Nota para o mestre:** a página não traz nenhuma explicação de como ler as coordenadas. Descobrir como o mapa funciona faz parte do desafio. A narrativa do puzzle e a tabela de coordenadas estão em [`tools/mapa-navegacao/MESTRE.md`](tools/mapa-navegacao/MESTRE.md) (contém spoilers).

**Localização:** `tools/mapa-navegacao/`

### Fichas e Decks

**O que faz:** versão simples da ficha de personagem e do deck de cartas, enquanto a aplicação completa não fica pronta. Cada jogador cria seus personagens, preenche e edita a ficha (a mesma da planilha *Alther-Ficha-Cartas*), adquire cartas do catálogo e monta o deck de cada personagem. Tudo fica salvo no navegador do aparelho, sem servidor nem banco de dados.

O visual é de mangá: papel com retícula, quadros com contorno de nanquim, títulos em faixas pretas, descrições em balões de fala e destaques em vermelho. Os estilos ficam em `estilo.css` (e os da batalha no próprio `batalha.html`).

**Como usar:**
1. Abra `tools/fichas/index.html` em qualquer navegador (ou pela página inicial). Não precisa instalar nada.
2. Na tela inicial, toque em **+ Novo personagem**. Os personagens aparecem em cards com raça, escola, caminhos (★ = Mestre) e a situação do deck.
3. **Aba Ficha**: identificação (Raça, Arquétipo, Escola e Aspiração são listas), progresso (NP, XP, PD), atributos, dados, caminhos, recursos (PV, recargas, moedas, acessório), inventário, anotações e companheiro animal. Os valores são preenchidos à mão, como na planilha, com estas regras:
   - o botão **↺** ao lado de cada atributo e do PV restaura o atual para o total; **↺ Restaurar todos os atributos** faz isso com os seis de uma vez (útil depois de uma batalha);
   - um valor **atual nunca passa do total** (atributos, PV, recargas, XP, PC e PV do companheiro). Enquanto você digita, o campo fica vermelho; ao sair dele, o atual é corrigido para o total;
   - cada caminho tem **PC atual** e **PC total** (até 10.000) e **Nível** (até 10);
   - **Cartas adquiridas** do caminho é contado automaticamente;
   - **Mestre** é automático: o caminho vira Mestre ao chegar no nível 10;
   - ao escolher a raça, a ficha mostra o **retrato** da raça e a habilidade e a restrição raciais; ao escolher um caminho, mostra a intrínseca dele (quando houver). Toque no nome para ver a descrição, as **armas**, as **armaduras** e a **maestria** do caminho.
4. **Aba Catálogo**: cada carta tem a cor do seu atributo, como nas cartas físicas: **Corpo** vermelho, **Mente** azul, **Foco** amarelo, **Espírito** roxo, **Natureza** verde e **Social** rosa. O catálogo mostra as cartas com custo, alcance, acerto, defesas, desequilíbrio, efeito e palavras-chave. Dá para buscar (nome, código ou qualquer texto) e filtrar por caminho, tipo, classe, atributo e situação. No personagem, o filtro começa em **Meus caminhos**. Cada carta tem dois controles:
   - **Adquiridas**: compra uma cópia. Só é possível adquirir cartas dos caminhos que o personagem tem (ou cartas sem caminho). O **custo de aquisição** (coluna "Custo Aquisição", em PC) é descontado do **PC atual** do caminho, e a aquisição fica bloqueada sem PC suficiente. Cartas com essa coluna vazia são gratuitas. O **−** desfaz uma aquisição e devolve os PC;
   - **No deck**: põe ou tira cópias adquiridas do deck.
5. **Aba Deck**: lista as cartas adquiridas por caminho, com "no deck / adquiridas", e os avisos de regra. Use **Só o deck** para ver apenas o que está no deck. Regras verificadas:
   - o deck tem de **15 a 30 cartas**;
   - só entram **cópias adquiridas**;
   - no máximo **3 cópias** (coluna "Limite no Deck") por **nome de deck**: Pummel I, II e III, por exemplo, somam juntas;
   - cartas da classe **Única** só podem ter **1 cópia**, mesmo que a coluna diga outra coisa.
6. **Batalha**: o botão **⚔ Batalhar**, no topo da página do personagem, abre `batalha.html`, que funciona como as cartas físicas do deck:
   - **Embaralhar e começar** embaralha o deck. A batalha começa sem cartas na mão;
   - **Iniciar rodada** compra 5 cartas. **Fim da rodada** leva todas as cartas da mão para o descarte e libera o próximo Iniciar rodada;
   - **Comprar 1** compra uma carta avulsa a qualquer momento (efeitos de cartas ou de personagens);
   - toque numa carta da **mão** para **Jogar** (vai para o campo), **Descartar** ou **Banir**;
   - **custo das cartas**: jogar uma carta paga o custo com os pontos **atuais do atributo da carta** na ficha (uma carta de Corpo de custo 2 tira 2 do Corpo atual). Itens (custo **X**, atributo **Qualquer**) mostram um **Jogar** por atributo, e o jogador escolhe qual atributo paga. Sem pontos suficientes, o Jogar fica bloqueado e o custo aparece em vermelho na carta. Os pontos atuais de cada atributo e o PV ficam visíveis na batalha; tocar neles abre a ficha;
   - cartas no **campo** ficam lá entre as rodadas até serem descartadas, banidas ou voltarem para a mão;
   - no **descarte**, uma carta pode ser banida, ir para a mão ou ir para o deck (topo, fundo ou embaralhada no deck). O descarte nunca é embaralhado e aparece do topo (mais recente) para baixo;
   - **Ver deck** mostra as cartas do deck em ordem alfabética, sem revelar a ordem real, para buscar uma carta específica. Ao fechar, o deck é embaralhado;
   - **Recarregar** devolve o descarte ao deck, embaralha e gasta 1 das **Recargas** atuais da ficha. Fica bloqueado sem recargas;
   - **📜 Ficha** abre a ficha do personagem por cima da batalha para ajustar PV, atributos, recargas etc. durante o combate. As mudanças são salvas sozinhas; **Voltar à batalha** fecha a ficha e a mesa continua como estava;
   - **↶ Desfazer** volta a última ação (inclusive a recarga gasta) e o **Histórico** lista tudo o que aconteceu;
   - a batalha fica salva no aparelho: dá para fechar a página e continuar depois (o botão vira **⚔ Continuar batalha**). **Encerrar batalha** apaga o estado das cartas, mas não muda o deck do personagem. Mudanças no deck durante uma batalha só valem na próxima.
7. Tudo é salvo automaticamente no navegador. Para não perder nada (ou levar para outro aparelho), use **Exportar** na tela inicial (todos os personagens) ou **Exportar esta ficha** no fim da ficha, e depois **Importar** o arquivo `.json`. Limpar os dados do navegador apaga as fichas.

**Atualizando o catálogo e as listas:** os dados vêm das planilhas em `tools/fichas/planilhas/`:
- `Cartas Alther.xlsx`, aba **Geral**: o catálogo de cartas e a lista de caminhos. Linhas sem nome são ignoradas (cartas ainda não criadas). O **Código** identifica a carta no deck dos jogadores, então não mude o código de uma carta que já existe;
- `Cartas Equipamentos.csv`: as cartas que não são de caminho (armas, armaduras, escudos, Ataque Desarmado, Postura de Defesa), transcritas das imagens das cartas. Tem as mesmas colunas da aba Geral, separadas por `;`, e abre no Excel/Google Sheets. A coluna Caminho fica vazia, então qualquer personagem pode adquiri-las; os códigos começam com `E` (E001, E002…). Para achá-las no catálogo, filtre pela classe **Equipamento**;
- `Cartas Itens.csv`: os itens (poções, infusões, medicamentos), no mesmo formato, com códigos `I001`, `I002`…. O custo dos itens é **X** na carta, gravado como atributo **Qualquer**: na batalha, a carta mostra um botão **Jogar** para cada atributo e o jogador escolhe qual paga o custo. Qualquer outro arquivo `Cartas <nome>.csv` nessa pasta também entra no catálogo;
- `Alther-Ficha-Cartas.xlsx`, aba **Base de Dados**: escolas, raças, arquétipos, aspirações, famílias de companheiro e as descrições das habilidades raciais e intrínsecas. Cada habilidade fica na mesma linha do seu dono: a intrínseca na linha do caminho (coluna C: nome em O, descrição em P; armas, armaduras e maestria em AA, AB e AC), e a habilidade e a restrição racial na linha correspondente à posição da raça na lista;
- `tools/fichas/imagens/racas/`: o retrato de cada raça, com o nome da raça sem acentos, espaços ou apóstrofos (`fenirio.jpg`, `quadir.jpg`). Uma raça sem imagem simplesmente não mostra retrato.

Depois de alterar uma planilha (baixe de novo do Google Sheets e substitua o arquivo), rode:

```
python3 tools/fichas/converter.py
```

O script regenera `tools/fichas/cartas.js` e `tools/fichas/dados.js` (precisa do `openpyxl`: `pip install openpyxl`).

**Arquivos:** `index.html` + `app.js` (fichas, catálogo e deck), `batalha.html` + `batalha.js` (batalha), `comum.js` e `estilo.css` (desenho das cartas, cores e estilos usados pelas duas páginas).

**Localização:** `tools/fichas/`

<!--
Modelo para cada nova ferramenta:

### Nome da ferramenta

**O que faz:** uma ou duas frases sobre o que a ferramenta faz e para que serve na sessão.

**Como usar:**
1. Passo a passo para abrir ou rodar a ferramenta.
2. Como usar durante a sessão (mestre e/ou jogadores).

**Localização:** `tools/nome-da-ferramenta/`
-->
