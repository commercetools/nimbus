# FEC-415: MCP Docs — Overview + Setup Pages

## Branch

`FEC-415-mcp-docs-overview-setup`

## Scope

Create two MDX documentation pages under `packages/nimbus/src/docs/`:

1. `mcp-server-overview.mdx` — What the MCP server is, what it enables,
   supported AI assistants, link to MCP protocol spec
2. `mcp-server-setup.mdx` — Installation (monorepo vs npm), configuration for
   Claude Code / VS Code / Cursor / Windsurf, verification with first query

## Frontmatter Convention

```yaml
id: unique-id
title: Page Title
description: Short description
order: N
menu:
  - Home
  - Developer Tools
  - MCP Server
  - Page Name
tags:
  - relevant-tags
icon: IconName
```

## Tasks

### Task 1: Create `mcp-server-overview.mdx`

- Frontmatter: menu `[Home, Developer Tools, MCP Server, Overview]`, order 1
- Content: What the MCP server is, what MCP protocol is, what it enables (AI
  assistants can query component docs, tokens, icons), supported tools
  (list_components, get_component, get_tokens, search_docs, search_icons),
  supported assistants (Claude Code, Claude Desktop, VS Code Copilot, Cursor,
  Windsurf)
- Commit: `docs(mcp): add MCP server overview page`

### Task 2: Create `mcp-server-setup.mdx`

- Frontmatter: menu `[Home, Developer Tools, MCP Server, Setup]`, order 2
- Content: Installation options (npx for quick start, monorepo for
  contributors), configuration for each AI assistant (Claude Code, Claude
  Desktop, VS Code, Cursor, Windsurf), verification with a first query
- Commit: `docs(mcp): add MCP server setup page`

## Acceptance Criteria

- Pages render correctly in the docs site
- Navigation appears under Home → Developer Tools → MCP Server
