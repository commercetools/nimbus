import { describe, it, expect } from "vitest";
import {
  cleanPropName,
  matchEnumValue,
  toCamelCase,
  formatKey,
  matchesCodeProp,
  isValidCodeProp,
  classifyProps,
  generateExampleJsx,
  type CodeConnectEntry,
} from "./generate-code-connect";

// ---------------------------------------------------------------------------
// cleanPropName
// ---------------------------------------------------------------------------

describe("cleanPropName", () => {
  it("strips Figma internal property IDs", () => {
    expect(cleanPropName("Clear button#274:0")).toBe("Clear button");
  });

  it("strips IDs with large numbers", () => {
    expect(cleanPropName("Icon#12345:678")).toBe("Icon");
  });

  it("returns name unchanged when no ID suffix", () => {
    expect(cleanPropName("Size")).toBe("Size");
  });

  it("trims whitespace", () => {
    expect(cleanPropName("  Size  ")).toBe("Size");
  });

  it("handles arrow-prefixed instance names", () => {
    expect(cleanPropName("→ Clear Button#274:0")).toBe("→ Clear Button");
  });
});

// ---------------------------------------------------------------------------
// matchEnumValue
// ---------------------------------------------------------------------------

describe("matchEnumValue", () => {
  it("matches exact case-insensitive values", () => {
    expect(matchEnumValue("MD", ["sm", "md", "lg"])).toBe("md");
  });

  it("returns null when no match", () => {
    expect(matchEnumValue("xl", ["sm", "md"])).toBeNull();
  });

  it("maps 'Outlined' to 'outline' via known design-token rule", () => {
    expect(matchEnumValue("Outlined", ["outline", "ghost"])).toBe("outline");
  });

  it("maps 'Filled' to 'fill' via known design-token rule", () => {
    expect(matchEnumValue("Filled", ["fill", "outline"])).toBe("fill");
  });

  it("does NOT strip trailing 'd' for arbitrary words", () => {
    // "selected" should NOT match "selecte"
    expect(matchEnumValue("selected", ["selecte"])).toBeNull();
  });

  it("does NOT strip trailing 'd' from 'focused'", () => {
    expect(matchEnumValue("focused", ["focuse"])).toBeNull();
  });

  it("does NOT strip trailing 'd' from 'disabled'", () => {
    expect(matchEnumValue("disabled", ["disable"])).toBeNull();
  });

  it("prefers exact match over design-token rule", () => {
    // If "outlined" is itself a recipe value, exact match wins
    expect(matchEnumValue("Outlined", ["outlined", "outline"])).toBe(
      "outlined"
    );
  });
});

// ---------------------------------------------------------------------------
// toCamelCase
// ---------------------------------------------------------------------------

describe("toCamelCase", () => {
  it("converts space-separated words", () => {
    expect(toCamelCase("Clear button")).toBe("clearButton");
  });

  it("converts hyphenated words", () => {
    expect(toCamelCase("leading-element")).toBe("leadingElement");
  });

  it("converts underscore-separated words", () => {
    expect(toCamelCase("is_disabled")).toBe("isDisabled");
  });

  it("strips arrow prefix", () => {
    expect(toCamelCase("→ Clear Button")).toBe("clearButton");
  });

  it("strips Figma ID suffix", () => {
    expect(toCamelCase("Icon#274:0")).toBe("icon");
  });

  it("strips both arrow prefix and ID suffix", () => {
    expect(toCamelCase("→ Leading icon#100:5")).toBe("leadingIcon");
  });

  it("handles single word", () => {
    expect(toCamelCase("Size")).toBe("size");
  });
});

// ---------------------------------------------------------------------------
// formatKey
// ---------------------------------------------------------------------------

describe("formatKey", () => {
  it("returns simple identifiers unquoted", () => {
    expect(formatKey("md")).toBe("md");
  });

  it("returns identifiers starting with $ unquoted", () => {
    expect(formatKey("$value")).toBe("$value");
  });

  it("quotes keys with spaces", () => {
    expect(formatKey("Title + text")).toBe('"Title + text"');
  });

  it("quotes keys starting with numbers", () => {
    expect(formatKey("2xs")).toBe('"2xs"');
  });

  it("quotes keys with hyphens", () => {
    expect(formatKey("semi-bold")).toBe('"semi-bold"');
  });
});

