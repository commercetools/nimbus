/**
 * Pure types and constants shared across the semantic-search modules.
 *
 * This module intentionally imports nothing from `@huggingface/transformers`, so
 * it is safe to import from the main-thread hook without pulling the ML runtime
 * into the main bundle. Only `embedding-core.ts` (loaded inside the worker)
 * imports transformers.
 */

/**
 * The embedding model and quantization used by the worker.
 *
 * `all-MiniLM-L6-v2` is the field-default general-purpose sentence embedder. We
 * previously used the smaller `paraphrase-MiniLM-L3-v2` (3 layers), but a
 * labeled benchmark over this docs corpus showed L6 is clearly better at
 * ranking the concrete component above broad category/overview pages
 * (hit@1 95% vs 75%, MRR 0.97 vs 0.84) — see the PR description for the table.
 * The only cost is a larger one-time, cached download (~16.6 MB → ~21.9 MB).
 *
 * q8 is the smallest variant that ships for this model; both are 384-dim, so
 * the index/cache layout is unchanged.
 */
export const SEMANTIC_MODEL_ID = "Xenova/all-MiniLM-L6-v2";
export const SEMANTIC_MODEL_DTYPE = "q8";
/** MiniLM hidden size — the length of each embedding vector. */
export const EMBEDDING_DIMS = 384;

/**
 * The minimal document shape the embedder needs. `SearchableDocItem` is
 * structurally compatible, so the hook can pass search index entries directly.
 */
export type EmbeddableDoc = {
  id: string;
  title: string;
  description?: string;
  tags?: string[];
  content?: string;
};

/** A persisted embedding index: the matrix plus the ids aligned to its rows. */
export type EmbeddingRecord = {
  /** `${modelId}:${dtype}:${contentHash}` — invalidates when any input changes. */
  key: string;
  /** Embedding dimensionality (rows are `dims` floats wide). */
  dims: number;
  /** Document ids, aligned with the rows of `matrix`. */
  ids: string[];
  /** Row-major [ids.length x dims] L2-normalized embedding matrix. */
  matrix: Float32Array;
};

/**
 * Pluggable persistence for the embedding index. The browser provides an
 * IndexedDB-backed implementation; a future Node consumer (e.g. nimbus-mcp)
 * could provide a filesystem-backed one without touching the core.
 */
export interface CacheAdapter {
  read(key: string): Promise<EmbeddingRecord | undefined>;
  write(record: EmbeddingRecord): Promise<void>;
}

// --- worker ⇄ main message protocol -----------------------------------------

/** Messages sent from the main thread to the worker. */
export type WorkerRequest =
  | { type: "init"; docs: EmbeddableDoc[] }
  | { type: "embedQuery"; query: string; requestId: number; topK: number };

/** Lifecycle result reported once the index is ready. */
export type ReadyPayload = {
  /** True when embeddings were restored from cache rather than recomputed. */
  fromCache: boolean;
  /** Number of documents in the index. */
  count: number;
};

/** Messages sent from the worker back to the main thread. */
export type WorkerResponse =
  | {
      /** Model weights are downloading; `percent` is aggregated across files. */
      type: "progress";
      phase: "download";
      percent: number;
    }
  | {
      /** Embeddings are being computed for the documents (cache miss). */
      type: "progress";
      phase: "indexing";
    }
  | { type: "ready"; payload: ReadyPayload }
  | { type: "results"; requestId: number; ids: string[] }
  | { type: "error"; message: string };
