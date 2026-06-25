import { atomWithStorage } from "jotai/utils";

/**
 * Atom to store whether the user has opted in to browser-based semantic search.
 *
 * When enabled, the Cmd+K search downloads a small embedding model
 * (`Xenova/paraphrase-MiniLM-L3-v2`) and indexes the documentation in the
 * browser, replacing the default Fuse.js fuzzy search. The preference is
 * persisted to localStorage so it survives reloads (the model weights and the
 * computed embeddings are cached, so re-enabling is near-instant).
 *
 * @type {boolean} - true if semantic search is enabled, false for Fuse.js.
 */
export const semanticEnabledAtom = atomWithStorage<boolean>(
  "semantic-search-enabled",
  false
);