// ---------------------------------------------------------------------------
// matchesCodeProp
// ---------------------------------------------------------------------------

describe("matchesCodeProp", () => {
  it("matches when Figma name normalizes to code prop", () => {
    expect(matchesCodeProp("is disabled", "isdisabled")).toBe(true);
  });

  it("matches ignoring case", () => {
    expect(matchesCodeProp("Size", "size")).toBe(true);
  });

  it("matches ignoring hyphens and spaces", () => {
    expect(matchesCodeProp("Color palette", "colorpalette")).toBe(true);
  });

  it("returns false for non-matching props", () => {
    expect(matchesCodeProp("Tone", "size")).toBe(false);
  });
});

// ---------------------------------------------------------------------------
// isValidCodeProp
// ---------------------------------------------------------------------------

describe("isValidCodeProp", () => {
  it("accepts props in KNOWN_VALID_PROPS", () => {
    expect(isValidCodeProp("isDisabled", [], {})).toBe(true);
  });

  it("accepts props in typesProps", () => {
    expect(isValidCodeProp("placeholder", ["placeholder"], {})).toBe(true);
  });

  it("accepts props in recipeVariants", () => {
    expect(isValidCodeProp("variant", [], { variant: ["outline"] })).toBe(true);
  });

  it("rejects unknown props", () => {
    expect(isValidCodeProp("unknownProp", [], {})).toBe(false);
  });
});

// ---------------------------------------------------------------------------
// classifyProps
// ---------------------------------------------------------------------------

function makeEntry(
  overrides: Partial<CodeConnectEntry> = {}
): CodeConnectEntry {
  return {
    component: "Button",
    dirName: "button",
    figmaName: "Button",
    figmaUrl: "https://figma.com/test",
    figmaNodeId: "1:1",
    figmaProps: {},
    codeMetadata: {
      exportName: "Button",
      isCompound: false,
      subComponents: [],
      recipeVariants: {},
      typesProps: [],
      files: {
        types: null,
        recipe: null,
        devDocs: null,
        stories: null,
        mainComponent: null,
        figmaOutput: "test.figma.tsx",
      },
    },
    ...overrides,
  };
}

