#!/usr/bin/env bash
set -e

# Install pnpm
npm install -g pnpm

# Install all workspace dependencies including devDependencies
pnpm install --no-frozen-lockfile

# Install rimraf directly in server directory
cd apps/server
npx rimraf dist
cd ../..

# Build only the server
pnpm --filter server build