/**
 * Illustration SVGs use ids like `il-<name>-bg` for their gradient and shadow.
 * When the same illustration appears twice on one page, `url(#id)` points to
 * the first copy in the document. Giving each copy its own id prefix keeps
 * every copy self-contained.
 */
export const scopeIllustrationIds = (
  svg: string,
  name: string,
  instanceId: string
): string => {
  const safeInstance = instanceId.replace(/[^a-zA-Z0-9]/g, "");
  return svg.split(`il-${name}-`).join(`il-${name}-${safeInstance}-`);
};
