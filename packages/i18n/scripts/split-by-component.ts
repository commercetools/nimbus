/**
 * Split ICU messages by component - Step 2 of 4 in the i18n build pipeline
 *
 * Overview:
 * All translation messages are stored together in locale files (e.g., en.json),
 * but we need to compile them per component so each component can bundle its
 * own messages.
 * This script parses message keys following the pattern
 * "Nimbus.{Component}.{key}" and groups messages by component, creating
 * separate files for each component/locale combination.
 *
 * This is Step 2 of 4 in the i18n build pipeline:
 *   1. Transform - Transifex → ICU format
 *   2. Split - Group messages by component --> You are here
 *   3. Compile - ICU → JavaScript functions
 *   4. Generate - Create MessageDictionary wrappers
 *
 * Input:  .temp/icu/*.json (all messages per locale)
 * Output: .temp/by-component/{Component}/{locale}.json (messages grouped by component)
 *
 * Key parsing:
 *   Pattern: "Nimbus.{Component}.{key}"
 *   Example: "Nimbus.Alert.dismiss" → Component: "Alert", Key: "dismiss"
 *
 * @example
 * Input (.temp/icu/en.json):
 *   {
 *     "Nimbus.Alert.dismiss": "Dismiss",
 *     "Nimbus.Avatar.avatarLabel": "Avatar image for {fullName}",
 *     "Nimbus.Alert.title": "Alert"
 *   }
 *
 * Output (.temp/by-component/Alert/en.json):
 *   {
 *     "dismiss": "Dismiss",
 *     "title": "Alert"
 *   }
 *
 * Output (.temp/by-component/Avatar/en.json):
 *   {
 *     "avatarLabel": "Avatar image for {fullName}"
 *   }
 */

import fs from "fs/promises";
import path from "path";

const LOCALES = ["en", "de", "es", "fr-FR", "pt-BR"] as const;

/**
 * Component messages grouped by component name
 * Each component maps to its message keys and values
 */
interface ComponentMessages {
  [component: string]: Record<string, string>;
}

async function splitByComponent() {
  const icuDir = path.join(__dirname, "../.temp/icu");
  const outputDir = path.join(__dirname, "../.temp/by-component");
  await fs.mkdir(outputDir, { recursive: true });

  // Track all unique components found across all locales
  const components: Set<string> = new Set();

  // Process each locale file from the ICU transformation step
  for (const locale of LOCALES) {
    const icuPath = path.join(icuDir, `${locale}.json`);
    const icuData = JSON.parse(await fs.readFile(icuPath, "utf-8"));

    // Group messages by component name
    const componentGroups: ComponentMessages = {};

    for (const [fullKey, value] of Object.entries(icuData)) {
      // Parse message key: "Nimbus.{Component}.{key}" → extract Component and key
      const match = fullKey.match(/^Nimbus\.([^.]+)\.(.+)$/);
      if (!match) {
        console.warn(`⚠️  Skipping invalid key: ${fullKey}`);
        continue;
      }

      const [, component, messageKey] = match;
      components.add(component);

      // Initialize component group if it doesn't exist
      if (!componentGroups[component]) {
        componentGroups[component] = {};
      }

      // Store message with component-scoped key (removes "Nimbus.Component." prefix)
      componentGroups[component][messageKey] = value as string;
    }

    // Write component-specific files (ready for next step: compile-component-messages)
    for (const [component, messages] of Object.entries(componentGroups)) {
      const componentDir = path.join(outputDir, component);
      await fs.mkdir(componentDir, { recursive: true });

      const outputPath = path.join(componentDir, `${locale}.json`);
      await fs.writeFile(outputPath, JSON.stringify(messages, null, 2) + "\n");
    }
  }

  console.log("✅ Split complete! Output: .temp/by-component/");
}

splitByComponent().catch(console.error);
