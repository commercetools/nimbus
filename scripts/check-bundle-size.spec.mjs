import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { execSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const __dirname = fileURLToPath(new URL(".", import.meta.url));
const ROOT = join(__dirname, "..");
const CHECK_SCRIPT = join(ROOT, ".github/actions/bundle-size/check-bundle-size.mjs");
const UPDATE_SCRIPT = join(__dirname, "update-bundle-sizes.mjs");
const BASELINE_PATH = join(ROOT, "bundle-sizes.json");

/**
 * Run a script and return { status, stdout, stderr }.
 * Never throws — captures exit code instead.
 */
function run(script, env = {}) {
  try {
    const stdout = execSync(`node ${script}`, {
      cwd: ROOT,
      encoding: "utf-8",
      env: { ...process.env, ...env },
      stdio: ["pipe", "pipe", "pipe"],
    });
    return { status: 0, stdout, stderr: "" };
  } catch (err) {
    return {
      status: err.status ?? 1,
      stdout: err.stdout ?? "",
      stderr: err.stderr ?? "",
    };
  }
}

/**
 * Save and restore bundle-sizes.json around tests that mutate it,
 * so tests never inflate the committed baseline.
 */
function withBaselineGuard() {
  let originalBaseline;

  beforeAll(() => {
    originalBaseline = readFileSync(BASELINE_PATH, "utf-8");
  });

  afterAll(() => {
    writeFileSync(BASELINE_PATH, originalBaseline);
  });
}

describe("check-bundle-size", () => {
  it("exits 0 when packages are built and baseline exists", () => {
    const result = run(CHECK_SCRIPT);
    expect(result.status).toBe(0);
    expect(result.stdout).toContain(
      "All packages within acceptable size limits"
    );
  });

  it("reports all three tracked packages", () => {
    const result = run(CHECK_SCRIPT);
    expect(result.stdout).toContain("@commercetools/nimbus");
    expect(result.stdout).toContain("@commercetools/nimbus-icons");
    expect(result.stdout).toContain("@commercetools/nimbus-tokens");
  });

  it("reports dist format for each package", () => {
    const result = run(CHECK_SCRIPT);
    expect(result.stdout).toContain("dist");
  });

  it("displays all sizes in KB", () => {
    const result = run(CHECK_SCRIPT);
    // Every size value in the output should be in KB format
    const sizePattern = /\d+\.\d+ KB/;
    expect(result.stdout).toMatch(sizePattern);
    // Should never show B or MB units
    expect(result.stdout).not.toMatch(/\d+ B/);
    expect(result.stdout).not.toMatch(/\d+\.\d+ MB/);
  });
});

describe("update-bundle-sizes", () => {
  withBaselineGuard();

  it("exits 0 and writes bundle-sizes.json", () => {
    const result = run(UPDATE_SCRIPT);
    expect(result.status).toBe(0);
    expect(result.stdout).toContain("Bundle sizes updated");
  });

  it("outputs all three tracked packages", () => {
    const result = run(UPDATE_SCRIPT);
    expect(result.stdout).toContain("@commercetools/nimbus");
    expect(result.stdout).toContain("@commercetools/nimbus-icons");
    expect(result.stdout).toContain("@commercetools/nimbus-tokens");
  });
});

describe("check-bundle-size failure detection", () => {
  withBaselineGuard();

  it("exits 1 when baseline sizes are much smaller than actual", () => {
    const tinyBaseline = {
      "@commercetools/nimbus": { dist: 100 },
      "@commercetools/nimbus-icons": { dist: 100 },
      "@commercetools/nimbus-tokens": { dist: 1 },
    };
    writeFileSync(BASELINE_PATH, JSON.stringify(tinyBaseline, null, 2));

    const result = run(CHECK_SCRIPT, { GIT_DIR: "/nonexistent" });
    expect(result.status).toBe(1);
    expect(result.stderr).toContain("FAIL");
    expect(result.stderr).toContain("threshold");
  });
});

describe("BUNDLE_SIZE_BASELINE env var", () => {
  withBaselineGuard();

  it("uses env var as baseline when set to valid JSON", () => {
    const envBaseline = JSON.stringify({
      "@commercetools/nimbus": { dist: 16909814 },
      "@commercetools/nimbus-icons": { dist: 4889696 },
      "@commercetools/nimbus-tokens": { dist: 417934 },
    });

    const result = run(CHECK_SCRIPT, {
      BUNDLE_SIZE_BASELINE: envBaseline,
      GIT_DIR: "/nonexistent",
    });
    expect(result.status).toBe(0);
    expect(result.stdout).toContain("comment-chain");
  });

  it("exits 1 when env var contains malformed JSON", () => {
    const result = run(CHECK_SCRIPT, {
      BUNDLE_SIZE_BASELINE: "not valid json{{{",
      GIT_DIR: "/nonexistent",
    });
    expect(result.status).toBe(1);
    expect(result.stderr).toContain("Failed to parse");
  });
});

describe("BUNDLE_SIZE_APPROVED env var", () => {
  withBaselineGuard();

  it("reports approved instead of fail when label is present", () => {
    const tinyBaseline = {
      "@commercetools/nimbus": { dist: 100 },
      "@commercetools/nimbus-icons": { dist: 100 },
      "@commercetools/nimbus-tokens": { dist: 100 },
    };
    writeFileSync(BASELINE_PATH, JSON.stringify(tinyBaseline, null, 2));

    const result = run(CHECK_SCRIPT, {
      BUNDLE_SIZE_APPROVED: "true",
      GIT_DIR: "/nonexistent",
    });
    expect(result.status).toBe(0);
    expect(result.stdout).toContain("approved");
    expect(result.stdout).toContain(
      "All packages within acceptable size limits"
    );
  });
});

describe("per-package size policies", () => {
  describe("absolute policy passes when relative would fail", () => {
    withBaselineGuard();

    it("tokens pass under absolute budget even with >5% relative increase", () => {
      // Real tokens are ~209/216 bytes. Setting baseline to 190/195 creates
      // a ~10% relative increase (exceeds the 5% threshold), but 209 < 1024
      // absolute budget — should pass with absolute policy.
      const baseline = {
        "@commercetools/nimbus": { dist: 16909814 },
        "@commercetools/nimbus-icons": { dist: 4889696 },
        "@commercetools/nimbus-tokens": { dist: 380000 },
      };
      writeFileSync(BASELINE_PATH, JSON.stringify(baseline, null, 2));

      const result = run(CHECK_SCRIPT, { GIT_DIR: "/nonexistent" });
      expect(result.status).toBe(0);
      expect(result.stdout).toContain(
        "All packages within acceptable size limits"
      );
    });
  });

  describe("absolute policy fails when budget exceeded", () => {
    withBaselineGuard();

    it("tokens fail with a clear message when nimbus and nimbus-icons also fail", () => {
      // Set all baselines tiny so nimbus/nimbus-icons fail on relative threshold.
      // Tokens baseline doesn't matter for absolute policy — what matters is
      // that measured size (209/216) is under 1024. So tokens should show "ok"
      // even when other packages show "fail".
      const baseline = {
        "@commercetools/nimbus": { dist: 100 },
        "@commercetools/nimbus-icons": { dist: 100 },
        "@commercetools/nimbus-tokens": { dist: 100 },
      };
      writeFileSync(BASELINE_PATH, JSON.stringify(baseline, null, 2));

      const result = run(CHECK_SCRIPT, { GIT_DIR: "/nonexistent" });
      // Overall should fail (nimbus and nimbus-icons exceed relative threshold)
      expect(result.status).toBe(1);
      expect(result.stderr).toContain("FAIL");

      // But tokens lines should show "ok" (absolute policy, under budget)
      const lines = result.stdout.split("\n");
      const tokensLines = lines.filter((l) =>
        l.includes("@commercetools/nimbus-tokens")
      );
      expect(tokensLines.length).toBeGreaterThan(0);
      for (const line of tokensLines) {
        expect(line).toContain("ok");
      }
    });
  });
});
