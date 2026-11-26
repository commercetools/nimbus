import type { Code, Parent, Root, RootContent } from "mdast";

/**
 * The name of the component that renders a group of code blocks as tabs. It
 * is registered in the MDX component map (`components/index.tsx`).
 */
export const CODE_TABS_COMPONENT = "CodeTabs";

/** Finds `tab="Label"`, `tab='Label'` or `tab=Label` in a fence meta string. */
const TAB_META = /(?:^|\s)tab=(?:"([^"]*)"|'([^']*)'|(\S+))/;

/**
 * Reads the tab label from a fenced code block, or returns `undefined` when
 * the block has none.
 */
const readLabel = (node: RootContent): string | undefined => {
  if (node.type !== "code" || !node.meta) return undefined;
  const match = TAB_META.exec(node.meta);
  if (!match) return undefined;
  return match[1] ?? match[2] ?? match[3];
};

/** Removes the `tab="…"` part from the meta string of a code block. */
const removeTabMeta = (code: Code) => {
  code.meta = (code.meta ?? "").replace(TAB_META, "").trim() || null;
};

/**
 * Remark plugin that turns directly following fenced code blocks with a
 * `tab="Label"` meta string into one tabbed group.
 *
 * ````md
 * ```bash tab="pnpm"
 * pnpm add @commercetools/nimbus
 * ```
 *
 * ```bash tab="npm"
 * npm install @commercetools/nimbus
 * ```
 * ````
 *
 * A group is a run of two or more labeled code blocks with nothing between
 * them (blank lines do not count). Text, headings or any other element end
 * the group. A labeled block that stands alone is a normal code block.
 *
 * Each group becomes a `<CodeTabs tabs='["pnpm","npm"]'>` element. The
 * children are the code blocks, in the same order as the labels.
 *
 * The plugin must run before `remarkLiveCode`, because it removes its own
 * part of the meta string. This keeps a label such as `tab="deliver"` from
 * being read as the `live` flag.
 */
export function remarkCodeTabs() {
  return (tree: Root) => {
    visit(tree);
  };
}

function visit(parent: Parent) {
  const result: RootContent[] = [];
  let group: Code[] = [];

  const closeGroup = () => {
    if (group.length > 1) {
      group.forEach(removeTabMeta);
      result.push({
        type: "paragraph",
        children: group,
        data: {
          hName: CODE_TABS_COMPONENT,
          hProperties: {
            tabs: JSON.stringify(group.map((code) => readLabelOf(code))),
          },
        },
      } as unknown as RootContent);
    } else {
      // A single labeled block is a normal code block.
      group.forEach(removeTabMeta);
      result.push(...group);
    }
    group = [];
  };

  // The labels are read before the meta strings are changed.
  const labels = new Map<Code, string>();
  const readLabelOf = (code: Code) => labels.get(code) ?? "";

  for (const child of parent.children as RootContent[]) {
    const label = readLabel(child);
    if (label !== undefined) {
      labels.set(child as Code, label);
      group.push(child as Code);
      continue;
    }

    closeGroup();
    if ("children" in child && Array.isArray(child.children)) {
      visit(child as Parent);
    }
    result.push(child);
  }
  closeGroup();

  parent.children = result as Parent["children"];
}
