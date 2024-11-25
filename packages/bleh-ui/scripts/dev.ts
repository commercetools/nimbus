import dts from "bun-plugin-dts";
import { watch } from "fs";

async function build() {
  console.log("Building...");

  await Bun.build({
    entrypoints: ["./src/index.ts"],
    outdir: "./dist",
    plugins: [
      // todo: disabled, as it eats soooooooooooo much time, needs to be faster
      //dts(),
    ],
    external: ["react", "react-dom"],
  });

  console.log("Build complete.");
}

async function watchAndBuild() {
  await build(); // Run the initial build

  // Watch for changes in the "src" directory
  watch("./src", { recursive: true }, (eventType, filename) => {
    if (filename?.endsWith(".mdx") || filename?.endsWith(".md")) {
      return;
    }
    console.log(`File changed: ${filename}`);
    build(); // Rebuild on file change
  });

  console.log("Watching for changes...");
}

await watchAndBuild();
