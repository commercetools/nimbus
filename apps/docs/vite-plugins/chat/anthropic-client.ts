/**
 * The only file in this directory that imports @anthropic-ai/sdk's client.
 * Runs exclusively inside the Vite dev server's Node process
 * (vite-plugin-chat-api.ts, configureServer, apply: "serve") — never bundled
 * for the browser. Keeping the import isolated to this one file makes "the
 * SDK never reaches the client bundle" a one-line, grep-able invariant:
 * `grep -r "vite-plugins/chat" apps/docs/src` should only ever show
 * `import type` lines.
 */
import Anthropic from "@anthropic-ai/sdk";

let client: Anthropic | undefined;

/**
 * Zero-arg client — credentials resolve automatically in order:
 * ANTHROPIC_API_KEY -> ANTHROPIC_AUTH_TOKEN -> an `ant auth login` OAuth
 * profile (this is what lets a Claude subscription substitute for a separate
 * metered API key) -> Workload Identity Federation -> the default on-disk
 * profile. Never hardcode a key here.
 */
export function getAnthropicClient(): Anthropic {
  if (!client) {
    client = new Anthropic();
  }
  return client;
}

/** Model is a single named constant so swapping to claude-sonnet-5 or
 * claude-haiku-4-5 for latency is a one-line change later. */
export const CHAT_MODEL = "claude-opus-5";
