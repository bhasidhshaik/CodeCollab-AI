#!/usr/bin/env bash
set -e

echo "=== Installing pnpm ==="
npm install -g pnpm

echo "=== Installing dependencies ==="
pnpm install --no-frozen-lockfile --ignore-scripts

echo "=== Installing server deps with scripts ==="
cd apps/server
pnpm install --no-frozen-lockfile
cd ../..

echo "=== Installing types package ==="
cd packages/types
pnpm install --no-frozen-lockfile
cd ../..

echo "=== Building types ==="
cd packages/types
npx tsc 2>/dev/null || true
cd ../..

echo "=== Building server ==="
cd apps/server
npx tsc -p tsconfig.prod.json
npx tsc-alias -p tsconfig.prod.json
echo "=== Server built successfully ==="
ls -la dist/