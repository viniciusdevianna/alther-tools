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
        "descricao": "Altalia podem voar utilizando uma ação de movimento (em batalha) ou um teste de perícia corporal (fora de batalha). Em batalha eles podem se manter no ar por um turno sem gastos. Fora de batalha eles conseguem se manter por 30 min. Estar voando torna Altalia imunes a ataques rasteiros e concede +2NP na esquiva contra armas curtas. No entanto, recebem -1NP na defesa contra ataques de longa distância."
      },
      "restricao": {
        "nome": "Devoradores de Carne",
        "descricao": "Altalia não conseguem digerir nenhum tipo de planta, nem mesmo ervas de cura, frutas ou qualquer alimento de origem vegetal. Caso haja a ingestão, o altalia passa mal, ficando estafado por um período de 1 a 3 h."
      }
    },
    "Fenírio": {
      "habilidade": {
        "nome": "Faro Apurado",
        "descricao": "Fenírios podem farejar seus inimigos ou aliados. Se um fenírio tiver contato com um cheiro uma vez, ele pode utilizar essa habilidade para rastrear seu alvo com sucesso garantido, em um raio de 20NP km. Em batalha, esta habilidade pode ser utilizada como ação padrão e para sentir o cheiro de um oponente. A partir de então até o fim da batalha o oponente não pode ficar oculto para o fenírio sem disfarçar seu cheiro."
      },
      "restricao": {
        "nome": "Matilha",
        "descricao": "Fenírios podem farejar seus inimigos ou aliados. Se um fenírio tiver contato com um cheiro uma vez, ele pode utilizar essa habilidade para rastrear seu alvo com sucesso garantido, em um raio de 20NP km. Em batalha, esta habilidade pode ser utilizada como ação padrão e para sentir o cheiro de um oponente. A partir de então até o fim da batalha o oponente não pode ficar oculto para o fenírio sem disfarçar seu cheiro."
      }
    },
    "Gollyck": {
      "habilidade": {
        "nome": "Nado Gollyck",
        "descricao": "Gollycks podem utilizar essa habilidade como um teste de perícia ou como uma ação de movimento em batalha para nadar. Fora de batalha, esta habilidade concede sucesso garantido em qualquer teste de nadar e também permite que um gollyck nade na areia, lodo e terra fofa, além da água. Em batalha, enquanto nada um gollyck se move duas vezes mais rápido e ganha +NP+5 na defesa contra ataques físicos. Tomar qualquer ação diferente de nadar tira o gollyck deste estado."
      },
      "restricao": {
        "nome": "Face do Medo",
        "descricao": "Gollycks dificilmente são bem vistos por outras raças. Mesmo que um gollyck seja bondoso e honesto, ele encontrará resistência nas interações sociais, até mesmo com membros de sua própria raça que não tenham crescido com ele. Assim, recebem -2 de Treinamento em qualquer teste de perícia social."
      }
    },
    "Lodger": {
      "habilidade": {
        "nome": "Movimento Ás",
        "descricao": "Lodgers podem utilizar esta habilidade para obter +2NP em testes de perícia que envolvam escalada ou equilíbrio. Além disso, em batalha, eles ganham +1NP em testes de esquiva contra ataques corpo a corpo. Caso a esquiva seja bemsucedida, eles podem usar uma ação livre de movimento para se reposicionar."
      },
      "restricao": {
        "nome": "Pequeninos",
        "descricao": "Lodgers tem uma constituição muito pequena e, portanto, não podem utilizar armas longas e equipamentos pesados. Em compensação, sua elevada destreza permite que eles operem armas curtas melhor que outras raças, concedendo +1NP no acerto em ataques com elas"
      }
    },
    "Maek": {
      "habilidade": {
        "nome": "Diplomacia Maek",
        "descricao": "Em batalha, maeks podem usar essa habilidade uma vez para convencer um inimigo a ajuda-lo, fazendo um teste social contra a resistência de seus adversários. Esta habilidade só pode ser utilizada contra raças inteligentes. Além disso, maeks recebem +1 de Treinamento em perícias sociais."
      },
      "restricao": {
        "nome": "Arte-vulneráveis",
        "descricao": "Maeks são mais suscetíveis aos efeitos causados pelo contato com a energia extradimensional. Eles têm uma penalidade permanente de -1NP em sua resistência. Além disso, ficam o dobro de turnos a mais afetados por qualquer efeito artístico."
      }
    },
    "Nuaa": {
      "habilidade": {
        "nome": "Sanguidourado",
        "descricao": "O sangue dos nuaa concede a eles habilidades mágicas únicas. Toda arte utilizada por eles ganha +1NP no dado de efeito. Caso a arte possua efeito fixo, eles dobram o seu tempo de duração."
      },
      "restricao": {
        "nome": "Constituição Fraca",
        "descricao": "Nuaa não têm corpos muito resistentes e por isso são altamente suscetíveis à fadiga, venenos, álcool, etc. Todas as penalidades sofridas em todos esses casos são dobradas para eles. Além disso, realizar testes de perícia corporal seguidos concede -1NP de penalidade acumulativo para cada teste subsequente."
      }
    },
    "Paishu": {
      "habilidade": {
        "nome": "Braços de Gigante",
        "descricao": "Os paishus tem força excepcional quando concentram suas energias nos seus braços. Assim, eles ganham +1NP de dano em todos os seus ataques físicos. Além disso, eles podem utilizar seus braços em uma ação de movimento para andar 2 m a mais (em batalha) ou ganhar +1 de Treinamento em testes de corpo (fora de batalha)."
      },
      "restricao": {
        "nome": "Enormemente Denso",
        "descricao": "Paishus são densos demais para nadar ou se equilibrar com facilidade. Eles sofrem -2 de Treinamento de penalidade nestes testes. Em compensação, eles podem aguentar um peso igual a 10 vezes o próprio acima da cabeça."
      }
    },
    "Qua'dir": {
      "habilidade": {
        "nome": "Hipersalto",
        "descricao": "Qua’dir podem usar esta habilidade como ação de movimento em uma batalha. Eles saltam até seu movimento normal + 2 m e ignoram qualquer barreira física de menos de 2+NP m de altura. Eles conseguem carregar um objeto ou um indivíduo de até 2x seu próprio peso no salto. Fora de batalha, eles têm sucesso garantido em testes de perícia que envolvam saltar."
      },
      "restricao": {
        "nome": "Hiperatividade",
        "descricao": "Qua’dir não conseguem ficar parados por muito tempo. Eles dormem apenas 4 horas por dia e precisam de algo para se distrair caso não tenham nada para fazer. Em batalha, eles devem gastar pelo menos uma ação de movimento por turno. Caso sejam impedidos de se mover por um fator externo, eles tomam penalidade de -2NP no dado de acerto de qualquer ataque que realizem."
      }
    },
    "Rae": {
      "habilidade": {
        "nome": "Passo Obscuro",
        "descricao": "Os rae possuem uma habilidade única de caminhar brevemente pelo limiar das dimensões. Em batalha, o rae pode utilizar 5 pontos de mente para usar essa habilidade como ação padrão e ficar invisível para todos os outros que não sejam rae e que não tenham visão do limiar. Então, ele pode se mover livremente pelo campo. Sua próxima ação padrão cancela este estado. Fora de batalha ele pode fazer um teste de perícia mental para andar invisível. A distância determina a CD do teste"
      },
      "restricao": {
        "nome": "Hematófagos",
        "descricao": "Rae se alimentam apenas de sangue animal, porém eles gostam muito de sangue. Caso um rae veja sangue vermelho em determinada quantidade ele deve fazer um teste de resistência. Caso fracasse, o rae estará inebriado e receberá -2NP nos dados de acerto de suas ações. A cada turno ele deve refazer o teste, enquanto estiver inebriado."
      }
    },
    "Saityr": {
      "habilidade": {
        "nome": "Voz da Natureza",
        "descricao": "Saityres podem se comunicar com animais, utilizando pontos de natureza. Em batalha, como uma ação padrão, o saityr pode comandar um animal selvagem para realizar um ataque simples contra um inimigo. Animais pequenos: 2 ponto; Médios: 4 pontos; Grandes: 10 pontos; Enormes: 20 pontos; Épicos: 40 pontos; Míticos: 50 pontos. Fora dela, o saityr pode fazer pedidos simples e ouvir informações simples dos animais gastando 1 ponto de natureza."
      },
      "restricao": {
        "nome": "Cascos Fendidos",
        "descricao": "Saityres possuem cascos no lugar dos pés e, desta forma, não conseguem andar em qualquer terreno com facilidade. Terrenos muito fofos (como a areia do deserto) ou muito irregulares (como os vales montanhosos) concedem penalidade de movimento de metade do movimento total do saityr, em batalha ou não. Além disso, eles recebem -1 de Treinamento em testes de perícia de foco."
      }
    }
  },
  "intrinseca": {
    "Monge": {
      "nome": "Combo",
      "descricao": "A cada sucesso em um ataque o monge pode jogar dados extras de 1 nível menor que o do ataque anterior para desferir um golpe em sequência no mesmo inimigo. O dano é calculado ao fim do combo. O monge não pode realizar mais que 4 ataques por AP."
    },
    "Nébulo": {
      "nome": "Névoa",
      "descricao": "Utilizando uma ação padrão, nébulos podem se tornar ocultos no campo de batalha. Inimigos podem procurar pelo nébulo realizando um teste de perícia de foco contra a esquiva do nébulo. Tomar uma ação de movimento não cancela o ocultamento"
    },
    "Arcante": {
      "nome": "Disparo",
      "descricao": "O arcante pode disparar um raio simples de energia da dimensão que acessa como uma ação padrão, causando 1d8 + M4 de dano em uma pequena área (AOE(1)) onde acerta. Gera 5 PD"
    },
    "Shepian": {
      "nome": "Avatar",
      "descricao": "Shepians conseguem materializar seu espírito e atacar com ele. O espírito dos shepians causa 1d4 + E3 de dano espiritual em caso de sucesso no ataque e atormentam os inimigos, causando E5 de dano espiritual por 2 turnos subsequentes. O espírito dos shepians não pode ser atacado fisicamente, mas pode ser atingido por magia e possuem metade dos PV do shepian. Caso o espírito do shepian seja destruído, este fica atordoado por 3 turnos. Espíritos possuem movimento infinito em batalha."
    },
    "Hassassin": {
      "nome": "Bloodpoint",
      "descricao": "Ataques diretos do hassassin que obtém sucesso fazem seu alvo sangrar (5). Hassassins causam F2 a mais de dano contra inimigos que estejam sangrando e aumentam o fator de sangramento em 1."
    },
    "Evocador": {
      "nome": "Materializar",
      "descricao": "Evocadores podem, com uma ação padrão, materializar um espírito do vazio que esteja atormentando um inimigo e controla-lo como avatar. Cada espírito possui uma ação de movimento e uma ação padrão controladas pelo evocador. Espíritos se desmaterializam quando sua tormenta termina. Gera 10 de PD por turno materializado por espírito."
    },
    "Arauto": {
      "nome": "Persona",
      "descricao": "O arauto utiliza seu avatar espiritual como uma extensão de seu corpo. Ao atacar um oponente fisicamente, o arauto manifesta uma cópia espiritual sua que desfere um segundo golpe no oponente. O golpe da persona causa D2 de dano espiritual. O oponente joga a esquiva duas vezes, uma para cada golpe, mas o acerto da persona é o mesmo do arauto"
    },
    "Cruzado": {
      "nome": "Provocar",
      "descricao": "Cruzados podem com uma ação padrão provocar um inimigo por 3 turnos. Inimigos provocados atacam apenas o cruzado."
    },
    "Bardo": {
      "nome": "Músico",
      "descricao": "Bardos podem utilizar instrumentos para amplificar suas habilidades. Ao utilizar um instrumento, o bardo ganha 1dF5 nas suas habilidades e causa +F10 de dano artístico irresistível com o instrumento"
    },
    "Druida": {
      "nome": "Companheiro",
      "descricao": "Druidas possuem um companheiro animal que começa jovem, porém cresce com seu mestre. O companheiro só age sob comando do druida, utilizando as ações do próprio druida. Ao trocar de caminho, o druida ainda pode comandar seu companheiro, mas perde o acesso às suas habilidades especiais."
    },
    "Paladino": {
      "nome": "Benção",
      "descricao": "Paladinos podem abençoar um aliado ou a si mesmo, curando de malefícios não-físicos e expurgando todos os espíritos que o atormentem como uma ação padrão."
    },
    "Vibrata": {
      "nome": "Vibrar",
      "descricao": "Com uma ação padrão, o vibrata pode criar uma barreira de ar à F5 m de seu corpo, concedendo a ele mesmo ou a um aliado C de defesa naquela rodada."
    },
    "Kalinier": {
      "nome": "Fusão",
      "descricao": "O kalinier funde seu espírito com o de seu companheiro animal com uma ação padrão, assumindo sua forma fera. Na forma fera o kalinier possui pontos de vida, ações padrão, ações de movimento e dados somados com os de seu companheiro. Todas as habilidades especiais de seu companheiro podem ser utilizadas na forma fera. A forma fera dura E10 turnos e só pode ser ativada novamente depois de um descanso. Gera 10 de PD por turno em que está ativa."
    },
    "Chevalier": {
      "nome": "Proteger",
      "descricao": "Com uma ação padrão, o chevalier orienta seu espírito para defender um aliado, transferindo todo o dano não mitigado por ele para o chevalier. O efeito dura até que o chevalier dirija seu espírito para outro aliado."
    },
    "Encantador": {
      "nome": "Encantar",
      "descricao": "Uma vez por turno o encantador pode, com uma ação padrão, encantar um aliado aleatório não encantado. Um aliado encantado é curado em 1d8 + M2 do encantador todo turno durante 4 turnos. Gera 30 de PD apenas na ativação. O encantador pode, através de sua música, utilizar as habilidades especiais de seu companheiro animal, com uma ação padrão."
    },
    "Valete": {
      "nome": "Impulso",
      "descricao": "Ao utilizar uma ação de movimento antes de sua ação padrão, o valete ganha 1dC4 a mais nos seus dados de acerto por ação de movimento"
    },
    "Áquila": {
      "nome": "Mira",
      "descricao": "Áquilas podem mirar em um oponente como uma ação padrão. Seu próximo ataque ou habilidade contra aquele oponente tem F4dZ de sucesso garantido nos seus dados de acerto."
    },
    "Tecnoclasta": {
      "nome": "Bolsão",
      "descricao": "Tecnoclastas podem guardar itens de tamanho pequeno em bolsões dimensionais. Eles fabricam itens que só ficam estabilizados dentro dos bolsões. Eles podem abrir um bolsão dimensional à distância com uma ação padrão, gerando 2 de PD e permitindo que eles usem seus itens diretamente sobre o alvo e não precisem jogar seu acerto para atingir o oponente com eles. Os bolsões não podem guardar matéria orgânica. Tecnoclastas conseguem criar M5 bolsões dimensionais de uma vez."
    },
    "Ilusionista": {
      "nome": "Ilusão",
      "descricao": "Ilusionistas podem com uma ação padrão tomar a forma de um aliado ou oponente apenas para quem ele deseja que assim o veja. A ilusão dura um turno. Ao tomar qualquer ação padrão a ilusão é quebrada. Oponentes que atacam a ilusão ficam confusos e irritados por um turno e desfazem a ilusão."
    }
  }
};
