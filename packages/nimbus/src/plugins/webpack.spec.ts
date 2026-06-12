import type { isNimbusResolvable } from "./is-nimbus-resolvable";
import { afterAll, beforeAll, describe, expect, it, vi } from "vitest";

const { mockIsNimbusResolvable } = vi.hoisted(() => ({
  mockIsNimbusResolvable: vi.fn<typeof isNimbusResolvable>(),
}));

vi.mock("./is-nimbus-resolvable", () => ({
  isNimbusResolvable: mockIsNimbusResolvable,
}));

import { UNSAFE_NimbusOptionalDependencyPlugin } from "./webpack";

// Mirrors the constructor type in webpack.ts `apply(compiler:)` param.
type NMRPConstructor = new (
  regex: RegExp,
  replacement: string
) => { apply: (compiler: unknown) => void };

function createMockCompiler() {
  const mockReplacementPluginApply = vi.fn();
  const MockNormalModuleReplacementPlugin = vi.fn<NMRPConstructor>(function () {
    return { apply: mockReplacementPluginApply };
  } as unknown as NMRPConstructor);

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

describe("UNSAFE_NimbusOptionalDependencyPlugin (webpack)", () => {
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

      const plugin = new UNSAFE_NimbusOptionalDependencyPlugin();
      plugin.apply(compiler);

      expect(MockNormalModuleReplacementPlugin).not.toHaveBeenCalled();
    });

    it("is a no-op with custom cwd", () => {
      const { compiler, MockNormalModuleReplacementPlugin } =
        createMockCompiler();

      const plugin = new UNSAFE_NimbusOptionalDependencyPlugin({
        cwd: "/custom/path",
      });
      plugin.apply(compiler);

      expect(MockNormalModuleReplacementPlugin).not.toHaveBeenCalled();
    });

    it("activates stubbing when UNSAFE_forceStub is true", () => {
      const {
        compiler,
        MockNormalModuleReplacementPlugin,
        mockReplacementPluginApply,
      } = createMockCompiler();

      const plugin = new UNSAFE_NimbusOptionalDependencyPlugin({
        UNSAFE_forceStub: true,
      });
      plugin.apply(compiler);

      expect(MockNormalModuleReplacementPlugin).toHaveBeenCalledWith(
        expect.any(RegExp),
        "@commercetools/nimbus/plugins/stub"
      );
      expect(mockReplacementPluginApply).toHaveBeenCalledWith(compiler);
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

      const plugin = new UNSAFE_NimbusOptionalDependencyPlugin();
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

      const plugin = new UNSAFE_NimbusOptionalDependencyPlugin();
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

      const plugin = new UNSAFE_NimbusOptionalDependencyPlugin();
      plugin.apply(compiler);

      const regex = MockNormalModuleReplacementPlugin.mock
        .calls[0][0] as RegExp;

      expect(regex.test("@commercetools/nimbus/")).toBe(true);
    });

    it("replacement regex excludes plugin subpaths", () => {
      const { compiler, MockNormalModuleReplacementPlugin } =
        createMockCompiler();

      const plugin = new UNSAFE_NimbusOptionalDependencyPlugin();
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

      const plugin = new UNSAFE_NimbusOptionalDependencyPlugin();
      plugin.apply(compiler);

      const regex = MockNormalModuleReplacementPlugin.mock
        .calls[0][0] as RegExp;

      expect(regex.test("@commercetools/nimbus/plugins")).toBe(false);
    });

    it("replacement regex does not match other @commercetools packages", () => {
      const { compiler, MockNormalModuleReplacementPlugin } =
        createMockCompiler();

      const plugin = new UNSAFE_NimbusOptionalDependencyPlugin();
      plugin.apply(compiler);

      const regex = MockNormalModuleReplacementPlugin.mock
        .calls[0][0] as RegExp;

      expect(regex.test("@commercetools/nimbus-icons")).toBe(false);
      expect(regex.test("@commercetools/nimbus-tokens")).toBe(false);
      expect(regex.test("react")).toBe(false);
    });

    it("throws a clear error when compiler.webpack is missing (webpack 4)", () => {
      const plugin = new UNSAFE_NimbusOptionalDependencyPlugin();

      expect(() => plugin.apply({} as never)).toThrow(
        "UNSAFE_NimbusOptionalDependencyPlugin requires webpack 5+"
      );
    });
  });
});
