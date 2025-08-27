/**
 * Welcome to Cloudflare Workers! This is your first worker.
 *
 * - Run `npm run dev` in your terminal to start a development server
 * - Open a browser tab at http://localhost:8787/ to see your worker in action
 * - Run `npm run deploy` to publish your worker
 *
 * Bind resources to your worker in `wrangler.jsonc`. After adding bindings, a type definition for the
 * `Env` object can be regenerated with `npm run cf-typegen`.
 *
 * Learn more at https://developers.cloudflare.com/workers/
 */

import { z } from 'zod/v4';
import { createMCP, tool } from './lib';

const tools = {
	test: tool('call this tool to test and output the result')
		.input(
			z.object({
				test: z.string(),
			})
		)
		.output(
			z.object({
				result: z.string(),
			})
		)
		.handle(({ input }) => {
			return `ok ${input.test}`;
		}),
};
export default createMCP({
	name: 'test',
	version: '1.0.0',
	tools,
});
