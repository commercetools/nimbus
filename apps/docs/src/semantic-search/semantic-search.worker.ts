/// <reference lib="webworker" />
/**
 * Semantic search worker — a thin shell wiring the platform-neutral embedding
 * core and the IndexedDB cache adapter to the worker ⇄ main message protocol.
 *
 * All embedding/ranking logic lives in `semantic-search/embedding-core.ts`; all
 * persistence lives in `semantic-search/idb-cache.ts`. This file owns only the
 * message plumbing and progress reporting. Because the heavy
 * `@huggingface/transformers` import is reached only through the core (imported
 * here, inside the worker), Vite keeps it entirely out of the main bundle.
 */
import {
  buildCacheKey,
  buildEmbedText,
  embedTexts,
  embedTextsBatched,
  loadExtractor,
  rankBySimilarity,
} from "./embedding-core";
import { createIdbCache } from "./idb-cache";
import {
  EMBEDDING_DIMS,
  type EmbeddableDoc,
  type ReadyPayload,
  type WorkerRequest,
  type WorkerResponse,
} from "./semantic-search.types";

const ctx = self as unknown as DedicatedWorkerGlobalScope;
function post(message: WorkerResponse) {
  ctx.postMessage(message);
}

// Index state, populated by `init` and read by `embedQuery`.
let matrix: Float32Array | null = null;
let ids: string[] = [];

async function buildIndex(
  docs: EmbeddableDoc[],
  namespace?: string
): Promise<ReadyPayload> {
  // Created per-init so each corpus persists to its own namespaced database.
  const cache = createIdbCache(namespace);
  ids = docs.map((d) => d.id);
  const texts = docs.map(buildEmbedText);
  const cacheKey = buildCacheKey(texts);

  // Ensure the model is loaded (reporting download progress) before deciding on
  // a cache hit, so the UI always shows the download step on a cold start.
  await loadExtractor((percent) =>
    post({ type: "progress", phase: "download", percent })
  );

  const cached = await cache.read(cacheKey);
  if (
    cached &&
    cached.dims === EMBEDDING_DIMS &&
    cached.ids.length === ids.length
  ) {
    matrix = cached.matrix;
    ids = cached.ids;
    return { fromCache: true, count: ids.length };
  }

  post({ type: "progress", phase: "indexing" });
  // Batched so large corpora (the icon gallery, ~2,100 items) don't exhaust the
  // WASM heap by embedding everything in a single extractor call.
  matrix = await embedTextsBatched(texts);
  await cache.write({ key: cacheKey, dims: EMBEDDING_DIMS, ids, matrix });
  return { fromCache: false, count: ids.length };
}

async function queryIndex(query: string, topK: number): Promise<string[]> {
  if (!matrix || ids.length === 0) return [];
  const queryVec = await embedTexts([query]); // one normalized row
  return rankBySimilarity(matrix, ids, queryVec, topK);
}

ctx.onmessage = async (event: MessageEvent<WorkerRequest>) => {
  const message = event.data;
  try {
    if (message.type === "init") {
      post({
        type: "ready",
        payload: await buildIndex(message.docs, message.namespace),
      });
    } else if (message.type === "embedQuery") {
      const resultIds = await queryIndex(message.query, message.topK);
      post({ type: "results", requestId: message.requestId, ids: resultIds });
    }
  } catch (error) {
    post({
      type: "error",
      message: error instanceof Error ? error.message : String(error),
    });
  }
};
