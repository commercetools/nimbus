/**
 * Transform Transifex format → ICU MessageFormat
 *
 * Overview:
 * Transifex stores translations with metadata (developer_comment, string, etc.),
 * but @internationalized/string-compiler needs simple key-value pairs.
 * This script extracts the "string" field from each message and flattens
 * the structure to prepare data for compilation.
 *
 * Input:  packages/i18n/data/*.json (Transifex format)
 * Output: .temp/icu/*.json (ICU MessageFormat)
 *
 * Format transformation:
 *   Transifex: { "key": { "string": "value", "developer_comment": "..." } }
 *   ICU:       { "key": "value" }
 *
 * @example
 * Input:  { "Nimbus.Alert.dismiss": { "string": "Dismiss", "developer_comment": "..." } }
 * Output: { "Nimbus.Alert.dismiss": "Dismiss" }
 */

import fs from "fs/promises";
import path from "path";

const LOCALES = ["en", "de", "es", "fr-FR", "pt-BR"] as const;

async function transformToICU() {
  const dataDir = path.join(__dirname, "../data");
  const tempDir = path.join(__dirname, "../.temp/icu");
  await fs.mkdir(tempDir, { recursive: true });

  console.log("🔄 Transforming Transifex format → ICU format...\n");

  for (const locale of LOCALES) {
    const inputPath = path.join(dataDir, `${locale}.json`);
    const outputPath = path.join(tempDir, `${locale}.json`);

    // Read Transifex format
    const transifexData = JSON.parse(await fs.readFile(inputPath, "utf-8"));

    // Transform to ICU format (extract "string" field)
    const icuData: Record<string, string> = {};
    for (const [key, value] of Object.entries(transifexData)) {
      icuData[key] = (value as any).string;
    }

    // Write ICU format
    await fs.writeFile(outputPath, JSON.stringify(icuData, null, 2) + "\n");

    console.log(`   ✅ ${locale}: ${Object.keys(icuData).length} messages`);
  }

  console.log(`\n✅ Transformation complete! Output: .temp/icu/`);
}

transformToICU().catch(console.error);
