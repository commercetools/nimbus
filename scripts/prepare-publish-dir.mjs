#!/usr/bin/env node
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable no-undef */

import fs from "fs";
import path from "path";
import { execSync } from "child_process";

// --- Configuration ---
// Relative path from repo root to the package source directory
const PACKAGE_SOURCE_DIR = "packages/bleh-ui";
// The name of the directory to create at the repo root for the published package
const PUBLISH_DIR_NAME = "bleh-ui-pkg";
// The name of the build output directory within the package source (usually 'dist')
const BUILD_OUTPUT_DIRNAME = "dist";
// --- End Configuration ---

let hasChanges = false;

// Helper function to run shell commands
const runCommand = (command, cwd, stdio = "inherit") => {
  console.log(`Executing in ${cwd || process.cwd()}: ${command}`);
  try {
    return execSync(command, { stdio: stdio, cwd: cwd || process.cwd() });
  } catch {
    console.error(`Error executing command: ${command}`);
    process.exit(1); // Exit on error
  }
};

// Helper function to get the Git repository root
const getRepoRoot = () => {
  try {
    return execSync("git rev-parse --show-toplevel", {
      encoding: "utf8",
    }).trim();
  } catch {
    console.error(
      "Error: Failed to determine Git repository root. Are you in a Git repository?"
    );
    process.exit(1);
  }
};

