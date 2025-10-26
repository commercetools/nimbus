import { atom } from "jotai";
import orderBy from "lodash/orderBy";
import { sluggify } from "../utils/sluggify";

type MenuItem = {
  id: string;
  label: string;
  order?: number;
  icon?: string;
  slug: string;
  route: string; // The actual route from manifest
  children?: MenuItem[];
};

type RouteManifestItem = {
  path: string;
  id: string;
  title: string;
  description: string;
  category: string;
  tags: string[];
  menu: string[];
  order: number;
  chunkName: string;
};

type RouteManifest = {
  routes: RouteManifestItem[];
  categories: Array<{
    id: string;
    label: string;
    items: Array<{
      id: string;
      title: string;
      path: string;
    }>;
  }>;
};

/**
 * Builds the menu structure from the route manifest.
 * Uses the 'route' field (derived from path) as the single source of truth for navigation.
 * @param routes - Array of route items from manifest
 * @returns Array of MenuItem objects representing the menu structure
 */
function buildMenu(routes: RouteManifestItem[]): MenuItem[] {
  const root: MenuItem[] = [];

  // Identify and add first-level menu items
  addFirstLevelItems(routes, root);

  // Add nested menu items
  addNestedItems(routes, root);

  // Order the menu items
  return orderMenuItems(root);
}

/**
 * Identifies and adds first-level menu items to the root.
 * @param routes - Array of route items from manifest
 * @param root - Root array to which first-level items are added.
 */
function addFirstLevelItems(
  routes: RouteManifestItem[],
  root: MenuItem[]
): void {
  const firstLevelItems = routes.filter((route) => route.menu.length === 1);

  firstLevelItems.forEach((route) => {
    const segment = route.menu[0];
    const slugPath = sluggify(segment);

    // Check if already exists
    if (!root.find((item) => item.id === slugPath)) {
      root.push({
        id: slugPath,
        order: route.order || 999,
        label: segment,
        slug: slugPath,
        route: route.path.slice(1), // Remove leading slash
        children: [],
      });
    }
  });
}

/**
 * Adds nested menu items to the root.
 * Uses the 'path' field from manifest as the single source of truth.
 * @param routes - Array of route items from manifest
 * @param root - Root array to which nested items are added.
 */
function addNestedItems(routes: RouteManifestItem[], root: MenuItem[]): void {
  routes.forEach((route) => {
    if (route.menu.length === 1) return; // Skip first-level items

    const path = route.menu;
    let currentLevel = root;

    path.forEach((segment, index) => {
      const slugPath = path
        .slice(0, index + 1)
        .map(sluggify)
        .join("/");

      let existingNode = currentLevel.find((item) => item.label === segment);

      if (!existingNode) {
        // For leaf nodes, use the actual route from manifest
        const isLeafNode = index === path.length - 1;
        existingNode = {
          id: slugPath,
          order: isLeafNode ? route.order || 999 : undefined,
          label: segment,
          slug: slugPath,
          route: isLeafNode ? route.path.slice(1) : slugPath, // Remove leading slash from path
          children: [],
        };
        currentLevel.push(existingNode);
      } else {
        // Update existing node if it's a leaf node
        if (index === path.length - 1) {
          if (route.order) existingNode.order = route.order;
          existingNode.route = route.path.slice(1); // Remove leading slash
        }
      }

      currentLevel = existingNode.children!;
    });
  });
}

/**
 * Propagates minimum child orders to parent nodes.
 * Intermediate nodes without an explicit order inherit the minimum order from their children.
 * @param items - Array of menu items.
 * @returns Array of menu items with propagated orders.
 */
function propagateMinimumOrders(items: MenuItem[]): MenuItem[] {
  return items.map((item) => {
    // First, recursively process children
    const processedChildren = item.children
      ? propagateMinimumOrders(item.children)
      : [];

    // If this item has no explicit order and has children, inherit minimum child order
    let effectiveOrder = item.order;
    if (effectiveOrder === undefined && processedChildren.length > 0) {
      const childOrders = processedChildren
        .map((child) => child.order)
        .filter((order): order is number => order !== undefined);
      effectiveOrder = childOrders.length > 0 ? Math.min(...childOrders) : 999;
    }

    return {
      ...item,
      order: effectiveOrder,
      children: processedChildren,
    };
  });
}

/**
 * Orders the menu items based on their order and label.
 * @param root - Root array of menu items.
 * @returns Ordered array of MenuItem objects.
 */
function orderMenuItems(root: MenuItem[]): MenuItem[] {
  // First, propagate minimum orders from children to parents
  const withPropagatedOrders = propagateMinimumOrders(root);

  /**
   * Recursively orders the children of menu items.
   * @param items - Array of menu items.
   * @returns Ordered array of menu items.
   */
  function orderChildren(items: MenuItem[]): MenuItem[] {
    return orderBy(
      items.map((item) => ({
        ...item,
        order: item.order !== undefined ? item.order : 999,
        children: item.children ? orderChildren(item.children) : [],
      })),
      ["order", "label"]
    );
  }

  return orderBy(
    withPropagatedOrders.map((item) => ({
      ...item,
      order: item.order !== undefined ? item.order : 999,
      children: item.children ? orderChildren(item.children) : [],
    })),
    ["order", "label"]
  );
}

/**
 * Atom to load and parse the route manifest
 */
const routeManifestAtom = atom<Promise<RouteManifest>>(async () => {
  const module = await import("./../data/route-manifest.json");
  return module.default as RouteManifest;
});

/**
 * Atom to manage the menu state.
 * Async since it derives from the async routeManifestAtom.
 */
export const menuAtom = atom(async (get) => {
  const manifest = await get(routeManifestAtom);
  const menu = buildMenu(manifest.routes);
  return menu;
});
