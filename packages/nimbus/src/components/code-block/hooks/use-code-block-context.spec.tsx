import { describe, it, expect } from "vitest";
import { renderHook } from "@testing-library/react";
import { NimbusProvider } from "@commercetools/nimbus";
import { useCodeBlockContext } from "./use-code-block-context";
import { CodeBlockRoot } from "../components/code-block.root";

describe("useCodeBlockContext", () => {
  it("throws an error that names the part outside CodeBlock.Root", () => {
    expect(() => renderHook(() => useCodeBlockContext("Content"))).toThrow(
      "CodeBlock.Content must be used inside CodeBlock.Root"
    );
  });

  it("returns the Root context inside CodeBlock.Root", () => {
    const { result } = renderHook(() => useCodeBlockContext("Content"), {
      wrapper: ({ children }) => (
        <NimbusProvider>
          <CodeBlockRoot code={"a\nb\n"} language="js">
            {children}
          </CodeBlockRoot>
        </NimbusProvider>
      ),
    });

    expect(result.current.code).toBe("a\nb\n");
    expect(result.current.lines).toHaveLength(2);
  });
});
