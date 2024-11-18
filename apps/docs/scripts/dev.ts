const viteProcess = Bun.spawn(["bunx", "--bun", "vite"], {
  stdout: "inherit",
  stderr: "inherit",
});

const mdxWatcher = Bun.spawn(["bun", "run", "./scripts/mdx-watcher.ts"], {
  stdout: "inherit",
  stderr: "inherit",
});

const propsWatcher = Bun.spawn(["bun", "run", "./scripts/prop-watcher.ts"], {
  stdout: "inherit",
  stderr: "inherit",
});

async function waitForExit() {
  await Promise.race([
    viteProcess.exited,
    mdxWatcher.exited,
    propsWatcher.exited,
  ]);
}

(async () => {
  await waitForExit();
})();
