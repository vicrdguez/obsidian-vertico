import { build } from 'esbuild';
import { glob, mkdtemp, readdir, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';

const outdir = await mkdtemp(path.join(tmpdir(), 'vertico-tests-'));
try {
	const entryPoints = [];
	for await (const file of glob('tests/**/*.test.ts')) entryPoints.push(file);
	await build({ entryPoints, outdir, bundle: true, platform: 'node', format: 'esm', packages: 'external' });
	const tests = (await readdir(outdir)).map((file) => path.join(outdir, file));
	const result = spawnSync(process.execPath, ['--test', ...tests], { stdio: 'inherit' });
	process.exitCode = result.status ?? 1;
} finally {
	await rm(outdir, { recursive: true, force: true });
}
