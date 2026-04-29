/**
 * Generate message dictionary files for each component - Step 3 of 3 in the i18n build pipeline
 *
 * Overview:
 * After compiling messages for each locale, we need to create a dictionary
 * file that imports all locale files and exports a LocalizedStrings object.
 * This dictionary is what components will import and use with the
 * useLocalizedStringFormatter hook at runtime.
 *
 *
 * Input:  packages/nimbus/src/components/{component}/intl/*.ts (compiled locale files)
 * Output: packages/nimbus/src/components/{component}/{component}.messages.ts (dictionary)
 *
 * Process:
 *   1. Find all components with intl/ directories
 *   2. Read locale files to determine available message keys
 *   3. Generate dictionary file with imports and LocalizedStrings export
 *   4. Export message key types for TypeScript support
 *
 * @example
 * Generates alert.messages.ts:
 *   import { type LocalizedString, type LocalizedStrings } from "@internationalized/string";
 *   import { normalizeMessages } from "../../utils/normalize-messages";
 *   import alertMessages_en from "./intl/en";
 *   import alertMessages_de from "./intl/de";
 *   ...
 *   export const alertMessagesStrings: LocalizedStrings<string, LocalizedString> = {
 *     en: normalizeMessages(alertMessages_en),
 *     de: normalizeMessages(alertMessages_de),
 *     es: normalizeMessages(alertMessages_es),
 *     "fr-FR": normalizeMessages(alertMessages_fr),
 *     "pt-BR": normalizeMessages(alertMessages_pt),
 *   } as LocalizedStrings<string, LocalizedString>;
 *   export type AlertMessageKey = "dismiss";
 */

import fs from "fs/promises";
import path from "path";
import { format, resolveConfig } from "prettier";
import { SUPPORTED_LOCALES } from "./locales";

const LOCALES = SUPPORTED_LOCALES;

/**
 * Convert component directory name to PascalCase
 * Example: "alert" → "Alert", "date-picker" → "DatePicker"
 */
function dirToComponentName(dirName: string): string {
  return dirName
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join("");
}

/**
 * Convert component directory name to camelCase for variable names
 * Example: "alert" → "alert", "date-picker" → "datePicker"
 */
function dirToVariableName(dirName: string): string {
  const parts = dirName.split("-");
  return (
    parts[0] +
    parts
      .slice(1)
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join("")
  );
}

/**
 * Extract message keys from a compiled locale file
 * The file exports: export default { "key": () => "...", ... }
 */
async function getMessageKeys(localePath: string): Promise<string[] | null> {
  try {
    const rawContent = await fs.readFile(localePath, "utf-8");
    // Strip template-literal interpolations like `${args.name}` first, so
    // their inner `}` doesn't prematurely terminate the [^}]+ match below
    // and silently drop later message keys.
    const content = rawContent.replace(/\$\{[^}]*\}/g, "");
    // Extract keys from export default { "key": ... } or { key: ... }
    const match = content.match(/export default\s*\{([^}]+)\}/s);
    if (!match) return null;

    const keys: string[] = [];
    // Match quoted keys: "key" or 'key', or unquoted identifiers: key
    // For unquoted identifiers, ensure they're followed by a value (arrow function, string, or template literal),
    // not a type annotation (like function parameters: args: Record<...>)
    // Lookahead ensures the colon is followed by a value, not a type
    const keyMatches = match[1].matchAll(
      /"([^"]+)":|'([^']+)':|([a-zA-Z_$][a-zA-Z0-9_$]*):\s*(?=[("'`])/g
    );
    for (const keyMatch of keyMatches) {
      // keyMatch[1] = quoted double, keyMatch[2] = quoted single, keyMatch[3] = unquoted
      const key = keyMatch[1] || keyMatch[2] || keyMatch[3];
      if (key) keys.push(key);
    }
    return keys;
  } catch {
    return null;
  }
}

/**
 * Recursively walk a root directory and return every descendant directory that
 * contains an `intl/` subdirectory. Used to support components and patterns
 * (which may be nested under subcategory directories like `fields/`).
 */
async function findDirsWithIntl(root: string): Promise<string[]> {
  const result: string[] = [];
  const stack: string[] = [root];
  while (stack.length > 0) {
    const current = stack.pop()!;
    let entries;
    try {
      entries = await fs.readdir(current, { withFileTypes: true });
    } catch {
      continue;
    }
    let hasIntl = false;
    for (const entry of entries) {
      if (!entry.isDirectory()) continue;
      const full = path.join(current, entry.name);
      if (entry.name === "intl") {
        hasIntl = true;
      } else {
        stack.push(full);
      }
    }
    if (hasIntl && current !== root) {
      result.push(current);
    }
  }
  return result;
}

