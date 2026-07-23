/**
 * IndexedDB-backed {@link CacheAdapter} for persisting the embedding index
 * across page reloads. Browser-only; imports nothing from the embedding core
 * (and therefore nothing from `@huggingface/transformers`).
 *
 * Structured clone handles `Float32Array` and `string[]` natively, so the whole
 * record round-trips without serialization. Only the current index is kept —
 * each write clears stale records first.
 *
 * Each corpus gets its OWN database, keyed by `namespace`, so independent
 * indices — the docs search index and the icon gallery, say — coexist instead
 * of evicting one another through the single-slot `clear()`-on-write. Omitting
 * the namespace keeps the original database name, so a previously cached index
 * stays valid.
 */
import type { CacheAdapter, EmbeddingRecord } from "./semantic-search.types";

const DB_NAME = "nimbus-semantic-search";
const DB_VERSION = 1;
const STORE = "embeddings";

function openDb(dbName: string): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(dbName, DB_VERSION);
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
 *
 * @param namespace - Optional suffix isolating this corpus's index in its own
 *   database. Omit for the default (docs) index to preserve the original DB name.
 */
export function createIdbCache(namespace?: string): CacheAdapter {
  const dbName = namespace ? `${DB_NAME}:${namespace}` : DB_NAME;
  return {
    async read(key) {
      try {
        const db = await openDb(dbName);
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
        const db = await openDb(dbName);
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
