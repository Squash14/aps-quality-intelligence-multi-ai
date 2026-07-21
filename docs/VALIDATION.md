# Checklist de Validacao

Use este checklist para validar o fluxo com um Work Item real antes de compartilhar mudancas com o time.

Nao registre PAT, conteudo sensivel de Work Item, URLs privadas completas ou logs com dados internos em issues, commits ou mensagens publicas.

## Validacao Local

macOS:

```bash
./scripts/check.sh
./scripts/setup-mcp.sh <cliente>
./scripts/validate-setup.sh <cliente>
```

Windows:

```powershell
.\scripts\check.ps1
.\scripts\setup-mcp.ps1 <cliente>
.\scripts\validate-setup.ps1 <cliente>
```

Use `copilot`, `codex` ou `claude` como `<cliente>`. Use `all` somente quando os tres clientes estiverem instalados.

Arquivos esperados:

| Cliente | Arquivo |
| --- | --- |
| Copilot | `~/.copilot/mcp-config.json` |
| Codex | `~/.codex/aps-quality-intelligence-multi-ai.config.toml` |
| Claude | `.mcp.json` |

No Codex, confirme também que o profile gerado contém:

```toml
default_tools_approval_mode = "approve"
```

## Validacao Por Cliente

Gerar o config uma vez nao garante que toda sessao futura carrega o MCP automaticamente — em clientes com profile ou flag de projeto (como o Codex), a ativacao depende de como a sessao e iniciada. Repita a validacao abaixo sempre que abrir uma nova sessao, antes de pedir qualquer agente.

Copilot:

```bash
copilot
```

Dentro do Copilot:

```text
/mcp show ado
```

Codex:

```bash
codex --profile aps-quality-intelligence-multi-ai
codex --profile aps-quality-intelligence-multi-ai mcp list
```

Dentro da sessao Codex, tambem pode confirmar com:

```text
/mcp
```

Esperado: o servidor MCP configurado para este projeto aparece na lista de MCP servers conectados (nome definido em `MCP_SERVER_NAME` no `.env`; `ado` por padrao). Se a sessao mostrar `MCP servers: 0`, feche e reabra com `codex --profile aps-quality-intelligence-multi-ai` — rodar apenas `codex` carrega somente `~/.codex/config.toml`, sem os MCPs do projeto.

Dentro do Codex, valide o agente:

```text
Use o agente qa-orchestrator para <Projeto> <WorkItemID>.
```

Claude:

```bash
claude --mcp-config .mcp.json --agent qa-orchestrator
claude mcp list
```

Dentro do Claude, tambem pode validar:

```text
Use o agente qa-orchestrator para <Projeto> <WorkItemID>.
```

Resultado esperado: o servidor MCP configurado para este projeto aparece configurado/conectado (nome definido em `MCP_SERVER_NAME` no `.env`; `ado` por padrao).

## Validacao Com Work Item Real

Entrada:

```text
<Projeto> <WorkItemID>
```

Checklist:

* Work Item foi encontrado no projeto informado.
* Busca ficou focada no Work Item e relacoes diretas.
* SPEC foi gerada.
* Cenarios BDD foram gerados.
* Riscos QA e gaps foram identificados quando aplicavel.
* Apenas um arquivo foi criado ou atualizado em `output/`.
* Arquivo existente foi reutilizado quando havia `<WorkItemID>*.md`.
* Wiki correta foi localizada.
* Pagina existente foi atualizada ou nova pagina foi criada sem duplicidade.
* URL da pagina foi retornada.
* Apos publicacao bem-sucedida, arquivo local foi movido para `output/delete/`.
* Em caso de falha na publicacao, arquivo local permaneceu em `output/`.

## Validacao Do Agente De Bug

Use quando houver mudanca no `qa-bug-specialist` ou no template de Bug. Evite criar Bugs artificiais; prefira um defeito real de QA.

Entrada recomendada:

```text
Use o agente qa-bug-specialist para criar um bug seguindo docs/BUG_AGENT_TEMPLATE.md.
```

Checklist:

* Projeto foi informado.
* Work Item relacionado foi validado no Azure DevOps.
* Duplicidade foi pesquisada por titulo, erro, funcionalidade, massa de teste e Work Item relacionado.
* Tipo `Bug em produção` foi normalizado quando o usuario escreveu sem acento.
* `Custom.Causadoproblema` foi preenchido com valor aceito, por exemplo `Erros de Codificação` no projeto `Arquitetura`.
* Sprint ativa foi identificada pela data atual quando a iteration nao foi informada.
* `Assigned To` foi resolvido; se a busca direta falhou, o fallback por Work Items recentes foi usado.
* Bug foi criado sem pedir confirmacao quando os dados obrigatorios estavam definidos.
* Parent foi vinculado apos a criacao quando a relacao nao entrou no payload inicial.
* Evidencias foram anexadas quando disponiveis; sem anexo, o Bug registrou `Evidencias: Nao informado`.
* Resultado final trouxe ID, titulo, tipo, parent, area, iteration, causa, responsavel e URL.

## Evidencia Minima

Registre apenas resultado operacional, sem dados sensiveis:

```text
Cliente:
Projeto:
Work Item:
Arquivo local:
Acao Wiki:
URL validada: sim/nao
Arquivo arquivado: sim/nao
Observacoes:
```
