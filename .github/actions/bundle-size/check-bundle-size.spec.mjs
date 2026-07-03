import { describe, it, expect } from "vitest";
import { join } from "node:path";
import { execSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const __dirname = fileURLToPath(new URL(".", import.meta.url));
const ROOT = join(__dirname, "../../..");
const CHECK_SCRIPT = join(__dirname, "check-bundle-size.mjs");

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

// These fixtures track the *actual* current built size of each package: the
// "passes within budget" cases below run the real check script against the
// real dist and assert it stays under the +5% relative threshold. When a
// change intentionally grows a bundle (and is signed off via the
// `bundle-size-approved` label on the PR), bump the corresponding baseline
// here to the new measured size. The nimbus baseline was raised when the
// Markdown component bundled react-markdown/remark-gfm/remend (~+14.6%).
const VALID_BASELINE = JSON.stringify({
  "@commercetools/nimbus": { dist: 19619225 },
  "@commercetools/nimbus-icons": { dist: 4889696 },
  "@commercetools/nimbus-tokens": { dist: 417934 },
});

describe("check-bundle-size", () => {
  it("exits 0 when packages are built and baseline is provided", () => {
    const result = run(CHECK_SCRIPT, {
      BUNDLE_SIZE_BASELINE: VALID_BASELINE,
    });
    expect(result.status).toBe(0);
    expect(result.stdout).toContain(
      "All packages within acceptable size limits"
    );
  });

  it("reports all three tracked packages", () => {
    const result = run(CHECK_SCRIPT, {
      BUNDLE_SIZE_BASELINE: VALID_BASELINE,
    });
    expect(result.stdout).toContain("@commercetools/nimbus");
    expect(result.stdout).toContain("@commercetools/nimbus-icons");
    expect(result.stdout).toContain("@commercetools/nimbus-tokens");
  });

  it("reports dist format for each package", () => {
    const result = run(CHECK_SCRIPT, {
      BUNDLE_SIZE_BASELINE: VALID_BASELINE,
    });
    expect(result.stdout).toContain("dist");
  });

  it("displays all sizes in KB", () => {
    const result = run(CHECK_SCRIPT, {
      BUNDLE_SIZE_BASELINE: VALID_BASELINE,
    });
    const sizePattern = /\d+\.\d+ KB/;
    expect(result.stdout).toMatch(sizePattern);
    expect(result.stdout).not.toMatch(/\d+ B/);
    expect(result.stdout).not.toMatch(/\d+\.\d+ MB/);
  });

  it("reports baseline source as comment-chain", () => {
    const result = run(CHECK_SCRIPT, {
      BUNDLE_SIZE_BASELINE: VALID_BASELINE,
    });
    expect(result.stdout).toContain("comment-chain");
  });
});

describe("check-bundle-size failure detection", () => {
  it("exits 1 when baseline sizes are much smaller than actual", () => {
    const tinyBaseline = {
      "@commercetools/nimbus": { dist: 100 },
      "@commercetools/nimbus-icons": { dist: 100 },
      "@commercetools/nimbus-tokens": { dist: 1 },
    };

    const result = run(CHECK_SCRIPT, {
      BUNDLE_SIZE_BASELINE: JSON.stringify(tinyBaseline),
    });
    expect(result.status).toBe(1);
    expect(result.stderr).toContain("FAIL");
    expect(result.stderr).toContain("threshold");
  });
});

describe("BUNDLE_SIZE_BASELINE env var", () => {
  it("uses env var as baseline when set to valid JSON", () => {
    const result = run(CHECK_SCRIPT, {
      BUNDLE_SIZE_BASELINE: VALID_BASELINE,
    });
    expect(result.status).toBe(0);
    expect(result.stdout).toContain("comment-chain");
  });

  it("exits 1 when env var contains malformed JSON", () => {
    const result = run(CHECK_SCRIPT, {
      BUNDLE_SIZE_BASELINE: "not valid json{{{",
    });
    expect(result.status).toBe(1);
    expect(result.stderr).toContain("Failed to parse");
  });
});

describe("BUNDLE_SIZE_APPROVED env var", () => {
  it("reports approved instead of fail when label is present", () => {
    const tinyBaseline = {
      "@commercetools/nimbus": { dist: 100 },
      "@commercetools/nimbus-icons": { dist: 100 },
      "@commercetools/nimbus-tokens": { dist: 100 },
    };

    const result = run(CHECK_SCRIPT, {
      BUNDLE_SIZE_BASELINE: JSON.stringify(tinyBaseline),
      BUNDLE_SIZE_APPROVED: "true",
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
    it("tokens pass under absolute budget even with >5% relative increase", () => {
      const baseline = {
        "@commercetools/nimbus": { dist: 19619225 },
        "@commercetools/nimbus-icons": { dist: 4889696 },
        "@commercetools/nimbus-tokens": { dist: 380000 },
      };

      const result = run(CHECK_SCRIPT, {
        BUNDLE_SIZE_BASELINE: JSON.stringify(baseline),
      });
      expect(result.status).toBe(0);
      expect(result.stdout).toContain(
        "All packages within acceptable size limits"
      );
    });
  });

  describe("absolute policy fails when budget exceeded", () => {
    it("tokens fail with a clear message when nimbus and nimbus-icons also fail", () => {
      const baseline = {
        "@commercetools/nimbus": { dist: 100 },
        "@commercetools/nimbus-icons": { dist: 100 },
        "@commercetools/nimbus-tokens": { dist: 100 },
      };

      const result = run(CHECK_SCRIPT, {
        BUNDLE_SIZE_BASELINE: JSON.stringify(baseline),
      });
      expect(result.status).toBe(1);
      expect(result.stderr).toContain("FAIL");

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

describe("diagnostic errors", () => {
  it("shows diagnostic message when no baseline is available", () => {
    const result = run(CHECK_SCRIPT, {
      BUNDLE_SIZE_BASELINE: "",
      GH_TOKEN: "",
      GITHUB_REPOSITORY: "",
      // Point gh at a nonexistent config so stored credentials aren't used
      GH_CONFIG_DIR: "/tmp/nonexistent-gh-config-dir",
    });
    expect(result.status).toBe(1);
    expect(result.stderr).toContain("No baseline available");
    expect(result.stderr).toContain("comment chain");
  });
});
