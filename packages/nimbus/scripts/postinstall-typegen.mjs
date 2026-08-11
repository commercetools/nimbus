#!/usr/bin/env node

/**
 * Best-effort, time-bounded `chakra typegen` runner for the published
 * package's `postinstall` hook.
 *
 * This regenerates Chakra UI recipe/theme typings against the built theme
 * entry point (`dist/index.es.js`) so consumers get typed component props
 * without a manual step. It must never block or fail a consumer's install:
 *
 *   - If the entry point doesn't exist yet (e.g. a fresh clone before build,
 *     or an environment that intentionally skips it), exit immediately.
 *   - `chakra typegen` is run with a hard timeout via
 *     scripts/lib/run-with-timeout.mjs, so a hang inside the upstream CLI
 *     (observed in some Node/environment combinations) can never wedge the
 *     install. See scripts/lib/run-with-timeout.mjs for the mechanism.
 *   - Any non-success outcome (non-zero exit, timeout, spawn error) is
 *     logged to stderr and swallowed — the process always exits 0.
 *
 * Usage:
 *   node scripts/postinstall-typegen.mjs ./dist/index.es.js
 */

import { existsSync } from "node:fs";
import { runWithTimeout } from "../../../scripts/lib/run-with-timeout.mjs";

const POSTINSTALL_TIMEOUT_MS = 30_000;

const entryPath = process.argv[2];

if (!entryPath || !existsSync(entryPath)) {
  process.exit(0);
}

const { code, timedOut, error } = await runWithTimeout(
  "pnpm",
  ["chakra", "typegen", entryPath],
  { timeoutMs: POSTINSTALL_TIMEOUT_MS }
);

if (timedOut) {
  console.error(
    `[postinstall-typegen] chakra typegen timed out after ${POSTINSTALL_TIMEOUT_MS}ms — skipping type generation`
  );
} else if (error) {
  console.error(
    `[postinstall-typegen] chakra typegen failed to start (${error.message}) — skipping type generation`
  );
} else if (code !== 0) {
  console.error(
    `[postinstall-typegen] chakra typegen exited with code ${code} — skipping type generation`
  );
}

process.exit(0);
