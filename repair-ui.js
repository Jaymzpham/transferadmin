import fs from 'fs';
import path from 'path';

const dir = 'd:/Mina-egna-projekts/transfer-admin/src/components/ui';

function repairFile(file, content) {
    const baseName = path.basename(file, '.jsx');
    let primitiveName = '';

    // Determine primitive name
    if (file === 'toast.jsx') primitiveName = 'ToastPrimitives';
    else if (file === 'switch.jsx') primitiveName = 'SwitchPrimitives';
    else if (file === 'tabs.jsx') primitiveName = 'TabsPrimitive';
    else if (file === 'sidebar.jsx') primitiveName = 'Sidebar'; // Special case
    else {
        // Convert kbab-case to PascalCase
        primitiveName = baseName.split('-').map(s => s.charAt(0).toUpperCase() + s.slice(1)).join('') + 'Primitive';
    }

    // Fix imports
    content = content.replace(/import \* from "@radix-ui\/react-([\w-]+)"/g, `import * as ${primitiveName} from "@radix-ui/react-$1"`);
    content = content.replace(/import \* from "react"/g, `import * as React from "react"`);

    // Fix common tailwind patterns that got broken
    content = content.replace(/data-\[state=open\]-([a-z-]+)/g, 'data-[state=open]:animate-$1');
    content = content.replace(/data-\[state=closed\]-([a-z-]+)/g, 'data-[state=closed]:animate-$1');
    content = content.replace(/data-\[state=open\]-([a-z-]+)-([a-z-]+)/g, 'data-[state=open]:$1-$2');
    content = content.replace(/data-\[state=closed\]-([a-z-]+)-([a-z-]+)/g, 'data-[state=closed]:$1-$2');
    content = content.replace(/data-\[side=([a-z]+)\]-in-from-([a-z-]+)/g, 'data-[side=$1]:animate-in-from-$2');

    // More general tailwind restoration
    const prefixes = ['sm', 'md', 'lg', 'xl', '2xl', 'hover', 'focus', 'active', 'disabled', 'group-hover', 'peer-hover', 'focus-visible', 'data-\[state=open\]', 'data-\[state=closed\]', 'data-\[disabled\]', 'aria-disabled', 'group', 'peer'];
    prefixes.forEach(p => {
        // Find pattern like "sm-flex" and change to "sm:flex"
        // But be careful not to match things with colons already
        const regex = new RegExp(`(\\s|")(${p})-([a-z\\[])`, 'g');
        content = content.replace(regex, '$1$2:$3');
    });

    // Fix some specifics
    content = content.replace(/focus-accent/g, 'focus:bg-accent');
    content = content.replace(/focus-accent-foreground/g, 'focus:text-accent-foreground');
    content = content.replace(/data-\[state=open\]-accent/g, 'data-[state=open]:bg-accent');

    return content;
}

const files = fs.readdirSync(dir);
files.forEach(file => {
    if (file.endsWith('.jsx')) {
        const filePath = path.join(dir, file);
        const content = fs.readFileSync(filePath, 'utf8');
        const repaired = repairFile(file, content);
        if (content !== repaired) {
            fs.writeFileSync(filePath, repaired);
            console.log(`Repaired ${file}`);
        }
    }
});
