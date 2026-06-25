/**
 * IndexedDB-backed {@link CacheAdapter} for persisting the embedding index
 * across page reloads. Browser-only; imports nothing from the embedding core
 * (and therefore nothing from `@huggingface/transformers`).
 *
 * Structured clone handles `Float32Array` and `string[]` natively, so the whole
 * record round-trips without serialization. Only the current index is kept —
 * each write clears stale records first.
 */
import type { CacheAdapter, EmbeddingRecord } from "../semantic-search.types";

const DB_NAME = "nimbus-semantic-search";
const DB_VERSION = 1;
const STORE = "embeddings";

function openDb(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, DB_VERSION);
    req.onupgradeneeded = () => {
      req.result.createObjectStore(STORE, { keyPath: "key" });
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

/**
 * Create the IndexedDB cache adapter. All operations are best-effort: any
 * failure (private mode, quota, blocked upgrade) resolves to a cache miss so the
 * caller simply recomputes embeddings rather than erroring.
 */
export function createIdbCache(): CacheAdapter {
  return {
    async read(key) {
      try {
        const db = await openDb();
        return await new Promise<EmbeddingRecord | undefined>(
          (resolve, reject) => {
            const tx = db.transaction(STORE, "readonly");
            const req = tx.objectStore(STORE).get(key);
            req.onsuccess = () =>
              resolve(req.result as EmbeddingRecord | undefined);
            req.onerror = () => reject(req.error);
          }
        );
      } catch {
        return undefined;
      }
    },

    async write(record) {
      try {
        const db = await openDb();
        await new Promise<void>((resolve, reject) => {
          const tx = db.transaction(STORE, "readwrite");
          const store = tx.objectStore(STORE);
          store.clear(); // keep only the current index
          store.put(record);
          tx.oncomplete = () => resolve();
          tx.onerror = () => reject(tx.error);
        });
      } catch {
        // ignore — failing to persist just means we re-index next session
      }
    },
  };
}
