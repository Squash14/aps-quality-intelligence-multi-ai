#!/usr/bin/env bash

set -euo pipefail

ROOT_DIR="$(cd "$(dirname "$0")/.." && pwd)"

cd "$ROOT_DIR"

bash -n scripts/setup-mcp.sh
bash -n scripts/validate-setup.sh
node --check scripts/render-mcp-config.mjs
node --check scripts/validate-agent-assets.mjs
node --check scripts/render-agents.mjs
node scripts/test-render-mcp-config.mjs
node scripts/validate-agent-assets.mjs
node scripts/render-agents.mjs agents/qa-bug-specialist.md --check
git diff --check

echo "OK - repository checks passed"
