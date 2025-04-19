import { spawn } from "child_process";
import { logger } from "./utils/logger";
import { initializeWatcher } from "./generators/file-watcher";

/**
 * ANSI color codes for terminal output
 */
const COLORS = {
  yellow: "\x1b[33m",
  reset: "\x1b[0m",
};

/**
 * Prints a banner to the console
 */
function printBanner(): void {
  const banner = [
    "###################################################",
    "############    @NIMBUS DEV-SERVER    #############",
    "###################################################",
  ];

  banner.forEach((line) => {
    console.log(`${COLORS.yellow}%s${COLORS.reset}`, line);
  });
}

/**
 * Start the Vite development server
 */
function startViteServer(): ReturnType<typeof spawn> {
  logger.info("Starting Vite development server");

  return spawn(
    "pnpm",
    ["vite", "--clearScreen", "false", "--logLevel", "warning"],
    {
      stdio: "inherit",
    }
  );
}

/**
 * Waits for a process to exit
 */
function waitForExit(process: ReturnType<typeof spawn>): Promise<void> {
  return new Promise((resolve) => {
    process.on("exit", resolve);
  });
}

/**
 * Main development server function
 * Starts both the Vite server and documentation watcher
 */
export async function dev(): Promise<void> {
  try {
    printBanner();
    logger.separator();

    // Start Vite development server
    const viteProcess = startViteServer();

    // Initialize file watcher
    logger.info("Starting documentation file watcher");
    initializeWatcher();

    // Wait for process exit
    await waitForExit(viteProcess);
    logger.info("Vite server process exited");
  } catch (error) {
    logger.error("Development server error:", error);
    process.exit(1);
  }
}

// Execute dev server when run directly
// ES module compatible check for main module
const isMainModule = import.meta.url === `file://${process.argv[1]}`;
if (isMainModule) {
  dev().catch((error) => {
    logger.error("Unhandled error in development server:", error);
    process.exit(1);
  });
}
