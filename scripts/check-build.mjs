import { existsSync, readdirSync } from 'node:fs';
const required = ['dist/index.html', 'dist/favicon.svg', 'dist/robots.txt', 'dist/profile/andrey-souza.png', 'dist/projects/quantbase-logo.svg'];
const missing = required.filter(file => !existsSync(file));
const assets = existsSync('dist/assets') ? readdirSync('dist/assets') : [];
if (!assets.some(file => file.endsWith('.js')) || !assets.some(file => file.endsWith('.css'))) missing.push('dist/assets: JS and CSS');
if (missing.length) { console.error('Missing build assets:', missing.join(', ')); process.exitCode = 1; }
else console.log('Required build assets are present.');
