/// <reference types="vite/client" />
import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative } from "node:path";
import { describe, expect, it } from "vitest";
import { sanitizeSvg } from "@/components/inline-svg/utils";
import {
  ALLOWED_PAINTS,
  measureIllustration,
  renderIllustration,
  type IllustrationDefinition,
} from "./index";
import { discover, SRC_DIR } from "./discover";
import { PENDING } from "./pending";

const required = discover();
const requiredNames = new Set(required.map((item) => item.name));

const modules = import.meta.glob<{ default: IllustrationDefinition }>(
  "../**/*.illustration.ts",
  { eager: true }
);
const definitions = new Map(
  Object.entries(modules).map(([path, module]) => [
    path.split("/").pop()!.replace(".illustration.ts", ""),
    module.default,
  ])
);

const sourcePath = (item: { name: string; dir: string }) =>
  join(item.dir, `${item.name}.illustration.ts`);
const svgPath = (item: { name: string; dir: string }) =>
  join(item.dir, `${item.name}.illustration.svg`);

const drawn = required.filter((item) => !PENDING.has(item.name));

const ALLOWED_TAGS = new Set([
  "svg",
  "defs",
  "linearGradient",
  "stop",
  "filter",
  "feDropShadow",
  "g",
  "rect",
  "circle",
  "line",
  "path",
]);
const PAINT_ATTRIBUTES = ["fill", "stroke", "stop-color", "flood-color"];

const parse = (svg: string) => {
  const doc = new DOMParser().parseFromString(svg, "image/svg+xml");
  expect(doc.querySelector("parsererror")).toBeNull();
  return doc;
};

/**
 * Lowercase tag names and sorted attributes of every element, in document
 * order. DOMPurify serializes as HTML, which lowercases SVG tag names; browsers
 * map them back when the markup is inlined.
 */
const describeTree = (root: Element): string[] =>
  [root, ...Array.from(root.querySelectorAll("*"))].map(
    (element) =>
      `${element.localName.toLowerCase()} ${Array.from(element.attributes)
        .map((attribute) => `${attribute.name}=${attribute.value}`)
        .sort()
        .join(" ")}`
  );

describe("illustration coverage", () => {
  it("finds the components, derivatives and patterns", () => {
    expect(required.length).toBeGreaterThan(100);
    expect(requiredNames.size).toBe(required.length);
  });

  it("only lists real components as pending", () => {
    for (const name of PENDING) expect(requiredNames).toContain(name);
  });

  it.each(required.filter((item) => PENDING.has(item.name)))(
    "$name is pending and must not have an illustration yet",
    (item) => {
      expect(
        existsSync(sourcePath(item)) || existsSync(svgPath(item)),
        `${item.name} has an illustration: remove it from PENDING in pending.ts`
      ).toBe(false);
    }
  );

  it.each(drawn)(
    "$name has an illustration source and a generated SVG",
    (item) => {
      expect(existsSync(sourcePath(item)), `missing ${sourcePath(item)}`).toBe(
        true
      );
      expect(existsSync(svgPath(item)), `missing ${svgPath(item)}`).toBe(true);
      expect(definitions.get(item.name)?.name).toBe(item.name);
    }
  );

  it("has no orphan illustration files", () => {
    const found: string[] = [];
    const walk = (dir: string) => {
      for (const entry of readdirSync(dir)) {
        const path = join(dir, entry);
        if (statSync(path).isDirectory()) walk(path);
        else if (/\.illustration\.(ts|svg)$/.test(entry)) found.push(path);
      }
    };
    walk(join(SRC_DIR, "components"));
    walk(join(SRC_DIR, "patterns"));
    const allowed = new Set(
      required.flatMap((item) => [sourcePath(item), svgPath(item)])
    );
    expect(found.filter((path) => !allowed.has(path))).toEqual([]);
  });
});

describe("illustration freshness", () => {
  it.each(drawn)("$name.illustration.svg is up to date", (item) => {
    const rendered = renderIllustration(definitions.get(item.name)!);
    expect(
      readFileSync(svgPath(item), "utf8") === rendered,
      "Out of date: run `pnpm illustrations:generate`"
    ).toBe(true);
  });
});

