#!/usr/bin/env bash
set -e

echo "=== Installing pnpm ==="
npm install -g pnpm

echo "=== pnpm version ==="
pnpm --version

echo "=== Installing dependencies ==="
pnpm install --no-frozen-lockfile

echo "=== Building server ==="
cd apps/server
echo "=== Current directory ==="
pwd
echo "=== Listing files ==="
ls -la
echo "=== Running tsc ==="
npx tsc -p tsconfig.prod.json
echo "=== Running tsc-alias ==="
npx tsc-alias -p tsconfig.prod.json
echo "=== Build complete ==="