import type { createRequire as createRequireFn } from "node:module";
import { afterAll, beforeAll, describe, expect, it, vi } from "vitest";

type Resolve = ReturnType<typeof createRequireFn>["resolve"];

const { mockResolve } = vi.hoisted(() => ({
  mockResolve: vi.fn<Resolve>(),
}));

vi.mock("node:module", () => ({
  default: { createRequire: () => ({ resolve: mockResolve }) },
  createRequire: () => ({ resolve: mockResolve }),
}));

import { isNimbusResolvable } from "./is-nimbus-resolvable";

describe("isNimbusResolvable", () => {
  describe("when @commercetools/nimbus is resolvable", () => {
    beforeAll(() => {
      mockResolve.mockReturnValue("/fake/path/to/nimbus");
    });

    afterAll(() => {
      mockResolve.mockReset();
    });

    it("returns true", () => {
      expect(isNimbusResolvable()).toBe(true);
    });

    it("calls resolve with the correct package and paths", () => {
      isNimbusResolvable();

      expect(mockResolve).toHaveBeenCalledWith("@commercetools/nimbus", {
        paths: [process.cwd()],
      });
    });

    it("uses a custom cwd when provided", () => {
      isNimbusResolvable("/custom/app/root");

      expect(mockResolve).toHaveBeenCalledWith("@commercetools/nimbus", {
        paths: ["/custom/app/root"],
      });
    });
  });

  describe("when @commercetools/nimbus is not resolvable", () => {
    beforeAll(() => {
      mockResolve.mockImplementation(() => {
        throw new Error("Cannot find module '@commercetools/nimbus'");
      });
    });

    afterAll(() => {
      mockResolve.mockReset();
    });

    it("returns false", () => {
      expect(isNimbusResolvable()).toBe(false);
    });
  });
});
