import { useEffect, useMemo, useRef, useState } from "react";
import type { SearchableDocItem } from "@/atoms/searchable-docs";
import type {
  EmbeddableDoc,
  WorkerRequest,
  WorkerResponse,
} from "./semantic-search.types";

/** Lifecycle of the in-browser semantic index. */
export type SemanticStatus =
  | "idle" // not enabled yet
  | "loading-model" // downloading model weights
  | "indexing" // computing document embeddings (cache miss)
  | "ready" // index built, queries can run
  | "error"; // load/index failed — caller should fall back to Fuse

export type SemanticSearchState<T = SearchableDocItem> = {
  status: SemanticStatus;
  /** 0–100 while `status === "loading-model"`. */
  downloadPercent: number;
  /** Number of indexed documents (known once ready). */
  docCount: number;
  /** Top-K results for the most recent query, in similarity order. */
  results: T[];
};

/**
 * How many results to request from the worker per query. Kept generous (the
 * corpus is small and ranking is a cheap dot product) so that splitting results
 * across category tabs still leaves each category with enough representation —
 * a low cap would starve and hide otherwise-relevant tabs.
 */
const TOP_K = 500;

/**
 * Owns the semantic-search Web Worker lifecycle. The worker (and the heavy ML
 * runtime it imports) is created lazily the first time `enabled` is true, so the
 * default Fuse path never pays for it. Results are stale-while-loading: the
 * previous results stay visible until the worker replies to a newer query.
 *
 * Generic over the doc type: any corpus whose items satisfy `EmbeddableDoc`
 * (id + title + optional description/tags/content) can be indexed, and results
 * are re-hydrated back to that same type. The docs search index passes
 * `SearchableDocItem`; the icon gallery passes its own lean icon-doc shape.
 *
 * @param enabled        - Whether semantic search is active.
 * @param docs           - The documents to index.
 * @param query          - The (debounced) query to run once ready; "" clears results.
 * @param cacheNamespace - Optional IndexedDB namespace isolating this corpus's
 *   persisted index from other corpora (see `createIdbCache`). Omit for the
 *   default docs index.
 */
export function useSemanticSearch<T extends EmbeddableDoc>(
  enabled: boolean,
  docs: T[],
  query: string,
  cacheNamespace?: string
): SemanticSearchState<T> {
  const workerRef = useRef<Worker | null>(null);
  const latestRequestId = useRef(0);

  const [status, setStatus] = useState<SemanticStatus>("idle");
  const [downloadPercent, setDownloadPercent] = useState(0);
  const [docCount, setDocCount] = useState(0);
  const [results, setResults] = useState<T[]>([]);

  const docsById = useMemo(
    () => new Map(docs.map((doc) => [doc.id, doc])),
    [docs]
  );

  // Create the worker (once) on first enable and build the index. We keep the
  // worker alive for the component's lifetime so toggling off then on is cheap.
  useEffect(() => {
    if (!enabled || workerRef.current || docs.length === 0) return;

    const worker = new Worker(
      new URL("./semantic-search.worker.ts", import.meta.url),
      { type: "module" }
    );
    workerRef.current = worker;
    setStatus("loading-model");
    setDownloadPercent(0);

    worker.onmessage = (event: MessageEvent<WorkerResponse>) => {
      const message = event.data;
      switch (message.type) {
        case "progress":
          if (message.phase === "download") {
            setStatus("loading-model");
            setDownloadPercent(message.percent);
          } else {
            setStatus("indexing");
          }
          break;
        case "ready":
          setDocCount(message.payload.count);
          setStatus("ready");
          break;
        case "results":
          // Ignore replies to superseded queries (stale-while-loading).
          if (message.requestId !== latestRequestId.current) return;
          setResults(
            message.ids
              .map((id) => docsById.get(id))
              .filter((doc): doc is T => doc !== undefined)
          );
          break;
        case "error":
          setStatus("error");
          break;
      }
    };
    worker.onerror = () => setStatus("error");

    const init: WorkerRequest = {
      type: "init",
      docs,
      namespace: cacheNamespace,
    };
    worker.postMessage(init);

    return () => {
      worker.terminate();
      workerRef.current = null;
    };
    // docsById is derived from docs; re-running on docs identity is sufficient.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enabled, docs]);

  // Run the (debounced) query once the index is ready.
  useEffect(() => {
    if (!enabled || status !== "ready") return;
    const worker = workerRef.current;
    if (!worker) return;

    if (!query.trim()) {
      latestRequestId.current += 1; // invalidate any in-flight reply
      setResults([]);
      return;
    }

    const requestId = (latestRequestId.current += 1);
    const request: WorkerRequest = {
      type: "embedQuery",
      query,
      requestId,
      topK: TOP_K,
    };
    worker.postMessage(request);
  }, [enabled, status, query]);

  return { status, downloadPercent, docCount, results };
}
