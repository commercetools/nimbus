/**
 * @see https://prettier.io/docs/options
 * @type {import("prettier").Config}
 */
const config = {
  /** specifies the line length that the printer will wrap on. */
  printWidth: 80,
  /** the number of spaces per indentation-level */
  tabWidth: 2,
  /** print semicolons at the ends of statements? */
  semi: true,
  /** use single quotes instead of double quotes. */
  singleQuote: false,
  jsxSingleQuote: false,
  /** only add quotes around object properties where required. */
  quoteProps: "as-needed",
  /**
   * trailing commas where valid in ES5 (objects, arrays, etc.). Trailing
   * commas in type parameters in TypeScript and Flow.
   */
  trailingComma: "es5",
  /** print spaces between brackets in object literals. */
  bracketSpacing: true,
  /** put the > of a multi-line HTML element on it's own line */
  bracketSameLine: false,
  /** include parentheses around a sole arrow function parameter. */
  arrowParens: "always",
  /** markdown files: prettier always wraps text to the specified print width. */
  proseWrap: "always",
  /** enforce single attribute per line in HTML and JSX. */
  singleAttributePerLine: false,
  overrides: [
    {
      /**
       * Skill files use YAML frontmatter with a `description` field that must
       * stay on a single line for the Claude skill-file parser to read it.
       * `proseWrap: "always"` breaks the description across lines, which the
       * parser interprets as separate YAML keys and raises a diagnostic error.
       */
      files: ".claude/skills/**/SKILL.md",
      options: {
        proseWrap: "preserve",
      },
    },
  ],
};

export default config;
