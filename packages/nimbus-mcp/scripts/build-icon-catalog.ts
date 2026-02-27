/**
 * Icon Cataloger Data Processor
 *
 * Scans `packages/nimbus-icons/src/` for all icon components, extracts their
 * names, categories, and import paths, then builds a searchable catalog with
 * normalized keywords. Outputs JSON to `packages/nimbus-mcp/data/icons.json`.
 *
 * Run via: pnpm --filter @commercetools/nimbus-mcp catalog:icons
 */

import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));

// ---------------------------------------------------------------------------
// Paths
// ---------------------------------------------------------------------------

const ICONS_SRC = resolve(__dirname, "../../nimbus-icons/src");
const MATERIAL_ICONS_INDEX = resolve(ICONS_SRC, "material-icons/index.ts");
const NIMBUS_ICONS_INDEX = resolve(ICONS_SRC, "index.ts");
const OUTPUT_DIR = resolve(__dirname, "../data");
const OUTPUT_FILE = resolve(OUTPUT_DIR, "icons.json");

// ---------------------------------------------------------------------------
// Synonym map for enhanced keyword searchability
// ---------------------------------------------------------------------------

const SYNONYMS: Record<string, string[]> = {
  account: ["user", "profile", "person"],
  add: ["plus", "create", "new", "insert"],
  alarm: ["alert", "clock", "reminder", "notification"],
  archive: ["save", "store", "box"],
  arrow: ["direction", "navigate", "pointer"],
  article: ["document", "text", "page", "news"],
  assignment: ["task", "clipboard", "document"],
  attach: ["clip", "link", "file"],
  audio: ["sound", "music", "speaker"],
  back: ["previous", "left", "return"],
  bar: ["chart", "graph"],
  battery: ["power", "charge", "energy"],
  block: ["disable", "stop", "ban"],
  bookmark: ["save", "favorite", "tag"],
  brightness: ["light", "display", "screen"],
  broken: ["error", "missing"],
  bug: ["error", "issue", "problem"],
  build: ["construct", "settings", "tool"],
  business: ["company", "office", "work"],
  calendar: ["date", "schedule", "event"],
  call: ["phone", "telephone"],
  camera: ["photo", "capture", "picture"],
  cancel: ["close", "dismiss", "remove", "delete"],
  card: ["payment", "credit"],
  chat: ["message", "conversation", "comment"],
  check: ["done", "success", "tick", "verify", "confirm", "complete"],
  child: ["kids", "young"],
  circle: ["round", "circular", "loop"],
  clear: ["close", "remove", "delete", "dismiss"],
  close: ["x", "dismiss", "cancel", "exit"],
  cloud: ["storage", "sync", "upload", "download"],
  code: ["programming", "developer", "script"],
  color: ["palette", "paint", "art"],
  comment: ["message", "chat", "feedback"],
  copy: ["duplicate", "clone"],
  credit: ["card", "payment"],
  crop: ["trim", "cut", "edit"],
  dashboard: ["home", "overview", "summary"],
  data: ["database", "storage"],
  date: ["calendar", "schedule", "time"],
  delete: ["remove", "trash", "bin", "clear"],
  description: ["text", "document", "info"],
  directions: ["navigate", "map", "route"],
  done: ["check", "complete", "success", "tick"],
  download: ["save", "export", "get"],
  edit: ["pencil", "write", "modify", "pen"],
  email: ["mail", "message", "envelope", "letter"],
  error: ["problem", "issue", "warning", "alert"],
  event: ["calendar", "date", "schedule"],
  expand: ["open", "fullscreen", "zoom"],
  explore: ["search", "discover", "navigate"],
  face: ["person", "user", "avatar", "smile"],
  favorite: ["star", "heart", "like", "save"],
  file: ["document", "attachment"],
  filter: ["sort", "refine", "funnel"],
  flag: ["report", "marker"],
  flash: ["lightning", "quick", "camera"],
  folder: ["directory", "storage"],
  forward: ["next", "right", "send"],
  fullscreen: ["expand", "zoom"],
  globe: ["world", "internet", "earth"],
  grade: ["star", "rating", "review"],
  group: ["people", "team", "users"],
  heart: ["love", "favorite", "like"],
  help: ["info", "support", "question"],
  history: ["recent", "time", "clock"],
  home: ["house", "start", "dashboard"],
  image: ["photo", "picture", "gallery"],
  info: ["information", "help", "about"],
  label: ["tag", "badge"],
  language: ["globe", "translate", "world"],
  launch: ["open", "external", "start"],
  link: ["url", "chain", "attach"],
  list: ["items", "menu"],
  location: ["map", "place", "pin", "marker", "gps"],
  lock: ["security", "password", "secure", "private"],
  login: ["signin", "enter", "access"],
  logout: ["signout", "exit", "leave"],
  loop: ["repeat", "refresh", "cycle"],
  mail: ["email", "message", "envelope"],
  map: ["location", "navigate", "directions"],
  menu: ["hamburger", "navigation", "nav", "list"],
  message: ["chat", "comment", "notification"],
  mic: ["microphone", "audio", "voice", "record"],
  mobile: ["phone", "smartphone"],
  music: ["audio", "sound", "play"],
  navigate: ["arrow", "direction", "map"],
  network: ["wifi", "internet", "connection"],
  notifications: ["alert", "bell", "message"],
  palette: ["color", "paint", "art"],
  pause: ["stop", "media", "wait"],
  payment: ["credit", "money", "card"],
  people: ["group", "team", "users", "person"],
  person: ["user", "account", "profile", "people"],
  phone: ["call", "mobile", "telephone"],
  photo: ["image", "picture", "camera"],
  picture: ["image", "photo"],
  place: ["location", "map", "marker"],
  play: ["start", "media", "video", "music"],
  plus: ["add", "create", "new"],
  power: ["battery", "charge", "on", "off"],
  print: ["document", "printer"],
  public: ["globe", "world", "open"],
  question: ["help", "info", "faq"],
  refresh: ["reload", "sync", "update", "repeat"],
  remove: ["delete", "minus", "clear", "trash"],
  reply: ["respond", "message", "arrow"],
  report: ["document", "flag", "alert"],
  restore: ["undo", "history", "refresh"],
  save: ["download", "store", "favorite"],
  search: ["find", "magnify", "lens", "filter"],
  security: ["lock", "shield", "protect"],
  send: ["share", "mail", "forward"],
  settings: ["configure", "gear", "preferences", "options"],
  share: ["send", "export", "social"],
  shield: ["security", "protect", "privacy"],
  shop: ["store", "cart", "purchase"],
  skip: ["next", "jump", "forward"],
  sort: ["filter", "order", "arrange"],
  star: ["favorite", "bookmark", "rating", "review"],
  store: ["shop", "folder", "save"],
  sync: ["refresh", "cloud", "update"],
  text: ["document", "note", "edit"],
  thumb: ["like", "vote", "rating"],
  time: ["clock", "schedule", "calendar", "history"],
  toggle: ["switch", "on", "off"],
  translate: ["language", "globe"],
  trash: ["delete", "remove", "bin"],
  tune: ["settings", "adjust", "filter"],
  undo: ["restore", "back", "history"],
  unlock: ["open", "access", "security"],
  upload: ["import", "cloud", "send"],
  video: ["movie", "film", "play", "camera"],
  view: ["eye", "show", "visibility"],
  visibility: ["show", "eye", "view", "visible"],
  volume: ["audio", "sound", "speaker"],
  warning: ["alert", "caution", "attention", "error"],
  wifi: ["network", "internet", "connection"],
  work: ["business", "office", "job"],
  zoom: ["magnify", "search", "expand"],
};

