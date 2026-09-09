# MCP Guide

## Render MCP / Codex plugin

Render's MCP server can be connected to Codex, but manually running:

```text
codex mcp add render --url https://mcp.render.com/mcp
```

may fail with a Dynamic Client Registration error. Prefer the official `renderinc/render-codex-plugin`, which supplies the pre-registered OAuth client configuration (`client_id: codex`) in its `.mcp.json`.

Use the plugin's documented install/activation flow rather than inventing a repository-local command:

1. Install or activate the official Render Codex plugin through the Codex plugin/marketplace mechanism available in the current Codex installation.
2. If the plugin is offered from a local marketplace checkout, install it from that local marketplace using the documented Codex UI/command for the installed version.
3. Restart Codex after activation so the `.mcp.json` MCP registration is loaded.
4. On first MCP use, complete the Render OAuth flow in the browser and grant only the required account/project access.
5. Confirm the connection with a read-only service or deployment inspection before taking action.

The plugin is useful for examples such as:

- listing/checking the API service and deployment status;
- inspecting recent deploys and build/runtime logs;
- reviewing configured environment-variable **names/status**;
- triggering a redeploy after a reviewed change.

Keep MCP actions narrow and read-only by default. Ask before redeploying, changing environment variables, scaling, deleting, or altering production resources. Never paste, store, or reproduce secret values in docs, source, issues, prompts, or logs. Do not treat MCP output as a substitute for inspecting the repository's live `render.yaml` and source.

## Project knowledge tools

This repository may also be used with Serena, CodeGraph, or Graphify/KB-style project knowledge tools. Use them when they are installed and available to answer architecture/file-relationship questions, navigate a large codebase, or preserve cross-session project context. Prefer verified tool help and the repository's own configuration/documentation; do not invent commands or assume a tool is available. Fall back to direct repository inspection (`find`, `rg`, and file reads) when availability or syntax is uncertain.

Knowledge tools are aids, not authority: validate important conclusions against current source, schema, seed files, deployment config, and git status.
