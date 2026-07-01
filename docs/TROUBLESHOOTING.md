# Troubleshooting

| Problema | O que fazer |
| --- | --- |
| `MCP nao configurado` | Rode `setup-mcp` para o cliente escolhido. |
| `PAT ainda esta com valor de exemplo` | Edite `.env`, troque `AZURE_DEVOPS_PAT` e rode setup novamente. |
| `npx nao encontrado` | Instale Node.js/npm e abra um novo terminal. |
| Cliente nao encontrado | Instale Copilot CLI, Codex CLI ou Claude Code conforme o alvo escolhido. |
| `ado` nao aparece no MCP | Rode setup e validate novamente para o mesmo cliente. |
| Agente nao encontrado | Confirme que esta na raiz do projeto e reinicie o cliente. |
| Bug nao cria por valor fora da lista | Use os labels reais do Azure DevOps, como `Bug em produção` e `Erros de Codificação`. |
| Responsavel nao encontrado por nome | Busque Work Items recentes atribuidos ou criados pela pessoa e use a identidade completa encontrada. |
| Parent nao ficou vinculado na criacao | Crie o Bug e depois use link hierarquico `parent`. |
| Wiki duplicada | Use busca focada por Work Item ID, titulo e nome normalizado antes de criar pagina. |
| Arquivo ficou em `output/` | Isso e esperado quando a publicacao falha; mova para `output/delete/` somente apos publicacao bem-sucedida. |

Nunca cole PAT, `.env`, `.mcp.json` ou config MCP gerado em mensagens publicas.
