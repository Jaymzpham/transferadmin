import fs from 'fs';
import path from 'path';

const dir = 'd:/Mina-egna-projekts/transfer-admin/src/components/ui';

function stripTS(content) {
    // Remove interfaces
    content = content.replace(/interface\s+\w+\s+(extends\s+[^\{]+)?\{[\s\S]*?\}/g, '');

    // Remove types
    content = content.replace(/type\s+\w+\s*=[\s\S]*?;/g, '');

    // Remove generic parameters from React.forwardRef<...>(
    content = content.replace(/React\.forwardRef<[\s\S]*?>\(/g, 'React.forwardRef(');

    // Remove type annotations from function parameters: ( { ... } : SomeType )
    content = content.replace(/\(\s*(\{[\s\S]*?\})\s*:\s*[A-Z][\w\.]+(<[\s\S]*?>)?(\s*\[\])?\s*\)/g, '($1)');

    // Remove type annotations from function parameters: ( props : SomeType )
    content = content.replace(/\(\s*(\b\w+\b)\s*:\s*[A-Z][\w\.]+(<[\s\S]*?>)?(\s*\[\])?\s*\)/g, '($1)');

    // Remove type annotations like : React.HTMLAttributes<HTMLDivElement>
    content = content.replace(/:\s*React\.[A-Z][\w\.]+(<[\s\S]*?>)?/g, '');

    // Remove type annotations like : string | null
    content = content.replace(/:\s*\w+(\s*\|\s*\w+)*(\s*\[\])?/g, (match) => {
        // Avoid matching object property values like "side: 'right'"
        if (match.includes("'") || match.includes('"')) return match;
        return '';
    });

    // Remove "as const", "as string", etc.
    content = content.replace(/\s+as\s+(const|[A-Z][\w\.]+)/g, '');

    return content;
}

const files = fs.readdirSync(dir);
files.forEach(file => {
    if (file.endsWith('.jsx')) {
        const filePath = path.join(dir, file);
        const content = fs.readFileSync(filePath, 'utf8');
        const stripped = stripTS(content);
        if (content !== stripped) {
            fs.writeFileSync(filePath, stripped);
            console.log(`Stripped TS from ${file}`);
        }
    }
});
