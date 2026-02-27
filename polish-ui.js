import fs from 'fs';
import path from 'path';

const dir = 'd:/Mina-egna-projekts/transfer-admin/src/components/ui';

const replacements = [
    { from: /focus:visible-none/g, to: 'focus-visible:outline-none' },
    { from: /focus:visible-2/g, to: 'focus-visible:ring-2' },
    { from: /focus:visible-ring/g, to: 'focus-visible:ring-ring' },
    { from: /focus:visible-offset-2/g, to: 'focus-visible:ring-offset-2' },
    { from: /disabled:not-allowed/g, to: 'disabled:cursor-not-allowed' },
    { from: /disabled-not-allowed/g, to: 'disabled:cursor-not-allowed' },
    { from: /disabled-50/g, to: 'disabled:opacity-50' },
    { from: /disabled-events-none/g, to: 'disabled:pointer-events-none' },
    { from: /disabled:events-none/g, to: 'disabled:pointer-events-none' },
    { from: /sm-([a-z0-9])/g, to: 'sm:$1' },
    { from: /md-([a-z0-9])/g, to: 'md:$1' },
    { from: /lg-([a-z0-9])/g, to: 'lg:$1' },
    { from: /hover-([a-z0-9])/g, to: 'hover:$1' },
    { from: /focus-([a-z0-9])/g, to: 'focus:$1' },
    { from: /data-\[state=open\]-([a-z-]+)/g, to: 'data-[state=open]:$1' },
    { from: /data-\[state=closed\]-([a-z-]+)/g, to: 'data-[state=closed]:$1' },
    { from: /data-\[disabled\]-([a-z-]+)/g, to: 'data-[disabled]:$1' },
    { from: /group-([a-z-]+)/g, to: 'group:$1' },
    { from: /peer-([a-z-]+)/g, to: 'peer:$1' },
    { from: /\[&>svg\]-([0-9\.a-z]+)/g, to: '[&>svg]:$1' },
];

const files = fs.readdirSync(dir);
files.forEach(file => {
    if (file.endsWith('.jsx')) {
        const filePath = path.join(dir, file);
        let content = fs.readFileSync(filePath, 'utf8');
        let original = content;
        replacements.forEach(r => {
            content = content.replace(r.from, r.to);
        });
        if (content !== original) {
            fs.writeFileSync(filePath, content);
            console.log(`Final polish on ${file}`);
        }
    }
});
