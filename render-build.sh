#!/usr/bin/env bash
set -e

echo "=== Node version ==="
node --version

echo "=== Installing pnpm ==="
npm install -g pnpm

echo "=== Installing all dependencies ==="
pnpm install --no-frozen-lockfile

echo "=== Building server ==="
pnpm --filter server build

echo "=== Done ==="
ls -la apps/server/dist/