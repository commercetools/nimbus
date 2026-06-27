import { spawn } from "child_process";

// Header width — kept in sync with the watcher's progress-bar line so the
// rounded box and the progress bar share the same right edge (see
// scripts/watcher.ts → renderProgressBar).
const HEADER_WIDTH = 66;

/** Convert HSL (h in degrees, s/l in 0..1) to an [r,g,b] triple. */
function hslToRgb(h: number, s: number, l: number): [number, number, number] {
  const c = (1 - Math.abs(2 * l - 1)) * s;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = l - c / 2;
  const [r, g, b] =
    h < 60
      ? [c, x, 0]
      : h < 120
        ? [x, c, 0]
        : h < 180
          ? [0, c, x]
          : h < 240
            ? [0, x, c]
            : h < 300
              ? [x, 0, c]
              : [c, 0, x];
  return [
    Math.round((r + m) * 255),
    Math.round((g + m) * 255),
    Math.round((b + m) * 255),
  ];
}

/**
 * Colorize a row by column with a bold 24-bit rainbow sweep. Applying the same
 * hue-per-column to every row makes the box read as clean vertical stripes.
 */
function rainbow(row: string): string {
  const chars = [...row];
  return (
    chars
      .map((ch, i) => {
        const [r, g, b] = hslToRgb((i / chars.length) * 320, 1, 0.62);
        return `\x1b[1m\x1b[38;2;${r};${g};${b}m${ch}`;
      })
      .join("") + "\x1b[0m"
  );
}

/** Center `s` within `width` columns. */
function center(s: string, width: number): string {
  const pad = width - [...s].length;
  const left = Math.floor(pad / 2);
  return (
    " ".repeat(Math.max(0, left)) + s + " ".repeat(Math.max(0, pad - left))
  );
}

const inner = HEADER_WIDTH - 2;
const title = "◆  N I M B U S   ·   D E V   S E R V E R";
console.log(rainbow("╭" + "─".repeat(inner) + "╮"));
console.log(rainbow("│" + center(title, inner) + "│"));
console.log(rainbow("╰" + "─".repeat(inner) + "╯"));
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
