import { atom } from "jotai";
import { documentationAtom } from "./documentation";
import orderBy from "lodash/orderBy";
import { MdxFileFrontmatter } from "../types";
import { sluggify } from "../utils/sluggify";

type MenuItem = {
  id: string;
  label: string;
  order?: number;
  slug: string;
  children?: MenuItem[];
};

// Function to create the menu
function buildMenu(itemMetas: MdxFileFrontmatter["meta"][]): MenuItem[] {
  const root: MenuItem[] = [];

  // Iterate through each path list in the input
  itemMetas.forEach((itemMeta) => {
    const path = itemMeta.menu;
    let currentLevel = root;

    // Path and slug building for the current level
    path.forEach((segment, index) => {
      const slugPath = path
        .slice(0, index + 1)
        .map(sluggify)
        .join("/");

      // Check if the node already exists
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

      // Navigate deeper into the tree structure
      currentLevel = existingNode.children!;
    });
  });

  // Recursive function to order children by 'order' and then by 'label' property
  function orderChildren(items: MenuItem[]): MenuItem[] {
    return orderBy(
      items.map((item) => ({
        ...item,
        children: item.children ? orderChildren(item.children) : [],
      })),
      ["order", "label"]
    );
  }

  const fixedRoot = root.map((item) => {
    return {
      ...item,
      order:
        item.order ||
        itemMetas.find((meta) => meta.menu[meta.menu.length - 1] === item.label)
          ?.order ||
        999,
      children: item.children ? orderChildren(item.children) : [],
    };
  });

  return orderBy(fixedRoot, ["order", "label"]);
}

export const menuAtom = atom((get) => {
  const docsObj = get(documentationAtom);
  const items: MdxFileFrontmatter["meta"][] = Object.keys(docsObj).map(
    (key) => docsObj[key].meta
  );

  const menu = buildMenu(items);
  return menu;
});
