#!/usr/bin/env bash
set -e

echo "=== Installing pnpm ==="
npm install -g pnpm

echo "=== pnpm version ==="
pnpm --version

echo "=== Installing dependencies ==="
pnpm install --no-frozen-lockfile --reporter=verbose 2>&1 || true

echo "=== Trying again with more info ==="
pnpm install --no-frozen-lockfile --ignore-scripts 2>&1 || echo "Install failed"

echo "=== Building server directly ==="
cd apps/server
echo "=== Installing server deps directly ==="
pnpm install --no-frozen-lockfile 2>&1 || echo "Server install failed"

echo "=== Done ==="