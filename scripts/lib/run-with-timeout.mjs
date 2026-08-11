#!/usr/bin/env node

/**
 * Runs a command in a child process with a hard wall-clock timeout, so a
 * caller (e.g. a postinstall script) can never hang indefinitely regardless
 * of what the invoked command does internally.
 *
 * This function is intentionally forgiving: it never rejects and never
 * throws. Spawn failures (e.g. ENOENT for a missing binary) are captured
 * into the resolved `error` field instead of propagating, matching the
 * "best effort, non-blocking" contract callers like postinstall scripts
 * need.
 *
 * On POSIX, the child is spawned detached (its own process group) so that
 * on timeout the whole subtree can be killed via `process.kill(-pid, ...)`
 * rather than leaving orphaned grandchildren behind. If the group kill fails
 * (e.g. ESRCH because the group is already gone), it falls back to killing
 * just the immediate child.
 *
 * The returned promise settles at (or very close to) `timeoutMs` on
 * timeout — it does not wait for the child to confirm it has actually
 * exited, since a sufficiently stuck child may never do so.
 *
 * Usage:
 *   import { runWithTimeout } from "../../../scripts/lib/run-with-timeout.mjs";
 *   const { code, timedOut, error } = await runWithTimeout("pnpm", ["build"], {
 *     timeoutMs: 30_000,
 *   });
 */

import { spawn } from "node:child_process";

/**
 * @param {string} command
 * @param {string[]} args
 * @param {{ timeoutMs?: number, cwd?: string, stdio?: import("node:child_process").StdioOptions }} [options]
 * @returns {Promise<{ code: number|null, signal: NodeJS.Signals|null, timedOut: boolean, error: Error|null }>}
 */
export async function runWithTimeout(
  command,
  args = [],
  { timeoutMs = 30_000, cwd, stdio = "inherit" } = {}
) {
  return new Promise((resolve) => {
    let settled = false;
    let timer = null;

    const settle = (result) => {
      if (settled) return;
      settled = true;
      if (timer) clearTimeout(timer);
      resolve(result);
    };

    let child;
    try {
      child = spawn(command, args, {
        cwd,
        stdio,
        detached: process.platform !== "win32",
      });
    } catch (error) {
      settle({ code: null, signal: null, timedOut: false, error });
      return;
    }

    child.once("error", (error) => {
      settle({ code: null, signal: null, timedOut: false, error });
    });

    child.once("exit", (code, signal) => {
      settle({ code, signal, timedOut: false, error: null });
    });

    timer = setTimeout(() => {
      if (settled) return;

      try {
        if (process.platform !== "win32") {
          process.kill(-child.pid, "SIGKILL");
        } else {
          child.kill("SIGKILL");
        }
      } catch {
        try {
          child.kill("SIGKILL");
        } catch {
          // Process may already be gone; nothing more we can do.
        }
      }

      settle({ code: null, signal: null, timedOut: true, error: null });
    }, timeoutMs);
  });
}
