/**
 * Vite Plugin: Mock chat API
 *
 * Registers a dev-only POST /api/chat endpoint that proxies the docs site's
 * floating chat widget to a real Claude call, mocking the "chat agent answers
 * with a resolvable chart payload" half of a future product feature (see
 * apps/docs/src/components/chat-widget/). `apply: "serve"` (mirroring
 * vite-plugin-mdx-hmr.ts) means `configureServer` never runs during
 * `vite build` — this endpoint, and the @anthropic-ai/sdk import chain behind
 * it, structurally cannot end up in the production docs bundle.
 */
import type { Plugin } from "vite";
import { handleChatRequest } from "./handle-chat-request";

export function chatApiPlugin(): Plugin {
  return {
    name: "vite-plugin-chat-api",

    // Enable in dev mode only.
    apply: "serve",

    configureServer(server) {
      server.middlewares.use("/api/chat", (req, res, next) => {
        if (req.method !== "POST") {
          next();
          return;
        }
        handleChatRequest(req, res).catch((err) => {
          console.error("[chat-api] handler threw", err);
          res.statusCode = 500;
          res.setHeader("Content-Type", "application/json");
          res.end(JSON.stringify({ error: "Unexpected server error." }));
        });
      });
    },
  };
}