describe("classifyProps", () => {
  describe("VARIANT — state decomposition", () => {
    it("decomposes State variant into individual boolean props", () => {
      const entry = makeEntry({
        figmaProps: {
          State: {
            type: "VARIANT",
            variantOptions: ["Default", "Hover", "Disabled"],
          },
        },
        codeMetadata: {
          ...makeEntry().codeMetadata,
          typesProps: ["isDisabled"],
        },
      });

      const { props } = classifyProps(entry);
      expect(props).toHaveLength(1);
      expect(props[0].codePropName).toBe("isDisabled");
      expect(props[0].code).toContain('figma.enum("State"');
      expect(props[0].code).toContain("Disabled: true");
    });

    it("skips visual state values (Hover, Focus, Pressed)", () => {
      const entry = makeEntry({
        figmaProps: {
          State: {
            type: "VARIANT",
            variantOptions: ["Default", "Hover", "Focus", "Pressed"],
          },
        },
        codeMetadata: {
          ...makeEntry().codeMetadata,
          typesProps: [],
        },
      });

      const { props } = classifyProps(entry);
      expect(props).toHaveLength(0);
    });

    it("generates fixme for unmapped state values", () => {
      const entry = makeEntry({
        figmaProps: {
          State: {
            type: "VARIANT",
            variantOptions: ["Default", "CustomState"],
          },
        },
      });

      const { fixmes } = classifyProps(entry);
      expect(fixmes.some((f) => f.includes("CustomState"))).toBe(true);
      expect(fixmes.some((f) => f.includes("STATE_BOOLEAN_MAP"))).toBe(true);
    });

    it("emits state props that are in KNOWN_VALID_PROPS even without typesProps", () => {
      // All STATE_BOOLEAN_MAP values (isDisabled, isLoading, etc.) are in
      // KNOWN_VALID_PROPS, so they pass validation even with empty typesProps.
      const entry = makeEntry({
        figmaProps: {
          State: {
            type: "VARIANT",
            variantOptions: ["Default", "Loading"],
          },
        },
        codeMetadata: {
          ...makeEntry().codeMetadata,
          typesProps: [],
        },
      });

      const { props } = classifyProps(entry);
      expect(props).toHaveLength(1);
      expect(props[0].codePropName).toBe("isLoading");
    });
  });

  describe("VARIANT — boolean-like (YES/NO)", () => {
    it("maps YES/NO variant to boolean enum", () => {
      const entry = makeEntry({
        figmaProps: {
          "Is clearable": {
            type: "VARIANT",
            variantOptions: ["YES", "NO"],
          },
        },
        codeMetadata: {
          ...makeEntry().codeMetadata,
          recipeVariants: { isClearable: ["true", "false"] },
        },
      });

      const { props } = classifyProps(entry);
      expect(props).toHaveLength(1);
      expect(props[0].codePropName).toBe("isClearable");
      expect(props[0].code).toContain("YES: true");
    });
  });

  describe("VARIANT — recipe matching", () => {
    it("maps variant options to recipe values", () => {
      const entry = makeEntry({
        figmaProps: {
          Size: {
            type: "VARIANT",
            variantOptions: ["sm", "md", "lg"],
          },
        },
        codeMetadata: {
          ...makeEntry().codeMetadata,
          recipeVariants: { size: ["sm", "md", "lg"] },
        },
      });

      const { props } = classifyProps(entry);
      expect(props).toHaveLength(1);
      expect(props[0].codePropName).toBe("size");
      expect(props[0].code).toContain('sm: "sm"');
      expect(props[0].code).toContain('md: "md"');
      expect(props[0].code).toContain('lg: "lg"');
    });

    it("skips variant options that don't match recipe values", () => {
      const entry = makeEntry({
        figmaProps: {
          Size: {
            type: "VARIANT",
            variantOptions: ["sm", "md", "xl"],
          },
        },
        codeMetadata: {
          ...makeEntry().codeMetadata,
          recipeVariants: { size: ["sm", "md"] },
        },
      });

      const { props } = classifyProps(entry);
      expect(props).toHaveLength(1);
      // xl should be omitted since it's not in recipe
      expect(props[0].code).not.toContain("xl");
    });
  });

  describe("INSTANCE_SWAP — position detection", () => {
    it("assigns 'leading' position for prop with 'left' word", () => {
      const entry = makeEntry({
        figmaProps: {
          "Icon left": { type: "INSTANCE_SWAP" },
        },
        codeMetadata: {
          ...makeEntry().codeMetadata,
          typesProps: ["iconLeft"],
        },
      });

      const { props } = classifyProps(entry);
      expect(props).toHaveLength(1);
      expect(props[0].position).toBe("leading");
    });

    it("assigns 'trailing' position for prop with 'right' word", () => {
      const entry = makeEntry({
        figmaProps: {
          "Icon right": { type: "INSTANCE_SWAP" },
        },
        codeMetadata: {
          ...makeEntry().codeMetadata,
          typesProps: ["iconRight"],
        },
      });

      const { props } = classifyProps(entry);
      expect(props).toHaveLength(1);
      expect(props[0].position).toBe("trailing");
    });

    it("does NOT match 'left' as substring (e.g. 'highlight')", () => {
      const entry = makeEntry({
        figmaProps: {
          Highlight: { type: "INSTANCE_SWAP" },
        },
        codeMetadata: {
          ...makeEntry().codeMetadata,
          typesProps: ["highlight"],
        },
      });

      const { props } = classifyProps(entry);
      expect(props).toHaveLength(1);
      expect(props[0].position).toBe("child");
    });
  });

  describe("BOOLEAN", () => {
    it("maps standalone boolean to code prop via alias", () => {
      const entry = makeEntry({
        figmaProps: {
          "is disabled": { type: "BOOLEAN", defaultValue: false },
        },
      });

      const { props } = classifyProps(entry);
      expect(props).toHaveLength(1);
      expect(props[0].codePropName).toBe("isDisabled");
      expect(props[0].code).toBe('figma.boolean("is disabled")');
    });

    it("skips visual-only boolean props without generating a fixme", () => {
      const entry = makeEntry({
        figmaProps: {
          "is focused": { type: "BOOLEAN", defaultValue: false },
        },
      });

      const { props, fixmes } = classifyProps(entry);
      expect(props).toHaveLength(0);
      expect(fixmes).toHaveLength(0);
    });
  });

  describe("TEXT", () => {
    it("maps text prop to children by default", () => {
      const entry = makeEntry({
        figmaProps: {
          Text: { type: "TEXT" },
        },
      });

      const { props } = classifyProps(entry);
      expect(props).toHaveLength(1);
      expect(props[0].codePropName).toBe("children");
      expect(props[0].code).toBe('figma.string("Text")');
      expect(props[0].position).toBe("child");
    });
  });

  describe("skipFigmaProps from overrides", () => {
    it("replaces auto-classified prop with rawProps override", () => {
      // dialog Root override skips "Size" from auto-classification but adds
      // "width" via rawProps — net effect is 1 prop (width), not 0.
      const entry = makeEntry({
        dirName: "dialog",
        subComponent: "Root",
        figmaProps: {
          Size: { type: "VARIANT", variantOptions: ["sm", "md"] },
        },
        codeMetadata: {
          ...makeEntry().codeMetadata,
          recipeVariants: { size: ["sm", "md"] },
        },
      });

      const { props } = classifyProps(entry);
      // Size is skipped, but rawProps adds width
      expect(props.some((p) => p.codePropName === "size")).toBe(false);
      expect(props.some((p) => p.codePropName === "width")).toBe(true);
    });
  });
});

