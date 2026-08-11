import { describe, expect, it } from "vitest";
import { runWithTimeout } from "./run-with-timeout.mjs";

describe("runWithTimeout", () => {
  it("resolves promptly with exit code 0 for a fast, successful command", async () => {
    const start = Date.now();
    const result = await runWithTimeout(
      process.execPath,
      ["-e", "process.exit(0)"],
      { timeoutMs: 5000, stdio: "ignore" }
    );
    const elapsed = Date.now() - start;

    expect(result.code).toBe(0);
    expect(result.timedOut).toBe(false);
    expect(result.error).toBeFalsy();
    expect(elapsed).toBeLessThan(5000);
  });

  it("resolves with the non-zero exit code without throwing", async () => {
    const result = await runWithTimeout(
      process.execPath,
      ["-e", "process.exit(7)"],
      { timeoutMs: 5000, stdio: "ignore" }
    );

    expect(result.code).toBe(7);
    expect(result.timedOut).toBe(false);
    expect(result.error).toBeFalsy();
  });

  it("kills a hanging process and resolves near the timeout instead of waiting forever", async () => {
    const timeoutMs = 250;
    const start = Date.now();
    const result = await runWithTimeout(
      process.execPath,
      ["-e", "setInterval(() => {}, 1000)"],
      { timeoutMs, stdio: "ignore" }
    );
    const elapsed = Date.now() - start;

    expect(result.timedOut).toBe(true);
    // Generous upper bound so CI timing jitter doesn't flake this test.
    expect(elapsed).toBeLessThan(timeoutMs * 5);
  });

  it("resolves with a populated error for a nonexistent command instead of throwing", async () => {
    const result = await runWithTimeout(
      "this-binary-does-not-exist-xyz",
      [],
      { timeoutMs: 5000, stdio: "ignore" }
    );

    expect(result.error).toBeTruthy();
    expect(result.timedOut).toBe(false);
  });
});
