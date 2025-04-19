// filepath: /Volumes/Code/nimbus/apps/docs/scripts/utils/logger.ts
/**
 * Standardized logging system for documentation generation
 */

type LogLevel = "debug" | "info" | "warn" | "error" | "success";
type LogFunction = (message: string, ...args: any[]) => void;

// ANSI color codes for terminal output
const COLORS = {
  debug: "\x1b[90m", // Gray
  info: "\x1b[36m", // Cyan
  warn: "\x1b[33m", // Yellow
  error: "\x1b[31m", // Red
  success: "\x1b[32m", // Green
  reset: "\x1b[0m", // Reset
};

// Check if debug mode is enabled via environment variable
const isDebugMode = process.env.DEBUG_DOCS === "true";

// Create a logger function with the appropriate log level
const createLogFunction = (level: LogLevel): LogFunction => {
  return (message: string, ...args: any[]) => {
    // Skip debug logs unless debug mode is enabled
    if (level === "debug" && !isDebugMode) return;

    const color = COLORS[level];
    const prefix = `[DOCS:${level.toUpperCase()}]`;

    // Format message with ANSI colors
    const formattedMessage = `${color}${prefix} ${message}${COLORS.reset}`;

    // Use the appropriate console method based on log level
    switch (level) {
      case "error":
        console.error(formattedMessage, ...args);
        break;
      case "warn":
        console.warn(formattedMessage, ...args);
        break;
      case "debug":
        console.debug(formattedMessage, ...args);
        break;
      default:
        console.log(formattedMessage, ...args);
    }
  };
};

// Create the logger object with methods for each log level
export const logger = {
  debug: createLogFunction("debug"),
  info: createLogFunction("info"),
  warn: createLogFunction("warn"),
  error: createLogFunction("error"),
  success: createLogFunction("success"),
};

// Add a separator function for visual separation in logs
logger.separator = () => {
  console.log("\x1b[2m%s\x1b[0m", "".padStart(50, "-"));
};

// Format for build step completion
logger.buildStep = (step: string) => {
  logger.success(`✓ ${step}`);
};

// Legacy support for flog
export const flog = (str: string) => {
  logger.success(str);
};