describe("illustration source purity", () => {
  const FORBIDDEN = [
    /#[0-9a-fA-F]{3,8}\b/,
    /rgb\(/,
    /hsl\(/,
    /oklch\(/,
    /var\(/,
    /light-dark\(/,
    /color-mix\(/,
    /</,
    /style/,
    /id=/,
    /url\(#/,
  ];

  it.each(drawn)("$name uses only the kit and role names", (item) => {
    const source = readFileSync(sourcePath(item), "utf8");
    expect(source.match(/^import /gm)?.length).toBe(1);
    expect(source).toMatch(
      /^import \{ defineIllustration \} from "@\/illustration-kit";$/m
    );
    expect(source).toContain("export default defineIllustration(");
    for (const pattern of FORBIDDEN) {
      expect(source, `${item.name} contains ${pattern}`).not.toMatch(pattern);
    }
  });
});

describe("kit isolation", () => {
  it("is imported only by illustration sources and the kit itself", () => {
    const offenders: string[] = [];
    const walk = (dir: string) => {
      for (const entry of readdirSync(dir)) {
        const path = join(dir, entry);
        if (statSync(path).isDirectory()) {
          if (entry !== "node_modules") walk(path);
          continue;
        }
        if (!/\.(ts|tsx)$/.test(entry)) continue;
        const rel = relative(SRC_DIR, path);
        if (rel.startsWith("illustration-kit/")) continue;
        if (entry.endsWith(".illustration.ts")) continue;
        if (
          /@\/illustration-kit|illustration-kit\//.test(
            readFileSync(path, "utf8")
          )
        ) {
          offenders.push(rel);
        }
      }
    };
    walk(SRC_DIR);
    expect(offenders).toEqual([]);
  });
});

describe("illustration output", () => {
  it.each(drawn)("$name has the allowed structure", (item) => {
    const svg = readFileSync(svgPath(item), "utf8");
    const root = parse(svg).documentElement;
    expect(root.getAttribute("viewBox")).toBe("0 0 96 96");
    expect(root.getAttribute("width")).toBe("96");
    expect(root.getAttribute("height")).toBe("96");

    const elements = [root, ...Array.from(root.querySelectorAll("*"))];
    for (const element of elements) {
      expect(ALLOWED_TAGS, `tag ${element.localName}`).toContain(
        element.localName
      );
      for (const forbidden of ["style", "class", "href", "xlink:href"]) {
        expect(element.hasAttribute(forbidden), forbidden).toBe(false);
      }
    }

    const ids = elements
      .map((element) => element.getAttribute("id"))
      .filter(Boolean) as string[];
    expect(new Set(ids).size).toBe(ids.length);
    for (const id of ids) expect(id.startsWith(`il-${item.name}-`)).toBe(true);

    for (const reference of svg.matchAll(/url\(#([^)]+)\)/g)) {
      expect(ids, `url(#${reference[1]})`).toContain(reference[1]);
    }

    for (const element of elements) {
      for (const attribute of PAINT_ATTRIBUTES) {
        const value = element.getAttribute(attribute);
        if (value === null || value === "none") continue;
        const local = /^url\(#([^)]+)\)$/.exec(value);
        if (local) {
          expect(ids).toContain(local[1]);
        } else {
          expect(ALLOWED_PAINTS, `${attribute}="${value}"`).toContain(value);
        }
      }
    }
  });

  it.each(drawn)("$name survives the InlineSvg sanitizer unchanged", (item) => {
    const svg = readFileSync(svgPath(item), "utf8");
    const clean = sanitizeSvg(svg);
    expect(clean).not.toBeNull();
    const before = parse(svg).documentElement;
    const after = new DOMParser().parseFromString(
      clean!,
      "image/svg+xml"
    ).documentElement;
    expect(describeTree(after)).toEqual(describeTree(before));
    expect(clean!.match(/var\(/g)?.length).toBe(svg.match(/var\(/g)?.length);
  });
});

describe("illustration geometry", () => {
  it.each(drawn)("$name is centered, inside the margin and small", (item) => {
    const { box, panels } = measureIllustration(definitions.get(item.name)!);
    expect(box).not.toBeNull();
    const { x1, y1, x2, y2 } = box!;
    for (const value of [x1, y1]) expect(value).toBeGreaterThanOrEqual(8);
    for (const value of [x2, y2]) expect(value).toBeLessThanOrEqual(88);
    expect(Math.abs((x1 + x2) / 2 - 48)).toBeLessThanOrEqual(2);
    expect(Math.abs((y1 + y2) / 2 - 48)).toBeLessThanOrEqual(2);
    for (const { w, h } of panels) {
      expect(w % 2, `panel width ${w}`).toBe(0);
      expect(h % 2, `panel height ${h}`).toBe(0);
    }
    expect(statSync(svgPath(item)).size).toBeLessThanOrEqual(8 * 1024);
  });
});
