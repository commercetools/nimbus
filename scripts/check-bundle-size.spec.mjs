/* global process, URL */
import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { writeFileSync } from "node:fs";
import { join } from "node:path";
import { execSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const __dirname = fileURLToPath(new URL(".", import.meta.url));
const ROOT = join(__dirname, "..");
const CHECK_SCRIPT = join(__dirname, "check-bundle-size.mjs");
const UPDATE_SCRIPT = join(__dirname, "update-bundle-sizes.mjs");

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

  it("reports both esm and cjs formats", () => {
    const result = run(CHECK_SCRIPT);
    expect(result.stdout).toContain("esm");
    expect(result.stdout).toContain("cjs");
  });
});

describe("update-bundle-sizes", () => {
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
  const fixtureBaseline = join(ROOT, "bundle-sizes.json");
  let originalBaseline;

  beforeAll(() => {
    // Save original baseline
    originalBaseline = execSync(`cat ${fixtureBaseline}`, {
      encoding: "utf-8",
    });
  });

  afterAll(() => {
    // Restore original baseline
    writeFileSync(fixtureBaseline, originalBaseline);
  });

  it("exits 1 when baseline sizes are much smaller than actual", () => {
    // Write a baseline with artificially small sizes so the check fails
    const tinyBaseline = {
      "@commercetools/nimbus": { esm: 100, cjs: 100 },
      "@commercetools/nimbus-icons": { esm: 100, cjs: 100 },
      "@commercetools/nimbus-tokens": { esm: 1, cjs: 1 },
    };
    writeFileSync(fixtureBaseline, JSON.stringify(tinyBaseline, null, 2));

    // Point GIT_DIR to a nonexistent path so git show fails and the
    // script falls back to the local (tiny) baseline we just wrote.
    const result = run(CHECK_SCRIPT, { GIT_DIR: "/nonexistent" });
    expect(result.status).toBe(1);
    expect(result.stderr).toContain("FAIL");
    expect(result.stderr).toContain("threshold");
  });
});
