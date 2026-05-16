import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { execSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const __dirname = fileURLToPath(new URL(".", import.meta.url));
const ROOT = join(__dirname, "..");
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
