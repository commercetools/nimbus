/* eslint-disable */
const fs = require("fs");

/**
 * ============================================================================
 * CLAUDE CODE SAFETY HOOK
 * ============================================================================
 *
 * PURPOSE:
 * This hook prevents AI assistants from accidentally exposing sensitive data,
 * executing destructive commands, or accessing credential files. It runs on
 * every tool execution and blocks dangerous operations before they happen.
 *
 * HOW IT WORKS:
 * 1. Reads tool execution requests from stdin (JSON format)
 * 2. Checks for credential file access (Read/Write/Edit on sensitive files)
 * 3. Checks for dangerous bash commands (rm -rf /, force push, etc.)
 * 4. Exits with code 2 if blocked, code 0 if allowed
 *
 * CRITICAL PROTECTIONS:
 * - Blocks access to .env files, SSH keys, NPM tokens, shell history
 * - Prevents environment variable exposure (echo $VAR, printenv)
 * - Blocks destructive rm, force push, chmod, and unauthorized package installs
 *
 * WHITELIST BEHAVIOR:
 * - Allows .env.sample and .env.example (non-secret versions)
 * - Allows normal git operations (push, config for current project)
 * - Allows legitimate bash commands not on the dangerous list
 *
 * ============================================================================
 */

/**
 * Main function to process the tool call
 */
async function main() {
  try {
    // Parse the tool execution request from stdin
    // Format: { tool_name: string, tool_input: object }
    const inputData = JSON.parse(fs.readFileSync(0, "utf-8"));
    const toolName = inputData.tool_name;
    const toolInput = inputData.tool_input || {};

    // FIRST CHECK: Prevent access to sensitive credential files
    // Applies to Read, Write, and Edit tools that access the filesystem
    if (isCredentialFileAccess(toolName, toolInput)) {
      console.error("BLOCKED: Access to credential files prohibited");
      process.exit(2);
    }

    // SECOND CHECK: Prevent destructive or dangerous bash commands
    // Protects against rm -rf /, force push, unauthorized installs, etc.
    if (toolName === "Bash") {
      const command = toolInput.command || "";
      if (isDangerousCommand(command)) {
        console.error(`BLOCKED: Dangerous command detected: ${command}`);
        process.exit(2);
      }
    }

    // If all checks passed, allow the operation to proceed
    // Exit code 0 signals to Claude Code that the tool execution is approved
    process.exit(0);
  } catch (err) {
    // Error handling: if parsing or execution fails, default to ALLOW
    // This prevents the hook from blocking legitimate operations if it crashes
    // (fail-open approach to prevent breaking the assistant's workflow)
    console.error("Hook Error:", err.message);
    process.exit(0);
  }
}

/**
 * Prevents reading or editing sensitive credential files
 *
 * This function blocks access to:
 * - Environment files (.env, .env.local, etc.)
 * - SSH keys and configuration
 * - Authentication tokens and credentials
 * - Shell history files (often contain typed passwords)
 * - API keys and cloud provider configs
 * - Database credentials
 *
 * Whitelists non-sensitive versions like .env.sample and .env.example
 */
