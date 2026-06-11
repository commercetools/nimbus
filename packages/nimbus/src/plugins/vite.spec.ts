import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("./is-nimbus-resolvable", () => ({
  isNimbusResolvable: vi.fn(),
}));

import { isNimbusResolvable } from "./is-nimbus-resolvable";

const mockIsNimbusResolvable = vi.mocked(isNimbusResolvable);

describe("nimbusOptionalDependency (vite)", () => {
  let nimbusOptionalDependency: typeof import("./vite").nimbusOptionalDependency;

  beforeEach(async () => {
    vi.resetModules();
    const vitePluginModule = await import("./vite");
    nimbusOptionalDependency = vitePluginModule.nimbusOptionalDependency;
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("returns a no-op plugin when Nimbus is resolvable", () => {
    mockIsNimbusResolvable.mockReturnValue(true);

    const optionalDependencyPlugin = nimbusOptionalDependency();

    expect(optionalDependencyPlugin.name).toBe("nimbus-optional-dependency");
    expect(optionalDependencyPlugin).not.toHaveProperty("resolveId");
    expect(optionalDependencyPlugin).not.toHaveProperty("load");
  });

  it("returns a plugin with resolveId and load hooks when Nimbus is not resolvable", () => {
    mockIsNimbusResolvable.mockReturnValue(false);

    const optionalDependencyPlugin = nimbusOptionalDependency();

    expect(optionalDependencyPlugin.name).toBe("nimbus-optional-dependency");
    expect(optionalDependencyPlugin).toHaveProperty("resolveId");
    expect(optionalDependencyPlugin).toHaveProperty("load");
  });

  describe("resolveId", () => {
    it("returns stub ID for @commercetools/nimbus bare import", () => {
      mockIsNimbusResolvable.mockReturnValue(false);

      const optionalDependencyPlugin = nimbusOptionalDependency();
      const resolveId = optionalDependencyPlugin.resolveId as (
        source: string
      ) => string | undefined;

      expect(resolveId("@commercetools/nimbus")).toBe("\0nimbus-stub");
    });

    it("returns stub ID for @commercetools/nimbus subpath imports", () => {
      mockIsNimbusResolvable.mockReturnValue(false);

      const optionalDependencyPlugin = nimbusOptionalDependency();
      const resolveId = optionalDependencyPlugin.resolveId as (
        source: string
      ) => string | undefined;

      expect(resolveId("@commercetools/nimbus/components/Button")).toBe(
        "\0nimbus-stub"
      );
      expect(resolveId("@commercetools/nimbus/setup-jsdom-polyfills")).toBe(
        "\0nimbus-stub"
      );
    });

    it("returns undefined for plugin subpath imports", () => {
      mockIsNimbusResolvable.mockReturnValue(false);

      const optionalDependencyPlugin = nimbusOptionalDependency();
      const resolveId = optionalDependencyPlugin.resolveId as (
        source: string
      ) => string | undefined;

      expect(
        resolveId("@commercetools/nimbus/plugins/webpack")
      ).toBeUndefined();
      expect(resolveId("@commercetools/nimbus/plugins/vite")).toBeUndefined();
      expect(resolveId("@commercetools/nimbus/plugins/stub")).toBeUndefined();
    });

    it("returns undefined for unrelated modules", () => {
      mockIsNimbusResolvable.mockReturnValue(false);

      const optionalDependencyPlugin = nimbusOptionalDependency();
      const resolveId = optionalDependencyPlugin.resolveId as (
        source: string
      ) => string | undefined;

      expect(resolveId("@commercetools/nimbus-icons")).toBeUndefined();
      expect(resolveId("@commercetools/nimbus-tokens")).toBeUndefined();
      expect(resolveId("react")).toBeUndefined();
    });
  });

  describe("load", () => {
    it("returns stub content for the stub ID", () => {
      mockIsNimbusResolvable.mockReturnValue(false);

      const optionalDependencyPlugin = nimbusOptionalDependency();
      const load = optionalDependencyPlugin.load as (
        id: string
      ) => string | undefined;

      const stubContent = load("\0nimbus-stub");
      expect(stubContent).toBe("export default {};");
    });

    it("returns undefined for non-stub IDs", () => {
      mockIsNimbusResolvable.mockReturnValue(false);

      const optionalDependencyPlugin = nimbusOptionalDependency();
      const load = optionalDependencyPlugin.load as (
        id: string
      ) => string | undefined;

      expect(load("some-other-module")).toBeUndefined();
      expect(load("@commercetools/nimbus")).toBeUndefined();
    });
  });
});
