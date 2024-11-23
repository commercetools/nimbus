import { build as buildDocs } from "./doc-generation/builder";

(async () => {
  await buildDocs();

  const viteBuild = Bun.spawn(["bunx", "--bun", "vite", "build"], {
    stdout: "inherit",
    stderr: "inherit",
  });

  async function buildApp() {
    await Promise.race([viteBuild.exited]);
  }

  await buildApp();
})();
