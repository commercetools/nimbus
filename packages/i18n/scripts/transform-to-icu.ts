/**
 * Transform Transifex format → Simple key-value pairs - Step 1 of 4 in the i18n build pipeline
 *
 * Overview:
 * Transifex stores translations with metadata (developer_comment, string, etc.),
 * but @internationalized/string-compiler needs simple key-value pairs.
 * This script extracts the "string" field from each message and flattens
 * the structure to prepare data for compilation.
 *
 * Note: The output format is compatible with ICU MessageFormat (which accepts
 * both plain strings and ICU syntax like {variable}). Simple strings remain
 * plain text; variable strings already contain ICU syntax from the source.
 *
 * Input:  packages/i18n/data/*.json (Transifex format)
 * Output: .temp/icu/*.json (Simple key-value pairs, ICU-compatible)
 *
 * Format transformation:
 *   Transifex: { "key": { "string": "value", "developer_comment": "..." } }
 *   Output:    { "key": "value" }
 *
 * @example
 * Input:  { "Nimbus.Alert.dismiss": { "string": "Dismiss", "developer_comment": "..." } }
 * Output: { "Nimbus.Alert.dismiss": "Dismiss" }
 *
 * @example (with ICU syntax)
 * Input:  { "Nimbus.Avatar.avatarLabel": { "string": "Avatar image for {fullName}", ... } }
 * Output: { "Nimbus.Avatar.avatarLabel": "Avatar image for {fullName}" }
 */

import fs from "fs/promises";
import path from "path";

const LOCALES = ["en", "de", "es", "fr-FR", "pt-BR"] as const;

/**
 * Transifex message structure from the translation files
 * The "string" field contains the actual translation value
 */
type TransifexMessage = {
  string: string;
  developer_comment?: string;
};

async function transformToICU() {
  const dataDir = path.join(__dirname, "../data");
  const tempDir = path.join(__dirname, "../.temp/icu");
  await fs.mkdir(tempDir, { recursive: true });

  for (const locale of LOCALES) {
    const inputPath = path.join(dataDir, `${locale}.json`);
    const outputPath = path.join(tempDir, `${locale}.json`);

    // Read Transifex format file
    const transifexData = JSON.parse(
      await fs.readFile(inputPath, "utf-8")
    ) as Record<string, TransifexMessage>;

    // Transform to ICU format: extract "string" field from each message
    // This removes metadata and creates simple key-value pairs for the compiler
    const icuData: Record<string, string> = {};
    for (const [key, value] of Object.entries(transifexData)) {
      icuData[key] = value.string;
    }

    // Write ICU format file (ready for next step: split-by-component)
    await fs.writeFile(outputPath, JSON.stringify(icuData, null, 2) + "\n");
  }

  console.log("✅ Transformation complete. Output: .temp/icu/");
}

transformToICU().catch(console.error);
