/**
 * A Nimbus-owned remark plugin that materializes *registered* custom component
 * tags embedded in the markdown source (e.g. `<SearchQueryResultCard id="foo"
 * />`) into nodes `react-markdown` resolves against the consumer `components`
 * map. Pure mdast manipulation — no new dependencies, no raw-HTML pipeline.
 *
 * Safe by default: only tags whose name is in `registeredNames` are ever
 * materialized; every other `html` node is left untouched (and dropped by
 * react-markdown's `skipHtml`). Tag names are matched by exact case, so any
 * casing (PascalCase included) is preserved.
 *
 * Mechanism: a matched tag is replaced with a node of type `nimbusCustomTag`
 * that has no registered mdast→hast handler, so `mdast-util-to-hast` routes it
 * to its `defaultUnknownHandler`. That handler honors `data.hName` (→ hast
 * element `tagName`, verbatim) and `data.hProperties` (→ element properties),
 * and recurses the node's `children` via `state.all`. react-markdown then looks
 * up `components[tagName]` by exact match and renders it with the props.
 *
 * Supported shapes:
 * - Self-closing: `<Name ... />` (empty children).
 * - Paired with markdown children: `<Name ...>…</Name>`. Block-level paired
 *   tags require blank lines around the tags (the CommonMark convention for
 *   markdown inside HTML); inline paired tags work within a paragraph.
 *
 * Unbalanced input is left inert (never throws): a closing tag with no opening,
 * an opening tag with no closing (e.g. mid-stream), and improperly-nested tags
 * are emitted as their original `html` nodes.
 */

import { parseTagAttributes } from "./parse-tag-attributes";

/** Minimal structural mdast node — avoids a direct dependency on mdast types. */
type MdNode = {
  type: string;
  value?: string;
  children?: MdNode[];
  data?: {
    hName?: string;
    hProperties?: Record<string, unknown>;
    [key: string]: unknown;
  };
  [key: string]: unknown;
};

// Attribute run that tolerates `>` inside quoted values (so `label="a > b"`
// stays within the tag).
const ATTRS = `(?:\\s+[A-Za-z_][\\w-]*(?:\\s*=\\s*(?:"[^"]*"|'[^']*'|\\{[^}]*\\}|[^\\s>]+))?)*\\s*`;
const SELF_CLOSING_RE = new RegExp(`^<([A-Za-z][\\w-]*)(${ATTRS})/>$`);
const OPEN_RE = new RegExp(`^<([A-Za-z][\\w-]*)(${ATTRS})>$`);
const CLOSE_RE = /^<\/([A-Za-z][\w-]*)\s*>$/;

type Classified =
  | { kind: "self"; name: string; attrs: string }
  | { kind: "open"; name: string; attrs: string }
  | { kind: "close"; name: string }
  | null;

function classify(node: MdNode, names: ReadonlySet<string>): Classified {
  if (node.type !== "html" || typeof node.value !== "string") return null;
  const value = node.value.trim();

  const self = SELF_CLOSING_RE.exec(value);
  if (self && names.has(self[1]))
    return { kind: "self", name: self[1], attrs: self[2] };

  const open = OPEN_RE.exec(value);
  if (open && names.has(open[1]))
    return { kind: "open", name: open[1], attrs: open[2] };

  const close = CLOSE_RE.exec(value);
  if (close && names.has(close[1])) return { kind: "close", name: close[1] };

  return null;
}

function makeCustomNode(
  name: string,
  attrs: string,
  children: MdNode[]
): MdNode {
  return {
    type: "nimbusCustomTag",
    // hChildren is intentionally unset so the unknown handler recurses
    // `children` via `state.all`, converting nested markdown to hast.
    data: { hName: name, hProperties: parseTagAttributes(attrs) },
    children,
  };
}

type Frame = {
  name: string;
  rawOpen: string;
  attrs: string;
  collected: MdNode[];
};

/**
 * Single stack-based pass over one `children` array. Pairs registered
 * open/close tags (nearest matching open wins), wrapping the between-siblings as
 * the custom node's children. Self-closing tags become empty-children nodes.
 * Unbalanced tags are spilled back as inert `html` nodes in document order.
 */
function pairChildren(
  children: MdNode[],
  names: ReadonlySet<string>
): MdNode[] {
  const output: MdNode[] = [];
  const stack: Frame[] = [];

  const emit = (node: MdNode) => {
    if (stack.length > 0) stack[stack.length - 1].collected.push(node);
    else output.push(node);
  };

  for (const child of children) {
    const tag = classify(child, names);

    if (!tag) {
      emit(child);
      continue;
    }

    if (tag.kind === "self") {
      emit(makeCustomNode(tag.name, tag.attrs, []));
      continue;
    }

    if (tag.kind === "open") {
      stack.push({
        name: tag.name,
        rawOpen: child.value as string,
        attrs: tag.attrs,
        collected: [],
      });
      continue;
    }

    // close: find the nearest matching open.
    let idx = -1;
    for (let i = stack.length - 1; i >= 0; i--) {
      if (stack[i].name === tag.name) {
        idx = i;
        break;
      }
    }
    if (idx === -1) {
      // Closing tag with no opening → inert.
      emit(child);
      continue;
    }
    // Spill improperly-nested frames above the match (their opens never closed).
    while (stack.length - 1 > idx) {
      const orphan = stack.pop() as Frame;
      emit({ type: "html", value: orphan.rawOpen });
      for (const node of orphan.collected) emit(node);
    }
    const frame = stack.pop() as Frame;
    emit(makeCustomNode(frame.name, frame.attrs, frame.collected));
  }

  // Any frames still open are unclosed (e.g. mid-stream) → spill inert,
  // unwinding innermost-first so document order is preserved.
  while (stack.length > 0) {
    const frame = stack.pop() as Frame;
    const spilled: MdNode[] = [
      { type: "html", value: frame.rawOpen },
      ...frame.collected,
    ];
    if (stack.length > 0) stack[stack.length - 1].collected.push(...spilled);
    else output.push(...spilled);
  }

  return output;
}

/** Recursively pair tags in every `children` array, top-down. */
function transform(node: MdNode, names: ReadonlySet<string>): void {
  if (!Array.isArray(node.children)) return;
  node.children = pairChildren(node.children, names);
  for (const child of node.children) transform(child, names);
}

export type RemarkCustomComponentTagsOptions = {
  /** Tag names eligible to be materialized (exact, case-sensitive match). */
  registeredNames: ReadonlySet<string>;
};

/**
 * Build a configured remark plugin (unified attacher). No-op when no tags are
 * registered, so the markdown pipeline is unchanged for the common case.
 */
export function remarkCustomComponentTags({
  registeredNames,
}: RemarkCustomComponentTagsOptions) {
  return function attacher() {
    return function transformer(tree: MdNode) {
      if (registeredNames.size === 0) return;
      transform(tree, registeredNames);
    };
  };
}
