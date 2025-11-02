#!/usr/bin/env node

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import * as fs from "fs";

// Search function implementation
function searchFile(filename: string, keyword: string) {
  try {
    if (!fs.existsSync(filename)) {
      return {
        error: `File not found: ${filename}`,
        matches: [],
        count: 0,
      };
    }

    const content = fs.readFileSync(filename, "utf-8");
    const lines = content.split("\n");

    const matches: Array<{ lineNumber: number; content: string }> = [];
    
    lines.forEach((line, index) => {
      if (line.toLowerCase().includes(keyword.toLowerCase())) {
        matches.push({
          lineNumber: index + 1,
          content: line.trim(),
        });
      }
    });

    return {
      filename,
      keyword,
      matches,
      count: matches.length,
      message: `Found ${matches.length} matching line(s) in ${filename}`,
    };
  } catch (error: any) {
    return {
      error: `Error reading file: ${error.message}`,
      matches: [],
      count: 0,
    };
  }
}

// Create MCP server instance
const server = new Server(
  {
    name: "ressl-file-search-server",
    version: "1.0.0",
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

// Register tool handlers
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: "search_file",
        description:
          "Search for a keyword in a file and return all matching lines with line numbers. Performs case-insensitive search.",
        inputSchema: {
          type: "object",
          properties: {
            filename: {
              type: "string",
              description: "Path to the file to search (e.g., 'sample.txt')",
            },
            keyword: {
              type: "string",
              description: "Keyword to search for in the file (case-insensitive)",
            },
          },
          required: ["filename", "keyword"],
        },
      },
    ],
  };
});

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  if (request.params.name === "search_file") {
    const filename = String(request.params.arguments?.filename);
    const keyword = String(request.params.arguments?.keyword);

    if (!filename || !keyword) {
      return {
        content: [
          {
            type: "text",
            text: JSON.stringify({
              error: "Both filename and keyword are required",
            }),
          },
        ],
      };
    }

    const result = searchFile(filename, keyword);

    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(result, null, 2),
        },
      ],
    };
  }

  return {
    content: [
      {
        type: "text",
        text: JSON.stringify({ error: `Unknown tool: ${request.params.name}` }),
      },
    ],
  };
});

// Start the server
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  
  // Log to stderr so it doesn't interfere with MCP protocol on stdout
  console.error("Ressl File Search MCP Server running on stdio");
}

main().catch((error) => {
  console.error("Fatal error in main():", error);
  process.exit(1);
});
