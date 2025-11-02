# Ressl MCP - File Search Server

## 🚀 Quick Start

### 1. Install Dependencies

```bash
bun install
```

### 2. Commands
Run this single command to install the MCP Inspector package and immediately start the server with Bun

```bash
npx @modelcontextprotocol/inspector bun run mcp-server.ts
```

This will:
1. Start the MCP server
2. Open MCP Inspector in your browser locally
3. In the MCP Inspector UI:
   - Fill in the parameters:
     - `filename`: `sample.txt`(You can change the file-content according to the need.)
     - `keyword`: `virat` (Can change the keyword accordingly)
   - Click "Run Tool"
   - View the results showing all matching lines

## 🛠️ Technical Details

- **Runtime**: Bun
- **Language**: TypeScript

## 🎯 Features

- ✅ Case-insensitive search
- ✅ Returns line numbers with matching content
- ✅ Proper error handling and reporting
