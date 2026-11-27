// 用 Remotion 实际渲染 4 套新风格（C/D/E/F）纯代码 1920x1080 实测帧
// 需传入已有 remotion node_modules 的工程根目录作为 --host
import path from 'node:path';
import fs from 'node:fs';
import {createRequire} from 'node:module';

const args = process.argv.slice(2);
const hostIdx = args.indexOf('--host');
const onlyIdx = args.indexOf('--only');
const hostDir = path.resolve(hostIdx >= 0 ? args[hostIdx + 1] : process.cwd());
const onlyIds = onlyIdx >= 0 && args[onlyIdx + 1] ? args[onlyIdx + 1].split(',').map((s) => s.trim()) : null;
const requireFromHost = createRequire(path.join(hostDir, 'package.json'));
const {bundle} = requireFromHost('@remotion/bundler');
const {renderStill, selectComposition} = requireFromHost('@remotion/renderer');

import {fileURLToPath} from 'node:url';
const proofDir = path.dirname(fileURLToPath(import.meta.url));
const outDir = path.join(proofDir, 'out');
fs.mkdirSync(outDir, {recursive: true});

const hostNodeModules = path.join(hostDir, 'node_modules');

console.log('[code-style-proof] Bundling pure-code C/D/E/F/G templates...');
const serveUrl = await bundle({
  entryPoint: path.join(proofDir, 'index.ts'),
  webpackOverride: (cfg) => ({
    ...cfg,
    resolve: {
      ...cfg.resolve,
      modules: [hostNodeModules, ...(cfg.resolve?.modules || ['node_modules'])],
    },
  }),
});

const targets = onlyIds || ['StyleC', 'StyleD', 'StyleE', 'StyleF', 'StyleG'];
for (const id of targets) {
  const comp = await selectComposition({serveUrl, id, inputProps: {}});
  const out = path.join(outDir, `${id}_code.jpg`);
  const t0 = Date.now();
  await renderStill({
    composition: comp,
    serveUrl,
    output: out,
    frame: 18,
    imageFormat: 'jpeg',
    jpegQuality: 90,
  });
  console.log(`Rendered ${id} -> ${out} (${Date.now() - t0}ms)`);
}
