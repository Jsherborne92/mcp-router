const DEXXT_ORIGIN = "https://dexxt-origin.saxon.xyz";
const SAXONBOT_ORIGIN = "https://saxonbot-origin.saxon.xyz";
const HTTP_MCP_ORIGIN = "https://mcp-http-worker.james-sherborne.workers.dev";

function matches(pathname, prefix) {
  return pathname === prefix || pathname.startsWith(`${prefix}/`);
}

function stripPrefix(pathname, prefix) {
  return pathname.replace(new RegExp(`^${prefix}`), "") || "/";
}

function proxy(request, origin, pathname, search) {
  const upstream = new URL(pathname, origin);
  upstream.search = search;
  return fetch(new Request(upstream, request));
}

export default {
  async fetch(request) {
    const url = new URL(request.url);

    if (matches(url.pathname, "/http")) {
      return proxy(
        request,
        HTTP_MCP_ORIGIN,
        stripPrefix(url.pathname, "/http"),
        url.search
      );
    }

    if (url.pathname === "/dexxt" || url.pathname === "/dexxt/") {
      const upstream = new URL("/sse", DEXXT_ORIGIN);
      upstream.search = url.search;
      return fetch(new Request(upstream, request));
    }

    if (url.pathname === "/dexxt/sse" || url.pathname === "/dexxt/sse/") {
      const upstream = new URL("/sse", DEXXT_ORIGIN);
      upstream.search = url.search;
      return fetch(new Request(upstream, request));
    }

    if (matches(url.pathname, "/dexxt/messages")) {
      const rewritten = url.pathname.replace(/^\/dexxt/, "");
      const upstream = new URL(rewritten, DEXXT_ORIGIN);
      upstream.search = url.search;
      return fetch(new Request(upstream, request));
    }

    if (matches(url.pathname, "/dexxt")) {
      const rewritten = url.pathname.replace(/^\/dexxt/, "") || "/";
      const upstream = new URL(rewritten, DEXXT_ORIGIN);
      upstream.search = url.search;
      return fetch(new Request(upstream, request));
    }

    if (url.pathname === "/saxonbot" || url.pathname === "/saxonbot/") {
      const upstream = new URL("/sse", SAXONBOT_ORIGIN);
      upstream.search = url.search;
      return fetch(new Request(upstream, request));
    }

    if (url.pathname === "/saxonbot/sse" || url.pathname === "/saxonbot/sse/") {
      const upstream = new URL("/sse", SAXONBOT_ORIGIN);
      upstream.search = url.search;
      return fetch(new Request(upstream, request));
    }

    if (matches(url.pathname, "/saxonbot/messages")) {
      const rewritten = url.pathname.replace(/^\/saxonbot/, "");
      const upstream = new URL(rewritten, SAXONBOT_ORIGIN);
      upstream.search = url.search;
      return fetch(new Request(upstream, request));
    }

    if (matches(url.pathname, "/messages")) {
      const upstream = new URL(url.pathname, SAXONBOT_ORIGIN);
      upstream.search = url.search;
      return fetch(new Request(upstream, request));
    }

    if (matches(url.pathname, "/saxonbot")) {
      const rewritten = url.pathname.replace(/^\/saxonbot/, "") || "/";
      const upstream = new URL(rewritten, SAXONBOT_ORIGIN);
      upstream.search = url.search;
      return fetch(new Request(upstream, request));
    }

    return new Response("Not Found", { status: 404 });
  },
};
