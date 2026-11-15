// Gerado por converter.py a partir de planilhas/Alther-Ficha-Cartas.xlsx e Cartas Alther.xlsx. Não edite à mão:
// altere a planilha e rode `python3 tools/fichas/converter.py`.
window.ALTHER_DADOS = {
  "escolas": [
    "Peregrinos do Amanhecer",
    "Discípulos do Ardente",
    "Vingadores do Crepúsculo",
    "Adeptos da Prata",
    "Desbravadores do Vazio",
    "Deentes"
  ],
  "aspiracoes": [
    "Ofensor",
    "Defensor",
    "Controlador"
  ],
  "racas": [
    "Altalia",
    "Fenírio",
    "Gollyck",
    "Lodger",
    "Maek",
    "Nuaa",
    "Paishu",
    "Qua'dir",
    "Rae",
    "Saityr"
  ],
  "arquetipos": [
    "Tecnólogo",
    "Hinteru",
    "Clérigo",
    "Xamã"
  ],
  "caminhos": [
    "Monge",
    "Arcante",
    "Nébulo",
    "Shepian",
    "Bardo",
    "Áquila",
    "Cruzado",
    "Emissário",
    "Tecnoclasta",
    "Paladino",
    "Ilusionista",
    "Druida",
    "Arauto",
    "Hassassin",
    "Ás",
    "Evocador",
    "Valete",
    "Encantador",
    "Vibrata",
    "Kalinier",
    "Cronoclasta",
    "Chevalier",
    "Bestial",
    "Oráculo"
  ],
  "familiasCompanheiro": [
    "Kilua",
    "Sherzai",
    "Carbuncle",
    "Yeji",
    "Baganoir"
  ],
  "racial": {
    "Altalia": {
      "habilidade": {
        "nome": "Voar",
        "descricao": "Altalia podem voar utilizando uma ação de movimento e um teste de perícia corporal. Em batalha eles podem se manter no ar por um turno sem gastos. Fora de batalha eles conseguem se manter por 30 min. Em batalha, enquanto voam, Altalia recebem vulnerável(1)."
      },
      "restricao": {
        "nome": "Devoradores de Carne",
        "descricao": "Altalia não conseguem digerir nenhum tipo de planta, nem mesmo ervas de cura, frutas ou qualquer alimento de origem vegetal. Caso haja a ingestão, o altalia passa mal, ficando estafado por um período de 1 a 3 h."
      },
      "retrato": "imagens/racas/altalia.jpg"
    },
    "Fenírio": {
      "habilidade": {
        "nome": "Faro Apurado",
        "descricao": "Fenírios podem farejar seus inimigos ou aliados. Se um fenírio tiver contato com um cheiro uma vez, ele pode utilizar essa habilidade para rastrear seu alvo com sucesso garantido, em um raio de 10 + NP km."
      },
      "restricao": {
        "nome": "Matilha",
        "descricao": "Fenírios não se viram bem sozinhos. Caso estejam isolados do resto de seu bando (que não precisa ser constituído de outros fenírios), eles recebem -1 de Treinamento em qualquer teste de perícia de foco e uivam periodicamente, chamando atenção para si."
      },
      "retrato": "imagens/racas/fenirio.jpg"
    },
    "Gollyck": {
      "habilidade": {
        "nome": "Nadar",
        "descricao": "Gollycks podem utilizar essa habilidade com um teste de natureza e uma ação de movimento para nadar. Esta habilidade concede sucesso garantido em qualquer teste de nadar e também permite que um gollyck nade na areia, lodo e terra fofa, além da água. Em batalha, enquanto nadam, Gollycks têm o dobro de seu movimento base, mas não podem tomar ações padrão."
      },
      "restricao": {
        "nome": "Face do Medo",
        "descricao": "Gollycks dificilmente são bem vistos por outras raças. Mesmo que um gollyck seja bondoso e honesto, ele encontrará resistência nas interações sociais, até mesmo com membros de sua própria raça que não tenham crescido com ele. Assim, recebem -1 de Treinamento em qualquer teste social."
      },
      "retrato": "imagens/racas/gollyck.jpg"
    },
    "Lodger": {
      "habilidade": {
        "nome": "Movimento Ás",
        "descricao": "Lodgers podem utilizar esta habilidade para obter +1 de Treinamento em testes de perícia que envolvam escalada ou equilíbrio. Em batalha, caso se esquivem com sucesso, eles podem usar uma ação livre de movimento para se reposicionar."
      },
      "restricao": {
        "nome": "Pequeninos",
        "descricao": "Lodgers tem uma constituição muito pequena e, portanto, não podem utilizar armas longas e equipamentos pesados."
      },
      "retrato": "imagens/racas/lodger.jpg"
    },
    "Maek": {
      "habilidade": {
        "nome": "Moeda de Troca",
        "descricao": "Maeks podem gastar valores para receber bônus de Treinamento em testes de perícia social. A cada 1000 / NP valores gastos, ganhe +1 de bônus de treinamento até o máximo de 4. Além disso, Maeks recebem 10% de desconto em todas as transações comerciais que fazem."
      },
      "restricao": {
        "nome": "Prisioneiros de Alther",
        "descricao": "Maeks são mais suscetíveis aos efeitos causados pelo contato com a energia artística de outras dimensões. Eles recebem 2 + NP de Pontos de Desequilíbrio a mais quando usam artes."
      },
      "retrato": "imagens/racas/maek.jpg"
    },
    "Nuaa": {
      "habilidade": {
        "nome": "Sanguidourado",
        "descricao": "O sangue dos nuaa concede a eles habilidades mágicas únicas. Eles recebem 2 + NP de bônus em testes para canalizar."
      },
      "restricao": {
        "nome": "Constituição Fraca",
        "descricao": "Nuaa não têm corpos muito resistentes e por isso são altamente suscetíveis à fadiga, venenos, álcool, etc. Todas as penalidades sofridas em todos esses casos são dobradas para eles. Além disso, realizar testes de perícia corporal seguidos concede -1 de Treinamento de penalidade acumulativo para cada teste subsequente."
      },
      "retrato": "imagens/racas/nuaa.jpg"
    },
    "Paishu": {
      "habilidade": {
        "nome": "Braços de Gigante",
        "descricao": "Paishus recebem +1 de Treinamento em testes de corpo que usem a força de seus braços. Além disso, ao utilizar armas e armaduras pesadas eles gastam 1 de atributo a menos."
      },
      "restricao": {
        "nome": "Enormemente Densos",
        "descricao": "Paishus são densos demais para nadar ou se equilibrar com facilidade. Eles sofrem -1 de Treinamento de penalidade nestes testes."
      },
      "retrato": "imagens/racas/paishu.jpg"
    },
    "Qua'dir": {
      "habilidade": {
        "nome": "Hipersalto",
        "descricao": "Qua’dir podem usar esta habilidade como ação de movimento em uma batalha. Eles saltam até seu movimento normal + 2 m e ignoram qualquer barreira física de menos de 3 m de altura. Eles conseguem carregar um objeto ou um indivíduo de até 2x seu próprio peso no salto. Fora de batalha, eles têm sucesso garantido em testes de perícia que envolvam saltar."
      },
      "restricao": {
        "nome": "Hiperatividade",
        "descricao": "Qua’dir não conseguem ficar parados por muito tempo. Eles dormem apenas 4 horas por dia e precisam de algo para se distrair caso não tenham nada para fazer. Em batalha, eles devem gastar pelo menos uma ação de movimento por turno. Caso sejam impedidos de se mover por um fator externo, eles tomam penalidade de -2NP ao tentar acertar."
      },
      "retrato": "imagens/racas/quadir.jpg"
    },
    "Rae": {
      "habilidade": {
        "nome": "Passo Obscuro",
        "descricao": "Os rae possuem uma habilidade única de caminhar brevemente pelo limiar das dimensões, uma espécie de dimensão por si só. Para usar esta habilidade em batalha, o rae precisa usar sua ação padrão e de movimento. Ao fim do seu próximo turno ou quando toma qualquer outra ação padrão, o rae sai do limiar. Fora de batalha o rae pode se manter no limiar enquanto conseguir segurar sua respiração."
      },
      "restricao": {
        "nome": "Hematófagos",
        "descricao": "Rae se alimentam apenas de sangue animal, porém eles gostam muito de sangue. Caso um rae veja sangue vermelho em determinada quantidade ele deve fazer um teste para restaurar. Caso fracasse, o rae estará inebriado e receberá -2NP nos dados de acerto de suas ações. A cada turno ele deve refazer o teste, enquanto estiver inebriado."
      },
      "retrato": "imagens/racas/rae.jpg"
    },
    "Saityr": {
      "habilidade": {
        "nome": "Voz da Natureza",
        "descricao": "Saityres podem se comunicar com animais, utilizando pontos de natureza. Em batalha, como uma ação padrão, o saityr pode comandar um animal selvagem para realizar um ataque simples contra um inimigo. Animais pequenos: 2 pontos; Médios: 4 pontos; Grandes: 10 pontos; Enormes: 20 pontos; Épicos: 40 pontos; Míticos: 50 pontos. Fora dela, o saityr pode fazer pedidos simples e ouvir informações simples dos animais gastando 1 ponto de natureza."
      },
      "restricao": {
        "nome": "Cascos Fendidos",
        "descricao": "Saityres possuem cascos no lugar dos pés e, desta forma, não conseguem andar em qualquer terreno com facilidade. Terrenos muito fofos (como a areia do deserto) ou muito irregulares (como os vales montanhosos) concedem penalidade de movimento de metade do movimento total do saityr, em batalha ou não. Além disso, eles recebem -1 de Treinamento em testes de perícia que envolvam equilíbrio."
      },
      "retrato": "imagens/racas/saityr.jpg"
    }
  },
  "intrinseca": {
    "Monge": {
      "nome": "Combo",
      "descricao": "Uma vez por turno, ao causar dano com uma carta de ataque de corpo, pode jogar uma segunda carta de ataque de corpo em sequência automática tendo o mesmo alvo.",
      "armas": "luvas, bastões, espadas",
      "armaduras": "muito leves e leves",
      "maestria": "acertar + 1"
    },
    "Nébulo": {
      "nome": "Névoa",
      "descricao": "Uma vez por turno, pode jogar qualquer carta de ataque oculta (ativa no fim da rodada, acerto automático).",
      "armas": "adagas, arcos, tiro, espadas",
      "armaduras": "muito leves e leves",
      "maestria": "esquivar + 1"
    },
    "Arcante": {
      "nome": "Equilibrium",
      "descricao": "Cartas de arte geram metade dos PD totais.",
      "armas": "bastões, cajados, luvas",
      "armaduras": "muito leves",
      "maestria": "canalizar + 1"
    },
    "Shepian": {
      "nome": "Avatar",
      "descricao": "Pode usar cartas de ataque de qualquer atributo como cartas de espírito, cortando seu efeito pela metade. O dano causado por essas cartas também se torna espiritual.",
      "armas": "bastões, espadas, sabres",
      "armaduras": "muito leves",
      "maestria": "restaurar + 1"
    },
    "Hassassin": {
      "nome": "Sanguinário",
      "descricao": "Ao jogar uma carta de ataque com sucesso, se o alvo estiver com algum malefício, ela tem crítico garantido.",
      "armas": "espadas, sabres, adagas, tiro",
      "armaduras": "muito leves e leves",
      "maestria": "acertar + 2"
    },
    "Evocador": {
      "nome": "Materializar",
      "descricao": "Uma vez por turno, pode descartar uma carta da mão para colocar uma carta do descarte no lugar.",
      "armas": "bastões, adagas, luvas",
      "armaduras": "muito leves",
      "maestria": "concentrar + 2"
    },
    "Arauto": {
      "nome": "Persona",
      "descricao": "Ao sobrepor com uma carta de ataque, você pode causar o dano da carta de cima como dano espiritual.",
      "armas": "luvas, bastões, espadas, sabres",
      "armaduras": "muito leves e leves",
      "maestria": "restaurar + 2"
    },
    "Ás": {
      "nome": "Imbuir",
      "descricao": "Ao jogar ou revelar uma carta de arma, você pode sintonizar automaticamente uma carta de arte da mão e colapsar os dois efeitos em um único alvo.",
      "armas": "espadas, sabres, bastões, cajados",
      "armaduras": "muito leves",
      "maestria": "canalizar + 2"
    },
    "Cruzado": {
      "nome": "Inquebrável",
      "descricao": "Caso uma carta de defesa do usuário não seja esgotada até o fim da rodada, ela permanece ativa em campo.",
      "armas": "espadas, martelos, bastões, lanças",
      "armaduras": "leves, pesadas e muito pesadas",
      "maestria": "acertar + 1"
    },
    "Bardo": {
      "nome": "Ritmo",
      "descricao": "Uma vez por turno, ao descartar uma carta, compre uma carta.",
      "armas": "adagas, sabres, luvas",
      "armaduras": "muito leves",
      "maestria": "recarregar + 1"
    },
    "Druida": {
      "nome": "Preservação",
      "descricao": "Uma vez por fim de rodada, pode manter uma carta de natureza.",
      "armas": "arcos, cajados, arremesso",
      "armaduras": "muito leves e leves",
      "maestria": "esquivar + 1"
    },
    "Paladino": {
      "nome": "Abençoado",
      "descricao": "Cartas que concedem defesa concedem também defesa espiritual igual a 50% do total de defesa concedido.",
      "armas": "espadas, lanças, martelos, bastões",
      "armaduras": "leves, pesadas e muito pesadas",
      "maestria": "restaurar + 1"
    },
    "Vibrata": {
      "nome": "Vibrar",
      "descricao": "Ao utilizar uma carta de armadura, 50% do dano mitigado é causado no agressor.",
      "armas": "espadas, martelos, luvas",
      "armaduras": "leves e pesadas",
      "maestria": "concentrar + 2"
    },
    "Kalinier": {
      "nome": "Conexão",
      "descricao": "Ao jogar uma carta de um deck auxiliar (exceto de maneira automática), restaure 10 de PD e cure 10% da vida máxima do usuário e de seu companheiro animal.",
      "armas": "cajados, arcos, arremesso, luvas",
      "armaduras": "muito leves e leves",
      "maestria": "canalizar + 1"
    },
    "Chevalier": {
      "nome": "Imortal",
      "descricao": "Uma vez por rodada, ao ser atacado, pode utilizar uma carta de defesa do descarte como reação.",
      "armas": "espadas, martelos, bastões, lanças",
      "armaduras": "leves, pesadas e muito pesadas",
      "maestria": "restaurar + 2"
    },
    "Encantador": {
      "nome": "Inspiração",
      "descricao": "No início da rodada, compre uma carta extra para cada carta que inicie a rodada no seu campo.",
      "armas": "bastões, cajados, luvas",
      "armaduras": "muito leves",
      "maestria": "recarregar + 2"
    },
    "Valete": {
      "nome": "Impulso",
      "descricao": "Após jogar uma carta de movimento, ganha aguçado(5) até o fim da rodada.",
      "armas": "bastão, lança, arco, sabre",
      "armaduras": "muito leves e leves",
      "maestria": "esquivar + 2"
    },
    "Áquila": {
      "nome": "Mira",
      "descricao": "Cartas de ataque do usuário possuem 50% a mais de bônus de acerto.",
      "armas": "arcos, tiro, arremesso",
      "armaduras": "muito leves e leves",
      "maestria": "concentrar + 1"
    },
    "Tecnoclasta": {
      "nome": "Reciclagem",
      "descricao": "Uma vez por rodada, pode colocar uma carta banida no descarte.",
      "armas": "tiro, luvas, arremesso, adagas",
      "armaduras": "muito leves e leves",
      "maestria": "recarregar + 1"
    },
    "Ilusionista": {
      "nome": "Ilusão",
      "descricao": "Uma vez por turno, ao jogar uma carta, pode banir uma carta de mesmo custo do descarte e realizar seu efeito como se fosse o da carta jogada. Os atributos ainda são da carta jogada.",
      "armas": "adagas, sabres, bastões",
      "armaduras": "muito leves e leves",
      "maestria": "concentrar + 1"
    },
    "Emissário": {
      "nome": "Recriação",
      "descricao": "Ao recarregar, restaura metade dos PD.",
      "armas": "cajados, sabres, luvas",
      "armaduras": "muito leves e leves",
      "maestria": "canalizar + 1"
    },
    "Cronoclasta": {
      "nome": "Rebobinar",
      "descricao": "Uma vez por rodada, ao jogar uma carta de alvo único, você pode escolher banir a carta, pagar seu custo e ativar seu efeito novamente.",
      "armas": "adagas, tiro, arremesso",
      "armaduras": "muito leves",
      "maestria": "acertar + 2"
    },
    "Bestial": {
      "nome": "Fusão",
      "descricao": "Embaralhe o deck do seu companheiro animal com o seu. Uma vez por rodada, ao jogar uma carta de natureza, você pode jogar outra carta automaticamente.",
      "armas": "bastões, lanças, luvas, cajados",
      "armaduras": "leves e pesadas",
      "maestria": "esquivar + 2"
    },
    "Oráculo": {
      "nome": "Previsão",
      "descricao": "No fim de cada rodada, olhe X cartas do topo do seu baralho. Em seguida, devolva cada uma delas para o topo ou fundo do baralho, como desejar. X = 1 + número de tokens do usuário no campo.",
      "armas": "adagas, sabres, luvas, bastões",
      "armaduras": "muito leves",
      "maestria": "recarregar + 1"
    }
  },
  "familias": {
    "Yeji": {
      "custo": "1T",
      "atributos": {
        "corpo": 10,
        "mente": 12,
        "foco": 15,
        "espirito": 8
      },
      "pv": 15,
      "passiva": "Pode nadar em terra fofa.",
      "niveis": [
        {
          "nivel": 1,
          "texto": "Mordida Venenosa"
        },
        {
          "nivel": 5,
          "texto": "Investida Tática"
        },
        {
          "nivel": 10,
          "texto": "Anti-veneno"
        },
        {
          "nivel": 15,
          "texto": "Aperto Mortal"
        },
        {
          "nivel": 20,
          "texto": "Diminui 1 no fator de F."
        }
      ],
      "imagem": "imagens/feras/yeji.jpg"
    },
    "Kilua": {
      "custo": "1T",
      "atributos": {
        "corpo": 12,
        "mente": 10,
        "foco": 8,
        "espirito": 15
      },
      "pv": 20,
      "passiva": "Pode caminhar sobre águas calmas.",
      "niveis": [
        {
          "nivel": 1,
          "texto": "Patas Geladas"
        },
        {
          "nivel": 5,
          "texto": "Uivo da Lua do Norte"
        },
        {
          "nivel": 10,
          "texto": "Matilha"
        },
        {
          "nivel": 15,
          "texto": "Queda da Lua do Norte"
        },
        {
          "nivel": 20,
          "texto": "Diminui 1 do fator de E."
        }
      ],
      "imagem": "imagens/feras/kilua.jpg"
    },
    "Carbuncle": {
      "custo": "1T",
      "atributos": {
        "corpo": 8,
        "mente": 15,
        "foco": 10,
        "espirito": 12
      },
      "pv": 12,
      "passiva": "Flutuante.",
      "niveis": [
        {
          "nivel": 1,
          "texto": "Raio Multicor"
        },
        {
          "nivel": 5,
          "texto": "Barreira Prismática"
        },
        {
          "nivel": 10,
          "texto": "Brilho Etéreo"
        },
        {
          "nivel": 15,
          "texto": "Refração Prismática"
        },
        {
          "nivel": 20,
          "texto": "Diminui 1 no fator de M."
        }
      ],
      "imagem": "imagens/feras/carbuncle.jpg"
    },
    "Baganoir": {
      "custo": "1T",
      "atributos": {
        "corpo": 15,
        "mente": 8,
        "foco": 12,
        "espirito": 10
      },
      "pv": 25,
      "passiva": "Seu movimento padrão é 6 m e pode saltar 3 m.",
      "niveis": [
        {
          "nivel": 1,
          "texto": "Golpe Concentrado"
        },
        {
          "nivel": 5,
          "texto": "Bloqueio de Corpo"
        },
        {
          "nivel": 10,
          "texto": "Sacrifício Tribal"
        },
        {
          "nivel": 15,
          "texto": "Fúria"
        },
        {
          "nivel": 20,
          "texto": "Diminui 1 no fator de C."
        }
      ],
      "imagem": "imagens/feras/baganoir.jpg"
    }
  }
};
