/**
 * Platform-neutral semantic-search core.
 *
 * This is the ONLY module that imports `@huggingface/transformers`. It has no
 * DOM, IndexedDB, React, or Web Worker coupling, so it runs unchanged in a
 * browser worker today and could be lifted into a shared package (consumed by a
 * Node process such as nimbus-mcp) tomorrow — the only environment-specific
 * piece is the injected `CacheAdapter`.
 */
import {
  pipeline,
  env,
  type FeatureExtractionPipeline,
  type ProgressInfo,
} from "@huggingface/transformers";
import {
  EMBEDDING_DIMS,
  SEMANTIC_MODEL_DTYPE,
  SEMANTIC_MODEL_ID,
  type EmbeddableDoc,
} from "../semantic-search.types";

// Always load the model from the HF hub (cached by the browser Cache API on
// first download), never from the app's own origin.
env.allowLocalModels = false;
env.useBrowserCache = true;

/**
 * How many characters of doc `content` to include in the embed text. Embedding
 * cost grows with sequence length, so capping this keeps cold-index time low.
 * Set to 0 to embed title + description + tags only.
 */
const CONTENT_EMBED_CHARS = 0;

/** Called with an aggregated 0–100 download percentage while weights load. */
export type DownloadProgressCallback = (percent: number) => void;

let extractorPromise: Promise<FeatureExtractionPipeline> | null = null;

/**
 * Lazily load (once) the feature-extraction pipeline. Subsequent calls return
 * the same promise; `onProgress` is only meaningful on the first call.
 */
export function loadExtractor(
  onProgress?: DownloadProgressCallback
): Promise<FeatureExtractionPipeline> {
  if (extractorPromise) return extractorPromise;

  // The progress_callback fires once per file (config, tokenizer, weights, …),
  // so aggregate loaded/total across files into a single percentage.
  const fileProgress = new Map<string, { loaded: number; total: number }>();
  const handleProgress = (info: ProgressInfo) => {
    if (info.status !== "progress" || !onProgress) return;
    fileProgress.set(info.file, { loaded: info.loaded, total: info.total });
    let loaded = 0;
    let total = 0;
    for (const f of fileProgress.values()) {
      loaded += f.loaded;
      total += f.total;
    }
    onProgress(total > 0 ? Math.min(100, (loaded / total) * 100) : 0);
  };

  // `pipeline`'s generic overload resolves to the full `AllTasks` union, which
  // TS reports as "too complex to represent" (TS2590). We only ever use the
  // feature-extraction task, so narrow the signature to bypass that union.
  const createPipeline = pipeline as (
    task: "feature-extraction",
    model: string,
    options: {
      dtype: typeof SEMANTIC_MODEL_DTYPE;
      progress_callback: (info: ProgressInfo) => void;
    }
  ) => Promise<FeatureExtractionPipeline>;

  extractorPromise = createPipeline("feature-extraction", SEMANTIC_MODEL_ID, {
    dtype: SEMANTIC_MODEL_DTYPE,
    progress_callback: handleProgress,
  });
  return extractorPromise;
}

/**
 * Embed one or more texts into L2-normalized mean-pooled vectors. Returns the
 * flat row-major matrix (`texts.length * EMBEDDING_DIMS` floats).
 */
export async function embedTexts(texts: string[]): Promise<Float32Array> {
  const extractor = await loadExtractor();
  const output = await extractor(texts, { pooling: "mean", normalize: true });
  return output.data as Float32Array;
}

/**
 * Build the text embedded for a document. Must stay identical between
 * index-time and cache-key computation, or the cache will never hit.
 */
export function buildEmbedText(doc: EmbeddableDoc): string {
  const tags = doc.tags?.join(" ") ?? "";
  // Cap content: embedding cost scales with sequence length, and title +
  // description + tags carry most of the signal. A short content slice keeps
  // cold-index time low while still capturing the doc's gist.
  const content = (doc.content ?? "").slice(0, CONTENT_EMBED_CHARS);
  return `${doc.title} ${doc.description ?? ""} ${tags} ${content}`;
}

/** Cheap, dependency-free, deterministic string hash (FNV-1a, 32-bit). */
export function hashTexts(texts: string[]): string {
  let h = 0x811c9dc5;
  for (const text of texts) {
    for (let i = 0; i < text.length; i++) {
      h ^= text.charCodeAt(i);
      h = Math.imul(h, 0x01000193);
    }
    h ^= 0x0a; // record separator so reordering changes the hash
    h = Math.imul(h, 0x01000193);
  }
  return (h >>> 0).toString(16);
}

/** The cache key for a set of embed texts (also pins model id + dtype). */
export function buildCacheKey(texts: string[]): string {
  return `${SEMANTIC_MODEL_ID}:${SEMANTIC_MODEL_DTYPE}:${hashTexts(texts)}`;
}

/**
 * Cosine-similarity score below which a result is dropped rather than padding
 * the list. Empirically, out-of-domain queries (weather, recipes, gibberish)
 * peak around ~0.33 — the noise ceiling — while genuine matches run higher (#1
 * hits 0.55–0.86; real secondary hits like a related component or category page
 * ~0.40+). 0.2 is a conservative floor: it sits below the noise ceiling, so it
 * only trims the very bottom of the distribution and keeps weaker/borderline
 * matches, favoring recall. Raise toward 0.35–0.40 to sit above the noise
 * ceiling for a stricter, precision-first cut.
 */
export const MIN_RELEVANCE_SCORE = 0.2;

/**
 * Rank documents by cosine similarity to a query vector. Embeddings are
 * L2-normalized, so cosine similarity reduces to a dot product. Returns the
 * top-K document ids in descending similarity order, dropping any whose score
 * is below `minScore` (results indistinguishable from an unrelated query).
 */
export function rankBySimilarity(
  matrix: Float32Array,
  ids: string[],
  queryVec: Float32Array,
  topK: number,
  minScore: number = MIN_RELEVANCE_SCORE
): string[] {
  if (ids.length === 0) return [];

  const scores: Array<{ index: number; score: number }> = [];
  for (let row = 0; row < ids.length; row++) {
    const base = row * EMBEDDING_DIMS;
    let dot = 0;
    for (let d = 0; d < EMBEDDING_DIMS; d++) {
      dot += queryVec[d] * matrix[base + d];
    }
    scores.push({ index: row, score: dot });
  }

  scores.sort((a, b) => b.score - a.score);
  return scores
    .filter((s) => s.score >= minScore)
    .slice(0, topK)
    .map((s) => ids[s.index]);
}
