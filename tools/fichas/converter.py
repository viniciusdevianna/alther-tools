#!/usr/bin/env python3
"""Converte as planilhas de tools/fichas/planilhas/ nos arquivos de dados da página.

Uso (na raiz do projeto ou em qualquer pasta):
    python3 tools/fichas/converter.py

Gera dois arquivos:
- cartas.js: o catálogo, lido da aba "Geral" de planilhas/Cartas Alther.xlsx.
  Linhas sem nome são ignoradas (cartas ainda não criadas).
- dados.js: as listas dos selects e as descrições das habilidades raciais e
  intrínsecas, lidas da aba "Base de Dados" de planilhas/Alther-Ficha-Cartas.xlsx.
  A lista de caminhos vem da planilha de cartas, que é a mais atualizada.

Requer openpyxl (pip install openpyxl).
"""
import json
import warnings
from pathlib import Path

import openpyxl

# A planilha usa validações que o openpyxl não lê; não fazem falta aqui.
warnings.filterwarnings("ignore", message="Data Validation extension")

PASTA = Path(__file__).resolve().parent
FICHA_XLSX = PASTA / "planilhas" / "Alther-Ficha-Cartas.xlsx"
CARTAS_XLSX = PASTA / "planilhas" / "Cartas Alther.xlsx"
SAIDA_DADOS = PASTA / "dados.js"
SAIDA_CARTAS = PASTA / "cartas.js"


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


def pares(ws, col_nome, col_desc, ini, fim):
    out = []
    for r in range(ini, fim + 1):
        nome = texto(ws[f"{col_nome}{r}"].value)
        if nome:
            out.append({"nome": nome, "descricao": texto(ws[f"{col_desc}{r}"].value)})
    return out


def ate_vazio(ws, col, ini):
    """Linha final de um bloco que começa em ini e termina antes da primeira célula vazia."""
    r = ini
    while texto(ws[f"{col}{r}"].value):
        r += 1
    return r - 1


def cartas():
    wb = openpyxl.load_workbook(CARTAS_XLSX, data_only=True)
    ws = wb["Geral"]
    linhas = ws.iter_rows(values_only=True)
    cab = [texto(c) for c in next(linhas)]
    out, codigos = [], set()
    for valores in linhas:
        r = dict(zip(cab, valores))
        nome, codigo = texto(r.get("Nome")), texto(r.get("Código"))
        if not nome or not codigo:
            continue
        if codigo in codigos:
            raise SystemExit(f"Código repetido na planilha de cartas: {codigo}")
        codigos.add(codigo)
        out.append({
            "id": codigo,
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
        })
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
    caminhos_ficha = coluna(ws, "C", 2, ate_vazio(ws, "C", 2))

    # Habilidades raciais (K/L) e restrições (M/N) seguem a ordem das raças.
    raciais = pares(ws, "K", "L", 2, 1 + len(racas))
    restricoes = pares(ws, "M", "N", 2, 1 + len(racas))
    por_raca = {}
    for i, raca in enumerate(racas):
        por_raca[raca] = {
            "habilidade": raciais[i] if i < len(raciais) else None,
            "restricao": restricoes[i] if i < len(restricoes) else None,
        }

    # Habilidades intrínsecas (O/P) seguem a ordem dos caminhos da ficha (coluna C).
    # Só entram as dos caminhos que ainda existem na planilha de cartas.
    intrinsecas = pares(ws, "O", "P", 2, 1 + len(caminhos_ficha))
    por_caminho = {c: intrinsecas[i] for i, c in enumerate(caminhos_ficha) if i < len(intrinsecas) and c in caminhos}

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
    }


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
    escrever_js(SAIDA_CARTAS, "ALTHER_CARTAS", {"cartas": lista_cartas}, f"planilhas/{CARTAS_XLSX.name}")
    escrever_js(SAIDA_DADOS, "ALTHER_DADOS", base_de_dados(caminhos), f"planilhas/{FICHA_XLSX.name} e {CARTAS_XLSX.name}")
    sem = [c for c in caminhos if c not in {x["caminho"] for x in lista_cartas}]
    print(f"{len(lista_cartas)} cartas, {len(caminhos)} caminhos" + (f" (sem cartas prontas: {', '.join(sem)})" if sem else ""))
