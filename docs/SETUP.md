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

## Check De Manutencao

macOS:

```bash
./scripts/check.sh
```

Windows:

```powershell
.\scripts\check.ps1
```
