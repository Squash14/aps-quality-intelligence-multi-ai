# Troubleshooting

| Problema | O que fazer |
| --- | --- |
| `MCP nao configurado` | Rode `setup-mcp` para o cliente escolhido. |
| `PAT ainda esta com valor de exemplo` | Edite `.env`, troque `AZURE_DEVOPS_PAT` e rode setup novamente. |
| `npx nao encontrado` | Instale Node.js/npm e abra um novo terminal. |
| Cliente nao encontrado | Instale Copilot CLI, Codex CLI ou Claude Code conforme o alvo escolhido. |
| Servidor MCP do projeto nao aparece na sessao | Rode setup e validate novamente para o mesmo cliente. O nome do servidor e definido em `MCP_SERVER_NAME` no `.env` (`ado` por padrao). |
| Agente nao encontrado | Confirme que esta na raiz do projeto e reinicie o cliente. |
| Bug nao cria por valor fora da lista | Use os labels reais do Azure DevOps, como `Bug em produção` e `Erros de Codificação`. |
| Responsavel nao encontrado por nome | Busque Work Items recentes atribuidos ou criados pela pessoa e use a identidade completa encontrada. |
| Parent nao ficou vinculado na criacao | Crie o Bug e depois use link hierarquico `parent`. |
| Wiki duplicada | Use busca focada por Work Item ID, titulo e nome normalizado antes de criar pagina. |
| Arquivo ficou em `output/` | Isso e esperado quando a publicacao falha; mova para `output/delete/` somente apos publicacao bem-sucedida. |
| Codex mostra `MCP servers: 0` | Voce iniciou `codex` sem `--profile aps-quality-intelligence-multi-ai`. Sem esse profile, o Codex carrega somente `~/.codex/config.toml`, sem os MCPs do projeto. Feche a sessao e inicie com `codex --profile aps-quality-intelligence-multi-ai`. |
| Agente nao encontra Work Item, Wiki ou qualquer dado mesmo com setup correto | Confirme que o MCP Azure DevOps esta carregado na sessao atual (`/mcp` no Codex, `/mcp show <nome do MCP>` no Copilot, `claude mcp list` no Claude) antes de repetir o pedido. O agente e o framework podem estar corretos; a sessao do cliente e que nao carregou o MCP. |

Nunca cole PAT, `.env`, `.mcp.json` ou config MCP gerado em mensagens publicas.
