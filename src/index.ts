import { z } from 'zod/v4';
import { createMCP, tool } from './lib';

const tools = {
	test: tool('call this tool to test and output the result')
		.input(
			z.object({
				test: z.string(),
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
