import type { ReactNode } from "react";

/**
 * Whether `node` renders anything: `undefined`, `null`, booleans and the empty
 * string render nothing, so a part for them would be empty.
 */
export const hasContent = (node: ReactNode): boolean =>
  node !== undefined &&
  node !== null &&
  typeof node !== "boolean" &&
  node !== "";
