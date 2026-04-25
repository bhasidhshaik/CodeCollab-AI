#!/usr/bin/env bash
set -e

echo "=== Installing pnpm ==="
npm install -g pnpm

echo "=== Installing dependencies ==="
pnpm install --no-frozen-lockfile

echo "=== Building server ==="
pnpm --filter server build

echo "=== Done ==="
ls apps/server/dist/