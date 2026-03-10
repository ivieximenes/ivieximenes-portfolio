// Script Node.js para gerar páginas de relatório público
// Uso: node relatorio/gerar-relatorio.js dominio.com "<html do relatorio>"

const fs = require('fs');
const path = require('path');

function gerarRelatorioHTML(dominio, relatorioHtml) {
  const dir = path.join(__dirname, dominio);
  fs.mkdirSync(dir, { recursive: true });
  const template = fs.readFileSync(path.join(__dirname, 'template.html'), 'utf8');
  const html = template
    .replace(/\{\{dominio\}\}/g, dominio)
    .replace('{{relatorioHtml}}', relatorioHtml);
  fs.writeFileSync(path.join(dir, 'index.html'), html);
  console.log(`Relatório gerado em: relatorio/${dominio}/index.html`);
}

// CLI usage
if (require.main === module) {
  const [dominio, relatorioHtmlPath] = process.argv.slice(2);
  if (!dominio || !relatorioHtmlPath) {
    console.error('Uso: node relatorio/gerar-relatorio.js dominio.com relatorio.html');
    process.exit(1);
  }
  const relatorioHtml = fs.readFileSync(relatorioHtmlPath, 'utf8');
  gerarRelatorioHTML(dominio, relatorioHtml);
}

// Após gerar o relatório, atualiza a lista pública automaticamente
try {
  require('child_process').execSync('node ' + require('path').join(__dirname, 'listar-relatorios.js'), { stdio: 'inherit' });
} catch (e) {
  console.error('Erro ao atualizar lista de relatórios:', e.message);
}

module.exports = gerarRelatorioHTML;
