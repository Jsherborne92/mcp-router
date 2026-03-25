# mcp-router

Cloudflare Worker router for Saxon MCP services.

## Routes

The worker proxies requests to three upstream services:

| Route | Upstream |
| --- | --- |
| `/http/*` | `https://mcp-http-worker.james-sherborne.workers.dev` |
| `/dexxt*` | `https://dexxt-origin.saxon.xyz` |
| `/saxonbot*` | `https://saxonbot-origin.saxon.xyz` |

Additional rewrites are applied for the `/http` worker so RFC-compliant OAuth discovery requests sent to origin-level well-known paths continue to work behind the router:

- `/.well-known/oauth-protected-resource/http...`
- `/.well-known/oauth-authorization-server/http`

These requests are rewritten and proxied to the underlying `/http` worker metadata endpoints.

## Local development

```bash
npx wrangler dev
```

## Deploy

This repository now includes a minimal `wrangler.toml` so Wrangler deploys the worker entrypoint directly instead of trying to auto-detect a static site project.

```bash
npx wrangler deploy
```