// ---------------------------------------------------------------------------
// generateExampleJsx
// ---------------------------------------------------------------------------

describe("generateExampleJsx", () => {
  it("generates self-closing tag for self-closing components", () => {
    const jsx = generateExampleJsx("Avatar", [], [], false, "avatar");
    expect(jsx).toBe("<Avatar/>");
  });

  it("generates opening/closing tags with children", () => {
    const jsx = generateExampleJsx(
      "Button",
      [
        {
          codePropName: "children",
          code: 'figma.children("*")',
          position: "children",
        },
      ],
      [],
      false,
      "button"
    );
    expect(jsx).toContain("<Button>");
    expect(jsx).toContain("{props.children}");
    expect(jsx).toContain("</Button>");
  });

  it("places leading props before children", () => {
    const jsx = generateExampleJsx(
      "Button",
      [
        {
          codePropName: "iconLeft",
          code: 'figma.instance("Icon left")',
          position: "leading",
        },
        {
          codePropName: "children",
          code: 'figma.children("*")',
          position: "children",
        },
      ],
      [],
      false,
      "button"
    );
    const iconPos = jsx.indexOf("iconLeft");
    const childrenPos = jsx.indexOf("props.children");
    expect(iconPos).toBeLessThan(childrenPos);
  });

  it("places trailing props before figma.children", () => {
    // Ordering is: leading → text → non-text → trailing → figma.children
    const jsx = generateExampleJsx(
      "Button",
      [
        {
          codePropName: "children",
          code: 'figma.children("*")',
          position: "children",
        },
        {
          codePropName: "iconRight",
          code: 'figma.instance("Icon right")',
          position: "trailing",
        },
      ],
      [],
      false,
      "button"
    );
    const iconPos = jsx.indexOf("{props.iconRight}");
    const childrenPos = jsx.indexOf("{props.children}");
    expect(iconPos).toBeLessThan(childrenPos);
  });

  it("adds aria-label when needsAriaLabel is true", () => {
    const jsx = generateExampleJsx("IconButton", [], [], true, "icon-button");
    expect(jsx).toContain('aria-label="Action"');
  });

  it("adds label placeholder when component has props but no text children", () => {
    const jsx = generateExampleJsx(
      "Button",
      [
        {
          codePropName: "size",
          code: 'figma.enum("Size", { md: "md" })',
          position: "attribute",
        },
      ],
      ["children"],
      false,
      "button"
    );
    expect(jsx).toContain("{/* label placeholder */}");
  });
});
