/**
 * Walks the flat tree from `element` toward the document: slotted nodes via
 * `assignedSlot`, then `parentNode`, then a shadow root's `host`.
 * `getRootNode()` and `Node.contains()` do not cross shadow boundaries.
 */
export const walkFlatTreeAncestors = (element: Element): Node[] => {
  const nodes: Node[] = [];
  let current: Node | null = element;

  while (current) {
    nodes.push(current);

    if (current instanceof Element && current.assignedSlot) {
      current = current.assignedSlot;
      continue;
    }

    if (current.parentNode) {
      current = current.parentNode;
      continue;
    }

    const root = current.getRootNode();
    if (root instanceof ShadowRoot) {
      current = root.host;
      continue;
    }

    break;
  }

  return nodes;
};

export const getShadowRootsAlongFlatTree = (element: Element): ShadowRoot[] =>
  walkFlatTreeAncestors(element).filter(
    (node): node is ShadowRoot => node instanceof ShadowRoot
  );

export const isRelatedScrollTarget = (
  target: EventTarget | null,
  root: Element,
  content: Element
): boolean => {
  if (target == null) {
    return false;
  }

  if (
    target === document ||
    target === document.documentElement ||
    target === document.body ||
    target === document.scrollingElement
  ) {
    return true;
  }

  if (target === content) {
    return true;
  }

  return walkFlatTreeAncestors(root).includes(target as Node);
};
