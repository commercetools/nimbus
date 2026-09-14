/**
 * Wire contract between the docs SPA's chat widget and the dev-only /api/chat
 * endpoint (see vite-plugin-chat-api.ts). Type-only — nothing here is runtime
 * code, so a client-side `import type` of this file is erased at build time
 * and never pulls the Anthropic-SDK-touching code into the browser bundle.
 *
 * The Messages API is stateless, so the browser resends the full transcript on
 * every call. Assistant history entries replay only the previous turn's
 * `reply` text (never the structured chart JSON) — see handle-chat-request.ts
 * for why.
 */

export interface ChatWireMessage {
  role: "user" | "assistant";
  text: string;
}

export interface ChatApiRequest {
  messages: ChatWireMessage[];
}

/**
 * A curated subset of nimbus-viz's Intent × DataKind space (see
 * packages/nimbus-viz/src/selection/types.ts and
 * packages/nimbus-viz/src/selection/derive-facts.ts), chosen because each
 * kind is structurally unambiguous under `detectKind`'s order-sensitive
 * sniffing. Field names intentionally match nimbus-viz's own concrete types
 * (packages/nimbus-viz/src/chart/types.ts) so the client-side mapping to a
 * `ResolveRequest` is close to identity.
 */
export type ChatChartPayload =
  | {
      kind: "scalar";
      intent: "VALUE";
      data: number;
      options?: { target?: number };
    }
  | {
      kind: "series";
      intent: "TREND" | "COMP-TIME";
      data: Array<{
        id: string;
        label: string;
        data: Array<{ x: string; y: number | null }>;
      }>;
    }
  | {
      kind: "category";
      intent: "RANK" | "COMPARE" | "PART-WHOLE" | "DIST";
      data: Array<{ category: string; value: number }>;
      options?: { target?: number };
    }
  | {
      kind: "funnel";
      intent: "FLOW";
      data: Array<{ stage: string; value: number }>;
    }
  | {
      kind: "scatter";
      intent: "REL";
      data: Array<{ x: number; y: number; label?: string; group?: string }>;
    };

export interface ChatApiResponse {
  reply: string;
  chart: ChatChartPayload | null;
}

export interface ChatApiError {
  error: string;
}
