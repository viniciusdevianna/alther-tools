#!/usr/bin/env python3
"""Monta a pasta _site/ só com as ferramentas listadas em publicar.txt.

Usado pelo GitHub Actions (.github/workflows/publicar.yml). Também dá para
rodar localmente para conferir o que vai ao ar: python3 publicar.py
"""
import re
import shutil
from pathlib import Path

RAIZ = Path(__file__).resolve().parent
SITE = RAIZ / "_site"
# Arquivos que não vão para o site (planilhas, scripts e notas do mestre).
IGNORAR = shutil.ignore_patterns("*.py", "*.md", "planilhas", ".DS_Store")

liberadas = [
    linha.strip()
    for linha in (RAIZ / "publicar.txt").read_text(encoding="utf-8").splitlines()
    if linha.strip() and not linha.strip().startswith("#")
]

shutil.rmtree(SITE, ignore_errors=True)
SITE.mkdir()

for nome in liberadas:
    origem = RAIZ / "tools" / nome
    if not origem.is_dir():
        raise SystemExit(f"publicar.txt: a pasta tools/{nome}/ não existe")
    shutil.copytree(origem, SITE / "tools" / nome, ignore=IGNORAR)

# Página inicial: tira os cards das ferramentas que não foram liberadas.
inicio = (RAIZ / "index.html").read_text(encoding="utf-8")
def manter(m):
    return m.group(0) if m.group(1) in liberadas else ""
inicio = re.sub(r'[ \t]*<li data-ferramenta="([^"]+)">.*?</li>\n?', manter, inicio, flags=re.S)
(SITE / "index.html").write_text(inicio, encoding="utf-8")
(SITE / ".nojekyll").touch()

print("Publicadas:", ", ".join(liberadas) or "(nenhuma)")
