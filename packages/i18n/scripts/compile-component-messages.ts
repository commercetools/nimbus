/**
 * Compile component messages to JavaScript - Step 2 of 3 in the i18n build pipeline
 *
 * Overview:
 * Takes the split component messages (ICU format) and compiles them into
 * pre-compiled JavaScript functions using `@internationalized/string-compiler`.
 * Each component gets its own intl/ directory with compiled message files
 * for each locale.
 *
 *
 * Input:  .temp/by-component/{Component}/{locale}.json (ICU format)
 * Output: packages/nimbus/src/components/{component}/intl/{locale}.ts (compiled JS)
 *
 * Process:
 *   1. Read component messages from split files
 *   2. Compile using `@internationalized/string-compiler`
 *   3. Transform CommonJS → ES modules
 *   4. Add type annotations
 *   5. Write to component's intl/ directory
 *
 * @example
 * Input (.temp/by-component/Alert/en.json):
 *   { "dismiss": "Dismiss" }
 *
 * Output (packages/nimbus/src/components/alert/intl/en.ts):
 *   export default {
 *     "dismiss": () => "Dismiss"
 *   }
 */

import { compileStrings } from "@internationalized/string-compiler";
import fs from "fs/promises";
import path from "path";
import { format } from "prettier";
import { LOCALE_CODES } from "./locales";

const LOCALES = LOCALE_CODES;

/**
 * Special mappings for component name exceptions that don't follow standard PascalCase → kebab-case conversion
 */
const COMPONENT_DIR_MAPPING: Record<string, string> = {
  ComboBox: "combobox", // Compound word treated as single word (not combo-box)
};

/**
 * Convert component name to directory name (PascalCase → kebab-case)
 * Example: "Alert" → "alert", "DatePicker" → "date-picker"
 * Special cases are handled via COMPONENT_DIR_MAPPING
 */
function componentToDir(component: string): string {
  // Check for special case mappings first
  if (COMPONENT_DIR_MAPPING[component]) {
    return COMPONENT_DIR_MAPPING[component];
  }

  // Default conversion: PascalCase → kebab-case
  return component
    .replace(/([A-Z])/g, "-$1")
    .toLowerCase()
    .replace(/^-/, "");
}

/**
 * Recursively walk a directory and return a map of basename → absolute path
 * for every descendant directory. Used to locate the target directory for a
 * component in either `components/` or `patterns/` (with arbitrary nesting).
 */
async function collectDirsByName(
  root: string
): Promise<Record<string, string>> {
  const result: Record<string, string> = {};
  const stack: string[] = [root];
  while (stack.length > 0) {
    const current = stack.pop()!;
    let entries;
    try {
      entries = await fs.readdir(current, { withFileTypes: true });
    } catch {
      continue;
    }
    for (const entry of entries) {
      if (!entry.isDirectory()) continue;
      const full = path.join(current, entry.name);
      // First match wins (top-down) so `components/` takes precedence if the
      // same basename exists in both trees.
      if (!(entry.name in result)) {
        result[entry.name] = full;
      }
      stack.push(full);
    }
  }
  return result;
}

async function compileComponentMessages() {
  const splitDir = path.join(__dirname, "../.temp/by-component");
  const nimbusSrcDir = path.join(__dirname, "../../nimbus/src");
  const nimbusComponentsDir = path.join(nimbusSrcDir, "components");
  const nimbusPatternsDir = path.join(nimbusSrcDir, "patterns");

  // Build a lookup of kebab-case directory names to their absolute paths across
  // components/ and patterns/. Components take precedence on collision.
  const componentsLookup = await collectDirsByName(nimbusComponentsDir);
  const patternsLookup = await collectDirsByName(nimbusPatternsDir);
  const dirLookup: Record<string, string> = {
    ...patternsLookup,
    ...componentsLookup,
  };

  // Get all component directories (filter out files, keep only directories)
  const componentDirs = await fs.readdir(splitDir);
  const components: string[] = [];
  for (const dir of componentDirs) {
    const dirPath = path.join(splitDir, dir);
    const stat = await fs.stat(dirPath);
    if (stat.isDirectory()) {
      components.push(dir);
    }
  }

  for (const component of components) {
    const componentDir = path.join(splitDir, component);
    const componentDirName = componentToDir(component);
    const resolvedComponentDir =
      dirLookup[componentDirName] ??
      path.join(nimbusComponentsDir, componentDirName);
    const outputIntlDir = path.join(resolvedComponentDir, "intl");

    // Create intl directory for this component
    await fs.mkdir(outputIntlDir, { recursive: true });

    // Process each locale
    for (const locale of LOCALES) {
      const inputPath = path.join(componentDir, `${locale}.json`);

      // Check if file exists (some components might not have all locales)
      try {
        await fs.access(inputPath);
      } catch {
        // Skip missing locale files silently
        continue;
      }

      // Read ICU messages from split component files
      let messages: Record<string, string>;
      try {
        messages = JSON.parse(await fs.readFile(inputPath, "utf-8"));
      } catch (error) {
        console.error(`❗️Failed to parse ${inputPath}:`, error);
        throw error;
      }

      // Compile ICU messages to JavaScript functions using string-compiler
      const compiledCode = compileStrings(messages);

      // Transform CommonJS output → ES modules
      let esModuleCode = compiledCode.replace(
        /^module\.exports\s*=\s*/,
        "export default "
      );

      // Add type annotations: messages with variables compile to functions that need typed parameters
      esModuleCode = esModuleCode.replace(
        /\(args\)\s*=>/g,
        "(args: Record<string, string | number>) =>"
      );

      // Write compiled file (ready for next step: generate-dictionaries)
      const outputPath = path.join(outputIntlDir, `${locale}.ts`);
      const tsContent = `/**
 * Pre-compiled ${locale} messages for ${component}
 * Generated by @internationalized/string-compiler
 * DO NOT EDIT MANUALLY
 */

${esModuleCode}`;

      // Format the entire file content with Prettier
      const formattedContent = await format(tsContent, {
        parser: "typescript",
        singleQuote: false,
        printWidth: 80,
      });

      await fs.writeFile(outputPath, formattedContent);
    }
  }

  console.log(
    "✅ Compilation complete. Output: packages/nimbus/src/components/*/intl/"
  );
}

compileComponentMessages().catch(console.error);
