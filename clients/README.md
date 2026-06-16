# Clients

Configuracoes por cliente de IA.

| Cliente | Diretorio | Config gerado |
| --- | --- | --- |
| Copilot | `clients/copilot/` | `~/.copilot/mcp-config.json` |
| Codex | `clients/codex/` | `$CODEX_HOME/aps-quality-intelligence-multi-ai.config.toml` ou `~/.codex/aps-quality-intelligence-multi-ai.config.toml` |
| Claude | `clients/claude/` | `.mcp.json` na raiz do projeto |

Os templates versionados nao contem tokens. Os arquivos gerados contem PAT e nao devem ser commitados.

O template Codex configura `default_tools_approval_mode = "approve"` para o MCP `ado`, evitando aprovacoes repetidas de ferramentas Azure DevOps durante o fluxo.

## Agentes

| Cliente | Agentes versionados |
| --- | --- |
| Copilot | `.github/agents/*.agent.md` |
| Codex | `.codex/agents/*.toml` |
| Claude | `.claude/agents/*.md` |

Os tres clientes devem manter os mesmos agentes funcionais: `qa-orchestrator`, `qa-bdd-specialist`, `qa-wiki-specialist` e `qa-bug-specialist`.
