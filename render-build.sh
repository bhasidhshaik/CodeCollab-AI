#!/usr/bin/env bash
# Install pnpm
npm install -g pnpm

# Install all workspace dependencies including devDependencies
pnpm install --no-frozen-lockfile

# Install rimraf globally so build script can find it
pnpm add -g rimraf

# Build only the server
pnpm --filter server build