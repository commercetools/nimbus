import { existsSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { createRequire } from "node:module";
import ts from "typescript";
import { getAllUiKitMigrations } from "../src/data/uikit-migration.js";
import type { IconWrapper, PropMapping } from "../src/types.js";
import {
  STYLE_PROPS,
  extractNimbusComponentName,
  extractValidValues,
  loadTypeData,
  type PropTypeInfo,
} from "./validation-helpers.js";

const __dirname = dirname(fileURLToPath(import.meta.url));
const DATA_DIR = resolve(__dirname, "../data");
const TYPES_DIR = resolve(DATA_DIR, "docs/types");

interface ValidationError {
  entry: string;
  prop: string;
  message: string;
}

function validatePropMapping(
  entryName: string,
  mapping: PropMapping,
  nimbusProps: Record<string, PropTypeInfo>
): ValidationError[] {
  const errors: ValidationError[] = [];

  if (mapping.nimbusProp === null) return errors;

  const propType = nimbusProps[mapping.nimbusProp];
  if (!propType && !STYLE_PROPS.has(mapping.nimbusProp)) {
    errors.push({
      entry: entryName,
      prop: mapping.nimbusProp,
      message: `nimbusProp "${mapping.nimbusProp}" does not exist on the component. Available: ${Object.keys(nimbusProps).join(", ")}`,
    });
    return errors;
  }

  if (
    mapping.changeType === "value-mapping" &&
    !mapping.valueMapping &&
    !mapping.fixedValue
  ) {
    errors.push({
      entry: entryName,
      prop: mapping.nimbusProp,
      message: `changeType is "value-mapping" but neither valueMapping nor fixedValue is provided`,
    });
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

const VALID_NIMBUS_ICON_SIZES = new Set(["2xs", "xs", "sm", "md", "lg", "xl"]);

function validateIconWrapper(
  entryName: string,
  wrapper: IconWrapper
): ValidationError[] {
  const errors: ValidationError[] = [];

  if (
    wrapper.defaultProps.size &&
    !VALID_NIMBUS_ICON_SIZES.has(wrapper.defaultProps.size)
  ) {
    errors.push({
      entry: entryName,
      prop: "iconWrapper.defaultProps.size",
      message: `defaultProps.size "${wrapper.defaultProps.size}" is not a valid Nimbus Icon size. Valid: ${[...VALID_NIMBUS_ICON_SIZES].join(", ")}`,
    });
  }

  if (wrapper.sizeMapping) {
    for (const mapping of wrapper.sizeMapping) {
      if (!VALID_NIMBUS_ICON_SIZES.has(mapping.to)) {
        errors.push({
          entry: entryName,
          prop: "iconWrapper.sizeMapping",
          message: `sizeMapping "${mapping.from}" → "${mapping.to}" — target "${mapping.to}" is not a valid Nimbus Icon size. Valid: ${[...VALID_NIMBUS_ICON_SIZES].join(", ")}`,
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

  function extractPropsFromType(type: ts.Type): Set<string> {
    // Function components have call signatures; class components have
    // construct signatures (the constructor takes props as its first arg).
    const sigs = type.getCallSignatures();
    const sig = sigs.length > 0 ? sigs[0] : type.getConstructSignatures()[0];
    if (!sig) return new Set();

    const params = sig.getParameters();
    if (params.length === 0) return new Set();

    const paramType = checker.getTypeOfSymbol(params[0]);

    // For generic/polymorphic components (e.g. PrimaryButton<TStringOrComponent>),
    // the param type is an intersection like { label, tone, ... } & ComponentPropsWithRef<T>.
    // The top-level type reports 0 properties, but the intersection members
    // that aren't dependent on the type parameter do have concrete props.
    const props = new Set<string>();
    if (paramType.isIntersection() && paramType.getProperties().length === 0) {
      for (const member of paramType.types) {
        for (const p of member.getProperties()) props.add(p.getName());
      }
    } else {
      for (const p of paramType.getProperties()) props.add(p.getName());
    }
    return props;
  }

  for (const exp of allExports) {
    const name = exp.getName();
    if (name.startsWith("_") || name[0] !== name[0].toUpperCase()) continue;

    const type = checker.getTypeOfSymbol(exp);

    const props = extractPropsFromType(type);
    if (props.size > 0) result.set(name, props);

    // Resolve dotted sub-components (e.g. Text.Body, Spacings.Inline)
    for (const sub of type.getProperties()) {
      const subName = sub.getName();
      if (subName[0] !== subName[0].toUpperCase()) continue;
      const subType = checker.getTypeOfSymbol(sub);
      const subProps = extractPropsFromType(subType);
      if (subProps.size > 0) result.set(`${name}.${subName}`, subProps);
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
  const skipped: string[] = [];

  for (const entry of migrations) {
    if (!entry.propMappings || entry.propMappings.length === 0) continue;

    const uikitProps = propsMap.get(entry.uiKitName);
    if (!uikitProps) {
      skipped.push(entry.uiKitName);
      continue;
    }

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
  if (skipped.length > 0) {
    console.log(
      `[validate] ⚠ ${skipped.length} UIKit components not found in barrel types (skipped): ${skipped.join(", ")}`
    );
  }
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

    const nimbusProps = await loadTypeData(TYPES_DIR, componentName);
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

  // --- iconWrapper validation ---
  let iconWrapperCount = 0;
  for (const entry of migrations) {
    if (!entry.iconWrapper) continue;
    iconWrapperCount++;
    const errors = validateIconWrapper(entry.uiKitName, entry.iconWrapper);
    allErrors.push(...errors);
  }
  console.log(`[validate] ✓ ${iconWrapperCount} iconWrapper entries validated`);

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
