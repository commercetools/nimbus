import { createContext } from "react";

/**
 * The label of the active view tab (for example "Overview"). The `h2` tag uses
 * it to find the first heading that only repeats the tab label. It is
 * `undefined` for pages without view tabs.
 */
export const ViewLabelContext = createContext<string | undefined>(undefined);
