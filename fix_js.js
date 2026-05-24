const fs = require('fs');
const glob = require('glob');

const files = ['editorial', 'government', 'school', 'student', 'specs', 'specs2'];

for (const name of files) {
  const htmlPath = `${name}.html`;
  if (!fs.existsSync(htmlPath)) continue;
  
  const htmlContent = fs.readFileSync(htmlPath, 'utf8');
  // Find the LAST script block in the HTML file
  const scriptMatch = htmlContent.match(/<script>(?![\s\S]*<script>)[\s\S]*?<\/script>/);
  if (!scriptMatch) continue;
  
  // Replace <script> with <script is:inline> and remove tailwind.config
  let scriptBlock = scriptMatch[0].replace('<script>', '<script is:inline>');
  
  // Remove tailwind.config from the script block
  scriptBlock = scriptBlock.replace(/tailwind\.config\s*=\s*{[\s\S]*?};\s*/, '');
  scriptBlock = scriptBlock.replace(/tailwind\.config\s*=\s*{[\s\S]*?}\s*(?=\n)/, '');
  
  // Try a more robust way to remove tailwind.config:
  // Since it's at the top of the script block, we can just find where the actual logic starts
  // The actual logic usually starts with `const btn`, `window.onload`, or `//`
  const lines = scriptBlock.split('\n');
  let newLines = ['    <script is:inline>'];
  let inTailwind = false;
  let braces = 0;
  for (let i = 1; i < lines.length - 1; i++) {
    const line = lines[i];
    if (line.includes('tailwind.config = {')) {
      inTailwind = true;
      braces += (line.match(/\{/g) || []).length;
      braces -= (line.match(/\}/g) || []).length;
      continue;
    }
    if (inTailwind) {
      braces += (line.match(/\{/g) || []).length;
      braces -= (line.match(/\}/g) || []).length;
      if (braces <= 0) {
        inTailwind = false;
      }
      continue;
    }
    newLines.push(line);
  }
  newLines.push('    </script>');
  scriptBlock = newLines.join('\n');

  // Replace in es/file.astro
  for (const lang of ['es', 'en']) {
    const astroPath = `apps/colabedu-net/src/pages/${lang}/${name}.astro`;
    if (!fs.existsSync(astroPath)) continue;
    
    let content = fs.readFileSync(astroPath, 'utf8');
    // Replace the broken script block at the end
    // First, find window.onload or the first JS keyword that is outside any tag
    // The easiest way is to just look for the </footer> tag and replace everything after it!
    const footerMatch = content.match(/<\/footer>\s*(<!-- Interactive Scripts -->)?\s*<script is:inline>[\s\S]*$/);
    if (footerMatch) {
        content = content.replace(footerMatch[0], '</footer>\n\n    <!-- Interactive Scripts -->\n' + scriptBlock + '\n</body>\n</html>\n');
    } else {
        // Fallback: replace everything after </footer> that isn't </body> or </html>
        const lastFooterIdx = content.lastIndexOf('</footer>');
        if (lastFooterIdx !== -1) {
            content = content.substring(0, lastFooterIdx + 9) + '\n\n    <!-- Interactive Scripts -->\n' + scriptBlock + '\n</body>\n</html>\n';
        }
    }
    
    fs.writeFileSync(astroPath, content);
    console.log(`Restored JS in ${lang}/${name}.astro`);
  }
}
