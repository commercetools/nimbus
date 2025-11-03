/**
 * Simple logging utilities with colored output
 */

export const flog = (str: string) => {
  console.log("\x1b[32m%s\x1b[0m", `\n  ➜ ${str}\n`);
};

export const errorLog = (str: string) => {
  console.error("\x1b[31m%s\x1b[0m", `\n  ✗ ${str}\n`);
};

export const warnLog = (str: string) => {
  console.warn("\x1b[33m%s\x1b[0m", `\n  ⚠ ${str}\n`);
};

export const successLog = (str: string) => {
  console.log("\x1b[32m%s\x1b[0m", `\n  ✓ ${str}\n`);
};