// --- Main Script Logic ---
(() => {
  // Using simple IIFE as async/await isn't strictly needed with Sync functions
  const repoRoot = getRepoRoot();
  const sourcePackageDir = path.join(repoRoot, PACKAGE_SOURCE_DIR);
  const sourceBuildDir = path.join(sourcePackageDir, BUILD_OUTPUT_DIRNAME);
  const sourcePackageJsonPath = path.join(sourcePackageDir, "package.json");
  const targetDirPath = path.join(repoRoot, PUBLISH_DIR_NAME); // Target directory at the root

  console.log(`Repository Root: ${repoRoot}`);
  console.log(`Source Package Directory: ${sourcePackageDir}`);
  console.log(`Target Publish Directory: ${targetDirPath}`);

  // --- Build Step ---
  console.log(`Building package in ${PACKAGE_SOURCE_DIR}...`);
  // IMPORTANT: Adjust this command based on your package manager and monorepo setup
  // Example for pnpm using directory path as filter:
  runCommand(`pnpm --filter "./${PACKAGE_SOURCE_DIR}" build`, repoRoot);
  // Example for yarn workspaces using package name (get name from source package.json):
  // const pkgName = JSON.parse(fs.readFileSync(sourcePackageJsonPath, 'utf8')).name;
  // runCommand(`yarn workspace ${pkgName} build`, repoRoot);

  // Verify build output exists *after* build command
  if (
    !fs.existsSync(sourceBuildDir) ||
    !fs.statSync(sourceBuildDir).isDirectory()
  ) {
    console.error(
      `Error: Build output directory ${sourceBuildDir} not found after build. Check build command/output.`
    );
    process.exit(1);
  }
  if (
    !fs.existsSync(sourcePackageJsonPath) ||
    !fs.statSync(sourcePackageJsonPath).isFile()
  ) {
    console.error(
      `Error: Source package.json ${sourcePackageJsonPath} not found.`
    );
    process.exit(1);
  }

  // --- Prepare Target Directory ---
  console.log(`Preparing target directory ${PUBLISH_DIR_NAME}...`);
  try {
    // Remove existing target directory if it exists
    if (fs.existsSync(targetDirPath)) {
      console.log(`Removing existing directory: ${targetDirPath}`);
      fs.rmSync(targetDirPath, { recursive: true, force: true });
    }
    // Create the fresh target directory
    console.log(`Creating directory: ${targetDirPath}`);
    fs.mkdirSync(targetDirPath);
  } catch (error) {
    console.error(`Error preparing target directory ${targetDirPath}:`, error);
    process.exit(1);
  }

  // --- Copy Files ---
  try {
    // Copy the entire build output directory (e.g., 'dist') into the target directory
    const targetBuildDir = path.join(targetDirPath, BUILD_OUTPUT_DIRNAME);
    console.log(`Copying ${sourceBuildDir} to ${targetBuildDir}...`);
    fs.cpSync(sourceBuildDir, targetBuildDir, { recursive: true });

    // Copy the package.json into the target directory
    const targetPackageJsonPath = path.join(targetDirPath, "package.json");
    console.log(
      `Copying ${sourcePackageJsonPath} to ${targetPackageJsonPath}...`
    );
    fs.copyFileSync(sourcePackageJsonPath, targetPackageJsonPath);
    // **NOTE:** We are intentionally NOT modifying paths inside the copied package.json
    // because we copied the entire 'dist' folder, keeping relative paths valid.
  } catch (error) {
    console.error("Error copying files:", error);
    process.exit(1);
  }

  // --- Git Operations ---
  try {
    console.log(`Staging changes in ${PUBLISH_DIR_NAME}...`);
    // Stage only the created/updated publish directory
    runCommand(`git add "${PUBLISH_DIR_NAME}"`, repoRoot);

    console.log("Checking for changes to commit...");

    try {
      // Use diff --cached --quiet which exits with 1 if there are staged changes
      execSync(`git diff --cached --quiet`, { cwd: repoRoot, stdio: "ignore" });
      console.log(`No changes staged in ${PUBLISH_DIR_NAME}. Commit skipped.`);
    } catch (diffError) {
      // Exit code 1 means differences were found (changes are staged)
      if (diffError.status === 1) {
        hasChanges = true;
      } else {
        // Rethrow unexpected errors from git diff
        throw diffError;
      }
    }

    if (hasChanges) {
      console.log("Changes detected, creating commit...");
      const commitMessage = `chore(publish): Update ${PUBLISH_DIR_NAME} package artifact [skip ci]`;
      runCommand(`git commit -m "${commitMessage}"`, repoRoot);
      console.log("Commit created.");
    }
  } catch (error) {
    console.error("Error during Git operations:", error);
    // Note: If git add/commit fails, the directory still exists locally
    process.exit(1);
  }

  // --- Final Instructions ---
  const currentBranch = execSync("git rev-parse --abbrev-ref HEAD", {
    cwd: repoRoot,
    encoding: "utf8",
  }).trim();
  console.log(
    `\nSuccessfully updated/created '${PUBLISH_DIR_NAME}' on branch '${currentBranch}'.`
  );
  if (hasChanges) {
    console.log(`Commit created. To make it available, push this branch:`);
    console.log(`  git push origin ${currentBranch}`);
  } else {
    console.log(
      `No new commit was created as the artifact content hasn't changed.`
    );
    console.log(
      `If you need to share the current state, ensure the branch is pushed:`
    );
    console.log(`  git push origin ${currentBranch}`);
  }
  console.log(
    `\nTo install this package in another project, use the subdirectory syntax:`
  );
  const packageName = JSON.parse(
    fs.readFileSync(path.join(targetDirPath, "package.json"), "utf8")
  ).name;
  const gitRepoUrl = execSync("git remote get-url origin", {
    cwd: repoRoot,
    encoding: "utf8",
  })
    .trim()
    .replace(/^git@github\.com:/, "github:") // Convert SSH to shorthand
    .replace(/^https:\/\/github\.com\//, "github:") // Convert HTTPS to shorthand
    .replace(/\.git$/, ""); // Remove trailing .git
  console.log(
    `  npm install ${gitRepoUrl}#${currentBranch}:${PUBLISH_DIR_NAME}`
  );
  console.log(
    `  # Or using yarn: yarn add ${gitRepoUrl}#${currentBranch}:${PUBLISH_DIR_NAME}`
  );
  console.log(
    `  # Or using pnpm: pnpm add ${gitRepoUrl}#${currentBranch}:${PUBLISH_DIR_NAME}`
  );
  console.log(
    `  (Replace install command/package manager as needed. Assumes package name is '${packageName}')`
  );
})(); // Immediately invoke the function
