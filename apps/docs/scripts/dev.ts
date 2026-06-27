import { spawn } from "child_process";

const clr = "\x1b[33m%s\x1b[0m";
console.log(clr, `###################################################`);
console.log(clr, `############    @NIMBUS DEV-SERVER    ############`);
console.log(clr, `###################################################`);
// Dim subtitle, spaced from the banner, in the same vocabulary as the
// watcher's startup summary. Printed here (parent process) so its placement
// is deterministic rather than racing the child processes' output.
console.log("\x1b[2m%s\x1b[0m", `\n  Vite dev server + MDX route watcher\n`);

const viteProcess = spawn(
  "pnpm",
  ["vite", "--clearScreen", "false", "--logLevel", "warning"],
  {
    stdio: "inherit",
  }
);

const mdxWatcher = spawn("pnpm", ["tsx", "./scripts/watcher.ts"], {
  stdio: "inherit",
});

function cleanup() {
  viteProcess.kill();
  mdxWatcher.kill();
  process.exit();
}

process.on("SIGINT", cleanup);
process.on("SIGTERM", cleanup);

function waitForExit() {
  return new Promise((resolve) => {
    viteProcess.on("exit", resolve);
    mdxWatcher.on("exit", resolve);
  });
}

(async () => {
  try {
    await waitForExit();
  } catch (error) {
    console.error("An error occurred:", error);
  }
})().catch((error) => {
  console.error("Unhandled error:", error);
});
