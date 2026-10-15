import { describe, it, expect } from "vitest";
import { extractSnippet, SNIPPET_LENGTH } from "./snippet.js";

const filler = (n: number) => "lorem ipsum ".repeat(n);

describe("extractSnippet — anchoring", () => {
  it("anchors where the most distinct tokens co-occur, not the earliest token", () => {
    const content =
      "button intro paragraph\n" +
      filler(300) +
      "\nLoading state\nUse isDisabled while the button is loading.\n" +
      filler(50);
    const s = extractSnippet(content, ["button", "loading", "state"]);
    expect(s).toContain("Loading state");
    expect(s).toContain("isDisabled");
  });

  it("anchors on the rarest token when several windows tie on coverage", () => {
    // A long run of the common token precedes the passage that holds all three;
    // anchoring on the rare token keeps the excerpt centred on that passage.
    const content =
      "button ".repeat(100) + "loading state for the button\n" + filler(50);
    const s = extractSnippet(content, ["button", "loading", "state"]);
    expect(s).toContain("loading state");
    expect(s.indexOf("loading")).toBeLessThan(200);
  });

  it("falls back to the earliest token when no window holds more than one", () => {
    const content = "alpha " + filler(200) + " beta";
    const s = extractSnippet(content, ["alpha", "beta"]);
    expect(s.startsWith("alpha")).toBe(true);
  });

  it("returns the document head when no token matches", () => {
    const s = extractSnippet(filler(200), ["zzz"]);
    expect(s.length).toBeLessThanOrEqual(SNIPPET_LENGTH + 1);
    expect(s.endsWith("…")).toBe(true);
  });
});

describe("extractSnippet — boundaries", () => {
  it("starts and ends on line boundaries when a newline is within slack", () => {
    const lines = Array.from(
      { length: 80 },
      (_, i) => `line ${i} some words here`
    );
    lines[40] = "line 40 target word here";
    const content = lines.join("\n");
    const s = extractSnippet(content, ["target"]);
    const body = s.replace(/^…/, "").replace(/…$/, "");
    expect(body.startsWith("line ")).toBe(true);
    expect(body.endsWith("here")).toBe(true);
  });

  it("yields a window of roughly SNIPPET_LENGTH for a deep single match", () => {
    const content = filler(500) + "needle" + filler(500);
    const s = extractSnippet(content, ["needle"]);
    expect(s.length).toBeGreaterThan(SNIPPET_LENGTH * 0.8);
    expect(s.length).toBeLessThan(SNIPPET_LENGTH * 1.3);
  });

  it("collapses indentation runs and excess blank lines", () => {
    const s = extractSnippet(
      "const App = () => (\n    <Box>\n        hi\n    </Box>\n\n\n\n)",
      ["box"]
    );
    expect(s).not.toMatch(/ {2,}/);
    expect(s).not.toMatch(/\n{3,}/);
  });
});
