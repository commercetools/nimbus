import { describe, expect, it } from "vitest";
import {
  findActiveSection,
  firstPageRoute,
  shapeNavigation,
  type MenuTreeItem,
  type NavigationConfig,
  type NavigationItem,
} from "./shape-navigation";

const item = (
  route: string,
  label: string,
  children: MenuTreeItem[] = [],
  order?: number
): MenuTreeItem => ({ id: route, route, label, order, children });

const menu: MenuTreeItem[] = [
  item(
    "hooks",
    "Hooks",
    [item("hooks/use-b", "useB"), item("hooks/use-a", "useA")],
    999
  ),
  item(
    "home",
    "Home",
    [
      // A group without a page of its own.
      item(
        "home/getting-started",
        "Getting Started",
        [
          item("home/getting-started/setup", "Setup", [], 2),
          item("home/getting-started/install", "Install", [], 1),
        ],
        1
      ),
      item(
        "home/design-tokens",
        "Design Tokens",
        [
          item("home/design-tokens/sizes", "Sizes"),
          item(
            "home/design-tokens/other",
            "Other",
            [item("home/design-tokens/other/blurs", "Blurs")],
            9999
          ),
          item("home/design-tokens/colors", "Colors"),
        ],
        2
      ),
      item(
        "home/style-props",
        "Style Props",
        [
          item("home/style-props/border", "Border"),
          item("home/style-props/sizing", "Sizing"),
        ],
        5
      ),
      item("home/playground", "Playground", [
        item("home/playground/toc", "Toc"),
      ]),
    ],
    1
  ),
  item(
    "components",
    "Components",
    [
      item(
        "components/layout",
        "Layout",
        [
          item("components/layout/stack", "Stack"),
          item("components/layout/box", "Box"),
        ],
        1
      ),
      item(
        "components/inputs",
        "Inputs",
        [
          item("components/inputs/range-slider", "Range Slider"),
          item("components/inputs/range-calendar", "RangeCalendar"),
          item("components/inputs/checkbox", "Checkbox", [], 2),
        ],
        2
      ),
    ],
    3
  ),
];

const allRoutes = (items: MenuTreeItem[]): string[] =>
  items.flatMap((i) => [i.route, ...allRoutes(i.children ?? [])]);

// Every item is a page, except the "Getting Started" group.
const pageRoutes = new Set(
  allRoutes(menu).filter((route) => route !== "home/getting-started")
);

const config: NavigationConfig = {
  hidden: ["home/playground"],
  merged: ["home/design-tokens/other"],
  labels: { "components/inputs/range-slider": "RangeSlider" },
  sections: [
    {
      id: "styling",
      label: "Styling",
      order: 2,
      groups: ["home/style-props", "home/design-tokens"],
    },
  ],
};

const nav = shapeNavigation(menu, pageRoutes, config);

const section = (id: string) => nav.find((s) => s.id === id)!;
const labels = (items: NavigationItem[]) => items.map((i) => i.label);

describe("shapeNavigation", () => {
  it("orders the top-level sections, with the built section in its place", () => {
    expect(labels(nav)).toEqual(["Home", "Styling", "Components", "Hooks"]);
  });

  it("marks groups that have no page of their own", () => {
    const [gettingStarted] = section("home").children;
    expect(gettingStarted.label).toBe("Getting Started");
    expect(gettingStarted.hasPage).toBe(false);
    expect(gettingStarted.children.every((c) => c.hasPage)).toBe(true);
  });

  it("keeps the order set by `order` before sorting by label", () => {
    const [gettingStarted] = section("home").children;
    expect(labels(gettingStarted.children)).toEqual(["Install", "Setup"]);
  });

  it("leaves out hidden routes and the groups moved to another section", () => {
    expect(labels(section("home").children)).toEqual(["Getting Started"]);
  });

  it("builds a section from groups of other sections, in the configured order", () => {
    const styling = section("styling");
    expect(labels(styling.children)).toEqual(["Style Props", "Design Tokens"]);
    expect(styling.hasPage).toBe(false);
  });

  it("moves the pages of a merged group up one level, sorted with the others", () => {
    const designTokens = section("styling").children[1];
    expect(labels(designTokens.children)).toEqual(["Blurs", "Colors", "Sizes"]);
  });

  it("sorts labels without regard to case", () => {
    const styleProps = section("styling").children[0];
    expect(labels(styleProps.children)).toEqual(["Sizing", "SVG"]);
  });

  it("keeps the groups of a section and sorts the pages in each group", () => {
    const [layout, inputs] = section("components").children;
    expect(labels(section("components").children)).toEqual([
      "Layout",
      "Inputs",
    ]);
    expect(labels(layout.children)).toEqual(["Box", "Stack"]);
    expect(labels(inputs.children)).toEqual([
      "Checkbox",
      "RangeCalendar",
      "RangeSlider",
    ]);
  });

  it("sorts pages without children in other sections too", () => {
    expect(labels(section("hooks").children)).toEqual(["useA", "useB"]);
  });
});

describe("findActiveSection", () => {
  it.each([
    ["home", "home"],
    ["home/getting-started/install", "home"],
    // Hidden pages still belong to the section whose route contains them.
    ["home/playground/toc", "home"],
    // Pages moved to a built section belong to that section.
    ["home/design-tokens", "styling"],
    ["home/design-tokens/other/blurs", "styling"],
    // Category pages belong to their section.
    ["components/layout", "components"],
    ["components/inputs/checkbox", "components"],
  ])("finds the section for %s", (route, sectionId) => {
    expect(findActiveSection(nav, route)?.id).toBe(sectionId);
  });

  it("finds nothing for an unknown route", () => {
    expect(findActiveSection(nav, "unknown/page")).toBeUndefined();
  });
});

describe("firstPageRoute", () => {
  it("uses the item's own page when it has one", () => {
    expect(firstPageRoute(section("home"))).toBe("home");
  });

  it("uses the first page below an item without a page", () => {
    expect(firstPageRoute(section("styling"))).toBe("home/style-props");
  });
});

describe("shapeNavigation with a section page", () => {
  const withPage = shapeNavigation(
    [
      ...menu,
      item("styling", "Styling", [
        item("styling/theming", "Theming"),
        item("styling/approaches", "Approaches", [], 1),
      ]),
    ],
    new Set([
      ...pageRoutes,
      "styling",
      "styling/theming",
      "styling/approaches",
    ]),
    {
      ...config,
      sections: [{ ...config.sections[0], page: "styling" }],
    }
  );
  const styling = withPage.find((s) => s.id === "styling")!;

  it("makes the page the section's own page", () => {
    expect(styling.route).toBe("styling");
    expect(styling.hasPage).toBe(true);
    expect(firstPageRoute(styling)).toBe("styling");
  });

  it("lists the pages below it before the groups", () => {
    expect(labels(styling.children)).toEqual([
      "Approaches",
      "Theming",
      "Style Props",
      "Design Tokens",
    ]);
  });

  it("keeps the page's own section active for its guides", () => {
    expect(findActiveSection(withPage, "styling/theming")?.id).toBe("styling");
    expect(findActiveSection(withPage, "home/design-tokens")?.id).toBe(
      "styling"
    );
  });

  it("does not leave the page as a separate top-level section", () => {
    expect(withPage.filter((s) => s.route === "styling")).toHaveLength(1);
  });
});
