import { existsSync, readFileSync } from "node:fs";
import { readFile } from "node:fs/promises";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { createRequire } from "node:module";
import ts from "typescript";
import { getAllUiKitMigrations } from "../src/data/uikit-migration.js";
import type { PropMapping } from "../src/types.js";

const __dirname = dirname(fileURLToPath(import.meta.url));
const DATA_DIR = resolve(__dirname, "../data");
const TYPES_DIR = resolve(DATA_DIR, "docs/types");

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

interface ValidationError {
  entry: string;
  prop: string;
  message: string;
}

function resolveTypeFile(componentName: string): string | null {
  const fileName = componentName.replace(/\./g, "");
  const direct = resolve(TYPES_DIR, `${fileName}.json`);
  const root = resolve(TYPES_DIR, `${fileName}Root.json`);
  if (existsSync(root)) {
    const rootData = JSON.parse(readFileSync(root, "utf-8"));
    if (Object.keys(rootData.props ?? {}).length > 0) return root;
  }
  if (existsSync(direct)) return direct;
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

function extractValidValues(propType: {
  name: string;
  value?: Array<{ value: string }>;
  raw?: string;
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

async function loadTypeData(
  componentName: string
): Promise<Record<string, { name: string; value?: Array<{ value: string }> }>> {
  const filePath = resolveTypeFile(componentName);
  if (!filePath) return {};
  const raw = await readFile(filePath, "utf-8");
  const data = JSON.parse(raw);
  const result: Record<
    string,
    { name: string; value?: Array<{ value: string }> }
  > = {};
  for (const [key, val] of Object.entries(data.props ?? {})) {
    result[key] = (val as { type: { name: string } }).type;
  }
  return result;
}

function validatePropMapping(
  entryName: string,
  mapping: PropMapping,
  nimbusProps: Record<
    string,
    { name: string; value?: Array<{ value: string }> }
  >
): ValidationError[] {
  const errors: ValidationError[] = [];

  if (mapping.nimbusProp === null) return errors;
  if (mapping.uiKitProp === "_component") {
    // Fixed value injection — validate the target prop exists
  }

  const propType = nimbusProps[mapping.nimbusProp];
  if (!propType && !STYLE_PROPS.has(mapping.nimbusProp)) {
    errors.push({
      entry: entryName,
      prop: mapping.nimbusProp,
      message: `nimbusProp "${mapping.nimbusProp}" does not exist on the component. Available: ${Object.keys(nimbusProps).join(", ")}`,
    });
    return errors;
  }

  if (!propType) return errors;

  const validValues = extractValidValues(propType);
  if (!validValues) return errors;

  if (mapping.fixedValue && !validValues.includes(mapping.fixedValue)) {
    errors.push({
      entry: entryName,
      prop: mapping.nimbusProp,
      message: `fixedValue "${mapping.fixedValue}" is not valid. Valid values: ${validValues.join(", ")}`,
    });
  }

  if (mapping.valueMapping) {
    for (const vm of mapping.valueMapping) {
      if (!validValues.includes(vm.to)) {
        errors.push({
          entry: entryName,
          prop: mapping.nimbusProp,
          message: `valueMapping "${vm.from}" → "${vm.to}" — target "${vm.to}" is not valid. Valid values: ${validValues.join(", ")}`,
        });
      }
    }
  }

  return errors;
}

function buildUiKitPropsMap(): Map<string, Set<string>> {
  const require = createRequire(
    new URL("file://" + resolve(__dirname, "../package.json"))
  );

  let barrelPath: string;
  try {
    barrelPath = require.resolve("@commercetools-frontend/ui-kit");
  } catch {
    return new Map();
  }

  const typesPath = barrelPath.replace(".cjs.js", ".cjs.d.ts");
  if (!existsSync(typesPath)) return new Map();

  const program = ts.createProgram([typesPath], {
    target: ts.ScriptTarget.ES2020,
    module: ts.ModuleKind.CommonJS,
    moduleResolution: ts.ModuleResolutionKind.Node10,
    declaration: true,
    baseUrl: dirname(barrelPath),
  });

  const checker = program.getTypeChecker();
  const sf = program.getSourceFile(typesPath);
  if (!sf) return new Map();

  const sym = checker.getSymbolAtLocation(sf);
  if (!sym) return new Map();

  const allExports = checker.getExportsOfModule(sym);
  const result = new Map<string, Set<string>>();

  for (const exp of allExports) {
    const name = exp.getName();
    if (name.startsWith("_") || name[0] !== name[0].toUpperCase()) continue;

    const type = checker.getTypeOfSymbol(exp);
    const callSigs = type.getCallSignatures();
    if (callSigs.length > 0) {
      const params = callSigs[0].getParameters();
      if (params.length > 0) {
        const paramType = checker.getTypeOfSymbol(params[0]);
        const props = new Set(
          paramType.getProperties().map((p) => p.getName())
        );
        if (props.size > 0) result.set(name, props);
      }
    }
  }

  return result;
}

function validateUiKitProps(
  migrations: ReturnType<typeof getAllUiKitMigrations>
): ValidationError[] {
  const propsMap = buildUiKitPropsMap();
  if (propsMap.size === 0) {
    console.log(
      "[validate] ⚠ @commercetools-frontend/ui-kit not installed or types not found, skipping UIKit prop validation"
    );
    return [];
  }

  const errors: ValidationError[] = [];
  let validated = 0;

  for (const entry of migrations) {
    if (!entry.propMappings || entry.propMappings.length === 0) continue;

    const uikitProps = propsMap.get(entry.uiKitName);
    if (!uikitProps) continue;

    validated++;
    for (const mapping of entry.propMappings) {
      if (mapping.uiKitProp === "_component") continue;
      if (mapping.uiKitProp === "children") continue;
      if (!uikitProps.has(mapping.uiKitProp)) {
        errors.push({
          entry: entry.uiKitName,
          prop: mapping.uiKitProp,
          message: `uiKitProp "${mapping.uiKitProp}" does not exist on ${entry.uiKitName}`,
        });
      }
    }
  }

  console.log(`[validate] ✓ ${validated} UIKit components validated`);
  return errors;
}

export async function validateMigrationData(): Promise<void> {
  const migrations = getAllUiKitMigrations();
  const allErrors: ValidationError[] = [];

  // --- Nimbus-side validation ---
  for (const entry of migrations) {
    if (!entry.propMappings || entry.propMappings.length === 0) continue;

    const componentName = extractNimbusComponentName(entry.nimbusEquivalent);
    if (!componentName) continue;

    const nimbusProps = await loadTypeData(componentName);
    if (Object.keys(nimbusProps).length === 0) {
      console.log(
        `[validate] ⚠ ${entry.uiKitName} → ${componentName}: no type data found, skipping prop validation`
      );
      continue;
    }

    for (const mapping of entry.propMappings) {
      const errors = validatePropMapping(
        `${entry.uiKitName} → ${componentName}`,
        mapping,
        nimbusProps
      );
      allErrors.push(...errors);
    }
  }

  const entriesWithMappings = migrations.filter(
    (e) => e.propMappings && e.propMappings.length > 0
  ).length;
  console.log(
    `[validate] ✓ ${entriesWithMappings} Nimbus entries with propMappings validated`
  );

  // --- UIKit-side validation ---
  const uikitErrors = validateUiKitProps(migrations);
  allErrors.push(...uikitErrors);

  if (allErrors.length > 0) {
    console.error(
      `[validate] ❌ ${allErrors.length} migration data error(s):\n`
    );
    for (const err of allErrors) {
      console.error(`  ${err.entry}: ${err.message}`);
    }
    throw new Error(
      `Migration data validation failed with ${allErrors.length} error(s)`
    );
  }
}

if (process.argv[1]?.includes("validate-migration-data")) {
  validateMigrationData().catch((err) => {
    console.error(err.message);
    process.exit(1);
  });
}
