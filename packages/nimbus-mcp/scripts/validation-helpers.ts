import { existsSync, readFileSync } from "node:fs";
import { readFile } from "node:fs/promises";
import { resolve } from "node:path";

export const STYLE_PROPS = new Set(["colorPalette"]);

export const KNOWN_TYPE_ALIASES: Record<string, string[]> = {
  SemanticPalettesOnly: [
    "primary",
    "neutral",
    "info",
    "positive",
    "warning",
    "critical",
  ],
};

export function resolveTypeFile(
  typesDir: string,
  componentName: string
): string | null {
  const fileName = componentName.replace(/\./g, "");
  const direct = resolve(typesDir, `${fileName}.json`);
  const root = resolve(typesDir, `${fileName}Root.json`);
  if (existsSync(root)) {
    const rootData = JSON.parse(readFileSync(root, "utf-8"));
    if (Object.keys(rootData.props ?? {}).length > 0) return root;
  }
  if (existsSync(direct)) return direct;
  return null;
}

export function extractNimbusComponentName(
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

export function extractValidValues(propType: {
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

export type PropTypeInfo = {
  name: string;
  value?: Array<{ value: string }>;
};

export async function loadTypeData(
  typesDir: string,
  componentName: string
): Promise<Record<string, PropTypeInfo>> {
  const filePath = resolveTypeFile(typesDir, componentName);
  if (!filePath) return {};
  const raw = await readFile(filePath, "utf-8");
  const data = JSON.parse(raw);
  const result: Record<string, PropTypeInfo> = {};
  for (const [key, val] of Object.entries(data.props ?? {})) {
    result[key] = (val as { type: PropTypeInfo }).type;
  }
  return result;
}
