# CF-MCP

A dead simple and minimal solution to deploy remote serverless MCP servers on Cloudflare Workers.

## What is MCP?

The [Model Context Protocol (MCP)](https://modelcontextprotocol.io/) is an open standard that enables AI assistants to securely connect to data sources and tools. This library makes it easy to create MCP servers that run on Cloudflare's edge network.

## Features

- 🚀 **Serverless**: Deploy MCP servers on Cloudflare Workers
- ⚡ **Edge Computing**: Run your MCP server globally with low latency
- 🔧 **Type Safe**: Full TypeScript support with schema validation (Zod, Valibot, ArkType)
- 📦 **Simple API**: Minimal boilerplate to get started, tRPC-like developer experience
- 🛠️ **Tools Support**: Easy tool definition with input validation
- 💬 **Prompts Support**: Define reusable prompts for AI interactions
- 📚 **Resources Support**: Expose data resources to AI assistants

## Installation

```bash
npm install cf-mcp
```

## Quick Start

1. **Set up a new Cloudflare Worker**:

```bash
npm create cloudflare@latest my-mcp
```

2. **Create your MCP server**:

```typescript
// src/index.ts
import { z } from 'zod';
import { createMCP, tool } from 'cf-mcp';

const tools = {
	greet: tool('Greet someone with a personalized message')
		.input(
			z.object({
				name: z.string(),
				language: z.string().optional().default('en'),
			})
		)
		.handle(({ input }) => {
			const greetings = {
				en: `Hello, ${input.name}!`,
				es: `¡Hola, ${input.name}!`,
				fr: `Bonjour, ${input.name}!`,
			};
			return greetings[input.language] || greetings.en;
		}),
};

export default createMCP({
	name: 'my-mcp-server',
	version: '1.0.0',
	tools,
});
```

3. **Configure Wrangler** (`wrangler.jsonc`):

```json
{
	"name": "my-mcp-server",
	"main": "src/index.ts",
	"compatibility_date": "2025-08-26"
}
```

4. **Deploy to Cloudflare Workers**:

```bash
npm run deploy
```

## API Reference

### `createMCP(server)`

Creates an MCP server instance.

**Parameters:**

- `server.name` - Server name
- `server.version` - Server version
- `server.tools` - Object containing tool definitions
- `server.prompts` - Object containing prompt definitions (optional)
- `server.resources` - Object containing resource definitions (optional)

### `tool(description)`

Creates a new tool definition.

```typescript
const myTool = tool('Description of what this tool does')
	.input(schema)
	.handle(({ input, blob, error, sessionId }) => {
		// Tool implementation
		// blob is a function that helps you return a blob. It take a data and a mime type as arguments. Data can be a string, a buffer or a file.
		// error is a function that helps you return an error. It take an error type and a message as arguments.
		// sessionId is the session id of the current session.

		return result;
	});
```

### Schema Validation

CF-MCP supports multiple schema validation libraries:

- **Zod** - `z.object({ ... })`
- **Valibot** - `v.object({ ... })`
- **ArkType** - `type({ ... })`

## Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Run tests
npm test

# Deploy to Cloudflare Workers
npm run deploy


```

```jsonc
// mcp.json
{
	"mcpServers": {
		"<YOUR-MCP-SERVER-NAME>": {
			"command": "npx",
			"args": ["-y", "mcp-remote", "<YOUR-MCP-SERVER-URL>"]
		}
	}
}
```

## License

MIT © [beynar](https://github.com/beynar)

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
