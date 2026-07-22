import { describe, it, expect } from "vitest";
import { existsSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { getAllUiKitMigrations } from "../data/uikit-migration.js";
import {
  STYLE_PROPS,
  extractNimbusComponentName,
  extractValidValues,
  loadTypeData,
  resolveTypeFile,
} from "../../scripts/validation-helpers.js";

const __dirname = dirname(fileURLToPath(import.meta.url));

function findPackageRoot(): string {
  let dir = __dirname;
  while (dir !== dirname(dir)) {
    if (existsSync(resolve(dir, "package.json"))) return dir;
    dir = dirname(dir);
  }
  return __dirname;
}

const TYPES_DIR = resolve(findPackageRoot(), "data/docs/types");

describe("migrate_from_uikit — type validation", () => {
  const migrations = getAllUiKitMigrations();

  it("every nimbusEquivalent that names a component has a matching type data file", async () => {
    const missing: string[] = [];
    for (const entry of migrations) {
      const componentName = extractNimbusComponentName(entry.nimbusEquivalent);
      if (!componentName) continue;
      if (!resolveTypeFile(TYPES_DIR, componentName)) {
        missing.push(
          `${entry.uiKitName} → ${componentName} (from "${entry.nimbusEquivalent}")`
        );
      }
    }
    expect(missing).toEqual([]);
  });

  it("every nimbusProp in propMappings exists on the target component", async () => {
    const errors: string[] = [];
    for (const entry of migrations) {
      if (!entry.propMappings) continue;
      const componentName = extractNimbusComponentName(entry.nimbusEquivalent);
      if (!componentName) continue;
      const props = await loadTypeData(TYPES_DIR, componentName);
      if (Object.keys(props).length === 0) continue;

      for (const mapping of entry.propMappings) {
        if (!mapping.nimbusProp) continue;
        if (STYLE_PROPS.has(mapping.nimbusProp)) continue;
        if (!(mapping.nimbusProp in props)) {
          errors.push(
            `${entry.uiKitName} → ${componentName}: nimbusProp "${mapping.nimbusProp}" not found`
          );
        }
      }
    }
    expect(errors).toEqual([]);
  });

  it("every valueMapping.to is valid for the nimbusProp type union", async () => {
    const errors: string[] = [];
    for (const entry of migrations) {
      if (!entry.propMappings) continue;
      const componentName = extractNimbusComponentName(entry.nimbusEquivalent);
      if (!componentName) continue;
      const props = await loadTypeData(TYPES_DIR, componentName);
      if (Object.keys(props).length === 0) continue;

      for (const mapping of entry.propMappings) {
        if (!mapping.nimbusProp || !props[mapping.nimbusProp]) continue;
        const validValues = extractValidValues(props[mapping.nimbusProp]);
        if (!validValues) continue;

        if (mapping.fixedValue && !validValues.includes(mapping.fixedValue)) {
          errors.push(
            `${entry.uiKitName}: fixedValue "${mapping.fixedValue}" invalid for ${mapping.nimbusProp} (valid: ${validValues.join(", ")})`
          );
        }

        if (mapping.valueMapping) {
          for (const vm of mapping.valueMapping) {
            if (!validValues.includes(vm.to)) {
              errors.push(
                `${entry.uiKitName}: "${vm.from}" → "${vm.to}" invalid for ${mapping.nimbusProp} (valid: ${validValues.join(", ")})`
              );
            }
          }
        }
      }
    }
    expect(errors).toEqual([]);
  });

  it("value-mapping changeType always has valueMapping or fixedValue", () => {
    const errors: string[] = [];
    for (const entry of migrations) {
      if (!entry.propMappings) continue;
      for (const mapping of entry.propMappings) {
        if (
          mapping.changeType === "value-mapping" &&
          !mapping.valueMapping &&
          !mapping.fixedValue
        ) {
          errors.push(
            `${entry.uiKitName}: ${mapping.uiKitProp} → ${mapping.nimbusProp} has changeType "value-mapping" but no valueMapping or fixedValue`
          );
        }
      }
    }
    expect(errors).toEqual([]);
  });

  it("Card migration references Card.Body, not Card.Content", () => {
    const cardEntry = migrations.find((e) => e.uiKitName === "Card");
    expect(cardEntry).toBeDefined();
    expect(cardEntry!.notes).toContain("Card.Body");
    expect(cardEntry!.notes).not.toContain("Card.Content");
  });

  it("Badge migration uses colorPalette, not tone", () => {
    const badgeEntry = migrations.find((e) => e.uiKitName === "Stamp");
    expect(badgeEntry).toBeDefined();
    expect(badgeEntry!.notes).toContain("colorPalette");
    expect(badgeEntry!.propMappings).toBeDefined();
    const toneProp = badgeEntry!.propMappings!.find(
      (m) => m.uiKitProp === "tone"
    );
    expect(toneProp?.nimbusProp).toBe("colorPalette");
  });

  it("Badge size values are valid (no 'sm')", () => {
    const badgeEntry = migrations.find((e) => e.uiKitName === "Stamp");
    expect(badgeEntry).toBeDefined();
    const sizeProp = badgeEntry!.propMappings!.find(
      (m) => m.uiKitProp === "isCondensed"
    );
    expect(sizeProp?.nimbusProp).toBe("size");
    expect(sizeProp?.valueMapping).toBeDefined();
    const toValues = sizeProp!.valueMapping!.map((vm) => vm.to);
    expect(toValues).not.toContain("sm");
  });

  it("every propMigrations[].from is a non-empty string", () => {
    const errors: string[] = [];
    for (const entry of migrations) {
      if (!entry.propMigrations) continue;
      for (const pm of entry.propMigrations) {
        if (!pm.from || typeof pm.from !== "string") {
          errors.push(
            `${entry.uiKitName}: propMigrations entry has invalid 'from': ${JSON.stringify(pm.from)}`
          );
        }
        if (!pm.to || typeof pm.to !== "string") {
          errors.push(
            `${entry.uiKitName}: propMigrations entry has invalid 'to': ${JSON.stringify(pm.to)}`
          );
        }
      }
    }
    expect(errors).toEqual([]);
  });

  it("every codeReduction has required fields", () => {
    const errors: string[] = [];
    for (const entry of migrations) {
      if (!entry.codeReduction) continue;
      if (!entry.codeReduction.type) {
        errors.push(`${entry.uiKitName}: codeReduction missing 'type'`);
      }
      if (
        !entry.codeReduction.deletableFiles ||
        entry.codeReduction.deletableFiles.length === 0
      ) {
        errors.push(
          `${entry.uiKitName}: codeReduction missing or empty 'deletableFiles'`
        );
      }
      if (!entry.codeReduction.rationale) {
        errors.push(`${entry.uiKitName}: codeReduction missing 'rationale'`);
      }
    }
    expect(errors).toEqual([]);
  });

  it("Stamp has propMigrations for slot-prop collapse", () => {
    const stampEntry = migrations.find((e) => e.uiKitName === "Stamp");
    expect(stampEntry).toBeDefined();
    expect(stampEntry!.propMigrations).toBeDefined();
    expect(stampEntry!.propMigrations!.length).toBe(2);

    const labelMigration = stampEntry!.propMigrations!.find(
      (m) => m.from === "label"
    );
    expect(labelMigration).toBeDefined();
    expect(labelMigration!.to).toBe("children");
  });

  it("DataTable has codeReduction for selection-model-collapse", () => {
    const dtEntry = migrations.find((e) => e.uiKitName === "DataTable");
    expect(dtEntry).toBeDefined();
    expect(dtEntry!.codeReduction).toBeDefined();
    expect(dtEntry!.codeReduction!.type).toBe("selection-model-collapse");
    expect(dtEntry!.codeReduction!.deletableFiles.length).toBeGreaterThan(0);
  });
});
