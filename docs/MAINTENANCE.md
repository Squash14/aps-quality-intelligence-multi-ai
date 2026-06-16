# Guia de Manutencao

Este guia cobre arquitetura, agentes, skills, manutencao, seguranca e publicacao.

## Arquitetura

```text
Usuario
  |
  | Copilot | Codex | Claude
  v
Cliente IA
  |
  | Azure DevOps MCP
  v
Work Item + contexto
  |
  | agentes/instrucoes QA
  v
SPEC + BDD + cobertura QA + Wiki
```

Componentes:

| Area | Responsabilidade |
| --- | --- |
| `clients/copilot/` | Template MCP do Copilot. |
| `clients/codex/` | Template de profile MCP do Codex. |
| `clients/claude/` | Template MCP do Claude Code. |
| `scripts/` | Setup e validacao para macOS e Windows. |
| `.github/agents/` | Agentes do Copilot. |
| `.github/copilot-instructions.md` | Instrucoes do Copilot. |
| `AGENTS.md` | Instrucoes raiz para Codex. |
| `.codex/agents/` | Agentes de projeto do Codex. |
| `CLAUDE.md` | Instrucoes raiz para Claude Code. |
| `.claude/agents/` | Subagentes de projeto do Claude Code. |
| `.agents/skills/` | Skills Caveman/cavecrew usadas pelo projeto. |
| `docs/` | Documentacao de uso, manutencao e validacao. |
| `skills-lock.json` | Controle de versao das skills. |

## Contrato Funcional

A interface publica do fluxo principal permanece:

```text
<Projeto> <WorkItemID>
```

Saida esperada:

* SPEC Markdown;
* cenarios BDD;
* riscos QA e gaps quando aplicavel;
* publicacao ou atualizacao de Wiki quando solicitada pelo fluxo;
* resultado consolidado com arquivo, pagina, acao e URL quando houver publicacao.

## Clientes

| Cliente | Config versionado | Config gerado | Observacao |
| --- | --- | --- | --- |
| Copilot | `clients/copilot/mcp-config.template.json` | `~/.copilot/mcp-config.json` | Continua usando `.github/agents`. |
| Codex | `clients/codex/config.template.toml` | `~/.codex/aps-quality-intelligence-multi-ai.config.toml` | Use com `codex --profile aps-quality-intelligence-multi-ai`; agentes ficam em `.codex/agents`; MCP `ado` usa `default_tools_approval_mode = "approve"`. |
| Claude | `clients/claude/mcp-config.template.json` | `.mcp.json` | Use com `claude --mcp-config .mcp.json`; agentes ficam em `.claude/agents`. |

## Agentes

| Agente | Responsabilidade |
| --- | --- |
| `qa-orchestrator` | Ponto de entrada publico e fluxo ponta a ponta. |
| `qa-bdd-specialist` | SPEC, cenarios BDD, riscos, gaps e cobertura QA. |
| `qa-wiki-specialist` | Destino, auditoria, atualizacao e publicacao na Wiki. |
| `qa-bug-specialist` | Analise de defeitos e criacao de Bug no Azure DevOps. |

Regras de fronteira:

* `qa-orchestrator` coordena e consolida, mas nao duplica regras detalhadas dos especialistas.
* `qa-bdd-specialist` gera conteudo funcional e arquivo local, mas nao publica na Wiki.
* `qa-wiki-specialist` decide destino e publica, mas nao inventa regra funcional.
* `qa-bug-specialist` atua somente quando o pedido envolver defeito.
* Especialistas devem reutilizar contexto recebido e evitar novas chamadas MCP quando os dados ja forem suficientes.

## Manutencao

Antes de alterar agentes:

1. Leia o arquivo do agente afetado.
2. Atualize os tres formatos: `.github/agents`, `.codex/agents` e `.claude/agents`.
3. Preserve o formato publico de entrada.
4. Execute `./scripts/check.sh` para validar paridade de agentes.
5. Valide com um Work Item real antes de compartilhar com o time.

Antes de alterar scripts de setup:

```bash
./scripts/check.sh
```

Para Windows, valide manualmente no PowerShell:

```powershell
.\scripts\setup-mcp.ps1
.\scripts\validate-setup.ps1
```

Para validacao ponta a ponta com Work Item real, use [VALIDATION.md](VALIDATION.md).

Checklist de PR:

* `.env` nao esta commitado.
* `.mcp.json` nao esta commitado.
* configs MCP gerados nao estao commitados.
* README e docs estao alinhados.
* Nomes dos agentes batem com os arquivos em `.github/agents/`.
* Agentes equivalentes existem em `.codex/agents/` e `.claude/agents/`.
* Scripts de setup e validacao continuam alinhados com os docs.
* Um fluxo com Work Item real foi verificado quando houve mudanca de comportamento dos agentes.

## Seguranca

Nunca commite ou compartilhe:

* `.env`
* PAT do Azure DevOps
* `.mcp.json`
* config MCP gerado
* logs com dados sensiveis de Work Items
* `output/`

Se um PAT vazar:

1. Revogue o PAT no Azure DevOps.
2. Gere um novo PAT.
3. Atualize o `.env`.
4. Execute o setup novamente.
5. Revise atividade recente no repositorio e no Azure DevOps.

## Publicacao

Fluxo recomendado:

```bash
git checkout -b feature/short-description
git add .
git commit -m "docs: concise message"
git push -u origin feature/short-description
```

Mantenha mudancas pequenas e revisaveis. Use mensagens de commit em ingles.
