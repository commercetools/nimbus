#!/usr/bin/env node

import { readFileSync, writeFileSync, mkdirSync, existsSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

/**
 * Translation Script for Nimbus via DeepL API
 *
 * https://developers.deepl.com/docs/getting-started/intro
 * 
 *  This script translates English strings from core.json to any target language using DeepL API
 * and updates the target language file while preserving developer comments and cleaning up orphaned translations.
 *
 * Usage: For now, please see `packages/nimbus/i18n/README` for additional details.

 */

interface TranslationItem {
  developer_comment: string;
  string: string;
}

interface TranslationFile {
  [key: string]: TranslationItem;
}

interface DeepLTranslation {
  text: string;
}

interface DeepLResponse {
  translations: DeepLTranslation[];
}

// Language code mapping: file name -> DeepL language code
const LANGUAGE_MAPPING = {
  de: "DE",
  es: "ES",
  "pt-BR": "PT-BR",
  "fr-FR": "FR",
} as const;

type SupportedLanguage = keyof typeof LANGUAGE_MAPPING;

const DEEPL_API_KEY = process.env.DEEPL_API_KEY;
const I18N_DIR = join(__dirname, "../i18n/translated-data");
const CORE_FILE = join(I18N_DIR, "core.json");

const DEEPL_API_URL = "https://api-free.deepl.com/v2/translate";
//TODO: will probably need to update to:"https://api.deepl.com/v2/translate";

// Ensure directories exist
function ensureDirectoriesExist(): void {
  if (!existsSync(I18N_DIR)) {
    mkdirSync(I18N_DIR, { recursive: true });
  }
}

async function translateWithDeepL(
  texts: string[],
  targetLang: string
): Promise<string[]> {
  if (!DEEPL_API_KEY) {
    throw new Error("DEEPL_API_KEY environment variable is required");
  }

  // Modern JSON request format as per DeepL API documentation
  const requestBody = {
    text: texts,
    source_lang: "EN",
    target_lang: targetLang,
  };

  const response = await fetch(DEEPL_API_URL, {
    method: "POST",
    headers: {
      Authorization: `DeepL-Auth-Key ${DEEPL_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(requestBody),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`DeepL API error: ${response.status} ${error}`);
  }

  const data: DeepLResponse = await response.json();
  return data.translations.map((t) => t.text);
}

async function translateToLanguage(
  targetLang: SupportedLanguage
): Promise<void> {
  try {
    // Ensure directories exist before proceeding
    ensureDirectoriesExist();

    const deeplLangCode = LANGUAGE_MAPPING[targetLang];
    const targetFile = join(I18N_DIR, `${targetLang}.json`);

    console.log(`🔄 Reading translation files for ${targetLang}...`);

    // Read source English strings
    const coreData: TranslationFile = JSON.parse(
      readFileSync(CORE_FILE, "utf8")
    );

    // Read or create target language file
    let targetData: TranslationFile = {};
    try {
      targetData = JSON.parse(readFileSync(targetFile, "utf8"));
    } catch (error) {
      console.log(`📝 Creating new ${targetLang}.json file...`);
      // File doesn't exist, will be created
    }

    // Extract English strings that need translation
    const englishStrings: string[] = [];
    const messageKeys: string[] = [];

    for (const [key, value] of Object.entries(coreData)) {
      // Check if translation is needed: missing key, empty string, or same as English
      const needsTranslation =
        !targetData[key] || // Missing target language entry
        !targetData[key].string || // Empty string
        targetData[key].string.trim() === "" || // Whitespace only
        targetData[key].string === value.string; // Same as English (not translated)

      if (needsTranslation) {
        englishStrings.push(value.string);
        messageKeys.push(key);
      }
    }

    // Check if cleanup is needed even when no translations are required
    const shouldCleanup = Object.keys(targetData).some((key) => !coreData[key]);

    if (englishStrings.length === 0 && !shouldCleanup) {
      console.log(`No strings detected to translate to ${targetLang}.`);
      return;
    }

    if (englishStrings.length === 0 && shouldCleanup) {
      console.log(
        `No new translations needed, only cleaning up orphaned strings.`
      );
    }

    let translations: string[] = [];

    if (englishStrings.length > 0) {
      console.log(
        `Translating ${englishStrings.length} strings to ${targetLang}.`
      );
      console.log("Strings to translate:", englishStrings);

      translations = await translateWithDeepL(englishStrings, deeplLangCode);

      console.log("Received translations:", translations);
    }

    // Create fresh target data synced with core.json (removes orphaned translations)
    const updatedTargetData: TranslationFile = {};

    // Copy all keys from core.json, preserving existing translations where possible
    for (const [key, coreValue] of Object.entries(coreData)) {
      if (messageKeys.includes(key)) {
        // This key needed translation - use new translation
        const translationIndex = messageKeys.indexOf(key);
        updatedTargetData[key] = {
          developer_comment: coreValue.developer_comment,
          string: translations[translationIndex],
        };
      } else {
        // This key exists and was already translated - preserve existing translation
        updatedTargetData[key] = {
          developer_comment: coreValue.developer_comment,
          string: targetData[key]?.string || coreValue.string, // Fallback to English if missing
        };
      }
    }

    // Log cleanup if any keys were removed
    const oldKeys = Object.keys(targetData);
    const newKeys = Object.keys(updatedTargetData);
    const removedKeys = oldKeys.filter((key) => !newKeys.includes(key));

    if (removedKeys.length > 0) {
      console.log(`Cleaned up ${removedKeys.length} orphaned translations:`);
      removedKeys.forEach((key) => console.log(`  - ${key}`));
    }

    // Write updated target language file
    writeFileSync(
      targetFile,
      JSON.stringify(updatedTargetData, null, 2) + "\n"
    );

    console.log(
      `Successfully updated ${targetLang}.json with translations and cleanup.`
    );

    if (englishStrings.length > 0) {
      console.log(
        `\nTranslated ${englishStrings.length} strings to ${targetLang}`
      );
    }
  } catch (error) {
    console.error("❌ Translation failed:", (error as Error).message);

    if ((error as Error).message.includes("DEEPL_API_KEY")) {
      console.log(
        "\n Review documentation: https://developers.deepl.com/docs/getting-started/auth"
      );
    }
    process.exit(1);
  }
}

// Parse command line arguments
const targetLang = (process.argv[2] as SupportedLanguage) || "fr-FR";

// Validate language support
if (!LANGUAGE_MAPPING[targetLang]) {
  console.error(`❌ Unsupported language: ${targetLang}`);
  console.log(
    "\nSupported languages: https://developers.deepl.com/docs/getting-started/supported-languages"
  );
  process.exit(1);
}

// Run the translation
console.log(`🚀 Starting translation to ${targetLang}...`);
translateToLanguage(targetLang).catch(console.error);
