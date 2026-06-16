from pathlib import Path
p = Path('./Arq---Urb/index.html')
text = p.read_text(encoding='utf-8')
# Marielle replacement (literal)
old = '\n        <div class="single-image-container">\n          <div class="pdf-preview">\n            <object data="trabalho-op/Pôster Marielle Franco. Lutas e legado..pdf" type="application/pdf" width="100%" height="520">\n              <p>O PDF não pôde ser exibido aqui. <a href="trabalho-op/Pôster Marielle Franco. Lutas e legado..pdf" download="Poster-Marielle-Franco.pdf">Baixe o arquivo</a> para visualizar.</p>\n            </object>\n          </div>\n          <a href="trabalho-op/Pôster Marielle Franco. Lutas e legado..pdf" download="Poster-Marielle-Franco.pdf" class="btn btn-outline" style="margin-top: 16px; display: inline-block; background: rgba(92,138,75,0.1); border-color: rgba(92,138,75,0.3);">Baixar PDF</a>\n        </div>\n'
new = '\n        <div class="single-image-container">\n          <div class="image-preview" style="max-width:360px; margin-bottom:12px;">\n            <a href="trabalho-op/Pôster Marielle Franco. Lutas e legado..pdf" target="_blank" rel="noopener">\n              <img src="trabalho-op/Poster-Marielle-Franco-thumbnail.svg" alt="Pôster Marielle" style="width:100%; border-radius:8px; box-shadow:0 4px 12px rgba(0,0,0,0.08);">\n            </a>\n          </div>\n          <div class="pdf-preview">\n            <object data="trabalho-op/Pôster Marielle Franco. Lutas e legado..pdf" type="application/pdf" width="100%" height="520">\n              <p>O PDF não pôde ser exibido aqui. <a href="trabalho-op/Pôster Marielle Franco. Lutas e legado..pdf" download="Poster-Marielle-Franco.pdf">Baixe o arquivo</a> para visualizar.</p>\n            </object>\n          </div>\n          <a href="trabalho-op/Pôster Marielle Franco. Lutas e legado..pdf" download="Poster-Marielle-Franco.pdf" class="btn btn-outline" style="margin-top: 16px; display: inline-block; background: rgba(92,138,75,0.1); border-color: rgba(92,138,75,0.3);">Baixar PDF</a>\n        </div>\n'
if old in text:
    text = text.replace(old, new)
    print('Replaced Marielle block')
else:
    print('Marielle block not found')
# Residencial insertion
old2 = '\n        </div>\n        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-top: 16px;">\n'
new2 = '\n        </div>\n        <div class="image-grid-mini" style="display:grid; grid-template-columns: 1fr 1fr; gap:12px; margin-top:12px;">\n          <a href="trabalho-op/Desenho planta baixa atualizada td-FOLHA A3 (3).pdf" target="_blank" rel="noopener">\n            <img src="trabalho-op/Projeto-Residencial-thumbnail.svg" alt="Planta 1" style="width:100%; border-radius:8px; box-shadow:0 4px 12px rgba(0,0,0,0.08);">\n          </a>\n          <a href="trabalho-op/Desenho planta baixa atualizada td-FOLHA A3 (7).pdf" target="_blank" rel="noopener">\n            <img src="trabalho-op/Projeto-Residencial-thumbnail.svg" alt="Planta 2" style="width:100%; border-radius:8px; box-shadow:0 4px 12px rgba(0,0,0,0.08);">\n          </a>\n        </div>\n        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-top: 16px;">\n'
if old2 in text:
    text = text.replace(old2, new2)
    print('Inserted residential thumbnails')
else:
    print('Residencial insertion point not found')
# Backup and write
bak = p.with_suffix('.html.bak')
bak.write_text(p.read_text(encoding='utf-8'), encoding='utf-8')
p.write_text(text, encoding='utf-8')
print('Saved')
