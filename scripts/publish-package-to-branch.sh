#!/bin/bash

# --- Configuration ---
PACKAGE_SUBDIR="packages/bleh-ui" # The package you want to publish
TARGET_BRANCH="publish/bleh-ui"  # The branch to publish to
# --- End Configuration ---

set -e # Exit immediately if a command exits with a non-zero status.

echo "Publishing ${PACKAGE_SUBDIR} to branch ${TARGET_BRANCH}..."

# --- Safety Check ---
current_branch=$(git rev-parse --abbrev-ref HEAD)
if [ "$current_branch" != "$TARGET_BRANCH" ]; then
  echo "Error: You must be on the '${TARGET_BRANCH}' branch to run this script."
  echo "Current branch is '${current_branch}'."
  exit 1
fi

# --- Build (Optional - Ensure it's built) ---
# echo "Ensuring package is built..."
# pnpm --filter "${PACKAGE_SUBDIR}" build # Adjust filter syntax if needed

# --- Clean the Branch Root ---
echo "Cleaning branch root directory..."
# List files/dirs to remove (be careful!) - Adapt this list as needed!
# This tries to remove everything except .git, the script's dir, and the script itself
find . -maxdepth 1 -not -path './.git*' -not -path '.' -not -path './scripts*' | xargs rm -rf

# --- Copy Build Artifacts ---
PACKAGE_BUILD_DIR="${PACKAGE_SUBDIR}/dist" # Adjust if your build output is elsewhere
PACKAGE_JSON_PATH="${PACKAGE_SUBDIR}/package.json"

if [ ! -d "$PACKAGE_BUILD_DIR" ]; then
  echo "Error: Build directory ${PACKAGE_BUILD_DIR} not found. Run the build first."
  exit 1
fi
if [ ! -f "$PACKAGE_JSON_PATH" ]; then
  echo "Error: Package JSON ${PACKAGE_JSON_PATH} not found."
  exit 1
fi

echo "Copying artifacts from ${PACKAGE_BUILD_DIR} to root..."
# Use dot to copy contents, not the dir itself
cp -R "${PACKAGE_BUILD_DIR}/." .

echo "Copying package.json and adjusting paths..."
# Copy the package.json
cp "${PACKAGE_JSON_PATH}" .

# Modify paths in the copied package.json (adjust based on actual paths/build output)
# This example assumes build output was like 'dist/index.js' -> 'index.js'
# Install 'jq' (brew install jq / apt-get install jq) or use sed/awk
if command -v jq &> /dev/null; then
  jq \
    '.main = (.main | sub("dist/"; ""))? | .module = (.module | sub("dist/"; ""))? | .types = (.types | sub("dist/"; ""))? | .files = ["*"]' \
    package.json > temp_package.json && mv temp_package.json package.json
  echo "package.json paths adjusted using jq."
else
   echo "Warning: 'jq' not found. Manually verify/adjust paths in the root package.json (main, module, types, files)."
fi

# Copy other necessary files (LICENSE, README etc.) if needed
# cp "${PACKAGE_SUBDIR}/README.md" .
# cp LICENSE . # If LICENSE is at the monorepo root

# --- Commit Changes ---
echo "Committing updated package artifacts..."
git add .
# Check if there are changes to commit
if git diff-index --quiet HEAD --; then
    echo "No changes detected in build artifacts."
else
    git commit -m "chore(publish): Update ${PACKAGE_SUBDIR} artifacts on ${TARGET_BRANCH}"
    echo "Commit created."
fi

echo "Branch '${TARGET_BRANCH}' is ready."
echo "Run 'git push origin ${TARGET_BRANCH} --force' to publish."