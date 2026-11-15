#!/usr/bin/env python3
"""Converte as planilhas de tools/fichas/planilhas/ nos arquivos de dados da página.

Uso (na raiz do projeto ou em qualquer pasta):
    python3 tools/fichas/converter.py

Gera dois arquivos:
- cartas.js: o catálogo, lido da aba "Geral" de planilhas/Cartas Alther.xlsx e, em
  seguida, dos arquivos planilhas/Cartas *.csv (cartas sem caminho: equipamentos,
  itens etc.; mesmas colunas da aba "Geral", separadas por ";"), em ordem alfabética.
  Linhas sem nome são ignoradas (cartas ainda não criadas).
- dados.js: as listas dos selects e as descrições das habilidades raciais e
  intrínsecas, lidas da aba "Base de Dados" de planilhas/Alther-Ficha-Cartas.xlsx.
  A lista de caminhos vem da planilha de cartas, que é a mais atualizada.

Requer openpyxl (pip install openpyxl).
"""
import csv
import json
import re
import unicodedata
import warnings
from pathlib import Path

import openpyxl

# A planilha usa validações que o openpyxl não lê; não fazem falta aqui.
warnings.filterwarnings("ignore", message="Data Validation extension")

PASTA = Path(__file__).resolve().parent
FICHA_XLSX = PASTA / "planilhas" / "Alther-Ficha-Cartas.xlsx"
CARTAS_XLSX = PASTA / "planilhas" / "Cartas Alther.xlsx"
CSVS_SEM_CAMINHO = sorted((PASTA / "planilhas").glob("Cartas *.csv"))
FAMILIAS_CSV = PASTA / "planilhas" / "Familias Companheiro.csv"
PASTA_FERAS = PASTA / "imagens" / "feras"
SAIDA_DADOS = PASTA / "dados.js"
SAIDA_CARTAS = PASTA / "cartas.js"
PASTA_RETRATOS = PASTA / "imagens" / "racas"


def slug(nome):
    """'Qua'dir' -> 'quadir', 'Fenírio' -> 'fenirio' (nome do arquivo do retrato)."""
    s = unicodedata.normalize("NFD", nome)
    s = "".join(c for c in s if not unicodedata.combining(c)).lower()
    return re.sub(r"[^a-z0-9]+", "", s)


def texto(v):
    """Texto limpo; números inteiros perdem o ".0" que o Excel acrescenta."""
    if v is None:
        return ""
    if isinstance(v, float) and v.is_integer():
        v = int(v)
    return str(v).replace("\xa0", " ").strip()


def numero(v):
    t = texto(v).replace(",", ".")
    try:
        n = float(t)
    except ValueError:
        return None
    return int(n) if n.is_integer() else n


def lista(v, separadores="|,."):
    t = texto(v)
    for s in separadores[1:]:
        t = t.replace(s, separadores[0])
    return [x.strip() for x in t.split(separadores[0]) if x.strip()]


def coluna(ws, col, ini, fim):
    """Valores não vazios de col[ini..fim] (linhas inclusivas)."""
    return [texto(ws[f"{col}{r}"].value) for r in range(ini, fim + 1) if texto(ws[f"{col}{r}"].value)]


def ate_vazio(ws, col, ini):
    """Linha final de um bloco que começa em ini e termina antes da primeira célula vazia."""
    r = ini
    while texto(ws[f"{col}{r}"].value):
        r += 1
    return r - 1


