/**
 * Drawing kit for component illustrations. Used only by
 * `*.illustration.ts` files, the generator scripts and tests. It is not part
 * of the published package. See docs/file-type-guidelines/illustrations.md.
 */
export {
  defineIllustration,
  renderIllustration,
  measureIllustration,
  CANVAS,
} from "./render";
export type { IllustrationDefinition, Measurement } from "./render";
export type { Kit, Radius } from "./primitives";
export type { Fragment } from "./fragment";
export type { Path } from "./icons";
export { ALLOWED_PAINTS, ROLES } from "./roles";
export type { Role, FillRole } from "./roles";
