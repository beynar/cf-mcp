import { defineConfig } from 'tsdown';

export default defineConfig([
	{
		entry: ['./src/lib/index.ts'],
		platform: 'node',

		skipNodeModulesBundle: true,
		dts: true,
		bundle: true,
		// minify: true,
		external: ['cloudflare:workers'],
		sourcemap: true,
		format: ['esm'],
		treeshake: true,
		clean: true,
		unbundle: false,
	},
]);
