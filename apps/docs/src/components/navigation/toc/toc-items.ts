type TocEntry = { href: string; depth: number };

const idOf = (entry: TocEntry) => entry.href.split("#").join("");

/**
 * Picks the entries of the table of contents that are shown. All `h1` and `h2`
 * entries are shown. The `h3` entries are shown only for the section (the
 * nearest `h2` above) that contains the active heading. Deeper entries are
 * never shown, but an active heading deeper than `h3` still opens its section.
 */
export const getVisibleTocItems = <T extends TocEntry>(
  items: T[],
  activeId: string | undefined
): T[] => {
  const activeIndex = items.findIndex((entry) => idOf(entry) === activeId);

  let activeSection = -1;
  for (let index = activeIndex; index >= 0; index--) {
    if (items[index].depth <= 2) {
      activeSection = index;
      break;
    }
  }

  let section = -1;
  return items.filter((entry, index) => {
    if (entry.depth <= 2) {
      section = index;
      return true;
    }
    return entry.depth === 3 && section !== -1 && section === activeSection;
  });
};
