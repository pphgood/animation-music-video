#!/usr/bin/env node
/**
 * Remotion 动画 MV 批量关键帧视觉抽检 + 4x4 审片拼图脚本
 * 请在 Remotion 项目根目录下运行（包含 src/index.ts 与 node_modules/@remotion/*）：
 *   node "<skill_dir>/scripts/audit_stills.mjs" --comp ShunMV --frames 46,128,220,... --sheet
 */
import path from 'node:path';
import fs from 'node:fs';
import {createRequire} from 'node:module';
import {execFileSync} from 'node:child_process';

const cwd = process.cwd();
const requireFromProject = createRequire(path.join(cwd, 'package.json'));
const {bundle} = requireFromProject('@remotion/bundler');
const {renderStill, selectComposition} = requireFromProject('@remotion/renderer');

const args = process.argv.slice(2);
const getArg = (flag, fallback = null) => {
  const idx = args.indexOf(flag);
  return idx >= 0 && args[idx + 1] ? args[idx + 1] : fallback;
};

const compId = getArg('--comp', process.env.COMP || 'ShunMV');
const framesArg = getArg('--frames', '');
const makeSheet = args.includes('--sheet');
const outDir = path.resolve(cwd, getArg('--out', 'out/stills'));
const entry = path.resolve(cwd, getArg('--entry', 'src/index.ts'));

const frames = framesArg
  .split(',')
  .map((s) => Number(s.trim()))
  .filter((n) => !Number.isNaN(n) && n >= 0);

if (frames.length === 0) {
  console.error('用法：node audit_stills.mjs --comp <CompId> --frames 46,128,220,... [--sheet]');
  process.exit(1);
}

fs.mkdirSync(outDir, {recursive: true});
console.log(`[audit_stills] Bundling ${entry} for ${compId} (${frames.length} frames)...`);
const serveUrl = await bundle({entryPoint: entry});
const composition = await selectComposition({serveUrl, id: compId, inputProps: {}});

const renderedFiles = [];
for (const frame of frames) {
  const output = path.join(outDir, `${compId}-${String(frame).padStart(5, '0')}.jpg`);
  const t0 = Date.now();
  await renderStill({
    composition,
    serveUrl,
    output,
    frame,
    imageFormat: 'jpeg',
    jpegQuality: 85,
    inputProps: composition.defaultProps,
  });
  renderedFiles.push(output);
  console.log(`  frame ${frame} -> ${output} (${Date.now() - t0}ms)`);
}

if (makeSheet && renderedFiles.length >= 4) {
  const cols = Math.min(4, renderedFiles.length);
  const rows = Math.floor(renderedFiles.length / cols);
  const used = renderedFiles.slice(0, rows * cols);
  const sheetOut = path.join(outDir, 'audit_sheet.jpg');
  const ffArgs = ['-y', '-v', 'error'];
  for (const f of used) ffArgs.push('-i', f);

  const rowExprs = [];
  for (let r = 0; r < rows; r++) {
    const inputs = Array.from({length: cols}, (_, c) => `[${r * cols + c}:v]`).join('');
    rowExprs.push(`${inputs}hstack=inputs=${cols}[r${r}]`);
  }
  const vInputs = Array.from({length: rows}, (_, r) => `[r${r}]`).join('');
  const filter =
    rows > 1
      ? `${rowExprs.join(';')};${vInputs}vstack=inputs=${rows},scale=2400:-1`
      : `${rowExprs[0]};[r0]scale=2400:-1`;

  ffArgs.push('-filter_complex', filter, '-q:v', '3', sheetOut);
  execFileSync('ffmpeg', ffArgs, {stdio: 'inherit'});
  console.log(`[audit_stills] Contact sheet (${cols}x${rows}) -> ${sheetOut}`);
}
