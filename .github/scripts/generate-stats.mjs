import { readFile, writeFile, mkdir } from 'node:fs/promises';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

const installDir = process.argv[2];
if (!installDir) throw new Error('Pass the npm installation directory.');
const coreDir = path.resolve(installDir, 'node_modules/@stats-organization/github-readme-stats-core');
const fetcherPath = path.join(coreDir, 'build/fetchers/stats.js');
let source = await readFile(fetcherPath, 'utf8');
// GITHUB_TOKEN cannot enumerate stargazers across repositories. The public
// scalar provides the same count without requesting the protected connection.
const connection = /stargazers\s*\{\s*totalCount\s*\}/g;
if (!connection.test(source)) throw new Error('Upstream query changed; review compatibility patch.');
source = source.replace(connection, 'stargazerCount')
  .replaceAll('.stargazers.totalCount', '.stargazerCount');
await writeFile(fetcherPath, source);
const pkg = JSON.parse(await readFile(path.join(coreDir, 'package.json'), 'utf8'));
const { api } = await import(pathToFileURL(path.join(coreDir, pkg.main)).href);
const result = await api({ username: 'ranxi2001', show_icons: 'true', hide_title: 'true', text_color: '6F90B5' });
if (String(result.status).startsWith('error') || !result.content?.includes('<svg') || result.content.includes('Something went wrong')) {
  throw new Error(`Stats generation failed (${result.status}); preserving previous SVG.`);
}
await mkdir('assets', { recursive: true });
await writeFile('assets/github-stats.svg', result.content);
console.log('Generated assets/github-stats.svg');
