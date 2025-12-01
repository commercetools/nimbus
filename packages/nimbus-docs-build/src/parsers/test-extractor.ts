import { readFile } from "node:fs/promises";
import { parse } from "@typescript-eslint/typescript-estree";
import type { TSESTree } from "@typescript-eslint/types";
import type {
  TestSection,
  TestSectionMetadata,
} from "../types/test-section.js";

/**
 * Extracts test sections from a .docs.spec.ts file for documentation injection
 *
 * Finds describe() blocks with JSDoc @docs-section tags and extracts:
 * - Metadata from JSDoc tags
 * - Full source code of the describe block
 * - Required imports
 *
 * @param testFilePath - Absolute path to the .docs.spec.ts file
 * @returns Array of test sections sorted by order
 */
export async function extractTestSections(
  testFilePath: string
): Promise<TestSection[]> {
  // Read the test file
  const sourceCode = await readFile(testFilePath, "utf-8");
  const lines = sourceCode.split("\n");

  // Parse TypeScript to AST (with JSX support)
  const ast = parse(sourceCode, {
    loc: true,
    range: true,
    comment: true,
    tokens: false,
    jsx: true, // Enable JSX parsing for .tsx files
  });

  // Extract all import statements
  const imports = extractImports(ast, lines);

  // Find all describe() blocks with @docs-section tags
  const sections: TestSection[] = [];

  if (ast.comments) {
    // Visit all nodes in the AST
    visit(ast, (node) => {
      // Find describe() call expressions
      if (
        node.type === "ExpressionStatement" &&
        node.expression.type === "CallExpression" &&
        node.expression.callee.type === "Identifier" &&
        node.expression.callee.name === "describe"
      ) {
        // Look for preceding JSDoc comment
        const comment = findPrecedingComment(node, ast.comments || []);

        if (comment) {
          const metadata = parseJSDocMetadata(comment.value);

          // Only include if has @docs-section tag
          if (metadata.section) {
            const { code, startLine, endLine } = extractCodeBlock(node, lines);

            sections.push({
              id: metadata.section,
              title: metadata.title || metadata.section,
              description: metadata.description || "",
              order: metadata.order ?? 999,
              code,
              imports,
              sourceFile: testFilePath,
              startLine,
              endLine,
            });
          }
        }
      }
    });
  }

  // Sort by order
  return sections.sort((a, b) => a.order - b.order);
}

/**
 * Extract all import statements from the AST
 */
function extractImports(ast: TSESTree.Program, lines: string[]): string[] {
  const imports: string[] = [];

  for (const node of ast.body) {
    if (node.type === "ImportDeclaration" && node.loc) {
      // Extract the full import statement from source
      const importLines = lines.slice(
        node.loc.start.line - 1,
        node.loc.end.line
      );
      imports.push(importLines.join("\n"));
    }
  }

  return imports;
}

/**
 * Find the JSDoc comment immediately preceding a node
 */
function findPrecedingComment(
  node: TSESTree.Node,
  comments: TSESTree.Comment[]
): TSESTree.Comment | null {
  if (!node.loc) return null;

  // Find the last comment that ends before this node starts
  let precedingComment: TSESTree.Comment | null = null;

  for (const comment of comments) {
    if (!comment.loc) continue;

    // Comment must end before node starts
    if (comment.loc.end.line < node.loc.start.line) {
      // Must be a JSDoc comment (block comment starting with **)
      if (comment.type === "Block" && comment.value.startsWith("*")) {
        precedingComment = comment;
      }
    }
  }

  return precedingComment;
}

/**
 * Parse JSDoc tags from a comment
 */
function parseJSDocMetadata(commentValue: string): TestSectionMetadata {
  const metadata: TestSectionMetadata = {};

  // Remove leading * from each line
  const lines = commentValue
    .split("\n")
    .map((line) => line.trim().replace(/^\*\s?/, ""));

  for (const line of lines) {
    // Extract @docs-section
    const sectionMatch = line.match(/@docs-section\s+(\S+)/);
    if (sectionMatch) {
      metadata.section = sectionMatch[1];
    }

    // Extract @docs-title
    const titleMatch = line.match(/@docs-title\s+(.+)/);
    if (titleMatch) {
      metadata.title = titleMatch[1].trim();
    }

    // Extract @docs-description
    const descriptionMatch = line.match(/@docs-description\s+(.+)/);
    if (descriptionMatch) {
      metadata.description = descriptionMatch[1].trim();
    }

    // Extract @docs-order
    const orderMatch = line.match(/@docs-order\s+(\d+)/);
    if (orderMatch) {
      metadata.order = parseInt(orderMatch[1], 10);
    }
  }

  return metadata;
}

/**
 * Extract the full source code of a describe() block
 */
function extractCodeBlock(
  node: TSESTree.Node,
  lines: string[]
): { code: string; startLine: number; endLine: number } {
  if (!node.loc) {
    return { code: "", startLine: 0, endLine: 0 };
  }

  const startLine = node.loc.start.line;
  const endLine = node.loc.end.line;

  // Extract lines (loc is 1-indexed, array is 0-indexed)
  const codeLines = lines.slice(startLine - 1, endLine);
  const code = codeLines.join("\n");

  return { code, startLine, endLine };
}

/**
 * Simple AST visitor helper
 */
function visit(
  node: TSESTree.Node | TSESTree.Program,
  callback: (node: TSESTree.Node) => void
): void {
  callback(node as TSESTree.Node);

  // Recursively visit all child nodes
  for (const key of Object.keys(node)) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const value = (node as any)[key];

    if (value && typeof value === "object") {
      if (Array.isArray(value)) {
        for (const item of value) {
          if (item && typeof item === "object" && "type" in item) {
            visit(item, callback);
          }
        }
      } else if ("type" in value) {
        visit(value, callback);
      }
    }
  }
}
