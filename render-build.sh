#!/usr/bin/env bash
set -e

echo "=== Node version ==="
node --version

echo "=== Installing server deps directly with npm ==="
cd apps/server

echo "=== Patching package.json ==="
node -e "
const fs = require('fs');
const pkg = JSON.parse(fs.readFileSync('package.json', 'utf8'));
delete pkg.dependencies['@codex/types'];
fs.writeFileSync('package.json', JSON.stringify(pkg, null, 2));
console.log('Patched!');
"

echo "=== npm install ==="
npm install --legacy-peer-deps --include=dev

echo "=== Verify typescript ==="
ls node_modules/.bin/tsc || echo "tsc not found"
ls node_modules/typescript/bin/tsc || echo "typescript bin not found"
npm list typescript || echo "typescript not listed"

echo "=== Install typescript explicitly ==="
npm install typescript tsc-alias --save-dev --legacy-peer-deps

echo "=== Verify again ==="
./node_modules/.bin/tsc --version

echo "=== Copy types ==="
mkdir -p node_modules/@codex/types
cp -r ../../packages/types/. node_modules/@codex/types/

echo "=== Build ==="
./node_modules/.bin/tsc -p tsconfig.prod.json
./node_modules/.bin/tsc-alias -p tsconfig.prod.json

echo "=== Done ==="
ls -la dist/