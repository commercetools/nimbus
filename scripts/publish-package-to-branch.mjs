#!/usr/bin/env node
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable no-undef */

import fs from "fs";
import path from "path";
import { execSync } from "child_process";

// --- Configuration ---
const PACKAGE_SUBDIR = "packages/bleh-ui"; // The package you want to publish
const TARGET_BRANCH = "publish/bleh-ui"; // The branch this script should run on
const SCRIPTS_DIR_NAME = "scripts"; // Name of the directory containing this script (to avoid deleting it)
// --- End Configuration ---

// Helper function to run shell commands
const runCommand = (command, cwd) => {
  console.log(`Executing: ${command}`);
  try {
    // Execute command, inherit stdio for output/errors, set CWD if provided
    return execSync(command, { stdio: "inherit", cwd: cwd || process.cwd() });
  } catch (error) {
    console.error(`Error executing command: ${command}`);
    process.exit(1); // Exit on error, mimicking set -e
  }
};

// Helper function to get the Git repository root
const getRepoRoot = () => {
  try {
    return execSync("git rev-parse --show-toplevel").toString().trim();
  } catch (error) {
    console.error(
      "Error: Failed to determine Git repository root. Are you in a Git repository?"
    );
    process.exit(1);
  }
};

// --- Main Script Logic ---
(() => {
  const repoRoot = getRepoRoot();
  const scriptPath = path.relative(repoRoot, path.dirname(process.argv[1])); // Get script dir relative to root
  const thisScriptName = path.basename(process.argv[1]);

  console.log(`Repository Root: ${repoRoot}`);
  console.log(`Package Subdirectory: ${PACKAGE_SUBDIR}`);
  console.log(`Target Branch: ${TARGET_BRANCH}`);
  console.log(`Script Directory (relative): ${scriptPath}`);

  // --- Safety Check (Current Branch) ---
  let currentBranch;
  try {
    currentBranch = execSync("git rev-parse --abbrev-ref HEAD", {
      cwd: repoRoot,
    })
      .toString()
      .trim();
  } catch (error) {
    console.error("Error getting current branch.");
    process.exit(1);
  }

  console.log(`Current Branch: ${currentBranch}`);
  if (currentBranch !== TARGET_BRANCH) {
    console.error(
      `Error: You must be on the '${TARGET_BRANCH}' branch to run this script.`
    );
    process.exit(1);
  }

  // --- Build (Optional - Manual Step Recommended Here) ---
  // It's often better to run the build manually before this script
  // console.log("Ensuring package is built...");
  // runCommand(`pnpm --filter "${PACKAGE_SUBDIR}" build`, repoRoot); // Adjust filter syntax if needed

  // --- DANGEROUS: Clean the Branch Root ---
  console.warn("\n!!! WARNING: Cleaning root directory !!!");
  console.log(
    "Listing items to be removed (excluding .git, script directory):"
  );
  const itemsToRemove = [];
  try {
    const rootItems = fs.readdirSync(repoRoot);
    for (const item of rootItems) {
      const itemPath = path.join(repoRoot, item);
      const relativeItemPath = path.relative(repoRoot, itemPath);

      // Define exclusions more explicitly
      const isGitDir = item.startsWith(".git");
      const isScriptDir =
        scriptPath &&
        relativeItemPath.startsWith(scriptPath.split(path.sep)[0]); // Check top-level script dir
      const isPackagesDir = item === "packages"; // exclude packages

      if (!isGitDir && !isScriptDir && !isPackagesDir) {
        console.log(` - ${item}`);
        itemsToRemove.push(itemPath);
      } else {
        console.log(` - Skipping: ${item}`);
      }
    }

    // Optional: Add a confirmation step
    // import readline from 'readline/promises';
    // const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
    // const answer = await rl.question('Proceed with cleaning? (yes/NO) ');
    // rl.close();
    // if (answer.toLowerCase() !== 'yes') {
    //   console.log('Aborting.');
    //   process.exit(0);
    // }

    console.log("Proceeding with cleaning...");
    for (const itemPath of itemsToRemove) {
      if (fs.existsSync(itemPath)) {
        // Double check existence
        fs.rmSync(itemPath, { recursive: true, force: true });
      }
    }
    console.log("Root directory cleaned.");
  } catch (error) {
    console.error("Error during root directory cleaning:", error);
    process.exit(1);
  }

  // --- Define Source Paths ---
  const sourceBuildDir = path.join(repoRoot, PACKAGE_SUBDIR, "dist");
  const sourcePackageJsonPath = path.join(
    repoRoot,
    PACKAGE_SUBDIR,
    "package.json"
  );

  if (
    !fs.existsSync(sourceBuildDir) ||
    !fs.statSync(sourceBuildDir).isDirectory()
  ) {
    console.error(
      `Error: Build directory ${sourceBuildDir} not found or is not a directory. Run the build first.`
    );
    process.exit(1);
  }
  if (
    !fs.existsSync(sourcePackageJsonPath) ||
    !fs.statSync(sourcePackageJsonPath).isFile()
  ) {
    console.error(
      `Error: Package JSON ${sourcePackageJsonPath} not found or is not a file.`
    );
    process.exit(1);
  }

  // --- Copy Build Artifacts ---
  console.log(`Copying artifacts from ${sourceBuildDir} to root...`);
  try {
    const buildFiles = fs.readdirSync(sourceBuildDir);
    for (const file of buildFiles) {
      fs.cpSync(path.join(sourceBuildDir, file), path.join(repoRoot, file), {
        recursive: true,
      });
    }
  } catch (error) {
    console.error("Error copying build artifacts:", error);
    process.exit(1);
  }

  // --- Copy and Modify package.json ---
  console.log("Copying and adjusting package.json...");
  const targetPackageJsonPath = path.join(repoRoot, "package.json");
  try {
    fs.copyFileSync(sourcePackageJsonPath, targetPackageJsonPath);

    // Read the copied package.json
    const packageJsonString = fs.readFileSync(targetPackageJsonPath, "utf8");
    const packageJson = JSON.parse(packageJsonString);

    // Modify paths - adjust logic as needed
    const adjustPath = (p) =>
      p && typeof p === "string" ? p.replace(/^dist\/?/, "") : p;

    packageJson.main = adjustPath(packageJson.main);
    packageJson.module = adjustPath(packageJson.module);
    packageJson.types = adjustPath(packageJson.types);
    packageJson.typings = adjustPath(packageJson.typings); // Handle 'typings' too if used
    // Set files to include everything at the root now
    packageJson.files = ["*"]; // Or be more specific: ["*.js", "*.mjs", "*.d.ts", "assets/"] etc.

    // Write the modified package.json back
    fs.writeFileSync(
      targetPackageJsonPath,
      JSON.stringify(packageJson, null, 2)
    ); // Pretty print JSON
    console.log("package.json paths adjusted.");
  } catch (error) {
    console.error("Error processing package.json:", error);
    process.exit(1);
  }

  // --- Commit Changes ---
  console.log("Staging changes...");
  runCommand("git add .", repoRoot);

  console.log("Checking for changes to commit...");
  let hasChanges = false;
  try {
    // This command errors if there are changes staged for commit
    execSync("git diff-index --quiet --cached HEAD --", {
      cwd: repoRoot,
      stdio: "ignore",
    });
    console.log("No changes detected in build artifacts staged for commit.");
  } catch {
    // Error means non-zero exit code, indicating changes are present
    hasChanges = true;
    console.log("Changes detected, creating commit...");
    runCommand(
      `git commit -m "chore(publish): Update ${PACKAGE_SUBDIR} artifacts on ${TARGET_BRANCH} [skip ci]"`,
      repoRoot
    );
    console.log("Commit created.");
  }

  // --- Final Instructions ---
  console.log(`\nBranch '${TARGET_BRANCH}' is ready.`);
  if (hasChanges) {
    console.log(
      `Run 'git push origin ${TARGET_BRANCH} --force' to publish the changes.`
    );
  } else {
    console.log("No new commit was created as artifacts haven't changed.");
  }
})(); // Immediately invoke the async function
