/**
 * Names of components whose illustration is not drawn yet. The set can only
 * shrink: a name here that already has an illustration fails the test, and a
 * new component is never listed, so it needs an illustration from day one.
 */
export const PENDING: ReadonlySet<string> = new Set([
  "accordion",
  "breadcrumbs",
  "confirmation-dialog",
  "date-range-picker-field",
  "form-action-bar",
  "form-dialog",
  "info-dialog",
  "link",
  "menu",
  "money-input-field",
  "multiline-text-input-field",
  "number-input-field",
  "pagination",
  "password-input-field",
  "public-page-layout",
  "search-input-field",
  "steps",
  "tab-nav",
  "tabs",
  "text-input-field",
  "toolbar",
  "tree",
]);
