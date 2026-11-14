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

Ao criar uma ferramenta nova, adicione um card para ela na página inicial.

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

<!--
Modelo para cada nova ferramenta:

### Nome da ferramenta

**O que faz:** uma ou duas frases sobre o que a ferramenta faz e para que serve na sessão.

**Como usar:**
1. Passo a passo para abrir ou rodar a ferramenta.
2. Como usar durante a sessão (mestre e/ou jogadores).

**Localização:** `tools/nome-da-ferramenta/`
-->
