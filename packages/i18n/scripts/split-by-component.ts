/**
 * Split ICU messages by component
 *
 * Overview:
 * All translation messages are stored together in locale files (e.g., en.json),
 * but we need to compile them per component so each component can bundle its
 * own messages.
 * This script parses message keys following the pattern
 * "Nimbus.{Component}.{key}" and groups messages by component, creating
 * separate files for each component/locale combination.
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

interface ComponentMessages {
  [component: string]: Record<string, string>;
}

async function splitByComponent() {
  const icuDir = path.join(__dirname, "../.temp/icu");
  const outputDir = path.join(__dirname, "../.temp/by-component");
  await fs.mkdir(outputDir, { recursive: true });

  console.log("📦 Splitting messages by component...\n");

  const components: Set<string> = new Set();

  // Process each locale file
  for (const locale of LOCALES) {
    const icuPath = path.join(icuDir, `${locale}.json`);
    const icuData = JSON.parse(await fs.readFile(icuPath, "utf-8"));

    // Group messages by component
    const componentGroups: ComponentMessages = {};

    for (const [fullKey, value] of Object.entries(icuData)) {
      // Parse "Nimbus.{Component}.{key}"
      const match = fullKey.match(/^Nimbus\.([^.]+)\.(.+)$/);
      if (!match) {
        console.warn(`   ⚠️  Skipping invalid key: ${fullKey}`);
        continue;
      }

      const [, component, messageKey] = match;
      components.add(component);

      if (!componentGroups[component]) {
        componentGroups[component] = {};
      }

      componentGroups[component][messageKey] = value as string;
    }

    // Write component-specific files
    for (const [component, messages] of Object.entries(componentGroups)) {
      const componentDir = path.join(outputDir, component);
      await fs.mkdir(componentDir, { recursive: true });

      const outputPath = path.join(componentDir, `${locale}.json`);
      await fs.writeFile(outputPath, JSON.stringify(messages, null, 2) + "\n");
    }

    console.log(
      `   ✅ ${locale}: Split into ${Object.keys(componentGroups).length} components`
    );
  }

  console.log(`\n✅ Split complete! Found ${components.size} components`);
  console.log(`   Components: ${Array.from(components).sort().join(", ")}`);
}

splitByComponent().catch(console.error);
