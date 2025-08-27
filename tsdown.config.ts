import { defineConfig } from 'tsdown';

export default defineConfig([
	{
		entry: ['./src/lib/index.ts'],
		platform: 'neutral',

		skipNodeModulesBundle: true,
		dts: true,
		bundle: true,
		// minify: true,
		external: ['cloudflare:workers'],
		sourcemap: true,
		format: ['esm', 'cjs'],
		treeshake: true,
		clean: true,
		unbundle: false,
	},
]);
