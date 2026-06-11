import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("./is-nimbus-resolvable", () => ({
  isNimbusResolvable: vi.fn(),
}));

import { isNimbusResolvable } from "./is-nimbus-resolvable";

const mockIsNimbusResolvable = vi.mocked(isNimbusResolvable);

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
  let NimbusOptionalDependencyPlugin: typeof import("./webpack").NimbusOptionalDependencyPlugin;

  beforeEach(async () => {
    vi.resetModules();
    const webpackPluginModule = await import("./webpack");
    NimbusOptionalDependencyPlugin =
      webpackPluginModule.NimbusOptionalDependencyPlugin;
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("is a no-op when Nimbus is resolvable", () => {
    mockIsNimbusResolvable.mockReturnValue(true);

    const { compiler, MockNormalModuleReplacementPlugin } =
      createMockCompiler();

    const plugin = new NimbusOptionalDependencyPlugin();
    plugin.apply(compiler);

    expect(MockNormalModuleReplacementPlugin).not.toHaveBeenCalled();
  });

  it("applies NormalModuleReplacementPlugin when Nimbus is not resolvable", () => {
    mockIsNimbusResolvable.mockReturnValue(false);

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
    mockIsNimbusResolvable.mockReturnValue(false);

    const { compiler, MockNormalModuleReplacementPlugin } =
      createMockCompiler();

    const plugin = new NimbusOptionalDependencyPlugin();
    plugin.apply(compiler);

    const nimbusRuntimeImportRegex = MockNormalModuleReplacementPlugin.mock
      .calls[0][0] as RegExp;

    expect(nimbusRuntimeImportRegex.test("@commercetools/nimbus")).toBe(true);
    expect(
      nimbusRuntimeImportRegex.test("@commercetools/nimbus/components/Button")
    ).toBe(true);
    expect(
      nimbusRuntimeImportRegex.test(
        "@commercetools/nimbus/setup-jsdom-polyfills"
      )
    ).toBe(true);
  });

  it("replacement regex excludes plugin subpaths", () => {
    mockIsNimbusResolvable.mockReturnValue(false);

    const { compiler, MockNormalModuleReplacementPlugin } =
      createMockCompiler();

    const plugin = new NimbusOptionalDependencyPlugin();
    plugin.apply(compiler);

    const nimbusRuntimeImportRegex = MockNormalModuleReplacementPlugin.mock
      .calls[0][0] as RegExp;

    expect(
      nimbusRuntimeImportRegex.test("@commercetools/nimbus/plugins/webpack")
    ).toBe(false);
    expect(
      nimbusRuntimeImportRegex.test("@commercetools/nimbus/plugins/vite")
    ).toBe(false);
    expect(
      nimbusRuntimeImportRegex.test("@commercetools/nimbus/plugins/stub")
    ).toBe(false);
  });

  it("replacement regex does not match other @commercetools packages", () => {
    mockIsNimbusResolvable.mockReturnValue(false);

    const { compiler, MockNormalModuleReplacementPlugin } =
      createMockCompiler();

    const plugin = new NimbusOptionalDependencyPlugin();
    plugin.apply(compiler);

    const nimbusRuntimeImportRegex = MockNormalModuleReplacementPlugin.mock
      .calls[0][0] as RegExp;

    expect(nimbusRuntimeImportRegex.test("@commercetools/nimbus-icons")).toBe(
      false
    );
    expect(nimbusRuntimeImportRegex.test("@commercetools/nimbus-tokens")).toBe(
      false
    );
    expect(nimbusRuntimeImportRegex.test("react")).toBe(false);
  });
});
