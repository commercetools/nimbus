import { describe, expect, it } from "vitest";
import {
  MAX_COLLAGE,
  resolveChildIllustrations,
} from "./resolve-illustrations";

const route = (menu: string[], illustrations: string[] = [], order = 999) => ({
  title: menu[menu.length - 1],
  menu,
  order,
  illustrations,
});

describe("resolveChildIllustrations", () => {
  it("keeps the own illustration of a document", () => {
    const routes = [route(["Components", "Layout", "Box"], ["box"])];
    resolveChildIllustrations(routes);
    expect(routes[0].illustrations).toEqual(["box"]);
  });

  it("collects the illustrations of the documents below a category", () => {
    const routes = [
      route(["Components", "Layout"]),
      route(["Components", "Layout", "Grid"], ["grid"]),
      route(["Components", "Layout", "Box"], ["box"]),
      route(["Components", "Buttons", "Button"], ["button"]),
    ];
    resolveChildIllustrations(routes);
    expect(routes[0].illustrations).toEqual(["box", "grid"]);
  });

  it("orders by menu order first, then by title", () => {
    const routes = [
      route(["Components", "Layout"]),
      route(["Components", "Layout", "Box"], ["box"], 3),
      route(["Components", "Layout", "Grid"], ["grid"], 1),
    ];
    resolveChildIllustrations(routes);
    expect(routes[0].illustrations).toEqual(["grid", "box"]);
  });

  it(`shows at most ${MAX_COLLAGE} illustrations`, () => {
    const routes = [
      route(["Components", "Inputs"]),
      ...["a", "b", "c", "d", "e", "f"].map((name) =>
        route(["Components", "Inputs", name], [name])
      ),
    ];
    resolveChildIllustrations(routes);
    expect(routes[0].illustrations).toEqual(["a", "b"]);
  });

  it("leaves a document without illustrations below it empty", () => {
    const routes = [
      route(["Hooks"]),
      route(["Hooks", "useColorMode"]),
      route(["Components", "Layout", "Box"], ["box"]),
    ];
    resolveChildIllustrations(routes);
    expect(routes[0].illustrations).toEqual([]);
  });

  it("does not depend on the order of the routes", () => {
    const routes = [
      route(["Components", "Layout", "Box"], ["box"]),
      route(["Components"]),
      route(["Components", "Layout"]),
    ];
    resolveChildIllustrations(routes);
    expect(routes[1].illustrations).toEqual(["box"]);
    expect(routes[2].illustrations).toEqual(["box"]);
  });
});
