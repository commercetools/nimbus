/**
 * Live examples can start with import lines, like code in an app. The live
 * editor does not load modules; it runs the code with a fixed scope. This file
 * turns each import line into a lookup in the modules that the editor provides,
 * so the same code works in an app and in the editor.
 */

/** Name of the scope variable that holds the modules the editor provides. */
export const LIVE_MODULES_KEY = "__liveModules";

/** Modules that live examples can import from, by module name. */
export type LiveModules = Record<string, object>;

/**
 * One import statement. The clause between `import` and `from` can span
 * several lines and contain comments. A statement without a clause
 * (`import "x";`) only has a module name. A comment can follow the statement.
 */
const IMPORT_STATEMENT =
  /^[ \t]*import\s+(?:((?:[\w$*{}\s,]|\/\/[^\n]*\n|\/\*[\s\S]*?\*\/)+?)\s+from\s+)?["']([^"']+)["'][ \t]*;?[ \t]*(?:\/\/[^\n]*|\/\*.*?\*\/[ \t]*)?$/gm;

/** A line that still starts with `import` after all statements were read. */
const LEFTOVER_IMPORT = /^[ \t]*import\s/m;

/** All lines that still start with `import`, to remove them. */
const LEFTOVER_LINES = /^[ \t]*import\s[^\n]*$/gm;

/** Removes line and block comments from an import clause. */
const removeComments = (clause: string) =>
  clause.replace(/\/\/[^\n]*/g, "").replace(/\/\*[\s\S]*?\*\//g, "");

type ImportClause = {
  defaultName?: string;
  namespaceName?: string;
  named: { imported: string; local: string }[];
};

/**
 * Splits an import clause such as `Box, { Menu as MenuIcon }` into its names.
 * @returns undefined for type-only imports, which have no value at runtime
 */
const parseImportClause = (clause: string): ImportClause | undefined => {
  let rest = removeComments(clause).trim();
  if (/^type\s/.test(rest)) return undefined;

  const result: ImportClause = { named: [] };

  const braces = rest.match(/\{([^}]*)\}/);
  if (braces) {
    result.named = braces[1]
      .split(",")
      .map((part) => part.trim())
      .filter((part) => part && !part.startsWith("type "))
      .map((part) => {
        const [imported, local] = part.split(/\s+as\s+/);
        return { imported, local: local ?? imported };
      });
    rest = rest.replace(braces[0], "");
  }

  const namespace = rest.match(/\*\s*as\s+([\w$]+)/);
  if (namespace) {
    result.namespaceName = namespace[1];
    rest = rest.replace(namespace[0], "");
  }

  const defaultName = rest.replace(/,/g, "").trim();
  if (defaultName) result.defaultName = defaultName;

  return result;
};

/** Turns one import statement into the declarations that replace it. */
const toDeclarations = (
  clause: string | undefined,
  moduleName: string,
  modules: LiveModules
): string => {
  if (!clause) return "";
  const parsed = parseImportClause(clause);
  if (!parsed) return "";

  if (!(moduleName in modules)) {
    const message = `The live editor cannot import from "${moduleName}". It can import from: ${Object.keys(modules).join(", ")}.`;
    return `throw new Error(${JSON.stringify(message)});`;
  }

  const source = `${LIVE_MODULES_KEY}[${JSON.stringify(moduleName)}]`;
  const lines: string[] = [];
  if (parsed.defaultName) {
    lines.push(`const ${parsed.defaultName} = ${source}.default ?? ${source};`);
  }
  if (parsed.namespaceName) {
    lines.push(`const ${parsed.namespaceName} = ${source};`);
  }
  if (parsed.named.length > 0) {
    const names = JSON.stringify(parsed.named.map(({ imported }) => imported));
    const message = `The live editor cannot import these names from "${moduleName}": `;
    lines.push(
      `{ const missing = ${names}.filter((name) => !(name in ${source})); if (missing.length > 0) throw new Error(${JSON.stringify(message)} + missing.join(", ")); }`
    );
    const bindings = parsed.named
      .map(({ imported, local }) =>
        imported === local ? imported : `${imported}: ${local}`
      )
      .join(", ");
    lines.push(`const { ${bindings} } = ${source};`);
  }
  return lines.join("\n");
};

/**
 * Prepares the code of a live example to run in the editor: each import line
 * becomes a lookup in `modules`, and the code renders its `App` component.
 *
 * The code runs inside a block, so an import may use a name that the scope
 * already has (for example the icon `Menu` next to the Nimbus `Menu`).
 * @returns Code that react-live can run in `noInline` mode
 */
export const resolveImports = (code: string, modules: LiveModules): string => {
  const declarations: string[] = [];
  let body = code.replace(
    IMPORT_STATEMENT,
    (_statement, clause: string | undefined, moduleName: string) => {
      declarations.push(toDeclarations(clause, moduleName, modules));
      return "";
    }
  );

  // An import line that the pattern cannot read would make the whole example
  // fail with a syntax error. Remove it and explain the problem instead.
  const leftover = body.match(LEFTOVER_IMPORT);
  if (leftover) {
    const line = body.slice(leftover.index).split("\n")[0];
    const message = `The live editor cannot read this import line: ${line.trim()}`;
    declarations.unshift(`throw new Error(${JSON.stringify(message)});`);
    body = body.replace(LEFTOVER_LINES, "");
  }

  return [
    "{",
    ...declarations.filter(Boolean),
    body,
    "render(<App />);",
    "}",
  ].join("\n");
};
