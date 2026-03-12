#!/usr/bin/env tsx

/**
 * Extract i18n messages from .i18n.ts files and output Transifex JSON format.
 * Simply imports the files and reads the exported messages object.
 */

import { glob } from "glob";
import * as fs from "fs";
import * as path from "path";
import { LOCALE_CODES } from "./locales";

// Type definitions for message descriptors in .i18n.ts files
type MessageDescriptor = {
  id: string;
  defaultMessage: string;
  description: string;
};

// Transifex JSON output format
type TransifexMessage = {
  string: string;
  developer_comment: string;
};

type TransifexOutput = {
  [id: string]: TransifexMessage;
};

async function extractMessages() {
  // Find all .i18n.ts files
  console.log("🔍 Scanning for .i18n.ts files...");

  const pattern = "{packages,src/components}/**/*.i18n.ts";
  const files = await glob(pattern, {
    cwd: process.cwd(),
    absolute: true,
  });

  console.log(`📄 Found ${files.length} .i18n.ts files`);

  const output: TransifexOutput = {};
  let errorCount = 0;

  // Process each file
  for (const file of files) {
    try {
      // Dynamically import the .i18n.ts file
      const module = await import(file);
      const messages = module.messages;

      if (!messages || typeof messages !== "object") {
        throw new Error("No messages object exported");
      }

      // Convert each message to Transifex format
      for (const [key, descriptor] of Object.entries(messages)) {
        const msg = descriptor as MessageDescriptor;

        if (!msg.id || !msg.defaultMessage || !msg.description) {
          throw new Error(`Invalid message "${key}": missing required fields`);
        }

        output[msg.id] = {
          developer_comment: msg.description,
          string: msg.defaultMessage,
        };
      }

      console.log(
        `  ✓ ${path.relative(process.cwd(), file)} (${Object.keys(messages).length} messages)`
      );
    } catch (error) {
      errorCount++;
      console.error(`  ✗ ${path.relative(process.cwd(), file)}`);
      console.error(
        `    Error: ${error instanceof Error ? error.message : String(error)}`
      );
    }
  }

  // Exit if any errors occurred
  if (errorCount > 0) {
    console.error(`\n❌ Failed to extract from ${errorCount} file(s)`);
    process.exit(1);
  }

  // Sort output alphabetically for consistent diffs
  const sortedOutput: TransifexOutput = {};
  for (const key of Object.keys(output).sort()) {
    sortedOutput[key] = output[key];
  }

  // Write to core.json
  const outputPath = path.join(process.cwd(), "packages/i18n/data/core.json");
  fs.writeFileSync(outputPath, JSON.stringify(sortedOutput, null, 2) + "\n");

  console.log(
    `\n✅ Extracted ${Object.keys(output).length} messages to ${path.relative(process.cwd(), outputPath)}`
  );

  // Propagate new messages to locale data files so the build pipeline can find them
  const dataDir = path.join(process.cwd(), "packages/i18n/data");
  let propagatedCount = 0;

  for (const locale of LOCALE_CODES) {
    const localePath = path.join(dataDir, `${locale}.json`);
    let localeData: TransifexOutput = {};

    if (fs.existsSync(localePath)) {
      localeData = JSON.parse(fs.readFileSync(localePath, "utf-8"));
    }

    let added = 0;
    for (const [key, value] of Object.entries(sortedOutput)) {
      if (!(key in localeData)) {
        localeData[key] = value;
        added++;
      }
    }

    if (added > 0) {
      // Sort and write back
      const sorted: TransifexOutput = {};
      for (const k of Object.keys(localeData).sort()) {
        sorted[k] = localeData[k];
      }
      fs.writeFileSync(localePath, JSON.stringify(sorted, null, 2) + "\n");
      console.log(`  📝 ${locale}.json: added ${added} new message(s)`);
      propagatedCount += added;
    }
  }

  if (propagatedCount > 0) {
    console.log(
      `\n📦 Propagated new messages to locale files (English defaults until translated)`
    );
  }
}

// Run extraction
extractMessages().catch((error) => {
  console.error("❌ Extraction failed:", error);
  process.exit(1);
});
