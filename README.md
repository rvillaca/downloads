# downloads

Portal estático para distribuir os builds do app Kinektra fora do repositório principal.

## O que este projeto faz

- publica uma landing page simples no GitHub Pages
- exibe o status atual dos builds Android e iPhone
- permite apontar os downloads por JSON, sem precisar reescrever o HTML

## Estrutura

- `index.html`: página principal
- `assets/css/styles.css`: estilo visual do portal
- `assets/js/app.js`: leitura do JSON e renderização dos cards
- `assets/data/releases.json`: metadados dos builds publicados
- `.github/workflows/deploy-pages.yml`: publicação automática no GitHub Pages
- `downloads/`: pasta opcional para armazenar binários ou arquivos auxiliares

## Como atualizar os downloads

Edite `assets/data/releases.json`:

- `android.version`: versão exibida
- `android.publishedAt`: data de publicação
- `android.downloadUrl`: URL do APK
- `android.notes`: observações rápidas
- `ios.status`: status de distribuição
- `ios.notes`: instruções ou observações

Se quiser hospedar o APK no próprio GitHub:

1. envie o arquivo para uma Release do repositório
2. copie a URL pública do asset
3. cole em `android.downloadUrl`

## Publicação

O workflow de Pages publica automaticamente o conteúdo da branch `main`.

