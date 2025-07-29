#!/usr/bin/env bash

set -e

# Running "changeset version" to know the new release version
pnpm changeset version &>/dev/null

# Use the main nimbus package as the reference for version
release_version=$(node -e "console.log(require('./packages/nimbus/package.json').version)")

git reset --hard &>/dev/null

echo "$release_version" 