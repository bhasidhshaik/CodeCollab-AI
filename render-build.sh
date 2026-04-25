#!/usr/bin/env bash
# Install pnpm
npm install -g pnpm

# Install all workspace dependencies
pnpm install --no-frozen-lockfile

# Build only the server
pnpm --filter server build