# alther-tools

Conjunto de ferramentas simples para sessões de RPG de mesa (páginas, mini-apps, utilitários). Não é uma aplicação única nem complexa.

## Convenções

- Cada ferramenta vive em sua própria pasta em `tools/<nome-da-ferramenta>/` e é independente das outras.
- Preferir soluções simples: HTML/CSS/JS puro sempre que possível, sem build e sem dependências desnecessárias.
- Toda ferramenta nova também ganha um card na página inicial (`index.html` na raiz), com link relativo para `tools/<nome>/` e `data-ferramenta="<nome>"` no `<li>`.
- Publicação: GitHub Pages via `.github/workflows/publicar.yml`; só as ferramentas listadas em `publicar.txt` vão ao ar (ferramenta nova começa fora da lista até o usuário liberar).
- Toda ferramenta nova (ou alterada) **deve** ser documentada no `README.md`, na seção "Ferramentas", seguindo o modelo que está no próprio README: o que faz, como usar e onde fica.
- Idioma da documentação e da interface: português (Brasil).
