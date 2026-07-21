# Scripts

Scripts de setup, validacao e checks locais da QA Agent Suite Multi IA.

## Alvos MCP

Os scripts aceitam:

```text
all | copilot | codex | claude
```

`all` e o padrao, mas exige que Copilot CLI, Codex CLI e Claude Code estejam instalados para a validacao completa. Para uso diario, rode o alvo do cliente escolhido.

## macOS

Setup MCP:

```bash
./scripts/setup-mcp.sh
./scripts/setup-mcp.sh codex
```

Validacao do setup:

```bash
./scripts/validate-setup.sh
./scripts/validate-setup.sh codex
```

Check de manutencao do repositorio:

```bash
./scripts/check.sh
```

O check valida sintaxe dos scripts, renderizacao MCP, presenca dos agentes e conceitos obrigatorios em Copilot, Codex e Claude.

## Windows

Setup MCP:

```powershell
.\scripts\setup-mcp.ps1
.\scripts\setup-mcp.ps1 codex
```

Validacao do setup:

```powershell
.\scripts\validate-setup.ps1
.\scripts\validate-setup.ps1 codex
```

Check de manutencao do repositorio:

```powershell
.\scripts\check.ps1
```

## Arquivos Gerados

| Cliente | Arquivo |
| --- | --- |
| Copilot | `~/.copilot/mcp-config.json` |
| Codex | `$CODEX_HOME/aps-quality-intelligence-multi-ai.config.toml` ou `~/.codex/aps-quality-intelligence-multi-ai.config.toml` |
| Claude | `.mcp.json` na raiz do projeto |

## Render MCP

`render-mcp-config.mjs` recebe:

```text
node scripts/render-mcp-config.mjs <env> <template> <output>
```

Ele:

* le `.env`;
* valida `AZURE_DEVOPS_ORG`, `AZURE_DEVOPS_ORG_URL`, `AZURE_DEVOPS_PAT`, `MCP_SERVER_NAME` e `MCP_PACKAGE`;
* rejeita placeholders;
* renderiza templates JSON ou TOML;
* grava o config MCP local com permissao restrita quando o sistema suporta.

## Teste Do Render

```bash
node scripts/test-render-mcp-config.mjs
```

O teste usa arquivos temporarios e nao le o `.env` real.

## Render De Agentes

`render-agents.mjs` gera os tres arquivos de cliente (`.claude/agents/<nome>.md`, `.codex/agents/<nome>.toml`, `.github/agents/<nome>.agent.md`) a partir de uma fonte canonica unica em `agents/<nome>.md`. Nem todo agente tem fonte canonica hoje — ver `docs/AGENT_PARITY.md` para o estado atual de cada agente.

Regenerar um agente com fonte canonica:

```bash
node scripts/render-agents.mjs agents/<nome>.md
```

Checar se os arquivos gerados ja estao em dia, sem sobrescrever nada:

```bash
node scripts/render-agents.mjs agents/<nome>.md --check
```

Checar todos os agentes com fonte canonica de uma vez (e o que `./scripts/check.sh` roda):

```bash
node scripts/render-agents.mjs --check-all
```

A fonte (`agents/<nome>.md`) usa frontmatter (`name`, `description`) seguido de `## Comportamento Compartilhado` (conteudo comum aos tres clientes) e `## Particularidades Por Cliente`, com sub-secoes `### Codex`, `### Copilot` e `### Claude` para descricao alternativa e conteudo extra especifico de cada cliente. Nunca edite os tres arquivos gerados diretamente: a proxima regeneracao sobrescreve qualquer edicao manual sem aviso.

## Teste Do Render De Agentes

```bash
node scripts/test-render-agents.mjs
```

O teste usa fixtures em memoria e nao le `agents/*.md` reais.
