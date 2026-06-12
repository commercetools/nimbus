import { afterAll, beforeAll, describe, expect, it, vi } from "vitest";

// vi.hoisted runs before vi.mock, making mockIsNimbusResolvable available
// to the mock factory. This avoids vi.resetModules + dynamic imports.
const { mockIsNimbusResolvable } = vi.hoisted(() => ({
  mockIsNimbusResolvable: vi.fn<() => boolean>(),
}));

vi.mock("./is-nimbus-resolvable", () => ({
  isNimbusResolvable: mockIsNimbusResolvable,
}));

import { NimbusOptionalDependencyPlugin } from "./webpack";

function createMockCompiler() {
  const mockReplacementPluginApply = vi.fn();
  // Regular function is required because NormalModuleReplacementPlugin is
  // instantiated with `new` — arrow functions cannot be constructors.
  const MockNormalModuleReplacementPlugin = vi.fn(function () {
    return { apply: mockReplacementPluginApply };
  });

  return {
    compiler: {
      webpack: {
        NormalModuleReplacementPlugin: MockNormalModuleReplacementPlugin,
      },
    },
    MockNormalModuleReplacementPlugin,
    mockReplacementPluginApply,
  };
}

describe("NimbusOptionalDependencyPlugin (webpack)", () => {
  describe("when Nimbus is resolvable", () => {
    beforeAll(() => {
      mockIsNimbusResolvable.mockReturnValue(true);
    });

    afterAll(() => {
      mockIsNimbusResolvable.mockReset();
    });

    it("is a no-op", () => {
      const { compiler, MockNormalModuleReplacementPlugin } =
        createMockCompiler();

      const plugin = new NimbusOptionalDependencyPlugin();
      plugin.apply(compiler);

      expect(MockNormalModuleReplacementPlugin).not.toHaveBeenCalled();
    });
  });

  describe("when Nimbus is not resolvable", () => {
    beforeAll(() => {
      mockIsNimbusResolvable.mockReturnValue(false);
    });

    afterAll(() => {
      mockIsNimbusResolvable.mockReset();
    });

    it("applies NormalModuleReplacementPlugin", () => {
      const {
        compiler,
        MockNormalModuleReplacementPlugin,
        mockReplacementPluginApply,
      } = createMockCompiler();

      const plugin = new NimbusOptionalDependencyPlugin();
      plugin.apply(compiler);

      expect(MockNormalModuleReplacementPlugin).toHaveBeenCalledWith(
        expect.any(RegExp),
        "@commercetools/nimbus/plugins/stub"
      );
      expect(mockReplacementPluginApply).toHaveBeenCalledWith(compiler);
    });

    it("replacement regex matches @commercetools/nimbus runtime imports", () => {
      const { compiler, MockNormalModuleReplacementPlugin } =
        createMockCompiler();

      const plugin = new NimbusOptionalDependencyPlugin();
      plugin.apply(compiler);

      const regex = MockNormalModuleReplacementPlugin.mock
        .calls[0][0] as RegExp;

      expect(regex.test("@commercetools/nimbus")).toBe(true);
      expect(regex.test("@commercetools/nimbus/components/Button")).toBe(true);
      expect(regex.test("@commercetools/nimbus/setup-jsdom-polyfills")).toBe(
        true
      );
    });

    it("replacement regex matches trailing-slash import", () => {
      const { compiler, MockNormalModuleReplacementPlugin } =
        createMockCompiler();

      const plugin = new NimbusOptionalDependencyPlugin();
      plugin.apply(compiler);

      const regex = MockNormalModuleReplacementPlugin.mock
        .calls[0][0] as RegExp;

      expect(regex.test("@commercetools/nimbus/")).toBe(true);
    });

    it("replacement regex excludes plugin subpaths", () => {
      const { compiler, MockNormalModuleReplacementPlugin } =
        createMockCompiler();

      const plugin = new NimbusOptionalDependencyPlugin();
      plugin.apply(compiler);

      const regex = MockNormalModuleReplacementPlugin.mock
        .calls[0][0] as RegExp;

      expect(regex.test("@commercetools/nimbus/plugins/webpack")).toBe(false);
      expect(regex.test("@commercetools/nimbus/plugins/vite")).toBe(false);
      expect(regex.test("@commercetools/nimbus/plugins/stub")).toBe(false);
    });

    it("replacement regex excludes bare @commercetools/nimbus/plugins path", () => {
      const { compiler, MockNormalModuleReplacementPlugin } =
        createMockCompiler();

      const plugin = new NimbusOptionalDependencyPlugin();
      plugin.apply(compiler);

      const regex = MockNormalModuleReplacementPlugin.mock
        .calls[0][0] as RegExp;

      expect(regex.test("@commercetools/nimbus/plugins")).toBe(false);
    });

    it("replacement regex does not match other @commercetools packages", () => {
      const { compiler, MockNormalModuleReplacementPlugin } =
        createMockCompiler();

      const plugin = new NimbusOptionalDependencyPlugin();
      plugin.apply(compiler);

      const regex = MockNormalModuleReplacementPlugin.mock
        .calls[0][0] as RegExp;

      expect(regex.test("@commercetools/nimbus-icons")).toBe(false);
      expect(regex.test("@commercetools/nimbus-tokens")).toBe(false);
      expect(regex.test("react")).toBe(false);
    });
  });
});
