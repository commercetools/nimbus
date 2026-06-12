import { afterAll, beforeAll, describe, expect, it, vi } from "vitest";

// vi.hoisted runs before vi.mock, making mockIsNimbusResolvable available
// to the mock factory. This avoids vi.resetModules + dynamic imports.
const { mockIsNimbusResolvable } = vi.hoisted(() => ({
  mockIsNimbusResolvable: vi.fn<() => boolean>(),
}));

vi.mock("./is-nimbus-resolvable", () => ({
  isNimbusResolvable: mockIsNimbusResolvable,
}));

import { nimbusOptionalDependency } from "./vite";

describe("nimbusOptionalDependency (vite)", () => {
  describe("when Nimbus is resolvable", () => {
    beforeAll(() => {
      mockIsNimbusResolvable.mockReturnValue(true);
    });

    afterAll(() => {
      mockIsNimbusResolvable.mockReset();
    });

    it("returns a no-op plugin", () => {
      const plugin = nimbusOptionalDependency();

      expect(plugin.name).toBe("nimbus-optional-dependency");
      expect(plugin).not.toHaveProperty("enforce");
      expect(plugin).not.toHaveProperty("resolveId");
      expect(plugin).not.toHaveProperty("load");
    });
  });

  describe("when Nimbus is not resolvable", () => {
    beforeAll(() => {
      mockIsNimbusResolvable.mockReturnValue(false);
    });

    afterAll(() => {
      mockIsNimbusResolvable.mockReset();
    });

    it("returns a plugin with resolveId and load hooks", () => {
      const plugin = nimbusOptionalDependency();

      expect(plugin.name).toBe("nimbus-optional-dependency");
      expect(plugin.enforce).toBe("pre");
      expect(plugin).toHaveProperty("resolveId");
      expect(plugin).toHaveProperty("load");
    });

    describe("resolveId", () => {
      const resolveId = () => {
        const plugin = nimbusOptionalDependency();
        return plugin.resolveId as (source: string) => string | undefined;
      };

      it("returns stub ID for @commercetools/nimbus bare import", () => {
        expect(resolveId()("@commercetools/nimbus")).toBe("\0nimbus-stub.cjs");
      });

      it("returns stub ID for @commercetools/nimbus subpath imports", () => {
        const resolve = resolveId();
        expect(resolve("@commercetools/nimbus/components/Button")).toBe(
          "\0nimbus-stub.cjs"
        );
        expect(resolve("@commercetools/nimbus/setup-jsdom-polyfills")).toBe(
          "\0nimbus-stub.cjs"
        );
      });

      it("returns stub ID for trailing-slash import", () => {
        expect(resolveId()("@commercetools/nimbus/")).toBe("\0nimbus-stub.cjs");
      });

      it("returns undefined for plugin subpath imports", () => {
        const resolve = resolveId();
        expect(
          resolve("@commercetools/nimbus/plugins/webpack")
        ).toBeUndefined();
        expect(resolve("@commercetools/nimbus/plugins/vite")).toBeUndefined();
        expect(resolve("@commercetools/nimbus/plugins/stub")).toBeUndefined();
      });

      it("returns undefined for bare @commercetools/nimbus/plugins path", () => {
        expect(resolveId()("@commercetools/nimbus/plugins")).toBeUndefined();
      });

      it("returns undefined for unrelated modules", () => {
        const resolve = resolveId();
        expect(resolve("@commercetools/nimbus-icons")).toBeUndefined();
        expect(resolve("@commercetools/nimbus-tokens")).toBeUndefined();
        expect(resolve("react")).toBeUndefined();
      });
    });

    describe("load", () => {
      const getLoad = () => {
        const plugin = nimbusOptionalDependency();
        return plugin.load as (id: string) => string | undefined;
      };

      it("returns stub content for the stub ID", () => {
        expect(getLoad()("\0nimbus-stub.cjs")).toBe("module.exports = {};");
      });

      it("returns undefined for non-stub IDs", () => {
        const load = getLoad();
        expect(load("some-other-module")).toBeUndefined();
        expect(load("@commercetools/nimbus")).toBeUndefined();
      });
    });
  });
});
