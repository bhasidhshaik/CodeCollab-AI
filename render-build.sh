#!/usr/bin/env bash
set -e

echo "=== Node version ==="
node --version

echo "=== Installing pnpm ==="
npm install -g pnpm

echo "=== Installing server deps with npm ==="
cd apps/server

echo "=== Removing workspace protocol ==="
node -e "
const fs = require('fs');
const pkg = JSON.parse(fs.readFileSync('package.json', 'utf8'));
delete pkg.dependencies['@codex/types'];
fs.writeFileSync('package.json', JSON.stringify(pkg, null, 2));
console.log('Removed workspace dep');
"

echo "=== Installing including devDependencies ==="
npm install --legacy-peer-deps --include=dev 2>&1

echo "=== Copying types ==="
mkdir -p node_modules/@codex/types
cp -r ../../packages/types/* node_modules/@codex/types/

echo "=== Building ==="
./node_modules/.bin/tsc -p tsconfig.prod.json 2>&1
./node_modules/.bin/tsc-alias -p tsconfig.prod.json 2>&1

echo "=== Done ==="
ls -la dist/