import { describe, it, expect } from "vitest";
import { stripMarkdown } from "./search.js";

describe("stripMarkdown (search index)", () => {
  it("removes fence markers but keeps fenced code and its JSX intact", () => {
    const mdx =
      "### Import\n\n```tsx\nimport { Box } from '@commercetools/nimbus';\n```\n\n" +
      '```jsx live-dev\nconst App = () => (\n  <Box p="100">Basic Box</Box>\n)\n```\n';
    const out = stripMarkdown(mdx);
    expect(out).not.toContain("```");
    expect(out).not.toContain("``");
    expect(out).toContain('<Box p="100">Basic Box</Box>');
    expect(out).toContain("import { Box } from '@commercetools/nimbus';");
  });

  it("does not let the inline-code regex span lines", () => {
    const out = stripMarkdown("use `a`\nthen `b`");
    expect(out).toBe("use `a`\nthen `b`");
  });
});
