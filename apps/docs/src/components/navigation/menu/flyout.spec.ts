import { describe, expect, it } from "vitest";
import { buildFlyout, FLYOUT_MAX_PAGES } from "./flyout";
import type { NavigationItem } from "./shape-navigation";

const node = (
  route: string,
  label: string,
  children: NavigationItem[] = [],
  hasPage = true
): NavigationItem => ({ id: route, route, label, hasPage, children });

const section = (children: NavigationItem[]): NavigationItem =>
  node("components", "Components", children, false);

const pages = (parent: string, count: number): NavigationItem[] =>
  Array.from({ length: count }, (_, i) =>
    node(`${parent}/p${i + 1}`, `P${i + 1}`)
  );

describe("buildFlyout", () => {
  it("returns [] when the section has no children", () => {
    expect(buildFlyout(section([]))).toEqual([]);
  });

  it("turns a single page child into a group without pages", () => {
    expect(buildFlyout(section([node("components/alert", "Alert")]))).toEqual([
      {
        id: "components/alert",
        label: "Alert",
        href: "/components/alert",
        pages: [],
        pageCount: 0,
      },
    ]);
  });

  it("lists the pages of a group with 3 pages, in order", () => {
    const group = node(
      "components/inputs",
      "Inputs",
      pages("components/inputs", 3),
      false
    );
    const [result] = buildFlyout(section([group]));
    expect(result.href).toBe("/components/inputs/p1");
    expect(result.pageCount).toBe(3);
    expect(result.pages).toEqual([
      {
        id: "components/inputs/p1",
        label: "P1",
        href: "/components/inputs/p1",
      },
      {
        id: "components/inputs/p2",
        label: "P2",
        href: "/components/inputs/p2",
      },
      {
        id: "components/inputs/p3",
        label: "P3",
        href: "/components/inputs/p3",
      },
    ]);
  });

  it("does not count the own page of a group", () => {
    const group = node(
      "components/inputs",
      "Inputs",
      pages("components/inputs", 2)
    );
    const [result] = buildFlyout(section([group]));
    expect(result.href).toBe("/components/inputs");
    expect(result.pageCount).toBe(2);
    expect(result.pages.map((p) => p.label)).toEqual(["P1", "P2"]);
  });

  it("hides the pages of a group over the limit but keeps the real count", () => {
    const group = node(
      "components/inputs",
      "Inputs",
      pages("components/inputs", FLYOUT_MAX_PAGES + 1),
      false
    );
    const [result] = buildFlyout(section([group]));
    expect(result.pages).toEqual([]);
    expect(result.pageCount).toBe(FLYOUT_MAX_PAGES + 1);
  });

  it("lists a group exactly at the limit", () => {
    const group = node("g", "G", pages("g", FLYOUT_MAX_PAGES), false);
    const [result] = buildFlyout(section([group]));
    expect(result.pages).toHaveLength(FLYOUT_MAX_PAGES);
  });

  it("uses a custom limit", () => {
    const group = node("g", "G", pages("g", 3), false);
    expect(buildFlyout(section([group]), 2)[0].pages).toEqual([]);
    expect(buildFlyout(section([group]), 3)[0].pages).toHaveLength(3);
  });

  it("lists pages of a nested group that has no page of its own", () => {
    const nested = node("g/nested", "Nested", [node("g/nested/a", "A")], false);
    const group = node("g", "G", [node("g/first", "First"), nested], false);
    const [result] = buildFlyout(section([group]));
    expect(result.pages.map((p) => p.href)).toEqual([
      "/g/first",
      "/g/nested/a",
    ]);
    expect(result.pageCount).toBe(2);
  });

  it("skips a group with no pages at all", () => {
    const empty = node(
      "empty",
      "Empty",
      [node("empty/x", "X", [], false)],
      false
    );
    const result = buildFlyout(section([empty, node("alert", "Alert")]));
    expect(result.map((g) => g.id)).toEqual(["alert"]);
  });

  it("does not mutate the input", () => {
    const input = section([
      node("g", "G", pages("g", 3), false),
      node("alert", "Alert"),
    ]);
    const copy = structuredClone(input);
    buildFlyout(input);
    expect(input).toEqual(copy);
  });

  it("uses FLYOUT_MAX_PAGES as the default limit", () => {
    expect(FLYOUT_MAX_PAGES).toBe(8);
    const group = node("g", "G", pages("g", FLYOUT_MAX_PAGES + 1), false);
    const input = section([group]);
    expect(buildFlyout(input)).toEqual(buildFlyout(input, FLYOUT_MAX_PAGES));
  });
});
