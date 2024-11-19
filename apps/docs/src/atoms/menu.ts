import { atom } from "jotai";
import { documentationAtom } from "./documentation";
import orderBy from "lodash/orderBy";
import { MdxFileFrontmatter } from "../types";

type MenuItem = {
  id: string;
  label: string;
  order?: number;
  slug: string;
  children?: MenuItem[];
};

// Utility-Funktion, um Slugs zu generieren
const toSlug = (str: string): string => str.toLowerCase().replace(/\s+/g, "-");

// Funktion zur Erstellung des Menüs
function buildMenu(itemMetas: MdxFileFrontmatter["meta"][]): MenuItem[] {
  const root: MenuItem[] = [];

  // Durchlaufe jede Pfad-Liste im Input
  itemMetas.forEach((itemMeta) => {
    const path = itemMeta.menu;
    let currentLevel = root;

    // Pfad- und Slug-Building für die aktuelle Ebene
    path.forEach((segment, index) => {
      const slugPath = path
        .slice(0, index + 1)
        .map(toSlug)
        .join("/");

      // Überprüfen, ob der Knoten bereits existiert
      let existingNode = currentLevel.find((item) => item.label === segment);

      if (!existingNode) {
        existingNode = {
          id: slugPath,
          order: itemMeta.order,
          label: segment,
          slug: slugPath,
          children: [],
        };
        currentLevel.push(existingNode);
      }

      // Navigiere tiefer in die Baumstruktur
      currentLevel = existingNode.children!;
    });
  });

  const fixedRoot = root.map((item) => {
    return {
      ...item,
      order:
        item.order ||
        itemMetas.find((meta) => meta.menu[meta.menu.length - 1] === item.label)
          ?.order ||
        999,
    };
  });

  return orderBy(fixedRoot, ["order"]);
}

export const menuAtom = atom((get) => {
  const docsObj = get(documentationAtom);
  const items: MdxFileFrontmatter["meta"][] = Object.keys(docsObj).map(
    (key) => docsObj[key].meta
  );

  const menu = buildMenu(items);
  return menu;
});
