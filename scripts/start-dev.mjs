/**
 * Dev-server orchestrator: sequential boot of docs + Storybook.
 *
 * `pnpm start` used to run `start:docs & start:storybook`, two process trees
 * sharing one TTY — Storybook's boot output scrambled the docs startup's
 * cursor-controlled progress bar / truecolor header.
 *
 * Instead we boot the docs dev server first (with native-TTY `stdio: "inherit"`
 * so its pretty startup renders with nothing competing) and wait until its
 * watcher signals readiness by writing a marker file (path passed via the
 * NIMBUS_DEV_READY_MARKER env var, written in apps/docs/scripts/watcher.ts on
 * chokidar's `ready` event). Only then do we start Storybook.
 *
 * Children are spawned `detached: true` so each is a process-group leader; that
 * lets us reap the entire tree (pnpm → tsx → vite/watcher/storybook) with a
 * group kill on Ctrl-C, which a plain `child.kill()` would not do.
 */
import { spawn } from "node:child_process";
import { rmSync, existsSync, watch } from "node:fs";
import os from "node:os";
import path from "node:path";

const dim = (s) => `\x1b[2m${s}\x1b[0m`;
const READY_TIMEOUT_MS = 180_000;
const KILL_GRACE_MS = 2_500;

const marker = path.join(os.tmpdir(), `nimbus-dev-ready-${process.pid}.marker`);
rmSync(marker, { force: true });

let docs;
let storybook;
let started = false; // Storybook launched?
let shuttingDown = false;
let pollTimer;
let dirWatcher;
let timeoutTimer;

/** Signal an entire detached child's process group. */
function killGroup(child, signal) {
  if (!child || child.killed) return;
  try {
    process.kill(-child.pid, signal);
  } catch {
    // Already gone / no such group — nothing to do.
  }
}

function clearWaiters() {
  clearInterval(pollTimer);
  clearTimeout(timeoutTimer);
  try {
    dirWatcher?.close();
  } catch {
    // ignore
  }
}

function teardown(code = 0) {
  if (shuttingDown) return;
  shuttingDown = true;
  clearWaiters();
  killGroup(docs, "SIGTERM");
  killGroup(storybook, "SIGTERM");
  setTimeout(() => {
    killGroup(docs, "SIGKILL");
    killGroup(storybook, "SIGKILL");
    rmSync(marker, { force: true });
    process.exit(code);
  }, KILL_GRACE_MS);
}

function startStorybook() {
  if (started || shuttingDown) return;
  started = true;
  clearWaiters();
  // A clean line boundary before Storybook takes over the terminal.
  process.stdout.write(
    "\n" + dim("  Docs ready — starting Storybook…") + "\n\n"
  );
  storybook = spawn("pnpm", ["run", "start:storybook"], {
    stdio: "inherit",
    detached: true,
  });
  storybook.on("exit", (c) => teardown(c ?? 0));
}

// 1. Boot the docs dev server (native TTY → pretty output, nothing competing).
docs = spawn("pnpm", ["run", "start:docs"], {
  stdio: "inherit",
  detached: true,
  env: { ...process.env, NIMBUS_DEV_READY_MARKER: marker },
});
docs.on("exit", (c) => {
  if (!started) {
    process.stderr.write("\n  Docs dev server exited before becoming ready.\n");
  }
  teardown(c ?? 0);
});

// 2. Wait for the readiness marker: fs.watch on the dir + a poll fallback
//    (macOS FSEvents can miss/coalesce, and watching a not-yet-existent file
//    path directly is unreliable).
try {
  dirWatcher = watch(path.dirname(marker), () => {
    if (existsSync(marker)) startStorybook();
  });
} catch {
  // Fall back to polling only.
}
pollTimer = setInterval(() => {
  if (existsSync(marker)) startStorybook();
}, 300);

// 3. Don't let a hung watcher block Storybook forever.
timeoutTimer = setTimeout(() => {
  if (!started) {
    process.stderr.write(
      `\n  Readiness signal not seen in ${READY_TIMEOUT_MS / 1000}s — starting Storybook anyway.\n`
    );
    startStorybook();
  }
}, READY_TIMEOUT_MS);

// 4. Signals + safety-net cleanup.
process.on("SIGINT", () => teardown(0));
process.on("SIGTERM", () => teardown(0));
process.on("exit", () => {
  try {
    rmSync(marker, { force: true });
  } catch {
    // ignore
  }
});
