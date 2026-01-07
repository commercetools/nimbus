/**
 * Generate LocalizedStringDictionary files for each component - Step 4 of 4 in the i18n build pipeline
 *
 * Overview:
 * After compiling messages for each locale, we need to create a dictionary
 * file that imports all locale files and wraps them in a LocalizedStringDictionary.
 * This dictionary is what components will import and use at runtime.
 *
 *
 * Input:  packages/nimbus/src/components/{component}/intl/*.ts (compiled locale files)
 * Output: packages/nimbus/src/components/{component}/{component}.messages.ts (dictionary)
 *
 * Process:
 *   1. Find all components with intl/ directories
 *   2. Read locale files to determine available message keys
 *   3. Generate dictionary file with imports and LocalizedStringDictionary
 *   4. Export message key types for TypeScript support
 *
 * @example
 * Generates alert.messages.ts:
 *   import { LocalizedStringDictionary } from "@internationalized/string";
 *   import en from "./intl/en";
 *   import de from "./intl/de";
 *   ...
 *   export const alertMessages = new LocalizedStringDictionary({
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

import { LocalizedStringDictionary, type LocalizedString, type LocalizedStrings } from "@internationalized/string";
import { normalizeMessages } from "../../utils/normalize-messages";

// Pre-compiled message functions
${imports}

/**
 * Normalizes BCP47 locale codes to match dictionary keys.
 * Extracts language code and maps to supported locales: "en", "de", "es", "fr-FR", "pt-BR"
 * 
 * This function is intentionally duplicated in each *.messages.ts file to enable optimal tree-shaking.
 * 
 */
function normalizeLocale(locale: string): string {
  const supportedLocales = new Set(["en", "de", "es", "fr-FR", "pt-BR"]);
  if (supportedLocales.has(locale)) return locale;
  
  const langMap: Record<string, string> = {
    en: "en",
    de: "de",
    es: "es",
    fr: "fr-FR",
    pt: "pt-BR",
  };
  
  const lang = locale.split(/[-_]/)[0].toLowerCase();
  return langMap[lang] ?? "en";
}

// Internal dictionary instance
const dictionary = new LocalizedStringDictionary<string, LocalizedString>({
${dictionaryEntries}
} as LocalizedStrings<string, LocalizedString>);

/**
 * Localized string dictionary for ${componentName} component
 * Contains pre-compiled messages for all supported locales
 * Automatically falls back to English (en) for unsupported locales
 */
export const ${variableName}Messages = {
  /**
   * Retrieves a localized message string.
   * 
   * Handles both simple and variable messages:
   * - Simple messages (no variables): getVariableLocale(key, locale)
   * - Variable messages: getVariableLocale(key, locale, { variableName: value })
   * 
   * For simple messages, args are optional and ignored.
   * For variable messages, args are required and interpolated.
   * 
   * Returns empty string if message not found.
   */
  getVariableLocale(
    key: string,
    locale: string,
    args?: Record<string, string | number>
  ): string {
    const normalizedLocale = normalizeLocale(locale);
    
    try {
      const message = dictionary.getStringForLocale(key, normalizedLocale);
      
      // If message is a function (has variables), call it with args
      if (typeof message === "function") {
        return message(args ?? {});
      }
      
      // If message is a string (simple message), return it directly
      if (typeof message === "string") {
        return message;
      }
    } catch {
      // Message not found, return empty string
    }
    
    return "";
  },
};

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
