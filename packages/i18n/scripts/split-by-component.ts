/**
 * Transform and split messages by component - Step 1 of 3 in the i18n build pipeline
 *
 * Overview:
 * This script combines two operations:
 * 1. Transforms Transifex format to simple key-value pairs (extracts "string" field)
 * 2. Groups messages by component (parses "Nimbus.{Component}.{key}" IDs)
 *
 * Transifex stores translations with metadata (developer_comment, string, etc.),
 * but @internationalized/string-compiler needs simple key-value pairs. This script
 * extracts the "string" field and immediately groups messages by component in memory.
 *
 * Input:  packages/i18n/data/*.json (Transifex format)
 * Output: .temp/by-component/{Component}/{locale}.json (messages grouped by component)
 *
 * Format transformation:
 *   Transifex: { "key": { "string": "value", "developer_comment": "..." } }
 *   ICU (in-memory): { "key": "value" }
 *   Component split: {Component}/{locale}.json with component-scoped keys
 *
 * Key parsing:
 *   Pattern: "Nimbus.{Component}.{key}"
 *   Example: "Nimbus.Alert.dismiss" → Component: "Alert", Key: "dismiss"
 *
 * @example
 * Input (data/en.json):
 *   {
 *     "Nimbus.Alert.dismiss": { "string": "Dismiss", "developer_comment": "..." },
 *     "Nimbus.Avatar.avatarLabel": { "string": "Avatar image for {fullName}", ... }
 *   }
 *
 * Output (.temp/by-component/Alert/en.json):
 *   {
 *     "dismiss": "Dismiss"
 *   }
 *
 * Output (.temp/by-component/Avatar/en.json):
 *   {
 *     "avatarLabel": "Avatar image for {fullName}"
 *   }
 */

import fs from "fs/promises";
import path from "path";
import { LOCALE_CODES } from "./locales";

const LOCALES = LOCALE_CODES;

/**
 * Transifex message structure from the translation files
 * The "string" field contains the actual translation value
 */
type TransifexMessage = {
  string: string;
  developer_comment?: string;
};

/**
 * Component messages grouped by component name
 * Each component maps to its message keys and values
 */
interface ComponentMessages {
  [component: string]: Record<string, string>;
}

async function transformAndSplitByComponent() {
  const dataDir = path.join(__dirname, "../data");
  const outputDir = path.join(__dirname, "../.temp/by-component");
  await fs.mkdir(outputDir, { recursive: true });

  // Process each locale file
  for (const locale of LOCALES) {
    const inputPath = path.join(dataDir, `${locale}.json`);

    // Step 1: Read and transform Transifex format to ICU format (in memory)
    const transifexData = JSON.parse(
      await fs.readFile(inputPath, "utf-8")
    ) as Record<string, TransifexMessage>;

    // Transform to ICU format: extract "string" field from each message
    // This removes metadata and creates simple key-value pairs
    const icuData: Record<string, string> = {};
    for (const [key, value] of Object.entries(transifexData)) {
      icuData[key] = value.string;
    }

    // Step 2: Group messages by component name (in memory)
    const componentGroups: ComponentMessages = {};

    for (const [fullKey, value] of Object.entries(icuData)) {
      // Parse message key: "Nimbus.{Component}.{key}" → extract Component and key
      const match = fullKey.match(/^Nimbus\.([^.]+)\.(.+)$/);
      if (!match) {
        console.warn(`⚠️  Skipping invalid key: ${fullKey}`);
        continue;
      }

      const [, component, messageKey] = match;

      // Initialize component group if it doesn't exist
      if (!componentGroups[component]) {
        componentGroups[component] = {};
      }

      // Store message with component-scoped key (removes "Nimbus.Component." prefix)
      componentGroups[component][messageKey] = value;
    }

    // Write component-specific files (ready for next step: compile-component-messages)
    for (const [component, messages] of Object.entries(componentGroups)) {
      const componentDir = path.join(outputDir, component);
      await fs.mkdir(componentDir, { recursive: true });

      const outputPath = path.join(componentDir, `${locale}.json`);
      await fs.writeFile(outputPath, JSON.stringify(messages, null, 2) + "\n");
    }
  }

  console.log("✅ Transform and split complete. Output: .temp/by-component/");
}

transformAndSplitByComponent().catch(console.error);
