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

function resolveTypeFile(componentName: string): string | null {
  const direct = resolve(TYPES_DIR, `${componentName}.json`);
  if (existsSync(direct)) return direct;
  const root = resolve(TYPES_DIR, `${componentName}Root.json`);
  if (existsSync(root)) return root;
  return null;
}

async function loadTypeData(
  componentName: string
): Promise<Record<string, { type: string }> | null> {
  const filePath = resolveTypeFile(componentName);
  if (!filePath) return null;
  const raw = await readFile(filePath, "utf-8");
  const data = JSON.parse(raw);
  const result: Record<string, { type: string }> = {};
  for (const [key, val] of Object.entries(data.props ?? {})) {
    result[key] = { type: (val as { type: { name: string } }).type.name };
  }
  return result;
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
  ) {
    return null;
  }
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

  it("migration prop references match live Nimbus type data", async () => {
    const propSnapshot: Record<string, Record<string, string>> = {};

    for (const entry of migrations) {
      const componentName = extractNimbusComponentName(entry.nimbusEquivalent);
      if (!componentName) continue;

      const typeData = await loadTypeData(componentName);
      if (!typeData) continue;

      const relevantProps: Record<string, string> = {};
      for (const [propName, propInfo] of Object.entries(typeData)) {
        if (
          [
            "ref",
            "unstyled",
            "css",
            "className",
            "style",
            "id",
            "slot",
            "as",
            "asChild",
            "render",
          ].includes(propName)
        ) {
          continue;
        }
        relevantProps[propName] = propInfo.type;
      }

      if (Object.keys(relevantProps).length > 0) {
        propSnapshot[componentName] = relevantProps;
      }
    }

    expect(propSnapshot).toMatchSnapshot();
  });

  it("Card migration references Card.Body, not Card.Content", () => {
    const cardEntry = migrations.find((e) => e.uiKitName === "Card");
    expect(cardEntry).toBeDefined();
    expect(cardEntry!.notes).toContain("Card.Body");
    expect(cardEntry!.notes).not.toContain("Card.Content");
    expect(cardEntry!.breakingChanges.join(" ")).toContain("Card.Body");
    expect(cardEntry!.breakingChanges.join(" ")).not.toContain("Card.Content");
  });

  it("Badge migration uses colorPalette, not tone", () => {
    const badgeEntry = migrations.find((e) => e.uiKitName === "Stamp");
    expect(badgeEntry).toBeDefined();
    expect(badgeEntry!.notes).toContain("colorPalette");
    expect(badgeEntry!.breakingChanges.join(" ")).not.toContain(
      "tone value 'critical' → 'danger'"
    );
  });

  it("Badge size values are valid (no 'sm')", () => {
    const badgeEntry = migrations.find((e) => e.uiKitName === "Stamp");
    expect(badgeEntry).toBeDefined();
    const allText =
      badgeEntry!.notes + " " + badgeEntry!.breakingChanges.join(" ");
    expect(allText).not.toMatch(/size='sm'|size="sm"|size=.sm./);
  });
});
