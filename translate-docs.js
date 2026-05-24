import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// To run this script:
// GEMINI_API_KEY="your_api_key_here" node translate-docs.js

const API_KEY = process.env.GEMINI_API_KEY;
const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${API_KEY}`;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DOCS_DIR_ES = path.join(__dirname, 'apps/colabedu-org/src/content/docs/es');
const DOCS_DIR_EN = path.join(__dirname, 'apps/colabedu-org/src/content/docs/en');
const PAGE_INDEX_ES = path.join(__dirname, 'apps/colabedu-org/src/pages/index.astro');
const PAGE_INDEX_EN = path.join(__dirname, 'apps/colabedu-org/src/pages/en/index.astro');

async function translateContent(content, isAstro = false) {
    const prompt = `You are an expert technical translator. Translate the following ${isAstro ? 'Astro component' : 'MDX document'} from Spanish to English.
    
    IMPORTANT RULES:
    1. Preserve ALL markdown formatting, frontmatter (between ---), HTML tags, and MDX components (like <Card>, <CardGrid>).
    2. Do NOT translate frontmatter keys, only their string values if appropriate (e.g. title, description).
    3. Do NOT translate code blocks, paths, or URLs unless they explicitly contain Spanish text meant for the user.
    4. Keep the tone professional, educational, and technical.
    5. Return ONLY the translated content, without markdown code block wrappers around the entire response.

    CONTENT TO TRANSLATE:
    ${content}
    `;

    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                contents: [{
                    parts: [{ text: prompt }]
                }],
                generationConfig: {
                    temperature: 0.2,
                }
            })
        });

        const data = await response.json();
        if (data.error) {
            throw new Error(data.error.message);
        }
        
        let translatedText = data.candidates[0].content.parts[0].text;
        
        // Remove markdown wrapper if Gemini added it
        if (translatedText.startsWith('\`\`\`') && translatedText.endsWith('\`\`\`')) {
            const lines = translatedText.split('\n');
            lines.shift(); // remove opening ```
            if (lines[lines.length - 1].trim() === '\`\`\`') {
                lines.pop(); // remove closing ```
            }
            translatedText = lines.join('\n');
        }
        
        return translatedText;
    } catch (error) {
        console.error("Error calling Gemini API:", error);
        return null;
    }
}

function getFiles(dir, fileList = []) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const filePath = path.join(dir, file);
        if (fs.statSync(filePath).isDirectory()) {
            getFiles(filePath, fileList);
        } else if (filePath.endsWith('.mdx')) {
            fileList.push(filePath);
        }
    }
    return fileList;
}

async function run() {
    if (!API_KEY) {
        console.error("Error: Please set the GEMINI_API_KEY environment variable.");
        console.log("Usage: GEMINI_API_KEY='your_key' node translate-docs.js");
        process.exit(1);
    }

    console.log("Starting translation process...");

    // 1. Translate index.astro
    console.log(`\nTranslating Landing Page: ${PAGE_INDEX_ES}`);
    if (fs.existsSync(PAGE_INDEX_ES)) {
        const content = fs.readFileSync(PAGE_INDEX_ES, 'utf8');
        const translated = await translateContent(content, true);
        if (translated) {
            fs.mkdirSync(path.dirname(PAGE_INDEX_EN), { recursive: true });
            
            // Adjust some links in the translated Astro file specifically
            let finalContent = translated.replace(/\/es\//g, '/en/');
            fs.writeFileSync(PAGE_INDEX_EN, finalContent);
            console.log(`✅ Saved to ${PAGE_INDEX_EN}`);
        }
    }

    // 2. Translate all MDX files
    const mdxFiles = getFiles(DOCS_DIR_ES);
    console.log(`\nFound ${mdxFiles.length} MDX files to translate in ${DOCS_DIR_ES}`);

    for (const filePath of mdxFiles) {
        const relativePath = path.relative(DOCS_DIR_ES, filePath);
        const targetPath = path.join(DOCS_DIR_EN, relativePath);
        
        console.log(`Translating: ${relativePath}...`);
        
        // Skip if already translated (useful for resuming)
        if (fs.existsSync(targetPath)) {
            console.log(`⏭️  Skipping (already exists): ${targetPath}`);
            continue;
        }

        const content = fs.readFileSync(filePath, 'utf8');
        const translated = await translateContent(content, false);
        
        if (translated) {
            fs.mkdirSync(path.dirname(targetPath), { recursive: true });
            
            // Fix internal links from /es/ to /en/
            let finalContent = translated.replace(/\/es\//g, '/en/');
            
            fs.writeFileSync(targetPath, finalContent);
            console.log(`✅ Saved: ${targetPath}`);
        } else {
            console.log(`❌ Failed to translate: ${relativePath}`);
        }
        
        // Sleep to avoid rate limits (2 seconds)
        await new Promise(resolve => setTimeout(resolve, 2000));
    }
    
    console.log("\n🎉 Translation complete!");
}

run();
