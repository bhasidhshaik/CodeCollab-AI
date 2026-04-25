#!/usr/bin/env bash
set -e

echo "=== Node version ==="
node --version

echo "=== Setting up server ==="
cd apps/server

echo "=== Patching package.json ==="
node -e "
const fs = require('fs');
const pkg = JSON.parse(fs.readFileSync('package.json', 'utf8'));
delete pkg.dependencies['@codex/types'];
pkg.devDependencies['@types/simple-peer'] = '^9.11.8';
fs.writeFileSync('package.json', JSON.stringify(pkg, null, 2));
console.log('Patched!');
"

echo "=== npm install (single install) ==="
npm install --legacy-peer-deps --include=dev

echo "=== Copy types ==="
mkdir -p node_modules/@codex/types
cp -r ../../packages/types/. node_modules/@codex/types/

echo "=== tsc version ==="
./node_modules/.bin/tsc --version

echo "=== Build ==="
./node_modules/.bin/tsc -p tsconfig.prod.json
./node_modules/.bin/tsc-alias -p tsconfig.prod.json

echo "=== Done ==="
ls -la dist/