// ---------------------------------------------------------------------------
// Keyword generation
// ---------------------------------------------------------------------------

/**
 * Splits a PascalCase or camelCase name into lowercase words.
 * Handles consecutive uppercase sequences (e.g. "HTTPSConnection" → ["https", "connection"]).
 */
function splitCamelCase(name: string): string[] {
  return name
    .replace(/([A-Z]+)([A-Z][a-z])/g, "$1 $2")
    .replace(/([a-z\d])([A-Z])/g, "$1 $2")
    .split(/[\s_-]+/)
    .filter(Boolean)
    .map((w) => w.toLowerCase());
}

/**
 * Generates a deduplicated set of searchable keywords for an icon name.
 * Splits the name into words then expands each word with configured synonyms.
 */
function generateKeywords(name: string): string[] {
  const words = splitCamelCase(name);
  const keywords = new Set<string>(words);

  for (const word of words) {
    const synonyms = SYNONYMS[word];
    if (synonyms) {
      for (const syn of synonyms) {
        keywords.add(syn);
      }
    }
  }

  return Array.from(keywords);
}

// ---------------------------------------------------------------------------
// Icon catalog types
// ---------------------------------------------------------------------------

export interface IconCatalogEntry {
  /** Exported name used in import statements (e.g. "SvgAccountCircle"). */
  name: string;
  /** npm import path (always "@commercetools/nimbus-icons"). */
  importPath: string;
  /** Whether this is a Material Design icon or a custom commercetools icon. */
  category: "material" | "custom";
  /** Searchable keywords derived from the icon name and synonyms. */
  keywords: string[];
}

