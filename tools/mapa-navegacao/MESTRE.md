# Mapa de Navegação: folha do mestre

> **Spoilers.** Não mostre este arquivo aos jogadores.

## Por que os registros antigos só têm um ângulo

A ideia é a mesma do "problema da longitude" na navegação real. Durante séculos, os navegadores conseguiam medir a latitude facilmente (pela altura da Estrela Polar), mas não a longitude. Por isso, muitas rotas antigas registravam só a latitude.

No mapa:

- **θ dá para medir de qualquer lugar.** Ele é medido contra o **Eixo**, uma referência que todos os universos compartilham (o equivalente da Estrela Polar: um fio de luz, uma corrente, um ponto fixo no céu entre os universos, como preferir). Qualquer estudioso de Alther com o instrumento certo consegue observar outro universo e medir a inclinação dele em relação ao Eixo.
- **φ precisa de um "marco zero"**, uma direção de referência para contar os graus em volta do Eixo. Esse marco só existe nos instrumentos da nave (é a marca 0° no equador do mapa). Sem a nave, ninguém conseguia medir φ.
- **r não se mede observando.** Só dá para descobrir a distância viajando ou por triangulação.

Por isso, qualquer registro feito antes de alguém controlar a nave tem só θ. Essa explicação serve para onde quer que os jogadores tenham encontrado os registros: anotações de astrônomos, uma biblioteca, as paredes da torre, etc.

## O caminho do puzzle

### 1. Descobrir que a informação está incompleta
Os jogadores registram o que já sabem: Langtau θ 87°, Teros θ 8°25′ e Arcadia θ 54°, todos a partir de Alther. O mapa não mostra pontos, só **anéis**. O universo está "em algum lugar daquele anel". Não dá para saltar para um anel.

### 2. Localizar Langtau pelo diário de bordo
A última viagem da nave foi **de Langtau para Alther**. O diário de bordo registrou o destino nas coordenadas completas da nave, **medidas a partir de Langtau**:

> Destino: Alther · θ 93°00′ · φ 33°40′ · r 37

O puzzle está nos números. 93° não é 87°, mas 93° + 87° = 180°. É a mesma linha vista do outro lado. Se registrarem *"Universo: Alther, medida a partir de: Langtau"* com esses três números, o mapa posiciona Langtau, e o ponto cai exatamente sobre o anel de 87°. É a confirmação de que entenderam.

(Se preferir facilitar, o diário pode trazer Langtau vista de Alther: θ 87°00′ · φ 213°40′ · r 37.)

### 3. O farol de Arcadia: o primeiro feixe
O contato em Arcadia acende um **farol**, um sinal que a nave consegue captar. Os instrumentos medem a direção do sinal, mas não a distância:

> A partir de Alther: θ 54°00′ · φ 128°15′

O θ de 54° bate com o registro antigo, o que confirma que o sinal é Arcadia. No mapa aparece um **feixe** saindo de Alther, e ele corta o anel de 54°. Eles sabem a direção, mas não quanto viajar.

### 4. Saltar para Langtau e medir de novo: o segundo feixe
Langtau é o único destino com posição completa, então é o primeiro salto seguro. De lá, medem o farol outra vez:

> A partir de Langtau: θ 74°31′ · φ 60°12′

Quando registram esse segundo feixe, o mapa encontra o ponto onde os dois se cruzam e **Arcadia aparece**, com a distância calculada. Agora eles podem saltar para lá.

Se algum número for digitado errado, os feixes não se cruzam e Arcadia não aparece. Isso funciona como feedback natural, sem precisar de nenhuma rolagem.

## Tabela completa de coordenadas

| Destino | Visto de | θ | φ | r |
|---|---|---|---|---|
| Langtau | Alther | 87°00′ | 213°40′ | 37 |
| Arcadia | Alther | 54°00′ | 128°15′ | 22 |
| Alther | Langtau | 93°00′ | 33°40′ | 37 |
| Arcadia | Langtau | 74°31′ | 60°12′ | 41,2 |
| Alther | Arcadia | 126°00′ | 308°15′ | 22 |
| Langtau | Arcadia | 105°29′ | 240°12′ | 41,2 |
| Teros | Alther | 8°25′ | a definir | a definir |

Os valores de φ e r foram escolhidos para o puzzle funcionar bem: os feixes de Alther e de Langtau se cruzam a 63°. Se quiser mudar algum número, todos os outros da tabela precisam ser recalculados.