def carta(r):
    """Uma linha da planilha (dict coluna -> valor) no formato do catálogo."""
    nome = texto(r.get("Nome"))
    out = {
        "id": texto(r.get("Código")),
        "nome": nome,
        "deckName": texto(r.get("Deck Name")) or nome,
        "caminho": texto(r.get("Caminho")),
        "tipo": texto(r.get("Tipo")),
        "classes": lista(r.get("Classes"), "|"),
        "atributo": texto(r.get("Atributo")),
        "custo": texto(r.get("Custo")),
        "alcance": texto(r.get("Alcance")),
        "acerto": texto(r.get("Acerto")),
        "defFisica": texto(r.get("Defesa Física")),
        "defArtistica": texto(r.get("Defesa Artística")),
        "desequilibrio": texto(r.get("Desequilíbrio")),
        "efeito": texto(r.get("Efeito")),
        "palavras": lista(r.get("Palavras-chave")),
        "custoAquisicao": numero(r.get("Custo Aquisição")),
        "limite": numero(r.get("Limite no Deck")) or 3,
    }
    # Cartas de companheiro animal (classe Fera): família dona da carta e nível que a libera.
    # Só aparecem quando preenchidas, para não mudar as outras cartas.
    if texto(r.get("Família")):
        out["familia"] = texto(r.get("Família"))
    if numero(r.get("Nível Família")) is not None:
        out["nivelFamilia"] = numero(r.get("Nível Família"))
    return out


def cartas():
    wb = openpyxl.load_workbook(CARTAS_XLSX, data_only=True)
    ws = wb["Geral"]
    linhas = ws.iter_rows(values_only=True)
    cab = [texto(c) for c in next(linhas)]
    registros = [dict(zip(cab, valores)) for valores in linhas]
    # Cartas sem caminho (equipamentos, itens...), em CSVs com as mesmas colunas da aba "Geral".
    for arq in CSVS_SEM_CAMINHO:
        with arq.open(encoding="utf-8-sig", newline="") as f:
            registros += list(csv.DictReader(f, delimiter=";"))
    out, codigos = [], set()
    for r in registros:
        nome, codigo = texto(r.get("Nome")), texto(r.get("Código"))
        if not nome or not codigo:
            continue
        if codigo in codigos:
            raise SystemExit(f"Código repetido nas planilhas de cartas: {codigo}")
        codigos.add(codigo)
        out.append(carta(r))
    # Caminhos na ordem em que aparecem na planilha (inclui os que ainda não têm cartas prontas).
    caminhos = []
    for valores in ws.iter_rows(min_row=2, values_only=True):
        c = texto(dict(zip(cab, valores)).get("Caminho"))
        if c and c not in caminhos:
            caminhos.append(c)
    return out, caminhos


def base_de_dados(caminhos):
    wb = openpyxl.load_workbook(FICHA_XLSX, data_only=True)
    ws = wb["Base de Dados"]

    # Coluna A tem vários blocos, cada um com um título e os itens logo abaixo.
    blocos = {}
    r = 1
    while r <= ws.max_row:
        titulo = texto(ws[f"A{r}"].value)
        if titulo:
            fim = ate_vazio(ws, "A", r + 1)
            blocos[titulo] = coluna(ws, "A", r + 1, fim)
            r = fim + 1
        r += 1

    racas = blocos.get("Raças", [])
    # Cada habilidade fica na MESMA LINHA do seu dono: a raça n (A15, A16...) usa a linha n+1
    # das colunas K/L (habilidade) e M/N (restrição); o caminho da linha r (coluna C) usa O/P
    # (intrínseca) e AA/AB/AC (armas, armaduras, maestria) da linha r.
    # Linhas vazias não deslocam as outras.
    def item(col_nome, col_desc, r):
        nome = texto(ws[f"{col_nome}{r}"].value)
        return {"nome": nome, "descricao": texto(ws[f"{col_desc}{r}"].value)} if nome else None

    por_raca = {raca: {"habilidade": item("K", "L", i + 2), "restricao": item("M", "N", i + 2)} for i, raca in enumerate(racas)}
    # Retrato da raça: imagens/racas/<slug>.jpg, se existir.
    for raca, info in por_raca.items():
        arq = PASTA_RETRATOS / f"{slug(raca)}.jpg"
        info["retrato"] = f"imagens/racas/{arq.name}" if arq.exists() else None
    sem_retrato = [r for r, i in por_raca.items() if not i["retrato"]]
    if sem_retrato:
        print("aviso: raças sem retrato em imagens/racas/:", ", ".join(sem_retrato))

    por_caminho = {}
    for r in range(2, ate_vazio(ws, "C", 2) + 1):
        c = texto(ws[f"C{r}"].value)
        h = item("O", "P", r)
        if h and c in caminhos:
            # Armas, armaduras e maestria do caminho (colunas AA, AB e AC da mesma linha).
            for chave, col in (("armas", "AA"), ("armaduras", "AB"), ("maestria", "AC")):
                h[chave] = texto(ws[f"{col}{r}"].value)
            por_caminho[c] = h
    sem_planilha = [c for c in caminhos if c not in coluna(ws, "C", 2, ate_vazio(ws, "C", 2))]
    if sem_planilha:
        print("aviso: caminhos sem linha na Base de Dados (coluna C):", ", ".join(sem_planilha))

    # Companheiros animais: famílias em I2..; os blocos "Stats <família>" vêm depois.
    familias = coluna(ws, "I", 2, ate_vazio(ws, "I", 2))

    return {
        "escolas": blocos.get("Escolas", []),
        "aspiracoes": blocos.get("Aspirações", []),
        "racas": racas,
        "arquetipos": blocos.get("Arquétipos", []),
        "caminhos": caminhos,
        "familiasCompanheiro": familias,
        "racial": por_raca,
        "intrinseca": por_caminho,
        "familias": familias_companheiro(familias),
    }


