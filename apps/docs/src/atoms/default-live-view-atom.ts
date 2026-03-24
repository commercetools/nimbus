import { atomWithStorage } from "jotai/utils";

/**
 * Atom to store the user's preferred default view for `jsx live` code blocks.
 * "preview" shows the rendered component, "editor" shows the source code.
 */
export const defaultLiveViewAtom = atomWithStorage<"preview" | "editor">(
  "nimbus-docs-default-live-view",
  "preview"
);
