import { atomWithStorage } from "jotai/utils";

/**
 * Atom to store the label of the tab that the user chose in a code tab group
 * (a run of code blocks written with `tab="Label"`, for example "pnpm").
 *
 * Every code tab group on the page reads this label. A group that has a tab
 * with this label shows it, so one choice switches all groups. A group
 * without such a tab shows its first tab. The choice is saved in
 * localStorage and kept when the user opens another page.
 *
 * @type {string | null} - The chosen label, or null when nothing was chosen.
 */
export const codeTabsLabelAtom = atomWithStorage<string | null>(
  "nimbus-docs-code-tabs-label",
  null
);
