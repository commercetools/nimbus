/**
 * Test section extracted from .docs.spec.ts files for documentation injection
 */
export interface TestSection {
  /** Unique identifier for the section (from @docs-section tag) */
  id: string;

  /** Display title for the section (from @docs-title tag) */
  title: string;

  /** Description explaining what these tests demonstrate (from @docs-description tag) */
  description: string;

  /** Sort order for display in documentation (from @docs-order tag) */
  order: number;

  /** Full source code of the describe block including tests */
  code: string;

  /** Import statements required for this test section */
  imports: string[];

  /** Source file path for debugging and error messages */
  sourceFile: string;

  /** Line number where this section starts in the source file */
  startLine: number;

  /** Line number where this section ends in the source file */
  endLine: number;
}

/**
 * Parsed JSDoc tags from test describe blocks
 */
export interface TestSectionMetadata {
  /** @docs-section tag value */
  section?: string;

  /** @docs-title tag value */
  title?: string;

  /** @docs-description tag value */
  description?: string;

  /** @docs-order tag value (parsed to number) */
  order?: number;
}
