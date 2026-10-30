type RouteLike = { id: string; related: string[] };

/**
 * Manifest entries of the documents related to the document with `id`, in the
 * order of its `related` list. Ids without a manifest entry are skipped.
 */
export function getRelatedRoutes<T extends RouteLike>(
  routes: T[],
  id: string
): T[] {
  const entry = routes.find((route) => route.id === id);
  return (entry?.related ?? []).flatMap((relatedId) => {
    const route = routes.find((candidate) => candidate.id === relatedId);
    return route ? [route] : [];
  });
}
