#!/usr/bin/env bash

set -euo pipefail

echo ""
echo "========================================"
echo " QA Agent Suite Multi IA - Validation"
echo "========================================"
echo ""

ROOT_DIR="$(cd "$(dirname "$0")/.." && pwd)"
TARGET="${1:-all}"
PROJECT_PROFILE="${PROJECT_PROFILE:-aps-quality-intelligence-multi-ai}"

validate_common_file() {
  local config_file="$1"
  local setup_target="$2"

  if [ ! -f "$config_file" ]; then
    echo "ERRO: MCP nao configurado em $config_file."
    echo "Execute ./scripts/setup-mcp.sh $setup_target"
    exit 1
  fi

  echo "OK - MCP Config encontrado: $config_file"

  if grep -q "__ORG__\|__ORG_URL__\|__PAT__\|__SERVER_NAME__\|__MCP_PACKAGE__" "$config_file"; then
    echo "ERRO: MCP Config ainda possui placeholders. Execute ./scripts/setup-mcp.sh $setup_target novamente."
    exit 1
  fi

  echo "OK - Placeholders substituidos"

  if grep -q "pathaqui\|SEU_PAT\|SEU_PAT_AQUI" "$config_file"; then
    echo "ERRO: AZURE_DEVOPS_PAT ainda esta com valor de exemplo."
    echo "Abra o .env, troque AZURE_DEVOPS_PAT pelo seu PAT real e execute ./scripts/setup-mcp.sh $setup_target novamente."
    exit 1
  fi

  echo "OK - PAT preenchido"
}

validate_json() {
  local config_file="$1"

  if ! node -e "JSON.parse(require('node:fs').readFileSync(process.argv[1], 'utf8'))" "$config_file" >/dev/null 2>&1; then
    echo "ERRO: MCP Config nao e um JSON valido: $config_file"
    exit 1
  fi

  echo "OK - MCP Config JSON valido"
}

validate_tool() {
  local tool="$1"
  local label="$2"

  if ! command -v "$tool" >/dev/null 2>&1; then
    echo "ERRO: $label nao encontrado."
    exit 1
  fi

  echo "OK - $label encontrado"
}

validate_copilot() {
  local config_file="$HOME/.copilot/mcp-config.json"
  local perms_file="$HOME/.copilot/permissions-config.json"

  validate_common_file "$config_file" "copilot"
  validate_json "$config_file"
  validate_tool copilot "Copilot CLI"

  if [ -f "$perms_file" ] && node -e "const d=JSON.parse(require('node:fs').readFileSync('$perms_file','utf8')); const loc=d.locations&&d.locations['$ROOT_DIR']; process.exit(loc&&loc.tool_approvals&&loc.tool_approvals.length>0?0:1);" 2>/dev/null; then
    echo "OK - Copilot permissions pre-aprovadas para $ROOT_DIR"
  else
    echo "AVISO: permissions-config.json sem pre-aprovacoes para $ROOT_DIR. Execute ./scripts/setup-mcp.sh copilot novamente."
  fi
}

validate_codex() {
  local config_file="${CODEX_HOME:-$HOME/.codex}/$PROJECT_PROFILE.config.toml"

  validate_common_file "$config_file" "codex"

  if ! grep -q "^\[mcp_servers\." "$config_file"; then
    echo "ERRO: Codex MCP Config nao contem bloco [mcp_servers.<nome>]."
    exit 1
  fi

  echo "OK - Codex MCP Config TOML encontrado"

  if ! grep -q '^default_tools_approval_mode = "approve"' "$config_file"; then
    echo "ERRO: Codex MCP Config nao esta configurado para autoaprovar ferramentas do MCP ado."
    echo "Execute ./scripts/setup-mcp.sh codex novamente e abra uma nova sessao Codex."
    exit 1
  fi

  echo "OK - Codex MCP tools autoaprovadas"

  if ! grep -q '^approval_policy = "on-request"' "$config_file"; then
    echo "AVISO: approval_policy nao encontrado no profile Codex. Execute ./scripts/setup-mcp.sh codex."
  else
    echo "OK - Codex approval_policy configurado"
  fi

  if ! grep -q '^sandbox_mode = "workspace-write"' "$config_file"; then
    echo "AVISO: sandbox_mode nao encontrado no profile Codex. Execute ./scripts/setup-mcp.sh codex."
  else
    echo "OK - Codex sandbox_mode configurado"
  fi

  validate_tool codex "Codex CLI"
}

validate_claude() {
  local config_file="$ROOT_DIR/.mcp.json"
  local settings_file="$ROOT_DIR/.claude/settings.json"

  validate_common_file "$config_file" "claude"
  validate_json "$config_file"

  if [ -f "$settings_file" ]; then
    validate_json "$settings_file"
    echo "OK - Claude settings.json encontrado"
  else
    echo "AVISO: .claude/settings.json nao encontrado. Execute ./scripts/setup-mcp.sh claude."
  fi

  validate_tool claude "Claude Code"
}

validate_tool node "Node.js"
validate_tool npx "npx"

case "$TARGET" in
  all)
    validate_copilot
    validate_codex
    validate_claude
    ;;
  copilot)
    validate_copilot
    ;;
  codex)
    validate_codex
    ;;
  claude)
    validate_claude
    ;;
  *)
    echo "ERRO: alvo invalido: $TARGET"
    echo "Use: ./scripts/validate-setup.sh [all|copilot|codex|claude]"
    exit 1
    ;;
esac

echo ""
echo "Validacao concluida."
echo ""