def familias_companheiro(lista):
    """Dados das cartas de família (planilhas/Familias Companheiro.csv) e a imagem de cada uma."""
    if not FAMILIAS_CSV.exists():
        return {}
    out = {}
    with FAMILIAS_CSV.open(encoding="utf-8-sig", newline="") as f:
        for r in csv.DictReader(f, delimiter=";"):
            nome = texto(r.get("Família"))
            if not nome:
                continue
            arq = PASTA_FERAS / f"{slug(nome)}.jpg"
            out[nome] = {
                "custo": texto(r.get("Custo")),
                "atributos": {k: numero(r.get(col)) for k, col in (("corpo", "Corpo"), ("mente", "Mente"), ("foco", "Foco"), ("espirito", "Espírito"))},
                "pv": numero(r.get("PV")),
                "passiva": texto(r.get("Passiva")),
                "niveis": [{"nivel": n, "texto": texto(r.get(f"Nv{n}"))} for n in (1, 5, 10, 15, 20) if texto(r.get(f"Nv{n}"))],
                "imagem": f"imagens/feras/{arq.name}" if arq.exists() else None,
            }
    fora = [n for n in out if n not in lista]
    if fora:
        print("aviso: famílias do CSV fora da lista da Base de Dados (coluna I):", ", ".join(fora))
    sem = [n for n in lista if n not in out]
    if sem:
        print("aviso: famílias sem carta em Familias Companheiro.csv:", ", ".join(sem))
    return out


def escrever_js(caminho, variavel, dados, origem):
    if "cartas" in dados:
        # Uma carta por linha: o diff do git mostra exatamente o que mudou na planilha.
        linhas = ",\n".join("    " + json.dumps(c, ensure_ascii=False) for c in dados["cartas"])
        corpo = '{\n  "cartas": [\n' + linhas + "\n  ]\n}"
    else:
        corpo = json.dumps(dados, ensure_ascii=False, indent=2)
    caminho.write_text(
        f"// Gerado por converter.py a partir de {origem}. Não edite à mão:\n"
        f"// altere a planilha e rode `python3 tools/fichas/converter.py`.\n"
        f"window.{variavel} = {corpo};\n",
        encoding="utf-8",
    )
    print(f"ok: {caminho.relative_to(PASTA.parent.parent)}")


if __name__ == "__main__":
    lista_cartas, caminhos = cartas()
    escrever_js(SAIDA_CARTAS, "ALTHER_CARTAS", {"cartas": lista_cartas}, f"planilhas/{CARTAS_XLSX.name} e " + ", ".join(a.name for a in CSVS_SEM_CAMINHO))
    escrever_js(SAIDA_DADOS, "ALTHER_DADOS", base_de_dados(caminhos), f"planilhas/{FICHA_XLSX.name} e {CARTAS_XLSX.name}")
    sem = [c for c in caminhos if c not in {x["caminho"] for x in lista_cartas}]
    print(f"{len(lista_cartas)} cartas, {len(caminhos)} caminhos" + (f" (sem cartas prontas: {', '.join(sem)})" if sem else ""))
