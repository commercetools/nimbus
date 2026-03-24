import { atomWithStorage } from "jotai/utils";

/**
 * Atom to store the user's preferred default view for `jsx live-dev` code blocks.
 * "preview" shows the rendered component, "editor" shows the source code.
 */
export const defaultLiveDevViewAtom = atomWithStorage<"preview" | "editor">(
  "nimbus-docs-default-live-dev-view",
  "editor"
);
