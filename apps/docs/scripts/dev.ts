const clr = "\x1b[33m%s\x1b[0m";
console.log(clr, `###################################################`);
console.log(clr, `############    @BLEH-UI DEV-SERVER    ############`);
console.log(clr, `###################################################`);

const viteProcess = Bun.spawn(
  ["bunx", "--bun", "vite", "--clearScreen", "false"],
  {
    stdout: "inherit",
    stderr: "inherit",
  }
);

const mdxWatcher = Bun.spawn(
  ["bun", "run", "./scripts/doc-generation/watcher.tsx"],
  {
    stdout: "inherit",
    stderr: "inherit",
  }
);

async function waitForExit() {
  await Promise.race([viteProcess.exited, mdxWatcher.exited]);
}

(async () => {
  await waitForExit();
})();
