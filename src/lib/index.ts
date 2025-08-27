import { MCPError } from './mcp/errors';
import { mcpError } from './mcp/errors';
import { isBatch, MCPHandler, RPCRequest } from './mcp';
import { definePrompts } from './prompts';
import { defineResources } from './resources';
import { defineTools } from './tools';
import { MCPServer } from './types';
export { tool, defineTools } from './tools';
export { prompt, definePrompts } from './prompts';
export { resource, defineResources } from './resources';
export * from './mcp/spec';

export const createMCP = (server: MCPServer) => {
	return {
		fetch: async (request: Request, env?: any) => {
			if (request.method !== 'GET' && request.method !== 'POST') {
				return new Response('Method not allowed', { status: 405 });
			}
			if (request.method === 'GET') {
				return new Response('Method not allowed', { status: 405 });
			}

			const sessionId = request.headers.get('Mcp-Session-Id') || crypto.randomUUID();
			let body: RPCRequest | RPCRequest[];

			try {
				body = (await request.json()) as RPCRequest | RPCRequest[];
			} catch {
				const error = mcpError('PARSE_ERROR');
				return new Response(
					JSON.stringify({
						jsonrpc: '2.0',
						id: null,
						error: {
							code: error['~code'],
							message: error['~message'],
							data: error['~data'],
						},
					}),
					{ headers: { 'Content-Type': 'application/json', 'Mcp-Session-Id': sessionId }, status: 400 }
				);
			}
			const isBatchRequest = isBatch(body);
			let requests = (isBatchRequest ? body : [body]) as RPCRequest[];

			const handler = new MCPHandler(server, sessionId);
			const results = await Promise.all(
				requests.map(async (request) => {
					const { method, params, id } = request;

					let handlerMethod = handler.mpcHandler as any;
					for (const key of method.split('/')) {
						if (key in handlerMethod) {
							handlerMethod = handlerMethod[key];
						} else {
							const error = mcpError('METHOD_NOT_FOUND');
							return {
								jsonrpc: '2.0',
								id,
								error: {
									code: error['~code'],
									message: error['~message'],
									data: error['~data'],
								},
							};
						}
					}

					try {
						const result = await handlerMethod(params, env);

						if (result instanceof MCPError) {
							return {
								jsonrpc: '2.0',
								id,
								error: {
									code: result['~code'],
									message: result['~message'],
									data: result['~data'],
								},
							};
						} else {
							return {
								jsonrpc: '2.0',
								id,
								result,
							};
						}
					} catch (error) {
						return {
							jsonrpc: '2.0',
							id,
							error: {
								code: -32603,
								message: 'Internal server error',
								data: null,
							},
						};
					}
				})
			);

			return new Response(JSON.stringify(isBatchRequest ? results : results[0]), {
				headers: {
					'Content-Type': 'application/json',
					'Mcp-Session-Id': sessionId,
				},
			});
		},
		define: () => {
			console.log(defineTools(server.tools!, true));
			return {
				tools: server.tools ? defineTools(server.tools, true) : [],
				prompts: server.prompts ? definePrompts(server.prompts) : [],
				resources: server.resources ? defineResources(server.resources) : [],
			};
		},
	};
};
