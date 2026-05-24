const fs = require('fs');
const glob = require('glob');

const indexContent = fs.readFileSync('apps/colabedu-net/src/pages/en/index.astro', 'utf8');
const styleMatch = indexContent.match(/<style>[\s\S]*?<\/style>/);
if (!styleMatch) {
  console.error('Could not find style block in index.astro');
  process.exit(1);
}
const styleBlock = styleMatch[0];

const files = [
  ...glob.sync('apps/colabedu-net/src/pages/en/*.astro'),
  ...glob.sync('apps/colabedu-net/src/pages/es/*.astro')
];

for (const file of files) {
  if (file.endsWith('index.astro')) continue;
  let content = fs.readFileSync(file, 'utf8');
  
  // Replace the corrupted style block
  content = content.replace(/<style>[\s\S]*?<\/style>/, styleBlock);
  
  fs.writeFileSync(file, content);
  console.log('Fixed CSS in', file);
}
