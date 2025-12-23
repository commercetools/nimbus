/**
 * Generate MessageDictionary files for each component - Step 4 of 4 in the i18n build pipeline
 *
 * Overview:
 * After compiling messages for each locale, we need to create a dictionary
 * file that imports all locale files and wraps them in a MessageDictionary.
 * This dictionary is what components will import and use at runtime.
 *
 * This is Step 4 of 4 in the i18n build pipeline:
 *   1. Transform - Transifex → ICU format
 *   2. Split - Group messages by component
 *   3. Compile - ICU → JavaScript functions
 *   4. Generate (this script) - Create MessageDictionary wrappers
 *
 * Input:  packages/nimbus/src/components/{component}/intl/*.ts (compiled locale files)
 * Output: packages/nimbus/src/components/{component}/{component}.messages.ts (dictionary)
 *
 * Process:
 *   1. Find all components with intl/ directories
 *   2. Read locale files to determine available message keys
 *   3. Generate dictionary file with imports and MessageDictionary
 *   4. Export message key types for TypeScript support
 *
 * @example
 * Generates alert.messages.ts:
 *   import { MessageDictionary, type LocalizedStrings } from "@internationalized/message";
 *   import en from "./intl/en";
 *   import de from "./intl/de";
 *   ...
 *   export const alertMessages = new MessageDictionary({
 *     "en": en,
 *     "de": de,
 *     "es": es,
 *     "fr-FR": fr,
 *     "pt-BR": pt
 *   });
 *   export type AlertMessageKey = "dismiss";
 */

import fs from "fs/promises";
import path from "path";
import { format, resolveConfig } from "prettier";

const LOCALES = [
  { code: "en", bcp47: "en-US", importName: "en" },
  { code: "de", bcp47: "de-DE", importName: "de" },
  { code: "es", bcp47: "es-ES", importName: "es" },
  { code: "fr-FR", bcp47: "fr-FR", importName: "fr" },
  { code: "pt-BR", bcp47: "pt-BR", importName: "pt" },
] as const;

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
    const content = await fs.readFile(localePath, "utf-8");
    // Extract keys from export default { "key": ... } or { key: ... }
    const match = content.match(/export default\s*\{([^}]+)\}/s);
    if (!match) return null;

    const keys: string[] = [];
    // Match quoted keys: "key" or 'key', or unquoted identifiers: key
    const keyMatches = match[1].matchAll(
      /"([^"]+)":|'([^']+)':|([a-zA-Z_$][a-zA-Z0-9_$]*):/g
    );
    for (const keyMatch of keyMatches) {
      const key = keyMatch[1] || keyMatch[2] || keyMatch[3];
      if (key) keys.push(key);
    }
    return keys;
  } catch {
    return null;
  }
}

/**
 * Check if a compiled locale file contains any message functions (messages with variables)
 * Messages with variables compile to functions: (args: Record<string, string | number>) => "..."
 * Plain messages compile to strings: "message"
 */
async function hasMessageFunctions(localePath: string): Promise<boolean> {
  try {
    const content = await fs.readFile(localePath, "utf-8");
    // Pattern matches function syntax: "key": (args: ...) => or "key": () =>
    return /\(args[\s\S]*?\)\s*=>|\(\)\s*=>/.test(content);
  } catch {
    return false;
  }
}

async function generateDictionaries() {
  const nimbusComponentsDir = path.join(
    __dirname,
    "../../nimbus/src/components"
  );

  // Get all component directories and find those with intl/ directories
  const componentDirs = await fs.readdir(nimbusComponentsDir);
  const componentsWithIntl: string[] = [];

  for (const dir of componentDirs) {
    const componentPath = path.join(nimbusComponentsDir, dir);
    const intlPath = path.join(componentPath, "intl");

    try {
      const stat = await fs.stat(intlPath);
      if (stat.isDirectory()) {
        componentsWithIntl.push(dir);
      }
    } catch {
      // intl/ doesn't exist, skip this component
    }
  }

  for (const componentDir of componentsWithIntl) {
    const componentPath = path.join(nimbusComponentsDir, componentDir);
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

    // Check if component has messages with variables (compile to functions)
    // Only need to check one locale since all should have the same structure
    const hasFunctions = await hasMessageFunctions(firstLocalePath);

    // Generate component names for file and variable naming
    const componentName = dirToComponentName(componentDir);
    const variableName = dirToVariableName(componentDir);
    const fileName = `${componentDir}.messages.ts`;
    const outputPath = path.join(componentPath, fileName);

    // Generate import statements for all available locale files
    const imports = availableLocales
      .map(
        (locale) =>
          `import ${variableName}Messages_${locale.importName} from "./intl/${locale.code}";`
      )
      .join("\n");

    // Generate dictionary entries mapping locale codes to imported messages
    const dictionaryEntries = availableLocales
      .map(
        (locale) =>
          `  "${locale.code}": ${variableName}Messages_${locale.importName},`
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

import { MessageDictionary${hasFunctions ? `, type LocalizedStrings` : ``} } from "@internationalized/message";

// Pre-compiled message functions
${imports}

${
  hasFunctions
    ? `/**
 * Type that allows both strings and functions for message values.
 * MessageDictionary accepts both at runtime, but LocalizedStrings only allows strings.
 */
type LocalizedStringsWithFunctions = {
  [lang: string]: {
    [key: string]: string | ((args: Record<string, string | number>) => string);
  };
};

`
    : ""
}/**
 * Localized string dictionary for ${componentName} component
 * Contains pre-compiled messages for all supported locales
 */
export const ${variableName}Messages = new MessageDictionary({
${dictionaryEntries}
}${hasFunctions ? ` as LocalizedStringsWithFunctions as LocalizedStrings` : ``});

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
