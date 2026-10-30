/**
 * Renders illustrations on a test page that mimics a Nimbus app: the real
 * token CSS, a palette class, and each SVG passed through DOMPurify with the
 * settings InlineSvg uses. Writes one PNG per category and color mode to
 * `packages/nimbus/.illustration-sheets/` (gitignored). Look at the PNGs.
 *
 *   pnpm illustrations:sheet [--category Inputs] [--only a,b]
 *                            [--mode light|dark] [--palette primary|ctteal]
 */
import { existsSync, mkdirSync, readFileSync, realpathSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "playwright";
import { discover } from "../../src/illustration-kit/discover";
import { system } from "../../src/theme";

const PACKAGE_DIR = join(dirname(fileURLToPath(import.meta.url)), "../..");
const OUT_DIR = join(PACKAGE_DIR, ".illustration-sheets");

const arg = (flag: string) => {
  const at = process.argv.indexOf(flag);
  return at === -1 ? undefined : process.argv[at + 1];
};
const category = arg("--category");
const only = arg("--only")?.split(",");
const palette = arg("--palette") ?? "primary";
const modes = arg("--mode") ? [arg("--mode")!] : ["light", "dark"];

/** Token variables (light and dark) and the palette class, as Chakra sets them. */
const nimbusCss = () => {
  const layers = system.getTokenCss() as Record<
    string,
    Record<string, Record<string, string>>
  >;
  const rules = (selector: string, vars: Record<string, string>) =>
    `${selector} {\n${Object.entries(vars)
      .map(([key, value]) => `  ${key}: ${value};`)
      .join("\n")}\n}`;
  const tokens = Object.values(layers)
    .flatMap((group) => Object.entries(group))
    .map(([selector, vars]) =>
      rules(
        selector
          .split(",")
          .map((part) => part.replace("&", "").trim())
          .join(", "),
        vars
      )
    );
  const paletteVars = system.css({ colorPalette: palette }) as Record<
    string,
    string
  >;
  return [...tokens, rules(`.palette-${palette}`, paletteVars)].join("\n");
};

const purifyPath = join(
  realpathSync(join(PACKAGE_DIR, "node_modules/dompurify")),
  "dist/purify.js"
);

const items = discover()
  .filter((item) => !category || item.category === category)
  .filter((item) => !only || only.includes(item.name))
  .map((item) => ({
    ...item,
    file: join(item.dir, `${item.name}.illustration.svg`),
  }))
  .filter((item) => existsSync(item.file));

if (items.length === 0) {
  console.log("No illustrations found for this filter.");
  process.exit(0);
}

const byCategory = new Map<string, typeof items>();
for (const item of items) {
  byCategory.set(item.category, [
    ...(byCategory.get(item.category) ?? []),
    item,
  ]);
}

mkdirSync(OUT_DIR, { recursive: true });
const browser = await chromium.launch();
const css = nimbusCss();

for (const mode of modes) {
  for (const [name, group] of byCategory) {
    const page = await browser.newPage({
      deviceScaleFactor: 2,
      viewport: { width: 1200, height: 400 },
    });
    await page.setContent(`<style>${css}
      body { margin: 0; padding: 16px 24px 24px; font: 600 12px system-ui;
        background: ${mode === "dark" ? "#111" : "#f5f5f7"}; color: ${mode === "dark" ? "#eee" : "#222"}; }
      .dark { color-scheme: dark; }
      h2 { font-size: 14px; margin: 0 0 12px; }
      section { display: grid; grid-template-columns: repeat(6, 168px); gap: 12px; }
      figure { margin: 0; border-radius: 8px; overflow: hidden; box-shadow: 0 1px 3px #0002; }
      figure > svg { display: block; width: 168px; height: 168px; }
      figcaption { padding: 8px 10px; background: ${mode === "dark" ? "#222" : "#fff"}; color: ${mode === "dark" ? "#eee" : "#222"}; }
    </style><main class="${mode === "dark" ? "dark" : ""} palette-${palette}"><h2></h2><section></section></main>`);
    // tsx's esbuild wraps functions in __name(); the page has no such helper
    await page.evaluate("window.__name = (fn) => fn");
    await page.addScriptTag({ path: purifyPath });
    await page.evaluate(
      ({ title, cards }) => {
        const purify = (markup: string) =>
          (
            window as unknown as {
              DOMPurify: { sanitize: (s: string, o: object) => string };
            }
          ).DOMPurify.sanitize(markup, {
            USE_PROFILES: { svg: true, svgFilters: true },
            FORBID_TAGS: [
              "script",
              "style",
              "iframe",
              "embed",
              "object",
              "applet",
              "link",
              "base",
              "meta",
            ],
            FORBID_ATTR: ["style"],
          });
        document.querySelector("h2")!.textContent = title;
        document.querySelector("section")!.innerHTML = cards
          .map(
            (card) =>
              `<figure>${purify(card.markup)}<figcaption>${card.name}</figcaption></figure>`
          )
          .join("");
      },
      {
        title: `${name} · ${mode} · ${palette}`,
        cards: group.map((item) => ({
          name: item.name,
          markup: readFileSync(item.file, "utf8"),
        })),
      }
    );
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, "-");
    const png = join(OUT_DIR, `${slug}-${mode}-${palette}.png`);
    await page.locator("main").screenshot({ path: png });
    console.log(png);
    await page.close();
  }
}
await browser.close();
