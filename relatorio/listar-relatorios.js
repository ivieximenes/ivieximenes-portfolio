// Script Node.js para gerar a lista de relatórios públicos automaticamente
// Uso: node relatorio/listar-relatorios.js

const fs = require('fs');
const path = require('path');

const relatorioDir = path.join(__dirname);
const indexPath = path.join(__dirname, 'index.html');

// Lê todos os diretórios de relatórios (ignora arquivos e o próprio index.html)
const dominios = fs.readdirSync(relatorioDir)
  .filter(f => fs.statSync(path.join(relatorioDir, f)).isDirectory())
  .filter(f => !f.startsWith('.'));

// Gera o HTML da lista
const listHtml = dominios.map(dom =>
  `<li><a href="/relatorio/${dom}" target="_blank">Relatório: ${dom}</a></li>`
).join('\n');

// Lê o index.html atual
let indexHtml = fs.readFileSync(indexPath, 'utf8');

// Substitui o conteúdo da lista entre os comentários <!-- Lista gerada por JS -->
indexHtml = indexHtml.replace(
  /(<ul id="relatorio-list-ul">)[\s\S]*?(<\/ul>)/,
  `$1\n${listHtml}\n$2`
);

fs.writeFileSync(indexPath, indexHtml);
console.log('Lista de relatórios públicos atualizada!');
