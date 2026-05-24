const fs = require('fs');
const path = require('path');

const files = [
    'es/student.astro', 'en/student.astro',
    'es/government.astro', 'en/government.astro',
    'es/editorial.astro', 'en/editorial.astro',
    'es/school.astro', 'en/school.astro',
    'es/specs.astro', 'en/specs.astro',
    'es/specs2.astro', 'en/specs2.astro'
];

files.forEach(file => {
    const filePath = path.join(__dirname, file);
    if (!fs.existsSync(filePath)) {
        console.log(`Skipping ${file}`);
        return;
    }
    
    let content = fs.readFileSync(filePath, 'utf8');
    const lang = file.startsWith('es/') ? 'es' : 'en';

    // Replace everything from start up to </nav>
    const navEndIdx = content.indexOf('</nav>');
    if (navEndIdx !== -1) {
        content = `---\nimport BaseLayout from '../../layouts/BaseLayout.astro';\n---\n<BaseLayout lang="${lang}">\n` + content.substring(navEndIdx + 6);
    }

    // Remove footer
    const footerStart = content.indexOf('<!-- Footer -->');
    let footerEnd = content.indexOf('</footer>');
    if (footerStart === -1) {
        // Fallback to <footer
        const altFooterStart = content.indexOf('<footer');
        if (altFooterStart !== -1) {
            content = content.substring(0, altFooterStart) + content.substring(footerEnd + 9);
        }
    } else {
        content = content.substring(0, footerStart) + content.substring(footerEnd + 9);
    }

    // Now clean up scripts
    // Remove "function setLang(lang) { ... }" block completely
    content = content.replace(/function setLang\s*\(\s*lang\s*\)\s*\{[\s\S]*?\}/g, '');
    
    // Remove Mobile Menu Toggle
    content = content.replace(/\/\/\s*Mobile Menu Toggle[\s\S]*?menu\.classList\.toggle\('hidden'\);\s*\}\);?/g, '');
    
    // Some files might have missing closing braces, but if we just append </BaseLayout> before </body> it's safer.
    content = content.replace(/<\/body>[\s\S]*?<\/html>/, '</BaseLayout>');
    
    // Remove any trailing empty scripts
    content = content.replace(/<script is:inline>\s*<\/script>/g, '');

    fs.writeFileSync(filePath, content);
    console.log(`Refactored ${file}`);
});
