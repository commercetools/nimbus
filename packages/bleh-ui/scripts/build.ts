import dts from "bun-plugin-dts";
import { statSync } from "fs";

function getFileSizeInKB(filePath: string) {
  try {
    const stats = statSync(filePath);
    const sizeInKB = stats.size / 1024;
    return sizeInKB.toFixed(2); // returns size in KB with 2 decimal places
  } catch (error) {
    console.error("Error reading file size:", error);
    return null;
  }
}

const result = await Bun.build({
  entrypoints: ["./src/index.ts"],
  outdir: "./dist",
  plugins: [dts()],
  external: ["react", "react-dom", "@emotion/react"],
});

result.outputs.forEach((output) => {
  const { path } = output;

  console.log(path);
  console.log("=".repeat(path.length));
  console.log("file-size: ", getFileSizeInKB(path) + "kB");
});
