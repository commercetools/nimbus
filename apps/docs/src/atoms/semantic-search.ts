import { atomWithStorage } from "jotai/utils";

/**
 * Atom to store whether the user has opted in to browser-based semantic search.
 *
 * When enabled, the Cmd+K search downloads a small embedding model
 * (`Xenova/all-MiniLM-L6-v2`) and indexes the documentation in the
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

/**
 * Atom tracking whether the "semantic search ready" toast has already been
 * shown to this user.
 *
 * The toast confirms — once — that the in-browser index has finished
 * downloading/indexing and concept-based results are live. Persisted to
 * localStorage so the confirmation fires at most once per browser, not once per
 * page load: after the first time the user knows the feature exists and
 * re-announcing it on every reload would be noise.
 *
 * @type {boolean} - true once the ready toast has been shown.
 */
export const semanticReadyNotifiedAtom = atomWithStorage<boolean>(
  "semantic-search-ready-notified",
  false
);
