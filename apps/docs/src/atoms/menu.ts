import { atom } from "jotai";
import { documentationAtom } from "./documentation";
import orderBy from "lodash/orderBy";
import { MdxFileFrontmatter } from "../types";
import { sluggify } from "../utils/sluggify";

type MenuItem = {
  id: string;
  label: string;
  order?: number;
  icon?: string;
  slug: string;
  children?: MenuItem[];
};

/**
 * Builds the menu structure from the given metadata.
 * @param itemMetas - Array of metadata objects.
 * @returns Array of MenuItem objects representing the menu structure.
 */
function buildMenu(itemMetas: MdxFileFrontmatter["meta"][]): MenuItem[] {
  const root: MenuItem[] = [];

  // Identify and add first-level menu items
  addFirstLevelItems(itemMetas, root);

  // Add nested menu items
  addNestedItems(itemMetas, root);

  // Order the menu items
  return orderMenuItems(root, itemMetas);
}

/**
 * Identifies and adds first-level menu items to the root.
 * @param itemMetas - Array of metadata objects.
 * @param root - Root array to which first-level items are added.
 */
function addFirstLevelItems(
  itemMetas: MdxFileFrontmatter["meta"][],
  root: MenuItem[]
): void {
  const firstLevelItems = itemMetas.filter(
    (itemMeta) => itemMeta.menu.length === 1
  );

  firstLevelItems.forEach((itemMeta) => {
    const segment = itemMeta.menu[0];
    const slugPath = sluggify(segment);

    root.push({
      id: slugPath,
      icon: itemMeta.icon,
      order: itemMeta.order || 999,
      label: segment,
      slug: slugPath,
      children: [],
    });
  });
}

/**
 * Adds nested menu items to the root.
 * @param itemMetas - Array of metadata objects.
 * @param root - Root array to which nested items are added.
 */
function addNestedItems(
  itemMetas: MdxFileFrontmatter["meta"][],
  root: MenuItem[]
): void {
  itemMetas.forEach((itemMeta) => {
    if (itemMeta.menu.length === 1) return; // Skip first-level items

    const path = itemMeta.menu;
    let currentLevel = root;

    path.forEach((segment, index) => {
      const slugPath = path
        .slice(0, index + 1)
        .map(sluggify)
        .join("/");

      let existingNode = currentLevel.find((item) => item.label === segment);

      if (!existingNode) {
        existingNode = {
          id: slugPath,
          icon: index === path.length - 1 ? itemMeta.icon : undefined, // Assign icon only to the last segment
          order: index === path.length - 1 ? itemMeta.order || 999 : undefined, // Assign order only to the last segment
          label: segment,
          slug: slugPath,
          children: [],
        };
        currentLevel.push(existingNode);
      } else {
        if (index === path.length - 1) {
          if (itemMeta.icon) existingNode.icon = itemMeta.icon; // Update icon if it exists
          if (itemMeta.order) existingNode.order = itemMeta.order; // Update order if it exists
        }
      }

      currentLevel = existingNode.children!;
    });
  });
}

/**
 * Orders the menu items based on their order and label.
 * @param root - Root array of menu items.
 * @param itemMetas - Array of metadata objects.
 * @returns Ordered array of MenuItem objects.
 */
function orderMenuItems(
  root: MenuItem[],
  itemMetas: MdxFileFrontmatter["meta"][]
): MenuItem[] {
  /**
   * Recursively orders the children of menu items.
   * @param items - Array of menu items.
   * @returns Ordered array of menu items.
   */
  function orderChildren(items: MenuItem[]): MenuItem[] {
    return orderBy(
      items.map((item) => ({
        ...item,
        children: item.children ? orderChildren(item.children) : [],
      })),
      ["order", "label"]
    );
  }

  const fixedRoot = root.map((item) => ({
    ...item,
    order:
      item.order !== undefined
        ? item.order
        : itemMetas.find(
            (meta) => meta.menu[meta.menu.length - 1] === item.label
          )?.order || 999,
    children: item.children ? orderChildren(item.children) : [],
  }));

  return orderBy(fixedRoot, ["order", "label"]);
}

/**
 * Atom to manage the menu state.
 * Async since it derives from the async documentationAtom.
 */
export const menuAtom = atom(async (get) => {
  const docsObj = await get(documentationAtom);
  const items: MdxFileFrontmatter["meta"][] = Object.keys(docsObj).map(
    (key) => docsObj[key].meta
  );
  const menu = buildMenu(items);
  return menu;
});
