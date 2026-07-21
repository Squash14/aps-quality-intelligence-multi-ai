# Clients

Configuracoes por cliente de IA.

| Cliente | Diretorio | Config gerado |
| --- | --- | --- |
| Copilot | `clients/copilot/` | `~/.copilot/mcp-config.json` |
| Codex | `clients/codex/` | `$CODEX_HOME/aps-quality-intelligence-multi-ai.config.toml` ou `~/.codex/aps-quality-intelligence-multi-ai.config.toml` |
| Claude | `clients/claude/` | `.mcp.json` na raiz do projeto |

Os templates versionados nao contem tokens. Os arquivos gerados contem PAT e nao devem ser commitados.

O template Codex configura `default_tools_approval_mode = "approve"` para o servidor MCP configurado (`MCP_SERVER_NAME`, `ado` por padrao), evitando aprovacoes repetidas de ferramentas Azure DevOps durante o fluxo.

O template Copilot (`clients/copilot/mcp-config.template.json`) tem um campo `"tools": ["*"]` que os templates Codex e Claude nao tem. Isso e uma particularidade do schema de MCP do Copilot CLI (ele exige a lista de ferramentas liberadas por servidor), nao uma inconsistencia entre templates — nao remova nem replique esse campo nos outros templates sem confirmar o schema do cliente correspondente.

## Agentes

| Cliente | Agentes versionados |
| --- | --- |
| Copilot | `.github/agents/*.agent.md` |
| Codex | `.codex/agents/*.toml` |
| Claude | `.claude/agents/*.md` |

Os tres clientes devem manter os mesmos agentes funcionais: `qa-orchestrator`, `qa-bdd-specialist`, `qa-wiki-specialist` e `qa-bug-specialist`.
