const fs = require('fs');
const glob = require('glob');

const files = [
  ...glob.sync('apps/colabedu-net/src/pages/en/*.astro'),
  ...glob.sync('apps/colabedu-net/src/pages/es/*.astro')
];

for (const file of files) {
  if (file.endsWith('es/index.astro') || file.endsWith('en/index.astro')) continue;
  let content = fs.readFileSync(file, 'utf8');
  
  // We need to find where the scripts start. It's usually after </footer>
  // Actually, wait, some files might have multiple script blocks?
  // Let's look for "<!-- Interactive Scripts -->" or "<!-- LOGIC -->"
  let lines = content.split('\n');
  let newLines = [];
  let inScript = false;
  let hasScriptAtBottom = false;

  for (let i = 0; i < lines.length; i++) {
    let line = lines[i];
    
    // We want to add <script is:inline> before the first line of JS that isn't a script tag
    // Since we just deleted <script is:inline> and </script>, the JS code is sitting raw
    // usually right after <!-- Interactive Scripts --> or <!-- LOGIC -->
    if (line.includes('<!-- Interactive Scripts -->') || line.includes('<!-- LOGIC -->')) {
      newLines.push(line);
      newLines.push('    <script is:inline>');
      hasScriptAtBottom = true;
    } else if (line.includes('</body>') && hasScriptAtBottom) {
      newLines.push('    </script>');
      newLines.push(line);
    } else {
      newLines.push(line);
    }
  }
  
  fs.writeFileSync(file, newLines.join('\n'));
  console.log('Fixed', file);
}