function isCredentialFileAccess(toolName, toolInput) {
  const fileBasedTools = ["Read", "Write", "Edit"];

  // Check file-based tools (Read, Write, Edit)
  if (fileBasedTools.includes(toolName)) {
    const filePath = (toolInput.file_path || "").toLowerCase();

    // Block .env files but allow .env.sample and .env.example (non-secret versions)
    // Uses negative lookahead (?!...) to exclude sample/example variants
    if (/\.env(?!\.sample|\.example)/.test(filePath)) return true;

    // Define patterns for sensitive files that should never be accessed
    const secretPatterns = [
      // OAuth and API credentials
      /client_secret\.json/,
      /\.credentials\.json/,
      /token\.pickle/,

      // Cryptographic keys
      /\.pem$/, // Private key files
      /\.key$/, // Generic key files

      // Shell history - CRITICAL: often contains passwords typed at command line
      /\.bash_history$/, // Bash command history
      /\.zsh_history$/, // Zsh command history
      /\.history$/, // Generic shell history

      // SSH infrastructure
      /\.ssh\//, // Entire .ssh directory (private keys, config, known_hosts)

      // Package manager credentials
      /\.npmrc$/, // NPM authentication tokens
      /\.npm\//, // NPM cache directory

      // Version control secrets
      /\.git\/config$/, // Git config (may contain credentials)
      /\.git\/objects\//, // Git objects (contains commit history with secrets)

      // Directory-level credential storage
      /\.credentials\//, // Generic credentials directory

      // Broad pattern matching for files containing sensitive keywords
      // Matches: "secret.json", "private_key.txt", "api-key.env", "aws_config", etc.
      /(secret|private[\._-]?key|access[\._-]?token|api[\._-]?key|aws[\._-]?config)/,
    ];

    if (secretPatterns.some((re) => re.test(filePath))) return true;
  }

  // Check bash commands for credential file access patterns
  if (toolName === "Bash") {
    const command = (toolInput.command || "").toLowerCase();
    const dangerousBash = [
      // Viewing .env files directly
      /(cat|vim|nano|less|head|tail|base64)\s+.*\.env/,

      // Sourcing environment variables into the shell
      /source\s+.*\.env/,

      // Using environment variables in HTTP headers via curl
      // Risk: Exposing auth tokens or credentials in network requests
      /curl.*-H.*\$\{.*\}/,

      // Environment variable exposure - printing to console
      // These commands reveal the VALUE of environment variables
      /(echo|printenv|env)\s+\$\w+/, // echo $API_KEY
      /(echo|printenv|env)\s+\$\{.*\}/, // echo ${API_KEY}

      // Viewing shell history (contains previously typed passwords/tokens)
      /(cat|head|tail|less)\s+.*\.bash_history/,
      /(cat|head|tail|less)\s+.*\.zsh_history/,

      // Accessing SSH keys and configuration
      /(cat|head|tail|less|base64)\s+.*\.ssh\//,

      // Accessing NPM authentication files
      /(cat|head|tail|less|base64)\s+.*\.npmrc/,
    ];

    if (dangerousBash.some((re) => re.test(command))) return true;
  }

  return false;
}

/**
 * Prevents destructive bash commands that cause catastrophic damage
 *
 * Blocks patterns that could:
 * - Destroy the entire filesystem (rm -rf /)
 * - Corrupt shared repository history (git push --force)
 * - Expose security vulnerabilities (chmod 777, setuid)
 * - Install unauthorized system software (brew/apt/yum install)
 *
 * These are the commands most likely to damage the system or shared work.
 */
function isDangerousCommand(command) {
  // Normalize command for consistent pattern matching
  // Convert to lowercase, trim whitespace, collapse multiple spaces to single space
  const normalized = command.toLowerCase().trim().replace(/\s+/g, " ");

  // ========== PATTERN CATEGORY: File deletion ==========
  // Blocks recursive delete with force flag on critical paths
  // Matches: rm -rf /, rm -fr /, rm --recursive --force /, etc.
  const rmPatterns = [
    // rm -rf / (root directory - nuclear option)
    /\brm\s+-[rf]*[fr][rf]*\s+\//,
    // rm -rf * (everything in current directory)
    /\brm\s+-[rf]*[fr][rf]*\s+\*/,
    // rm -rf ~ (user home directory)
    /\brm\s+-[rf]*[fr][rf]*\s+~/,
    // rm -rf $HOME (user home via variable)
    /\brm\s+-[rf]*[fr][rf]*\s+\$home/,
  ];

  // ========== PATTERN CATEGORY: Git operations ==========
  // Blocks only the most dangerous operations that rewrite shared history
  // These are particularly risky on main/protected branches as they affect all team members
  // Note: Most git operations are allowed - only history-rewriting commands are blocked
  const gitPatterns = [
    /\bgit\s+push\s+.*--force/, // Force push: overwrites remote history, corrupts main/shared branches
  ];

  // ========== PATTERN CATEGORY: Permission changes ==========
  // Blocks permission changes that create security vulnerabilities
  const chmodPatterns = [
    /chmod\s+777/, // 777: Makes files world-writable (severe security risk)
    /chmod\s+[ugoa]*\+s/, // Setuid/setgid: Can escalate privileges and create backdoors
  ];

  // Combine all destructive patterns and check command against them
  const allPatterns = [...rmPatterns, ...gitPatterns, ...chmodPatterns];

  if (allPatterns.some((re) => re.test(normalized))) return true;

  // ========== PATTERN CATEGORY: Unauthorized package installation ==========
  // Blocks system package manager installations
  // Only allow if explicitly whitelisted/approved by user
  // These could modify system state or install malicious packages
  if (/\b(brew|apt|yum)\s+install\b/.test(normalized)) return true;

  // Command passed all dangerous pattern checks
  return false;
}

main();