async function generateDictionaries() {
  const nimbusSrcDir = path.join(__dirname, "../../nimbus/src");
  const nimbusComponentsDir = path.join(nimbusSrcDir, "components");
  const nimbusPatternsDir = path.join(nimbusSrcDir, "patterns");

  // Discover all directories with intl/ across components and patterns
  const componentPaths = [
    ...(await findDirsWithIntl(nimbusComponentsDir)),
    ...(await findDirsWithIntl(nimbusPatternsDir)),
  ];

  for (const componentPath of componentPaths) {
    const componentDir = path.basename(componentPath);
    const intlPath = path.join(componentPath, "intl");

    // Get available locale files
    const availableLocales = [];
    for (const locale of LOCALES) {
      const localePath = path.join(intlPath, `${locale.code}.ts`);
      try {
        await fs.access(localePath);
        availableLocales.push(locale);
      } catch {
        // Locale file doesn't exist, skip
      }
    }

    if (availableLocales.length === 0) {
      // Skip components with no locale files
      continue;
    }

    // Get message keys from first available locale (all locales should have same keys)
    const firstLocalePath = path.join(
      intlPath,
      `${availableLocales[0].code}.ts`
    );
    const messageKeys = await getMessageKeys(firstLocalePath);

    // Generate component names for file and variable naming
    const componentName = dirToComponentName(componentDir);
    const variableName = dirToVariableName(componentDir);
    const fileName = `${componentDir}.messages.ts`;
    const outputPath = path.join(componentPath, fileName);

    // Compute relative path to the normalize-messages util so nested directories
    // (e.g., patterns/actions/form-action-bar) work alongside top-level components.
    const normalizeMessagesUtil = path.join(
      nimbusSrcDir,
      "utils",
      "normalize-messages"
    );
    const normalizeMessagesRelative = path
      .relative(componentPath, normalizeMessagesUtil)
      .replace(/\\/g, "/");
    const normalizeMessagesImport = normalizeMessagesRelative.startsWith(".")
      ? normalizeMessagesRelative
      : `./${normalizeMessagesRelative}`;

    // Generate import statements for all available locale files
    const imports = availableLocales
      .map(
        (locale) =>
          `import ${variableName}Messages_${locale.importName} from "./intl/${locale.code}";`
      )
      .join("\n");

    // Generate dictionary entries mapping locale codes to normalized messages
    const dictionaryEntries = availableLocales
      .map(
        (locale) =>
          `  "${locale.code}": normalizeMessages(${variableName}Messages_${locale.importName}),`
      )
      .join("\n");

    // Generate union type for message keys
    const messageKeyType =
      messageKeys && messageKeys.length > 0
        ? messageKeys.map((key) => `"${key}"`).join(" | ")
        : "string";

    const fileContent = `/**
 * Pre-compiled localized messages for ${componentName} component
 *
 * Generated by scripts/generate-dictionaries.ts
 * DO NOT EDIT MANUALLY
 *
 * @see https://react-spectrum.adobe.com/react-aria/internationalization.html
 */

import { type LocalizedString, type LocalizedStrings } from "@internationalized/string";
import { normalizeMessages } from "${normalizeMessagesImport}";

// Pre-compiled message functions
${imports}

// Raw LocalizedStrings object for use with useLocalizedStringFormatter hook
export const ${variableName}MessagesStrings: LocalizedStrings<string, LocalizedString> = {
${dictionaryEntries}
} as LocalizedStrings<string, LocalizedString>;

/**
 * Available message keys for ${componentName} component
 */
export type ${componentName}MessageKey = ${messageKeyType};
`;

    // Format the entire file content with Prettier
    // Resolve Prettier config from project root
    const prettierConfig = await resolveConfig(process.cwd());
    const formattedContent = await format(fileContent, {
      ...prettierConfig,
      parser: "typescript",
    });

    await fs.writeFile(outputPath, formattedContent);
  }

  console.log(
    "✅ Dictionary generation complete! Output: packages/nimbus/src/components/*/*.messages.ts"
  );
}

generateDictionaries().catch(console.error);
