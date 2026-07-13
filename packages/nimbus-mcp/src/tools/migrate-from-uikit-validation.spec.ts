import { describe, it, expect } from "vitest";
import { existsSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { getAllUiKitMigrations } from "../data/uikit-migration.js";

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

const STYLE_PROPS = new Set(["colorPalette"]);

const KNOWN_TYPE_ALIASES: Record<string, string[]> = {
  SemanticPalettesOnly: [
    "primary",
    "neutral",
    "info",
    "positive",
    "warning",
    "critical",
  ],
};

function resolveTypeFile(componentName: string): string | null {
  const direct = resolve(TYPES_DIR, `${componentName}.json`);
  if (existsSync(direct)) return direct;
  const root = resolve(TYPES_DIR, `${componentName}Root.json`);
  if (existsSync(root)) return root;
  return null;
}

async function loadTypeProps(
  componentName: string
): Promise<Record<
  string,
  { name: string; value?: Array<{ value: string }> }
> | null> {
  const filePath = resolveTypeFile(componentName);
  if (!filePath) return null;
  const raw = await readFile(filePath, "utf-8");
  const data = JSON.parse(raw);
  const result: Record<
    string,
    { name: string; value?: Array<{ value: string }> }
  > = {};
  for (const [key, val] of Object.entries(data.props ?? {})) {
    result[key] = (val as { type: { name: string } }).type;
  }
  return Object.keys(result).length > 0 ? result : null;
}

function extractValidValues(propType: {
  name: string;
  value?: Array<{ value: string }>;
}): string[] | null {
  const { name } = propType;
  if (name in KNOWN_TYPE_ALIASES) return KNOWN_TYPE_ALIASES[name];
  const cvMatch = name.match(/^ConditionalValue<(.+)>$/);
  if (cvMatch) {
    const values: string[] = [];
    const re = /"([^"]+)"/g;
    let m: RegExpExecArray | null;
    while ((m = re.exec(cvMatch[1])) !== null) values.push(m[1]);
    return values.length > 0 ? values : null;
  }
  if (name === "enum" && propType.value) {
    return propType.value.map((v) => v.value.replace(/^"|"$/g, ""));
  }
  return null;
}

function extractNimbusComponentName(
  nimbusEquivalent: string | null
): string | null {
  if (!nimbusEquivalent) return null;
  const name = nimbusEquivalent.split(/[+,]/)[0].trim().replace(/^<|>$/g, "");
  if (
    name === "Design tokens" ||
    name === "Material Icon Library" ||
    name === "Text + FormField"
  )
    return null;
  return name;
}

describe("migrate_from_uikit — type validation", () => {
  const migrations = getAllUiKitMigrations();

  it("every nimbusEquivalent that names a component has a matching type data file", async () => {
    const missing: string[] = [];
    for (const entry of migrations) {
      const componentName = extractNimbusComponentName(entry.nimbusEquivalent);
      if (!componentName) continue;
      if (!resolveTypeFile(componentName)) {
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
      const props = await loadTypeProps(componentName);
      if (!props) continue;

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
      const props = await loadTypeProps(componentName);
      if (!props) continue;

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
});
