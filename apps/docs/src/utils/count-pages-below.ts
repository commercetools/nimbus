/**
 * Number of documents below a document in the menu, for example the component
 * pages below "Components". 0 for a document without pages below it.
 */
export const countPagesBelow = (
  routes: ReadonlyArray<{ menu: string[] }>,
  doc: { menu: string[] }
): number =>
  routes.filter(
    (route) =>
      route.menu.length > doc.menu.length &&
      doc.menu.every((item, index) => route.menu[index] === item)
  ).length;
