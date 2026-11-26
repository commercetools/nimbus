/**
 * Related-document resolution for the route manifest.
 *
 * Authors list related documents by `id` in the front matter (`related`).
 * Links are two-way: a document also shows the documents that list it.
 */

type Relatable = {
  id: string;
  title: string;
  related: string[];
};

/**
 * Final related ids of every document: its own list in the written order,
 * then the documents that list it, sorted by title. Duplicates and the
 * document's own id are removed. Ids that match no document are ignored here;
 * `findUnknownRelatedIds` reports them.
 */
export function resolveRelated(routes: Relatable[]): Map<string, string[]> {
  const known = new Set(routes.map((route) => route.id));
  const result = new Map<string, string[]>();

  for (const route of routes) {
    const own = route.related.filter((id) => id !== route.id && known.has(id));
    const reverse = routes
      .filter(
        (other) =>
          other.id !== route.id &&
          other.related.includes(route.id) &&
          !own.includes(other.id)
      )
      .sort((a, b) => a.title.localeCompare(b.title))
      .map((other) => other.id);
    result.set(route.id, [...new Set([...own, ...reverse])]);
  }

  return result;
}

/** `related` ids that are not the id of any document. */
export function findUnknownRelatedIds<
  T extends { id: string; related: string[] },
>(docs: Array<{ file: string; meta: T }>): Array<{ file: string; id: string }> {
  const known = new Set(docs.map(({ meta }) => meta.id));
  return docs.flatMap(({ file, meta }) =>
    meta.related.filter((id) => !known.has(id)).map((id) => ({ file, id }))
  );
}
