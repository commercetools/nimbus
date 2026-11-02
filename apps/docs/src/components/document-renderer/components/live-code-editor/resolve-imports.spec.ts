import { describe, expect, it } from "vitest";
import { LIVE_MODULES_KEY, resolveImports } from "./resolve-imports";

const modules = {
  "@commercetools/nimbus": { Button: "NimbusButton", Menu: "NimbusMenu" },
  "@commercetools/nimbus-icons": { Edit: "EditIcon", Menu: "MenuIcon" },
  react: { useRef: "useRef", default: "React" },
};

/**
 * Runs the resolved code the way react-live does: the scope values are
 * parameters of a function. `render(<App />)` is replaced because the test
 * does not compile JSX.
 */
const run = (code: string, scope: Record<string, unknown>) => {
  let rendered: unknown;
  const resolved = resolveImports(code, modules).replace(
    "render(<App />);",
    "render(App());"
  );
  const names = Object.keys(scope);
  new Function(...names, "render", resolved)(
    ...names.map((name) => scope[name]),
    (value: unknown) => {
      rendered = value;
    }
  );
  return rendered;
};

describe("resolveImports", () => {
  it("replaces a named import with a lookup in the modules", () => {
    const code = `import { Button } from "@commercetools/nimbus";\nconst App = () => Button;`;

    expect(resolveImports(code, modules)).toBe(
      [
        "{",
        `const { Button } = ${LIVE_MODULES_KEY}["@commercetools/nimbus"];`,
        "\nconst App = () => Button;",
        "render(<App />);",
        "}",
      ].join("\n")
    );
  });

  it("reads an import that spans several lines", () => {
    const code = [
      "import {",
      "  Button,",
      "  Menu,",
      `} from "@commercetools/nimbus";`,
      "const App = () => [Button, Menu];",
    ].join("\n");

    expect(run(code, { [LIVE_MODULES_KEY]: modules })).toEqual([
      "NimbusButton",
      "NimbusMenu",
    ]);
  });

  it("supports aliases, so an icon and a component can share a name", () => {
    const code = [
      `import { Menu } from "@commercetools/nimbus";`,
      `import { Menu as MenuIcon } from "@commercetools/nimbus-icons";`,
      "const App = () => [Menu, MenuIcon];",
    ].join("\n");

    expect(run(code, { [LIVE_MODULES_KEY]: modules })).toEqual([
      "NimbusMenu",
      "MenuIcon",
    ]);
  });

  it("lets an import use a name that the scope already has", () => {
    const code = [
      `import { Menu } from "@commercetools/nimbus-icons";`,
      "const App = () => Menu;",
    ].join("\n");

    expect(run(code, { Menu: "NimbusMenu", [LIVE_MODULES_KEY]: modules })).toBe(
      "MenuIcon"
    );
  });

  it("supports default, namespace and side-effect imports", () => {
    const code = [
      `import React, { useRef } from "react";`,
      `import * as Icons from "@commercetools/nimbus-icons";`,
      `import "./styles.css";`,
      "const App = () => [React, useRef, Icons.Edit];",
    ].join("\n");

    expect(run(code, { [LIVE_MODULES_KEY]: modules })).toEqual([
      "React",
      "useRef",
      "EditIcon",
    ]);
  });

  it("drops type-only imports", () => {
    const code = [
      `import type { ButtonProps } from "@commercetools/nimbus";`,
      `import { type ButtonProps as Props, Button } from "@commercetools/nimbus";`,
      "const App = () => Button;",
    ].join("\n");

    expect(run(code, { [LIVE_MODULES_KEY]: modules })).toBe("NimbusButton");
  });

  it("throws a clear error for a module the editor does not provide", () => {
    const code = [
      `import { Link } from "react-router-dom";`,
      "const App = () => Link;",
    ].join("\n");

    expect(() => run(code, { [LIVE_MODULES_KEY]: modules })).toThrow(
      'The live editor cannot import from "react-router-dom".'
    );
  });

  it("renders App when the code has no imports", () => {
    expect(run("const App = () => 'ok';", {})).toBe("ok");
  });
});
