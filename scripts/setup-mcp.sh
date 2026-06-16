#!/usr/bin/env bash

set -euo pipefail

ROOT_DIR="$(cd "$(dirname "$0")/.." && pwd)"

cd "$ROOT_DIR"

ENV_FILE=".env"
TARGET="${1:-all}"
PROJECT_PROFILE="${PROJECT_PROFILE:-aps-quality-intelligence-multi-ai}"

if [ ! -f "$ENV_FILE" ]; then
  echo ""
  echo "ERRO: arquivo $ENV_FILE nao encontrado."
  echo ""
  echo "Crie o arquivo a partir do modelo:"
  echo "cp .env.example .env"
  echo ""
  echo "Depois preencha AZURE_DEVOPS_ORG, AZURE_DEVOPS_ORG_URL e AZURE_DEVOPS_PAT no $ENV_FILE."
  echo ""
  exit 1
fi

if ! command -v node >/dev/null 2>&1; then
  echo ""
  echo "ERRO: Node.js nao encontrado."
  echo ""
  exit 1
fi

render_client() {
  local client="$1"
  local template="$2"
  local output="$3"

  node scripts/render-mcp-config.mjs "$ENV_FILE" "$template" "$output"
  echo "OK - $client MCP gerado em $output"
}

case "$TARGET" in
  all)
    render_client "Copilot" clients/copilot/mcp-config.template.json "$HOME/.copilot/mcp-config.json"
    render_client "Codex" clients/codex/config.template.toml "${CODEX_HOME:-$HOME/.codex}/$PROJECT_PROFILE.config.toml"
    render_client "Claude" clients/claude/mcp-config.template.json "$ROOT_DIR/.mcp.json"
    ;;
  copilot)
    render_client "Copilot" clients/copilot/mcp-config.template.json "$HOME/.copilot/mcp-config.json"
    ;;
  codex)
    render_client "Codex" clients/codex/config.template.toml "${CODEX_HOME:-$HOME/.codex}/$PROJECT_PROFILE.config.toml"
    ;;
  claude)
    render_client "Claude" clients/claude/mcp-config.template.json "$ROOT_DIR/.mcp.json"
    ;;
  *)
    echo ""
    echo "ERRO: alvo invalido: $TARGET"
    echo "Use: ./scripts/setup-mcp.sh [all|copilot|codex|claude]"
    echo ""
    exit 1
    ;;
esac

echo ""
echo "========================================"
echo "QA Agent Suite Multi IA"
echo "Azure DevOps MCP configurado para: $TARGET"
echo "========================================"
echo ""
echo "Valide com:"
echo "./scripts/validate-setup.sh $TARGET"
echo ""
