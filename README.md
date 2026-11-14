# alther-tools

Ferramentas para as mesas de RPG.

Um conjunto de ferramentas, páginas e aplicações simples para deixar as sessões mais interessantes para os jogadores. Nada de aplicação complexa: cada ferramenta é pequena e independente, e dá para usar sem montar muita coisa.

## Estrutura

Cada ferramenta fica na sua própria pasta dentro de `tools/`:

```
tools/
  nome-da-ferramenta/
    index.html   (ou o ponto de entrada da ferramenta)
    ...
```

## Ferramentas

### Mapa de Navegação

**O que faz:** um mapa esférico 3D dos universos, usado para navegar com a nave entre universos. O universo onde a nave está fica sempre no **centro** da esfera, e cada outro universo é localizado por coordenadas esféricas em relação a ele:

- **r**: distância até o centro;
- **θ (inclinação)**: ângulo a partir do eixo vertical (0° no polo de cima, 90° no equador, 180° no polo de baixo);
- **φ (azimute)**: ângulo em volta do equador, de 0° a 360°, a partir da marca 0°.

Os ângulos aceitam graus e minutos (ex.: 8°25′). Ao **saltar** para outro universo, ele vira o novo centro e todas as coordenadas são recalculadas.

O mapa aceita **coordenadas incompletas** e mostra o que se sabe de cada universo:

| Registro | O que aparece no mapa |
|---|---|
| só θ | um **anel**: o universo está em algum lugar dele |
| θ + φ | um **feixe** saindo do ponto de medida: a direção é conhecida, a distância não |
| θ + φ + r | um **ponto**: dá para saltar até ele |
| dois feixes, medidos de universos diferentes | o mapa **triangula** o cruzamento e o universo vira um ponto |

Anéis e feixes continuam no mapa mesmo depois que o universo é encontrado. O anel passa a ser desenhado na distância real, então dá para conferir se o ponto caiu sobre ele. Se dois feixes não se encontram, o universo aparece como "feixes sem cruzamento".

Quando um universo é encontrado, o mapa toca uma **animação com som**. Saltar entre universos também tem som.

**Como usar:**
1. Abra `tools/mapa-navegacao/index.html` em qualquer navegador (funciona offline e não precisa instalar nada).
2. O mapa começa só com **Alther**. Em **Registrar coordenada**, informe o universo, a partir de qual universo a medida foi feita, θ e, se souber, φ e r. Usar um nome que já existe adiciona um novo registro àquele universo.
3. Uma medida completa também funciona "ao contrário". Registrar *Alther medida a partir de Langtau* posiciona Langtau.
4. Toque num universo (no mapa ou na lista) para ver as coordenadas dele em relação ao centro e os registros ligados a ele. Registros errados podem ser apagados com ✕.
5. **Saltar para cá** só aparece para universos com posição conhecida. A rota percorrida aparece no canto inferior.
6. Gestos: arraste para girar, use pinça ou a roda do mouse para dar zoom. O botão ⌖ restaura a vista e o botão 🔊/🔇 liga ou desliga o som. No iPad, o som não toca se o aparelho estiver no modo silencioso.
7. O progresso fica salvo no navegador do aparelho. Use **Exportar** para guardar um backup (`.json`) e **Importar** para restaurá-lo ou passá-lo para outro aparelho.

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
