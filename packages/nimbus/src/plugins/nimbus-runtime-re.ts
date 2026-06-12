/**
 * Matches `@commercetools/nimbus` and any subpath EXCEPT `/plugins` and
 * `/plugins/*`, which must remain resolvable to avoid circular stubbing.
 */
export const NIMBUS_RUNTIME_RE =
  /^@commercetools\/nimbus(?:$|\/(?!plugins(?:\/|$)))/;