export interface IconCatalog {
  /** ISO timestamp of when this catalog was generated. */
  generated: string;
  /** Total number of icons in the catalog. */
  count: number;
  /** All icon entries. */
  icons: IconCatalogEntry[];
}

// ---------------------------------------------------------------------------
// Scanners
// ---------------------------------------------------------------------------

/**
 * Parses material-icons/index.ts to extract all icon export names and source
 * file paths. The index uses the pattern:
 *   `export { default as SvgXxx } from "./filename";`
 */
function scanMaterialIcons(): IconCatalogEntry[] {
  const content = readFileSync(MATERIAL_ICONS_INDEX, "utf-8");

  // Match: export { default as SvgXxx } from "./filename";
  const pattern = /export \{ default as (\w+) \} from "\.\/(.+?)"/g;
  const icons: IconCatalogEntry[] = [];
  let match: RegExpExecArray | null;

  while ((match = pattern.exec(content)) !== null) {
    const exportName = match[1];
    // Strip the "Svg" prefix when generating keywords so users can search for
    // "account circle" rather than "svg account circle".
    const baseName = exportName.startsWith("Svg")
      ? exportName.slice(3)
      : exportName;

    icons.push({
      name: exportName,
      importPath: "@commercetools/nimbus-icons",
      category: "material",
      keywords: generateKeywords(baseName),
    });
  }

  return icons;
}

/**
 * Parses nimbus-icons/src/index.ts to extract custom icon exports.
 * Handles both named exports and default-as exports from custom-icons/:
 *   `export { Figma } from "./custom-icons/figma";`
 *   `export { default as CheckCircle } from "./custom-icons/check-circle";`
 */
function scanCustomIcons(): IconCatalogEntry[] {
  const content = readFileSync(NIMBUS_ICONS_INDEX, "utf-8");
  const seen = new Set<string>();
  const icons: IconCatalogEntry[] = [];

  // Named exports: export { Name } from "./custom-icons/...";
  const namedPattern = /export \{ (\w+) \} from "\.\/custom-icons\/[^"]+"/g;
  let match: RegExpExecArray | null;

  while ((match = namedPattern.exec(content)) !== null) {
    const exportName = match[1];
    if (!seen.has(exportName)) {
      seen.add(exportName);
      icons.push({
        name: exportName,
        importPath: "@commercetools/nimbus-icons",
        category: "custom",
        keywords: generateKeywords(exportName),
      });
    }
  }

  // Default-as exports: export { default as Name } from "./custom-icons/...";
  const defaultPattern =
    /export \{ default as (\w+) \} from "\.\/custom-icons\/[^"]+"/g;

  while ((match = defaultPattern.exec(content)) !== null) {
    const exportName = match[1];
    if (!seen.has(exportName)) {
      seen.add(exportName);
      icons.push({
        name: exportName,
        importPath: "@commercetools/nimbus-icons",
        category: "custom",
        keywords: generateKeywords(exportName),
      });
    }
  }

  return icons;
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

function buildIconCatalog(): void {
  console.log("Building icon catalog...");

  const materialIcons = scanMaterialIcons();
  console.log(`  Found ${materialIcons.length} Material icons`);

  const customIcons = scanCustomIcons();
  console.log(`  Found ${customIcons.length} custom icons`);

  // Merge, with custom icons taking priority over material ones of the same
  // name. This mirrors how nimbus-icons/src/index.ts re-exports: custom
  // exports override the `export * from "./material-icons"` barrel.
  const byName = new Map<string, IconCatalogEntry>();
  for (const icon of materialIcons) byName.set(icon.name, icon);
  for (const icon of customIcons) byName.set(icon.name, icon);
  const allIcons = Array.from(byName.values());

  const catalog: IconCatalog = {
    generated: new Date().toISOString(),
    count: allIcons.length,
    icons: allIcons,
  };

  mkdirSync(OUTPUT_DIR, { recursive: true });
  writeFileSync(OUTPUT_FILE, JSON.stringify(catalog, null, 2) + "\n", "utf-8");

  console.log(`\nCatalog written to: ${OUTPUT_FILE}`);
  console.log(`Total icons: ${catalog.count}`);
}

buildIconCatalog();
