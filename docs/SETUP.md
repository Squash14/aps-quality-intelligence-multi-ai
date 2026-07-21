# Setup

Use este guia quando precisar configurar o MCP em uma maquina nova.

## Pre-Requisitos

* Git
* Node.js, npm e `npx`
* Um cliente: Codex CLI, GitHub Copilot CLI ou Claude Code
* Acesso a organizacao Apsen no Azure DevOps
* PAT com:
  * `Work Items: Read & Write`
  * `Wiki: Read & Write`, quando houver publicacao Wiki
  * `Project and Team: Read`

## Criar `.env`

macOS:

```bash
cp .env.example .env
```

Windows:

```powershell
Copy-Item .env.example .env
```

Preencha:

```env
AZURE_DEVOPS_ORG=Apsen
AZURE_DEVOPS_ORG_URL=https://dev.azure.com/Apsen
AZURE_DEVOPS_PAT=SEU_PAT_REAL
```

Nao commite `.env`.

## Gerar MCP

Escolha um alvo:

```text
codex | copilot | claude | all
```

macOS:

```bash
./scripts/setup-mcp.sh codex
./scripts/validate-setup.sh codex
```

Windows:

```powershell
.\scripts\setup-mcp.ps1 codex
.\scripts\validate-setup.ps1 codex
```

Use `all` somente quando os tres clientes estiverem instalados.

## Validar Ativacao Do MCP

Gerar o config nao garante que o cliente carrega o MCP automaticamente. Antes de usar qualquer agente, confirme a ativacao na sessao real. O nome do servidor MCP e definido em `MCP_SERVER_NAME` no `.env` (`ado` por padrao neste projeto); substitua pelo nome configurado se voce alterou esse valor:

| Cliente | Comando de inicializacao | Como confirmar dentro da sessao |
| --- | --- | --- |
| Copilot | `copilot` | `/mcp show <nome do MCP>` |
| Codex | `codex --profile aps-quality-intelligence-multi-ai` | `/mcp` |
| Claude | `claude --mcp-config .mcp.json` | `claude --mcp-config .mcp.json mcp list` |

No Codex, rodar apenas `codex` (sem `--profile`) carrega somente `~/.codex/config.toml` e resulta em `MCP servers: 0`. Isso nao e uma falha do setup nem do framework — e o comportamento padrao do Codex CLI quando nenhum profile e informado. Sempre inicie com `--profile aps-quality-intelligence-multi-ai`.

## Check De Manutencao

macOS:

```bash
./scripts/check.sh
```

Windows:

```powershell
.\scripts\check.ps1
```
