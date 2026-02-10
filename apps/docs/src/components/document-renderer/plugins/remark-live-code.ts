import type { Root, Code } from "mdast";

/**
 * Remark plugin that merges meta strings back into the language identifier
 * for live code blocks.
 *
 * This allows MDX authors to write standard `jsx` fenced code blocks with
 * meta strings (`jsx live`, `jsx live-dev`) so that VS Code provides syntax
 * highlighting, while still producing the `language-jsx-live` /
 * `language-jsx-live-dev` class names the Code component expects.
 */
export function remarkLiveCode() {
  return (tree: Root) => {
    visitCodeNodes(tree);
  };
}

function visitCodeNodes(node: Root | Root["children"][number]) {
  if (node.type === "code") {
    const code = node as Code;
    if (code.meta) {
      // Check `live-dev` before `live` to prevent false matches
      if (code.meta.includes("live-dev")) {
        code.lang = `${code.lang}-live-dev`;
        code.meta = code.meta.replace("live-dev", "").trim() || null;
      } else if (code.meta.includes("live")) {
        code.lang = `${code.lang}-live`;
        code.meta = code.meta.replace("live", "").trim() || null;
      }
    }
  }

  if ("children" in node && Array.isArray(node.children)) {
    for (const child of node.children) {
      visitCodeNodes(child as Root["children"][number]);
    }
  }
}
